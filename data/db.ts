import Dexie from "dexie";
import {
  Category,
  File,
  Folder,
  SiteStructure,
  Subcategory,
} from "../types/types";
import random from "../utils/random";

const ONE_DAY_OF_MS = 1000 * 60 * 60 * 24;

class Database extends Dexie {
  images: Dexie.Table<{ id: string; image: Blob }, string>;
  pages: Dexie.Table<Folder, string>;
  categories: Dexie.Table<Category, string>;
  subcategories: Dexie.Table<Subcategory, string>;
  files: Dexie.Table<File, string>;

  constructor() {
    super("MonarchResources");
    this.version(1).stores({
      images: "id",
      pages: "id",
      categories: "id, pageId",
      subcategories: "id, categoryId",
      files: "id, *parents",
    });
    this.images = this.table("images");
    this.pages = this.table("pages");
    this.categories = this.table("categories");
    this.subcategories = this.table("subcategories");
    this.files = this.table("files");
  }

  async setImage(fileId: string, image: Blob) {
    await this.images.add({ id: fileId, image });
  }

  async getImage(fileId: string): Promise<Blob | null> {
    const match = await this.images.where("id").equals(fileId).first();
    return match?.image;
  }

  async getStructure(): Promise<SiteStructure | null> {
    const cacheInvalidationTime = Number(
      localStorage.getItem("structureInvalidationTime")
    );
    if (Date.now() > cacheInvalidationTime) {
      await this.pages.clear();
      await this.categories.clear();
      await this.subcategories.clear();
      return null;
    }

    return {
      pages: await this.pages.toArray(),
      categories: await this.categories.toArray(),
      subcategories: await this.subcategories.toArray(),
    };
  }

  async setStructure(structure: SiteStructure): Promise<void> {
    await this.pages.bulkAdd(structure.pages);
    await this.categories.bulkAdd(
      structure.categories.map((c) => ({ ...c, files: [] }))
    );
    await this.subcategories.bulkAdd(
      structure.subcategories.map((s) => ({ ...s, files: [] }))
    );

    const cacheInvalidationTime = Date.now() + random(6, 11) * ONE_DAY_OF_MS;
    localStorage.setItem(
      "structureInvalidationTime",
      cacheInvalidationTime.toString()
    );
  }

  async getFiles(parentId: string): Promise<File[] | null> {
    const cacheInvalidationTime = Number(
      localStorage.getItem("fileInvalidationTime")
    );
    if (Date.now() > cacheInvalidationTime) {
      await this.files.clear();
      localStorage.removeItem("fileInvalidationTime");
      return null;
    }

    return this.files.where("parents").equals(parentId).toArray();
  }

  async addFiles(files: File[]): Promise<void> {
    await this.files.bulkAdd(files);

    if (!localStorage.getItem("fileInvalidationTime")) {
      localStorage.setItem(
        "fileInvalidationTime",
        (Date.now() + ONE_DAY_OF_MS).toString()
      );
    }
  }
}

const db = new Database();
export default db;
