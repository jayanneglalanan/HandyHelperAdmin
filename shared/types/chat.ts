export type ConversationStatus = 'normal' | 'flagged' | 'reported' | 'archived';

export interface Conversation {
  id: string;
  participant1Id: string;
  participant1Name: string;
  participant2Id: string;
  participant2Name: string;
  jobId: string;
  jobTitle: string;
  lastMessage: string;
  lastMessageDate: string;
  messageCount: number;
  status: ConversationStatus;
  flaggedReason?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  flagged: boolean;
  flagReason?: string;
}
