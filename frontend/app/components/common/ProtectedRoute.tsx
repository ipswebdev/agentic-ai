'use client'
import { AuthContext } from "@/app/context/auth.context"
import { useRouter } from "next/navigation"
import { useContext, useEffect } from "react"

export default function ProtectedRoute({children}){

    const router = useRouter()
    const authContext = useContext(AuthContext)
    const authStatus = authContext.status;
    const renderedContent = authStatus  === 'checking' ? 'Verifying user Details..' :  authStatus === 'authenticated' ? children : null
    useEffect(()=>{
        console.log('useEffect',authStatus)
        if(authStatus === 'unauthenticated'){
            router.push('/')
        }
    },[authStatus])  
    return (
        renderedContent
    )
}