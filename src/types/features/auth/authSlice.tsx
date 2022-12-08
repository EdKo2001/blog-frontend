import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "utils/axios";

export const authLogin = createAsyncThunk(
  "auth/authLogin",
  async (params: any, thunkAPI: any) => {
    try {
      const { data } = await axios.post("/auth/login", params);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response.data.errors ? err.response.data.errors : err.response.data
      );
    }
  }
);

export const authRegister = createAsyncThunk(
  "auth/authRegister",
  async (params: any, thunkAPI: any) => {
    try {
      const { data } = await axios.post("/auth/register", params);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response.data.errors ? err.response.data.errors : err.response.data
      );
    }
  }
);

export const authLoginMe = createAsyncThunk(
  "auth/authLoginMe",
  async (_, thunkAPI: any) => {
    try {
      const { data } = await axios.get("/auth/user");
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

const initialState: any = {
  data: null,
  status: "loading",
  errors: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    },
    resetErrors: (state) => {
      state.errors = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authLogin.pending, (state) => {
      state.status = "loading";
      state.data = null;
    });
    builder.addCase(authLogin.fulfilled, (state, { payload }) => {
      state.status = "loaded";
      state.data = payload;
    });
    builder.addCase(authLogin.rejected, (state, { payload }) => {
      state.status = "error";
      state.data = null;
      state.errors = payload;
      console.log(payload);
    });
    builder.addCase(authLoginMe.pending, (state) => {
      state.status = "loading";
      state.data = null;
    });
    builder.addCase(authLoginMe.fulfilled, (state, { payload }) => {
      state.status = "loaded";
      state.data = payload;
    });
    builder.addCase(authLoginMe.rejected, (state) => {
      state.status = "error";
      state.data = null;
    });
    builder.addCase(authRegister.pending, (state) => {
      state.status = "loading";
      state.data = null;
    });
    builder.addCase(authRegister.fulfilled, (state, { payload }) => {
      state.status = "loaded";
      state.data = payload;
    });
    builder.addCase(authRegister.rejected, (state, { payload }) => {
      state.status = "error";
      state.data = null;
      state.errors = payload;
    });
  },
});

export const selectIsAuth = (state: any) => Boolean(state.auth.data);
export const selectAuthErrors = (state: any) => state.auth.errors;

export const authReducer = authSlice.reducer;

export const { logout, resetErrors } = authSlice.actions;
