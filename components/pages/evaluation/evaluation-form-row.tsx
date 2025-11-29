'use client';

import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Field, FieldError } from '@/components/ui/field';
import { CourseParticipant } from '@/services/courses';
import { cn } from '@/lib/utils';

interface EvaluationFormRowProps {
  participant: CourseParticipant;
  control: Control<any>;
  index: number;
}

export function EvaluationFormRow({ participant, control, index }: EvaluationFormRowProps) {
  // Helper to check if field has value for background color change
  const hasValue = (value: string | undefined) => value && value.trim() !== '';

  return (
    <div className="grid grid-cols-5 place-content-center px-4 min-h-[78px] font-vazirmatn border rounded-[22px] border-evaluationBorderClr">
      {/* Student Name Field (displays student name, but form value is co_St_TrId) */}
      <div className="relative">
        {/* Visible input showing student name */}
        <Input
          value={participant.studentName}
          disabled
          className="border-none"
          autoComplete="off"
        />
        {/* Hidden controller for co_St_TrId value */}
        <Controller
          name={`evaluations.${index}.co_St_TrId`}
          control={control}
          render={({ field }) => <input type="hidden" {...field} />}
        />
      </div>

      {/* Evaluation 1 */}
      <Controller
        name={`evaluations.${index}.evaluation1`}
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              autoComplete="off"
              className={cn(
                'bg-searchBg max-w-[150px] rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0',
                hasValue(field.value) && 'bg-green-50'
              )}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Evaluation 2 */}
      <Controller
        name={`evaluations.${index}.evaluation2`}
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              autoComplete="off"
              className={cn(
                'bg-searchBg max-w-[150px] rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0',
                hasValue(field.value) && 'bg-green-50'
              )}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Evaluation 3 */}
      <Controller
        name={`evaluations.${index}.evaluation3`}
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              autoComplete="off"
              className={cn(
                'bg-searchBg max-w-[150px] rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0',
                hasValue(field.value) && 'bg-green-50'
              )}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Note Field */}
      <Controller
        name={`evaluations.${index}.note`}
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              autoComplete="off"
              className={cn(
                'bg-searchBg rounded-xl font-vazirmatn placeholder:text-subtext placeholder:font-normal focus:border-sidebaractive focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0',
                hasValue(field.value) && 'bg-green-50'
              )}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
}
