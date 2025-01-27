// import { useDark, useToggle } from '@vueuse/core'
import { useToggle } from '@vueuse/core'

// export const isDark = useDark()
export const isDark = ref(false)
export const toggleDark = useToggle(isDark)
