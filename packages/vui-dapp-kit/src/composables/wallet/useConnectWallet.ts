// Copyright (c) Danny & Claude, Apache-2.0

import { useMutation } from '@tanstack/vue-query'
import type { UseMutationOptions, UseMutationReturnType } from '@tanstack/vue-query'
import type { ConnectWalletArgs, ConnectWalletResult } from '../../types'
import { useWalletStore } from '../../stores/walletStore'
import { filterSuiAccounts, getSelectedAccount } from '../../utils/walletUtils'

type UseConnectWalletOptions = Omit<
	UseMutationOptions<ConnectWalletResult, Error, ConnectWalletArgs>,
	'mutationFn'
>

/**
 * Composable for connecting to a SUI wallet
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useConnectWallet, useWallets } from '@dannydevs/vui-dapp-kit'
 *
 * const wallets = useWallets()
 * const { mutate: connect, isPending } = useConnectWallet()
 *
 * function handleConnect() {
 *   const suiWallet = wallets.value[0]
 *   if (suiWallet) {
 *     connect(
 *       { wallet: suiWallet },
 *       {
 *         onSuccess: () => console.log('Connected!'),
 *         onError: (error) => console.error('Failed:', error),
 *       }
 *     )
 *   }
 * }
 * </script>
 * ```
 *
 * @param options - Vue Query mutation options
 * @returns Vue Query mutation result with connect function
 */
export function useConnectWallet(
	options?: UseConnectWalletOptions,
): UseMutationReturnType<ConnectWalletResult, Error, ConnectWalletArgs, unknown> {
	const walletStore = useWalletStore()

	return useMutation({
		mutationKey: ['wallet', 'connect'],
		mutationFn: async ({ wallet, accountAddress, ...connectArgs }) => {
			try {
				// Set connecting status
				walletStore.setConnectionStatus('connecting')

				// Call wallet's connect method
				const connectResult = await wallet.features['standard:connect'].connect(connectArgs)

				// Get supported intents (transaction capabilities)
				let supportedIntents = connectResult.supportedIntents
				if (!supportedIntents && wallet.features['sui:getCapabilities']) {
					const capabilities = await wallet.features['sui:getCapabilities'].getCapabilities()
					supportedIntents = capabilities.supportedIntents ?? []
				}

				// Filter to only SUI chain accounts
				const connectedSuiAccounts = filterSuiAccounts(connectResult.accounts)

				// Select the account to use
				const selectedAccount = getSelectedAccount(connectedSuiAccounts, accountAddress)

				// Update store with connected state
				walletStore.setWalletConnected(
					wallet,
					connectedSuiAccounts,
					selectedAccount,
					supportedIntents,
				)

				return { accounts: connectedSuiAccounts }
			} catch (error) {
				// Reset to disconnected on error
				walletStore.setConnectionStatus('disconnected')
				throw error
			}
		},
		...options,
	})
}
