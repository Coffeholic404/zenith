"use client"
import { DataTable } from "@/components/data-table";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";

import { columnsNames, columns } from "@/components/pages/adds/adds-columns";
import { nominatedColumns, nominatedColumnsNames } from "@/components/pages/adds/nominated/nominated-columns";
import { SubscriptionsColumns, SubscriptionsColumnsNames } from "@/components/pages/adds/subscriptions/subscriptions-columns";
import { useGetNominatedPartiesQuery, NominatedParty } from "@/services/nominatedParty"
import { useGetSubscriptionsQuery, subscriptionApi } from "@/services/subscriptions"
import { AttachmentColumns, AttachmentColumnsNames } from "@/components/pages/adds/attachment/attachment-columns";
import { TrainingCoursesColumns, TrainingCoursesColumnsNames } from "@/components/pages/adds/TrainingCourses/courses-columns";
import { useGetAttachmentTypesQuery, AttachmentType } from "@/services/attachment";
import { SkillsColumns, SkillsColumnsNames } from "@/components/pages/adds/skills/skills-columns";
import { useGetSkillsQuery, Skill } from "@/services/skills";
import { useGetTrainingCoursesQuery, TrainingCourse } from "@/services/trainingCourses";
import { planeColumns, planeColumnsNames } from "@/components/pages/adds/plane/plane-columns";
import { useGetPlanesQuery, Plane } from "@/services/plane";



import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
export default function Page() {
  const { data: nominatedParties, isLoading: nominatedPartiesLoading, error, isSuccess } = useGetNominatedPartiesQuery({
  })
  const { data: subscriptions, isLoading: subscriptionsLoading, error: subscriptionsError, isSuccess: subscriptionsSuccess } = useGetSubscriptionsQuery({
  })
  const { data: attachmentTypes, isLoading: attachmentTypesLoading, error: attachmentTypesError, isSuccess: attachmentTypesSuccess } = useGetAttachmentTypesQuery({
  })
  const { data: skills, isLoading: skillsLoading, error: skillsError, isSuccess: skillsSuccess } = useGetSkillsQuery({
  })

  const { data: trainingCourses, isLoading: trainingCoursesLoading, error: trainingCoursesError, isSuccess: trainingCoursesSuccess } = useGetTrainingCoursesQuery({
  })

  const { data: planes, isLoading: planesLoading, error: planesError, isSuccess: planesSuccess } = useGetPlanesQuery({
  })

  let nominatedPartiesData: NominatedParty[] = []
  let subscriptionsData: subscriptionApi[] = []
  let attachmentTypesData: AttachmentType[] = []
  let trainingCoursesData: TrainingCourse[] = []
  let planesData: Plane[] = []
  
  let skillsData: Skill[] = []
  if (trainingCoursesSuccess && trainingCourses?.result?.data) {
    trainingCoursesData = trainingCourses?.result.data || []
  }
  if (isSuccess && nominatedParties?.result?.data) {
    nominatedPartiesData = nominatedParties?.result.data || []
  }
  if (subscriptionsSuccess && subscriptions?.result?.data) {
    subscriptionsData = subscriptions?.result.data || []
  }
  if (attachmentTypesSuccess && attachmentTypes?.result?.data) {
    attachmentTypesData = attachmentTypes?.result.data || []
  }
  if (isSuccess && skills?.result?.data) {
    skillsData = skills?.result.data || []
  }
  if (planesSuccess && planes?.result?.data) {
    planesData = planes?.result.data || []
  }
  
  const data = [{
    name: "plan 1",
    date: "2023-01-01",
    notes: "plan 1 notes",
  }, {
    name: "plan 2",
    date: "2023-01-02",
    notes: "plan 2 notes",
  },
  {
    name: "plan 3",
    date: "2023-01-03",
    notes: "plan 3 notes",
  }
  ]

  const tabs = [
    {
      value: "الطائرات",
      label: "الطائرات",
    },
    {
      value: "الاماكن",
      label: "الاماكن",
    },
    {
      value: "انواع الدورات",
      label: "انواع الدورات",
    },
    {
      value: "انواع الاشتراكات",
      label: "انواع الاشتراكات",
    },
    {
      value: "دورات بدنية",
      label: "دورات بدنية",
    },
    {
      value: "مواد",
      label: "مواد",
    },
    {
      value: "الفئات ",
      label: "الفئات ",
    },
    {
      value: "الوحدات",
      label: "الوحدات",
    },
    {
      value: "انواع المرفقات ",
      label: "انواع المرفقات ",
    },
    {
      value: "جهة الترشيح",
      label: "جهة الترشيح",
    },
    {
      value: "المهارات",
      label: "المهارات",
    },
  ]

  return (
    <div>
      <section>
        <Tabs defaultValue="الطائرات" className="w-full bg-transparent ">
          <TabsList className="flex justify-start items-center md:flex-wrap md:shrink bg-transparent h-auto space-x-2">
            {tabs.map((tab) => (
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
              <DataTableSkeleton 
                columnCount={3} 
                rowCount={5} 
                showAddButton={true} 
              />
            ) : (
              <DataTable columns={planeColumns} data={planesData} columnsNames={planeColumnsNames} type="plane" />
            )}
          </TabsContent>
          {/* <TabsContent value="الاماكن" className="bg-white rounded-lg">
            <DataTable columns={columns} data={data} columnsNames={columnsNames} />
          </TabsContent> */}
          <TabsContent value="انواع الدورات" className="bg-white rounded-lg">
            {trainingCoursesLoading ? (
              <DataTableSkeleton 
                columnCount={3} 
                rowCount={5} 
                showAddButton={true} 
              />
            ) : (
              <DataTable columns={TrainingCoursesColumns} data={trainingCoursesData} columnsNames={TrainingCoursesColumnsNames} type="trainingCourses" />
            )}
          </TabsContent>
          <TabsContent value="انواع الاشتراكات" className="bg-white rounded-lg">
            {subscriptionsLoading ? (
              <DataTableSkeleton 
                columnCount={3} 
                rowCount={5} 
                showAddButton={true} 
              />
            ) : (
              <DataTable columns={SubscriptionsColumns} data={subscriptionsData} columnsNames={SubscriptionsColumnsNames} type={"subscriptions"} />
            )}
          </TabsContent>
          {/* <TabsContent value="دورات بدنية" className="bg-white rounded-lg">
            <DataTable columns={columns} data={data} columnsNames={columnsNames} />
          </TabsContent>
          <TabsContent value="مواد" className="bg-white rounded-lg">
            <DataTable columns={columns} data={data} columnsNames={columnsNames} />
          </TabsContent>
          <TabsContent value="الفئات " className="bg-white rounded-lg">
            <DataTable columns={columns} data={data} columnsNames={columnsNames} />
          </TabsContent> */}
          <TabsContent value="المهارات" className="bg-white rounded-lg">
            {skillsLoading ? (
              <DataTableSkeleton 
                columnCount={3} 
                rowCount={5} 
                showAddButton={true} 
              />
            ) : (
              <DataTable columns={SkillsColumns} data={skillsData} columnsNames={SkillsColumnsNames} type="skills" />
            )}
          </TabsContent>
          {/* <TabsContent value="الوحدات" className="bg-white rounded-lg">
            <DataTable columns={columns} data={data} columnsNames={columnsNames} />
          </TabsContent> */}
          <TabsContent value="انواع المرفقات " className="bg-white rounded-lg">
            <DataTable columns={AttachmentColumns} data={attachmentTypesData} columnsNames={AttachmentColumnsNames} type="attachmentTypes"/>
          </TabsContent>
          <TabsContent value="جهة الترشيح" className="bg-white rounded-lg">
            {nominatedPartiesLoading ? (
              <DataTableSkeleton 
                columnCount={3} 
                rowCount={5} 
                showAddButton={true} 
              />
            ) : (
              <DataTable 
                columns={nominatedColumns} 
                data={nominatedPartiesData} 
                columnsNames={nominatedColumnsNames} 
                type={"nominated"}
              />
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
