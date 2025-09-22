import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { LoaderCircle, Send } from 'lucide-react';
import { InquiryMessage } from '@shared/schema';
import { subscribeToInquiryMessages, sendInquiryMessage, startChatSession } from '@/services/premiumSupport';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from './ui/avatar';

interface ChatInterfaceProps {
  initialInquiryId: string | null;
  onChatStarted?: (newInquiryId: string) => void;
}

export function ChatInterface({ initialInquiryId, onChatStarted }: ChatInterfaceProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<InquiryMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentInquiryId, setCurrentInquiryId] = useState<string | null>(initialInquiryId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // When the component receives a new ID, update the state
    setCurrentInquiryId(initialInquiryId);
  }, [initialInquiryId]);

  useEffect(() => {
    if (currentInquiryId) {
      setLoading(true);
      const unsubscribe = subscribeToInquiryMessages(currentInquiryId, (msgs) => {
        setMessages(msgs);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
      setMessages([]);
    }
  }, [currentInquiryId]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    setSending(true);

    try {
      if (currentInquiryId) {
        await sendInquiryMessage({
          inquiryId: currentInquiryId,
          text: newMessage.trim(),
          sender: 'user',
          senderId: user.uid,
        });
      } else {
        const newId = await startChatSession({
          userId: user.uid,
          name: user.fullName || 'User',
          email: user.email,
          firstMessage: newMessage.trim(),
        });
        setCurrentInquiryId(newId);
        if (onChatStarted) {
          onChatStarted(newId);
        }
      }
      setNewMessage('');
    } catch (error) {
      toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
     
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full"><LoaderCircle className="w-6 h-6 animate-spin text-violet" /></div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-center text-gray-500">
            <p>No messages yet.<br />Send a message to start the conversation.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'admin' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-700 text-white text-xs">AD</AvatarFallback>
                </Avatar>
              )}
              <div className={`rounded-lg px-3 py-2 max-w-[80%] ${msg.sender === 'user' ? 'bg-violet text-white' : 'bg-gray-200 text-gray-800'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                <p className={`text-xs mt-1 text-right ${msg.sender === 'user' ? 'text-violet-200' : 'text-gray-500'}`}>
                  {msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
     
      <form onSubmit={handleSend} className="flex gap-2 w-full border-t p-4 bg-white">
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="resize-none flex-1 border-gray-300 rounded-lg focus:ring-violet focus:border-violet"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
          disabled={sending}
        />
        <Button type="submit" size="icon" className="flex-shrink-0 bg-violet hover:bg-violet/90" disabled={sending || !newMessage.trim()}>
          {sending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}