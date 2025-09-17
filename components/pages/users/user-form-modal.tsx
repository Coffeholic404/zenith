"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Combobox } from "@/components/ui/combobox"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "الاسم يجب أن يكون على الأقل حرفين.",
  }),
  email: z.string().email({
    message: "يرجى إدخال بريد إلكتروني صحيح.",
  }),
  role: z.string({
    required_error: "يرجى اختيار الدور.",
  }),
  status: z.enum(["نشط", "غير نشط", "معلق"], {
    required_error: "يرجى اختيار الحالة.",
  }),
})

const roleOptions = [
  { value: "admin", label: "مدير" },
  { value: "moderator", label: "مشرف" },
  { value: "user", label: "مستخدم" },
]

interface UserFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserFormModal({ open, onOpenChange }: UserFormModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    onOpenChange(false)
    // في بيئة الإنتاج، يمكنك إرسال البيانات إلى الخادم هنا
    alert("تم إضافة المستخدم بنجاح!")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة مستخدم جديد</DialogTitle>
          <DialogDescription>أدخل معلومات المستخدم الجديد. انقر على حفظ عند الانتهاء.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسم المستخدم" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input placeholder="example@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الدور</FormLabel>
                  <FormControl>
                    <Combobox
                      options={roleOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="اختر الدور"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>الحالة</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-0 space-x-reverse space-y-0 rtl:space-x-reverse">
                        <FormControl>
                          <RadioGroupItem value="نشط" />
                        </FormControl>
                        <FormLabel className="mr-2 font-normal">نشط</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-0 space-x-reverse space-y-0 rtl:space-x-reverse">
                        <FormControl>
                          <RadioGroupItem value="غير نشط" />
                        </FormControl>
                        <FormLabel className="mr-2 font-normal">غير نشط</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-0 space-x-reverse space-y-0 rtl:space-x-reverse">
                        <FormControl>
                          <RadioGroupItem value="معلق" />
                        </FormControl>
                        <FormLabel className="mr-2 font-normal">معلق</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">حفظ</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

