import React from "react";

export default function FileSpotlight({ file }) {
  if (!file) return null;

  const {
    name,
    description,
    webViewLink,
    fullFileExtension,
    webContentLink,
    exportLinks = [],
  } = file;

  const downloadOptions = [
    ...Object.entries(exportLinks),
    ...(webContentLink ? [[fullFileExtension, webContentLink]] : []),
  ];

  return (
    <div className="flex flex-col h-full">
      <span className="w-full text-center mb-8 text-4xl block">
        {name.replace("." + fullFileExtension, "")}
      </span>

      {description && <p className="my-4">{description}</p>}

      <ul className="my-4 text-gray-700">
        {downloadOptions.map(([extension, url]) => (
          <li key={extension}>
            <a href={url}>Download as {extension}</a>
          </li>
        ))}
      </ul>

      <iframe src={webViewLink.replace("view", "preview")} className="flex-1" />
    </div>
  );
}
