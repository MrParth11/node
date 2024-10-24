import React, { useState } from 'react';
import axios from 'axios';
import authService from '../services/authService';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', { username, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      authService.setUser(response.data.user);
      // Redirect based on user role
      if (response.data.user.role === 'admin') {
        window.location.href = '/admin';
      } else if (response.data.user.role === 'student') {
        window.location.href = '/student';
      } else if (response.data.user.role === 'teacher') {
        window.location.href = '/teacher';
      }
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default Login;