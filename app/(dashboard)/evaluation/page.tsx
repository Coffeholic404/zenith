'use client';
import { useGetEvaluationsQuery } from '@/services/evaluation';
export default function Page () {
    const { data: evaluations, isLoading: isEvaluationsLoading } = useGetEvaluationsQuery(
        { pageNumber: 1, pageSize: 100 }
    );
    return (
        <div>
            <h1>Evaluation</h1>
        </div>
    )
}