'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import pen from '@/public/table/Pen.svg';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useUpdateItemMutation, Item } from '@/services/item';
import { useGetCategoriesQuery } from '@/services/category';
import { useGetUnitsListQuery } from '@/services/unit';
import Image from 'next/image';

const editMaterialSchema = z.object({
    itemName: z.string().min(1, { message: 'اسم المنتج مطلوب' }),
    unitId: z.string().min(1, { message: 'الوحدة مطلوبة' }),
    categoryId: z.string().min(1, { message: 'النوع مطلوب' }),
    country: z.string().min(1, { message: 'البلد المصنع مطلوب' }),
    brand: z.string().min(1, { message: 'العلامة التجارية مطلوبة' }),
    description: z.string(),
    note: z.string(),
    limit: z.string().min(1, { message: 'الحد الأدنى مطلوب' })
});

export type EditMaterialFormData = z.infer<typeof editMaterialSchema>;

interface EditMaterialModelProps {
    item: Item;
}

export default function EditMaterialModel({ item }: EditMaterialModelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [updateItem, { isLoading }] = useUpdateItemMutation();
    const { toast } = useToast();
    const { data: categories } = useGetCategoriesQuery({ pageSize: 100 });
    const { data: units } = useGetUnitsListQuery({ pageSize: 100 });

    const categoriesData = categories?.result?.data || [];
    const unitsData = units?.result?.data || [];

    const form = useForm<EditMaterialFormData>({
        resolver: zodResolver(editMaterialSchema),
        defaultValues: {
            itemName: item.itemName || '',
            unitId: item.unitId || '',
            categoryId: item.categoryId || '',
            country: item.country || '',
            brand: item.brand || '',
            description: item.description || '',
            note: item.note || '',
            limit: String(item.limit ?? 0)
        }
    });

    const {
        handleSubmit,
        control,
        reset,
        formState: { isDirty }
    } = form;

    useEffect(() => {
        reset({
            itemName: item.itemName || '',
            unitId: item.unitId || '',
            categoryId: item.categoryId || '',
            country: item.country || '',
            brand: item.brand || '',
            description: item.description || '',
            note: item.note || '',
            limit: String(item.limit ?? 0)
        });
    }, [item, reset]);

    const onSubmit = async (data: EditMaterialFormData) => {
        try {
            const res = await updateItem({
                id: item.id,
                itemName: data.itemName.trim(),
                description: data.description,
                categoryId: data.categoryId,
                note: data.note,
                unitId: data.unitId,
                country: data.country.trim(),
                brand: data.brand.trim(),
                limit: Number(data.limit)
            }).unwrap();
            if (res.isSuccess) {
                toast({
                    title: 'تم بنجاح',
                    description: 'تم تعديل المادة بنجاح',
                    variant: 'default'
                });
                setIsOpen(false);
            } else {
                toast({
                    title: 'حدث خطأ',
                    description: res.errorMessages?.[0] || 'فشل في تعديل المادة',
                    variant: 'destructive'
                });
            }
        } catch (error: any) {
            toast({
                title: 'خطأ',
                description: error?.data?.errorMessages?.[0] || 'حدث خطأ غير متوقع',
                variant: 'destructive'
            });
        }
    };

    const handleCancel = () => {
        reset();
        setIsOpen(false);
    };

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" className="p-0 px-1">
                        <Image src={pen} alt="تعديل" className="size-5" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] rtl [&>button]:hidden space-y-4" dir="rtl">
                    <DialogHeader className="text-right">
                        <DialogTitle className="text-right font-vazirmatn font-bold text-[17px]">تعديل المادة</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
                            <FormField
                                control={control}
                                name="itemName"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="اسم المنتج"
                                                className="bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-right"
                                                dir="rtl"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-right" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                                            <FormControl>
                                                <SelectTrigger
                                                    dir="rtl"
                                                    className="bg-searchBg rounded-xl font-vazirmatn text-subtext focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-right"
                                                >
                                                    <SelectValue placeholder="النوع" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent dir="rtl">
                                                {categoriesData.map(cat => (
                                                    <SelectItem key={cat.id} value={cat.id}>
                                                        {cat.categoryName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-right" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="unitId"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                                            <FormControl>
                                                <SelectTrigger
                                                    dir="rtl"
                                                    className="bg-searchBg rounded-xl font-vazirmatn text-subtext focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-right"
                                                >
                                                    <SelectValue placeholder="الوحدة" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent dir="rtl">
                                                {unitsData.map(unit => (
                                                    <SelectItem key={unit.id} value={unit.id}>
                                                        {unit.unitName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-right" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="البلد المصنع"
                                                className="bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-right"
                                                dir="rtl"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-right" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="brand"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="العلامة التجارية"
                                                className="bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-right"
                                                dir="rtl"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-right" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="الوصف"
                                                className="bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-right"
                                                dir="rtl"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-right" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="note"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="ملاحظات"
                                                className="bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-right"
                                                dir="rtl"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-right" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="limit"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                placeholder="الحد الأدنى"
                                                className="bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-right"
                                                dir="rtl"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-right" />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter className="flex-row-reverse gap-3">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="border text-[#222222] w-24 rounded-2xl font-vazirmatn"
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                    type="button"
                                >
                                    إلغاء
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="bg-sidebaractive text-white w-24 rounded-2xl hover:bg-sidebaractive hover:brightness-110 hover:text-white font-vazirmatn"
                                    type="submit"
                                    disabled={isLoading || !isDirty}
                                >
                                    {isLoading ? 'جاري الحفظ...' : 'حفظ'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
