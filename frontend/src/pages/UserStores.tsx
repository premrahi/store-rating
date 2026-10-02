import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { fetchUserStores } from "../store/storeSlice";
import { submitRating } from "../store/ratingSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import SortTh from "../components/SortTh";
import PageHeader from "../components/PageHeader";
import { showRating } from "../utils/validate";
import type { SortState, Store } from "../types";
import { EmptyRow } from "./AdminUsers";

function StoreRow({
  store,
  onRate,
}: {
  store: Store;
  onRate: (id: number, rating: number) => Promise<void>;
}) {
  const [value, setValue] = useState(store.myRating ?? 5);
  const [ratingLoading, setRatingLoading] = useState(false);
  const submit = async () => {
    setRatingLoading(true);
    try {
      await onRate(store.id, value);
    } finally {
      setRatingLoading(false);
    }
  };
  return (
    <tr className="hover">
      <td className="font-semibold">{store.name}</td>
      <td className="max-w-sm truncate">{store.address}</td>
      <td>
        <span className="inline-flex rounded-full bg-warning/10 px-3 py-1 text-sm font-bold text-warning">
          ★ {showRating(store.overallRating)}
        </span>
      </td>
      <td>
        {store.myRating ? (
          <span className="badge badge-primary badge-outline">
            {store.myRating}/5
          </span>
        ) : (
          <span className="text-sm text-base-content/40">Not rated</span>
        )}
      </td>
      <td>
        <div className="flex items-center gap-2">
          <select
            className="select select-bordered select-sm w-20"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
          <button
            disabled={ratingLoading}
            onClick={submit}
            className="btn btn-primary btn-sm rounded-lg"
          >
            {ratingLoading ? (
              <span className="loading loading-spinner loading-xs" />
            ) : store.myRating ? (
              "Update"
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function UserStores() {
  const dispatch = useAppDispatch();
  const stores = useAppSelector((s) => s.stores.list);
  const [filters, setFilters] = useState({ name: "", address: "" });
  const [sort, setSort] = useState<SortState>({ sortBy: "name", order: "asc" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const load = async () => {
    setError("");
    setLoading(true);
    try {
      await dispatch(fetchUserStores({ ...filters, ...sort })).unwrap();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
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
  const handleRate = async (storeId: number, rating: number) => {
    setError("");
    try {
      await dispatch(submitRating({ storeId, rating })).unwrap();
      await load();
    } catch (err) {
      setError(String(err));
    }
  };
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Customer workspace"
        title="Browse stores"
        description="Explore stores, compare ratings, and leave your own feedback."
      />
      <div className="glass-card p-4 sm:p-5">
        <form className="grid gap-3 md:grid-cols-3" onSubmit={handleSearch}>
          <input
            className="input input-bordered"
            name="name"
            placeholder="Search by store name"
            value={filters.name}
            onChange={handleChange}
          />
          <input
            className="input input-bordered"
            name="address"
            placeholder="Search by address"
            value={filters.address}
            onChange={handleChange}
          />
          <button className="btn btn-primary rounded-xl">
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Search stores"
            )}
          </button>
        </form>
      </div>
      {error && <div className="alert alert-error mt-5">{error}</div>}
      <div className="table-wrap mt-6">
        <table className="table">
          <thead>
            <tr>
              <SortTh label="Store" field="name" sort={sort} onSort={setSort} />
              <SortTh
                label="Address"
                field="address"
                sort={sort}
                onSort={setSort}
              />
              <SortTh
                label="Overall rating"
                field="overallRating"
                sort={sort}
                onSort={setSort}
              />
              <SortTh
                label="My rating"
                field="myRating"
                sort={sort}
                onSort={setSort}
              />
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <StoreRow
                key={`${s.id}-${s.myRating}`}
                store={s}
                onRate={handleRate}
              />
            ))}
            {stores.length === 0 && (
              <EmptyRow colSpan={5} text="No stores found" />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
