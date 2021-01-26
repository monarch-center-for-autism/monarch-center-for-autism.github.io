import Dexie from "dexie";

class Database extends Dexie {
  images: Dexie.Table<{ id: string; image: Blob }, string>;

  constructor() {
    super("MonarchResources");
    this.version(2).stores({
      images: "id, image",
    });
    this.images = this.table("images");
  }

  async setImage(fileId: string, image: Blob) {
    await this.images.add({ id: fileId, image });
  }

  async getImage(fileId: string): Promise<Blob | null> {
    const match = await this.images.where("id").equals(fileId).first();
    return match?.image;
  }
}

const db = new Database();
export default db;
