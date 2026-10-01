import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PublicUser } from "../types";
import Cookies from "js-cookie";

interface AuthState {
  token: string | null;
  user: PublicUser | null;
}

const initialState: AuthState = {
  token: Cookies.get("token") || localStorage.getItem("token"),
  user: null,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: PublicUser }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;

      // Save token in cookie (expires in 7 days, available across the site)
      Cookies.set('token', action.payload.token, {
        expires: 7,
        path: '/',
        sameSite: 'lax',
        secure: window.location.protocol === 'https:',
      });
    },
    setUser: (state, action: PayloadAction<PublicUser>) => {
      state.user = action.payload;
    },
    clearCredentials: (state) => {
      state.token = null;
      state.user = null;

      // Remove token cookie
      Cookies.remove('token', { path: '/' });
    },
  },
});

export const { setCredentials, setUser, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
