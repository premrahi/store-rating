export type Role = "ADMIN" | "USER" | "OWNER";

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  address: string;
  role: Role;
}

export interface JWTPayload {
  id: number;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}
