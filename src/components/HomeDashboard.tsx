'use client';

import React, { useState, useMemo } from 'react';
import { PostSummary, City } from '../types';
import CitySelector from './CitySelector';
import HeroForecast from './HeroForecast';
import MetricsGrid from './MetricsGrid';
import TempChart from './TempChart';
import PostFeed from './PostFeed';
import Sidebar from './Sidebar';
import Header from './Header';
import { getWeatherCondition } from '../utils/weatherIcons';

interface HomeDashboardProps {
  initialPosts: PostSummary[];
  initialCities: City[];
}

export default function HomeDashboard({ initialPosts, initialCities }: HomeDashboardProps) {
  const [selectedCity, setSelectedCity] = useState<string>('Rio Branco');

  // Filter posts by active city
  const cityPosts = useMemo(() => {
    return initialPosts.filter(p => p.cidade.toLowerCase() === selectedCity.toLowerCase());
  }, [initialPosts, selectedCity]);

  // Find the latest weather forecast for this city
  const latestForecast = useMemo(() => {
    const forecast = cityPosts.find(p => p.tipo === 'previsao') || cityPosts[0];
    if (!forecast) return undefined;
    
    const mergedPost = { ...forecast };
    if (mergedPost.dadosMeteorologicos) {
      const copyMeteorologicos = { ...mergedPost.dadosMeteorologicos };
      
      if (copyMeteorologicos.tempMinima === null) {
        const found = cityPosts.find(p => p.dadosMeteorologicos?.tempMinima !== null);
        if (found) copyMeteorologicos.tempMinima = found.dadosMeteorologicos.tempMinima;
      }
      if (copyMeteorologicos.tempMaxima === null) {
        const found = cityPosts.find(p => p.dadosMeteorologicos?.tempMaxima !== null);
        if (found) copyMeteorologicos.tempMaxima = found.dadosMeteorologicos.tempMaxima;
      }
      if (copyMeteorologicos.chuvaMm === null) {
        const found = cityPosts.find(p => p.dadosMeteorologicos?.chuvaMm !== null);
        if (found) copyMeteorologicos.chuvaMm = found.dadosMeteorologicos.chuvaMm;
      }
      if (copyMeteorologicos.ventoKmh === null) {
        const found = cityPosts.find(p => p.dadosMeteorologicos?.ventoKmh !== null);
        if (found) copyMeteorologicos.ventoKmh = found.dadosMeteorologicos.ventoKmh;
      }
      if (copyMeteorologicos.umidadePct === null) {
        const found = cityPosts.find(p => p.dadosMeteorologicos?.umidadePct !== null);
        if (found) copyMeteorologicos.umidadePct = found.dadosMeteorologicos.umidadePct;
      }
      
      mergedPost.dadosMeteorologicos = copyMeteorologicos;
    }
    return mergedPost;
  }, [cityPosts]);

  // Extract the 7 most recent records with temperature data for the chart, sorted chronologically
  const chartData = useMemo(() => {
    const tempPosts = cityPosts.filter(
      p => (p.tipo === 'previsao' || p.tipo === 'diario') &&
      p.dadosMeteorologicos && 
      p.dadosMeteorologicos.tempMinima !== null && 
      p.dadosMeteorologicos.tempMaxima !== null
    );
    
    return tempPosts
      .slice(0, 7)
      .map(p => {
        const [_, month, day] = p.data.split('-');
        return {
          date: day && month ? `${day}/${month}` : p.data,
          min: p.dadosMeteorologicos!.tempMinima,
          max: p.dadosMeteorologicos!.tempMaxima,
          rawDate: p.data
        };
      })
      .reverse(); // past to present
  }, [cityPosts]);

  // Extract the 7 most recent records for metrics calculation (accumulation)
  const recent7PostsForMetrics = useMemo(() => {
    return cityPosts.slice(0, 7);
  }, [cityPosts]);

  // Determine dynamic sky background gradient based on active forecast
  const skyClass = useMemo(() => {
    const condition = getWeatherCondition(latestForecast);
    if (condition.label === 'Friagem / Frio') return 'sky-friagem';
    if (condition.label === 'Pancadas de Chuva') return 'sky-chuvoso';
    if (condition.label === 'Calor Intenso') return 'sky-calor';
    if (condition.label === 'Parcialmente Nublado') return 'sky-nublado';
    return 'sky-ensolarado';
  }, [latestForecast]);

  return (
    <div className={`flex flex-col min-h-screen transition-all duration-1000 ${skyClass}`}>
      {/* Navigation Header */}
      <Header />

      {/* City Switcher Tabs */}
      <CitySelector 
        cities={initialCities} 
        selectedCity={selectedCity} 
        onSelectCity={setSelectedCity} 
      />

      {/* Main Page Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-8 flex flex-col lg:flex-row gap-6">
        
        {/* Left Side Column: Weather Dashboard + Feed */}
        <div className="flex-1 space-y-6">
          
          {/* Main Hero Weather Card */}
          <section aria-label="Boletim climático em destaque">
            <HeroForecast post={latestForecast} cityName={selectedCity} />
          </section>

          {/* Metrics Grid */}
          <section aria-label="Métricas de vento, umidade e chuvas acumuladas">
            <MetricsGrid 
              currentPost={latestForecast} 
              last7DaysPosts={recent7PostsForMetrics} 
            />
          </section>

          {/* Temperature Variation Chart */}
          <section aria-label="Histórico de variação de temperatura">
            <TempChart data={chartData} />
          </section>

          {/* Filterable Posts Feed */}
          <section aria-label="Feed de publicações e artigos recentes">
            <div className="glass-card rounded-2xl p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-800">Boletins & Publicações</h3>
                <p className="text-xs text-slate-400 font-medium">Explore previsões detalhadas, boletins diários e artigos do meteorologista</p>
              </div>
              <PostFeed posts={cityPosts} />
            </div>
          </section>

        </div>

        {/* Right Side Column: Sidebar */}
        <Sidebar cities={initialCities} />

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 font-semibold mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} O Tempo Aqui - Protótipo de Redesign. Todos os direitos reservados aos produtores originais.</p>
          <div className="flex gap-4">
            <a href="https://otempoaqui.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-slate-650 hover:underline">Site Original</a>
            <span>•</span>
            <span>Desenvolvido com Next.js & Tailwind v4</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
