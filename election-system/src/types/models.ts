// Admin
export interface Admin {
  id: number;
  username: string;
  password: string;
  created_at: Date;
}

// Constituency (เขตเลือกตั้ง)
export interface Constituency {
  id: number;
  province: string;
  district_number: number;
  is_closed: boolean;
}

// User (Voters & EC Staff)
export type UserRole = 'VOTER' | 'EC';

export interface User {
  id: string;
  national_id: string;
  password: string;
  title: string;
  first_name: string;
  last_name: string;
  address: string;
  role: UserRole;
  constituency_id: number;
  created_at: Date;
}

export interface UserWithConstituency extends User {
  province: string;
  district_number: number;
  is_closed: boolean;
}

// Party (พรรคการเมือง)
export interface Party {
  id: number;
  name: string;
  logo_url: string;
  policy: string;
  created_at: Date;
}

export interface PartyWithCandidates extends Party {
  candidates: CandidateWithConstituency[];
}

// Candidate (ผู้สมัคร)
export interface Candidate {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  number: number;
  image_url: string;
  party_id: number;
  constituency_id: number;
  created_at: Date;
}

export interface CandidateWithConstituency extends Candidate {
  province: string;
  district_number: number;
  is_closed: boolean;
}

export interface CandidateWithParty extends Candidate {
  party_name: string;
  party_logo_url: string;
}

export interface CandidateWithPartyAndVotes extends CandidateWithParty {
  vote_count: number;
}

// Vote (ผลคะแนน)
export interface Vote {
  id: string;
  user_id: string;
  candidate_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface VoteWithCandidate extends Vote {
  candidate_title: string;
  candidate_first_name: string;
  candidate_last_name: string;
  candidate_number: number;
  party_id: number;
  party_name: string;
  party_logo_url: string;
}
