import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import { createStore } from "../store/storeSlice";
import { fetchUsers } from "../store/userSlice";
import { checkAddress, checkEmail, checkName } from "../utils/validate";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import PageHeader from "../components/PageHeader";
import type { StoreFormData } from "../types";

interface FieldProps {
  label: string;
  error?: string;
  children: ReactNode;
}

export default function AddStore() {
  const dispatch = useAppDispatch();
  const owners = useAppSelector((state) =>
    state.users.list.filter((user) => user.role === "OWNER"),
  );

  const [form, setForm] = useState<StoreFormData>({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });
  const [ownerSearch, setOwnerSearch] = useState("");
  const [ownersLoading, setOwnersLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;

    setOwnersLoading(true);
    void dispatch(
      fetchUsers({ role: "OWNER", sortBy: "name", order: "asc" }),
    ).finally(() => {
      if (mounted) setOwnersLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  const filteredOwners = useMemo(() => {
    const query = ownerSearch.trim().toLowerCase();

    if (!query) return owners;

    return owners.filter(
      (owner) =>
        owner.name.toLowerCase().includes(query) ||
        owner.email.toLowerCase().includes(query),
    );
  }, [owners, ownerSearch]);

  const selectedOwner = owners.find(
    (owner) => String(owner.id) === form.ownerId,
  );

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));

    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: "" }));
    }
  };

  const handleOwnerSelect = (ownerId: number) => {
    setForm((current) => ({ ...current, ownerId: String(ownerId) }));
    setErrors((current) => ({ ...current, ownerId: "" }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const found: Record<string, string> = {
      name: checkName(form.name),
      email: checkEmail(form.email),
      address: checkAddress(form.address),
      ownerId: form.ownerId ? "" : "Please select a store owner.",
    };

    setErrors(found);

    if (Object.values(found).some(Boolean)) return;

    try {
      await dispatch(
        createStore({
          name: form.name,
          email: form.email,
          address: form.address,
          ownerId: Number(form.ownerId),
        }),
      ).unwrap();

      setSuccess(
        `${form.name} was created and assigned to ${selectedOwner?.name ?? "the selected owner"}.`,
      );
      setForm({ name: "", email: "", address: "", ownerId: "" });
      setOwnerSearch("");
    } catch (err) {
      setError(String(err));
    }
  };

  return (
    <div className="page-shell max-w-3xl">
      <PageHeader
        eyebrow="Administration"
        title="Add store"
        description="Create a store and assign it to an existing Store Owner account. The owner will use their existing email and password to sign in."
      />

      <form
        className="card border border-base-300/70 bg-base-100 shadow-soft"
        onSubmit={handleSubmit}
      >
        <div className="card-body gap-6">
          <div className="flex items-center gap-3 border-b border-base-200 pb-5">
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <span className="icon-[tabler--building-store] size-6" />
            </div>
            <div>
              <h2 className="font-bold">Store details</h2>
              <p className="text-sm text-base-content/55">
                Enter the basic information for the new store.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Store name" error={errors.name}>
              <input
                className="input input-bordered w-full"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Sharma Electronics"
              />
            </Field>

            <Field label="Store email" error={errors.email}>
              <input
                className="input input-bordered w-full"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="store@example.com"
              />
            </Field>
          </div>

          <Field label="Address" error={errors.address}>
            <textarea
              className="textarea textarea-bordered min-h-28 w-full"
              name="address"
              rows={4}
              value={form.address}
              onChange={handleChange}
              placeholder="Full store address"
            />
          </Field>

          <div className="divider my-0" />

          <div>
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-bold">Assign store owner</h2>
                <p className="mt-1 text-sm text-base-content/55">
                  Select an existing OWNER account. No new password is created
                  here.
                </p>
              </div>
              <div className="badge badge-primary badge-outline gap-1 whitespace-nowrap">
                <span className="icon-[tabler--lock] size-3.5" />
                Existing account
              </div>
            </div>

            <label className="input input-bordered flex w-full items-center gap-2">
              <span className="icon-[tabler--search] size-4 text-base-content/45" />
              <input
                type="search"
                value={ownerSearch}
                onChange={(event) => setOwnerSearch(event.target.value)}
                placeholder="Search owner by name or email..."
                className="grow"
              />
            </label>

            {errors.ownerId && (
              <p className="mt-2 text-xs text-error">{errors.ownerId}</p>
            )}

            <div className="mt-3 overflow-hidden rounded-xl border border-base-300 bg-base-100">
              {ownersLoading ? (
                <div className="flex items-center justify-center gap-3 p-8 text-sm text-base-content/55">
                  <span className="loading loading-spinner loading-sm text-primary" />
                  Loading Store Owners...
                </div>
              ) : owners.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="mx-auto grid size-12 place-items-center rounded-full bg-warning/10 text-warning">
                    <span className="icon-[tabler--user-off] size-6" />
                  </div>
                  <h3 className="mt-3 font-bold">No Store Owners found</h3>
                  <p className="mx-auto mt-1 max-w-md text-sm text-base-content/55">
                    Create an OWNER account first, then return here to assign it
                    to this store.
                  </p>
                  <Link
                    to="/admin/add-user"
                    className="btn btn-primary btn-sm mt-4 rounded-lg"
                  >
                    <span className="icon-[tabler--user-plus] size-4" />
                    Create Store Owner
                  </Link>
                </div>
              ) : filteredOwners.length === 0 ? (
                <div className="p-6 text-center text-sm text-base-content/55">
                  No owners match “{ownerSearch}”.
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto p-2">
                  {filteredOwners.map((owner) => {
                    const selected = String(owner.id) === form.ownerId;

                    return (
                      <button
                        key={owner.id}
                        type="button"
                        onClick={() => handleOwnerSelect(owner.id)}
                        className={`group flex w-full items-center gap-3 rounded-lg p-3 text-left transition hover:bg-base-200 ${
                          selected ? "bg-primary/10 ring-1 ring-primary/30" : ""
                        }`}
                      >
                        <div className="avatar placeholder">
                          <div
                            className={`grid size-10 rounded-full ${
                              selected
                                ? "bg-primary text-primary-content"
                                : "bg-base-200 text-base-content"
                            }`}
                          >
                            <span className="font-bold">
                              {owner.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold">{owner.name}</p>
                          <p className="truncate text-sm text-base-content/50">
                            {owner.email}
                          </p>
                        </div>

                        <span className="badge badge-ghost badge-sm shrink-0">
                          OWNER
                        </span>

                        {selected && (
                          <span className="grid size-7 place-items-center rounded-full bg-primary text-primary-content">
                            <span className="icon-[tabler--check] size-4" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedOwner && (
              <div className="alert alert-info mt-3 items-start text-sm">
                <span className="icon-[tabler--info-circle] mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="font-semibold">
                    {selectedOwner.name} will manage this store.
                  </p>
                  <p className="text-xs opacity-75">
                    They will log in with {selectedOwner.email} and their existing
                    password.
                  </p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="alert alert-error text-sm">
              <span className="icon-[tabler--alert-circle] size-5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success text-sm">
              <span className="icon-[tabler--circle-check] size-5" />
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={ownersLoading || owners.length === 0}
            className="btn btn-primary mt-1 w-full rounded-xl sm:w-auto sm:self-end"
          >
            <span className="icon-[tabler--building-plus] size-5" />
            Create Store
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, children }: FieldProps) {
  return (
    <label className="form-control w-full gap-2">
      <span className="label-text font-semibold">{label}</span>
      {children}
      {error && <span className="text-xs text-error">{error}</span>}
    </label>
  );
}
