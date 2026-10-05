// Central Reactive State Store for PHARMAQUEST
// Fully integrated with Supabase Auth, real user-isolated attempts, bookmarks, and mock test history

import { auth } from "./auth.js";
import { dbService } from "./db-service.js";
import { SYLLABUS_PART_I } from "./syllabus-data.js";
import { QUESTIONS_BANK } from "./questions-data.js";

const DEFAULT_STATE = {
  currentView: "landing",
  activeSubjectId: "pharmaceutics",
  currentUser: null,
  currentProfile: null,
  subjects: SYLLABUS_PART_I.courses,
  chapters: [],
  questions: QUESTIONS_BANK,
  mockTests: [],
  isSupabaseData: false,
  streak: 1,
  overallProgress: 0,
  totalQuestionsSolved: 0,
  userAccuracy: 0,
  subjectMastery: {
    pharmaceutics: 0,
    chemistry: 0,
    pharmacognosy: 0,
    hap: 0,
    social: 0
  },
  dailyDose: {
    mcqsCompleted: 0,
    mcqsTarget: 10,
    pyqsCompleted: 0,
    pyqsTarget: 5,
    vviCompleted: 0,
    vviTarget: 3,
    vivaCompleted: 0,
    vivaTarget: 1,
    isDoseComplete: false
  },
  bookmarks: [],
  userAttempts: [],
  mockAttempts: [],
  weakTopics: [],
  activeExam: null,
  examResults: null,
  activeVivaIndex: 0,
  aiHistory: [
    {
      sender: "ai",
      timestamp: "Just now",
      structuredContent: {
        title: "D.Pharm Study Assistant Ready",
        simpleExplanation: "Welcome to your Digital Pharmacy Lab! I can explain complex drug mechanisms, guide your ER-2020 syllabus revision, generate practice scenarios, and help you prepare for PCI practical viva voce.",
        examAnswer: "Ask questions related to any of your 5 subjects (ER20-11T through ER20-15T).",
        keyPoints: [
          "Powered exclusively by Groq LPU inference via server-side API (GROQ_API_KEY).",
          "Ultra-fast D.Pharm study assistance with qwen/qwen3.8-27b.",
          "All answers stay grounded in the official Indian Pharmacopoeia standards."
        ],
        viva: "Examiner Tip: Always mention the official pharmacopoeia edition (IP 2022) when discussing drug standards.",
        practice: "Solve questions in the PYQ Explorer to build your daily exam streak!"
      }
    }
  ]
};

class PharmaState {
  constructor() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.subscribers = [];
    this.init();
  }

  async init() {
    // Listen to authentication changes
    auth.onAuthStateChange(async (user, profile) => {
      this.state.currentUser = user;
      this.state.currentProfile = profile;
      if (user) {
        await this.syncUserData(user.id);
      } else {
        // Reset to initial guest state
        this.state = {
          ...this.state,
          currentUser: null,
          currentProfile: null,
          streak: 1,
          overallProgress: 0,
          totalQuestionsSolved: 0,
          userAccuracy: 0,
          bookmarks: [],
          userAttempts: [],
          mockAttempts: [],
          weakTopics: []
        };
      }
      this.notify();
    });

    await auth.init();
    await this.loadCurriculumData();
  }

  // Synchronize official PCI ER-2020 curriculum data from Supabase
  async loadCurriculumData() {
    try {
      const [subjects, chapters, questions, mockTests] = await Promise.all([
        dbService.getSubjects(),
        dbService.getChapters(),
        dbService.getQuestions(),
        dbService.getMockTests()
      ]);

      const updates = {};
      if (subjects && subjects.length > 0) {
        updates.subjects = subjects;
        updates.isSupabaseData = true;
      }
      if (chapters && chapters.length > 0) {
        updates.chapters = chapters;
      }
      if (questions && questions.length > 0) {
        updates.questions = questions;
      }
      if (mockTests && mockTests.length > 0) {
        updates.mockTests = mockTests;
      }

      if (Object.keys(updates).length > 0) {
        this.set(updates);
        console.log("✓ Live Supabase Curriculum synchronized:", {
          subjects: updates.subjects?.length || this.state.subjects.length,
          chapters: updates.chapters?.length || this.state.chapters.length,
          questions: updates.questions?.length || this.state.questions.length,
          mockTests: updates.mockTests?.length || this.state.mockTests.length
        });
      }
    } catch (e) {
      console.warn("Could not load dynamic curriculum from Supabase, using local syllabus", e);
    }
  }

  getSubjects() {
    return (this.state.subjects && this.state.subjects.length > 0) ? this.state.subjects : SYLLABUS_PART_I.courses;
  }

  getSubject(subjectId) {
    const list = this.getSubjects();
    return list.find(s => s.id === subjectId) || list[0];
  }

  getQuestions() {
    return (this.state.questions && this.state.questions.length > 0) ? this.state.questions : QUESTIONS_BANK;
  }

  getChapters(subjectId = null) {
    if (this.state.chapters && this.state.chapters.length > 0) {
      if (subjectId) {
        return this.state.chapters.filter(c => c.subjectId === subjectId);
      }
      return this.state.chapters;
    }
    const course = SYLLABUS_PART_I.courses.find(c => c.id === (subjectId || this.state.activeSubjectId));
    return course?.theoryChapters || [];
  }

  getMockTests() {
    return this.state.mockTests || [];
  }

  // Load real user records from Supabase / isolated user DB
  async syncUserData(userId) {
    if (!userId) return;

    try {
      const [attempts, bookmarks, streakData, mockAttempts] = await Promise.all([
        dbService.getUserAttempts(userId),
        dbService.getUserBookmarks(userId),
        dbService.getUserStreak(userId),
        dbService.getUserMockAttempts(userId)
      ]);

      const totalSolved = attempts.length;
      const correctCount = attempts.filter(a => a.is_correct).length;
      const accuracy = totalSolved > 0 ? Math.round((correctCount / totalSolved) * 100) : 0;

      // Calculate subject mastery from actual attempts
      const subjectScores = { pharmaceutics: 0, chemistry: 0, pharmacognosy: 0, hap: 0, social: 0 };
      const subjectTotals = { pharmaceutics: 0, chemistry: 0, pharmacognosy: 0, hap: 0, social: 0 };

      // Identify weak topics
      const topicStats = {};
      attempts.forEach(a => {
        const qId = a.question_id || '';
        let subj = 'pharmaceutics';
        if (qId.startsWith('q-ch')) subj = 'chemistry';
        else if (qId.startsWith('q-cg')) subj = 'pharmacognosy';
        else if (qId.startsWith('q-ha')) subj = 'hap';
        else if (qId.startsWith('q-sp')) subj = 'social';

        subjectTotals[subj] = (subjectTotals[subj] || 0) + 1;
        if (a.is_correct) subjectScores[subj] = (subjectScores[subj] || 0) + 1;
      });

      const mastery = {};
      let totalMastery = 0;
      Object.keys(subjectScores).forEach(k => {
        const tot = subjectTotals[k];
        mastery[k] = tot > 0 ? Math.round((subjectScores[k] / tot) * 100) : 0;
        totalMastery += mastery[k];
      });

      const overall = totalSolved > 0 ? Math.min(100, Math.round((totalSolved / 25) * 100)) : 0;

      // Calculate today's dose from today's attempts
      const today = new Date().toISOString().split('T')[0];
      const todayAttempts = attempts.filter(a => (a.attempted_at || '').startsWith(today));
      const mcqsDone = Math.min(10, todayAttempts.length);

      this.state = {
        ...this.state,
        totalQuestionsSolved: totalSolved,
        userAccuracy: accuracy,
        overallProgress: overall,
        subjectMastery: mastery,
        bookmarks: bookmarks,
        userAttempts: attempts,
        mockAttempts: mockAttempts,
        streak: streakData.current_streak || 1,
        dailyDose: {
          ...this.state.dailyDose,
          mcqsCompleted: mcqsDone,
          isDoseComplete: mcqsDone >= 10
        }
      };
    } catch (e) {
      console.error("Error synchronizing user data:", e);
    }
  }

  get() {
    return this.state;
  }

  set(updates) {
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notify() {
    for (const cb of this.subscribers) {
      try {
        cb(this.state);
      } catch (err) {
        console.error("State subscriber error", err);
      }
    }
  }

  // Navigation
  setView(viewName, subjectId = null) {
    const updates = { currentView: viewName };
    if (subjectId) {
      updates.activeSubjectId = subjectId;
    }
    this.set(updates);
  }

  // Bookmarking (Real DB)
  async toggleBookmark(questionId) {
    const user = this.state.currentUser;
    if (!user) {
      return false;
    }

    const added = await dbService.toggleBookmark(user.id, questionId);
    let bookmarks = [...this.state.bookmarks];
    if (added) {
      if (!bookmarks.includes(questionId)) bookmarks.push(questionId);
    } else {
      bookmarks = bookmarks.filter(id => id !== questionId);
    }
    this.set({ bookmarks });
    return added;
  }

  isBookmarked(questionId) {
    return this.state.bookmarks.includes(questionId);
  }

  // Record Real Question Attempt
  async recordAttempt(questionId, selectedOption, isCorrect, timeSpent = 0) {
    const user = this.state.currentUser;
    if (user) {
      await dbService.recordQuestionAttempt(user.id, questionId, selectedOption, isCorrect, timeSpent);
      await this.syncUserData(user.id);
    } else {
      // Local fallback for guest
      const total = this.state.totalQuestionsSolved + 1;
      this.set({ totalQuestionsSolved: total });
    }
  }

  // Exam Engine
  startExam(questions = null) {
    let examQs = questions;
    let mockTestId = null;

    if (!examQs || examQs.length === 0) {
      if (this.state.mockTests && this.state.mockTests.length > 0 && this.state.mockTests[0].questions?.length > 0) {
        examQs = this.state.mockTests[0].questions;
        mockTestId = this.state.mockTests[0].id;
      } else {
        examQs = this.getQuestions().slice(0, 5);
      }
    }

    this.set({
      currentView: "exam",
      activeExam: {
        mockTestId: mockTestId,
        questions: examQs,
        currentIndex: 0,
        answers: {},
        marked: {},
        timeRemaining: 900,
        startTime: Date.now()
      },
      examResults: null
    });
  }

  setExamAnswer(questionId, optionIndex) {
    if (!this.state.activeExam) return;
    const answers = { ...this.state.activeExam.answers, [questionId]: optionIndex };
    this.set({
      activeExam: { ...this.state.activeExam, answers }
    });
  }

  toggleExamMark(questionId) {
    if (!this.state.activeExam) return;
    const marked = { ...this.state.activeExam.marked };
    marked[questionId] = !marked[questionId];
    this.set({
      activeExam: { ...this.state.activeExam, marked }
    });
  }

  async submitExam() {
    if (!this.state.activeExam) return;
    const { questions, answers, startTime, mockTestId } = this.state.activeExam;
    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    questions.forEach(q => {
      const ans = answers[q.id];
      if (ans === undefined) {
        skipped++;
      } else if (ans === q.correctAnswer) {
        correct++;
      } else {
        wrong++;
      }
    });

    const total = questions.length;
    const scorePct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const durationSec = Math.round((Date.now() - startTime) / 1000);

    const results = {
      mockTestId: mockTestId,
      scorePct,
      correct,
      wrong,
      skipped,
      total,
      durationSec,
      questions,
      answers
    };

    // Save to real database
    const user = this.state.currentUser;
    if (user) {
      await dbService.saveMockTestAttempt(user.id, results);
      await this.syncUserData(user.id);
    }

    this.set({
      currentView: "exam-results",
      examResults: results,
      activeExam: null
    });
  }
}

export const store = new PharmaState();
