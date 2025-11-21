import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquareQuote } from 'lucide-react';
import { Message } from '../types';
import { cn } from '../utils';

interface ComposerProps {
  onSend: (text: string) => void;
  replyingTo: Message | null;
  editingMessage: Message | null;
  onCancelReply: () => void;
  onCancelEdit: () => void;
}

export const Composer: React.FC<ComposerProps> = ({
  onSend,
  replyingTo,
  editingMessage,
  onCancelReply,
  onCancelEdit,
}) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Effect to populate text when editing
  useEffect(() => {
    if (editingMessage) {
      setText(editingMessage.text);
      textareaRef.current?.focus();
    }
  }, [editingMessage]);

  // Effect to focus when replying
  useEffect(() => {
    if (replyingTo) {
      textareaRef.current?.focus();
    }
  }, [replyingTo]);

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isModeActive = replyingTo || editingMessage;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 sticky bottom-0 rounded-b-2xl mx-2 mb-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">
      {/* Context Bar (Reply/Edit) */}
      {isModeActive && (
        <div className="flex items-center justify-between mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-l-4 border-brand-500 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <div className="flex items-center gap-3 overflow-hidden">
            <MessageSquareQuote className="w-5 h-5 text-brand-500 flex-shrink-0" />
            <div className="flex flex-col text-sm">
              <span className="font-bold text-gray-700 dark:text-gray-200">
                {editingMessage ? 'Editing message' : `Replying to ${replyingTo?.username}`}
              </span>
              <span className="text-gray-500 dark:text-gray-400 truncate max-w-[200px] md:max-w-md">
                {editingMessage ? editingMessage.text : replyingTo?.text}
              </span>
            </div>
          </div>
          <button
            onClick={editingMessage ? onCancelEdit : onCancelReply}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={editingMessage ? "Update your message..." : "Type a message..."}
          className="w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none min-h-[50px] max-h-[120px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
          rows={1}
          style={{ height: 'auto' }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="p-3 rounded-full bg-brand-600 text-white shadow-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0 hover:scale-105 active:scale-95"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
