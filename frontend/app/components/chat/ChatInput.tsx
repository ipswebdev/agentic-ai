import { useState } from "react";
interface ChatInputProps{
  loading:boolean,
  onMessageSend:(message:string)=>void,
}
export default function ChatInput({onMessageSend,loading}:ChatInputProps) {
    const [message,setMessage] = useState('')
    const handleKeyDown = (ev):void => {
        if(ev && ev.keyCode === 13 && ev.target.value){
            setMessage('')
            onMessageSend(ev.target.value)
        }
   }
    const handleChange = (ev) => {
        setMessage(ev.target.value)
    }
  return (
    <div className="
      border-t
      border-zinc-800
      p-4
    ">
      <input className="
      w-full
      rounded-xl
      border
      border-zinc-700
      bg-zinc-800
      px-4
      py-3
      text-white
      placeholder:text-zinc-500
      outline-none
      focus:border-blue-500
      " 
      type="text" 
      value={message}
      disabled={loading}
      onChange={(ev)=>handleChange(ev)}
      onKeyUp={(ev)=>handleKeyDown(ev)}/>
    </div>
  );
}
