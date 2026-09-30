export interface LeetcodeSubmission {
  id?: string;
  timestamp?: string | number;
  date?: string;
  title?: string;
  titleSlug?: string;
}

export interface LeetcodeLeaderboardEntry {
  leetcodeUsername: string;
  acSubmissionList: LeetcodeSubmission[];
  user: {
    firstname?: string | null;
    lastname?: string | null;
    avatar?: string | null;
    profileKey?: string | null;
  } | null;
}

export type SeasonStatus = "upcoming" | "active" | "ended";

export interface SeasonScoring {
  easy: number;
  medium: number;
  hard: number;
}

export interface SeasonDto {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: SeasonStatus;
  scoring: SeasonScoring;
}

export interface SeasonBreakdown {
  easy: number;
  medium: number;
  hard: number;
  unknown: number;
}

export interface SeasonLeaderboardEntry {
  leetcodeUsername: string;
  user: {
    firstname?: string | null;
    lastname?: string | null;
    avatar?: string | null;
    profileKey?: string | null;
  } | null;
  solved: number;
  score: number;
  breakdown: SeasonBreakdown;
}

export interface SeasonLeaderboardData {
  season: SeasonDto;
  scoringComplete: boolean;
  entries: SeasonLeaderboardEntry[];
}
