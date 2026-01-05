<script setup lang="ts">
// Copyright (c) Danny & Claude, Apache-2.0

import { provide, computed } from 'vue'
import { SuiClient } from '@mysten/sui/client'
import type { SuiClientContext } from '../composables/client/useSuiClient'
import { SuiClientContextKey } from '../composables/client/useSuiClient'
import { useWalletDetection } from '../composables/wallet/useWalletDetection'

/**
 * Props for SuiClientProvider
 */
export interface SuiClientProviderProps {
	/** Network configuration */
	networks?: Record<string, { url: string }>
	/** Default network to use */
	defaultNetwork?: string
	/** Or provide a client directly */
	client?: SuiClient
	/** Network name when providing client directly */
	network?: string
}

const props = withDefaults(defineProps<SuiClientProviderProps>(), {
	defaultNetwork: 'mainnet',
	network: 'mainnet',
})

// Create or use provided client
const client = computed(() => {
	if (props.client) {
		return props.client
	}

	// Create client from networks config
	const networkConfig = props.networks?.[props.defaultNetwork]
	if (!networkConfig) {
		throw new Error(`Network configuration not found for: ${props.defaultNetwork}`)
	}

	return new SuiClient({ url: networkConfig.url })
})

// Create context value
const context = computed<SuiClientContext>(() => ({
	client: client.value,
	network: props.network || props.defaultNetwork,
}))

// Provide to children
provide(SuiClientContextKey, context.value)

// Initialize wallet detection
useWalletDetection()
</script>

<template>
	<slot />
</template>
