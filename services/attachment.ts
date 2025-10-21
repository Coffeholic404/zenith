import { api } from './api';

export type AttachmentType = {
    uniqueID: string;
    name: string;
    attachmentsCount: number;
};

export type GetAttachmentTypesRequestParams = {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    isDescending?: boolean;
    searchQuery?: string;
};

export type GetAttachmentTypesResponse = {
    statusCode: number;
    isSuccess: boolean;
    errorMessages: string[];
    result: {
        data: AttachmentType[];
        pageNumber: number;
        pageSize: number;
        totalPages: number;
        totalCount: number;
        hasPrevious: boolean;
        hasNext: boolean;
        searchQuery: string | null;
    };
};

export type CreateAttachmentTypeRequest = {
    name: string;
};

export type UpdateAttachmentTypeRequest = {
    uniqueID: string;
    name: string;
};

export type AttachmentTypeResponse = {
    statusCode: number;
    isSuccess: boolean;
    errorMessages: string[];
    result: AttachmentType;
};

export type DeleteAttachmentTypeResponse = {
    statusCode: number;
    isSuccess: boolean;
    errorMessages: string[];
    result: boolean;
};

export const AttachmentTypeApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAttachmentTypes: builder.query<GetAttachmentTypesResponse, GetAttachmentTypesRequestParams>({
            query: (params: GetAttachmentTypesRequestParams) => ({
                url: '/api/AttachmentType',
                method: 'GET',
                params,
            }),
            providesTags: ['getAttachment'],
        }),

        createAttachmentType: builder.mutation<AttachmentTypeResponse, CreateAttachmentTypeRequest>({
            query: (attachmentType: CreateAttachmentTypeRequest) => ({
                url: '/api/AttachmentType',
                method: 'POST',
                body: attachmentType,
            }),
            invalidatesTags: ['getAttachment'],
        }),

        updateAttachmentType: builder.mutation<AttachmentTypeResponse, { id: string; data: UpdateAttachmentTypeRequest }>({
            query: ({ id, data }) => ({
                url: `/api/AttachmentType/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['getAttachment'],
        }),

        deleteAttachmentType: builder.mutation<DeleteAttachmentTypeResponse, string>({
            query: (id: string) => ({
                url: `/api/AttachmentType/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['getAttachment'],
        }),

        getAttachmentTypeById: builder.query<AttachmentTypeResponse, string>({
            query: (id: string) => ({
                url: `/api/AttachmentType/${id}`,
                method: 'GET',
            }),
            providesTags: ['getAttachment'],
        }),
    }),
});

export const {
    useGetAttachmentTypesQuery,
    useCreateAttachmentTypeMutation,
    useUpdateAttachmentTypeMutation,
    useDeleteAttachmentTypeMutation,
    useGetAttachmentTypeByIdQuery,
} = AttachmentTypeApi;