import { api } from './api';

// Inventory item entity interface
export interface InventoryItem {
  uniqueID: string;
  source: string;
  stockId: string | null;
  subImportId: string | null;
  code: string;
  generatedCode: string;
  itemId: string;
  itemName: string;
  status: string;
  packagerId: string | null;
  packetCoachId: string | null;
  date: string;
  distribution: string;
}

// Request types
export interface GetInventoryRequest {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  isDescending?: boolean;
  searchQuery?: string;
}

export interface GetInventoryByIdRequest {
  id: string;
}

export interface UpdateInventoryRequest {
  id: string;
  status: string;
  packagerId: string;
  packetCoachId: string;
  date: string;
  distribution: string;
}

export interface GetInventoryDatesRequest {
  from?: string;
  to?: string;
  search?: string;
}

// Response types
export interface GetInventoryResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: {
    data: InventoryItem[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    searchQuery: string | null;
  };
}

export interface InventoryResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: InventoryItem;
}

export interface InventoryDatesResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: {
    id: string;
    createdAt: string;
  }[];
}

// API endpoints for Inventory
export const inventoryApi = api.injectEndpoints({
  endpoints: builder => ({
    // GET /api/Inventory - List inventories with pagination, sorting, and search
    getInventory: builder.query<GetInventoryResponse, GetInventoryRequest>({
      query: ({ pageNumber = 1, pageSize = 10, sortBy, isDescending, searchQuery }) => ({
        url: '/api/Inventory',
        method: 'GET',
        params: {
          PageNumber: pageNumber,
          PageSize: pageSize,
          ...(sortBy && { SortBy: sortBy }),
          ...(isDescending !== undefined && { IsDescending: isDescending }),
          ...(searchQuery && { SearchQuery: searchQuery })
        }
      }),
      providesTags: ['Inventory']
    }),

    // GET /api/Inventory/{id} - Get inventory by ID
    getInventoryById: builder.query<InventoryResponse, GetInventoryByIdRequest>({
      query: ({ id }) => ({
        url: `/api/Inventory/${id}`,
        method: 'GET'
      }),
      providesTags: ['Inventory']
    }),

    // PUT /api/Inventory/{id} - Update an inventory entry
    updateInventory: builder.mutation<InventoryResponse, UpdateInventoryRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/Inventory/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['Inventory']
    }),

    // GET /api/Inventory/dates - Get inventory dates
    getInventoryDates: builder.query<InventoryDatesResponse, GetInventoryDatesRequest>({
      query: ({ from, to, search } = {}) => ({
        url: '/api/Inventory/dates',
        method: 'GET',
        params: {
          ...(from && { from }),
          ...(to && { to }),
          ...(search && { search })
        }
      }),
      providesTags: ['Inventory']
    })
  })
});

// Hooks
export const { useGetInventoryQuery, useGetInventoryByIdQuery, useUpdateInventoryMutation, useGetInventoryDatesQuery } =
  inventoryApi;
