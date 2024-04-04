import React from "react";
import { Button, Flex, Image, Link } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import { userAtom } from "../Atom/userAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import { Link as RouterLink } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { FaUser } from "react-icons/fa";
import { HiLogout } from "react-icons/hi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../Atom/authAtom";
import { FaFire } from "react-icons/fa";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();

  const [authScreen,setAuthScreen] = useRecoilState(authScreenAtom);

  return (
    <Flex justifyContent={"space-between"} mt={6} mb="12">
      {user && (
        <Link as={RouterLink} to="/">
          <GoHomeFill size={24} />
        </Link>
      )}
      {!user && (
        <Link
          as={RouterLink}
          to={"/auth"}
          onClick={() => setAuthScreen("login")}
        >
          Login
        </Link>
      )}

      <FaFire
      cursor={"pointer"}
      size={24}
      onClick={toggleColorMode}
      />

      {user && (
        <Flex alignItems={"center"} gap={4}>
          <Link as={RouterLink} to={`/${user.username}`}>
            <FaUser size={24} />
          </Link>
          <Button size={"sm"} onClick={logout}>
            <HiLogout size={20} />
          </Button>
        </Flex>
      )}

      {!user && (
        <Link
          as={RouterLink}
          to={"/auth"}
          onClick={() => setAuthScreen("signup")}
        >
          Sign up
        </Link>
      )}
    </Flex>
  );
};

export default Header;
