import React from "react";
import { Flex, Spacer } from "@chakra-ui/react";
import LogInButton from "./LogInButton";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <Flex bg="cyan.400" color="gray.50" padding={4}>
      <h1>Drive Resource Viewer</h1>
      <Spacer />
      <LogInButton />
      <SearchBar />
    </Flex>
  );
}
