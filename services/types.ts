import { api } from './api';

// Types entity interface based on API response
export interface TypeItem {
  uniqueID: string;
  name: string;
  coursesCount?: number;
  activitiesCount?: number;
  createdAt?: string;
}

// Request/Response types
export interface GetTypesRequest {
  pageNumber?: number;
  pageSize?: number;
  searchQuery?: string;
}

export interface GetTypesResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: {
    data: TypeItem[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    searchQuery: string | null;
  };
}

export interface CreateTypeRequest {
  name: string;
}

export interface CreateTypeResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: TypeItem;
}

export interface UpdateTypeRequest {
  uniqueID: string;
  name: string;
}

export interface UpdateTypeResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: TypeItem;
}

export interface DeleteTypeRequest {
  uniqueID: string;
}

export interface DeleteTypeResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: null;
}

export interface GetTypeByIdRequest {
  uniqueID: string;
}

export interface GetTypeByIdResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: TypeItem;
}

export interface GetTypeSelectResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: Array<{ uniqueID: string; name: string }>;
}

export interface GetTypeStatisticsResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  // Stats shape may vary; keep flexible to avoid mismatch
  result: Record<string, number>;
}

// API endpoints for Types
export const typesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/Types - list with pagination and optional search
    getTypes: builder.query<GetTypesResponse, GetTypesRequest>({
      query: ({ pageNumber = 1, pageSize = 10, searchQuery }) => ({
        url: '/api/Types',
        method: 'GET',
        params: {
          pageNumber,
          pageSize,
          ...(searchQuery && { searchQuery }),
        },
      }),
      providesTags: ['Types'],
    }),

    // POST /api/Types - create new type
    createType: builder.mutation<CreateTypeResponse, CreateTypeRequest>({
      query: (body) => ({
        url: '/api/Types',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Types'],
    }),

    // PUT /api/Types/{id} - update type
    updateType: builder.mutation<UpdateTypeResponse, UpdateTypeRequest>({
      query: ({ uniqueID, ...body }) => ({
        url: `/api/Types/${uniqueID}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Types'],
    }),

    // DELETE /api/Types/{id} - delete type
    deleteType: builder.mutation<DeleteTypeResponse, DeleteTypeRequest>({
      query: ({ uniqueID }) => ({
        url: `/api/Types/${uniqueID}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Types'],
    }),

    // GET /api/Types/{id} - get type by ID
    getTypeById: builder.query<GetTypeByIdResponse, GetTypeByIdRequest>({
      query: ({ uniqueID }) => ({
        url: `/api/Types/${uniqueID}`,
        method: 'GET',
      }),
      providesTags: ['Types'],
    }),

    // GET /api/Types/select - select list
    getTypeSelect: builder.query<GetTypeSelectResponse, void>({
      query: () => ({
        url: '/api/Types/select',
        method: 'GET',
      }),
      providesTags: ['Types'],
    }),

    // GET /api/Types/statistics - stats
    getTypeStatistics: builder.query<GetTypeStatisticsResponse, void>({
      query: () => ({
        url: '/api/Types/statistics',
        method: 'GET',
      }),
      providesTags: ['Types'],
    }),
  }),
});

// Hooks
export const {
  useGetTypesQuery,
  useCreateTypeMutation,
  useUpdateTypeMutation,
  useDeleteTypeMutation,
  useGetTypeByIdQuery,
  useGetTypeSelectQuery,
  useGetTypeStatisticsQuery,
} = typesApi;