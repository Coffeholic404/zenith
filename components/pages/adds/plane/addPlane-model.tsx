'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { useCreatePlaneMutation } from '@/services/plane';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const addPlaneSchema = z.object({
  name: z.string().min(1, { message: 'الاسم مطلوب' }),
  licenseNumber: z.string().min(1, { message: 'رقم الترخيص مطلوب' })
});
export type AddPlaneFormData = z.infer<typeof addPlaneSchema>;
function AddPlaneModel({ btnClassName }: { btnClassName?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [addPlane, { isLoading, isSuccess, isError, error }] = useCreatePlaneMutation();
  const { toast } = useToast();
  const onSubmit = async (data: AddPlaneFormData) => {
    try {
      const response = await addPlane(data).unwrap();
      toast({
        title: 'تم بنجاح',
        description: 'تم إضافة طائرة بنجاح'
      });
      // Close dialog on successful submission
      setIsOpen(false);
      // Reset form
      form.reset();
    } catch (error: any) {
      const errorMessage =
        error?.data?.errorMessages?.[0] || error?.data?.message || error?.message || 'حدث خطأ غير متوقع';
      toast({
        title: 'Error',
        description: errorMessage
      });
    }
  };
  const form = useForm<AddPlaneFormData>({
    resolver: zodResolver(
      z.object({
        name: z.string().min(3, { message: 'الاسم يجب أن يكون على الأقل 3 أحرف' }),
        licenseNumber: z.string().min(1, { message: 'رقم الترخيص مطلوب' })
      })
    )
  });
  const { formState, handleSubmit, control } = form;
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className={cn(' P-0 size-10 rounded-xl bg-btnTxtClr hover:bg-btnTxtClr hover:brightness-110', btnClassName)}
          >
            <Plus strokeWidth={4} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] rtl [&>button]:hidden space-y-4" dir="rtl">
          <DialogHeader className="text-right">
            <DialogTitle className="text-right font-vazirmatn font-bold text-[17px]">أضافة طائرة</DialogTitle>
            {/* <DialogDescription className='text-subtext text-right'>
                        يرجى إدخال أسم الجهة المرشحة
                    </DialogDescription> */}
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem className="text-right">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="اسم الطائرة"
                        className="bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-right"
                        dir="rtl"
                      />
                    </FormControl>
                    <FormMessage className="text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem className="text-right">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="رقم الترخيص"
                        className="bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-right"
                        dir="rtl"
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
                  onClick={() => setIsOpen(false)}
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

export default AddPlaneModel;
