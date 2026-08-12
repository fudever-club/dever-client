"use client";

import { endpointEcosystem } from "@/helpers/enpoints";
import { baseApi } from "../base";

export const ecosystemApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getEvents: build.query<any, void>({
      query: () => ({ url: endpointEcosystem.EVENTS, method: "GET", flashError: true }),
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
  }),
});

export const {
  useGetEventsQuery,
  useGetResourcesQuery,
  useGetBlogsQuery,
  useGetProjectLabsQuery,
} = ecosystemApi;
