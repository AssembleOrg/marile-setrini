'use client'

import { notifications } from '@mantine/notifications'
import { modals } from '@mantine/modals'
import { IconCheck, IconX, IconInfoCircle, IconAlertTriangle } from '@tabler/icons-react'
import { createElement } from 'react'

export interface NotifyOptions {
  title?: string
  autoClose?: number | boolean
  withCloseButton?: boolean
}

export interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: string
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
}

const defaultOptions: NotifyOptions = {
  autoClose: 5000,
  withCloseButton: true,
}

export const notify = {
  success: (message: string, options?: NotifyOptions) => {
    notifications.show({
      ...defaultOptions,
      ...options,
      title: options?.title || 'Éxito',
      message,
      color: 'green',
      icon: createElement(IconCheck, { size: 18 }),
    })
  },

  error: (message: string, options?: NotifyOptions) => {
    notifications.show({
      ...defaultOptions,
      autoClose: 8000,
      ...options,
      title: options?.title || 'Error',
      message,
      color: 'red',
      icon: createElement(IconX, { size: 18 }),
    })
  },

  info: (message: string, options?: NotifyOptions) => {
    notifications.show({
      ...defaultOptions,
      ...options,
      title: options?.title || 'Información',
      message,
      color: 'blue',
      icon: createElement(IconInfoCircle, { size: 18 }),
    })
  },

  warning: (message: string, options?: NotifyOptions) => {
    notifications.show({
      ...defaultOptions,
      ...options,
      title: options?.title || 'Atención',
      message,
      color: 'yellow',
      icon: createElement(IconAlertTriangle, { size: 18 }),
    })
  },

  loading: (message: string, options?: NotifyOptions) => {
    return notifications.show({
      ...options,
      title: options?.title || 'Procesando',
      message,
      loading: true,
      autoClose: false,
      withCloseButton: false,
    })
  },

  update: (id: string, updates: { message: string; title?: string; loading?: boolean; color?: string }) => {
    notifications.update({
      id,
      ...updates,
    })
  },

  hide: (id: string) => {
    notifications.hide(id)
  },
}

export const confirm = (options: ConfirmOptions) => {
  modals.openConfirmModal({
    title: options.title,
    children: createElement('p', null, options.message),
    labels: {
      confirm: options.confirmLabel || 'Confirmar',
      cancel: options.cancelLabel || 'Cancelar',
    },
    confirmProps: { color: options.confirmColor || 'red' },
    onConfirm: options.onConfirm,
    onCancel: options.onCancel,
  })
}

export const alert = (title: string, message: string) => {
  modals.open({
    title,
    children: createElement('p', null, message),
  })
}
