import { Button, ButtonGroup, Flex, Link, Text } from "@chakra-ui/react";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { fireGtmEvent } from "../data/google-apis";
import mimeTypes from "../utils/mime-types";

export default function FileSpotlight({ file }) {
  if (!file) return null;

  const {
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
    <Flex direction="column" h="full">
      {description && <Text mb={8}>{description}</Text>}

      <ButtonGroup mb={4} flexWrap="wrap">
        {downloadOptions.map(([mimeType, url]) => {
          function handleDownloadFile() {
            fireGtmEvent("Download File", {
              file_id: file.id,
              file_name: file.name,
              mime_type: mimeType,
            });
          }

          return (
            <Button
              href={url}
              key={mimeType}
              as={Link}
              leftIcon={<FontAwesomeIcon icon={faDownload} />}
              my={2}
              onClick={handleDownloadFile}
            >
              Download as {mimeTypes(mimeType)}
            </Button>
          );
        })}
      </ButtonGroup>

      <iframe
        src={webViewLink.replace("view", "preview")}
        style={{ width: "100%", flex: 1, marginBottom: "1rem" }}
      />
    </Flex>
  );
}
