interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10 text-center normal-case">
      <p className="m-0 text-xl leading-tight text-neutral-100">{title}</p>
      <p className="m-0 max-w-127 text-sm leading-tight tracking-widest text-neutral-200">
        {description}
      </p>
    </div>
  );
}
