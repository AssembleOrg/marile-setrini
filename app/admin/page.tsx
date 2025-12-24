'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Loader, Center } from '@mantine/core'
import { useAuthStore } from '@/src/presentation/stores/auth-store'

export default function AdminPage() {
    const router = useRouter()
    const { isAdmin, isLoading, checkSession } = useAuthStore()

    useEffect(() => {
        checkSession()
    }, [])

    useEffect(() => {
        if (!isLoading) {
            if (isAdmin) {
                router.push('/admin/propiedades')
            } else {
                router.push('/admin/login')
            }
        }
    }, [isAdmin, isLoading, router])

    return (
        <Container py="xl">
            <Center h={300}>
                <Loader size="lg" />
            </Center>
        </Container>
    )
}
