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
    }

}

export interface AnswerResponse {
    data:{
        answer: string;
    };
    message:string;
    success:boolean;
}