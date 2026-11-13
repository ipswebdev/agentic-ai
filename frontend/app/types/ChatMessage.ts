export enum Sender {
  AI = "assistant",
  USER = "user"
}

export interface Evidence {
  chunkId: string;
  score: number;
}

// Shape returned by the backend
export interface ConversationMessage {
  id: string;
  role: Sender;
  content: string;
  evidence: Evidence[];
  createdAt: string;
}

// Shape used by the existing chat UI
export interface Message {
  id: string;
  sender: Sender;
  text: string;
  timestamp: string;
  evidence: Evidence[];
}

export interface MessageResponse {
  success: boolean;
  data: {
    messages: ConversationMessage[];
  } | null;
  message?: string;
}