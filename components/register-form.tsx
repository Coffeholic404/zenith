"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "الاسم يجب أن يكون على الأقل حرفين.",
    }),
    email: z.string().email({
      message: "يرجى إدخال بريد إلكتروني صحيح.",
    }),
    password: z.string().min(8, {
      message: "كلمة المرور يجب أن تكون على الأقل 8 أحرف.",
    }),
    confirmPassword: z.string(),
    gender: z.enum(["male", "female", "other"], {
      required_error: "يرجى اختيار الجنس.",
    }),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "يجب الموافقة على الشروط والأحكام.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  })

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    // محاكاة تأخير الشبكة
    setTimeout(() => {
      console.log(values)
      setIsLoading(false)
      router.push("/login")
    }, 1500)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم</FormLabel>
              <FormControl>
                <Input placeholder="أدخل اسمك الكامل" {...field} />
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
              <FormDescription>سيتم استخدام هذا البريد الإلكتروني لتسجيل الدخول.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>كلمة المرور</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-0 top-0 h-full px-3 py-2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}</span>
                  </Button>
                </div>
              </FormControl>
              <FormDescription>يجب أن تكون كلمة المرور على الأقل 8 أحرف.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تأكيد كلمة المرور</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-0 top-0 h-full px-3 py-2 text-muted-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showConfirmPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}</span>
                  </Button>
                </div>
              </FormControl>
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
                  <FormItem className="flex items-center space-x-0 space-x-reverse space-y-0 rtl:space-x-reverse">
                    <FormControl>
                      <RadioGroupItem value="male" />
                    </FormControl>
                    <FormLabel className="mr-2 font-normal">ذكر</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-0 space-x-reverse space-y-0 rtl:space-x-reverse">
                    <FormControl>
                      <RadioGroupItem value="female" />
                    </FormControl>
                    <FormLabel className="mr-2 font-normal">أنثى</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-0 space-x-reverse space-y-0 rtl:space-x-reverse">
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
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row   items-start space-x-0 space-x-reverse space-y-0 rounded-md border p-4 rtl:space-x-reverse">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="mr-2 space-y-1 leading-none">
                <FormLabel>الشروط والأحكام</FormLabel>
                <FormDescription>أوافق على الشروط والأحكام وسياسة الخصوصية.</FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              جاري التسجيل...
            </>
          ) : (
            "تسجيل"
          )}
        </Button>
        <div className="text-center text-sm">
          لديك حساب بالفعل؟{" "}
          <Button variant="link" className="px-0 font-normal" type="button" onClick={() => router.push("/login")}>
            تسجيل الدخول
          </Button>
        </div>
      </form>
    </Form>
  )
}

