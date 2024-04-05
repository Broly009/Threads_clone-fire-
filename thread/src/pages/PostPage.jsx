import {
  Avatar,
  Flex,
  Image,
  Text,
  Box,
  Divider,
  Button,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Actions from "../components/Actions";
import useGetuserprofile from "../hooks/useGetuserprofile";
import { useShowToast } from "../hooks/useShowToast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { userAtom } from "../Atom/userAtom";
import Comment from "../components/Comment";
import { useRecoilState, useRecoilValue } from "recoil";
import { MdDelete } from "react-icons/md";
import { formatDistanceToNow } from "date-fns";
import postAtom from "../Atom/postAtom";
import {Link as RouterLink} from "react-router-dom"

const PostPage = () => {
  const [liked, setLiked] = useState(false);
  const [posts, setPosts] = useRecoilState(postAtom);
  const { user, loading } = useGetuserprofile();
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentuser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const currentpost = posts[0];

  useEffect(() => {
    const getPosts = async () => {
      setPosts([])
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts([data]);
      } catch (error) {
        showToast("Error", error, "error");
        console.log(error);
      }
    };
    getPosts();
  }, [pid, showToast, setPosts]);

  const handleDelPost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${currentpost._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"} alignItems={"center"} minHeight="100vh">
        <Spinner size={"xl"} />
      </Flex>
    );
  }
  if (!currentpost) return null;

  return (
    <div>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Link as={RouterLink} to={`/${user?.username}`}>
            <Avatar src={user.profilePic} name="antu" size={"md"} />
          </Link>

          <Flex>
            <Text size={"sm"} fontWeight={"bold"}>
              {user.username}
            </Text>
            <Image src="/verified.png" sizes={"sm"} h={4} w={4} ml={1} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={16}
            color={"gray.light"}
            textAlign={"right"}
          >
            {formatDistanceToNow(new Date(currentpost.createdAt))} ago
          </Text>
          {currentuser?._id === user?._id && (
            <MdDelete onClick={handleDelPost} size={20} />
          )}
        </Flex>
      </Flex>

      <Text my={3}>{currentpost.text}</Text>
      {currentpost.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={currentpost.img} w={"full"} />
        </Box>
      )}
      <Flex gap={3} my={3}>
        <Actions post={currentpost} />
      </Flex>
      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>🔥</Text>
          <Text>Get the fire</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      {currentpost.replies.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={
            reply._id ===
            currentpost.replies[currentpost.replies.length - 1]._id
          }
        />
      ))}
    </div>
  );
};

export default PostPage;
