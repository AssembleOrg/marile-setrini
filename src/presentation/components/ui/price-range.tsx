'use client'

import { useState, useEffect } from 'react'
import { Box, Text, Group, NumberInput, Stack, RangeSlider, Input, MantineSize } from '@mantine/core'
import { Currency, currencyLabels } from '@/src/domain/entities/property'

interface PriceRangeProps {
    minValue?: number
    maxValue?: number
    currency: Currency
    onChange: (min: number | undefined, max: number | undefined) => void
    label?: string
    size?: MantineSize
}

export function PriceRange({
    minValue,
    maxValue,
    currency,
    onChange,
    label,
    size = 'sm',
}: PriceRangeProps) {
    const [min, setMin] = useState<number | string>(minValue || '')
    const [max, setMax] = useState<number | string>(maxValue || '')

    useEffect(() => {
        setMin(minValue || '')
        setMax(maxValue || '')
    }, [minValue, maxValue])

    const handleMinChange = (value: number | string) => {
        setMin(value)
        const numValue = typeof value === 'number' ? value : undefined
        onChange(numValue, typeof max === 'number' ? max : undefined)
    }

    const handleMaxChange = (value: number | string) => {
        setMax(value)
        const numValue = typeof value === 'number' ? value : undefined
        onChange(typeof min === 'number' ? min : undefined, numValue)
    }

    const currencyPrefix = currency === Currency.USD ? 'USD ' : 'ARS '

    return (
        <Input.Wrapper label={label} size={size}>
            <Group grow>
                <NumberInput
                    placeholder="Mín"
                    value={min}
                    onChange={handleMinChange}
                    min={0}
                    step={10000}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix={currencyPrefix}
                    size={size}
                    hideControls
                />
                <NumberInput
                    placeholder="Máx"
                    value={max}
                    onChange={handleMaxChange}
                    min={0}
                    step={10000}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix={currencyPrefix}
                    size={size}
                    hideControls
                />
            </Group>
        </Input.Wrapper>
    )
}
