'use client'

import { SegmentedControl, Box } from '@mantine/core'
import { TransactionType, transactionTypeLabels } from '@/src/domain/entities/property'
import styles from './operation-toggle.module.css'

interface OperationToggleProps {
    value: TransactionType
    onChange: (value: TransactionType) => void
    size?: 'xs' | 'sm' | 'md' | 'lg'
    fullWidth?: boolean
}

export function OperationToggle({
    value,
    onChange,
    size = 'md',
    fullWidth = false,
}: OperationToggleProps) {
    return (
        <Box>
            <SegmentedControl
                value={value}
                onChange={(val) => onChange(val as TransactionType)}
                data={[
                    { value: TransactionType.VENTA, label: transactionTypeLabels[TransactionType.VENTA] },
                    { value: TransactionType.ALQUILER, label: transactionTypeLabels[TransactionType.ALQUILER] },
                ]}
                size={size}
                fullWidth={fullWidth}
                color="brand"
                radius="lg"
                classNames={{
                    root: styles.root,
                    indicator: styles.indicator,
                    label: styles.label,
                }}
            />
        </Box>
    )
}
