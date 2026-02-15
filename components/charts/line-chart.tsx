'use client';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  {
    name: 'يناير',
    زيارات: 4000,
    مشاهدات: 2400,
    مبيعات: 2400
  },
  {
    name: 'فبراير',
    زيارات: 3000,
    مشاهدات: 1398,
    مبيعات: 2210
  },
  {
    name: 'مارس',
    زيارات: 2000,
    مشاهدات: 9800,
    مبيعات: 2290
  },
  {
    name: 'أبريل',
    زيارات: 2780,
    مشاهدات: 3908,
    مبيعات: 2000
  },
  {
    name: 'مايو',
    زيارات: 1890,
    مشاهدات: 4800,
    مبيعات: 2181
  },
  {
    name: 'يونيو',
    زيارات: 2390,
    مشاهدات: 3800,
    مبيعات: 2500
  }
];

export function LineChartComponent() {
  return (
    <div className="h-[300px] w-full p-4 ltr" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data.slice().reverse()}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 5
          }}
        >
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
            labelStyle={{ color: 'hsl(var(--primary))' }}
          />
          <Legend layout="horizontal" verticalAlign="top" align="center" />
          <Line
            type="monotone"
            dataKey="زيارات"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            activeDot={{
              r: 6,
              stroke: 'hsl(var(--primary))',
              strokeWidth: 2,
              fill: 'hsl(var(--background))'
            }}
          />
          <Line type="monotone" dataKey="مشاهدات" stroke="hsl(var(--primary) / 0.7)" strokeWidth={2} />
          <Line
            type="monotone"
            dataKey="مبيعات"
            stroke="hsl(var(--primary) / 0.4)"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
