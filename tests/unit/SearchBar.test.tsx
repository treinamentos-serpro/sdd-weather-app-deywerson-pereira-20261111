import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SearchBar from '../../src/components/SearchBar';

describe('SearchBar', () => {
  it('envia a cidade sem espaços externos ao pressionar Enter', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    expect(screen.getByRole('search')).toBeInTheDocument();
    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), '  São Paulo  {Enter}');

    expect(onSearch).toHaveBeenCalledOnce();
    expect(onSearch).toHaveBeenCalledWith('São Paulo');
  });

  it('informa erro e não busca quando o campo está vazio ou contém apenas espaços', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByRole('searchbox', { name: 'Cidade' });

    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Informe uma cidade');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Informe uma cidade para buscar.');

    await user.type(input, '   ');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(onSearch).not.toHaveBeenCalled();

    await user.type(input, 'Recife');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(onSearch).toHaveBeenCalledWith('Recife');
  });

  it('desabilita os controles e não envia buscas enquanto disabled estiver ativo', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    const { rerender } = render(<SearchBar onSearch={onSearch} disabled />);
    const input = screen.getByRole('searchbox', { name: 'Cidade' });
    const button = screen.getByRole('button', { name: 'Buscar' });

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
    fireEvent.submit(screen.getByRole('search'));
    expect(onSearch).not.toHaveBeenCalled();

    rerender(<SearchBar onSearch={onSearch} />);
    await user.type(input, 'Recife');
    await user.click(button);
    expect(onSearch).toHaveBeenCalledWith('Recife');
  });
});