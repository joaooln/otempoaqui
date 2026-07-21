'use client';

import React from 'react';
import { PostSummary } from '../types';
import { 
  IconWind, 
  IconCloudRain, 
  IconDroplet, 
  IconTemperature 
} from '@tabler/icons-react';

interface MetricsGridProps {
  currentPost?: PostSummary;
  last7DaysPosts: PostSummary[];
}

export default function MetricsGrid({ currentPost, last7DaysPosts }: MetricsGridProps) {
  // 1. Calculate rain accumulation over the last 7 posts
  const rainAccumulation = last7DaysPosts.reduce((acc, p) => {
    return acc + (p.dadosMeteorologicos?.chuvaMm || 0);
  }, 0);

  const windSpeed = currentPost?.dadosMeteorologicos?.ventoKmh;
  const humidity = currentPost?.dadosMeteorologicos?.umidadePct;
  const tempMax = currentPost?.dadosMeteorologicos?.tempMaxima;

  // Simple sensation calculation (apparent temperature approximation for tropical climate)
  let sensation: number | null = null;
  if (tempMax !== null && tempMax !== undefined) {
    if (humidity) {
      sensation = tempMax + 0.33 * ((humidity / 100) * 6.105 * Math.exp((17.27 * tempMax) / (237.7 + tempMax))) - 4.0;
    } else {
      sensation = tempMax + 1.0; // dry approximation
    }
  }

  const metrics = [
    {
      id: 'rain-accumulation',
      label: 'Acumulado (7 dias)',
      value: `${rainAccumulation.toFixed(1)} mm`,
      description: rainAccumulation > 0 ? 'Índice de chuvas recente' : 'Sem chuvas na última semana',
      icon: IconCloudRain,
      colorClass: 'text-blue-500 bg-blue-50 border-blue-100',
    },
    {
      id: 'wind-speed',
      label: 'Vento',
      value: windSpeed !== null && windSpeed !== undefined ? `${windSpeed} km/h` : '-- km/h',
      description: windSpeed && windSpeed > 15 ? 'Ventos moderados' : 'Ventos fracos / brisa',
      icon: IconWind,
      colorClass: 'text-sky-500 bg-sky-50 border-sky-100',
    },
    {
      id: 'humidity',
      label: 'Umidade Relativa',
      value: humidity !== null && humidity !== undefined ? `${humidity}%` : '--%',
      description: humidity && humidity < 40 ? 'Tempo muito seco' : 'Níveis confortáveis',
      icon: IconDroplet,
      colorClass: 'text-teal-500 bg-teal-50 border-teal-100',
    },
    {
      id: 'sensation',
      label: 'Sensação Térmica',
      value: sensation !== null ? `${Math.round(sensation)}°C` : '--°C',
      description: tempMax && tempMax > 34 ? 'Calor abafado à tarde' : 'Clima ameno',
      icon: IconTemperature,
      colorClass: 'text-amber-500 bg-amber-50 border-amber-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.id}
            className="glass-card rounded-xl p-4 md:p-5 flex flex-col justify-between space-y-3 cursor-default"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{m.label}</span>
              <div className={`p-1.5 rounded-lg border border-white/50 bg-white/40 shadow-xs ${m.colorClass.split(' ')[0]}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-display">
                {m.value}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-semibold">{m.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
