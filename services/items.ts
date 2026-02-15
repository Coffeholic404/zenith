import { api } from './api';

export type GetItemsRequestParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  Availibility?: string;
};
export type GetItemsBarcodeRequestParams = {
  page?: number;
  pageSize?: number;
  barcode?: string;
  Availibility?: string;
};

export type GetItemsResponse = {};
export type AddItemsPayload = {
  notes: string;
  threshold: number;
  subCategoryId: string;
  name: string;
  unitId: string;
};
export type UpdateItemsPayload = {
  notes: string;
  threshold: number;
  subCategoryId: string;
  name: string;
  unitId: string;
};

export interface ItemAttachmentDetails {
  id: string;
  url: string;
  on_slider?: IsDeleted;
  item_id: string;
  createdAt: Date;
  updatedAt: Date;
}
export enum IsDeleted {
  False = 'FALSE',
  True = 'TRUE'
}
export interface CategoryStore {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  storeId: string;
  Category?: { title: string; id: string };
  Status: IsDeleted;
  on_slider: IsDeleted;
  Item: GetItemForCasherByIDResponse[];
}

export interface GetItemForCasherByIDResponse {
  item: {
    id: string;
    title: string;
    description: string;
    code: string;
    Availibility: string;
    old_price: string;
    _count: { Favourite: number };
    price: string;
    discount: number;
    qty: number;
    special_type: string;
    categoryStoreId: string;
    parentId: null | string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: IsDeleted;
    ItemAttachment: ItemAttachmentDetails[];
    childItems?: GetItemForCasherByIDResponse[];
    ItemProperties?: any;
    parentItem?: any;
    CategoryStore?: CategoryStore;
  };
  otherProperties: any;
}

export type GetItemsByIDResponse = {
  id: number;
};

export const Items = api.injectEndpoints({
  endpoints: build => ({
    getItemsByBarcode: build.query<GetItemsResponse, GetItemsBarcodeRequestParams>({
      query: (params: GetItemsBarcodeRequestParams) => ({
        url: `/api/Item/getItenByBarcode`,
        method: 'GET',
        params
      }),
      providesTags: []
    }),
    getItems: build.query<GetItemsResponse, GetItemsRequestParams>({
      query: (params: GetItemsRequestParams) => ({
        url: `/api/Item`,
        method: 'GET',
        params
      }),
      providesTags: ['getItems']
    }),
    getItemsForExpo: build.query<GetItemsResponse, GetItemsRequestParams>({
      query: (params: GetItemsRequestParams) => ({
        url: `/api/Item/GetItemUnitSubUnitQty`,
        method: 'GET',
        params
      }),
      providesTags: ['getItemsForExpo']
    }),
    getItemsByID: build.query<GetItemsByIDResponse, string>({
      query: (id: string) => ({
        url: `/users/${id}`,
        method: 'GET'
      }),
      providesTags: ['getItemsByID']
    }),

    addItems: build.mutation<any, AddItemsPayload>({
      query: (body: AddItemsPayload) => ({
        url: `/api/Item`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['getItems', 'addItems', 'getItemsByID']
    }),

    updateItems: build.mutation<any, { body: UpdateItemsPayload; id: string }>({
      query: ({ body, id }: { body: UpdateItemsPayload; id: string }) => ({
        url: `/api/Item/${id}`,
        body,
        method: 'PUT'
      }),
      invalidatesTags: ['getItems', 'updateItems', 'getItemsByID']
    }),
    deleteItems: build.mutation<any, string>({
      query: (id: string) => ({
        url: `/api/Item/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['getItems', 'deleteItems', 'getItemsByID']
    }),
    GetItemsForCasherById: build.query<GetItemForCasherByIDResponse, { id: string; params?: Record<string, any> }>({
      query: ({ id, params }) => ({
        url: `/item/wihtProperty/forCasher/${id}`,

        method: 'GET',
        credentials: 'include',
        params
      }),
      providesTags: ['GetItemsForCasherById']
    })
  })
});

export const {
  useGetItemsQuery,
  useGetItemsByBarcodeQuery,
  useGetItemsForExpoQuery,
  useAddItemsMutation,
  useUpdateItemsMutation,
  useDeleteItemsMutation,
  useGetItemsByIDQuery,
  useGetItemsForCasherByIdQuery
} = Items;
