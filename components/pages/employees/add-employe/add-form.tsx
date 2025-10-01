"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FileUploader from "@/components/utli/file-uploader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const addEmployeeSchema = z.object({
  AttachmentFile: z.instanceof(File, { message: "يرجى تحميل صورة شخصية" }),
  Name: z.string().min(1, "الاسم الثلاثي مطلوب"),
  BirthDate: z.number().int().min(18, "يجب أن يكون عمر الموظف على الأقل 18 سنة"),
  Phone : z.string().min(10, "رقم الهاتف غير صالح"),
  JobTitle: z.string().min(1, "عنوان الوظيفة مطلوب"),
  Character: z.string().min(1, "  رمز المدرب مطلوب").optional(),
  LicenseNumber: z.string().min(1, "رقم رخصة القيادة مطلوب").optional(),
  TypeOfTraining: z.string().min(1, "نوع التدريب مطلوب").optional(),
});

export default function AddForm() {
  const pathname = usePathname();
  const [isTrainer, setIsTrainer] = useState(false);

  useEffect(() => {
    // Check if the URL contains 'add-trainer' in its path
    if (pathname.includes('add-trainer')) {
      setIsTrainer(true);
    } else {
      setIsTrainer(false);
    }
  }, [pathname]);

  function onSubmit(values: z.infer<typeof addEmployeeSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  const form = useForm<z.infer<typeof addEmployeeSchema>>({
    resolver: zodResolver(addEmployeeSchema),
    defaultValues: {
      AttachmentFile: null!!,
      Name: "",
      BirthDate: undefined,
      Phone: "",
      JobTitle: "",
    },
  });

  const { formState, handleSubmit, control } = form;

  return (
    <div className=" space-y-6">
      <FileUploader control={control} name="AttachmentFile" />

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className=" space-y-6">
          <Card className=" max-w-[830px]">
            <CardHeader className=" font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
              المعلومات الشخصية
            </CardHeader>
            <CardContent>
              <div className=" flex flex-wrap gap-x-1 gap-y-4">
                <FormField
                  control={control}
                  name="Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="الاسم الثلاثي"
                          className=" w-[387px]  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="BirthDate"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem >
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="العمر"
                          value={value || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            onChange(val === "" ? undefined : Number(val));
                          }}
                          className=" w-[387px]  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="Phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="رقم الهاتف"
                          className=" w-[387px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="JobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="عنوان وظيفي"
                          className=" w-[387px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {isTrainer && (
            <Card className=" max-w-[830px]">
              <CardHeader className=" font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
                معلومات المدرب
              </CardHeader>
              <CardContent>
                <div className=" flex flex-wrap gap-x-1 gap-y-4">
                  <FormField
                    control={control}
                    name="Character"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="رمز المدرب"
                            className=" w-[387px]  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="LicenseNumber"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem >
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="رقم رخصة المدرب"
                            value={value || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              onChange(val === "" ? undefined : Number(val));
                            }}
                            className=" w-[387px]  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="TypeOfTraining"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="نوع التدريب"
                            className=" w-[387px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}
          <div className="max-w-[830px] flex justify-end gap-4">
            <Button
              variant="ghost"
              className=" px-12 border rounded-[11px] border-cancelBtnTxt text-subtext font-vazirmatn font-normal text-[17px]"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              className=" px-12 rounded-[11px] bg-sidebaractive text-white font-vazirmatn font-normal text-[17px]"
            >
              حفظ
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
