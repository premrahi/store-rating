import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../store/authSlice";
import { useAppDispatch } from "../store/hooks";
import UserForm from "../components/UserForm";
import type { UserFormData } from "../types";

export default function Signup() {
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleSignup = async (
    form: UserFormData | Omit<UserFormData, "role">,
  ) => {
    setError("");
    try {
      await dispatch(signup(form)).unwrap();
      navigate("/login");
      return true;
    } catch (err) {
      setError(String(err));
      return false;
    }
  };
  return (
    <div className="page-shell max-w-2xl">
      <div className="mb-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Get started
        </p>
        <h1 className="page-title mt-2">Create your account</h1>
        <p className="page-subtitle mt-2">
          Join the Store Ratings platform and start managing your feedback.
        </p>
      </div>
      <UserForm
        onSubmit={handleSignup}
        submitLabel="Create account"
        error={error}
      />
      <p className="mt-6 text-center text-sm text-base-content/60">
        Already have an account?{" "}
        <Link className="font-semibold text-primary" to="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
