"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useSigninMutation, AuthResponse } from "@/services/auth";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";

const formSchema = z.object({
  username: z.string().min(4, {
    message: "يرجى إدخال اسم مستخدم صحيح.",
  }),
  password: z.string().min(4, {
    message: "كلمة المرور يجب أن تكون على الأقل 4 أحرف.",
  }),
});

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [signin, { isLoading }] = useSigninMutation();
  const { status, data } = useSession();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res: AuthResponse = await signin({
        username: values.username,
        password: values.password,
      }).unwrap();

      if (!res.isSuccess) {
        // Show error messages from API
        const errorMessage = res.errorMessages?.join(", ") || "فشل تسجيل الدخول";
        toast.error(errorMessage);
        return;
      }

      // Sign in with NextAuth using the API response
      const result = await signIn("credentials", {
        data: JSON.stringify(res),
        redirect: false,
        callbackUrl: `${window.location.origin}/`,
      });

      if (result?.error) {
        toast.error("فشل تسجيل الدخول، يرجى المحاولة مرة أخرى");
        return;
      }

      // Success - router will redirect via useEffect
      toast.success("تم تسجيل الدخول بنجاح");
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error?.data?.errorMessages?.join(", ") ||
        error?.message ||
        "خطأ في الاتصال، يرجى المحاولة مرة أخرى";
      toast.error(errorMessage);
    }
  }

  React.useEffect(() => {
    if (status === "authenticated" && window.location.pathname === "/login") {
      router.replace(`/`);
    }
  }, [status]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 font-vazirmatn">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>البريد الإلكتروني</FormLabel>
              <FormControl>
                <Input placeholder="example@example.com" {...field} className="font-vazirmatn text-sm focus-within:text-black focus-visible:text-black"/>
              </FormControl>
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
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-0 top-0 h-full px-3 py-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                    </span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row   items-center space-x-0 space-x-reverse space-y-0 rtl:space-x-reverse">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="mr-2 font-normal">تذكرني</FormLabel>
              </FormItem>
            )}
          />
          <Button variant="link" className="px-0 font-normal" type="button">
            نسيت كلمة المرور؟
          </Button>
        </div> */}
        <Button type="submit" className="w-full bg-sidebaractive hover:bg-sidebaractive" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              جاري تسجيل الدخول...
            </>
          ) : (
            "تسجيل الدخول"
          )}
        </Button>
        <div className="text-center text-sm">
          ليس لديك حساب؟{" "}
          <Button
            variant="link"
            className="px-0 font-normal"
            type="button"
            onClick={() => router.push("users/register")}
          >
            إنشاء حساب
          </Button>
        </div>
      </form>
    </Form>
  );
}
