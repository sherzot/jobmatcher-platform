import { ChatLayout } from '@/components/chat/ChatLayout';
import { getConversationsForRole } from '@/lib/mock/chat';

// Current agent is Tanaka (ag1)
const CURRENT_USER_ID = 'ag1';

export default function AgentMessagesPage() {
  const conversations = getConversationsForRole('AGENT', CURRENT_USER_ID);

  return (
    <div className="flex h-full flex-col">
      <ChatLayout
        conversations={conversations}
        currentUserId={CURRENT_USER_ID}
        currentUserRole="AGENT"
      />
    </div>
  );
}
