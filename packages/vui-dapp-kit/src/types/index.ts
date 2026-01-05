// Copyright (c) Danny & Claude, Apache-2.0

import type {
	Wallet,
	WalletAccount,
	WalletWithRequiredFeatures,
	StandardConnectInput,
	StandardConnectOutput,
} from '@mysten/wallet-standard'

/**
 * Wallet connection status
 */
export type WalletConnectionStatus = 'disconnected' | 'connecting' | 'connected'

/**
 * Arguments for connecting to a wallet
 */
export type ConnectWalletArgs = {
	/** The wallet to connect to */
	wallet: WalletWithRequiredFeatures
	/** Optional account address to connect to. Defaults to first authorized account */
	accountAddress?: string
} & StandardConnectInput

/**
 * Result of wallet connection
 */
export type ConnectWalletResult = StandardConnectOutput

/**
 * Network configuration for SUI client
 */
export interface NetworkConfig {
	id: string
	name: string
	url: string
}

/**
 * Configuration for creating network config
 */
export type NetworkConfigs = Record<string, { url: string; name?: string }>

/**
 * Wallet store state
 */
export interface WalletState {
	autoConnectEnabled: boolean
	wallets: WalletWithRequiredFeatures[]
	accounts: readonly WalletAccount[]
	currentWallet: WalletWithRequiredFeatures | null
	currentAccount: WalletAccount | null
	lastConnectedAccountAddress: string | null
	lastConnectedWalletName: string | null
	connectionStatus: WalletConnectionStatus
	supportedIntents: string[]
}

/**
 * Wallet store actions
 */
export interface WalletActions {
	setAccountSwitched: (selectedAccount: WalletAccount) => void
	setConnectionStatus: (connectionStatus: WalletConnectionStatus) => void
	setWalletConnected: (
		wallet: WalletWithRequiredFeatures,
		connectedAccounts: readonly WalletAccount[],
		selectedAccount: WalletAccount | null,
		supportedIntents?: string[],
	) => void
	updateWalletAccounts: (accounts: readonly WalletAccount[]) => void
	setWalletDisconnected: () => void
	setWalletRegistered: (updatedWallets: WalletWithRequiredFeatures[]) => void
	setWalletUnregistered: (
		updatedWallets: WalletWithRequiredFeatures[],
		unregisteredWallet: Wallet,
	) => void
}

/**
 * Complete wallet store (state + actions)
 */
export type WalletStore = WalletState & WalletActions
