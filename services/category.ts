import { api } from './api';

// Category entity interface based on API response
export interface Category {
  id: string;
  categoryName: string;
  createdAt: string;
  itemCount: number;
}

// Request types
export interface GetCategoriesRequest {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  isDescending?: boolean;
  searchQuery?: string;
}

export interface GetCategoryByIdRequest {
  id: string;
}

export interface CreateCategoryRequest {
  categoryName: string;
}

export interface UpdateCategoryRequest {
  id: string;
  categoryName: string;
}

export interface DeleteCategoryRequest {
  id: string;
}

// Response types
export interface GetCategoriesResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: {
    data: Category[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    searchQuery: string | null;
  };
}

export interface CategoryResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: Category;
}

export interface CategoryDeleteResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: null;
}

// API endpoints for Category
export const categoryApi = api.injectEndpoints({
  endpoints: builder => ({
    // GET /api/Category - List categories with pagination, sorting, and search
    getCategories: builder.query<GetCategoriesResponse, GetCategoriesRequest>({
      query: ({ pageNumber = 1, pageSize = 10, sortBy, isDescending, searchQuery }) => ({
        url: '/api/Category',
        method: 'GET',
        params: {
          PageNumber: pageNumber,
          PageSize: pageSize,
          ...(sortBy && { SortBy: sortBy }),
          ...(isDescending !== undefined && { IsDescending: isDescending }),
          ...(searchQuery && { SearchQuery: searchQuery })
        }
      }),
      providesTags: ['getCategory']
    }),

    // GET /api/Category/{id} - Get category by ID
    getCategoryById: builder.query<CategoryResponse, GetCategoryByIdRequest>({
      query: ({ id }) => ({
        url: `/api/Category/${id}`,
        method: 'GET'
      }),
      providesTags: ['getCategoryByID']
    }),

    // POST /api/Category - Create a new category
    createCategory: builder.mutation<CategoryResponse, CreateCategoryRequest>({
      query: body => ({
        url: '/api/Category',
        method: 'POST',
        body
      }),
      invalidatesTags: ['getCategory']
    }),

    // PUT /api/Category/{id} - Update an existing category
    updateCategory: builder.mutation<CategoryResponse, UpdateCategoryRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/Category/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['getCategory', 'getCategoryByID']
    }),

    // DELETE /api/Category/{id} - Delete a category
    deleteCategory: builder.mutation<CategoryDeleteResponse, DeleteCategoryRequest>({
      query: ({ id }) => ({
        url: `/api/Category/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['getCategory']
    })
  })
});

// Hooks
export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} = categoryApi;
