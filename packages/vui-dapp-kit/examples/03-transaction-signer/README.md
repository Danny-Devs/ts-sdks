# Example 03: Transaction Signer

**Demonstrates:** Signing and executing transactions using `useSignAndExecuteTransaction`

## What This Shows

- Building transactions with Transaction builder
- Signing transactions with user's wallet
- Executing transactions on-chain
- Error handling
- Success/failure states

## Run This Example

```bash
pnpm install
pnpm dev
```

Open http://localhost:5176/

## Code Walkthrough

### 1. Get the Mutation Hook

```ts
const {
  mutate: signAndExecute,
  isPending,
  data: txResult,
  error: txError,
} = useSignAndExecuteTransaction()
```

This returns:
- `signAndExecute` - Function to call with transaction
- `isPending` - True while transaction is being signed/executed
- `data` - Transaction result when successful
- `error` - Error object if failed

### 2. Build a Transaction

```ts
import { Transaction } from '@mysten/sui/transactions'

const tx = new Transaction()

// Convert SUI to MIST (1 SUI = 1 billion MIST)
const amountInMist = Math.floor(amount * 1_000_000_000)

// Split coins from gas and transfer
const [coin] = tx.splitCoins(tx.gas, [amountInMist])
tx.transferObjects([coin], recipientAddress)
```

The Transaction builder provides methods for all SUI transaction types.

### 3. Sign and Execute

```ts
signAndExecute(
  { transaction: tx },
  {
    onSuccess: (result) => {
      console.log('Transaction digest:', result.digest)
      console.log('Effects:', result.effects)
    },
    onError: (error) => {
      console.error('Failed:', error.message)
    },
  }
)
```

The transaction will:
1. Open your wallet for approval
2. Sign with your private key
3. Submit to the network
4. Return the result

## Transaction Types

You can build any SUI transaction:

**Transfers:**
```ts
tx.transferObjects([coin], recipient)
tx.transferObjects([object1, object2], recipient)
```

**Move Calls:**
```ts
tx.moveCall({
  target: '0xpackage::module::function',
  arguments: [tx.pure.u64(100), tx.object('0x...')],
})
```

**Coin Operations:**
```ts
const [coin] = tx.splitCoins(tx.gas, [amount])
tx.mergeCoins(destination, [coin1, coin2])
```

**Publishing:**
```ts
tx.publish({ modules, dependencies })
```

## Error Handling

Common errors:
- **"Insufficient gas"** - Not enough SUI to pay for gas
- **"User rejected"** - User canceled in wallet
- **"Invalid address"** - Malformed recipient address
- **"Dry run failed"** - Transaction would fail on-chain

Always wrap in try/catch or use `onError` callback!

## Key Features

✅ **Type-Safe** - Transaction builder is fully typed
✅ **Gas Management** - Automatic gas budget calculation
✅ **Error Recovery** - Detailed error messages
✅ **Loading States** - Track signing/execution progress
✅ **Result Details** - Get digest, effects, events

## Next Steps

- Build your own transaction types
- Integrate into PumpSui for meme coin creation
- [Full API Documentation](../../README.md)
