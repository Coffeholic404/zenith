import { api } from '@/services/api';

export type subscriptionApi = {
  uniqueID: string;
  name: string;
  studentsCount: number;
};

export type GetSubscriptionsResponse = {
  result: {
    data: subscriptionApi[];
  };
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
};

export type GetSubscriptionParams = {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  isDescending?: boolean;
  searchQuery?: string;
};

export type AddSubscriptionRequest = {
  name: string;
};

export type UpdateSubscriptionRequest = {
  name: string;
};

export const SubscriptionApi = api.injectEndpoints({
  endpoints: builder => ({
    getSubscriptions: builder.query<GetSubscriptionsResponse, GetSubscriptionParams>({
      query: params => ({
        url: '/api/SubscriptionType',
        method: 'GET',
        params
      }),
      providesTags: ['getSubscription']
    }),
    getSubscriptionById: builder.query<subscriptionApi, string>({
      query: id => ({
        url: `/api/SubscriptionType/${id}`,
        method: 'GET'
      }),
      providesTags: ['getSubscription']
    }),
    addSubscription: builder.mutation<subscriptionApi, AddSubscriptionRequest>({
      query: body => ({
        url: '/api/SubscriptionType',
        method: 'POST',
        body
      }),
      invalidatesTags: ['getSubscription']
    }),
    updateSubscription: builder.mutation<subscriptionApi, any>({
      query: ({ id, ...body }) => ({
        url: `/api/SubscriptionType/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['getSubscription']
    }),
    deleteSubscription: builder.mutation<void, string>({
      query: id => ({
        url: `/api/SubscriptionType/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['getSubscription']
    })
  })
});

export const {
  useGetSubscriptionsQuery,
  useGetSubscriptionByIdQuery,
  useAddSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation
} = SubscriptionApi;
