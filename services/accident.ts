import { api } from './api';

export interface CommitteeMember {
  employeeId: string;
}

export interface CommitteeMemberFull {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeJobTitle: string;
  employeeTypeName: string;
  employeePhone: string;
}

export interface AccidentItem {
  id: string;
  co_St_TrId: string;
  studentName: string;
  studentCode: string;
  courseName: string;
  activityId: string;
  activityName: string;
  activityDate: string;
  activityTime: string;
  placeName: string;
  jumperCount: number;
  freefallTime: number;
  freefallAltitude: number;
  deployAltitude: number;
  exitAltitude: number;
  landings: string;
  typeOfJump: string;
  trainer1Id: string;
  trainer1Name: string | undefined;
  trainer1Note: string | undefined;
  trainer2Id: string | undefined;
  trainer2Name: string | undefined;
  trainer2Note: string | undefined;
  trainer3Id: string | undefined;
  trainer3Name: string | undefined;
  trainer3Note: string | undefined;
  finalReport: string;
  committeeCount: number;
  committeeMembers: CommitteeMemberFull[];
}

export interface GetAccidentsRequest {
  pageNumber?: number;
  pageSize?: number;
  searchQuery?: string;
}

export interface GetAccidentsResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: {
    data: AccidentItem[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    searchQuery: string | null;
  };
}

export interface CreateAccidentRequest {
  co_St_TrId: string;
  activityId: string;
  jumperCount: number;
  freefallTime: number;
  freefallAltitude: number;
  deployAltitude: number;
  exitAltitude: number;
  landings: string;
  typeOfJump: string;
  trainer1Id: string | null;
  trainer1Note: string | null;
  trainer2Id: string | null;
  trainer2Note: string | null;
  trainer3Id: string | null;
  trainer3Note: string | null;
  finalReport: string;
  committeeMembers: CommitteeMember[];
}

export interface CreateAccidentResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: AccidentItem;
}

export interface UpdateAccidentRequest {
  id: string;
  co_St_TrId: string;
  activityId: string;
  jumperCount: number;
  freefallTime: number;
  freefallAltitude: number;
  deployAltitude: number;
  exitAltitude: number;
  landings: string;
  typeOfJump: string;
  trainer1Id: string | null;
  trainer1Note: string | null;
  trainer2Id: string | null;
  trainer2Note: string | null;
  trainer3Id: string | null;
  trainer3Note: string | null;
  finalReport: string;
  committeeMembersToAdd: CommitteeMember[];
  committeeMembersToDelete: string[];
}

export interface UpdateAccidentResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: AccidentItem;
}

export interface DeleteAccidentRequest {
  id: string;
}

export interface DeleteAccidentResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: boolean | null;
}

export interface GetAccidentByIdRequest {
  id: string;
}

export interface GetAccidentByIdResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: AccidentItem;
}

export const accidentApi = api.injectEndpoints({
  endpoints: builder => ({
    // GET /api/Accident - list accidents
    getAccidents: builder.query<GetAccidentsResponse, GetAccidentsRequest>({
      query: ({ pageNumber = 1, pageSize = 10, searchQuery }) => ({
        url: '/api/Accident',
        method: 'GET',
        params: {
          pageNumber,
          pageSize,
          ...(searchQuery && { searchQuery })
        }
      }),
      providesTags: ['Accident']
    }),

    // GET /api/Accident/{id}
    getAccidentById: builder.query<GetAccidentByIdResponse, GetAccidentByIdRequest>({
      query: ({ id }) => ({
        url: `/api/Accident/${id}`,
        method: 'GET'
      }),
      providesTags: ['Accident']
    }),

    // POST /api/Accident
    createAccident: builder.mutation<CreateAccidentResponse, CreateAccidentRequest>({
      query: body => ({
        url: '/api/Accident',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Accident']
    }),

    // PUT /api/Accident/{id}
    updateAccident: builder.mutation<UpdateAccidentResponse, UpdateAccidentRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/Accident/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['Accident']
    }),

    // DELETE /api/Accident/{id}
    deleteAccident: builder.mutation<DeleteAccidentResponse, DeleteAccidentRequest>({
      query: ({ id }) => ({
        url: `/api/Accident/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Accident']
    })
  })
});

export const {
  useGetAccidentsQuery,
  useGetAccidentByIdQuery,
  useCreateAccidentMutation,
  useUpdateAccidentMutation,
  useDeleteAccidentMutation
} = accidentApi;
