import { api } from './api';

// Request Types
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

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

// API Endpoints
export const accountApi = api.injectEndpoints({
  endpoints: build => ({
    // POST /api1/account/register
    register: build.mutation<AuthResponse, RegisterRequest>({
      query: credentials => ({
        url: '/api/Account/register',
        method: 'POST',
        body: credentials
      })
    }),

    // POST /api1/account/login
    login: build.mutation<AuthResponse, LoginRequest>({
      query: credentials => ({
        url: '/api/Account/login',
        method: 'POST',
        body: credentials
      })
    }),

    // POST /api1/account/refresh-token
    refreshToken: build.mutation<AuthResponse, RefreshTokenRequest>({
      query: body => ({
        url: '/api/Account/refresh-token',
        method: 'POST',
        body
      }),
      invalidatesTags: ['refresh']
    }),

    // POST /api1/account/logout
    logout: build.mutation<void, void>({
      query: () => ({
        url: '/api/Account/logout',
        method: 'POST'
      }),
      invalidatesTags: ['logout']
    })
  })
});

export const { useRegisterMutation, useLoginMutation, useRefreshTokenMutation, useLogoutMutation } = accountApi;
