import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  HStack,
  Avatar,
  
  Center,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { userAtom } from "../Atom/userAtom";
import usePreviewImg from "../hooks/usePreviewimg";
import { useShowToast } from "../hooks/useShowToast";


export default function UserProfileEdit() {
  const { handleImageChange, imgUrl } = usePreviewImg();
  const fileref = useRef(null);
  const [user, setUser] = useRecoilState(userAtom);
  const [updating , setUpdating] = useState(false)

  const [input, setInput] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    password: "",
  });
  const showToast = useShowToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(updating) return;
    setUpdating(true)
    try {
      const res = await fetch(`api/users/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...input,
          profilePic: imgUrl,
        }),
      });
      const data = await res.json();
      if(data.error){
        showToast("Error", data.error ,"error")
        return;
      }

      showToast('Success' ,"profile updated successfully", "success");
      setUser(data);
      console.log(user)
      localStorage.setItem("user-threads", JSON.stringify(data));
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally{
        setUpdating(false)
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"} my={6}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Edit
          </Heading>
          <FormControl>
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar size="xl" src={imgUrl || user.profilePic} />
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileref.current.click()}>
                  Change Avatar
                </Button>
                <Input
                  type="file"
                  hidden ref={fileref}
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl id="userName" >
            <FormLabel>Full name</FormLabel>
            <Input
              placeholder="UserName"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={input.name}
              onChange={(e) => setInput({ ...input, name: e.target.value })}
            />
          </FormControl>
          <FormControl >
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="fullname"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={input.username}
              onChange={(e) =>
                setInput({ ...input, username: e.target.value })
              }
            />
          </FormControl>
          <FormControl id="email" >
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              _placeholder={{ color: "gray.500" }}
              type="email"
              value={input.email}
              onChange={(e) => setInput({ ...input, email: e.target.value })}
            />
          </FormControl>
          <FormControl >
            <FormLabel> Bio</FormLabel>
            <Input
              placeholder="UserName"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={input.bio}
              onChange={(e) => setInput({ ...input, bio: e.target.value })}
            />
          </FormControl>
          <FormControl id="password" >
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              _placeholder={{ color: "gray.500" }}
              type="password"
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
            >
              Cancel
            </Button>
            <Button
              bg={"green.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "green.500",
              }}
              type="submit"
              isLoading={updating}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
