import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  getCities, 
  getCityBySlug, 
  getPostsByCity, 
  getLatestForecast, 
  getTemperatureChartData 
} from '../../../utils/db';
import Header from '../../../components/Header';
import CitySelector from '../../../components/CitySelector';
import { getWeatherCondition } from '../../../utils/weatherIcons';
import HeroForecast from '../../../components/HeroForecast';
import MetricsGrid from '../../../components/MetricsGrid';
import TempChart from '../../../components/TempChart';
import PostFeed from '../../../components/PostFeed';
import Sidebar from '../../../components/Sidebar';
import { IconArrowLeft, IconMapPin } from '@tabler/icons-react';

interface PageProps {
  params: Promise<{ cidade: string }> | { cidade: string };
}

// Generate dynamic metadata for SEO based on the selected city
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const city = getCityBySlug(resolvedParams.cidade);

  if (!city) {
    return {
      title: 'Cidade Não Encontrada | O Tempo Aqui'
    };
  }

  return {
    title: `Previsão do tempo em ${city.nome} - AC | O Tempo Aqui`,
    description: `Acompanhe a previsão do tempo de hoje, temperatura mínima e máxima, umidade do ar e chuvas em ${city.nome} (Acre). Boletins atualizados pelo meteorologista Davi Friale.`
  };
}

export default async function CityPage({ params }: PageProps) {
  const resolvedParams = await params;
  const city = getCityBySlug(resolvedParams.cidade);

  if (!city) {
    notFound();
  }

  const allCities = getCities();
  const cityPostsRaw = getPostsByCity(city.nome);
  const cityPosts = cityPostsRaw.map(({ conteudo, ...rest }) => rest);

  const latestForecastRaw = getLatestForecast(city.nome);
  const latestForecast = latestForecastRaw ? (() => {
    const { conteudo, ...rest } = latestForecastRaw;
    return rest;
  })() : undefined;

  const chartData = getTemperatureChartData(city.nome);
  const recent7PostsForMetrics = cityPosts.slice(0, 7);

  // Compute dynamic sky background color for this city
  const condition = getWeatherCondition(latestForecast);
  let skyClass = 'sky-ensolarado';
  if (condition.label === 'Friagem / Frio') skyClass = 'sky-friagem';
  else if (condition.label === 'Pancadas de Chuva') skyClass = 'sky-chuvoso';
  else if (condition.label === 'Calor Intenso') skyClass = 'sky-calor';
  else if (condition.label === 'Parcialmente Nublado') skyClass = 'sky-nublado';

  return (
    <div className={`flex flex-col min-h-screen transition-all duration-1000 ${skyClass}`}>
      {/* Navigation Header */}
      <Header />

      {/* City Switcher Tabs */}
      <CitySelector 
        cities={allCities} 
        selectedCity={city.nome} 
      />

      {/* Main Page Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-8 flex flex-col lg:flex-row gap-6">
        
        {/* Left Side Column: Weather Dashboard + Feed */}
        <div className="flex-1 space-y-6">
          
          {/* Page Heading */}
          <div className="glass-card rounded-2xl p-6">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 font-display">
              Previsão do Tempo em {city.nome}
            </h1>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              Boletins climáticos históricos e previsões direcionadas para a região do {city.regiao}.
            </p>
          </div>

          {/* Main Hero Weather Card */}
          <section aria-label="Boletim climático destacado">
            <HeroForecast post={latestForecast} cityName={city.nome} />
          </section>

          {/* Metrics Grid */}
          <section aria-label="Métricas de clima">
            <MetricsGrid 
              currentPost={latestForecast} 
              last7DaysPosts={recent7PostsForMetrics} 
            />
          </section>

          {/* Temperature Variation Chart */}
          <section aria-label="Histórico de variação de temperatura">
            <TempChart 
              data={chartData.points} 
              rangeStart={chartData.rangeStart} 
              rangeEnd={chartData.rangeEnd} 
            />
          </section>

          {/* Filterable Posts Feed */}
          <section aria-label="Boletins recentes da cidade">
            <div className="glass-card rounded-2xl p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-800">Histórico de Boletins em {city.nome}</h3>
                <p className="text-xs text-slate-400 font-medium font-semibold">Previsões, resumos de diário do tempo e análises específicos</p>
              </div>
              <PostFeed posts={cityPosts} />
            </div>
          </section>

        </div>

        {/* Right Side Column: Sidebar */}
        <Sidebar cities={allCities} />

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 font-semibold mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} O Tempo Aqui - Protótipo de Redesign. Todos os direitos reservados aos produtores originais.</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-slate-650 hover:underline">Página Inicial</Link>
            <span>•</span>
            <a href="https://otempoaqui.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-slate-650 hover:underline">Site Original</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
