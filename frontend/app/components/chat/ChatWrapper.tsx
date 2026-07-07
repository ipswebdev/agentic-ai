"use client"
import { useState } from "react";
import ChatWindow from "./ChatWindow";
import DocumentSidebar from "./DocumentSidebar";
import SelectedDocument from "./SelectedDocument";
import { askQuestion,uploadDocument } from "@/app/services/api";
import Toast from "../common/Toast";
import { useRouter } from "next/navigation";
import {AnswerResponse, UserDocument} from "../../types/UserDocument"
import { Message, Sender } from "@/app/types/ChatMessage";
interface ChatWrapperProps {
    documents: UserDocument[];
}

export default function ChatWrapper({documents}:ChatWrapperProps) {
    const router = useRouter();
    const [selectedDoc , setSelectedDoc] = useState<UserDocument|null>(null)
    const [loading , setLoader] = useState(false)
    const [showToastNotification,setToastNotification] = useState(false);
    

    const onDocSelect = (d:UserDocument):void => {
        setToastNotification(false);
        setSelectedDoc(()=>d)
    }
    
    const onUploadDocument = async (file:File):void => {
        const results = await uploadDocument(file);
        if(results.documentId && results.success){
            router.refresh()
        }
    }
    
    const toggleToast = ():void=>{
        setToastNotification(false);
    }

    const [messageList,setMessageList] = useState<Message[]>([])
    const onMessageSent = (message:string):undefined => {
        setToastNotification(false);
        if(!selectedDoc?._id){
            setToastNotification(true);
            return; 
        }
        const trimmedMessage = message.trim()
        getAnswer(message,selectedDoc._id)
        const newMessage:Message = {text:trimmedMessage,sender:Sender.USER,timestamp:'',id:''}
        setMessageList((previous)=>[...previous,newMessage])  
    }
    const getAnswer = async (message:string,id:string) : Promise<void> => {
    setLoader(()=>true)
    const result =  await askQuestion(message,id)
        if(result && result.success && result.answer){
            const newMessageAI:Message = {text:result.answer,sender:Sender.AI,timestamp:'',id:''}
            setMessageList((previous)=>[...previous,newMessageAI])
        }
        setLoader(()=>false)
    }
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
        { showToastNotification && (
                <Toast
                    message={"Please select a document first."}
                    status={"ERROR"}
                    onClose={()=>toggleToast()}
                />
            )
        }
        <SelectedDocument selectedDoc={selectedDoc}></SelectedDocument>
        <div className="flex flex-1 overflow-hidden">
            <DocumentSidebar onUploadDocument={(f)=>onUploadDocument(f)} onDocSelect={onDocSelect} documents={documents}></DocumentSidebar>
            <ChatWindow selectedDocument={selectedDoc?.fileName} loading={loading} messages={messageList} onMessageSend={onMessageSent}></ChatWindow>
        </div>
    </div>
  );
}