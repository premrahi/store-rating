import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { errMsg } from "../api/axios";
import type { OwnerDashboard, SortState } from "../types";

export const submitRating = createAsyncThunk<unknown, { storeId: number; rating: number }, { rejectValue: string }>("ratings/submit", async ({ storeId, rating }, { rejectWithValue }) => {
  try { return (await api.put(`/stores/${storeId}/rating`, { rating })).data; }
  catch (e) { return rejectWithValue(errMsg(e)); }
});

export const fetchOwnerDashboard = createAsyncThunk<OwnerDashboard, SortState, { rejectValue: string }>("ratings/owner", async (params, { rejectWithValue }) => {
  try { return (await api.get<OwnerDashboard>("/owner/dashboard", { params })).data; }
  catch (e) { return rejectWithValue(errMsg(e)); }
});

const ratingSlice = createSlice({
  name: "ratings",
  initialState: { store: null, averageRating: null, raters: [] } as OwnerDashboard,
  reducers: {},
  extraReducers: (builder) => builder.addCase(fetchOwnerDashboard.fulfilled, (state, action) => {
    state.store = action.payload.store;
    state.averageRating = action.payload.averageRating;
    state.raters = action.payload.raters;
  })
});
export default ratingSlice.reducer;
