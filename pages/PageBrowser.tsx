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
import { useParams, Link, Redirect } from "react-router-dom";
import CategoryBrowser from "../components/CategoryBrowser";
import { fireGtmEvent } from "../data/google-apis";
import PageNotFound from "./PageNotFound";
import { useSelector } from "../data/store";
import { Category, Folder } from "../types/types";

function matches({ id, name }: Folder, q: string): boolean {
  return new RegExp(id).test(q) || new RegExp(name, "i").test(q);
}

export default function PageBrowser() {
  const { page, category } = useParams();
  const pages: Folder[] = useSelector((state) => state.pages);
  const { name: pageName, id: pageId } =
    pages.find((p) => matches(p, page)) ?? {};

  const categories: Category[] = useSelector(
    (state) => state.categories
  ).filter((c) => c.pageId === pageId);
  const selectedCategory = categories.findIndex((c) => c.id === category);

  if (selectedCategory === -1 && pages.length > 0) {
    return <Redirect to={`/${page}/${categories[0].id}`} />;
  }

  if (pages.length === 0) {
    return <CircularProgress isIndeterminate size={32} py={16} mx="auto" />;
  }

  if (!pageId) {
    return <PageNotFound page={page} />;
  }

  return (
    <Box p={4} flex={1}>
      <Tabs
        variant="soft-rounded"
        colorScheme="purple"
        size="lg"
        isLazy
        index={selectedCategory}
      >
        <TabList flexWrap="wrap">
          {categories.map((c) => {
            function handleViewCategory() {
              fireGtmEvent("View Category", { value: c.name, page: pageName });
            }

            return (
              <Tab
                key={c.id}
                as={Link}
                to={`/${page}/${c.id}`}
                onClick={handleViewCategory}
              >
                {c.name}
              </Tab>
            );
          })}
        </TabList>
        <TabPanels>
          {categories.map((c) => (
            <TabPanel key={c.id}>
              <CategoryBrowser category={c} />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
}
