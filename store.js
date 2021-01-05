import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import Fuse from "fuse.js";

const fuse = new Fuse([], {});

const fetchData = createAsyncThunk("fetchData", async (thunkApi) => {});

const { actions, reducer } = createSlice({
  name: "data",
  initialState: {
    query: "",
    data: [],
    displayData: [],
  },
  reducers: {
    search: (state, { payload }) => {
      state.query = payload;
      state.displayData = fuse.search(payload);
    },
  },
  extraReducers: {
    [fetchData.fulfilled]: (state, { payload }) => {
      fuse.setCollection(payload);

      state.data = payload;
      state.displayData = fuse.search(state.query);
    },
  },
});

const store = configureStore({ reducer });

export { actions, store };
