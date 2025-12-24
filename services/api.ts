import { FetchArgs, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession, signOut } from 'next-auth/react';

export const BASE_URL = process.env.BASIC_URL;
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',

  prepareHeaders: async (headers: any) => {
    let token: string;
    const session = await getSession();
    token = session?.user?.result?.token || '';
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

const baseQueryWithReAuth = async (args: FetchArgs, api: any, extraOptions: any) => {
  let result: any = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401 && window.location.pathname !== '/login') {
    // Get the current session to access the refresh token
    const session = await getSession();
    const refreshToken = session?.user?.result?.refreshToken;

    if (!refreshToken) {
      // No refresh token available, sign out
      if (typeof window !== 'undefined') {
        signOut({ redirect: false });
        window.location.assign(window.location.origin + '/login');
      }
      throw new Error('No refresh token available');
    }

    const refreshResult: any = await baseQuery(
      {
        url: '/api/Account/refresh-token',
        method: 'POST',
        body: { refreshToken }
      },
      api,
      extraOptions
    );

    if (refreshResult.data && refreshResult.data.isSuccess) {
      // Token refreshed successfully, retry the original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, sign out
      if (typeof window !== 'undefined') {
        signOut({ redirect: false });
        window.location.assign(window.location.origin + '/login');
      }
      throw new Error('Failed to refresh token');
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReAuth,

  tagTypes: [
    'LocationSlider',
    'LocationAds',
    'getUsers',
    'getSimport',
    'addUsers',
    'getUsersByID',
    'updateUsers',
    'deleteUsers',
    'getBranch',
    'getBranchAll',
    'addBranch',
    'getBranchByID',
    'updateBranch',
    'deleteBranch',
    'getItems',
    'getItemsByBarcode',
    'addItems',
    'getItemsByID',
    'getItemsForExpo',
    'updateItems',
    'deleteItems',
    'getDepartments',
    'getDepartmentsAll',
    'addDepartments',
    'getDepartmentsByID',
    'updateDepartments',
    'deleteDepartments',
    'getEmployees',
    'getEmployeesAll',
    'addEmployees',
    'getEmployeesByID',
    'updateEmployees',
    'deleteEmployees',
    'getUnits',
    'getUnitsAll',
    'addUnits',
    'getUnitsByID',
    'updateUnits',
    'deleteUnits',
    'getSubUnits',
    'getSubUnitsAll',
    'addSubUnits',
    'getSubUnitsByUnitID',
    'updateSubUnits',
    'deleteSubUnits',
    'getImport',
    'addImport',
    'getImportByID',
    'updateImport',
    'deleteImport',
    'getExport',
    'addExport',
    'getExportByID',
    'updateExport',
    'deleteExport',
    'getThresold',
    'getExpired',
    'getTemporary',
    'getTemporarySearch',
    'getOrders',
    'getPurchases',
    'addOrdersPurchases',
    'updateOrdersPurchases',
    'deleteOrdersPurchases',
    'getOrdersPurchasesByFilter',
    'getSummary',
    'updateTemporary',

    'getCategory',
    'getCategoryAll',
    'addCategory',
    'getCategoryByID',
    'updateCategoryMerchant',
    'getCategoryM',
    'updateCategory',
    'deleteCategory',
    'updateSetting',
    'getSetting',
    'deleteMerchants',
    'updateMerchants',
    'addMerchants',
    'getMerchantsByID',
    'getMerchants',
    'getMerchantReqest',
    'updateMerchantReqest',
    'removeAdmin',
    'updateAdmin',
    'addAdmin',
    'AdminByID',
    'Admin',
    'restoreTable',
    'removeTable',
    'updateTable',
    'addTable',
    'getTableRoles',
    'getTableByName',
    'Table',
    'TableByID',
    'getSubscription',
    'updateSubscription',
    'getSubscriptionMerchant',
    'getPlan',
    'addSubscription',
    'AdminM',
    'addAdminM',
    'updateAdminM',
    'Profile',
    'updateStoresAdmin',
    'getStores',
    'updateStorePlan',
    'paySubscription',
    'deleteCategoryM',
    'updateCategoryٍSlide',
    'addSlider',
    'getSlider',
    'deleteSlider',
    'desabledSlider',
    'getAds',
    'addAds',
    'deleteAds',
    'updateAds',
    'statusAds',
    'paymentAds',
    'getProducts',
    'getCategoryStoreId',
    'addProduct',
    'updateProduct',
    'deleteProduct',
    'deleteProductImg',
    'changeOnSliderStatusImg',
    'addProductImg',
    'logout',
    'refresh',
    'updateUser',
    'Governorate',
    'updateStores',
    'addAttachment',
    'updateAttachment',
    'updateAttachmentMerchant',
    'getAttachmentM',
    'getAttachment',
    'deleteAttachment',
    'getAtttypes',
    'CheckStore',
    'removeAdminM',
    'updatePlan',
    'getOrder',
    'paidStatusOrder',
    'getOrderByID',
    'getDashA',
    'getDashM',

    'getCoupon',
    'addCoupon',
    'updateCoupon',
    'deleteCoupon',
    'updateLogo',
    'EquipmentStatusOrder',
    'updatepayment',

    'GetItemsForCasherById',
    'getOrderForAdmin',
    'addCashier',
    'MerchantStatusOrder',
    'AdminStatusOrder',

    // employe
    'getEmployees',
    'getEmployeeById',
    'addEmployee',
    'updateEmployee',
    'deleteEmployee',
    'getTrainers',
    'getAdministrators',

    // student
    'getStudents',

    // nominatedParty
    'getNominatedParty',

    //skills
    'getSkills',
    'createSkill',
    'updateSkill',
    'deleteSkill',
    'getSkillById',

    // trainingCourses
    'getTrainingCourse',
    'addTrainingCourse',
    'updateTrainingCourse',
    'deleteTrainingCourse',
    'getTrainingCourseById',

    //Types
    'Types',

    //plane
    'Plane',

    //courses
    'Course',

    //courses types
    'Place',

    //activity
    'Activity',
    'deleteActivity',

    //accident
    'Accident',

    //CoStTr
    'CoStTr',

    //evaluation
    'Evaluation',
    'deleteEvaluation'
  ],
  endpoints: build => ({})
});
