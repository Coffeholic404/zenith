import Image from 'next/image';
import type { ColumnDef } from '@tanstack/react-table';
import list from '@/public/table/List.svg';
import trash from '@/public/table/trash.svg';
import { Button } from '@/components/ui/button';
import EditMaterialModel from './editMaterial-model';
import { useDeleteItemMutation, Item } from '@/services/item';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isDeleting
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  isDeleting: boolean;
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rtl" dir="rtl">
        <AlertDialogHeader className="text-right">
          <AlertDialogTitle className="text-right font-vazirmatn">تأكيد الحذف</AlertDialogTitle>
          <AlertDialogDescription className="text-right font-vazirmatn">
            هل أنت متأكد من حذف مادة "{itemName}"؟
            <br />
            لا يمكن التراجع عن هذا الإجراء.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse gap-2">
          <AlertDialogCancel onClick={onClose} className="font-vazirmatn" disabled={isDeleting}>
            إلغاء
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 font-vazirmatn"
            disabled={isDeleting}
          >
            {isDeleting ? 'جاري الحذف...' : 'حذف'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

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
    id: 'actions',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <Image src={list} alt="list" className=" size-5" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { data: session } = useSession();
      const userRole = session?.user?.role;
      const isAdmin = userRole === 'Admin';
      if (isAdmin) return null;
      const [deleteItem, { isLoading: isDeleting }] = useDeleteItemMutation();
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      const { toast } = useToast();
      const handleDeleteClick = () => {
        setShowDeleteDialog(true);
      };
      const handleDeleteConfirm = async () => {
        try {
          await deleteItem({ id: row.original.id }).unwrap();
          toast({
            title: `تم حذف ${row.original.itemName}`
          });
          setShowDeleteDialog(false);
        } catch (error) {
          toast({
            title: `حدث خطأ أثناء حذف ${row.original.itemName}`,
            variant: 'destructive'
          });
        }
      };
      const handleDeleteCancel = () => {
        setShowDeleteDialog(false);
      };
      return (
        <>
          <div className="flex items-center justify-end gap-3 pe-4">
            <EditMaterialModel item={row.original} />
            <Button variant="ghost" className="p-0 px-1" onClick={handleDeleteClick} disabled={isDeleting}>
              <Image src={trash} alt="trash" className=" size-5" />
            </Button>
          </div>
          <DeleteConfirmationDialog
            isOpen={showDeleteDialog}
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            itemName={row.original.itemName}
            isDeleting={isDeleting}
          />
        </>
      );
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
  { label: 'العلامة التجارية', dataIndex: 'brand' },
  { label: 'إجراءات', dataIndex: 'actions' }
];
