'use client';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  {
    name: 'الربع الأول',
    مبيعات: 4000,
    إيرادات: 2400
  },
  {
    name: 'الربع الثاني',
    مبيعات: 3000,
    إيرادات: 1398
  },
  {
    name: 'الربع الثالث',
    مبيعات: 2000,
    إيرادات: 9800
  },
  {
    name: 'الربع الرابع',
    مبيعات: 2780,
    إيرادات: 3908
  }
];

export function BarChartComponent() {
  return (
    <div className="h-[300px] w-full p-4 ltr" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data.slice().reverse()}
          margin={{
            top: 20,
            right: 10,
            left: 10,
            bottom: 5
          }}
          layout="horizontal"
        >
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
            </linearGradient>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary) / 0.7)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--primary) / 0.7)" stopOpacity={0.4} />
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
            labelStyle={{ color: 'hsl(var(--primary))' }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="center"
            wrapperStyle={{
              paddingTop: '10px'
            }}
          />
          <Bar dataKey="مبيعات" fill="url(#colorSales)" radius={[4, 4, 0, 0]} barSize={30} />
          <Bar dataKey="إيرادات" fill="url(#colorRevenue)" radius={[4, 4, 0, 0]} barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
