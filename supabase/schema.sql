-- Vue.js Meetup Live Voting System
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Questions table (supports multiple choice)
CREATE TABLE questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slide_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '["Yes", "No"]',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes table
CREATE TABLE votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  voter_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate votes from same voter on same question
  UNIQUE(question_id, voter_id)
);

-- Create indexes for better performance
CREATE INDEX idx_votes_question_id ON votes(question_id);
CREATE INDEX idx_questions_active ON questions(active);
CREATE INDEX idx_questions_slide_number ON questions(slide_number);

-- Enable Row Level Security (RLS)
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Policies for questions table
CREATE POLICY "Questions are viewable by everyone" 
  ON questions FOR SELECT 
  USING (true);

CREATE POLICY "Questions can be inserted by service role" 
  ON questions FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Questions can be updated by service role" 
  ON questions FOR UPDATE 
  USING (true);

-- Policies for votes table
CREATE POLICY "Votes are viewable by everyone" 
  ON votes FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can vote" 
  ON votes FOR INSERT 
  WITH CHECK (true);

-- Example questions:
-- Yes/No question (default options):
-- INSERT INTO questions (slide_number, question_text) VALUES (1, 'Are you enjoying this presentation?');

-- Multiple choice question:
-- INSERT INTO questions (slide_number, question_text, options) VALUES 
--   (5, 'What is your favorite Vue feature?', '["Composition API", "Reactivity", "SFC", "Ecosystem"]');
