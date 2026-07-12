"use client";

import { useRef, useState } from "react";
import Button from "../common/Button";

interface UploadFormProps{
    onUploadDocument:(file:File)=>void,
    uploadInProgres:boolean
}

export default function UploadForm({ onUploadDocument,uploadInProgres }:UploadFormProps) {
    const [showUploadDialog, setUploadDialog] = useState(false);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const onDocUpload = () => {
        setUploadDialog((prev) => !prev);
    };

    const onFileUpload = () => {
        const file = inputRef.current?.files?.[0];

        if (!file) {
            return;
        }

        onUploadDocument(file);
        setUploadDialog(false);
    };

    return (
        <div>
            <div
                className="
                    border-b
                    border-zinc-800
                    p-4
                "
            >
                <div className="mb-3">
                    <p className="mt-1 text-xs text-zinc-400">
                        Upload a PDF to chat with it.
                    </p>
                </div>

                <Button
                    isDisabled={uploadInProgres}
                    label="📄 Upload Document"
                    onUserClick={onDocUpload}
                />
            </div>

            {showUploadDialog && (
                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        bg-black/60
                        backdrop-blur-sm
                    "
                >
                    <div
                        className="
                            w-[450px]
                            rounded-xl
                            border
                            border-zinc-700
                            bg-zinc-900
                            p-6
                            shadow-2xl
                        "
                    >
                        <h2 className="text-lg font-semibold text-white">
                            Upload Document
                        </h2>

                        <p className="mt-2 text-sm text-zinc-400">
                            Upload a PDF to chat with its contents.
                        </p>

                        <input
                            ref={inputRef}
                            type="file"
                            accept=".pdf"
                            className="
                                mt-6
                                block
                                w-full
                                rounded-lg
                                border
                                border-zinc-700
                                bg-zinc-800
                                p-2
                                text-sm
                                text-zinc-300
                                file:mr-4
                                file:rounded-md
                                file:border-0
                                file:bg-blue-600
                                file:px-4
                                file:py-2
                                file:text-white
                                hover:file:bg-blue-700
                            "
                        />

                        <div className="mt-6 flex justify-end gap-3">
                            <Button
                                label="Close"
                                onUserClick={onDocUpload}
                            />

                            <Button
                                label="Upload"
                                onUserClick={onFileUpload}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}