'use client'

import { Badge, Group, ActionIcon, Box } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FilterChip {
    key: string
    label: string
    value: string
    color?: string
}

interface FilterChipsProps {
    chips: FilterChip[]
    onRemove: (key: string) => void
    onClear?: () => void
}

export function FilterChips({ chips, onRemove, onClear }: FilterChipsProps) {
    if (chips.length === 0) return null

    return (
        <Box mb="md">
            <Group gap="xs">
                <AnimatePresence mode="popLayout">
                    {chips.map((chip) => (
                        <motion.div
                            key={`${chip.key}-${chip.value}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            layout
                        >
                            <Badge
                                variant="light"
                                color={chip.color || 'blue'}
                                size="lg"
                                rightSection={
                                    <ActionIcon
                                        size="xs"
                                        color={chip.color || 'blue'}
                                        variant="transparent"
                                        onClick={() => onRemove(chip.key)}
                                        aria-label={`Quitar filtro ${chip.label}`}
                                    >
                                        <IconX size={12} />
                                    </ActionIcon>
                                }
                                style={{ paddingRight: 4 }}
                            >
                                {chip.label}: {chip.value}
                            </Badge>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {chips.length > 1 && onClear && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <Badge
                            variant="outline"
                            color="red"
                            size="lg"
                            style={{ cursor: 'pointer' }}
                            onClick={onClear}
                        >
                            Limpiar todo
                        </Badge>
                    </motion.div>
                )}
            </Group>
        </Box>
    )
}
