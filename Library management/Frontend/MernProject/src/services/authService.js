import axios from 'axios';

const authService = {
  async login(username, password) {
    const response = await axios.post('/login', { username, password });
    return response.data;
  },

  async getUser(token) {
    const response = await axios.get('/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUserFromStorage() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService;