import { api } from './api';

export type GetMerchantsRequestParams = {
    skip?: number;
    take?: number;
    userType?: string;
};

export type GetMerchantsResponse = {};
export type AddMerchantsPayload = {
    full_name: string;
    email: string;
    password: String;
    phone: any;
    country: String;
    address: String;
    ar_name: string;
    birthdate: string;
    en_name: String;
    domain: String;
    maxRangeDailyAmount: number;
    maxRangeMonthlyAmount: number;
    PlanType: String;
    PaymentType: String;

};
export type GetMerchantsByIDResponse = {
    full_name: string;
    email: string;
    password: String;
    phone: any;
    country: String;
    address: String;
    ar_name: string;
    birthdate: string;
    en_name: String;
    domain: String;
    maxRangeDailyAmount: number;
    maxRangeMonthlyAmount: number;
  

};

export const Merchants = api.injectEndpoints({
    endpoints: (build) => ({
        getMerchants: build.query<GetMerchantsResponse, GetMerchantsRequestParams>({
            query: (params: GetMerchantsRequestParams) => ({
                url: `/user/forAdmin`,
                method: 'GET',
                credentials: 'include',
                params,
            }),
            providesTags: ['getMerchants'],
        }),
        getMerchantReqest: build.query<GetMerchantsResponse, GetMerchantsRequestParams>({
            query: (params: GetMerchantsRequestParams) => ({
                url: `/user/forAdmin/merchantRequest`,
                method: 'GET',
                credentials: 'include',
                params,
            }),
            providesTags: ['getMerchantReqest'],
        }),
        updateMerchantReqest: build.mutation<any, { status: string | undefined; id: string | undefined }>({
            query: ({ status, id }: { status: string | undefined; id: string | undefined }) => ({
                url: `/user/MerchantApprovalStatus/${id}/${status}`,
                method: 'PATCH',
                credentials: 'include',
            }),
            invalidatesTags: ['getMerchants', 'updateMerchantReqest', 'getMerchantReqest'],
        }),
        getMerchantsByID: build.query<GetMerchantsByIDResponse, any>({
            query: (id: string) => ({
                url: `/nestapi/public-circle/forAdmin/${id}`,
                method: 'GET',
                credentials: 'include',
            }),
            providesTags: ['getMerchantsByID'],
        }),

        addMerchants: build.mutation<any, AddMerchantsPayload>({
            query: (body: AddMerchantsPayload) => ({
                url: `/user/createMerchant`,
                method: 'POST',
                credentials: 'include',
                body,
            }),
            invalidatesTags: ['getMerchants', 'addMerchants', 'getMerchantsByID'],
        }),

        updateMerchants: build.mutation<any, { body: AddMerchantsPayload; id: number | undefined }>({
            query: ({ body, id }: { body: AddMerchantsPayload; id: number | undefined }) => ({
                url: `/nestapi/public-circle/${id}`,
                body,
                method: 'PATCH',
                credentials: 'include',
            }),
            invalidatesTags: ['getMerchants', 'updateMerchants', 'getMerchantsByID'],
        }),
        deleteMerchants: build.mutation<any, string>({
            query: (id: string) => ({
                url: `/nestapi/public-circle/${id}`,
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: ['getMerchants', 'deleteMerchants'],
        }),
    }),
});

export const { useGetMerchantsQuery, useGetMerchantReqestQuery, useAddMerchantsMutation, useUpdateMerchantsMutation,useUpdateMerchantReqestMutation, useDeleteMerchantsMutation, useGetMerchantsByIDQuery } = Merchants;
