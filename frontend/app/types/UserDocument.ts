import { Evidence, ConversationMessage } from "./ChatMessage";

export enum DocumentStatus{
    UPLOADED='UPLOADED',
    FAILED='FAILED',
    PROCESSING='PROCESSING',
    READY='READY'
}

export interface UserDocument  {
    id: string,
    fileName:string,
    filePath: string,
    status: DocumentStatus,
    createdAt:string,
    updatedAt:string
}

export interface FetchDocumentsResponse {
    success: boolean;
    data:{
        documents: UserDocument[]
    }|null

}

export interface RetrievalMatch {
  text: string;
  chunkId: string;
  score: number;
}

export interface AnswerResponse {
  success: boolean;
  message: string;
  data: {
    answer: string;
    matches: RetrievalMatch[];
    message: ConversationMessage;
  } | null;
}