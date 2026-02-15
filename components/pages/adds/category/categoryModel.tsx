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
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const addCategorySchema = z.object({
  name: z.string().min(1, { message: 'اسم الفئة مطلوب' })
});
export type AddCategoryFormData = z.infer<typeof addCategorySchema>;

export default function CategoryModelButton({ btnClassName }: { btnClassName?: string }) {
  const [isOpen, setIsOpen] = useState(false);

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
            <DialogTitle className="text-right font-vazirmatn font-bold text-[17px]">أضافة فئة</DialogTitle>
          </DialogHeader>
          <CategoryModel />
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
            >
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CategoryModel() {
  const form = useForm<AddCategoryFormData>({
    resolver: zodResolver(addCategorySchema)
  });
  const { formState, handleSubmit, control } = form;
  return (
    <Form {...form}>
      <form className=" space-y-6" dir="rtl">
        <FormField
          control={control}
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
                />
              </FormControl>
              <FormMessage className="text-right" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
