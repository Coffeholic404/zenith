import { api } from './api';

// Plane interface based on API response structure
export interface Plane {
  uniqueID: string;
  name: string;
  licenseNumber: string;
  activitiesCount: number;
  createdAt: string;
}

// Request/Response types for CRUD operations
export interface GetPlanesRequest {
  pageNumber?: number;
  pageSize?: number;
  searchQuery?: string;
}

export interface GetPlanesResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: {
    data: Plane[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    searchQuery: string | null;
  };
}

export interface CreatePlaneRequest {
  name: string;
  licenseNumber: string;
}

export interface CreatePlaneResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: Plane;
}

export interface UpdatePlaneRequest {
  uniqueID: string;
  name: string;
  licenseNumber: string;
}

export interface UpdatePlaneResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: Plane;
}

export interface DeletePlaneRequest {
  uniqueID: string;
}

export interface DeletePlaneResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: null;
}

export interface GetPlaneByIdRequest {
  uniqueID: string;
}

export interface GetPlaneByIdResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: Plane;
}

// API endpoints
export const planeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/Plane - Get all planes with pagination
    getPlanes: builder.query<GetPlanesResponse, GetPlanesRequest>({
      query: ({ pageNumber = 1, pageSize = 10, searchQuery }) => ({
        url: '/api/Plane',
        method: 'GET',
        params: {
          pageNumber,
          pageSize,
          ...(searchQuery && { searchQuery }),
        },
      }),
      providesTags: ['Plane'],
    }),

    // POST /api/Plane - Create a new plane
    createPlane: builder.mutation<CreatePlaneResponse, CreatePlaneRequest>({
      query: (body) => ({
        url: '/api/Plane',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Plane'],
    }),

    // PUT /api/Plane/{id} - Update an existing plane
    updatePlane: builder.mutation<UpdatePlaneResponse, UpdatePlaneRequest>({
      query: ({ uniqueID, ...body }) => ({
        url: `/api/Plane/${uniqueID}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Plane'],
    }),

    // DELETE /api/Plane/{id} - Delete a plane
    deletePlane: builder.mutation<DeletePlaneResponse, DeletePlaneRequest>({
      query: ({ uniqueID }) => ({
        url: `/api/Plane/${uniqueID}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Plane'],
    }),

    // GET /api/Plane/{id} - Get plane by ID
    getPlaneById: builder.query<GetPlaneByIdResponse, GetPlaneByIdRequest>({
      query: ({ uniqueID }) => ({
        url: `/api/Plane/${uniqueID}`,
        method: 'GET',
      }),
      providesTags: ['Plane'],
    }),
  }),
});

// Export hooks for use in React components
export const {
  useGetPlanesQuery,
  useCreatePlaneMutation,
  useUpdatePlaneMutation,
  useDeletePlaneMutation,
  useGetPlaneByIdQuery,
} = planeApi;