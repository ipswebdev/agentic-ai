import { UserDocument } from "@/app/types/UserDocument";
import DocumentCard from "./DocumentCard";

interface DocumentListProps {
    documents: UserDocument[];
    onDocSelect: (d: UserDocument) => void;
}

export default function DocumentList({
    documents,
    onDocSelect,
}: DocumentListProps) {
    return (
        <div className="flex-1 overflow-y-auto">
            {documents.map((document) => (
                <DocumentCard
                    key={document.id}
                    file={document}
                    onDocSelect={onDocSelect}
                />
            ))}
        </div>
    );
}