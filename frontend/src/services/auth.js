import api from './api';

export const authService = {
  setToken(token) {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  },

  async register(name, email, password) {
    try {
      console.log('🔄 Registering user:', email);
      const response = await api.post('/auth/register', {
        name,
        email,
        password
      });
      console.log('✅ Registration successful');
      return response.data;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    }
  },

 async login(email, password) {
  try {
    console.log('🔄 Logging in user:', email);
    const response = await api.post('http://localhost:5000/api/auth/login', {
      email,
      password
    });
    console.log('✅ Login API call successful');
    return response.data;
  } catch (error) {
    console.error('❌ Login API call failed:', error);
    throw error;
  }
},

  async getMe() {
    try {
      const response = await api.get('/auth/me');
      return response.data.user;
    } catch (error) {
      console.error('❌ Get user info failed:', error);
      throw error;
    }
  },

  logout() {
    this.setToken(null);
  }
};