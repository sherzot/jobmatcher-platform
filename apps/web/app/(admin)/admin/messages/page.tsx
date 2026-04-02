import { ChatLayout } from '@/components/chat/ChatLayout';
import { getConversationsForRole } from '@/lib/mock/chat';

// Current user is admin (adm1)
const CURRENT_USER_ID = 'adm1';

export default function AdminMessagesPage() {
  const conversations = getConversationsForRole('ADMIN', CURRENT_USER_ID);

  return (
    <div className="flex h-full flex-col">
      <ChatLayout
        conversations={conversations}
        currentUserId={CURRENT_USER_ID}
        currentUserRole="ADMIN"
      />
    </div>
  );
}
