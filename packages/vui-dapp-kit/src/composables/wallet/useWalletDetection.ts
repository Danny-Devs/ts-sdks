// Copyright (c) Danny & Claude, Apache-2.0

import { onMounted, onUnmounted, markRaw } from 'vue'
import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard'
import { getWallets } from '@mysten/wallet-standard'
import { useWalletStore } from '../../stores/walletStore'
import { getRegisteredWallets } from '../../utils/walletUtils'

/**
 * Internal composable for detecting and managing wallet registration
 *
 * This is the Vue equivalent of React's useWalletsChanged hook.
 * It listens to the wallet standard registry and updates the wallet store
 * whenever wallets are registered or unregistered.
 *
 * @param preferredWallets - List of wallet names to sort to the top
 * @param walletFilter - Optional filter function for wallets
 */
export function useWalletDetection(
	preferredWallets: string[] = [],
	walletFilter?: (wallet: WalletWithRequiredFeatures) => boolean,
) {
	const walletStore = useWalletStore()

	onMounted(() => {
		const walletsApi = getWallets()

		// Set initially registered wallets
		// CRITICAL: Use markRaw() to prevent Vue from wrapping wallet objects in Proxies
		// Wallet objects have ES2022 private fields which are incompatible with Proxy wrapping
		const detectedWallets = getRegisteredWallets(preferredWallets, walletFilter).map(markRaw)
		walletStore.setWalletRegistered(detectedWallets)

		// Listen for new wallets being registered
		const unsubscribeFromRegister = walletsApi.on('register', () => {
			walletStore.setWalletRegistered(
				getRegisteredWallets(preferredWallets, walletFilter).map(markRaw),
			)
		})

		// Listen for wallets being unregistered
		const unsubscribeFromUnregister = walletsApi.on('unregister', (unregisteredWallet) => {
			walletStore.setWalletUnregistered(
				getRegisteredWallets(preferredWallets, walletFilter).map(markRaw),
				unregisteredWallet,
			)
		})

		// Cleanup on unmount
		onUnmounted(() => {
			unsubscribeFromRegister()
			unsubscribeFromUnregister()
		})
	})
}
