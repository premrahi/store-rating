import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { errMsg } from "../api/axios";
import type { SortState, Store } from "../types";

export interface StoreQuery extends Partial<SortState> { name?: string; email?: string; address?: string }
export interface CreateStorePayload { name: string; email: string; address: string; ownerId: number }
interface StoreState { list: Store[] }

export const fetchUserStores = createAsyncThunk<Store[], StoreQuery | undefined, { rejectValue: string }>("stores/userList", async (params, { rejectWithValue }) => {
  try { return (await api.get<Store[]>("/stores", { params })).data; }
  catch (e) { return rejectWithValue(errMsg(e)); }
});

export const fetchAdminStores = createAsyncThunk<Store[], StoreQuery | undefined, { rejectValue: string }>("stores/adminList", async (params, { rejectWithValue }) => {
  try { return (await api.get<Store[]>("/admin/stores", { params })).data; }
  catch (e) { return rejectWithValue(errMsg(e)); }
});

export const createStore = createAsyncThunk<Store, CreateStorePayload, { rejectValue: string }>("stores/create", async (form, { rejectWithValue }) => {
  try { return (await api.post<Store>("/admin/stores", form)).data; }
  catch (e) { return rejectWithValue(errMsg(e)); }
});

const storeSlice = createSlice({
  name: "stores", initialState: { list: [] } as StoreState, reducers: {},
  extraReducers: (builder) => builder
    .addCase(fetchUserStores.fulfilled, (state, action) => { state.list = action.payload; })
    .addCase(fetchAdminStores.fulfilled, (state, action) => { state.list = action.payload; })
});
export default storeSlice.reducer;
