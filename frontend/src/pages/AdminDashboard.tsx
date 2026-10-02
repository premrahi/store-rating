import { useEffect } from "react";
import { fetchDashboard } from "../store/userSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const stats = useAppSelector((s) => s.users.stats);
  useEffect(() => {
    void dispatch(fetchDashboard());
  }, [dispatch]);
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Overview"
        title="Admin dashboard"
        description="A quick view of your platform activity and core store-rating metrics."
      />
      <div className="grid gap-5 md:grid-cols-3">
        <StatCard label="Total users" value={stats.users} icon="♙" />
        <StatCard
          label="Total stores"
          value={stats.stores}
          icon="⌂"
          tone="bg-secondary/10 text-secondary"
        />
        <StatCard
          label="Total ratings"
          value={stats.ratings}
          icon="★"
          tone="bg-warning/15 text-warning"
        />
      </div>
      <div className="glass-card mt-6 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">Platform pulse</h2>
              <p className="text-sm text-base-content/50">
                Keep an eye on participation and feedback volume.
              </p>
            </div>
            <span className="badge badge-primary badge-outline">Live data</span>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <Metric
              label="Users"
              value={stats.users}
              max={Math.max(stats.users, 1)}
            />
            <Metric
              label="Stores"
              value={stats.stores}
              max={Math.max(stats.users, stats.stores, 1)}
            />
            <Metric
              label="Ratings"
              value={stats.ratings}
              max={Math.max(stats.ratings, 1)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
function Metric({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-bold">{value}</span>
      </div>
      <progress
        className="progress progress-primary w-full"
        value={value}
        max={max}
      />
    </div>
  );
}
