"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID } from "./config/env";
import AuthProvider from "./authProvider";

export default function Providers({children}){
    const google_Auth_Client_ID = NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID
    return(
    <GoogleOAuthProvider clientId={google_Auth_Client_ID}>
      <AuthProvider>
      {children}
      </AuthProvider>
      </GoogleOAuthProvider>
    )
}