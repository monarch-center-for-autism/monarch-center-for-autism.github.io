import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useSelector as useUntypedSelector,
} from "react-redux";
import {
  Category,
  File,
  Folder,
  SiteStructure,
  Subcategory,
} from "../types/types";
import CategoryState from "../types/category-states";
import { aFlatMap, aMap } from "../utils/aMap";
import { fireGtmEvent } from "./google-apis";
import * as google from "./google-apis";
import db from "./db";

type State = {
  user?: { name: string; imageUrl: string; email: string };
  pages: Folder[];
  categories: Category[];
  subcategories: Subcategory[];
  modals: {
    activeFile?: File;
    downloadAllFilesModalVisible: boolean;
    clearCacheModalVisible: boolean;
  };
};

const fetchStructure = createAsyncThunk<SiteStructure, void, {}>(
  "fetchStructure",
  async () => {
    const cachedStructure = await db.getStructure();
    if (cachedStructure) {
      const { categories, pages, subcategories } = cachedStructure;
      return {
        pages,
        categories: await aMap(categories, async (category) => ({
          ...category,
          files: (await db.getFiles(category.id)) ?? [],
        })),
        subcategories: await aMap(subcategories, async (subcategory) => ({
          ...subcategory,
          files: (await db.getFiles(subcategory.id)) ?? [],
        })),
      };
    }

    const pages = await google.getRootFolders();
    const categories: Category[] = await aFlatMap(
      pages,
      async (page) =>
        await aMap(await google.getFolders(page), async (category) => ({
          ...category,
          state: CategoryState.INIT,
          pageId: page.id,
          files: [],
        }))
    );
    const subcategories: Subcategory[] = await aFlatMap(
      categories,
      async (category) =>
        await aMap(await google.getFolders(category), (subcategory) => ({
          ...subcategory,
          state: CategoryState.INIT,
          categoryId: category.id,
          files: [],
        }))
    );

    const structure = { pages, categories, subcategories };
    await db.setStructure(structure);

    return structure;
  }
);

type FCParam = {
  category: Category | Subcategory;
  isSubcategory: boolean;
};
const fetchCategory = createAsyncThunk<File[], FCParam>(
  "fetchCategory",
  async ({ category }) => {
    const cachedFiles = await db.getFiles(category.id);
    if (cachedFiles && cachedFiles.length > 0) {
      return cachedFiles;
    }

    const files: File[] = [];
    let nextPageToken: string = null;
    do {
      const contents = await google.getFiles(category, nextPageToken);
      files.push(...contents.files);
      nextPageToken = contents.nextPageToken;
    } while (nextPageToken);

    await db.addFiles(files);
    return files;
  }
);

const { actions, reducer } = createSlice({
  name: "data",
  initialState: {
    user: null,
    pages: [],
    categories: [],
    subcategories: [],
    modals: {
      activeFile: null,
      clearCacheModalVisible: false,
      downloadAllFilesModalVisible: false,
    },
  } as State,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    setActiveFile: (state, { payload }) => {
      if (payload) {
        fireGtmEvent("Preview File", {
          file_id: payload.id,
          file_name: payload.name,
        });
      }

      state.modals.activeFile = payload;
    },
    showClearCacheModal: (state) => {
      state.modals.clearCacheModalVisible = true;
    },
    hideClearCacheModal: (state) => {
      state.modals.clearCacheModalVisible = false;
    },
    showDownloadAllFilesModal: (state) => {
      state.modals.downloadAllFilesModalVisible = true;
    },
    hideDownloadAllFilesModal: (state) => {
      state.modals.downloadAllFilesModalVisible = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStructure.fulfilled, (state, { payload }) => {
      const { categories, pages, subcategories } = payload;
      state.pages = pages;
      state.categories = categories;
      state.subcategories = subcategories;
    });
    builder.addCase(fetchCategory.pending, (state, { meta: { arg } }) => {
      const { category, isSubcategory } = arg;

      if (isSubcategory) {
        const i = state.subcategories.findIndex((c) => c.id === category.id);
        state.subcategories[i].state = CategoryState.LOADING;
      } else {
        const i = state.categories.findIndex((c) => c.id === category.id);
        state.categories[i].state = CategoryState.LOADING;
      }
    });
    builder.addCase(
      fetchCategory.fulfilled,
      (state, { payload: files, meta: { arg } }) => {
        const { category, isSubcategory } = arg;

        if (isSubcategory) {
          const i = state.subcategories.findIndex((c) => c.id === category.id);
          state.subcategories[i].files.push(...files);
          state.subcategories[i].state = CategoryState.FETCHED;
        } else {
          const i = state.categories.findIndex((c) => c.id === category.id);
          state.categories[i].files.push(...files);
          state.categories[i].state = CategoryState.FETCHED;
        }
      }
    );

    builder.addCase(fetchCategory.rejected, (state, { meta: { arg } }) => {
      const { category, isSubcategory } = arg;

      if (isSubcategory) {
        const i = state.subcategories.findIndex((c) => c.id === category.id);
        state.subcategories[i].state = CategoryState.INIT;
      } else {
        const i = state.categories.findIndex((c) => c.id === category.id);
        state.categories[i].state = CategoryState.INIT;
      }
    });
  },
});

const store = configureStore({ reducer });

const useSelector: TypedUseSelectorHook<State> = useUntypedSelector;

export { actions, store, fetchStructure, fetchCategory, useSelector };
