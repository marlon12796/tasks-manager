/**
 * Returns a random greeting message to inspire productivity.
 * @returns {string} A random greeting message with optional emoji code.
 */
export const getRandomGreeting = (): string => {
  const hoursLeft = 24 - new Date().getHours()

  const greetingsText: string[] = [
    '¡Vamos a hacer que hoy cuente! **1f680**',
    '¡Haz las cosas y conquista el día!',
    '¡Aprovecha el poder de la productividad!',
    'Establece tus metas, aplástalas, repite.',
    '¡Hoy es una nueva oportunidad para ser productivo!',
    'Haz que cada momento cuente.',
    'Mantente organizado, mantente adelante.',
    '¡Toma el control de tu día!',
    'Una tarea a la vez, ¡tú puedes!',
    'La productividad es la clave del éxito. **1f511**',
    '¡Convirtamos los planes en logros!',
    'Empieza pequeño, logra grande.',
    'Sé eficiente, sé productivo.',
    '¡Aprovecha el poder de la productividad!',
    '¡Prepárate para hacer que las cosas sucedan!',
    '¡Es hora de marcar esas tareas como completadas! **2705**',
    '¡Comienza tu día con un plan! **1f5d3-fe0f**',
    'Mantén el enfoque, mantén la productividad.',
    'Desbloquea tu potencial de productividad. **1f513**',
    '¡Convierte tu lista de pendientes en una lista de hechos! **1f4dd**',

    `¡Que tengas un maravilloso ${new Date().toLocaleDateString('es', {
      weekday: 'long'
    })}!`,
    `¡Feliz ${new Date().toLocaleDateString('es', {
      month: 'long'
    })}! ¡Un gran mes para la productividad!`,
    hoursLeft > 4 ? `¡Quedan ${hoursLeft} horas en el día. ¡Úsalas sabiamente!` : `Solo quedan ${hoursLeft} horas en el día`
  ]

  const randomIndex = Math.floor(Math.random() * greetingsText.length)
  return greetingsText[randomIndex]
}
