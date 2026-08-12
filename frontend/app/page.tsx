"use client"
import { useGoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import Button from "./components/common/Button";
import { authenticateUser } from "./services/api";


export default function Home() {
 const login = useGoogleLogin({
    onSuccess: codeResponse => {console.log(codeResponse);loginToExpress(codeResponse.code)},
    onError: (err)=>console.log('auth error',err),
    flow: 'auth-code',
  });
  const loginToExpress = async (authCode) => {
    const results = await authenticateUser(authCode);
    console.log(results);
  }
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
    <Button
      isDisabled={false}
      label="Sign in with Google"
      onUserClick={()=> login()}
    />
    </div>
  )
    
}
