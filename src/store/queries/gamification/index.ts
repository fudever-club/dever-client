"use client";

import { endpointGamification } from "@/helpers/enpoints";
import { baseApi } from "../base";

export const gamificationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMyGamificationStats: build.query<any, void>({
      query: () => endpointGamification.MY_STATS,
      providesTags: ["Gamification"],
    }),
    dailyCheckin: build.mutation<any, void>({
      query: () => ({
        url: endpointGamification.DAILY_CHECKIN,
        method: "POST",
      }),
      invalidatesTags: ["Gamification"],
    }),
    getHallOfFame: build.query<any, void>({
      query: () => endpointGamification.HALL_OF_FAME,
    }),
  }),
});

export const {
  useGetMyGamificationStatsQuery,
  useDailyCheckinMutation,
  useGetHallOfFameQuery,
} = gamificationApi;
