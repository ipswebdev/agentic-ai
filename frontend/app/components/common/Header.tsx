'use client'
import { useContext } from "react";
import Button from "./Button";
import { AuthContext } from "@/app/context/auth.context";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter()
  const authContext = useContext(AuthContext)
  return (<div>
    <div className="h-16
      border-b
      border-zinc-800
      bg-zinc-950
      px-6
      flex
      items-center
    ">
        Document Workspace
    </div>
    {authContext.data?.name}
    <div className="w-200px">
    <Button
          isDisabled={false}
          label="Logout"
          onUserClick={()=> {authContext.logout();router.push('/')}}
        />
    </div>
    
  </div>
    
  );
}
