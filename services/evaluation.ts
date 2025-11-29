import { api } from './api';

// Evaluation Item (from GET response)
export interface EvaluationItem {
  uniqueID: string;
  co_St_TrId: string;
  studentName: string;
  studentCode: string;
  courseName: string;
  courseCharacter: string;
  trainerName: string;
  courseStatus: string;
  createdAt: string;
  isComplete: boolean;
  note: string;
}

// Create Evaluation Request (POST body)
export interface CreateEvaluationRequest {
  co_St_TrId: string;
  evaluation1: string;
  evaluation2: string;
  evaluation3: string;
  note: string;
}

// Create Evaluation Response
export interface CreateEvaluationResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: {
    uniqueID: string;
    co_St_TrId: string;
    evaluation1: string;
    evaluation2: string;
    evaluation3: string;
    note: string;
    studentName: string;
    studentCode: string;
    trainerName: string;
    courseName: string;
    courseCharacter: string;
    courseType: string;
    courseStartDate: string;
    courseEndDate: string;
    courseStatus: string;
    createdAt: string;
  };
}

// Get Evaluations Request
export interface GetEvaluationsRequest {
  pageNumber?: number;
  pageSize?: number;
  searchQuery?: string;
}

// Get Evaluations Response
export interface GetEvaluationsResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: {
    data: EvaluationItem[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    searchQuery: string | null;
  };
}

// Update Evaluation Request (PUT body)
export interface UpdateEvaluationRequest {
  uniqueID: string;
  evaluation1: string;
  evaluation2: string;
  evaluation3: string;
  note: string;
}

// Update Evaluation Response
export interface UpdateEvaluationResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: EvaluationItem;
}

// Delete Evaluation Request
export interface DeleteEvaluationRequest {
  uniqueID: string;
}

// Delete Evaluation Response
export interface DeleteEvaluationResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: boolean | null;
}

export const evaluationApi = api.injectEndpoints({
  endpoints: builder => ({
    // GET /api/Evaluation - list evaluations
    getEvaluations: builder.query<GetEvaluationsResponse, GetEvaluationsRequest>({
      query: ({ pageNumber = 1, pageSize = 10, searchQuery }) => ({
        url: '/api/Evaluation',
        method: 'GET',
        params: {
          pageNumber,
          pageSize,
          ...(searchQuery && { searchQuery })
        }
      }),
      providesTags: ['Evaluation']
    }),

    // POST /api/Evaluation - create evaluation
    createEvaluation: builder.mutation<CreateEvaluationResponse, CreateEvaluationRequest>({
      query: body => ({
        url: '/api/Evaluation',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Evaluation']
    }),

    // PUT /api/Evaluation/{id} - update evaluation
    updateEvaluation: builder.mutation<UpdateEvaluationResponse, UpdateEvaluationRequest>({
      query: ({ uniqueID, ...body }) => ({
        url: `/api/Evaluation/${uniqueID}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['Evaluation']
    }),

    // DELETE /api/Evaluation/{id} - delete evaluation
    deleteEvaluation: builder.mutation<DeleteEvaluationResponse, DeleteEvaluationRequest>({
      query: ({ uniqueID }) => ({
        url: `/api/Evaluation/${uniqueID}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['deleteEvaluation', 'Evaluation']
    })
  })
});

export const {
  useGetEvaluationsQuery,
  useCreateEvaluationMutation,
  useUpdateEvaluationMutation,
  useDeleteEvaluationMutation
} = evaluationApi;
