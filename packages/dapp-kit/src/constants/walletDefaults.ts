// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { SuiWalletFeatures, WalletWithRequiredFeatures } from '@mysten/wallet-standard';
import { SLUSH_WALLET_NAME } from '@mysten/slush-wallet';

import { createInMemoryStore } from '../utils/stateStorage.js';
import { isMobileEnvironment } from '../utils/isMobileEnvironment.js';

export const SUI_WALLET_NAME = 'Sui Wallet';

export const DEFAULT_STORAGE =
	typeof window !== 'undefined' && window.localStorage ? localStorage : createInMemoryStore();

export const DEFAULT_STORAGE_KEY = 'sui-dapp-kit:wallet-connection-info';

const SIGN_FEATURES = [
	'sui:signTransaction',
	'sui:signTransactionBlock',
] satisfies (keyof SuiWalletFeatures)[];

export const DEFAULT_WALLET_FILTER = (wallet: WalletWithRequiredFeatures) =>
	SIGN_FEATURES.some((feature) => wallet.features[feature]);

export const DEFAULT_PREFERRED_WALLETS = [SUI_WALLET_NAME, SLUSH_WALLET_NAME];

/**
 * Mobile-friendly wallet filter that allows wallets to appear on mobile browsers.
 *
 * On mobile, browser extensions can't inject into pages, so we need to be more
 * permissive about which wallets we show. This filter allows:
 * 1. Wallets with full signing capabilities (same as DEFAULT_WALLET_FILTER)
 * 2. Wallets with standard:connect feature (for popup-based auth like Slush)
 * 3. Slush wallet specifically (uses popup auth that works on mobile)
 *
 * @param wallet - The wallet to check
 * @returns true if the wallet should be shown on mobile
 */
export const MOBILE_WALLET_FILTER = (wallet: WalletWithRequiredFeatures): boolean => {
	// Allow wallets with full signing features
	if (SIGN_FEATURES.some((feature) => wallet.features[feature])) {
		return true;
	}

	// Allow wallets with standard:connect (popup-based authentication)
	if (wallet.features['standard:connect']) {
		return true;
	}

	// Allow Slush wallet specifically (uses popup auth that works on mobile)
	if (wallet.name === SLUSH_WALLET_NAME) {
		return true;
	}

	return false;
};

/**
 * Returns the appropriate wallet filter based on the current environment.
 *
 * On mobile browsers, uses MOBILE_WALLET_FILTER for more permissive filtering.
 * On desktop browsers, uses DEFAULT_WALLET_FILTER which requires signing features.
 *
 * @param isMobile - Whether the current environment is mobile (optional, auto-detected if not provided)
 * @returns The appropriate wallet filter function
 */
export function getEnvironmentAwareWalletFilter(
	isMobile?: boolean,
): (wallet: WalletWithRequiredFeatures) => boolean {
	const shouldUseMobileFilter = isMobile ?? isMobileEnvironment();
	return shouldUseMobileFilter ? MOBILE_WALLET_FILTER : DEFAULT_WALLET_FILTER;
}
