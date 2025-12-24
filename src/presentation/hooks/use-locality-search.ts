'use client'

import { useState, useCallback } from 'react'
import { searchLocalidades, type Localidad } from '@/src/application/services/locality-search'
import { useDebouncedCallback } from './use-debounce'

interface UseLocalitySearchResult {
  results: Localidad[]
  isLoading: boolean
  error: string | null
  search: (query: string) => void
  clear: () => void
}

export function useLocalitySearch(debounceMs: number = 300): UseLocalitySearchResult {
  const [results, setResults] = useState<Localidad[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const performSearch = useCallback(async (query: string) => {
    if (query.length < 3) {
      setResults([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const localidades = await searchLocalidades(query)
      setResults(localidades)
    } catch (err) {
      setError('Error buscando localidades')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const debouncedSearch = useDebouncedCallback(performSearch, debounceMs)

  const search = useCallback(
    (query: string) => {
      if (query.length < 3) {
        setResults([])
        return
      }
      setIsLoading(true)
      debouncedSearch(query)
    },
    [debouncedSearch]
  )

  const clear = useCallback(() => {
    setResults([])
    setError(null)
  }, [])

  return { results, isLoading, error, search, clear }
}
