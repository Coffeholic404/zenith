"use client"
import React, { useState } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { Check, ChevronsUpDown, Plus, X, Upload, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";

const addCoursesSchema = z.object({
  character: z.string().min(1, { message: "يجب إدخال الحرف" }),
  courseType: z.string().min(1, { message: "يجب إدخال نوع الدورة" }),
  startDate: z.string().min(1, { message: "يجب إدخال تاريخ بداية الدورة" }),
  endDate: z.string().min(1, { message: "يجب إدخال تاريخ نهاية الدورة" }),
  trainer: z.string().min(1, { message: "يجب إدخال المدرب" }),
})

export default function AddCoursesForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const form = useForm<z.infer<typeof addCoursesSchema>>({
    resolver: zodResolver(addCoursesSchema),
    defaultValues: {
      character: "",
      courseType: "",
      startDate: "",
      endDate: "",
      trainer: "",
    },
  })
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const onSubmit = handleSubmit((data) => console.log(data))

  return (
    <div className='  scroll-smooth'>
      <Form  {...form}>
        <form className=' grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-4'>
          <div className=' space-y-4' id='Basic information'>
            <Card>
              <CardHeader className=" font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
                المعلومات الجسدية
              </CardHeader>
              <CardContent className=' space-y-4'>
                <div className='w-full flex flex-col sm:flex-row items-center justify-center gap-2 '>
                  <div className=' flex-1 w-full'>
                    <FormField
                      control={control}
                      name="character"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="حرف الدورة"
                              className=" bg-searchBg rounded-xl w-full  font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='flex-1 w-full'>
                    <FormField
                      control={control}
                      name="courseType"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="w-full justify-between bg-searchBg rounded-xl font-vazirmatn font-normal border-none hover:bg-searchBg focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                                <SelectValue placeholder="نوع الدورة" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="thin">نحيف</SelectItem>
                                <SelectItem value="average">متوسط</SelectItem>
                                <SelectItem value="obese">بدين</SelectItem>
                                <SelectItem value="athletic">رياضي</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="تاريخ البدء"
                          className=" bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className=' px-4 py-3' id='trainer'>
              <CardContent className=' p-0 space-y-4'>
                <FormField
                  control={control}
                  name="trainer"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="w-full justify-between bg-searchBg rounded-xl font-vazirmatn font-normal border-none hover:bg-searchBg focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <SelectValue placeholder="أختر المدرب" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="thin">نحيف</SelectItem>
                            <SelectItem value="average">متوسط</SelectItem>
                            <SelectItem value="obese">بدين</SelectItem>
                            <SelectItem value="athletic">رياضي</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className=' font-vazirmatn flex items-center justify-between'>
                  <p className=' text-collapsTxtClr'>اسم المدرب المختار </p>
                  <Button variant="outline" className=" btn-border-clr bg-[#8870E733]/20 font-vazirmatn font-normal text-md text-sidebaractive py-1 px-6 h-9 hover:bg-[#8870E733]/40">أضافة</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div></div>
        </form>
      </Form>
    </div>
  )


};
