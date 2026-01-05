// Copyright (c) Danny & Claude, Apache-2.0

import { inject } from 'vue'
import type { InjectionKey } from 'vue'
import type { SuiClient } from '@mysten/sui/client'

/**
 * SUI Client context interface
 */
export interface SuiClientContext {
	client: SuiClient
	network: string
}

/**
 * Injection key for SUI client context
 */
export const SuiClientContextKey: InjectionKey<SuiClientContext> = Symbol('SuiClientContext')

/**
 * Get the SUI client context (with error handling)
 *
 * @throws Error if called outside of SuiClientProvider
 */
export function useSuiClientContext(): SuiClientContext {
	const context = inject(SuiClientContextKey)

	if (!context) {
		throw new Error(
			'Could not find SuiClientContext. Ensure that you have set up the SuiClientProvider component.',
		)
	}

	return context
}

/**
 * Get the SUI client instance
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useSuiClient } from '@dannydevs/vui-dapp-kit'
 *
 * const client = useSuiClient()
 *
 * // Use client directly
 * const balance = await client.getBalance({ owner: address })
 * </script>
 * ```
 *
 * @returns SuiClient instance
 */
export function useSuiClient(): SuiClient {
	return useSuiClientContext().client
}
