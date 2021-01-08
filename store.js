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

const { actions, reducer } = createSlice({
  name: "data",
  initialState: {
    query: "",
    data: [],
    displayData: [],
    loading: false,
  },
  reducers: {
    search: (state, { payload }) => {
      state.query = payload;
      state.displayData = fuse.search(payload).map((r) => r.item);
    },
  },
  extraReducers: {
    [fetchStructure.pending]: (state) => {
      state.loading = true;
    },
    [fetchStructure.fulfilled]: (state, { payload }) => {
      fuse.setCollection(payload);

      state.data = payload;
      state.displayData = fuse.search(state.query);
      state.loading = false;
    },
    [fetchStructure.rejected]: (state) => {
      state.loading = false;
    },
  },
});

const store = configureStore({ reducer });

export { actions, store, fetchStructure };
