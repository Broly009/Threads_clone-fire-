
import {
  Button,
  Modal,
  useColorModeValue,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  Textarea,
  Text,
  Input,
  Flex,
  Image,
  CloseButton,
  
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { MdPostAdd } from "react-icons/md";
import usePreviewImg from "../hooks/usePreviewimg";
import { FaFileImage } from "react-icons/fa";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../Atom/userAtom";
import { useShowToast } from "../hooks/useShowToast";
import postAtom from "../Atom/postAtom";
import { useParams } from "react-router-dom";

const maxChar = 500;
const CreatePost = () => {
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [remainingChar, setRemainingChar] = useState(maxChar);
  const [postText, setPostText] = useState("");
  const[loading,setLoading] = useState(false);
  const [posts,setPosts] = useRecoilState(postAtom)
  const imgRef = useRef(null);
  const {username} = useParams()


  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > maxChar) {
      const truncatedText = inputText.slice(0, maxChar);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(maxChar - inputText.length);
    }
  };

  const handleCreatePost = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postedBy: user._id,
          text: postText,
          img: imgUrl,
        }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error.message, "error");
        return;
      }

      showToast("Success", "Post created successfully", "success");
      if(username === user.username){
        setPosts([data,...posts])
      }
      onClose();
      setImgUrl("");
      setPostText("")
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally{
      setLoading(false)
    }
  };

  return (
    <>
      <Button position={"fixed"} bottom={10} right={10} onClick={onOpen}>
        <MdPostAdd size={20} />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="Post content goes here..."
                onChange={handleTextChange}
                value={postText}
              />
              <Text
                fontSize={"xs"}
                fontWeight={"bold"}
                textAlign={"right"}
                m={"1"}
                color={"gray.300"}
              >
                {remainingChar}/{maxChar}
              </Text>
              <Input
                type="file"
                hidden
                ref={imgRef}
                onChange={handleImageChange}
              />

              <FaFileImage
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => imgRef.current.click()}
              />
            </FormControl>
          </ModalBody>
          {imgUrl && (
            <Flex mt={5} w={"full"} position={"relative"}>
              <Image src={imgUrl} alt="selected img" />
              <CloseButton
                onClick={() => {
                  setImgUrl("");
                }}
                position={"absolute"}
                bg={"gray.800"}
                top={2}
                right={2}
              />
            </Flex>
          )}

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleCreatePost} isLoading={loading}>
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
