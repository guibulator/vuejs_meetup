# Vue.js Meetup - Live Voting System

A real-time voting system for Vue.js presentations, built with Nuxt 4 and Supabase.

Attendees can scan a QR code to vote on questions during your presentation, with live results displayed in real-time!

## Features

- Simple Yes/No voting interface
- Real-time vote count updates via Supabase Realtime
- Flexible question management via API
- Mobile-friendly design
- Duplicate vote prevention
- Easy Vercel deployment

## Tech Stack

- **Frontend**: Nuxt 4 + Vue 3
- **Backend**: Nuxt Server Routes
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime
- **Hosting**: Vercel

---

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned

### 2. Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `supabase/schema.sql`
3. Click **Run** to create the tables

This creates:
- `questions` table: Stores your poll questions
- `votes` table: Stores all votes with real-time enabled

### 3. Get Your API Keys

1. Go to **Project Settings** > **API**
2. Copy these values:
   - **Project URL** > `SUPABASE_URL`
   - **anon public** key > `SUPABASE_ANON_KEY`
   - **service_role** key > `SUPABASE_SERVICE_KEY`

### 4. Configure Environment Variables

#### For Local Development:

Create a `.env` file in the project root:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
```

#### For Vercel:

1. Go to your Vercel project > **Settings** > **Environment Variables**
2. Add these three variables with your Supabase values

### 5. Run Locally

```bash
pnpm install
pnpm dev
```

---

## API Reference

### Questions

#### List all questions
```
GET /api/questions
```

#### Get a specific question
```
GET /api/questions/:id
```

#### Create a new question
```
POST /api/questions
Content-Type: application/json

{
  "slide_number": 5,
  "question_text": "Have you used Vue.js 3 Composition API?",
  "active": true
}
```

#### Update a question
```
PATCH /api/questions/:id
Content-Type: application/json

{
  "active": false
}
```

### Votes

#### Submit a vote
```
POST /api/votes
Content-Type: application/json

{
  "question_id": "uuid-of-question",
  "answer": "yes",
  "voter_id": "optional-unique-id"
}
```

#### Get vote counts
```
GET /api/votes/:questionId

Response:
{
  "yes": 42,
  "no": 13,
  "total": 55
}
```

---

## Creating Questions for Your Presentation

You can create questions using curl or any API client:

```bash
curl -X POST https://vuejs-meetup.vercel.app/api/questions \
  -H "Content-Type: application/json" \
  -d '{"slide_number": 1, "question_text": "Are you excited about Vue.js?"}'
```

Or directly in Supabase SQL Editor:

```sql
INSERT INTO questions (slide_number, question_text) VALUES
  (1, 'Are you enjoying this presentation?'),
  (5, 'Have you used Vue.js 3 Composition API?'),
  (10, 'Would you use Supabase Realtime?');
```

---

## URLs for Your Presentation

Once deployed, you'll have these URLs:

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Lists all active questions |
| Vote | `/vote/:id` | Voting page (share via QR code) |
| Thanks | `/thanks/:id` | Results page with live updates |

### QR Code Tips

Generate a QR code pointing to `/vote/:question-id` for each question.

---

## Integration with Slidev

In your Slidev presentation, you can embed the results page or show a QR code image.

---

## Troubleshooting

### Realtime not working?

Make sure you ran the SQL that enables realtime:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE votes;
```

### 409 Conflict Error

This means the user has already voted on this question.

---

## License

MIT - Built with love for the Vue.js community
