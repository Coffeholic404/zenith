"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, Form, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import BirthdayDate from "@/components/pages/employees/add-employe/birthday-date";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import trash from "@/public/employees/TrashBin.svg"
import Image from "next/image"

const AddActivitiesFormSchema = z.object({
  character: z.string().min(1, {
    message: "حرف الدورة مطلوب",
  }),
  courseType: z.string().min(1, {
    message: "نوع الدورة مطلوب",
  }),
  plane: z.string().min(1, {
    message: "نوع الطائرة مطلوب",
  }),
  location: z.string().min(1, {
    message: "موقع الدورة مطلوب",
  }),
  startDate: z.string().min(1, {
    message: "تاريخ بداية النشاط مطلوب",
  }),
  windSpeed: z.string().min(1, {
    message: "سرعة الرياح مطلوبة",
  }),
  time: z.string().min(1, {
    message: "وقت النشاط مطلوب",
  }),
  student: z.string().min(1, {
    message: " الطالب مطلوب",
  }),
  trainers: z.array(z.string()).min(1, {
    message: "مدرب واحد على الأقل مطلوب",
  }),
  notes: z.string().min(1, {
    message: "ملاحظات مطلوبة",
  }),
  jumpCount: z.string().min(1, {
    message: "عدد القفزات مطلوب",
  }),
  landingLocation: z.string().min(1, {
    message: "موقع الهبوط مطلوب",
  }),
  jumpType: z.string().min(1, {
    message: "نوع القفزة مطلوب",
  }),
  freeFallTime: z.string().min(1, {
    message: "وقت السقوط الحر مطلوب",
  }),
  parachuteOpiningTime: z.string().min(1, {
    message: "وقت فتح المظلة مطلوب",
  }),
  parachuteOpinignHeight: z.string().min(1, {
    message: "ارتفاع فتح المظلة مطلوب",
  }),
  planeExitHeight: z.string().min(1, {
    message: "ارتفاع الخروج من الطائرة مطلوب",
  }),
})

export default function AddActivitiesForm() {
  const form = useForm<z.infer<typeof AddActivitiesFormSchema>>({
    resolver: zodResolver(AddActivitiesFormSchema),
    defaultValues: {
      character: "",
      courseType: "",
      plane: "",
      location: "",
      startDate: "",
      windSpeed: "",
      time: "",
      student: "",
      trainers: [],
      notes: "",
      jumpCount: "",
      landingLocation: "",
      jumpType: "",
      freeFallTime: "",
      parachuteOpiningTime: "",
      parachuteOpinignHeight: "",
      planeExitHeight: "",
    }
  })

  const selectOptions = [
    {
      label: "الدورة الأولى",
      value: "firstCourse",
    },
    {
      label: "الدورة الثانية",
      value: "secondCourse",
    },
  ]

  return (
    <div >
      <form className="grid grid-cols-1 lg:grid-cols-[378px_1fr] gap-4 lg:gap-8">
        <div className="" id="basic-info">
          <Card>
            <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
              المعلومات الاساسية
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Controller
                  name="character"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field orientation="responsive" data-invalid={fieldState.invalid}>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="form-rhf-select-language"
                          aria-invalid={fieldState.invalid}
                          className="char-select min-w-[120px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                          <SelectValue placeholder="حرف الدورة" />
                        </SelectTrigger>
                        <SelectContent >
                          {selectOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                <Controller
                  name="courseType"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field orientation="responsive" data-invalid={fieldState.invalid}>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="form-rhf-select-language"
                          aria-invalid={fieldState.invalid}
                          className="char-select min-w-[120px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                          <SelectValue placeholder="نوع الدورة" />
                        </SelectTrigger>
                        <SelectContent >
                          {selectOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                <Controller
                  name="plane"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field orientation="responsive" data-invalid={fieldState.invalid}>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="form-rhf-select-language"
                          aria-invalid={fieldState.invalid}
                          className="char-select min-w-[120px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                          <SelectValue placeholder="الطائرة" />
                        </SelectTrigger>
                        <SelectContent >
                          {selectOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                <Controller
                  name="location"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field orientation="responsive" data-invalid={fieldState.invalid}>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="form-rhf-select-language"
                          aria-invalid={fieldState.invalid}
                          className="char-select min-w-[120px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                          <SelectValue placeholder="المكان" />
                        </SelectTrigger>
                        <SelectContent >
                          {selectOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                <Controller
                  name="startDate"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field orientation="responsive" data-invalid={fieldState.invalid}>
                      <BirthdayDate
                        {...field}
                        placeholder="تاريخ البدء"
                      />
                    </Field>
                  )}
                />

                <Controller
                  name="windSpeed"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="سرعة الرياح "
                        autoComplete="off"
                        className="  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="time"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field orientation="responsive" data-invalid={fieldState.invalid} className=" relative">

                      <Input
                        type="time"
                        id="time-picker"
                        step="1"
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="وقت الدورة"
                        autoComplete="off"
                        className="  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none relative"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                      <Label htmlFor="time-picker" className="px-1 absolute top-3 right-2 text-subtext font-vazirmatn font-normal">
                        الوقت
                      </Label>
                    </Field>
                  )}
                />
              </FieldGroup>
              <Separator className="my-4" />
              {/* Trainers Table */}
              <div className='mt-4 space-y-4' id="trainers-table">
                <div className='bg-trainerTableBg rounded-xl px-4 py-2 flex items-center gap-36 font-vazirmatn text-sm'>
                  <span className=' text-trainerTableHeaderTxt text-[15px]'>اسم المدرب</span>
                  <span className='w-10'></span>
                </div>
                <div
                  className={cn(
                    'bg- px-4 py-3 flex items-center justify-between rounded-xl hover:bg-searchBg font-vazirmatn text-sm  border-searchBg cursor-pointer transition-colors'
                  )}
                >
                  <div className=' flex items-center gap-40'>
                    <span className=' text-collapsTxtClr text-[17px]'>name</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className='w-10 h-8 p-0 hover:bg-transparent'
                  >
                    <Image src={trash} alt="trash" className="w-4 h-4 text-deleteTxt" />
                  </Button>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>

        <div id="student-info">
          <Card className=" ">
            <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
              معلومات الطلاب
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className=" w-full flex">
                  <Controller
                    name="student"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field orientation="responsive" data-invalid={fieldState.invalid}>
                        <Select
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            id="form-rhf-select-language"
                            aria-invalid={fieldState.invalid}
                            className="char-select max-w-[320px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          >
                            <SelectValue placeholder="حرف الدورة" />
                          </SelectTrigger>
                          <SelectContent >
                            {selectOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  />
                  <div className=" bg-badgeClr w-[7.5rem] h-11 rounded-md font-vazirmatn flex items-center justify-center">
                    <p id="student-code" className=" text-sidebaractive">RG</p>
                  </div>
                </div>
                <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
                  المدربون
                </CardHeader>
                <div className=" w-full grid grid-cols-2 gap-4">
                  {[1, 2, 3].map((index) => (
                    <Controller
                      key={index}

                      name={`trainers.${index}`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field orientation="responsive" data-invalid={fieldState.invalid} className="col-start-1">
                          <Select
                            value={field.value || ""}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger
                              className="char-select max-w-[317px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                            >
                              <SelectValue placeholder={`Trainer ${index + 1}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {selectOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                      )}
                    />
                  ))}

                  {
                    [1, 2, 3].map((index) => (
                      <Controller
                        key={index}
                        name="notes"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid} className={`col-start-2 row-start-${index}`}>
                            <Input
                              {...field}
                              aria-invalid={fieldState.invalid}
                              placeholder="ملاحظات"
                              autoComplete="off"
                              className="  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    ))
                  }
                </div>

                <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
                  معلومات أساسية
                </CardHeader>
                <div className=" w-full grid grid-cols-2 gap-4">
                  <Controller
                    name="jumpCount"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="col-start-1 block">
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="عدد القفزات"
                          autoComplete="off"
                          className="  bg-searchBg max-w-[311px] rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="jumpType"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="col-start-1 block">
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="نوع القفز"
                          autoComplete="off"
                          className="  bg-searchBg max-w-[311px] rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="parachuteOpiningTime"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="col-start-1 block">
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="وقت فتح المظلة"
                          autoComplete="off"
                          className="  bg-searchBg max-w-[311px] rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="parachuteOpinignHeight"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="col-start-1 block">
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="ارتفاع فتح المظلة"
                          autoComplete="off"
                          className="  bg-searchBg max-w-[311px] rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="landingLocation"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="col-start-2 row-start-1 block">
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="موقع الهبوط"
                          autoComplete="off"
                          className="  bg-searchBg max-w-[311px]  rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="freeFallTime"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="col-start-2 row-start-2 block">
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="وقت السقوط الحر"
                          autoComplete="off"
                          className="  bg-searchBg max-w-[311px] rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="planeExitHeight"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="col-start-2 row-start-3 block">
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="ارتفاع الخروج من الطائرة"
                          autoComplete="off"
                          className="  bg-searchBg max-w-[311px] rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
                <Button className=" bg-sidebaractive">أضافة الطالب</Button>
              </FieldGroup>
            </CardContent>
          </Card>
              <div className="flex justify-end items-center gap-4 py-4 font-vazirmatn">
                <Button variant="outline" className=" w-[118px] text-[14px]">الغاء</Button>
                <Button className=" w-[225px] bg-sidebaractive text-white  text-[14px]">حفظ و انهاء الاضافة</Button>
              </div>
        </div>
      </form>
    </div>
  )
}
