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
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import authScreenAtom from "../Atom/authAtom";
import { useRecoilState } from "recoil";
import { useShowToast } from "../hooks/useShowToast";
import { userAtom } from "../Atom/userAtom";
import { useNavigate } from "react-router-dom";


export default function SignupCard() {
  const navigate = useNavigate();
  const showToast = useShowToast()
  const [showPassword, setShowPassword] = useState(false);
  const [authstate, setAuthstate] = useRecoilState(authScreenAtom);
  const [input,setInput] = useState({
    name:"",
    username:"",
    email:"",
    password:"",
  })
  const toast = useToast();
  const [user,setUser] = useRecoilState(userAtom)
  const handleSignup = async()=>{
    try {
        const res = await fetch("/api/users/signup",{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify(input)
        })
        const data = await res.json();
        if(data.error){
            showToast("Error", data.error, "error");
            return;
        }
       localStorage.setItem("user-threads",JSON.stringify(data))
       setUser(data)
       navigate("/suggesteduser")
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>Full name</FormLabel>
                  <Input type="text" 
                  onChange={(e)=>setInput({...input, name:e.target.value})}
                  value={input.name} />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName" isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input type="text" 
                  onChange={(e)=>setInput({...input, username:e.target.value})}
                  value={input.username}
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" 
              onChange={(e)=>setInput({...input, email:e.target.value})}
              value={input.email}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? "text" : "password"}
                onChange={(e)=>setInput({...input, password:e.target.value})}
                value={input.password}
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
                loadingText="Submitting"
                size="lg"
                bg={"green.400"}
                color={"white"}
                _hover={{
                  bg: "green.500",
                }}
                
                onClick={handleSignup}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user?{" "}
                <Link color={"green.400"} onClick={() => setAuthstate("login")}>
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
