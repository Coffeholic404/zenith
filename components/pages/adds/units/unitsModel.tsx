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
import { useCreateUnitMutation } from '@/services/unit';

const addUnitSchema = z.object({
  unitName: z.string().min(1, { message: 'اسم الوحدة مطلوب' }),
  volume: z.string().min(1, { message: 'الحجم مطلوب' })
});

export type AddUnitFormData = z.infer<typeof addUnitSchema>;

export default function UnitsModelButton({ btnClassName }: { btnClassName?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [createUnit, { isLoading }] = useCreateUnitMutation();

  const form = useForm<AddUnitFormData>({
    resolver: zodResolver(addUnitSchema),
    defaultValues: {
      unitName: '',
      volume: ''
    }
  });

  const { handleSubmit, control, reset } = form;

  const onSubmit = async (data: AddUnitFormData) => {
    try {
      const res = await createUnit({
        unitName: data.unitName.trim(),
        volume: Number(data.volume)
      }).unwrap();

      if (res.isSuccess) {
        toast({
          title: 'تم بنجاح',
          description: 'تم إضافة الوحدة بنجاح',
          variant: 'default'
        });
        setIsOpen(false);
        reset();
      } else {
        toast({
          title: 'حدث خطأ',
          description: res.errorMessages?.[0] || 'فشل في إضافة الوحدة',
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
    setIsOpen(false);
    reset();
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className={cn(
              'P-0 size-10 rounded-xl bg-btnTxtClr hover:bg-btnTxtClr hover:brightness-110',
              btnClassName
            )}
          >
            <Plus strokeWidth={4} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] rtl [&>button]:hidden space-y-4" dir="rtl">
          <DialogHeader className="text-right">
            <DialogTitle className="text-right font-vazirmatn font-bold text-[17px]">
              أضافة وحدة
            </DialogTitle>
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
                        autoComplete="off"
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
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin ml-2" />
                      جاري الحفظ...
                    </>
                  ) : (
                    'حفظ'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
