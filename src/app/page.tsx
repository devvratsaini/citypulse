"use client";

import Link from "next/link";
import { VscRocket } from "react-icons/vsc"; // Using a simple icon
import { useState } from "react";
import Chatbot from '@/components/Chatbot';

export default function LandingPage() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  
  console.log('Landing page chatbot state:', isChatbotOpen);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      {/* Main Content Container */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="mb-4">
          <span className="inline-block p-4 bg-blue-500/20 rounded-full">
            <VscRocket className="text-4xl text-blue-400" />
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
            CityPulse
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="mt-4 text-lg md:text-xl text-gray-300">
          AI-powered emergency response optimization. We predict traffic to find
          the fastest, life-saving routes for ambulances in real-time.
        </p>

        {/* Call to Action Button */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-blue-700"
          >
            Launch Live Dashboard
          </Link>
          <Link
            href="/signin"
            className="w-full sm:w-auto inline-block px-8 py-4 bg-gray-700 text-white font-bold rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-gray-600"
          >
            Sign In / Register
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-gray-500 text-sm">
        A 4-Hour Hackathon Project.
      </footer>

      {/* Chatbot */}
      <Chatbot 
        isOpen={isChatbotOpen} 
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)} 
      />
    </main>
  );
}

// You might need to install react-icons for the rocket icon:
// npm install react-icons
