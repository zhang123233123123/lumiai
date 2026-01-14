# Lumina IELTS

This repo is split into a frontend app and a backend API.

- Frontend: `frontend/` (Vite + React)
- Backend: `backend/` (FastAPI)

## Quick start

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

See `frontend/README.md` and `backend/README.md` for more details.
