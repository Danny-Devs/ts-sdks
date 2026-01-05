---
"@mysten/sui": minor
---

feat(cryptography): allow `deriveKeypairFromSeed` to accept `Uint8Array` in addition to hex string

This enhancement allows developers to pass the seed directly as a `Uint8Array` to `Ed25519Keypair.deriveKeypairFromSeed()`, in addition to the existing hex string format. This is useful when working with raw seed bytes from other sources like hardware wallets or key derivation functions.

Closes #25
