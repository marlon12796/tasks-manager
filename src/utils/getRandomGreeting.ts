/**
 * Returns a random greeting message to inspire productivity.
 * @returns {string} A random greeting message with optional emoji code.
 */
export const getRandomGreeting = (): string => {
  const hoursLeft = 24 - new Date().getHours()

  const greetingsText: string[] = [
    '¡Haz que cada día cuente! 💪',
    '¡La disciplina es el puente entre metas y logros!',
    '¡Tú eres más fuerte de lo que crees!',
    'No te conformes con menos de lo que mereces.',
    '¡Cada pequeño paso te acerca más a tu gran objetivo!',
    'Mantén el enfoque en lo que realmente importa.',
    '¡La perseverancia es la clave del éxito!',
    'No dejes para mañana lo que puedes hacer hoy.',
    '¡Celebra cada pequeño avance en tu camino!',
    '¡La mejor manera de predecir el futuro es crearlo!',
    'Haz lo que amas y ama lo que haces.',
    '¡Nunca subestimes el poder de tus sueños!',
    'Cada nuevo día es una oportunidad para aprender y crecer.',
    '¡Convierte tus obstáculos en oportunidades!',
    '¡La clave está en ser constante y paciente!',
    'Mantén tus sueños grandes y tus preocupaciones pequeñas.',
    '¡Aprende del pasado, vive el presente, crea el futuro!',
    '¡Confía en ti mismo y alcanzarás cualquier meta!',
    '¡La actitud lo es todo!',
    '¡Hoy es un buen día para empezar algo nuevo!',

    `¡Que tengas un maravilloso ${new Date().toLocaleDateString('es', {
      weekday: 'long'
    })}!`,
    `¡Feliz ${new Date().toLocaleDateString('es', {
      month: 'long'
    })}! ¡Un mes excelente para ser productivo!`,
    hoursLeft > 4 ? `¡Quedan ${hoursLeft} horas en el día! ¡Úsalas sabiamente!` : `Solo quedan ${hoursLeft} horas en el día.`
  ]

  const randomIndex = Math.floor(Math.random() * greetingsText.length)
  return greetingsText[randomIndex]
}
