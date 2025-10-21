import { api } from './api';

export type Student = { 
    uniqueID: string;
        name: string;
        degree: string;
        bdate: string; // string($date-time)
        phone: string;
        yearsOfServes: number;
        nominatedPartyId: string;
        nominatedPartyName: string;
        hight: number;
        width: number;
        bodyCondition: string;
        epilepsy: boolean;
        heartDisease: boolean;
        sugar: boolean;
        pressure: boolean;
        notes: string;
        subscriptionTypeId: string;
        subscriptionTypeName: string;
}

export type GetStudentsRequestParams = {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    isDescending?: boolean;
    searchQuery?: string;
};

export type GetStudentsResponse = {
    result: {
        data: Student[];
    };
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
};



export const StudentApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getStudents: builder.query<GetStudentsResponse, GetStudentsRequestParams>({
            query: (params: GetStudentsRequestParams) => ({
                url: '/api/Student',
                method: 'GET',
                params,
            }),
            providesTags: ['getStudents'],
        }),

        addStudent: builder.mutation<Student, FormData>({
            query: (student: FormData) => ({
                url: '/api/Student',
                method: 'POST',
                body: student,
            }),
            invalidatesTags: ['getStudents'],
        }),

        deleteStudent: builder.mutation<boolean, string>({
            query: (uniqueID: string) => ({
                url: `/api/Student/${uniqueID}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['getStudents'],
        }),
    }),
});

export const { useGetStudentsQuery, useAddStudentMutation, useDeleteStudentMutation } = StudentApi;