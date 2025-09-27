"use client"; // This component requires client-side interactivity (state)

import { useState } from "react";
import { FaUserCircle, FaEnvelope, FaLock } from "react-icons/fa"; // Using icons for flair

// A helper component for a styled form input
const FormInput = ({
  id,
  type,
  placeholder,
  icon: Icon,
}: {
  id: string;
  type: string;
  placeholder: string;
  icon: React.ElementType;
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon className="text-gray-400" />
    </div>
    <input
      id={id}
      name={id}
      type={type}
      required
      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      placeholder={placeholder}
    />
  </div>
);

// The Sign-In Form Component
const SignInForm = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle form submission here
    console.log("Signing in...");
    alert("Frontend-only: Sign-in form submitted!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        id="email"
        type="email"
        placeholder="Email address"
        icon={FaEnvelope}
      />
      <FormInput
        id="password"
        type="password"
        placeholder="Password"
        icon={FaLock}
      />
      <div className="flex items-center justify-between">
        <a href="#" className="text-sm text-blue-600 hover:underline">
          Forgot password?
        </a>
      </div>
      <button
        type="submit"
        className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
      >
        Sign In
      </button>
    </form>
  );
};

// The Sign-Up Form Component
const SignUpForm = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle form submission here
    console.log("Signing up...");
    alert("Frontend-only: Sign-up form submitted!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        id="fullName"
        type="text"
        placeholder="Full Name"
        icon={FaUserCircle}
      />
      <FormInput
        id="email"
        type="email"
        placeholder="Email address"
        icon={FaEnvelope}
      />
      <FormInput
        id="password"
        type="password"
        placeholder="Create Password"
        icon={FaLock}
      />
      <FormInput
        id="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        icon={FaLock}
      />
      <button
        type="submit"
        className="w-full py-3 px-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
      >
        Create Account
      </button>
    </form>
  );
};

// The main component that renders the tabbed interface
export default function SigninPage() {
  const [activeTab, setActiveTab] = useState("signin");

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Tab Switcher */}
        <div className="flex">
          <button
            onClick={() => setActiveTab("signin")}
            className={`w-1/2 py-4 font-semibold transition-colors ${
              activeTab === "signin"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`w-1/2 py-4 font-semibold transition-colors ${
              activeTab === "signup"
                ? "bg-green-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Container */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
            {activeTab === "signin" ? "Welcome Back!" : "Create Your Account"}
          </h2>
          {activeTab === "signin" ? <SignInForm /> : <SignUpForm />}
        </div>
      </div>
    </main>
  );
}

// Don't forget to install react-icons if you haven't!
// npm install react-icons
