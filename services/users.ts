import { api } from './api';

// User Types
export interface User {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  role: string;
}

// Request Types
export interface GetUsersRequest {
  pageNumber?: number;
  pageSize?: number;
  searchQuery?: string;
}

export interface GetUserByIdRequest {
  id: string;
}

export interface UpdateUserRequest {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface UpdatePasswordRequest {
  id: string;
  currentPassword: string;
  newPassword: string;
}

export interface DeleteUserRequest {
  id: string;
}

export interface UploadProfileImageRequest {
  id: string;
  file: File;
}

// Response Types
export interface UsersResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: {
    data: User[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    searchQuery: string | null;
  };
}

export interface UserResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: User;
}

export interface ApiResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: null;
}

// API Endpoints
export const usersApi = api.injectEndpoints({
  endpoints: builder => ({
    // GET /api/User - Get all users with pagination
    getUsers: builder.query<UsersResponse, GetUsersRequest>({
      query: ({ pageNumber = 1, pageSize = 10, searchQuery }) => ({
        url: '/api/User',
        method: 'GET',
        params: {
          pageNumber,
          pageSize,
          ...(searchQuery && { searchQuery })
        }
      }),
      providesTags: ['getUsers']
    }),

    // GET /api/User/{id} - Get user by ID
    getUserById: builder.query<UserResponse, GetUserByIdRequest>({
      query: ({ id }) => ({
        url: `/api/User/${id}`,
        method: 'GET'
      }),
      providesTags: ['getUsersByID']
    }),

    // PUT /api/User/{id} - Update user
    updateUser: builder.mutation<UserResponse, UpdateUserRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/User/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['getUsers', 'getUsersByID']
    }),

    // DELETE /api/User/{id} - Delete user
    deleteUser: builder.mutation<ApiResponse, DeleteUserRequest>({
      query: ({ id }) => ({
        url: `/api/User/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['getUsers', 'deleteUsers']
    }),

    // PUT /api/User/{id}/update-password - Update password
    updatePassword: builder.mutation<ApiResponse, UpdatePasswordRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/User/${id}/update-password`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['getUsers', 'getUsersByID']
    }),

    // POST /api/User/{id}/profile-image - Upload profile image
    uploadProfileImage: builder.mutation<UserResponse, UploadProfileImageRequest>({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `/api/User/${id}/profile-image`,
          method: 'POST',
          body: formData
        };
      },
      invalidatesTags: ['getUsers', 'getUsersByID']
    })
  })
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdatePasswordMutation,
  useUploadProfileImageMutation
} = usersApi;
