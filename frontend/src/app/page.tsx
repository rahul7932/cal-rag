import React from 'react';
import { ChatMessageList } from '@/components/ui/chat/chat-message-list';
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble';

export default function Page() {
  return (
    <div className="container mx-auto h-screen">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      <ChatMessageList>
        <ChatBubble variant='sent'>
          <ChatBubbleAvatar fallback='US' />
          <ChatBubbleMessage variant='sent'>
            Hello, how has your day been? I hope you are doing well.
          </ChatBubbleMessage>
        </ChatBubble>

        <ChatBubble variant='received'>
          <ChatBubbleAvatar fallback='AI' />
          <ChatBubbleMessage variant='received'>
            Hi, I am doing well, thank you for asking. How can I help you today?
          </ChatBubbleMessage>
        </ChatBubble>

        <ChatBubble variant='received'>
          <ChatBubbleAvatar fallback='AI' />
          <ChatBubbleMessage isLoading />
        </ChatBubble>
      </ChatMessageList>
    </div>
  );
}