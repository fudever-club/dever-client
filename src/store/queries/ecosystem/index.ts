"use client";

import { endpointEcosystem } from "@/helpers/enpoints";
import { baseApi } from "../base";

export const ecosystemApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getEvents: build.query<any, void>({
      query: () => ({ url: endpointEcosystem.EVENTS, method: "GET", flashError: true }),
    }),
    getMyEventTickets: build.query<any, void>({
      query: () => ({ url: endpointEcosystem.MY_TICKETS, method: "GET" }),
      providesTags: ["Notifications"],
    }),
    registerEvent: build.mutation<any, { eventId: string; data?: any }>({
      query: ({ eventId, data }) => ({
        url: endpointEcosystem.EVENT_REGISTER.replace("{id}", eventId),
        method: "POST",
        body: data || {},
      }),
      invalidatesTags: ["Notifications"],
    }),
    getResources: build.query<any, void>({
      query: () => ({ url: endpointEcosystem.RESOURCES, method: "GET", flashError: true }),
    }),
    getBlogs: build.query<any, void>({
      query: () => ({ url: endpointEcosystem.BLOGS, method: "GET", flashError: true }),
    }),
    getProjectLabs: build.query<any, void>({
      query: () => ({ url: endpointEcosystem.PROJECT_LAB, method: "GET", flashError: true }),
    }),
    submitOpenSourceProject: build.mutation<any, any>({
      query: (body) => ({
        url: endpointEcosystem.OPEN_SOURCE_SUBMIT,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Gamification"],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetMyEventTicketsQuery,
  useRegisterEventMutation,
  useGetResourcesQuery,
  useGetBlogsQuery,
  useGetProjectLabsQuery,
  useSubmitOpenSourceProjectMutation,
} = ecosystemApi;
