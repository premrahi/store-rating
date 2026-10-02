import { useState, type InputHTMLAttributes } from "react";

interface PasswordInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="size-5"
      >
        <path d="M2.06 12.35a1 1 0 0 1 0-.7C3.8 7.9 7.55 5 12 5c4.45 0 8.2 2.9 9.94 6.65a1 1 0 0 1 0 .7C20.2 16.1 16.45 19 12 19c-4.45 0-8.2-2.9-9.94-6.65Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="size-5"
    >
      <path d="m3 3 18 18" />
      <path d="M10.58 10.58A2 2 0 0 0 12 14c.55 0 1.05-.22 1.41-.59" />
      <path d="M9.88 5.09A9.5 9.5 0 0 1 12 5c4.45 0 8.2 2.9 9.94 6.65a1 1 0 0 1 0 .7 12.7 12.7 0 0 1-3.03 4.17" />
      <path d="M6.61 6.61a12.7 12.7 0 0 0-4.55 5.04 1 1 0 0 0 0 .7C3.8 16.1 7.55 19 12 19c1.4 0 2.72-.29 3.91-.8" />
    </svg>
  );
}

export default function PasswordInput({
  label,
  className = "",
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="form-control w-full gap-2">
      {label && <span className="label-text font-semibold">{label}</span>}
      <span className="relative block">
        <input
          {...props}
          type={visible ? "text" : "password"}
          className={`input input-bordered w-full pr-12 ${className}`}
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          className="btn btn-ghost btn-sm btn-square absolute right-1 top-1/2 -translate-y-1/2 text-base-content/55 hover:text-base-content"
          aria-label={visible ? "Hide password" : "Show password"}
          title={visible ? "Hide password" : "Show password"}
        >
          <EyeIcon open={visible} />
        </button>
      </span>
    </label>
  );
}
