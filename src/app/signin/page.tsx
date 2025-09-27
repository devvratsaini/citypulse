"use client"; // This component requires client-side interactivity (state)

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.message || 'Sign in failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
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
        disabled={isLoading}
        className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
};

// The Sign-Up Form Component
const SignUpForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.target as HTMLFormElement);
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Auto sign in after successful registration
        const signInResponse = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const signInData = await signInResponse.json();
        if (signInResponse.ok) {
          localStorage.setItem('token', signInData.token);
          localStorage.setItem('user', JSON.stringify(signInData.user));
          router.push('/dashboard');
        }
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
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
        disabled={isLoading}
        className="w-full py-3 px-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
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