import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../../src/App';
import { mockWeatherData } from '../../src/mocks/weather';
import * as mockWeatherService from '../../src/services/mockWeatherService';
import type { WeatherData } from '../../src/types/weather';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('App', () => {
  it('inicia sem consulta e busca o mock com loading e alternância de unidade', async () => {
    const user = userEvent.setup();
    const search = vi.spyOn(mockWeatherService, 'searchMockWeather');
    const fetch = vi.spyOn(globalThis, 'fetch');
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Consulte o clima' })).toBeInTheDocument();
    expect(search).not.toHaveBeenCalled();
    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), 'sao paulo{Enter}');
    expect(screen.getByRole('status', { name: 'Buscando previsão...' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Cidade' })).toHaveFocus();

    const current = await screen.findByRole('region', { name: 'Clima atual em São Paulo' });
    expect(screen.getByRole('searchbox', { name: 'Cidade' })).toHaveFocus();
    expect(screen.getByText('Previsão para São Paulo carregada.')).toHaveAttribute('role', 'status');
    expect(within(current).getByText('24,0 °C')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    await user.click(screen.getByRole('button', { name: 'Graus Fahrenheit' }));
    expect(within(current).getByText('75,2 °F')).toBeInTheDocument();
    expect(within(current).getByText('12 km/h')).toBeInTheDocument();
    expect(screen.getByText('80,6 °F')).toBeInTheDocument();
    expect(search).toHaveBeenCalledOnce();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('apresenta estado vazio quando a cidade não está no mock', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), 'Recife{Enter}');
    expect(await screen.findByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeInTheDocument();
    expect(screen.getByText('Nenhuma cidade encontrada.')).toHaveAttribute('role', 'status');
    expect(screen.queryByRole('region', { name: /Clima atual/ })).not.toBeInTheDocument();
  });

  it('apresenta erro e repete a última busca ao tentar novamente', async () => {
    const user = userEvent.setup();
    const search = vi.spyOn(mockWeatherService, 'searchMockWeather').mockRejectedValueOnce(new Error('falha'));
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), 'São Paulo{Enter}');
    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível consultar a previsão.');
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(screen.getByRole('searchbox', { name: 'Cidade' })).toHaveFocus();
    expect(await screen.findByRole('region', { name: 'Clima atual em São Paulo' })).toBeInTheDocument();
    expect(search).toHaveBeenCalledTimes(2);
    expect(search).toHaveBeenLastCalledWith('São Paulo');
  });

  it('ignora respostas de buscas anteriores quando uma nova busca termina primeiro', async () => {
    const user = userEvent.setup();
    let resolveFirst!: (data: WeatherData | null) => void;
    vi.spyOn(mockWeatherService, 'searchMockWeather')
      .mockImplementationOnce(() => new Promise((resolve) => { resolveFirst = resolve; }))
      .mockResolvedValueOnce(null);
    render(<App />);

    const input = screen.getByRole('searchbox', { name: 'Cidade' });
    await user.type(input, 'São Paulo{Enter}');
    await user.clear(input);
    await user.type(input, 'Recife{Enter}');
    expect(await screen.findByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeInTheDocument();

    await act(async () => resolveFirst(mockWeatherData));
    expect(screen.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: /Clima atual/ })).not.toBeInTheDocument();
  });
});