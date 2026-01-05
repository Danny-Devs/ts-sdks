// Copyright (c) Danny & Claude, Apache-2.0

import { useMutation } from '@tanstack/vue-query'
import type { UseMutationOptions, UseMutationReturnType } from '@tanstack/vue-query'
import { useWalletStore } from '../../stores/walletStore'

type UseDisconnectWalletOptions = Omit<
	UseMutationOptions<void, Error, void>,
	'mutationFn'
>

/**
 * Composable for disconnecting from the current wallet
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useDisconnectWallet } from '@dannydevs/vui-dapp-kit'
 *
 * const { mutate: disconnect, isPending } = useDisconnectWallet()
 * </script>
 *
 * <template>
 *   <button @click="disconnect()" :disabled="isPending">
 *     Disconnect Wallet
 *   </button>
 * </template>
 * ```
 *
 * @param options - Vue Query mutation options
 * @returns Vue Query mutation result with disconnect function
 */
export function useDisconnectWallet(
	options?: UseDisconnectWalletOptions,
): UseMutationReturnType<void, Error, void, unknown> {
	const walletStore = useWalletStore()

	return useMutation({
		mutationKey: ['wallet', 'disconnect'],
		mutationFn: async () => {
			const currentWallet = walletStore.currentWallet

			if (currentWallet && currentWallet.features['standard:disconnect']) {
				await currentWallet.features['standard:disconnect'].disconnect()
			}

			// Update store to disconnected state
			walletStore.setWalletDisconnected()
		},
		...options,
	})
}
