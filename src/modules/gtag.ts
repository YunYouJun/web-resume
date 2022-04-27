import { createGtm } from '@gtm-support/vue-gtm'
import type { UserModule } from '~/types'

export const install: UserModule = ({ app }) => {
  app.use(createGtm({
    id: 'GTM-TK2QFDK',
  }))
}
