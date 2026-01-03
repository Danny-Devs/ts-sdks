// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard';
import { SLUSH_WALLET_NAME } from '@mysten/slush-wallet';

import {
	DEFAULT_WALLET_FILTER,
	MOBILE_WALLET_FILTER,
	getEnvironmentAwareWalletFilter,
} from '../../src/constants/walletDefaults.js';

// Mock wallet factory for testing
function createMockWallet(
	overrides: Partial<{
		name: string;
		features: Record<string, unknown>;
	}> = {},
): WalletWithRequiredFeatures {
	return {
		name: overrides.name ?? 'Test Wallet',
		version: '1.0.0' as const,
		icon: 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=', // base64 encoded <svg></svg>
		chains: ['sui:mainnet'],
		accounts: [],
		features: {
			'standard:connect': { version: '1.0.0', connect: vi.fn() },
			'standard:events': { version: '1.0.0', on: vi.fn() },
			...overrides.features,
		},
	} as unknown as WalletWithRequiredFeatures;
}

describe('DEFAULT_WALLET_FILTER', () => {
	it('should accept wallets with sui:signTransaction feature', () => {
		const wallet = createMockWallet({
			features: {
				'sui:signTransaction': { version: '1.0.0', signTransaction: vi.fn() },
			},
		});
		expect(DEFAULT_WALLET_FILTER(wallet)).toBe(true);
	});

	it('should accept wallets with sui:signTransactionBlock feature', () => {
		const wallet = createMockWallet({
			features: {
				'sui:signTransactionBlock': { version: '1.0.0', signTransactionBlock: vi.fn() },
			},
		});
		expect(DEFAULT_WALLET_FILTER(wallet)).toBe(true);
	});

	it('should reject wallets without signing features', () => {
		const wallet = createMockWallet({
			features: {
				'standard:connect': { version: '1.0.0', connect: vi.fn() },
			},
		});
		expect(DEFAULT_WALLET_FILTER(wallet)).toBe(false);
	});
});

describe('MOBILE_WALLET_FILTER', () => {
	it('should accept wallets with sui:signTransaction feature', () => {
		const wallet = createMockWallet({
			features: {
				'sui:signTransaction': { version: '1.0.0', signTransaction: vi.fn() },
			},
		});
		expect(MOBILE_WALLET_FILTER(wallet)).toBe(true);
	});

	it('should accept wallets with sui:signTransactionBlock feature', () => {
		const wallet = createMockWallet({
			features: {
				'sui:signTransactionBlock': { version: '1.0.0', signTransactionBlock: vi.fn() },
			},
		});
		expect(MOBILE_WALLET_FILTER(wallet)).toBe(true);
	});

	it('should accept wallets with standard:connect feature (popup-based auth)', () => {
		const wallet = createMockWallet({
			features: {
				'standard:connect': { version: '1.0.0', connect: vi.fn() },
			},
		});
		expect(MOBILE_WALLET_FILTER(wallet)).toBe(true);
	});

	it('should accept Slush wallet by name', () => {
		const wallet = createMockWallet({
			name: SLUSH_WALLET_NAME,
			features: {}, // No features, just the name
		});
		expect(MOBILE_WALLET_FILTER(wallet)).toBe(true);
	});

	it('should reject wallets without any qualifying features or name', () => {
		// Create wallet without default features to test rejection
		const wallet = {
			name: 'Unknown Wallet',
			version: '1.0.0' as const,
			icon: 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=',
			chains: ['sui:mainnet'],
			accounts: [],
			features: {
				'some:random:feature': { version: '1.0.0' },
			},
		} as unknown as WalletWithRequiredFeatures;
		expect(MOBILE_WALLET_FILTER(wallet)).toBe(false);
	});
});

describe('getEnvironmentAwareWalletFilter', () => {
	const originalNavigator = global.navigator;
	const originalWindow = global.window;

	beforeEach(() => {
		vi.restoreAllMocks();
	});

	afterEach(() => {
		Object.defineProperty(global, 'navigator', {
			value: originalNavigator,
			configurable: true,
		});
		Object.defineProperty(global, 'window', {
			value: originalWindow,
			configurable: true,
		});
	});

	function mockDesktopEnvironment() {
		Object.defineProperty(global, 'navigator', {
			value: {
				userAgent:
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/116.0.0.0 Safari/537.36',
				maxTouchPoints: 0,
			},
			configurable: true,
		});
		Object.defineProperty(global, 'window', {
			value: {
				innerWidth: 1920,
				innerHeight: 1080,
			},
			configurable: true,
		});
	}

	function mockMobileEnvironment() {
		Object.defineProperty(global, 'navigator', {
			value: {
				userAgent:
					'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Mobile Safari/604.1',
				maxTouchPoints: 5,
			},
			configurable: true,
		});
		Object.defineProperty(global, 'window', {
			value: {
				innerWidth: 390,
				innerHeight: 844,
			},
			configurable: true,
		});
	}

	it('should return MOBILE_WALLET_FILTER when explicitly passed isMobile=true', () => {
		mockDesktopEnvironment(); // Even on desktop, explicit true should use mobile filter
		const filter = getEnvironmentAwareWalletFilter(true);
		expect(filter).toBe(MOBILE_WALLET_FILTER);
	});

	it('should return DEFAULT_WALLET_FILTER when explicitly passed isMobile=false', () => {
		mockMobileEnvironment(); // Even on mobile, explicit false should use desktop filter
		const filter = getEnvironmentAwareWalletFilter(false);
		expect(filter).toBe(DEFAULT_WALLET_FILTER);
	});

	it('should auto-detect and return MOBILE_WALLET_FILTER on mobile', () => {
		mockMobileEnvironment();
		const filter = getEnvironmentAwareWalletFilter();
		expect(filter).toBe(MOBILE_WALLET_FILTER);
	});

	it('should auto-detect and return DEFAULT_WALLET_FILTER on desktop', () => {
		mockDesktopEnvironment();
		const filter = getEnvironmentAwareWalletFilter();
		expect(filter).toBe(DEFAULT_WALLET_FILTER);
	});
});
