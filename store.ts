import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import {
  useSelector as useUntypedSelector,
  TypedUseSelectorHook,
} from "react-redux";
import findCategory from "./utils/findCategory";
import * as google from "./utils/google-apis";

type Page = {
  id: string;
  name: string;
};

type Category = {
  pageId: string;
  id: string;
  name: string;
  loading: boolean;
  folders: {
    id: string;
    nextPageToken: string;
  }[];
  files: {
    id: string;
    name: string;
  }[];
};

const fetchStructure = createAsyncThunk("fetchData", async () => {
  return await google.getSiteStructure();
});

const fetchCategory = createAsyncThunk(
  "refreshData",
  async (category: string, thunkAPI) => {
    const pageToken = null; //thunkAPI
    // .getState()
    // .data.flatMap((d) => d.categories)
    // .find((c) => c.id === category)?.nextPageToken;
    const [files, folders] = await google.getFiles(category, pageToken);

    return { files, folders };
  }
);

const { actions, reducer } = createSlice({
  name: "data",
  initialState: {
    user: "",
    pages: <Page[]>[],
    categories: <Category[]>[],
    activeFile: null,
  },
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    setActiveFile: (state, { payload }) => {
      state.activeFile = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStructure.fulfilled, (state, { payload }) => {
      state.pages = payload;
    });
    builder.addCase(
      fetchCategory.pending,
      (state, { meta: { arg: category } }) => {
        const [pageIndex, categoryIndex] = findCategory(state.data, category);
        state.data[pageIndex].categories[categoryIndex].files = [];
      }
    );
    builder.addCase(
      fetchCategory.fulfilled,
      (state, { payload, meta: { arg: category } }) => {
        const { category, files, nextPageToken } = payload;
        const [pageIndex, categoryIndex] = findCategory(state.data, category);

        state.data[pageIndex].categories[
          categoryIndex
        ].nextPageToken = nextPageToken;

        state.data[pageIndex].categories[categoryIndex].files.push(...files);
      }
    );

    builder.addCase(
      fetchCategory.rejected,
      (state, { meta: { arg: category } }) => {
        const [pageIndex, categoryIndex] = findCategory(state.data, category);
        state.data[pageIndex].categories[categoryIndex].files = [];
      }
    );
  },
});

const store = configureStore({ reducer });
const useSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useUntypedSelector;

export { actions, store, fetchStructure, fetchCategory, useSelector };
