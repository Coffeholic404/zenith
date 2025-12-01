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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useUpdateEvaluationMutation } from "@/services/evaluation";
import Image from 'next/image'

// Validation schema
const editEvaluationSchema = z.object({
  evaluation1: z.string()
    .min(1, { message: "التقييم الأول مطلوب" })
    .trim(),
  evaluation2: z.string()
    .min(1, { message: "التقييم الثاني مطلوب" })
    .trim(),
  evaluation3: z.string()
    .min(1, { message: "التقييم الثالث مطلوب" })
    .trim(),
  note: z.string()
    .min(1, { message: "الملاحظات مطلوبة" })
    .trim(),
})

export type EditEvaluationFormData = z.infer<typeof editEvaluationSchema>

interface EditEvaluationModalProps {
  uniqueID: string;
  co_St_TrId: string;
  studentName: string;
  evaluation1: string;
  evaluation2: string;
  evaluation3: string;
  note: string;
}

export default function EditEvaluationModal({
  uniqueID,
  co_St_TrId,
  studentName,
  evaluation1,
  evaluation2,
  evaluation3,
  note
}: EditEvaluationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [updateEvaluation, { isLoading }] = useUpdateEvaluationMutation();
  const { toast } = useToast();

  const form = useForm<EditEvaluationFormData>({
    resolver: zodResolver(editEvaluationSchema),
    defaultValues: {
      evaluation1: evaluation1 || "",
      evaluation2: evaluation2 || "",
      evaluation3: evaluation3 || "",
      note: note || "",
    },
  });

  const { handleSubmit, control, reset, formState: { errors, isDirty } } = form;

  // Reset form when props change
  useEffect(() => {
    reset({
      evaluation1: evaluation1 || "",
      evaluation2: evaluation2 || "",
      evaluation3: evaluation3 || "",
      note: note || ""
    });
  }, [evaluation1, evaluation2, evaluation3, note, reset]);

  const onSubmit = async (data: EditEvaluationFormData) => {
    try {
      await updateEvaluation({
        uniqueID: uniqueID,
        evaluation1: data.evaluation1.trim(),
        evaluation2: data.evaluation2.trim(),
        evaluation3: data.evaluation3.trim(),
        note: data.note.trim(),
      }).unwrap();

      toast({
        title: "تم بنجاح",
        description: "تم تعديل التقييم بنجاح",
        variant: "default",
      });

      // Close dialog and reset form
      setIsOpen(false);
      reset({
        evaluation1: data.evaluation1.trim(),
        evaluation2: data.evaluation2.trim(),
        evaluation3: data.evaluation3.trim(),
        note: data.note.trim()
      });
    } catch (error: any) {
      console.error('Update evaluation error:', error);

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
    reset({
      evaluation1: evaluation1 || "",
      evaluation2: evaluation2 || "",
      evaluation3: evaluation3 || "",
      note: note || ""
    });
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
              تعديل تقييم الطالب: {studentName}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
              <FormField
                control={control}
                name="evaluation1"
                render={({ field }) => (
                  <FormItem className="text-right">
                    <FormLabel className="text-right font-vazirmatn">التقييم الأول</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="التقييم الأول"
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
                name="evaluation2"
                render={({ field }) => (
                  <FormItem className="text-right">
                    <FormLabel className="text-right font-vazirmatn">التقييم الثاني</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="التقييم الثاني"
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
                name="evaluation3"
                render={({ field }) => (
                  <FormItem className="text-right">
                    <FormLabel className="text-right font-vazirmatn">التقييم الثالث</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="التقييم الثالث"
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
                    <FormLabel className="text-right font-vazirmatn">ملاحظات</FormLabel>
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
