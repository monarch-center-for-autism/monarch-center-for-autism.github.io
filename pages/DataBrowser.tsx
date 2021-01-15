import {
  Box,
  CircularProgress,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import React from "react";
import { useParams } from "react-router-dom";
import CategoryBrowser from "../components/CategoryBrowser";
import PageNotFound from "./PageNotFound";
import { useSelector } from "../store";
import { Category, Folder } from "../types/types";

function matches({ id, name }: Folder, q: string): boolean {
  return new RegExp(id).test(q) || new RegExp(name, "i").test(q);
}

export default function DataBrowser() {
  const { page } = useParams();
  const pages: Folder[] = useSelector((state) => state.pages);
  const { id: pageId } = pages.find((p) => matches(p, page)) ?? {};

  const categories: Category[] = useSelector(
    (state) => state.categories
  ).filter((c) => c.pageId === pageId);

  if (pages.length === 0) {
    return <CircularProgress isIndeterminate size={32} py={16} mx="auto" />;
  }

  if (!pageId) {
    return <PageNotFound page={page} />;
  }

  return (
    <Box p={4} flex={1}>
      <Tabs variant="soft-rounded" colorScheme="purple" size="lg">
        <TabList flexWrap="wrap">
          {categories.map((c) => (
            <Tab key={c.id}>{c.name}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {categories.map((c) => (
            <TabPanel>
              <CategoryBrowser category={c} key={c.id} />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
}
