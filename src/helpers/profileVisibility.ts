import { useAppSelector } from "@/hooks/redux-toolkit";
import webStorageClient from "@/utils/webStorageClient";
import { constants } from "@/settings";

/**
 * Mirrors the backend visibility contract (see dever-backend
 * UserModel.profileVisibility + userDto.toPublicUserDto):
 * - sensitive fields (phone, email, MSSV, dob) are visible to other members
 *   only when explicitly enabled (=== true);
 * - other optional fields are visible unless explicitly disabled (!== false);
 * - the owner and admins always see everything.
 *
 * The server is the real enforcer (it strips disallowed fields from public
 * DTOs). These helpers only make the UI honest: visitors see a "hidden"
 * state instead of a misleading "not set yet".
 */

const SENSITIVE_FIELDS = new Set(["phone", "email", "MSSV", "dob"]);

export function useProfileOwner(profileUser: any): {
  currentUserId: string;
  isAdmin: boolean;
  isOwn: boolean;
} {
  const { userInfo } = useAppSelector((state) => state.auth);
  const stored =
    typeof window !== "undefined"
      ? webStorageClient.get(constants.USER_INFO)
      : null;
  const currentUserId: string =
    (userInfo as any)?.id ||
    (userInfo as any)?._id ||
    (typeof stored === "string" ? stored : stored?._id || stored?.id) ||
    "";
  const isAdmin = Boolean((userInfo as any)?.isAdmin);
  const profileId: string = profileUser?._id || profileUser?.id || "";
  const isOwn = Boolean(
    currentUserId && profileId && currentUserId === profileId
  );
  return { currentUserId, isAdmin, isOwn };
}

export function canSeeProfileField(
  field: string,
  visibility: Record<string, boolean> | undefined,
  access: { isOwn: boolean; isAdmin: boolean }
): boolean {
  if (access.isOwn || access.isAdmin) {
    return true;
  }
  if (SENSITIVE_FIELDS.has(field)) {
    return visibility?.[field] === true;
  }
  return visibility?.[field] !== false;
}
