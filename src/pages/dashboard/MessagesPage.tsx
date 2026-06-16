import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  MessageSquare, Send, User, Phone, Mail,
  Clock, CheckCircle2, Paperclip, Smile
} from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string | null;
  subject: string | null;
  body: string | null;
  direction: string;
  comm_type: string;
  created_at: string;
  read_at: string | null;
}

export default function MessagesPage() {
  const { user, clientData, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (clientData?.id) {
      loadMessages();
    }
  }, [clientData]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      const { data } = await supabase
        .from('communications')
        .select('*')
        .eq('client_id', clientData?.id)
        .eq('comm_type', 'message')
        .order('created_at', { ascending: true });

      setMessages(data || []);
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !clientData?.id || !user) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('communications')
        .insert({
          client_id: clientData.id,
          sender_id: user.id,
          comm_type: 'message',
          direction: 'outbound',
          subject: 'New message from client',
          body: newMessage.trim(),
        });

      if (!error) {
        setNewMessage('');
        loadMessages();
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Messages</h1>
          <p className="mt-1 text-secondary-600">
            Communicate with your assigned attorney
          </p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="card bg-primary-50 border-primary-200">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
            <User className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-primary-900">Your Attorney</p>
            <p className="text-sm text-primary-700">Available Mon-Fri, 9am-5pm EST</p>
          </div>
          <div className="ml-auto flex gap-2">
            <button className="btn btn-secondary btn-sm">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </button>
            <button className="btn btn-secondary btn-sm">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="card p-0 overflow-hidden">
        <div className="flex flex-col h-[500px]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-secondary-300 mx-auto" />
                <p className="mt-4 text-secondary-600">No messages yet</p>
                <p className="text-sm text-secondary-500">Start the conversation below</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-3 ${
                      msg.direction === 'outbound'
                        ? 'bg-primary-600 text-white'
                        : 'bg-secondary-100 text-secondary-900'
                    }`}
                  >
                    <p className="text-sm">{msg.body}</p>
                    <div className={`flex items-center gap-2 mt-2 text-xs ${
                      msg.direction === 'outbound' ? 'text-primary-200' : 'text-secondary-500'
                    }`}>
                      <Clock className="h-3 w-3" />
                      {new Date(msg.created_at).toLocaleString()}
                      {msg.direction === 'outbound' && msg.read_at && (
                        <CheckCircle2 className="h-3 w-3" title="Read" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-secondary-200 p-4">
            <div className="flex items-end gap-4">
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full resize-none rounded-lg border border-secondary-300 p-3 pr-24 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                  <button className="p-1 text-secondary-400 hover:text-secondary-600">
                    <Paperclip className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <button
                onClick={handleSend}
                disabled={!newMessage.trim() || sending}
                className="btn btn-primary h-12"
              >
                {sending ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="text-center text-sm text-secondary-500">
        <p>Messages are encrypted and protected by attorney-client privilege.</p>
      </div>
    </div>
  );
}
