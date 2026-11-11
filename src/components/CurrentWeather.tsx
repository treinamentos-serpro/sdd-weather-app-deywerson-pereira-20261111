import { formatTemperature } from '../lib/temperature';
import { getWeatherIcon } from '../lib/weatherCodes';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData;
  unit: Unit;
}

function formatMetric(value: number | null | undefined, unit: string, maximum = Infinity): string {
  if (value == null || !Number.isFinite(value) || value < 0 || value > maximum) {
    return 'Indisponível';
  }

  return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(value)} ${unit}`;
}

export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const Icon = getWeatherIcon(current.weatherCode);
  const temperature = formatTemperature(current.temperatureCelsius, unit);
  const apparentTemperature = formatTemperature(current.apparentTemperatureCelsius, unit);
  const condition = Icon && current.condition ? current.condition : 'Indisponível';
  const metrics = [
    { label: 'Umidade', value: formatMetric(current.relativeHumidityPercent, '%', 100) },
    { label: 'Vento', value: formatMetric(current.windSpeedKmh, 'km/h') },
    { label: 'Precipitação', value: formatMetric(current.precipitationMm, 'mm') },
    { label: 'Pressão', value: formatMetric(current.pressureHpa, 'hPa') },
  ];
  const incomplete =
    current.isIncomplete ||
    temperature === 'Indisponível' ||
    apparentTemperature === 'Indisponível' ||
    condition === 'Indisponível' ||
    metrics.some((metric) => metric.value === 'Indisponível');

  return (
    <section aria-label={`Clima atual em ${city.name}`} className="w-full text-white">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="min-w-0">
          <h2 className="break-words text-2xl font-semibold">{city.name}</h2>
          <p className="mt-1 break-words text-sm text-white/70">
            {[city.adminRegion, city.country].filter(Boolean).join(', ')}
          </p>
          <p
            className={`mt-5 font-semibold ${temperature === 'Indisponível' ? 'text-2xl' : 'text-5xl sm:text-6xl'}`}
          >
            {temperature}
          </p>
          <p className="mt-2 text-sm text-white/80">Sensação térmica: {apparentTemperature}</p>
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          {Icon && <Icon aria-hidden="true" className="h-12 w-12 shrink-0" />}
          <p className="min-w-0 break-words text-lg font-medium">{condition}</p>
        </div>
      </div>

      {incomplete && <p className="mt-5 text-sm text-white/80">Dados incompletos</p>}

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-md border border-white/10 bg-white/5 p-4 backdrop-blur-md"
          >
            <dt className="text-sm text-white/70">{metric.label}</dt>
            <dd className="mt-1 font-medium">{metric.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
