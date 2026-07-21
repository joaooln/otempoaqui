'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface ChartDataPoint {
  date: string;
  min: number | null;
  max: number | null;
  rawDate: string;
}

interface TempChartProps {
  data: ChartDataPoint[];
  rangeStart?: string | null;
  rangeEnd?: string | null;
}

function formatRangeLabel(start?: string | null, end?: string | null): string {
  if (!start || !end) return 'Variação das temperaturas mínimas e máximas registradas';
  const [, startMonth, startDay] = start.split('-');
  const [, endMonth, endDay] = end.split('-');
  if (start === end) return `Dados de ${startDay}/${startMonth}`;
  return `${startDay}/${startMonth} – ${endDay}/${endMonth}`;
}

export default function TempChart({ data, rangeStart, rangeEnd }: TempChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between h-[300px] animate-pulse">
        <div className="h-6 w-48 bg-slate-100 rounded"></div>
        <div className="h-40 w-full bg-slate-50 rounded"></div>
        <div className="h-6 w-32 bg-slate-100 rounded self-center"></div>
      </div>
    );
  }

  // Custom premium tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-md text-xs font-semibold space-y-1">
          <p className="text-slate-500 font-bold mb-1">Data: {payload[0].payload.rawDate.split('-').reverse().join('/')}</p>
          <p className="text-amber-600">Máxima: {payload[1]?.value ?? payload[0]?.value}°C</p>
          <p className="text-sky-600">Mínima: {payload[0]?.value}°C</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full glass-card rounded-2xl p-6 flex flex-col">
      <div className="mb-4">
        <h2 className="text-base font-bold text-slate-800 font-display">Tendência Térmica</h2>
        <p className="text-xs font-semibold text-slate-500">{formatRangeLabel(rangeStart, rangeEnd)}</p>
      </div>

      <div className="h-[250px] w-full -ml-4">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(15, 23, 42, 0.05)" />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} 
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11, fontWeight: 'bold', paddingTop: 10 }}
              />
              <Area
                name="Mínima"
                type="monotone"
                dataKey="min"
                stroke="#0284c7"
                fill="url(#colorMin)"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 1, fill: '#ffffff' }}
                activeDot={{ r: 6 }}
              />
              <Area
                name="Máxima"
                type="monotone"
                dataKey="max"
                stroke="#d97706"
                fill="url(#colorMax)"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 1, fill: '#ffffff' }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm font-medium italic">
            Sem dados suficientes para gerar o gráfico histórico.
          </div>
        )}
      </div>
    </div>
  );
}
