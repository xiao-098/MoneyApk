import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const useSavingsStore = create(
  persist(
    (set, get) => ({
      goals: [],

      fetchGoals: async (userId) => {
        if (!isSupabaseConfigured) return

        try {
          const { data, error } = await supabase
            .from('savings_goals')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

          if (error) throw error
          set({ goals: data || [] })
        } catch (error) {
          console.error('Failed to fetch savings goals:', error)
        }
      },

      addGoal: async (goal) => {
        const newGoal = {
          id: goal.id || Date.now().toString() + Math.random().toString(36).slice(2, 7),
          name: goal.name,
          target_amount: goal.targetAmount || goal.target_amount,
          current_amount: goal.currentAmount || goal.current_amount || 0,
          start_date: goal.startDate || goal.start_date || new Date().toISOString().split('T')[0],
          end_date: goal.endDate || goal.end_date,
          status: 'active',
          created_at: new Date().toISOString(),
        }

        if (isSupabaseConfigured && goal.user_id) {
          try {
            const { data, error } = await supabase
              .from('savings_goals')
              .insert({
                user_id: goal.user_id,
                name: newGoal.name,
                target_amount: newGoal.target_amount,
                current_amount: newGoal.current_amount,
                start_date: newGoal.start_date,
                end_date: newGoal.end_date,
                status: newGoal.status,
              })
              .select()
              .single()

            if (error) throw error
            set((state) => ({ goals: [data, ...state.goals] }))
            return data
          } catch (error) {
            console.error('Failed to add savings goal:', error)
            throw error
          }
        }

        set((state) => ({ goals: [newGoal, ...state.goals] }))
        return newGoal
      },

      updateGoal: async (id, updates) => {
        if (isSupabaseConfigured) {
          try {
            const { data, error } = await supabase
              .from('savings_goals')
              .update(updates)
              .eq('id', id)
              .select()
              .single()

            if (error) throw error
            set((state) => ({
              goals: state.goals.map((g) => (g.id === id ? data : g)),
            }))
            return data
          } catch (error) {
            console.error('Failed to update savings goal:', error)
            throw error
          }
        }

        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
        }))
      },

      deleteGoal: async (id) => {
        if (isSupabaseConfigured) {
          try {
            const { error } = await supabase.from('savings_goals').delete().eq('id', id)
            if (error) throw error
          } catch (error) {
            console.error('Failed to delete savings goal:', error)
            throw error
          }
        }

        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        }))
      },

      depositToGoal: async (id, amount) => {
        const goal = get().goals.find((g) => g.id === id)
        if (!goal) return

        const newAmount = (goal.current_amount || 0) + amount
        const updates = {
          current_amount: newAmount,
          status: newAmount >= goal.target_amount ? 'completed' : goal.status,
        }

        return get().updateGoal(id, updates)
      },

      getActiveGoals: () => {
        const now = new Date().toISOString().split('T')[0]
        return get().goals.map((g) => {
          const isExpired = g.end_date && g.end_date < now
          const isComplete = (g.current_amount || 0) >= g.target_amount
          let status = g.status
          if (isComplete) status = 'completed'
          else if (isExpired) status = 'expired'
          return { ...g, status }
        })
      },
    }),
    { name: 'money-savings-goals' }
  )
)

export default useSavingsStore
