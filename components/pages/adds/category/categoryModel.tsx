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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreateCategoryMutation } from '@/services/category';

const addCategorySchema = z.object({
  name: z.string().min(1, { message: 'اسم الفئة مطلوب' })
});
export type AddCategoryFormData = z.infer<typeof addCategorySchema>;

export default function CategoryModelButton({ btnClassName }: { btnClassName?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const form = useForm<AddCategoryFormData>({
    resolver: zodResolver(addCategorySchema),
    defaultValues: {
      name: ''
    }
  });

  const onSubmit = async (data: AddCategoryFormData) => {
    try {
      const res = await createCategory({ categoryName: data.name }).unwrap();
      if (res.isSuccess) {
        toast({
          title: 'تمت الإضافة بنجاح',
          description: 'تم إضافة الفئة بنجاح',
          variant: 'default'
        });
        form.reset();
        setIsOpen(false);
      } else {
        toast({
          title: 'حدث خطأ',
          description: res.errorMessages?.[0] || 'فشل في إضافة الفئة',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      toast({
        title: 'حدث خطأ',
        description: error?.data?.errorMessages?.[0] || 'فشل في إضافة الفئة، حاول مرة أخرى',
        variant: 'destructive'
      });
    }
  };

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
            <DialogTitle className="text-right font-vazirmatn font-bold text-[17px]">أضافة فئة</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="text-right">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="اسم الفئة"
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
