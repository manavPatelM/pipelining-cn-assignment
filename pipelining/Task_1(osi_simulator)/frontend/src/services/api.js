import { API_URL } from '../config/constants';

class ApiService {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getLayers() {
    return this.request('/dataflow/layers');
  }

  async transmitMessage(message) {
    return this.request('/dataflow/transmit', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async getLayerDetails(layerId) {
    return this.request(`/dataflow/packet/${layerId}`);
  }
}

export const apiService = new ApiService(API_URL);
