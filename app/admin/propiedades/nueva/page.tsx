'use client'

import { PropertyForm } from '@/src/presentation/components/admin/property-form'
import { Container, Title, Paper } from '@mantine/core'

export default function NewPropertyPage() {
    return (
        <Container size="md" py="xl">
            <Title order={2} mb="lg">
                Nueva Propiedad
            </Title>
            <Paper shadow="xs" p="xl" radius="md" withBorder>
                <PropertyForm />
            </Paper>
        </Container>
    )
}
