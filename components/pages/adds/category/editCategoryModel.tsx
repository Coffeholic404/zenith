'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import pen from '@/public/table/Pen.svg';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useUpdateCategoryMutation } from '@/services/category';
import Image from 'next/image';

const editCategorySchema = z.object({
    categoryName: z.string().min(1, { message: 'اسم الفئة مطلوب' })
});

export type EditCategoryFormData = z.infer<typeof editCategorySchema>;

interface EditCategoryModelProps {
    id: string;
    categoryName: string;
}

export default function EditCategoryModel({ id, categoryName }: EditCategoryModelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [updateCategory, { isLoading }] = useUpdateCategoryMutation();
    const { toast } = useToast();

    const form = useForm<EditCategoryFormData>({
        resolver: zodResolver(editCategorySchema),
        defaultValues: {
            categoryName: categoryName || ''
        }
    });

    const {
        handleSubmit,
        control,
        reset,
        formState: { isDirty }
    } = form;

    useEffect(() => {
        reset({ categoryName: categoryName || '' });
    }, [categoryName, reset]);

    const onSubmit = async (data: EditCategoryFormData) => {
        try {
            const res = await updateCategory({
                id,
                categoryName: data.categoryName.trim()
            }).unwrap();
            if (res.isSuccess) {
                toast({
                    title: 'تم بنجاح',
                    description: 'تم تعديل الفئة بنجاح',
                    variant: 'default'
                });
                setIsOpen(false);
                reset({ categoryName: data.categoryName.trim() });
            } else {
                toast({
                    title: 'حدث خطأ',
                    description: res.errorMessages?.[0] || 'فشل في تعديل الفئة',
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
        reset({ categoryName: categoryName || '' });
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
                        <DialogTitle className="text-right font-vazirmatn font-bold text-[17px]">تعديل الفئة</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
                            <FormField
                                control={control}
                                name="categoryName"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="اسم الفئة"
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
