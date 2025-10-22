declare global {
    interface Window {
        fbq?: (...args: any[]) => void;
    }
}

/** Meta standard events you want to support */
export const FB_STANDARD_EVENTS = [
    "PageView",
    "ViewContent",
    "Search",
    "AddToCart",
    "InitiateCheckout",
    "AddPaymentInfo",
    "Purchase",
    "Lead",
    "CompleteRegistration",
] as const;

export type FBStandardEvent = typeof FB_STANDARD_EVENTS[number];

/** Helpful param fragments */
type Money = { value?: number; currency?: string };
type Contents =
    | { content_ids?: string[]; content_type?: string }
    | {
    contents?: Array<{ id: string; quantity?: number; item_price?: number }>;
    content_type?: string;
};

/** Strong param typing per event (extend as needed) */
export interface FBEventMap {
    PageView: Record<string, never>;
    ViewContent: Partial<Contents & Money> & {
        content_name?: string;
        content_category?: string;
    };
    Search: { search_string?: string } & Partial<Money>;
    AddToCart: Partial<Contents & Money>;
    InitiateCheckout: Partial<Contents & Money> & { num_items?: number };
    AddPaymentInfo: Partial<Contents & Money>;
    Purchase: Required<Money> & Partial<Contents> & { num_items?: number };
    Lead: { value?: number; currency?: string; content_name?: string };
    CompleteRegistration: { status?: boolean } & Partial<Money>;
}

/** Internal guard that no-ops on SSR or if fbq is missing */
const callFbq = (...args: any[]) => {
    if (typeof window === "undefined" || typeof window.fbq !== "function") return;
    window.fbq(...args);
};

/** Track a standard event with strict param typing */
export function fbTrack<E extends FBStandardEvent>(event: E, params?: FBEventMap[E]) {
    callFbq("track", event, params ?? {});
}

/** Track a custom event */
export function fbTrackCustom<T extends Record<string, unknown> = Record<string, unknown>>(
    name: string,
    params?: T
) {
    callFbq("trackCustom", name, params ?? {});
}

/** Optional: target a single Pixel if users run multiple IDs */
export function fbTrackSingle<E extends FBStandardEvent>(
    pixelId: string,
    event: E,
    params?: FBEventMap[E]
) {
    callFbq("trackSingle", pixelId, event, params ?? {});
}

export function fbTrackSingleCustom<T extends Record<string, unknown> = Record<string, unknown>>(
    pixelId: string,
    name: string,
    params?: T
) {
    callFbq("trackSingleCustom", pixelId, name, params ?? {});
}
