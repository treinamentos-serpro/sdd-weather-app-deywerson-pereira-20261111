import { useRef, useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import UnitToggle from './components/UnitToggle';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import { searchMockWeather } from './services/mockWeatherService';
import type { Unit, WeatherData } from './types/weather';

type WeatherState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'empty' }
  | { status: 'error'; city: string }
  | { status: 'success'; data: WeatherData };

export default function App() {
  const [unit, setUnit] = useState<Unit>('celsius');
  const [weather, setWeather] = useState<WeatherState>({ status: 'idle' });
  const searchInputRef = useRef<HTMLInputElement>(null);
  const latestSearch = useRef(0);

  async function handleSearch(city: string) {
    const searchId = ++latestSearch.current;
    setWeather({ status: 'loading' });
    try {
      const data = await searchMockWeather(city);
      if (searchId !== latestSearch.current) return;
      setWeather(data ? { status: 'success', data } : { status: 'empty' });
    } catch {
      if (searchId !== latestSearch.current) return;
      setWeather({ status: 'error', city });
    }
  }

  return (
    <div className="min-h-screen bg-night-900 text-white">
      <header className="border-b border-white/10 bg-night-800/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold tracking-normal sm:text-2xl">Clima<span className="text-sun">.</span></h1>
              <p className="mt-1 text-xs text-white/70">Dados de exemplo: São Paulo</p>
            </div>
            <UnitToggle unit={unit} onChange={setUnit} />
          </div>
          <div className="mt-5 max-w-2xl">
            <SearchBar onSearch={handleSearch} inputRef={searchInputRef} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <p role="status" aria-atomic="true" className="sr-only">
          {weather.status === 'success' && `Previsão para ${weather.data.city.name} carregada.`}
          {weather.status === 'empty' && 'Nenhuma cidade encontrada.'}
        </p>
        {weather.status === 'idle' && (
          <EmptyState title="Consulte o clima" hint="Digite uma cidade para consultar a previsão." />
        )}
        {weather.status === 'loading' && <LoadingState message="Buscando previsão..." />}
        {weather.status === 'empty' && (
          <EmptyState title="Nenhuma cidade encontrada" hint="Confira o nome e tente outra busca." />
        )}
        {weather.status === 'error' && (
          <ErrorState
            message="Não foi possível consultar a previsão."
            onRetry={() => {
              searchInputRef.current?.focus();
              handleSearch(weather.city);
            }}
          />
        )}
        {weather.status === 'success' && (
          <div className="space-y-10">
            <CurrentWeather city={weather.data.city} current={weather.data.current} unit={unit} />
            <div>
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-semibold">Previsão diária</h2>
                <p className="text-sm text-white/70">Próximos 5 dias</p>
              </div>
              <ForecastList forecast={weather.data.forecast} unit={unit} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}