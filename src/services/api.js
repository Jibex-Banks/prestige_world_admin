// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async get(endpoint) {
    const token = localStorage.getItem('adminToken');
    return this.request(endpoint, { method: 'GET',
      headers: {'Authorization': `Bearer ${token}`}
    });
  }

  async post(endpoint, data, isLogin = false) {
    const token = localStorage.getItem('adminToken');
    if (isLogin){
      return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    }
    else {
      return this.request(endpoint, {
        method: 'POST',
        headers: {'Authorization': `Bearer ${token}`,'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });
    }
  }

  async put(endpoint, data) {
    const token = localStorage.getItem('adminToken');
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {'Authorization': `Bearer ${token}`,'Content-Type': 'application/json'},
    });
  }

  async delete(endpoint) {
    const token = localStorage.getItem('adminToken');
    return this.request(endpoint, { method: 'DELETE',
      headers: {'Authorization': `Bearer ${token}`,'Content-Type': 'application/json'},
    });
  }

  async uploadFile(endpoint, file) {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('adminToken');

    return this.request(endpoint, {
      method: 'POST',
      headers: {'Authorization': `Bearer ${token}`}, // Let browser set Content-Type for multipart/form-da,'Content-Type': 'application/json'ta
      body: formData,
    });
  }
}

export default new ApiService();