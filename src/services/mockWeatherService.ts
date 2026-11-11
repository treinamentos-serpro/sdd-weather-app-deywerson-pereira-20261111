import { mockWeatherData } from '../mocks/weather';
import type { WeatherData } from '../types/weather';

export async function searchMockWeather(city: string): Promise<WeatherData | null> {
  await new Promise<void>((resolve) => setTimeout(resolve, 300));

  const normalize = (value: string) =>
    value.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');

  return normalize(city) === normalize(mockWeatherData.city.name) ? mockWeatherData : null;
}