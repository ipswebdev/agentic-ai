"use client";

import { useEffect, useRef, useState } from "react";
import ChatWindow from "./ChatWindow";
import DocumentSidebar from "./DocumentSidebar";
import SelectedDocument from "./SelectedDocument";

import {
    askQuestion,
    createConversationThread,
    fetchConversationThreads,
    fetchConversationThreadMessages,
    fetchUserDocuments,
    processDocument,
    uploadDocument,
} from "@/app/services/api";

import Toast from "../common/Toast";
import { useRouter } from "next/navigation";

import { UserDocument } from "@/app/types/UserDocument";
import { Message, Sender } from "@/app/types/ChatMessage";
import { ConversationThread } from "@/app/types/ConversationThread";

export default function ChatWrapper() {
    const router = useRouter();

    const [sidebarModeTrigger, setSidebarModeTrigger] = useState(0);

    const [selectedDoc, setSelectedDoc] =
        useState<UserDocument | null>(null);

    const [selectedThread, setSelectedThread] =
        useState<ConversationThread | null>(null);

    const [documents, setDocuments] = useState<UserDocument[]>([]);
    const [threads, setThreads] = useState<ConversationThread[]>([]);
    const [messageList, setMessageList] = useState<Message[]>([]);

    const [uploadInProgress, setUploadState] = useState(false);
    const [loading, setLoader] = useState(false);
    const [creatingThread, setCreatingThread] = useState(false);

    const [showToastNotification, setToastNotification] = useState(false);
    const [toastLabel, setToastLabel] = useState("");
    const [toastStatus, setToastStatus] = useState("INFO");

    // Keeps track of the active thread without waiting for a React render.
    const selectedThreadIdRef = useRef<string | null>(null);

    // Prevents stale message-fetch responses from replacing newer selections.
    const messageRequestId = useRef(0);

    // --------------------------------------------------
    // Toast handling
    // --------------------------------------------------

    const showToast = (message: string, status: string) => {
        setToastLabel(message);
        setToastStatus(status);
        setToastNotification(true);
    };

    const toggleToast = () => {
        setToastNotification(false);
    };

    // --------------------------------------------------
    // Fetch documents and threads
    // --------------------------------------------------

    const getDocuments = async (): Promise<UserDocument[]> => {
        const res = await fetchUserDocuments();

        const fetchedDocuments = res?.data?.documents ?? [];

        setDocuments(fetchedDocuments);

        return fetchedDocuments;
    };

    const getThreads = async (): Promise<ConversationThread[]> => {
        const res = await fetchConversationThreads();

        const fetchedThreads = res?.data?.threads ?? [];

        setThreads(fetchedThreads);

        return fetchedThreads;
    };

    // --------------------------------------------------
    // Fetch messages for a selected thread
    // --------------------------------------------------

    const getThreadMessages = async (threadId: string) => {
        const requestId = ++messageRequestId.current;

        setLoader(true);
        setMessageList([]);

        try {
            const result =
                await fetchConversationThreadMessages(threadId);

            // Ignore a response if another thread has since been selected.
            if (
                requestId !== messageRequestId.current ||
                selectedThreadIdRef.current !== threadId
            ) {
                return;
            }

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                    "Unable to fetch conversation messages"
                );
            }

            const fetchedMessages = result.data?.messages ?? [];

            const formattedMessages: Message[] =
                fetchedMessages.map((message) => ({
                    id: message.id,
                    sender: message.role,
                    text: message.content,
                    timestamp: message.createdAt,
                    evidence: message.evidence ?? [],
                }));

            setMessageList(formattedMessages);

        } catch (error) {
            if (
                requestId !== messageRequestId.current ||
                selectedThreadIdRef.current !== threadId
            ) {
                return;
            }

            console.error("Message fetching failed:", error);

            showToast(
                error instanceof Error
                    ? error.message
                    : "Unable to load conversation",
                "ERROR"
            );

        } finally {
            if (requestId === messageRequestId.current) {
                setLoader(false);
            }
        }
    };

    // --------------------------------------------------
    // Initial loading
    // --------------------------------------------------

    useEffect(() => {
        const initialize = async () => {
            try {
                await Promise.all([
                    getDocuments(),
                    getThreads(),
                ]);
            } catch (error) {
                console.error("Initial data loading failed:", error);

                showToast(
                    "Unable to load documents and conversations",
                    "ERROR"
                );
            }
        };

        initialize();
    }, []);

    // --------------------------------------------------
    // Document selection
    // --------------------------------------------------

    const onDocSelect = (document: UserDocument) => {
        setToastNotification(false);

        // Selecting a document is not the same as selecting a conversation.
        // Clear the active conversation so messages cannot go to an old thread.
        selectedThreadIdRef.current = null;
        messageRequestId.current++;

        setSelectedThread(null);
        setSelectedDoc(document);
        setMessageList([]);
        setLoader(false);
    };

    // --------------------------------------------------
    // Thread selection
    // --------------------------------------------------

    const onThreadSelect = (thread: ConversationThread) => {
        setToastNotification(false);

        selectedThreadIdRef.current = thread.id;

        setSelectedThread(thread);

        // Resolve the document associated with this thread.
        const associatedDocument = documents.find(
            (document) => document.id === thread.document.id
        );

        setSelectedDoc(associatedDocument ?? null);

        getThreadMessages(thread.id);
    };

    // --------------------------------------------------
    // Create a new conversation
    // --------------------------------------------------

    const handleCreateThread = async (
        document: UserDocument
    ): Promise<boolean> => {
        if (creatingThread) return false;

        setCreatingThread(true);
        setToastNotification(false);

        try {
            const result = await createConversationThread(document.id);

            if (!result?.success || !result.data?.id) {
                throw new Error(
                    result?.message || "Unable to create conversation"
                );
            }

            // Fetch the updated list to obtain the complete thread DTO.
            const updatedThreads = await getThreads();

            const newThread = updatedThreads.find(
                (thread) => thread.id === result.data!.id
            );

            if (!newThread) {
                throw new Error(
                    "Conversation created, but could not be loaded"
                );
            }

            // Invalidate any outstanding message-fetch request.
            messageRequestId.current++;

            selectedThreadIdRef.current = newThread.id;

            setSelectedThread(newThread);
            setSelectedDoc(document);
            setMessageList([]);
            setLoader(false);

            // Return the sidebar to conversation mode.
            setSidebarModeTrigger((previous) => previous + 1);

            return true;

        } catch (error) {
            console.error("Thread creation failed:", error);

            showToast(
                error instanceof Error
                    ? error.message
                    : "Unable to create conversation",
                "ERROR"
            );

            return false;

        } finally {
            setCreatingThread(false);
        }
    };

    // --------------------------------------------------
    // Document processing
    // --------------------------------------------------

    const onProcessDocument = async (id: string): Promise<void> => {
        try {
            const result = await processDocument(id);

            if (
                result?.success &&
                result.data?.documentId === id
            ) {
                showToast(
                    "Document processing started successfully",
                    "WARN"
                );

                await getDocuments();

            } else {
                showToast(
                    "Error processing the document. Please try again later.",
                    "ERROR"
                );
            }

        } catch (error) {
            console.error("Document processing failed:", error);

            showToast(
                "Unable to process the document",
                "ERROR"
            );
        }
    };

    // --------------------------------------------------
    // Document upload
    // --------------------------------------------------

    const onUploadDocument = async (file: File): Promise<void> => {
        setUploadState(true);

        try {
            const result = await uploadDocument(file);

            if (!result?.success || !result.data?.documentId) {
                throw new Error(
                    result?.message || "Unable to upload document"
                );
            }

            showToast(
                "Document uploaded successfully. Processing it now.",
                "WARN"
            );

            await getDocuments();

            await onProcessDocument(result.data.documentId);

        } catch (error) {
            console.error("Document upload failed:", error);

            showToast(
                error instanceof Error
                    ? error.message
                    : "Unable to upload document",
                "ERROR"
            );

            router.refresh();

        } finally {
            setUploadState(false);
        }
    };

    // --------------------------------------------------
    // Send a message
    // --------------------------------------------------

    const onMessageSent = async (message: string): Promise<void> => {
        setToastNotification(false);

        const trimmedMessage = message.trim();

        if (!trimmedMessage) return;

        const threadId = selectedThreadIdRef.current;

        if (!threadId) {
            showToast(
                "Please select a conversation first.",
                "WARN"
            );
            return;
        }

        if (loading) return;

        const userMessage: Message = {
            id: `temp-${Date.now()}`,
            text: trimmedMessage,
            sender: Sender.USER,
            timestamp: new Date().toISOString(),
            evidence: [],
        };

        setMessageList((previous) => [
            ...previous,
            userMessage,
        ]);

        await getAnswer(trimmedMessage, threadId);
    };

    // --------------------------------------------------
    // Generate answer
    // --------------------------------------------------

    const getAnswer = async (
        message: string,
        threadId: string
    ): Promise<void> => {
        setLoader(true);

        try {
            const result = await askQuestion(message, threadId);

            // The user might have switched threads while the request
            // was being processed.
            if (selectedThreadIdRef.current !== threadId) {
                return;
            }

            if (!result?.success || !result.data?.answer) {
                throw new Error(
                    result?.message || "Unable to generate an answer"
                );
            }

            const storedMessage = result.data.message;

            const assistantMessage: Message = {
                id: storedMessage.id,
                text: storedMessage.content,
                sender: storedMessage.role,
                timestamp: storedMessage.createdAt,
                evidence: storedMessage.evidence ?? [],
            };

            setMessageList((previous) => [
                ...previous,
                assistantMessage,
            ]);

        } catch (error) {
            if (selectedThreadIdRef.current !== threadId) {
                return;
            }

            console.error("Answer generation failed:", error);

            showToast(
                error instanceof Error
                    ? error.message
                    : "Unable to generate an answer",
                "ERROR"
            );

        } finally {
            // Only clear the loading state if the same thread is active.
            if (selectedThreadIdRef.current === threadId) {
                setLoader(false);
            }
        }
    };

    // --------------------------------------------------
    // Render
    // --------------------------------------------------

    return (
        <div className="flex h-[calc(100vh-64px)] flex-col">

            {showToastNotification && (
                <Toast
                    message={toastLabel}
                    status={toastStatus}
                    onClose={toggleToast}
                />
            )}

            <SelectedDocument selectedDoc={selectedDoc} />

            <div className="flex flex-1 overflow-hidden">

                <DocumentSidebar
                    resetToThreads={sidebarModeTrigger}
                    documents={documents}
                    threads={threads}
                    selectedThreadId={selectedThread?.id ?? ""}
                    uploadInProgress={uploadInProgress}
                    creatingThread={creatingThread}
                    onDocSelect={onDocSelect}
                    onThreadSelect={onThreadSelect}
                    onUploadDocument={onUploadDocument}
                    onCreateThread={handleCreateThread}
                />

                <ChatWindow
                    selectedThread={selectedThread?.document.fileName}
                    loading={loading}
                    messages={messageList}
                    onMessageSend={onMessageSent}
                />

            </div>
        </div>
    );
}