import type { ColumnDef } from "@tanstack/react-table";

export type unit = {
    uniqueID: string,
    name: string,
}

export const unitColumns: ColumnDef<unit>[] = [
    {
        accessorKey: "sequence",
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">ت</p>
        },
        cell: ({ row }) => {
            return row.index + 1
        }
    },
    {
        accessorKey: "name",
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">اسم الوحدة</p>
        },
    },
    {
        accessorKey: "actions",
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">الإجراءات</p>
        },
        // cell: ({ row }) => {
        //     return (
        //         <div className="flex gap-2">
        //             <Button
        //                 variant="outline"
        //                 size="icon"
        //                 className="rounded-full"
        //                 onClick={() => handleEdit(row.original)}
        //             >
        //                 <Pencil className="h-4 w-4" />
        //             </Button>
        //             <Button
        //                 variant="outline"
        //                 size="icon"
        //                 className="rounded-full"
        //                 onClick={() => handleDelete(row.original)}
        //             >
        //                 <Trash className="h-4 w-4" />
        //             </Button>
        //         </div>
        //     )
        // }
    }
]

export const unitColumnsNames = [
    { label: "ت", dataIndex: "sequence" },
    { label: "اسم الوحدة", dataIndex: "name" },
]
