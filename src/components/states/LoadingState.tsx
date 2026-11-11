interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Carregando...' }: LoadingStateProps) {
  return (
    <div role="status" aria-label={message} className="flex items-center gap-3 py-6 text-white">
      <span
        aria-hidden="true"
        className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-accent-400 motion-reduce:animate-none"
      />
      <span>{message}</span>
    </div>
  );
}