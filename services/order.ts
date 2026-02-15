import { api } from './api';

export type GetOrderRequestParams = {
  page?: number;
  pageSize?: number;
  range?: string;
  sortDirection?: string;
  paymentType?: string;
  order_status?: string;
};
export type GetOrderByIDResponse = {
  id: string;
};
export type GetOrderResponse = {};
export const Order = api.injectEndpoints({
  endpoints: build => ({
    getOrder: build.query<GetOrderResponse, GetOrderRequestParams>({
      query: (params: GetOrderRequestParams) => ({
        url: `/order/forMerchant`,
        method: 'GET',
        credentials: 'include',
        params
      }),
      providesTags: ['getOrder']
    }),
    paidStatusOrder: build.mutation<any, { id: string; status: string }>({
      query: ({ id, status }: { status: string | undefined; id: string | undefined }) => ({
        url: `/order/paidStatus/${id}/${status}`,
        method: 'PATCH',
        credentials: 'include'
      }),
      invalidatesTags: ['getOrder', 'paidStatusOrder']
    }),
    EquipmentStatusOrder: build.mutation<any, { id: string; equipmentStatus: string }>({
      query: ({ id, equipmentStatus }: { equipmentStatus: string | undefined; id: string | undefined }) => ({
        url: `/order/equipmentStatus/${id}/${equipmentStatus}`,
        method: 'PATCH',
        credentials: 'include'
      }),
      invalidatesTags: ['getOrder', 'EquipmentStatusOrder']
    }),

    getOrderByID: build.query<GetOrderByIDResponse, string>({
      query: (id: string) => ({
        url: `/order/${id}`,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: ['getOrderByID']
    }),
    getOrderForAadmin: build.query<GetOrderResponse, GetOrderRequestParams>({
      query: (params: GetOrderRequestParams) => ({
        url: `/order/forAdmin`,
        method: 'GET',
        credentials: 'include',
        params
      }),
      providesTags: ['getOrderForAdmin']
    }),
    getInvoiceForMerchant: build.query<GetOrderResponse, GetOrderRequestParams>({
      query: (params: GetOrderRequestParams) => ({
        url: `/order/invoiceForMerchant`,
        method: 'GET',
        credentials: 'include',
        params
      }),
      providesTags: ['getOrderForAdmin']
    }),
    // MerchantStatusOrder: build.mutation<any, { id: string; equipmentStatus : string }>({
    //     query: ({ id, equipmentStatus  }: { equipmentStatus : string | undefined; id: string | undefined }) => ({
    //         url: `/order/equipmentStatus/${id}/${equipmentStatus}`,
    //         method: 'PATCH',
    //         credentials: 'include',
    //     }),
    //     invalidatesTags: ['getOrderForAdmin', 'MerchantStatusOrder'],
    // }),

    MerchantStatusOrder: build.mutation<any, GetOrderResponse>({
      query: (body: GetOrderResponse) => ({
        url: `/order/merchantPaidStatus`,
        method: 'PATCH',
        credentials: 'include',
        body
      }),
      invalidatesTags: ['getOrderForAdmin', 'MerchantStatusOrder']
    }),
    AdminStatusOrder: build.mutation<any, GetOrderResponse>({
      query: (body: GetOrderResponse) => ({
        url: `/order/merchantRecievedStatus`,
        method: 'PATCH',
        credentials: 'include',
        body
      }),
      invalidatesTags: ['getOrderForAdmin', 'AdminStatusOrder']
    })
  })
});

export const {
  useGetOrderQuery,
  useGetInvoiceForMerchantQuery,
  useMerchantStatusOrderMutation,
  useAdminStatusOrderMutation,
  useGetOrderForAadminQuery,
  usePaidStatusOrderMutation,
  useEquipmentStatusOrderMutation,
  useGetOrderByIDQuery
} = Order;
