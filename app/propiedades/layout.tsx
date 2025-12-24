import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Propiedades',
    description: 'Explorá nuestra selección de propiedades en venta y alquiler. Casas, departamentos, terrenos y más.',
}

export default function PropertiesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
