import axios from 'axios';

const API_BASE_URL = 'https://designcraft-tqm7.onrender.com';
 // Change to deployed URL in production
axios.defaults.withCredentials = true;

// ==================== Services ====================
export const fetchServices = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/services`);
    return res.data;
  } catch (err) {
    console.error('Error fetching services:', err);
    return [];
  }
};

export const addService = async (data) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/services`, data);
    return res.data;
  } catch (err) {
    console.error('Error adding service:', err);
    throw err;
  }
};

export const deleteService = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/services/${id}`);
  } catch (err) {
    console.error('Error deleting service:', err);
    throw err;
  }
};

export const updateService = async (id, data) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/api/services/${id}`, data);
    return res.data;
  } catch (err) {
    console.error('Error updating service:', err);
    throw err;
  }
};

// ==================== Portfolio ====================
export const fetchPortfolio = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/portfolio`);
    return res.data;
  } catch (err) {
    console.error('Error fetching portfolio:', err);
    return [];
  }
};

export const createPortfolio = async (formData) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/portfolio`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (err) {
    console.error('Error creating portfolio item:', err);
    throw err;
  }
};

export const deletePortfolio = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/portfolio/${id}`);
  } catch (err) {
    console.error('Error deleting portfolio item:', err);
    throw err;
  }
};

export const updatePortfolio = async (id, data) => {
  try {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    if (data.image) {
      formData.append('image', data.image);
    }
    const res = await axios.put(`${API_BASE_URL}/api/portfolio/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (err) {
    console.error('Error updating portfolio:', err);
    throw err;
  }
};

// ==================== Auth ====================
export const register = async (userData) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/auth/register`, userData);
    return res.data;
  } catch (err) {
    console.error('Error registering:', err);
    throw err;
  }
};

export const login = async (userData) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/auth/login`, userData);
    return res.data;
  } catch (err) {
    console.error('Error logging in:', err);
    throw err;
  }
};

// ==================== Orders ====================
export const placeOrder = async (orderData) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/orders`, orderData);
    return res.data;
  } catch (err) {
    console.error('Error placing order:', err);
    throw err;
  }
};

export const fetchClientOrders = async (email) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/orders/client/${email}`);
    return res.data;
  } catch (err) {
    console.error('Error fetching client orders:', err);
    return [];
  }
};

export const fetchOrderById = async (orderId) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/orders/${orderId}`);
    return res.data;
  } catch (err) {
    console.error('Error fetching order:', err);
    throw err;
  }
};

export const getOrders = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/orders`);
    return res.data;
  } catch (err) {
    console.error('Error fetching orders:', err);
    return [];
  }
};

export const deleteOrder = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/orders/${id}`);
  } catch (err) {
    console.error('Error deleting order:', err);
    throw err;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    await axios.put(`${API_BASE_URL}/api/orders/${id}/status`, { status });
  } catch (err) {
    console.error('Error updating order status:', err);
    throw err;
  }
};

// ==================== Dashboard Analytics ====================
export const fetchOrderSummary = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/orders/summary`);
    return res.data;
  } catch (err) {
    console.error('Error fetching order summary:', err);
    return {
      totalOrders: 0,
      completedOrders: 0,
      pendingOrders: 0,
      totalFeedback: 0,
    };
  }
};

// ==================== AI Mockup ====================
export const generateAIMockup = async (prompt) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/ai/generate`, { prompt });
    return res.data;
  } catch (err) {
    console.error('AI image generation error:', err);
    throw err;
  }
};

export const generateWithReplicate = async (prompt) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/ai/replicate`, { prompt });
    return res.data;
  } catch (err) {
    console.error('Replicate image generation error:', err);
    throw err;
  }
};

export const generateImage = async (prompt) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/ai/generate`, { prompt });
    return res.data.imageUrl;
  } catch (err) {
    console.error('Image generation failed:', err);
    return null;
  }
};

// ==================== Coupons ====================
export const fetchCoupons = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/coupons`);
    return res.data;
  } catch (err) {
    console.error('Error fetching coupons:', err);
    return [];
  }
};

export const applyCoupon = async (code) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/coupons/apply`, { code });
    return res.data;
  } catch (err) {
    console.error('Error applying coupon:', err.response?.data?.message || err.message);
    throw err;
  }
};

// ==================== Newsletter ====================
export const subscribeToNewsletter = async ({ email }) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/newsletter`, { email });
    return res.data;
  } catch (err) {
    console.error('Newsletter subscription failed:', err);
    throw err;
  }
};

export const getSubscribers = async (params = {}) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/newsletter`, { params });
    return res.data;
  } catch (err) {
    console.error('Error fetching subscribers:', err);
    throw err;
  }
};

export const exportSubscribersToCSV = async (params = {}) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/newsletter/export`, {
      params,
      responseType: 'blob',
    });
    return res.data;
  } catch (err) {
    console.error('CSV export failed:', err);
    throw err;
  }
};

export const deleteSubscriber = async (id) => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/api/newsletter/${id}`);
    return res.data;
  } catch (err) {
    console.error('Delete subscriber failed:', err);
    throw err;
  }
};

export const fetchSubscriberAnalytics = async (range = 'daily') => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/newsletter/analytics?range=${range}`);
    return res.data;
  } catch (err) {
    console.error('Newsletter analytics failed:', err);
    return {};
  }
};

export const sendCampaignEmail = async (subject, content) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/newsletter/campaign`, { subject, content });
    return res.data;
  } catch (err) {
    console.error('Campaign send failed:', err);
    throw err;
  }
};

export const getAIGeneratedNewsletter = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/newsletter/ai-suggestion`);
    return res.data;
  } catch (err) {
    console.error('AI newsletter suggestion failed:', err);
    return '';
  }
};

// ==================== Banners ====================
export const uploadBanner = async (formData) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/banners/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (err) {
    console.error('Banner upload failed:', err);
    throw err;
  }
};

export const fetchBanners = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/banners`);
    return res.data;
  } catch (err) {
    console.error('Error fetching banners:', err);
    return [];
  }
};

export const deleteBanner = async (id) => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/api/banners/${id}`);
    return res.data;
  } catch (err) {
    console.error('Banner deletion failed:', err);
    throw err;
  }
};

// ==================== Feedback ====================

// 🔵 Submit Order Feedback
export const submitFeedback = async (orderId, { feedback, voiceNote }) => {
  try {
    const formData = new FormData();
    formData.append('orderId', orderId);
    formData.append('feedback', feedback);
    if (voiceNote) formData.append('voiceNote', voiceNote);

    const res = await axios.post(`${API_BASE_URL}/api/feedback`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (err) {
    console.error('Feedback submission failed:', err);
    throw err;
  }
};

// ==================== SketchMind Feedback ====================
export const submitSketchMindFeedback = async ({ feedback, voiceNote }) => {
  try {
    const formData = new FormData();
    formData.append('feedback', feedback);
    formData.append('type', 'sketchmind');

    if (voiceNote) {
      formData.append('voiceNote', voiceNote, 'feedback.webm');
    }

    // 🔧 Always send image key (even if empty), so backend multer.fields() doesn't break
    const emptyImage = new Blob([], { type: 'image/png' });
    formData.append('image', emptyImage, 'empty.png');


    const res = await axios.post(
      `${API_BASE_URL}/api/feedback/sketchmind`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    return res.data;
  } catch (err) {
    console.error('SketchMind feedback failed:', err.response?.data || err.message);
    throw err;
  }
};

// 🔐 Admin: View all SketchMind Feedbacks
export const getSketchMindFeedbacks = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/feedback/sketchmind`);
    return res.data;
  } catch (err) {
    console.error('Fetching SketchMind feedbacks failed:', err.response?.data || err.message);
    return [];
  }
};

// 🔐 Admin: Delete a SketchMind Feedback by ID
export const deleteSketchMindFeedback = async (id) => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/api/feedback/admin/${id}`);
    return res.data;
  } catch (err) {
    console.error('Deleting SketchMind feedback failed:', err.response?.data || err.message);
    throw err;
  }
};
