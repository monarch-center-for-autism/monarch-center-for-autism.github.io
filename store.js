import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import Fuse from "fuse.js";

const fuse = new Fuse([], {});

const fetchData = createAsyncThunk("fetchData", async () => {
  const response = await window.gapi.client.drive.files.list({
    pageSize: 10,
    fields:
      "nextPageToken, files(id, name, description, iconLink, thumbnailLink, contentHints, webContentLink)",
  });
  return response.result.files;
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
      state.displayData = fuse.search(payload);
    },
  },
  extraReducers: {
    [fetchData.pending]: (state) => {
      state.loading = true;
    },
    [fetchData.fulfilled]: (state, { payload }) => {
      fuse.setCollection(payload);

      state.data = payload;
      state.displayData = fuse.search(state.query);
      state.loading = false;
    },
    [fetchData.rejected]: (state) => {
      state.loading = false;
    },
  },
});

const store = configureStore({ reducer });

export { actions, store, fetchData };
