import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import * as google from "./utils/google-apis";

const fetchStructure = createAsyncThunk("fetchData", async () => {
  return await google.getSiteStructure();
});

const fetchCategory = createAsyncThunk(
  "refreshData",
  async (category, thunkAPI) => {
    const nextPageToken = thunkAPI
      .getState()
      .data.flatMap((d) => d.categories)
      .find((c) => c.id === category)?.nextPageToken;
    return await google.getFiles(category, nextPageToken);
  }
);

const { actions, reducer } = createSlice({
  name: "data",
  initialState: {
    user: "",
    data: [],
  },
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },
  },
  extraReducers: {
    [fetchStructure.fulfilled]: (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    },
    [fetchCategory.fulfilled]: (state, { payload }) => {
      const { page, category, files, nextPageToken } = payload;
      const pageIndex = state.data.findIndex((p) => p.id === page);
      const categoryIndex = state.data[pageIndex].categories.findIndex(
        (c) => c.id === category
      );
      state.data[pageIndex].categories[
        categoryIndex
      ].nextPageToken = nextPageToken;
      state.data[pageIndex].categories[categoryIndex].files.append(files);
    },
  },
});

const store = configureStore({ reducer });

export { actions, store, fetchStructure };
