import axios from 'axios';

const API_BASE_URL = 'http://localhost:5086/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (userData) => api.post('/users', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// Student Profile APIs
export const profileAPI = {
  getProfile: () => api.get('/StudentProfile'),
  getProfileById: (studentId) => api.get(`/StudentProfile/${studentId}`),
  createProfile: (profileData) => api.post('/StudentProfile', profileData),
  updateProfile: (profileData) => api.put('/StudentProfile', profileData),
  deleteProfile: () => api.delete('/StudentProfile'),
  uploadProfilePicture: (formData) => api.post('/StudentProfile/picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Assessment APIs
export const assessmentAPI = {
  getAvailableAssessments: () => api.get('/StudentAssessment/available'),
  startAssessment: () => api.post('/StudentAssessment/start'),
  submitAssessment: (studentAssessmentId, data) => api.post(`/StudentAssessment/submit/${studentAssessmentId}`, data),
  getMyAssessments: () => api.get('/StudentAssessment/my-assessments'),
  getAssessmentReport: (studentAssessmentId) => api.get(`/StudentAssessment/report/${studentAssessmentId}`),
  // Admin APIs - Read only
  getAllAssessments: () => api.get('/AdminAssessment'),
};

// Payment APIs
export const paymentAPI = {
  createOrder: (data) => api.post('/Payment/create-order', data),
  verifyPayment: (paymentData) => api.post('/Payment/verify', paymentData),
  getPaymentHistory: () => api.get('/Payment/history'),
  getReceipt: (paymentId) => api.get(`/Payment/receipt/${paymentId}`),
};

// Career APIs
export const careerAPI = {
  getCareers: () => api.get('/ExploreCareer'),
  getCareerDetails: (careerId) => api.get(`/ExploreCareer/${careerId}`),
  createCareer: (data) => api.post('/ExploreCareer', data),
  updateCareer: (id, data) => api.put(`/ExploreCareer/${id}`, data),
  deleteCareer: (id) => api.delete(`/ExploreCareer/${id}`),
};

// Blog APIs
export const blogAPI = {
  getBlogs: () => api.get('/Blog'),
  getBlogDetails: (blogId) => api.get(`/Blog/${blogId}`),
  createBlog: (data) => api.post('/Blog', data),
  updateBlog: (id, data) => api.put(`/Blog/${id}`, data),
  deleteBlog: (id) => api.delete(`/Blog/${id}`),
};

// Roadmap APIs
export const roadmapAPI = {
  generateRoadmap: (paymentId) => api.post('/Roadmap/generate', { paymentId }),
  getMyRoadmaps: () => api.get('/Roadmap/my-roadmaps'),
  getRoadmap: (roadmapId) => api.get(`/Roadmap/${roadmapId}`),
};

// Chatbot APIs
export const chatbotAPI = {
  chat: (message) => api.post('/Chatbot/chat', { message }),
};

// Admin APIs
export const adminAPI = {
  getAllStudents: () => api.get('/Admin/students'),
  getStudentDetails: (userId) => api.get(`/Admin/students/${userId}`),
  getStats: () => api.get('/Admin/stats'),
};

export default api;