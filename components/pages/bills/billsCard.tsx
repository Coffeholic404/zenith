'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
import { Badge } from '@/components/ui/badge';
import eye from '@/public/courses/Eye.svg';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import trash from '@/public/table/trash.svg';
import { CalendarDays, Hash, EllipsisVertical, Loader2, CircleCheckBig, ShieldX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDeleteBillMutation } from '@/services/bills';
import { useState } from 'react';
import { BillItem } from '@/app/(dashboard)/bills/page';
import { cn } from '@/lib/utils';

export default function BillCard({ bill }: { bill: BillItem }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { toast } = useToast();
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const isAdmin = userRole === 'Admin';
  const router = useRouter();

  const [deleteBill, { isLoading: isDeleting }] = useDeleteBillMutation();

  const handleDeleteBill = async () => {
    try {
      await deleteBill({ id: bill.id }).unwrap();
      toast({
        title: 'تم بنجاح',
        description: 'تم حذف الفاتورة بنجاح',
        variant: 'default'
      });
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      const errorMessage =
        error?.data?.errorMessages?.[0] ?? error?.data?.message ?? 'حدث خطأ أثناء حذف الفاتورة';
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive'
      });
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Card className="w-full p-[17px] ">
        <CardContent className=" p-0 space-y-4">
          <div className=" flex justify-between items-start">
            <div className=" flex flex-col gap-4 w-full">
              <div className=" font-vazirmatn flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <p className=" text-cardTxt font-semibold">{bill.supplier}</p>
                  <Badge
                    className={cn(
                      'text-[11px] font-vazirmatn rounded-md border px-2 py-0.5 gap-1',
                      bill.status
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-red-100 text-red-600 border-red-200 hover:bg-red-100'
                    )}
                  >
                    {bill.status ? (
                      <CircleCheckBig className="size-3" />
                    ) : (
                      <ShieldX className="size-3" />
                    )}
                    {bill.status ? 'مقبولة' : 'مرفوضة'}
                  </Badge>
                </div>
                <div className=" flex flex-col items-end gap-4 justify-center">
                  <Popover>
                    <PopoverTrigger>
                      <EllipsisVertical className=" size-5 text-[#7B7B7B] hover:text-[#222222] cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className=" w-[120px] rounded-xl">
                      {!isAdmin && (
                        <Button
                          variant="ghost"
                          className=" hover:bg-red-400"
                          onClick={() => setIsDeleteDialogOpen(true)}
                        >
                          <Image src={trash} alt="trash" className="size-[18px]" />
                          <p className=" font-vazirmatn text-sm">حذف</p>
                        </Button>
                      )}

                      <Button variant="ghost" className="" onClick={() => router.push(`/bills/${bill.id}`)}>
                        <Image src={eye} alt="eye" className="size-[18px]" />
                        <p className=" font-vazirmatn text-sm">عرض</p>
                      </Button>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className=" font-vazirmatn space-y-2">
                <div className=" flex items-center gap-2">
                  <CalendarDays className=" size-4 text-gray-500" />
                  <p className=" text-[#868585] font-semibold text-[13px]">{bill.date?.substring(0, 10)}</p>
                </div>
                <div className=" flex items-center gap-2">
                  <Hash className=" size-4 text-gray-500" />
                  <p className=" text-[#868585] font-semibold text-[13px]">{bill.orderNo}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="font-vazirmatn">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right text-cardTxt">تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription className="text-right text-subtext">
              هل أنت متأكد من حذف هذه الفاتورة؟
              <br />
              <span className="text-sm text-deleteTxt">لا يمكن التراجع عن هذا الإجراء.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel className="font-vazirmatn">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBill}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 font-vazirmatn"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-4 animate-spin ml-2" />
                  جاري الحذف...
                </>
              ) : (
                'حذف'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
