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
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";
import { useSelector } from "../store";
import { NavLink } from "react-router-dom";

const StyledNavLink = styled(NavLink)`
  &.active {
    cursor: default;
    font-weight: bold;

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
      <Divider borderColor="gray.400" my={4} />
      <Text color="gray.500" mb={2} textTransform="uppercase" fontSize="sm">
        Pages
      </Text>
      <SkeletonText noOfLines={10} spacing={4} isLoaded={pages.length > 0}>
        {pages.map(({ name, id }) => (
          <Link
            as={StyledNavLink}
            to={`/${id}`}
            display="block"
            mb={2}
            key={id}
          >
            {name}
          </Link>
        ))}
      </SkeletonText>
    </Box>
  );
}
