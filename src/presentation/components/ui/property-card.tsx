'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, Text, Group, Badge, Stack, Box } from '@mantine/core'
import { IconBed, IconBath, IconRuler } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import type { Property } from '@/src/domain/entities/property'
import { currencyLabels, transactionTypeLabels, propertyTypeLabels } from '@/src/domain/entities/property'
import styles from './property-card.module.css'

interface PropertyCardProps {
    property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
    const mainImage = property.images[0] || '/placeholder-property.jpg'

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat('es-AR').format(price)
    }

    return (
        <motion.div
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
        >
            <Card
                component={Link}
                href={`/propiedades/${property.slug}`}
                className={styles.card}
                padding={0}
            >
                {/* Image Container */}
                <Box className={styles.imageContainer}>
                    <motion.div
                        className={styles.imageWrapper}
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Image
                            src={mainImage}
                            alt={property.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className={styles.image}
                        />
                    </motion.div>

                    {/* Badges */}
                    <Group className={styles.badges} gap="xs">
                        <Badge
                            color={property.transactionType === 'VENTA' ? 'blue' : 'green'}
                            variant="filled"
                            size="sm"
                        >
                            {transactionTypeLabels[property.transactionType]}
                        </Badge>
                        {property.featured && (
                            <Badge color="gold" variant="filled" size="sm">
                                Destacada
                            </Badge>
                        )}
                    </Group>
                </Box>

                {/* Content */}
                <Stack gap="xs" p="md">
                    {/* Price */}
                    <Text className={styles.price}>
                        {currencyLabels[property.currency]} {formatPrice(property.price, property.currency)}
                    </Text>

                    {/* Title */}
                    <Text fw={600} size="md" lineClamp={2} className={styles.title}>
                        {property.title}
                    </Text>

                    {/* Location */}
                    {property.localidadNombre && (
                        <Text size="sm" c="dimmed" lineClamp={1}>
                            {property.localidadNombre}
                        </Text>
                    )}

                    {/* Features */}
                    <Group gap="md" mt="xs">
                        {property.bedrooms && (
                            <Group gap={4}>
                                <IconBed size={16} stroke={1.5} />
                                <Text size="sm" c="dimmed">
                                    {property.bedrooms}
                                </Text>
                            </Group>
                        )}
                        {property.bathrooms && (
                            <Group gap={4}>
                                <IconBath size={16} stroke={1.5} />
                                <Text size="sm" c="dimmed">
                                    {property.bathrooms}
                                </Text>
                            </Group>
                        )}
                        {property.areaM2 && (
                            <Group gap={4}>
                                <IconRuler size={16} stroke={1.5} />
                                <Text size="sm" c="dimmed">
                                    {property.areaM2} m²
                                </Text>
                            </Group>
                        )}
                    </Group>

                    {/* Property Type */}
                    {property.propertyType && (
                        <Badge variant="light" color="gray" size="sm" mt="xs">
                            {propertyTypeLabels[property.propertyType]}
                        </Badge>
                    )}
                </Stack>
            </Card>
        </motion.div>
    )
}
