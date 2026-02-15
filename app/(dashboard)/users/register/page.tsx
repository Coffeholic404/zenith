import type { Metadata } from 'next';
import { RegisterForm } from '@/components/register-form';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'تسجيل مستخدم جديد | لوحة التحكم',
  description: 'صفحة تسجيل مستخدم جديد في لوحة التحكم'
};

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">تسجيل مستخدم جديد</h1>
        <p className="text-muted-foreground">أدخل المعلومات المطلوبة لإنشاء حساب جديد</p>
      </div>

      <div className="flex justify-start items-center">
        <div className=" flex-1 lg:max-w-4xl rounded-lg border bg-card p-6 shadow-sm ">
          <RegisterForm />
        </div>
        {/* <div className="hidden md:block">
          <div className="relative h-full w-full overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary"></div>
            <Image
              src="/placeholder.svg?height=600&width=400"
              alt="Register"
              width={400}
              height={600}
              className="h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
              <div className="max-w-md space-y-4 text-center">
                <h2 className="text-3xl font-bold">انضم إلينا اليوم</h2>
                <p className="text-lg">سجل الآن للوصول إلى جميع الميزات والخدمات المتاحة في لوحة التحكم</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-white/20 p-4 backdrop-blur-sm">
                    <div className="text-2xl font-bold">سهولة الاستخدام</div>
                    <div className="text-sm">واجهة بسيطة وسهلة الاستخدام</div>
                  </div>
                  <div className="rounded-lg bg-white/20 p-4 backdrop-blur-sm">
                    <div className="text-2xl font-bold">تحليلات متقدمة</div>
                    <div className="text-sm">رؤى وتحليلات لتحسين أدائك</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
