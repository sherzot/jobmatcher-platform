import { ChatLayout } from '@/components/chat/ChatLayout';
import { getConversationsForRole } from '@/lib/mock/chat';

// Current user is candidate Alisher (u1)
const CURRENT_USER_ID = 'u1';

export default function CandidateMessagesPage() {
  const conversations = getConversationsForRole('CANDIDATE', CURRENT_USER_ID);

  return (
    <div className="flex h-full flex-col">
      <ChatLayout
        conversations={conversations}
        currentUserId={CURRENT_USER_ID}
        currentUserRole="CANDIDATE"
      />
    </div>
  );
}
