export const checkName = (value: string): string =>
  value.trim().length < 3 || value.trim().length > 60 ? "Name must be 3 to 60 characters" : "";

export const checkEmail = (value: string): string =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Enter a valid email";

export const checkAddress = (value: string): string =>
  !value.trim() ? "Address is required" : value.length > 400 ? "Address can be at most 400 characters" : "";

export const checkPassword = (value: string): string => {
  if (value.length < 8 || value.length > 16) return "Password must be 8 to 16 characters";
  if (!/[A-Z]/.test(value)) return "Password needs at least one uppercase letter";
  if (!/[^A-Za-z0-9]/.test(value)) return "Password needs at least one special character";
  return "";
};

export const showRating = (value: number | null | undefined): string =>
  value === null || value === undefined ? "No rating" : Number(value).toFixed(1);
