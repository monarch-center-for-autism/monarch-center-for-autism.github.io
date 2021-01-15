import { Box, Image, Text } from "@chakra-ui/react";
import React from "react";
import { File } from "../types/types";
import useExponentialBackoff from "../utils/useExponentialBackoff";

type Props = {
  file: File;
  key?: any;
  onClick: () => any;
};
export default function File({ file, onClick, key }: Props) {
  const { name, iconLink, thumbnailLink, description } = file ?? {};
  const [thumbnailSource, onThumbnailError] = useExponentialBackoff(
    thumbnailLink ?? ""
  );

  if (!file) return <div key={key} />;
  if (file.id === "placeholder") return <Box h={60} w={60} key={key} />;

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
      key={key}
    >
      <Image
        src={thumbnailSource}
        onError={onThumbnailError}
        alt=""
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
          {name}
        </Text>

        <Text>{description}</Text>
      </Box>
    </Box>
  );
}
