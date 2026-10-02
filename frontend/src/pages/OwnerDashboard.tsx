import { useEffect, useState } from "react";
import { fetchOwnerDashboard } from "../store/ratingSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import SortTh from "../components/SortTh";
import PageHeader from "../components/PageHeader";
import type { SortState } from "../types";
import { showRating } from "../utils/validate";
import { EmptyRow } from "./AdminUsers";

export default function OwnerDashboard() {
  const dispatch = useAppDispatch();
  const { store, averageRating, raters } = useAppSelector((s) => s.ratings);
  const [sort, setSort] = useState<SortState>({
    sortBy: "date",
    order: "desc",
  });
  const [error, setError] = useState("");
  useEffect(() => {
    setError("");
    void dispatch(fetchOwnerDashboard(sort))
      .unwrap()
      .catch((err) => setError(String(err)));
  }, [dispatch, sort]);
  if (error)
    return (
      <div className="page-shell">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Owner workspace"
        title={store?.name ?? "My store"}
        description="See your store's rating performance and the customers who shared feedback."
      />
      <div className="grid gap-5 md:grid-cols-3">
        <div className="glass-card p-6 md:col-span-1">
          <p className="text-sm text-base-content/50">Average rating</p>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-5xl font-black text-warning">
              {showRating(averageRating)}
            </span>
            <span className="pb-2 text-warning">★ / 5</span>
          </div>
          <progress
            className="progress progress-warning mt-5 w-full"
            value={averageRating ?? 0}
            max="5"
          />
          <p className="mt-3 text-xs text-base-content/45">
            Based on customer ratings for your store.
          </p>
        </div>
        <div className="glass-card p-6 md:col-span-2">
          <p className="text-sm text-base-content/50">Rating activity</p>
          <p className="mt-3 text-4xl font-extrabold">{raters.length}</p>
          <p className="mt-1 text-sm text-base-content/50">
            customer ratings received
          </p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold">
          Customers who rated your store
        </h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <SortTh
                  label="Name"
                  field="name"
                  sort={sort}
                  onSort={setSort}
                />
                <SortTh
                  label="Email"
                  field="email"
                  sort={sort}
                  onSort={setSort}
                />
                <SortTh
                  label="Rating"
                  field="rating"
                  sort={sort}
                  onSort={setSort}
                />
                <SortTh
                  label="Date"
                  field="date"
                  sort={sort}
                  onSort={setSort}
                />
              </tr>
            </thead>
            <tbody>
              {raters.map((r) => (
                <tr key={r.id} className="hover">
                  <td className="font-semibold">{r.name ?? r.nmae}</td>
                  <td>{r.email}</td>
                  <td>
                    <span className="text-warning font-bold">★ {r.rating}</span>
                  </td>
                  <td>{new Date(r.date).toLocaleDateString()}</td>
                </tr>
              ))}
              {raters.length === 0 && (
                <EmptyRow colSpan={4} text="No ratings yet" />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
