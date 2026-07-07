export enum Sender {
    AI = "AI",
    USER = "USER"
}
export interface Message{
    sender : Sender, 
    text: string,
    timestamp :string,
    id :string
}