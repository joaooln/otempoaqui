import type { Metadata } from 'next';
import { getPostSummaries, cities } from '../utils/db';
import HomeDashboard from '../components/HomeDashboard';

export const metadata: Metadata = {
  title: 'O Tempo Aqui | Previsão do tempo para o Acre e Rio Branco',
  description: 'Acompanhe a previsão do tempo para Rio Branco, Cruzeiro do Sul, Brasiléia, Sena Madureira e Tarauacá com análises diárias do meteorologista Davi Friale.',
  keywords: ['previsão do tempo', 'Acre', 'Rio Branco', 'friagem', 'Davi Friale', 'tempo', 'clima', 'Cruzeiro do Sul'],
  openGraph: {
    title: 'O Tempo Aqui | Previsão do tempo no Acre',
    description: 'Boletins diários, previsão e histórico de temperaturas para as principais cidades do Acre.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'O Tempo Aqui Redesign'
  }
};

export default function Page() {
  return (
    <HomeDashboard 
      initialPosts={getPostSummaries()} 
      initialCities={cities} 
    />
  );
}
