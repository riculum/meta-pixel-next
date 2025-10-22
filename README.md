# `@riculum/meta-pixel-next`

A tiny, type-safe Meta (Facebook) Pixel component for **Next.js**.  
Zero dependencies. SSR-safe. Optional `<noscript>` fallback. Works with App Router and Pages Router.

> Ships a single `<MetaPixel />` component that injects the official fbq snippet via `next/script`, plus optional snippets for SPA page views and consent-gated loading.

---

## Install

```bash
pnpm add @riculum/meta-pixel-next
# npm i @riculum/meta-pixel-next
```

Peer deps:
- `next >= 13.4`
- `react >= 18.2`
- `react-dom >= 18.2`

---

## Quick start (App Router)

1) Set your Pixel ID:

```env
# .env.local
NEXT_PUBLIC_FB_PIXEL_ID=123456789012345
```

2) Add the component in `app/layout.tsx`:

```tsx
// app/layout.tsx
import type { ReactNode } from "react";
import { MetaPixel } from "@riculum/meta-pixel-next";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body>
        {children}
        <MetaPixel pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID!} />
        </body>
        </html>
    );
}
```

This initializes your Pixel and fires **one `PageView` on hydration** (configurable).

---

## Track SPA page views (App Router)

Add a tiny listener once to track `PageView` on client-side navigations:

```tsx
// app/fb-pageview-listener.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function FBPageViewListener() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (typeof window === "undefined" || typeof window.fbq !== "function") return;
        window.fbq("track", "PageView");
    }, [pathname, searchParams]);

    return null;
}
```

Use it in `app/layout.tsx` (after `<MetaPixel />`):

```tsx
import FBPageViewListener from "./fb-pageview-listener";

<MetaPixel pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID!} />
<FBPageViewListener />
```

---

## Pages Router example

```tsx
// pages/_app.tsx
import type { AppProps } from "next/app";
import { MetaPixel } from "@riculum/meta-pixel-next";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();

    useEffect(() => {
        const onRouteChange = () => {
            if (typeof window.fbq === "function") window.fbq("track", "PageView");
        };
        router.events.on("routeChangeComplete", onRouteChange);
        return () => router.events.off("routeChangeComplete", onRouteChange);
    }, [router.events]);

    return (
        <>
            <MetaPixel pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID!} />
            <Component {...pageProps} />
        </>
    );
}
```

---

## Consent-gated loading (optional)

Load the Pixel **only after marketing consent**:

```tsx
// components/ConsentedMetaPixel.tsx
"use client";
import { MetaPixel } from "@riculum/meta-pixel-next";
import { useEffect, useState } from "react";

export function ConsentedMetaPixel({ pixelId }: { pixelId: string }) {
    const [consented, setConsented] = useState(false);

    useEffect(() => {
        // Replace with your CMP’s signal
        const stored = localStorage.getItem("marketing_consent") === "true";
        setConsented(stored);
        const onGranted = () => setConsented(true);
        window.addEventListener("marketing-consent-granted", onGranted);
        return () => window.removeEventListener("marketing-consent-granted", onGranted);
    }, []);

    if (!consented) return null;
    return <MetaPixel pixelId={pixelId} />;
}
```

Use it instead of `<MetaPixel />` in your layout.

---

## API

### `<MetaPixel />`

```tsx
type MetaPixelProps = {
    /** Your Meta Pixel ID, e.g. "123456789012345" */
    pixelId: string;
    /** Auto-fire PageView after init (default: true) */
    trackPageView?: boolean;
    /** Render <noscript> fallback 1x1 image (default: true) */
    noscript?: boolean;
};
```

- Renders nothing on the server.
- Guards against duplicate init across HMR/navigations.
- If `noscript` is true, includes the official `<img>` beacon for non-JS users.

### Using `fbq` elsewhere
### Typed helpers (recommended)

If you import the typed helpers, you get autocomplete and compile‑time checks:

```ts
import { fbTrack, fbTrackCustom } from "@riculum/meta-pixel-next";

// Standard event (strictly typed params per event)
fbTrack("AddToCart", { value: 29.9, currency: "EUR", content_ids: ["sku_123"], content_type: "product" });

// Custom event
fbTrackCustom("CTA_Click", { placement: "pricing_top" });
```

> These helpers no‑op on the server and if `fbq` isn’t initialized yet.


Once initialized, you can trigger events anywhere on the client:

```tsx
// Standard event
window.fbq?.("track", "Lead", { content_name: "HeroCTA" });

// Custom event
window.fbq?.("trackCustom", "CTA_Click", { placement: "pricing_top" });
```

Tip: send `value` and `currency` with ecommerce events for better reporting.

---


## Track standard events (examples)

Below are two common commerce events using the **typed helpers** from this package (client-side only).

```ts
import { fbTrack } from "@riculum/meta-pixel-next";
```

### AddToCart
```tsx
"use client";

export function AddToCartButton() {
  const onClick = () => {
    fbTrack("AddToCart", {
      value: 29.9,
      currency: "EUR",
      content_ids: ["sku_123"],
      content_type: "product"
    });
  };

  return (
    <button onClick={onClick} className="rounded-2xl px-4 py-2 bg-emerald-600 text-white">
      Add to cart
    </button>
  );
}
```

### Purchase
```tsx
"use client";

export function PurchaseTracker() {
  const onConfirm = () => {
    fbTrack("Purchase", {
      value: 59.8,
      currency: "EUR",
      contents: [{ id: "sku_123", quantity: 2, item_price: 29.9 }],
      num_items: 2
    });
  };

  return (
    <button onClick={onConfirm} className="rounded-2xl px-4 py-2 bg-indigo-600 text-white">
      Simulate Purchase
    </button>
  );
}
```

> Tip: send both **`value`** and **`currency`** for commerce events. When sending items, prefer `contents: [{ id, quantity, item_price }]` or `content_ids` + `content_type`.
---


## Troubleshooting

- **“Cannot resolve file base.json”**  
  Your `tsconfig.json` is extending a config you haven’t installed. Remove `extends` or install a base like `@tsconfig/recommended`.

- **No events in Events Manager → Test Events**  
  Check ad blockers, consent gating, and that `pixelId` is set. Verify with the **Meta Pixel Helper** browser extension.

- **Double PageViews**  
  Ensure you aren’t triggering `PageView` from GTM and from the app at the same time. Keep one route listener.

---

## Why this package?

- Minimal surface area, no runtime deps.
- Type-safe props and SSR-safe behavior in Next.js.
- Lets you control consent and routing cleanly without stale third-party wrappers.

---

## Development

```bash
pnpm i
pnpm build
pnpm pack --dry-run   # verify publish contents
```

We publish ESM + types from `dist/`.

---

## Versioning

SemVer:
```bash
npm version patch | minor | major
npm publish --access public
```

Pre-releases:
```bash
npm version 1.0.0-beta.1
npm publish --tag beta
```
---

## More information
[Facebook Conversions API Doku](https://developers.facebook.com/docs/marketing-api/conversions-api)

---

## License

MIT © Riculum

---

## Credits

Uses Meta’s official fbq snippet under their terms. This package just wraps it ergonomically for Next.js.