import { api } from './api';

// Course interface based on API response structure
export interface Course {
  uniqueID: string;
  character: string;
  startDate: string;
  endDate: string;
  typeId: string;
  status?: string;
  typeName: string;
  courseNameId: string;
}

// Request/Response types for CRUD operations
export interface GetCoursesRequest {
  pageNumber?: number;
  pageSize?: number;
  searchQuery?: string;
}

export interface CourseDetails extends Course {
  participantsCount: number;
  durationDays: number;
  participants: CourseParticipant[];
  activities?: CourseActivity[];
  activitiesCount?: number;
  courseNameText?: string;
}

export interface GetCoursesResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: {
    data: CourseDetails[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    searchQuery: string | null;
  };
}

export interface CourseTrainerStudent {
  studentId: string;
  trainerId: string;
  studentCode: string;
}

export interface CourseTrainerStudentUpdate extends CourseTrainerStudent {
  uniqueID?: string; // co_St_TrId for existing participants
}

export interface CourseParticipant {
  co_St_TrId: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  trainerId: string;
  trainerName: string;
  hasEvaluation: boolean;
}

export interface CourseActivity {
  uniqueID: string;
  courseId: string;
  courseName: string;
  placeId: string;
  placeName: string;
  planeId: string;
  planeName: string;
  typeId: string;
  typeName: string;
  date: string;
  time: string;
  windSpeed: string;
  jumpersCount: number;
  accidentsCount: number;
  createdAt: string;
}

export interface CreateCourseRequest {
  character: string;
  startDate: string;
  typeId: string;
  costtr: CourseTrainerStudent[];
}

export interface CreateCourseResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: Course;
}

export interface UpdateCourseRequest {
  uniqueID: string;
  character: string;
  startDate: string;
  endDate: string;
  typeId: string;
  costtr: CourseTrainerStudentUpdate[];
  deletedCoStTrIds?: string[];
}

export interface UpdateCourseResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: Course;
}

export interface DeleteCourseRequest {
  uniqueID: string;
}

export interface DeleteCourseResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: null;
}

export interface GetCourseByIdRequest {
  uniqueID: string;
}

export interface GetCourseByIdResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: Course & {
    participantsCount: number;
    durationDays: number;
    participants: CourseParticipant[];
    activities?: CourseActivity[];
    activitiesCount?: number;
  };
}

export interface GetCourseDetailsRequest {
  uniqueID: string;
}

export interface GetCourseDetailsResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: Course & {
    details?: any; // Additional details structure can be defined based on actual API response
  };
}

export interface GetCourseSelectResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: Array<{
    uniqueID: string;
    name: string;
  }>;
}

export interface GetCourseStatisticsResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: {
    totalCourses: number;
    activeCourses: number;
    upcomingCourses: number;
    completedCourses: number;
  };
}

// API endpoints
export const courseApi = api.injectEndpoints({
  endpoints: builder => ({
    // GET /api/Course - Get all courses with pagination
    getCourses: builder.query<GetCoursesResponse, GetCoursesRequest>({
      query: ({ pageNumber = 1, pageSize = 10, searchQuery }) => ({
        url: '/api/Course',
        method: 'GET',
        params: {
          pageNumber,
          pageSize,
          ...(searchQuery && { searchQuery })
        }
      }),
      providesTags: ['Course']
    }),

    // POST /api/Course - Create a new course
    createCourse: builder.mutation<CreateCourseResponse, CreateCourseRequest>({
      query: body => ({
        url: '/api/Course',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Course']
    }),

    // PUT /api/Course/{id} - Update an existing course
    updateCourse: builder.mutation<UpdateCourseResponse, UpdateCourseRequest>({
      query: ({ uniqueID, ...body }) => ({
        url: `/api/Course/${uniqueID}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['Course']
    }),

    // DELETE /api/Course/{id} - Delete a course
    deleteCourse: builder.mutation<DeleteCourseResponse, DeleteCourseRequest>({
      query: ({ uniqueID }) => ({
        url: `/api/Course/${uniqueID}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Course']
    }),

    // GET /api/Course/{id} - Get course by ID
    getCourseById: builder.query<GetCourseByIdResponse, GetCourseByIdRequest>({
      query: ({ uniqueID }) => ({
        url: `/api/Course/${uniqueID}`,
        method: 'GET'
      }),
      providesTags: ['Course', 'deleteActivity']
    }),

    // GET /api/Course/{id}/details - Get course details by ID
    getCourseDetails: builder.query<GetCourseDetailsResponse, GetCourseDetailsRequest>({
      query: ({ uniqueID }) => ({
        url: `/api/Course/${uniqueID}/details`,
        method: 'GET'
      }),
      providesTags: ['Course']
    }),

    // GET /api/Course/select - Get courses for select dropdown
    getCourseSelect: builder.query<GetCourseSelectResponse, void>({
      query: () => ({
        url: '/api/Course/select',
        method: 'GET'
      }),
      providesTags: ['Course']
    }),

    // GET /api/Course/statistics - Get course statistics
    getCourseStatistics: builder.query<GetCourseStatisticsResponse, void>({
      query: () => ({
        url: '/api/Course/statistics',
        method: 'GET'
      }),
      providesTags: ['Course']
    }),

    // GET /api/Course/active - Get active courses
    getActiveCourses: builder.query<GetCoursesResponse, GetCoursesRequest>({
      query: ({ pageNumber = 1, pageSize = 10, searchQuery }) => ({
        url: '/api/Course/active',
        method: 'GET',
        params: {
          pageNumber,
          pageSize,
          ...(searchQuery && { searchQuery })
        }
      }),
      providesTags: ['Course']
    }),

    // GET /api/Course/upcoming - Get upcoming courses
    getUpcomingCourses: builder.query<GetCoursesResponse, GetCoursesRequest>({
      query: ({ pageNumber = 1, pageSize = 10, searchQuery }) => ({
        url: '/api/Course/upcoming',
        method: 'GET',
        params: {
          pageNumber,
          pageSize,
          ...(searchQuery && { searchQuery })
        }
      }),
      providesTags: ['Course']
    }),

    // GET /api/Course/completed - Get completed courses
    getCompletedCourses: builder.query<GetCoursesResponse, GetCoursesRequest>({
      query: ({ pageNumber = 1, pageSize = 10, searchQuery }) => ({
        url: '/api/Course/completed',
        method: 'GET',
        params: {
          pageNumber,
          pageSize,
          ...(searchQuery && { searchQuery })
        }
      }),
      providesTags: ['Course']
    })
  })
});

// Export hooks for use in React components
export const {
  useGetCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetCourseByIdQuery,
  useGetCourseDetailsQuery,
  useGetCourseSelectQuery,
  useGetCourseStatisticsQuery,
  useGetActiveCoursesQuery,
  useGetUpcomingCoursesQuery,
  useGetCompletedCoursesQuery
} = courseApi;
