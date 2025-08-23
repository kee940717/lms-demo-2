'use client';

// This file is a React component for a user signup page.
// It's designed to be used with a framework like Next.js, though it can be
// adapted for any React application.
// The styling is handled with Tailwind CSS.

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

// For icons
import { User, Lock, UserPlus } from 'lucide-react'; 
import { ShowToast } from '@/components/loading_notification/ShowToast';

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle the form submission.
  const handleSignup = async (e : any) => {
    e.preventDefault();
    ShowToast('info', "Comming Soon")
    setIsLoading(true);
    setMessage('');

    // Basic validation to check if passwords match
    if (password !== confirmPassword) {
      setMessage('Error: Passwords do not match.');
      setIsLoading(false);
      return;
    }

    // Simulate an API call for user signup
    try {
      // In a real application, you would make an API call here, e.g.:
      // const response = await fetch('/api/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, password }),
      // });
      
      // For this example, we'll just log the details and show a success message.
      console.log('Attempting to sign up with:', { username, password });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate a successful signup response
      setMessage('Please kindly contact sysyem administrator for account registartion');
      // setMessage('Signup successful! Redirecting to login...');
      
      // Clear the form fields after successful submission
      setUsername('');
      setPassword('');
      setConfirmPassword('');

      // Redirect to the login page after a short delay
      setTimeout(() => {
        // router.push('/login'); // Uncomment for Next.js routing
        console.log("Redirecting to login page...");
      }, 1500);

    } catch (error) {
      // Handle errors from the API call
      console.error('Signup failed:', error);
      setMessage('An error occurred during signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-inter">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Create Your Radiology LMS Account
        </h2>
        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">
              <User className="inline-block mr-2 h-5 w-5 text-gray-500" />
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
              <Lock className="inline-block mr-2 h-5 w-5 text-gray-500" />
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">
              <Lock className="inline-block mr-2 h-5 w-5 text-gray-500" />
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 transform hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <UserPlus className="inline-block mr-2 h-5 w-5" />
            )}
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        {message && (
          <div
            className={`mt-6 p-3 rounded-lg text-center ${
              message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
