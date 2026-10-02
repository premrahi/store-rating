import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchUser } from "../store/userSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { showRating } from "../utils/validate";
import PageHeader from "../components/PageHeader";
import { RoleBadge } from "./AdminUsers";

export default function AdminUserDetail() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.users.selected);
  const [error, setError] = useState("");
  useEffect(() => {
    void dispatch(fetchUser(id))
      .unwrap()
      .catch((err) => setError(String(err)));
  }, [dispatch, id]);
  if (error)
    return (
      <div className="page-shell">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  if (!user)
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  return (
    <div className="page-shell max-w-3xl">
      <PageHeader
        eyebrow="User profile"
        title="User details"
        description="Account information and role details."
        action={
          <Link to="/admin/users" className="btn btn-ghost rounded-xl">
            ← Back
          </Link>
        }
      />
      <div className="glass-card overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-transparent p-8">
          <div className="flex items-center gap-5">
            <div className="grid size-16 place-items-center rounded-2xl bg-primary text-2xl font-black text-primary-content">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-sm text-base-content/50">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="grid gap-6 p-8 sm:grid-cols-2">
          <Info label="Full name" value={user.name} />
          <Info label="Email" value={user.email} />
          <Info label="Address" value={user.address} />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-base-content/40">
              Role
            </p>
            <div className="mt-2">
              <RoleBadge role={user.role} />
            </div>
          </div>
          {user.role === "OWNER" && (
            <Info label="Store rating" value={`★ ${showRating(user.rating)}`} />
          )}
        </div>
      </div>
    </div>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-base-content/40">
        {label}
      </p>
      <p className="mt-2 font-medium">{value}</p>
    </div>
  );
}
