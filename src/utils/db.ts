import { Post, City, PostSummary } from '../types';
import postsRaw from '../../data/posts.json';
import citiesRaw from '../../data/cidades.json';

// Typecast the raw JSON data
export const posts: Post[] = postsRaw as Post[];
export const cities: City[] = citiesRaw as City[];

// Get all posts as summaries (no conteudo field)
export function getPostSummaries(): PostSummary[] {
  return posts.map(({ conteudo, ...rest }) => rest);
}

// Get all cities
export function getCities(): City[] {
  return cities;
}

// Get city by slug
export function getCityBySlug(slug: string): City | undefined {
  return cities.find(c => c.slug === slug);
}

// Get city by name
export function getCityByName(name: string): City | undefined {
  return cities.find(c => c.nome.toLowerCase() === name.toLowerCase());
}

// Get posts filtered by city name
export function getPostsByCity(cityName: string): Post[] {
  return posts.filter(p => p.cidade.toLowerCase() === cityName.toLowerCase());
}

// Get post by slug
export function getPostBySlug(slug: string): Post | undefined {
  return posts.find(p => p.slug === slug);
}

// Get the latest weather forecast for a city
export function getLatestForecast(cityName: string): Post | undefined {
  const cityPosts = getPostsByCity(cityName);
  
  // Sempre retorna o post de previsão mais recente, tenha ou não dados extraídos
  const latestPrevisao = cityPosts.find(p => p.tipo === 'previsao');
  
  return latestPrevisao || cityPosts[0];
}

// Get the latest forecast for a city, merging fallback weather data from previous posts if fields are null
export function getLatestForecastWithFallbacks(cityName: string): Post | undefined {
  const cityPosts = getPostsByCity(cityName);
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
}

// Get the 7 most recent posts with temperature data for the chart, sorted chronologically
export function getTemperatureChartData(cityName: string) {
  const cityPosts = getPostsByCity(cityName);
  
  // Filter posts that have both tempMinima and tempMaxima first
  const tempPosts = cityPosts.filter(
    p => (p.tipo === 'previsao' || p.tipo === 'diario') &&
    p.dadosMeteorologicos && 
    p.dadosMeteorologicos.tempMinima !== null && 
    p.dadosMeteorologicos.tempMaxima !== null
  );

  // Take the 7 most recent
  const sliced = tempPosts.slice(0, 7);

  return sliced
    .map(p => ({
      date: formatDateLabel(p.data),
      min: p.dadosMeteorologicos!.tempMinima,
      max: p.dadosMeteorologicos!.tempMaxima,
      rawDate: p.data
    }))
    .reverse(); // Reverse so it goes past-to-present (left-to-right on chart)
}

// Helper to format date string e.g. "2026-07-20" -> "20/07"
function formatDateLabel(dateStr: string): string {
  try {
    const [_, month, day] = dateStr.split('-');
    if (day && month) {
      return `${day}/${month}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}
