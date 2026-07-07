import { UserDocument } from "@/app/types/UserDocument";
import DocumentList from "./DocumentList";
import UploadForm from "./UploadForm";

interface DocumentSidebarProps{
  documents:UserDocument[],
  onDocSelect:(d:UserDocument)=>void,
  onUploadDocument:(file:File)=>void
}

export default function DocumentSidebar({documents,onDocSelect,onUploadDocument}:DocumentSidebarProps) {
  return (
    <div className="
      border-r
      border-zinc-800
      bg-zinc-950
      flex
      flex-col
      w-80
      overflow-y-auto
      "
    >
      
      <UploadForm onUploadDocument={(f)=>onUploadDocument(f)}></UploadForm>
      <h2 className="p-4 text-sm font-semibold text-white">
                    Uploaded Documents
      </h2>
      <DocumentList documents={documents} onDocSelect={onDocSelect}></DocumentList>
    </div>
  );
}
