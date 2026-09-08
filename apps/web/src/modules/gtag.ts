import type { UserModule } from '~/types'

export const install: UserModule = ({ app, isClient, router }) => {
  if (!isClient || !import.meta.env.PROD)
    return

  // Keep analytics off the critical rendering path, including on repeat visits.
  router.isReady().then(() => {
    const installAnalytics = async () => {
      const { createGtm } = await import('@gtm-support/vue-gtm')
      app.use(createGtm({ id: 'GTM-TK2QFDK' }))
    }
    const schedule = () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          void installAnalytics()
        }, { timeout: 3000 })
      }
      else {
        setTimeout(() => {
          void installAnalytics()
        }, 0)
      }
    }
    if (document.readyState === 'complete')
      schedule()
    else
      window.addEventListener('load', schedule, { once: true })
  })
}
