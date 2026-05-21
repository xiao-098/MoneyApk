import { create } from 'zustand'
import categories from '../data/categories.json'

const useCategoryStore = create((set, get) => ({
  categories,

  getCategoryById: (id) => {
    return get().categories.find((c) => c.id === id) || null
  },
}))

export default useCategoryStore
