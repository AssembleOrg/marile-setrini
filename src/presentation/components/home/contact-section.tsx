'use client'

import { useState } from 'react'
import {
    Container,
    Grid,
    GridCol,
    Paper,
    Title,
    Text,
    TextInput,
    Textarea,
    Button,
    Stack,
    Group,
    Box,
    ActionIcon,
    Anchor,
} from '@mantine/core'
import {
    IconPhone,
    IconBrandWhatsapp,
    IconBrandFacebook,
    IconBrandInstagram,
    IconMail,
    IconMapPin,
    IconSend,
    IconExternalLink,
} from '@tabler/icons-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { motion } from 'framer-motion'
import { notify } from '@/src/presentation/providers/notifications'
import styles from './contact-section.module.css'

const contactSchema = z.object({
    name: z.string().min(2, 'Nombre muy corto'),
    email: z.email('Email inválido'),
    phone: z.string().optional(),
    message: z.string().min(10, 'Mensaje muy corto'),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactSection() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>()

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true)
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!response.ok) throw new Error('Error al enviar')

            notify.success('¡Mensaje enviado! Te contactaremos pronto.')
            reset()
        } catch {
            notify.error('Error al enviar el mensaje. Intentá nuevamente.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const whatsappMessage = encodeURIComponent(
        'Hola! Me gustaría obtener más información sobre sus propiedades.'
    )
    const whatsappLink = `https://wa.me/5491163975246?text=${whatsappMessage}`

    return (
        <Box component="section" id="contacto" className={styles.section}>
            <Container size="xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <Title order={2} ta="center" mb="md">
                        Contactanos
                    </Title>
                    <Text c="dimmed" ta="center" maw={600} mx="auto" mb="xl">
                        ¿Tenés alguna consulta? Estamos para ayudarte a encontrar tu próxima propiedad.
                    </Text>
                </motion.div>

                <Grid gutter="xl">
                    {/* Contact Form */}
                    <GridCol span={{ base: 12, md: 7 }}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <Paper shadow="sm" radius="lg" p="xl" withBorder>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Stack gap="md">
                                        <TextInput
                                            label="Nombre"
                                            placeholder="Tu nombre"
                                            {...register('name')}
                                            error={errors.name?.message}
                                            required
                                        />
                                        <Group grow>
                                            <TextInput
                                                label="Email"
                                                placeholder="tu@email.com"
                                                type="email"
                                                {...register('email')}
                                                error={errors.email?.message}
                                                required
                                            />
                                            <TextInput
                                                label="Teléfono"
                                                placeholder="(opcional)"
                                                {...register('phone')}
                                            />
                                        </Group>
                                        <Textarea
                                            label="Mensaje"
                                            placeholder="¿En qué podemos ayudarte?"
                                            minRows={4}
                                            {...register('message')}
                                            error={errors.message?.message}
                                            required
                                        />
                                        <Group justify="space-between" mt="md">
                                            <Button
                                                component="a"
                                                href={whatsappLink}
                                                target="_blank"
                                                variant="light"
                                                color="green"
                                                leftSection={<IconBrandWhatsapp size={18} />}
                                            >
                                                Escribir por WhatsApp
                                            </Button>
                                            <Button
                                                type="submit"
                                                leftSection={<IconSend size={18} />}
                                                loading={isSubmitting}
                                            >
                                                Enviar mensaje
                                            </Button>
                                        </Group>
                                    </Stack>
                                </form>
                            </Paper>
                        </motion.div>
                    </GridCol>

                    {/* Contact Info */}
                    <GridCol span={{ base: 12, md: 5 }}>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Stack gap="lg">
                                {/* Phone */}
                                <Paper shadow="sm" radius="md" p="lg" withBorder className={styles.infoCard}>
                                    <Group>
                                        <Box className={styles.iconBox}>
                                            <IconPhone size={24} />
                                        </Box>
                                        <div>
                                            <Text size="sm" c="dimmed">Teléfono</Text>
                                            <Anchor href="tel:01142870216" fw={500}>
                                                011 4287-0216
                                            </Anchor>
                                        </div>
                                    </Group>
                                </Paper>

                                {/* WhatsApp */}
                                <Paper shadow="sm" radius="md" p="lg" withBorder className={styles.infoCard}>
                                    <Group>
                                        <Box className={styles.iconBox} style={{ background: '#25d366' }}>
                                            <IconBrandWhatsapp size={24} color="white" />
                                        </Box>
                                        <div>
                                            <Text size="sm" c="dimmed">WhatsApp</Text>
                                            <Anchor href={whatsappLink} target="_blank" fw={500}>
                                                +54 9 11 6397-5246
                                            </Anchor>
                                        </div>
                                    </Group>
                                </Paper>

                                {/* Location */}
                                <Paper shadow="sm" radius="md" p="lg" withBorder className={styles.infoCard}>
                                    <Group align="flex-start">
                                        <Box className={styles.iconBox}>
                                            <IconMapPin size={24} />
                                        </Box>
                                        <div>
                                            <Text size="sm" c="dimmed">Ubicación</Text>
                                            <Anchor
                                                href="https://maps.app.goo.gl/i7Ktf8WW8nHDXJ9Y7"
                                                target="_blank"
                                                fw={500}
                                            >
                                                Ver en Google Maps <IconExternalLink size={14} style={{ verticalAlign: 'middle' }} />
                                            </Anchor>
                                        </div>
                                    </Group>
                                </Paper>

                                {/* Social */}
                                {/* <Paper shadow="sm" radius="md" p="lg" withBorder>
                                    <Text size="sm" c="dimmed" mb="sm">Seguinos en redes</Text>
                                    <Group gap="sm">
                                        <ActionIcon
                                            component="a"
                                            href="https://www.facebook.com/inmobiliaria.marile/"
                                            target="_blank"
                                            size="lg"
                                            variant="light"
                                            color="blue"
                                        >
                                            <IconBrandFacebook size={20} />
                                        </ActionIcon>
                                        <ActionIcon
                                            component="a"
                                            href="https://www.instagram.com/marile_setrini_inmobiliaria"
                                            target="_blank"
                                            size="lg"
                                            variant="light"
                                            color="pink"
                                        >
                                            <IconBrandInstagram size={20} />
                                        </ActionIcon>
                                        <ActionIcon
                                            component="a"
                                            href="https://wa.me/5491163975246"
                                            target="_blank"
                                            size="lg"
                                            variant="light"
                                            color="green"
                                        >
                                            <IconBrandWhatsapp size={20} />
                                        </ActionIcon>
                                    </Group>
                                </Paper> */}
                            </Stack>
                        </motion.div>
                    </GridCol>
                </Grid>
            </Container>
        </Box>
    )
}
