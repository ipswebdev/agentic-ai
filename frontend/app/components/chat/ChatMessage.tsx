import { Message, Sender } from "@/app/types/ChatMessage";

interface ChatMessageProps {
    message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
    const isUserMessage = message.sender === Sender.USER;

    return (
        <div
            className={`
                max-w-[70%]
                rounded-2xl
                px-4 py-3
                ${
                    isUserMessage
                        ? "ml-auto bg-blue-600 text-white"
                        : "mr-auto bg-zinc-800 text-zinc-100"
                }
            `}
        >
            {message.text}
        </div>
    );
}