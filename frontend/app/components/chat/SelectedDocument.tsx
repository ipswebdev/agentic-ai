import { UserDocument } from "@/app/types/UserDocument";

interface SelectedDocumentProps{
    selectedDoc:UserDocument|null
}
export default function SelectedDocument({selectedDoc}:SelectedDocumentProps) {
    return (
    <div className="
        h-16
        border-b
        border-zinc-800
        bg-zinc-900
        px-6
        flex
        items-center
        justify-between
    ">
        {selectedDoc?.fileName || '📄 Select a document from the sidebar'}
    </div>
    );
}