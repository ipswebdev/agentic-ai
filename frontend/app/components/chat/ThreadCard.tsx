
import { ConversationThread } from "@/app/types/ConversationThread";
import ListItem from "./ListItem";

interface ThreadCardProps {
    thread: ConversationThread;
    selected: boolean;
    onThreadSelect: (thread: ConversationThread) => void;
    onDelete: (thread: ConversationThread) => void;
}

export default function ThreadCard({
    thread,
    selected,
    onThreadSelect,
    onDelete,
}: ThreadCardProps) {
    return (
        <ListItem
            title={thread.title}
            subtitle={thread.document.fileName}
            selected={selected}
            onClick={() => onThreadSelect(thread)}
        >
            <div className="mt-2 flex justify-end">
                <button
                    type="button"
                    onClick={() => onDelete(thread)}
                    aria-label={`Delete ${thread.title}`}
                    className="text-xs text-red-400 hover:text-red-300"
                >
                    Delete
                </button>
            </div>
        </ListItem>
    );
}
