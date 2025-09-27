"use client";

import { useState } from 'react';
import Chatbot from './Chatbot';

export default function ChatbotTest() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Chatbot Test</h1>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Toggle Chatbot
      </button>
      <p className="mt-4">Chatbot is {isOpen ? 'open' : 'closed'}</p>
      
      <Chatbot isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
    </div>
  );
}
