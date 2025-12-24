'use client'

import { useState, useRef, useEffect } from 'react'
import { TextInput, Paper, Stack, Text, Group, Loader, Box, UnstyledButton } from '@mantine/core'
import { IconSearch, IconMapPin } from '@tabler/icons-react'
import { useLocalitySearch } from '@/src/presentation/hooks/use-locality-search'
import { formatLocalidad, type Localidad } from '@/src/application/services/locality-search'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './locality-autocomplete.module.css'

interface LocalityAutocompleteProps {
    value?: string
    onChange: (localidad: Localidad | null) => void
    placeholder?: string
    label?: string
    size?: 'sm' | 'md' | 'lg'
}

export function LocalityAutocomplete({
    value,
    onChange,
    placeholder = 'Buscar localidad...',
    label,
    size = 'md',
}: LocalityAutocompleteProps) {
    const [inputValue, setInputValue] = useState(value || '')
    const [isOpen, setIsOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)
    const listRef = useRef<HTMLDivElement>(null)

    const { results, isLoading, search, clear } = useLocalitySearch(300)

    useEffect(() => {
        if (value) {
            setInputValue(value)
        }
    }, [value])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setInputValue(newValue)
        setHighlightedIndex(0)

        if (newValue.length >= 3) {
            search(newValue)
            setIsOpen(true)
        } else {
            clear()
            setIsOpen(false)
        }
    }

    const handleSelect = (localidad: Localidad) => {
        setInputValue(formatLocalidad(localidad))
        onChange(localidad)
        setIsOpen(false)
        clear()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || results.length === 0) return

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setHighlightedIndex((prev) =>
                    prev < results.length - 1 ? prev + 1 : 0
                )
                break
            case 'ArrowUp':
                e.preventDefault()
                setHighlightedIndex((prev) =>
                    prev > 0 ? prev - 1 : results.length - 1
                )
                break
            case 'Enter':
                e.preventDefault()
                if (results[highlightedIndex]) {
                    handleSelect(results[highlightedIndex])
                }
                break
            case 'Escape':
                setIsOpen(false)
                inputRef.current?.blur()
                break
        }
    }

    const handleBlur = () => {
        // Delay to allow click on option
        setTimeout(() => setIsOpen(false), 200)
    }

    // Highlight matching text
    const highlightMatch = (text: string) => {
        const query = inputValue.toLowerCase()
        const lowerText = text.toLowerCase()
        const index = lowerText.indexOf(query)

        if (index === -1) return text

        return (
            <>
                {text.slice(0, index)}
                <span className={styles.highlight}>
                    {text.slice(index, index + query.length)}
                </span>
                {text.slice(index + query.length)}
            </>
        )
    }

    return (
        <Box className={styles.container}>
            <TextInput
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => results.length > 0 && setIsOpen(true)}
                onBlur={handleBlur}
                placeholder={placeholder}
                label={label}
                size={size}
                leftSection={<IconSearch size={18} />}
                rightSection={isLoading ? <Loader size="xs" /> : null}
                autoComplete="off"
            />

            <AnimatePresence>
                {isOpen && results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                    >
                        <Paper
                            ref={listRef}
                            className={styles.dropdown}
                            shadow="md"
                            withBorder
                        >
                            <Stack gap={0}>
                                {results.map((loc, index) => (
                                    <UnstyledButton
                                        key={loc.id}
                                        className={`${styles.option} ${index === highlightedIndex ? styles.highlighted : ''
                                            }`}
                                        onClick={() => handleSelect(loc)}
                                        onMouseEnter={() => setHighlightedIndex(index)}
                                    >
                                        <Group gap="sm" wrap="nowrap">
                                            <IconMapPin
                                                size={16}
                                                className={styles.icon}
                                            />
                                            <Box>
                                                <Text size="sm" fw={500}>
                                                    {highlightMatch(loc.nombre)}
                                                </Text>
                                                <Text size="xs" c="dimmed">
                                                    {loc.departamento?.nombre && `${loc.departamento.nombre} - `}
                                                    {loc.provincia?.nombre}
                                                </Text>
                                            </Box>
                                        </Group>
                                    </UnstyledButton>
                                ))}
                            </Stack>
                        </Paper>
                    </motion.div>
                )}
            </AnimatePresence>

            {inputValue.length > 0 && inputValue.length < 3 && (
                <Text size="xs" c="dimmed" mt={4}>
                    Escribí al menos 3 caracteres para buscar
                </Text>
            )}
        </Box>
    )
}
