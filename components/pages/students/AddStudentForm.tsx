'use client';
import React, { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useGetNominatedPartiesQuery } from '@/services/nominatedParty';
import { useGetAttachmentTypesQuery } from '@/services/attachment';
import { useGetSubscriptionsQuery } from '@/services/subscriptions';
import { useGetSkillsQuery } from '@/services/skills';
import { useGetTrainingCoursesQuery } from '@/services/trainingCourses';
import { useAddStudentMutation } from '@/services/students';
import NominatedModel from '@/components/pages/adds/nominated/nominatedModel';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FileUploader from '@/components/utli/file-uploader';
import BirthdayDate from '@/components/pages/employees/add-employe/birthday-date';
import { Check, ChevronsUpDown, Plus, X, Upload, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
// import router from 'next/router';
import { useRouter } from 'next/navigation';

const addStudentSchema = z.object({
  name: z.string().min(1, { message: 'الاسم مطلوب' }),
  degree: z.string().min(1, { message: 'الشهادة مطلوبة' }),
  bdate: z
    .string()
    .min(1, 'تاريخ الميلاد مطلوب')
    .refine(date => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
      }
      return age >= 18;
    }, 'يجب أن يكون عمر الطالب على الأقل 18 سنة'),
  phone: z.string().min(10, 'رقم الهاتف غير صالح'),
  yearsOfServes: z.number().min(0, 'عدد سنوات الخبرة غير صالح'),
  nominatedPartyId: z.string().optional(),
  hight: z.number().min(0, 'طول الطالب مطلوب'),
  width: z.number().min(0, 'وزن الطالب مطلوب'),
  bodyCondition: z.string().optional(),
  epilepsy: z.boolean(),
  heartDisease: z.boolean(),
  sugar: z.boolean(),
  pressure: z.boolean(),
  notes: z.string().optional(),
  subscriptionTypeId: z.string().min(1, { message: 'نوع الاشتراك مطلوب' }),
  AttachmentFile: z.instanceof(File, { message: 'يرجى تحميل صورة شخصية' }),
  skills: z.array(z.string()).min(1, { message: 'يجب اختيار مهارة واحدة على الأقل' }),
  courses: z.array(z.string())
});

type AddStudentFormValues = z.infer<typeof addStudentSchema>;

// Define attachment interface
interface StudentAttachment {
  id: string;
  file: File;
  attachmentTypeId: string;
  attachmentTypeName: string;
}

function AddStudentForm() {
  const { data: nominatedParties, isLoading: isNominatedPartiesLoading } = useGetNominatedPartiesQuery({});
  const { data: attachmentTypes, isLoading: isAttachmentTypesLoading } = useGetAttachmentTypesQuery({});
  const { data: subscriptions, isLoading: isSubscriptionsLoading } = useGetSubscriptionsQuery({});
  const { data: skills, isLoading: isSkillsLoading } = useGetSkillsQuery({});
  const { data: trainingCourses, isLoading: isTrainingCoursesLoading } = useGetTrainingCoursesQuery({});
  const [addStudent, { isLoading: isAddStudentLoading }] = useAddStudentMutation();

  let subscriptionOptions: { value: string; label: string }[] = [];
  if (!isSubscriptionsLoading) {
    subscriptionOptions =
      subscriptions?.result?.data?.map(subscription => ({
        value: subscription.uniqueID,
        label: subscription.name
      })) || [];
  }

  let skillOptions: { value: string; label: string }[] = [];
  if (!isSkillsLoading) {
    skillOptions =
      skills?.result?.data?.map(skill => ({
        value: skill.uniqueID,
        label: skill.name
      })) || [];
  }

  let trainingCourseOptions: { value: string; label: string }[] = [];
  if (!isTrainingCoursesLoading) {
    trainingCourseOptions =
      trainingCourses?.result?.data?.map(trainingCourse => ({
        value: trainingCourse.uniqueID,
        label: trainingCourse.name
      })) || [];
  }

  const [open, setOpen] = useState(false);

  // Attachment state management
  const [attachments, setAttachments] = useState<StudentAttachment[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedAttachmentType, setSelectedAttachmentType] = useState<string>('');
  const [attachmentTypeOpen, setAttachmentTypeOpen] = useState(false);
  const [isAddingAttachment, setIsAddingAttachment] = useState(false);

  const attachmentsOptions =
    attachmentTypes?.result.data
      ?.filter(type => type.name !== 'صورة شخصية')
      ?.map(type => ({
        value: type.uniqueID,
        label: type.name
      })) || [];

  console.log(attachmentsOptions);

  const router = useRouter();

  const form = useForm<AddStudentFormValues>({
    resolver: zodResolver(addStudentSchema),
    defaultValues: {
      name: '',
      degree: '',
      bdate: '',
      phone: '',
      skills: [],
      courses: [],
      yearsOfServes: undefined,
      hight: undefined,
      width: undefined,
      epilepsy: false,
      heartDisease: false,
      sugar: false,
      pressure: false,
      subscriptionTypeId: ''
    }
  });
  const { control } = form;

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  // Add attachments to the list
  const handleAddAttachments = () => {
    if (selectedFiles.length === 0 || !selectedAttachmentType) return;

    const attachmentTypeName =
      attachmentTypes?.result?.data?.find(type => type.uniqueID === selectedAttachmentType)?.name || '';

    const newAttachments: StudentAttachment[] = selectedFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      attachmentTypeId: selectedAttachmentType,
      attachmentTypeName
    }));

    setAttachments(prev => [...prev, ...newAttachments]);

    // Reset state after adding
    setSelectedFiles([]);
    setSelectedAttachmentType('');
    setIsAddingAttachment(false);

    // Clear the file input
    const fileInput = document.getElementById('attachment-files') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Remove attachment
  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle form submission
  const onSubmit = async (data: AddStudentFormValues) => {
    try {
      const formData = new FormData();

      // Append basic fields
      formData.append('Name', data.name);
      formData.append('Degree', data.degree);
      formData.append('Bdate', data.bdate);
      formData.append('Phone', data.phone);
      formData.append('YearsOfServes', data.yearsOfServes.toString());
      if (data.nominatedPartyId) {
        formData.append('NominatedPartyId', data.nominatedPartyId);
      }
      formData.append('Hight', data.hight.toString());
      formData.append('Width', data.width.toString());
      if (data.bodyCondition) {
        formData.append('BodyCondition', data.bodyCondition);
      }
      formData.append('Epilepsy', data.epilepsy.toString());
      formData.append('HeartDisease', data.heartDisease.toString());
      formData.append('Sugar', data.sugar.toString());
      formData.append('Pressure', data.pressure.toString());
      if (data.notes) {
        formData.append('Notes', data.notes);
      }
      formData.append('SubscriptionTypeId', data.subscriptionTypeId);

      // Append skills array
      data.skills.forEach(skillId => {
        formData.append('SkillIds', skillId);
      });

      // Append courses array
      if (data.courses && data.courses.length > 0) {
        data.courses.forEach(courseId => {
          formData.append('CourseIds', courseId);
        });
      }

      // Append attachments array
      // First append profile picture with the default profile picture typeId
      const PROFILE_PICTURE_TYPE_ID = '11111111-1111-1111-1111-111111111111';
      let attachmentIndex = 0;

      // Add profile picture
      if (data.AttachmentFile) {
        formData.append(`Attachments[${attachmentIndex}].typeId`, PROFILE_PICTURE_TYPE_ID);
        formData.append(`Attachments[${attachmentIndex}].file`, data.AttachmentFile);
        attachmentIndex++;
      }

      // Add other attachments
      attachments.forEach(attachment => {
        formData.append(`Attachments[${attachmentIndex}].typeId`, attachment.attachmentTypeId);
        formData.append(`Attachments[${attachmentIndex}].file`, attachment.file);
        attachmentIndex++;
      });

      // Submit the form
      const response = await addStudent(formData).unwrap();

      if (response.isSuccess) {
        const studentData = response.result;
        toast.success(`تم إضافة الطالب بنجاح`, {
          description: `الاسم: ${studentData?.name || data.name}${studentData?.uniqueID ? ` - المعرف: ${studentData.uniqueID}` : ''}`
        });

        // Reset form and navigate back
        form.reset();
        setAttachments([]);
        router.back();
      } else {
        // Display error messages from server
        const errorMsg = response.errorMessages?.join('\n') || 'حدث خطأ أثناء إضافة الطالب';
        toast.error('فشل في إضافة الطالب', {
          description: errorMsg
        });
      }
    } catch (error: any) {
      // Handle error
      const errorMessages = error?.data?.errorMessages || [];
      const errorMsg = errorMessages.length > 0 ? errorMessages.join('\n') : 'حدث خطأ أثناء إضافة الطالب';

      toast.error('فشل في إضافة الطالب', {
        description: errorMsg
      });
    }
  };

  return (
    <div className=" scroll-smooth">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="studentForm grid grid-cols-1 lg:grid-cols-[378px_1fr] gap-4 lg:gap-8"
        >
          <div className=" space-y-4">
            <Card>
              <CardContent>
                <FileUploader className="border-none shadow-none" control={control} name="AttachmentFile" />
                <Separator className=" my-4 h-px bg-gray-300 rounded-xl" />
                <div className=" space-y-4">
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
                          <BirthdayDate {...field} />
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
                            type="number"
                            onChange={e => field.onChange(e.target.valueAsNumber || undefined)}
                            value={field.value || undefined}
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
                    name="nominatedPartyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between bg-searchBg rounded-xl font-vazirmatn font-normal placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-none hover:bg-searchBg"
                              >
                                {field.value
                                  ? nominatedParties?.result?.data?.find(party => party.uniqueID === field.value)?.name
                                  : 'اختر الجهة المرشحة'}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 " align="start">
                              <Command>
                                <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
                                  <CommandInput
                                    placeholder="البحث عن جهة الترشيح..."
                                    className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus:ring-0 focus:outline-none "
                                  />
                                  <div className="flex-shrink-0 ml-2 ">
                                    <NominatedModel btnClassName=" bg-transparent text-black hover:bg-transparent" />
                                  </div>
                                </div>
                                <CommandList>
                                  <CommandEmpty className="py-6 text-center text-sm">
                                    لم يتم العثور على جهة الترشيح
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {nominatedParties?.result?.data?.map(party => (
                                      <CommandItem
                                        key={party.uniqueID}
                                        value={party.name}
                                        onSelect={() => {
                                          field.onChange(party.uniqueID);
                                          setOpen(false);
                                        }}
                                      >
                                        {party.name}
                                        <Check
                                          className={cn(
                                            'ml-auto h-4 w-4',
                                            field.value === party.uniqueID ? 'opacity-100' : 'opacity-0'
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Attachment Section */}
            <Card className="">
              <CardContent className="p-4 space-y-4">
                <div className="text-right">
                  <h3 className="text-lg font-medium font-vazirmatn mb-4">المرفقات</h3>
                </div>

                {/* Add Attachment trigger */}
                {!isAddingAttachment && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => {
                        setIsAddingAttachment(true);
                        setSelectedFiles([]);
                        setSelectedAttachmentType('');
                      }}
                      className="bg-sidebaractive text-white rounded-xl hover:brightness-110 font-vazirmatn w-full"
                    >
                      <Plus className="ml-2 h-4 w-4" />
                      إضافة مرفق
                    </Button>
                  </div>
                )}

                {/* Attachments Input Workflow */}
                {isAddingAttachment && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* File Input */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-right block font-vazirmatn">اختر الملفات</label>
                        <div className="relative">
                          <input
                            type="file"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                            id="attachment-files"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                          />
                          <label
                            htmlFor="attachment-files"
                            className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-sidebaractive hover:bg-gray-50 transition-colors"
                          >
                            <div className="text-center">
                              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600 font-vazirmatn">انقر لاختيار الملفات أو اسحبها هنا</p>
                              <p className="text-xs text-gray-500 font-vazirmatn">PDF, DOC, DOCX, JPG, PNG, GIF</p>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Attachment Type Selection */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-right block font-vazirmatn">نوع المرفق</label>
                        <Popover open={attachmentTypeOpen} onOpenChange={setAttachmentTypeOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={attachmentTypeOpen}
                              disabled={isAttachmentTypesLoading}
                              className="w-full justify-between bg-searchBg rounded-xl font-vazirmatn font-normal border-none hover:bg-searchBg"
                            >
                              {isAttachmentTypesLoading
                                ? 'جاري التحميل...'
                                : selectedAttachmentType
                                  ? attachmentsOptions?.find(type => type.value === selectedAttachmentType)?.label
                                  : 'اختر نوع المرفق'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command>
                              <CommandInput placeholder="البحث عن نوع المرفق..." className="h-9 font-vazirmatn" />
                              <CommandList>
                                <CommandEmpty className="py-6 text-center text-sm font-vazirmatn">
                                  لم يتم العثور على نوع المرفق
                                </CommandEmpty>
                                <CommandGroup>
                                  {attachmentsOptions.map(type => (
                                    <CommandItem
                                      key={type.value}
                                      value={type.value}
                                      onSelect={() => {
                                        setSelectedAttachmentType(type.value);
                                        setAttachmentTypeOpen(false);
                                      }}
                                      className="font-vazirmatn"
                                    >
                                      {type.label}
                                      <Check
                                        className={cn(
                                          'ml-auto h-4 w-4',
                                          selectedAttachmentType === type.value ? 'opacity-100' : 'opacity-0'
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* Selected Files Preview and Actions */}
                    {selectedFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium font-vazirmatn">الملفات المحددة: ({selectedFiles.length})</p>
                        <div className="space-y-1">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <FileText className="h-4 w-4 text-sidebaractive" />
                                <span className="text-sm font-vazirmatn">{file.name}</span>
                              </div>
                              <span className="text-xs text-gray-500 font-vazirmatn">{formatFileSize(file.size)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            className="bg-sidebaractive text-white rounded-xl hover:brightness-110 font-vazirmatn"
                            onClick={handleAddAttachments}
                            disabled={selectedFiles.length === 0 || !selectedAttachmentType}
                          >
                            <Plus className="ml-2 h-4 w-4" />
                            إضافة المرفقات
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setIsAddingAttachment(false);
                              setSelectedFiles([]);
                              setSelectedAttachmentType('');
                              const fileInput = document.getElementById('attachment-files') as HTMLInputElement;
                              if (fileInput) fileInput.value = '';
                            }}
                            className="font-vazirmatn"
                          >
                            إلغاء
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Added Attachments List */}
                {attachments.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <Separator className="h-px bg-gray-300 rounded-xl" />
                    <p className="text-sm font-medium font-vazirmatn">المرفقات المضافة:</p>
                    <div className="space-y-2">
                      {attachments.map(attachment => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between p-3 bg-white rounded border"
                        >
                          <div
                            className="flex items-center space-x-3 space-x-reverse cursor-pointer"
                            onClick={() => {
                              const url = URL.createObjectURL(attachment.file);
                              window.open(url, '_blank', 'noopener,noreferrer');
                              setTimeout(() => URL.revokeObjectURL(url), 10000);
                            }}
                            title="فتح الملف في تبويب جديد"
                            aria-label="فتح الملف في تبويب جديد"
                          >
                            {attachment.file.type?.startsWith('image/') ||
                            /\.(png|jpe?g|gif)$/i.test(attachment.file.name) ? (
                              <img
                                src={URL.createObjectURL(attachment.file)}
                                alt={attachment.file.name}
                                loading="lazy"
                                className="h-10 w-10 rounded object-cover border"
                                onLoad={e => {
                                  try {
                                    const img = e.currentTarget as HTMLImageElement;
                                    URL.revokeObjectURL(img.src);
                                  } catch {}
                                }}
                              />
                            ) : attachment.file.type === 'application/pdf' || /\.(pdf)$/i.test(attachment.file.name) ? (
                              <div className="flex items-center justify-center h-10 w-10 rounded border bg-gray-50">
                                <span className="text-[10px] font-vazirmatn text-gray-700">PDF</span>
                              </div>
                            ) : (
                              <FileText className="h-5 w-5 text-green-500" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate font-vazirmatn">
                                {attachment.file.name}
                              </p>
                              <p className="text-xs text-gray-500 font-vazirmatn">
                                {attachment.attachmentTypeName} • {formatFileSize(attachment.file.size)}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(attachment.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className=" space-y-4" id="personal-info">
            <Card>
              <CardHeader className=" font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
                المعلومات الجسدية
              </CardHeader>
              <CardContent className=" space-y-4">
                <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2 ">
                  <div className=" flex-1 w-full">
                    <FormField
                      control={control}
                      name="hight"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              onChange={e => field.onChange(e.target.valueAsNumber || 0)}
                              value={field.value}
                              placeholder="الطول"
                              className=" bg-searchBg rounded-xl w-full  font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex-1 w-full">
                    <FormField
                      control={control}
                      name="width"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              onChange={e => field.onChange(e.target.valueAsNumber || 0)}
                              value={field.value}
                              placeholder="الوزن"
                              className=" bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={control}
                  name="bodyCondition"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="w-full justify-between bg-searchBg rounded-xl font-vazirmatn font-normal border-none hover:bg-searchBg focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <SelectValue placeholder="حالة الجسم" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="مقبول">مقبول</SelectItem>
                            <SelectItem value="مرفوض">مرفوض</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className=" font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
                الحالات الصحية
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between" dir="rtl">
                  {/* Left column: قلبية, ضغط */}
                  <div className="flex flex-col gap-2">
                    <FormField
                      control={form.control}
                      name="heartDisease"
                      render={({ field }) => (
                        <FormItem className="flex items-center">
                          <FormControl>
                            <Checkbox
                              checked={!!field.value}
                              onCheckedChange={field.onChange}
                              className="size-8 rounded-md bg-searchBg border-none data-[state=checked]:bg-purple-500"
                            />
                          </FormControl>
                          <FormLabel className="text-muted-foreground">قلبية</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pressure"
                      render={({ field }) => (
                        <FormItem className="flex items-center">
                          <FormControl>
                            <Checkbox
                              checked={!!field.value}
                              onCheckedChange={field.onChange}
                              className="size-8 rounded-md bg-searchBg border-none data-[state=checked]:bg-purple-500"
                            />
                          </FormControl>
                          <FormLabel className="text-muted-foreground">ضغط</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Right column: صرع, سكر */}
                  <div className="flex flex-col gap-2">
                    <FormField
                      control={form.control}
                      name="epilepsy"
                      render={({ field }) => (
                        <FormItem className="flex items-center">
                          <FormControl>
                            <Checkbox
                              checked={!!field.value}
                              onCheckedChange={field.onChange}
                              className="size-8 rounded-md bg-searchBg border-none data-[state=checked]:bg-purple-500"
                            />
                          </FormControl>
                          <FormLabel className="text-muted-foreground">صرع</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sugar"
                      render={({ field }) => (
                        <FormItem className="flex items-center">
                          <FormControl>
                            <Checkbox
                              checked={!!field.value}
                              onCheckedChange={field.onChange}
                              className="size-8 rounded-md bg-searchBg border-none data-[state=checked]:bg-purple-500"
                            />
                          </FormControl>
                          <FormLabel className="text-muted-foreground">سكر</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className=" font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
                معلومات الدورة والاشتراك
              </CardHeader>

              <CardContent className=" flex flex-col sm:flex-row items-center gap-2">
                <div className=" flex-1 w-full">
                  <FormField
                    control={control}
                    name="subscriptionTypeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full justify-between bg-searchBg rounded-xl font-vazirmatn font-normal border-none hover:bg-searchBg focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                              <SelectValue placeholder="اختر نوع الاشتراك" />
                            </SelectTrigger>
                            <SelectContent>
                              {subscriptionOptions?.map(subscription => (
                                <SelectItem key={subscription.value} value={subscription.value}>
                                  {subscription.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* <div className=' flex-1 w-full'>
                  <FormField
                    control={control}
                    name="coursename"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder=" اسم الدورة"
                            className=" bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div> */}
              </CardContent>
            </Card>

            <Card className="px-3 py-4">
              <CardHeader className=" font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
                المهارات
              </CardHeader>
              <CardContent className=" bg-searchBg p-4 rounded-xl">
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-2">
                          {isSkillsLoading ? (
                            <div className="text-muted-foreground text-sm">جاري تحميل المهارات...</div>
                          ) : skillOptions.length === 0 ? (
                            <div className="text-muted-foreground text-sm">لا توجد مهارات متاحة</div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {skillOptions.map(skill => (
                                <div key={skill.value} className="flex items-center space-x-2 space-x-reverse py-2">
                                  <Checkbox
                                    id={`skill-${skill.value}`}
                                    checked={field.value?.includes(skill.value) || false}
                                    onCheckedChange={checked => {
                                      const currentValues = field.value || [];
                                      if (checked) {
                                        // Add skill to array if not already present
                                        if (!currentValues.includes(skill.value)) {
                                          field.onChange([...currentValues, skill.value]);
                                        }
                                      } else {
                                        // Remove skill from array
                                        field.onChange(currentValues.filter(value => value !== skill.value));
                                      }
                                    }}
                                    className="size-5 rounded-md border data-[state=checked]:bg-sidebaractive"
                                  />
                                  <FormLabel
                                    htmlFor={`skill-${skill.value}`}
                                    className="text-muted-foreground cursor-pointer text-sm font-normal"
                                  >
                                    {skill.label}
                                  </FormLabel>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="px-3 py-4">
              <CardHeader className=" font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">الدورات</CardHeader>
              <CardContent className=" bg-searchBg p-4 rounded-xl">
                <FormField
                  control={form.control}
                  name="courses"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-2">
                          {isTrainingCoursesLoading ? (
                            <div className="text-muted-foreground text-sm">جاري تحميل الدورات...</div>
                          ) : trainingCourseOptions.length === 0 ? (
                            <div className="text-muted-foreground text-sm">لا توجد دورات متاحة</div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {trainingCourseOptions.map(trainingCourse => (
                                <div
                                  key={trainingCourse.value}
                                  className="flex items-center space-x-2 space-x-reverse py-2"
                                >
                                  <Checkbox
                                    id={`trainingCourse-${trainingCourse.value}`}
                                    checked={field.value?.includes(trainingCourse.value) || false}
                                    onCheckedChange={checked => {
                                      const currentValues = field.value || [];
                                      if (checked) {
                                        // Add trainingCourse to array if not already present
                                        if (!currentValues.includes(trainingCourse.value)) {
                                          field.onChange([...currentValues, trainingCourse.value]);
                                        }
                                      } else {
                                        // Remove trainingCourse from array
                                        field.onChange(currentValues.filter(value => value !== trainingCourse.value));
                                      }
                                    }}
                                    className="size-5 rounded-md border data-[state=checked]:bg-sidebaractive"
                                  />
                                  <FormLabel
                                    htmlFor={`trainingCourse-${trainingCourse.value}`}
                                    className="text-muted-foreground cursor-pointer text-sm font-normal"
                                  >
                                    {trainingCourse.label}
                                  </FormLabel>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </form>
        <div className=" absolute bottom-0 left-0 right-0 ">
          <div className=" w-full text-left bg-white sticky px-4 py-2 -bottom-6 flex justify-end items-center gap-4">
            <Button
              className=" bg-transparent font-vazirmatn px-6 h-8 text-black w-full sm:w-auto"
              type="button"
              onClick={() => router.back()}
              variant="outline"
            >
              الغاء
            </Button>
            <Button
              className=" bg-sidebaractive font-vazirmatn px-6 h-8 text-white w-full sm:w-auto"
              type="submit"
              disabled={isAddStudentLoading}
              onClick={form.handleSubmit(onSubmit)}
            >
              {isAddStudentLoading ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default AddStudentForm;
