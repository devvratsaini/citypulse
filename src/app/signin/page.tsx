'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import the router for redirection
import { FaUserCircle, FaEnvelope, FaLock } from 'react-icons/fa';

// --- Reusable Form Input Component (No changes needed here) ---
const FormInput = ({ id, type, placeholder, icon: Icon, value, onChange }: { id: string, type: string, placeholder: string, icon: React.ElementType, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
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
      value={value}
      onChange={onChange}
    />
  </div>
);

// --- Main Login/Signup Page Component ---
export default function SigninPage() {
  const [activeTab, setActiveTab] = useState('signin');
  const router = useRouter(); // Initialize the router

  // --- State for both forms ---
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // --- Universal input handler ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Sign-Up Form Submission Handler ---
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      // Call your registration API endpoint
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If the server returns an error (e.g., 409 Conflict for existing email)
        throw new Error(data.message || 'Something went wrong');
      }

      // On success
      setSuccess('Registration successful! Please sign in.');
      // Automatically switch to the sign-in tab
      setActiveTab('signin'); 
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

const handleSignInSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);
  setSuccess(null);
  
  try {
    // Call your new login API endpoint
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // If the server returns an error (400, 401, 500)
      throw new Error(data.message || 'Login failed');
    }

    // On successful login:
    setSuccess('Login successful! Redirecting...');
    
    // Redirect to the dashboard after a short delay
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);

  } catch (err: any) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Tab Switcher */}
        <div className="flex">
          {/* ... (Tab buttons remain the same) ... */}
          <button onClick={() => setActiveTab('signin')} className={`w-1/2 py-4 font-semibold transition-colors ${activeTab === 'signin' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>Sign In</button>
          <button onClick={() => setActiveTab('signup')} className={`w-1/2 py-4 font-semibold transition-colors ${activeTab === 'signup' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>Sign Up</button>
        </div>
        
        {/* Form Container */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
            {activeTab === 'signin' ? 'Welcome Back!' : 'Create Your Account'}
          </h2>

          {/* --- Success/Error Message Display --- */}
          {error && <p className="mb-4 text-center text-red-500 bg-red-100 p-2 rounded-lg">{error}</p>}
          {success && <p className="mb-4 text-center text-green-500 bg-green-100 p-2 rounded-lg">{success}</p>}

          {/* --- Render the correct form based on the active tab --- */}
          {activeTab === 'signin' ? (
            <form onSubmit={handleSignInSubmit} className="space-y-6">
              <FormInput id="email" type="email" placeholder="Email address" icon={FaEnvelope} value={formData.email} onChange={handleInputChange} />
              <FormInput id="password" type="password" placeholder="Password" icon={FaLock} value={formData.password} onChange={handleInputChange} />
              <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400">
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUpSubmit} className="space-y-6">
              <FormInput id="fullName" type="text" placeholder="Full Name" icon={FaUserCircle} value={formData.fullName} onChange={handleInputChange} />
              <FormInput id="email" type="email" placeholder="Email address" icon={FaEnvelope} value={formData.email} onChange={handleInputChange} />
              <FormInput id="password" type="password" placeholder="Create Password" icon={FaLock} value={formData.password} onChange={handleInputChange} />
              <FormInput id="confirmPassword" type="password" placeholder="Confirm Password" icon={FaLock} value={formData.confirmPassword} onChange={handleInputChange} />
              <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}