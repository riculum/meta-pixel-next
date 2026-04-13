"use client";

import Script from "next/script";
import type { ScriptProps } from "next/script";
import React from "react";

declare global {
    interface Window {
        __fbPixelInitialized?: boolean;
        fbq?: (...args: any[]) => void;
    }
}

export type MetaPixelProps = {
    /** Your Meta Pixel ID (e.g. "123456789012345") */
    pixelId: string;
    /** Auto-fire PageView after init (default: true) */
    trackPageView?: boolean;
    /** Render <noscript> fallback (default: true) */
    noscript?: boolean;
    /** Next.js Script loading strategy (default: "lazyOnload") */
    strategy?: ScriptProps["strategy"];
};

export function MetaPixel({
                              pixelId,
                              trackPageView = true,
                              noscript = true,
                              strategy = "lazyOnload",
                          }: MetaPixelProps) {
    if (!pixelId) return null;

    const inline = `
    (function(f,b,e,v,n,t,s){
      if(f.fbq) return; n=f.fbq=function(){ n.callMethod ?
      n.callMethod.apply(n,arguments) : n.queue.push(arguments) };
      if(!f._fbq) f._fbq=n; n.push=n; n.loaded=!0; n.version='2.0';
      n.queue=[]; t=b.createElement(e); t.async=!0;
      t.src=v; s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    if (!window.__fbPixelInitialized) {
      window.__fbPixelInitialized = true;
      fbq('init', '${pixelId}');
      ${trackPageView ? `fbq('track', 'PageView');` : ""}
    }
  `;

    return (
        <>
            <Script id="fb-pixel" strategy={strategy}>
                {inline}
            </Script>

            {noscript && (
                <noscript>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        height="1"
                        width="1"
                        style={{ display: "none" }}
                        src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
                        alt=""
                    />
                </noscript>
            )}
        </>
    );
}
