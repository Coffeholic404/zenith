"use client"

import { TrendingUp } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A credit score radial chart"

// Credit score data - representing score ranges
const chartData = [
  { 
    range: "credit-score", 
    poor: 400,      // 300-579 (Poor) - Red section
    fair: 180,      // 580-669 (Fair) - Yellow section  
    good: 90,       // 670-739 (Good) - Light green section
    excellent: 181  // 740-850 (Excellent) - Dark green section
  }
]

const chartConfig = {
  poor: {
    label: "Poor",
    color: "hsla(var(--chart-4))",
  },
  fair: {
    label: "Fair",
    color: "hsla(var(--chart-3))",
  },
  good: {
    label: "Good",
    color: "hsla(var(--chart-2))",

  },
  excellent: {
    label: "Excellent",
    color: "hsla(var(--chart-1))",
  },
} satisfies ChartConfig

export function ChartRadialStacked() {
  const creditScore = 821

  return (
    <Card className="flex flex-col border-none shadow-none">
      {/* <CardHeader className="items-center pb-0">
        <CardTitle>Radial Chart - Stacked</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader> */}
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px] max-h-[200px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={180}
            endAngle={0}
            innerRadius={90}
            outerRadius={190}
            barSize={16}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {creditScore.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="font-bold text-sm"
                        >
                          Your credit score is  
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="poor"
              stackId="a"
              cornerRadius={8}
              fill="var(--color-poor)"
              className="stroke-white stroke-[6px]"
            />
            <RadialBar
              dataKey="fair"
              fill="var(--color-fair)"
              stackId="a"
              cornerRadius={8}
              className="stroke-white stroke-[6px]"
            />
            <RadialBar
              dataKey="good"
              fill="var(--color-good)"
              stackId="a"
              cornerRadius={8}
              className="stroke-white stroke-[6px]"
            />
            <RadialBar
              dataKey="excellent"
              fill="var(--color-excellent)"
              stackId="a"
              cornerRadius={8}
              className="stroke-white stroke-[6px]"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  )
}
