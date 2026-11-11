import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import UnitToggle from '../../src/components/UnitToggle';

describe('UnitToggle', () => {
  it('indica a unidade controlada e solicita somente alterações', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<UnitToggle unit="celsius" onChange={onChange} />);
    const group = screen.getByRole('group', { name: 'Unidade de temperatura' });
    const celsius = within(group).getByRole('button', { name: 'Graus Celsius' });
    const fahrenheit = within(group).getByRole('button', { name: 'Graus Fahrenheit' });

    expect(celsius).toHaveAttribute('aria-pressed', 'true');
    expect(fahrenheit).toHaveAttribute('aria-pressed', 'false');
    await user.click(celsius);
    expect(onChange).not.toHaveBeenCalled();
    await user.click(fahrenheit);
    expect(onChange).toHaveBeenCalledExactlyOnceWith('fahrenheit');
    expect(celsius).toHaveAttribute('aria-pressed', 'true');

    rerender(<UnitToggle unit="fahrenheit" onChange={onChange} />);
    expect(celsius).toHaveAttribute('aria-pressed', 'false');
    expect(fahrenheit).toHaveAttribute('aria-pressed', 'true');
    await user.click(celsius);
    expect(onChange).toHaveBeenLastCalledWith('celsius');
  });

  it('permite alcançar os dois botões e ativá-los pelo teclado', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<UnitToggle unit="fahrenheit" onChange={onChange} />);
    const celsius = screen.getByRole('button', { name: 'Graus Celsius' });
    const fahrenheit = screen.getByRole('button', { name: 'Graus Fahrenheit' });

    await user.tab();
    expect(celsius).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('celsius');

    rerender(<UnitToggle unit="celsius" onChange={onChange} />);
    await user.tab();
    expect(fahrenheit).toHaveFocus();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenLastCalledWith('fahrenheit');
  });
});