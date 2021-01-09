import { Button, ButtonGroup, Link, Text, Flex } from "@chakra-ui/react";
import React from "react";
import mimeTypes from "../utils/mimeTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

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

      <ButtonGroup mb={4}>
        {downloadOptions.map(([mimeType, url]) => (
          <Button
            href={url}
            key={mimeType}
            as={Link}
            leftIcon={<FontAwesomeIcon icon={faDownload} />}
          >
            Download as {mimeTypes(mimeType)}
          </Button>
        ))}
      </ButtonGroup>

      <iframe
        src={webViewLink.replace("view", "preview")}
        style={{ width: "100%", flex: 1, marginBottom: "1rem" }}
      />
    </Flex>
  );
}
