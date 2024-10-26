import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://ideanest-backend.vercel.app/api';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/auth/signin`, {
        email,
        password,
      });

      setAuthToken(response.data.access_token); // Store the token
      setEmail('');
      setPassword('');
      console.log('Signed in successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign In</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleSignIn}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 mt-4 font-semibold text-white rounded-md ${
              loading ? 'bg-gray-500' : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <p className="mt-4 text-sm text-center text-gray-600">
            Don't have an account? <span className="text-indigo-600 cursor-pointer">Sign Up</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default App;
