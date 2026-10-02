import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { fetchUsers } from "../store/userSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import SortTh from "../components/SortTh";
import PageHeader from "../components/PageHeader";
import type { Role, SortState } from "../types";

export default function AdminUsers() {
  const dispatch = useAppDispatch();
  const users = useAppSelector((s) => s.users.list);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "" as "" | Role,
  });
  const [sort, setSort] = useState<SortState>({ sortBy: "name", order: "asc" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const load = async () => {
    setError("");
    setLoading(true);
    try {
      await dispatch(fetchUsers({ ...filters, ...sort })).unwrap();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, [sort]);
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFilters((v) => ({
      ...v,
      [e.target.name]: e.target.value as typeof v.role,
    }));
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    void load();
  };
  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Administration"
        title="Users"
        description="Search, sort, and inspect every account in the platform."
        action={
          <Link to="/admin/add-user" className="btn btn-primary rounded-xl">
            ＋ Add user
          </Link>
        }
      />
      <div className="glass-card p-4 sm:p-5">
        <form
          className="grid gap-3 md:grid-cols-2 xl:grid-cols-5"
          onSubmit={handleSearch}
        >
          <input
            className="input input-bordered"
            name="name"
            placeholder="Search name"
            value={filters.name}
            onChange={handleChange}
          />
          <input
            className="input input-bordered"
            name="email"
            placeholder="Search email"
            value={filters.email}
            onChange={handleChange}
          />
          <input
            className="input input-bordered"
            name="address"
            placeholder="Search address"
            value={filters.address}
            onChange={handleChange}
          />
          <select
            className="select select-bordered"
            name="role"
            value={filters.role}
            onChange={handleChange}
          >
            <option value="">All roles</option>
            <option value="USER">Normal User</option>
            <option value="OWNER">Store Owner</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button className="btn btn-primary rounded-xl">
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Search"
            )}
          </button>
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
              <SortTh label="Role" field="role" sort={sort} onSort={setSort} />
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover">
                <td className="font-semibold">{u.name}</td>
                <td>{u.email}</td>
                <td className="max-w-xs truncate">{u.address}</td>
                <td>
                  <RoleBadge role={u.role} />
                </td>
                <td>
                  <Link
                    className="btn btn-ghost btn-sm text-primary"
                    to={`/admin/users/${u.id}`}
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <EmptyRow colSpan={5} text="No users found" />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export function RoleBadge({ role }: { role: Role }) {
  const cls =
    role === "ADMIN"
      ? "badge-primary"
      : role === "OWNER"
        ? "badge-secondary"
        : "badge-ghost";
  return <span className={`badge ${cls}`}>{role}</span>;
}
export function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-16 text-center text-base-content/45">
        {text}
      </td>
    </tr>
  );
}
