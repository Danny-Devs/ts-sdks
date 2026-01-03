---
'@mysten/dapp-kit': minor
---

Add mobile wallet detection and support

- Add `isMobileEnvironment()` utility to detect mobile browsers
- Add `isIOSEnvironment()` utility to detect iOS devices
- Add `isAndroidEnvironment()` utility to detect Android devices
- Add `areWalletExtensionsUnavailable()` utility to check if browser extensions work
- Add `MOBILE_WALLET_FILTER` for more permissive wallet filtering on mobile
- Add `getEnvironmentAwareWalletFilter()` to auto-select the right filter based on environment
- Export all mobile detection utilities for custom implementations

This enables dApps to properly show wallets like Slush on mobile browsers where traditional
browser extensions can't inject. Slush uses a popup-based authentication that works on mobile.
