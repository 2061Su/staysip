import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      if (formData.role === 'reception') {
        setMessage('Registration successful! Please wait for Admin approval.');
      } else {
        setMessage('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-xl">
        <h2 className="text-2xl font-bold text-center mb-6">Create StaySip Account</h2>
        {message && <div className="p-3 mb-4 text-center bg-blue-100 text-blue-700 rounded">{message}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full p-2 border rounded" 
            onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          
          <input type="email" placeholder="Email" className="w-full p-2 border rounded" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          
          <input type="password" placeholder="Password" className="w-full p-2 border rounded" 
            onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          
          <select className="w-full p-2 border rounded" value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}>
            <option value="user">Guest (User)</option>
            <option value="reception">Receptionist</option>
          </select>

          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;