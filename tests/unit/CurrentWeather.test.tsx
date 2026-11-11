import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CurrentWeather from '../../src/components/CurrentWeather';
import { formatTemperature } from '../../src/lib/temperature';
import { getWeatherIcon } from '../../src/lib/weatherCodes';
import { mockWeatherData } from '../../src/mocks/weather';

describe('CurrentWeather', () => {
  it('exibe cidade, clima atual e métricas sem converter grandezas não térmicas', () => {
    const { city, current } = mockWeatherData;
    const { rerender } = render(<CurrentWeather city={city} current={current} unit="celsius" />);
    const section = screen.getByRole('region', { name: 'Clima atual em São Paulo' });

    expect(within(section).getByRole('heading', { name: 'São Paulo' })).toBeInTheDocument();
    expect(within(section).getByText('24,0 °C')).toBeInTheDocument();
    expect(within(section).getByText('Sensação térmica: 25,0 °C')).toBeInTheDocument();
    expect(within(section).getByText('Predominantemente limpo')).toBeInTheDocument();
    expect(within(section).getByText('65 %')).toBeInTheDocument();
    expect(within(section).getByText('12 km/h')).toBeInTheDocument();
    expect(within(section).getByText('0 mm')).toBeInTheDocument();
    expect(within(section).getByText('1.015 hPa')).toBeInTheDocument();
    expect(within(section).queryByText('Dados incompletos')).not.toBeInTheDocument();

    rerender(<CurrentWeather city={city} current={current} unit="fahrenheit" />);
    expect(within(section).getByText('75,2 °F')).toBeInTheDocument();
    expect(within(section).getByText('Sensação térmica: 77,0 °F')).toBeInTheDocument();
    expect(within(section).getByText('12 km/h')).toBeInTheDocument();
    expect(within(section).getByText('0 mm')).toBeInTheDocument();
  });

  it('preserva campos válidos e identifica dados indisponíveis ou inválidos', () => {
    const { city, current } = mockWeatherData;
    render(
      <CurrentWeather
        city={city}
        current={{
          ...current,
          temperatureCelsius: Number.NaN,
          weatherCode: 999,
          relativeHumidityPercent: 101,
          precipitationMm: -1,
          pressureHpa: null,
        }}
        unit="celsius"
      />,
    );

    expect(screen.getAllByText('Indisponível')).toHaveLength(5);
    expect(screen.getByText('Dados incompletos')).toBeInTheDocument();
    expect(screen.getByText('12 km/h')).toBeInTheDocument();
    expect(screen.getByText('Sensação térmica: 25,0 °C')).toBeInTheDocument();
    expect(screen.queryByText('Predominantemente limpo')).not.toBeInTheDocument();
  });
});

describe('formatTemperature', () => {
  it.each([
    [0, '32,0 °F'],
    [100, '212,0 °F'],
    [-40, '-40,0 °F'],
    [20.25, '68,5 °F'],
    [-40.25, '-40,5 °F'],
  ])('formata %s °C como %s', (value, expected) => {
    expect(formatTemperature(value, 'fahrenheit')).toBe(expected);
  });
});

describe('getWeatherIcon', () => {
  it('distingue códigos WMO reconhecidos e desconhecidos', () => {
    expect(getWeatherIcon(0)).not.toBeNull();
    expect(getWeatherIcon(95)).not.toBeNull();
    expect(getWeatherIcon(999)).toBeNull();
    expect(getWeatherIcon(null)).toBeNull();
  });
});