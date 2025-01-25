import type { UserModule } from '~/types'
import { createGtm } from '@gtm-support/vue-gtm'

export const install: UserModule = ({ app }) => {
  app.use(createGtm({
    id: 'GTM-TK2QFDK',
  }))
}
