'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
    Container,
    Title,
    Table,
    Badge,
    Group,
    Button,
    ActionIcon,
    Text,
    Paper,
    Skeleton,
    Menu,
    Stack,
    TextInput,
} from '@mantine/core'
import {
    IconPlus,
    IconEdit,
    IconTrash,
    IconDots,
    IconEye,
    IconSearch,
} from '@tabler/icons-react'
import { motion } from 'framer-motion'
import type { Property } from '@/src/domain/entities/property'
import { transactionTypeLabels, propertyTypeLabels, currencyLabels } from '@/src/domain/entities/property'
import { notify, confirm } from '@/src/presentation/providers/notifications'

export default function AdminPropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const fetchProperties = async () => {
        try {
            const response = await fetch('/api/admin/properties')
            const data = await response.json()
            setProperties(data.data || [])
        } catch (error) {
            notify.error('Error al cargar propiedades')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProperties()
    }, [])

    const handleDelete = (property: Property) => {
        confirm({
            title: 'Eliminar propiedad',
            message: `¿Estás seguro de eliminar "${property.title}"? Esta acción no se puede deshacer.`,
            confirmLabel: 'Eliminar',
            confirmColor: 'red',
            onConfirm: async () => {
                try {
                    const response = await fetch(`/api/admin/properties/${property.id}`, {
                        method: 'DELETE',
                    })

                    if (!response.ok) throw new Error()

                    notify.success('Propiedad eliminada')
                    fetchProperties()
                } catch {
                    notify.error('Error al eliminar la propiedad')
                }
            },
        })
    }

    const filteredProperties = properties.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
    )

    const formatPrice = (price: number, currency: string) => {
        return `${currencyLabels[currency as keyof typeof currencyLabels]} ${new Intl.NumberFormat('es-AR').format(price)}`
    }

    return (
        <Container size="xl" py="xl">
            <Stack gap="lg">
                <Group justify="space-between">
                    <Title order={2}>Propiedades</Title>
                    <Button
                        component={Link}
                        href="/admin/propiedades/nueva"
                        leftSection={<IconPlus size={18} />}
                    >
                        Nueva propiedad
                    </Button>
                </Group>

                <Paper shadow="xs" p="md" radius="md" withBorder>
                    <TextInput
                        placeholder="Buscar por título..."
                        leftSection={<IconSearch size={18} />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        mb="md"
                    />

                    {loading ? (
                        <Stack gap="sm">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} height={50} />
                            ))}
                        </Stack>
                    ) : filteredProperties.length === 0 ? (
                        <Text c="dimmed" ta="center" py="xl">
                            No hay propiedades
                        </Text>
                    ) : (
                        <Table highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Título</Table.Th>
                                    <Table.Th>Tipo</Table.Th>
                                    <Table.Th>Operación</Table.Th>
                                    <Table.Th>Precio</Table.Th>
                                    <Table.Th>Estado</Table.Th>
                                    <Table.Th w={100}>Acciones</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {filteredProperties.map((property) => (
                                    <Table.Tr key={property.id}>
                                        <Table.Td>
                                            <Text lineClamp={1} maw={250}>
                                                {property.title}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            {property.propertyType
                                                ? propertyTypeLabels[property.propertyType]
                                                : '-'}
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge
                                                color={property.transactionType === 'VENTA' ? 'blue' : 'green'}
                                                variant="light"
                                            >
                                                {transactionTypeLabels[property.transactionType]}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            {formatPrice(property.price, property.currency)}
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge
                                                color={property.published ? 'green' : 'gray'}
                                                variant="filled"
                                            >
                                                {property.published ? 'Publicada' : 'Borrador'}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Menu position="bottom-end">
                                                <Menu.Target>
                                                    <ActionIcon variant="subtle">
                                                        <IconDots size={18} />
                                                    </ActionIcon>
                                                </Menu.Target>
                                                <Menu.Dropdown>
                                                    <Menu.Item
                                                        component={Link}
                                                        href={`/propiedades/${property.slug}`}
                                                        leftSection={<IconEye size={16} />}
                                                    >
                                                        Ver
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        component={Link}
                                                        href={`/admin/propiedades/${property.id}/editar`}
                                                        leftSection={<IconEdit size={16} />}
                                                    >
                                                        Editar
                                                    </Menu.Item>
                                                    <Menu.Divider />
                                                    <Menu.Item
                                                        color="red"
                                                        leftSection={<IconTrash size={16} />}
                                                        onClick={() => handleDelete(property)}
                                                    >
                                                        Eliminar
                                                    </Menu.Item>
                                                </Menu.Dropdown>
                                            </Menu>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    )}
                </Paper>
            </Stack>
        </Container>
    )
}
