import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useSelector as useUntypedSelector,
} from "react-redux";
import { Category, File, Folder, QueueFolder } from "./types";
import { aFlatMap } from "./utils/aMap";
import findCategory from "./utils/findCategory";
import * as google from "./utils/google-apis";

type State = {
  user: string;
  pages: Folder[];
  categories: Category[];
  activeFile?: File;
};

const fetchStructure = createAsyncThunk<
  [Folder[], Category[]],
  void,
  { state: State }
>("fetchData", async (_, __) => {
  const pages = await google.getRootFolders();
  const categories = await aFlatMap(pages, google.getFolders);

  return [pages, categories];
});

type FetchCategory = {
  files: File[];
  folders: QueueFolder[];
  listedFolderCount: number;
};
const fetchCategory = createAsyncThunk<FetchCategory, string, { state: State }>(
  "refreshData",
  async (category: string, thunkApi) => {
    const { id, folders: queue } =
      thunkApi.getState().categories.find((c) => c.id === category) ?? {};
    if (queue.length === 0) {
      queue.push({ id });
    }

    let listedFolderCount = 0;
    const folders: QueueFolder[] = [];
    const files: File[] = [];
    for (
      ;
      listedFolderCount < queue.length && files.length < 10;
      listedFolderCount++
    ) {
      const folder = folders[listedFolderCount];
      const [contents, queue] = await google.getFiles(folder);
    }

    return { files, folders, listedFolderCount };
  }
);

const { actions, reducer } = createSlice({
  name: "data",
  initialState: {
    user: "",
    pages: <Folder[]>[],
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

const useSelector: TypedUseSelectorHook<State> = useUntypedSelector;

export { actions, store, fetchStructure, fetchCategory, useSelector };
