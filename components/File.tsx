import { Box, Image, Text } from "@chakra-ui/react";
import Fuse from "fuse.js";
import React, { useEffect, useState } from "react";
import { getThumbnail } from "../data/google-apis";
import { File as FileType } from "../types/types";
import reduceFuseMatches from "../utils/reduce-fuse-matches";

type FuseResultMatch = Fuse.FuseResultMatch;

type Props = {
  file: FileType;
  matches?: Readonly<FuseResultMatch[]>;
  onClick: () => any;
};
export default function File({ file, matches = [], onClick }: Props) {
  const { name, iconLink, description } = file ?? {};
  const [thumbnailLink, setThumbnailLink] = useState("");

  useEffect(() => {
    getThumbnail(file).then(setThumbnailLink);
  }, []);

  const nameMatch = matches.find((m) => m.key === "name");
  const displayName = nameMatch
    ? reduceFuseMatches(nameMatch)
    : [{ text: name }];
  const descriptionMatch = matches.find((m) => m.key === "description");
  const displayDescription = descriptionMatch
    ? reduceFuseMatches(descriptionMatch)
    : [{ text: description }];

  return (
    <Box
      shadow="md"
      _hover={{
        shadow: "xl",
      }}
      transition="ease-in-out 0.2s"
      cursor="pointer"
      borderWidth="1px"
      borderRadius="lg"
      onClick={onClick}
      h={48}
      position="relative"
      overflow="hidden"
    >
      <Image
        src={thumbnailLink}
        alt=""
        crossOrigin="use-credentials"
        fallback={
          <Image
            src={iconLink}
            alt=""
            w="32px"
            h="32px"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
          />
        }
        position="absolute"
        w="full"
        h="auto"
      />

      <Box
        p={4}
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        zIndex={2}
        background="white"
      >
        <Text fontWeight="bold" isTruncated>
          <Image
            src={iconLink}
            mr={4}
            h={4}
            w={4}
            display="inline-block"
            alt=""
          />
          {displayName.map(({ text, as }, i) => (
            <Text as={as} display="inline" key={i}>
              {text}
            </Text>
          ))}
        </Text>

        <Text>
          {displayDescription.map(({ text, as }, i) => (
            <Text as={as} display="inline" key={i}>
              {text}
            </Text>
          ))}
        </Text>
      </Box>
    </Box>
  );
}
