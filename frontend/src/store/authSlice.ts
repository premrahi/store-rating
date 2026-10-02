import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import api, { errMsg } from "../api/axios";
import type { AuthResponse, LoginForm, User } from "../types";

interface ChangePasswordForm { currentPassword: string; newPassword: string }
interface ChangePasswordResponse { message: string }

interface AuthState {
  user: User | null;
  token: string | null;
  checking: boolean;
}

export const login = createAsyncThunk<AuthResponse, LoginForm, { rejectValue: string }>(
  "auth/login",
  async (form, { rejectWithValue }) => {
    try {
      const res = await api.post<AuthResponse>("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (e) { return rejectWithValue(errMsg(e)); }
  }
);

export const signup = createAsyncThunk<User, Record<string, unknown>, { rejectValue: string }>(
  "auth/signup",
  async (form, { rejectWithValue }) => {
    try { return (await api.post<User>("/auth/signup", form)).data; }
    catch (e) { return rejectWithValue(errMsg(e)); }
  }
);

export const fetchMe = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try { return (await api.get<User>("/auth/me")).data; }
    catch (e) { return rejectWithValue(errMsg(e)); }
  }
);

export const changePassword = createAsyncThunk<ChangePasswordResponse, ChangePasswordForm, { rejectValue: string }>(
  "auth/changePassword",
  async (form, { rejectWithValue }) => {
    try { return (await api.post<ChangePasswordResponse>("/auth/password", form)).data; }
    catch (e) { return rejectWithValue(errMsg(e)); }
  }
);

const token = localStorage.getItem("token");
const initialState: AuthState = { user: null, token, checking: Boolean(token) };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.checking = false;
      localStorage.removeItem("token");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.checking = false;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.checking = false;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.checking = false;
        localStorage.removeItem("token");
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
