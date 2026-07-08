import Header from "../components/common/Header";
import { fetchUserDocuments } from "../services/api";
import ChatWrapper from "../components/chat/ChatWrapper";

export default async function Chat() {
  const res =  await fetchUserDocuments();
  const fetchedDocs = res.data.documents.map(d => d)
  console.log(fetchedDocs)
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <Header></Header>
      <ChatWrapper documents={fetchedDocs}></ChatWrapper>
    </div>
  );
}
