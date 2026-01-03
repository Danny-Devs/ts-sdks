// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/**
 * User agent patterns for mobile device detection.
 * Covers major mobile browsers and platforms.
 */
const MOBILE_USER_AGENT_PATTERNS = [
	/Android/i,
	/webOS/i,
	/iPhone/i,
	/iPad/i,
	/iPod/i,
	/BlackBerry/i,
	/Windows Phone/i,
	/Opera Mini/i,
	/IEMobile/i,
	/Mobile Safari/i,
	/mobile/i,
];

/**
 * Detects if the current environment is a mobile browser.
 *
 * This checks:
 * 1. User agent string for mobile patterns
 * 2. Touch capability as a secondary signal
 * 3. Screen size as a tertiary signal
 *
 * @returns true if running in a mobile browser environment
 */
export function isMobileEnvironment(): boolean {
	// Server-side rendering check
	if (typeof window === 'undefined' || typeof navigator === 'undefined') {
		return false;
	}

	const userAgent = navigator.userAgent;

	// Primary check: User agent patterns
	const isMobileUserAgent = MOBILE_USER_AGENT_PATTERNS.some((pattern) => pattern.test(userAgent));

	if (isMobileUserAgent) {
		return true;
	}

	// Secondary check: Touch capability combined with small screen
	// This helps catch cases where user agent is desktop but device is mobile
	const hasTouchCapability =
		'ontouchstart' in window ||
		navigator.maxTouchPoints > 0 ||
		// @ts-expect-error - msMaxTouchPoints is IE-specific
		navigator.msMaxTouchPoints > 0;

	const isSmallScreen = window.innerWidth <= 768;

	// Only consider touch + small screen if both are true
	// This avoids false positives on touchscreen laptops
	if (hasTouchCapability && isSmallScreen) {
		return true;
	}

	return false;
}

/**
 * Detects if the current environment is iOS (Safari or WebView).
 * iOS has specific limitations for wallet extension injection.
 *
 * @returns true if running on iOS
 */
export function isIOSEnvironment(): boolean {
	if (typeof navigator === 'undefined') {
		return false;
	}

	const userAgent = navigator.userAgent;

	// Check for iOS devices
	const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

	// Check for iOS 13+ on iPad (which reports as Mac)
	const isIPadOS =
		userAgent.includes('Mac') && 'ontouchend' in document && navigator.maxTouchPoints > 1;

	return isIOS || isIPadOS;
}

/**
 * Detects if the current environment is Android.
 *
 * @returns true if running on Android
 */
export function isAndroidEnvironment(): boolean {
	if (typeof navigator === 'undefined') {
		return false;
	}

	return /Android/i.test(navigator.userAgent);
}

/**
 * Checks if wallet extensions are likely unavailable due to mobile browser limitations.
 * Mobile browsers (especially iOS Safari) don't support traditional browser extensions,
 * so wallet detection needs to rely on alternative methods like deep links or WalletConnect.
 *
 * @returns true if wallet extensions are likely unavailable
 */
export function areWalletExtensionsUnavailable(): boolean {
	// If not mobile, extensions should be available
	if (!isMobileEnvironment()) {
		return false;
	}

	// On iOS, extensions are never available in the traditional sense
	if (isIOSEnvironment()) {
		return true;
	}

	// On Android, some browsers support extensions, but most mobile use cases don't have them
	// We return true to be conservative and use alternative connection methods
	if (isAndroidEnvironment()) {
		return true;
	}

	// Default to unavailable for other mobile platforms
	return true;
}
