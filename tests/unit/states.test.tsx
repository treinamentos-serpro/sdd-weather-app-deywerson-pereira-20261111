import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import EmptyState from '../../src/components/states/EmptyState';
import ErrorState from '../../src/components/states/ErrorState';
import LoadingState from '../../src/components/states/LoadingState';

describe('LoadingState', () => {
  it('apresenta uma mensagem de status visível e personalizável', () => {
    const { rerender } = render(<LoadingState />);
    expect(screen.getByRole('status', { name: 'Carregando...' })).toHaveTextContent('Carregando...');

    rerender(<LoadingState message="Carregando previsão" />);
    expect(screen.getByRole('status', { name: 'Carregando previsão' })).toHaveTextContent(
      'Carregando previsão',
    );
  });
});

describe('ErrorState', () => {
  it('exibe mensagens distintas e permite tentar novamente pelo teclado', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const { rerender } = render(<ErrorState message="Falha ao buscar cidades." onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Falha ao buscar cidades.');
    const button = screen.getByRole('button', { name: 'Tentar novamente' });
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onRetry).toHaveBeenCalledOnce();

    rerender(<ErrorState message="Falha ao consultar previsão." onRetry={onRetry} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Falha ao consultar previsão.');
    await user.keyboard(' ');
    expect(onRetry).toHaveBeenCalledTimes(2);
  });
});

describe('EmptyState', () => {
  it('exibe título e dica para resultados vazios e ausência de dados offline', () => {
    const { rerender } = render(
      <EmptyState title="Nenhuma cidade encontrada" hint="Confira o nome e tente outra busca." />,
    );
    expect(screen.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeInTheDocument();
    expect(screen.getByText('Confira o nome e tente outra busca.')).toBeInTheDocument();

    rerender(
      <EmptyState title="Sem dados offline recentes" hint="Selecione uma cidade salva ou busque quando estiver online." />,
    );
    expect(screen.getByRole('heading', { name: 'Sem dados offline recentes' })).toBeInTheDocument();
    expect(screen.getByText('Selecione uma cidade salva ou busque quando estiver online.')).toBeInTheDocument();
  });
});