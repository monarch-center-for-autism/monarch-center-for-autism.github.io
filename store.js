import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import Fuse from "fuse.js";
import groupBy from "lodash.groupby";
import mapKeys from "lodash.mapkeys";
import partition from "lodash.partition";

const fuse = new Fuse([], { keys: ["name"] });

const fetchData = createAsyncThunk("fetchData", async () => {
  const response = await window.gapi.client.drive.files.list({
    includeItemsFromAllDrives: false,
    fields:
      "nextPageToken, files(id, name, description, iconLink, thumbnailLink, contentHints, webViewLink, exportLinks, webContentLink, fullFileExtension, parents, properties, mimeType)",
  });

  const [folders, files] = partition(response.result.files, [
    "mimeType",
    "application/vnd.google-apps.folder",
  ]);

  const idCategories = groupBy(files, "parents[0]");
  return mapKeys(
    idCategories,
    (_, id) => folders.find((f) => f.id === id)?.name ?? "Missing Folder"
  );
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
