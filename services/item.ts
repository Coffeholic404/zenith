import { api } from './api';

// Item entity interface based on API response
export interface Item {
  id: string;
  itemName: string;
  description: string;
  note: string;
  country: string;
  brand: string;
  limit: number;
  createdAt: string;
  categoryId: string;
  categoryName: string;
  unitId: string;
  unitName: string;
  volume: number;
}

// Request types
export interface GetItemsRequest {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  isDescending?: boolean;
  searchQuery?: string;
}

export interface GetItemByIdRequest {
  id: string;
}

export interface CreateItemRequest {
  itemName: string;
  description: string;
  categoryId: string;
  note: string;
  unitId: string;
  country: string;
  brand: string;
  limit: number;
}

export interface UpdateItemRequest {
  id: string;
  itemName: string;
  description: string;
  categoryId: string;
  note: string;
  unitId: string;
  country: string;
  brand: string;
  limit: number;
}

export interface DeleteItemRequest {
  id: string;
}

// Response types
export interface GetItemsResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: {
    data: Item[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    searchQuery: string | null;
  };
}

export interface ItemResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: Item;
}

export interface ItemDeleteResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: null;
}

// API endpoints for Item
export const itemApi = api.injectEndpoints({
  endpoints: builder => ({
    // GET /api/Item - List items with pagination, sorting, and search
    getItemsList: builder.query<GetItemsResponse, GetItemsRequest>({
      query: ({ pageNumber = 1, pageSize = 10, sortBy, isDescending, searchQuery }) => ({
        url: '/api/Item',
        method: 'GET',
        params: {
          PageNumber: pageNumber,
          PageSize: pageSize,
          ...(sortBy && { SortBy: sortBy }),
          ...(isDescending !== undefined && { IsDescending: isDescending }),
          ...(searchQuery && { SearchQuery: searchQuery })
        }
      }),
      providesTags: ['getItems']
    }),

    // GET /api/Item/{id} - Get item by ID
    getItemById: builder.query<ItemResponse, GetItemByIdRequest>({
      query: ({ id }) => ({
        url: `/api/Item/${id}`,
        method: 'GET'
      }),
      providesTags: ['getItemsByID']
    }),

    // POST /api/Item - Create a new item
    createItem: builder.mutation<ItemResponse, CreateItemRequest>({
      query: body => ({
        url: '/api/Item',
        method: 'POST',
        body
      }),
      invalidatesTags: ['getItems']
    }),

    // PUT /api/Item/{id} - Update an existing item
    updateItem: builder.mutation<ItemResponse, UpdateItemRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/Item/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['getItems', 'getItemsByID']
    }),

    // DELETE /api/Item/{id} - Delete an item
    deleteItem: builder.mutation<ItemDeleteResponse, DeleteItemRequest>({
      query: ({ id }) => ({
        url: `/api/Item/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['getItems']
    })
  })
});

// Hooks
export const {
  useGetItemsListQuery,
  useGetItemByIdQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation
} = itemApi;
