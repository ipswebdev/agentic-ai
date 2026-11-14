
import { ConversationThread } from "@/app/types/ConversationThread";
import ListItem from "./ListItem";

interface ThreadCardProps {
    thread: ConversationThread;
    selected: boolean;
    onThreadSelect: (d: ConversationThread) => void;
}

export default function ThreadCard({
    thread,
    selected,
    onThreadSelect,
}: ThreadCardProps) {

    return (
        <ListItem
            title={thread.title}
            subtitle={thread.document.fileName}
            selected={selected}
            onClick={() => onThreadSelect(thread)}
        />
    );
}
