import { api } from './api';

export type Skill = {
    uniqueID: string;
    name: string;
    studentsCount: number;
};

export type GetSkillsRequestParams = {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    isDescending?: boolean;
    searchQuery?: string;
};

export type GetSkillsResponse = {
    statusCode: number;
    isSuccess: boolean;
    errorMessages: string[];
    result: {
        data: Skill[];
        pageNumber: number;
        pageSize: number;
        totalPages: number;
        totalCount: number;
        hasPrevious: boolean;
        hasNext: boolean;
        searchQuery: string | null;
    };
};

export type CreateSkillRequest = {
    name: string;
};

export type UpdateSkillRequest = {
    uniqueID: string;
    name: string;
};

export type SkillResponse = {
    statusCode: number;
    isSuccess: boolean;
    errorMessages: string[];
    result: Skill;
};

export type DeleteSkillResponse = {
    statusCode: number;
    isSuccess: boolean;
    errorMessages: string[];
    result: boolean;
};

export const SkillApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getSkills: builder.query<GetSkillsResponse, GetSkillsRequestParams>({
            query: (params: GetSkillsRequestParams) => ({
                url: '/api/Skill',
                method: 'GET',
                params,
            }),
            providesTags: ['getSkills'],
        }),

        createSkill: builder.mutation<SkillResponse, CreateSkillRequest>({
            query: (skill: CreateSkillRequest) => ({
                url: '/api/Skill',
                method: 'POST',
                body: skill,
            }),
            invalidatesTags: ['getSkills'],
        }),

        updateSkill: builder.mutation<SkillResponse, { id: string; data: UpdateSkillRequest }>({
            query: ({ id, data }) => ({
                url: `/api/Skill/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['getSkills'],
        }),

        deleteSkill: builder.mutation<DeleteSkillResponse, string>({
            query: (id: string) => ({
                url: `/api/Skill/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['getSkills'],
        }),

        getSkillById: builder.query<SkillResponse, string>({
            query: (id: string) => ({
                url: `/api/Skill/${id}`,
                method: 'GET',
            }),
            providesTags: ['getSkills'],
        }),
    }),
});

export const {
    useGetSkillsQuery,
    useCreateSkillMutation,
    useUpdateSkillMutation,
    useDeleteSkillMutation,
    useGetSkillByIdQuery,
} = SkillApi;