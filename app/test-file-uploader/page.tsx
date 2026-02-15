'use client';
import { useForm } from 'react-hook-form';
import FileUploader from '@/components/utli/file-uploader';
import { Button } from '@/components/ui/button';

interface FormData {
  profileImage: File | null;
  documentImage: File | null;
}

export default function TestFileUploaderPage() {
  const { control, handleSubmit, watch, reset } = useForm<FormData>({
    defaultValues: {
      profileImage: null,
      documentImage: null
    }
  });

  const onSubmit = (data: FormData) => {
    alert('تم رفع الملفات بنجاح!');
  };

  const profileImage = watch('profileImage');
  const documentImage = watch('documentImage');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">اختبار مكون رفع الملفات</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile Image Uploader */}
        <FileUploader
          control={control}
          name="profileImage"
          title="الصورة الشخصية"
          description="اختر صورة واضحة للموظف (png , jpg)"
          buttonText="اختر صورة شخصية"
          maxSize={5}
          onFileChange={file => console.log('Profile image changed:', file)}
        />

        {/* Document Image Uploader */}
        <FileUploader
          control={control}
          name="documentImage"
          title="صورة الوثيقة"
          description="اختر صورة واضحة للوثيقة (png , jpg , pdf)"
          buttonText="اختر وثيقة"
          accept="image/*,.pdf"
          maxSize={10}
          onFileChange={file => console.log('Document image changed:', file)}
        />

        <div className="flex gap-4">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            إرسال النموذج
          </Button>
          <Button type="button" variant="outline" onClick={() => reset()}>
            إعادة تعيين
          </Button>
        </div>

        {/* Debug Info */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">معلومات التصحيح:</h3>
          <p>الصورة الشخصية: {profileImage?.name || 'لم يتم اختيار ملف'}</p>
          <p>صورة الوثيقة: {documentImage?.name || 'لم يتم اختيار ملف'}</p>
        </div>
      </form>
    </div>
  );
}
