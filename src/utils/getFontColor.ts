import { ColorPalette } from '../theme/themeConfig'

/**
 * Returns the appropriate font color (either black or white) based on the provided background color in hex format.
 * @param {string} backgroundColor - The background color in hex format (e.g., "#FFFFFF").
 * @returns {string} The font color in hex format.
 */
export const getFontColor = (backgroundColor: string): string => {
  const hexColor = backgroundColor.replace('#', '')
  const red = Number.parseInt(hexColor.slice(0, 2), 16)
  const green = Number.parseInt(hexColor.slice(2, 4), 16)
  const blue = Number.parseInt(hexColor.slice(4, 6), 16)
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000
  return brightness > 125 ? ColorPalette.fontDark : ColorPalette.fontLight
}
