'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Paper, Stack, Group, Button, Box, Grid, GridCol, Title, Text } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { TransactionType, PropertyType, Currency } from '@/src/domain/entities/property'
import { OperationToggle } from '../ui/operation-toggle'
import { LocalityAutocomplete } from '../ui/locality-autocomplete'
import { PropertyTypeSelect } from '../ui/property-type-select'
import { PriceRange } from '../ui/price-range'
import type { Localidad } from '@/src/application/services/locality-search'
import styles from './search-form.module.css'

export function SearchForm() {
    const router = useRouter()
    const [operation, setOperation] = useState<TransactionType>(TransactionType.VENTA)
    const [locality, setLocality] = useState<Localidad | null>(null)
    const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([])
    const [minPrice, setMinPrice] = useState<number | undefined>()
    const [maxPrice, setMaxPrice] = useState<number | undefined>()
    const [currency] = useState<Currency>(Currency.ARS)

    const handleSearch = () => {
        const params = new URLSearchParams()

        params.set('operation', operation)

        if (locality) {
            params.set('localidadId', locality.id)
            params.set('localidadNombre', locality.nombre)
        }

        if (propertyTypes.length > 0) {
            params.set('types', propertyTypes.join(','))
        }

        if (minPrice !== undefined) {
            params.set('minPrice', String(minPrice))
        }

        if (maxPrice !== undefined) {
            params.set('maxPrice', String(maxPrice))
        }

        params.set('currency', currency)

        router.push(`/propiedades?${params.toString()}`)
    }

    return (
        <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
            <Paper className={styles.container} radius="xl" p="xl">
                <Stack gap="lg">
                    {/* Title */}
                    <Box>
                        <Title order={2} className={styles.formTitle}>
                            Busque su propiedad en Inmobiliaria Marile Setrini
                        </Title>
                    </Box>

                    {/* Operation Toggle */}
                    <Box>
                        <OperationToggle
                            value={operation}
                            onChange={setOperation}
                            size="md"
                        />
                    </Box>

                    {/* Location */}
                    <LocalityAutocomplete
                        placeholder="Escribe una ubicación..."
                        onChange={setLocality}
                        size="md"
                    />

                    {/* Filters Row */}
                    <Grid gutter="md">
                        <GridCol span={{ base: 12, sm: 6 }}>
                            <PropertyTypeSelect
                                value={propertyTypes}
                                onChange={setPropertyTypes}
                                label="Tipo de propiedad"
                                size="md"
                            />
                        </GridCol>

                        <GridCol span={{ base: 12, sm: 6 }}>
                            <PriceRange
                                minValue={minPrice}
                                maxValue={maxPrice}
                                currency={currency}
                                onChange={(min, max) => {
                                    setMinPrice(min)
                                    setMaxPrice(max)
                                }}
                                label="Rango de precio"
                                size="md"
                            />
                        </GridCol>
                    </Grid>

                    {/* Search Button */}
                    <Button
                        size="lg"
                        fullWidth
                        leftSection={<IconSearch size={20} />}
                        onClick={handleSearch}
                        className={styles.searchButton}
                        color="brand"
                    >
                        Buscar propiedades
                    </Button>
                </Stack>
            </Paper>
        </motion.div>
    )
}
