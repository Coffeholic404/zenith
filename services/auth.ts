import { api } from "./api";
export const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    signin: build.mutation<any, { email: string; password: string }>({
      query: (body: { email: string; password: string }) => ({
        url: "/User/login",
        method: "POST",
        credentials: "include",
        body,
      }),
      invalidatesTags: ["Admin", "addAdmin"],
    }),
    LogOut: build.mutation<any, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["logout"],
    }),
    refresh: build.mutation<any, void>({
      query: () => ({
        url: `/auth/refresh`,
        method: "POST",
      }),
      invalidatesTags: ["refresh"],
    }),
  }),
});
// Export hooks for usage in functional components

export const { useRefreshMutation, useSigninMutation, useLogOutMutation } =
  usersApi;

export const { refresh, signin } = usersApi.endpoints;
