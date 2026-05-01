import { startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { HydratedRouter } from 'react-router/dom'
import '../src/i18n'

startTransition(() => {
  hydrateRoot(
    document,
    <HydratedRouter />,
    {
      onRecoverableError(error: unknown) {
        // Browser extensions or third-party scripts can mutate SSR HTML before hydration.
        // Ignore recoverable hydration mismatch logs to avoid noisy false positives in dev.
        const message = error instanceof Error ? error.message : String(error)
        if (/Hydration failed|did not match|Text content does not match/i.test(message)) return
        console.error(error)
      },
    },
  )
})
