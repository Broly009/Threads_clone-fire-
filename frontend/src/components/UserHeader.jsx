import {
  Avatar,
  Box,
  Flex,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
  Menu,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import { userAtom } from "../Atom/userAtom";
import { Link, Link as RouterLink } from "react-router-dom";
import { FaFire } from "react-icons/fa";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const UserHeader = ({ user }) => {
  const showToast = useToast();
  const currentUser = useRecoilValue(userAtom);
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
  

  const CopyUrl = () => {
    const currenturl = window.location.href;
    navigator.clipboard.writeText(currenturl).then(() => {
      showToast("Account created.","Profile link copied","success",)
    });
  };


  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.username}</Text>
            <Text
              fontSize={"xs"}
              bg={"#1e1e1e"}
              color={"#616161"}
              p={1}
              borderRadius={"full"}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePic && (
            <Avatar src={user.profilePic} name={user.name} size={"xl"} />
          )}
          {!user.profilePic && (
            <Avatar
              src="https://bit.ly/broken-link"
              name={user.name}
              size={"xl"}
            />
          )}
        </Box>
      </Flex>
      <Text>{user.bio}</Text>

      {currentUser?._id == user._id && (
        <Link as={RouterLink} to="/update">
          <Button size={"sm"}>Update Profile</Button>
        </Link>
      )}
      {currentUser?._id !== user._id && (
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Box w="1" h="1" borderRadius={"full"} bg={"gray.light"}></Box>
          <Text color={"gray.light"}>{user.following.length} following</Text>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <FaFire size={24} />
          </Box>
          <Menu>
            <MenuButton>
              <Box className="icon-container">
                <CgMoreO size={24} />
              </Box>
            </MenuButton>
            <MenuList bg={"gray.dark"}>
              <MenuItem onClick={CopyUrl}>Copy link</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={1}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
          borderBottom={"1.5px solid white"}
        >
          <Text>Thread</Text>
        </Flex>
        <Flex
          flex={1}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
          color={"gray.light"}
          borderBottom={"1.5px solid gray"}
        >
          <Text>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
