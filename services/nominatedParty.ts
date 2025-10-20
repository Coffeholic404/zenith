import { api } from './api';

export type NominatedParty = {
    uniqueID: string;
    name: string;
    studentsCount: number;
};

export type GetNominatedPartiesRequestParams = {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    isDescending?: boolean;
    searchQuery?: string;
};



export type GetNominatedPartiesResponse = {
    result: {
        data: NominatedParty[];
    };
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
};


export const NominatedPartyApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getNominatedParties: builder.query<GetNominatedPartiesResponse, any>({
            query: (params) => ({
                url: '/api/NominatedParty',
                method: 'GET',
                params,
            }),
            providesTags: ['getNominatedParty'],
        }),
        getNominatedParty: builder.query<NominatedParty, any>({
            query: (id) => ({
                url: `/api/NominatedParty/${id}`,
                method: 'GET',
            }),
            providesTags: ['getNominatedParty'],
        }),
        addNominatedParty: builder.mutation<NominatedParty, any>({
            query: (body) => ({
                url: '/api/NominatedParty',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['getNominatedParty'],
        }),

        updateNominatedParty: builder.mutation<NominatedParty, any>({
            query: (body) => ({
                url: `/api/NominatedParty/{id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['getNominatedParty'],
        }),

        deleteNominatedParty: builder.mutation<NominatedParty, any>({
            query: (id) => ({
                url: `/api/NominatedParty/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['getNominatedParty'],
        }),
    }),
});

export const { useGetNominatedPartiesQuery, useGetNominatedPartyQuery , useAddNominatedPartyMutation, useUpdateNominatedPartyMutation, useDeleteNominatedPartyMutation } = NominatedPartyApi;