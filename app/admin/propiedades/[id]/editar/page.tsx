'use client'

import { useState, useEffect, use } from 'react'
import { Container, Title, Paper, Skeleton } from '@mantine/core'
import { PropertyForm } from '@/src/presentation/components/admin/property-form'
import type { Property } from '@/src/domain/entities/property'
import { notify } from '@/src/presentation/providers/notifications'

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [property, setProperty] = useState<Property | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProperty() {
            try {
                const response = await fetch(`/api/admin/properties/${id}`)
                if (!response.ok) throw new Error()
                const data = await response.json()
                setProperty(data)
            } catch {
                notify.error('Error al cargar la propiedad')
            } finally {
                setLoading(false)
            }
        }

        fetchProperty()
    }, [id])

    if (loading) {
        return (
            <Container size="md" py="xl">
                <Skeleton height={40} mb="lg" />
                <Paper shadow="xs" p="xl" radius="md" withBorder>
                    <Skeleton height={400} />
                </Paper>
            </Container>
        )
    }

    return (
        <Container size="md" py="xl">
            <Title order={2} mb="lg">
                Editar Propiedad
            </Title>
            <Paper shadow="xs" p="xl" radius="md" withBorder>
                <PropertyForm property={property} />
            </Paper>
        </Container>
    )
}
