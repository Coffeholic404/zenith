'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import React, { useMemo, useEffect } from 'react';
import { CourseParticipant } from '@/services/courses';
import { useCreateEvaluationMutation } from '@/services/evaluation';
import { EvaluationFormRow } from './evaluation-form-row';

// Schema for individual evaluation row
const EvaluationRowSchema = z.object({
    co_St_TrId: z.string().min(1, { message: 'معرف الطالب مطلوب' }),
    evaluation1: z.string().optional(),
    evaluation2: z.string().optional(),
    evaluation3: z.string().optional(),
    note: z.string().optional()
});

// Schema for the entire form (array of evaluations)
const AddEvaluationsSchema = z.object({
    evaluations: z.array(EvaluationRowSchema)
});

type AddEvaluationsFormValues = z.infer<typeof AddEvaluationsSchema>;

interface AddEvaluationsProps {
    participants: CourseParticipant[];
}

const AddEvualtions = ({ participants }: AddEvaluationsProps) => {
    const router = useRouter();
    const [createEvaluation, { isLoading }] = useCreateEvaluationMutation();

    console.log('AddEvualtions component - participants:', participants);

    // Filter out participants who already have evaluations
    const unevaluatedParticipants = useMemo(
        () => participants?.filter(p => !p.hasEvaluation) || [],
        [participants]
    );

    // Generate default values from unevaluated participants
    const defaultValues = useMemo(
        () => ({
            evaluations:
                unevaluatedParticipants.map(p => ({
                    co_St_TrId: p.co_St_TrId,
                    evaluation1: '',
                    evaluation2: '',
                    evaluation3: '',
                    note: ''
                }))
        }),
        [unevaluatedParticipants]
    );

    const form = useForm<AddEvaluationsFormValues>({
        resolver: zodResolver(AddEvaluationsSchema),
        defaultValues
    });

    // Reset form when unevaluated participants change
    useEffect(() => {
        if (unevaluatedParticipants && unevaluatedParticipants.length > 0) {
            form.reset(defaultValues);
        }
    }, [unevaluatedParticipants, defaultValues, form]);

    const onSubmit = async (data: AddEvaluationsFormValues) => {
        console.log('Form submitted with data:', data);
        // Filter out completely empty evaluations (skip rows with no data)
        const validEvaluations = data.evaluations.filter(
            e => e.evaluation1 || e.evaluation2 || e.evaluation3 || e.note
        );

        if (validEvaluations.length === 0) {
            toast({
                title: 'خطأ',
                description: 'يجب ملء تقييم واحد على الأقل',
                variant: 'destructive'
            });
            return;
        }

        try {
            // Submit all evaluations in parallel
            const results = await Promise.allSettled(
                validEvaluations.map(evaluation =>
                    createEvaluation({
                        co_St_TrId: evaluation.co_St_TrId,
                        evaluation1: evaluation.evaluation1 || '',
                        evaluation2: evaluation.evaluation2 || '',
                        evaluation3: evaluation.evaluation3 || '',
                        note: evaluation.note || ''
                    }).unwrap()
                )
            );

            // Count successes and failures
            const successful = results.filter(r => r.status === 'fulfilled');
            const failed = results.filter(r => r.status === 'rejected');

            if (failed.length === 0) {
                // All succeeded
                toast({
                    title: 'نجح',
                    description: `تم حفظ ${successful.length} تقييم بنجاح`
                });
                router.push('/evaluation');
            } else if (successful.length > 0) {
                // Partial success - stay on page
                toast({
                    title: 'تحذير',
                    description: `تم حفظ ${successful.length} تقييم، فشل ${failed.length} تقييم`,
                    variant: 'destructive'
                });
            } else {
                // All failed
                const errorMessages = failed
                    .map(f => {
                        const reason = f.reason as any;
                        return reason?.data?.errorMessages?.join(', ') || 'خطأ غير معروف';
                    })
                    .join('\n');

                toast({
                    title: 'خطأ',
                    description: errorMessages,
                    variant: 'destructive'
                });
            }
        } catch (error: any) {
            toast({
                title: 'خطأ',
                description: 'حدث خطأ أثناء حفظ التقييمات',
                variant: 'destructive'
            });
        }
    };

    // Handle cancel button
    const handleCancel = () => {
        router.back();
    };

    // Handle empty or all evaluated participants
    if (!unevaluatedParticipants || unevaluatedParticipants.length === 0) {
        return (
            <div className="text-center py-8 text-subtext font-vazirmatn">
                {!participants || participants.length === 0
                    ? 'لا يوجد طلاب في هذه الدورة'
                    : 'تم تقييم جميع الطلاب في هذه الدورة'}
            </div>
        );
    }

    return (
        <div>
            <form
                onSubmit={form.handleSubmit(
                    onSubmit,
                    errors => {
                        console.log('Form validation errors:', errors);
                        toast({
                            title: 'خطأ في التحقق',
                            description: 'يرجى التحقق من البيانات المدخلة',
                            variant: 'destructive'
                        });
                    }
                )}
                className="space-y-4"
            >
                {/* Render evaluation row for each unevaluated participant */}
                {unevaluatedParticipants.map((participant, index) => (
                    <EvaluationFormRow
                        key={participant.co_St_TrId}
                        participant={participant}
                        control={form.control}
                        index={index}
                    />
                ))}

                {/* Action Buttons */}
                <div className="absolute bottom-0 left-0 right-0">
                    <div className="w-full text-left bg-white sticky px-4 py-2 -bottom-6 flex justify-end items-center gap-4">
                        <Button
                            className="bg-transparent font-vazirmatn px-6 h-8 text-black w-full sm:w-auto"
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            الغاء
                        </Button>
                        <Button
                            className="bg-sidebaractive font-vazirmatn px-6 h-8 text-white w-full sm:w-auto"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'جاري الحفظ...' : 'حفظ'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddEvualtions;
