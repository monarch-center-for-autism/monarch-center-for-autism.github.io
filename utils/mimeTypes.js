const mimeTypes = {
  pdf: "PDF",
  docx: "Word Document",
  doc: "Word Document",
  xlsm: "Excel Spreadsheet",
  xlsx: "Excel Spreadsheet",
  xls: "Excel Spreadsheet",
};

export default function getHumanReadableMimeType(mimeType) {
  return mimeTypes[mimeType] ?? mimeType;
}
