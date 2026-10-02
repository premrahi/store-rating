import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import storeReducer from "./storeSlice";
import ratingReducer from "./ratingSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    stores: storeReducer,
    ratings: ratingReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
