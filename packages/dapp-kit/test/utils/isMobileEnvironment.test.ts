// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	isMobileEnvironment,
	isIOSEnvironment,
	isAndroidEnvironment,
	areWalletExtensionsUnavailable,
} from '../../src/utils/isMobileEnvironment.js';

// Mobile user agents for testing
const MOBILE_USER_AGENTS = {
	iPhoneSafari:
		'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
	iPadSafari:
		'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
	androidChrome:
		'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
	androidSamsung:
		'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
};

const DESKTOP_USER_AGENTS = {
	chromeWindows:
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
	chromeMac:
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
	firefoxWindows:
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:117.0) Gecko/20100101 Firefox/117.0',
	safariMac:
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15',
};

describe('isMobileEnvironment', () => {
	const originalNavigator = global.navigator;
	const originalWindow = global.window;

	beforeEach(() => {
		// Reset mocks
		vi.restoreAllMocks();
	});

	afterEach(() => {
		// Restore original navigator and window
		Object.defineProperty(global, 'navigator', {
			value: originalNavigator,
			configurable: true,
		});
		Object.defineProperty(global, 'window', {
			value: originalWindow,
			configurable: true,
		});
	});

	function mockUserAgent(userAgent: string) {
		Object.defineProperty(global, 'navigator', {
			value: {
				userAgent,
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

	function mockMobileEnvironment(userAgent: string, touchPoints: number = 5) {
		Object.defineProperty(global, 'navigator', {
			value: {
				userAgent,
				maxTouchPoints: touchPoints,
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

	describe('mobile detection', () => {
		it('should detect iPhone Safari as mobile', () => {
			mockMobileEnvironment(MOBILE_USER_AGENTS.iPhoneSafari);
			expect(isMobileEnvironment()).toBe(true);
		});

		it('should detect iPad Safari as mobile', () => {
			mockMobileEnvironment(MOBILE_USER_AGENTS.iPadSafari);
			expect(isMobileEnvironment()).toBe(true);
		});

		it('should detect Android Chrome as mobile', () => {
			mockMobileEnvironment(MOBILE_USER_AGENTS.androidChrome);
			expect(isMobileEnvironment()).toBe(true);
		});

		it('should detect Android Samsung browser as mobile', () => {
			mockMobileEnvironment(MOBILE_USER_AGENTS.androidSamsung);
			expect(isMobileEnvironment()).toBe(true);
		});
	});

	describe('desktop detection', () => {
		it('should detect Chrome on Windows as desktop', () => {
			mockUserAgent(DESKTOP_USER_AGENTS.chromeWindows);
			expect(isMobileEnvironment()).toBe(false);
		});

		it('should detect Chrome on Mac as desktop', () => {
			mockUserAgent(DESKTOP_USER_AGENTS.chromeMac);
			expect(isMobileEnvironment()).toBe(false);
		});

		it('should detect Firefox on Windows as desktop', () => {
			mockUserAgent(DESKTOP_USER_AGENTS.firefoxWindows);
			expect(isMobileEnvironment()).toBe(false);
		});

		it('should detect Safari on Mac as desktop', () => {
			mockUserAgent(DESKTOP_USER_AGENTS.safariMac);
			expect(isMobileEnvironment()).toBe(false);
		});
	});

	describe('server-side rendering', () => {
		it('should return false when window is undefined', () => {
			Object.defineProperty(global, 'window', {
				value: undefined,
				configurable: true,
			});
			expect(isMobileEnvironment()).toBe(false);
		});

		it('should return false when navigator is undefined', () => {
			Object.defineProperty(global, 'navigator', {
				value: undefined,
				configurable: true,
			});
			expect(isMobileEnvironment()).toBe(false);
		});
	});
});

describe('isIOSEnvironment', () => {
	const originalNavigator = global.navigator;

	afterEach(() => {
		Object.defineProperty(global, 'navigator', {
			value: originalNavigator,
			configurable: true,
		});
	});

	function mockNavigator(userAgent: string, maxTouchPoints: number = 0) {
		Object.defineProperty(global, 'navigator', {
			value: {
				userAgent,
				maxTouchPoints,
			},
			configurable: true,
		});
		// Mock document for iPadOS detection
		Object.defineProperty(global, 'document', {
			value: {
				ontouchend: null,
			},
			configurable: true,
		});
	}

	it('should detect iPhone as iOS', () => {
		mockNavigator(MOBILE_USER_AGENTS.iPhoneSafari, 5);
		expect(isIOSEnvironment()).toBe(true);
	});

	it('should detect iPad as iOS', () => {
		mockNavigator(MOBILE_USER_AGENTS.iPadSafari, 5);
		expect(isIOSEnvironment()).toBe(true);
	});

	it('should not detect Android as iOS', () => {
		mockNavigator(MOBILE_USER_AGENTS.androidChrome, 5);
		expect(isIOSEnvironment()).toBe(false);
	});

	it('should not detect desktop Chrome as iOS', () => {
		mockNavigator(DESKTOP_USER_AGENTS.chromeWindows);
		expect(isIOSEnvironment()).toBe(false);
	});

	it('should return false when navigator is undefined', () => {
		Object.defineProperty(global, 'navigator', {
			value: undefined,
			configurable: true,
		});
		expect(isIOSEnvironment()).toBe(false);
	});
});

describe('isAndroidEnvironment', () => {
	const originalNavigator = global.navigator;

	afterEach(() => {
		Object.defineProperty(global, 'navigator', {
			value: originalNavigator,
			configurable: true,
		});
	});

	function mockNavigator(userAgent: string) {
		Object.defineProperty(global, 'navigator', {
			value: {
				userAgent,
				maxTouchPoints: 0,
			},
			configurable: true,
		});
	}

	it('should detect Android Chrome as Android', () => {
		mockNavigator(MOBILE_USER_AGENTS.androidChrome);
		expect(isAndroidEnvironment()).toBe(true);
	});

	it('should detect Android Samsung as Android', () => {
		mockNavigator(MOBILE_USER_AGENTS.androidSamsung);
		expect(isAndroidEnvironment()).toBe(true);
	});

	it('should not detect iPhone as Android', () => {
		mockNavigator(MOBILE_USER_AGENTS.iPhoneSafari);
		expect(isAndroidEnvironment()).toBe(false);
	});

	it('should not detect desktop Chrome as Android', () => {
		mockNavigator(DESKTOP_USER_AGENTS.chromeWindows);
		expect(isAndroidEnvironment()).toBe(false);
	});

	it('should return false when navigator is undefined', () => {
		Object.defineProperty(global, 'navigator', {
			value: undefined,
			configurable: true,
		});
		expect(isAndroidEnvironment()).toBe(false);
	});
});

describe('areWalletExtensionsUnavailable', () => {
	const originalNavigator = global.navigator;
	const originalWindow = global.window;

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

	function mockEnvironment(userAgent: string, isMobile: boolean = false) {
		Object.defineProperty(global, 'navigator', {
			value: {
				userAgent,
				maxTouchPoints: isMobile ? 5 : 0,
			},
			configurable: true,
		});
		Object.defineProperty(global, 'window', {
			value: {
				innerWidth: isMobile ? 390 : 1920,
				innerHeight: isMobile ? 844 : 1080,
			},
			configurable: true,
		});
		// Mock document for iPadOS detection
		Object.defineProperty(global, 'document', {
			value: {
				ontouchend: isMobile ? null : undefined,
			},
			configurable: true,
		});
	}

	it('should return true for iOS devices', () => {
		mockEnvironment(MOBILE_USER_AGENTS.iPhoneSafari, true);
		expect(areWalletExtensionsUnavailable()).toBe(true);
	});

	it('should return true for Android devices', () => {
		mockEnvironment(MOBILE_USER_AGENTS.androidChrome, true);
		expect(areWalletExtensionsUnavailable()).toBe(true);
	});

	it('should return false for desktop browsers', () => {
		mockEnvironment(DESKTOP_USER_AGENTS.chromeWindows, false);
		expect(areWalletExtensionsUnavailable()).toBe(false);
	});

	it('should return false for Mac desktop browsers', () => {
		mockEnvironment(DESKTOP_USER_AGENTS.chromeMac, false);
		expect(areWalletExtensionsUnavailable()).toBe(false);
	});
});
