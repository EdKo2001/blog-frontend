import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "utils/axios";

import IPost from "types/Post.interface";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (
    payload: {
      popular?: boolean;
      relevant?: boolean;
      tag?: string;
      page: number;
      limit: number;
    },
    thunkAPI: any
  ) => {
    try {
      const { popular, relevant, tag, page, limit } = payload;
      if (popular) {
        const { data } = await axios.get(
          `/posts?popular&page=${page}&limit=${limit}`
        );
        return { data, type: "popular" };
      }
      if (relevant) {
        const { data } = await axios.get(
          `/posts?relevant&page=${page}&limit=${limit}`
        );
        return { data, type: "relevant" };
      }
      if (tag) {
        const { data } = await axios.get(
          `/posts?tag=${tag}&page=${page}&limit=${limit}`
        );
        return { data, type: tag };
      }
      const { data } = await axios.get(`/posts?page=${page}&limit=${limit}`);
      return { data, type: "latest" };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchTags = createAsyncThunk(
  "posts/fetchTags",
  async (_, thunkAPI: any) => {
    try {
      const { data } = await axios.get("/posts/tags");
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
      results: IPost[];
    };
    type: "latest";
    status: string;
  };
  tags: {
    items: any[];
    status: string;
  };
} = {
  posts: {
    items: { results: [] },
    type: "latest",
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
      state.posts.status = "loading";
    });
    builder.addCase(fetchPosts.fulfilled, (state, { payload }) => {
      state.posts.items = {
        next: payload.data.next,
        previous: payload.data.previous,
        total: payload.data.total,
        results:
          state.posts.type === payload.type
            ? state.posts.items.results.concat(payload.data.results)
            : payload.data.results,
      };
      state.posts.type = payload.type;
      state.posts.status = "loaded";
    });
    builder.addCase(fetchPosts.rejected, (state) => {
      state.posts.status = "error";
    });

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
    builder.addCase(fetchRemovePost.pending, (state, action) => {
      state.posts.items.results = state.posts.items.results.filter(
        (obj) => obj._id !== action.meta.arg
      );
    });
  },
});

export const postsReducer = postsSlice.reducer;
