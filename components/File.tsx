import { Box, Image, Text } from "@chakra-ui/react";
import React from "react";

export default function File({ file, onClick }) {
  if (!file) return <div />;
  if (file.id === "placeholder") return <Box h={60} w={60} />;

  const { name, iconLink, thumbnailLink, description } = file;
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
