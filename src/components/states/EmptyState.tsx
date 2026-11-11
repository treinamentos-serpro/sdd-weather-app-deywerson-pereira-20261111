interface EmptyStateProps {
  title: string;
  hint: string;
}

export default function EmptyState({ title, hint }: EmptyStateProps) {
  return (
    <div className="py-6 text-white">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-white/80">{hint}</p>
    </div>
  );
}