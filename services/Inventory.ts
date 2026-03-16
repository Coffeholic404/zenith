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
  FromDate?: string;
  ToDate?: string;
}

export interface GetInventoryByIdRequest {
  id: string;
}

export interface UpdateInventoryRequest {
  id: string;
  code: string;
  generatedCode: string;
  status: string;
  packagerId: string;
  packetCoachId: string;
  date: string;
  distribution: string;
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


// API endpoints for Inventory
export const inventoryApi = api.injectEndpoints({
  endpoints: builder => ({
    // GET /api/Inventory - List inventories with pagination, sorting, and search
    getInventory: builder.query<GetInventoryResponse, GetInventoryRequest>({
      query: ({ pageNumber = 1, pageSize = 10, sortBy, isDescending, searchQuery, FromDate, ToDate }) => ({
        url: '/api/Inventory',
        method: 'GET',
        params: {
          PageNumber: pageNumber,
          PageSize: pageSize,
          ...(sortBy && { SortBy: sortBy }),
          ...(isDescending !== undefined && { IsDescending: isDescending }),
          ...(searchQuery && { SearchQuery: searchQuery }),
          ...(FromDate && { FromDate: FromDate }),
          ...(ToDate && { ToDate: ToDate })
        }
      }),
      providesTags: ['Inventory', 'Stock']
    }),

    // GET /api/Inventory/{id} - Get inventory by ID
    getInventoryById: builder.query<InventoryResponse, GetInventoryByIdRequest>({
      query: ({ id }) => ({
        url: `/api/Inventory/${id}`,
        method: 'GET'
      }),
      providesTags: ['Inventory', 'Stock']
    }),

    // PUT /api/Inventory/{id} - Update an inventory entry
    updateInventory: builder.mutation<InventoryResponse, UpdateInventoryRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/Inventory/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['Inventory', 'Stock']
    }),
  })
});

// Hooks
export const { useGetInventoryQuery, useGetInventoryByIdQuery, useUpdateInventoryMutation } =
  inventoryApi;
