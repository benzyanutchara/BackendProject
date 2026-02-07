-- Election System Database Schema
-- Migration 001: Initial Setup

-- Create ENUM type for user roles
CREATE TYPE user_role AS ENUM ('VOTER', 'EC');

-- 1. Admin (System Administrator)
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Constituency (เขตเลือกตั้ง)
CREATE TABLE constituencies (
  id SERIAL PRIMARY KEY,
  province VARCHAR(255) NOT NULL,
  district_number INT NOT NULL,
  is_closed BOOLEAN DEFAULT FALSE,
  UNIQUE(province, district_number)
);

-- 3. User (Voters & EC Staff)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  national_id VARCHAR(13) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  title VARCHAR(50) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  role user_role DEFAULT 'VOTER',
  constituency_id INT NOT NULL REFERENCES constituencies(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Party (พรรคการเมือง)
CREATE TABLE parties (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  logo_url VARCHAR(500) NOT NULL,
  policy TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Candidate (ผู้สมัคร)
CREATE TABLE candidates (
  id SERIAL PRIMARY KEY,
  title VARCHAR(50) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  number INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  party_id INT NOT NULL REFERENCES parties(id),
  constituency_id INT NOT NULL REFERENCES constituencies(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(constituency_id, number)
);

-- 6. Vote (ผลคะแนน)
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id),
  candidate_id INT NOT NULL REFERENCES candidates(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_national_id ON users(national_id);
CREATE INDEX idx_users_constituency_id ON users(constituency_id);
CREATE INDEX idx_candidates_constituency_id ON candidates(constituency_id);
CREATE INDEX idx_candidates_party_id ON candidates(party_id);
CREATE INDEX idx_votes_candidate_id ON votes(candidate_id);
