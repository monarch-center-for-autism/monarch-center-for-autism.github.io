export default function getHumanReadableMimeType(mimeType) {
  switch (mimeType) {
    case "pdf":
    case "application/pdf":
      return "PDF";
    case "doc":
    case "docx":
      return "Word Document";
    case "xls":
    case "xlsm":
    case "xlsx":
      return "Excel Spreadsheet";
    case "application/vnd.oasis.opendocument.presentation":
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return "Open Office Presentation";
    case "text/plain":
      return "Text File";
    default:
      return mimeType;
  }
}
