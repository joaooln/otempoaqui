import React from 'react';
import { 
  IconSun, 
  IconCloud, 
  IconCloudRain, 
  IconSnowflake
} from '@tabler/icons-react';
import { Post, PostSummary } from '../types';

export interface WeatherCondition {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

export function getWeatherCondition(post?: Post | PostSummary): WeatherCondition {
  if (!post) {
    return {
      label: 'Tempo Estável',
      icon: IconCloud,
      colorClass: 'text-slate-500',
      bgClass: 'bg-slate-50',
      borderClass: 'border-slate-200'
    };
  }

  const title = post.titulo.toLowerCase();
  const content = ('conteudo' in post && typeof post.conteudo === 'string' ? post.conteudo : '').toLowerCase();
  const text = `${title} ${content}`;
  
  const hasRainVal = post.dadosMeteorologicos?.chuvaMm !== null && post.dadosMeteorologicos.chuvaMm > 0;
  const hasHighTemp = post.dadosMeteorologicos?.tempMaxima !== null && post.dadosMeteorologicos.tempMaxima >= 36;
  const hasLowTemp = post.dadosMeteorologicos?.tempMinima !== null && post.dadosMeteorologicos.tempMinima <= 18;

  // 1. Check for Friagem (cold front)
  if (hasLowTemp || text.includes('friagem') || text.includes('fria') || text.includes('ar polar') || text.includes('derruba')) {
    return {
      label: 'Friagem / Frio',
      icon: IconSnowflake,
      colorClass: 'text-sky-600',
      bgClass: 'bg-sky-50',
      borderClass: 'border-sky-200'
    };
  }

  // 2. Check for Rain
  if (hasRainVal || text.includes('chuva') || text.includes('temporal') || text.includes('pancadas') || text.includes('chover') || text.includes('pluviométrico')) {
    return {
      label: 'Pancadas de Chuva',
      icon: IconCloudRain,
      colorClass: 'text-blue-600',
      bgClass: 'bg-blue-50',
      borderClass: 'border-blue-200'
    };
  }

  // 3. Check for Extreme Heat
  if (hasHighTemp || text.includes('calor') || text.includes('quente') || text.includes('sufocante') || text.includes('recorde de calor')) {
    return {
      label: 'Calor Intenso',
      icon: IconSun,
      colorClass: 'text-amber-600',
      bgClass: 'bg-amber-50',
      borderClass: 'border-amber-200'
    };
  }

  // 4. Check for Cloudiness
  if (text.includes('nublado') || text.includes('encoberto') || text.includes('nuvens')) {
    return {
      label: 'Parcialmente Nublado',
      icon: IconCloud,
      colorClass: 'text-slate-600',
      bgClass: 'bg-slate-50',
      borderClass: 'border-slate-200'
    };
  }

  // Default: Sunny/Clear
  return {
    label: 'Ensolarado',
    icon: IconSun,
    colorClass: 'text-orange-500',
    bgClass: 'bg-orange-50',
    borderClass: 'border-orange-100'
  };
}
