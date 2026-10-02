interface Props {
  label: string;
  value: string | number;
  icon: string;
  tone?: string;
}
export default function StatCard({
  label,
  value,
  icon,
  tone = "bg-primary/10 text-primary",
}: Props) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-base-content/55">{label}</p>
          <p className="mt-3 text-4xl font-extrabold tracking-tight">{value}</p>
        </div>
        <div
          className={`grid size-12 place-items-center rounded-2xl text-xl ${tone}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
