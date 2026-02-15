'use client';
import React, { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import BirthdayDate from '@/components/pages/employees/add-employe/birthday-date';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import trash from '@/public/employees/TrashBin.svg';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useGetEmployeesQuery } from '@/services/employe';
import { useGetStudentsQuery } from '@/services/students';
import { useCreateCourseMutation, CourseTrainerStudent } from '@/services/courses';
import { useGetTypesQuery } from '@/services/types';
import { toast } from '@/hooks/use-toast';

// Updated schema to match new API structure
const addCoursesSchema = z.object({
  character: z.string().min(1, { message: 'يجب إدخال الحرف' }),
  typeId: z.string().min(1, { message: 'يجب إدخال نوع الدورة' }),
  startDate: z.string().min(1, { message: 'يجب إدخال تاريخ بداية الدورة' })
});

// Interface for trainer with students
interface TrainerWithStudents {
  trainerId: string;
  trainerName: string;
  students: {
    studentId: string;
    studentName: string;
    studentCode: string;
  }[];
}

export default function AddCoursesForm() {
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
    data: students,
    isLoading: isLoadingStudents,
    isError: isErrorStudents,
    isSuccess: isSuccessStudents
  } = useGetStudentsQuery({
    pageNumber: 1,
    pageSize: 100
  });
  const {
    data: types,
    isLoading: isLoadingTypes,
    isError: isErrorTypes,
    isSuccess: isSuccessTypes
  } = useGetTypesQuery({
    pageNumber: 1,
    pageSize: 100
  });

  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();

  // State management
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>('');
  const [selectedTrainerName, setSelectedTrainerName] = useState<string>('');
  const [addedTrainers, setAddedTrainers] = useState<TrainerWithStudents[]>([]);
  const [activeTrainerId, setActiveTrainerId] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<{ [trainerId: string]: string[] }>({});

  const form = useForm<z.infer<typeof addCoursesSchema>>({
    resolver: zodResolver(addCoursesSchema),
    defaultValues: {
      character: '',
      typeId: '',
      startDate: ''
    }
  });

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors }
  } = form;

  // Watch character field for student code generation
  const characterValue = watch('character');

  // Prepare trainers list
  let trainers: any = [];
  let studentsList: any = [];
  let trainingCoursesList: any = [];

  if (isSuccessEmployees) {
    trainers = employees?.result?.data
      ?.filter(item => item.employeeTypeName === 'مدرب')
      .map(item => ({
        value: item.id,
        label: item.name
      }));
  }

  if (isSuccessStudents) {
    studentsList = students?.result?.data?.map(item => ({
      value: item.uniqueID,
      label: item.name
    }));
  }

  if (isSuccessTypes) {
    trainingCoursesList = types?.result?.data?.map(item => ({
      value: item.uniqueID,
      label: item.name
    }));
  }

  // Get students that are already assigned to any trainer
  const assignedStudentIds = addedTrainers.flatMap(trainer => trainer.students.map(s => s.studentId));

  // Filter available students (not yet assigned)
  const availableStudents = studentsList.filter((student: any) => !assignedStudentIds.includes(student.value));

  // Handle adding trainer
  const handleAddTrainer = () => {
    if (!selectedTrainerId || !selectedTrainerName) {
      toast({
        title: 'خطأ',
        description: 'يجب اختيار مدرب',
        variant: 'destructive'
      });
      return;
    }

    // Check if trainer already added
    if (addedTrainers.some(t => t.trainerId === selectedTrainerId)) {
      toast({
        title: 'خطأ',
        description: 'تم إضافة هذا المدرب مسبقاً',
        variant: 'destructive'
      });
      return;
    }

    setAddedTrainers([
      ...addedTrainers,
      {
        trainerId: selectedTrainerId,
        trainerName: selectedTrainerName,
        students: []
      }
    ]);

    setSelectedTrainerId('');
    setSelectedTrainerName('');

    toast({
      title: 'تم الإضافة',
      description: `تم إضافة المدرب ${selectedTrainerName}`
    });
  };

  // Handle removing trainer
  const handleRemoveTrainer = (trainerId: string) => {
    setAddedTrainers(addedTrainers.filter(t => t.trainerId !== trainerId));

    // Remove selected students for this trainer
    const newSelectedStudents = { ...selectedStudents };
    delete newSelectedStudents[trainerId];
    setSelectedStudents(newSelectedStudents);

    if (activeTrainerId === trainerId) {
      setActiveTrainerId(null);
    }

    toast({
      title: 'تم الحذف',
      description: 'تم حذف المدرب'
    });
  };

  // Generate student code
  const generateStudentCode = (studentName: string, trainerName: string, studentCount: number): string => {
    const charFirstLetter = characterValue ? characterValue.charAt(0) : '';
    const trainerFirstLetter = trainerName ? trainerName.charAt(0) : '';
    const studentFirstLetter = studentName ? studentName.charAt(0) : '';
    return `${charFirstLetter}${trainerFirstLetter}${studentFirstLetter}${studentCount + 1}`;
  };

  // Handle student checkbox change
  const handleStudentToggle = (studentId: string, studentName: string, checked: boolean) => {
    if (!activeTrainerId) return;

    const trainer = addedTrainers.find(t => t.trainerId === activeTrainerId);
    if (!trainer) return;

    const updatedTrainers = addedTrainers.map(t => {
      if (t.trainerId === activeTrainerId) {
        if (checked) {
          // Add student
          const studentCode = generateStudentCode(studentName, t.trainerName, t.students.length);
          return {
            ...t,
            students: [...t.students, { studentId, studentName, studentCode }]
          };
        } else {
          // Remove student
          return {
            ...t,
            students: t.students.filter(s => s.studentId !== studentId)
          };
        }
      }
      return t;
    });

    setAddedTrainers(updatedTrainers);
  };

  // Check if student is assigned to active trainer
  const isStudentAssignedToActiveTrainer = (studentId: string): boolean => {
    if (!activeTrainerId) return false;
    const trainer = addedTrainers.find(t => t.trainerId === activeTrainerId);
    return trainer?.students.some(s => s.studentId === studentId) || false;
  };

  // Form submission
  const onSubmit = handleSubmit(async data => {
    // Validate that at least one trainer with students is added
    if (addedTrainers.length === 0) {
      toast({
        title: 'خطأ',
        description: 'يجب إضافة مدرب واحد على الأقل',
        variant: 'destructive'
      });
      return;
    }

    const hasStudents = addedTrainers.some(trainer => trainer.students.length > 0);
    if (!hasStudents) {
      toast({
        title: 'خطأ',
        description: 'يجب إضافة طلاب للمدربين',
        variant: 'destructive'
      });
      return;
    }

    // Build costtr array - each student gets its own object
    const costtr: CourseTrainerStudent[] = [];
    addedTrainers.forEach(trainer => {
      trainer.students.forEach(student => {
        costtr.push({
          studentId: student.studentId,
          trainerId: trainer.trainerId,
          studentCode: student.studentCode
        });
      });
    });

    // Prepare final payload
    const payload = {
      character: data.character,
      startDate: new Date(data.startDate).toISOString(),
      typeId: data.typeId,
      costtr
    };

    try {
      const result = await createCourse(payload).unwrap();

      if (result.isSuccess) {
        toast({
          title: 'نجح',
          description: `تم إضافة الدورة ${result.result.character} بنجاح`
        });

        // Reset form
        form.reset();
        setAddedTrainers([]);
        setActiveTrainerId(null);
        setSelectedStudents({});
        setSelectedTrainerId('');
        setSelectedTrainerName('');
      } else {
        toast({
          title: 'خطأ',
          description: result.errorMessages.join(', '),
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error?.data?.errorMessages?.join(', ') || 'حدث خطأ أثناء إضافة الدورة',
        variant: 'destructive'
      });
    }
  });

  return (
    <div className="scroll-smooth">
      <Form {...form}>
        <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-4">
          {/* Left Column - Basic Information & Trainer */}
          <div className="space-y-4" id="Basic information">
            {/* Basic Information Card */}
            <Card>
              <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
                المعلومات الاساسية
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2">
                  <div className="flex-1 w-full">
                    <FormField
                      control={control}
                      name="character"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="حرف الدورة"
                              className="bg-searchBg rounded-xl w-full  font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                      name="typeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="w-full justify-between bg-searchBg rounded-xl font-vazirmatn font-normal border-none hover:bg-searchBg focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                                <SelectValue placeholder="نوع الدورة" />
                              </SelectTrigger>
                              <SelectContent>
                                {trainingCoursesList.map((item: { value: string; label: string }) => (
                                  <SelectItem key={item.value} value={item.value}>
                                    {item.label}
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
                </div>

                <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2">
                  <div className="flex-1 w-full">
                    <FormField
                      control={control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            {/* <Input
                              {...field}
                              type="date"
                              placeholder="تاريخ البدء"
                              className="bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            /> */}
                            <BirthdayDate placeholder="تاريخ البدء" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trainer Selection Card */}
            <Card className="px-4 py-3" id="trainer">
              <CardContent className="p-0 space-y-4">
                <Select
                  value={selectedTrainerId}
                  onValueChange={value => {
                    setSelectedTrainerId(value);
                    const trainer = trainers.find((t: any) => t.value === value);
                    setSelectedTrainerName(trainer?.label || '');
                  }}
                >
                  <SelectTrigger className="w-full justify-between bg-searchBg rounded-xl font-vazirmatn font-normal border-none hover:bg-searchBg focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                    <SelectValue placeholder="أختر المدرب" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainers.map((item: any) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedTrainerName && (
                  <div className="font-vazirmatn flex items-center justify-between">
                    <p className="text-collapsTxtClr">اسم المدرب المختار: {selectedTrainerName}</p>
                    <Button
                      type="button"
                      onClick={handleAddTrainer}
                      variant="outline"
                      className="btn-border-clr bg-[#8870E733]/20 font-vazirmatn font-normal text-md text-sidebaractive py-1 px-6 h-9 hover:bg-[#8870E733]/40"
                    >
                      أضافة
                    </Button>
                  </div>
                )}

                {/* Trainers Table */}
                {addedTrainers.length > 0 && (
                  <div className="mt-4 space-y-4">
                    <div className="bg-trainerTableBg rounded-xl px-4 py-2 flex items-center gap-36 font-vazirmatn text-sm">
                      <span className=" text-trainerTableHeaderTxt text-[15px]">اسم المدرب</span>
                      <span className="text-trainerTableHeaderTxt text-[15px]">عدد الطلاب</span>
                      <span className="w-10"></span>
                    </div>
                    {addedTrainers.map(trainer => (
                      <div
                        key={trainer.trainerId}
                        className={cn(
                          'bg- px-4 py-3 flex items-center justify-between rounded-xl hover:bg-searchBg font-vazirmatn text-sm  border-searchBg cursor-pointer transition-colors',
                          activeTrainerId === trainer.trainerId && 'bg-[#8870E733]/20'
                        )}
                        onClick={() => setActiveTrainerId(trainer.trainerId)}
                      >
                        <div className=" flex items-center gap-40">
                          <span className=" text-collapsTxtClr text-[17px]">{trainer.trainerName}</span>
                          <div className=" w-14 h-8 border rounded-xl border-[#F5F4F4] flex justify-center items-center">
                            <p className=" text-collapsTxtClr">{trainer.students.length}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="w-10 h-8 p-0 hover:bg-transparent"
                          onClick={e => {
                            e.stopPropagation();
                            handleRemoveTrainer(trainer.trainerId);
                          }}
                        >
                          <Image src={trash} alt="trash" className="w-4 h-4 text-deleteTxt" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Students List */}
          <div className="space-y-4">
            <Card className="px-4 py-3">
              <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-0 py-2">الطلاب</CardHeader>
              <CardContent className="p-0 space-y-2">
                {/* Search Input */}
                <div className="relative">
                  <Input
                    placeholder="بحث ..."
                    className="bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                {/* Students Checkboxes */}
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {!activeTrainerId ? (
                    <p className="text-subtext text-sm font-vazirmatn text-center py-4">
                      اختر مدرب من القائمة لإضافة الطلاب
                    </p>
                  ) : availableStudents.length === 0 &&
                    !addedTrainers.find(t => t.trainerId === activeTrainerId)?.students.length ? (
                    <p className="text-subtext text-sm font-vazirmatn text-center py-4">لا يوجد طلاب متاحين</p>
                  ) : (
                    <>
                      {/* Show students assigned to active trainer */}
                      {addedTrainers
                        .find(t => t.trainerId === activeTrainerId)
                        ?.students.map(student => (
                          <div
                            key={student.studentId}
                            className="flex items-center border border-[#8870E733/20%] space-x-2 space-x-reverse  rounded-xl px-2 py-2"
                          >
                            <Checkbox
                              id={`student-${student.studentId}`}
                              checked={true}
                              onCheckedChange={checked =>
                                handleStudentToggle(student.studentId, student.studentName, checked as boolean)
                              }
                            />
                            <label
                              htmlFor={`student-${student.studentId}`}
                              className="flex-1 text-sm font-vazirmatn cursor-pointer text-studentCheckboxClr text-[14px] flex items-center gap-1 justify-between"
                            >
                              <p>{student.studentName}</p>
                              <Badge className="text-[12px] text-white bg-[#8870E7] px-3 rounded-lg font-vazirmatn">
                                {student.studentCode}
                              </Badge>
                            </label>
                          </div>
                        ))}

                      {/* Show available students */}
                      {availableStudents.map((student: any) => (
                        <div
                          key={student.value}
                          className="flex items-center border border-[#8870E733/20%] space-x-2 space-x-reverse  rounded-xl px-2 py-2"
                        >
                          <Checkbox
                            id={`student-${student.value}`}
                            className=" border-[2px] border-[#A3A2AA]"
                            checked={isStudentAssignedToActiveTrainer(student.value)}
                            onCheckedChange={checked =>
                              handleStudentToggle(student.value, student.label, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`student-${student.value}`}
                            className="flex-1 text-sm font-vazirmatn cursor-pointer text-studentCheckboxClr text-[14px] "
                          >
                            {student.label}
                          </label>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                disabled={isCreating}
                className="flex-1 bg-sidebaractive hover:bg-sidebaractive text-white font-vazirmatn rounded-xl"
              >
                {isCreating ? 'جاري الحفظ...' : 'حفظ'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setAddedTrainers([]);
                  setActiveTrainerId(null);
                  setSelectedStudents({});
                  setSelectedTrainerId('');
                  setSelectedTrainerName('');
                }}
                className="flex-1 font-vazirmatn rounded-xl"
              >
                الغاء
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
