import Image from 'next/image';
import type { ColumnDef } from '@tanstack/react-table';
import list from '@/public/table/List.svg';
import pen from '@/public/table/Pen.svg';
import trash from '@/public/table/trash.svg';
import { Button } from '@/components/ui/button';
import EditEvaluationModal from './edit-evaluation-modal';
import { useDeleteEvaluationMutation } from '@/services/evaluation';
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

export type EvaluationRow = {
  uniqueID: string;
  co_St_TrId: string;
  name: string;
  evaluation1: string;
  evaluation2: string;
  evaluation3: string;
  note: string;
};

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
            هل أنت متأكد من حذف تقييم الطالب "{itemName}"؟
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

export const evaluationColumns: ColumnDef<EvaluationRow>[] = [
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
    accessorKey: 'name',
    header: () => {
      return <p className=" font-vazirmatn font-normal text-base text-tableHeader">اسم الطالب</p>;
    }
  },
  {
    accessorKey: 'evaluation1',
    header: () => {
      return <p className=" font-vazirmatn font-normal text-base text-tableHeader">التقييم الأول</p>;
    }
  },
  {
    accessorKey: 'evaluation2',
    header: () => {
      return <p className=" font-vazirmatn font-normal text-base text-tableHeader">التقييم الثاني</p>;
    }
  },
  {
    accessorKey: 'evaluation3',
    header: () => {
      return <p className=" font-vazirmatn font-normal text-base text-tableHeader">التقييم الثالث</p>;
    }
  },
  {
    accessorKey: 'note',
    header: () => {
      return <p className=" font-vazirmatn font-normal text-base text-tableHeader">ملاحظات</p>;
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
      const [deleteEvaluation, { isLoading: isDeleting }] = useDeleteEvaluationMutation();
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      const { toast } = useToast();

      const handleDeleteClick = () => {
        setShowDeleteDialog(true);
      };

      const handleDeleteConfirm = async () => {
        try {
          await deleteEvaluation({ uniqueID: row.original.uniqueID }).unwrap();
          toast({
            title: `تم حذف تقييم ${row.original.name}`
          });
          setShowDeleteDialog(false);
        } catch (error) {
          toast({
            title: `حدث خطأ أثناء حذف تقييم ${row.original.name}`,
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
            <EditEvaluationModal
              uniqueID={row.original.uniqueID}
              co_St_TrId={row.original.co_St_TrId}
              studentName={row.original.name}
              evaluation1={row.original.evaluation1}
              evaluation2={row.original.evaluation2}
              evaluation3={row.original.evaluation3}
              note={row.original.note}
            />
            <Button variant="ghost" className="p-0 px-1" onClick={handleDeleteClick} disabled={isDeleting}>
              <Image src={trash} alt="trash" className=" size-5" />
            </Button>
          </div>
          <DeleteConfirmationDialog
            isOpen={showDeleteDialog}
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            itemName={row.original.name}
            isDeleting={isDeleting}
          />
        </>
      );
    }
  }
];

export const evaluationColumnsNames = [
  { label: 'ت', dataIndex: 'sequence' },
  { label: 'اسم الطالب', dataIndex: 'name' },
  { label: 'التقييم الأول', dataIndex: 'evaluation1' },
  { label: 'التقييم الثاني', dataIndex: 'evaluation2' },
  { label: 'التقييم الثالث', dataIndex: 'evaluation3' },
  { label: 'ملاحظات', dataIndex: 'note' },
  { label: 'إجراءات', dataIndex: 'actions' }
];
