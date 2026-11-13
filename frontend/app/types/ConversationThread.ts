export interface ConversationThread  {
    id: string,
    document:{
        fileName: string,
        id:string
    },
    title: string,
    createdAt:string,
    updatedAt:string
}

export interface FetchConversationThreadResponse {
  success: boolean;
  data: {
    threads: ConversationThread[];
  } | null;
  message?: string;
}

export interface CreateConversationThreadResponse {
  success: boolean;
  data: ConversationThread | null;
  message?: string;
}

export interface DeleteConversationThreadResponse {
  success: boolean;
  data: {
    id: string;
    title: string;
  } | null;
  message?: string;
}