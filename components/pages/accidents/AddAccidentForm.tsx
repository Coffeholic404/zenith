'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { DevTool } from '@hookform/devtools';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { CreateAccidentRequest, useCreateAccidentMutation } from '@/services/accident';
import { useGetCoursesQuery } from '@/services/courses';
import { useGetActivitiesQuery } from '@/services/activity';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useGetEmployeesQuery } from '@/services/employe';
import { useGetCoStTrQuery } from '@/services/CoStTr';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@radix-ui/react-checkbox';
const AddAccidentFormSchema = z.object({
  course: z.string().optional(),
  co_St_TrId: z.string().min(1, {
    message: 'أسم الدورة مطلوب'
  }),
  activityId: z.string().min(1, {
    message: 'أسم النشاط مطلوب'
  }),
  jumperCount: z.number().min(1, {
    message: 'عدد القفزات مطلوب'
  }),
  freefallTime: z.number().min(0, {
    message: 'وقت الخروج من الطائرة مطلوب'
  }),
  freefallAltitude: z.number().min(0, {
    message: 'ارتفاع السقوط الحر مطلوب'
  }),
  deployAltitude: z.number().min(0, {
    message: 'ارتفاع فتح المظلة مطلوب'
  }),
  exitAltitude: z.number().min(0, {
    message: 'ارتفاع الخروج من الطائرة مطلوب'
  }),
  landings: z.string().min(1, {
    message: 'موقع الهبوط مطلوب'
  }),
  typeOfJump: z.string().min(1, {
    message: 'نوع القفزة مطلوب'
  }),
  trainer1Id: z.string().min(1, {
    message: 'معرف المدرب 1 مطلوب'
  }),
  trainer1Note: z.string().optional(),
  trainer2Id: z.string().optional(),
  trainer2Note: z.string().optional(),
  trainer3Id: z.string().optional(),
  trainer3Note: z.string().optional(),
  finalReport: z.string().optional(),
  committeeMembers: z
    .array(
      z.object({
        employeeId: z.string().min(1, {
          message: 'معرف الموظف مطلوب'
        })
      })
    )
    .optional()
});

export default function AddAccidentForm() {
  const router = useRouter();
  const {
    data: courses,
    isLoading: isLoadingCourses,
    isError: isErrorCourses,
    isSuccess: isSuccessCourses
  } = useGetCoursesQuery({
    pageNumber: 1,
    pageSize: 100
  });
  const {
    data: employees,
    isLoading: isLoadingEmployees,
    isError: isErrorEmployees,
    isSuccess: isSuccessEmployees
  } = useGetEmployeesQuery({
    pageNumber: 1,
    pageSize: 100
  });
  const {
    data: coStTr,
    isLoading: isLoadingCoStTr,
    isError: isErrorCoStTr,
    isSuccess: isSuccessCoStTr
  } = useGetCoStTrQuery({
    pageNumber: 1,
    pageSize: 100
  });
  const {
    data: activities,
    isLoading: isLoadingActivities,
    isError: isErrorActivities,
    isSuccess: isSuccessActivities
  } = useGetActivitiesQuery({
    pageNumber: 1,
    pageSize: 100
  });

  let coursesData: any = [];
  if (isSuccessCourses) {
    coursesData = courses?.result?.data?.map(item => ({
      value: item.uniqueID,
      label: item.character
    }));
  }

  let employeesData: any = [];
  if (isSuccessEmployees) {
    employeesData = employees?.result?.data
      .map(item => ({
        value: item.id,
        label: item.name
      }));
  }
  let trainers: any = [];
  if (isSuccessEmployees) {
    trainers = employees?.result?.data
      ?.filter(item => item.employeeTypeName === 'مدرب')
      .map(item => ({
        value: item.id,
        label: item.name
      }));
  }

  const form = useForm<z.infer<typeof AddAccidentFormSchema>>({
    resolver: zodResolver(AddAccidentFormSchema),
    defaultValues: {
      jumperCount: undefined,
      freefallTime: undefined,
      freefallAltitude: undefined,
      deployAltitude: undefined,
      exitAltitude: undefined,
      landings: '',
      typeOfJump: '',
      trainer1Id: undefined,
      trainer1Note: undefined,
      trainer2Id: undefined,
      trainer2Note: undefined,
      trainer3Id: undefined,
      trainer3Note: undefined,
      finalReport: undefined,
      committeeMembers: []
    }
  });

  // Watch the course field to enable/disable student select and populate options
  const selectedCourseId = useWatch({
    control: form.control,
    name: 'course'
  });

  // Watch the activity field to enable/disable student select
  const selectedActivityId = useWatch({
    control: form.control,
    name: 'activityId'
  });

  // Filter activities by selected course
  let activitiesData: any = [];
  if (selectedCourseId && isSuccessActivities) {
    activitiesData = activities?.result?.data
      ?.filter(item => item.courseId === selectedCourseId)
      .map(item => ({
        value: item.uniqueID,
        label: `${item.courseName} - ${item.date}`
      }));
  }

  // Find the selected activity and extract students from its jumpers
  let studentsData: any = [];
  if (selectedActivityId && isSuccessActivities && activities?.result?.data && isSuccessCoStTr) {
    const selectedActivity = activities.result.data.find((activity: any) => activity.uniqueID === selectedActivityId);
    if (selectedActivity && selectedActivity.jumpers && coStTr?.result?.data) {
      studentsData = selectedActivity.jumpers.map((jumper: any) => {
        // Find the matching CoStTr record to get student name
        const coStTrRecord = coStTr.result.data.find((record: any) => record.uniqueID === jumper.co_St_TrId);
        return {
          value: jumper.co_St_TrId,
          label: coStTrRecord?.studentName || jumper.co_St_TrId
        };
      });
    }
  }

  const [
    createAccident,
    { isLoading: isLoadingCreateAccident, isError: isErrorCreateAccident, isSuccess: isSuccessCreateAccident }
  ] = useCreateAccidentMutation();

  // Reset activity and student when course changes
  useEffect(() => {
    form.setValue('activityId', '');
    form.setValue('co_St_TrId', '');
  }, [selectedCourseId, form]);

  // Reset student when activity changes
  useEffect(() => {
    form.setValue('co_St_TrId', '');
  }, [selectedActivityId, form]);

  const onSubmit = async (values: z.infer<typeof AddAccidentFormSchema>) => {
    try {
      // Transform data to match API request format
      const requestData: CreateAccidentRequest = {
        co_St_TrId: values.co_St_TrId,
        activityId: values.activityId,
        jumperCount: Number(values.jumperCount),
        freefallTime: Number(values.freefallTime),
        freefallAltitude: Number(values.freefallAltitude),
        deployAltitude: Number(values.deployAltitude),
        exitAltitude: Number(values.exitAltitude),
        landings: values.landings,
        typeOfJump: values.typeOfJump,
        trainer1Id: values.trainer1Id === 'none' ? '' : values.trainer1Id || '',
        trainer1Note: values.trainer1Note || '',
        trainer2Id: (values.trainer2Id === 'none' || !values.trainer2Id) ? null : values.trainer2Id,
        trainer2Note: values.trainer2Note || null,
        trainer3Id: (values.trainer3Id === 'none' || !values.trainer3Id) ? null : values.trainer3Id,
        trainer3Note: values.trainer3Note || null,
        finalReport: values.finalReport || '',
        committeeMembers: values.committeeMembers || []
      };

      const response = await createAccident(requestData).unwrap();
      console.log(response);

      if (response.isSuccess) {
        toast({
          title: 'تم إضافة الحادث بنجاح',
          description: `تم إنشاء حادث جديد`,
          variant: 'default'
        });
        router.push('/accidents');
      }
    } catch (error: any) {
      console.log(error);

      // Extract error messages from ASP.NET Core validation errors
      let errorMessages: string[] = ['حدث خطأ أثناء إضافة الحادث'];

      if (error?.data?.errors) {
        // Convert errors object to array of messages
        errorMessages = Object.values(error.data.errors).flat() as string[];
      } else if (error?.data?.errorMessages) {
        // Handle custom errorMessages format
        errorMessages = error.data.errorMessages;
      }

      console.log(errorMessages);
      toast({
        title: 'فشل في إضافة الحادث',
        description: errorMessages.join(', '),
        variant: 'destructive'
      });
    }
  };

  return (
    <div>
      <DevTool control={form.control} placement="top-left" />
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-4">
        <div className=" max-w-5xl mx-auto">
          <Card>
            <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
              المعلومات الاساسية
            </CardHeader>
            <CardContent className=" grid grid-cols-2 gap-4">
              <FieldGroup>
                <Controller
                  name="course"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field orientation="responsive" data-invalid={fieldState.invalid}>
                      <Label htmlFor="form-rhf-select-language" className="font-vazirmatn text-[14px]  block">
                        اسم الدورة
                      </Label>
                      <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          id="form-rhf-select-language"
                          aria-invalid={fieldState.invalid}
                          className="char-select min-w-[120px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                          <SelectValue placeholder="اختر الدورة" />
                        </SelectTrigger>
                        <SelectContent>
                          {coursesData.map((option: { value: string; label: string }) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="co_St_TrId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field orientation="responsive" data-invalid={fieldState.invalid}>
                      <Label htmlFor="form-rhf-select-student" className="font-vazirmatn text-[14px] mb-2 block">
                        اسم الطالب
                      </Label>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!selectedActivityId}
                      >
                        <SelectTrigger
                          id="form-rhf-select-student"
                          aria-invalid={fieldState.invalid}
                          disabled={!selectedActivityId}
                          className="char-select min-w-[120px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <SelectValue placeholder={selectedActivityId ? 'اختر الطالب' : 'اختر النشاط أولاً'} />
                        </SelectTrigger>
                        <SelectContent drop-shadow-lg>
                          {studentsData.length > 0 ? (
                            studentsData.map((option: { value: string; label: string }) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-student" disabled>
                              لا يوجد طلاب
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="freefallTime"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Label htmlFor="freefallTime" className="font-vazirmatn text-[14px] mb-2 block">
                        وقت فتح المظلة
                      </Label>
                      <Input
                        {...field}
                        id="freefallTime"
                        type="number"
                        aria-invalid={fieldState.invalid}
                        placeholder="أدخل وقت فتح المظلة"
                        autoComplete="off"
                        onChange={e => field.onChange(e.target.valueAsNumber)}
                        value={field.value || ''}
                        className="  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="landings"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Label htmlFor="landings" className="font-vazirmatn text-[14px] mb-2 block">
                        موقع الهبوط
                      </Label>
                      <Input
                        {...field}
                        id="landings"
                        aria-invalid={fieldState.invalid}
                        placeholder="أدخل موقع الهبوط"
                        autoComplete="off"
                        className="  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="jumperCount"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Label htmlFor="jumperCount" className="font-vazirmatn text-[14px] mb-2 block">
                        عدد القفزات
                      </Label>
                      <Input
                        {...field}
                        id="jumperCount"
                        type="number"
                        aria-invalid={fieldState.invalid}
                        placeholder="أدخل عدد القفزات"
                        autoComplete="off"
                        onChange={e => field.onChange(e.target.valueAsNumber)}
                        value={field.value || ''}
                        className="  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>
              <FieldGroup>
                <Controller
                  name="activityId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field orientation="responsive" data-invalid={fieldState.invalid}>
                      <Label htmlFor="form-rhf-select-activity" className="font-vazirmatn text-[14px] mb-2 block">
                        النشاط
                      </Label>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!selectedCourseId}
                      >
                        <SelectTrigger
                          id="form-rhf-select-activity"
                          aria-invalid={fieldState.invalid}
                          disabled={!selectedCourseId}
                          className="char-select min-w-[120px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <SelectValue placeholder={selectedCourseId ? 'اختر النشاط' : 'اختر الدورة أولاً'} />
                        </SelectTrigger>
                        <SelectContent>
                          {activitiesData.length > 0 ? (
                            activitiesData.map((option: { value: string; label: string }) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-activity" disabled>
                              لا يوجد أنشطة
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="freefallAltitude"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Label htmlFor="freefallAltitude" className="font-vazirmatn text-[14px] mb-2 block">
                        ارتفاع السقوط الحر
                      </Label>
                      <Input
                        {...field}
                        id="freefallAltitude"
                        type="number"
                        aria-invalid={fieldState.invalid}
                        placeholder="أدخل ارتفاع السقوط الحر"
                        autoComplete="off"
                        onChange={e => field.onChange(e.target.valueAsNumber)}
                        value={field.value || ''}
                        className="  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="exitAltitude"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Label htmlFor="exitAltitude" className="font-vazirmatn text-[14px] mb-2 block">
                        ارتفاع الخروج من الطائرة
                      </Label>
                      <Input
                        {...field}
                        id="exitAltitude"
                        type="number"
                        aria-invalid={fieldState.invalid}
                        placeholder="أدخل ارتفاع الخروج من الطائرة"
                        autoComplete="off"
                        onChange={e => field.onChange(e.target.valueAsNumber)}
                        value={field.value || ''}
                        className="  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="typeOfJump"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Label htmlFor="typeOfJump" className="font-vazirmatn text-[14px] mb-2 block">
                        نوع القفز
                      </Label>
                      <Input
                        {...field}
                        id="typeOfJump"
                        aria-invalid={fieldState.invalid}
                        placeholder="أدخل نوع القفز"
                        autoComplete="off"
                        className="  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="deployAltitude"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Label htmlFor="deployAltitude" className="font-vazirmatn text-[14px] mb-2 block">
                        ارتفاع فتح المظلة
                      </Label>
                      <Input
                        {...field}
                        id="deployAltitude"
                        type="number"
                        aria-invalid={fieldState.invalid}
                        placeholder="أدخل ارتفاع فتح المظلة"
                        autoComplete="off"
                        onChange={e => field.onChange(e.target.valueAsNumber)}
                        value={field.value || ''}
                        className="  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-5xl mx-auto">
          <Card>
            <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">المدربين</CardHeader>
            <CardContent className=" grid grid-cols-2 gap-2">
              <Controller
                name="trainer1Id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field orientation="responsive" data-invalid={fieldState.invalid} className="col-start-1">
                    <Label htmlFor="trainer1Id" className="font-vazirmatn text-[14px]  block">
                      المدرب 1
                    </Label>
                    <Select value={field.value || ''} onValueChange={value => field.onChange(value)}>
                      <SelectTrigger
                        id="trainer1Id"
                        className="char-select  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                      >
                        <SelectValue placeholder="اختر المدرب 1" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">اختر مدرب</SelectItem>
                        {trainers.map((option: { value: string; label: string }) => (
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
                name="trainer1Note"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="col-start-2 row-start-1">
                    <Label htmlFor="trainer1Note" className="font-vazirmatn text-[14px]  block">
                      ملاحظات المدرب 1
                    </Label>
                    <Input
                      {...field}
                      id="trainer1Note"
                      aria-invalid={fieldState.invalid}
                      placeholder="أدخل ملاحظات المدرب 1"
                      autoComplete="off"
                      className="  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </Field>
                )}
              />

              <Controller
                name="trainer2Id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field orientation="responsive" data-invalid={fieldState.invalid} className="col-start-1">
                    <Label htmlFor="trainer2Id" className="font-vazirmatn text-[14px]  block">
                      المدرب 2
                    </Label>
                    <Select value={field.value || ''} onValueChange={value => field.onChange(value)}>
                      <SelectTrigger
                        id="trainer2Id"
                        className="char-select  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                      >
                        <SelectValue placeholder="اختر المدرب 2" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">بدون مدرب</SelectItem>
                        {trainers.map((option: { value: string; label: string }) => (
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
                name="trainer2Note"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="col-start-2 row-start-2">
                    <Label htmlFor="trainer2Note" className="font-vazirmatn text-[14px]  block">
                      ملاحظات المدرب 2
                    </Label>
                    <Input
                      {...field}
                      id="trainer2Note"
                      aria-invalid={fieldState.invalid}
                      placeholder="أدخل ملاحظات المدرب 2"
                      autoComplete="off"
                      className="  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </Field>
                )}
              />

              <Controller
                name="trainer3Id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field orientation="responsive" data-invalid={fieldState.invalid} className="col-start-1">
                    <Label htmlFor="trainer3Id" className="font-vazirmatn text-[14px]  block">
                      المدرب 3
                    </Label>
                    <Select value={field.value || ''} onValueChange={value => field.onChange(value)}>
                      <SelectTrigger
                        id="trainer3Id"
                        className="char-select  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                      >
                        <SelectValue placeholder="اختر المدرب 3" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">بدون مدرب</SelectItem>
                        {trainers.map((option: { value: string; label: string }) => (
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
                name="trainer3Note"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="col-start-2 row-start-3">
                    <Label htmlFor="trainer3Note" className="font-vazirmatn text-[14px]  block">
                      ملاحظات المدرب 3
                    </Label>
                    <Input
                      {...field}
                      id="trainer3Note"
                      aria-invalid={fieldState.invalid}
                      placeholder="أدخل ملاحظات المدرب 3"
                      autoComplete="off"
                      className="  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </Field>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className=" max-w-5xl mx-auto">
          <Card className=" p-4">
            <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
              لجنة الحوادث
            </CardHeader>
            <CardContent className=" bg-searchBg p-4 rounded-xl">
              <Controller
                name="committeeMembers"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="space-y-2 ">
                    {
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {employeesData.map((commission: any) => (
                          <div key={commission.value} className="flex items-center space-x-2 space-x-reverse py-2">
                            <FieldGroup data-slot="checkbox-group">
                              <Field orientation="horizontal">
                                <Checkbox
                                  id={`commission-${commission.value}`}
                                  checked={field.value?.some(member => member.employeeId === commission.value) || false}
                                  onCheckedChange={checked => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      // Add employee to array if not already present
                                      if (!currentValues.some(member => member.employeeId === commission.value)) {
                                        field.onChange([...currentValues, { employeeId: commission.value }]);
                                      }
                                    } else {
                                      // Remove employee from array
                                      field.onChange(
                                        currentValues.filter(member => member.employeeId !== commission.value)
                                      );
                                    }
                                  }}
                                  className="size-5 rounded-sm border-2 border-[#A3A2AA] data-[state=checked]:bg-sidebaractive"
                                />
                                <FieldLabel htmlFor="form-rhf-checkbox-responses" className="font-normal">
                                  {commission.label}
                                </FieldLabel>
                              </Field>
                            </FieldGroup>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </div>
                        ))}
                      </div>
                    }
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className=" max-w-5xl mx-auto">
          <Card className=" space-y-2">
            <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
              تقرير الحادث
            </CardHeader>
            <CardContent>
              <Controller
                name="finalReport"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Label htmlFor="form-rhf-textarea-about" className="font-vazirmatn text-[14px]  block">
                      التقرير النهائي
                    </Label>
                    <Textarea
                      {...field}
                      id="form-rhf-textarea-about"
                      aria-invalid={fieldState.invalid}
                      placeholder="أدخل التقرير النهائي للحادث"
                      className="min-h-[120px] bg-searchBg"
                    />

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </CardContent>
          </Card>
        </div>
        <div className=" flex items-center justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.back()} className=" w-[118px] text-[14px]">
            إلغاء
          </Button>
          <Button
            type="submit"
            disabled={isLoadingCreateAccident}
            className=" w-[225px] bg-sidebaractive text-white  text-[14px]"
          >
            إضافة الحادث
          </Button>
        </div>
      </form>
    </div>
  );
}
