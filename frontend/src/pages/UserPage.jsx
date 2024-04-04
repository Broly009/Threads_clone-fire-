import React, { useState , useEffect} from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import { Flex, Spinner, useToast } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetuserprofile from "../hooks/useGetuserprofile";
import { useRecoilState } from "recoil";
import postAtom from "../Atom/postAtom";

const UserPage = () => {
  const {loading,user} = useGetuserprofile()
  const { username } = useParams();
  const showToast = useToast();
  const [posts,setPosts] = useRecoilState(postAtom)
  const [fetchingposts,setFetchingposts] = useState(true)
 
  useEffect (()=>{

    const getPosts = async () => {
      setFetchingposts (true)
       try {
        
        const res = await fetch(`/api/posts/user/${username}`)
        const data = await res.json();
        setPosts(data)

       } catch (error) {
        showToast("Error" , error , "error");
       } finally {
        setFetchingposts(false)
       }
    }

    getPosts()

  } , [username , showToast, setPosts]);
  if (!user && loading){
    return (
      <Flex justifyContent={"center"} alignItems={"center"} minHeight="100vh">
        <Spinner size={"xl"}/>
      </Flex>
    )
  } 
  if(!user && !loading){
    return(<Flex justifyContent={"center"} alignItems={"center"} minHeight="100vh">
      <h3>user not found</h3>
    </Flex>)
  }
  

  return (
    <div>
      <UserHeader user = {user}/>
      {
        !fetchingposts && posts.length===0 && <h1>User has not posts</h1>
      }
      {
        fetchingposts && (
          <Flex justifyContent={"center"} alignItems={"center"} minHeight="100vh">
        <Spinner size={"xl"}/>
      </Flex>
        )
      }
      {posts.map((post)=>(
        <Post key={post._id} post={post} postedBy={post.postedBy}/>
      ))}
    </div>
  );
};

export default UserPage;
