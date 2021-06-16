import { UserModule } from '~/types'
import VueGtag from 'vue-gtag-next'

export const install: UserModule = ({ app }) => {
  app.use(VueGtag, {
    property: { id: 'G-W022WEV65N' },
  })
}
