import { google } from "googleapis";
import partition from "lodash.partition";

const drive = google.drive("v3");
const LS_KEYS = {
  ROOT_FOLDER_ID: "root_folder_id",
  SITE_STRUCTURE: "site_structure",
};

const IsFolder =
  "(mimeType = application/vnd.google-apps.folder or mimeType = application/vnd.google-apps.shortcut)";
const FileProps = [
  "id",
  "name",
  "description",
  "iconLink",
  "thumbnailLink",
  "contentHints",
  "webViewLink",
  "exportLinks",
  "webContentLink",
  "fullFileExtension",
  "parents",
  "properties",
  "mimeType",
].join(", ");

export function clearCache() {
  localStorage.clear();
}

function getId(file) {
  return file.shortcutDetails?.targetId ?? file.id;
}

async function getRootFolderId() {
  const lsFolderId = localStorage.getItem(LS_KEYS.ROOT_FOLDER_ID);
  if (lsFolderId) return lsFolderId;

  const response = await drive.files.list({
    q: `${IsFolder} and name = 'Monarch Website'`,
    spaces: "drive",
    fields: "files(id, shortcutDetails)",
  });

  const [{ id }] = response.result.files;
  localStorage.setItem(LS_KEYS.ROOT_FOLDER_ID, id);
  return id;
}

export async function getSiteStructure() {
  const lsSiteStructure = localStorage.getItem(LS_KEYS.SITE_STRUCTURE);
  if (lsSiteStructure) return lsSiteStructure;

  const rootFolderId = await getRootFolderId();
  const pagesResponse = await drive.files.list({
    q: `${IsFolder} and ${rootFolderId} in parents`,
    spaces: "drive",
    fields: "files(id, name)",
  });

  const pageStructure = await Promise.all(
    pagesResponse.result.files.map(async (folder) => {
      const categoriesResponse = await drive.files.list({
        q: `${IsFolder} and ${getId(folder)} in parents`,
        spaces: "drive",
        fields: `files(id, name)`,
      });

      return {
        ...folder,
        categories: categoriesResponse.result.files,
      };
    })
  );

  localStorage.setItem(LS_KEYS.SITE_STRUCTURE, JSON.stringify(pageStructure));
  return pageStructure;
}

// Note - we don't need the page because folder IDs are globally unique in Drive
export async function getFiles(category, pageToken) {
  // TODO: How to best cache this?

  const response = await drive.files.list({
    pageToken,
    q: `mimeType = application/vnd.google-apps.folder and ${category} in parents`,
    spaces: "drive",
    fields: `nextPageToken, files(${FileProps})`,
  });

  return response.results;
}
