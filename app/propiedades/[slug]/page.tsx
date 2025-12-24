import { notFound } from 'next/navigation'
import { Container, Title, Text, Grid, GridCol, Badge, Group, Paper, Stack, Box, Button, Anchor } from '@mantine/core'
import { IconBed, IconBath, IconRuler, IconMapPin, IconBrandWhatsapp, IconPhone } from '@tabler/icons-react'
import Image from 'next/image'
import prisma from '@/src/infrastructure/db/prisma'
import { currencyLabels, transactionTypeLabels, propertyTypeLabels, TransactionType, PropertyType, Currency } from '@/src/domain/entities/property'
import type { Metadata } from 'next'
import styles from './page.module.css'

interface Props {
    params: Promise<{ slug: string }>
}

async function getProperty(slug: string) {
    const property = await prisma.property.findUnique({
        where: { slug, published: true },
    })

    if (!property) return null

    return {
        ...property,
        price: Number(property.price),
        areaM2: property.areaM2 ? Number(property.areaM2) : null,
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const property = await getProperty(slug)

    if (!property) {
        return { title: 'Propiedad no encontrada' }
    }

    const description = property.description ||
        `${property.title} en ${transactionTypeLabels[property.transactionType as TransactionType].toLowerCase()}`

    return {
        title: property.title,
        description,
        openGraph: {
            title: property.title,
            description,
            images: property.images[0] ? [{ url: property.images[0] }] : undefined,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: property.title,
            description,
            images: property.images[0] ? [property.images[0]] : undefined,
        },
    }
}

export default async function PropertyDetailPage({ params }: Props) {
    const { slug } = await params
    const property = await getProperty(slug)

    if (!property) {
        notFound()
    }

    const formatPrice = (price: number, currency: string) => {
        return `${currencyLabels[currency as keyof typeof currencyLabels]} ${new Intl.NumberFormat('es-AR').format(price)}`
    }

    const whatsappMessage = encodeURIComponent(
        `Hola! Estoy interesado/a en la propiedad: ${property.title}`
    )
    const whatsappLink = `https://wa.me/5491163975246?text=${whatsappMessage}`

    return (
        <Container size="xl" py="xl">
            <Grid gutter="xl">
                {/* Images */}
                <GridCol span={12}>
                    <Paper radius="lg" className={styles.imageContainer} withBorder>
                        {property.images.length > 0 ? (
                            <Image
                                src={property.images[0]}
                                alt={property.title}
                                fill
                                sizes="100vw"
                                className={styles.mainImage}
                                priority
                            />
                        ) : (
                            <Box className={styles.placeholder}>
                                <Text c="dimmed">Sin imágenes</Text>
                            </Box>
                        )}
                        <Group className={styles.badges} gap="xs">
                            <Badge
                                color={property.transactionType === 'VENTA' ? 'blue' : 'green'}
                                variant="filled"
                                size="lg"
                            >
                                {transactionTypeLabels[property.transactionType as TransactionType]}
                            </Badge>
                            {property.featured && (
                                <Badge color="gold" variant="filled" size="lg">
                                    Destacada
                                </Badge>
                            )}
                        </Group>
                    </Paper>

                    {/* Additional Images */}
                    {property.images.length > 1 && (
                        <Group mt="md" gap="sm" wrap="wrap">
                            {property.images.slice(1, 5).map((img: string, index: number) => (
                                <Paper
                                    key={index}
                                    className={styles.thumbnailContainer}
                                    radius="md"
                                    withBorder
                                >
                                    <Image
                                        src={img}
                                        alt={`${property.title} - imagen ${index + 2}`}
                                        fill
                                        sizes="150px"
                                        className={styles.thumbnail}
                                    />
                                </Paper>
                            ))}
                        </Group>
                    )}
                </GridCol>

                {/* Details */}
                <GridCol span={{ base: 12, md: 8 }}>
                    <Stack gap="lg">
                        <div>
                            <Title order={1} mb="xs">
                                {property.title}
                            </Title>
                            {property.localidadNombre && (
                                <Group gap="xs" c="dimmed">
                                    <IconMapPin size={18} />
                                    <Text>{property.localidadNombre}</Text>
                                </Group>
                            )}
                        </div>

                        <Title order={2} className={styles.price}>
                            {formatPrice(property.price, property.currency)}
                        </Title>

                        {/* Features */}
                        <Group gap="xl">
                            {property.bedrooms && (
                                <Paper p="md" radius="md" withBorder>
                                    <Group gap="sm">
                                        <IconBed size={24} />
                                        <div>
                                            <Text fw={600}>{property.bedrooms}</Text>
                                            <Text size="sm" c="dimmed">Dormitorios</Text>
                                        </div>
                                    </Group>
                                </Paper>
                            )}
                            {property.bathrooms && (
                                <Paper p="md" radius="md" withBorder>
                                    <Group gap="sm">
                                        <IconBath size={24} />
                                        <div>
                                            <Text fw={600}>{property.bathrooms}</Text>
                                            <Text size="sm" c="dimmed">Baños</Text>
                                        </div>
                                    </Group>
                                </Paper>
                            )}
                            {property.areaM2 && (
                                <Paper p="md" radius="md" withBorder>
                                    <Group gap="sm">
                                        <IconRuler size={24} />
                                        <div>
                                            <Text fw={600}>{property.areaM2} m²</Text>
                                            <Text size="sm" c="dimmed">Superficie</Text>
                                        </div>
                                    </Group>
                                </Paper>
                            )}
                        </Group>

                        {property.propertyType && (
                            <Badge variant="light" size="lg">
                                {propertyTypeLabels[property.propertyType as PropertyType]}
                            </Badge>
                        )}

                        {property.description && (
                            <div>
                                <Title order={3} mb="sm">
                                    Descripción
                                </Title>
                                <Text style={{ whiteSpace: 'pre-line' }}>
                                    {property.description}
                                </Text>
                            </div>
                        )}

                        {property.address && (
                            <div>
                                <Title order={3} mb="sm">
                                    Ubicación
                                </Title>
                                <Text>{property.address}</Text>
                            </div>
                        )}
                    </Stack>
                </GridCol>

                {/* Contact Sidebar */}
                <GridCol span={{ base: 12, md: 4 }}>
                    <Paper shadow="sm" p="xl" radius="lg" withBorder className={styles.contactCard}>
                        <Title order={3} mb="md">
                            ¿Te interesa esta propiedad?
                        </Title>
                        <Stack gap="md">
                            <Button
                                component="a"
                                href={whatsappLink}
                                target="_blank"
                                size="lg"
                                fullWidth
                                color="green"
                                leftSection={<IconBrandWhatsapp size={20} />}
                            >
                                Consultar por WhatsApp
                            </Button>
                            <Button
                                component="a"
                                href="tel:01142870216"
                                size="lg"
                                fullWidth
                                variant="outline"
                                leftSection={<IconPhone size={20} />}
                            >
                                Llamar ahora
                            </Button>
                        </Stack>

                        <Text size="sm" c="dimmed" ta="center" mt="lg">
                            Marile Setrini Inmobiliaria
                        </Text>
                    </Paper>
                </GridCol>
            </Grid>
        </Container>
    )
}
