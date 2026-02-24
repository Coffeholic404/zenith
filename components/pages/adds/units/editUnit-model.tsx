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
import { useUpdateUnitMutation } from '@/services/unit';
import Image from 'next/image';

const editUnitSchema = z.object({
    unitName: z.string().min(1, { message: 'اسم الوحدة مطلوب' }),
    volume: z.string().min(1, { message: 'الحجم مطلوب' })
});

export type EditUnitFormData = z.infer<typeof editUnitSchema>;

interface EditUnitModelProps {
    id: string;
    unitName: string;
    volume: number;
}

export default function EditUnitModel({ id, unitName, volume }: EditUnitModelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [updateUnit, { isLoading }] = useUpdateUnitMutation();
    const { toast } = useToast();

    const form = useForm<EditUnitFormData>({
        resolver: zodResolver(editUnitSchema),
        defaultValues: {
            unitName: unitName || '',
            volume: String(volume ?? 0)
        }
    });

    const {
        handleSubmit,
        control,
        reset,
        formState: { isDirty }
    } = form;

    useEffect(() => {
        reset({ unitName: unitName || '', volume: String(volume ?? 0) });
    }, [unitName, volume, reset]);

    const onSubmit = async (data: EditUnitFormData) => {
        try {
            const res = await updateUnit({
                id,
                unitName: data.unitName.trim(),
                volume: Number(data.volume)
            }).unwrap();
            if (res.isSuccess) {
                toast({
                    title: 'تم بنجاح',
                    description: 'تم تعديل الوحدة بنجاح',
                    variant: 'default'
                });
                setIsOpen(false);
                reset({ unitName: data.unitName.trim(), volume: data.volume });
            } else {
                toast({
                    title: 'حدث خطأ',
                    description: res.errorMessages?.[0] || 'فشل في تعديل الوحدة',
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
        reset({ unitName: unitName || '', volume: String(volume ?? 0) });
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
                        <DialogTitle className="text-right font-vazirmatn font-bold text-[17px]">تعديل الوحدة</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
                            <FormField
                                control={control}
                                name="unitName"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="اسم الوحدة"
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
                                name="volume"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                placeholder="الحجم"
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
