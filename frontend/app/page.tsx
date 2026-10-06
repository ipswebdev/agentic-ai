"use client"
import Image from "next/image";
import Button from "./components/common/Button";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "./context/auth.context";


export default function Home() {
 const router = useRouter();
 const authContext = useContext(AuthContext)
 useEffect(()=>{
  console.log('userData',authContext)
  if(authContext.status === 'authenticated'){
    router.push('/chat')
  }
 },[authContext.status])
 

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {authContext.status === 'checking' &&
        'Checking Authentication Status' 
      }
      {
       authContext.status === 'authenticated' &&
        'User Already Authenticated'
      }
      {
        authContext.status === 'unauthenticated' &&
      <Button
          isDisabled={false}
          label="Sign in with Google"
          onUserClick={()=> authContext.login()}
        />
      }
    </div>
  )
    
}
