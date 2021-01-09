import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import findCategory from "./utils/findCategory";
import * as google from "./utils/google-apis";

const fetchStructure = createAsyncThunk("fetchData", async () => {
  return await google.getSiteStructure();
});

const fetchCategory = createAsyncThunk(
  "refreshData",
  async (category, thunkAPI) => {
    thunkAPI.dispatch(actions.initCategory(category));
    const pageToken = thunkAPI
      .getState()
      .data.flatMap((d) => d.categories)
      .find((c) => c.id === category)?.nextPageToken;
    const { nextPageToken, files } = await google.getFiles(category, pageToken);

    return { category, nextPageToken, files };
  }
);

const { actions, reducer } = createSlice({
  name: "data",
  initialState: {
    user: "",
    data: [],
    activeFile: null,
  },
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    initCategory: (state, { payload }) => {
      const [pageIndex, categoryIndex] = findCategory(state.data, payload);
      state.data[pageIndex].categories[categoryIndex].files = [];
    },
    setActiveFile: (state, { payload }) => {
      state.activeFile = payload;
    },
  },
  extraReducers: {
    [fetchStructure.fulfilled]: (state, { payload }) => {
      state.data = payload;
      state.loading = false;
    },
    [fetchCategory.fulfilled]: (state, { payload }) => {
      const { category, files, nextPageToken } = payload;
      const [pageIndex, categoryIndex] = findCategory(state.data, category);

      state.data[pageIndex].categories[
        categoryIndex
      ].nextPageToken = nextPageToken;

      state.data[pageIndex].categories[categoryIndex].files.push(...files);
    },
  },
});

const store = configureStore({ reducer });

export { actions, store, fetchStructure, fetchCategory };
