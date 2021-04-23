import {
  Button,
  ButtonGroup,
  Flex,
  Link,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from "@chakra-ui/react";
import { faDownload, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { fireGtmEvent, getPicker, copyFile } from "../data/google-apis";
import { File } from "../types/types";
import mimeTypes from "../utils/mime-types";
type ResponseObject = google.picker.ResponseObject;

type FileSpotlightProps = {
  file: File;
  untrapFocus: () => void;
  retrapFocus: () => void;
};
export default function FileSpotlight({
  file,
  untrapFocus,
  retrapFocus,
}: FileSpotlightProps) {
  const [isFolderPickerOpen, setIsFolderPickerOpen] = useState(false);
  const [pickerUrl, setPickerUrl] = useState("");
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

  function handleMakeCopy() {
    async function handleFolderPicked(folder: ResponseObject) {
      console.log(folder);
      const { Response, Action, Document } = google.picker;

      if (folder[Response.ACTION] === Action.PICKED) {
        const targetFolder = folder[Response.DOCUMENTS][0][Document.ID];
        await copyFile(file.id, targetFolder);
      }

      retrapFocus();
      // setIsFolderPickerOpen(false);
    }

    untrapFocus();
    const pickerUrl = getPicker(handleFolderPicked);
    // setPickerUrl(pickerUrl);
    // setIsFolderPickerOpen(true);
  }

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
        <Popover isOpen={isFolderPickerOpen}>
          <PopoverTrigger>
            <Button
              as={Link}
              leftIcon={<FontAwesomeIcon icon={faCopy} />}
              my={2}
              onClick={handleMakeCopy}
            >
              Make a Copy in Drive
            </Button>
          </PopoverTrigger>
          <PopoverContent w="45rem" h="25rem">
            <PopoverBody>
              <iframe
                src={pickerUrl}
                style={{ width: "43rem", height: "24rem" }}
              />
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </ButtonGroup>

      <iframe
        src={webViewLink.replace("view", "preview")}
        style={{ width: "100%", flex: 1, marginBottom: "1rem" }}
      />
    </Flex>
  );
}
