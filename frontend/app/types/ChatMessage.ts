export enum Sender {
    ai = "AI",
    user = "USER"
}
export interface Message{
    sender : Sender, 
    text: string,
    timestamp:string,
    id:string
}