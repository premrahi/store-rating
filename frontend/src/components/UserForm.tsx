import { useState, type FormEvent, type ChangeEvent, type ReactNode } from "react";
import { checkAddress, checkEmail, checkName, checkPassword } from "../utils/validate";
import type { UserFormData } from "../types";
import PasswordInput from "./PasswordInput";

interface Props {
  onSubmit: (form: UserFormData | Omit<UserFormData, "role">) => Promise<boolean>;
  submitLabel: string;
  showRole?: boolean;
  error?: string;
  success?: string;
}

type Errors = Partial<Record<keyof UserFormData, string>>;

export default function UserForm({ onSubmit, submitLabel, showRole = false, error, success }: Props) {
  const [form, setForm] = useState<UserFormData>({ name: "", email: "", address: "", password: "", role: "USER" });
  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found: Errors = {
      name: checkName(form.name), email: checkEmail(form.email), address: checkAddress(form.address), password: checkPassword(form.password)
    };
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;
    const ok = await onSubmit(showRole ? form : { name: form.name, email: form.email, address: form.address, password: form.password });
    if (ok) setForm({ name: "", email: "", address: "", password: "", role: "USER" });
  };

  return (
    <form className="card border-base-300/70 bg-base-100 shadow-soft" onSubmit={handleSubmit}>
      <div className="card-body gap-5">
        <Field label="Full name" error={errors.name}><input className="input input-bordered w-full" name="name" value={form.name} onChange={handleChange} placeholder="Enter full name" /></Field>
        <Field label="Email" error={errors.email}><input className="input input-bordered w-full" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" /></Field>
        <Field label="Address" error={errors.address}><textarea className="textarea textarea-bordered w-full" name="address" rows={3} value={form.address} onChange={handleChange} placeholder="Full address" /></Field>
        <Field label="Password" error={errors.password}><PasswordInput name="password" value={form.password} onChange={handleChange} placeholder="••••••••" /></Field>
        {showRole && <Field label="Role"><select className="select select-bordered w-full" name="role" value={form.role} onChange={handleChange}><option value="USER">Normal User</option><option value="OWNER">Store Owner</option><option value="ADMIN">Admin</option></select></Field>}
        {error && <div className="alert alert-error text-sm"><span>{error}</span></div>}
        {success && <div className="alert alert-success text-sm"><span>{success}</span></div>}
        <button className="btn btn-primary mt-2 w-full rounded-xl">{submitLabel}</button>
      </div>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return <label className="form-control w-full gap-2"><span className="label-text font-semibold">{label}</span>{children}{error && <span className="text-xs text-error">{error}</span>}</label>;
}
