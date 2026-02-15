'use client';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { name: 'يناير', value: 4000 },
  { name: 'فبراير', value: 3000 },
  { name: 'مارس', value: 2000 },
  { name: 'أبريل', value: 2780 },
  { name: 'مايو', value: 1890 },
  { name: 'يونيو', value: 2390 },
  { name: 'يوليو', value: 3490 },
  { name: 'أغسطس', value: 3200 },
  { name: 'سبتمبر', value: 2800 },
  { name: 'أكتوبر', value: 2500 },
  { name: 'نوفمبر', value: 3300 },
  { name: 'ديسمبر', value: 3700 }
];

export function AreaChartComponent() {
  return (
    <div className="h-[300px] w-full p-4 ltr" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data.slice().reverse()}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 0
          }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
          <XAxis
            dataKey="name"
            stroke="hsl(var(--primary) / 0.5)"
            tick={{ fill: 'hsl(var(--foreground))' }}
            reversed={true}
            tickMargin={10}
          />
          <YAxis stroke="hsl(var(--primary) / 0.5)" tick={{ fill: 'hsl(var(--foreground))' }} orientation="right" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--primary) / 0.2)',
              boxShadow: '0 4px 12px hsl(var(--primary) / 0.1)',
              textAlign: 'right',
              direction: 'rtl'
            }}
            formatter={value => [`${value} ر.س`, 'الإيرادات']}
            labelStyle={{ color: 'hsl(var(--primary))' }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            fill="url(#colorValue)"
            activeDot={{
              r: 6,
              stroke: 'hsl(var(--primary))',
              strokeWidth: 2,
              fill: 'hsl(var(--background))'
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
