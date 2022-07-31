import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

export const fetchAuth = createAsyncThunk(
  "auth/fetchAuth",
  async (params: any, thunkAPI: any) => {
    try {
      const { data } = await axios.post("/auth/login", params);
      console.log(data);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchRegister = createAsyncThunk(
  "auth/fetchRegister",
  async (params: any, thunkAPI: any) => {
    try {
      const { data } = await axios.post("/auth/register", params);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchAuthMe = createAsyncThunk(
  "auth/fetchAuthMe",
  async (_, thunkAPI: any) => {
    try {
      const { data } = await axios.get("/auth/user");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState: any = {
  data: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAuth.pending, (state) => {
      state.status = "loading";
      state.data = null;
    });
    builder.addCase(fetchAuth.fulfilled, (state, { payload }) => {
      state.status = "loaded";
      state.data = payload;
    });
    builder.addCase(fetchAuth.rejected, (state) => {
      state.status = "error";
      state.data = null;
    });
    builder.addCase(fetchAuthMe.pending, (state) => {
      state.status = "loading";
      state.data = null;
    });
    builder.addCase(fetchAuthMe.fulfilled, (state, { payload }) => {
      state.status = "loaded";
      state.data = payload;
    });
    builder.addCase(fetchAuthMe.rejected, (state) => {
      state.status = "error";
      state.data = null;
    });
    builder.addCase(fetchRegister.pending, (state) => {
      state.status = "loading";
      state.data = null;
    });
    builder.addCase(fetchRegister.fulfilled, (state, { payload }) => {
      state.status = "loaded";
      state.data = payload;
    });
    builder.addCase(fetchRegister.rejected, (state) => {
      state.status = "error";
      state.data = null;
    });
  },
});

export const selectIsAuth = (state: any) => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;
