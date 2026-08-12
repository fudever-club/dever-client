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
