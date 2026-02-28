'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { useCreateStockMutation } from '@/services/stock';
import { useGetItemsListQuery } from '@/services/item';
import { useGetTrainersQuery } from '@/services/employe';
import { useGetStudentsQuery } from '@/services/students';

// ── Schema ───────────────────────────────────────────────────────────────────

const addItemSchema = z.object({
    itemId: z.string().min(1, { message: 'المنتج مطلوب' }),
    code: z.string().min(1, { message: 'الكود مطلوب' }),
    cost: z.string().min(1, { message: 'التكلفة مطلوبة' }),
    packagerId: z.string().min(1, { message: 'الرزام مطلوب' }),
    packetCoachId: z.string().min(1, { message: 'مشرف الرزم مطلوب' }),
    note: z.string().optional(),
    status: z.string().min(1, { message: 'الحالة مطلوبة' }),
    distribution: z.string().min(1, { message: 'حالة التوزيع مطلوبة' })
});

type AddItemFormData = z.infer<typeof addItemSchema>;

// ── Styling ──────────────────────────────────────────────────────────────────

const inputClasses =
    'bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-right';

const labelClasses = 'font-vazirmatn text-cardTxt font-semibold text-[13px]';

const comboboxTriggerClasses =
    'bg-searchBg rounded-xl font-vazirmatn border-input hover:bg-searchBg text-right';

// ── Component ────────────────────────────────────────────────────────────────

export default function AddItemForm() {
    const { toast } = useToast();
    const router = useRouter();

    // ── API hooks ────────────────────────────────────────────────────────
    const [createStock, { isLoading: isCreating }] = useCreateStockMutation();

    const { data: itemsData, isLoading: isLoadingItems } = useGetItemsListQuery({
        pageNumber: 1,
        pageSize: 1000
    });

    const { data: studentsData, isLoading: isLoadingStudents } = useGetStudentsQuery({
        pageNumber: 1,
        pageSize: 1000
    });

    const { data: trainersData, isLoading: isLoadingTrainers } = useGetTrainersQuery({
        pageNumber: 1,
        pageSize: 1000
    });

    // ── Combobox options ─────────────────────────────────────────────────
    const itemOptions = (itemsData?.result?.data ?? []).map((item) => ({
        value: item.id,
        label: item.itemName
    }));

    const studentOptions = (studentsData?.result?.data ?? []).map((student) => ({
        value: student.uniqueID,
        label: student.name
    }));

    const trainerOptions = (trainersData?.result?.data ?? []).map((trainer) => ({
        value: trainer.id ?? '',
        label: trainer.name
    }));

    // ── Form ─────────────────────────────────────────────────────────────
    const form = useForm<AddItemFormData>({
        resolver: zodResolver(addItemSchema),
        defaultValues: {
            itemId: '',
            code: '',
            cost: '',
            packagerId: '',
            packetCoachId: '',
            note: '',
            status: '',
            distribution: ''
        }
    });

    const handleSubmit = async (data: AddItemFormData) => {
        try {
            await createStock({
                itemId: data.itemId,
                code: data.code,
                cost: Number(data.cost),
                packagerId: data.packagerId,
                packetCoachId: data.packetCoachId,
                note: data.note ?? '',
                status: data.status,
                distribution: data.distribution
            }).unwrap();

            toast({
                title: 'تم بنجاح',
                description: 'تم إضافة المنتج بنجاح'
            });
            router.push('/inventory');
        } catch (error: any) {
            const errorMessage =
                error?.data?.errorMessages?.[0] ??
                error?.data?.message ??
                'حدث خطأ أثناء إضافة المنتج';
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
                    <p className="font-bold text-cardTxt text-lg">إضافة منتج جديد</p>
                    <p className="font-light text-subtext text-sm">
                        قم بتعبئة بيانات المنتج لإضافته إلى الجرد
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

            {/* ── Form Card ───────────────────────────────────────────────────── */}
            <Card className="border border-border/60 shadow-sm rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border/40">
                    <p className="font-vazirmatn font-bold text-cardTxt text-[15px]">
                        بيانات المنتج
                    </p>
                </div>
                <CardContent className="p-6">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            dir="rtl"
                        >
                            {/* المنتج - Combobox */}
                            <FormField
                                control={form.control}
                                name="itemId"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormLabel className={labelClasses}>المنتج</FormLabel>
                                        <FormControl>
                                            <Combobox
                                                options={itemOptions}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder={isLoadingItems ? 'جاري التحميل...' : 'اختر المنتج'}
                                                emptyMessage="لا توجد منتجات"
                                                triggerClassName={comboboxTriggerClasses}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-right" />
                                    </FormItem>
                                )}
                            />

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

                            {/* الرزام - Combobox (Employees) */}
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

                            {/* الحالة */}
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormLabel className={labelClasses}>الحالة</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
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
                                        <Select onValueChange={field.onChange} value={field.value}>
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
                                    disabled={isCreating}
                                >
                                    إلغاء
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isCreating}
                                    className="bg-sidebaractive hover:bg-sidebaractive hover:brightness-110 text-white font-vazirmatn rounded-2xl px-6"
                                >
                                    {isCreating ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin ml-2" />
                                            جاري الحفظ...
                                        </>
                                    ) : (
                                        'حفظ المنتج'
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
