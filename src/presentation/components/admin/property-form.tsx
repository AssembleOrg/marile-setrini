'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Stack,
    TextInput,
    Textarea,
    Select,
    NumberInput,
    Switch,
    Button,
    Group,
    Box,
    Text,
    ActionIcon,
    Paper,
    Image,
    SimpleGrid,
    LoadingOverlay,
} from '@mantine/core'
import { IconPlus, IconTrash, IconDeviceFloppy, IconUpload, IconPhoto, IconX, IconStar, IconStarFilled } from '@tabler/icons-react'
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod/v4'
import slugify from 'slug'
import {
    TransactionType,
    PropertyType,
    Currency,
    transactionTypeLabels,
    propertyTypeLabels,
    currencyLabels,
} from '@/src/domain/entities/property'
import type { Property } from '@/src/domain/entities/property'
import { LocalityAutocomplete } from '@/src/presentation/components/ui/locality-autocomplete'
import { notify } from '@/src/presentation/providers/notifications'
import type { Localidad } from '@/src/application/services/locality-search'

const propertySchema = z.object({
    title: z.string().min(5, 'Título muy corto'),
    description: z.string().optional(),
    transactionType: z.nativeEnum(TransactionType),
    propertyType: z.nativeEnum(PropertyType).optional(),
    price: z.number().min(0, 'Precio inválido'),
    currency: z.nativeEnum(Currency),
    address: z.string().optional(),
    localidadId: z.string().optional(),
    localidadNombre: z.string().optional(),
    bedrooms: z.number().min(0).optional(),
    bathrooms: z.number().min(0).optional(),
    areaM2: z.number().min(0).optional(),
    images: z.array(z.string().url()).default([]),
    published: z.boolean().default(false),
    featured: z.boolean().default(false),
})

type PropertyFormData = z.infer<typeof propertySchema>

interface PropertyFormProps {
    property?: Property | null
}

export function PropertyForm({ property }: PropertyFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [imageUrls, setImageUrls] = useState<string[]>(property?.images || [])
    const [uploading, setUploading] = useState(false)

    const handleDrop = async (files: FileWithPath[]) => {
        setUploading(true)
        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData()
                formData.append('file', file)

                const response = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: formData,
                })

                if (!response.ok) {
                    const error = await response.json()
                    throw new Error(error.error || 'Error subiendo imagen')
                }

                const { publicUrl } = await response.json()
                return publicUrl
            })

            const newUrls = await Promise.all(uploadPromises)
            setImageUrls((prev) => [...prev, ...newUrls])
            notify.success(`${newUrls.length} imágenes subidas correctamente`)
        } catch (error) {
            console.error(error)
            notify.error('Error al subir imágenes')
        } finally {
            setUploading(false)
        }
    }

    const handleSetCover = (index: number) => {
        const newImages = [...imageUrls]
        const [selected] = newImages.splice(index, 1)
        newImages.unshift(selected)
        setImageUrls(newImages)
    }

    const handleRemoveImage = (index: number) => {
        const newImages = [...imageUrls]
        newImages.splice(index, 1)
        setImageUrls(newImages)
    }

    const isEditing = !!property

    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<PropertyFormData>({
        defaultValues: {
            title: property?.title || '',
            description: property?.description || '',
            transactionType: property?.transactionType || TransactionType.VENTA,
            propertyType: property?.propertyType || undefined,
            price: property?.price || 0,
            currency: property?.currency || Currency.ARS,
            address: property?.address || '',
            localidadId: property?.localidadId || undefined,
            localidadNombre: property?.localidadNombre || undefined,
            bedrooms: property?.bedrooms || undefined,
            bathrooms: property?.bathrooms || undefined,
            areaM2: property?.areaM2 || undefined,
            published: property?.published || false,
            featured: property?.featured || false,
        },
    })

    const onSubmit = async (data: PropertyFormData) => {
        setLoading(true)
        try {
            const slug = property?.slug || slugify(data.title, { lower: true })

            const payload = {
                ...data,
                slug,
                images: imageUrls,
            }

            const url = isEditing
                ? `/api/admin/properties/${property.id}`
                : '/api/admin/properties'

            const response = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Error al guardar')
            }

            notify.success(isEditing ? 'Propiedad actualizada' : 'Propiedad creada')
            router.push('/admin/propiedades')
        } catch (error) {
            notify.error((error as Error).message || 'Error al guardar la propiedad')
        } finally {
            setLoading(false)
        }
    }



    const handleLocalityChange = (loc: Localidad | null) => {
        setValue('localidadId', loc?.id || undefined)
        setValue('localidadNombre', loc?.nombre || undefined)
    }

    const propertyTypeOptions = Object.values(PropertyType).map((type) => ({
        value: type,
        label: propertyTypeLabels[type],
    }))

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="md">
                <TextInput
                    label="Título"
                    placeholder="Hermosa casa en..."
                    {...register('title')}
                    error={errors.title?.message}
                    required
                />

                <Textarea
                    label="Descripción"
                    placeholder="Descripción detallada de la propiedad..."
                    minRows={4}
                    {...register('description')}
                />

                <Group grow>
                    <Controller
                        name="transactionType"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Operación"
                                data={[
                                    { value: TransactionType.VENTA, label: transactionTypeLabels[TransactionType.VENTA] },
                                    { value: TransactionType.ALQUILER, label: transactionTypeLabels[TransactionType.ALQUILER] },
                                ]}
                                {...field}
                                required
                            />
                        )}
                    />

                    <Controller
                        name="propertyType"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Tipo de propiedad"
                                placeholder="Seleccionar..."
                                data={propertyTypeOptions}
                                clearable
                                {...field}
                                value={field.value || null}
                            />
                        )}
                    />
                </Group>

                <Group grow>
                    <Controller
                        name="price"
                        control={control}
                        render={({ field }) => (
                            <NumberInput
                                label="Precio"
                                min={0}
                                thousandSeparator="."
                                decimalSeparator=","
                                {...field}
                                error={errors.price?.message}
                                required
                            />
                        )}
                    />

                    <Controller
                        name="currency"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Moneda"
                                data={[
                                    { value: Currency.ARS, label: currencyLabels[Currency.ARS] },
                                    { value: Currency.USD, label: currencyLabels[Currency.USD] },
                                ]}
                                {...field}
                                required
                            />
                        )}
                    />
                </Group>

                <TextInput
                    label="Dirección"
                    placeholder="Av. Ejemplo 1234"
                    {...register('address')}
                />

                <LocalityAutocomplete
                    value={watch('localidadNombre')}
                    onChange={handleLocalityChange}
                    label="Localidad"
                    placeholder="Buscar localidad..."
                />

                <Group grow>
                    <Controller
                        name="bedrooms"
                        control={control}
                        render={({ field }) => (
                            <NumberInput
                                label="Dormitorios"
                                min={0}
                                {...field}
                            />
                        )}
                    />

                    <Controller
                        name="bathrooms"
                        control={control}
                        render={({ field }) => (
                            <NumberInput
                                label="Baños"
                                min={0}
                                {...field}
                            />
                        )}
                    />

                    <Controller
                        name="areaM2"
                        control={control}
                        render={({ field }) => (
                            <NumberInput
                                label="Superficie (m²)"
                                min={0}
                                {...field}
                            />
                        )}
                    />
                </Group>

                {/* Images Upload */}
                <Box>
                    <Text size="sm" fw={500} mb="xs">
                        Imágenes
                    </Text>
                    <Paper withBorder p="md" radius="md" mb="md">
                        <Dropzone
                            onDrop={handleDrop}
                            onReject={() => notify.error('Archivo no soportado')}
                            maxSize={5 * 1024 ** 2} // 5MB
                            accept={IMAGE_MIME_TYPE}
                            loading={uploading}
                        >
                            <Group justify="center" gap="xl" mih={120} style={{ pointerEvents: 'none' }}>
                                <Dropzone.Accept>
                                    <IconUpload
                                        style={{ width: 52, height: 52, color: 'var(--mantine-color-blue-6)' }}
                                        stroke={1.5}
                                    />
                                </Dropzone.Accept>
                                <Dropzone.Reject>
                                    <IconX
                                        style={{ width: 52, height: 52, color: 'var(--mantine-color-red-6)' }}
                                        stroke={1.5}
                                    />
                                </Dropzone.Reject>
                                <Dropzone.Idle>
                                    <IconPhoto
                                        style={{ width: 52, height: 52, color: 'var(--mantine-color-dimmed)' }}
                                        stroke={1.5}
                                    />
                                </Dropzone.Idle>

                                <div>
                                    <Text size="xl" inline>
                                        Arrastrá imágenes aquí o hacé click para seleccionar
                                    </Text>
                                    <Text size="sm" c="dimmed" inline mt={7}>
                                        Archivos soportados: JPG, PNG, WEBP (Max 5MB)
                                    </Text>
                                </div>
                            </Group>
                        </Dropzone>
                    </Paper>

                    {imageUrls.length > 0 && (
                        <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="sm">
                            {imageUrls.map((url, index) => (
                                <Paper key={url} withBorder radius="md" style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1/1' }}>
                                    <Image
                                        src={url}
                                        alt={`Imagen ${index + 1}`}
                                        w="100%"
                                        h="100%"
                                        fit="cover"
                                    />

                                    {/* Cover Badge */}
                                    {index === 0 && (
                                        <Box
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                background: 'var(--brand-gold)',
                                                color: 'white',
                                                padding: '4px 8px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                zIndex: 10,
                                                borderBottomRightRadius: '8px',
                                            }}
                                        >
                                            PORTADA
                                        </Box>
                                    )}

                                    {/* Actions Overlay */}
                                    <Box
                                        className="image-actions"
                                        style={{
                                            position: 'absolute',
                                            top: 5,
                                            right: 5,
                                            display: 'flex',
                                            gap: 5,
                                        }}
                                    >
                                        <ActionIcon
                                            variant="filled"
                                            color={index === 0 ? 'yellow' : 'gray'}
                                            onClick={() => handleSetCover(index)}
                                            title="Establecer como portada"
                                            size="sm"
                                        >
                                            {index === 0 ? <IconStarFilled size={14} /> : <IconStar size={14} />}
                                        </ActionIcon>

                                        <ActionIcon
                                            variant="filled"
                                            color="red"
                                            onClick={() => handleRemoveImage(index)}
                                            title="Eliminar imagen"
                                            size="sm"
                                        >
                                            <IconTrash size={14} />
                                        </ActionIcon>
                                    </Box>
                                </Paper>
                            ))}
                        </SimpleGrid>
                    )}
                </Box>

                <Group>
                    <Controller
                        name="published"
                        control={control}
                        render={({ field: { value, ...field } }) => (
                            <Switch
                                label="Publicada"
                                description="Visible en el sitio público"
                                checked={value}
                                {...field}
                            />
                        )}
                    />

                    <Controller
                        name="featured"
                        control={control}
                        render={({ field: { value, ...field } }) => (
                            <Switch
                                label="Destacada"
                                description="Mostrar en inicio"
                                checked={value}
                                {...field}
                            />
                        )}
                    />
                </Group>

                <Group justify="flex-end" mt="xl">
                    <Button
                        variant="light"
                        onClick={() => router.back()}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        leftSection={<IconDeviceFloppy size={18} />}
                        loading={loading}
                    >
                        {isEditing ? 'Guardar cambios' : 'Crear propiedad'}
                    </Button>
                </Group>
            </Stack>
        </form>
    )
}
