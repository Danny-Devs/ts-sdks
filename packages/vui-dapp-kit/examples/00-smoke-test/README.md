# 🧪 vui-dapp-kit Smoke Test

**Purpose:** Validate core vui-dapp-kit functionality before PumpSui integration

## What This Tests

1. **✅ Wallet Connection** - ConnectButton component
2. **✅ Balance Query** - useSuiClientQuery composable
3. **✅ Transaction Signing** - useSignTransaction composable

## How to Run

```bash
# From this directory
pnpm dev
```

Then open **http://localhost:5173/**

## Test Instructions

### Test 1: Wallet Connection
1. Click "Connect Wallet" button
2. Select your SUI wallet (Sui Wallet, Suiet, Ethos, etc.)
3. Approve the connection
4. ✅ Should show your address and chains

### Test 2: Balance Query
1. After wallet is connected, this auto-runs
2. ✅ Should display your testnet SUI balance

### Test 3: Transaction Signing
1. Click "Test Transaction (Dry Run)"
2. Approve the signature in your wallet
3. ✅ Should show "Transaction signed successfully"

## Success Criteria

All 3 tests should show **"Passed"** status with green checkmarks.

If all tests pass, you'll see:

```
🎉 ALL TESTS PASSED!
vui-dapp-kit is ready for PumpSui integration.
```

## What to Do If Tests Fail

### Wallet Connection Fails
- Ensure you have a SUI wallet extension installed
- Try refreshing the page
- Check that wallet is unlocked

### Balance Query Fails
- Ensure you're connected to testnet
- Make sure your wallet has a valid account
- Check console for errors

### Transaction Signing Fails
- Ensure wallet supports transaction signing
- Check that you approved the signature
- Look for error message in UI

## Next Steps After Tests Pass

1. ✅ Confidence that vui-dapp-kit works
2. 🚀 Proceed to PumpSui integration
3. 📦 Extract examples from PumpSui
4. 🌐 Build landing page

## Technical Details

- **Framework:** Vue 3 + Vite
- **Dependencies:**
  - @dannydevs/vui-dapp-kit (workspace)
  - @mysten/sui
  - @tanstack/vue-query
  - pinia
- **Network:** Testnet (can switch to mainnet/devnet in App.vue)
