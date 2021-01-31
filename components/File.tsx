import { Box, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getThumbnail } from "../data/google-apis";
import { File } from "../types/types";

type Props = {
  file: File;
  key?: any;
  onClick: () => any;
};
export default function File({ file, onClick }: Props) {
  const { name, iconLink, description } = file ?? {};
  const [thumbnailLink, setThumbnailLink] = useState("");

  useEffect(() => {
    getThumbnail(file)
      .then(setThumbnailLink)
      .catch(() => {
        setThumbnailLink(file.thumbnailLink);
      });
  }, []);

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
      <Image src={thumbnailLink} alt="" position="absolute" w="full" h="auto" />

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
