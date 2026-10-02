export type Role = "ADMIN" | "USER" | "OWNER";
export type SortOrder = "asc" | "desc";

export interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  role: Role;
  rating?: number | null;
}

export interface Store {
  id: number;
  name: string;
  email: string;
  address: string;
  rating?: number | null;
  overallRating?: number | null;
  myRating?: number | null;
}

export interface Rater {
  id: number;
  name?: string;
  nmae?: string;
  email: string;
  rating: number;
  date: string;
}

export interface Stats {
  users: number;
  stores: number;
  ratings: number;
}

export interface SortState {
  sortBy: string;
  order: SortOrder;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface UserFormData {
  name: string;
  email: string;
  address: string;
  password: string;
  role: Role;
}

export interface StoreFormData {
  name: string;
  email: string;
  address: string;
  ownerId: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface OwnerDashboard {
  store: Store | null;
  averageRating: number | null;
  raters: Rater[];
}
