export interface UserInfo {
  MSSV: string;
  avatar: string;
  createdAt: string;
  dateJoin: string;
  description: string;
  dob: string;
  email: string;
  firstname: string;
  gen: number;
  hometown: string;
  isAdmin: boolean;
  isExcellent: boolean;
  job: string;
  leetcodeUsername?: string;
  lastname: string;
  nickname: string;
  phone: string;
  school: string;
  slug: string;
  updatedAt: string;
  workplace: string;
  profileVisibility?: ProfileVisibility;
  __v: number;
  _id: string;

  departments: UserEnum[];
  favourites: string[];
  skills: string[];
  majorId: UserEnum;
  positionId: UserEnum;
  socials: Social[];

  acSubmissionList: Submissoion[];
}

/**
 * Member-controlled visibility for optional profile details.
 * Any missing key is treated as private by the UI and API contract.
 */
export interface ProfileVisibility {
  description?: boolean;
  email?: boolean;
  phone?: boolean;
  nickname?: boolean;
  MSSV?: boolean;
  dob?: boolean;
  hometown?: boolean;
  job?: boolean;
  school?: boolean;
  workplace?: boolean;
  socials?: boolean;
  skills?: boolean;
  favourites?: boolean;
  leetcode?: boolean;
}

/**
 * Shape returned by the public member directory. It intentionally excludes
 * database identifiers and private contact/profile fields.
 */
export interface PublicMemberInfo {
  avatar?: string;
  firstname?: string;
  lastname?: string;
  gen?: number;
  /** Opaque, server-issued identifier allowed in public profile URLs. */
  profileKey?: string;
  positionId?: Pick<UserEnum, "constant"> | null;
}

export interface Submissoion {
  date: string,
  id: string,
  timestamp: string;
  title: string;
  titleSlug: string;
  _id: string;
}

export interface UserEnum {
  constant: string;
  createdAt: string;
  name: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

export interface Social {
  socialId: UserEnum;
  url: string;
  _id: string;
}
