import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "utils/axios";

import IPost from "types/Post.interface";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, thunkAPI: any) => {
    try {
      const { data } = await axios.get("/posts");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchTags = createAsyncThunk(
  "posts/fetchTags",
  async (_, thunkAPI: any) => {
    try {
      const { data } = await axios.get("/tags");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchRemovePost = createAsyncThunk(
  "posts/fetchRemovePost",
  async (id: number, thunkAPI: any) => {
    try {
      return axios.delete(`/posts/${id}`);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState: {
  posts: {
    items: IPost[];
    status: string;
  };
  tags: {
    items: any[];
    status: string;
  };
} = {
  posts: {
    items: [],
    status: "loading",
  },
  tags: {
    items: [],
    status: "loading",
  },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state) => {
      state.posts.items = [];
      state.posts.status = "loading";
    });
    builder.addCase(fetchPosts.fulfilled, (state, { payload }) => {
      state.posts.items = payload;
      state.posts.status = "loaded";
    });
    builder.addCase(fetchPosts.rejected, (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    });

    builder.addCase(fetchTags.pending, (state) => {
      state.tags.items = [];
      state.tags.status = "loading";
    });
    builder.addCase(fetchTags.fulfilled, (state, { payload }) => {
      state.tags.items = payload;
      state.tags.status = "loaded";
    });
    builder.addCase(fetchTags.rejected, (state) => {
      state.tags.items = [];
      state.tags.status = "error";
    });

    builder.addCase(fetchRemovePost.pending, (state, action) => {
      state.posts.items = state.posts.items.filter(
        (obj) => obj._id !== action.meta.arg
      );
    });
  },
});

export const postsReducer = postsSlice.reducer;
