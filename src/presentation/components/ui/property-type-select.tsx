'use client'

import { MultiSelect, Chip, Group, Stack, Text, Box, MantineSize } from '@mantine/core'
import { PropertyType, propertyTypeLabels } from '@/src/domain/entities/property'

interface PropertyTypeSelectProps {
    value: PropertyType[]
    onChange: (value: PropertyType[]) => void
    variant?: 'select' | 'chips'
    label?: string
    size?: MantineSize
}

const propertyTypeOptions = Object.values(PropertyType).map((type) => ({
    value: type,
    label: propertyTypeLabels[type],
}))

export function PropertyTypeSelect({
    value,
    onChange,
    variant = 'select',
    label,
    size = 'sm',
}: PropertyTypeSelectProps) {
    if (variant === 'chips') {
        return (
            <Box>
                {label && (
                    <Text size="sm" fw={500} mb="xs">
                        {label}
                    </Text>
                )}
                <Group gap="xs">
                    {propertyTypeOptions.map((option) => (
                        <Chip
                            key={option.value}
                            checked={value.includes(option.value)}
                            onChange={() => {
                                if (value.includes(option.value)) {
                                    onChange(value.filter((v) => v !== option.value))
                                } else {
                                    onChange([...value, option.value])
                                }
                            }}
                            variant="outline"
                            size={size}
                        >
                            {option.label}
                        </Chip>
                    ))}
                </Group>
            </Box>
        )
    }

    return (
        <MultiSelect
            label={label}
            placeholder="Tipo de propiedad"
            data={propertyTypeOptions}
            value={value}
            onChange={(vals) => onChange(vals as PropertyType[])}
            clearable
            searchable
            maxDropdownHeight={250}
            size={size}
        />
    )
}
