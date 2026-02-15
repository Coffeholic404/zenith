import type { Metadata } from 'next';
import { LoginForm } from '@/components/pages/login/login-form';
import '../../globals.css';

export const metadata: Metadata = {
  title: 'تسجيل الدخول | لوحة التحكم',
  description: 'صفحة تسجيل الدخول إلى لوحة التحكم'
};

export default function LoginPage() {
  return (
    <div className="flex h-[100vh] w-full flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-4 md:p-8">
      <div className="grid   max-w-[1200px] grid-cols-1 overflow-hidden rounded-xl border bg-background shadow-lg  ">
        <div className="flex flex-col items-center justify-center p-8 md:p-12">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-3xl font-bold">مرحبًا بك</h1>
              <p className="text-sm text-muted-foreground">أدخل بريدك الإلكتروني وكلمة المرور للدخول إلى حسابك</p>
            </div>
            <LoginForm />
          </div>
        </div>
        {/* <div className="relative hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary"></div>
          <Image
            src="/placeholder.svg?height=800&width=600"
            alt="Login"
            width={600}
            height={800}
            className="h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
            <div className="max-w-md space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">لوحة تحكم متكاملة</h2>
                <p className="text-lg">إدارة مشروعك بكفاءة عالية مع واجهة مستخدم حديثة وسهلة الاستخدام</p>
              </div>
              <div className="flex justify-center space-x-4 space-x-reverse rtl:space-x-reverse">
                <div className="rounded-lg bg-white/20 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">+500</div>
                  <div className="text-sm">مستخدم نشط</div>
                </div>
                <div className="rounded-lg bg-white/20 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">+1000</div>
                  <div className="text-sm">معاملة يوميًا</div>
                </div>
                <div className="rounded-lg bg-white/20 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">99.9%</div>
                  <div className="text-sm">وقت التشغيل</div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
