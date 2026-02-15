import { api } from './api';

export type GetCategoryRequestParams = {
  skip?: number;
  take?: number;
  search?: string;
};

export type GetCategoryResponse = {};
export type AddCategoryPayload = { title: string; description: string; on_slider: string; img: string };
export type AddCategoryMPayload = {
  categorIds: string[];
};
export type UpdateDepartmentsPayload = {
  name: string;
};
export type GetCategoryByIDResponse = {
  id: number;
};

export const Category = api.injectEndpoints({
  endpoints: build => ({
    getCategoryAll: build.query<GetCategoryResponse, GetCategoryRequestParams>({
      query: (params: GetCategoryRequestParams) => ({
        url: `/category/forMerchant/all`,
        method: 'GET',
        credentials: 'include',
        params
      }),
      providesTags: ['getCategoryAll']
    }),
    getCategory: build.query<GetCategoryResponse, GetCategoryRequestParams>({
      query: (params: GetCategoryRequestParams) => ({
        url: `/category`,
        method: 'GET',
        credentials: 'include',
        params
      }),
      providesTags: ['getCategory']
    }),
    getCategoryM: build.query<GetCategoryResponse, GetCategoryRequestParams>({
      query: (params: GetCategoryRequestParams) => ({
        url: `/category/forMerchant`,
        method: 'GET',
        credentials: 'include',
        params
      }),
      providesTags: ['getCategoryM']
    }),
    getCategoryByID: build.query<GetCategoryByIDResponse, string>({
      query: (id: string) => ({
        url: `/category/${id}`,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: ['getCategoryByID']
    }),

    addCategory: build.mutation<any, AddCategoryPayload>({
      query: (body: AddCategoryPayload) => ({
        url: `/category`,
        method: 'POST',
        credentials: 'include',
        body
      }),
      invalidatesTags: ['getCategory', 'addCategory', 'getCategoryByID', 'getCategoryAll', 'getCategoryM']
    }),

    updateCategory: build.mutation<any, { body: AddCategoryPayload; id: string }>({
      query: ({ body, id }: { body: AddCategoryPayload; id: string }) => ({
        url: `/category/${id}`,
        body,
        method: 'PATCH',
        credentials: 'include'
      }),
      invalidatesTags: ['getCategory', 'updateCategory', 'getCategoryByID', 'getCategoryAll']
    }),
    updateCategoryMerchant: build.mutation<any, AddCategoryMPayload>({
      query: (body: AddCategoryMPayload) => ({
        url: `/store/CategoryStore`,
        body,
        method: 'PATCH',
        credentials: 'include'
      }),
      invalidatesTags: ['updateCategoryMerchant', 'getCategoryM', 'getCategory', 'getCategoryAll']
    }),
    updateCategoryٍSlide: build.mutation<any, { id: string; status: string }>({
      query: ({ id, status }: { id: string; status: string }) => ({
        url: `/store/Status/${id}/${status}`,
        method: 'PATCH',
        credentials: 'include'
      }),
      invalidatesTags: ['updateCategoryٍSlide', 'getCategoryM', 'getCategoryAll', 'getCategory']
    }),
    deleteCategory: build.mutation<any, string>({
      query: (id: string) => ({
        url: `/category/${id}`,
        method: 'DELETE',
        credentials: 'include'
      }),
      invalidatesTags: ['getCategory', 'deleteCategory', 'getCategoryByID', 'getCategoryAll']
    }),
    deleteCategoryM: build.mutation<any, string>({
      query: (id: string) => ({
        url: `/store/CategoryStore/${id}`,
        method: 'DELETE',
        credentials: 'include'
      }),
      invalidatesTags: ['getCategoryM', 'deleteCategoryM', 'getCategoryAll']
    })
  })
});

export const {
  useGetCategoryQuery,
  useGetCategoryMQuery,
  useGetCategoryAllQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useUpdateCategoryٍSlideMutation,
  useUpdateCategoryMerchantMutation,
  useDeleteCategoryMutation,
  useDeleteCategoryMMutation,
  useGetCategoryByIDQuery
} = Category;
