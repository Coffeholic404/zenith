import Image from "next/image";
import type { ColumnDef } from "@tanstack/react-table";
import list from "@/public/table/List.svg"
import pen from "@/public/table/Pen.svg"
import trash from "@/public/table/trash.svg"
import { Button } from "@/components/ui/button";
 export type planes = {
    name: string,
    date: string,
    notes: string,
}

export const columns: ColumnDef<planes>[] =[
    {
        accessorKey:"sequence",
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">ت</p>
        },
        cell: ({row}) => {
            return row.index + 1
        }
    },
    {
        accessorKey:"name",
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">الاسم</p>
        },
    },
    {
        accessorKey:"date",
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">التاريخ</p>
        },
    },
    {
        accessorKey:"notes",
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">ملاحظات</p>
        },
    },
    {
        id: "actions",
        header: ({ column }) => {
            return (
                <Button variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Image src={list} alt="list" className=" size-5"/>
                </Button>
            )
        },
        cell: ({ row }) => {
            return (
                <div className="flex items-center justify-end gap-3 pe-4">
                    <Button variant="ghost" className=" p-0">
                        <Image src={pen} alt="pen" className=" size-5"/>
                    </Button>
                    <Button variant="ghost" className="p-0">
                        <Image src={trash} alt="trash" className=" size-5"/>
                    </Button>
                </div>
            )
        },
    }
]

export const columnsNames = [
    {label: 'ت', dataIndex: 'sequence'},
    {label: 'الاسم', dataIndex: 'name'},
    {label: 'التاريخ', dataIndex: 'date'},
    {label: 'ملاحظات', dataIndex: 'notes'},
    
]
