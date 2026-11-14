import { useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { Message } from "@/app/types/ChatMessage";

interface ChatWindowProps {
    messages: Message[];
    onMessageSend: (message: string) => void;
    loading: boolean;
    selectedThread: string | undefined;
}

export default function ChatWindow({
    messages,
    onMessageSend,
    loading,
    selectedThread,
}: ChatWindowProps) {
    const chatContainer = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const element = chatContainer.current;

        if (!element) return;

        element.scrollTo({
            top: element.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    return (
        <div className="flex flex-col flex-1 bg-zinc-900">
            <div
                ref={chatContainer}
                className="
                    flex-1
                    overflow-y-auto
                    px-6
                    py-4
                    space-y-4
                "
            >
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <ChatMessage
                            key={message.id}
                            message={message}
                        />
                    ))
                ) : (
                    !selectedThread
                        ? "Pick a conversation to start asking questions"
                        : `Ask a question about ${selectedThread}`
                )}

                <span className="animate-pulse">
                    {loading ? "Thinking..." : ""}
                </span>
            </div>

            <ChatInput
                loading={loading}
                onMessageSend={onMessageSend}
            />
        </div>
    );
}