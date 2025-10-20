"use client"
import React from 'react'
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
import { Separator } from "@/components/ui/separator"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FileUploader from "@/components/utli/file-uploader";
import BirthdayDate from "@/components/pages/employees/add-employe/birthday-date";
import { Select } from 'react-day-picker';
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


const addStudentSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  degree: z.string().min(1, { message: "Degree is required" }),
  bdate: z.string().min(1, "تاريخ الميلاد مطلوب").refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  }, "يجب أن يكون عمر الموظف على الأقل 18 سنة"),
  phone: z.string().min(10, "رقم الهاتف غير صالح"),
  yearsOfServes: z.number().min(0, "عدد سنوات الخبرة غير صالح"),
  nominatedPartyId: z.string().min(1, { message: "الجهة المرشحة مطلوبة" }),
  hight: z.number().min(0, "طول الطالب مطلوب"),
  width: z.number().min(0, "وزن الطالب مطلوب"),
  bodyCondition: z.string().min(1, { message: "Condition is required" }),
  epilepsy: z.boolean(),
  heartDisease: z.boolean(),
  sugar: z.boolean(),
  pressure: z.boolean(),
  notes: z.string().min(1, { message: "Notes are required" }),
  subscriptionTypeId: z.string().min(1, { message: "Subscription type is required" }),
  AttachmentFile: z.instanceof(File, { message: "يرجى تحميل صورة شخصية" }),
})
function AddStudentForm() {

  const form = useForm<z.infer<typeof addStudentSchema>>({
    resolver: zodResolver(addStudentSchema),
  })
  const { formState, handleSubmit, control } = form;
  return (
    <div className=''>
      <Form {...form}>
        <form className='studentForm grid grid-cols-[378px_1fr] gap-8'>
          <Card>
            <CardContent>
              <FileUploader className='border-none shadow-none' control={control} name="AttachmentFile" />
              <Separator className=' my-4 h-px bg-gray-300 rounded-xl' />
              <div className=' space-y-4'>
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="الاسم الثلاثي"
                          className=" bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="degree"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="الشهادة"
                          className=" bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <FormField
                    control={control}
                    name="bdate"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          {/* <Input
                            {...field}
                            type="date"
                            placeholder="تاريخ الميلاد"
                            className=" w-[387px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          /> */}
                          <BirthdayDate   {...field}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="رقم الهاتف"
                          className=" bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="yearsOfServes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="سنوات الخدمة"
                          className=" bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField 
                control={control}
                name='nominatedPartyId'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
              </div>
            </CardContent>
          </Card>
          <Card></Card>
        </form>
      </Form>
    </div>
  )
}

export default AddStudentForm