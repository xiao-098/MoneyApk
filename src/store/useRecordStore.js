import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const useRecordStore = create(
  persist(
    (set, get) => ({
      records: [],
      loading: false,

      fetchRecords: async (userId) => {
        if (!isSupabaseConfigured) return

        set({ loading: true })
        try {
          const { data, error } = await supabase
            .from('records')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

          if (error) throw error
          set({ records: data || [] })
        } catch (error) {
          console.error('Failed to fetch records:', error)
        } finally {
          set({ loading: false })
        }
      },

      addRecord: async (record) => {
        const newRecord = {
          id: record.id || Date.now().toString() + Math.random().toString(36).slice(2, 7),
          user_id: record.user_id,
          amount: record.amount,
          category_id: record.category_id || record.categoryId,
          note: record.note || null,
          record_date: record.record_date || record.date || new Date().toISOString().split('T')[0],
          created_at: record.created_at || new Date().toISOString(),
        }

        if (isSupabaseConfigured && record.user_id) {
          try {
            const { data, error } = await supabase
              .from('records')
              .insert({
                user_id: record.user_id,
                amount: record.amount,
                category_id: record.category_id || record.categoryId,
                note: record.note || null,
                record_date: record.record_date || record.date || new Date().toISOString().split('T')[0],
              })
              .select()
              .single()

            if (error) throw error
            set((state) => ({ records: [data, ...state.records] }))
            return data
          } catch (error) {
            console.error('Failed to add record:', error)
            throw error
          }
        }

        set((state) => ({ records: [newRecord, ...state.records] }))
        return newRecord
      },

      updateRecord: async (id, updates) => {
        if (isSupabaseConfigured) {
          try {
            const { data, error } = await supabase
              .from('records')
              .update(updates)
              .eq('id', id)
              .select()
              .single()

            if (error) throw error
            set((state) => ({
              records: state.records.map((r) => (r.id === id ? data : r)),
            }))
            return data
          } catch (error) {
            console.error('Failed to update record:', error)
            throw error
          }
        }

        set((state) => ({
          records: state.records.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        }))
      },

      deleteRecord: async (id) => {
        if (isSupabaseConfigured) {
          try {
            const { error } = await supabase.from('records').delete().eq('id', id)
            if (error) throw error
          } catch (error) {
            console.error('Failed to delete record:', error)
            throw error
          }
        }

        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
        }))
      },

      getRecordsByDate: (dateStr) => {
        return get().records.filter((r) => (r.record_date || r.date) === dateStr)
      },

      getRecordsByMonth: (monthStr) => {
        return get().records.filter((r) =>
          (r.record_date || r.date || '').startsWith(monthStr)
        )
      },

      getTodayTotal: () => {
        const today = new Date().toISOString().split('T')[0]
        return get()
          .records.filter((r) => (r.record_date || r.date) === today)
          .reduce((sum, r) => sum + r.amount, 0)
      },

      getMonthTotal: (monthStr) => {
        return get()
          .records.filter((r) => (r.record_date || r.date || '').startsWith(monthStr))
          .reduce((sum, r) => sum + r.amount, 0)
      },
    }),
    { name: 'money-records' }
  )
)

export default useRecordStore
