// Domain entities - reusable across the application

export enum TransactionType {
  VENTA = 'VENTA',
  ALQUILER = 'ALQUILER',
}

export enum PropertyType {
  TERRENO = 'TERRENO',
  DEPARTAMENTO = 'DEPARTAMENTO',
  CASA = 'CASA',
  QUINTA = 'QUINTA',
  OFICINA = 'OFICINA',
  LOCAL = 'LOCAL',
  EDIFICIO_COMERCIAL = 'EDIFICIO_COMERCIAL',
  CAMPO = 'CAMPO',
  PH = 'PH',
}

export enum Currency {
  ARS = 'ARS',
  USD = 'USD',
}

export interface Property {
  id: string
  slug: string
  title: string
  description: string | null
  transactionType: TransactionType
  propertyType: PropertyType | null
  price: number
  currency: Currency
  address: string | null
  localidadId: string | null
  localidadNombre: string | null
  bedrooms: number | null
  bathrooms: number | null
  areaM2: number | null
  images: string[]
  published: boolean
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PropertyFilters {
  transactionType?: TransactionType
  propertyTypes?: PropertyType[]
  currency?: Currency
  minPrice?: number
  maxPrice?: number
  localidadId?: string
  bedrooms?: number
  bathrooms?: number
  published?: boolean
  featured?: boolean
}

export interface PropertySort {
  field: 'price' | 'createdAt'
  direction: 'asc' | 'desc'
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Property type labels in Spanish
export const propertyTypeLabels: Record<PropertyType, string> = {
  [PropertyType.TERRENO]: 'Terreno',
  [PropertyType.DEPARTAMENTO]: 'Departamento',
  [PropertyType.CASA]: 'Casa',
  [PropertyType.QUINTA]: 'Quinta',
  [PropertyType.OFICINA]: 'Oficina',
  [PropertyType.LOCAL]: 'Local',
  [PropertyType.EDIFICIO_COMERCIAL]: 'Edificio Comercial',
  [PropertyType.CAMPO]: 'Campo',
  [PropertyType.PH]: 'PH',
}

export const transactionTypeLabels: Record<TransactionType, string> = {
  [TransactionType.VENTA]: 'Venta',
  [TransactionType.ALQUILER]: 'Alquiler',
}

export const currencyLabels: Record<Currency, string> = {
  [Currency.ARS]: 'ARS $',
  [Currency.USD]: 'USD $',
}
