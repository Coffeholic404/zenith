'use client';
import { Separator } from '@/components/ui/separator';
import { TrendingUp } from 'lucide-react';
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ChartRadialStacked } from './TripsChart';
import { ChartBarStacked } from './AccidentsCharts';

export default function Charts() {
  return (
    <section className=" grid lg:grid-cols-[1fr_2fr] md:grid-cols-[1fr] gap-4">
      <div className=" bg-white rounded-lg p-4 min-w-[480px]">
        <div>
          <p className=" font-vazirmatn font-normal text-sm text-subtext">الرحلات</p>
          <h3 className=" font-vazirmatn font-bold text-lg">اخر الرحلات</h3>
          <Separator className="my-4" />
          <ChartRadialStacked />
        </div>
      </div>
      <div className=" bg-white rounded-lg p-4">
        <div>
          <p className=" font-vazirmatn font-normal text-sm text-subtext">الحوادث</p>
          <h3 className=" font-vazirmatn font-bold text-lg">اخر الحوادث</h3>
          <Separator className="my-4" />
          <ChartBarStacked />
        </div>
      </div>
    </section>
  );
}
