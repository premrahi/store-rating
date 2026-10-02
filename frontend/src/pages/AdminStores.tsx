import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { fetchAdminStores } from "../store/storeSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import SortTh from "../components/SortTh";
import PageHeader from "../components/PageHeader";
import { showRating } from "../utils/validate";
import type { SortState } from "../types";
import { EmptyRow } from "./AdminUsers";

export default function AdminStores() {
  const dispatch = useAppDispatch();
  const stores = useAppSelector((s) => s.stores.list);
  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
  const [sort, setSort] = useState<SortState>({ sortBy: "name", order: "asc" });
  const [error, setError] = useState("");
  const load = async () => {
    setError("");
    try {
      await dispatch(fetchAdminStores({ ...filters, ...sort })).unwrap();
    } catch (err) {
      setError(String(err));
    }
  };
  useEffect(() => {
    void load();
  }, [sort]);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFilters((v) => ({ ...v, [e.target.name]: e.target.value }));
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    void load();
  };
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Administration"
        title="Stores"
        description="Review store profiles and their current average ratings."
        action={
          <Link to="/admin/add-store" className="btn btn-primary rounded-xl">
            ＋ Add store
          </Link>
        }
      />
      <div className="glass-card p-4 sm:p-5">
        <form
          className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"
          onSubmit={handleSearch}
        >
          <input
            className="input input-bordered"
            name="name"
            placeholder="Store name"
            value={filters.name}
            onChange={handleChange}
          />
          <input
            className="input input-bordered"
            name="email"
            placeholder="Store email"
            value={filters.email}
            onChange={handleChange}
          />
          <input
            className="input input-bordered"
            name="address"
            placeholder="Store address"
            value={filters.address}
            onChange={handleChange}
          />
          <button className="btn btn-primary rounded-xl">Search</button>
        </form>
      </div>
      {error && <div className="alert alert-error mt-5">{error}</div>}
      <div className="table-wrap mt-6">
        <table className="table">
          <thead>
            <tr>
              <SortTh label="Name" field="name" sort={sort} onSort={setSort} />
              <SortTh
                label="Email"
                field="email"
                sort={sort}
                onSort={setSort}
              />
              <SortTh
                label="Address"
                field="address"
                sort={sort}
                onSort={setSort}
              />
              <SortTh
                label="Rating"
                field="rating"
                sort={sort}
                onSort={setSort}
              />
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s.id} className="hover">
                <td className="font-semibold">{s.name}</td>
                <td>{s.email}</td>
                <td className="max-w-md truncate">{s.address}</td>
                <td>
                  <Rating value={s.rating} />
                </td>
              </tr>
            ))}
            {stores.length === 0 && (
              <EmptyRow colSpan={4} text="No stores found" />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function Rating({ value }: { value: number | null | undefined }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-3 py-1 text-sm font-bold text-warning">
      ★ {showRating(value)}
    </span>
  );
}
