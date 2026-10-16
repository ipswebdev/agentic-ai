import { FetchDocumentsResponse,AnswerResponse } from "../types/UserDocument";

import {
    NEXT_PUBLIC_EXPRESS_API_URL,
} from "../config/env";
import { get, post } from "./apiClient";

const expressURL = NEXT_PUBLIC_EXPRESS_API_URL;


export const  fetchUserDocuments = async () :Promise<FetchDocumentsResponse> => {
    const url = `${expressURL}/documents`;
    const response = await get(url,{})
    const data: FetchDocumentsResponse = await response.json()
    return data;
}

export const  askQuestion = async (question,docId):Promise<AnswerResponse>  =>  {
    const payload = {
        message:question,
        documentId:docId
    }
    const results = await post(`${expressURL}/chat`,
        {
            "Content-Type": "application/json"
        },
        JSON.stringify(payload))
    const data :AnswerResponse = await results.json();
    return data;
}

export const  processDocument = async (docId:string) => {
    const url = `${expressURL}/documents/${docId}/process-document`
    console.log(docId,expressURL)
    const header = {
            "Content-Type": "application/json"
        }
    const postReq = await post(url,header)

    return postReq.json();
}

export const  uploadDocument = async (file:File) => {
    const formData = new FormData();

    formData.append("file", file);
    const url = `${expressURL}/documents/upload`;
    const postReq = await post(url,{},formData)
    return postReq.json();
}

export const authenticateUser = async (authCode:string) => {
    const payload = {authCode:authCode}
    console.log('payload',payload)
    const results = await fetch(`${expressURL}/auth/google/login`,{
        method:'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(payload),
    })
    return results.json();
}
