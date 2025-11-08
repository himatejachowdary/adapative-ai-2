# Adaptive AI — Chatbot App

A production‑ready, hackathon‑friendly AI chatbot that adapts to user context, supports file/image uploads, and can plug into real‑time data sources. This README helps you run, develop, and deploy the app fast.

---

## ✨ Highlights

* **Adaptive Conversations**: Context memory, tools, and persona switching.
* **Multi‑modal input**: Text + file/image upload (PDF, DOCX, PNG/JPG, etc.).
* **Bring‑your‑own‑model**: Works with Google Gemini, OpenAI, or any OpenAI‑compatible API.
* **Pluggable data layer**: Choose Firebase/Firestore or MongoDB Atlas.
* **Secure auth**: Email/Password, OAuth (Google), or magic links (via Firebase Auth).
* **Realtime UI**: Streaming tokens, typing indicators, message states.
* **Prod‑ready**: Env config, rate limits, logging, error boundaries.

---

## 🏗️ Architecture

```
apps/
  web/                # Next.js (App Router) frontend + API routes
    app/
      (public pages)
      api/
        chat/route.ts # chat completion endpoint (server-side)
        upload/route.ts
    components/
    lib/
      ai/             # model clients, router, tool registry
      db/             # firebase or mongo adapter
    styles/
    .env.example
packages/
  ui/                 # shared UI components (optional)
  core/               # shared logic: prompt templates, guards, schemas
```

* **Frontend**: Next.js 14 / React 18, Tailwind, shadcn/ui, Framer Motion.
* **Server**: Next.js Route Handlers (Edge or Node runtime), Zod validation.
* **AI**: Google AI Studio (Gemini) or OpenAI; simple adapter pattern.
* **Storage**: Firebase (Firestore/Storage) or MongoDB Atlas + S3-like storage.

---

## 🔧 Prerequisites

* Node.js 18+ and pnpm or npm
* One model provider key:

  * **Google AI Studio**: `GEMINI_API_KEY`
  * **OpenAI**: `OPENAI_API_KEY`
* One database:

  * **Firebase** (Firestore + Storage) **or**
  * **MongoDB Atlas** (connection string) + optional object storage

> ⚠️ **Never commit secrets**. Use `.env.local` for development.

---

## 🚀 Quick Start

```bash
# 1) Clone your repo
git clone <your-repo-url>
cd <repo>/apps/web

# 2) Copy env template
cp .env.example .env.local

# 3) Install deps
pnpm install    # or npm install / yarn

# 4) Run dev
pnpm dev        # or npm run dev
```

Now open **[http://localhost:3000](http://localhost:3000)**.

---

## 🔑 Environment Variables (`.env.local`)

```bash
# Model providers (choose one or both)
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key

# Provider selection (defaults to gemini)
AI_PROVIDER=gemini  # or openai

# Database (choose one path)
# --- Firebase ---
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...

# --- MongoDB Atlas ---
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority
MONGODB_DB=adaptiveai

# File uploads
MAX_UPLOAD_MB=25
ALLOWED_MIME=image/png,image/jpeg,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document

# App
NEXT_PUBLIC_APP_NAME=Adaptive AI
NEXT_PUBLIC_ENABLE_FILE_UPLOAD=true
NEXTAUTH_SECRET=generate_a_strong_secret
NEXTAUTH_URL=http://localhost:3000
```

---

## 🧠 Prompting & System Behavior

System prompt lives at `packages/core/prompts/system.ts`:

```ts
export const SYSTEM_PROMPT = `
You are an adaptive assistant. Keep replies concise. Use tools when helpful.
Maintain short-term memory per chat, summarize when long.
When files are uploaded, extract key facts and cite the filename inline.
If unsure, ask for a small clarifying detail, then proceed.
`;
```

### Tool Registry (examples)

* **Web search** (server-only)
* **RAG** over uploaded files (embeddings + vector store)
* **Math** (safe-eval / python microservice optional)

---

## 🗄️ Database Adapters

### Option A: Firebase

1. Create project in [Firebase Console].
2. Enable **Authentication** (Email/Password + Google sign-in).
3. Create **Firestore** DB in production mode (or test for dev).
4. Create **Storage** bucket; allow authenticated uploads.
5. Fill the Firebase vars in `.env.local`.
6. In code, the adapter auto-selects Firebase when those envs exist.

### Option B: MongoDB Atlas

1. Create a **Database User** with a strong password.
2. Allow access from your IP (or 0.0.0.0/0 for dev only).
3. Copy the **connection string** and set `MONGODB_URI`.
4. Set `MONGODB_DB` to your DB name (e.g., `adaptiveai`).
5. Start the app; the Mongo adapter will initialize collections:

   * `users`, `chats`, `messages`, `files`, `events`.

> Don’t hardcode usernames/passwords in code. Use env vars only.

---

## 📦 API Endpoints (Next.js Route Handlers)

* `POST /api/chat` — Streams assistant messages.

  * Body: `{ messages: Array<ChatMessage>, attachments?: FileRef[] }`
* `POST /api/upload` — Pre-signed upload + virus/type checks.
* `GET /api/health` — Health probe for uptime monitors.

All endpoints perform schema validation with Zod and return JSON.

---

## 🖼️ File & Image Uploads

* UI shows a **➕ (plus) button** next to the input.
* Click ➕ to attach **images or documents**.
* Server extracts text (pdf/docx), builds chunked notes, and exposes them to the model as context.
* Large files are summarized before use.

> Tip: You can toggle uploads via `NEXT_PUBLIC_ENABLE_FILE_UPLOAD`.

---

## 🧪 Testing

```bash
pnpm test         # unit tests (Vitest)
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
```

---

## 🔐 Security

* Never log raw secrets or full prompts with PII.
* Validate MIME type + file size before upload.
* Rate limit `/api/chat` by IP + userId.
* Use HTTPS in production; set `NEXTAUTH_URL` accordingly.
* Store only minimal conversation history; auto‑prune older chunks.

---

## 🛫 Deploy

### Vercel (recommended)

1. Push to GitHub.
2. Import repo in Vercel.
3. Add env vars in Vercel Project Settings → Environment Variables.
4. Redeploy.

### Netlify / Render / Railway

* Use a Node 18+ runtime and configure env vars identically.

---

## 🗺️ Roadmap (Suggested)

* Agentic tools (calendar, email, web-browse) with user consent.
* Fine‑grained roles/personas per workspace.
* RAG over your internal knowledge base.
* Analytics dashboard (usage, latency, costs).
* Offline cache for mobile PWA.

---

## ❓ Troubleshooting

* **401 / Invalid API key**: Verify `GEMINI_API_KEY` or `OPENAI_API_KEY` in the deployment environment, not just locally.
* **CORS errors**: Ensure API routes run server‑side; avoid calling provider APIs from the browser.
* **Mongo connect fail**: IP allowlist and correct SRV URI. Avoid special characters in passwords or URL‑encode them.
* **Firebase permission‑denied**: Check Firestore/Storage rules and Auth state.
* **Uploads rejected**: Confirm `ALLOWED_MIME` and `MAX_UPLOAD_MB`.

---

## 📘 License

MIT — do whatever, just don’t remove credits if you keep them.

---

## 🙌 Credits

* Google AI Studio / Gemini
* OpenAI (optional adapter)
* shadcn/ui • Tailwind • Framer Motion

---

### Appendix: Minimal `.env.example`

```bash
# Choose one provider
GEMINI_API_KEY=YOUR_KEY
# OPENAI_API_KEY=YOUR_KEY
AI_PROVIDER=gemini

# Choose one database
# Firebase
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...

# Or Mongo
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/adaptiveai
MONGODB_DB=adaptiveai

NEXT_PUBLIC_APP_NAME=Adaptive AI
NEXT_PUBLIC_ENABLE_FILE_UPLOAD=true
NEXTAUTH_SECRET=change_me
NEXTAUTH_URL=http://localhost:3000
```
