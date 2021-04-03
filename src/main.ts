import { createApp } from 'vue'

import App from './App.vue'
import VueGtag from 'vue-gtag-next'

import router from './router'

import './assets/scss/index.scss'

const app = createApp(App)

app.use(router)
app.use(VueGtag, {
  property: { id: 'G-W022WEV65N' }
})
app.mount('#app')
