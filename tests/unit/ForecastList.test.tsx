import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ForecastCard from '../../src/components/ForecastCard';
import ForecastList from '../../src/components/ForecastList';
import { formatForecastDay } from '../../src/lib/format';
import { mockWeatherData } from '../../src/mocks/weather';

describe('ForecastList', () => {
  it('exibe cinco dias com datas locais, temperaturas e probabilidade de chuva', () => {
    const { forecast } = mockWeatherData;
    const { rerender } = render(<ForecastList forecast={forecast} unit="celsius" />);
    const list = screen.getByRole('list');
    const cards = within(list).getAllByRole('listitem');

    expect(cards).toHaveLength(5);
    expect(within(cards[0]).getByRole('heading', { name: /quarta-feira.*11\/11\/2026/i })).toBeInTheDocument();
    expect(within(cards[0]).getByText('27,0 °C')).toBeInTheDocument();
    expect(within(cards[0]).getByText('18,0 °C')).toBeInTheDocument();
    expect(within(cards[0]).getByText('10 %')).toBeInTheDocument();
    expect(within(cards[0]).getByText('Predominantemente limpo')).toBeInTheDocument();
    expect(cards[0].querySelector('svg[aria-hidden="true"]')).toBeInTheDocument();
    expect(cards[1].querySelector('svg[aria-hidden="true"]')).toBeInTheDocument();
    expect(within(cards[4]).getByRole('heading', { name: /domingo.*15\/11\/2026/i })).toBeInTheDocument();

    rerender(<ForecastList forecast={forecast} unit="fahrenheit" />);
    expect(within(cards[0]).getByText('80,6 °F')).toBeInTheDocument();
    expect(within(cards[0]).getByText('64,4 °F')).toBeInTheDocument();
    expect(within(cards[0]).getByText('10 %')).toBeInTheDocument();
  });

  it('apresenta estado vazio sem cards', () => {
    render(<ForecastList forecast={[]} unit="celsius" />);
    expect(screen.getByText('Previsão indisponível.')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});

describe('ForecastCard', () => {
  it('marca campos inválidos como indisponíveis e preserva os válidos', () => {
    const day = {
      ...mockWeatherData.forecast[0],
      temperatureMaxCelsius: 10,
      temperatureMinCelsius: 20,
      precipitationProbabilityPercent: 101,
      weatherCode: 999,
    };
    render(<ForecastCard day={day} unit="celsius" />);

    expect(screen.getAllByText('Indisponível')).toHaveLength(4);
    expect(screen.getByText('Dados incompletos')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /11\/11\/2026/ })).toBeInTheDocument();
  });

  it('aceita os limites da probabilidade e informa quando está ausente', () => {
    const day = mockWeatherData.forecast[0];
    const { rerender } = render(<ForecastCard day={{ ...day, precipitationProbabilityPercent: 0 }} unit="celsius" />);
    expect(screen.getByText('0 %')).toBeInTheDocument();
    rerender(<ForecastCard day={{ ...day, precipitationProbabilityPercent: 100 }} unit="celsius" />);
    expect(screen.getByText('100 %')).toBeInTheDocument();
    rerender(<ForecastCard day={{ ...day, precipitationProbabilityPercent: undefined }} unit="celsius" />);
    expect(screen.getByText('Indisponível')).toBeInTheDocument();
    expect(screen.getByText('Dados incompletos')).toBeInTheDocument();
  });
});

describe('formatForecastDay', () => {
  it('formata datas locais sem usar o fuso do dispositivo e rejeita datas inválidas', () => {
    expect(formatForecastDay('2026-11-11')).toMatch(/quarta-feira.*11\/11\/2026/i);
    expect(formatForecastDay('2026-02-30')).toBe('Data indisponível');
    expect(formatForecastDay('2026-11-11T00:00:00Z')).toBe('Data indisponível');
  });
});