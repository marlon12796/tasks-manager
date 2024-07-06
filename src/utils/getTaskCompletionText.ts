/**
 * Returns a task completion message based on the completion percentage.
 * @param {number} completionPercentage - The completion percentage of tasks.
 * @returns {string} A task completion message.
 */
export const getTaskCompletionText = (completionPercentage: number): string => {
  switch (true) {
    case completionPercentage === 0:
      return 'Aún no has completado ninguna tarea. ¡Sigue adelante!'
    case completionPercentage === 100:
      return '¡Felicidades! ¡Has completado todas las tareas!'
    case completionPercentage >= 75:
      return '¡Casi lo logras!'
    case completionPercentage >= 50:
      return '¡Vas por la mitad! ¡Sigue así!'
    case completionPercentage >= 25:
      return 'Estás haciendo un buen progreso.'
    default:
      return 'Apenas estás comenzando.'
  }
}
