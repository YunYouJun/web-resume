import VueGtag from 'vue-gtag-next'
import { UserModule } from '~/types'

export const install: UserModule = ({ app }) => {
  app.use(VueGtag, {
    property: { id: 'G-W022WEV65N' },
  })
}
