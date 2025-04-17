"use client";

import { useState } from 'react';
import axios from 'axios';

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId] = useState('session_' + Math.random().toString(36).substr(2, 9));
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', { message: input, sessionId });
      const botMessage = { text: response.data.response, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { text: 'Error: Could not get response', sender: 'bot' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg flex flex-col h-[500px]">
      <div className="bg-blue-500 text-white p-4 rounded-t-lg">
        <h1 className="text-lg font-semibold">AI Hỗ trợ ghi nhớ</h1>
      </div>
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2 bg-white">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg max-w-xs text-black ${
              msg.sender === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && <div className="text-gray-500 italic">Typing...</div>}
      </div>
      <div className="p-4 border-t flex gap-2 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400 bg-white"
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
}