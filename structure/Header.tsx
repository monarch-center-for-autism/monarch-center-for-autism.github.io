import React from "react";
import { Box, Heading } from "@chakra-ui/react";

export default function Header() {
  return (
    <Box w="full" p={4} bg="cyan.600" color="gray.50" textAlign="center">
      <Heading>Monarch Resources</Heading>
    </Box>
  );
}
