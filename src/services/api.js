/**
 * API 服务层
 * 封装所有后端 API 调用，方便后续对接真实后端
 */

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

/**
 * 通用 fetch 封装
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // 添加 token（如有）
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, config)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error)
    throw error
  }
}

// ========== 用户相关 ==========
export const userApi = {
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => request('/user/profile'),
  updateProfile: (data) => request('/user/profile', { method: 'PUT', body: JSON.stringify(data) }),
  getLeaveAccount: () => request('/user/leave-account'),
}

// ========== 拼假相关 ==========
export const pinjiaApi = {
  calculate: (params) =>
    request('/pinjia/calculate', { method: 'POST', body: JSON.stringify(params) }),
  getHistory: () => request('/pinjia/history'),
  saveResult: (result) =>
    request('/pinjia/save', { method: 'POST', body: JSON.stringify(result) }),
  generateLeaveRequest: (params) =>
    request('/pinjia/leave-request', { method: 'POST', body: JSON.stringify(params) }),
}

// ========== 行程规划相关 ==========
export const planApi = {
  generate: (params) =>
    request('/plan/generate', { method: 'POST', body: JSON.stringify(params) }),
  getDetail: (id) => request(`/plan/${id}`),
  update: (id, data) =>
    request(`/plan/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  rewriteDay: (planId, dayIndex, instruction) =>
    request(`/plan/${planId}/rewrite`, {
      method: 'POST',
      body: JSON.stringify({ dayIndex, instruction }),
    }),
  export: (planId, format) => request(`/plan/${planId}/export?format=${format}`),
  getMyPlans: () => request('/plan/my-plans'),
}

// ========== 搭子社交相关 ==========
export const partnerApi = {
  getMatches: (tripId) => request(`/partner/matches?tripId=${tripId}`),
  publishTrip: (data) =>
    request('/partner/publish', { method: 'POST', body: JSON.stringify(data) }),
  sendGreeting: (partnerId) =>
    request(`/partner/${partnerId}/greet`, { method: 'POST' }),
  getPartnerProfile: (id) => request(`/partner/${id}`),
  ratePartner: (id, data) =>
    request(`/partner/${id}/rate`, { method: 'POST', body: JSON.stringify(data) }),
}

// ========== OTA 订单相关 ==========
export const orderApi = {
  searchFlights: (params) => request('/order/flights', { method: 'POST', body: JSON.stringify(params) }),
  searchHotels: (params) => request('/order/hotels', { method: 'POST', body: JSON.stringify(params) }),
  createOrder: (data) => request('/order/create', { method: 'POST', body: JSON.stringify(data) }),
  getMyOrders: () => request('/order/my-orders'),
}
