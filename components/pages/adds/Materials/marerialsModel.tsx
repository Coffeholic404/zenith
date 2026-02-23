'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreateItemMutation } from '@/services/item';
import { useGetCategoriesQuery } from '@/services/category';
import { useGetUnitsListQuery } from '@/services/unit';

const addMaterialSchema = z.object({
  itemName: z.string().min(1, { message: 'اسم المنتج مطلوب' }),
  unitId: z.string().min(1, { message: 'الوحدة مطلوبة' }),
  categoryId: z.string().min(1, { message: 'النوع مطلوب' }),
  country: z.string().min(1, { message: 'البلد المصنع مطلوب' }),
  brand: z.string().min(1, { message: 'العلامة التجارية مطلوبة' }),
  description: z.string(),
  note: z.string(),
  limit: z.string().min(1, { message: 'الحد الأدنى مطلوب' })
});
export type AddMaterialFormData = z.infer<typeof addMaterialSchema>;

export default function MarerialsModelButton({ btnClassName }: { btnClassName?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [createItem, { isLoading }] = useCreateItemMutation();
  const { data: categories } = useGetCategoriesQuery({ pageSize: 100 });

  const form = useForm<AddMaterialFormData>({
    resolver: zodResolver(addMaterialSchema),
    defaultValues: {
      itemName: '',
      unitId: '',
      categoryId: '',
      country: '',
      brand: '',
      description: '',
      note: '',
      limit: ''
    }
  });

  const onSubmit = async (data: AddMaterialFormData) => {
    try {
      const res = await createItem({
        itemName: data.itemName,
        description: data.description,
        categoryId: data.categoryId,
        note: data.note,
        unitId: data.unitId,
        country: data.country,
        brand: data.brand,
        limit: Number(data.limit)
      }).unwrap();
      if (res.isSuccess) {
        toast({
          title: 'تمت الإضافة بنجاح',
          description: 'تم إضافة المادة بنجاح',
          variant: 'default'
        });
        form.reset();
        setIsOpen(false);
      } else {
        toast({
          title: 'حدث خطأ',
          description: res.errorMessages?.[0] || 'فشل في إضافة المادة',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      toast({
        title: 'حدث خطأ',
        description: error?.data?.errorMessages?.[0] || 'فشل في إضافة المادة، حاول مرة أخرى',
        variant: 'destructive'
      });
    }
  };

  const categoriesData = categories?.result?.data || [];

  const { data: units } = useGetUnitsListQuery({ pageSize: 100 });
  const unitsData = units?.result?.data || [];

  return (
    <div>
      <Dialog
        open={isOpen}
        onOpenChange={open => {
          setIsOpen(open);
          if (!open) form.reset();
        }}
      >
        <DialogTrigger asChild>
          <Button
            className={cn(' P-0 size-10 rounded-xl bg-btnTxtClr hover:bg-btnTxtClr hover:brightness-110', btnClassName)}
          >
            <Plus strokeWidth={4} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] rtl [&>button]:hidden space-y-4" dir="rtl">
          <DialogHeader className="text-right">
            <DialogTitle className="text-right font-vazirmatn font-bold text-[17px]">أضافة المادة</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
              <FormField
                control={form.control}
                name="itemName"
                render={({ field }) => (
                  <FormItem className="text-right">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="اسم المنتج"
                        className="bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-right"
                        dir="rtl"
                        autoComplete="off"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
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
                control={form.control}
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
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="text-right">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="البلد المصنع"
                        className="bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-right"
                        dir="rtl"
                        autoComplete="off"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem className="text-right">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="العلامة التجارية"
                        className="bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-right"
                        dir="rtl"
                        autoComplete="off"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="text-right">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="الوصف"
                        className="bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-right"
                        dir="rtl"
                        autoComplete="off"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="text-right">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="ملاحظات"
                        className="bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-right"
                        dir="rtl"
                        autoComplete="off"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
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
                        autoComplete="off"
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
                  type="button"
                  className="border text-[#222222] w-24 rounded-2xl font-vazirmatn"
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                >
                  إلغاء
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-sidebaractive text-white w-24 rounded-2xl hover:bg-sidebaractive hover:brightness-110 hover:text-white font-vazirmatn"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="size-4 animate-spin" /> : 'حفظ'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
