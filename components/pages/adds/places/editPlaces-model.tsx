"use client"
import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import pen from "@/public/table/Pen.svg"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useUpdatePlaceMutation } from "@/services/place";
import Image from 'next/image'

// Consolidated validation schema
const editSkillSchema = z.object({
  name: z.string()
    .min(1, { message: "الاسم مطلوب" })
    .min(3, { message: "الاسم يجب أن يكون 3 أحرف على الأقل" })
    .max(100, { message: "الاسم يجب أن يكون أقل من 100 حرف" })
    .trim(),
})

export type EditSkillFormData = z.infer<typeof editSkillSchema>

interface EditSkillModelProps {
  id: string;
  name: string;
}

export default function EditPlaceModel({ id, name }: EditSkillModelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [updatePlace, { isLoading }] = useUpdatePlaceMutation();
  const { toast } = useToast();

  const form = useForm<EditSkillFormData>({
    resolver: zodResolver(editSkillSchema),
    defaultValues: {
      name: name || "",
    },
  });

  const { handleSubmit, control, reset, formState: { errors, isDirty } } = form;

  // Reset form when name prop changes
  useEffect(() => {
    reset({ name: name || "" });
  }, [name, reset]);

  const onSubmit = async (data: EditSkillFormData) => {
    try {
      await updatePlace({
        uniqueID: id,
          name: data.name.trim(),
      }).unwrap();

      toast({
        title: "تم بنجاح",
        description: "تم تعديل المكان بنجاح",
        variant: "default",
      });

      // Close dialog and reset form
      setIsOpen(false);
      reset({ name: data.name.trim() });
    } catch (error: any) {
      console.error('Update place error:', error);
      
      // Extract error message with better fallback handling
      let errorMessage = "حدث خطأ غير متوقع";
      
      if (error?.data) {
        if (error.data.errors && Array.isArray(error.data.errors) && error.data.errors.length > 0) {
          errorMessage = error.data.errors[0].message || error.data.errors[0];
        } else if (error.data.errorMessages && Array.isArray(error.data.errorMessages) && error.data.errorMessages.length > 0) {
          errorMessage = error.data.errorMessages[0];
        } else if (error.data.message) {
          errorMessage = error.data.message;
        } else if (error.data.title) {
          errorMessage = error.data.title;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    reset({ name: name || "" });
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
          <DialogHeader className='text-right'>
            <DialogTitle className="text-right font-vazirmatn font-bold text-[17px]">
              تعديل المكان
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem className="text-right">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="اسم المكان"
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
                  className='border text-[#222222] w-24 rounded-2xl font-vazirmatn' 
                  onClick={handleCancel}
                  disabled={isLoading}
                  type="button"
                >
                  إلغاء
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className='bg-sidebaractive text-white w-24 rounded-2xl hover:bg-sidebaractive hover:brightness-110 hover:text-white font-vazirmatn' 
                  type="submit" 
                  disabled={isLoading || !isDirty}
                >
                  {isLoading ? "جاري الحفظ..." : "حفظ"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

