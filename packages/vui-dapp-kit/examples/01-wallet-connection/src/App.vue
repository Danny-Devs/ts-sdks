<template>
	<SuiClientProvider :networks="networks" default-network="testnet">
		<div class="container">
			<h1>🔐 Wallet Connection</h1>
			<p class="subtitle">Simple example using ConnectButton</p>

			<div class="section">
				<h2>Connect Your Wallet</h2>
				<ConnectButton />
			</div>

			<div v-if="isConnected" class="section">
				<h2>Connected Account</h2>
				<div class="info-card success">
					<div class="info-row">
						<span class="label">Status:</span>
						<span class="badge">Connected</span>
					</div>
					<div class="info-row">
						<span class="label">Address:</span>
						<span class="value">{{ formattedAddress }}</span>
					</div>
					<div class="info-row">
						<span class="label">Wallet:</span>
						<span class="value">{{ wallet?.name }}</span>
					</div>
					<div class="info-row">
						<span class="label">Chains:</span>
						<span class="value">{{ account?.chains.length }} chains</span>
					</div>
				</div>
			</div>

			<div v-else class="section">
				<div class="info-card">
					<p>👆 Click the button above to connect your SUI wallet</p>
				</div>
			</div>

			<div class="footer">
				<p>
					Powered by <strong>vui-dapp-kit</strong> •
					<a href="https://github.com/Danny-Devs/ts-sdks" target="_blank">View on GitHub</a>
				</p>
			</div>
		</div>
	</SuiClientProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getFullnodeUrl } from '@mysten/sui/client'
import {
	SuiClientProvider,
	ConnectButton,
	useCurrentAccount,
	useCurrentWallet,
} from '@dannydevs/vui-dapp-kit'

// Network configuration
const networks = {
	mainnet: { url: getFullnodeUrl('mainnet') },
	testnet: { url: getFullnodeUrl('testnet') },
	devnet: { url: getFullnodeUrl('devnet') },
}

// Get current account and wallet
const { account, isConnected } = useCurrentAccount()
const { wallet } = useCurrentWallet()

// Format address for display
const formattedAddress = computed(() => {
	if (!account.value) return ''
	const addr = account.value.address
	return `${addr.slice(0, 6)}...${addr.slice(-4)}`
})
</script>
