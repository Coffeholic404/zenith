import { api } from './api';

// TrainingCourse interface based on API response structure
export interface TrainingCourse {
  uniqueID: string;
  name: string;
  studentsCount: number;
}

// Request types for API operations
export interface CreateTrainingCourseRequest {
  name: string;
}

export interface UpdateTrainingCourseRequest {
  id: string;
  name: string;
}

export interface DeleteTrainingCourseRequest {
  uniqueID: string;
}

export interface GetTrainingCourseByIdRequest {
  uniqueID: string;
}

// Response types for API operations
export interface TrainingCoursesResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: {
    data: TrainingCourse[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    searchQuery: string | null;
  };
}

export interface TrainingCourseResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: TrainingCourse;
}

export interface CreateTrainingCourseResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: TrainingCourse;
}

export interface UpdateTrainingCourseResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: TrainingCourse;
}

export interface DeleteTrainingCourseResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: boolean;
}

// API endpoints definition
export const trainingCoursesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/TrainingCourses - Get all training courses with pagination
    getTrainingCourses: builder.query<TrainingCoursesResponse, { pageNumber?: number; pageSize?: number; searchQuery?: string }>({
      query: ({ pageNumber = 1, pageSize = 10, searchQuery = '' }) => ({
        url: '/api/TrainingCourses',
        method: 'GET',
        params: {
          pageNumber,
          pageSize,
          searchQuery,
        },
      }),
      providesTags: ['getTrainingCourse'],
    }),

    // POST /api/TrainingCourses - Create a new training course
    createTrainingCourse: builder.mutation<CreateTrainingCourseResponse, CreateTrainingCourseRequest>({
      query: (body) => ({
        url: '/api/TrainingCourses',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['getTrainingCourse', 'addTrainingCourse'],
    }),

    // PUT /api/TrainingCourses/{id} - Update an existing training course
    updateTrainingCourse: builder.mutation<UpdateTrainingCourseResponse, UpdateTrainingCourseRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/TrainingCourses/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['getTrainingCourse', 'updateTrainingCourse'],
    }),

    // DELETE /api/TrainingCourses/{id} - Delete a training course
    deleteTrainingCourse: builder.mutation<DeleteTrainingCourseResponse, DeleteTrainingCourseRequest>({
      query: ({ uniqueID }) => ({
        url: `/api/TrainingCourses/${uniqueID}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['getTrainingCourse', 'deleteTrainingCourse'],
    }),

    // GET /api/TrainingCourses/{id} - Get a specific training course by ID
    getTrainingCourseById: builder.query<TrainingCourseResponse, GetTrainingCourseByIdRequest>({
      query: ({ uniqueID }) => ({
        url: `/api/TrainingCourses/${uniqueID}`,
        method: 'GET',
      }),
      providesTags: ['getTrainingCourse'],
    }),
  }),
});

// Export hooks for use in React components
export const {
  useGetTrainingCoursesQuery,
  useCreateTrainingCourseMutation,
  useUpdateTrainingCourseMutation,
  useDeleteTrainingCourseMutation,
  useGetTrainingCourseByIdQuery,
} = trainingCoursesApi;