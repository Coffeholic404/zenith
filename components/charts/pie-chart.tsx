'use client';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'المنتج أ', value: 400 },
  { name: 'المنتج ب', value: 300 },
  { name: 'المنتج ج', value: 300 },
  { name: 'المنتج د', value: 200 }
];

export function PieChartComponent() {
  // Use CSS variables for colors with opacity
  const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--primary) / 0.8)',
    'hsl(var(--primary) / 0.6)',
    'hsl(var(--primary) / 0.4)'
  ];

  return (
    <div className="h-[300px] w-full p-4 ltr mainn" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={5}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            startAngle={450}
            endAngle={90}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="hsl(var(--background))"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--primary) / 0.2)',
              boxShadow: '0 4px 12px hsl(var(--primary) / 0.1)',
              textAlign: 'right',
              direction: 'rtl',
              color: 'hsl(var(--primary))'
            }}
            formatter={value => [`${value}`, 'المبيعات']}
            labelStyle={{ color: 'hsl(var(--primary))' }}
          />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="left"
            wrapperStyle={{
              paddingLeft: '20px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
