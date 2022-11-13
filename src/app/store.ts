import { configureStore } from "@reduxjs/toolkit";

import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import logger from "redux-logger";
import thunk from "redux-thunk";

import { tagsReducer } from "features/tags/tagsSlice";
import { authReducer } from "features/auth/authSlice";

const store = configureStore({
  reducer: { auth: authReducer, tags: tagsReducer },
  middleware:
    process.env.NODE_ENV === "development" ? [thunk, logger] : [thunk],
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type TypedDispatch = ThunkDispatch<RootState, any, AnyAction>;
