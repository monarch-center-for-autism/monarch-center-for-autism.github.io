import { Folder, FileList, File } from "../types/types";
import throttle from "../utils/throttle";
import db from "./db";

type ResponseObject = google.picker.ResponseObject;

const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];
const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/userinfo.profile",
].join(" ");

function isFolder(b) {
  const op = b ? "=" : "!=";
  const combiner = b ? "or" : "and";

  return (
    `(mimeType ${op} 'application/vnd.google-apps.folder' ${combiner}` +
    ` mimeType ${op} 'application/vnd.google-apps.shortcut')`
  );
}

const FileProps = [
  "id",
  "name",
  "description",
  "iconLink",
  "thumbnailLink",
  "webViewLink",
  "exportLinks",
  "webContentLink",
  "fullFileExtension",
  "parents",
].join(", ");

const FolderProps = ["id", "name", "shortcutDetails"].join(", ");

export function setGtmVariable(name: string, value: string) {
  window.dataLayer.push({ [name]: value });
}

export function fireGtmEvent(name: string, extras: object) {
  window.dataLayer.push({ event: name, ...extras });
}

export async function initGoogleClient() {
  await new Promise((resolve) =>
    window.gapi.load("client:auth2:picker", resolve)
  );
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
    email: gUser.getEmail(),
    imageUrl: gUser.getImageUrl(),
  };
}

export function getAccessToken(): string {
  return window.gapi.client.getToken().access_token;
}

export async function signIn() {
  await window.gapi.auth2
    .getAuthInstance()
    .signIn({ prompt: "select_account", ux_mode: "redirect" });
}

export function setOnAuthStatusChange(handler) {
  window.gapi.auth2.getAuthInstance().isSignedIn.listen(handler);
}

function getId(file) {
  return file.shortcutDetails?.targetId ?? file.id;
}

export async function getRootFolders(): Promise<Folder[]> {
  return await throttle(async () => {
    const pagesResponse = await window.gapi.client.drive.files.list({
      pageSize: 1000,
      q: [isFolder(true), `'${process.env.FOLDER_ID}' in parents`].join(
        " and "
      ),
      fields: `files(${FolderProps})`,
      spaces: "drive",
      orderBy: "name",
    });

    return pagesResponse.result.files;
  });
}

export async function getFolders(page: Folder): Promise<Folder[]> {
  return await throttle(async () => {
    const response = await window.gapi.client.drive.files.list({
      pageSize: 1000,
      q: [isFolder(true), `'${getId(page)}' in parents`].join(" and "),
      fields: `files(${FolderProps})`,
      spaces: "drive",
      orderBy: "name",
    });

    return response.result.files;
  });
}

export async function getFiles(
  folder: Folder,
  pageToken: string
): Promise<FileList> {
  const inFolder = `'${getId(folder)}' in parents`;
  const files = await throttle(async () =>
    gapi.client.drive.files.list({
      pageToken,
      pageSize: 1000,
      q: [isFolder(false), inFolder, "trashed = false"].join(" and "),
      spaces: "drive",
      fields: `nextPageToken, files(${FileProps})`,
      orderBy: "name",
    })
  );

  return files.result;
}

export async function getThumbnail(file: File): Promise<string> {
  const match = await db.getImage(file.id);
  if (match) {
    return URL.createObjectURL(match);
  }

  const response = await throttle(async () => fetch(file.thumbnailLink));
  const blob = await response.blob();

  await db.setImage(file.id, blob);
  return URL.createObjectURL(blob);
}

export function getPicker(callback: (x: ResponseObject) => void): any {
  const view = new google.picker.DocsView(google.picker.ViewId.FOLDERS);
  view.setSelectFolderEnabled(true);
  view.setMimeTypes("application/vnd.google-apps.folder");

  return (
    new google.picker.PickerBuilder()
      .addView(view)
      .setTitle("")
      .enableFeature(google.picker.Feature.NAV_HIDDEN)
      .setOAuthToken(getAccessToken())
      .setDeveloperKey(process.env.API_KEY)
      .setCallback(callback)
      // .toUri();
      .build()
      .setVisible(true)
  );
}

export async function copyFile(fileId: string, targetFolder: string) {
  const result = await throttle(async () => {
    gapi.client.drive.files.copy({ fileId }, { parents: [targetFolder] });
  });
  console.log(result);
}
