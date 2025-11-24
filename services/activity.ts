import { api } from './api';

export interface ActivityJumper {
  co_St_TrId: string;
  jumperCount: number;
  freefallTime: number;
  freefallAltitude: number;
  deployAltitude: number;
  exitAltitude: number;
  landings: string;
  typeOfJump: string;
  trainer1Id?: string;
  trainer1Note?: string;
  trainer2Id?: string;
  trainer2Note?: string;
  trainer3Id?: string;
  trainer3Note?: string;
}

export interface ActivityJumperWithId extends ActivityJumper {
  id: string; // jumperId from API response
  activityId?: string;
  trainer1Name?: string;
  trainer2Name?: string;
  trainer3Name?: string;
}

export interface ActivityItem {
 uniqueID: string,
    courseId: string,
    courseName: string,
    placeId: string,
    placeName: string,
    planeId: string,
    planeName: string,
    typeId: string | undefined,
    typeName: string | undefined,
    date: string,
    time: string,
    windSpeed: string,
    jumpersCount: number,
    accidentsCount: number,
  jumpers: ActivityJumperWithId[];
  createdAt?: string;
}

export interface GetActivitiesRequest {
  pageNumber?: number;
  pageSize?: number;
  searchQuery?: string;
}

export interface GetActivitiesResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: {
    data: ActivityItem[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    searchQuery: string | null;
  };
}

export interface CreateActivityRequest {
  courseId: string;
  placeId: string;
  planeId: string;
  typeId: string;
  date: string;
  time: string;
  windSpeed: string;
  jumpers: ActivityJumper[];
}

export interface CreateActivityResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: ActivityItem;
}

export interface ActivityJumperToUpdate extends ActivityJumper {
  jumperId: string;
}

export interface UpdateActivityRequest {
  uniqueID: string;
  courseId: string | undefined;
  placeId: string | undefined;
  planeId: string | undefined;
  typeId: string | undefined;
  date: string;
  time: string;
  windSpeed: string;
  jumpersToAdd: ActivityJumper[];
  jumpersToUpdate: ActivityJumperToUpdate[];
  jumpersToDelete: string[];
}

export interface UpdateActivityResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: ActivityItem;
}

export interface DeleteActivityRequest {
  uniqueID: string;
}

export interface DeleteActivityResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: boolean | null;
}

export interface GetActivityByIdRequest {
  uniqueID: string;
}

export interface GetActivityByIdResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: ActivityItem;
}

export interface ActivitySelectItem {
  uniqueID: string;
  name: string;
}

export interface GetActivitySelectResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: ActivitySelectItem[];
}

export interface GetActivityStatisticsResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: Record<string, number>;
}

export interface GetActivitiesByDateRequest {
  date: string; // expected format e.g. '2025-11-16'
}

export interface GetActivitiesByDateResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: ActivityItem[];
}

export const activityApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/Activity - list activities
    getActivities: builder.query<GetActivitiesResponse, GetActivitiesRequest>({
      query: ({ pageNumber = 1, pageSize = 10, searchQuery }) => ({
        url: '/api/Activity',
        method: 'GET',
        params: {
          pageNumber,
          pageSize,
          ...(searchQuery && { searchQuery }),
        },
      }),
      providesTags: ['Activity'],
    }),

    // GET /api/Activity/{id}
    getActivityById: builder.query<GetActivityByIdResponse, GetActivityByIdRequest>({
      query: ({ uniqueID }) => ({
        url: `/api/Activity/${uniqueID}`,
        method: 'GET',
      }),
      providesTags: ['Activity'],
    }),

    // POST /api/Activity
    createActivity: builder.mutation<CreateActivityResponse, CreateActivityRequest>({
      query: (body) => ({
        url: '/api/Activity',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Activity'],
    }),

    // PUT /api/Activity/{id}
    updateActivity: builder.mutation<UpdateActivityResponse, UpdateActivityRequest>({
      query: ({ uniqueID, ...body }) => ({
        url: `/api/Activity/${uniqueID}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Activity'],
    }),

    // DELETE /api/Activity/{id}
    deleteActivity: builder.mutation<DeleteActivityResponse, DeleteActivityRequest>({
      query: ({ uniqueID }) => ({
        url: `/api/Activity/${uniqueID}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Activity'],
    }),

    // GET /api/Activity/select
    getActivitySelect: builder.query<GetActivitySelectResponse, void>({
      query: () => ({
        url: '/api/Activity/select',
        method: 'GET',
      }),
      providesTags: ['Activity'],
    }),

    // GET /api/Activity/statistics
    getActivityStatistics: builder.query<GetActivityStatisticsResponse, void>({
      query: () => ({
        url: '/api/Activity/statistics',
        method: 'GET',
      }),
      providesTags: ['Activity'],
    }),

    // GET /api/Activity/by-date/{date}
    getActivitiesByDate: builder.query<GetActivitiesByDateResponse, GetActivitiesByDateRequest>({
      query: ({ date }) => ({
        url: `/api/Activity/by-date/${date}`,
        method: 'GET',
      }),
      providesTags: ['Activity'],
    }),
  }),
});

export const {
  useGetActivitiesQuery,
  useGetActivityByIdQuery,
  useCreateActivityMutation,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
  useGetActivitySelectQuery,
  useGetActivityStatisticsQuery,
  useGetActivitiesByDateQuery,
} = activityApi;