'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, UserCog, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRegisterMutation } from '@/services/account';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  username: z.string().min(3, {
    message: 'اسم المستخدم يجب أن يكون على الأقل 3 أحرف.'
  }),
  email: z.string().email({
    message: 'يرجى إدخال بريد إلكتروني صحيح.'
  }),
  firstName: z.string().min(2, {
    message: 'الاسم الأول يجب أن يكون على الأقل حرفين.'
  }),
  lastName: z.string().min(2, {
    message: 'اسم العائلة يجب أن يكون على الأقل حرفين.'
  }),
  password: z.string().min(6, {
    message: 'كلمة المرور يجب أن تكون على الأقل 6 أحرف.'
  }),
  role: z.string().refine(val => val === 'User' || val === 'Admin', {
    message: 'يرجى اختيار نوع الحساب.'
  })
});

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [register, { isLoading }] = useRegisterMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      role: 'User'
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await register({
        username: values.username,
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        role: values.role
      }).unwrap();

      if (!res.isSuccess) {
        const errorMessage = res.errorMessages?.join(', ') || 'فشل إنشاء الحساب';
        toast.error(errorMessage);
        return;
      }

      toast.success('تم إنشاء الحساب بنجاح');
      router.push('/users');
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage =
        error?.data?.errorMessages?.join(', ') || error?.message || 'خطأ في الاتصال، يرجى المحاولة مرة أخرى';
      toast.error(errorMessage);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 font-vazirmatn">
        {/* Role Toggle */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نوع الحساب</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => field.onChange('User')}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all duration-200',
                      field.value === 'User'
                        ? 'border-sidebaractive bg-sidebaractive/10 text-sidebaractive'
                        : 'border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/50'
                    )}
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">مستخدم</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => field.onChange('Admin')}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all duration-200',
                      field.value === 'Admin'
                        ? 'border-sidebaractive bg-sidebaractive/10 text-sidebaractive'
                        : 'border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/50'
                    )}
                  >
                    <UserCog className="h-5 w-5" />
                    <span className="font-medium">مسؤول</span>
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Two column layout for names */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم الأول</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل الاسم الأول" {...field} className="font-vazirmatn text-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم العائلة</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل اسم العائلة" {...field} className="font-vazirmatn text-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم المستخدم</FormLabel>
              <FormControl>
                <Input placeholder="أدخل اسم المستخدم" {...field} className="font-vazirmatn text-sm" />
              </FormControl>
              <FormDescription>سيستخدم هذا الاسم لتسجيل الدخول.</FormDescription>
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
                <Input placeholder="example@example.com" type="email" {...field} className="font-vazirmatn text-sm" />
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
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...field}
                    className="font-vazirmatn text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-0 top-0 h-full px-3 py-2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}</span>
                  </Button>
                </div>
              </FormControl>
              <FormDescription>يجب أن تكون كلمة المرور على الأقل 6 أحرف.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-sidebaractive hover:bg-sidebaractive" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              جاري إنشاء الحساب...
            </>
          ) : (
            'إنشاء حساب'
          )}
        </Button>

        <div className="text-center text-sm">
          لديك حساب بالفعل؟{' '}
          <Button variant="link" className="px-0 font-normal" type="button" onClick={() => router.push('/login')}>
            تسجيل الدخول
          </Button>
        </div>
      </form>
    </Form>
  );
}
