import { usePreferredDark, useStorage } from '@vueuse/core'
import { namespace } from '~/utils'

export type ColorSchemePreference = 'system' | 'light' | 'dark'

export const colorScheme = useStorage<ColorSchemePreference>(`${namespace}:color-scheme`, 'system')

const prefersDark = usePreferredDark()

export const isDark = computed(() => (
  colorScheme.value === 'dark'
  || (colorScheme.value === 'system' && prefersDark.value)
))

export function toggleDark() {
  colorScheme.value = isDark.value ? 'light' : 'dark'
}
