'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

export const description = 'A stacked bar chart with a legend';

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
  { month: 'July', desktop: 214, mobile: 140 },
  { month: 'August', desktop: 214, mobile: 140 },
  { month: 'September', desktop: 214, mobile: 140 },
  { month: 'October', desktop: 214, mobile: 140 },
  { month: 'November', desktop: 214, mobile: 140 },
  { month: 'December', desktop: 214, mobile: 140 }
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#6D3AFF'
  },
  mobile: {
    label: 'Mobile',
    color: '#E5E5EF'
  }
} satisfies ChartConfig;

export function ChartBarStacked() {
  return (
    <Card className=" border-none shadow-none">
      {/* <CardHeader>
        <CardTitle>Bar Chart - Stacked + Legend</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader> */}
      <CardContent className="">
        <ChartContainer config={chartConfig} className=" w-full max-h-[200px]">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={value => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            {/* <ChartLegend content={<ChartLegendContent />} /> */}
            <Bar
              dataKey="desktop"
              stackId="a"
              fill="var(--color-desktop)"
              radius={[4, 4, 4, 4]}
              barSize={8}
              className="stroke-white"
            />
            <Bar
              dataKey="mobile"
              stackId="a"
              fill="var(--color-mobile)"
              radius={[4, 4, 4, 4]}
              className="stroke-white"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}
