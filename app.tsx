import React from "react";
import { Flex } from "@chakra-ui/react";
import FileModal from "./components/FileModal";
import Router from "./router";
import Header from "./structure/Header";
import Sidebar from "./structure/SideBar";

export default function App() {
  return (
    <>
      <Flex direction="column" h="100vh">
        <Header />
        <Flex flex={1}>
          <Sidebar />
          <Router />
        </Flex>
      </Flex>

      <FileModal />
    </>
  );
}
