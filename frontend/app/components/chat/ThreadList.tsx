
import { ConversationThread } from "@/app/types/ConversationThread";
import ThreadCard from "./ThreadCard";

interface ThreadListProps {
    threads: ConversationThread[];
    selectedThreadId: string;
    onThreadSelect: (d: ConversationThread) => void;
}

export default function ThreadList({
    threads,
    selectedThreadId,
    onThreadSelect,
}: ThreadListProps) {

    return (
        <div className="flex-1 overflow-y-auto">
            {threads.map((thread) => (
                <ThreadCard
                    key={thread.id}
                    thread={thread}
                    selected={thread.id === selectedThreadId}
                    onThreadSelect={onThreadSelect}
                />
            ))}
        </div>
    );
}
