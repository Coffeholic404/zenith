'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetBillByIdQuery, useDeleteBillMutation, useReverseBillMutation } from '@/services/bills';
import type { SubImport } from '@/services/bills';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
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
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
    ArrowRight,
    Loader2,
    CalendarDays,
    Hash,
    Building2,
    FileText,
    Trash2,
    ShieldX,
    CircleCheckBig
} from 'lucide-react';

// ── Status helpers ───────────────────────────────────────────────────────────

const statusLabels: Record<string, string> = {
    new: 'جديد',
    used: 'مستعمل',
    broken: 'تالف'
};

const statusColors: Record<string, string> = {
    new: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    used: 'bg-amber-100 text-amber-700 border-amber-200',
    broken: 'bg-red-100 text-red-700 border-red-200'
};

// ═══════════════════════════════════════════════════════════════════════════════
// Main Page Component
// ═══════════════════════════════════════════════════════════════════════════════

export default function BillDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === 'Admin';

    const billId = params.id as string;

    const { data, isLoading, isError } = useGetBillByIdQuery({ id: billId });
    const [deleteBill, { isLoading: isDeleting }] = useDeleteBillMutation();
    const [reverseBill, { isLoading: isReversing }] = useReverseBillMutation();

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isReverseDialogOpen, setIsReverseDialogOpen] = useState(false);

    const bill = data?.result;

    // ── Delete handler ───────────────────────────────────────────────────────

    const handleDeleteBill = async () => {
        try {
            await deleteBill({ id: billId }).unwrap();
            toast({
                title: 'تم بنجاح',
                description: 'تم حذف الفاتورة بنجاح'
            });
            router.push('/bills');
        } catch (error: any) {
            const errorMessage =
                error?.data?.errorMessages?.[0] ??
                error?.data?.message ??
                'حدث خطأ أثناء حذف الفاتورة';
            toast({
                title: 'خطأ',
                description: errorMessage,
                variant: 'destructive'
            });
            setIsDeleteDialogOpen(false);
        }
    };

    // ── Reverse handler ──────────────────────────────────────────────────────

    const handleReverseBill = async () => {
        try {
            const res = await reverseBill({ id: billId }).unwrap();
            toast({
                title: 'تم بنجاح',
                description: res.result?.message ?? 'تم رفض الفاتورة بنجاح'
            });
            setIsReverseDialogOpen(false);
        } catch (error: any) {
            const errorMessage =
                error?.data?.errorMessages?.[0] ??
                error?.data?.message ??
                'حدث خطأ أثناء رفض الفاتورة';
            toast({
                title: 'خطأ',
                description: errorMessage,
                variant: 'destructive'
            });
            setIsReverseDialogOpen(false);
        }
    };

    // ── Loading state ────────────────────────────────────────────────────────

    if (isLoading) {
        return (
            <div className="space-y-6 pb-10" dir="rtl">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-20" />
                </div>
                <Card className="border border-border/60 shadow-sm rounded-2xl">
                    <CardContent className="p-6 space-y-4">
                        <Skeleton className="h-5 w-32" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="border border-border/60 shadow-sm rounded-2xl">
                    <CardContent className="p-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full mb-2" />
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    // ── Error state ──────────────────────────────────────────────────────────

    if (isError || !bill) {
        return (
            <div className="space-y-6 pb-10" dir="rtl">
                <div className="flex items-center justify-between">
                    <div className="font-vazirmatn">
                        <p className="font-bold text-cardTxt text-lg">تفاصيل الفاتورة</p>
                    </div>
                    <Button
                        variant="ghost"
                        className="font-vazirmatn text-subtext gap-2"
                        onClick={() => router.back()}
                    >
                        رجوع
                        <ArrowRight className="size-4" />
                    </Button>
                </div>
                <div className="flex items-center justify-center py-20">
                    <p className="font-vazirmatn text-red-500 text-sm">
                        حدث خطأ أثناء تحميل بيانات الفاتورة
                    </p>
                </div>
            </div>
        );
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="space-y-6 pb-10" dir="rtl">
            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div className="font-vazirmatn">
                    <p className="font-bold text-cardTxt text-lg">تفاصيل الفاتورة</p>
                    <p className="font-light text-subtext text-sm">
                        عرض معلومات الفاتورة والمواد المرتبطة
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {!isAdmin && (
                        <>
                            <Button
                                variant="ghost"
                                className="font-vazirmatn text-amber-600 gap-2 border border-amber-200 rounded-2xl hover:bg-amber-50"
                                onClick={() => setIsReverseDialogOpen(true)}
                                disabled={!bill.status}
                            >
                                <ShieldX className="size-4" />
                                رفض الفاتورة
                            </Button>
                            <Button
                                variant="ghost"
                                className="font-vazirmatn text-red-500 gap-2 border border-red-200 rounded-2xl hover:bg-red-50"
                                onClick={() => setIsDeleteDialogOpen(true)}
                            >
                                <Trash2 className="size-4" />
                                حذف
                            </Button>
                        </>
                    )}
                    <Button
                        variant="ghost"
                        className="font-vazirmatn text-subtext gap-2"
                        onClick={() => router.back()}
                    >
                        رجوع
                        <ArrowRight className="size-4" />
                    </Button>
                </div>
            </div>

            {/* ── Bill Info Card ───────────────────────────────────────────────── */}
            <Card className="border border-border/60 shadow-sm rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
                    <p className="font-vazirmatn font-bold text-cardTxt text-[15px]">
                        معلومات الفاتورة
                    </p>
                    <Badge
                        className={cn(
                            'text-xs font-vazirmatn rounded-lg border px-3 py-1 gap-1',
                            bill.status
                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-red-100 text-red-600 border-red-200 hover:bg-red-100'
                        )}
                    >
                        {bill.status ? (
                            <CircleCheckBig className="size-3.5" />
                        ) : (
                            <ShieldX className="size-3.5" />
                        )}
                        {bill.status ? 'مقبولة' : 'مرفوضة'}
                    </Badge>
                </div>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Supplier */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-subtext">
                                <Building2 className="size-4" />
                                <p className="font-vazirmatn text-xs">المورد</p>
                            </div>
                            <p className="font-vazirmatn font-semibold text-cardTxt text-sm">
                                {bill.supplier}
                            </p>
                        </div>

                        {/* Date */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-subtext">
                                <CalendarDays className="size-4" />
                                <p className="font-vazirmatn text-xs">التاريخ</p>
                            </div>
                            <p className="font-vazirmatn font-semibold text-cardTxt text-sm">
                                {bill.date?.substring(0, 10)}
                            </p>
                        </div>

                        {/* Order Number */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-subtext">
                                <Hash className="size-4" />
                                <p className="font-vazirmatn text-xs">رقم الطلب</p>
                            </div>
                            <p className="font-vazirmatn font-semibold text-cardTxt text-sm">
                                {bill.orderNo}
                            </p>
                        </div>

                        {/* Notes */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-subtext">
                                <FileText className="size-4" />
                                <p className="font-vazirmatn text-xs">ملاحظات</p>
                            </div>
                            <p className="font-vazirmatn font-semibold text-cardTxt text-sm">
                                {bill.note || '—'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ── Sub-imports Data Table ───────────────────────────────────────── */}
            <Card className="border border-border/60 shadow-sm rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <p className="font-vazirmatn font-bold text-cardTxt text-[15px]">
                            المواد
                        </p>
                        <Badge className="bg-badgeClr text-sidebaractive font-vazirmatn text-xs rounded-lg hover:bg-badgeClr">
                            {bill.subImports?.length ?? 0} مادة
                        </Badge>
                    </div>
                </div>
                <CardContent className="p-6">
                    {bill.subImports?.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <p className="font-vazirmatn text-subtext text-sm">
                                لا توجد مواد مرتبطة بهذه الفاتورة
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-md overflow-hidden">
                            <Table>
                                <TableHeader className="bg-searchBg">
                                    <TableRow className="border-none">
                                        <TableHead className="first:rounded-s-lg">
                                            <p className="font-vazirmatn font-normal text-base text-tableHeader">ت</p>
                                        </TableHead>
                                        <TableHead>
                                            <p className="font-vazirmatn font-normal text-base text-tableHeader">المادة</p>
                                        </TableHead>
                                        <TableHead>
                                            <p className="font-vazirmatn font-normal text-base text-tableHeader">الكمية</p>
                                        </TableHead>
                                        <TableHead>
                                            <p className="font-vazirmatn font-normal text-base text-tableHeader">التكلفة</p>
                                        </TableHead>
                                        <TableHead>
                                            <p className="font-vazirmatn font-normal text-base text-tableHeader">الرمز</p>
                                        </TableHead>
                                        <TableHead>
                                            <p className="font-vazirmatn font-normal text-base text-tableHeader">الحالة</p>
                                        </TableHead>
                                        <TableHead className="last:rounded-e-lg">
                                            <p className="font-vazirmatn font-normal text-base text-tableHeader">التوزيع</p>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bill.subImports?.map((sub: SubImport, index: number) => (
                                        <TableRow key={sub.id} className="border-none text-tableRow">
                                            <TableCell className="font-vazirmatn">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell className="font-vazirmatn font-semibold">
                                                {sub.itemName ?? sub.itemId}
                                            </TableCell>
                                            <TableCell className="font-vazirmatn">
                                                {sub.qty}
                                            </TableCell>
                                            <TableCell className="font-vazirmatn">
                                                {sub.cost.toLocaleString('ar-IQ')}
                                            </TableCell>
                                            <TableCell className="font-vazirmatn">
                                                {sub.code ?? '—'}
                                            </TableCell>
                                            <TableCell>
                                                {sub.status ? (
                                                    <Badge
                                                        className={cn(
                                                            'text-[11px] font-vazirmatn rounded-md border px-2 py-0.5',
                                                            statusColors[sub.status] ?? 'bg-gray-100 text-gray-500 border-gray-200'
                                                        )}
                                                    >
                                                        {statusLabels[sub.status] ?? sub.status}
                                                    </Badge>
                                                ) : (
                                                    '—'
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={cn(
                                                        'text-[11px] font-vazirmatn rounded-md border px-2 py-0.5',
                                                        sub.distribution === 'true'
                                                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                            : 'bg-gray-100 text-gray-500 border-gray-200'
                                                    )}
                                                >
                                                    {sub.distribution === 'true' ? 'مسموح' : 'غير مسموح'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ── Delete Confirmation Dialog ───────────────────────────────────── */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="font-vazirmatn">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-right text-cardTxt">
                            تأكيد الحذف
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-right text-subtext">
                            هل أنت متأكد من حذف هذه الفاتورة؟
                            <br />
                            <span className="text-sm text-deleteTxt">
                                لا يمكن التراجع عن هذا الإجراء.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-2">
                        <AlertDialogCancel className="font-vazirmatn">
                            إلغاء
                        </AlertDialogCancel>
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

            {/* ── Reverse Confirmation Dialog ──────────────────────────────────── */}
            <AlertDialog open={isReverseDialogOpen} onOpenChange={setIsReverseDialogOpen}>
                <AlertDialogContent className="font-vazirmatn">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-right text-cardTxt">
                            تأكيد رفض الفاتورة
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-right text-subtext">
                            هل أنت متأكد من رفض هذه الفاتورة؟
                            <br />
                            <span className="text-sm text-amber-600">
                                سيتم عكس سند الاستيراد وإزالة قيود المخزون المرتبطة.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-2">
                        <AlertDialogCancel className="font-vazirmatn">
                            إلغاء
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleReverseBill}
                            disabled={isReversing}
                            className="bg-amber-600 hover:bg-amber-700 font-vazirmatn"
                        >
                            {isReversing ? (
                                <>
                                    <Loader2 className="size-4 animate-spin ml-2" />
                                    جاري الرفض...
                                </>
                            ) : (
                                'رفض الفاتورة'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
