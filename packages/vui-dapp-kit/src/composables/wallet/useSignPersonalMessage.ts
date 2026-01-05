// Copyright (c) Danny & Claude, Apache-2.0

import { useMutation } from '@tanstack/vue-query'
import type { UseMutationOptions, UseMutationReturnType } from '@tanstack/vue-query'
import type { SuiSignPersonalMessageOutput } from '@mysten/wallet-standard'
import { useWalletStore } from '../../stores/walletStore'
import { useCurrentAccount } from './useCurrentAccount'

export interface SignPersonalMessageArgs {
	/** Message to sign (as Uint8Array or string) */
	message: Uint8Array | string
}

type UseSignPersonalMessageOptions = Omit<
	UseMutationOptions<SuiSignPersonalMessageOutput, Error, SignPersonalMessageArgs>,
	'mutationFn'
>

/**
 * Composable for signing a personal message
 *
 * Use this to prove ownership of an address by signing an arbitrary message.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useSignPersonalMessage } from '@dannydevs/vui-dapp-kit'
 *
 * const { mutate: signMessage, isPending } = useSignPersonalMessage()
 *
 * function proveOwnership() {
 *   const message = 'I own this address!'
 *
 *   signMessage(
 *     { message },
 *     {
 *       onSuccess: (result) => {
 *         console.log('Signature:', result.signature)
 *         console.log('Message bytes:', result.messageBytes)
 *         // Verify signature on backend
 *       },
 *     }
 *   )
 * }
 * </script>
 * ```
 *
 * @param options - Vue Query mutation options
 * @returns Vue Query mutation result with signMessage function
 */
export function useSignPersonalMessage(
	options?: UseSignPersonalMessageOptions,
): UseMutationReturnType<SuiSignPersonalMessageOutput, Error, SignPersonalMessageArgs, unknown> {
	const walletStore = useWalletStore()
	const { account } = useCurrentAccount()

	return useMutation({
		mutationKey: ['wallet', 'signPersonalMessage'],
		mutationFn: async ({ message }) => {
			const wallet = walletStore.currentWallet
			const currentAccount = account.value

			if (!wallet) {
				throw new Error('No wallet connected')
			}

			if (!currentAccount) {
				throw new Error('No account selected')
			}

			if (!wallet.features['sui:signPersonalMessage']) {
				throw new Error('Wallet does not support message signing')
			}

			// Convert string to Uint8Array if needed
			const messageBytes = typeof message === 'string'
				? new TextEncoder().encode(message)
				: message

			// Sign the message
			const result = await wallet.features['sui:signPersonalMessage'].signPersonalMessage({
				message: messageBytes,
				account: currentAccount,
			})

			return result
		},
		...options,
	})
}
