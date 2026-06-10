import { create } from 'zustand'

/**
 * 全局应用状态管理
 * 使用 Zustand 进行轻量级状态管理
 */
export const useAppStore = create((set, get) => ({
  // ========== 用户信息 ==========
  user: {
    name: 'Lily',
    id: '3672',
    credit: 762,
    registerDays: 487,
    totalTrips: 7,
    totalPartners: 12,
    partnerRating: 4.95,
  },

  // ========== 年假账户 ==========
  leaveAccount: {
    year: 2026,
    total: 10,
    used: 5,
    remaining: 5,
    expireDate: '12月31日',
  },

  // ========== 拼假参数 ==========
  pinjiaParams: {
    year: 2026,
    availableDays: 5,
    preference: '出境游',
    months: [],
    avoidFiscal: false,
    maxConsecutive: 5,
  },
  setPinjiaParam: (key, value) =>
    set((state) => ({
      pinjiaParams: { ...state.pinjiaParams, [key]: value },
    })),

  // ========== 拼假结果 ==========
  pinjiaResults: [],
  setPinjiaResults: (results) => set({ pinjiaResults: results }),

  // ========== 行程规划参数 ==========
  planParams: {
    destination: '',
    duration: 9,
    style: [],
    budget: '',
    preferences: '',
  },
  setPlanParam: (key, value) =>
    set((state) => ({
      planParams: { ...state.planParams, [key]: value },
    })),

  // ========== 行程结果 ==========
  planResult: null,
  setPlanResult: (result) => set({ planResult: result }),

  // ========== 搭子匹配 ==========
  partnerFilter: 'match', // 'match' | 'overlap' | 'gender' | 'budget'
  setPartnerFilter: (filter) => set({ partnerFilter: filter }),

  partners: [],
  setPartners: (partners) => set({ partners }),

  // ========== 收藏的方案 ==========
  savedPinjiaPlans: [],
  savePinjiaPlan: (plan) =>
    set((state) => {
      const key = `${plan.startDate}-${plan.endDate}-${plan.leaveDays}`
      const exists = state.savedPinjiaPlans.some(
        (p) => `${p.startDate}-${p.endDate}-${p.leaveDays}` === key
      )
      if (exists) return state
      return { savedPinjiaPlans: [...state.savedPinjiaPlans, { ...plan, savedAt: Date.now() }] }
    }),
  removePinjiaPlan: (idx) =>
    set((state) => ({
      savedPinjiaPlans: state.savedPinjiaPlans.filter((_, i) => i !== idx),
    })),
  isPinjiaSaved: (plan) => {
    const key = `${plan.startDate}-${plan.endDate}-${plan.leaveDays}`
    return get().savedPinjiaPlans.some(
      (p) => `${p.startDate}-${p.endDate}-${p.leaveDays}` === key
    )
  },

  savedTripPlans: [],
  saveTripPlan: (plan) =>
    set((state) => {
      const exists = state.savedTripPlans.some(
        (p) => p.destination === plan.destination && p.duration === plan.duration
      )
      if (exists) return state
      return { savedTripPlans: [...state.savedTripPlans, { ...plan, savedAt: Date.now() }] }
    }),
  removeTripPlan: (idx) =>
    set((state) => ({
      savedTripPlans: state.savedTripPlans.filter((_, i) => i !== idx),
    })),

  // ========== 当前激活的 Tab ==========
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // ========== Toast 通知 ==========
  toast: null,
  showToast: (msg) => {
    set({ toast: msg })
    setTimeout(() => set({ toast: null }), 2000)
  },

  // ========== 加载状态 ==========
  loading: false,
  setLoading: (loading) => set({ loading }),
}))
