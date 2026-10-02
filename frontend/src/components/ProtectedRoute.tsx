import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import type { Role } from "../types";

interface Props {
  roles?: Role[];
  children: ReactNode;
}

export default function ProtectedRoute({ roles = [], children }: Props) {
  const { user, checking } = useAppSelector((state) => state.auth);
  if (checking)
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;
  if (roles.length && !roles.includes(user.role))
    return <Navigate to="/" replace />;
  return <>{children}</>;
}
