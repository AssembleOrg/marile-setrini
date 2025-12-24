'use client'

import { Container, Title, Text, Paper, Box } from '@mantine/core'
import { motion } from 'framer-motion'
import styles from './map-section.module.css'

export function MapSection() {
    return (
        <Box component="section" className={styles.section}>
            <Container size="xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <Title order={2} ta="center" mb="md">
                        Visitanos
                    </Title>
                    <Text c="dimmed" ta="center" maw={600} mx="auto" mb="xl">
                        Vení a nuestra oficina para conocernos y explorar las mejores opciones de propiedades
                    </Text>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Paper shadow="md" radius="lg" className={styles.mapContainer} withBorder>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d32374.341039637617!2d-58.29243190800187!3d-34.81667325005662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a32c6576ccd7d7%3A0x974a5b50b2ad294a!2sInmobiliaria%20Marile%20Setrini%20(casa%20central)%20Inmobiliarias%20en%20Florencio%20Varela!5e0!3m2!1ses!2sar!4v1766388118145!5m2!1ses!2sar"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Marile Setrini Inmobiliaria - Ubicación"
                        />
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    )
}
