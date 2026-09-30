export type Role = "ADMIN" | "USER" | "OWNER";

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  address: string;
  role: Role;
}

export interface AdminUserRow {
  id: number;
  name: string;
  email: string;
  address: string;
  role: Role;
  rating?: number | null; // present on;ly when the role is 'OWNER'
}

export interface AdminStoreRow {
  id: number;
  name: string;
  email: string;
  address: string;
  rating?: number | null; // present on;ly when the role is 'OWNER'
}

export interface UserStoreRow {
  id: number;
  name: string;
  address: string;
  overallRating: number | null;
  myRating: number | null;
}

export interface OwnerRaterRow {
  id: number;
  name: string;
  email: string;
  rating: number;
  date: string;
}

export interface OwnerDashboardData {
  store: { id: number; name: string };
  averageRating : number|null ;
  raters : OwnerRaterRow[] ;
}


export type SortOrder = 'asc' | 'desc' ;

export interface SortState {
    sortBy : string ;
    order:SortOrder ;
}