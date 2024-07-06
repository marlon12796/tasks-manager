/**
 * Retorna un saludo basado en la hora actual.
 * @returns {string} El saludo apropiado.
 */
export const displayGreeting = (): string => {
  const currentTime = new Date()
  const currentHour = currentTime.getHours()
  let greeting: string

  if (currentHour < 12 && currentHour >= 5) {
    greeting = 'Buenos días'
  } else if (currentHour < 18 && currentHour > 12) {
    greeting = 'Buenas tardes'
  } else {
    greeting = 'Buenas noches'
  }

  return greeting
}
