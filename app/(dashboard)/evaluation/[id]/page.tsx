'use client';
import { useGetCourseEvaluationsQuery } from '@/services/evaluation';
import { DataTable } from '@/components/data-table';
import { DataTableSkeleton } from '@/components/ui/data-table-skeleton';
import { evaluationColumns, evaluationColumnsNames, type EvaluationRow } from '@/components/pages/evaluation/evaluation-columns';
import React from 'react';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id: courseId } = React.use(params)
    const { data, isLoading, error } = useGetCourseEvaluationsQuery(courseId);

    // Extract and transform data
    let evaluationsData: EvaluationRow[] = []
    if (data?.result?.evaluations) {
        evaluationsData = data.result.evaluations.map(item => ({
            uniqueID: item.uniqueID,
            co_St_TrId: item.co_St_TrId,
            name: item.studentName,
            evaluation1: item.evaluation1,
            evaluation2: item.evaluation2,
            evaluation3: item.evaluation3,
            note: item.note
        }))
    }

    return (
        <div>
            {isLoading ? (
                <DataTableSkeleton columnCount={7} rowCount={5} showAddButton={false} />
            ) : (
                <DataTable
                    columns={evaluationColumns}
                    data={evaluationsData}
                    columnsNames={evaluationColumnsNames}
                />
            )}
        </div>
    )
}