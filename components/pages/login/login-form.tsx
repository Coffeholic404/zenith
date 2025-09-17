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
import { se } from "date-fns/locale";
import { useSigninMutation } from "@/services/auth";
import { signIn, useSession } from "next-auth/react";

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
      const res: any = await signin({
        email: values.username,
        password: values.password,
      }).unwrap();

      if (
        res &&
        res.error &&
        res.error.data &&
        res.error.data.statusCode == 401
      ) {
        // return showMessage('يرجى التأكد من المعلومات المدخلة', 'error');
      }
      const data: any = await signIn("credentials", {
        data: JSON.stringify(res),
        redirect: false,
        callbackUrl: `${window.location.origin}/auth`,
      });
      // console.log(data);
      // router.reload();
      // todo reload auth
    } catch (error) {
      console.log("error", error);
      // return showMessage('خطأ في الاتصال', 'error');
    }
  }

  React.useEffect(() => {
    if (status === "authenticated" && window.location.pathname === "/login") {
      router.replace(`/`);
    }
  }, [status]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>البريد الإلكتروني</FormLabel>
              <FormControl>
                <Input placeholder="example@example.com" {...field} />
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
                    className="absolute left-0 top-0 h-full px-3 py-2 text-muted-foreground"
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
        <Button type="submit" className="w-full" disabled={isLoading}>
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
            onClick={() => router.push("/register")}
          >
            إنشاء حساب
          </Button>
        </div>
      </form>
    </Form>
  );
}
