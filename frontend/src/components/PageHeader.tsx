import type { ReactNode } from "react";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}
export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: Props) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && (
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </div>
        )}
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-subtitle mt-2">{description}</p>}
      </div>
      {action}
    </div>
  );
}
