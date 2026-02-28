import { api } from './api';

// Stock item entity interface
export interface StockItem {
  id: string;
  itemId: string;
  itemName: string;
  inventoryId: string | null;
  note: string;
  cost: number;
  createdAt: string;
  code: string;
  packagerId: string;
  packetCoachId: string;
}

// Request types
export interface GetStocksRequest {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  isDescending?: boolean;
  searchQuery?: string;
}

export interface GetStockByIdRequest {
  id: string;
}

export interface CreateStockRequest {
  itemId: string;
  note: string;
  cost: number;
  code: string;
  packagerId: string;
  packetCoachId: string;
  status: string;
  distribution: string;
}

export interface DeleteStockRequest {
  id: string;
}

export interface ReverseStockRequest {
  id: string;
}

// Response types
export interface GetStocksResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: {
    data: StockItem[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    searchQuery: string | null;
  };
}

export interface StockResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: StockItem;
}

export interface StockDeleteResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: null;
}

export interface ReverseStockResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: {
    message: string;
  };
}

export interface StockDatesResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: string[];
}

// API endpoints for Stock
export const stockApi = api.injectEndpoints({
  endpoints: builder => ({
    // GET /api/Stock - List stocks with pagination, sorting, and search
    getStocks: builder.query<GetStocksResponse, GetStocksRequest>({
      query: ({ pageNumber = 1, pageSize = 10, sortBy, isDescending, searchQuery }) => ({
        url: '/api/Stock',
        method: 'GET',
        params: {
          PageNumber: pageNumber,
          PageSize: pageSize,
          ...(sortBy && { SortBy: sortBy }),
          ...(isDescending !== undefined && { IsDescending: isDescending }),
          ...(searchQuery && { SearchQuery: searchQuery })
        }
      }),
      providesTags: ['Stock']
    }),

    // GET /api/Stock/{id} - Get stock by ID
    getStockById: builder.query<StockResponse, GetStockByIdRequest>({
      query: ({ id }) => ({
        url: `/api/Stock/${id}`,
        method: 'GET'
      }),
      providesTags: ['Stock']
    }),

    // POST /api/Stock - Create a new stock entry
    createStock: builder.mutation<StockResponse, CreateStockRequest>({
      query: body => ({
        url: '/api/Stock',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Stock']
    }),

    // DELETE /api/Stock/{id} - Delete a stock entry
    deleteStock: builder.mutation<StockDeleteResponse, DeleteStockRequest>({
      query: ({ id }) => ({
        url: `/api/Stock/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Stock']
    }),

    // PUT /api/Stock/{id}/reverse - Reverse a stock entry
    reverseStock: builder.mutation<ReverseStockResponse, ReverseStockRequest>({
      query: ({ id }) => ({
        url: `/api/Stock/${id}/reverse`,
        method: 'PUT'
      }),
      invalidatesTags: ['Stock']
    }),

    // GET /api/Stock/dates - Get stock dates
    getStockDates: builder.query<StockDatesResponse, void>({
      query: () => ({
        url: '/api/Stock/dates',
        method: 'GET'
      }),
      providesTags: ['Stock']
    })
  })
});

// Hooks
export const {
  useGetStocksQuery,
  useGetStockByIdQuery,
  useCreateStockMutation,
  useDeleteStockMutation,
  useReverseStockMutation,
  useGetStockDatesQuery
} = stockApi;
