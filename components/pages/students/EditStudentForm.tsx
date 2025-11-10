"use client"
import React, { useState, useEffect } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGetNominatedPartiesQuery } from "@/services/nominatedParty";
import { useGetAttachmentTypesQuery } from "@/services/attachment";
import { useGetSubscriptionsQuery } from "@/services/subscriptions";
import { useGetSkillsQuery } from "@/services/skills";
import { useGetTrainingCoursesQuery } from "@/services/trainingCourses";
import { useGetStudentByIdQuery, useUpdateStudentMutation, StudentAttachment } from "@/services/students";
import NominatedModel from "@/components/pages/adds/nominated/nominatedModel";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FileUploader from "@/components/utli/file-uploader";
import BirthdayDate from "@/components/pages/employees/add-employe/birthday-date";
import { Check, ChevronsUpDown, Plus, X, Upload, FileText } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const editStudentSchema = z.object({
  name: z.string().min(1, { message: "الاسم مطلوب" }),
  degree: z.string().min(1, { message: "الشهادة مطلوبة" }),
  bdate: z.string().min(1, "تاريخ الميلاد مطلوب").refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  }, "يجب أن يكون عمر الطالب على الأقل 18 سنة"),
  phone: z.string().min(10, "رقم الهاتف غير صالح"),
  yearsOfServes: z.number().min(0, "عدد سنوات الخبرة غير صالح"),
  nominatedPartyId: z.string().optional(),
  hight: z.number().min(0, "طول الطالب مطلوب"),
  width: z.number().min(0, "وزن الطالب مطلوب"),
  bodyCondition: z.string().optional(),
  epilepsy: z.boolean(),
  heartDisease: z.boolean(),
  sugar: z.boolean(),
  pressure: z.boolean(),
  notes: z.string().optional(),
  subscriptionTypeId: z.string().min(1, { message: "نوع الاشتراك مطلوب" }),
  AttachmentFile: z.instanceof(File).optional(), // Optional in edit mode
  skills: z.array(z.string()).min(1, { message: "يجب اختيار مهارة واحدة على الأقل" }),
  courses: z.array(z.string()),
})

type EditStudentFormValues = z.infer<typeof editStudentSchema>

// Define attachment interface for new attachments
interface NewAttachment {
  id: string;
  file: File;
  attachmentTypeId: string;
  attachmentTypeName: string;
}

// Define existing attachment with URL
interface ExistingAttachment extends StudentAttachment {
  isDeleted?: boolean;
}

function EditStudentForm({ id }: { id: string }) {
  // API queries
  const { data: studentData, isLoading: isStudentLoading, error: studentError } = useGetStudentByIdQuery({ uniqueID: id });
  const { data: nominatedParties, isLoading: isNominatedPartiesLoading } = useGetNominatedPartiesQuery({});
  const { data: attachmentTypes, isLoading: isAttachmentTypesLoading } = useGetAttachmentTypesQuery({});
  const { data: subscriptions, isLoading: isSubscriptionsLoading } = useGetSubscriptionsQuery({});
  const { data: skills, isLoading: isSkillsLoading } = useGetSkillsQuery({});
  const { data: trainingCourses, isLoading: isTrainingCoursesLoading } = useGetTrainingCoursesQuery({});
  const [updateStudent, { isLoading: isUpdateStudentLoading }] = useUpdateStudentMutation();

  // State for tracking original data
  const [originalSkills, setOriginalSkills] = useState<string[]>([]);
  const [originalCourses, setOriginalCourses] = useState<string[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<ExistingAttachment[]>([]);

  let subscriptionOptions: { value: string; label: string }[] = [];
  if (!isSubscriptionsLoading) {
    subscriptionOptions = subscriptions?.result?.data?.map((subscription) => ({
      value: subscription.uniqueID,
      label: subscription.name,
    })) || [];
  }

  let skillOptions: { value: string; label: string }[] = [];
  if (!isSkillsLoading) {
    skillOptions = skills?.result?.data?.map((skill) => ({
      value: skill.uniqueID,
      label: skill.name,
    })) || [];
  }

  let trainingCourseOptions: { value: string; label: string }[] = [];
  if (!isTrainingCoursesLoading) {
    trainingCourseOptions = trainingCourses?.result?.data?.map((trainingCourse) => ({
      value: trainingCourse.uniqueID,
      label: trainingCourse.name,
    })) || [];
  }

  const [open, setOpen] = useState(false);

  // New attachment state management
  const [newAttachments, setNewAttachments] = useState<NewAttachment[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedAttachmentType, setSelectedAttachmentType] = useState<string>("");
  const [attachmentTypeOpen, setAttachmentTypeOpen] = useState(false);
  const [isAddingAttachment, setIsAddingAttachment] = useState(false);

  const router = useRouter();

  const form = useForm<EditStudentFormValues>({
    resolver: zodResolver(editStudentSchema),
    defaultValues: {
      name: "",
      degree: "",
      bdate: "",
      phone: "",
      skills: [],
      courses: [],
      yearsOfServes: 0,
      hight: 0,
      width: 0,
      epilepsy: false,
      heartDisease: false,
      sugar: false,
      pressure: false,
      subscriptionTypeId: "",
    }
  })
  const { control } = form;

  // Populate form when student data is loaded
  useEffect(() => {
    if (studentData?.result) {
      const student = studentData.result;

      // Format date to YYYY-MM-DD
      const formattedDate = student.bdate ? new Date(student.bdate).toISOString().split('T')[0] : "";

      // Extract skill and course IDs
      const skillIds = student.skills?.map(s => s.skillId) || [];
      const courseIds = student.courses?.map(c => c.courseId) || [];

      // Store original values for comparison
      setOriginalSkills(skillIds);
      setOriginalCourses(courseIds);
      setExistingAttachments(student.attachments || []);

      // Populate form
      form.reset({
        name: student.name || "",
        degree: student.degree || "",
        bdate: formattedDate,
        phone: student.phone || "",
        yearsOfServes: student.yearsOfServes || 0,
        nominatedPartyId: student.nominatedPartyId || "",
        hight: student.hight || 0,
        width: student.width || 0,
        bodyCondition: student.bodyCondition || "",
        epilepsy: student.epilepsy || false,
        heartDisease: student.heartDisease || false,
        sugar: student.sugar || false,
        pressure: student.pressure || false,
        notes: student.notes || "",
        subscriptionTypeId: student.subscriptionTypeId || "",
        skills: skillIds,
        courses: courseIds,
      });
    }
  }, [studentData, form]);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  // Add new attachments to the list
  const handleAddAttachments = () => {
    if (selectedFiles.length === 0 || !selectedAttachmentType) return;

    const attachmentTypeName = attachmentTypes?.result?.data?.find(
      type => type.uniqueID === selectedAttachmentType
    )?.name || "";

    const newAtts: NewAttachment[] = selectedFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      attachmentTypeId: selectedAttachmentType,
      attachmentTypeName,
    }));

    setNewAttachments(prev => [...prev, ...newAtts]);

    // Reset state after adding
    setSelectedFiles([]);
    setSelectedAttachmentType("");
    setIsAddingAttachment(false);

    // Clear the file input
    const fileInput = document.getElementById('attachment-files') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Remove new attachment
  const removeNewAttachment = (id: string) => {
    setNewAttachments(prev => prev.filter(att => att.id !== id));
  };

  // Mark existing attachment as deleted
  const markExistingAttachmentDeleted = (attachmentId: string) => {
    setExistingAttachments(prev =>
      prev.map(att =>
        att.attachmentId === attachmentId ? { ...att, isDeleted: true } : att
      )
    );
  };

  // Restore deleted attachment
  const restoreExistingAttachment = (attachmentId: string) => {
    setExistingAttachments(prev =>
      prev.map(att =>
        att.attachmentId === attachmentId ? { ...att, isDeleted: false } : att
      )
    );
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get backend URL for attachment preview
  const getAttachmentUrl = (filePath: string) => {
    const backendUrl = process.env.NEXT_PUBLIC_BASIC_URL || "http://aliali.runasp.net";
    return `${backendUrl}${filePath}`;
  };

  // Handle form submission
  const onSubmit = async (data: EditStudentFormValues) => {
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

      // Handle Skills - calculate added and deleted
      const currentSkills = data.skills;
      const addedSkills = currentSkills.filter(id => !originalSkills.includes(id));
      const deletedSkills = originalSkills.filter(id => !currentSkills.includes(id));

      addedSkills.forEach(skillId => {
        formData.append('AddedSkillIds', skillId);
      });

      deletedSkills.forEach(skillId => {
        formData.append('DeletedSkillIds', skillId);
      });

      // Handle Courses - calculate added and deleted
      const currentCourses = data.courses;
      const addedCourses = currentCourses.filter(id => !originalCourses.includes(id));
      const deletedCourses = originalCourses.filter(id => !currentCourses.includes(id));

      addedCourses.forEach(courseId => {
        formData.append('AddedCourseIds', courseId);
      });

      deletedCourses.forEach(courseId => {
        formData.append('DeletedCourseIds', courseId);
      });

      // Handle Attachments
      const PROFILE_PICTURE_TYPE_ID = "11111111-1111-1111-1111-111111111111";

      // Get deleted attachment IDs
      const deletedAttachmentIds = existingAttachments
        .filter(att => att.isDeleted)
        .map(att => att.attachmentId);

      deletedAttachmentIds.forEach(attachmentId => {
        formData.append('DeletedAttachmentIds', attachmentId);
      });

      // Handle new profile picture if uploaded
      let newAttachmentIndex = 0;
      if (data.AttachmentFile) {
        formData.append(`NewAttachments[${newAttachmentIndex}].typeId`, PROFILE_PICTURE_TYPE_ID);
        formData.append(`NewAttachments[${newAttachmentIndex}].file`, data.AttachmentFile);
        newAttachmentIndex++;
      }

      // Add other new attachments
      newAttachments.forEach((attachment) => {
        formData.append(`NewAttachments[${newAttachmentIndex}].typeId`, attachment.attachmentTypeId);
        formData.append(`NewAttachments[${newAttachmentIndex}].file`, attachment.file);
        newAttachmentIndex++;
      });

      // Submit the form
      const response = await updateStudent({ uniqueID: id, student: formData }).unwrap();

      if (response.isSuccess) {
        const studentData = response.result;
        toast.success(`تم تحديث بيانات الطالب بنجاح`, {
          description: `الاسم: ${studentData?.name || data.name}${studentData?.uniqueID ? ` - المعرف: ${studentData.uniqueID}` : ''}`,
        });

        // Redirect to students page
        router.push('/students');
      } else {
        // Display error messages from server
        const errorMsg = response.errorMessages?.join('\n') || "حدث خطأ أثناء تحديث الطالب";
        toast.error('فشل في تحديث الطالب', {
          description: errorMsg,
        });
      }
    } catch (error: any) {
      // Handle error
      const errorMessages = error?.data?.errorMessages || [];
      const errorMsg = errorMessages.length > 0
        ? errorMessages.join('\n')
        : "حدث خطأ أثناء تحديث الطالب";

      toast.error('فشل في تحديث الطالب', {
        description: errorMsg,
      });
    }
  };

  // Loading state
  if (isStudentLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sidebaractive mx-auto"></div>
          <p className="font-vazirmatn text-subtext">جاري تحميل بيانات الطالب...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (studentError || !studentData?.isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <p className="font-vazirmatn text-red-500">حدث خطأ أثناء تحميل بيانات الطالب</p>
          <Button onClick={() => router.push('/students')} className="font-vazirmatn">
            العودة إلى قائمة الطلاب
          </Button>
        </div>
      </div>
    );
  }

    const attachmentsOptions = attachmentTypes?.result.data?.filter(type => type.name !== "صورة شخصية")?.map((type) => ({
    value: type.uniqueID,
    label: type.name,
  })) || [];
  const profileImage = studentData?.result?.attachments?.find(attachment => attachment.typeId === "11111111-1111-1111-1111-111111111111");
  console.log(profileImage);

  return (
    <div className='scroll-smooth'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='studentForm grid grid-cols-1 lg:grid-cols-[378px_1fr] gap-4 lg:gap-8'>
          <div className='space-y-4'>
            <Card>
              <CardContent>
                <FileUploader previewUrl={profileImage?.file || ""} className='border-none shadow-none' control={control} name="AttachmentFile" />
                {/* Show current profile picture */}
                {existingAttachments.find(att => att.typeId === "11111111-1111-1111-1111-111111111111") && (
                  <div className="mt-2 text-sm text-subtext font-vazirmatn">
                    <p>الصورة الحالية: {existingAttachments.find(att => att.typeId === "11111111-1111-1111-1111-111111111111")?.typeName}</p>
                    <p className="text-xs">قم برفع صورة جديدة للتحديث</p>
                  </div>
                )}
                <Separator className='my-4 h-px bg-gray-300 rounded-xl' />
                <div className='space-y-4'>
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="الاسم الثلاثي"
                            className="bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                            className="bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                            className="bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                            value={field.value || 0}
                            placeholder="سنوات الخدمة"
                            className="bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between bg-searchBg rounded-xl font-vazirmatn font-normal placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-none hover:bg-searchBg"
                              >
                                {field.value
                                  ? nominatedParties?.result?.data?.find(
                                    (party) => party.uniqueID === field.value
                                  )?.name
                                  : "اختر الجهة المرشحة"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0" align="start">
                              <Command>
                                <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
                                  <CommandInput
                                    placeholder="البحث عن جهة الترشيح..."
                                    className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus:ring-0 focus:outline-none"
                                  />
                                  <div className="flex-shrink-0 ml-2">
                                    <NominatedModel btnClassName="bg-transparent text-black hover:bg-transparent" />
                                  </div>
                                </div>
                                <CommandList>
                                  <CommandEmpty className="py-6 text-center text-sm">
                                    لم يتم العثور على جهة الترشيح
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {nominatedParties?.result?.data?.map((party) => (
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
                                            "ml-auto h-4 w-4",
                                            field.value === party.uniqueID ? "opacity-100" : "opacity-0"
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
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="text-right">
                  <h3 className="text-lg font-medium font-vazirmatn mb-4">المرفقات</h3>
                </div>

                {/* Existing Attachments */}
                {existingAttachments.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium font-vazirmatn">المرفقات الحالية:</p>
                    <div className="space-y-2">
                      {existingAttachments
                        .filter(att => att.typeId !== "3a3ae5af-d8e9-40b6-8194-11458e4caf32") // Exclude profile picture
                        .map((attachment) => (
                          <div
                            key={attachment.attachmentId}
                            className={cn(
                              "flex items-center justify-between p-3 bg-white rounded border",
                              attachment.isDeleted && "opacity-50 bg-red-50"
                            )}
                          >
                            <div
                              className="flex items-center space-x-3 space-x-reverse cursor-pointer flex-1"
                              onClick={() => {
                                if (!attachment.isDeleted) {
                                  window.open(getAttachmentUrl(attachment.file), "_blank", "noopener,noreferrer");
                                }
                              }}
                              title={attachment.isDeleted ? "المرفق محذوف" : "فتح الملف في تبويب جديد"}
                            >
                              {attachment.file.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                <img
                                  src={getAttachmentUrl(attachment.file)}
                                  alt={attachment.typeName}
                                  className="h-10 w-10 rounded object-cover border"
                                />
                              ) : attachment.file.match(/\.pdf$/i) ? (
                                <div className="flex items-center justify-center h-10 w-10 rounded border bg-gray-50">
                                  <span className="text-[10px] font-vazirmatn text-gray-700">PDF</span>
                                </div>
                              ) : (
                                <FileText className="h-5 w-5 text-green-500" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate font-vazirmatn">
                                  {attachment.typeName}
                                  {attachment.isDeleted && " (محذوف)"}
                                </p>
                                <p className="text-xs text-gray-500 font-vazirmatn">
                                  {attachment.file.split('/').pop()}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {attachment.isDeleted ? (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => restoreExistingAttachment(attachment.attachmentId)}
                                  className="text-green-500 hover:text-green-700 hover:bg-green-50 font-vazirmatn"
                                >
                                  استعادة
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markExistingAttachmentDeleted(attachment.attachmentId)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                    <Separator className="h-px bg-gray-300 rounded-xl my-4" />
                  </div>
                )}

                {/* Add Attachment trigger */}
                {!isAddingAttachment && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => {
                        setIsAddingAttachment(true);
                        setSelectedFiles([]);
                        setSelectedAttachmentType("");
                      }}
                      className="bg-sidebaractive text-white rounded-xl hover:brightness-110 font-vazirmatn w-full"
                    >
                      <Plus className="ml-2 h-4 w-4" />
                      إضافة مرفق جديد
                    </Button>
                  </div>
                )}

                {/* New Attachments Input Workflow */}
                {isAddingAttachment && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* File Input */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-right block font-vazirmatn">
                          اختر الملفات
                        </label>
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
                              <p className="text-sm text-gray-600 font-vazirmatn">
                                انقر لاختيار الملفات أو اسحبها هنا
                              </p>
                              <p className="text-xs text-gray-500 font-vazirmatn">
                                PDF, DOC, DOCX, JPG, PNG, GIF
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Attachment Type Selection */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-right block font-vazirmatn">
                          نوع المرفق
                        </label>
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
                                ? "جاري التحميل..."
                                : selectedAttachmentType
                                  ? attachmentsOptions.find(
                                    (type) => type.value === selectedAttachmentType
                                  )?.label
                                  : "اختر نوع المرفق"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command>
                              <CommandInput
                                placeholder="البحث عن نوع المرفق..."
                                className="h-9 font-vazirmatn"
                              />
                              <CommandList>
                                <CommandEmpty className="py-6 text-center text-sm font-vazirmatn">
                                  لم يتم العثور على نوع المرفق
                                </CommandEmpty>
                                <CommandGroup>
                                  {attachmentsOptions
                                    ?.filter(type => type.value !== "11111111-1111-1111-1111-111111111111") // Exclude profile picture type
                                    ?.map((type) => (
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
                                            "ml-auto h-4 w-4",
                                            selectedAttachmentType === type.value ? "opacity-100" : "opacity-0"
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
                        <p className="text-sm font-medium font-vazirmatn">
                          الملفات المحددة: ({selectedFiles.length})
                        </p>
                        <div className="space-y-1">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <FileText className="h-4 w-4 text-sidebaractive" />
                                <span className="text-sm font-vazirmatn">{file.name}</span>
                              </div>
                              <span className="text-xs text-gray-500 font-vazirmatn">
                                {formatFileSize(file.size)}
                              </span>
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
                              setSelectedAttachmentType("");
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

                {/* New Attachments List */}
                {newAttachments.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <Separator className="h-px bg-gray-300 rounded-xl" />
                    <p className="text-sm font-medium font-vazirmatn">المرفقات الجديدة المضافة:</p>
                    <div className="space-y-2">
                      {newAttachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between p-3 bg-white rounded border"
                        >
                          <div
                            className="flex items-center space-x-3 space-x-reverse cursor-pointer"
                            onClick={() => {
                              const url = URL.createObjectURL(attachment.file);
                              window.open(url, "_blank", "noopener,noreferrer");
                              setTimeout(() => URL.revokeObjectURL(url), 10000);
                            }}
                            title="فتح الملف في تبويب جديد"
                          >
                            {(attachment.file.type?.startsWith('image/') || /\.(png|jpe?g|gif)$/i.test(attachment.file.name)) ? (
                              <img
                                src={URL.createObjectURL(attachment.file)}
                                alt={attachment.file.name}
                                loading="lazy"
                                className="h-10 w-10 rounded object-cover border"
                                onLoad={(e) => {
                                  try {
                                    const img = e.currentTarget as HTMLImageElement;
                                    URL.revokeObjectURL(img.src);
                                  } catch { }
                                }}
                              />
                            ) : ((attachment.file.type === 'application/pdf' || /\.(pdf)$/i.test(attachment.file.name)) ? (
                              <div className="flex items-center justify-center h-10 w-10 rounded border bg-gray-50">
                                <span className="text-[10px] font-vazirmatn text-gray-700">PDF</span>
                              </div>
                            ) : (
                              <FileText className="h-5 w-5 text-green-500" />
                            ))}
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
                            onClick={() => removeNewAttachment(attachment.id)}
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

          <div className='space-y-4' id='personal-info'>
            <Card>
              <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
                المعلومات الجسدية
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='w-full flex flex-col sm:flex-row items-center justify-center gap-2'>
                  <div className='flex-1 w-full'>
                    <FormField
                      control={control}
                      name="hight"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                              value={field.value || 0}
                              placeholder="الطول"
                              className="bg-searchBg rounded-xl w-full font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                      name="width"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                              value={field.value || 0}
                              placeholder="الوزن"
                              className="bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                            <SelectItem value="thin">مقبول</SelectItem>
                            <SelectItem value="average">مرفوض</SelectItem>
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
              <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
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
                              className="size-8 rounded-md bg-searchBg border-none data-[state=checked]:bg-primary/20"
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
                              className="size-8 rounded-md bg-searchBg border-none data-[state=checked]:bg-primary/20"
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
                              className="size-8 rounded-md bg-searchBg border-none data-[state=checked]:bg-primary/20"
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
                              className="size-8 rounded-md bg-searchBg border-none data-[state=checked]:bg-primary/20"
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
              <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
                معلومات الدورة والاشتراك
              </CardHeader>

              <CardContent className='flex flex-col sm:flex-row items-center gap-2'>
                <div className='flex-1 w-full'>
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
                              {subscriptionOptions?.map((subscription) => (
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
              </CardContent>
            </Card>

            <Card className='px-3 py-4'>
              <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
                المهارات
              </CardHeader>
              <CardContent className='bg-searchBg p-4 rounded-xl'>
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
                              {skillOptions.map((skill) => (
                                <div key={skill.value} className="flex items-center space-x-2 space-x-reverse py-2">
                                  <Checkbox
                                    id={`skill-${skill.value}`}
                                    checked={field.value?.includes(skill.value) || false}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || [];
                                      if (checked) {
                                        if (!currentValues.includes(skill.value)) {
                                          field.onChange([...currentValues, skill.value]);
                                        }
                                      } else {
                                        field.onChange(currentValues.filter((value) => value !== skill.value));
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

            <Card className='px-3 py-4'>
              <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
                الدورات
              </CardHeader>
              <CardContent className='bg-searchBg p-4 rounded-xl'>
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
                              {trainingCourseOptions.map((trainingCourse) => (
                                <div key={trainingCourse.value} className="flex items-center space-x-2 space-x-reverse py-2">
                                  <Checkbox
                                    id={`trainingCourse-${trainingCourse.value}`}
                                    checked={field.value?.includes(trainingCourse.value) || false}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || [];
                                      if (checked) {
                                        if (!currentValues.includes(trainingCourse.value)) {
                                          field.onChange([...currentValues, trainingCourse.value]);
                                        }
                                      } else {
                                        field.onChange(currentValues.filter((value) => value !== trainingCourse.value));
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
        <div className='absolute bottom-0 left-0 right-0'>
          <div className='w-full text-left bg-white sticky px-4 py-2 -bottom-6 flex justify-end items-center gap-4'>
            <Button
              className='bg-transparent font-vazirmatn px-6 h-8 text-black w-full sm:w-auto'
              type='button'
              onClick={() => router.push('/students')}
              variant="outline"
            >
              الغاء
            </Button>
            <Button
              className='bg-sidebaractive font-vazirmatn px-6 h-8 text-white w-full sm:w-auto'
              type='submit'
              disabled={isUpdateStudentLoading}
              onClick={form.handleSubmit(onSubmit)}
            >
              {isUpdateStudentLoading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  )
}

export default EditStudentForm
