import React, { useState } from 'react';
import { MessageCircle, User } from 'lucide-react';

interface SetupModalProps {
  onSubmit: (username: string) => void;
  savedUsername?: string;
}

export const SetupModal: React.FC<SetupModalProps> = ({
  onSubmit,
  savedUsername = '',
}) => {
  const [username, setUsername] = useState(savedUsername);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          Welcome
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          Enter your username to join the chat.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                placeholder="Enter your name"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-brand-700 transition-transform hover:scale-[1.02] active:scale-[0.98] mt-6 shadow-lg"
          >
            Start Chatting
          </button>
        </form>
      </div>
    </div>
  );
};