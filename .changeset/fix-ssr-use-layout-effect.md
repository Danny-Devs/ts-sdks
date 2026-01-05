---
"@mysten/dapp-kit": patch
---

Fix SSR/SSG useLayoutEffect warning

Replaces `useLayoutEffect` with a custom `useIsomorphicLayoutEffect` hook that uses `useLayoutEffect` in browser environments and `useEffect` on the server. This eliminates the warning during SSR/SSG builds:

> "useLayoutEffect does nothing on the server because its effect cannot be encoded into the server renderer's output format."

Affected hooks:
- `useAutoConnectWallet`
- `useSlushWallet`
