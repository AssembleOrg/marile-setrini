'use client'

import { MantineProvider, ColorSchemeScript } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'
import { NavigationProgress } from '@mantine/nprogress'
import { theme } from './theme'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ColorSchemeScript defaultColorScheme="light" />
            <MantineProvider theme={theme} defaultColorScheme="light">
                <ModalsProvider>
                    <NavigationProgress />
                    <Notifications position="top-right" zIndex={2077} />
                    {children}
                </ModalsProvider>
            </MantineProvider>
        </>
    )
}
