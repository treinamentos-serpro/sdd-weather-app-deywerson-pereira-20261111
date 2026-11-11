import { type FormEvent, type Ref, useId, useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
  inputRef?: Ref<HTMLInputElement>;
}

export default function SearchBar({ onSearch, disabled = false, inputRef }: SearchBarProps) {
  const [city, setCity] = useState('');
  const [showError, setShowError] = useState(false);
  const inputId = useId();
  const errorId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (disabled) return;

    const trimmedCity = city.trim();
    if (!trimmedCity) {
      setShowError(true);
      return;
    }

    setShowError(false);
    onSearch(trimmedCity);
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="w-full">
      <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-white">
        Cidade
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={inputId}
          ref={inputRef}
          type="search"
          value={city}
          onChange={(event) => {
            setCity(event.target.value);
            setShowError(false);
          }}
          disabled={disabled}
          aria-invalid={showError}
          aria-describedby={showError ? errorId : undefined}
          placeholder="Ex.: São Paulo"
          className="min-w-0 flex-1 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/60 backdrop-blur-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled}
          className="rounded-md bg-accent-500 px-5 py-3 font-medium text-night-900 hover:bg-accent-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Buscar
        </button>
      </div>
      {showError && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-red-300">
          Informe uma cidade para buscar.
        </p>
      )}
    </form>
  );
}