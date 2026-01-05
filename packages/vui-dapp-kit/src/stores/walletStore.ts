// Copyright (c) Danny & Claude, Apache-2.0

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Wallet, WalletAccount, WalletWithRequiredFeatures } from '@mysten/wallet-standard'
import type { WalletConnectionStatus } from '../types'
import { getWalletUniqueIdentifier } from '../utils/walletUtils'

/**
 * Wallet store configuration
 */
export interface WalletStoreConfig {
	autoConnectEnabled?: boolean
	initialWallets?: WalletWithRequiredFeatures[]
	storageKey?: string
}

/**
 * Pinia store for wallet state management
 *
 * This is the Vue 3 equivalent of the React dApp Kit's Zustand store,
 * but better integrated with Vue's reactivity system.
 *
 * Features:
 * - Automatic persistence to localStorage
 * - Reactive state with computed properties
 * - Type-safe actions
 * - Better DevTools integration
 */
export const useWalletStore = defineStore('vui-wallet', () => {
	// ==================== STATE ====================

	/** Auto-connect feature enabled */
	const autoConnectEnabled = ref(true)

	/** All available wallets */
	const wallets = ref<WalletWithRequiredFeatures[]>([])

	/** Connected accounts */
	const accounts = ref<readonly WalletAccount[]>([])

	/** Currently connected wallet */
	const currentWallet = ref<WalletWithRequiredFeatures | null>(null)

	/** Currently selected account */
	const currentAccount = ref<WalletAccount | null>(null)

	/** Last connected account address (for auto-reconnect) */
	const lastConnectedAccountAddress = ref<string | null>(null)

	/** Last connected wallet name (for auto-reconnect) */
	const lastConnectedWalletName = ref<string | null>(null)

	/** Connection status */
	const connectionStatus = ref<WalletConnectionStatus>('disconnected')

	/** Supported transaction intents */
	const supportedIntents = ref<string[]>([])

	// ==================== COMPUTED ====================

	/** Is wallet currently connected */
	const isConnected = computed(() => connectionStatus.value === 'connected')

	/** Is wallet currently connecting */
	const isConnecting = computed(() => connectionStatus.value === 'connecting')

	/** Is wallet disconnected */
	const isDisconnected = computed(() => connectionStatus.value === 'disconnected')

	/** Has accounts available */
	const hasAccounts = computed(() => accounts.value.length > 0)

	// ==================== ACTIONS ====================

	/**
	 * Initialize store with wallets
	 */
	function initialize(config: WalletStoreConfig = {}) {
		if (config.autoConnectEnabled !== undefined) {
			autoConnectEnabled.value = config.autoConnectEnabled
		}
		if (config.initialWallets) {
			wallets.value = config.initialWallets
		}
	}

	/**
	 * Set connection status
	 */
	function setConnectionStatus(status: WalletConnectionStatus) {
		connectionStatus.value = status
	}

	/**
	 * Set wallet as connected
	 */
	function setWalletConnected(
		wallet: WalletWithRequiredFeatures,
		connectedAccounts: readonly WalletAccount[],
		selectedAccount: WalletAccount | null,
		intents: string[] = [],
	) {
		accounts.value = connectedAccounts
		currentWallet.value = wallet
		currentAccount.value = selectedAccount
		lastConnectedWalletName.value = getWalletUniqueIdentifier(wallet)
		lastConnectedAccountAddress.value = selectedAccount?.address ?? null
		connectionStatus.value = 'connected'
		supportedIntents.value = intents
	}

	/**
	 * Set wallet as disconnected
	 */
	function setWalletDisconnected() {
		accounts.value = []
		currentWallet.value = null
		currentAccount.value = null
		lastConnectedWalletName.value = null
		lastConnectedAccountAddress.value = null
		connectionStatus.value = 'disconnected'
		supportedIntents.value = []
	}

	/**
	 * Switch to a different account
	 */
	function setAccountSwitched(selectedAccount: WalletAccount) {
		currentAccount.value = selectedAccount
		lastConnectedAccountAddress.value = selectedAccount.address
	}

	/**
	 * Register new wallets
	 */
	function setWalletRegistered(updatedWallets: WalletWithRequiredFeatures[]) {
		wallets.value = updatedWallets
	}

	/**
	 * Unregister wallet
	 */
	function setWalletUnregistered(
		updatedWallets: WalletWithRequiredFeatures[],
		unregisteredWallet: Wallet,
	) {
		// If the unregistered wallet is currently connected, disconnect it
		if (unregisteredWallet === currentWallet.value) {
			setWalletDisconnected()
		}
		wallets.value = updatedWallets
	}

	/**
	 * Update wallet accounts (when accounts change in the wallet)
	 */
	function updateWalletAccounts(newAccounts: readonly WalletAccount[]) {
		const current = currentAccount.value

		accounts.value = newAccounts

		// Try to keep the same account selected if it still exists
		if (current) {
			const stillExists = newAccounts.find(
				(account) => account.address === current.address,
			)
			currentAccount.value = stillExists ?? newAccounts[0] ?? null
		} else {
			currentAccount.value = newAccounts[0] ?? null
		}
	}

	/**
	 * Reset store to initial state
	 */
	function $reset() {
		autoConnectEnabled.value = true
		wallets.value = []
		accounts.value = []
		currentWallet.value = null
		currentAccount.value = null
		lastConnectedAccountAddress.value = null
		lastConnectedWalletName.value = null
		connectionStatus.value = 'disconnected'
		supportedIntents.value = []
	}

	// Return everything
	return {
		// State
		autoConnectEnabled,
		wallets,
		accounts,
		currentWallet,
		currentAccount,
		lastConnectedAccountAddress,
		lastConnectedWalletName,
		connectionStatus,
		supportedIntents,

		// Computed
		isConnected,
		isConnecting,
		isDisconnected,
		hasAccounts,

		// Actions
		initialize,
		setConnectionStatus,
		setWalletConnected,
		setWalletDisconnected,
		setAccountSwitched,
		setWalletRegistered,
		setWalletUnregistered,
		updateWalletAccounts,
		$reset,
	}
})
