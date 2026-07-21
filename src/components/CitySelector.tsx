'use client';

import React from 'react';
import { City } from '../types';

interface CitySelectorProps {
  cities: City[];
  selectedCity: string;
  onSelectCity: (cityName: string) => void;
}

export default function CitySelector({ cities, selectedCity, onSelectCity }: CitySelectorProps) {
  return (
    <div className="w-full border-b border-white/30 bg-white/35 backdrop-blur-lg sticky top-[73px] z-30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex overflow-x-auto no-scrollbar py-2.5 gap-2">
          {cities.map((city) => {
            const isActive = city.nome.toLowerCase() === selectedCity.toLowerCase();
            return (
              <button
                key={city.slug}
                id={`city-tab-${city.slug}`}
                onClick={() => onSelectCity(city.nome)}
                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/25 border border-sky-500'
                    : 'text-slate-600 hover:text-slate-950 bg-white/20 hover:bg-white/60 backdrop-blur-xs border border-white/20 hover:border-white/50'
                }`}
              >
                {city.nome}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
