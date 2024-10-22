import styled from '@emotion/styled'
import { Button } from '@mui/material'
import type { ReactNode } from 'react'
import toast, { type Toast, type ToastOptions, type ToastType } from 'react-hot-toast'

interface ToastProps extends ToastOptions {
  disableClickDismiss?: boolean
  disableVibrate?: boolean
  dismissButton?: boolean
  type?: ToastType
}

/**
 * Function to display a toast notification.
 * @param message - The message to display in the toast notification.
 * @param type - The type of toast notification to display.
 * @param toastOptions - Additional options to configure the toast notification.
 * @returns {void}
 */
export const showToast = (
  message: string | ReactNode,
  { type, disableClickDismiss, disableVibrate, dismissButton, ...toastOptions }: ToastProps = {} as ToastProps
): void => {
  // Selects the appropriate toast function based on the specified type or defaults to success.
  const toastFunction = {
    error: toast.error,
    success: toast.success,
    loading: toast.loading,
    blank: toast,
    custom: toast.custom
  }[type || 'success']

  // Vibrates the device based on the toast type, unless disabled or not supported.
  if (!disableVibrate && 'vibrate' in navigator) {
    const vibrationPattern = type === 'error' ? [100, 50, 100] : [100]
    try {
      navigator.vibrate(vibrationPattern)
    } catch (err) {
      console.log(err)
    }
  }

  // Display the toast notification.
  toastFunction(
    (t: Toast) => (
      <div onClick={!disableClickDismiss && !dismissButton ? () => toast.dismiss(t.id) : undefined}>
        {message}
        {dismissButton && (
          <div>
            <DismissButton onClick={() => toast.dismiss(t.id)}>Dismiss</DismissButton>
          </div>
        )}
      </div>
    ),
    {
      ...toastOptions // Passes any additional toast options.
    }
  )
}

const DismissButton = styled(Button)<{ variant?: 'text' | 'outlined' | 'contained' }>`
  width: 100%;
  padding: 12px 24px;
  border-radius: 16px;
  margin-top: 8px;
  font-size: 16px;
  ${({ variant }) => {
    switch (variant) {
      case 'outlined':
        return `
          color: black;
          border: 2px solid black;
        `
      case 'contained':
        return `
          color: white;
          background-color: black;
        `
      case 'text':
      default:
        return `
          color: black;
        `
    }
  }}
`
