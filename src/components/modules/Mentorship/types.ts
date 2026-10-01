"use client";

// TODO(i18n): move all hardcoded Vietnamese strings in this module to locale JSON files.

export interface Mentor {
  _id: string;
  name: string;
  headline?: string;
  bio?: string;
  quote?: string;
  workplace?: string;
  avatar?: string;
  graduationGen?: string;
  mentoringTopics?: string[];
}

export type MentorshipRequestStatus = "pending" | "accepted" | "declined";

export interface MentorshipRequest {
  _id: string;
  mentor?: { _id?: string; name?: string } | string | null;
  mentorName?: string;
  topic?: string;
  message?: string;
  status: MentorshipRequestStatus;
  createdAt?: string;
}

/** Backend wraps lists as `{ data: [...] }`; tolerate a bare array as well. */
export function toArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object" && Array.isArray((payload as { data?: unknown }).data)) {
    return (payload as { data: T[] }).data;
  }
  return [];
}

export function getMentorIdOf(request: MentorshipRequest): string {
  if (typeof request.mentor === "string") return request.mentor;
  return request.mentor?._id ?? "";
}

export function getMentorNameOf(request: MentorshipRequest): string {
  if (typeof request.mentor === "object" && request.mentor?.name) return request.mentor.name;
  if (request.mentorName) return request.mentorName;
  if (typeof request.mentor === "string") return request.mentor;
  return "Mentor";
}
