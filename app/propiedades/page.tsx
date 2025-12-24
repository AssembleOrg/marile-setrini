'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
    Container,
    Grid,
    GridCol,
    Title,
    Text,
    Paper,
    Stack,
    Select,
    Group,
    Button,
    Skeleton,
    Pagination,
    Box,
    Divider,
} from '@mantine/core'
import { IconFilter, IconSortAscending, IconSortDescending } from '@tabler/icons-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PropertyCard } from '@/src/presentation/components/ui/property-card'
import { FilterChips } from '@/src/presentation/components/ui/filter-chips'
import { OperationToggle } from '@/src/presentation/components/ui/operation-toggle'
import { PropertyTypeSelect } from '@/src/presentation/components/ui/property-type-select'
import { PriceRange } from '@/src/presentation/components/ui/price-range'
import { LocalityAutocomplete } from '@/src/presentation/components/ui/locality-autocomplete'
import {
    TransactionType,
    PropertyType,
    Currency,
    propertyTypeLabels,
    transactionTypeLabels,
} from '@/src/domain/entities/property'
import type { Property, PaginatedResult } from '@/src/domain/entities/property'
import type { Localidad } from '@/src/application/services/locality-search'
import styles from './page.module.css'

import { Suspense } from 'react'

function PropertiesContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Filter state
    const [operation, setOperation] = useState<TransactionType>(
        (searchParams.get('operation') as TransactionType) || TransactionType.VENTA
    )
    const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>(() => {
        const types = searchParams.get('types')
        return types ? (types.split(',') as PropertyType[]) : []
    })
    const [currency, setCurrency] = useState<Currency>(
        (searchParams.get('currency') as Currency) || Currency.ARS
    )
    const [minPrice, setMinPrice] = useState<number | undefined>(() => {
        const val = searchParams.get('minPrice')
        return val ? Number(val) : undefined
    })
    const [maxPrice, setMaxPrice] = useState<number | undefined>(() => {
        const val = searchParams.get('maxPrice')
        return val ? Number(val) : undefined
    })
    const [localidadNombre, setLocalidadNombre] = useState<string | undefined>(
        searchParams.get('localidadNombre') || undefined
    )
    const [localidadId, setLocalidadId] = useState<string | undefined>(
        searchParams.get('localidadId') || undefined
    )
    const [sort, setSort] = useState<string>(
        searchParams.get('sort') || 'createdAt_desc'
    )
    const [page, setPage] = useState(1)

    // Data state
    const [data, setData] = useState<PaginatedResult<Property> | null>(null)
    const [loading, setLoading] = useState(true)

    // Fetch properties
    const fetchProperties = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            params.set('page', String(page))
            params.set('limit', '12')
            params.set('operation', operation)

            if (propertyTypes.length > 0) {
                params.set('types', propertyTypes.join(','))
            }
            if (currency) {
                params.set('currency', currency)
            }
            if (minPrice !== undefined) {
                params.set('minPrice', String(minPrice))
            }
            if (maxPrice !== undefined) {
                params.set('maxPrice', String(maxPrice))
            }
            if (localidadId) {
                params.set('localidadId', localidadId)
            }
            if (sort) {
                params.set('sort', sort)
            }

            const response = await fetch(`/api/properties?${params.toString()}`)
            const result = await response.json()
            setData(result)
        } catch (error) {
            console.error('Error fetching properties:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProperties()
    }, [operation, propertyTypes, currency, minPrice, maxPrice, localidadId, sort, page])

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams()
        params.set('operation', operation)

        if (propertyTypes.length > 0) {
            params.set('types', propertyTypes.join(','))
        }
        if (currency && currency !== Currency.ARS) {
            params.set('currency', currency)
        }
        if (minPrice !== undefined) {
            params.set('minPrice', String(minPrice))
        }
        if (maxPrice !== undefined) {
            params.set('maxPrice', String(maxPrice))
        }
        if (localidadId && localidadNombre) {
            params.set('localidadId', localidadId)
            params.set('localidadNombre', localidadNombre)
        }
        if (sort && sort !== 'createdAt_desc') {
            params.set('sort', sort)
        }

        router.replace(`/propiedades?${params.toString()}`, { scroll: false })
    }, [operation, propertyTypes, currency, minPrice, maxPrice, localidadId, localidadNombre, sort])

    // Build filter chips
    const buildFilterChips = () => {
        const chips = []

        if (propertyTypes.length > 0) {
            propertyTypes.forEach((type) => {
                chips.push({
                    key: `type-${type}`,
                    label: 'Tipo',
                    value: propertyTypeLabels[type],
                })
            })
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            const priceText = `${minPrice || 0} - ${maxPrice || '∞'}`
            chips.push({
                key: 'price',
                label: 'Precio',
                value: priceText,
                color: 'green',
            })
        }

        if (localidadNombre) {
            chips.push({
                key: 'localidad',
                label: 'Ubicación',
                value: localidadNombre,
                color: 'violet',
            })
        }

        return chips
    }

    const handleRemoveFilter = (key: string) => {
        if (key.startsWith('type-')) {
            const type = key.replace('type-', '') as PropertyType
            setPropertyTypes(propertyTypes.filter((t) => t !== type))
        } else if (key === 'price') {
            setMinPrice(undefined)
            setMaxPrice(undefined)
        } else if (key === 'localidad') {
            setLocalidadId(undefined)
            setLocalidadNombre(undefined)
        }
    }

    const handleClearFilters = () => {
        setPropertyTypes([])
        setMinPrice(undefined)
        setMaxPrice(undefined)
        setLocalidadId(undefined)
        setLocalidadNombre(undefined)
    }

    const handleLocalityChange = (loc: Localidad | null) => {
        setLocalidadId(loc?.id)
        setLocalidadNombre(loc?.nombre)
    }

    return (
        <Container size="xl" py="xl">
            <Title order={1} mb="xs">
                Propiedades en {transactionTypeLabels[operation]}
            </Title>
            <Text c="dimmed" mb="xl">
                {data?.total || 0} propiedades encontradas
            </Text>

            <Grid gutter="xl">
                {/* Filters Sidebar */}
                <GridCol span={{ base: 12, md: 3 }}>
                    <Paper shadow="xs" p="md" radius="md" withBorder className={styles.filterPanel}>
                        <Group justify="space-between" mb="md">
                            <Group gap="xs">
                                <IconFilter size={18} />
                                <Text fw={600}>Filtros</Text>
                            </Group>
                        </Group>

                        <Stack gap="md">
                            <OperationToggle
                                value={operation}
                                onChange={setOperation}
                                size="sm"
                                fullWidth
                            />

                            <Divider />

                            <LocalityAutocomplete
                                value={localidadNombre}
                                onChange={handleLocalityChange}
                                label="Ubicación"
                                placeholder="Buscar localidad..."
                                size="sm"
                            />

                            <PropertyTypeSelect
                                value={propertyTypes}
                                onChange={setPropertyTypes}
                                label="Tipo de propiedad"
                            />

                            <Select
                                label="Moneda"
                                value={currency}
                                onChange={(val) => setCurrency(val as Currency)}
                                data={[
                                    { value: Currency.ARS, label: 'Pesos (ARS)' },
                                    { value: Currency.USD, label: 'Dólares (USD)' },
                                ]}
                                size="sm"
                            />

                            <PriceRange
                                minValue={minPrice}
                                maxValue={maxPrice}
                                currency={currency}
                                onChange={(min, max) => {
                                    setMinPrice(min)
                                    setMaxPrice(max)
                                }}
                                label="Rango de precio"
                            />

                            <Divider />

                            <Select
                                label="Ordenar por"
                                value={sort}
                                onChange={(val) => setSort(val || 'createdAt_desc')}
                                data={[
                                    { value: 'createdAt_desc', label: 'Más recientes' },
                                    { value: 'createdAt_asc', label: 'Más antiguos' },
                                    { value: 'price_asc', label: 'Precio: menor a mayor' },
                                    { value: 'price_desc', label: 'Precio: mayor a menor' },
                                ]}
                                size="sm"
                                leftSection={
                                    sort.includes('asc') ?
                                        <IconSortAscending size={16} /> :
                                        <IconSortDescending size={16} />
                                }
                            />
                        </Stack>
                    </Paper>
                </GridCol>

                {/* Properties Grid */}
                <GridCol span={{ base: 12, md: 9 }}>
                    <FilterChips
                        chips={buildFilterChips()}
                        onRemove={handleRemoveFilter}
                        onClear={handleClearFilters}
                    />

                    {loading ? (
                        <Grid gutter="md">
                            {[...Array(6)].map((_, i) => (
                                <GridCol key={i} span={{ base: 12, sm: 6, lg: 4 }}>
                                    <Skeleton height={320} radius="lg" />
                                </GridCol>
                            ))}
                        </Grid>
                    ) : !data || !data.data || data.data.length === 0 ? (
                        <Paper p="xl" ta="center" withBorder radius="md">
                            <Text size="lg" fw={500} mb="xs">
                                No se encontraron propiedades
                            </Text>
                            <Text c="dimmed" mb="md">
                                Intentá ajustar los filtros para ver más resultados
                            </Text>
                            <Button variant="light" onClick={handleClearFilters}>
                                Limpiar filtros
                            </Button>
                        </Paper>
                    ) : (
                        <>
                            <Grid gutter="md">
                                <AnimatePresence mode="popLayout">
                                    {data?.data.map((property, index) => (
                                        <GridCol key={property.id} span={{ base: 12, sm: 6, lg: 4 }}>
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                            >
                                                <PropertyCard property={property} />
                                            </motion.div>
                                        </GridCol>
                                    ))}
                                </AnimatePresence>
                            </Grid>

                            {data && data.totalPages > 1 && (
                                <Group justify="center" mt="xl">
                                    <Pagination
                                        total={data.totalPages}
                                        value={page}
                                        onChange={setPage}
                                        size="md"
                                        radius="md"
                                    />
                                </Group>
                            )}
                        </>
                    )}
                </GridCol>
            </Grid>
        </Container>
    )
}

export default function PropertiesPage() {
    return (
        <Suspense fallback={
            <Container size="xl" py="xl">
                <Skeleton height={40} width={300} mb="xl" />
                <Grid gutter="xl">
                    <GridCol span={{ base: 12, md: 3 }}>
                        <Skeleton height={600} radius="md" />
                    </GridCol>
                    <GridCol span={{ base: 12, md: 9 }}>
                        <Grid gutter="md">
                            {[...Array(6)].map((_, i) => (
                                <GridCol key={i} span={{ base: 12, sm: 6, lg: 4 }}>
                                    <Skeleton height={320} radius="lg" />
                                </GridCol>
                            ))}
                        </Grid>
                    </GridCol>
                </Grid>
            </Container>
        }>
            <PropertiesContent />
        </Suspense>
    )
}
