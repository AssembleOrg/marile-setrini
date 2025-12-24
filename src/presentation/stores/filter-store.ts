import { create } from 'zustand'
import {
  TransactionType,
  PropertyType,
  Currency,
  type PropertyFilters,
  type PropertySort,
} from '@/src/domain/entities/property'

interface FilterState {
  filters: PropertyFilters
  sort: PropertySort
  page: number
  limit: number
  
  // Actions
  setTransactionType: (type: TransactionType) => void
  togglePropertyType: (type: PropertyType) => void
  setCurrency: (currency: Currency) => void
  setPriceRange: (min?: number, max?: number) => void
  setLocalidad: (id: string | undefined, nombre: string | undefined) => void
  setSort: (sort: PropertySort) => void
  setPage: (page: number) => void
  clearFilters: () => void
  removeFilter: (key: keyof PropertyFilters) => void
}

const initialFilters: PropertyFilters = {
  transactionType: TransactionType.VENTA,
  propertyTypes: [],
  published: true,
}

const initialSort: PropertySort = {
  field: 'createdAt',
  direction: 'desc',
}

export const useFilterStore = create<FilterState>((set) => ({
  filters: initialFilters,
  sort: initialSort,
  page: 1,
  limit: 12,

  setTransactionType: (type) =>
    set((state) => ({
      filters: { ...state.filters, transactionType: type },
      page: 1,
    })),

  togglePropertyType: (type) =>
    set((state) => {
      const current = state.filters.propertyTypes || []
      const exists = current.includes(type)
      return {
        filters: {
          ...state.filters,
          propertyTypes: exists
            ? current.filter((t) => t !== type)
            : [...current, type],
        },
        page: 1,
      }
    }),

  setCurrency: (currency) =>
    set((state) => ({
      filters: { ...state.filters, currency },
      page: 1,
    })),

  setPriceRange: (min, max) =>
    set((state) => ({
      filters: { ...state.filters, minPrice: min, maxPrice: max },
      page: 1,
    })),

  setLocalidad: (id, nombre) =>
    set((state) => ({
      filters: {
        ...state.filters,
        localidadId: id,
      },
      page: 1,
    })),

  setSort: (sort) =>
    set(() => ({
      sort,
      page: 1,
    })),

  setPage: (page) => set(() => ({ page })),

  clearFilters: () =>
    set(() => ({
      filters: initialFilters,
      sort: initialSort,
      page: 1,
    })),

  removeFilter: (key) =>
    set((state) => {
      const newFilters = { ...state.filters }
      if (key === 'propertyTypes') {
        newFilters.propertyTypes = []
      } else if (key === 'transactionType') {
        // Don't remove transaction type, reset to default
        newFilters.transactionType = TransactionType.VENTA
      } else {
        delete newFilters[key]
      }
      return { filters: newFilters, page: 1 }
    }),
}))
