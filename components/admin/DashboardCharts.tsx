'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const COLORS = ['#418851', '#dc911f', '#dc6038', '#6d3a17', '#285635', '#a65813']

export default function DashboardCharts({ data }: { data: { name: string; value: number }[] }) {
  if (data.length === 0) {
    return (
      <div className="h-52 flex items-center justify-center text-forest-300 text-sm">
        Belum ada data untuk ditampilkan
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0ece4" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: '#6d5d4a' }}
          tickLine={false}
          axisLine={false}
          angle={-30}
          textAnchor="end"
          height={50}
        />
        <YAxis tick={{ fontSize: 11, fill: '#6d5d4a' }} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip
          cursor={{ fill: '#fdf8f0' }}
          contentStyle={{
            background: '#1b3924',
            border: 'none',
            borderRadius: '10px',
            color: '#fdf8f0',
            fontSize: 12,
          }}
          formatter={(value: number) => [value, 'Wisata']}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
