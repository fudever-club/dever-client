"use client";

import { endpointSeason } from "@/helpers/enpoints";
import { baseApi } from "../base";

export const seasonApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSeasons: build.query<any, void>({
      query: () => ({
        url: endpointSeason.LIST,
        method: "GET",
        flashError: true,
      }),
      providesTags: ["Season"],
    }),
    getSeasonLeaderboard: build.query<any, { seasonId?: string } | void>({
      query: (params) => ({
        url: endpointSeason.LEADERBOARD,
        method: "GET",
        params:
          params && typeof params === "object" && params.seasonId
            ? { seasonId: params.seasonId }
            : undefined,
        flashError: true,
      }),
      providesTags: ["Season", "Leaderboard"],
    }),
  }),
});

export const { useGetSeasonsQuery, useGetSeasonLeaderboardQuery } = seasonApi;
