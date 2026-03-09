import { api } from './api';

// InventoryHistory entity interface
export interface InventoryHistoryItem {
  uniqueID: string;
  inventoryRecordId: string;
  oldDate: string;
  packagerId: string;
  packetCoachId: string;
  newDate: string;
  status: string | null;
  code: string | null;
  generatedCode: string | null;
  distribution: string | null;
}

// Request types
export interface GetInventoryHistoryByIdRequest {
  id: string;
}

export interface GetInventoryHistoryByRecordIdRequest {
  inventoryRecordId: string;
}

export interface CreateInventoryHistoryRequest {
  inventoryRecordId: string;
  oldDate: string;
  packagerId: string;
  packetCoachId: string;
  newDate: string;
}

export interface UpdateInventoryHistoryRequest {
  id: string;
  oldDate: string;
  packagerId: string;
  packetCoachId: string;
  newDate: string;
  status: string;
  code: string;
  generatedCode: string;
  distribution: string;
}

export interface GetInventoryHistoryDatesRequest {
  from?: string;
  to?: string;
  search?: string;
}

// Response types
export interface InventoryHistoryResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: InventoryHistoryItem;
}

export interface InventoryHistoryListResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: InventoryHistoryItem[];
}

export interface InventoryHistoryDatesResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: {
    id: string;
    createdAt: string;
  }[];
}

// API endpoints for InventoryHistory
export const inventoryHistoryApi = api.injectEndpoints({
  endpoints: builder => ({
    // GET /api/InventoryHistory/{id} - Get inventory history by ID
    getInventoryHistoryById: builder.query<InventoryHistoryResponse, GetInventoryHistoryByIdRequest>({
      query: ({ id }) => ({
        url: `/api/InventoryHistory/${id}`,
        method: 'GET'
      }),
      providesTags: ['InventoryHistory']
    }),

    // PUT /api/InventoryHistory/{id} - Update an inventory history entry
    updateInventoryHistory: builder.mutation<InventoryHistoryResponse, UpdateInventoryHistoryRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/InventoryHistory/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['InventoryHistory', 'Inventory']
    }),

    // GET /api/InventoryHistory/record/{inventoryRecordId} - Get history by inventory record ID
    getInventoryHistoryByRecordId: builder.query<InventoryHistoryListResponse, GetInventoryHistoryByRecordIdRequest>({
      query: ({ inventoryRecordId }) => ({
        url: `/api/InventoryHistory/record/${inventoryRecordId}`,
        method: 'GET'
      }),
      providesTags: ['InventoryHistory']
    }),

    // POST /api/InventoryHistory - Create a new inventory history entry
    createInventoryHistory: builder.mutation<InventoryHistoryResponse, CreateInventoryHistoryRequest>({
      query: body => ({
        url: '/api/InventoryHistory',
        method: 'POST',
        body
      }),
      invalidatesTags: ['InventoryHistory', 'Inventory']
    }),

    // GET /api/InventoryHistory/dates - Get inventory history dates
    getInventoryHistoryDates: builder.query<InventoryHistoryDatesResponse, GetInventoryHistoryDatesRequest>({
      query: ({ from, to, search } = {}) => ({
        url: '/api/InventoryHistory/dates',
        method: 'GET',
        params: {
          ...(from && { from }),
          ...(to && { to }),
          ...(search && { search })
        }
      }),
      providesTags: ['InventoryHistory']
    })
  })
});

// Hooks
export const {
  useGetInventoryHistoryByIdQuery,
  useUpdateInventoryHistoryMutation,
  useGetInventoryHistoryByRecordIdQuery,
  useCreateInventoryHistoryMutation,
  useGetInventoryHistoryDatesQuery
} = inventoryHistoryApi;
