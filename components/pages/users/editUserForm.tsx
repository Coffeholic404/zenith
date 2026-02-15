'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useGetUserByIdQuery, useUpdateUserMutation } from '@/services/users';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

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
  })
});

export function EditUserForm({ userId }: { userId: string }) {
  const router = useRouter();

  // Fetch user data
  const { data: userResponse, isLoading: isLoadingUser, isError: isErrorUser } = useGetUserByIdQuery({ id: userId });

  // Update mutation
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      firstName: '',
      lastName: ''
    }
  });

  // Prefill form with user data when loaded
  React.useEffect(() => {
    if (userResponse?.isSuccess && userResponse.result) {
      const user = userResponse.result;
      form.reset({
        username: user.userName || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      });
    }
  }, [userResponse, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await updateUser({
        id: userId,
        userName: values.username,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName
      }).unwrap();

      if (response.isSuccess) {
        toast({
          title: 'تم تحديث المستخدم بنجاح',
          description: 'تم تحديث بيانات المستخدم',
          variant: 'default'
        });
        router.push('/users');
      } else {
        toast({
          title: 'فشل في تحديث المستخدم',
          description: response.errorMessages.join(', '),
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      // Extract error messages from ASP.NET Core validation errors
      let errorMessages: string[] = ['حدث خطأ أثناء تحديث المستخدم'];

      if (error?.data?.errors) {
        // Convert errors object to array of messages
        errorMessages = Object.values(error.data.errors).flat() as string[];
      } else if (error?.data?.errorMessages) {
        // Handle custom errorMessages format
        errorMessages = error.data.errorMessages;
      }

      toast({
        title: 'فشل في تحديث المستخدم',
        description: errorMessages.join(', '),
        variant: 'destructive'
      });
    }
  }

  // Error state
  if (isErrorUser) {
    return (
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardContent className="py-8 text-center font-vazirmatn">
            <p className="text-deleteTxt">حدث خطأ أثناء تحميل بيانات المستخدم</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              إعادة المحاولة
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (isLoadingUser) {
    return (
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Card>
        <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
          تعديل بيانات المستخدم
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-vazirmatn text-[14px] block">اسم المستخدم</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="أدخل اسم المستخدم"
                        {...field}
                        className="bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
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
                    <FormLabel className="font-vazirmatn text-[14px] block">البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@example.com"
                        type="email"
                        {...field}
                        className="bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-vazirmatn text-[14px] block">الاسم الأول</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل الاسم الأول"
                          {...field}
                          className="bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
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
                      <FormLabel className="font-vazirmatn text-[14px] block">اسم العائلة</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل اسم العائلة"
                          {...field}
                          className="bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.push('/users')}
                  className="w-[118px] text-[14px]"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="w-[225px] bg-sidebaractive text-white text-[14px] hover:bg-sidebaractive hover:brightness-110"
                >
                  {isUpdating ? 'جاري التحديث...' : 'تحديث المستخدم'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
