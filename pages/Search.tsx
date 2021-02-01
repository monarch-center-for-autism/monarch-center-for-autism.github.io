import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Kbd,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { sumBy } from "lodash";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import FileGrid from "../components/FileGrid";
import { actions, useSelector } from "../data/store";
import CategoryState from "../types/category-states";
import useSearchResults from "../utils/useSearchResults";

export default function Search() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories);
  const subcategories = useSelector((state) => state.subcategories);

  const data = [
    ...categories.flatMap((c) => c.files),
    ...subcategories.flatMap((s) => s.files),
  ];

  const [query, setQuery] = useState("");
  const results = useSearchResults(data, query);
  const resultCount = sumBy(Object.values(results), "files.length");

  function handleQueryChange(e) {
    setQuery(e.target.value);
  }

  function handleSearchAllResources() {
    dispatch(actions.showDownloadAllFilesModal());
  }

  return (
    <Flex flex={1} direction="column" alignItems="center" p={8}>
      <InputGroup>
        <Input
          size="lg"
          placeholder="Type to search"
          value={query}
          onChange={handleQueryChange}
        />
        {(subcategories.some((s) => s.state === CategoryState.INIT) ||
          categories.some((c) => c.state === CategoryState.INIT)) && (
          <InputRightElement w="12rem" h="full">
            <Button size="sm" onClick={handleSearchAllResources}>
              Search All Resources
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
      <Accordion w="full" mt={4} mb={16} allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Advanced Searching
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel p={4}>
            <Table>
              <TableCaption>
                Note that "and" takes precedence over "or", similar to how
                multiplication happens before addition in PEMDAS. For example,
                if you wanted to search for files including the word "first"
                that are either Powerpoint or Word files, searching
                <Kbd>first .pptx$ | .docx$</Kbd> would not work. This would
                search for Powerpoint files containing "first" or any Word file.
                Instead, search for <Kbd>first .pptx$ | first .docx$</Kbd>
              </TableCaption>
              <Thead>
                <Tr>
                  <Th>Syntax</Th>
                  <Th>Effect</Th>
                  <Th>Description</Th>
                </Tr>
              </Thead>
              <Tbody fontWeight="300">
                <Tr>
                  <Td>Shortened Words</Td>
                  <Td>"Fuzzy" Match</Td>
                  <Td>
                    Instead of searching for whole words, try searching for the
                    beginnings of syllables. For example, <Kbd>figr</Kbd> would
                    match the results "first grade" and "fifth grade"
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Kbd>=query</Kbd>
                  </Td>
                  <Td>Exact Match</Td>
                  <Td>
                    You can use this syntax for only exact matches, similar to
                    surrounding your search with quotes in Google
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Kbd>!query</Kbd>
                  </Td>
                  <Td>Exclude</Td>
                  <Td>
                    Only matches files that don't include the query. Similar to
                    a minus sign in Google
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Kbd>^query</Kbd>
                  </Td>
                  <Td>Starts With</Td>
                  <Td>Only matches files that start with the query</Td>
                </Tr>
                <Tr>
                  <Td>
                    <Kbd>!^query</Kbd>
                  </Td>
                  <Td>Doesn't Start With</Td>
                  <Td>Only matches files that don't start with the query</Td>
                </Tr>
                <Tr>
                  <Td>
                    <Kbd>query$</Kbd>
                  </Td>
                  <Td>Ends With</Td>
                  <Td>
                    Only matches files that ends with the query. Especially
                    useful for limiting your search to certain file types
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Kbd>!query$</Kbd>
                  </Td>
                  <Td>Doesn't End With</Td>
                  <Td>
                    Only matches files that don't end with the query. Especially
                    useful for excluding certain file types from your search
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Kbd>thing1 | thing2</Kbd>
                  </Td>
                  <Td>Or</Td>
                  <Td>
                    Use the pipe symbol to search for multiple things at once.
                    For example, <Kbd>first | second</Kbd> would search for
                    files with "first" or "second" in their name, but not
                    necessarily both.
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Kbd>thing1 thing2</Kbd>
                  </Td>
                  <Td>And</Td>
                  <Td>
                    Use spaces to search for file names that include multiple
                    things. For example, <Kbd>first second</Kbd> would search
                    for files with both "first" and "second" in their name.
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      {!query && (
        <Text color="gray.400" size="lg">
          Please type in the text box to search the Monarch Drive
        </Text>
      )}
      {query && resultCount === 0 && (
        <Text color="gray.400" size="lg">
          Your search didn't match any files.
        </Text>
      )}
      {results.map(({ crumbs, files }) => (
        <Box mb={16} w="full">
          <Heading mb={4} textAlign="left">
            <Breadcrumb
              spacing="8px"
              separator={<ChevronRightIcon color="gray.500" />}
            >
              {crumbs.map(({ name, href }) => (
                <BreadcrumbItem>
                  <BreadcrumbLink to={href} as={NavLink}>
                    {name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              ))}
            </Breadcrumb>
          </Heading>
          <FileGrid payload={{ type: "search", files }} loading={false} />
        </Box>
      ))}
    </Flex>
  );
}
