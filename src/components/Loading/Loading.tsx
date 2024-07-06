import { CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import { ContainerLoading } from './Loading.styled'

export const Loading = () => {
  const [showLoading, setShowLoading] = useState<boolean>(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(true)
    }, 100) // Show the loading spinner after 100 milliseconds

    return () => clearTimeout(timer)
  }, [])

  return <ContainerLoading>{showLoading && <CircularProgress size={80} thickness={4} aria-label='loading' />}</ContainerLoading>
}
