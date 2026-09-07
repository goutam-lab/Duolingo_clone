# Frontend - Duolingo Clone UI

Next.js App Router frontend built with React 19, TypeScript, Tailwind CSS, and Framer Motion.

## Prerequisites
- Node.js 18.18+ or 20+
- npm

## Setup & Installation

1. Navigate to `frontend`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Variables:
   Configure `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Ensure `NEXT_PUBLIC_API_URL` points to your running FastAPI backend:
   ```env
   NEXT_PUBLIC_API_URL="http://127.0.0.1:8000/api/v1"
   ```

## Running the Development Server

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Build

```bash
npm run build
npm start
```
