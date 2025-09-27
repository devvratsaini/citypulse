"use client";

import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaTimes, FaMinus } from 'react-icons/fa';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Chatbot({ isOpen, onToggle }: ChatbotProps) {
  console.log('Chatbot component rendered, isOpen:', isOpen);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m the CityPulse AI Assistant. I can help you with emergency response information, route optimization, and system status. How can I assist you today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Emergency response queries
    if (input.includes('emergency') || input.includes('ambulance') || input.includes('hospital')) {
      return 'For emergency situations, I can help you find the nearest hospital and calculate the fastest route. The system currently shows 3 active emergency vehicles and 12 hospitals in the area. Would you like me to show you the nearest available hospital?';
    }
    
    // Route optimization queries
    if (input.includes('route') || input.includes('traffic') || input.includes('optimization')) {
      return 'Our AI-powered routing system uses real-time traffic data to find the fastest routes for emergency vehicles. The system can dynamically re-route based on traffic conditions. Currently, we have 3 active routes being optimized in real-time.';
    }
    
    // System status queries
    if (input.includes('status') || input.includes('system') || input.includes('health')) {
      return 'System Status: ✅ All systems operational\n• 3 active emergency routes\n• 8 vehicles deployed\n• 12 hospitals monitored\n• Average response time: 4.2 minutes\n• AI traffic simulation: Active';
    }
    
    // Help queries
    if (input.includes('help') || input.includes('what can you do')) {
      return 'I can help you with:\n• Emergency response information\n• Route optimization and traffic analysis\n• Hospital capacity and availability\n• System status and metrics\n• AI traffic simulation details\n• General questions about CityPulse\n\nWhat would you like to know?';
    }
    
    // Default responses
    const responses = [
      'I understand you\'re asking about CityPulse. Could you be more specific about what you\'d like to know?',
      'That\'s an interesting question! I can help you with emergency response, routing, or system information.',
      'I\'m here to help with CityPulse-related queries. Feel free to ask about emergency services, routing, or system status.',
      'Let me help you with that. Are you looking for information about emergency response, traffic optimization, or system status?'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-[9999]">
        <button
          onClick={onToggle}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 border-2 border-white"
          aria-label="Open chatbot"
        >
          <FaRobot className="text-2xl" />
        </button>
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
          AI
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 z-[9999] flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FaRobot className="text-xl" />
          <div>
            <h3 className="font-semibold">CityPulse AI Assistant</h3>
            <p className="text-xs text-blue-100">Emergency Response Support</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {/* Minimize functionality */}}
            className="text-blue-200 hover:text-white transition-colors"
            aria-label="Minimize"
          >
            <FaMinus />
          </button>
          <button
            onClick={onToggle}
            className="text-blue-200 hover:text-white transition-colors"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about emergency response, routing, or system status..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
          >
            <FaPaperPlane />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
