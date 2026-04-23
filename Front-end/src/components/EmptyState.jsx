export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="card p-10 flex flex-col items-center text-center gap-3">
      {Icon && (
        <div className="rounded-full bg-brand-50 text-brand-600 p-4">
          <Icon size={32} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {description && (
        <p className="text-sm text-slate-600 max-w-sm">{description}</p>
      )}
      {action}
    </div>
  );
}
