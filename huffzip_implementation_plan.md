# 🗜️ HuffZip — Final Implementation Plan
## "Huffman Coding in Media Compression — A Greedy Algorithm Case Study"
### ADA Unit 4 (Greedy Method) | M.Sc. 2nd Semester

---

## 1. PROJECT IDENTITY

- **Name:** HuffZip — Huffman File Compressor
- **Tagline:** "Compress Any File. See How It Works. Powered by Greedy Algorithm."
- **Style:** ilovepdf.com-like professional UI with live Huffman visualization
- **Pages:** 7 (Home, Compress, CompressImage, CompressText, CompressAudio, Decompress, Compare, HowItWorks) — **NO About Page**

---

## 2. TECH STACK (LOCKED ✅)

| Layer | Tool | Notes |
|-------|------|-------|
| Frontend | React + Vite | SPA |
| Styling | Tailwind CSS | Mobile-first responsive |
| Animation | Framer Motion | Smooth transitions |
| Tree Visual | D3.js | Huffman tree animated |
| Charts | Recharts | Comparison charts |
| Routing | React Router v6 | Multi-page |
| Backend | Python + FastAPI | WebSocket support |
| Server | Uvicorn | ASGI |
| File Type Detection | Python `mimetypes` (stdlib) | ~~python-magic~~ removed — cross-platform |
| Image Processing | Pillow | If needed |
| Database | Supabase (PostgreSQL) | Tables + Storage |
| File Storage | Supabase Buckets | Signed URLs |
| Auto Delete | **Supabase pg_cron + Edge Function** | Every 15 min cleanup |
| Frontend Deploy | Cloudflare Pages | Edge CDN |
| Backend Deploy | Render.com | Free tier |
| Uptime | UptimeRobot | 14 min pings |

---

## 3. FOLDER STRUCTURE (FINAL — About Page Removed)

```
huffzip/
├── backend/
│   ├── main.py                    # FastAPI routes + WebSocket
│   ├── huffman_engine.py          # 7-stage Huffman algorithm
│   ├── decompressor.py            # .huff → original
│   ├── supabase_client.py         # DB + storage operations
│   ├── event_streamer.py          # WebSocket event manager
│   ├── file_handler.py            # Upload validation (mimetypes)
│   ├── stats.py                   # Global stats tracker
│   ├── compare.py                 # RLE + LZ77 for comparison
│   ├── cleanup.py                 # Expired file cleanup script
│   ├── .env.example
│   ├── requirements.txt
│   └── Procfile
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── CompressPage.jsx       # Main — accepts all files
│   │   │   ├── CompressImagePage.jsx
│   │   │   ├── CompressTextPage.jsx
│   │   │   ├── CompressAudioPage.jsx
│   │   │   ├── DecompressPage.jsx
│   │   │   ├── ComparePage.jsx
│   │   │   └── HowItWorksPage.jsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx         # Responsive hamburger menu
│   │   │   │   └── Footer.jsx
│   │   │   ├── home/
│   │   │   │   ├── Hero.jsx
│   │   │   │   ├── ToolsGrid.jsx      # 6 cards (responsive grid)
│   │   │   │   ├── StatsBar.jsx
│   │   │   │   └── RealWorldSection.jsx
│   │   │   ├── compress/
│   │   │   │   ├── DropZone.jsx
│   │   │   │   ├── ProgressBar.jsx
│   │   │   │   ├── ResultCard.jsx
│   │   │   │   └── DownloadBtn.jsx
│   │   │   └── visualization/
│   │   │       ├── LiveLog.jsx
│   │   │       └── HuffmanTree.jsx
│   │   ├── hooks/
│   │   │   ├── useWebSocket.js
│   │   │   ├── useCompression.js
│   │   │   └── useGlobalStats.js
│   │   ├── utils/
│   │   │   ├── formatBytes.js
│   │   │   ├── formatTime.js
│   │   │   └── fileTypeIcon.js
│   │   ├── constants/
│   │   │   └── fileTypes.js
│   │   └── App.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 4. RESPONSIVE DESIGN STRATEGY (Mobile-First)

### 4.1 Breakpoints (Tailwind defaults)

| Token | Min Width | Target Devices |
|-------|-----------|----------------|
| (base) | 0px | Small phones (320-479px) |
| `sm` | 640px | Large phones (landscape) |
| `md` | 768px | Tablets (iPad Mini, etc.) |
| `lg` | 1024px | Laptops, small desktops |
| `xl` | 1280px | Full desktops |

### 4.2 Component Responsive Behavior

| Component | Mobile (base) | Tablet (md) | Desktop (lg+) |
|-----------|---------------|-------------|----------------|
| **Navbar** | Hamburger menu + slide-out drawer | Hamburger menu | Full horizontal links |
| **Hero** | Stacked, center-aligned, smaller text | Wider text | Full width, large heading |
| **ToolsGrid** | 1 col (stacked cards) | 2 cols | 3 cols (2 rows × 3) |
| **StatsBar** | Vertical stack (3 rows) | Horizontal row | Horizontal row with icons |
| **Compress Page** | Single column — DropZone on top, Tree below, Log below tree | Single column wider | Split panel: Left 40% / Right 60% |
| **HuffmanTree** | Full width, touch-pinch zoom, 300px height | 400px height | 500px height, mouse zoom |
| **LiveLog** | Full width, 200px height, scrollable | 300px height | 400px height |
| **ResultCard** | Full width card, stacked stats | Same | Inline stats row |
| **Compare Charts** | Vertical stacked bars, scroll | Side by side | Full width charts |
| **Footer** | Stacked links, centered | 2-col grid | Single row |

### 4.3 Mobile-Specific Rules

1. **Touch targets:** All buttons/links minimum `44px × 44px` (Apple HIG)
2. **DropZone:** Full-width with large tap target, camera icon for mobile upload
3. **Tree visualization:** Pinch-to-zoom on mobile, simplified view (top 20 nodes) for small screens
4. **LiveLog:** Collapsible accordion on mobile — tap to expand
5. **No horizontal scroll** — everything wraps or stacks
6. **Font scaling:** `text-sm` base on mobile → `text-base` on md → `text-lg` headings on lg
7. **Compress page tabs:** On mobile, Tree and Log become tabs (switchable) instead of split view

### 4.4 Compress Page — Mobile Layout

```
MOBILE (< 768px):
┌─────────────────────┐
│     DropZone         │  ← Full width, large tap area
│   (drag/tap upload)  │
├─────────────────────┤
│   Progress Bar       │
├─────────────────────┤
│   Result Card        │  ← Appears after compression
│   [Download Button]  │
├─────────────────────┤
│  [🌳 Tree] [📋 Log] │  ← Tab switcher
├─────────────────────┤
│                     │
│   Active Tab View   │  ← Either tree OR log (not both)
│   (full width)      │
│                     │
└─────────────────────┘

DESKTOP (≥ 1024px):
┌──────────────┬──────────────────────┐
│              │   Huffman Tree       │
│  DropZone    │   (D3.js animated)   │
│  Progress    ├──────────────────────┤
│  Result      │   Live Log Feed      │
│  Download    │   (terminal style)   │
│              │                      │
└──────────────┴──────────────────────┘
```

---

## 5. BACKEND — CORRECTED DETAILS

### 5.1 API Routes

```
POST   /upload              # File upload → start compression
GET    /download/{job_id}   # Signed download URL
GET    /status/{job_id}     # Job status check
POST   /decompress          # .huff → original file
GET    /stats               # Global stats for homepage
GET    /compare             # Huffman vs RLE vs LZ77
WS     /ws/{job_id}         # Live events stream
GET    /health              # Health check for UptimeRobot
```

### 5.2 Huffman Engine — 7 Stages (Corrected)

```
STAGE 1: FILE READ → bytearray
STAGE 2: FREQUENCY TABLE → Counter(bytearray) — O(n)
STAGE 3: MIN-HEAP → heapify unique bytes — O(k) where k = unique count
STAGE 4: HUFFMAN TREE → (k-1) merges (NOT 255 — dynamic!)
STAGE 5: CODE TABLE → DFS traversal → {byte: binary_code}
STAGE 6: ENCODING → replace bytes with codes, pack bits
STAGE 7: PACKAGING → header (magic + original_size + padding_bits + code_table) + body
```

> **Fix applied:** Merge count = `unique_byte_count - 1` (dynamic, not hardcoded 255)
> **Fix applied:** Header includes `padding_bits` (0-7) for byte alignment

### 5.3 .huff File Format (Corrected)

```
┌──────────────────────────────────────────────┐
│ HEADER                                        │
│  ├── Magic bytes: b'HUFF' (4 bytes)          │
│  ├── Original file size: uint64 (8 bytes)    │
│  ├── Original filename length: uint16        │
│  ├── Original filename: variable             │
│  ├── Padding bits: uint8 (0-7)    ← NEW     │
│  ├── Code table length: uint32               │
│  └── Code table: JSON bytes                  │
├──────────────────────────────────────────────┤
│ BODY                                          │
│  └── Compressed binary data                  │
└──────────────────────────────────────────────┘
```

### 5.4 Corrected Compression Ratios (Honest)

| File Type | Extensions | Huffman Savings | Note |
|-----------|-----------|----------------|------|
| Text | .txt | 40–70% | Best case — repetitive content |
| CSV | .csv | 50–75% | Tabular data compresses well |
| BMP | .bmp | 50–70% | Uncompressed image format |
| WAV | .wav | 40–60% | Raw audio |
| PDF | .pdf | 10–30% | Partially compressed already |
| PNG | .png | 0–10% | Already compressed (deflate) |
| JPEG | .jpg | 0–5% | Already compressed |
| MP3 | .mp3 | 0–5% | Already compressed |
| ZIP | .zip | 0–2% | Already compressed |

> UI will show warning: _"This file type is already compressed. Minimal savings expected."_

### 5.5 Auto-Delete (Corrected — No Native Lifecycle Policy)

```sql
-- Supabase SQL: Create cleanup function
CREATE OR REPLACE FUNCTION cleanup_expired_jobs()
RETURNS void AS $$
BEGIN
  DELETE FROM compression_jobs
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Schedule with pg_cron (every 15 minutes)
SELECT cron.schedule('cleanup-expired', '*/15 * * * *', 'SELECT cleanup_expired_jobs()');
```

Backend `cleanup.py` also deletes expired files from Supabase Storage bucket.

---

## 6. FRONTEND PAGES (FINAL — No About Page)

### Page 1: HomePage
- Hero with CTA buttons
- Live StatsBar (from Supabase)
- 6-card ToolsGrid (responsive: 1col → 2col → 3col)
- Real World section (WhatsApp, ZIP, JPEG logos)
- 3-step "How it works" preview
- Footer

### Page 2: CompressPage (+ Image/Text/Audio variants)
- DropZone (full-width on mobile)
- Progress bar with live percentage
- Result card with stats + download
- D3.js Huffman tree (tabs on mobile)
- Live terminal log (tabs on mobile)
- Cold-start loading state: _"Server waking up... (~30s)"_

### Page 3: DecompressPage
- Upload .huff file only
- Shows original file info from header
- Download reconstructed original

### Page 4: ComparePage
- Upload one file → compress with 3 algorithms
- Recharts bar charts (stacked on mobile)
- Comparison table
- Conclusion text

### Page 5: HowItWorksPage
- 5 animated steps (Framer Motion)
- Each step: visual + explanation
- ADA syllabus connection table
- Real world applications

### Navbar
- **Desktop (lg+):** Logo + horizontal links: `Compress | Decompress | How It Works | Compare | GitHub`
- **Mobile (<lg):** Logo + hamburger → slide-out drawer with links

---

## 7. BUILD ORDER

### Phase 1 — Backend Core
```
1. huffman_engine.py     → 7-stage algorithm with dynamic merges
2. file_handler.py       → Upload validation (mimetypes)
3. event_streamer.py     → WebSocket event manager
4. supabase_client.py    → DB + Storage operations
5. main.py               → All routes + WebSocket endpoint
6. decompressor.py       → .huff decode
7. compare.py            → RLE + basic LZ77
8. cleanup.py            → Expired file cleanup
9. Test all endpoints locally
```

### Phase 2 — Frontend Core
```
1. Vite + Tailwind + Router setup
2. Navbar (responsive hamburger) + Footer
3. HomePage — Hero, ToolsGrid, StatsBar, RealWorld
4. CompressPage — DropZone, Progress, Results
5. Visualization — LiveLog + HuffmanTree (D3.js)
6. Connect WebSocket + API integration
7. Mobile responsive pass on all components
```

### Phase 3 — Remaining Pages
```
1. DecompressPage
2. ComparePage + charts
3. HowItWorksPage + animations
4. CompressImage/Text/Audio variant pages
5. Mobile testing + bug fixes
```

### Phase 4 — Deploy
```
1. Supabase → tables + bucket + pg_cron
2. Render → backend deploy
3. Cloudflare Pages → frontend deploy
4. UptimeRobot → health ping
5. End-to-end testing
6. Cold-start UX verification
```

---

## 8. KEY FIXES SUMMARY (vs Original Plan)

| # | Original Issue | Fix Applied |
|---|---------------|-------------|
| 1 | About Page included | ❌ Removed from everywhere |
| 2 | `python-magic` (needs libmagic) | ✅ Using `mimetypes` (stdlib) |
| 3 | Supabase "auto-delete policy" | ✅ pg_cron + cleanup function |
| 4 | JPEG/MP3/ZIP ratios 30-60% | ✅ Honest: 0-5% with UI warning |
| 5 | Hardcoded 255 merges | ✅ Dynamic: `unique_count - 1` |
| 6 | No padding_bits in .huff | ✅ Added to header format |
| 7 | No cold-start handling | ✅ Loading state in frontend |
| 8 | No mobile design plan | ✅ Full responsive strategy added |

---

> **Status:** Plan is FINAL and LOCKED. Ready to build. 🚀
