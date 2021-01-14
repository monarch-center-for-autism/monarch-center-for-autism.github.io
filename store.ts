import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useSelector as useUntypedSelector,
} from "react-redux";
import { Category, File, Folder, QueueFolder } from "./types/types";
import { aFlatMap } from "./utils/aMap";
import * as google from "./utils/google-apis";

type State = {
  user?: gapi.auth2.GoogleUser;
  pages: Folder[];
  categories: Category[];
  activeFile?: File;
};

type FetchStructure = { pages: Folder[]; categories: Category[] };
const fetchStructure = createAsyncThunk<FetchStructure, void, {}>(
  "fetchData",
  async () => {
    const pages = await google.getRootFolders();
    const categories = await aFlatMap(pages, async (page) => {
      return (await google.getFolders(page)).map((category) => ({
        ...category,
        loading: false,
        folders: [],
        pageId: page.id,
        files: [],
      }));
    });

    return { pages, categories };
  }
);

type FetchCategory = {
  files: File[];
  folders: QueueFolder[];
  listedFolderCount: number;
};
const fetchCategory = createAsyncThunk<FetchCategory, string, { state: State }>(
  "refreshData",
  async (category: string, thunkApi) => {
    const { id, folders: previousQueue } =
      thunkApi.getState().categories.find((c) => c.id === category) ?? {};

    let listedFolderCount = 0;
    const newQueue: QueueFolder[] = [];
    const files: File[] = [];

    if (previousQueue.length === 0) {
      newQueue.push({ id });
    }

    let folder;
    if (previousQueue.length > listedFolderCount) {
      folder = previousQueue[listedFolderCount++];
    } else {
      folder = newQueue.splice(0, 1)[0];
    }

    while (folder != null && files.length < 10) {
      const [contents, folders] = await google.getFiles(folder);

      files.push(...contents.files);
      newQueue.splice(0, 0, ...folders);
      if (contents.nextPageToken) {
        newQueue.splice(0, 0, {
          ...folder,
          nextPageToken: contents.nextPageToken,
        });
      }

      if (previousQueue.length > listedFolderCount) {
        folder = previousQueue[listedFolderCount++];
      } else {
        folder = newQueue.splice(0, 1)[0];
      }
    }

    return { files, folders: newQueue, listedFolderCount };
  }
);

const { actions, reducer } = createSlice({
  name: "data",
  initialState: {
    user: null,
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
      const { categories, pages } = payload;
      state.pages = pages;
      state.categories = categories;
    });
    builder.addCase(
      fetchCategory.pending,
      (state, { meta: { arg: category } }) => {
        const i = state.categories.findIndex((c) => c.id === category);
        state.categories[i].loading = true;
      }
    );
    builder.addCase(
      fetchCategory.fulfilled,
      (state, { payload, meta: { arg: category } }) => {
        const { files, folders, listedFolderCount } = payload;
        const i = state.categories.findIndex((c) => c.id === category);

        state.categories[i].files.push(...files);
        state.categories[i].folders.splice(0, listedFolderCount, ...folders);
        state.categories[i].loading = false;
      }
    );

    builder.addCase(
      fetchCategory.rejected,
      (state, { meta: { arg: category } }) => {
        const i = state.categories.findIndex((c) => c.id === category);
        state.categories[i].loading = false;
      }
    );
  },
});

const store = configureStore({ reducer });

const useSelector: TypedUseSelectorHook<State> = useUntypedSelector;

export { actions, store, fetchStructure, fetchCategory, useSelector };
