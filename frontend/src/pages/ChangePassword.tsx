import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { changePassword } from "../store/authSlice";
import { useAppDispatch } from "../store/hooks";
import { checkPassword } from "../utils/validate";
import PageHeader from "../components/PageHeader";
import PasswordInput from "../components/PasswordInput";

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const dispatch = useAppDispatch();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm((v) => ({ ...v, [e.target.name]: e.target.value }));
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const problem = checkPassword(form.newPassword);
    if (problem) {
      setError(problem);
      return;
    }
    try {
      const res = await dispatch(changePassword(form)).unwrap();
      setSuccess(res.message);
      setForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setError(String(err));
    }
  };
  return (
    <div className="page-shell max-w-2xl">
      <PageHeader
        eyebrow="Account"
        title="Change password"
        description="Keep your account secure with a strong, unique password."
      />
      <form
        onSubmit={handleSubmit}
        className="card border-base-300/70 bg-base-100 shadow-soft"
      >
        <div className="card-body gap-5">
          <PasswordInput
            label="Current password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            required
          />
          <PasswordInput
            label="New password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
          />
          <p className="text-xs text-base-content/50">
            8–16 characters, including one uppercase letter and one special
            character.
          </p>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <button className="btn btn-primary rounded-xl">
            Update password
          </button>
        </div>
      </form>
    </div>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="form-control gap-2">
      <span className="label-text font-semibold">{label}</span>
      {children}
    </label>
  );
}
