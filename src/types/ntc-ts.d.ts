interface FORMATTED_COLOR {
  exactMatch: boolean
  name: string
  rgb: string | null
}
type COLOR = Array<string | number>
declare module 'ntc-ts' {
  export function getColorName(color: string): FORMATTED_COLOR
  export function getRGB(color: string, divider = 1): number[]
  export function getHSL(color: string): number[]
  export function initColors(_colors: COLOR[]): void
  export const ORIGINAL_COLORS: COLOR[]
}
// biome-ignore lint/style/noNamespace: <explanation>
declare namespace Intl {
  class ListFormat {
    constructor(
      locale?: string,
      options?: {
        localeMatcher?: 'lookup' | 'best fit'
        type?: 'conjunction' | 'disjunction' | 'unit'
        style?: 'long' | 'short' | 'narrow'
      }
    )

    public format: (items: string[]) => string
  }
}
