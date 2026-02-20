'use client';
import React, { useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
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
import {
    CalendarDays,
    Plus,
    ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import BillItemsList from '@/components/pages/bills/bill-items-list';
import type { BillItemEntry } from '@/components/pages/bills/bill-items-list';

// ── Schemas ──────────────────────────────────────────────────────────────────

const billItemSchema = z.object({
    item: z.string().min(1, { message: 'المادة مطلوبة' }),
    amount: z.number().min(1, { message: 'الكمية مطلوبة' }),
    cost: z.number().min(0, { message: 'التكلفة مطلوبة' }),
    code: z.string().min(1, { message: 'الرمز مطلوب' }),
    status: z.enum(['new', 'used', 'broken'], {
        message: 'حالة المادة مطلوبة'
    }),
    allowDistribute: z.boolean()
});

const addBillSchema = z.object({
    orderNumber: z.string().min(1, { message: 'رقم الطلب مطلوب' }),
    supplier: z.string().min(1, { message: 'المورد مطلوب' }),
    date: z.date({ message: 'التاريخ مطلوب' }),
    notes: z.string().optional()
});

type BillItemFormData = z.infer<typeof billItemSchema>;
type AddBillFormData = z.infer<typeof addBillSchema>;

// ── Item type for the list ───────────────────────────────────────────────────

// Dummy items for the select (replace with actual data later)
const availableItems = [
    { value: 'item-1', label: 'قطع غيار محرك' },
    { value: 'item-2', label: 'زيوت تشحيم' },
    { value: 'item-3', label: 'فلاتر هواء' },
    { value: 'item-4', label: 'إطارات' },
    { value: 'item-5', label: 'بطاريات' },
    { value: 'item-6', label: 'أسلاك كهربائية' }
];

// ── Input class shorthand ────────────────────────────────────────────────────

const inputClasses =
    'bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-right';

const labelClasses = 'font-vazirmatn text-cardTxt font-semibold text-[13px]';

const selectTriggerClasses =
    'bg-searchBg rounded-xl font-vazirmatn text-subtext focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-right';

// ═══════════════════════════════════════════════════════════════════════════════
// Main Page Component
// ═══════════════════════════════════════════════════════════════════════════════

export default function AddBillPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [items, setItems] = useState<BillItemEntry[]>([]);

    // Bill form
    const billForm = useForm<AddBillFormData>({
        resolver: zodResolver(addBillSchema),
        defaultValues: {
            orderNumber: '',
            supplier: '',
            notes: ''
        }
    });

    // Item form
    const itemForm = useForm<BillItemFormData>({
        resolver: zodResolver(billItemSchema),
        defaultValues: {
            item: '',
            amount: 0,
            cost: 0,
            code: '',
            status: 'new',
            allowDistribute: false
        }
    });

    // ── Add item to the list ─────────────────────────────────────────────────

    const handleAddItem = (data: BillItemFormData) => {
        const newItem: BillItemEntry = {
            ...data,
            id: crypto.randomUUID()
        };
        setItems((prev) => [...prev, newItem]);
        itemForm.reset({
            item: '',
            amount: undefined,
            cost: undefined,
            code: '',
            status: undefined,
            allowDistribute: false
        });
        toast({
            title: 'تمت الإضافة',
            description: 'تم إضافة المادة إلى القائمة بنجاح'
        });
    };

    // ── Remove item from the list ────────────────────────────────────────────

    const handleRemoveItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    // ── Submit the full bill ─────────────────────────────────────────────────

    const handleSubmitBill = (data: AddBillFormData) => {
        if (items.length === 0) {
            toast({
                title: 'خطأ',
                description: 'يجب إضافة مادة واحدة على الأقل',
                variant: 'destructive'
            });
            return;
        }

        const billPayload = {
            ...data,
            items
        };

        // TODO: replace with actual API call
        console.log('Bill Payload:', billPayload);
        toast({
            title: 'تم بنجاح',
            description: 'تم حفظ الفاتورة بنجاح'
        });
    };

    // ── Computed total ────────────────────────────────────────────────────────

    const totalCost = items.reduce(
        (acc, item) => acc + item.cost * item.amount,
        0
    );

    // ═══════════════════════════════════════════════════════════════════════════
    // Render
    // ═══════════════════════════════════════════════════════════════════════════

    return (
        <div className="space-y-6 pb-10" dir="rtl">
            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div className="font-vazirmatn">
                    <p className="font-bold text-cardTxt text-lg">إضافة فاتورة جديدة</p>
                    <p className="font-light text-subtext text-sm">
                        قم بتعبئة بيانات الفاتورة وإضافة المواد
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

            {/* ── Bill Info Section ────────────────────────────────────────── */}
            <Card className="border border-border/60 shadow-sm rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border/40">
                    <p className="font-vazirmatn font-bold text-cardTxt text-[15px]">
                        معلومات الفاتورة
                    </p>
                </div>
                <CardContent className="p-6">
                    <Form {...billForm}>
                        <form
                            id="bill-form"
                            onSubmit={billForm.handleSubmit(handleSubmitBill)}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            dir="rtl"
                        >
                            {/* Order Number */}
                            <FormField
                                control={billForm.control}
                                name="orderNumber"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormLabel className={labelClasses}>رقم الطلب</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="رقم الطلب"
                                                className={inputClasses}
                                                dir="rtl"
                                                autoComplete="off"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-right" />
                                    </FormItem>
                                )}
                            />

                            {/* Supplier */}
                            <FormField
                                control={billForm.control}
                                name="supplier"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormLabel className={labelClasses}>المورد</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="اسم المورد"
                                                className={inputClasses}
                                                dir="rtl"
                                                autoComplete="off"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-right" />
                                    </FormItem>
                                )}
                            />

                            {/* Date */}
                            <FormField
                                control={billForm.control}
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
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage className="text-right" />
                                    </FormItem>
                                )}
                            />

                            {/* Notes */}
                            <div className="md:col-span-2">
                                <FormField
                                    control={billForm.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem className="text-right">
                                            <FormLabel className={labelClasses}>ملاحظات</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder="أضف ملاحظات..."
                                                    className={cn(inputClasses, 'min-h-[90px] resize-none')}
                                                    dir="rtl"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-right" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* ── Add Item Section ─────────────────────────────────────────── */}
            <Card className="border border-border/60 shadow-sm rounded-2xl overflow-hidden">
                <div className=" px-6 py-4 border-b border-border/40">
                    <p className="font-vazirmatn font-bold text-cardTxt text-[15px]">
                        إضافة مادة
                    </p>
                </div>
                <CardContent className="p-6">
                    <Form {...itemForm}>
                        <form
                            onSubmit={itemForm.handleSubmit(handleAddItem)}
                            className="space-y-6"
                            dir="rtl"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {/* Item Select */}
                                <FormField
                                    control={itemForm.control}
                                    name="item"
                                    render={({ field }) => (
                                        <FormItem className="text-right">
                                            <FormLabel className={labelClasses}>المادة</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger
                                                        dir="rtl"
                                                        className={selectTriggerClasses}
                                                    >
                                                        <SelectValue placeholder="اختر المادة" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent dir="rtl">
                                                    {availableItems.map((item) => (
                                                        <SelectItem key={item.value} value={item.value}>
                                                            {item.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-right" />
                                        </FormItem>
                                    )}
                                />

                                {/* Amount */}
                                <FormField
                                    control={itemForm.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem className="text-right">
                                            <FormLabel className={labelClasses}>الكمية</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder="الكمية"
                                                    className={inputClasses}
                                                    dir="rtl"
                                                    autoComplete="off"
                                                    value={field.value ?? ''}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value === '' ? undefined : +e.target.value
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage className="text-right" />
                                        </FormItem>
                                    )}
                                />

                                {/* Cost */}
                                <FormField
                                    control={itemForm.control}
                                    name="cost"
                                    render={({ field }) => (
                                        <FormItem className="text-right">
                                            <FormLabel className={labelClasses}>التكلفة</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder="التكلفة"
                                                    className={inputClasses}
                                                    dir="rtl"
                                                    autoComplete="off"
                                                    value={field.value ?? ''}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value === '' ? undefined : +e.target.value
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage className="text-right" />
                                        </FormItem>
                                    )}
                                />

                                {/* Code */}
                                <FormField
                                    control={itemForm.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem className="text-right">
                                            <FormLabel className={labelClasses}>الرمز</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="رمز المادة"
                                                    className={inputClasses}
                                                    dir="rtl"
                                                    autoComplete="off"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-right" />
                                        </FormItem>
                                    )}
                                />

                                {/* Status */}
                                <FormField
                                    control={itemForm.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem className="text-right">
                                            <FormLabel className={labelClasses}>
                                                حالة المادة
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger
                                                        dir="rtl"
                                                        className={selectTriggerClasses}
                                                    >
                                                        <SelectValue placeholder="اختر الحالة" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent dir="rtl">
                                                    <SelectItem value="new">جديد</SelectItem>
                                                    <SelectItem value="used">مستعمل</SelectItem>
                                                    <SelectItem value="broken">تالف</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-right" />
                                        </FormItem>
                                    )}
                                />

                                {/* Allow Distribute Toggle */}
                                <FormField
                                    control={itemForm.control}
                                    name="allowDistribute"
                                    render={({ field }) => (
                                        <FormItem className="text-right flex flex-col justify-end">
                                            <div className="flex items-center gap-3 h-10 bg-searchBg rounded-xl px-4">
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormLabel
                                                    className={cn(
                                                        labelClasses,
                                                        'cursor-pointer !mt-0 leading-none'
                                                    )}
                                                >
                                                    مسموح بالتوزيع
                                                </FormLabel>
                                            </div>
                                            <FormMessage className="text-right" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Add Item Button */}
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    className="bg-btnTxtClr hover:bg-btnTxtClr hover:brightness-110 text-white rounded-2xl font-vazirmatn gap-2 px-6"
                                >
                                    <Plus className="size-4" />
                                    إضافة المادة
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* ── Items List ───────────────────────────────────────────────── */}
            <BillItemsList
                items={items}
                totalCost={totalCost}
                availableItems={availableItems}
                onRemoveItem={handleRemoveItem}
            />

            {/* ── Footer Actions ───────────────────────────────────────────── */}
            <div className="flex items-center justify-end gap-3">
                <Button
                    variant="ghost"
                    className="border text-[#222222] w-28 rounded-2xl font-vazirmatn"
                    onClick={() => router.back()}
                >
                    إلغاء
                </Button>
                <Button
                    type="submit"
                    form="bill-form"
                    className="bg-sidebaractive text-white w-28 rounded-2xl hover:bg-sidebaractive hover:brightness-110 font-vazirmatn"
                >
                    حفظ الفاتورة
                </Button>
            </div>
        </div>
    );
}
