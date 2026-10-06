"use client"

import { useEffect, useState } from "react";
import { clearLocalStorage, getLocalStorage, setLocalStorage } from "./services/session.service";
import { AuthContext, authDetails } from "./context/auth.context";
import { useGoogleLogin } from "@react-oauth/google";
import { authenticateUser } from "./services/api";
import { useRouter } from "next/navigation";


export default function AuthProvider({children}){
    const [authStatus,setAuthStatus] = useState<authDetails["status"]>('checking') 
    const [userDetails,setUserDetails] = useState<authDetails['data']>(null) 
    const router = useRouter()
    useEffect(()=>{
        const userData = getLocalStorage('userDetails')
        if(userData && userData.email){
            setAuthStatus('authenticated');
            setUserDetails(userData) 
        }else{
            setAuthStatus('unauthenticated');
        }
    },[])

    const logout = () => {
        setAuthStatus('unauthenticated');
        clearLocalStorage();
    }
    const loginToExpress = async (authCode) => {
        const results = await authenticateUser(authCode);
        console.log(results);
        setLocalStorage(results)
        setUserDetails(results)
        setAuthStatus('authenticated');
      }
    
     const login = useGoogleLogin({
        onSuccess: codeResponse => loginToExpress(codeResponse.code),
        onError: (err)=>console.log('auth error',err),
        flow: 'auth-code',
      });

    return (
        <AuthContext value={{data:userDetails,status:authStatus,login:()=>login(),logout:()=>logout()}}>{children}</AuthContext>
    );
}