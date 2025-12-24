import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Container, Skeleton, Grid, GridCol } from '@mantine/core'
import { PropertiesSearchPage } from '@/src/presentation/components/properties/properties-search-page'

export const metadata: Metadata = {
    title: 'Propiedades en Venta y Alquiler | Marile Setrini',
    description: 'Explorá nuestro catálogo de casas, departamentos y terrenos en Florencio Varela y alrededores. Encontrá tu próxima inversión o el hogar de tus sueños.',
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
            <PropertiesSearchPage />
        </Suspense>
    )
}
