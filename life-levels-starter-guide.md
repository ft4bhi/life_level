# Life Levels — Starter Guide
### From idea to first working app, step by step

---

## Before you touch any code

Read this entire document first. The biggest mistakes early-stage solo builders make are:
- Starting with code before the data model is clear
- Building too much before validating the core loop
- Setting up infrastructure before the app works locally

This guide is structured in the exact order you should do things.

---

## Part 1 — What you are actually building (Refined PRD)

### The one sentence that matters

> A journaling app where every completed day becomes a visual "level" on a map — making life feel like a game you're progressing through.

Everything you build either serves that sentence or it doesn't. If a feature doesn't make the progression map more powerful or the journaling experience easier, cut it from the MVP.

---

### The core loop (the thing that must work first)

```
User opens app → sees their level map → taps today's level → writes journal → saves → level unlocks → map updates
```

This loop is the product. Nothing else matters until this works perfectly.

---

### MVP feature list (locked — do not add to this)

| Feature | Why it's in MVP |
|---|---|
| Sign up / log in | Can't have journals without identity |
| Daily journal creation | The core action |
| Level map on home screen | The core differentiator |
| Journal editor (text + images) | Minimum viable entry |
| Streak counter | Motivates daily return |
| Private by default | Trust and safety baseline |
| Search by keyword / date | Find old entries |
| Share as image or link | Virality + social proof |

**Not in MVP — do not touch until Phase 2:**
Voice notes, comments, reactions, collections, AI summaries, mood analytics, friends/social feed, end-to-end encryption.

---

### User flows (the only 4 that matter at MVP)

**Flow 1 — First time user**
1. Download app
2. Sign up with Google or email
3. Choose username
4. See level map with Day 1 highlighted and all future days locked
5. Tap Day 1 → write first journal → save
6. See Day 1 "light up" on the map, Day 2 unlocks

**Flow 2 — Returning user (daily)**
1. Open app
2. See map — can see all past unlocked levels, today's level is highlighted
3. Tap today → write → save
4. Streak count increments

**Flow 3 — Reading a past entry**
1. Tap any past level on the map
2. See the journal entry in read mode
3. Optionally edit or share from here

**Flow 4 — Sharing a journal**
1. Open any journal entry
2. Tap "Share"
3. Choose: Public link / Export as image / WhatsApp / Instagram
4. Privacy options: Private / Friends / Public

---

### What "done" looks like for MVP

You are done with MVP when a stranger can:
- Download, sign up, write their first journal, and see it on the level map
- Come back tomorrow and repeat
- Share one entry to Instagram Stories as a beautiful image card

That's it. Ship that, then build more.

---

## Part 2 — Data model (understand this before any code)

The data model is the skeleton. Get this right first.

### Entities and what they store

**User**
- id, email, username, avatar_url
- created_at, last_active_at
- privacy_default (private / friends / public)
- streak_count, longest_streak

**Journal entry**
- id, user_id
- day_number (1, 2, 3... — the "level" number)
- title (optional), content (rich text / markdown)
- mood (enum: happy / neutral / sad / excited / anxious / grateful)
- tags (array of strings)
- location (optional: city name or lat/long)
- image_urls (array, stored in object storage)
- privacy (private / friends / public)
- created_at, updated_at
- is_complete (boolean — false until the user saves intentionally)

**Streak**
- id, user_id
- current_streak, longest_streak
- last_journal_date
- streak_broken_at (nullable)

**Share link**
- id, journal_id, user_id
- token (short unique string for the URL)
- expires_at (optional)
- view_count

### Key relationships to understand

- One user → many journal entries
- One user → one streak record (updated daily)
- One journal entry → many share links
- day_number is always the count of journal entries for that user (not a calendar date) — Day 1 is their first entry ever, Day 47 is their 47th

### The "level map" is just a query

The home screen level map is not a complex data structure. It is simply:

```
Get all journal entries for this user, ordered by day_number.
Show completed entries as unlocked levels.
Show today's entry (or next empty slot) as the active level.
Show everything beyond as locked.
```

That's it. The map is a presentation of the sorted journal list.

---

## Part 3 — Architecture decisions (what to use and why)

### Backend — Python + FastAPI ✓

You already know this. Structure it as one FastAPI app for MVP, not microservices. Split into microservices only after MVP ships and you know where the load actually hits. Premature microservices are a common trap.

**Folder structure to use:**
```
app/
  api/
    routes/
      auth.py
      journals.py
      streaks.py
      search.py
      media.py
      shares.py
  models/         ← SQLAlchemy models (your database tables)
  schemas/        ← Pydantic schemas (request/response shapes)
  services/       ← Business logic (the streak calculation, etc.)
  workers/        ← Celery background tasks
  core/
    config.py     ← env vars
    security.py   ← JWT helpers
    database.py   ← DB connection
```

**Key libraries:**
- `fastapi` + `uvicorn` — the server
- `sqlalchemy[asyncio]` + `asyncpg` — async database
- `alembic` — database migrations
- `pydantic-settings` — config from env vars
- `python-jose` — JWT tokens
- `celery` + `redis` — background tasks
- `boto3` — S3/R2 object storage
- `meilisearch-python` — search

### Database — PostgreSQL

One Postgres database with the tables from Part 2. For MVP you won't need anything fancy. Use connection pooling via `asyncpg`.

### Cache + Queue — Redis

Redis does two jobs:
1. Cache: store recently accessed journals so the level map loads fast
2. Queue: background tasks (streak check at midnight, share card generation)

You don't need a separate RabbitMQ setup. Redis Streams or just Celery with Redis broker is enough.

### Search — Meilisearch

Postgres full-text search works but feels slow and doesn't handle typos. Meilisearch is self-hostable, free, and has a Python client. Whenever a journal is saved, a background task indexes it in Meilisearch. Search queries hit Meilisearch, not Postgres.

### File storage — Cloudflare R2

Images uploaded by users go here. The flow is:
1. Client asks your API for a "presigned upload URL"
2. API generates the URL (valid for 5 mins)
3. Client uploads directly to R2 (bypasses your server)
4. Client tells your API the upload is done
5. API saves the R2 URL in the journal record

This means your backend never handles image bytes. R2 is S3-compatible and has no egress fees.

### Mobile app — React Native with Expo

You said you want good tech stack — React Native with Expo is the right call for a journaling app. Key reasons:
- One codebase for iOS and Android
- Expo Go lets testers run it without building
- MMKV for fast local storage (offline-first journaling)
- React Native Reanimated for the smooth level map animations

### Web — Next.js (minimal scope in MVP)

Only use Next.js for:
- The shareable journal page (someone clicks a share link)
- OG image generation (the preview card when you paste a link in WhatsApp)
- The marketing/landing page

Not for the main journaling experience — that should live in the mobile app.

### Hosting (MVP) — Railway

Railway runs your Docker containers, gives you managed Postgres and Redis as add-ons, and has zero DevOps setup. You push to GitHub, it deploys. Use this until you have real traffic, then evaluate.

- Backend: Docker container on Railway
- Postgres: Railway add-on
- Redis: Railway add-on
- Meilisearch: Railway add-on (or Meilisearch Cloud free tier)
- R2: Cloudflare (free up to 10GB)
- Frontend web: Vercel (free tier)
- Mobile: Expo EAS Build + App Store / Play Store

---

## Part 4 — The build order (this is where to start)

Do these in sequence. Do not jump ahead.

### Step 1 — Local environment setup (Day 1–2)

- Install Python 3.11+, Node 20+, Docker Desktop
- Set up a `docker-compose.yml` with Postgres, Redis, Meilisearch running locally
- Create the FastAPI project with the folder structure from Part 3
- Verify you can run the server locally with `uvicorn app.main:app --reload`
- Set up `.env` file for secrets (never commit this)

### Step 2 — Database foundation (Day 2–4)

- Write all SQLAlchemy models for the 4 entities in Part 2
- Run your first Alembic migration to create the tables
- Write seed data scripts (fake users, fake journals) so you always have data to work with
- Verify with a Postgres client (TablePlus or DBeaver) that tables look right

This is the most important step. Spend extra time here. A bad data model costs weeks later.

### Step 3 — Auth (Day 4–6)

- Implement email/password registration and login
- Issue JWT access tokens on login (short lived: 15 mins)
- Issue refresh tokens (long lived: 30 days, stored in Postgres)
- Add Google OAuth (easier than it sounds with `authlib`)
- Add auth middleware to FastAPI — any route that needs a logged-in user uses a `current_user` dependency

Test this manually with Postman or the FastAPI `/docs` page before moving on.

### Step 4 — Journal CRUD (Day 6–10)

- POST /journals — create a journal entry for today
- GET /journals — list all entries for the current user (ordered by day_number)
- GET /journals/{id} — single entry
- PATCH /journals/{id} — update content, mood, tags
- DELETE /journals/{id} — soft delete (set a deleted_at field, never hard delete)

Business logic to handle:
- A user can only have one journal per calendar day
- day_number is auto-assigned as (count of their existing journals + 1)
- Saving a journal with is_complete = true triggers the streak update

### Step 5 — Streak logic (Day 10–12)

This runs as a background task (Celery), not in the request cycle.

Logic:
1. At midnight (user's local time), check if they completed a journal today
2. If yes: increment current_streak, update last_journal_date
3. If no: reset current_streak to 0, record streak_broken_at
4. Always keep longest_streak updated

Edge case to handle: users in different timezones. Store journal dates in UTC but compare against the user's timezone offset.

### Step 6 — Media uploads (Day 12–14)

- Endpoint: POST /media/presign — takes a filename and content type, returns an R2 presigned URL + the final image URL
- Endpoint: POST /media/confirm — called after client uploads, updates the journal with the image URL
- Set max image size (5MB is reasonable)
- Set allowed types (jpg, png, webp, heic)

### Step 7 — Search (Day 14–16)

- Set up Meilisearch index called `journals`
- Index fields: title, content, tags, mood, created_at, user_id
- Add a background task that indexes every journal when it's saved
- Endpoint: GET /search?q=&mood=&from_date=&to_date= — searches Meilisearch, filters by user_id

### Step 8 — Sharing (Day 16–18)

- Endpoint: POST /journals/{id}/share — creates a share link with a random token
- Endpoint: GET /share/{token} — public, returns the journal if it's not private
- Share link generates a URL like: yourapp.com/j/abc123
- The Next.js web app renders that URL as a beautiful readable page
- OG image: a card with the journal title, mood, date, and a background from the user's level map

### Step 9 — Mobile app (Day 18–30)

Now that the API works, build the mobile app. Screens in order of importance:

1. **Level map screen** (home) — the hero feature, spend the most time here
2. **Journal editor screen** — text, mood picker, image upload
3. **Login / signup screens**
4. **Single journal view screen**
5. **Search screen**
6. **Settings / profile screen**

For the level map: use React Native's `FlatList` or a custom `ScrollView` with a path rendered via SVG (`react-native-svg`). Each node is a circle or icon that is either locked, unlocked, or active.

### Step 10 — Polish and prepare for launch (Day 30–40)

- Error handling everywhere (what happens if the upload fails? if Meilisearch is down?)
- Loading states and skeleton screens in the app
- Push notifications: "Don't forget to journal today" (daily reminder at a user-set time)
- Onboarding flow (the first 3 screens a new user sees)
- App Store / Play Store submission (takes 1–3 days for review)
- Set up Sentry for error tracking
- Set up simple analytics (how many journals created per day)

---

## Part 5 — Decisions to make before Day 1

These will block you if you don't decide them upfront:

**1. What is "a day"?**
Is it a calendar day (midnight to midnight) or a 24-hour window from first open? Recommendation: calendar day in the user's timezone.

**2. Can users backfill missed days?**
If they miss Day 5, can they come back on Day 7 and fill it in? If yes, it breaks the "future days locked" model. Recommendation: no backfill in MVP — missing a day breaks the streak but the map skips that slot (shown as a "missed" level in gray).

**3. What happens to the streak at the exact stroke of midnight?**
Give users until 3am. Set the "day" as midnight to midnight but with a 3am grace period. People journal before bed.

**4. Is the day number the calendar date or the count of journals?**
If someone joins and journals on Jan 1, skips Jan 2, and journals on Jan 3 — are they on Day 2 or Day 3?
Recommendation: Day 2. day_number is the count of journals, not the calendar day. This makes the level map a clean progression with no gaps.

**5. What is the share URL structure?**
Pick this now because it's hard to change:
- `app.com/j/{token}` — short and clean
- `app.com/@{username}/{day_number}` — readable, reveals the level number

---

## Part 6 — Phases after MVP

### Phase 2 — Social (3–6 months post-launch)
- Follow other users
- Friends feed (see journals friends have made public)
- Reactions (not full comments yet — too complex to moderate)
- Collections (group journals into "College Life", "2024 Travel", etc.)

### Phase 3 — AI (6–12 months post-launch)
Connect the Claude API. Specific things that are genuinely useful:
- Monthly summary: "In November, you wrote 22 entries. Your most common mood was grateful. Your most written-about topic was work."
- "Ask your journal": chat interface that can answer "What was I feeling about my job in March?"
- Writing prompts: when a user opens the editor and stares at blank screen, suggest a prompt based on their recent entries
- Life timeline: auto-generated milestone view from the AI reading all your journals

---

## Quick reference — what you need accounts for before Day 1

| Service | What for | Free tier |
|---|---|---|
| GitHub | Code hosting, CI/CD | Yes |
| Railway | Backend hosting | $5/mo (after free trial) |
| Vercel | Web frontend | Yes |
| Cloudflare R2 | Image storage | 10GB free |
| Expo | Mobile build + distribution | Yes |
| Sentry | Error tracking | Yes (5k events/mo) |
| Google Cloud Console | Google OAuth | Yes |
| Apple Developer | iOS App Store | $99/yr |
| Google Play Console | Android Play Store | $25 one-time |

---

## The one rule

**Ship the level map working on a phone before you build anything in Phase 2.**

Every feature you add before that moment is a distraction. The level map is why someone would choose Life Levels over Apple Notes or Notion. Make it beautiful, make it fast, make it feel like progress. Then build everything else.
