export const appearanceOptions = {
  palette: ['blue', 'forest', 'plum', 'slate'],
  font: ['sans', 'serif'],
  density: ['comfortable', 'dense'],
  photo: ['square', 'rounded', 'circle'],
} as const

export type ResumeAppearance = { [K in keyof typeof appearanceOptions]: typeof appearanceOptions[K][number] }
export const defaultResumeAppearance: ResumeAppearance = {
  palette: 'blue',
  font: 'sans',
  density: 'comfortable',
  photo: 'square',
}

export const resumePalettes = {
  blue: { accent: '#0969da', strong: '#1d1d1f' },
  forest: { accent: '#166448', strong: '#163b30' },
  plum: { accent: '#783c78', strong: '#3e2540' },
  slate: { accent: '#475569', strong: '#253044' },
}

export function resolveResumeAppearance(value: unknown): ResumeAppearance {
  const source = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  return Object.fromEntries(Object.entries(appearanceOptions).map(([key, options]) => [
    key,
    (options as readonly unknown[]).includes(source[key]) ? source[key] : defaultResumeAppearance[key as keyof ResumeAppearance],
  ])) as ResumeAppearance
}

export function applyResumeAppearanceToUrl(url: URL, appearance: ResumeAppearance) {
  for (const [key, value] of Object.entries(resolveResumeAppearance(appearance)))
    url.searchParams.set(key, value)
  return url
}

export function resumeAppearanceStyle(appearance: ResumeAppearance) {
  const resolved = resolveResumeAppearance(appearance)
  const palette = resumePalettes[resolved.palette]
  return {
    '--resume-theme-accent': palette.accent,
    '--resume-theme-strong': palette.strong,
  }
}
