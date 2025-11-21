import React, { useEffect, useState, useRef } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MessageBubble } from './components/MessageBubble';
import { Composer } from './components/Composer';
import { SetupModal } from './components/SetupModal';
import { Message } from './types';

// ------------------------------------------------------------------
// Supabase Configuration
// ------------------------------------------------------------------
const SUPABASE_URL = 'https://fzjkpppzwiuozvszbbdl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ClRXbub_U_y3zA3E9oFdUg_vyzDiPtN';
// ------------------------------------------------------------------

function App() {
  // --- State ---
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [username, setUsername] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isDark, setIsDark] = useState<boolean>(false);
  
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [isSetupOpen, setIsSetupOpen] = useState(true);

  // Ref for scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Ref to track previous message count to prevent scrolling on edits/reactions
  const prevMessagesLengthRef = useRef<number>(0);

  // --- Initialization ---
  useEffect(() => {
    // Load theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    // Initialize Supabase
    try {
      const client = createClient(SUPABASE_URL, SUPABASE_KEY);
      setSupabase(client);
    } catch (error) {
      console.error("Failed to initialize Supabase:", error);
    }

    // Load credentials if available
    const storedUser = localStorage.getItem('chat_username');

    if (storedUser) {
      handleSetup(storedUser);
    }
  }, []);

  const scrollToBottom = () => {
    // Small timeout allows the DOM to update and the new message to "pop in" 
    // before we calculate the scroll position.
    setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    // Only scroll if the number of messages has increased (new message)
    // This prevents scrolling when a user just edits a message or adds a reaction
    if (messages.length > prevMessagesLengthRef.current) {
        scrollToBottom();
    }
    // Update ref to current length
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  // --- Supabase Setup & Realtime ---
  const handleSetup = (user: string) => {
    setUsername(user);
    localStorage.setItem('chat_username', user);
    setIsSetupOpen(false);
  };

  // Fetch Initial Data & Subscribe
  useEffect(() => {
    if (!supabase) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data) {
        // Ensure reactions format
        const formatted = data.map((msg: any) => ({
            ...msg,
            reactions: msg.reactions || { up: 0, down: 0 }
        }));
        setMessages(formatted);
      }
    };

    fetchMessages();

    // Realtime Subscription
    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
             const newMsg = payload.new as Message;
             // Default reactions if null
             if (!newMsg.reactions) newMsg.reactions = { up: 0, down: 0 };
             setMessages((prev) => [...prev, newMsg]);
          } else if (payload.eventType === 'UPDATE') {
             setMessages((prev) =>
                prev.map((msg) => (msg.id === payload.new.id ? (payload.new as Message) : msg))
             );
          } else if (payload.eventType === 'DELETE') {
             setMessages((prev) => prev.filter((msg) => msg.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // --- Actions ---
  const toggleTheme = () => {
    const newVal = !isDark;
    setIsDark(newVal);
    localStorage.setItem('theme', newVal ? 'dark' : 'light');
    if (newVal) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSend = async (text: string) => {
    if (!supabase) return;

    if (editingMessage) {
      // Update existing
      await supabase
        .from('messages')
        .update({ text })
        .eq('id', editingMessage.id);
      setEditingMessage(null);
    } else {
      // Insert new
      const payload: Partial<Message> = {
        username,
        text,
        created_at: new Date().toISOString(),
        reactions: { up: 0, down: 0 },
        reply_to: replyingTo ? {
            id: replyingTo.id,
            username: replyingTo.username,
            text: replyingTo.text
        } : null
      };

      await supabase.from('messages').insert([payload]);
      setReplyingTo(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    if (confirm('Are you sure you want to delete this message?')) {
      await supabase.from('messages').delete().eq('id', id);
    }
  };

  const handleReaction = async (msg: Message, type: 'up' | 'down') => {
    if (!supabase) return;

    const currentReactions = msg.reactions || { up: 0, down: 0 };
    const newReactions = { ...currentReactions };
    newReactions[type] = (newReactions[type] || 0) + 1;

    await supabase
        .from('messages')
        .update({ reactions: newReactions })
        .eq('id', msg.id);
  };

  // --- Render ---
  return (
    <div className="min-h-screen flex flex-col max-w-3xl mx-auto relative">
      <Header isDark={isDark} toggleTheme={toggleTheme} />

      <main className="flex-1 flex flex-col px-2 sm:px-4 pt-6 overflow-hidden">
        {!supabase ? (
           <div className="flex-1 flex items-center justify-center p-6 text-center">
             <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-6 rounded-xl border border-red-200 dark:border-red-800 max-w-md">
               <h3 className="text-lg font-bold mb-2">Initialization Error</h3>
               <p className="text-sm">
                 Unable to connect to the chat server.
               </p>
             </div>
           </div>
        ) : (
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-4 px-2">
                {messages.length === 0 && !isSetupOpen && (
                    <div className="text-center text-gray-400 mt-20">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                )}
                
                {messages.map((msg) => (
                    <MessageBubble
                        key={msg.id}
                        message={msg}
                        isOwnMessage={msg.username === username}
                        onReply={setReplyingTo}
                        onEdit={setEditingMessage}
                        onDelete={handleDelete}
                        onReact={handleReaction}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>
        )}
      </main>

      {/* Only show composer if connected */}
      {(!isSetupOpen && supabase) && (
        <Composer 
            onSend={handleSend} 
            replyingTo={replyingTo}
            editingMessage={editingMessage}
            onCancelReply={() => setReplyingTo(null)}
            onCancelEdit={() => setEditingMessage(null)}
        />
      )}
      
      <Footer />

      {isSetupOpen && (
        <SetupModal
            onSubmit={handleSetup}
            savedUsername={localStorage.getItem('chat_username') || ''}
        />
      )}
    </div>
  );
}

export default App;