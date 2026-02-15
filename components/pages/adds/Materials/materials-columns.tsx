import type { ColumnDef } from "@tanstack/react-table";

export type material = {
    uniqueID: string,
    name: string,
    category: string,
    unit: string,
    code: string,
    producingCountry: string,
    cost: number,
    weight: number,
    tradeMark: string,
}

export const materialColumns: ColumnDef<material>[] = [
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
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">الاسم</p>
        },
    },
    {
        accessorKey: "category",
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">النوع</p>
        },
    },
    {
        accessorKey: "unit",
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">الوحدة</p>
        },
    },
    {
        accessorKey: "code",
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">الرمز</p>
        },
    },
    {
        accessorKey: "producingCountry",
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">البلد</p>
        },
    },
    {
        accessorKey: "cost",
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">الكلفة</p>
        },
    },
    {
        accessorKey: "weight",
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">الوزن</p>
        },
    },
    {
        accessorKey: "tradeMark",
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">العلامة التجارية</p>
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

export const materialColumnsNames = [
    { label: "ت", dataIndex: "sequence" },
    { label: "الاسم", dataIndex: "name" },
    { label: "النوع", dataIndex: "category" },
    { label: "الوحدة", dataIndex: "unit" },
    { label: "الرمز", dataIndex: "code" },
    { label: "البلد", dataIndex: "producingCountry" },
    { label: "الكلفة", dataIndex: "cost" },
    { label: "الوزن", dataIndex: "weight" },
    { label: "العلامة التجارية", dataIndex: "tradeMark" },
]