import { api } from './api';

export interface CoStTrItem {
  uniqueID: string;
  studentName: string;
  studentCode: string;
  trainerName: string;
  courseName: string;
  courseCharacter: string;
  courseStartDate: string;
  courseStatus: string;
  hasEvaluation: boolean;
}

export interface GetCoStTrRequest {
  pageNumber?: number;
  pageSize?: number;
  searchQuery?: string;
}

export interface GetCoStTrResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: {
    data: CoStTrItem[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    searchQuery: string | null;
  };
}

export interface CreateCoStTrRequest {
  studentId: string;
  trainerId: string;
  courseId: string;
  studentCode: string;
}

export interface CreateCoStTrResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: CoStTrItem;
}

export interface UpdateCoStTrRequest {
  uniqueID: string;
  studentId: string;
  trainerId: string;
  courseId: string;
  studentCode: string;
}

export interface UpdateCoStTrResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: CoStTrItem;
}

export interface DeleteCoStTrRequest {
  uniqueID: string;
}

export interface DeleteCoStTrResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: boolean | null;
}

export interface GetCoStTrByIdRequest {
  uniqueID: string;
}

export interface GetCoStTrByIdResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: CoStTrItem;
}

export interface TrainerSelectItem {
  uniqueID: string;
  name: string;
}

export interface GetTrainersSelectResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: TrainerSelectItem[];
}

export interface GetStudentHistoryRequest {
  studentId: string;
}

export interface GetStudentHistoryResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: CoStTrItem[];
}

export interface GetTrainerCoursesRequest {
  trainerId: string;
}

export interface GetTrainerCoursesResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: CoStTrItem[];
}

export interface GetCoStTrWithoutEvaluationResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: {
    data: CoStTrItem[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    searchQuery: string | null;
  };
}

export interface GetCoStTrWithEvaluationResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: {
    data: CoStTrItem[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    searchQuery: string | null;
  };
}

export interface GetActiveCoursesResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: {
    data: CoStTrItem[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    searchQuery: string | null;
  };
}

export interface CoStTrSelectItem {
  uniqueID: string;
  name: string;
}

export interface GetCoStTrSelectResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: CoStTrSelectItem[];
}

export const coStTrApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/CoStTr - list CoStTr with pagination
    getCoStTr: builder.query<GetCoStTrResponse, GetCoStTrRequest>({
      query: ({ pageNumber = 1, pageSize = 10, searchQuery }) => ({
        url: '/api/CoStTr',
        method: 'GET',
        params: {
          pageNumber,
          pageSize,
          ...(searchQuery && { searchQuery }),
        },
      }),
      providesTags: ['CoStTr'],
    }),

    // GET /api/CoStTr/{id}
    getCoStTrById: builder.query<GetCoStTrByIdResponse, GetCoStTrByIdRequest>({
      query: ({ uniqueID }) => ({
        url: `/api/CoStTr/${uniqueID}`,
        method: 'GET',
      }),
      providesTags: ['CoStTr'],
    }),

    // POST /api/CoStTr
    createCoStTr: builder.mutation<CreateCoStTrResponse, CreateCoStTrRequest>({
      query: (body) => ({
        url: '/api/CoStTr',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CoStTr'],
    }),

    // PUT /api/CoStTr/{id}
    updateCoStTr: builder.mutation<UpdateCoStTrResponse, UpdateCoStTrRequest>({
      query: ({ uniqueID, ...body }) => ({
        url: `/api/CoStTr/${uniqueID}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['CoStTr'],
    }),

    // DELETE /api/CoStTr/{id}
    deleteCoStTr: builder.mutation<DeleteCoStTrResponse, DeleteCoStTrRequest>({
      query: ({ uniqueID }) => ({
        url: `/api/CoStTr/${uniqueID}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CoStTr'],
    }),

    // GET /api/CoStTr/trainers/select
    getTrainersSelect: builder.query<GetTrainersSelectResponse, void>({
      query: () => ({
        url: '/api/CoStTr/trainers/select',
        method: 'GET',
      }),
      providesTags: ['CoStTr'],
    }),

    // GET /api/CoStTr/student/{studentId}/history
    getStudentHistory: builder.query<GetStudentHistoryResponse, GetStudentHistoryRequest>({
      query: ({ studentId }) => ({
        url: `/api/CoStTr/student/${studentId}/history`,
        method: 'GET',
      }),
      providesTags: ['CoStTr'],
    }),

    // GET /api/CoStTr/trainer/{trainerId}/courses
    getTrainerCourses: builder.query<GetTrainerCoursesResponse, GetTrainerCoursesRequest>({
      query: ({ trainerId }) => ({
        url: `/api/CoStTr/trainer/${trainerId}/courses`,
        method: 'GET',
      }),
      providesTags: ['CoStTr'],
    }),

    // GET /api/CoStTr/without-evaluation
    getCoStTrWithoutEvaluation: builder.query<GetCoStTrWithoutEvaluationResponse, GetCoStTrRequest>({
      query: ({ pageNumber = 1, pageSize = 10, searchQuery }) => ({
        url: '/api/CoStTr/without-evaluation',
        method: 'GET',
        params: {
          pageNumber,
          pageSize,
          ...(searchQuery && { searchQuery }),
        },
      }),
      providesTags: ['CoStTr'],
    }),

    // GET /api/CoStTr/with-evaluation
    getCoStTrWithEvaluation: builder.query<GetCoStTrWithEvaluationResponse, GetCoStTrRequest>({
      query: ({ pageNumber = 1, pageSize = 10, searchQuery }) => ({
        url: '/api/CoStTr/with-evaluation',
        method: 'GET',
        params: {
          pageNumber,
          pageSize,
          ...(searchQuery && { searchQuery }),
        },
      }),
      providesTags: ['CoStTr'],
    }),

    // GET /api/CoStTr/active-courses
    getActiveCourses: builder.query<GetActiveCoursesResponse, GetCoStTrRequest>({
      query: ({ pageNumber = 1, pageSize = 10, searchQuery }) => ({
        url: '/api/CoStTr/active-courses',
        method: 'GET',
        params: {
          pageNumber,
          pageSize,
          ...(searchQuery && { searchQuery }),
        },
      }),
      providesTags: ['CoStTr'],
    }),

    // GET /api/CoStTr/select
    getCoStTrSelect: builder.query<GetCoStTrSelectResponse, void>({
      query: () => ({
        url: '/api/CoStTr/select',
        method: 'GET',
      }),
      providesTags: ['CoStTr'],
    }),
  }),
});

export const {
  useGetCoStTrQuery,
  useGetCoStTrByIdQuery,
  useCreateCoStTrMutation,
  useUpdateCoStTrMutation,
  useDeleteCoStTrMutation,
  useGetTrainersSelectQuery,
  useGetStudentHistoryQuery,
  useGetTrainerCoursesQuery,
  useGetCoStTrWithoutEvaluationQuery,
  useGetCoStTrWithEvaluationQuery,
  useGetActiveCoursesQuery,
  useGetCoStTrSelectQuery,
} = coStTrApi;
