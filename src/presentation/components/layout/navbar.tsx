'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
    Container,
    Group,
    Burger,
    Drawer,
    Stack,
    Button,
    Box,
    Text,
    UnstyledButton,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconLogin } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/src/presentation/stores/auth-store'
import styles from './navbar.module.css'

const links = [
    { href: '/', label: 'Inicio' },
    { href: '/propiedades', label: 'Propiedades' },
    { href: '/#contacto', label: 'Contacto' },
]

export function Navbar() {
    const [opened, { toggle, close }] = useDisclosure(false)
    const pathname = usePathname()
    const { user, isAdmin } = useAuthStore()

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/'
        return pathname.startsWith(href)
    }

    return (
        <Box component="header" className={styles.header}>
            <Container size="xl" className={styles.container}>
                <Group justify="space-between" h="100%">
                    {/* Logo */}
                    <Link href="/" className={styles.logo}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Image
                                src="/Logo 600x600px circulo amarillo2.png"
                                alt="Marile Setrini Inmobiliaria"
                                width={50}
                                height={50}
                                priority
                            />
                        </motion.div>
                        <Text fw={600} size="lg" visibleFrom="xs">
                            Marile Setrini
                        </Text>
                    </Link>

                    {/* Desktop Navigation */}
                    <Group gap="xl" visibleFrom="md">
                        {links.map((link) => (
                            <Link key={link.href} href={link.href} className={styles.link}>
                                <motion.span
                                    className={isActive(link.href) ? styles.active : ''}
                                    whileHover={{ y: -2 }}
                                >
                                    {link.label}
                                </motion.span>
                            </Link>
                        ))}
                    </Group>

                    {/* Auth Button */}
                    <Group gap="md">
                        {user && isAdmin ? (
                            <Button
                                component={Link}
                                href="/admin"
                                variant="light"
                                size="sm"
                                visibleFrom="sm"
                            >
                                Panel Admin
                            </Button>
                        ) : (
                            <Button
                                component={Link}
                                href="/admin/login"
                                variant="subtle"
                                size="sm"
                                leftSection={<IconLogin size={16} />}
                                visibleFrom="sm"
                            >
                                Ingresar
                            </Button>
                        )}

                        {/* Mobile Menu Toggle */}
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            hiddenFrom="md"
                            size="sm"
                        />
                    </Group>
                </Group>
            </Container>

            {/* Mobile Drawer */}
            <Drawer
                opened={opened}
                onClose={close}
                size="100%"
                padding="md"
                title={
                    <Group>
                        <Image
                            src="/Logo 600x600px circulo amarillo2.png"
                            alt="Marile Setrini"
                            width={40}
                            height={40}
                        />
                        <Text fw={600}>Marile Setrini</Text>
                    </Group>
                }
                hiddenFrom="md"
                zIndex={1000}
            >
                <Stack gap="lg" mt="xl">
                    {links.map((link) => (
                        <UnstyledButton
                            key={link.href}
                            component={Link}
                            href={link.href}
                            onClick={close}
                            className={styles.mobileLink}
                        >
                            <Text size="lg" fw={isActive(link.href) ? 600 : 400}>
                                {link.label}
                            </Text>
                        </UnstyledButton>
                    ))}

                    <Box mt="xl">
                        {user && isAdmin ? (
                            <Button
                                component={Link}
                                href="/admin"
                                fullWidth
                                onClick={close}
                            >
                                Panel Admin
                            </Button>
                        ) : (
                            <Button
                                component={Link}
                                href="/admin/login"
                                variant="outline"
                                fullWidth
                                leftSection={<IconLogin size={16} />}
                                onClick={close}
                            >
                                Ingresar
                            </Button>
                        )}
                    </Box>
                </Stack>
            </Drawer>
        </Box>
    )
}
