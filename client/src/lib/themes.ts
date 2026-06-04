// ─── Theme Definitions ────────────────────────────────────────────────────────
// Each theme overrides Tailwind v4's --color-yellow-* CSS variables at runtime.
// All existing yellow-* classes in components update automatically.

export type ThemeName = 'yellow' | 'sky' | 'violet' | 'rose' | 'emerald' | 'slate'

export interface ThemePreset {
  name: ThemeName
  label: string
  /** Preview swatch color (main 400 shade) */
  swatch: string
  /** oklch values for shades 50→950 */
  shades: Record<string, string>
}

// oklch values sourced from Tailwind v4 color palette
export const THEMES: ThemePreset[] = [
  {
    name: 'yellow',
    label: 'Yellow',
    swatch: 'oklch(0.852 0.199 91.936)',
    shades: {
      '50': 'oklch(0.987 0.026 102.212)',
      '100': 'oklch(0.973 0.071 103.193)',
      '200': 'oklch(0.945 0.129 101.54)',
      '300': 'oklch(0.905 0.182 98.111)',
      '400': 'oklch(0.852 0.199 91.936)',
      '500': 'oklch(0.795 0.184 86.047)',
      '600': 'oklch(0.681 0.162 75.834)',
      '700': 'oklch(0.554 0.135 66.442)',
      '800': 'oklch(0.476 0.114 61.907)',
      '900': 'oklch(0.421 0.095 57.708)',
      '950': 'oklch(0.286 0.066 53.813)',
    },
  },
  {
    name: 'sky',
    label: 'Sky',
    swatch: 'oklch(0.746 0.16 232.661)',
    shades: {
      '50': 'oklch(0.977 0.013 236.62)',
      '100': 'oklch(0.951 0.026 236.824)',
      '200': 'oklch(0.901 0.058 230.902)',
      '300': 'oklch(0.828 0.111 230.318)',
      '400': 'oklch(0.746 0.16 232.661)',
      '500': 'oklch(0.685 0.169 237.323)',
      '600': 'oklch(0.588 0.158 241.966)',
      '700': 'oklch(0.5 0.134 242.749)',
      '800': 'oklch(0.443 0.11 240.79)',
      '900': 'oklch(0.391 0.09 240.876)',
      '950': 'oklch(0.293 0.066 243.157)',
    },
  },
  {
    name: 'violet',
    label: 'Violet',
    swatch: 'oklch(0.702 0.183 293.541)',
    shades: {
      '50': 'oklch(0.969 0.016 293.756)',
      '100': 'oklch(0.943 0.029 294.588)',
      '200': 'oklch(0.894 0.057 293.283)',
      '300': 'oklch(0.811 0.111 293.571)',
      '400': 'oklch(0.702 0.183 293.541)',
      '500': 'oklch(0.606 0.234 292.717)',
      '600': 'oklch(0.541 0.232 292.759)',
      '700': 'oklch(0.491 0.19 292.581)',
      '800': 'oklch(0.432 0.152 292.072)',
      '900': 'oklch(0.38 0.118 291.189)',
      '950': 'oklch(0.283 0.086 291.089)',
    },
  },
  {
    name: 'rose',
    label: 'Rose',
    swatch: 'oklch(0.712 0.194 13.428)',
    shades: {
      '50': 'oklch(0.969 0.015 12.422)',
      '100': 'oklch(0.941 0.03 12.58)',
      '200': 'oklch(0.892 0.058 10.001)',
      '300': 'oklch(0.81 0.117 11.638)',
      '400': 'oklch(0.712 0.194 13.428)',
      '500': 'oklch(0.645 0.246 16.439)',
      '600': 'oklch(0.586 0.253 17.585)',
      '700': 'oklch(0.514 0.222 16.935)',
      '800': 'oklch(0.455 0.188 13.697)',
      '900': 'oklch(0.41 0.159 10.272)',
      '950': 'oklch(0.271 0.105 12.094)',
    },
  },
  {
    name: 'emerald',
    label: 'Emerald',
    swatch: 'oklch(0.765 0.177 163.223)',
    shades: {
      '50': 'oklch(0.979 0.021 166.113)',
      '100': 'oklch(0.95 0.052 163.051)',
      '200': 'oklch(0.905 0.093 164.15)',
      '300': 'oklch(0.845 0.143 164.978)',
      '400': 'oklch(0.765 0.177 163.223)',
      '500': 'oklch(0.696 0.17 162.48)',
      '600': 'oklch(0.596 0.145 163.225)',
      '700': 'oklch(0.508 0.118 165.612)',
      '800': 'oklch(0.432 0.095 166.913)',
      '900': 'oklch(0.378 0.077 168.94)',
      '950': 'oklch(0.262 0.051 172.552)',
    },
  },
  {
    name: 'slate',
    label: 'Slate',
    swatch: 'oklch(0.704 0.04 256.788)',
    shades: {
      '50': 'oklch(0.984 0.003 247.858)',
      '100': 'oklch(0.968 0.007 247.896)',
      '200': 'oklch(0.929 0.013 255.508)',
      '300': 'oklch(0.869 0.022 252.894)',
      '400': 'oklch(0.704 0.04 256.788)',
      '500': 'oklch(0.554 0.046 257.417)',
      '600': 'oklch(0.446 0.043 257.281)',
      '700': 'oklch(0.372 0.044 257.287)',
      '800': 'oklch(0.279 0.041 260.031)',
      '900': 'oklch(0.208 0.042 265.755)',
      '950': 'oklch(0.129 0.042 264.695)',
    },
  },
]

// ─── Apply Theme ──────────────────────────────────────────────────────────────

/** Override Tailwind v4's --color-yellow-* vars at the document root.  */
export function applyTheme(name: ThemeName | string) {
  const preset = THEMES.find((t) => t.name === name) ?? THEMES[0]
  const root = document.documentElement

  Object.entries(preset.shades).forEach(([shade, value]) => {
    root.style.setProperty(`--color-yellow-${shade}`, value)
  })

}

/** Get a theme by name (falls back to yellow) */
export function getTheme(name: string): ThemePreset {
  return THEMES.find((t) => t.name === name) ?? THEMES[0]
}
