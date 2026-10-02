import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { errMsg } from "../api/axios";
import type { Role, SortState, Stats, User } from "../types";

export interface UserQuery extends Partial<SortState> { name?: string; email?: string; address?: string; role?: Role | "" }
interface UserState { list: User[]; selected: User | null; stats: Stats }

export const fetchDashboard = createAsyncThunk<Stats, void, { rejectValue: string }>("users/dashboard", async (_, { rejectWithValue }) => {
  try { return (await api.get<Stats>("/admin/dashboard")).data; }
  catch (e) { return rejectWithValue(errMsg(e)); }
});

export const fetchUsers = createAsyncThunk<User[], UserQuery | undefined, { rejectValue: string }>("users/list", async (params, { rejectWithValue }) => {
  try { return (await api.get<User[]>("/admin/users", { params })).data; }
  catch (e) { return rejectWithValue(errMsg(e)); }
});

export const fetchUser = createAsyncThunk<User, number | string | undefined, { rejectValue: string }>("users/one", async (id, { rejectWithValue }) => {
  try { return (await api.get<User>(`/admin/users/${id}`)).data; }
  catch (e) { return rejectWithValue(errMsg(e)); }
});

export const createUser = createAsyncThunk<User, Record<string, unknown>, { rejectValue: string }>("users/create", async (form, { rejectWithValue }) => {
  try { return (await api.post<User>("/admin/users", form)).data; }
  catch (e) { return rejectWithValue(errMsg(e)); }
});

const initialState: UserState = { list: [], selected: null, stats: { users: 0, stores: 0, ratings: 0 } };
const userSlice = createSlice({
  name: "users", initialState, reducers: {},
  extraReducers: (builder) => builder
    .addCase(fetchDashboard.fulfilled, (state, action) => { state.stats = action.payload; })
    .addCase(fetchUsers.fulfilled, (state, action) => { state.list = action.payload; })
    .addCase(fetchUser.pending, (state) => { state.selected = null; })
    .addCase(fetchUser.fulfilled, (state, action) => { state.selected = action.payload; })
});
export default userSlice.reducer;
