const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];
const SCOPES = [
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/userinfo.profile",
].join(" ");

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
  const gUser = window.gapi.auth2
    .getAuthInstance()
    .currentUser.get()
    .getBasicProfile();
  return {
    name: gUser.getName(),
    imageUrl: gUser.getImageUrl(),
  };
}

export async function signIn() {
  await window.gapi.auth2.getAuthInstance().signIn();
}

export function setOnAuthStatusChange(handler) {
  window.gapi.auth2.getAuthInstance().isSignedIn.listen(handler);
}

function getId(file) {
  return file.shortcutDetails?.targetId ?? file.id;
}

async function getRootFolderId() {
  const response = await window.gapi.client.drive.files.list({
    q: `${IsFolder} and id = '${process.env.FOLDER_ID}'`,
    spaces: "drive",
    fields: "files(id, shortcutDetails)",
  });

  const [{ id }] = response.result.files;
  return id;
}

export async function getSiteStructure() {
  const rootFolderId = await getRootFolderId();
  const pagesResponse = await window.gapi.client.drive.files.list({
    q: `${IsFolder} and '${rootFolderId}' in parents`,
    fields: "files(id, name, shortcutDetails)",
  });

  const pageStructure = await Promise.all(
    pagesResponse.result.files.map(async (folder) => {
      const categoriesResponse = await window.gapi.client.drive.files.list({
        q: `${IsFolder} and '${getId(folder)}' in parents`,
        fields: `files(id, name, shortcutDetails)`,
      });

      return {
        ...folder,
        categories: categoriesResponse.result.files,
      };
    })
  );

  return pageStructure;
}

// Note - we don't need the page because folder IDs are globally unique in Drive
export async function getFiles(category, pageToken) {
  const response = await gapi.client.drive.files.list({
    pageToken,
    q: `mimeType != 'application/vnd.google-apps.folder' and '${category}' in parents`,
    spaces: "drive",
    fields: `nextPageToken, files(${FileProps})`,
  });

  return response.result;
}
