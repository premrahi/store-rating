import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import api, { errMsg } from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post<{ message: string }>("/auth/forgot-password", { email });
      setMessage(response.data.message || "If an account exists for this email, password-reset instructions have been sent.");
      setEmail("");
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-73px)] place-items-center px-4 py-10">
      <div className="w-full max-w-lg rounded-[2rem] border border-base-300 bg-base-100 p-7 shadow-2xl sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-7">
              <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5z" />
              <path d="m5 7 7 5 7-5" />
            </svg>
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-primary">Account recovery</p>
          <h1 className="mt-2 text-3xl font-extrabold">Forgot your password?</h1>
          <p className="mt-2 text-sm text-base-content/55">Enter the email linked to your account and we’ll send password-reset instructions.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="form-control gap-2">
            <span className="label-text font-semibold">Account email</span>
            <input
              className="input input-bordered"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          {error && <div className="alert alert-error text-sm">{error}</div>}
          {message && <div className="alert alert-success text-sm">{message}</div>}

          <button disabled={loading} className="btn btn-primary w-full rounded-xl">
            {loading ? <span className="loading loading-spinner loading-sm" /> : "Send reset instructions"}
          </button>
        </form>

        <div className="mt-7 text-center">
          <Link to="/login" className="text-sm font-semibold text-primary hover:underline">← Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}
