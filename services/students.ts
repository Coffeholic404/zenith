import { api } from './api';

export interface StudentAttachment {
  attachmentId: string;
  typeId: string;
  typeName: string;
  file: string; // URL path to file
}

export interface StudentCourse {
  courseId: string;
  courseName: string;
}

export interface StudentSkill {
  skillId: string;
  skillName: string;
}

export type Student = {
  uniqueID: string;
  name: string;
  degree: string;
  bdate: string; // string($date-time)
  phone: string;
  yearsOfServes: number;
  nominatedPartyId: string;
  nominatedPartyName: string;
  hight: number;
  width: number;
  bodyCondition: string;
  epilepsy: boolean;
  heartDisease: boolean;
  sugar: boolean;
  pressure: boolean;
  notes: string;
  subscriptionTypeId: string;
  subscriptionTypeName: string;
  attachments: StudentAttachment[];
  courses: StudentCourse[];
  skills: StudentSkill[];
};

export type GetStudentsRequestParams = {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  isDescending?: boolean;
  searchQuery?: string;
};

export type GetStudentsResponse = {
  result: {
    data: Student[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
};

export interface UpdateStudentResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: Student;
}

// Request type for updating a student via multipart/form-data
export interface UpdateStudentRequest {
  uniqueID: string;
  student: FormData;
}

// GET /api/Student/{id} request/response types
export interface GetStudentByIdRequest {
  uniqueID: string;
}

export interface GetStudentByIdResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: Student;
}

export const StudentApi = api.injectEndpoints({
  endpoints: builder => ({
    getStudents: builder.query<GetStudentsResponse, GetStudentsRequestParams>({
      query: (params: GetStudentsRequestParams) => ({
        url: '/api/Student',
        method: 'GET',
        params
      }),
      providesTags: ['getStudents']
    }),

    addStudent: builder.mutation<UpdateStudentResponse, FormData>({
      query: (student: FormData) => ({
        url: '/api/Student',
        method: 'POST',
        body: student
      }),
      invalidatesTags: ['getStudents']
    }),

    // PUT /api/Student/{id} - Update an existing student (multipart/form-data)
    updateStudent: builder.mutation<UpdateStudentResponse, UpdateStudentRequest>({
      query: ({ uniqueID, student }) => ({
        url: `/api/Student/${uniqueID}`,
        method: 'PUT',
        body: student
      }),
      invalidatesTags: ['getStudents']
    }),

    // GET /api/Student/{id} - Get student by ID
    getStudentById: builder.query<GetStudentByIdResponse, GetStudentByIdRequest>({
      query: ({ uniqueID }) => ({
        url: `/api/Student/${uniqueID}`,
        method: 'GET'
      }),
      providesTags: ['getStudents']
    }),

    deleteStudent: builder.mutation<UpdateStudentResponse, string>({
      query: (uniqueID: string) => ({
        url: `/api/Student/${uniqueID}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['getStudents']
    })
  })
});

export const {
  useGetStudentsQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useGetStudentByIdQuery,
  useDeleteStudentMutation
} = StudentApi;
