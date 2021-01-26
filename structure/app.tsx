import React from "react";
import { Flex } from "@chakra-ui/react";
import ClearCacheModal from "../components/ClearCacheModal";
import DownloadAllFilesModal from "../components/DownloadAllFilesModal";
import FileModal from "../components/FileModal";
import Router from "../pages/router";
import Header from "./Header";
import Sidebar from "./SideBar";

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
      <ClearCacheModal />
      <DownloadAllFilesModal />
    </>
  );
}
