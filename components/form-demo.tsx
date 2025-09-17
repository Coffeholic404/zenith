"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { FileUploader } from "@/components/forms/file-uploader"
import { TimePickerDemo } from "@/components/forms/time-picker"
import { DatePickerDemo } from "@/components/forms/date-picker"
import { Combobox } from "@/components/ui/combobox"
import { useGetTest1Query } from "@/services/test"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "الاسم يجب أن يكون على الأقل حرفين.",
  }),
  email: z.string().email({
    message: "يرجى إدخال بريد إلكتروني صحيح.",
  }),
  bio: z
    .string()
    .min(10, {
      message: "السيرة الذاتية يجب أن تكون على الأقل 10 أحرف.",
    })
    .max(160, {
      message: "السيرة الذاتية يجب أن تكون أقل من 160 حرفًا.",
    }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "يجب الموافقة على الشروط والأحكام.",
  }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "يرجى اختيار الجنس.",
  }),
  country: z.string({
    required_error: "يرجى اختيار الدولة.",
  }),
  birthDate: z.date({
    required_error: "يرجى اختيار تاريخ الميلاد.",
  }),
  appointmentTime: z.string({
    required_error: "يرجى اختيار وقت الموعد.",
  }),
  files: z.array(z.string()).optional(),
  multipleFiles: z.array(z.string()).optional(),
})

const countryOptions = [
  { value: "sa", label: "المملكة العربية السعودية" },
  { value: "ae", label: "الإمارات العربية المتحدة" },
  { value: "eg", label: "مصر" },
  { value: "jo", label: "الأردن" },
  { value: "kw", label: "الكويت" },
  { value: "bh", label: "البحرين" },
  { value: "qa", label: "قطر" },
  { value: "om", label: "عمان" },
  { value: "lb", label: "لبنان" },
  { value: "sy", label: "سوريا" },
  { value: "iq", label: "العراق" },
  { value: "ye", label: "اليمن" },
  { value: "ps", label: "فلسطين" },
  { value: "ly", label: "ليبيا" },
  { value: "tn", label: "تونس" },
  { value: "dz", label: "الجزائر" },
  { value: "ma", label: "المغرب" },
  { value: "sd", label: "السودان" },
]

export function FormDemo() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      acceptTerms: false,
      files: [],
      multipleFiles: [],
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // في بيئة الإنتاج، يمكنك إرسال البيانات إلى الخادم هنا
    alert("تم إرسال النموذج بنجاح!")
  }
  const { isFetching, data } = useGetTest1Query({});
  const recordsData = Array.isArray(data) ? data : [];
  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل اسمك" {...field} />
                    </FormControl>
                    <FormDescription>هذا هو اسمك الكامل.</FormDescription>
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
                    <FormDescription>لن نشارك بريدك الإلكتروني مع أي شخص آخر.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>السيرة الذاتية</FormLabel>
                    <FormControl>
                      <Textarea placeholder="اكتب نبذة عنك..." className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>يمكنك كتابة نبذة قصيرة عن نفسك.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الدولة</FormLabel>
                    <FormControl>
                      <Combobox
                        options={countryOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="اختر الدولة"
                      />
                    </FormControl>
                    <FormDescription>اختر الدولة التي تقيم فيها.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>الجنس</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-0 gap-2 space-y-0 rtl:space-x-0">
                          <FormControl>
                            <RadioGroupItem value="male" />
                          </FormControl>
                          <FormLabel className="mr-2 font-normal rtl:mr-2 rtl:ml-0">ذكر</FormLabel>
                        </FormItem>
                        <FormItem className="flex gap-2  items-center space-x-0 space-x-reverse space-y-0 rtl:space-x-reverse">
                          <FormControl>
                            <RadioGroupItem value="female" />
                          </FormControl>
                          <FormLabel className="mr-2 font-normal">أنثى</FormLabel>
                        </FormItem>
                        <FormItem className="flex gap-2  items-center space-x-0 space-x-reverse space-y-0 rtl:space-x-reverse">
                          <FormControl>
                            <RadioGroupItem value="other" />
                          </FormControl>
                          <FormLabel className="mr-2 font-normal">آخر</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>تاريخ الميلاد</FormLabel>
                    <FormControl>
                      <DatePickerDemo
                        date={field.value}
                        setDate={field.onChange}
                        type="full"
                        placeholder="اختر تاريخًا"
                      />
                    </FormControl>
                    <FormDescription>تاريخ ميلادك.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appointmentTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>وقت الموعد</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-right font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value || <span>اختر وقتًا</span>}
                            <Clock className="mr-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-4" align="start">
                        <TimePickerDemo setTime={(time) => field.onChange(time)} time={field.value} />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>اختر وقت الموعد المناسب لك.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="files"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رفع ملف</FormLabel>
                    <FormControl>
                      <FileUploader value={field.value || []} onChange={(urls) => field.onChange(urls)} multiple={false} />
                    </FormControl>
                    <FormDescription>قم برفع ملف واحد.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="multipleFiles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رفع ملفات متعددة</FormLabel>
                    <FormControl>
                      <FileUploader value={field.value || []} onChange={(urls) => field.onChange(urls)} multiple={true} />
                    </FormControl>
                    <FormDescription>قم برفع ملفات متعددة.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="acceptTerms"
              render={({ field }) => (
                <FormItem className="flex     flex-row items-start space-x-0 space-y-0 rounded-md border p-4 rtl:space-x-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="mr-2 space-y-1 leading-none rtl:mr-2 rtl:ml-0">
                    <FormLabel>الشروط والأحكام</FormLabel>
                    <FormDescription>أوافق على الشروط والأحكام وسياسة الخصوصية.</FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full md:w-auto">
              إرسال النموذج
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

