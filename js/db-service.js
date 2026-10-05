// Database Service for PHARMAQUEST
// Handles all user-isolated database queries via Supabase with Row Level Security (RLS)

import { getSupabase } from "./supabase-client.js";

export const dbService = {
  // --- 1. QUESTION ATTEMPTS (User Isolated) ---
  async recordQuestionAttempt(userId, questionId, selectedOption, isCorrect, timeSpent = 0) {
    if (!userId) return null;
    const supabase = await getSupabase();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('question_attempts')
          .insert({
            user_id: userId,
            question_id: questionId,
            selected_option: selectedOption,
            is_correct: isCorrect,
            time_spent_seconds: timeSpent
          })
          .select()
          .single();

        if (error) throw error;
        await this.updateUserStreak(userId);
        return data;
      } catch (err) {
        console.error("Error recording question attempt in Supabase:", err);
      }
    }

    // Isolated per-user storage fallback
    const key = `pq_user_${userId}_attempts`;
    const attempts = JSON.parse(localStorage.getItem(key) || "[]");
    const newAttempt = {
      id: "att-" + Date.now(),
      user_id: userId,
      question_id: questionId,
      selected_option: selectedOption,
      is_correct: isCorrect,
      time_spent_seconds: timeSpent,
      attempted_at: new Date().toISOString()
    };
    attempts.push(newAttempt);
    localStorage.setItem(key, JSON.stringify(attempts));
    await this.updateUserStreak(userId);
    return newAttempt;
  },

  async getUserAttempts(userId) {
    if (!userId) return [];
    const supabase = await getSupabase();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('question_attempts')
          .select('*')
          .eq('user_id', userId)
          .order('attempted_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error("Error fetching attempts from Supabase:", err);
      }
    }

    const key = `pq_user_${userId}_attempts`;
    return JSON.parse(localStorage.getItem(key) || "[]");
  },

  // --- 2. BOOKMARKS (User Isolated) ---
  async toggleBookmark(userId, questionId) {
    if (!userId) return false;
    const supabase = await getSupabase();

    if (supabase) {
      try {
        // Check if bookmark exists
        const { data: existing } = await supabase
          .from('bookmarks')
          .select('id')
          .eq('user_id', userId)
          .eq('question_id', questionId)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('bookmarks')
            .delete()
            .eq('id', existing.id);
          return false; // removed
        } else {
          await supabase
            .from('bookmarks')
            .insert({ user_id: userId, question_id: questionId });
          return true; // added
        }
      } catch (err) {
        console.error("Error toggling bookmark in Supabase:", err);
      }
    }

    // Isolated per-user storage fallback
    const key = `pq_user_${userId}_bookmarks`;
    let bookmarks = JSON.parse(localStorage.getItem(key) || "[]");
    const idx = bookmarks.indexOf(questionId);
    let added = false;
    if (idx >= 0) {
      bookmarks.splice(idx, 1);
      added = false;
    } else {
      bookmarks.push(questionId);
      added = true;
    }
    localStorage.setItem(key, JSON.stringify(bookmarks));
    return added;
  },

  async getUserBookmarks(userId) {
    if (!userId) return [];
    const supabase = await getSupabase();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('bookmarks')
          .select('question_id')
          .eq('user_id', userId);

        if (error) throw error;
        return (data || []).map(b => b.question_id);
      } catch (err) {
        console.error("Error fetching bookmarks from Supabase:", err);
      }
    }

    const key = `pq_user_${userId}_bookmarks`;
    return JSON.parse(localStorage.getItem(key) || "[]");
  },

  // --- 3. MOCK TEST ATTEMPTS (User Isolated) ---
  async saveMockTestAttempt(userId, attemptData) {
    if (!userId) return null;
    const supabase = await getSupabase();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('mock_test_attempts')
          .insert({
            user_id: userId,
            mock_test_id: attemptData.mockTestId || null,
            score_percentage: attemptData.scorePct,
            total_questions: attemptData.total,
            correct_count: attemptData.correct,
            wrong_count: attemptData.wrong,
            skipped_count: attemptData.skipped,
            duration_seconds: attemptData.durationSec,
            answers_json: attemptData.answers || {}
          })
          .select()
          .single();

        if (error) throw error;
        await this.updateUserStreak(userId);
        return data;
      } catch (err) {
        console.error("Error saving mock test attempt in Supabase:", err);
      }
    }

    const key = `pq_user_${userId}_mock_attempts`;
    const mockAttempts = JSON.parse(localStorage.getItem(key) || "[]");
    const record = {
      id: "mock-" + Date.now(),
      user_id: userId,
      ...attemptData,
      created_at: new Date().toISOString()
    };
    mockAttempts.unshift(record);
    localStorage.setItem(key, JSON.stringify(mockAttempts));
    await this.updateUserStreak(userId);
    return record;
  },

  async getUserMockAttempts(userId) {
    if (!userId) return [];
    const supabase = await getSupabase();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('mock_test_attempts')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error("Error fetching mock attempts from Supabase:", err);
      }
    }

    const key = `pq_user_${userId}_mock_attempts`;
    return JSON.parse(localStorage.getItem(key) || "[]");
  },

  // --- 4. STREAKS & GAMIFICATION (User Isolated) ---
  async getUserStreak(userId) {
    if (!userId) return { current_streak: 1, best_streak: 1 };
    const supabase = await getSupabase();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('streaks')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (data) return data;
      } catch (err) {
        console.error("Error fetching streak from Supabase:", err);
      }
    }

    const key = `pq_user_${userId}_streak`;
    return JSON.parse(localStorage.getItem(key) || JSON.stringify({ current_streak: 1, best_streak: 1 }));
  },

  async updateUserStreak(userId) {
    if (!userId) return;
    const today = new Date().toISOString().split('T')[0];
    const supabase = await getSupabase();

    if (supabase) {
      try {
        const { data: streak } = await supabase
          .from('streaks')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (streak) {
          if (streak.last_activity_date !== today) {
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            const isConsecutive = streak.last_activity_date === yesterday;
            const newCurrent = isConsecutive ? streak.current_streak + 1 : 1;
            const newBest = Math.max(newCurrent, streak.best_streak);

            await supabase
              .from('streaks')
              .update({
                current_streak: newCurrent,
                best_streak: newBest,
                last_activity_date: today,
                updated_at: new Date().toISOString()
              })
              .eq('user_id', userId);
          }
        }
      } catch (e) {
        console.warn("Could not update live streak", e);
      }
    } else {
      const key = `pq_user_${userId}_streak`;
      const streak = JSON.parse(localStorage.getItem(key) || JSON.stringify({ current_streak: 1, best_streak: 1, last_activity_date: '' }));
      if (streak.last_activity_date !== today) {
        streak.current_streak = (streak.current_streak || 0) + 1;
        streak.best_streak = Math.max(streak.current_streak, streak.best_streak || 1);
        streak.last_activity_date = today;
        localStorage.setItem(key, JSON.stringify(streak));
      }
    }
  },

  // --- 5. CURRICULUM DATA LOADERS (Live Supabase with fallback) ---
  async getSubjects() {
    const supabase = await getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('subjects')
          .select('*')
          .order('theory_code');

        if (error) throw error;
        if (data && data.length > 0) {
          return data.map(s => ({
            id: s.id,
            theoryCode: s.theory_code,
            practicalCode: s.practical_code,
            title: s.title,
            accent: s.accent_color,
            theoryHours: s.total_theory_hours,
            tutorialHours: s.total_tutorial_hours,
            practicalHours: s.total_practical_hours,
            scope: s.scope
          }));
        }
      } catch (err) {
        console.error("Error loading subjects from Supabase:", err);
      }
    }
    return null;
  },

  async getChapters(subjectId = null) {
    const supabase = await getSupabase();
    if (supabase) {
      try {
        let query = supabase.from('chapters').select('*').order('chapter_number');
        if (subjectId) {
          query = query.eq('subject_id', subjectId);
        }
        const { data, error } = await query;
        if (error) throw error;
        if (data && data.length > 0) {
          return data.map(c => ({
            id: c.id,
            subjectId: c.subject_id,
            chapterNumber: c.chapter_number,
            title: c.title,
            hours: c.hours,
            topics: c.topics || []
          }));
        }
      } catch (err) {
        console.error("Error loading chapters from Supabase:", err);
      }
    }
    return null;
  },

  async getQuestions(subjectId = null) {
    const supabase = await getSupabase();
    if (supabase) {
      try {
        let query = supabase
          .from('questions')
          .select('*, question_options(*), question_answers(*)')
          .order('id');
        
        if (subjectId) {
          query = query.eq('subject_id', subjectId);
        }

        const { data, error } = await query;
        if (error) throw error;
        if (data && data.length > 0) {
          return data.map(q => {
            const opts = (q.question_options || []).sort((a, b) => a.option_index - b.option_index);
            const ansObj = Array.isArray(q.question_answers) ? q.question_answers[0] : q.question_answers;
            const correctIdx = ansObj ? ansObj.correct_option_index : 0;
            return {
              id: q.id,
              subjectId: q.subject_id,
              chapterId: q.chapter_id,
              courseCode: q.code_label?.split(' ')[0] || 'ER20-11T',
              codeLabel: q.code_label,
              chapterNumber: q.chapter_number,
              chapterTitle: q.chapter_title,
              question: q.question_text,
              type: q.question_type,
              year: q.year,
              marks: q.marks,
              difficulty: q.difficulty,
              radarTag: q.radar_tag,
              frequency: q.frequency,
              options: opts.map(o => o.option_text),
              correctAnswer: correctIdx,
              modelAnswer: ansObj?.model_answer || '',
              explanation: {
                mechanism: q.explanation_mechanism || '',
                keyPoint: q.explanation_key_point || '',
                syllabusRef: q.explanation_syllabus_ref || ''
              }
            };
          });
        }
      } catch (err) {
        console.error("Error loading questions from Supabase:", err);
      }
    }
    return null;
  },

  async getMockTests() {
    const supabase = await getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('mock_tests')
          .select('*, mock_test_questions(*, questions(*, question_options(*), question_answers(*)))')
          .order('id');

        if (error) throw error;
        if (data && data.length > 0) {
          return data.map(m => {
            const sortedQuestions = (m.mock_test_questions || [])
              .sort((a, b) => a.sort_order - b.sort_order)
              .map(mq => {
                const q = mq.questions;
                if (!q) return null;
                const opts = (q.question_options || []).sort((a, b) => a.option_index - b.option_index);
                const ansObj = Array.isArray(q.question_answers) ? q.question_answers[0] : q.question_answers;
                return {
                  id: q.id,
                  subjectId: q.subject_id,
                  chapterId: q.chapter_id,
                  courseCode: q.code_label?.split(' ')[0] || 'ER20-11T',
                  codeLabel: q.code_label,
                  chapterNumber: q.chapter_number,
                  chapterTitle: q.chapter_title,
                  question: q.question_text,
                  type: q.question_type,
                  year: q.year,
                  marks: q.marks,
                  difficulty: q.difficulty,
                  radarTag: q.radar_tag,
                  frequency: q.frequency,
                  options: opts.map(o => o.option_text),
                  correctAnswer: ansObj ? ansObj.correct_option_index : 0,
                  modelAnswer: ansObj?.model_answer || '',
                  explanation: {
                    mechanism: q.explanation_mechanism || '',
                    keyPoint: q.explanation_key_point || '',
                    syllabusRef: q.explanation_syllabus_ref || ''
                  }
                };
              })
              .filter(Boolean);

            return {
              id: m.id,
              title: m.title,
              subjectId: m.subject_id,
              durationSeconds: m.duration_seconds,
              totalQuestions: m.total_questions,
              description: m.description,
              questions: sortedQuestions
            };
          });
        }
      } catch (err) {
        console.error("Error loading mock tests from Supabase:", err);
      }
    }
    return null;
  }
};
