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
  'i-ri-arrow-go-back-line',
  'i-ri-arrow-right-s-line',
  'i-ri-book-2-line',
  'i-ri-check-line',
  'i-ri-close-line',
  'i-ri-code-s-slash-line',
  'i-ri-compass-fill',
  'i-ri-compass-line',
  'i-ri-download-cloud-2-line',
  'i-ri-eraser-line',
  'i-ri-error-warning-line',
  'i-ri-eye-line',
  'i-ri-eye-off-line',
  'i-ri-file-user-line',
  'i-ri-fullscreen-exit-line',
  'i-ri-fullscreen-line',
  'i-ri-github-line',
  'i-ri-history-line',
  'i-ri-home-fill',
  'i-ri-home-line',
  'i-ri-link',
  'i-ri-loader-4-line',
  'i-ri-more-2-fill',
  'i-ri-printer-line',
  'i-ri-question-line',
  'i-ri-search-line',
  'i-ri-share-forward-line',
  'i-ri-side-bar-fill',
  'i-ri-side-bar-line',
  'i-ri-slideshow-4-line',
  'i-ri-terminal-box-line',
  'i-ri-translate',
  'i-ri-user-fill',
  'i-ri-user-line',
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
