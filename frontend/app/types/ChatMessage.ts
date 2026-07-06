export enum Sender {
    ai = "AI",
    user = "USER"
}
export const ChatMessage = {

    sender : Sender, 
    message: String,
    timestamp:Date,
    id:String
}