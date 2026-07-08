import { FetchDocumentsResponse,AnswerResponse } from "../types/UserDocument";

import {
    EXPRESS_API_URL,
} from "../config/env";

const expressURL = EXPRESS_API_URL;

export const  fetchUserDocuments = async () :Promise<FetchDocumentsResponse> => {
    const response = await fetch(`${expressURL}/documents`,);
    const data: FetchDocumentsResponse = await response.json()
    console.log('fetchuserdocuments',`${expressURL}/documents`,data)
    
    return data;
}

export const  askQuestion = async (question,docId):Promise<AnswerResponse>  =>  {
    const payload = {
        message:question,
        documentId:docId
    }
    const results = await fetch(`${expressURL}/chat`,{
        headers: {
            "Content-Type": "application/json"
        },
        method:'POST',
        body:JSON.stringify(payload),
    })
    const data :AnswerResponse = await results.json();
    return data;
}

export const  processDocument = async (docId:string) => {
    const url = `${expressURL}/documents/${docId}/process-document`
    console.log(docId,expressURL)
    const results = await fetch(url,{
        headers: {
            "Content-Type": "application/json"
        },
        method:'POST',
        // body:JSON.stringify(payload),
    })
    return results.json();
}

export const  uploadDocument = async (file:File) => {
    const formData = new FormData();

    formData.append("file", file);
    const results = await fetch(`${expressURL}/documents/upload`,{
        method:'POST',
        body:formData,
    })
    return results.json();
}