'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Container,
    Paper,
    Title,
    TextInput,
    PasswordInput,
    Button,
    Stack,
    Text,
    Box,
    Center,
} from '@mantine/core'
import { IconMail, IconLock } from '@tabler/icons-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { supabase } from '@/src/infrastructure/auth/supabase'
import { notify } from '@/src/presentation/providers/notifications'
import { useAuthStore } from '@/src/presentation/stores/auth-store'

const loginSchema = z.object({
    email: z.email('Email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function AdminLoginPage() {
    const router = useRouter()
    const { checkSession } = useAuthStore()
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>()

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true)
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            })

            if (error) {
                notify.error(error.message || 'Error al iniciar sesión')
                return
            }

            await checkSession()

            // Verificar si es admin realmente
            const isAdmin = useAuthStore.getState().isAdmin
            if (!isAdmin) {
                notify.error('No tienes permisos de administrador')
                await supabase.auth.signOut()
                return
            }

            notify.success('¡Bienvenido!')
            router.refresh() // Validar cookie en servidor
            router.push('/admin')
        } catch (error) {
            notify.error('Error al iniciar sesión')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container size="xs" py="xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Center mb="xl">
                    <Image
                        src="/Logo 600x600px circulo amarillo2.png"
                        alt="Marile Setrini"
                        width={80}
                        height={80}
                    />
                </Center>

                <Paper shadow="md" p="xl" radius="lg" withBorder>
                    <Title order={2} ta="center" mb="xs">
                        Panel de Administración
                    </Title>
                    <Text c="dimmed" ta="center" mb="xl">
                        Ingresá tus credenciales para continuar
                    </Text>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack gap="md">
                            <TextInput
                                label="Email"
                                placeholder="admin@example.com"
                                leftSection={<IconMail size={18} />}
                                {...register('email')}
                                error={errors.email?.message}
                                size="md"
                            />

                            <PasswordInput
                                label="Contraseña"
                                placeholder="••••••••"
                                leftSection={<IconLock size={18} />}
                                {...register('password')}
                                error={errors.password?.message}
                                size="md"
                            />

                            <Button
                                type="submit"
                                fullWidth
                                size="md"
                                loading={loading}
                                mt="md"
                            >
                                Ingresar
                            </Button>
                        </Stack>
                    </form>
                </Paper>

                <Text c="dimmed" ta="center" size="sm" mt="xl">
                    Solo usuarios autorizados
                </Text>
            </motion.div>
        </Container>
    )
}
