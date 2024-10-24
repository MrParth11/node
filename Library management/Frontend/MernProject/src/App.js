import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import authService from './services/authService';

function App() {
  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await authService.getUser(token);
          // Redirect based on user role
          if (user.role === 'admin') {
            window.location.href = '/admin';
          } else if (user.role === 'student') {
            window.location.href = '/student';
          } else if (user.role === 'teacher') {
            window.location.href = '/teacher';
          }
        } catch (error) {
          console.error('Error checking authentication:', error);
          localStorage.removeItem('token');
        }
      }
    };

    checkAuthentication();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;