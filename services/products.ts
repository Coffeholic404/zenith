import { api } from './api';

export type GetProductsRequestParams = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export type GetProductsResponse = {};
export type AddProductsPayload = FormData;
export type updateProductsPayload = {
  title: string;
  description: string;
  old_price: number;
  discount: number;
  qty: number;
  special_type: string;
  Availibility: string;
};
export type changeOnSliderStatus = {
  id: string;
  on_slider: string;
};

export type GetImgIDResponse = {};

// export type AddPaymentPayload = {
//     id: string;
// };
export const Products = api.injectEndpoints({
  endpoints: build => ({
    getProductsAll: build.query<GetProductsResponse, GetProductsRequestParams>({
      query: (params: GetProductsRequestParams) => ({
        url: `/item`,
        method: 'GET',
        credentials: 'include',
        params
      }),
      providesTags: ['getProducts']
    }),
    getCategoryStoreId: build.query<GetProductsResponse, GetProductsRequestParams>({
      query: (params: GetProductsRequestParams) => ({
        url: `/store/forMerchant`,
        method: 'GET',
        credentials: 'include',
        params
      }),
      providesTags: ['getCategoryStoreId']
    }),
    addProduct: build.mutation<any, GetProductsResponse>({
      query: (body: GetProductsResponse) => ({
        url: `/item`,
        method: 'POST',
        credentials: 'include',
        body
      }),
      invalidatesTags: ['addProduct', 'getProducts', 'getCategoryStoreId']
    }),
    deleteProduct: build.mutation<any, string>({
      query: (id: string) => ({
        url: `/item/${id}`,
        method: 'DELETE',
        credentials: 'include'
      }),
      invalidatesTags: ['deleteProduct', 'getProducts', 'getCategoryStoreId']
    }),
    updateProduct: build.mutation<any, { body: updateProductsPayload; id: string }>({
      query: ({ body, id }: { body: updateProductsPayload; id: string }) => ({
        url: `/item/${id}`,
        body,
        method: 'PATCH',
        credentials: 'include'
      }),
      invalidatesTags: ['getProducts', 'getCategoryStoreId', 'updateProduct']
    }),
    deleteProductImg: build.mutation<any, GetImgIDResponse>({
      query: (body: GetImgIDResponse) => ({
        url: `/item-attachment`,
        method: 'DELETE',
        credentials: 'include',
        body
      }),
      invalidatesTags: ['deleteProductImg', 'getProducts', 'getCategoryStoreId']
    }),
    changeOnSliderStatusImg: build.mutation<any, changeOnSliderStatus>({
      query: (body: changeOnSliderStatus) => ({
        url: `/item-attachment/changeOnSliderStatus`,
        body,
        method: 'PATCH',
        credentials: 'include'
      }),
      invalidatesTags: ['changeOnSliderStatusImg', 'getProducts', 'getCategoryStoreId']
    }),
    addProductImg: build.mutation<any, AddProductsPayload>({
      query: (body: AddProductsPayload) => ({
        url: `/item-attachment`,
        body,
        method: 'POST',
        credentials: 'include'
      }),
      invalidatesTags: ['addProductImg', 'getProducts', 'getCategoryStoreId']
    })
  })
});

export const {
  useGetProductsAllQuery,
  useGetCategoryStoreIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useDeleteProductImgMutation,
  useChangeOnSliderStatusImgMutation,
  useAddProductImgMutation
} = Products;
