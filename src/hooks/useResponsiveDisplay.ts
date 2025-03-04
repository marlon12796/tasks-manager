import { useEffect, useState } from 'react'
/**
 * A custom React hook to determine if the current device is a smaller device
 * based on the screen width.
 * @param [breakpoint=768] - The breakpoint in pixels at which a device is considered "smaller".
 * @returns {boolean} - A boolean value indicating whether the current device is a smaller device.
 */
export const useResponsiveDisplay = (breakpoint = 768): boolean => {
  const [isSmallerDevice, setIsSmallerDevice] = useState<boolean>(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallerDevice(window.innerWidth < breakpoint)
    }
    checkScreenSize()
    const handleResize = () => checkScreenSize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [breakpoint])

  return isSmallerDevice
}
