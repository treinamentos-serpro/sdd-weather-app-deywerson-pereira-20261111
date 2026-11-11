import { formatForecastDay } from '../lib/format';
import { formatTemperature } from '../lib/temperature';
import { getWeatherIcon } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
  unit: Unit;
}

export default function ForecastCard({ day, unit }: ForecastCardProps) {
  const dateLabel = formatForecastDay(day.localDate);
  const Icon = getWeatherIcon(day.weatherCode);
  const condition = Icon && day.condition ? day.condition : 'Indisponível';
  const temperaturesInvalid =
    day.temperatureMaxCelsius !== null &&
    day.temperatureMinCelsius !== null &&
    day.temperatureMaxCelsius < day.temperatureMinCelsius;
  const maximum = formatTemperature(temperaturesInvalid ? null : day.temperatureMaxCelsius, unit);
  const minimum = formatTemperature(temperaturesInvalid ? null : day.temperatureMinCelsius, unit);
  const probability = day.precipitationProbabilityPercent;
  const rain =
    probability != null && Number.isFinite(probability) && probability >= 0 && probability <= 100
      ? `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(probability)} %`
      : 'Indisponível';
  const incomplete =
    day.isIncomplete ||
    dateLabel === 'Data indisponível' ||
    condition === 'Indisponível' ||
    maximum === 'Indisponível' ||
    minimum === 'Indisponível' ||
    rain === 'Indisponível';

  return (
    <article className="h-full rounded-md border border-white/10 bg-white/5 p-4 text-white backdrop-blur-md">
      <h3 className="break-words text-sm font-semibold">
        {dateLabel === 'Data indisponível' ? (
          dateLabel
        ) : (
          <time dateTime={day.localDate}>{dateLabel}</time>
        )}
      </h3>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {Icon && <Icon aria-hidden="true" className="h-8 w-8 shrink-0" />}
        <p className="min-w-0 break-words text-sm text-white/80">{condition}</p>
      </div>
      <dl className="mt-4 space-y-2 text-sm">
        <div>
          <dt className="text-white/70">Máxima</dt>
          <dd className="font-medium">{maximum}</dd>
        </div>
        <div>
          <dt className="text-white/70">Mínima</dt>
          <dd className="font-medium">{minimum}</dd>
        </div>
        <div>
          <dt className="text-white/70">Probabilidade de chuva</dt>
          <dd className="font-medium">{rain}</dd>
        </div>
      </dl>
      {incomplete && <p className="mt-4 text-sm text-white/80">Dados incompletos</p>}
    </article>
  );
}
