"use client"
import { DataTable } from "@/components/data-table";

import { columnsNames, columns } from "@/components/pages/adds/adds-columns";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
export default function Page() {
  const data = [{
    name: "plan 1",
    date: "2023-01-01",
    notes: "plan 1 notes",
  },{
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
]

  return (
    <div>
      <section>
        <Tabs defaultValue="الطائرات" className="w-full bg-transparent ">
          <TabsList className="flex justify-start items-center md:flex-wrap md:shrink bg-transparent rounded-lg p-1 mb-6 h-auto space-x-2">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.value}
                value={tab.value} 
                className="text-center py-2 rounded-lg data-[state=active]:text-sidebaractive"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>


          <TabsContent value="الطائرات" className="bg-white rounded-lg">
            <DataTable columns={columns} data={data} columnsNames={columnsNames} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
