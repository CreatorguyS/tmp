import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const googleIcon = (
    <svg
      className="w-5 h-5 mr-2"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M44.5 20H24v8.5h11.841c-1.211 5.378-4.887 8.588-10.841 8.588-6.52 0-11.821-5.301-11.821-11.821s5.301-11.821 11.821-11.821c3.344 0 5.962 1.346 8.167 3.522l6.75-6.75C36.657 5.286 31.842 3 24 3c-11.045 0-20 8.955-20 20s8.955 20 20 20c11.045 0 19.83-8.892 20-20h-4.5z"
        fill="#4285F4"
      />
      <path
        d="M6.027 23.999c0-3.649 1.547-6.908 4.026-9.288L6.027 8.001C2.399 12.569 0.179 17.915 0.179 23.999s2.22 11.43 5.848 15.998l4.026-6.71c-2.479-2.38-4.026-5.639-4.026-9.288z"
        fill="#FBBC05"
      />
      <path
        d="M24 8.243c3.67 0 6.868 1.42 9.389 3.667L40.15 5.16C36.216 1.933 30.638 0 24 0 14.881 0 6.946 5.514 3.42 13.064l4.026 6.711c3.08-4.995 8.441-8.532 16.554-8.532z"
        fill="#EA4335"
      />
      <path
        d="M24.001 44c6.703 0 12.336-3.415 15.82-8.354l-4.026-6.711c-2.907 4.544-7.859 7.69-11.794 7.69-8.406 0-14.947-7.44-14.947-15.001s6.541-15.001 14.947-15.001z"
        fill="#34A853"
      />
    </svg>
  );

  const appleIcon = (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 16 16" fill="currentColor">
      <path d="M11.173 11.082c-0.274 0.64-0.901 0.697-1.488 0.358-0.587-0.34-0.898-0.957-0.624-1.597 0.274-0.64 0.901-0.697 1.488-0.358 0.587 0.34 0.898 0.957 0.624 1.597zM8.016 15.063c0.613 0 1.258-0.41 1.765-0.917 0.508-0.508 0.812-1.156 0.812-1.895s-0.304-1.387-0.812-1.895c-0.507-0.508-1.152-0.917-1.765-0.917-0.613 0-1.258 0.41-1.765 0.917-0.508 0.508-0.812 1.156-0.812 1.895s0.304 1.387 0.812 1.895c0.507 0.508 1.152 0.917 1.765 0.917zM8.016 15.063c0.613 0 1.258-0.41 1.765-0.917 0.508-0.508 0.812-1.156 0.812-1.895s-0.304-1.387-0.812-1.895c-0.507-0.508-1.152-0.917-1.765-0.917-0.613 0-1.258 0.41-1.765 0.917-0.508 0.508-0.812 1.156-0.812 1.895s0.304 1.387 0.812 1.895c0.507 0.508 1.152 0.917 1.765 0.917zM8.016 15.063c0.613 0 1.258-0.41 1.765-0.917 0.508-0.508 0.812-1.156 0.812-1.895s-0.304-1.387-0.812-1.895c-0.507-0.508-1.152-0.917-1.765-0.917-0.613 0-1.258 0.41-1.765 0.917-0.508 0.508-0.812 1.156-0.812 1.895s0.304 1.387 0.812 1.895c0.507 0.508 1.152 0.917 1.765 0.917zM8.016 15.063c0.613 0 1.258-0.41 1.765-0.917 0.508-0.508 0.812-1.156 0.812-1.895s-0.304-1.387-0.812-1.895c-0.507-0.508-1.152-0.917-1.765-0.917-0.613 0-1.258 0.41-1.765 0.917-0.508 0.508-0.812 1.156-0.812 1.895s0.304 1.387 0.812 1.895c0.507 0.508 1.152 0.917 1.765 0.917zM8.016 15.063c0.613 0 1.258-0.41 1.765-0.917 0.508-0.508 0.812-1.156 0.812-1.895s-0.304-1.387-0.812-1.895c-0.507-0.508-1.152-0.917-1.765-0.917-0.613 0-1.258 0.41-1.765 0.917-0.508 0.508-0.812 1.156-0.812 1.895s0.304 1.387 0.812 1.895c0.507 0.508 1.152 0.917 1.765 0.917z" />
    </svg>
  );

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Login successful! Welcome back.');
        // Redirect to dashboard or home page
        window.location.href = '/';
      } else {
        alert(`Login failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <>
      {/* Sign In Form */}
      <form onSubmit={handleSignInSubmit} className="space-y-6">
        <div>
          <label
            className="block text-sm font-medium text-gray-300 mb-1"
            htmlFor="signInEmail"
          >
            Email Address
          </label>
          <input
            type="email"
            id="signInEmail"
            placeholder="Your email address"
            className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-300 mb-1"
            htmlFor="signInPassword"
          >
            Password
          </label>
          <input
            type="password"
            id="signInPassword"
            placeholder="Your password"
            className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg"
        >
          Log In
        </button>
      </form>

      {/* Demo Credentials */}
      <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-300 mb-2">Demo Credentials:</h4>
        <div className="text-sm text-blue-200 space-y-1">
          <div>Email: <span className="font-mono text-blue-100">demo@healthspectrum.com</span></div>
          <div>Password: <span className="font-mono text-blue-100">demo123</span></div>
        </div>
        <button 
          type="button"
          onClick={() => {
            setEmail('demo@healthspectrum.com');
            setPassword('demo123');
          }}
          className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
        >
          Click to fill demo credentials
        </button>
      </div>

      {/* Footer with a toggle link to sign up */}
      <div className="mt-6 text-center text-gray-400">
        Don't have an account?{" "}
        <Link
          to="/auth/sign-up"
          className="text-indigo-500 hover:text-indigo-400 font-semibold transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </>
  );
};

export default SignIn;
