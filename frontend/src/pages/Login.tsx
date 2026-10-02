import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { login } from "../store/authSlice";
import { useAppDispatch } from "../store/hooks";
import PasswordInput from "../components/PasswordInput";
import type { Role } from "../types";

const roleOptions: Array<{ role: Role; label: string; description: string }> = [
  { role: "USER", label: "Customer", description: "Browse stores and leave ratings" },
  { role: "OWNER", label: "Store Owner", description: "Manage your store and ratings" },
  { role: "ADMIN", label: "Admin", description: "Manage the platform" },
];

const homeFor: Record<Role, string> = {
  ADMIN: "/admin",
  USER: "/stores",
  OWNER: "/owner",
};

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [searchParams] = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<Role>(() => {
    const role = searchParams.get("role");
    return role === "OWNER" || role === "ADMIN" || role === "USER" ? role : "USER";
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm((value) => ({ ...value, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await dispatch(login(form)).unwrap();

      if (response.user.role !== selectedRole) {
        setError(`These credentials belong to a ${response.user.role.toLowerCase()} account. Select the correct account type and try again.`);
        return;
      }

      navigate(homeFor[response.user.role]);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-73px)] place-items-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-base-300 bg-base-100 shadow-2xl md:grid-cols-2">
        <div className="hidden bg-primary p-12 text-primary-content md:flex md:flex-col md:justify-between">
          <div>
            <span className="badge badge-outline border-primary-content/30 text-primary-content">Store Ratings</span>
            <h1 className="mt-8 text-5xl font-extrabold leading-tight">Turn feedback into better stores.</h1>
            <p className="mt-5 text-primary-content/70">A clean workspace for customers, owners, and administrators to manage ratings with clarity.</p>
          </div>
          <div className="text-sm text-primary-content/60">Secure role-based access • Simple rating workflows</div>
        </div>

        <form onSubmit={handleSubmit} className="p-7 sm:p-10">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Welcome back</p>
            <h2 className="mt-2 text-3xl font-extrabold">Sign in</h2>
            <p className="mt-2 text-sm text-base-content/55">Choose your account type and access your dashboard.</p>
          </div>

          <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl bg-base-200 p-1">
            {roleOptions.map((option) => (
              <button
                key={option.role}
                type="button"
                onClick={() => {
                  setSelectedRole(option.role);
                  setError("");
                }}
                className={`rounded-xl px-2 py-3 text-center transition ${selectedRole === option.role ? "bg-base-100 text-primary shadow-sm" : "text-base-content/55 hover:text-base-content"}`}
              >
                <span className="block text-xs font-bold sm:text-sm">{option.label}</span>
              </button>
            ))}
          </div>

          <div className="mb-5 rounded-xl border border-primary/10 bg-primary/5 px-4 py-3 text-xs text-base-content/60">
            {roleOptions.find((option) => option.role === selectedRole)?.description}
          </div>

          <div className="space-y-5">
            <label className="form-control gap-2">
              <span className="label-text font-semibold">Email</span>
              <input className="input input-bordered" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
            </label>

            <PasswordInput
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm font-semibold text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            {error && <div className="alert alert-error text-sm">{error}</div>}

            <button disabled={loading} className="btn btn-primary w-full rounded-xl">
              {loading ? <span className="loading loading-spinner loading-sm" /> : `Sign in as ${roleOptions.find((option) => option.role === selectedRole)?.label}`}
            </button>
          </div>

          <p className="mt-7 text-center text-sm text-base-content/60">
            New here? <Link className="font-semibold text-primary hover:underline" to="/signup">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
