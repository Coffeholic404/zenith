import { useMemo } from 'react';
import { HeaderCards, StatCardItem } from '@/components/shared/stat-card';
import UserRounded from '@/public/add-employe/UserRounded.svg';
import Dep from '@/public/employees/Diploma.svg';
import people from '@/public/employees/UserHYellow.svg';
import { useGetEmployeesQuery, useGetTrainersQuery, useGetAdministratorsQuery } from '@/services/employe';

interface EmployeeHeaderCardsProps {
  totalEmployees?: number;
  totalDepartments?: number;
  totalActive?: number;
}

export default function EmployeeHeaderCards({
  totalEmployees = 5,
  totalDepartments = 5,
  totalActive = 5
}: EmployeeHeaderCardsProps) {
  // Fetch all employee data with loading and error states
  const {
    data: employeesData,
    isLoading: employeesLoading,
    isFetching: employeesFetching
  } = useGetEmployeesQuery({ searchQuery: '' });

  const {
    data: trainersData,
    isLoading: trainersLoading,
    isFetching: trainersFetching
  } = useGetTrainersQuery({ searchQuery: '' });

  const {
    data: adminsData,
    isLoading: adminsLoading,
    isFetching: adminsFetching
  } = useGetAdministratorsQuery({ searchQuery: '' });

  // Check if any query is still loading
  const isLoading = employeesLoading || trainersLoading || adminsLoading;
  const isFetching = employeesFetching || trainersFetching || adminsFetching;

  // Memoize calculated totals to avoid unnecessary recalculations
  const totalEmployeesCount = useMemo(() => employeesData?.result?.totalCount ?? 0, [employeesData]);

  const totalTrainersCount = useMemo(() => trainersData?.result?.totalCount ?? 0, [trainersData]);

  const totalAdminsCount = useMemo(() => adminsData?.result?.totalCount ?? 0, [adminsData]);
  const cardItems: StatCardItem[] = [
    {
      label: 'إجمالي الموظفين',
      value: isLoading ? <span className="animate-pulse text-gray-400">━━━</span> : totalEmployeesCount,
      icon: UserRounded,
      cardBgClass: 'bg-cardOne',
      iconBgClass: 'bg-studentClr'
    },
    {
      label: 'إجمالي الاداريين',
      value: isLoading ? <span className="animate-pulse text-gray-400">━━━</span> : totalAdminsCount,
      icon: Dep,
      cardBgClass: 'bg-cardTwo',
      iconBgClass: 'bg-studentClr'
    },
    {
      label: 'إجمالي المدربيين',
      value: isLoading ? <span className="animate-pulse text-gray-400">━━━</span> : totalTrainersCount,
      icon: people,
      cardBgClass: 'bg-cardThree',
      iconBgClass: 'bg-couresClr'
    }
  ];

  return <HeaderCards xlCols={3} items={cardItems} />;
}
