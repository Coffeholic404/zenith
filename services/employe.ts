import { api } from './api';

// Employee entity types based on API schema
export type Employee = {
  id?: string;
  name: string;
  birthDate: string; // string($date-time)
  phone: string;
  jobTitle: string;
  eType: boolean;
  attachment?: string; // string($binary)
  character?: string;
  licenseNumber?: string;
  typeOfTraining?: string;
  employeeTypeName?: string;
};

// Request/Response types for different endpoints
export type GetEmployeesRequestParams = {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  isDescending?: boolean;
  searchQuery?: string;
};

export type GetEmployeesResponse = {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: {
    data: Employee[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    searchQuery: string | null;
  };
};

export type GetEmployeeByIdResponse = {
  result: {
    id?: string;
    name: string;
    birthDate: string; // string($date-time)
    phone: string;
    jobTitle: string;
    eType: boolean;
    attachment?: string; // string($binary)
    character?: string;
    licenseNumber?: string;
    typeOfTraining?: string;
  };
};

export type AddEmployeePayload = FormData; // For multipart/form-data

export type UpdateEmployeePayload = FormData; // For multipart/form-data

export type DeleteEmployeeResponse = {
  success: boolean;
  message?: string;
};

// Employee API endpoints
export const EmployeeApi = api.injectEndpoints({
  endpoints: build => ({
    // GET /api/Employee - Get all employees with pagination and filtering
    getEmployees: build.query<GetEmployeesResponse, GetEmployeesRequestParams>({
      query: (params: GetEmployeesRequestParams) => ({
        url: '/api/Employee',
        method: 'GET',
        credentials: 'include',
        params
      }),
      providesTags: ['getEmployees']
    }),

    // GET /api/Employee/{id} - Get employee by ID
    getEmployeeById: build.query<GetEmployeeByIdResponse, string>({
      query: (id: string) => ({
        url: `/api/Employee/${id}`,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: ['getEmployeesByID']
    }),

    // POST /api/Employee - Create new employee
    addEmployee: build.mutation<Employee, AddEmployeePayload>({
      query: (body: AddEmployeePayload) => ({
        url: '/api/Employee',
        method: 'POST',
        credentials: 'include',
        body
      }),
      invalidatesTags: ['getEmployees', 'addEmployees']
    }),

    // PUT /api/Employee/{id} - Update existing employee
    updateEmployee: build.mutation<Employee, { id: string; body: UpdateEmployeePayload }>({
      query: ({ id, body }) => ({
        url: `/api/Employee/${id}`,
        method: 'PUT',
        credentials: 'include',
        body
      }),
      invalidatesTags: ['getEmployees', 'getEmployeesByID', 'updateEmployees']
    }),

    // DELETE /api/Employee/{id} - Delete employee
    deleteEmployee: build.mutation<DeleteEmployeeResponse, string>({
      query: (id: string) => ({
        url: `/api/Employee/${id}`,
        method: 'DELETE',
        credentials: 'include'
      }),
      invalidatesTags: ['getEmployees', 'deleteEmployees']
    }),

    // GET /api/Employee/trainers - Get all trainers
    getTrainers: build.query<GetEmployeesResponse, GetEmployeesRequestParams>({
      query: (params: GetEmployeesRequestParams) => ({
        url: '/api/Employee/trainers',
        method: 'GET',
        credentials: 'include',
        params
      }),
      providesTags: ['getEmployees']
    }),

    // GET /api/Employee/administrators - Get all administrators
    getAdministrators: build.query<GetEmployeesResponse, GetEmployeesRequestParams>({
      query: (params: GetEmployeesRequestParams) => ({
        url: '/api/Employee/administrators',
        method: 'GET',
        credentials: 'include',
        params
      }),
      providesTags: ['getEmployees']
    })
  })
});

// Export hooks for usage in functional components
export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useAddEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetTrainersQuery,
  useGetAdministratorsQuery
} = EmployeeApi;
