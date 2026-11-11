import { describe, expect, it } from 'vitest';
import { mockWeatherData } from '../../src/mocks/weather';

describe('mockWeatherData', () => {
  it('fornece clima atual e cinco dias consecutivos com horários no fuso da cidade', () => {
    const { city, current, forecast, fetchedAt } = mockWeatherData;
    const localDate = new Intl.DateTimeFormat('en-CA', {
      timeZone: city.timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const localDateTime = new Intl.DateTimeFormat('sv-SE', {
      timeZone: city.timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    });

    expect(city.name).toBe('São Paulo');
    expect(current.isIncomplete).toBe(false);
    expect(localDate.format(new Date(current.observedAtEpochSeconds * 1000))).toBe(
      forecast[0].localDate,
    );
    expect(localDate.format(new Date(fetchedAt))).toBe(forecast[0].localDate);
    expect(forecast).toHaveLength(5);

    for (const [index, day] of forecast.entries()) {
      const expectedDate = new Date(`${forecast[0].localDate}T00:00:00Z`);
      expectedDate.setUTCDate(expectedDate.getUTCDate() + index);
      expect(day.localDate).toBe(expectedDate.toISOString().slice(0, 10));
      expect(day.isIncomplete).toBe(false);
      expect(day.hours).toHaveLength(24);

      for (const hour of day.hours) {
        const formatted = localDateTime.format(new Date(hour.timestampEpochSeconds * 1000));
        expect(formatted.replace(' ', 'T')).toBe(hour.localDateTime);
        expect(hour.localDateTime.startsWith(day.localDate)).toBe(true);
        expect(hour.isIncomplete).toBe(false);
      }
    }
  });
});