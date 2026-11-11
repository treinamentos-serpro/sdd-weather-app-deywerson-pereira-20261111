const dayFormatter = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'UTC',
  weekday: 'long',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function formatForecastDay(localDate: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(localDate)) return 'Data indisponível';

  const date = new Date(`${localDate}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== localDate) {
    return 'Data indisponível';
  }

  return dayFormatter.format(date);
}