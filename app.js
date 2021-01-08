import DataBrowser from "./pages/DataBrowser";
import Footer from "./components/Footer";
import Header from "./components/Header";
import React from "react";
import { Flex } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export default function App() {
  const { page } = useParams();

  return (
    <Flex direction="column">
      <Header />
      <DataBrowser page={page} />
      <Footer />
    </Flex>
  );
}
