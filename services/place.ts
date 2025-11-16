import { api } from './api';

export interface PlaceItem {
  uniqueID: string;
  name: string;
  activitiesCount: number;
  createdAt?: string;
}

export interface GetPlacesRequest {
  pageNumber?: number;
  pageSize?: number;
  searchQuery?: string;
}

export interface GetPlacesResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: {
    data: PlaceItem[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    searchQuery: string | null;
  };
}

export interface CreatePlaceRequest {
  name: string;
}

export interface CreatePlaceResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: PlaceItem;
}

export interface UpdatePlaceRequest {
  uniqueID: string;
  name: string;
}

export interface UpdatePlaceResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: PlaceItem;
}

export interface DeletePlaceRequest {
  uniqueID: string;
}

export interface DeletePlaceResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: boolean | null;
}

export interface GetPlaceByIdRequest {
  uniqueID: string;
}

export interface GetPlaceByIdResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: PlaceItem;
}

export interface PlaceSelectItem {
  uniqueID: string;
  name: string;
}

export interface GetPlaceSelectResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: PlaceSelectItem[];
}

export interface GetPlaceStatisticsResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: Record<string, number>;
}

export const placeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/Place
    getPlaces: builder.query<GetPlacesResponse, GetPlacesRequest>({
      query: ({ pageNumber = 1, pageSize = 10, searchQuery }) => ({
        url: '/api/Place',
        method: 'GET',
        params: {
          pageNumber,
          pageSize,
          ...(searchQuery && { searchQuery }),
        },
      }),
      providesTags: ['Place'],
    }),

    // GET /api/Place/{id}
    getPlaceById: builder.query<GetPlaceByIdResponse, GetPlaceByIdRequest>({
      query: ({ uniqueID }) => ({
        url: `/api/Place/${uniqueID}`,
        method: 'GET',
      }),
      providesTags: ['Place'],
    }),

    // POST /api/Place
    createPlace: builder.mutation<CreatePlaceResponse, CreatePlaceRequest>({
      query: (body) => ({
        url: '/api/Place',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Place'],
    }),

    // PUT /api/Place/{id}
    updatePlace: builder.mutation<UpdatePlaceResponse, UpdatePlaceRequest>({
      query: ({ uniqueID, ...body }) => ({
        url: `/api/Place/${uniqueID}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Place'],
    }),

    // DELETE /api/Place/{id}
    deletePlace: builder.mutation<DeletePlaceResponse, DeletePlaceRequest>({
      query: ({ uniqueID }) => ({
        url: `/api/Place/${uniqueID}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Place'],
    }),

    // GET /api/Place/select
    getPlaceSelect: builder.query<GetPlaceSelectResponse, void>({
      query: () => ({
        url: '/api/Place/select',
        method: 'GET',
      }),
      providesTags: ['Place'],
    }),

    // GET /api/Place/statistics
    getPlaceStatistics: builder.query<GetPlaceStatisticsResponse, void>({
      query: () => ({
        url: '/api/Place/statistics',
        method: 'GET',
      }),
      providesTags: ['Place'],
    }),
  }),
});

export const {
  useGetPlacesQuery,
  useGetPlaceByIdQuery,
  useCreatePlaceMutation,
  useUpdatePlaceMutation,
  useDeletePlaceMutation,
  useGetPlaceSelectQuery,
  useGetPlaceStatisticsQuery,
} = placeApi;