"use client"
import { DataTable } from "@/components/data-table";
import TablePage from "../table-demo/page";
import { columnsNames, columns } from "@/components/pages/adds/adds-columns";
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
      <DataTable columns={columns} data={data} columnsNames={columnsNames} />
    </div>
  );
}
