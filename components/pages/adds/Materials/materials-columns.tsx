import type { ColumnDef } from '@tanstack/react-table';
import { Item } from '@/services/item';

export const materialColumns: ColumnDef<Item>[] = [
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
    accessorKey: 'itemName',
    header: () => {
      return <p className=" font-vazirmatn font-normal text-base text-tableHeader">الاسم</p>;
    }
  },
  {
    accessorKey: 'categoryName',
    header: () => {
      return <p className=" font-vazirmatn font-normal text-base text-tableHeader">النوع</p>;
    }
  },
  {
    accessorKey: 'unitName',
    header: () => {
      return <p className=" font-vazirmatn font-normal text-base text-tableHeader">الوحدة</p>;
    }
  },
  {
    accessorKey: 'country',
    header: () => {
      return <p className=" font-vazirmatn font-normal text-base text-tableHeader">البلد</p>;
    }
  },
  {
    accessorKey: 'limit',
    header: () => {
      return <p className=" font-vazirmatn font-normal text-base text-tableHeader">الحد الأدنى</p>;
    }
  },
  {
    accessorKey: 'volume',
    header: () => {
      return <p className=" font-vazirmatn font-normal text-base text-tableHeader">الحجم</p>;
    }
  },
  {
    accessorKey: 'brand',
    header: () => {
      return <p className=" font-vazirmatn font-normal text-base text-tableHeader">العلامة التجارية</p>;
    }
  },
  {
    accessorKey: 'actions',
    header: () => {
      return <p className=" font-vazirmatn font-normal text-base text-tableHeader">الإجراءات</p>;
    }
  }
];

export const materialColumnsNames = [
  { label: 'ت', dataIndex: 'sequence' },
  { label: 'الاسم', dataIndex: 'itemName' },
  { label: 'النوع', dataIndex: 'categoryName' },
  { label: 'الوحدة', dataIndex: 'unitName' },
  { label: 'البلد', dataIndex: 'country' },
  { label: 'الحد الأدنى', dataIndex: 'limit' },
  { label: 'الحجم', dataIndex: 'volume' },
  { label: 'العلامة التجارية', dataIndex: 'brand' }
];
