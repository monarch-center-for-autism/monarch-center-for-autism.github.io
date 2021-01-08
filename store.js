import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import Fuse from "fuse.js";
import * as google from "./utils/google-apis";

const fuse = new Fuse([], { keys: ["name"] });

const fetchStructure = createAsyncThunk("fetchData", async () => {
  return await google.getSiteStructure();
});

const refreshData = createAsyncThunk("refreshData", async () => {
  google.clearCache();
  return await google.getSiteStructure();
});

const { actions, reducer } = createSlice({
  name: "data",
  initialState: {
    user: "",
    query: "",
    data: [],
    loading: false,
  },
  reducers: {
    search: (state, { payload }) => {
      state.query = payload;
      state.displayData = fuse.search(payload).map((r) => r.item);
    },
    setUser: (state, { payload }) => {
      state.user = payload;
    },
  },
  extraReducers: {
    [fetchStructure.pending]: (state) => {
      state.loading = true;
    },
    [fetchStructure.fulfilled]: (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    },
    [fetchStructure.rejected]: (state) => {
      state.loading = false;
    },
    [refreshData.pending]: (state) => {
      state.loading = true;
    },
    [refreshData.fulfilled]: (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    },
    [refreshData.rejected]: (state) => {
      state.loading = false;
    },
  },
});

const store = configureStore({ reducer });

export { actions, store, fetchStructure, refreshData };
