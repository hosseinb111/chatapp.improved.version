import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, ThumbsDown, Reply, Trash2, Edit2 } from 'lucide-react';
import { Message } from '../types';
import { getAvatarColor, getInitials, cn } from '../utils';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  onReply: (msg: Message) => void;
  onEdit: (msg: Message) => void;
  onDelete: (id: string) => void;
  onReact: (msg: Message, type: 'up' | 'down') => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  onReply,
  onEdit,
  onDelete,
  onReact,
}) => {
  const dateLabel = message.created_at
    ? formatDistanceToNow(new Date(message.created_at), { addSuffix: true })
    : 'Just now';

  return (
    <div
      className={cn(
        'flex gap-3 mb-6 animate-pop-in group',
        isOwnMessage ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-sm',
          getAvatarColor(message.username)
        )}
      >
        {getInitials(message.username)}
      </div>

      <div
        className={cn(
          'max-w-[80%] md:max-w-[60%] flex flex-col',
          isOwnMessage ? 'items-end' : 'items-start'
        )}
      >
        {/* Name & Time */}
        <div className="flex items-baseline gap-2 mb-1 px-1">
          <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
            {message.username}
          </span>
          <span className="text-[10px] text-gray-400">{dateLabel}</span>
        </div>

        {/* Message Content Wrapper */}
        <div
          className={cn(
            'relative p-4 rounded-2xl shadow-md text-sm md:text-base break-words whitespace-pre-wrap w-full',
            isOwnMessage
              ? 'bg-brand-600 text-white rounded-tr-none'
              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none'
          )}
        >
          {/* Reply Preview */}
          {message.reply_to && (
            <div
              className={cn(
                'mb-2 p-2 rounded-lg text-xs border-l-4 bg-opacity-20',
                isOwnMessage
                  ? 'bg-black bg-opacity-10 border-white'
                  : 'bg-gray-100 dark:bg-gray-700 border-brand-500'
              )}
            >
              <span className="font-bold block mb-0.5 opacity-80">
                {message.reply_to.username}
              </span>
              <span className="opacity-70 line-clamp-1">
                {message.reply_to.text}
              </span>
            </div>
          )}

          {message.text}

          {/* Reactions Display */}
          {(message.reactions.up > 0 || message.reactions.down > 0) && (
            <div className="absolute -bottom-3 right-2 flex gap-1">
              {message.reactions.up > 0 && (
                <div className="bg-white dark:bg-gray-700 shadow-sm rounded-full px-1.5 py-0.5 text-[10px] flex items-center gap-0.5 text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-gray-600">
                  👍 {message.reactions.up}
                </div>
              )}
              {message.reactions.down > 0 && (
                <div className="bg-white dark:bg-gray-700 shadow-sm rounded-full px-1.5 py-0.5 text-[10px] flex items-center gap-0.5 text-red-600 dark:text-red-400 border border-gray-200 dark:border-gray-600">
                  👎 {message.reactions.down}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div
          className={cn(
            'flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-1',
            isOwnMessage ? 'flex-row-reverse' : 'flex-row'
          )}
        >
          <button
            onClick={() => onReact(message, 'up')}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-blue-500 transition-colors"
            title="Like"
          >
            <ThumbsUp className="w-3 h-3" />
          </button>
          <button
            onClick={() => onReact(message, 'down')}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-red-500 transition-colors"
            title="Dislike"
          >
            <ThumbsDown className="w-3 h-3" />
          </button>
          <button
            onClick={() => onReply(message)}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-brand-500 transition-colors"
            title="Reply"
          >
            <Reply className="w-3 h-3" />
          </button>
          
          {isOwnMessage && (
            <>
              <button
                onClick={() => onEdit(message)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-orange-500 transition-colors"
                title="Edit"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={() => onDelete(message.id)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-red-600 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};