import { create } from 'zustand'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const useBudgetStore = create((set, get) => ({
  budgets: [],
  loading: false,

  fetchBudgets: async (userId) => {
    if (!isSupabaseConfigured) return

    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)

      if (error) throw error
      set({ budgets: data || [] })
    } catch (error) {
      console.error('Failed to fetch budgets:', error)
    } finally {
      set({ loading: false })
    }
  },

  setBudget: async (categoryId, month, limit, userId) => {
    const existing = get().budgets.find(
      (b) => b.category_id === categoryId && b.month === month
    )

    if (isSupabaseConfigured) {
      try {
        const payload = {
          user_id: userId,
          category_id: categoryId,
          monthly_limit: limit,
          month,
        }

        const { data, error } = await supabase
          .from('budgets')
          .upsert(existing ? { ...payload, id: existing.id } : payload, {
            onConflict: 'user_id,category_id,month',
          })
          .select()
          .single()

        if (error) throw error
        set((state) => ({
          budgets: existing
            ? state.budgets.map((b) => (b.id === data.id ? data : b))
            : [...state.budgets, data],
        }))
        return data
      } catch (error) {
        console.error('Failed to set budget:', error)
        throw error
      }
    }

    const localBudget = existing
      ? { ...existing, monthly_limit: limit }
      : {
          id: crypto.randomUUID(),
          user_id: userId,
          category_id: categoryId,
          monthly_limit: limit,
          month,
        }

    set((state) => ({
      budgets: existing
        ? state.budgets.map((b) => (b.id === localBudget.id ? localBudget : b))
        : [...state.budgets, localBudget],
    }))
    return localBudget
  },

  getBudgetForMonth: (month) => {
    return get().budgets.filter((b) => b.month === month)
  },

  getBudgetForCategory: (categoryId, month) => {
    return (
      get().budgets.find(
        (b) => b.category_id === categoryId && b.month === month
      ) || null
    )
  },
}))

export default useBudgetStore
