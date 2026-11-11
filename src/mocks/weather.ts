import type { WeatherData } from '../types/weather';

const days = [
  { localDate: '2026-11-11', min: 18, max: 27, code: 1, condition: 'Predominantemente limpo', probability: 10 },
  { localDate: '2026-11-12', min: 19, max: 28, code: 2, condition: 'Parcialmente nublado', probability: 20 },
  { localDate: '2026-11-13', min: 19, max: 26, code: 3, condition: 'Encoberto', probability: 40 },
  { localDate: '2026-11-14', min: 18, max: 24, code: 61, condition: 'Chuva fraca', probability: 80 },
  { localDate: '2026-11-15', min: 17, max: 25, code: 2, condition: 'Parcialmente nublado', probability: 30 },
];

export const mockWeatherData: WeatherData = {
  city: {
    id: '-23.5505,-46.6333,America/Sao_Paulo',
    name: 'São Paulo',
    adminRegion: 'São Paulo',
    country: 'Brasil',
    latitude: -23.5505,
    longitude: -46.6333,
    timeZone: 'America/Sao_Paulo',
  },
  current: {
    observedAtEpochSeconds: Date.parse('2026-11-11T15:00:00Z') / 1000,
    temperatureCelsius: 24,
    apparentTemperatureCelsius: 25,
    weatherCode: 1,
    condition: 'Predominantemente limpo',
    windSpeedKmh: 12,
    relativeHumidityPercent: 65,
    precipitationMm: 0,
    pressureHpa: 1015,
    isIncomplete: false,
  },
  forecast: days.map((day) => ({
    localDate: day.localDate,
    temperatureMaxCelsius: day.max,
    temperatureMinCelsius: day.min,
    weatherCode: day.code,
    condition: day.condition,
    precipitationProbabilityPercent: day.probability,
    hours: Array.from({ length: 24 }, (_, hour) => ({
      timestampEpochSeconds: Date.parse(`${day.localDate}T03:00:00Z`) / 1000 + hour * 3600,
      localDateTime: `${day.localDate}T${String(hour).padStart(2, '0')}:00`,
      temperatureCelsius: (day.min + day.max) / 2,
      weatherCode: day.code,
      condition: day.condition,
      precipitationMm: day.code === 61 ? 0.5 : 0,
      isIncomplete: false,
    })),
    isIncomplete: false,
  })),
  fetchedAt: '2026-11-11T15:00:00.000Z',
};