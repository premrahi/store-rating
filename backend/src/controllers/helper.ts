import { AnyColumn, asc, desc, ilike, SQL } from "drizzle-orm";

type Orderable = AnyColumn | SQL;

export const likeFilters = (
  query: Record<string, unknown>,
  columns: Record<string, AnyColumn>,
): SQL[] => {
  const conditions: SQL[] = [];
  for (const [key, col] of Object.entries(columns)) {
    const raw = query[key];
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (typeof value === "string" && value) {
      conditions.push(ilike(col, `%${value}%`));
    }
  }

  return conditions;
};


export const sortColumn = (
  sortBy: string | undefined,
  order: string | undefined,
  allowed: Record<string, Orderable>,
  fallbackKey: string,
): SQL => {
  const col = allowed[sortBy ?? ""] || allowed[fallbackKey];
  return (order?.toLowerCase() === "desc" ? desc(col) : asc(col)) as SQL;
};
