'use client'

import { Box, Container, Title, Text } from '@mantine/core'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { SearchForm } from './search-form'
import styles from './hero.module.css'

export function Hero() {
    const { scrollY } = useScroll()
    const y = useTransform(scrollY, [0, 500], [0, 150])
    const opacity = useTransform(scrollY, [500, 1200], [1, 0]) // Desvanece mucho más tarde (entre 500px y 1200px)

    return (
        <Box className={styles.hero}>
            {/* Parallax Background Image */}
            <motion.div
                className={styles.backgroundImage}
                style={{ y }}
            >
                <Image
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85"
                    alt="Propiedad destacada"
                    fill
                    priority
                    fetchPriority="high"
                    sizes="100vw"
                    quality={85}
                    className={styles.heroImage}
                />
                <div className={styles.imageOverlay} />
                <div className={styles.noiseTexture} />
            </motion.div>

            {/* Content */}
            <Container size="lg" className={styles.container}>
                <motion.div
                    style={{ opacity }}
                    className={styles.content}
                >
                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className={styles.titleWrapper}
                    >
                        <Title className={styles.title}>
                            Encontrá tu deseo
                            <br />
                        </Title>
                    </motion.div>

                    {/* Subtitle */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className={styles.subtitleWrapper}
                    >
                        <Text className={styles.subtitle}>
                            Propiedades exclusivas en las mejores zonas con atención personalizada
                        </Text>
                    </motion.div>

                    {/* Glass Search Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className={styles.searchWrapper}
                    >
                        <SearchForm />
                    </motion.div>
                </motion.div>
            </Container>
        </Box>
    )
}
