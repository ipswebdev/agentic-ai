"use client";

import { useState } from "react";
import { UserDocument } from "@/app/types/UserDocument";
import Button from "../common/Button";

interface NewChatProps {
    documents: UserDocument[];
    onCreateThread: (document: UserDocument) => Promise<boolean>;
    creatingThread: boolean;
}

export default function NewChat({
    documents,
    onCreateThread,
    creatingThread,
}: NewChatProps) {
    const [showDialog, setShowDialog] = useState(false);
    const [selectedDocumentId, setSelectedDocumentId] = useState("");

    const readyDocuments = documents.filter(
        (document) => document.status === "READY"
    );

    const handleClose = () => {
        if (creatingThread) return;

        setShowDialog(false);
        setSelectedDocumentId("");
    };

    const handleStartConversation = async () => {
        if (!selectedDocumentId || creatingThread) {
            return;
        }

        const selectedDocument = readyDocuments.find(
            (document) => document.id === selectedDocumentId
        );

        if (!selectedDocument) {
            return;
        }

        const created = await onCreateThread(selectedDocument);

        if (created) {
            setShowDialog(false);
            setSelectedDocumentId("");
        }
    };

    return (
        <div className="border-b border-zinc-800 p-4">
            <p className="mb-3 text-xs text-zinc-400">
                Start a new conversation
            </p>

            <Button
                label="New Chat"
                isDisabled={creatingThread}
                onUserClick={() => setShowDialog(true)}
            />

            {showDialog && (
                <div className="
                    fixed inset-0 z-50
                    flex items-center justify-center
                    bg-black/60 backdrop-blur-sm
                ">
                    <div className="
                        w-[450px] max-w-[90vw]
                        rounded-xl border border-zinc-700
                        bg-zinc-900 p-6 shadow-2xl
                    ">
                        <h2 className="text-lg font-semibold text-white">
                            Start a New Conversation
                        </h2>

                        <p className="mt-2 text-sm text-zinc-400">
                            Select one document to start chatting.
                        </p>

                        <div className="mt-5 max-h-72 overflow-y-auto">
                            {readyDocuments.length === 0 ? (
                                <p className="py-6 text-sm text-zinc-400">
                                    No processed documents available.
                                    Upload and process a document first.
                                </p>
                            ) : (
                                readyDocuments.map((document) => (
                                    <label
                                        key={document.id}
                                        className={`
                                            mb-2 flex cursor-pointer
                                            items-center gap-3 rounded-lg
                                            border p-3 transition-colors
                                            ${
                                                selectedDocumentId === document.id
                                                    ? "border-blue-500 bg-blue-500/10"
                                                    : "border-zinc-700 hover:bg-zinc-800"
                                            }
                                        `}
                                    >
                                        <input
                                            type="radio"
                                            name="selectedDocument"
                                            value={document.id}
                                            checked={
                                                selectedDocumentId === document.id
                                            }
                                            onChange={() =>
                                                setSelectedDocumentId(document.id)
                                            }
                                        />

                                        <span className="text-sm text-zinc-200">
                                            {document.fileName}
                                        </span>
                                    </label>
                                ))
                            )}
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <Button
                                label="Cancel"
                                isDisabled={creatingThread}
                                onUserClick={handleClose}
                            />

                            <Button
                                label={
                                    creatingThread
                                        ? "Creating..."
                                        : "Start Conversation"
                                }
                                isDisabled={
                                    !selectedDocumentId || creatingThread
                                }
                                onUserClick={handleStartConversation}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}