import { api } from './api';

// Sub-import item interface
export interface SubImport {
  id: string;
  itemId: string;
  itemName?: string;
  qty: number;
  cost: number;
  note: string;
  code?: string;
  status?: string;
  packagerId?: string;
  packetCoachId?: string;
  sameFlag?: string;
  distribution?: string;
  createdAt?: string;
}

// Bill (StImport) entity interface
export interface Bill {
  id: string;
  supplier: string;
  date: string;
  orderNo: string;
  note: string;
  createdAt: string;
  status: boolean;
  subImports: SubImport[];
}

// Request types
export interface GetBillsRequest {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  isDescending?: boolean;
  searchQuery?: string;
}

export interface GetBillByIdRequest {
  id: string;
}

export interface CreateSubImportRequest {
  itemId: string;
  qty: number;
  cost: number;
  note: string;
  code: string;
  status: string;
  packagerId: string;
  packetCoachId: string;
  sameFlag: string;
  distribution: string;
}

export interface CreateBillRequest {
  supplier: string;
  date: string;
  orderNo: string;
  note: string;
  subImports: CreateSubImportRequest[];
}

export interface UpdateBillRequest {
  id: string;
  supplier: string;
  date: string;
  orderNo: string;
  note: string;
  subImports: CreateSubImportRequest[];
}

export interface DeleteBillRequest {
  id: string;
}

// Response types
export interface GetBillsResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: {
    data: Bill[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    searchQuery: string | null;
  };
}

export interface BillResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: Bill;
}

export interface BillDeleteResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: null;
}

// API endpoints for Bills (StImport)
export const billsApi = api.injectEndpoints({
  endpoints: builder => ({
    // GET /api/StImport - List bills with pagination, sorting, and search
    getBills: builder.query<GetBillsResponse, GetBillsRequest>({
      query: ({ pageNumber = 1, pageSize = 10, sortBy, isDescending, searchQuery }) => ({
        url: '/api/StImport',
        method: 'GET',
        params: {
          PageNumber: pageNumber,
          PageSize: pageSize,
          ...(sortBy && { SortBy: sortBy }),
          ...(isDescending !== undefined && { IsDescending: isDescending }),
          ...(searchQuery && { SearchQuery: searchQuery })
        }
      }),
      providesTags: ['getSimport']
    }),

    // GET /api/StImport/{id} - Get bill by ID
    getBillById: builder.query<BillResponse, GetBillByIdRequest>({
      query: ({ id }) => ({
        url: `/api/StImport/${id}`,
        method: 'GET'
      }),
      providesTags: ['getSimport']
    }),

    // POST /api/StImport - Create a new bill
    createBill: builder.mutation<BillResponse, CreateBillRequest>({
      query: body => ({
        url: '/api/StImport',
        method: 'POST',
        body
      }),
      invalidatesTags: ['getSimport']
    }),

    // PUT /api/StImport/{id} - Update an existing bill
    updateBill: builder.mutation<BillResponse, UpdateBillRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/StImport/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['getSimport']
    }),

    // DELETE /api/StImport/{id} - Delete a bill
    deleteBill: builder.mutation<BillDeleteResponse, DeleteBillRequest>({
      query: ({ id }) => ({
        url: `/api/StImport/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['getSimport']
    })
  })
});

// Hooks
export const {
  useGetBillsQuery,
  useGetBillByIdQuery,
  useCreateBillMutation,
  useUpdateBillMutation,
  useDeleteBillMutation
} = billsApi;
