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
import React, { useEffect, useState } from 'react';
import { useGetAccidentByIdQuery, useUpdateAccidentMutation } from '@/services/accident';
import { useGetActivitiesQuery } from '@/services/activity';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useGetEmployeesQuery } from '@/services/employe';
import { useGetCoStTrQuery } from '@/services/CoStTr';
import { useGetCoursesQuery } from '@/services/courses';
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from '@radix-ui/react-checkbox';
import { Skeleton } from '@/components/ui/skeleton';


const EditAccidentFormSchema = z.object({
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
        message: 'وقت السقوط الحر مطلوب'
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
    trainer1Id: z.string().optional(),
    trainer1Note: z.string().optional(),
    trainer2Id: z.string().optional(),
    trainer2Note: z.string().optional(),
    trainer3Id: z.string().optional(),
    trainer3Note: z.string().optional(),
    finalReport: z.string().optional(),
    committeeMembers: z.array(z.string()).optional()
});

export default function EditAccidentForm({ accidentId }: { accidentId: string }) {
    const router = useRouter();

    // State for tracking committee members changes
    const [originalCommitteeMembers, setOriginalCommitteeMembers] = useState<string[]>([]);
    const [committeeMemberMapping, setCommitteeMemberMapping] = useState<Record<string, string>>({});
    const [loadedAccidentId, setLoadedAccidentId] = useState<string | null>(null);
    const [isCascadingDataReady, setIsCascadingDataReady] = useState(false);

    // Reset state when accidentId changes (navigating to different accident)
    useEffect(() => {
        setOriginalCommitteeMembers([]);
        setCommitteeMemberMapping({});
        setLoadedAccidentId(null);
        setIsCascadingDataReady(false);
    }, [accidentId]);

    // Fetch accident data
    const {
        data: accidentResponse,
        isLoading: isLoadingAccident,
        isError: isErrorAccident,
    } = useGetAccidentByIdQuery(
        { id: accidentId },
        { refetchOnMountOrArgChange: true }
    );
    console.log(accidentResponse);

    // Fetch employees
    const {
        data: employees,
        isLoading: isLoadingEmployees,
        isSuccess: isSuccessEmployees
    } = useGetEmployeesQuery({
        pageNumber: 1,
        pageSize: 100
    });

    // Fetch courses
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
        data: coStTr,
        isLoading: isLoadingCoStTr,
        isError: isErrorCoStTr,
        isSuccess: isSuccessCoStTr
    } = useGetCoStTrQuery({
        pageNumber: 1,
        pageSize: 100
    });

    // Fetch activities
    const {
        data: activities,
        isLoading: isLoadingActivities,
        isSuccess: isSuccessActivities
    } = useGetActivitiesQuery({
        pageNumber: 1,
        pageSize: 100
    });

    // Update mutation
    const [updateAccident, { isLoading: isUpdating }] = useUpdateAccidentMutation();

    // Format employees data
    let employeesData: any = [];
    if (isSuccessEmployees) {
        employeesData = employees?.result?.data
            ?.filter(item => item.employeeTypeName === 'إداري')
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

    // let activitiesData: any = [];
    // if (isSuccessActivities) {
    //     activitiesData = activities?.result?.data?.map(item => ({
    //         value: item.uniqueID,
    //         label: item.courseName
    //     }));
    // }

    let coursesData: any = [];
    if (isSuccessCourses) {
        coursesData = courses?.result?.data?.map(item => ({
            value: item.uniqueID,
            label: item.character
        }));
    }

    const form = useForm<z.infer<typeof EditAccidentFormSchema>>({
        resolver: zodResolver(EditAccidentFormSchema),
        defaultValues: {
            course: '',
            co_St_TrId: '',
            activityId: '',
            jumperCount: undefined,
            freefallTime: undefined,
            freefallAltitude: undefined,
            deployAltitude: undefined,
            exitAltitude: undefined,
            landings: '',
            typeOfJump: '',
            trainer1Id: '',
            trainer1Note: '',
            trainer2Id: '',
            trainer2Note: '',
            trainer3Id: '',
            trainer3Note: '',
            finalReport: '',
            committeeMembers: []
        }
    });

    // Watch the course field to enable/disable student select and populate options
    const selectedCourseId = useWatch({
        control: form.control,
        name: 'course'
    });

    // Find the selected course and extract its participants
    let coStTrData: any = [];
    if (selectedCourseId && isSuccessCourses && courses?.result?.data) {
        const selectedCourse = courses.result.data.find((course: any) => course.uniqueID === selectedCourseId);
        if (selectedCourse && selectedCourse.participants) {
            coStTrData = selectedCourse.participants.map((participant: any) => ({
                value: participant.co_St_TrId,
                label: participant.studentName
            }));
        }
    }

    // Watch the activity field to enable/disable student select
    const selectedActivityId = useWatch({
        control: form.control,
        name: 'activityId'
    });

    // Memoize activitiesData to prevent recalculation on every render
    const activitiesData = React.useMemo(() => {
        let data: any = [];
        if (selectedCourseId && isSuccessActivities) {
            data = activities?.result?.data
                ?.filter(item => item.courseId === selectedCourseId)
                .map(item => ({
                    value: item.uniqueID,
                    label: `${item.courseName} - ${item.date}`
                })) || [];
        }
        return data;
    }, [selectedCourseId, isSuccessActivities, activities?.result?.data]);

    // Memoize studentsData to prevent recalculation on every render
    const studentsData = React.useMemo(() => {
        let data: any = [];
        if (selectedActivityId && isSuccessActivities && activities?.result?.data && isSuccessCoStTr) {
            const selectedActivity = activities.result.data.find(
                (activity: any) => activity.uniqueID === selectedActivityId
            );
            if (selectedActivity && selectedActivity.jumpers && coStTr?.result?.data) {
                data = selectedActivity.jumpers.map((jumper: any) => {
                    // Find the matching CoStTr record to get student name
                    const coStTrRecord = coStTr.result.data.find(
                        (record: any) => record.uniqueID === jumper.co_St_TrId
                    );
                    return {
                        value: jumper.co_St_TrId,
                        label: coStTrRecord?.studentName || jumper.co_St_TrId
                    };
                });
            }
        }
        return data;
    }, [selectedActivityId, isSuccessActivities, activities?.result?.data, isSuccessCoStTr, coStTr?.result?.data]);




    // Reset student selection when course changes (except during initial load)
    useEffect(() => {
        if (loadedAccidentId) {
            form.setValue('co_St_TrId', '');
        }
    }, [selectedCourseId, form, loadedAccidentId]);

    // Phase 1: Prefill form with accident data (set form values)
    useEffect(() => {
        if (
            accidentResponse?.isSuccess &&
            accidentResponse.result &&
            accidentResponse.result.id === accidentId &&
            loadedAccidentId !== accidentId &&
            isSuccessCourses &&
            isSuccessActivities &&
            isSuccessEmployees &&
            isSuccessCoStTr
        ) {
            const accident = accidentResponse.result;

            // Extract committee member IDs
            const committeeMemberIds = accident.committeeMembers.map(member => member.employeeId);
            setOriginalCommitteeMembers(committeeMemberIds);

            // Map employeeId to the actual committee member record id for deletion
            const mapping: Record<string, string> = {};
            accident.committeeMembers.forEach(member => {
                mapping[member.employeeId] = member.id;
            });
            setCommitteeMemberMapping(mapping);

            // Find the course that contains this student/activity
            let courseId = '';
            if (isSuccessActivities && activities?.result?.data) {
                const activity = activities.result.data.find(a => a.uniqueID === accident.activityId);
                courseId = activity?.courseId || '';
            }

            // Fallback: If activity doesn't have courseId, try finding it in courses (original logic as backup)
            if (!courseId && isSuccessCourses && courses?.result?.data) {
                const courseWithStudent = courses.result.data.find((course: any) =>
                    course.participants?.some((p: any) => p.co_St_TrId === accident.co_St_TrId)
                );
                courseId = courseWithStudent?.uniqueID || '';
            }

            // Reset form with accident data
            form.reset({
                course: courseId,
                co_St_TrId: accident.co_St_TrId || '',
                activityId: accident.activityId || '',
                jumperCount: accident.jumperCount,
                freefallTime: accident.freefallTime,
                freefallAltitude: accident.freefallAltitude,
                deployAltitude: accident.deployAltitude,
                exitAltitude: accident.exitAltitude,
                landings: accident.landings || '',
                typeOfJump: accident.typeOfJump || '',
                trainer1Id: accident.trainer1Id || '',
                trainer1Note: accident.trainer1Note || '',
                trainer2Id: accident.trainer2Id || '',
                trainer2Note: accident.trainer2Note || '',
                trainer3Id: accident.trainer3Id || '',
                trainer3Note: accident.trainer3Note || '',
                finalReport: accident.finalReport || '',
                committeeMembers: committeeMemberIds
            });

            // Set loadedAccidentId AFTER resetting form as a fallback if cascading data check fails
            // But we still prefer cascading data check for UI consistency
            setIsCascadingDataReady(false);
        }
    }, [accidentResponse, form, loadedAccidentId, accidentId, isSuccessCourses, isSuccessActivities, isSuccessEmployees, isSuccessCoStTr, courses, activities]);

    // Phase 2: Verify cascading data is ready and mark form as loaded
    useEffect(() => {
        // Safety timeout to prevent infinite loading if cascading data never becomes "ready"
        const safetyTimeout = setTimeout(() => {
            if (accidentResponse?.result && loadedAccidentId !== accidentId) {
                console.warn('EditAccidentForm: Safety timeout triggered. Marking form ready despite cascading data state.');
                setIsCascadingDataReady(true);
                setLoadedAccidentId(accidentId);
            }
        }, 3000);

        // Only run after form values are set but before marking ready
        if (
            loadedAccidentId !== accidentId &&
            accidentResponse?.result &&
            !isCascadingDataReady &&
            accidentResponse.result.id === accidentId
        ) {
            const accident = accidentResponse.result;

            // Check if cascading data has been computed correctly
            const hasMatchingActivity = activitiesData.length > 0 && activitiesData.some(
                (activity: any) => activity.value === accident.activityId
            );

            // Check if student data is available AND contains the student we're looking for
            const hasMatchingStudent = selectedActivityId === accident.activityId &&
                studentsData.length > 0 &&
                studentsData.some((student: any) => student.value === accident.co_St_TrId);

            // Only mark ready when cascading data is available
            if (hasMatchingActivity && hasMatchingStudent) {
                clearTimeout(safetyTimeout);

                // Force update the co_St_TrId field to ensure Select recognizes the value
                const currentCoStTrId = accident.co_St_TrId;
                setTimeout(() => {
                    form.setValue('co_St_TrId', currentCoStTrId, {
                        shouldValidate: false,
                        shouldDirty: false,
                        shouldTouch: false
                    });
                }, 50);

                setIsCascadingDataReady(true);
                setLoadedAccidentId(accidentId);
            }
        }

        return () => clearTimeout(safetyTimeout);
    }, [selectedCourseId, selectedActivityId, activitiesData, studentsData, accidentResponse, loadedAccidentId, accidentId, isCascadingDataReady]);

    const onSubmit = async (values: z.infer<typeof EditAccidentFormSchema>) => {
        try {
            const currentCommitteeMembers = values.committeeMembers || [];

            // Calculate members to add (in current but not in original)
            const committeeMembersToAdd = currentCommitteeMembers
                .filter(memberId => !originalCommitteeMembers.includes(memberId))
                .map(employeeId => ({ employeeId }));

            // Calculate members to delete (in original but not in current)
            // We need to send the record ID, not the employee ID
            const committeeMembersToDelete = originalCommitteeMembers
                .filter(memberId => !currentCommitteeMembers.includes(memberId))
                .map(employeeId => committeeMemberMapping[employeeId])
                .filter(id => !!id);

            // Prepare update request
            const requestData = {
                id: accidentId,
                co_St_TrId: values.co_St_TrId,
                activityId: values.activityId,
                jumperCount: Number(values.jumperCount),
                freefallTime: Number(values.freefallTime),
                freefallAltitude: Number(values.freefallAltitude),
                deployAltitude: Number(values.deployAltitude),
                exitAltitude: Number(values.exitAltitude),
                landings: values.landings,
                typeOfJump: values.typeOfJump,
                trainer1Id: values.trainer1Id || null,
                trainer1Note: values.trainer1Note || null,
                trainer2Id: values.trainer2Id || null,
                trainer2Note: values.trainer2Note || null,
                trainer3Id: values.trainer3Id || null,
                trainer3Note: values.trainer3Note || null,
                finalReport: values.finalReport || '',
                committeeMembersToAdd,
                committeeMembersToDelete
            };

            const response = await updateAccident(requestData).unwrap();

            if (response.isSuccess) {
                toast({
                    title: 'تم تحديث الحادث بنجاح',
                    description: 'تم تحديث بيانات الحادث',
                    variant: 'default'
                });
                router.push('/accidents');
            } else {
                toast({
                    title: 'فشل في تحديث الحادث',
                    description: response.errorMessages.join(', '),
                    variant: 'destructive'
                });
            }
        } catch (error: any) {
            // Extract error messages from ASP.NET Core validation errors
            let errorMessages: string[] = ['حدث خطأ أثناء تحديث الحادث'];

            if (error?.data?.errors) {
                // Convert errors object to array of messages
                errorMessages = Object.values(error.data.errors).flat() as string[];
            } else if (error?.data?.errorMessages) {
                // Handle custom errorMessages format
                errorMessages = error.data.errorMessages;
            }

            toast({
                title: 'فشل في تحديث الحادث',
                description: errorMessages.join(', '),
                variant: 'destructive'
            });
        }
    };

    // Error state - check this FIRST to avoid infinite loading on error
    const hasAnyError = isErrorAccident || isErrorCourses || isErrorCoStTr || isErrorCourses || (isSuccessActivities === false && !isLoadingActivities);

    if (hasAnyError) {
        return (
            <div className="max-w-5xl mx-auto">
                <Card>
                    <CardContent className="py-8 text-center text-vazirmatn">
                        <p className="text-deleteTxt ">حدث خطأ أثناء تحميل بعض البيانات المطلوبة</p>
                        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>إعادة المحاولة</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Loading state - wait for all data to be loaded AND form to be populated
    const isLoading = isLoadingAccident || isLoadingEmployees || isLoadingCourses || isLoadingActivities || isLoadingCoStTr;
    const isFormReady = loadedAccidentId === accidentId;

    if (isLoading || !isFormReady) {
        return (
            <div className="space-y-4">

                <div className="max-w-5xl mx-auto">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                    </Card>
                </div>
                <div className="max-w-5xl mx-auto">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div>
            <DevTool control={form.control} placement="top-left" />
            <form onSubmit={form.handleSubmit(onSubmit)} className=' space-y-4'>
                <div className=" max-w-5xl mx-auto">
                    <Card>
                        <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
                            المعلومات الاساسية
                        </CardHeader>
                        <CardContent className=" grid grid-cols-2 gap-4">
                            <FieldGroup>
                                <Controller
                                    key={`course-${accidentId}`}
                                    name="course"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                            <Label htmlFor="form-rhf-select-language" className="font-vazirmatn text-[14px] mb-2 block">اسم الدورة</Label>
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
                                    key={`co_St_TrId-${accidentId}-${selectedActivityId}-${studentsData.length}`}
                                    name="co_St_TrId"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                            <Label htmlFor="form-rhf-select-student" className="font-vazirmatn text-[14px] mb-2 block">اسم الطالب</Label>
                                            <Select
                                                name={field.name}
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                disabled={!selectedCourseId}
                                            >
                                                <SelectTrigger
                                                    id="form-rhf-select-student"
                                                    aria-invalid={fieldState.invalid}
                                                    disabled={!selectedCourseId}
                                                    className="char-select min-w-[120px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <SelectValue placeholder={selectedCourseId ? "اختر الطالب" : "اختر الدورة أولاً"} />
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
                                            <Label htmlFor="freefallTime" className="font-vazirmatn text-[14px] mb-2 block">وقت السقوط الحر</Label>
                                            <Input
                                                {...field}
                                                id="freefallTime"
                                                type="number"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="أدخل وقت السقوط الحر"
                                                autoComplete="off"
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                                            <Label htmlFor="landings" className="font-vazirmatn text-[14px] mb-2 block">موقع الهبوط</Label>
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
                                            <Label htmlFor="jumperCount" className="font-vazirmatn text-[14px] mb-2 block">عدد القفزات</Label>
                                            <Input
                                                {...field}
                                                id="jumperCount"
                                                type="number"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="أدخل عدد القفزات"
                                                autoComplete="off"
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                                    key={`activityId-${accidentId}-${selectedCourseId}`}
                                    name="activityId"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                            <Label htmlFor="form-rhf-select-activity" className="font-vazirmatn text-[14px] mb-2 block">النشاط</Label>
                                            <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger
                                                    id="form-rhf-select-activity"
                                                    aria-invalid={fieldState.invalid}
                                                    className="char-select min-w-[120px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                >
                                                    <SelectValue placeholder="اختر النشاط" />
                                                </SelectTrigger>
                                                <SelectContent drop-shadow-lg>
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
                                            <Label htmlFor="freefallAltitude" className="font-vazirmatn text-[14px] mb-2 block">ارتفاع السقوط الحر</Label>
                                            <Input
                                                {...field}
                                                id="freefallAltitude"
                                                type="number"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="أدخل ارتفاع السقوط الحر"
                                                autoComplete="off"
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                                            <Label htmlFor="exitAltitude" className="font-vazirmatn text-[14px] mb-2 block">ارتفاع الخروج من الطائرة</Label>
                                            <Input
                                                {...field}
                                                id="exitAltitude"
                                                type="number"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="أدخل ارتفاع الخروج من الطائرة"
                                                autoComplete="off"
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                                            <Label htmlFor="typeOfJump" className="font-vazirmatn text-[14px] mb-2 block">نوع القفز</Label>
                                            <Input
                                                {...field}
                                                id="typeOfJump"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="أدخل نوع القفز"
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
                                    name="deployAltitude"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <Label htmlFor="deployAltitude" className="font-vazirmatn text-[14px] mb-2 block">ارتفاع فتح المظلة</Label>
                                            <Input
                                                {...field}
                                                id="deployAltitude"
                                                type="number"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="أدخل ارتفاع فتح المظلة"
                                                autoComplete="off"
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                                value={field.value || ''}
                                                className="  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                        </CardContent>
                    </Card>
                </div>

                <div className='max-w-5xl mx-auto'>
                    <Card>
                        <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
                            المدربين
                        </CardHeader>
                        <CardContent className=' grid grid-cols-2 gap-2'>

                            <Controller
                                key={`trainer1Id-${accidentId}`}
                                name="trainer1Id"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field orientation="responsive" data-invalid={fieldState.invalid} className="col-start-1">
                                        <Label htmlFor="trainer1Id" className="font-vazirmatn text-[14px]  block">المدرب 1</Label>
                                        <Select
                                            value={field.value || ""}
                                            onValueChange={(value) => field.onChange(value)}
                                        >
                                            <SelectTrigger
                                                id="trainer1Id"
                                                className="char-select  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                                            >
                                                <SelectValue placeholder="اختر المدرب 1" />
                                            </SelectTrigger>
                                            <SelectContent>
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
                                        <Label htmlFor="trainer1Note" className="font-vazirmatn text-[14px]  block">ملاحظات المدرب 1</Label>
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
                                key={`trainer2Id-${accidentId}`}
                                name="trainer2Id"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field orientation="responsive" data-invalid={fieldState.invalid} className="col-start-1">
                                        <Label htmlFor="trainer2Id" className="font-vazirmatn text-[14px]  block">المدرب 2</Label>
                                        <Select
                                            value={field.value || ""}
                                            onValueChange={(value) => field.onChange(value)}

                                        >
                                            <SelectTrigger
                                                id="trainer2Id"
                                                className="char-select  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                                            >
                                                <SelectValue placeholder="اختر المدرب 2" />
                                            </SelectTrigger>
                                            <SelectContent>
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
                                        <Label htmlFor="trainer2Note" className="font-vazirmatn text-[14px]  block">ملاحظات المدرب 2</Label>
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
                                key={`trainer3Id-${accidentId}`}
                                name="trainer3Id"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field orientation="responsive" data-invalid={fieldState.invalid} className="col-start-1">
                                        <Label htmlFor="trainer3Id" className="font-vazirmatn text-[14px]  block">المدرب 3</Label>
                                        <Select
                                            value={field.value || ""}
                                            onValueChange={(value) => field.onChange(value)}
                                        >
                                            <SelectTrigger
                                                id="trainer3Id"
                                                className="char-select  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                                            >
                                                <SelectValue placeholder="اختر المدرب 3" />
                                            </SelectTrigger>
                                            <SelectContent>
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
                                        <Label htmlFor="trainer3Note" className="font-vazirmatn text-[14px]  block">ملاحظات المدرب 3</Label>
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

                <div className=' max-w-5xl mx-auto'>
                    <Card className=' p-4'>
                        <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
                            لجنة الحوادث
                        </CardHeader>
                        <CardContent className=' bg-searchBg p-4 rounded-xl'>
                            <Controller
                                name="committeeMembers"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <div className="space-y-2 ">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {employeesData.map((commission: any) => (
                                                <div key={commission.value} className="flex items-center space-x-2 space-x-reverse py-2">
                                                    <FieldGroup data-slot="checkbox-group">
                                                        <Field orientation="horizontal">
                                                            <Checkbox
                                                                id={`commission-${commission.value}`}
                                                                checked={field.value?.includes(commission.value) || false}
                                                                onCheckedChange={(checked) => {
                                                                    const currentValues = field.value || [];
                                                                    if (checked) {
                                                                        // Add employee to array if not already present
                                                                        if (!currentValues.includes(commission.value)) {
                                                                            field.onChange([...currentValues, commission.value]);
                                                                        }
                                                                    } else {
                                                                        // Remove employee from array
                                                                        field.onChange(currentValues.filter((id) => id !== commission.value));
                                                                    }
                                                                }}
                                                                className="size-5 rounded-sm border-2 border-[#A3A2AA] data-[state=checked]:bg-sidebaractive"
                                                            />
                                                            <FieldLabel
                                                                htmlFor={`commission-${commission.value}`}
                                                                className="font-normal"
                                                            >
                                                                {commission.label}
                                                            </FieldLabel>
                                                        </Field>
                                                    </FieldGroup>
                                                </div>
                                            ))}
                                        </div>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </div>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className=' max-w-5xl mx-auto'>
                    <Card className=' space-y-2'>
                        <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">
                            تقرير الحادث
                        </CardHeader>
                        <CardContent>
                            <Controller
                                name="finalReport"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <Label htmlFor="form-rhf-textarea-about" className="font-vazirmatn text-[14px]  block">التقرير النهائي</Label>
                                        <Textarea
                                            {...field}
                                            id="form-rhf-textarea-about"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="أدخل التقرير النهائي للحادث"
                                            className="min-h-[120px] bg-searchBg"
                                        />

                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>
                <div className=' flex items-center justify-end gap-4'>
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => router.back()}
                        className=" w-[118px] text-[14px]"
                    >
                        إلغاء
                    </Button>
                    <Button
                        type="submit"
                        disabled={isUpdating}
                        className=" w-[225px] bg-sidebaractive text-white  text-[14px]"
                    >
                        {isUpdating ? 'جاري التحديث...' : 'تحديث الحادث'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
