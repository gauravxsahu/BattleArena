export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-arena-border py-16 text-center">
      {Icon && (
        <div className="mb-4 rounded-full bg-arena-surface2 p-4">
          <Icon className="h-8 w-8 text-arena-muted" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-arena-text">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-arena-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
