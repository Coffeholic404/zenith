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

  return (
    <div>
      <section>
        <Tabs defaultValue="الطائرات" className="w-full bg-transparent ">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 bg-transparent rounded-lg p-1 mb-6 h-auto gap-1 ">
            <TabsTrigger 
              value="الطائرات" 
              className="text-center py-2 rounded-lg"
            >
              الطائرات
            </TabsTrigger>
            <TabsTrigger 
              value="الاماكن" 
              className="text-center py-2 rounded-lg"
            >
              الاماكن
            </TabsTrigger>
            <TabsTrigger 
              value="الترقية" 
              className="text-center py-2 rounded-lg"
            >
              الترقية
            </TabsTrigger>
          </TabsList>
          <TabsContent value="الطائرات" className="bg-white rounded-lg">
            <DataTable columns={columns} data={data} columnsNames={columnsNames} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
