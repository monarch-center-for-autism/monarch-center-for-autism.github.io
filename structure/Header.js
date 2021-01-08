import React from "react";
import { Box } from "@chakra-ui/react";

export default function Header() {
  return (
    <Box w="full" p={4} bg="cyan.400" color="gray.50" textAlign="center">
      <h1>Drive Resource Viewer</h1>
    </Box>
  );
}
