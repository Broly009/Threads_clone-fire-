import React from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { userAtom } from '../Atom/userAtom'
import { useShowToast } from './useShowToast'
import authScreenAtom from '../Atom/authAtom'
import {Link as RouterLink} from "react-router-dom"

const useLogout = () => {
    const  setUser = useSetRecoilState(userAtom)
    const user = useRecoilValue(userAtom)
    const showToast = useShowToast()
    const [authScreen,setAuthScreen] = useRecoilState(authScreenAtom);
  

    const logout = async()=>{
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
            showToast("Error", data.error.message, "error");
            return;
           }
   
           localStorage.removeItem("user-threads")
           console.log(user)
           setUser(null)
           {!user && (
            <Link
              as={RouterLink}
              to={"/auth"}
              onClick={() => setAuthScreen("login")}
            >
              Login
            </Link>
          )}
        } catch (error) {
            showToast("Error", error.message, "error");
        }
     }
     return logout 
}

export default useLogout