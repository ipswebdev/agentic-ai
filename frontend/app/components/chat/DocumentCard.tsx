"use client"


import { useRouter } from "next/navigation";
import Button from "../common/Button";
import { processDocument } from "@/app/services/api";

export default function DocumentCard({file,onDocSelect}) {
    const router = useRouter()
    const onProcessDocument = async (id) => {
        const result = await processDocument(id);
        console.log(result)
        if(result && result.success && result.documentId === id){
            router.refresh()
        }
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
                <span className="rounded-full bg-yellow-900 px-2 py-1 text-xs font-medium text-yellow-300">
                    🟡 Processing
                </span>
            );

        case "UPLOADED":
        case "FAILED":
            return (
                <Button
                    label="Process Document"
                    onUserClick={() => onProcessDocument(file._id)}
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
            onClick={() => onDocSelect(file)}
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