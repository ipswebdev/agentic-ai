"use client"
import { useState } from "react";
import ChatWindow from "./ChatWindow";
import DocumentSidebar from "./DocumentSidebar";
import SelectedDocument from "./SelectedDocument";
import { askQuestion,uploadDocument } from "@/app/services/api";
import Toast from "../common/Toast";
import { useRouter } from "next/navigation";

export default function ChatWrapper({documents}) {
    const router = useRouter();
    const [selectedDoc , setSelectedDoc] = useState({})
    const [loading , setLoader] = useState(false)
    const [showToastNotification,setToastNotification] = useState(false);
    

    const onDocSelect = (d) => {
        setToastNotification(false);
        setSelectedDoc(()=>d)
    }
    
    const onUploadDocument = async (file) => {
        const results = await uploadDocument(file);
        if(results.documentId && results.success){
            router.refresh()

        }
    }
    
    const toggleToast = ()=>{
        setToastNotification(false);
    }

    const [messageList,setMessageList] = useState([])
    const onMessageSent = (message) => {
        setToastNotification(false);
        if(!selectedDoc?._id){
            ('Error! No Doc')
            setToastNotification(true);;
            return 
        }
        const trimmedMessage = message.trim()
        getAnswer(message,selectedDoc._id)
        setMessageList((previous)=>[...previous,{text:trimmedMessage,sender:'user'}])  
    }
    const getAnswer = async (message,id)=> {
    setLoader(()=>true)
    const result =  await askQuestion(message,id)
        if(result && result.answer){
            setMessageList((previous)=>[...previous,{text:result.answer,sender:'AI'}])
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
            <ChatWindow selectedDocument={selectedDoc.fileName} loading={loading} messages={messageList} onMessageSend={onMessageSent}></ChatWindow>
        </div>
    </div>
  );
}