import { api } from './api';

// Unit entity interface based on API response
export interface Unit {
  id: string;
  unitName: string;
  volume: number;
  createdAt: string;
  itemsCount: number;
}

// Request types
export interface GetUnitsRequest {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  isDescending?: boolean;
  searchQuery?: string;
}

export interface GetUnitByIdRequest {
  id: string;
}

export interface CreateUnitRequest {
  unitName: string;
  volume: number;
}

export interface UpdateUnitRequest {
  id: string;
  unitName: string;
  volume: number;
}

export interface DeleteUnitRequest {
  id: string;
}

// Response types
export interface GetUnitsResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: {
    data: Unit[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    searchQuery: string | null;
  };
}

export interface UnitResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: Unit;
}

export interface UnitDeleteResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: null;
}

// API endpoints for Unit
export const unitApi = api.injectEndpoints({
  endpoints: builder => ({
    // GET /api/Unit - List units with pagination, sorting, and search
    getUnitsList: builder.query<GetUnitsResponse, GetUnitsRequest>({
      query: ({ pageNumber = 1, pageSize = 10, sortBy, isDescending, searchQuery }) => ({
        url: '/api/Unit',
        method: 'GET',
        params: {
          PageNumber: pageNumber,
          PageSize: pageSize,
          ...(sortBy && { SortBy: sortBy }),
          ...(isDescending !== undefined && { IsDescending: isDescending }),
          ...(searchQuery && { SearchQuery: searchQuery })
        }
      }),
      providesTags: ['getUnits']
    }),

    // GET /api/Unit/{id} - Get unit by ID
    getUnitById: builder.query<UnitResponse, GetUnitByIdRequest>({
      query: ({ id }) => ({
        url: `/api/Unit/${id}`,
        method: 'GET'
      }),
      providesTags: ['getUnitsByID']
    }),

    // POST /api/Unit - Create a new unit
    createUnit: builder.mutation<UnitResponse, CreateUnitRequest>({
      query: body => ({
        url: '/api/Unit',
        method: 'POST',
        body
      }),
      invalidatesTags: ['getUnits']
    }),

    // PUT /api/Unit/{id} - Update an existing unit
    updateUnit: builder.mutation<UnitResponse, UpdateUnitRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/Unit/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['getUnits', 'getUnitsByID']
    }),

    // DELETE /api/Unit/{id} - Delete a unit
    deleteUnit: builder.mutation<UnitDeleteResponse, DeleteUnitRequest>({
      query: ({ id }) => ({
        url: `/api/Unit/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['getUnits']
    })
  })
});

// Hooks
export const {
  useGetUnitsListQuery,
  useGetUnitByIdQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation
} = unitApi;
