import type { ColumnDef } from '@tanstack/react-table';

export type category = {
  id: string;
  categoryName: string;
  createdAt: string;
  itemCount: number;
};

export const categoryColumns: ColumnDef<category>[] = [
  {
    accessorKey: 'sequence',
    header: () => {
      return <p className=" font-vazirmatn font-normal text-base text-tableHeader">ت</p>;
    },
    cell: ({ row }) => {
      return row.index + 1;
    }
  },
  {
    accessorKey: 'categoryName',
    header: () => {
      return <p className=" font-vazirmatn font-normal text-base text-tableHeader">اسم الفئة</p>;
    }
  },
  {
    accessorKey: 'actions',
    header: () => {
      return <p className=" font-vazirmatn font-normal text-base text-tableHeader">الإجراءات</p>;
    }
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
];

export const categoryColumnsNames = [
  { label: 'ت', dataIndex: 'sequence' },
  { label: 'اسم الفئة', dataIndex: 'categoryName' }
];
