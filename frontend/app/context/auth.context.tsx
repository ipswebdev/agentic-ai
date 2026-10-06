import { createContext } from "react";

export type authDetails = {
    data:{
        email:string,
        jwt:string,
        name:string,
        sub:string
    } | null,
    status:'checking'|'authenticated'|'unauthenticated',
    login: () => void,
    logout: () => void,
}
const authDetailValue:authDetails = {data:null,status:'checking',login:async ()=>{},logout:()=>{}}
export const AuthContext = createContext<authDetails>(authDetailValue);
 