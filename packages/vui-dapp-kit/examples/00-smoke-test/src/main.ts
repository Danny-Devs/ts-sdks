import { createApp, h } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { SuiClientProvider } from '@dannydevs/vui-dapp-kit'
import { getFullnodeUrl } from '@mysten/sui/client'
import App from './App.vue'
import './style.css'

const pinia = createPinia()
const queryClient = new QueryClient()

const networks = {
	mainnet: { url: getFullnodeUrl('mainnet') },
	testnet: { url: getFullnodeUrl('testnet') },
	devnet: { url: getFullnodeUrl('devnet') },
}

const app = createApp({
	render: () =>
		h(SuiClientProvider, { networks, defaultNetwork: 'testnet' }, () => h(App)),
})

app.use(pinia)
app.use(VueQueryPlugin, { queryClient })

app.mount('#app')
