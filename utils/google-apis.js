const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];
const SCOPES = [
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/userinfo.profile",
].join(" ");

const LS_KEYS = {
  ROOT_FOLDER_ID: "root_folder_id",
  SITE_STRUCTURE: "site_structure",
  USER: "user",
};

const IsFolder =
  "(mimeType = 'application/vnd.google-apps.folder' or mimeType = 'application/vnd.google-apps.shortcut')";
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

export async function initGoogleClient() {
  await new Promise((resolve) => window.gapi.load("client:auth2", resolve));
  await window.gapi.client.init({
    apiKey: process.env.API_KEY,
    clientId: process.env.CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES,
  });
}

export function isSignedIn() {
  return window.gapi.auth2.getAuthInstance().isSignedIn.get();
}

export function getUser() {
  const lsUser = localStorage.getItem(LS_KEYS.USER);
  if (lsUser) return JSON.parse(lsUser);

  const gUser = window.gapi.auth2
    .getAuthInstance()
    .currentUser.get()
    .getBasicProfile();
  const user = {
    name: gUser.getName(),
    imageUrl: gUser.getImageUrl(),
  };

  localStorage.setItem(LS_KEYS.USER, JSON.stringify(user));
  return user;
}

export async function signIn() {
  await window.gapi.auth2.getAuthInstance().signIn();
}

export function setOnAuthStatusChange(handler) {
  window.gapi.auth2.getAuthInstance().isSignedIn.listen(handler);
}

export function clearCache() {
  localStorage.clear();
}

function getId(file) {
  return file.shortcutDetails?.targetId ?? file.id;
}

async function getRootFolderId() {
  const lsFolderId = localStorage.getItem(LS_KEYS.ROOT_FOLDER_ID);
  if (lsFolderId) return lsFolderId;

  const response = await window.gapi.client.drive.files.list({
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
  if (lsSiteStructure) return JSON.parse(lsSiteStructure);

  const rootFolderId = await getRootFolderId();
  const pagesResponse = await window.gapi.client.drive.files.list({
    q: `${IsFolder} and '${rootFolderId}' in parents`,
    spaces: "drive",
    fields: "files(id, name)",
  });

  const pageStructure = await Promise.all(
    pagesResponse.result.files.map(async (folder) => {
      const categoriesResponse = await window.gapi.client.drive.files.list({
        q: `${IsFolder} and '${getId(folder)}' in parents`,
        spaces: "drive",
        fields: `files(id, name)`,
      });

      return {
        ...folder,
        categories: categoriesResponse.result.files.map((category) => ({
          ...category,
          files: [],
        })),
      };
    })
  );

  localStorage.setItem(LS_KEYS.SITE_STRUCTURE, JSON.stringify(pageStructure));
  return pageStructure;
}

// Note - we don't need the page because folder IDs are globally unique in Drive
export async function getFiles(category, pageToken) {
  // TODO: How to best cache this?

  const response = await gapi.client.drive.files.list({
    pageToken,
    q: `mimeType = application/vnd.google-apps.folder and ${category} in parents`,
    spaces: "drive",
    fields: `nextPageToken, files(${FileProps})`,
  });

  return response.results;
}
