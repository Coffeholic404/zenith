'use client';
import { DataTable } from '@/components/data-table';
import { DataTableSkeleton } from '@/components/ui/data-table-skeleton';

import { columnsNames, columns } from '@/components/pages/adds/adds-columns';
import { nominatedColumns, nominatedColumnsNames } from '@/components/pages/adds/nominated/nominated-columns';
import {
  SubscriptionsColumns,
  SubscriptionsColumnsNames
} from '@/components/pages/adds/subscriptions/subscriptions-columns';
import { useGetNominatedPartiesQuery, NominatedParty } from '@/services/nominatedParty';
import { useGetSubscriptionsQuery, subscriptionApi } from '@/services/subscriptions';
import { AttachmentColumns, AttachmentColumnsNames } from '@/components/pages/adds/attachment/attachment-columns';
import {
  TrainingCoursesColumns,
  TrainingCoursesColumnsNames
} from '@/components/pages/adds/TrainingCourses/courses-columns';
import { useGetAttachmentTypesQuery, AttachmentType } from '@/services/attachment';
import { SkillsColumns, SkillsColumnsNames } from '@/components/pages/adds/skills/skills-columns';
import { useGetSkillsQuery, Skill } from '@/services/skills';
import { useGetTrainingCoursesQuery, TrainingCourse } from '@/services/trainingCourses';
import { planeColumns, planeColumnsNames } from '@/components/pages/adds/plane/plane-columns';
import { useGetPlanesQuery, Plane } from '@/services/plane';
import { PlacesColumns, PlacesColumnsNames } from '@/components/pages/adds/places/places-columns';
import { material, materialColumns, materialColumnsNames } from '@/components/pages/adds/Materials/materials-columns';
import { useGetPlacesQuery, PlaceItem } from '@/services/place';
import { coursesTypeColumns, coursesTypeColumnsNames } from '@/components/pages/adds/coursesType/coursesType-columns';
import { useGetTypesQuery, TypeItem } from '@/services/types';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { category, categoryColumns, categoryColumnsNames } from '@/components/pages/adds/category/category-columns';
import { unit, unitColumns, unitColumnsNames } from '@/components/pages/adds/units/units-columns';
export default function Page() {
  const {
    data: nominatedParties,
    isLoading: nominatedPartiesLoading,
    error,
    isSuccess
  } = useGetNominatedPartiesQuery({});
  const {
    data: subscriptions,
    isLoading: subscriptionsLoading,
    error: subscriptionsError,
    isSuccess: subscriptionsSuccess
  } = useGetSubscriptionsQuery({});
  const {
    data: attachmentTypes,
    isLoading: attachmentTypesLoading,
    error: attachmentTypesError,
    isSuccess: attachmentTypesSuccess
  } = useGetAttachmentTypesQuery({});
  const {
    data: skills,
    isLoading: skillsLoading,
    error: skillsError,
    isSuccess: skillsSuccess
  } = useGetSkillsQuery({});

  const {
    data: trainingCourses,
    isLoading: trainingCoursesLoading,
    error: trainingCoursesError,
    isSuccess: trainingCoursesSuccess
  } = useGetTrainingCoursesQuery({});

  const {
    data: planes,
    isLoading: planesLoading,
    error: planesError,
    isSuccess: planesSuccess
  } = useGetPlanesQuery({});
  const {
    data: places,
    isLoading: placesLoading,
    error: placesError,
    isSuccess: placesSuccess
  } = useGetPlacesQuery({});
  const { data: types, isLoading: typesLoading, error: typesError, isSuccess: typesSuccess } = useGetTypesQuery({});

  let nominatedPartiesData: NominatedParty[] = [];
  let subscriptionsData: subscriptionApi[] = [];
  let attachmentTypesData: AttachmentType[] = [];
  let trainingCoursesData: TrainingCourse[] = [];
  let planesData: Plane[] = [];
  let placesData: PlaceItem[] = [];
  let skillsData: Skill[] = [];
  let typesData: TypeItem[] = [];

  if (typesSuccess && types?.result?.data) {
    typesData = types?.result.data || [];
  }
  if (trainingCoursesSuccess && trainingCourses?.result?.data) {
    trainingCoursesData = trainingCourses?.result.data || [];
  }
  if (isSuccess && nominatedParties?.result?.data) {
    nominatedPartiesData = nominatedParties?.result.data || [];
  }
  if (subscriptionsSuccess && subscriptions?.result?.data) {
    subscriptionsData = subscriptions?.result.data || [];
  }
  if (attachmentTypesSuccess && attachmentTypes?.result?.data) {
    attachmentTypesData = attachmentTypes?.result.data || [];
  }
  if (isSuccess && skills?.result?.data) {
    skillsData = skills?.result.data || [];
  }
  if (planesSuccess && planes?.result?.data) {
    planesData = planes?.result.data || [];
  }
  if (placesSuccess && places?.result?.data) {
    placesData = places?.result.data || [];
  }
  const materialsLoading = false;
  const materialsData: material[] = [
    {
      uniqueID: '1',
      name: 'material 1',
      category: 'category 1',
      unit: 'unit 1',
      code: 'code 1',
      producingCountry: 'producingCountry 1',
      cost: 1,
      weight: 1,
      tradeMark: 'tradeMark 1'
    },
    {
      uniqueID: '2',
      name: 'material 2',
      category: 'category 2',
      unit: 'unit 2',
      code: 'code 2',
      producingCountry: 'producingCountry 2',
      cost: 2,
      weight: 2,
      tradeMark: 'tradeMark 2'
    },
    {
      uniqueID: '3',
      name: 'material 3',
      category: 'category 3',
      unit: 'unit 3',
      code: 'code 3',
      producingCountry: 'producingCountry 3',
      cost: 3,
      weight: 3,
      tradeMark: 'tradeMark 3'
    }
  ];

  const categoryLoading = false;
  const categoryData: category[] = [
    {
      uniqueID: '1',
      name: 'category 1'
    },
    {
      uniqueID: '2',
      name: 'category 2'
    },
    {
      uniqueID: '3',
      name: 'category 3'
    }
  ];

  const unitsLoading = false;
  const unitsData: unit[] = [
    {
      uniqueID: '1',
      name: 'unit 1'
    },
    {
      uniqueID: '2',
      name: 'unit 2'
    },
    {
      uniqueID: '3',
      name: 'unit 3'
    }
  ];

  const tabs = [
    {
      value: 'الطائرات',
      label: 'الطائرات'
    },
    {
      value: 'الاماكن',
      label: 'الاماكن'
    },
    {
      value: 'انواع الدورات',
      label: 'انواع الدورات'
    },
    {
      value: 'انواع الاشتراكات',
      label: 'انواع الاشتراكات'
    },
    {
      value: 'دورات بدنية',
      label: 'دورات بدنية'
    },
    {
      value: 'مواد',
      label: 'مواد'
    },
    {
      value: 'الفئات',
      label: 'الفئات'
    },
    {
      value: 'الوحدات',
      label: 'الوحدات'
    },
    {
      value: 'انواع المرفقات ',
      label: 'انواع المرفقات '
    },
    {
      value: 'جهة الترشيح',
      label: 'جهة الترشيح'
    },
    {
      value: 'المهارات',
      label: 'المهارات'
    }
  ];

  return (
    <div>
      <section>
        <Tabs defaultValue="الطائرات" className="w-full bg-transparent ">
          <TabsList className="flex justify-start items-center md:flex-wrap md:shrink bg-transparent h-auto space-x-2">
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-center data-[state=active]:text-sidebaractive"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="الطائرات" className="bg-white rounded-lg">
            {planesLoading ? (
              <DataTableSkeleton columnCount={3} rowCount={5} showAddButton={true} />
            ) : (
              <DataTable columns={planeColumns} data={planesData} columnsNames={planeColumnsNames} type="plane" />
            )}
          </TabsContent>
          <TabsContent value="الاماكن" className="bg-white rounded-lg">
            {placesLoading ? (
              <DataTableSkeleton columnCount={3} rowCount={5} showAddButton={true} />
            ) : (
              <DataTable columns={PlacesColumns} data={placesData} columnsNames={PlacesColumnsNames} type="place" />
            )}
          </TabsContent>
          <TabsContent value="انواع الدورات" className="bg-white rounded-lg">
            {trainingCoursesLoading ? (
              <DataTableSkeleton columnCount={3} rowCount={5} showAddButton={true} />
            ) : (
              <DataTable
                columns={coursesTypeColumns}
                data={typesData}
                columnsNames={coursesTypeColumnsNames}
                type="coursesType"
              />
            )}
          </TabsContent>
          <TabsContent value="انواع الاشتراكات" className="bg-white rounded-lg">
            {subscriptionsLoading ? (
              <DataTableSkeleton columnCount={3} rowCount={5} showAddButton={true} />
            ) : (
              <DataTable
                columns={SubscriptionsColumns}
                data={subscriptionsData}
                columnsNames={SubscriptionsColumnsNames}
                type={'subscriptions'}
              />
            )}
          </TabsContent>
          <TabsContent value="دورات بدنية" className="bg-white rounded-lg">
            {trainingCoursesLoading ? (
              <DataTableSkeleton columnCount={3} rowCount={5} showAddButton={true} />
            ) : (
              <DataTable
                columns={TrainingCoursesColumns}
                data={trainingCoursesData}
                columnsNames={TrainingCoursesColumnsNames}
                type="trainingCourses"
              />
            )}
          </TabsContent>
          <TabsContent value="المهارات" className="bg-white rounded-lg">
            {skillsLoading ? (
              <DataTableSkeleton columnCount={3} rowCount={5} showAddButton={true} />
            ) : (
              <DataTable columns={SkillsColumns} data={skillsData} columnsNames={SkillsColumnsNames} type="skills" />
            )}
          </TabsContent>
          <TabsContent value="مواد" className="bg-white rounded-lg">
            {materialsLoading ? (
              <DataTableSkeleton columnCount={3} rowCount={5} showAddButton={true} />
            ) : (
              <DataTable
                columns={materialColumns}
                data={materialsData}
                columnsNames={materialColumnsNames}
                type="materials"
              />
            )}
          </TabsContent>
          <TabsContent value="الفئات" className="bg-white rounded-lg">
            {categoryLoading ? (
              <DataTableSkeleton columnCount={3} rowCount={5} showAddButton={true} />
            ) : (
              <DataTable
                columns={categoryColumns}
                data={categoryData}
                columnsNames={categoryColumnsNames}
                type="category"
              />
            )}
          </TabsContent>
          <TabsContent value="الوحدات" className="bg-white rounded-lg">
            {unitsLoading ? (
              <DataTableSkeleton columnCount={3} rowCount={5} showAddButton={true} />
            ) : (
              <DataTable columns={unitColumns} data={unitsData} columnsNames={unitColumnsNames} type="units" />
            )}
          </TabsContent>
          <TabsContent value="انواع المرفقات " className="bg-white rounded-lg">
            <DataTable
              columns={AttachmentColumns}
              data={attachmentTypesData}
              columnsNames={AttachmentColumnsNames}
              type="attachmentTypes"
            />
          </TabsContent>
          <TabsContent value="جهة الترشيح" className="bg-white rounded-lg">
            {nominatedPartiesLoading ? (
              <DataTableSkeleton columnCount={3} rowCount={5} showAddButton={true} />
            ) : (
              <DataTable
                columns={nominatedColumns}
                data={nominatedPartiesData}
                columnsNames={nominatedColumnsNames}
                type={'nominated'}
              />
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
