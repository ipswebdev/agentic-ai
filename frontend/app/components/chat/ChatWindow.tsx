import { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

export default function ChatWindow({messages,onMessageSend,loading,selectedDocument}) {
  const chatContainer = useRef<HTMLDivElement | null>(null)
  const messageList = messages.map((m,k)=><ChatMessage key={k} message={m}></ChatMessage>)
  useEffect(()=>{
    const chatContainerElement = chatContainer.current;
    if (!chatContainerElement) return;
    chatContainerElement.scrollTo({top:chatContainer.current.scrollHeight,behavior:'smooth'})
  },[messages])
  return (
    <div className="
      flex
    flex-col
    flex-1
    bg-zinc-900
      "
    >
       <div ref={chatContainer} className="
        flex-1
        overflow-y-auto
        px-6
        py-4
        space-y-4
    ">
      {messageList?.length ? messageList : !selectedDocument ? 'Pick an uploaded document to start asking questions' : `Ask a question about ${selectedDocument}`}
      <span className="animate-pulse">{loading ? 'Thinking...' : ''}</span>
    </div>
      
      <ChatInput loading={loading} onMessageSend={onMessageSend}></ChatInput>
    </div>
  );
}