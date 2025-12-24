'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
    Container,
    Group,
    Stack,
    Text,
    Anchor,
    Divider,
    Box,
    ActionIcon,
    SimpleGrid,
} from '@mantine/core'
import {
    IconPhone,
    IconBrandFacebook,
    IconBrandInstagram,
    IconBrandWhatsapp,
    IconExternalLink,
    IconMapPin,
} from '@tabler/icons-react'
import { motion } from 'framer-motion'
import styles from './footer.module.css'

const socialLinks = [
    {
        icon: IconBrandFacebook,
        href: 'https://www.facebook.com/inmobiliaria.marile/',
        label: 'Facebook',
        color: '#1877f2',
    },
    {
        icon: IconBrandInstagram,
        href: 'https://www.instagram.com/marile_setrini_inmobiliaria',
        label: 'Instagram',
        color: '#e4405f',
    },
    {
        icon: IconBrandWhatsapp,
        href: 'https://wa.me/5491163975246',
        label: 'WhatsApp',
        color: '#25d366',
    },
]

const quickLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/propiedades', label: 'Propiedades' },
    { href: '/propiedades?operation=VENTA', label: 'Venta' },
    { href: '/propiedades?operation=ALQUILER', label: 'Alquiler' },
]

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <Box component="footer" className={styles.footer}>
            <Container size="xl" py="xl">
                <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
                    {/* Brand & Description */}
                    <Stack gap="md">
                        <Group gap="sm">
                            <Image
                                src="/Logo 600x600px circulo amarillo2.png"
                                alt="Marile Setrini"
                                width={45}
                                height={45}
                            />
                            <Text fw={600} size="lg">
                                Marile Setrini
                            </Text>
                        </Group>
                        <Text size="sm" c="gray.7" maw={250}>
                            Tu inmobiliaria de confianza. Encontrá tu próximo hogar con nosotros.
                        </Text>
                        <Group gap="xs">
                            {socialLinks.map((social) => (
                                <motion.div
                                    key={social.label}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ActionIcon
                                        component="a"
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        variant="subtle"
                                        color="gray"
                                        size="lg"
                                        aria-label={social.label}
                                    >
                                        <social.icon size={20} />
                                    </ActionIcon>
                                </motion.div>
                            ))}
                        </Group>
                    </Stack>

                    {/* Quick Links */}
                    <Stack gap="sm">
                        <Text fw={600} size="sm" tt="uppercase" c="gray.8">
                            Navegación
                        </Text>
                        {quickLinks.map((link) => (
                            <Anchor
                                key={link.href}
                                component={Link}
                                href={link.href}
                                size="sm"
                                c="gray.8"
                                underline="hover"
                            >
                                {link.label}
                            </Anchor>
                        ))}
                    </Stack>

                    {/* Contact Info */}
                    <Stack gap="sm">
                        <Text fw={600} size="sm" tt="uppercase" c="gray.8">
                            Contacto
                        </Text>
                        <Group gap="xs">
                            <IconPhone size={16} />
                            <Anchor href="tel:01142870216" size="sm" c="gray.8">
                                011 4287-0216
                            </Anchor>
                        </Group>
                        <Group gap="xs">
                            <IconBrandWhatsapp size={16} />
                            <Anchor
                                href="https://wa.me/5491163975246"
                                target="_blank"
                                size="sm"
                                c="gray.8"
                            >
                                +54 9 11 6397-5246
                            </Anchor>
                        </Group>
                        <Group gap="xs" align="flex-start">
                            <IconMapPin size={16} style={{ marginTop: 3 }} />
                            <Anchor
                                href="https://maps.app.goo.gl/i7Ktf8WW8nHDXJ9Y7"
                                target="_blank"
                                size="sm"
                                c="gray.8"
                                maw={180}
                            >
                                Ver ubicación en Google Maps
                            </Anchor>
                        </Group>
                    </Stack>

                    {/* Links */}
                    <Stack gap="sm">
                        <Text fw={600} size="sm" tt="uppercase" c="gray.8">
                            Más
                        </Text>
                        <Anchor
                            href="https://linktr.ee/marileSetrini"
                            target="_blank"
                            size="sm"
                            c="gray.8"
                        >
                            <Group gap={4}>
                                Linktree
                                <IconExternalLink size={14} />
                            </Group>
                        </Anchor>
                    </Stack>
                </SimpleGrid>

                <Divider my="xl" />

                <Group justify="space-between" wrap="wrap">
                    <Text size="xs" c="gray.8">
                        © {currentYear} Marile Setrini Inmobiliaria. Todos los derechos reservados.
                    </Text>
                    {/* <Text size="xs" c="dimmed">
                        Desarrollado con ❤️
                    </Text> */}
                </Group>
            </Container>
        </Box>
    )
}
