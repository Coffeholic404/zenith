'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { DevTool } from '@hookform/devtools';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { useGetAccidentByIdQuery, useUpdateAccidentMutation } from '@/services/accident';
import { useGetActivitiesQuery } from '@/services/activity';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useGetEmployeesQuery } from '@/services/employe';
import { useGetCoStTrQuery } from '@/services/CoStTr';
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from '@radix-ui/react-checkbox';
import { Skeleton } from '@/components/ui/skeleton';

const EditAccidentFormSchema = z.object({
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
    const [loadedAccidentId, setLoadedAccidentId] = useState<string | null>(null);

    // Fetch accident data
    const {
        data: accidentResponse,
        isLoading: isLoadingAccident,
        isError: isErrorAccident,
    } = useGetAccidentByIdQuery({
        id: accidentId
    });

    // Fetch employees
    const {
        data: employees,
        isLoading: isLoadingEmployees,
        isSuccess: isSuccessEmployees
    } = useGetEmployeesQuery({
        pageNumber: 1,
        pageSize: 100
    });

    // Fetch Co_St_Tr data
    const {
        data: coStTr,
        isLoading: isLoadingCoStTr,
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

    let activitiesData: any = [];
    if (isSuccessActivities) {
        activitiesData = activities?.result?.data?.map(item => ({
            value: item.uniqueID,
            label: item.courseName
        }));
    }

    let coStTrData: any = [];
    if (isSuccessCoStTr) {
        coStTrData = coStTr?.result?.data?.map(item => ({
            value: item.uniqueID,
            label: item.courseCharacter
        }));
    }

    const form = useForm<z.infer<typeof EditAccidentFormSchema>>({
        resolver: zodResolver(EditAccidentFormSchema),
        defaultValues: {
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

    // Prefill form with accident data
    useEffect(() => {
        if (accidentResponse?.isSuccess && accidentResponse.result && loadedAccidentId !== accidentId) {
            const accident = accidentResponse.result;

            // Extract committee member IDs
            const committeeMemberIds = accident.committeeMembers.map(member => member.employeeId);
            setOriginalCommitteeMembers(committeeMemberIds);

            // Reset form with accident data
            form.reset({
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

            setLoadedAccidentId(accidentId);
        }
    }, [accidentResponse, form, loadedAccidentId, accidentId]);

    const onSubmit = async (values: z.infer<typeof EditAccidentFormSchema>) => {
        try {
            const currentCommitteeMembers = values.committeeMembers || [];

            // Calculate members to add (in current but not in original)
            const committeeMembersToAdd = currentCommitteeMembers
                .filter(memberId => !originalCommitteeMembers.includes(memberId))
                .map(employeeId => ({ employeeId }));

            // Calculate members to delete (in original but not in current)
            const committeeMembersToDelete = originalCommitteeMembers
                .filter(memberId => !currentCommitteeMembers.includes(memberId));

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

    // Loading state
    const isLoading = isLoadingAccident || isLoadingEmployees || isLoadingCoStTr || isLoadingActivities;

    if (isLoading) {
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

    // Error state
    if (isErrorAccident) {
        return (
            <div className="max-w-5xl mx-auto">
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-deleteTxt font-vazirmatn">حدث خطأ أثناء تحميل بيانات الحادث</p>
                    </CardContent>
                </Card>
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
                                    name="co_St_TrId"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                            <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger
                                                    id="form-rhf-select-language"
                                                    aria-invalid={fieldState.invalid}
                                                    className="char-select min-w-[120px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                >
                                                    <SelectValue placeholder="اسم الدورة" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {coStTrData.map((option: { value: string; label: string }) => (
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
                                    name="freefallTime"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="col-start-1 block">
                                            <Input
                                                {...field}
                                                type="number"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="وقت السقوط الحر"
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
                                            <Input
                                                {...field}
                                                aria-invalid={fieldState.invalid}
                                                placeholder="موقع الهبوط"
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
                                        <Field data-invalid={fieldState.invalid} className="col-start-1 block">
                                            <Input
                                                {...field}
                                                type="number"
                                                aria-invalid={fieldState.invalid}
                                                placeholder=" عدد القفزات"
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
                                    name="activityId"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                            <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger
                                                    id="form-rhf-select-language"
                                                    aria-invalid={fieldState.invalid}
                                                    className="char-select min-w-[120px] bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                >
                                                    <SelectValue placeholder="النشاط" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {activitiesData.map((option: { value: string; label: string }) => (
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
                                    name="freefallAltitude"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="col-start-1 block">
                                            <Input
                                                {...field}
                                                type="number"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="ارتفاع السقوط الحر"
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
                                        <Field data-invalid={fieldState.invalid} className="col-start-1 block">
                                            <Input
                                                {...field}
                                                type="number"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="ارتفاع الخروج من الطائرة"
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
                                            <Input
                                                {...field}
                                                aria-invalid={fieldState.invalid}
                                                placeholder="نوع القفز"
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
                                        <Field data-invalid={fieldState.invalid} className="col-start-1 block">
                                            <Input
                                                {...field}
                                                type="number"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="ارتفاع فتح المظلة"
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
                                name="trainer1Id"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field orientation="responsive" data-invalid={fieldState.invalid} className="col-start-1">
                                        <Select
                                            value={field.value || ""}
                                            onValueChange={(value) => field.onChange(value)}
                                        >
                                            <SelectTrigger
                                                className="char-select  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                                            >
                                                <SelectValue placeholder="المدرب 1" />
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
                                        <Input
                                            {...field}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="ملاحظات المدرب 1"
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
                                        <Select
                                            value={field.value || ""}
                                            onValueChange={(value) => field.onChange(value)}

                                        >
                                            <SelectTrigger
                                                className="char-select  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                                            >
                                                <SelectValue placeholder="المدرب 2" />
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
                                        <Input
                                            {...field}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="ملاحظات المدرب 2"
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
                                        <Select
                                            value={field.value || ""}
                                            onValueChange={(value) => field.onChange(value)}
                                        >
                                            <SelectTrigger
                                                className="char-select  bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                                            >
                                                <SelectValue placeholder="المدرب 3" />
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
                                        <Input
                                            {...field}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="ملاحظات المدرب 3"
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
                                        <Textarea
                                            {...field}
                                            id="form-rhf-textarea-about"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="اكتب تقرير الحادث هنا..."
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
