import Header from "../components/common/Header";
import ChatWrapper from "../components/chat/ChatWrapper";
import ProtectedRoute from "../components/common/ProtectedRoute";

export default async function Chat() {
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <Header></Header>
      <ChatWrapper></ChatWrapper>
    </div>
    </ProtectedRoute>
  );
}
