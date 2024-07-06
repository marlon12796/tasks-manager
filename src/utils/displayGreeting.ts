/**
 * Retorna un saludo basado en la hora actual.
 * @returns {string} El saludo apropiado.
 */
export const displayGreeting = (): string => {
  const currentTime = new Date()
  const currentHour = currentTime.getHours()

  if (currentHour < 5) return 'Buenas noches'

  if (currentHour < 12) return 'Buenos días'

  if (currentHour < 18) return 'Buenas tardes'

  return 'Buenas noches' // Este caso cubre currentHour >= 18
}
