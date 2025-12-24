'use client'

import { Container, Title, Text, Paper, Box } from '@mantine/core'
import { motion } from 'framer-motion'
import styles from './about-section.module.css'

export function AboutSection() {
    return (
        <Box component="section" className={styles.section}>
            <Container size="md">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <Paper className={styles.card} radius="xl" p="xl" withBorder>
                        <Title order={2} ta="center" mb="md" className={styles.title}>
                            Conocé Marile Setrini
                        </Title>
                        <Text className={styles.description} size="lg" ta="center">
                            Somos una Empresa conformada por un Staff de Jóvenes Profesionales,
                            quienes se capacitan permanentemente con el objetivo de estar al pie
                            de la vanguardia que el avance social y tecnológico requieren en la actualidad.
                        </Text>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    )
}
