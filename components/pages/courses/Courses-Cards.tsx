import { useMemo } from 'react';
import { HeaderCards, StatCardItem } from '@/components/shared/stat-card';
import UserRounded from '@/public/add-employe/UserRounded.svg';
import Dep from '@/public/employees/Diploma.svg';
import people from '@/public/employees/UserHYellow.svg';
import {
  useGetCoursesQuery,
  useGetActiveCoursesQuery,
  useGetCompletedCoursesQuery,
  useGetUpcomingCoursesQuery
} from '@/services/courses';

interface CoursesHeaderCardsProps {
  totalCourses?: number;
  totalActiveCourses?: number;
  totalCompletedCourses?: number;
  totalUpcomingCourses?: number;
}

export default function CoursesHeaderCards({
  totalCourses = 5,
  totalActiveCourses = 5,
  totalCompletedCourses = 5,
  totalUpcomingCourses = 5
}: CoursesHeaderCardsProps) {
  // Fetch all employee data with loading and error states
  const {
    data: coursesData,
    isLoading: coursesLoading,
    isFetching: coursesFetching
  } = useGetCoursesQuery({ searchQuery: '' });

  const {
    data: activeCoursesData,
    isLoading: activeCoursesLoading,
    isFetching: activeCoursesFetching
  } = useGetActiveCoursesQuery({ searchQuery: '' });

  const {
    data: completedCoursesData,
    isLoading: completedCoursesLoading,
    isFetching: completedCoursesFetching
  } = useGetCompletedCoursesQuery({ searchQuery: '' });

  const {
    data: upcomingCoursesData,
    isLoading: upcomingCoursesLoading,
    isFetching: upcomingCoursesFetching
  } = useGetUpcomingCoursesQuery({ searchQuery: '' });

  // Check if any query is still loading
  const isLoading = coursesLoading;
  const isFetching = coursesFetching;

  // Memoize calculated totals to avoid unnecessary recalculations
  const totalCoursesCount = useMemo(() => coursesData?.result?.totalCount ?? 0, [coursesData]);

  const totalActiveCoursesCount = useMemo(() => activeCoursesData?.result?.totalCount ?? 0, [activeCoursesData]);

  const totalCompletedCoursesCount = useMemo(
    () => completedCoursesData?.result?.totalCount ?? 0,
    [completedCoursesData]
  );
  const totalUpcomingCoursesCount = useMemo(() => upcomingCoursesData?.result?.totalCount ?? 0, [upcomingCoursesData]);
  const cardItems: StatCardItem[] = [
    {
      label: 'مجوع الدورات الكلي',
      value: isLoading ? <span className="animate-pulse text-gray-400">━━━</span> : totalCoursesCount,
      icon: UserRounded,
      cardBgClass: 'bg-cardOne',
      iconBgClass: 'bg-studentClr'
    },
    {
      label: 'إجمالي الدورات النشطة',
      value: isLoading ? <span className="animate-pulse text-gray-400">━━━</span> : totalActiveCoursesCount,
      icon: Dep,
      cardBgClass: 'bg-cardTwo',
      iconBgClass: 'bg-studentClr'
    },
    {
      label: 'إجمالي الدورات القادمة',
      value: isLoading ? <span className="animate-pulse text-gray-400">━━━</span> : totalUpcomingCoursesCount,
      icon: Dep,
      cardBgClass: 'bg-cardTwo',
      iconBgClass: 'bg-studentClr'
    },
    {
      label: 'إجمالي الدورات المكتملة',
      value: isLoading ? <span className="animate-pulse text-gray-400">━━━</span> : totalCompletedCoursesCount,
      icon: people,
      cardBgClass: 'bg-cardThree',
      iconBgClass: 'bg-couresClr'
    }
  ];

  return <HeaderCards xlCols={4} items={cardItems} />;
}
