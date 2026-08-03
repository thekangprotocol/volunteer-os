import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Avatar, Button, Badge } from '../common/UIComponents';
import { Send, MessageSquare, Hash, User, ShieldCheck, CheckCheck } from 'lucide-react';

export const MessagesView: React.FC = () => {
  const { chatThreads, activeThreadId, setActiveThreadId, sendMessage, userProfile } = useApp();
  const [inputText, setInputText] = useState('');

  const activeThread = chatThreads.find((t) => t.id === activeThreadId) || chatThreads[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(activeThread.id, inputText);
    setInputText('');
  };

  return (
    <div className="h-[75vh] flex flex-col md:flex-row gap-4 overflow-hidden">
      {/* Left Sidebar: Threads List */}
      <div className="w-full md:w-80 rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="font-extrabold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-500" />
            <span>Messages & Channels</span>
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar">
          {chatThreads.map((thread) => {
            const isActive = thread.id === activeThread.id;
            return (
              <div
                key={thread.id}
                onClick={() => setActiveThreadId(thread.id)}
                className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 border ${
                  isActive
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border-transparent shadow-sm'
                    : 'bg-zinc-50/50 dark:bg-zinc-800/40 border-zinc-200/60 dark:border-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <div className="relative shrink-0 mt-0.5">
                  {thread.type === 'channel' ? (
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                      isActive ? 'bg-white/20 text-white dark:bg-zinc-900 dark:text-white' : 'bg-purple-500/10 text-purple-500'
                    }`}>
                      <Hash className="w-4 h-4" />
                    </div>
                  ) : (
                    <Avatar name={thread.title} src={thread.avatar} size="sm" />
                  )}
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs truncate">{thread.title}</span>
                    <span className={`text-[10px] ${isActive ? 'opacity-70' : 'text-zinc-400'}`}>{thread.lastMessageTime}</span>
                  </div>
                  <p className={`text-[11px] truncate mt-0.5 ${isActive ? 'opacity-80' : 'text-zinc-500 dark:text-zinc-400'}`}>
                    {thread.lastMessage}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Pane: Message Thread */}
      <div className="flex-1 rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden shadow-sm">
        {/* Thread Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            {activeThread.type === 'channel' ? (
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                <Hash className="w-5 h-5" />
              </div>
            ) : (
              <Avatar name={activeThread.title} src={activeThread.avatar} size="md" />
            )}
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white leading-tight">{activeThread.title}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{activeThread.subtitle}</p>
            </div>
          </div>
          <Badge variant="info">Encrypted Channel</Badge>
        </div>

        {/* Messages Scroll Box */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar">
          {activeThread.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[10px] text-zinc-400">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">{msg.senderName}</span>
                <span>• {msg.timestamp}</span>
              </div>
              <div
                className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  msg.isMe
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-medium rounded-tr-none'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none border border-zinc-200 dark:border-zinc-700'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2 bg-zinc-50/50 dark:bg-zinc-900/40">
          <input
            type="text"
            placeholder={`Message ${activeThread.title}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          />
          <Button type="submit" variant="primary" size="md" icon={<Send className="w-4 h-4" />}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};
