
import { ConversationThread } from "@/app/types/ConversationThread";
import ThreadCard from "./ThreadCard";

interface ThreadListProps {
    threads: ConversationThread[];
    selectedThreadId: string;
    onThreadSelect: (thread: ConversationThread) => void;
    onDelete: (thread: ConversationThread) => void;
}

export default function ThreadList({
    threads,
    selectedThreadId,
    onThreadSelect,
    onDelete,
}: ThreadListProps) {
    return (
        <div className="flex-1 overflow-y-auto">
            {threads.map((thread) => (
                <ThreadCard
                    key={thread.id}
                    thread={thread}
                    selected={thread.id === selectedThreadId}
                    onThreadSelect={onThreadSelect}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
