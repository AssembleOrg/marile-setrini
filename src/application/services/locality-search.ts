// Locality search with binary prefix search for fast typeahead
// Accent-insensitive, optimized for 4000+ localities

export interface Localidad {
  id: string
  nombre: string
  provincia?: {
    id: string
    nombre: string
  }
  departamento?: {
    id: string
    nombre: string
  }
}

interface LocalidadData {
  localidades: Array<{
    id: string
    nombre: string
    provincia?: { id: string; nombre: string }
    departamento?: { id: string; nombre: string }
  }>
}

// Normalize string: remove diacritics, lowercase, trim
const normalize = (s: string): string =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()

interface SearchEntry {
  key: string
  loc: Localidad
}

// Binary search for lower bound
function lowerBound(arr: SearchEntry[], target: string): number {
  let lo = 0
  let hi = arr.length
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (arr[mid].key < target) lo = mid + 1
    else hi = mid
  }
  return lo
}

// Build search index once
let searchIndex: SearchEntry[] | null = null

async function buildIndex(): Promise<SearchEntry[]> {
  if (searchIndex) return searchIndex

  try {
    const response = await fetch('/localidades.json')
      const data: LocalidadData = await response.json()
    
    // 1. Filtrar solo Bs. As. (el ID de provincia suele ser "06" o filtrar por nombre)
    // 2. Normalizar y eliminar duplicados de nombre (ej: "Quilmes" vs "quilmes")
    const uniqueMap = new Map<string, typeof data.localidades[0]>()

    data.localidades.forEach(loc => {
      // Filtrar por Buenos Aires (case insensitive)
      const provincia = normalize(loc.provincia?.nombre || '')
      if (!provincia.includes('buenos aires')) return

      const key = normalize(loc.nombre)
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, loc)
      }
    })

    const entries: SearchEntry[] = Array.from(uniqueMap.values()).map((loc) => ({
      key: normalize(loc.nombre),
      loc: {
        id: loc.id,
        nombre: loc.nombre,
        provincia: loc.provincia,
        departamento: loc.departamento,
      },
    }))

    // Sort by normalized key for binary search
    entries.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0))
    
    searchIndex = entries
    return entries
  } catch (error) {
    console.error('Error loading localidades:', error)
    return []
  }
}

// Search function - starts after 3 characters for better UX
export async function searchLocalidades(
  query: string,
  limit: number = 20
): Promise<Localidad[]> {
  const prefix = normalize(query)
  
  // Require at least 3 characters to avoid too many results
  if (prefix.length < 3) return []

  const entries = await buildIndex()
  if (entries.length === 0) return []

  // Binary search range for prefix
  const start = lowerBound(entries, prefix)
  
  // Find matches that start with the prefix
  const results: Localidad[] = []
  for (let i = start; i < entries.length && results.length < limit; i++) {
    if (!entries[i].key.startsWith(prefix)) break
    results.push(entries[i].loc)
  }
  
  return results
}

// Format locality for display: "Nombre - Departamento - Provincia"
export function formatLocalidad(loc: Localidad): string {
  const parts = [loc.nombre]
  if (loc.departamento?.nombre) parts.push(loc.departamento.nombre)
  if (loc.provincia?.nombre) parts.push(loc.provincia.nombre)
  return parts.join(' - ')
}

// Preload index on app start for faster first search
export async function preloadLocalidadesIndex(): Promise<void> {
  await buildIndex()
}
