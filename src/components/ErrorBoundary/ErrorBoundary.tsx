import {
  DataObjectRounded,
  DeleteForeverRounded,
  DescriptionRounded,
  ErrorOutlineRounded,
  FileDownload,
  RefreshRounded
} from '@mui/icons-material'
import { AccordionDetails, AccordionSummary, Alert, Button, Typography } from '@mui/material'

import React, { type ErrorInfo } from 'react'

import { UserContext } from '../../contexts/UserContext'
import { exportTasksToJson, showToast } from '../../utils'
import {
  ContainerBoundary,
  ErrorAccordion,
  ErrorExpandIcon,
  ErrorHeader,
  ErrorIconContainer,
  StyledButton,
  UserDataLabel
} from './ErrorBoundary.selected'
import { Emoji } from 'emoji-picker-react'
import { TaskIcon } from '../TaskIcon'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

/**
 * ErrorBoundary component that catches and displays errors.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static contextType = UserContext
  declare context: React.ContextType<typeof UserContext>
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error: error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error:', error)
    console.error('Error Info:', errorInfo)
  }

  handleClearData() {
    localStorage.clear()
    sessionStorage.clear()
    location.reload()
  }

  render() {
    if (this.state.hasError) {
      const { user } = this.context
      const { tasks } = user

      return (
        <ContainerBoundary>
          <ErrorHeader>
            <span>¡Vaya! Ocurrió un error.&nbsp;</span>
            <span>
              <Emoji size={38} unified='1f644' />
            </span>
          </ErrorHeader>
          <ErrorIconContainer>
            <TaskIcon scale={0.6} variant='error' />
          </ErrorIconContainer>
          <h2>
            Para solucionarlo, intenta limpiar tus archivos locales (cookies y caché) y luego recarga la página. Si el problema
            persiste, por favor reporta el problema a través de{' '}
          </h2>
          <Alert severity='error' variant='filled' sx={{ mt: '-8px', mb: '18px' }}>
            Al limpiar los datos de la aplicación, perderás todas tus tareas.
          </Alert>
          <div style={{ display: 'flex', gap: '12px' }}>
            <StyledButton color='warning' onClick={() => location.reload()}>
              <RefreshRounded /> &nbsp; Recargar Página
            </StyledButton>
            <StyledButton color='error' onClick={this.handleClearData}>
              <DeleteForeverRounded /> &nbsp; Auto Limpiar
            </StyledButton>
          </div>
          <h3>
            <span style={{ color: '#ff3131', display: 'inline-block' }}>
              <ErrorOutlineRounded sx={{ verticalAlign: 'middle', mb: '4px' }} /> ERROR:
            </span>{' '}
            <span translate='no'>
              [{this.state.error?.name}] {this.state.error?.message}
            </span>
          </h3>

          <ErrorAccordion disableGutters>
            <AccordionSummary expandIcon={<ErrorExpandIcon />}>
              <Typography fontWeight={700} fontSize={18} sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <DescriptionRounded /> Pila de errores
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div translate='no' style={{ opacity: 0.8, fontSize: '12px' }}>
                {this.state.error?.stack?.replace(this.state.error?.message, '')}
              </div>
            </AccordionDetails>
          </ErrorAccordion>

          <pre>
            <UserDataLabel>
              <DataObjectRounded /> &nbsp; Datos del Usuario
            </UserDataLabel>
            <Button
              variant='outlined'
              sx={{ ml: '6px', my: '18px', p: '12px 20px', borderRadius: '14px' }}
              onClick={() => {
                exportTasksToJson(tasks)
                showToast(`Exportadas todas las tareas (${tasks.length})`)
              }}
            >
              <FileDownload /> &nbsp; Exportar Tareas a JSON
            </Button>
            <br />
            <code translate='no'>{JSON.stringify(user, null, 4)}</code>
          </pre>
        </ContainerBoundary>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
