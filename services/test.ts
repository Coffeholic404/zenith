import { api } from './api';

export type GetCategoryRequestParams = {};

export type GetCategoryResponse = {};
export type AddCategoryPayload = {
  title: string;
  description: string;
  on_slider: string;
  img: string;
};
export type AddCategoryMPayload = {
  categorIds: string[];
};
export type UpdateDepartmentsPayload = {
  name: string;
};
export type GetCategoryByIDResponse = {
  id: number;
};

export const TESTAA = api.injectEndpoints({
  endpoints: build => ({
    getTest1: build.query<GetCategoryResponse, GetCategoryRequestParams>({
      query: (params: GetCategoryRequestParams) => ({
        url: `/api/Traking?page=1&pageSize=25`,
        method: 'GET',
        credentials: 'include',
        params
      }),
      providesTags: ['getCategoryAll']
    }),

    getTest2: build.query<GetCategoryResponse, GetCategoryRequestParams>({
      query: (params: GetCategoryRequestParams) => ({
        url: `/api/Group?page=1&pageSize=25`,
        method: 'GET',
        credentials: 'include',
        params
      }),
      providesTags: ['getCategory']
    })
  })
});

export const { useGetTest1Query, useGetTest2Query } = TESTAA;
