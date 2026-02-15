import { useMemo } from 'react';
import { HeaderCards, StatCardItem } from '@/components/shared/stat-card';
import UserRounded from '@/public/add-employe/UserRounded.svg';
import { useGetStudentsQuery } from '@/services/students';

interface StudentHeaderCardsProps {
  totalStudents?: number;
}

export default function StudentHeaderCards({ totalStudents = 5 }: StudentHeaderCardsProps) {
  // Fetch all employee data with loading and error states
  const {
    data: studentsData,
    isLoading: studentsLoading,
    isFetching: studentsFetching
  } = useGetStudentsQuery({ searchQuery: '' });

  // Check if any query is still loading
  const isLoading = studentsLoading;
  const isFetching = studentsFetching;

  // Memoize calculated totals to avoid unnecessary recalculations
  const totalStudentsCount = useMemo(() => studentsData?.result?.totalCount ?? 0, [studentsData]);

  const cardItems: StatCardItem[] = [
    {
      label: 'إجمالي الطلاب',
      value: isLoading ? <span className="animate-pulse text-gray-400">━━━</span> : totalStudentsCount,
      icon: UserRounded,
      cardBgClass: 'bg-cardOne',
      iconBgClass: 'bg-studentClr'
    }
  ];

  return <HeaderCards xlCols={3} items={cardItems} />;
}
