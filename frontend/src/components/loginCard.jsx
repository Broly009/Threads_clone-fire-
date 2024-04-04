import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useRecoilState } from "recoil";
import authScreenAtom from "../Atom/authAtom";
import { useShowToast } from "../hooks/useShowToast";
import { userAtom } from "../Atom/userAtom";

export default function LoginCard() {
  const showToast = useShowToast();
  const [input, setInput] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [authstate, setAuthstate] = useRecoilState(authScreenAtom);
  const [user, setUser] = useRecoilState(userAtom);
  const [loading,setLoading] = useState(false)
  const handleLogin = async () => {
    setLoading(true)
    try {
        const res = await fetch("/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(input)
        });

        // Check if response is successful
        if (!res.ok) {
            // Handle non-2xx response statuses
            const data = await res.json();
            if (data.error) {
                // Show error locally without sending an HTTP response
                showToast("Error", data.error, "error");
            } else {
                throw new Error('Failed to log in');
            }
            return;
        }

        const data = await res.json();
        localStorage.setItem("user-threads", JSON.stringify(data));
        setUser(data);
    } catch (error) {
        // Handle other errors
        showToast("Error", error.message, "error");
    } finally{
      setLoading(false)
    }
};


  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Log in
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
          // w={{
          //     base:"full",
          //     sm:"400px"
          // }}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="lastName" isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    value={input.username}
                    onChange={(e) =>
                      setInput((inputs) => ({
                        ...inputs,
                        username: e.target.value,
                      }))
                    }
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={input.password}
                  onChange={(e) =>
                    setInput((inputs) => ({
                      ...inputs,
                      password: e.target.value,
                    }))
                  }
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Logging in"
                size="lg"
                bg={"green.400"}
                color={"white"}
                _hover={{
                  bg: "green.500",
                }}
                onClick={handleLogin}
                isLoading={loading}
              >
                Log in
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align = {"center"}>
                Don't have an account ?{" "}
                <Link
                  color = {"green.400"}
                  onClick = {() => {
                    setAuthstate("signup");
                  }}
                >
                  Sign up
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
