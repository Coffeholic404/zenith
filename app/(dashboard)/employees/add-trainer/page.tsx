import AddForm from '@/components/pages/employees/add-employe/add-form';
import Image from 'next/image';
import userplus from '@/public/add-employe/UserPlus.svg';

export default function AddTrainer() {
  return (
    <section className="w-full h-full  px-20 space-y-8">
      <header className=" flex items-center gap-3 max-w-[334px]">
        <div className=" size-12 bg-sidebaractive flex items-center justify-center rounded-md">
          <Image src={userplus} alt="userplus" className=" size-8" />
        </div>
        <div className=" space-y-0.5">
          <h2 className=" font-vazirmatn font-extrabold text-lg text-black">إضافة مدرب جديد</h2>
          <p className=" font-vazirmatn font-medium text-sm text-subtext">
            املا البيانات التالي لإضافة مدرب جديد الى النظام
          </p>
        </div>
      </header>
      <AddForm type="trainer" />
    </section>
  );
}
