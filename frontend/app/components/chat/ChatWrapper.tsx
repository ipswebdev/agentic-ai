"use client"
import { useState } from "react";
import ChatWindow from "./ChatWindow";
import DocumentSidebar from "./DocumentSidebar";
import SelectedDocument from "./SelectedDocument";
import { askQuestion,processDocument,uploadDocument } from "@/app/services/api";
import Toast from "../common/Toast";
import { useRouter } from "next/navigation";
import  { UserDocument } from "../../types/UserDocument"
import { Message, Sender } from "@/app/types/ChatMessage";
interface ChatWrapperProps {
    documents: UserDocument[];
}

export default function ChatWrapper({documents}:ChatWrapperProps) {
    const router = useRouter();
    const [selectedDoc , setSelectedDoc] = useState<UserDocument|null>(null)
    const [uploadInProgress , setUploadState] = useState(false)
    const [loading , setLoader] = useState(false)
    const [showToastNotification,setToastNotification] = useState(false);
    const [toastLabel,setToastLabel] = useState('')

    const onDocSelect = (d:UserDocument):void => {
        setToastNotification(false);
        setSelectedDoc(()=>d)
    }
    
    const onProcessDocument = async (id:string):Promise<void> => {
        const result = await processDocument(id);
        console.log(result)
        setToastNotification(false);
        if(result && result.success && result.data.documentId === id){
            setToastLabel("Document Processing Done!")
            setToastNotification(true);
            router.refresh()
        }else{
            setToastLabel("Error Processing the Document!Please try again later....")
            setToastNotification(true);
        }
    }
    const onUploadDocument = async (file:File):Promise<void> => {
        setUploadState(true);
        try{
            const results = await uploadDocument(file);
            if(results?.data?.documentId && results.success){
                setToastLabel("Document Upload Done! Processing it now")
                setToastNotification(true);
                router.refresh();
                setUploadState(false)
                onProcessDocument(results.data?.documentId)
            }else{
                setToastLabel("Error Uploading the Document!Please try again later....")
                setToastNotification(true);
                setUploadState(false)
                router.refresh()
            }
        }
        catch(err){
            console.log(err);
            setToastLabel("Error: Unable to Upload the document")
            setToastNotification(true);
            setUploadState(false)
        }
        
    }
    
    const toggleToast = ():void=>{
        setToastNotification(false);
    }

    const [messageList,setMessageList] = useState<Message[]>([]);
    const onMessageSent = (message:string):void => {
        setToastNotification(false);
        if(!selectedDoc?.id){
            setToastLabel("Please select a document first.")
            setToastNotification(true);
            return; 
        }
        const trimmedMessage = message.trim()
        getAnswer(message,selectedDoc.id)
        const newMessage:Message = {text:trimmedMessage,sender:Sender.USER,timestamp:'',id:''}
        setMessageList((previous)=>[...previous,newMessage])  
    }
    const getAnswer = async (message:string,id:string) : Promise<void> => {
    setLoader(()=>true)
    const result =  await askQuestion(message,id)
        if(result && result.success && result.data.answer){
            const newMessageAI:Message = {text:result.data.answer,sender:Sender.AI,timestamp:'',id:''}
            setMessageList((previous)=>[...previous,newMessageAI])
        }
        setLoader(()=>false)
    }
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
        { showToastNotification && (
                <Toast
                    message={toastLabel}
                    status={"ERROR"}
                    onClose={()=>toggleToast()}
                />
            )
        }
        <SelectedDocument selectedDoc={selectedDoc}></SelectedDocument>
        <div className="flex flex-1 overflow-hidden">
            <DocumentSidebar uploadInProgress={uploadInProgress} onUploadDocument={(f)=>onUploadDocument(f)} onDocSelect={onDocSelect} documents={documents}></DocumentSidebar>
            <ChatWindow selectedDocument={selectedDoc?.fileName} loading={loading} messages={messageList} onMessageSend={onMessageSent}></ChatWindow>
        </div>
    </div>
  );
}