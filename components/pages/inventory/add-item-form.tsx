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
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';

// ── Schema ───────────────────────────────────────────────────────────────────

const addItemSchema = z.object({
    name: z.string().min(1, { message: 'المنتج مطلوب' }),
    code: z.string().min(1, { message: 'الكود مطلوب' }),
    cost: z.string().min(1, { message: 'التكلفة مطلوبة' }),
    bundle: z.string().min(1, { message: 'الرزام مطلوب' }),
    bundleSupervisor: z.string().min(1, { message: 'مشرف الرزم مطلوب' }),
    date: z.date({ message: 'التاريخ مطلوب' })
});

type AddItemFormData = z.infer<typeof addItemSchema>;

// ── Styling ──────────────────────────────────────────────────────────────────

const inputClasses =
    'bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-right';

const labelClasses = 'font-vazirmatn text-cardTxt font-semibold text-[13px]';

// ── Component ────────────────────────────────────────────────────────────────

export default function AddItemForm() {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<AddItemFormData>({
        resolver: zodResolver(addItemSchema),
        defaultValues: {
            name: '',
            code: '',
            cost: '',
            bundle: '',
            bundleSupervisor: ''
        }
    });

    const handleSubmit = (data: AddItemFormData) => {
        console.log('Submit item:', data);
        toast({
            title: 'تم بنجاح',
            description: 'تم إضافة المنتج بنجاح'
        });
        router.push('/inventory');
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
                            {/* المنتج */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormLabel className={labelClasses}>المنتج</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="اسم المنتج"
                                                className={inputClasses}
                                                dir="rtl"
                                                autoComplete="off"
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

                            {/* الرزام */}
                            <FormField
                                control={form.control}
                                name="bundle"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormLabel className={labelClasses}>الرزام</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="اسم الرزام"
                                                className={inputClasses}
                                                dir="rtl"
                                                autoComplete="off"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-right" />
                                    </FormItem>
                                )}
                            />

                            {/* مشرف الرزم */}
                            <FormField
                                control={form.control}
                                name="bundleSupervisor"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormLabel className={labelClasses}>مشرف الرزم</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="اسم مشرف الرزم"
                                                className={inputClasses}
                                                dir="rtl"
                                                autoComplete="off"
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
                                    <FormItem className="text-right flex flex-col">
                                        <FormLabel className={labelClasses}>التاريخ</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            'justify-start text-right font-vazirmatn gap-2',
                                                            'bg-searchBg rounded-xl border-input hover:bg-searchBg',
                                                            !field.value && 'text-subtext'
                                                        )}
                                                    >
                                                        <CalendarDays className="size-4 text-subtext" />
                                                        {field.value
                                                            ? format(field.value, 'PPP', { locale: ar })
                                                            : 'اختر التاريخ'}
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

                            {/* ── Actions ─────────────────────────────────────── */}
                            <div className="md:col-span-2 flex items-center justify-end gap-3 pt-4">
                                <Button
                                    variant="ghost"
                                    type="button"
                                    className="font-vazirmatn text-subtext rounded-2xl px-6"
                                    onClick={() => router.back()}
                                >
                                    إلغاء
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-sidebaractive hover:bg-sidebaractive hover:brightness-110 text-white font-vazirmatn rounded-2xl px-6"
                                >
                                    حفظ المنتج
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
