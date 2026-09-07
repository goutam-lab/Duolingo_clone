# Backend - Duolingo Full-Stack API

FastAPI backend providing REST APIs, service-layer game logic, SQLite persistence, and answer validation.

## Prerequisites
- Python 3.11+
- SQLite3

## Setup & Installation

1. Navigate to `backend`:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows PowerShell:
   .\venv\Scripts\Activate.ps1
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Environment Variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

## Running the Server

Start the development server with hot-reload:
```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- API Documentation (Swagger): [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Health check: [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)

## Running Tests

```bash
pytest
```
