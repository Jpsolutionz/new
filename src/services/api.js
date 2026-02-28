// API Configuration and Service
// TESTING LOCALLY - Using local backend server
// For production, change back to: 'https://13.60.249.27.nip.io/api/v1'
const API_BASE_URL = 'http://192.168.1.100:8000/api/v1'; // Local server - CHANGE THIS IP!

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }

  clearToken() {
    this.token = null;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      headers,
    };

    console.log('=== API REQUEST ===');
    console.log('URL:', url);
    console.log('Method:', config.method || 'GET');
    console.log('Has Token:', !!this.token);

    try {
      const response = await fetch(url, config);
      
      console.log('Response Status:', response.status);
      console.log('Response OK:', response.ok);
      
      const data = await response.json();

      if (!response.ok) {
        console.error('API Error Response:', data);
        throw new Error(data.detail || `API request failed with status ${response.status}`);
      }

      console.log('API Success');
      return data;
    } catch (error) {
      console.error('=== API REQUEST FAILED ===');
      console.error('Error:', error);
      
      // Check if it's a network error
      if (error.message === 'Network request failed' || error.message.includes('fetch')) {
        throw new Error('Network request failed - Cannot connect to server. Please check:\n1. Backend server is running\n2. You are on the same WiFi\n3. Server URL is correct');
      }
      
      throw error;
    }
  }

  // Auth endpoints
  async register(name, emailOrMobile, password, role = 'user', nickname = '') {
    // If it's a mobile number (only digits), convert to email format
    let email = emailOrMobile;
    if (/^\d+$/.test(emailOrMobile)) {
      // Mobile number - convert to email format
      email = `${emailOrMobile}@mobile.user`;
    }
    
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, nickname, role }),
    });
  }

  async login(emailOrMobile, password) {
    // If it's a mobile number (only digits), convert to email format
    let email = emailOrMobile;
    if (/^\d+$/.test(emailOrMobile)) {
      // Mobile number - convert to email format
      email = `${emailOrMobile}@mobile.user`;
    }
    
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Signup OTP endpoints (Email-based)
  async sendSignupOTP(email) {
    return this.request('/auth/send-signup-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifySignupOTP(email, otp) {
    return this.request('/auth/verify-signup-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  // Password Reset endpoints (Mobile-based)
  async sendOTP(mobile) {
    return this.request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile }),
    });
  }

  async verifyOTP(mobile, otp) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile, otp }),
    });
  }

  async resetPassword(mobile, otp, new_password) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ mobile, otp, new_password }),
    });
  }

  async changePassword(mobile, current_password, new_password) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ mobile, current_password, new_password }),
    });
  }

  async verifyMobileExists(mobile) {
    return this.request('/auth/verify-mobile', {
      method: 'POST',
      body: JSON.stringify({ mobile }),
    });
  }

  async resetPasswordSimple(mobile, new_password) {
    return this.request('/auth/reset-password-simple', {
      method: 'POST',
      body: JSON.stringify({ mobile, new_password }),
    });
  }

  async verifyNickname(mobile, nickname) {
    return this.request('/auth/verify-nickname', {
      method: 'POST',
      body: JSON.stringify({ mobile, nickname }),
    });
  }

  // Ledger endpoints
  async createLedger(type, amount, description) {
    return this.request('/ledger', {
      method: 'POST',
      body: JSON.stringify({ type, amount, description }),
    });
  }

  async getMyLedgers() {
    return this.request('/ledger/me', {
      method: 'GET',
    });
  }

  async getAllLedgers() {
    return this.request('/ledger/all', {
      method: 'GET',
    });
  }

  async deleteLedger(ledgerId) {
    console.log('API: Deleting ledger with ID:', ledgerId);
    return this.request(`/ledger/${ledgerId}`, {
      method: 'DELETE',
    });
  }

  // Transaction endpoints
  async createTransaction(ledgerId, type, amount, description) {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify({ ledger_id: ledgerId, type, amount, description }),
    });
  }

  async getLedgerTransactions(ledgerId) {
    return this.request(`/transactions/${ledgerId}`, {
      method: 'GET',
    });
  }

  async deleteTransaction(transactionId) {
    console.log('API: Deleting transaction with ID:', transactionId);
    // Transactions are stored as ledger entries, so use the same endpoint
    return this.request(`/ledger/${transactionId}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();
