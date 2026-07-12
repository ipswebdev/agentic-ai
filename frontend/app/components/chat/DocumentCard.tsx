"use client"


import { useRouter } from "next/navigation";
import Button from "../common/Button";
import { processDocument } from "@/app/services/api";
import { UserDocument } from "@/app/types/UserDocument";
interface DocumentCardProps{
    file:UserDocument,
    onDocSelect:(d:UserDocument)=>void,
}
export default function DocumentCard({file,onDocSelect}:DocumentCardProps) {
    const router = useRouter()
    const onProcessDocument = async ():Promise<void> => {
        const result = await processDocument(file.id);
        console.log(result)
        if(result && result.success && result.documentId === file.id){
            router.refresh()
        }
    }
    const handleDocSelect = (file:UserDocument) => {
        if(file.status !== 'READY'){
            return;
        }
        onDocSelect(file);
    }
    const lastUpdatedStr = `${(new Date(file.updatedAt)).toDateString()} at ${(new Date(file.updatedAt)).toTimeString()}`   
    const statusBadge = () => {
    switch (file.status) {
        case "READY":
            return (
                <span className="rounded-full bg-green-900 px-2 py-1 text-xs font-medium text-green-300">
                    🟢 Ready
                </span>
            );

        case "PROCESSING":
            return (
                // <span className="rounded-full bg-yellow-900 px-2 py-1 text-xs font-medium text-yellow-300">
                //     🟡 Processing
                // </span>
                <Button
                    label="Process Document"
                    onUserClick={() => onProcessDocument()}
                />
            );

        case "UPLOADED":
            return (
                // <span className="rounded-full bg-yellow-900 px-2 py-1 text-xs font-medium text-yellow-300">
                //     🟡 Processing
                // </span>
                <Button
                    label="Process Document"
                    onUserClick={() => onProcessDocument()}
                />
            );
        case "FAILED":
            return (
                <Button
                    label="Process Document"
                    onUserClick={() => onProcessDocument()}
                />
            );

        default:
            return (
                <span className="rounded-full bg-zinc-700 px-2 py-1 text-xs text-zinc-300">
                    {file.status}
                </span>
            );
    }
};
return (
    <div
            onClick={() => handleDocSelect(file)}
            className="
                cursor-pointer
                border-b
                border-zinc-800
                px-4
                py-3
                transition-colors
                hover:bg-zinc-800
            "
        >
            <p className="
                truncate
                text-sm
                font-medium
                text-zinc-100
            ">
                {file?.fileName}
            </p>

            <p className="mt-2 flex items-center gap-2 text-xs text-zinc-400">
                {statusBadge()}
                <span>Last Updated {lastUpdatedStr}</span>
            </p>
        </div>
    );
}