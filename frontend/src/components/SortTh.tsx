import type { SortState } from "../types";

interface Props { label: string; field: string; sort: SortState; onSort: (sort: SortState) => void }

export default function SortTh({ label, field, sort, onSort }: Props) {
  const active = sort.sortBy === field;
  const handleClick = () => onSort({ sortBy: field, order: active && sort.order === "asc" ? "desc" : "asc" });

  return (
    <th>
      <button type="button" onClick={handleClick} className="btn btn-ghost btn-sm normal-case font-semibold gap-2">
        {label}
        <span className={`text-xs ${active ? "opacity-100" : "opacity-30"}`}>{active ? (sort.order === "asc" ? "▲" : "▼") : "↕"}</span>
      </button>
    </th>
  );
}
