// Copyright (c) Danny & Claude, Apache-2.0

import type {
	Wallet,
	WalletAccount,
	WalletWithFeatures,
	WalletWithRequiredFeatures,
	MinimallyRequiredFeatures,
} from '@mysten/wallet-standard'
import { getWallets, isWalletWithRequiredFeatureSet } from '@mysten/wallet-standard'

/**
 * Get unique identifier for a wallet
 */
export function getWalletUniqueIdentifier(wallet: Wallet): string {
	return wallet.name
}

/**
 * Get selected account from connected accounts
 * @param connectedAccounts - Array of connected accounts
 * @param accountAddress - Optional specific account address
 * @returns Selected account or null
 */
export function getSelectedAccount(
	connectedAccounts: readonly WalletAccount[],
	accountAddress?: string,
): WalletAccount | null {
	if (connectedAccounts.length === 0) {
		return null
	}

	if (accountAddress) {
		const selectedAccount = connectedAccounts.find(
			(account) => account.address === accountAddress,
		)
		return selectedAccount ?? connectedAccounts[0]!
	}

	return connectedAccounts[0]!
}

/**
 * Filter accounts to only SUI chain accounts
 */
export function filterSuiAccounts(
	accounts: readonly WalletAccount[],
): WalletAccount[] {
	return accounts.filter((account) =>
		account.chains.some((chain: string) => chain.split(':')[0] === 'sui'),
	)
}

/**
 * Get all registered SUI wallets from the wallet standard
 * @param preferredWallets - List of wallet names to sort to the top
 * @param walletFilter - Optional filter function for wallets
 * @returns Array of registered wallets with required features
 */
export function getRegisteredWallets<AdditionalFeatures extends Wallet['features']>(
	preferredWallets: string[] = [],
	walletFilter?: (wallet: WalletWithRequiredFeatures) => boolean,
) {
	const walletsApi = getWallets()
	const wallets = walletsApi.get()

	const suiWallets = wallets.filter(
		(wallet): wallet is WalletWithFeatures<MinimallyRequiredFeatures & AdditionalFeatures> =>
			isWalletWithRequiredFeatureSet(wallet) && (!walletFilter || walletFilter(wallet)),
	)

	return [
		// Preferred wallets, in order:
		...(preferredWallets
			.map((name) => suiWallets.find((wallet) => wallet.name === name))
			.filter(Boolean) as WalletWithFeatures<MinimallyRequiredFeatures & AdditionalFeatures>[]),

		// Wallets in default order:
		...suiWallets.filter((wallet) => !preferredWallets.includes(wallet.name)),
	]
}
