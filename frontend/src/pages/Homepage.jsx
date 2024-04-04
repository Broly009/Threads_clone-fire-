import React, { useState,useEffect } from "react";
import { useShowToast } from "../hooks/useShowToast";
import { Box, Button, Center, Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import { userAtom } from "../Atom/userAtom";
import { useRecoilState } from "recoil";
import postAtom from "../Atom/postAtom";
import SuggestedUsers from "../components/SuggestedUsers";
import { Link,Link as RouterLink } from "react-router-dom";
// import useFollowUnfollow from "../hooks/useFollowUnfollow";
// import SuggestedUser from "./SuggestedUser";


const Homepage = ({user}) => {

  const [posts, setPosts] = useRecoilState(postAtom)
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  // const { handleFollowUnfollo
 
  useEffect (() => {
    
      const getfeedPost = async () => {
        setLoading(true);
        try {
          const res = await fetch("api/posts/feed");
          const data = await res.json();
          if (data.error) {
            showToast("Error", data.error, "error");
            return;
          }
          setPosts(data);
        
        } catch (error) {
          showToast("Error", error.message, "error");
          return;
        } finally {
          setLoading(false)
        }
      };
      getfeedPost();
    
  } , [showToast , setPosts]);

  return (
    <>
    <Flex gap='10' alignItems={"flex-start"}>
    <Box flex={70}>
    {!loading && posts.length === 0 && 
     <Flex justifyContent="center" alignItems="center" height="100%">
    <Link as={RouterLink} to="/suggesteduser" >
    <Button >
      Follow some users to see the feed
    </Button>
    </Link>
    </Flex>
      }
    {loading && (
        <Flex justifyContent = {"center"} alignItems = {"center"} minHeight = {"100vh"}>
          <Spinner size={"xl"}/>
        </Flex>
      )}

      {posts.map((post)=>(
          <Post key={post._id} post={post} postedBy={post.postedBy}/>
      ))}
      </Box>
      <Box
				flex={30}
				display={{
					base: "none",
					md: "block",
				}}
			>
				<SuggestedUsers />
			</Box>
      </Flex>
    </>
  );
};

export default Homepage;
