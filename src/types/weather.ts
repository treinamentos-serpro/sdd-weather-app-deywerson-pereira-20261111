export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  id: string;
  name: string;
  adminRegion: string | null;
  country: string | null;
  latitude: number;
  longitude: number;
  timeZone: string;
}

export interface CurrentWeather {
  observedAtEpochSeconds: number;
  temperatureCelsius: number | null;
  apparentTemperatureCelsius: number | null;
  weatherCode: number | null;
  condition: string | null;
  windSpeedKmh: number | null;
  relativeHumidityPercent: number | null;
  precipitationMm?: number | null;
  pressureHpa?: number | null;
  isIncomplete: boolean;
}

export interface HourlyForecast {
  timestampEpochSeconds: number;
  localDateTime: string;
  temperatureCelsius: number | null;
  weatherCode: number | null;
  condition: string | null;
  precipitationMm: number | null;
  isIncomplete: boolean;
}

export interface ForecastDay {
  localDate: string;
  temperatureMaxCelsius: number | null;
  temperatureMinCelsius: number | null;
  weatherCode: number | null;
  condition: string | null;
  precipitationProbabilityPercent?: number | null;
  hours: HourlyForecast[];
  isIncomplete: boolean;
}

export interface WeatherData {
  city: City;
  current: CurrentWeather;
  forecast: ForecastDay[];
  fetchedAt: string;
}