import React from "react";
import FileViewer from "react-file-viewer";

export default function FileSpotlight({ file }) {
  if (!file) return null;

  const { webContentLink, name, description } = file;

  const [, fileName, fileType] = /([^.]+)\.(.+)/.exec(name);

  return (
    <div>
      <span className="w-full text-center mb-8 text-4xl block">{fileName}</span>

      {description && <p className="my-4">{description}</p>}

      <div className="flex items-center justify-center">
        <FileViewer fileType={fileType} filePath={webContentLink} />
      </div>
    </div>
  );
}
