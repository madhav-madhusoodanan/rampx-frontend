import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { WagmiPlugin } from '@wagmi/vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

import { config } from '../wagmi.config'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const queryClient = new QueryClient()

app.use(createPinia())
app.use(router)
app.use(WagmiPlugin, { config })
app.use(VueQueryPlugin, { queryClient })

app.mount('#app')
