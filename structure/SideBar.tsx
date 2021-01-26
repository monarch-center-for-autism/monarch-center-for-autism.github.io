import {
  Box,
  Text,
  Divider,
  Avatar,
  Flex,
  Link,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  theme,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";
import { actions, useSelector } from "../data/store";
import { NavLink } from "react-router-dom";
import { fireGtmEvent } from "../data/google-apis";
import { useDispatch } from "react-redux";

const StyledNavLink = styled(NavLink)`
  &.active {
    cursor: default;
    font-weight: bold;
    color: ${theme.colors.purple["800"]};
    background-color: ${theme.colors.purple["100"]};
    border-radius: 20px;
    padding-left: 0.5rem;
    margin-left: -0.5rem;

    &:hover {
      text-decoration: none;
    }

    &:focus {
      border: none;
      box-shadow: none;
    }
  }
`;

export default function Sidebar() {
  const user = useSelector((state) => state.user);
  const pages = useSelector((state) => state.pages);
  const dispatch = useDispatch();

  function handleRefreshData() {
    dispatch(actions.showClearCacheModal());
  }

  return (
    <Box p={4} bg="gray.200" w={60} flexShrink={0}>
      <Flex direction="column" alignItems="center">
        <SkeletonCircle isLoaded={user} mb={4} size="10">
          <Avatar name={user?.name} src={user?.imageUrl} />
        </SkeletonCircle>
        <Skeleton isLoaded={user}>
          <Text color="gray.600">
            Hello, {user?.name ?? "name placeholder"}!
          </Text>
        </Skeleton>
      </Flex>
      <Divider borderColor="gray.400" my={4} />
      <Text color="gray.500" mb={2} textTransform="uppercase" fontSize="sm">
        Actions
      </Text>
      <Link as={StyledNavLink} to="/search" display="block" mb={2}>
        Search
      </Link>
      <Link display="block" mb={2} onClick={handleRefreshData}>
        Refresh Data
      </Link>
      <Divider borderColor="gray.400" my={4} />
      <Text color="gray.500" mb={2} textTransform="uppercase" fontSize="sm">
        Pages
      </Text>
      <SkeletonText noOfLines={10} spacing={4} isLoaded={pages.length > 0}>
        {pages.map(({ name, id }) => {
          function handleViewPage() {
            fireGtmEvent("View Page", { value: name });
          }

          return (
            <Link
              as={StyledNavLink}
              to={`/${id}`}
              display="block"
              mb={2}
              onClick={handleViewPage}
              key={id}
            >
              {name}
            </Link>
          );
        })}
      </SkeletonText>
    </Box>
  );
}
