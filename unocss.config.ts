import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

const icons = [
  'i-ri-github-fill',
]

export default defineConfig({
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-blue-600 text-white cursor-pointer hover:bg-blue-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'm-2 text-black dark:(text-white hover:text-blue-400) inline-flex justify-center items-center cursor-pointer select-none transition duration-200 ease-in-out hover:text-blue-600'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        serif: [
          {
            name: 'Noto Serif SC',
            weights: [900],
          },
        ],
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: 'max-w-900px m-auto text-left'.split(' ').concat(icons),
})
