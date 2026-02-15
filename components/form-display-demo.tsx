'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Steps, Step } from '@/components/ui/steps';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Combobox } from '@/components/ui/combobox';
import { Switch } from '@/components/ui/switch';
import { DatePickerDemo } from '@/components/forms/date-picker';
import { TimePickerDemo } from '@/components/forms/time-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { useGetTest2Query } from '@/services/test';

const formSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(2, {
      message: 'الاسم الأول يجب أن يكون على الأقل حرفين.'
    }),
    lastName: z.string().min(2, {
      message: 'الاسم الأخير يجب أن يكون على الأقل حرفين.'
    }),
    email: z.string().email({
      message: 'يرجى إدخال بريد إلكتروني صحيح.'
    }),
    phone: z.string().min(10, {
      message: 'رقم الهاتف يجب أن يكون على الأقل 10 أرقام.'
    })
  }),
  addressInfo: z.object({
    address: z.string().min(5, {
      message: 'العنوان يجب أن يكون على الأقل 5 أحرف.'
    }),
    city: z.string().min(2, {
      message: 'المدينة يجب أن تكون على الأقل حرفين.'
    }),
    country: z.string({
      required_error: 'يرجى اختيار الدولة.'
    }),
    postalCode: z.string().min(5, {
      message: 'الرمز البريدي يجب أن يكون على الأقل 5 أحرف.'
    })
  }),
  accountInfo: z.object({
    username: z.string().min(3, {
      message: 'اسم المستخدم يجب أن يكون على الأقل 3 أحرف.'
    }),
    bio: z
      .string()
      .max(160, {
        message: 'السيرة الذاتية يجب أن تكون أقل من 160 حرفًا.'
      })
      .optional(),
    birthDate: z.date({
      required_error: 'يرجى اختيار تاريخ الميلاد.'
    }),
    appointmentTime: z.string({
      required_error: 'يرجى اختيار وقت الموعد.'
    }),
    gender: z.enum(['male', 'female', 'other'], {
      required_error: 'يرجى اختيار الجنس.'
    })
  }),
  preferences: z.object({
    notifications: z.boolean().default(false),
    newsletter: z.boolean().default(false),
    acceptTerms: z.boolean().refine(val => val === true, {
      message: 'يجب الموافقة على الشروط والأحكام.'
    })
  })
});

const countryOptions = [
  { value: 'sa', label: 'المملكة العربية السعودية' },
  { value: 'ae', label: 'الإمارات العربية المتحدة' },
  { value: 'eg', label: 'مصر' },
  { value: 'jo', label: 'الأردن' },
  { value: 'kw', label: 'الكويت' },
  { value: 'bh', label: 'البحرين' },
  { value: 'qa', label: 'قطر' },
  { value: 'om', label: 'عمان' },
  { value: 'lb', label: 'لبنان' },
  { value: 'sy', label: 'سوريا' }
];

export function FormDisplayDemo() {
  const [displayMode, setDisplayMode] = React.useState<'regular' | 'steps'>('regular');
  const [currentStep, setCurrentStep] = React.useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      },
      addressInfo: {
        address: '',
        city: '',
        country: '',
        postalCode: ''
      },
      accountInfo: {
        username: '',
        bio: '',
        gender: undefined
      },
      preferences: {
        notifications: false,
        newsletter: false,
        acceptTerms: false
      }
    }
  });

  const steps = [
    {
      id: 'step-1',
      name: 'المعلومات الشخصية',
      fields: ['personalInfo.firstName', 'personalInfo.lastName', 'personalInfo.email', 'personalInfo.phone']
    },
    {
      id: 'step-2',
      name: 'معلومات العنوان',
      fields: ['addressInfo.address', 'addressInfo.city', 'addressInfo.country', 'addressInfo.postalCode']
    },
    {
      id: 'step-3',
      name: 'معلومات الحساب',
      fields: [
        'accountInfo.username',
        'accountInfo.bio',
        'accountInfo.birthDate',
        'accountInfo.appointmentTime',
        'accountInfo.gender'
      ]
    },
    {
      id: 'step-4',
      name: 'التفضيلات',
      fields: ['preferences.notifications', 'preferences.newsletter', 'preferences.acceptTerms']
    }
  ];

  // Check if the current step is valid
  const checkStepValidity = async (step: number) => {
    const fields = steps[step].fields;
    const result = await form.trigger(fields as any);
    return result;
  };

  // Go to the next step
  const handleNext = async () => {
    const isValid = await checkStepValidity(currentStep);
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Go to the previous step
  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    alert('تم إرسال النموذج بنجاح!');
  }
  const { isFetching, data } = useGetTest2Query({});
  const recordsData = Array.isArray(data) ? data : [];
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>نموذج المعلومات</CardTitle>
            <CardDescription>أدخل معلوماتك الشخصية والعنوان وتفضيلاتك</CardDescription>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
            <span className="text-sm text-muted-foreground">عادي</span>
            <Switch
              checked={displayMode === 'steps'}
              onCheckedChange={checked => setDisplayMode(checked ? 'steps' : 'regular')}
            />
            <span className="text-sm text-muted-foreground">خطوات</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {displayMode === 'steps' && (
          <div className="mb-8">
            <Steps currentStep={currentStep}>
              {steps.map((step, index) => (
                <Step key={step.id} title={step.name} />
              ))}
            </Steps>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {displayMode === 'regular' ? (
              <>
                {/* Regular Form Display - All sections at once */}
                <div className="space-y-8">
                  {/* Personal Information Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">المعلومات الشخصية</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="personalInfo.firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الاسم الأول</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل الاسم الأول" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="personalInfo.lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الاسم الأخير</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل الاسم الأخير" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="personalInfo.email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>البريد الإلكتروني</FormLabel>
                            <FormControl>
                              <Input placeholder="example@example.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="personalInfo.phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>رقم الهاتف</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل رقم الهاتف" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Address Information Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">معلومات العنوان</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="addressInfo.address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>العنوان</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل العنوان" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="addressInfo.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>المدينة</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل المدينة" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="addressInfo.country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الدولة</FormLabel>
                            <FormControl>
                              <Combobox
                                options={countryOptions}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="اختر الدولة"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="addressInfo.postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الرمز البريدي</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل الرمز البريدي" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Account Information Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">معلومات الحساب</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="accountInfo.username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اسم المستخدم</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل اسم المستخدم" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="accountInfo.bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>السيرة الذاتية</FormLabel>
                            <FormControl>
                              <Textarea placeholder="اكتب نبذة عنك..." className="resize-none" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="accountInfo.birthDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>تاريخ الميلاد</FormLabel>
                            <FormControl>
                              <DatePickerDemo
                                date={field.value}
                                setDate={field.onChange}
                                type="full"
                                placeholder="اختر تاريخًا"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="accountInfo.appointmentTime"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>وقت الموعد</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={'outline'}
                                    className={cn(
                                      'w-full pl-3 text-right font-normal',
                                      !field.value && 'text-muted-foreground'
                                    )}
                                  >
                                    {field.value || <span>اختر وقتًا</span>}
                                    <Clock className="mr-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-4" align="start">
                                <TimePickerDemo setTime={time => field.onChange(time)} time={field.value} />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="accountInfo.gender"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>الجنس</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-0 space-x-reverse space-y-0 rtl:space-x-reverse">
                                  <FormControl>
                                    <RadioGroupItem value="male" />
                                  </FormControl>
                                  <FormLabel className="mr-2 font-normal">ذكر</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-0 space-x-reverse space-y-0 rtl:space-x-reverse">
                                  <FormControl>
                                    <RadioGroupItem value="female" />
                                  </FormControl>
                                  <FormLabel className="mr-2 font-normal">أنثى</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-0 space-x-reverse space-y-0 rtl:space-x-reverse">
                                  <FormControl>
                                    <RadioGroupItem value="other" />
                                  </FormControl>
                                  <FormLabel className="mr-2 font-normal">آخر</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Preferences Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">التفضيلات</h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="preferences.notifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-0 space-x-reverse space-y-0 rounded-md border p-4 rtl:space-x-reverse">
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="mr-2 space-y-1 leading-none">
                              <FormLabel>الإشعارات</FormLabel>
                              <FormDescription>تلقي إشعارات عن التحديثات والأخبار.</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="preferences.newsletter"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-0 space-x-reverse space-y-0 rounded-md border p-4 rtl:space-x-reverse">
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="mr-2 space-y-1 leading-none">
                              <FormLabel>النشرة الإخبارية</FormLabel>
                              <FormDescription>الاشتراك في النشرة الإخبارية الشهرية.</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="preferences.acceptTerms"
                        render={({ field }) => (
                          <FormItem className="flex   flex-row items-start space-x-0 space-x-reverse space-y-0 rounded-md border p-4 rtl:space-x-reverse">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="mr-2 space-y-1 leading-none">
                              <FormLabel>الشروط والأحكام</FormLabel>
                              <FormDescription>أوافق على الشروط والأحكام وسياسة الخصوصية.</FormDescription>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full md:w-auto">
                  إرسال النموذج
                </Button>
              </>
            ) : (
              <>
                {/* Step-by-Step Form Display */}
                <div className="space-y-8">
                  {currentStep === 0 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="personalInfo.firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الاسم الأول</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل الاسم الأول" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="personalInfo.lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الاسم الأخير</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل الاسم الأخير" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="personalInfo.email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>البريد الإلكتروني</FormLabel>
                            <FormControl>
                              <Input placeholder="example@example.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="personalInfo.phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>رقم الهاتف</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل رقم الهاتف" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="addressInfo.address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>العنوان</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل العنوان" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="addressInfo.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>المدينة</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل المدينة" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="addressInfo.country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الدولة</FormLabel>
                            <FormControl>
                              <Combobox
                                options={countryOptions}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="اختر الدولة"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="addressInfo.postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الرمز البريدي</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل الرمز البريدي" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="accountInfo.username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اسم المستخدم</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل اسم المستخدم" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="accountInfo.bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>السيرة الذاتية</FormLabel>
                            <FormControl>
                              <Textarea placeholder="اكتب نبذة عنك..." className="resize-none" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="accountInfo.birthDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>تاريخ الميلاد</FormLabel>
                            <FormControl>
                              <DatePickerDemo
                                date={field.value}
                                setDate={field.onChange}
                                type="full"
                                placeholder="اختر تاريخًا"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="accountInfo.appointmentTime"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>وقت الموعد</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={'outline'}
                                    className={cn(
                                      'w-full pl-3 text-right font-normal',
                                      !field.value && 'text-muted-foreground'
                                    )}
                                  >
                                    {field.value || <span>اختر وقتًا</span>}
                                    <Clock className="mr-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-4" align="start">
                                <TimePickerDemo setTime={time => field.onChange(time)} time={field.value} />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="accountInfo.gender"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>الجنس</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-0 space-x-reverse space-y-0 rtl:space-x-reverse">
                                  <FormControl>
                                    <RadioGroupItem value="male" />
                                  </FormControl>
                                  <FormLabel className="mr-2 font-normal">ذكر</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-0 space-x-reverse space-y-0 rtl:space-x-reverse">
                                  <FormControl>
                                    <RadioGroupItem value="female" />
                                  </FormControl>
                                  <FormLabel className="mr-2 font-normal">أنثى</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-0 space-x-reverse space-y-0 rtl:space-x-reverse">
                                  <FormControl>
                                    <RadioGroupItem value="other" />
                                  </FormControl>
                                  <FormLabel className="mr-2 font-normal">آخر</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="preferences.notifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-0 space-x-reverse space-y-0 rounded-md border p-4 rtl:space-x-reverse">
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="mr-2 space-y-1 leading-none">
                              <FormLabel>الإشعارات</FormLabel>
                              <FormDescription>تلقي إشعارات عن التحديثات والأخبار.</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="preferences.newsletter"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-0 space-x-reverse space-y-0 rounded-md border p-4 rtl:space-x-reverse">
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="mr-2 space-y-1 leading-none">
                              <FormLabel>النشرة الإخبارية</FormLabel>
                              <FormDescription>الاشتراك في النشرة الإخبارية الشهرية.</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="preferences.acceptTerms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row   items-start space-x-0 space-x-reverse space-y-0 rounded-md border p-4 rtl:space-x-reverse">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="mr-2 space-y-1 leading-none">
                              <FormLabel>الشروط والأحكام</FormLabel>
                              <FormDescription>أوافق على الشروط والأحكام وسياسة الخصوصية.</FormDescription>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </form>
        </Form>
      </CardContent>
      {displayMode === 'steps' && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
            السابق
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>التالي</Button>
          ) : (
            <Button onClick={form.handleSubmit(onSubmit)}>إرسال</Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
