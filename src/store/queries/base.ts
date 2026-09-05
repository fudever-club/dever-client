import { constants } from "@/settings";
import webStorageClient from "@/utils/webStorageClient";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: constants.API_SERVER,
  prepareHeaders: (headers) => {
    const accessToken = webStorageClient.getToken();

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Session token expired or invalid: clear credentials and redirect to sign-in
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
  }

  return result;
};

export const baseApi = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Profile", "Gamification", "Notifications", "Leaderboard"],
  endpoints: () => ({}),
});
