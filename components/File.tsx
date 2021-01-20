import { Box, Image, Text } from "@chakra-ui/react";
import React from "react";
import { File } from "../types/types";
import { getAccessToken } from "../utils/google-apis";
import useExponentialBackoff from "../utils/useExponentialBackoff";
import useRealSize from "../utils/useRealSize";

type Props = {
  file: File;
  key?: any;
  onClick: () => any;
};
export default function File({ file, onClick }: Props) {
  const { name, iconLink, thumbnailLink = "", description } = file ?? {};

  const [width, height, ref] = useRealSize();
  const sizedLink =
    thumbnailLink +
    (thumbnailLink.includes("?") ? "&" : "?") +
    `access_token=${getAccessToken()}`; // `?sz=w${width}-h${height}`;
  const [thumbnailSource, onError] = useExponentialBackoff(sizedLink);

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
      h={60}
      position="relative"
      overflow="hidden"
    >
      <Image
        src={thumbnailSource}
        onError={onError}
        alt=""
        position="absolute"
        w="full"
        h="auto"
        ref={ref}
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
          {name}
        </Text>

        <Text>{description}</Text>
      </Box>
    </Box>
  );
}
