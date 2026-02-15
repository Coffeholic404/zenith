import Image from 'next/image';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import trash from '@/public/employees/TrashBin.svg';
export type trainer = {
  name: string;
  // date: string,
  studentsNumber: string;
};

export const trainerColumns: ColumnDef<trainer>[] = [
  // {
  //     accessorKey:"sequence",
  //     header: () => {
  //         return <p className=" font-vazirmatn font-normal text-base text-tableHeader">ت</p>
  //     },
  //     cell: ({row}) => {
  //         return row.index + 1
  //     }
  // },
  {
    accessorKey: 'name',
    header: () => {
      return <p className=" font-vazirmatn font-normal text-base text-tableHeader">الاسم</p>;
    }
  },
  // {
  //     accessorKey:"date",
  //     header: () => {
  //         return <p className=" font-vazirmatn font-normal text-base text-tableHeader">التاريخ</p>
  //     },
  // },
  {
    accessorKey: 'studentsNumber',
    header: () => {
      return <p className=" font-vazirmatn font-normal text-base text-tableHeader">عدد الطلاب</p>;
    }
  },
  {
    id: 'actions',
    // header: ({ column }) => {
    //     return (
    //         <Button variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //         >
    //             <Image src={list} alt="list" className=" size-5"/>
    //         </Button>
    //     )
    // },
    cell: ({ row }) => {
      return (
        <Button variant="ghost" className="p-0">
          <Image src={trash} alt="trash" className=" size-5" />
        </Button>
      );
    }
  }
];

export const planeColumnsNames = [
  { label: 'ت', dataIndex: 'sequence' },
  { label: 'الاسم', dataIndex: 'name' },
  { label: 'ملاحظات', dataIndex: 'notes' }
];
