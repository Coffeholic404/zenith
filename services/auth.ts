import { api } from './api';

// Request Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Response Types
export interface AuthResult {
  token: string;
  expiresAt: string;
  refreshToken: string;
}

export interface AuthResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: AuthResult;
}

export const authApi = api.injectEndpoints({
  endpoints: build => ({
    signin: build.mutation<AuthResponse, LoginRequest>({
      query: body => ({
        url: '/api/Account/login',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Admin', 'addAdmin']
    }),
    LogOut: build.mutation<void, void>({
      query: () => ({
        url: '/api/Account/logout',
        method: 'POST',
        credentials: 'include'
      }),
      invalidatesTags: ['logout']
    }),
    refreshToken: build.mutation<AuthResponse, RefreshTokenRequest>({
      query: body => ({
        url: '/api/Account/refresh-token',
        method: 'POST',
        body
      }),
      invalidatesTags: ['refresh']
    })
  })
});

// Export hooks for usage in functional components
export const { useSigninMutation, useLogOutMutation, useRefreshTokenMutation } = authApi;

export const { refreshToken, signin, LogOut } = authApi.endpoints;
