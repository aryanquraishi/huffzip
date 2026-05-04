# 🗜️ HuffZip — Huffman File Compressor

> Compress any file using Huffman Coding (Greedy Algorithm) with real-time visualization of the algorithm working

**ADA Project | M.Sc. 2nd Semester | Unit 4 — Greedy Method**

## ✨ Features

- **Compress any file type** — Image, Text, PDF, Audio, ZIP, and more
- **Real-time Huffman tree visualization** — Watch the D3.js animated tree grow
- **Live log feed** — See every algorithm step in a terminal-style viewer
- **Download compressed `.huff` file** — Custom binary format with header
- **Decompress `.huff` back to original** — Lossless round-trip guaranteed
- **Compare algorithms** — Huffman vs RLE vs LZ77 with charts
- **Auto-delete files** — 1-hour expiry for privacy
- **Mobile responsive** — Works on all devices

## 📚 ADA Syllabus Connection

| Unit 4 Topic | Used In Project |
|---|---|
| Huffman Codes | Core compression algorithm |
| Greedy Method | Algorithm design approach |
| Greedy Choice Property | Minimum frequency merge strategy |
| Optimal Substructure | Tree optimality proof |
| Time Complexity | O(n log n) — heap operations |
| Space Complexity | O(n) — tree + code table |

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS v4 |
| Visualization | D3.js + Framer Motion + Recharts |
| Backend | Python + FastAPI + Uvicorn |
| Database | Supabase (PostgreSQL) |
| File Storage | Supabase Storage (Signed URLs) |
| Frontend Deploy | Cloudflare Pages |
| Backend Deploy | Render.com |

## 🚀 Local Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
huffzip/
├── backend/
│   ├── main.py               # FastAPI routes + WebSocket
│   ├── huffman_engine.py      # 7-stage Huffman algorithm
│   ├── decompressor.py        # .huff → original
│   ├── event_streamer.py      # WebSocket event manager
│   ├── file_handler.py        # Upload validation
│   ├── supabase_client.py     # DB + storage
│   ├── compare.py             # RLE + LZ77 comparison
│   ├── stats.py               # Global stats
│   └── cleanup.py             # Expired file cleanup
├── frontend/
│   └── src/
│       ├── pages/             # All page components
│       ├── components/        # Reusable UI components
│       ├── hooks/             # Custom React hooks
│       ├── utils/             # Utility functions
│       └── constants/         # Configuration
└── README.md
```

## 📄 License

MIT — Built for academic purposes.
