import { constants } from "@/settings";
import webStorageClient from "@/utils/webStorageClient";
import { isAuthEndpoint, refreshSession } from "@/utils/sessionRefresh";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: constants.API_SERVER,
  // Send httpOnly session cookies; the server also accepts the legacy header.
  credentials: "include",
  prepareHeaders: (headers) => {
    const accessToken = webStorageClient.getToken();

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return headers;
  },
});

const redirectToSignIn = () => {
  webStorageClient.removeAll();
  if (
    typeof window !== "undefined" &&
    !window.location.pathname.includes("/sign-in") &&
    !window.location.pathname.includes("/sign-up")
  ) {
    const currentPath = window.location.pathname;
    const locale = currentPath.split("/")[1] || "vi";
    window.location.href = `/${locale}/sign-in?redirect=${encodeURIComponent(
      currentPath
    )}`;
  }
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const url = typeof args === "string" ? args : args.url;
  let result = await rawBaseQuery(args, api, extraOptions);

  // One silent refresh attempt before giving up (never for auth endpoints).
  if (result.error && result.error.status === 401 && !isAuthEndpoint(url)) {
    if (await refreshSession()) {
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  if (result.error && result.error.status === 401) {
    // Session token expired or invalid: clear credentials and redirect to sign-in
    redirectToSignIn();
  }

  return result;
};

export const baseApi = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Profile", "Gamification", "Notifications", "Leaderboard"],
  endpoints: () => ({}),
});
