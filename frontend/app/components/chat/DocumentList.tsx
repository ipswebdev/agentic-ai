import { UserDocument } from "@/app/types/UserDocument";
import DocumentCard from "./DocumentCard";

interface DocumentListProps{
    documents:UserDocument[],
    onDocSelect:(d:UserDocument)=>void,
}
export default function DocumentList({documents,onDocSelect}:DocumentListProps) {
    const fetchedDocs = documents.map((d,i)=> {
    return <DocumentCard onDocSelect={onDocSelect} key={i} file={d}></DocumentCard>
    })
    return (

    <div
    className="
        flex-1
        overflow-y-auto
    "
>
        {
        fetchedDocs
        }
    </div>
  );
}