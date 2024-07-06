/**
 * Returns a task completion message based on the completion percentage.
 * @param {number} completionPercentage - The completion percentage of tasks.
 * @returns {string} A task completion message.
 */
export const getTaskCompletionText = (completionPercentage: number): string => {
  if (completionPercentage === 0) return 'Aún no has completado ninguna tarea. ¡Sigue adelante!'

  if (completionPercentage === 100) return '¡Felicidades! ¡Has completado todas las tareas!'

  if (completionPercentage >= 75) return '¡Casi lo logras! Continúa así.'

  if (completionPercentage >= 50) return 'Vas por la mitad del camino. ¡Sigue así!'

  if (completionPercentage >= 25) return 'Estás progresando bien. ¡Sigue trabajando!'

  return 'Estás en las primeras etapas. ¡Continúa avanzando!'
}
