'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, CalendarIcon, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useGetStockByIdQuery, useUpdateStockMutation, type StockItem } from '@/services/stock';
import { useGetStudentsQuery } from '@/services/students';
import { useGetTrainersQuery } from '@/services/employe';

// ── Schema ───────────────────────────────────────────────────────────────────

const editStockSchema = z.object({
    code: z.string().min(1, { message: 'الكود مطلوب' }),
    cost: z.string().min(1, { message: 'التكلفة مطلوبة' }),
    packagerId: z.string().min(1, { message: 'الرزام مطلوب' }),
    packetCoachId: z.string().min(1, { message: 'مشرف الرزم مطلوب' }),
    date: z.date({ message: 'التاريخ مطلوب' }),
    note: z.string().optional(),
    status: z.string().min(1, { message: 'الحالة مطلوبة' }),
    distribution: z.string().min(1, { message: 'حالة التوزيع مطلوبة' })
});

type EditStockFormData = z.infer<typeof editStockSchema>;

// ── Styling ──────────────────────────────────────────────────────────────────

const inputClasses =
    'bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-right';

const labelClasses = 'font-vazirmatn text-cardTxt font-semibold text-[13px]';

const comboboxTriggerClasses =
    'bg-searchBg rounded-xl font-vazirmatn border-input hover:bg-searchBg text-right';

// ── Loading Skeleton ─────────────────────────────────────────────────────────

function FormSkeleton() {
    return (
        <div className="space-y-6 pb-10" dir="rtl">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-5 w-72" />
                </div>
                <Skeleton className="h-10 w-20" />
            </div>
            <Card className="border border-border/60 shadow-sm rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border/40">
                    <Skeleton className="h-5 w-32" />
                </div>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-5 w-full" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card className="border border-border/60 shadow-sm rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border/40">
                    <Skeleton className="h-5 w-32" />
                </div>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full rounded-xl" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// ── Error State ──────────────────────────────────────────────────────────────

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <div className="space-y-6 pb-10" dir="rtl">
            <Card className="border border-red-200 shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-10 flex flex-col items-center justify-center gap-4 text-center">
                    <div className="size-16 rounded-full bg-red-50 flex items-center justify-center">
                        <svg className="size-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-vazirmatn font-bold text-cardTxt text-lg">حدث خطأ</p>
                        <p className="font-vazirmatn text-subtext text-sm mt-1">{message}</p>
                    </div>
                    <Button
                        onClick={onRetry}
                        className="bg-sidebaractive hover:bg-sidebaractive hover:brightness-110 text-white font-vazirmatn rounded-2xl px-6"
                    >
                        إعادة المحاولة
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

// ── Wrapper Component (handles fetching + loading/error) ─────────────────────

export default function EditStockPage() {
    const params = useParams();
    const id = params.id as string;

    const {
        data: stockData,
        isLoading: isLoadingStock,
        isError: isStockError,
        error: stockError,
        refetch: refetchStock
    } = useGetStockByIdQuery({ id }, { refetchOnMountOrArgChange: true });

    const stockItem = stockData?.result;

    // ── Loading state ────────────────────────────────────────────────────
    if (isLoadingStock || !stockItem || stockItem.id !== id) {
        return <FormSkeleton />;
    }

    // ── Error state ──────────────────────────────────────────────────────
    if (isStockError) {
        const errorMsg =
            (stockError as any)?.data?.errorMessages?.[0] ??
            'لم يتم العثور على المنتج أو حدث خطأ في الاتصال';
        return <ErrorState message={errorMsg} onRetry={refetchStock} />;
    }

    // key={id} forces a full remount of the form when navigating between items
    return <EditStockForm key={id} stockItem={stockItem} />;
}

// ── Form Component (only renders when data is ready) ─────────────────────────

function EditStockForm({ stockItem }: { stockItem: StockItem }) {
    const { toast } = useToast();
    const router = useRouter();

    const [updateStock, { isLoading: isUpdating }] = useUpdateStockMutation();

    const { data: studentsData, isLoading: isLoadingStudents } = useGetStudentsQuery({
        pageNumber: 1,
        pageSize: 1000
    });

    const { data: trainersData, isLoading: isLoadingTrainers } = useGetTrainersQuery({
        pageNumber: 1,
        pageSize: 1000
    });

    // ── Combobox options ─────────────────────────────────────────────────
    const studentOptions = (studentsData?.result?.data ?? []).map((student) => ({
        value: student.uniqueID,
        label: student.name
    }));

    const trainerOptions = (trainersData?.result?.data ?? []).map((trainer) => ({
        value: trainer.id ?? '',
        label: trainer.name
    }));

    // ── Form (defaultValues from already-loaded stockItem) ───────────────
    const form = useForm<EditStockFormData>({
        resolver: zodResolver(editStockSchema),
        defaultValues: {
            code: stockItem.code ?? '',
            cost: stockItem.cost?.toString() ?? '',
            packagerId: stockItem.packagerId ?? '',
            packetCoachId: stockItem.packetCoachId ?? '',
            date: stockItem.date ? new Date(stockItem.date) : undefined as any,
            note: stockItem.note ?? '',
            status: (stockItem.status ?? '').toLowerCase(),
            distribution: String(stockItem.distribution ?? '').toLowerCase()
        }
    });

    // ── Submit ────────────────────────────────────────────────────────────
    const handleSubmit = async (data: EditStockFormData) => {
        try {
            await updateStock({
                id: stockItem.id,
                code: data.code,
                cost: Number(data.cost),
                packagerId: data.packagerId,
                packetCoachId: data.packetCoachId,
                date: data.date.toISOString(),
                note: data.note ?? '',
                status: data.status,
                distribution: data.distribution
            }).unwrap();

            toast({
                title: 'تم بنجاح',
                description: 'تم تحديث بيانات المنتج بنجاح'
            });
            router.push('/stock');
        } catch (error: any) {
            const errorMessage =
                error?.data?.errorMessages?.[0] ??
                error?.data?.message ??
                'حدث خطأ أثناء تحديث المنتج';
            toast({
                title: 'خطأ',
                description: errorMessage,
                variant: 'destructive'
            });
        }
    };

    return (
        <div className="space-y-6 pb-10" dir="rtl">
            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div className="font-vazirmatn">
                    <p className="font-bold text-cardTxt text-lg">تعديل المنتج</p>
                    <p className="font-light text-subtext text-sm">
                        تعديل بيانات المنتج:{' '}
                        <span className="font-medium text-cardTxt">
                            {stockItem?.itemName ?? ''}
                        </span>
                        {stockItem?.code && (
                            <span className="text-subtext mr-1">
                                ({stockItem.code})
                            </span>
                        )}
                    </p>
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

            {/* ── Read-only info ──────────────────────────────────────────────── */}
            <Card className="border border-border/60 shadow-sm rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border/40">
                    <p className="font-vazirmatn font-bold text-cardTxt text-[15px]">
                        معلومات المنتج
                    </p>
                </div>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <p className={labelClasses}>المنتج</p>
                            <p className="font-vazirmatn text-tableRow text-sm">
                                {stockItem?.itemName ?? '—'}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className={labelClasses}>الكود</p>
                            <p className="font-vazirmatn text-tableRow text-sm">
                                {stockItem?.code ?? '—'}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className={labelClasses}>التكلفة</p>
                            <p className="font-vazirmatn text-tableRow text-sm">
                                {stockItem?.cost?.toLocaleString('ar-IQ') ?? '—'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ── Edit Form Card ──────────────────────────────────────────────── */}
            <Card className="border border-border/60 shadow-sm rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border/40">
                    <p className="font-vazirmatn font-bold text-cardTxt text-[15px]">
                        تعديل البيانات
                    </p>
                </div>
                <CardContent className="p-6">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            dir="rtl"
                        >
                            {/* الكود */}
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormLabel className={labelClasses}>الكود</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="كود المنتج"
                                                className={inputClasses}
                                                dir="rtl"
                                                autoComplete="off"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-right" />
                                    </FormItem>
                                )}
                            />

                            {/* التكلفة */}
                            <FormField
                                control={form.control}
                                name="cost"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormLabel className={labelClasses}>التكلفة</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="تكلفة المنتج"
                                                className={inputClasses}
                                                dir="rtl"
                                                autoComplete="off"
                                                type="number"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-right" />
                                    </FormItem>
                                )}
                            />

                            {/* الرزام - Combobox (Students) */}
                            <FormField
                                control={form.control}
                                name="packagerId"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormLabel className={labelClasses}>الرزام</FormLabel>
                                        <FormControl>
                                            <Combobox
                                                options={studentOptions}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder={isLoadingStudents ? 'جاري التحميل...' : 'اختر الرزام'}
                                                emptyMessage="لا يوجد طلاب"
                                                triggerClassName={comboboxTriggerClasses}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-right" />
                                    </FormItem>
                                )}
                            />

                            {/* مشرف الرزم - Combobox (Trainers) */}
                            <FormField
                                control={form.control}
                                name="packetCoachId"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormLabel className={labelClasses}>مشرف الرزم</FormLabel>
                                        <FormControl>
                                            <Combobox
                                                options={trainerOptions}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder={isLoadingTrainers ? 'جاري التحميل...' : 'اختر مشرف الرزم'}
                                                emptyMessage="لا يوجد مدربون"
                                                triggerClassName={comboboxTriggerClasses}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-right" />
                                    </FormItem>
                                )}
                            />

                            {/* التاريخ */}
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormLabel className={labelClasses}>التاريخ</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            `${inputClasses} w-full justify-between font-normal`,
                                                            !field.value && 'text-subtext'
                                                        )}
                                                    >
                                                        {field.value
                                                            ? format(field.value, 'yyyy-MM-dd', { locale: ar })
                                                            : 'اختر التاريخ'}
                                                        <CalendarIcon className="size-4 text-subtext" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    locale={ar}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage className="text-right" />
                                    </FormItem>
                                )}
                            />

                            {/* الحالة */}
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormLabel className={labelClasses}>حالة المنتج</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger
                                                    className={`${inputClasses} w-full`}
                                                    dir="rtl"
                                                >
                                                    <SelectValue placeholder="اختر الحالة" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="new" className="font-vazirmatn">جديد</SelectItem>
                                                <SelectItem value="used" className="font-vazirmatn">مستعمل</SelectItem>
                                                <SelectItem value="broken" className="font-vazirmatn">تالف</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-right" />
                                    </FormItem>
                                )}
                            />

                            {/* التوزيع */}
                            <FormField
                                control={form.control}
                                name="distribution"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormLabel className={labelClasses}>التوزيع</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger
                                                    className={`${inputClasses} w-full`}
                                                    dir="rtl"
                                                >
                                                    <SelectValue placeholder="اختر حالة التوزيع" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="true" className="font-vazirmatn">مسموح</SelectItem>
                                                <SelectItem value="false" className="font-vazirmatn">غير مسموح</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-right" />
                                    </FormItem>
                                )}
                            />

                            {/* ملاحظات */}
                            <FormField
                                control={form.control}
                                name="note"
                                render={({ field }) => (
                                    <FormItem className="text-right md:col-span-2">
                                        <FormLabel className={labelClasses}>ملاحظات</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="أدخل ملاحظات (اختياري)"
                                                className={`${inputClasses} min-h-[80px] resize-none`}
                                                dir="rtl"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-right" />
                                    </FormItem>
                                )}
                            />

                            {/* ── Actions ─────────────────────────────────────── */}
                            <div className="md:col-span-2 flex items-center justify-end gap-3 pt-4">
                                <Button
                                    variant="ghost"
                                    type="button"
                                    className="font-vazirmatn text-subtext rounded-2xl px-6"
                                    onClick={() => router.back()}
                                    disabled={isUpdating}
                                >
                                    إلغاء
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="bg-sidebaractive hover:bg-sidebaractive hover:brightness-110 text-white font-vazirmatn rounded-2xl px-6"
                                >
                                    {isUpdating ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin ml-2" />
                                            جاري الحفظ...
                                        </>
                                    ) : (
                                        'حفظ التعديلات'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
