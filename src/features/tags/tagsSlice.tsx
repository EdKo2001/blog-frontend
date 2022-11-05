import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "utils/axios";

export const fetchTags = createAsyncThunk(
  "posts/fetchTags",
  async (_, thunkAPI: any) => {
    try {
      const { data } = await axios.get("/posts/tags?page=1&limit=10");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState: {
  tags: {
    items: {
      next?: {
        page: number;
        limit: number;
      };
      previous?: {
        page: number;
        limit: number;
      };
      total?: number;
      results: string[];
    };
    status: string;
  };
} = {
  tags: {
    items: { results: [] },
    status: "loading",
  },
};

const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTags.pending, (state) => {
      state.tags.status = "loading";
    });
    builder.addCase(fetchTags.fulfilled, (state, { payload }) => {
      state.tags.items = payload;
      state.tags.status = "loaded";
    });
    builder.addCase(fetchTags.rejected, (state) => {
      state.tags.status = "error";
    });
  },
});

export const tagsReducer = tagsSlice.reducer;
