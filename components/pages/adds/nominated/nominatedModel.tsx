"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { useAddNominatedPartyMutation } from "@/services/nominatedParty";
import { Plus } from 'lucide-react';

const addNominatedPartySchema = z.object({
  name: z.string().min(1, { message: "الاسم مطلوب" }),
})
export type AddNominatedPartyFormData = z.infer<typeof addNominatedPartySchema>
function NominatedModel() {
  const [isOpen, setIsOpen] = useState(false);
  const [addNominatedParty, { isLoading, isSuccess, isError, error }] = useAddNominatedPartyMutation();
  const { toast } = useToast();
  const onSubmit = async (data: AddNominatedPartyFormData) => {
    try {
      const response = await addNominatedParty(data).unwrap();
      toast({
        title: "تم بنجاح",
        description: "تم إضافة جهة الترشيح بنجاح",
      })
      // Close dialog on successful submission
      setIsOpen(false);
      // Reset form
      form.reset();
    } catch (error: any) {
      const errorMessage = error?.data?.errorMessages?.[0] ||
        error?.data?.message ||
        error?.message ||
        "حدث خطأ غير متوقع";
      toast({
        title: "Error",
        description: errorMessage,
      })
    }
  }
  const form = useForm<AddNominatedPartyFormData>({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, { message: "الاسم مطلوب" }),
      })
    ),
  })
  const { formState, handleSubmit, control } = form;
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className=" P-0 size-10 rounded-xl bg-btnTxtClr hover:bg-btnTxtClr hover:brightness-110">
            <Plus strokeWidth={4} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] rtl [&>button]:hidden space-y-4" dir="rtl">
          <DialogHeader className='text-right'>
            <DialogTitle className="text-right font-vazirmatn font-bold text-[17px]">أضافة جهة الترشيح</DialogTitle>
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
                        placeholder="الجهة المرشحة"
                        className="bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-right"
                        dir="rtl"
                      />
                    </FormControl>
                    <FormMessage className="text-right" />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex-row-reverse gap-3">
                <Button size="sm" variant="ghost" className='border text-[#222222] w-24 rounded-2xl font-vazirmatn' onClick={() => setIsOpen(false)}>
                  إلغاء
                </Button>
                <Button size="sm" variant="outline" className='bg-sidebaractive text-white w-24 rounded-2xl hover:bg-sidebaractive hover:brightness-110 hover:text-white font-vazirmatn' type="submit" disabled={isLoading}>
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

export default NominatedModel
