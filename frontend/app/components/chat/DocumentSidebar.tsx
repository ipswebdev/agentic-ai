"use client";

import { useEffect, useState } from "react";
import { UserDocument } from "@/app/types/UserDocument";
import { ConversationThread } from "@/app/types/ConversationThread";

import DocumentList from "./DocumentList";
import ThreadList from "./ThreadList";
import UploadForm from "./UploadForm";
import NewChat from "./NewChat";

interface DocumentSidebarProps {
    documents?: UserDocument[];
    threads?: ConversationThread[];
    uploadInProgress: boolean;
    selectedThreadId?: string;
    onDocSelect: (d: UserDocument) => void;
    onUploadDocument: (file: File) => void;
    onThreadSelect: (d: ConversationThread) => void;
    onCreateThread: (document: UserDocument) => Promise<boolean>;
    onDeleteThread: (thread: ConversationThread) => void;
    creatingThread: boolean;
    resetToThreads: number;
}

type SidebarMode = "THREADS" | "DOCUMENTS";

export default function DocumentSidebar({
    selectedThreadId = "",
    threads = [],
    documents = [],
    uploadInProgress,
    onThreadSelect,
    onDocSelect,
    onUploadDocument,
    onCreateThread,
    creatingThread,
    resetToThreads,
    onDeleteThread
}: DocumentSidebarProps) {
    const [sidebarMode, setSidebarMode] =
        useState<SidebarMode>("THREADS");

    useEffect(() => {
        setSidebarMode("THREADS");
    }, [resetToThreads]);

    return (
        <div className="
            border-r border-zinc-800
            bg-zinc-950
            flex flex-col
            w-80
            overflow-y-auto
        ">
            <div className="flex p-2 gap-1">
                <button
                    className={`px-2 py-2 flex-1 rounded text-sm ${
                        sidebarMode === "THREADS"
                            ? "bg-zinc-800 text-white"
                            : "text-zinc-400 hover:bg-zinc-800"
                    }`}
                    onClick={() => setSidebarMode("THREADS")}
                >
                    Conversations
                </button>

                <button
                    className={`px-2 py-2 flex-1 rounded text-sm ${
                        sidebarMode === "DOCUMENTS"
                            ? "bg-zinc-800 text-white"
                            : "text-zinc-400 hover:bg-zinc-800"
                    }`}
                    onClick={() => setSidebarMode("DOCUMENTS")}
                >
                    Documents
                </button>
            </div>

            {sidebarMode === "THREADS" ? (
                <>
                    <NewChat
                        documents={documents}
                        onCreateThread={onCreateThread}
                        creatingThread={creatingThread}
                    />

                    <h2 className="p-4 text-sm font-semibold text-white">
                        Chat Threads
                    </h2>

                    <ThreadList
                        threads={threads}
                        selectedThreadId={selectedThreadId}
                        onThreadSelect={onThreadSelect}
                        onDelete={onDeleteThread}
                    />
                </>
            ) : (
                <>
                    <UploadForm
                        uploadInProgres={uploadInProgress}
                        onUploadDocument={onUploadDocument}
                    />

                    <h2 className="p-4 text-sm font-semibold text-white">
                        Uploaded Documents
                    </h2>

                    <DocumentList
                        documents={documents}
                        onDocSelect={onDocSelect}
                    />
                </>
            )}
        </div>
    );
}