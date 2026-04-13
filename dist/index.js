import Script from 'next/script';
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';

// src/MetaPixel.tsx
function MetaPixel({
  pixelId,
  trackPageView = true,
  noscript = true,
  strategy = "lazyOnload"
}) {
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Script, { id: "fb-pixel", strategy, children: inline }),
    noscript && /* @__PURE__ */ jsx("noscript", { children: /* @__PURE__ */ jsx(
      "img",
      {
        height: "1",
        width: "1",
        style: { display: "none" },
        src: `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`,
        alt: ""
      }
    ) })
  ] });
}

// src/fbpixel.ts
var FB_STANDARD_EVENTS = [
  "PageView",
  "ViewContent",
  "Search",
  "AddToCart",
  "InitiateCheckout",
  "AddPaymentInfo",
  "Purchase",
  "Lead",
  "CompleteRegistration"
];
var callFbq = (...args) => {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq(...args);
};
function generateEventId(prefix = "evt") {
  const randomString = Math.random().toString(36).slice(2);
  const timestamp = Date.now().toString(36);
  return `${prefix}_${timestamp}_${randomString}`;
}
function fbTrack(event, params, eventId = generateEventId(event)) {
  const fullParams = { ...params, event_id: eventId };
  callFbq("track", event, fullParams);
}
function fbTrackCustom(name, params, eventId = generateEventId(name)) {
  const fullParams = { ...params, event_id: eventId };
  callFbq("trackCustom", name, fullParams);
}
function fbTrackSingle(pixelId, event, params, eventId = generateEventId(event)) {
  const fullParams = { ...params, event_id: eventId };
  callFbq("trackSingle", pixelId, event, fullParams);
}
function fbTrackSingleCustom(pixelId, name, params, eventId = generateEventId(name)) {
  const fullParams = { ...params, event_id: eventId };
  callFbq("trackSingleCustom", pixelId, name, fullParams);
}

// src/useFbClick.ts
function useFbClick(opts) {
  return () => {
    if (opts.type === "standard") fbTrack(opts.name, opts.params);
    else fbTrackCustom(opts.name, opts.params);
  };
}

export { FB_STANDARD_EVENTS, MetaPixel, fbTrack, fbTrackCustom, fbTrackSingle, fbTrackSingleCustom, generateEventId, useFbClick };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map