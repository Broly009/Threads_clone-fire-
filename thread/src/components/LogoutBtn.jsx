import { Button } from "@chakra-ui/react";
import React from "react";
import { useRecoilState } from "recoil";
import { userAtom } from "../Atom/userAtom";
import { useShowToast } from "../hooks/useShowToast";
import { HiLogout } from "react-icons/hi";

const LogoutBtn = () => {
const [user,setUser] = useRecoilState(userAtom)
const showToast = useShowToast();
  const handleLogout = async()=>{
     try {
        const res = await fetch("/api/users/logout",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
        })
        const data = await res.json();
        console.log(data)
        if(data.error){
         showToast("Error", data.error, "error");
         return;
        }

        localStorage.removeItem("user-threads")
        console.log(user)
        setUser(null)
     } catch (error) {
        
     }
  }  
  return (
    <div>
      <Button position={"fixed"} top={"30px"} right={"30px"} size={"sm"}
      onClick={handleLogout}
      >
        <HiLogout size={20}/>
      </Button>
    </div>
  );
};

export default LogoutBtn;
