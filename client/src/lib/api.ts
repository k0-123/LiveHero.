const API_URL = import.meta.env.VITE_API_URL || '/api';

const fetcher = async (url: string, options: RequestInit & { timeout?: number } = {}) => {
  const token = localStorage.getItem('token');
  const headers: any = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Timeout logic - defaults to 60s for Render spin-up, but can be overridden
  const timeoutMs = options.timeout || 60000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    console.log(`[API Request] ${options.method || 'GET'} ${API_URL}${url} (timeout: ${timeoutMs}ms)`);
    const response = await fetch(`${API_URL}${url}`, { 
      ...options, 
      headers,
      signal: controller.signal 
    });
    clearTimeout(timeoutId);
    
    // Check if response is actually JSON before parsing
    const contentType = response.headers.get('content-type');
    let data: any = {};
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('Non-JSON response for URL:', url, 'Response text:', text);
      throw new Error(`Server returned non-JSON error: ${response.status} ${response.statusText}`);
    }

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }

    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error(`Request timed out after ${timeoutMs/1000}s:`, url);
      throw new Error('API Request timed out. Please check if the server is awake.');
    }
    console.error('Fetch Error:', error.message);
    throw error;
  }
};

// Auth
export const registerUser = (name: string, email: string, password: string, referralCode?: string) => 
  fetcher('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, referralCode }),
  });

export const loginUser = (email: string, password: string) => 
  fetcher('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

export const getMe = () => fetcher('/auth/me');

// Components
export const getComponents = () => fetcher('/components');

export const getComponent = (id: string) => fetcher(`/components/${id}`);

export const unlockComponent = (id: string) => fetcher(`/components/${id}/unlock`, { method: 'POST' });

export const createComponent = (formData: FormData) => 
  fetcher('/components', {
    method: 'POST',
    body: formData, // FormData handles its own multipart headers
    timeout: 300000, // 5 min for video upload
  });

export const deleteComponent = (id: string) =>
  fetcher(`/components/${id}`, {
    method: 'DELETE',
  });

// Admin & My Feed
export const getMyComponents = () => fetcher('/components/feed/my');
export const getPendingComponents = () => fetcher('/components/feed/pending');

export const approveComponent = (id: string, status: 'approved' | 'rejected') =>
  fetcher(`/components/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

// Payments & Subscriptions
export const createCheckout = (plan: string) => 
  fetcher('/payments/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan }),
  });

export const verifyPayment = (paymentData: any) =>
  fetcher('/payments/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData),
  });

// Affiliates
export const getAffiliateStats = () => fetcher('/affiliates/stats');

// Local Storage Helpers
export const saveToken = (token: string) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');
export const isLoggedIn = () => !!localStorage.getItem('token');
