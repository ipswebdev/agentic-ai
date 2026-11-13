import { FetchDocumentsResponse,AnswerResponse } from "../types/UserDocument";

import {
    NEXT_PUBLIC_EXPRESS_API_URL,
} from "../config/env";
import { deleteReq, get, post } from "./apiClient";
import { CreateConversationThreadResponse, DeleteConversationThreadResponse, FetchConversationThreadResponse } from "../types/ConversationThread";
import { MessageResponse } from "../types/ChatMessage";

const expressURL = NEXT_PUBLIC_EXPRESS_API_URL;


export const  fetchUserDocuments = async () :Promise<FetchDocumentsResponse> => {
    const url = `${expressURL}/documents`;
    const response = await get(url,{})
    if (!response) {
        return {
        success: false,
        data: null,
        };
    }
    const data: FetchDocumentsResponse = await response?.json()
    return data;
}

export const  fetchConversationThreads = async () :Promise<FetchConversationThreadResponse> => {
    const url = `${expressURL}/threads`;
    const response = await get(url,{})
    if (!response) {
        return {
        success: false,
        data: null,
        message: "Authentication required"
        };
    }
    const data: FetchConversationThreadResponse = await response?.json()
    return data;
}

export const  fetchConversationThreadMessages = async (threadId:string) :Promise<MessageResponse> => {
    if(!threadId.trim()){
        console.error('ThreadID missing!')
        return {
            success: false,
            data:{
                messages:[]
            }
        }
    }
    const url = `${expressURL}/threads/${threadId}/messages`;
    const response = await get(url,{})
    if (!response) {
        return {
        success: false,
        data: null,
        message: "Authentication required"
        };
    }
    const data: MessageResponse = await response?.json()
    return data;
}

export const deleteConversationThread = async (
  threadId: string
): Promise<DeleteConversationThreadResponse> => {
  if (!threadId.trim()) {
    return {
      success: false,
      data: null,
      message: "Thread ID missing"
    };
  }

  const response = await deleteReq(
    `${expressURL}/threads/${threadId}`,
    {},
    {}
  );

  if (!response) {
    return {
      success: false,
      data: null,
      message: "Authentication required"
    };
  }

  return response.json();
};
export const createConversationThread = async (
  documentId: string
): Promise<CreateConversationThreadResponse> => {
  const response = await post(
    `${expressURL}/threads`,
    {
      "Content-Type": "application/json"
    },
    JSON.stringify({ documentId })
  );

  if (!response) {
    return {
      success: false,
      data: null,
      message: "Authentication required"
    };
  }

  return response.json();
};

export const  askQuestion = async (question,threadId):Promise<AnswerResponse>  =>  {
    const payload = {
        message:question,
        threadId:threadId
    }
    const results = await post(`${expressURL}/chat`,
        {
            "Content-Type": "application/json"
        },
        JSON.stringify(payload))
    if (!results) {
        return {
        success: false,
        data: null,
        message: "Authentication required"
        };
    }
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
