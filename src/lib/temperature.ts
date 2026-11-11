import type { Unit } from '../types/weather';

const temperatureFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatTemperature(temperatureCelsius: number | null, unit: Unit): string {
  if (temperatureCelsius === null || !Number.isFinite(temperatureCelsius)) {
    return 'Indisponível';
  }

  const temperature = unit === 'fahrenheit' ? (temperatureCelsius * 9) / 5 + 32 : temperatureCelsius;
  return `${temperatureFormatter.format(temperature)} °${unit === 'celsius' ? 'C' : 'F'}`;
}