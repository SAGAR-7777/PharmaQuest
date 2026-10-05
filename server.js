const http = require('http');
const fs = require('fs');
const path = require('path');

// Official Groq SDK loader (Strictly GROQ AI only)
let Groq = null;
try {
  const groqPkg = require('groq-sdk');
  Groq = groqPkg.Groq || groqPkg;
} catch (e) {
  console.warn("groq-sdk could not be loaded:", e.message);
}

// Dynamic .env file parser (preserves environment variables already set by host platform like Render)
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        // Do not overwrite existing environment variables set by host platform (e.g. Render)
        if (process.env[key] === undefined) {
          process.env[key] = val;
        }
      }
    });
  }
}
loadEnv();

const PORT = process.env.PORT || 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

// Determine Allowed Origin based on request and environment settings
function getCorsHeaders(req) {
  const requestOrigin = (req && req.headers && req.headers.origin) || '';
  const configuredOrigin = process.env.ALLOWED_ORIGIN ? process.env.ALLOWED_ORIGIN.trim() : '';

  let allowedOrigin = '*';

  if (configuredOrigin && configuredOrigin !== '*') {
    const allowedList = configuredOrigin.split(',').map(o => o.trim().replace(/\/+$/, ''));
    if (allowedList.includes(requestOrigin.replace(/\/+$/, ''))) {
      allowedOrigin = requestOrigin;
    } else {
      allowedOrigin = allowedList[0];
    }
  } else if (
    requestOrigin.startsWith('http://localhost') || 
    requestOrigin.startsWith('http://127.0.0.1') ||
    requestOrigin.includes('.vercel.app')
  ) {
    allowedOrigin = requestOrigin;
  }

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  };
}

// Helper to send JSON responses with proper CORS headers
function sendJSON(res, statusCode, data, req = null) {
  const corsHeaders = getCorsHeaders(req);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    ...corsHeaders
  });
  res.end(JSON.stringify(data));
}

// Execute Groq Chat Completion via official groq-sdk
async function callGroqAI(apiKey, userPrompt, context = {}) {
  if (!Groq) {
    throw new Error("Official groq-sdk package is not available on the server. Please run npm install groq-sdk.");
  }

  const model = (process.env.GROQ_MODEL && process.env.GROQ_MODEL.trim()) || 'qwen/qwen3.8-27b';
  const groq = new Groq({ apiKey });

  const systemPrompt = `You are Pharma AI, the Lead Pharmaceutical Scientist and Senior Academic Examiner for Diploma in Pharmacy (D.Pharm) students under the Pharmacy Council of India (PCI) ER-2020 Part I syllabus.

STUDENT STUDY CONTEXT:
- Course: ${context.subject || 'D.Pharm Part I (ER20-11T through ER20-15T)'}
- Chapter/Topic: ${context.chapter || 'PCI ER-2020 Core Curriculum'}
- Reference: ${context.syllabusRef || 'Indian Pharmacopoeia (IP 2022) / PCI ER-2020 Guidelines'}

CORE PEDAGOGICAL INSTRUCTIONS:
1. Act as a dedicated D.Pharm study mentor and academic examiner.
2. Ground all answers strictly in the official ER-2020 syllabus and the Indian Pharmacopoeia (IP).
3. Do not invent or assume unofficial monograph standards, chemical structures, drug schedules, or syllabus hours.
4. Keep answers focused and concise (under 400 words total) so the structured JSON completes fully within token limits.
5. You MUST respond with a strictly valid JSON object matching this schema EXACTLY:
{
  "title": "Short descriptive topic title",
  "simpleExplanation": "Clear, accessible, conceptual explanation for first-year pharmacy students",
  "examAnswer": "High-scoring concise formal answer suitable for board/sessional exams with monograph references, equations, and clinical/dosage specifics",
  "keyPoints": ["High-yield bullet point 1", "High-yield bullet point 2", "High-yield bullet point 3"],
  "viva": "A high-yield oral viva voce question and model examiner answer",
  "practice": "A recommended follow-up concept, calculation, or reaction to practice"
}
Output strictly valid JSON and nothing else.`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: userPrompt
      }
    ],
    model: model,
    temperature: 0.2,
    max_tokens: 800,
    response_format: { type: "json_object" }
  });

  const rawContent = chatCompletion.choices?.[0]?.message?.content || '{}';
  try {
    return JSON.parse(rawContent);
  } catch (err) {
    return {
      title: userPrompt.substring(0, 50),
      simpleExplanation: rawContent,
      examAnswer: "Please refer to official Indian Pharmacopoeia standards for monograph specifications.",
      keyPoints: ["PCI ER-2020 syllabus grounded", "Check relevant subject theory hours"],
      viva: "Be prepared to explain the working principle and primary clinical indication.",
      practice: "Review the corresponding PYQ in your Revision Vault."
    };
  }
}

const server = http.createServer((req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    const corsHeaders = getCorsHeaders(req);
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const reqPath = decodeURI(parsedUrl.pathname);

  // --- API ROUTE: GET /api/health ---
  // Lightweight health check endpoint for Render deployment monitoring and uptime verification
  if (reqPath === '/api/health' && req.method === 'GET') {
    sendJSON(res, 200, {
      status: 'ok',
      app: 'PHARMAQUEST'
    }, req);
    return;
  }

  // --- API ROUTE: GET /api/config ---
  // Exposes only safe public client configurations (Never secret keys like GROQ_API_KEY)
  if (reqPath === '/api/config' && req.method === 'GET') {
    loadEnv();
    const hasGroq = Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim().length > 0);
    const activeModel = (process.env.GROQ_MODEL && process.env.GROQ_MODEL.trim()) || 'qwen/qwen3.8-27b';

    sendJSON(res, 200, {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      aiConfigured: hasGroq,
      aiProvider: 'groq',
      groqModel: activeModel
    }, req);
    return;
  }

  // --- API ROUTE: POST /api/ai/chat ---
  // Server-side AI route using GROQ only. Protects GROQ_API_KEY completely from browser exposure.
  if (reqPath === '/api/ai/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        loadEnv();
        const payload = JSON.parse(body || '{}');
        const userPrompt = payload.prompt ? payload.prompt.trim() : '';

        // Requirement 13: Validate empty user messages
        if (!userPrompt) {
          sendJSON(res, 400, {
            success: false,
            configured: true,
            error: 'Prompt cannot be empty. Please ask a D.Pharm question or topic.'
          }, req);
          return;
        }

        const groqKey = process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.trim() : '';
        const activeModel = (process.env.GROQ_MODEL && process.env.GROQ_MODEL.trim()) || 'qwen/qwen3.8-27b';

        // If GROQ_API_KEY is missing, do not crash the website. Show a clear "AI is not configured" message.
        if (!groqKey) {
          sendJSON(res, 200, {
            success: false,
            configured: false,
            provider: 'groq',
            error: 'AI is not configured',
            message: 'Pharma AI is ready. To enable live Groq intelligence, configure GROQ_API_KEY in your Render/server environment variables.',
            structuredContent: {
              title: "Groq AI Configuration Required",
              simpleExplanation: "Pharma AI Assistant is powered exclusively by the official groq-sdk package on Groq's ultra-fast LPU infrastructure, but GROQ_API_KEY has not been set yet in your server environment.",
              examAnswer: "Setup Steps:\n1. On Render: Add Environment Variable GROQ_API_KEY\n2. Add GROQ_MODEL=qwen/qwen3.8-27b\n3. Restart backend service to activate live Groq intelligence!",
              keyPoints: [
                `Configured Model: ${activeModel}`,
                "Official groq-sdk package installed and active on server",
                "The Groq API key is strictly server-side and never exposed to the client browser"
              ],
              viva: "Sample Viva: What is the primary analytical basis of the Limit Test for Iron as per the Indian Pharmacopoeia?",
              practice: "Configure GROQ_API_KEY in server environment to begin real-time Groq inference."
            }
          }, req);
          return;
        }

        // Call Groq exclusively via official groq-sdk
        const structuredResult = await callGroqAI(groqKey, userPrompt, {
          subject: payload.subject,
          chapter: payload.chapter,
          syllabusRef: payload.syllabusRef
        });

        sendJSON(res, 200, {
          success: true,
          configured: true,
          provider: 'groq',
          model: activeModel,
          structuredContent: structuredResult
        }, req);
      } catch (err) {
        console.error("Server Groq AI Error:", err.message);
        sendJSON(res, 200, {
          success: false,
          configured: true,
          error: 'Groq API Error: ' + err.message,
          message: 'Groq generation error: ' + err.message,
          structuredContent: {
            title: "Groq API Communication Notice",
            simpleExplanation: `Unable to complete Groq request: ${err.message}`,
            examAnswer: "Please verify that your GROQ_API_KEY in server environment is valid and active at console.groq.com.",
            keyPoints: [
              `Target Model: ${process.env.GROQ_MODEL || 'qwen/qwen3.8-27b'}`,
              "Check your internet connection and Groq quota status",
              "Server caught the error safely without interrupting the application"
            ],
            viva: "Sample Viva: In Pharmaceutical Quality Assurance, what is the role of validation and calibration?",
            practice: "Check server logs or verify your GROQ_API_KEY in environment variables"
          }
        }, req);
      }
    });
    return;
  }

  // --- STATIC FILE SERVING ---
  let filePath = path.join(__dirname, reqPath === '/' ? '/index.html' : reqPath);

  // Security check: ensure path is within directory
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA client-side routes
      fs.readFile(path.join(__dirname, 'index.html'), (errIndex, content) => {
        if (errIndex) {
          res.writeHead(404);
          res.end('Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(content);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(500);
        res.end('Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      }
    });
  });
});

// Bind to 0.0.0.0 for Render production host compatibility
server.listen(PORT, '0.0.0.0', () => {
  console.log(`PHARMAQUEST Server active on port ${PORT}`);
});
