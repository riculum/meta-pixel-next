import * as react_jsx_runtime from 'react/jsx-runtime';

declare global {
    interface Window {
        __fbPixelInitialized?: boolean;
        fbq?: (...args: any[]) => void;
    }
}
type MetaPixelProps = {
    /** Your Meta Pixel ID (e.g. "123456789012345") */
    pixelId: string;
    /** Auto-fire PageView after init (default: true) */
    trackPageView?: boolean;
    /** Render <noscript> fallback (default: true) */
    noscript?: boolean;
};
declare function MetaPixel({ pixelId, trackPageView, noscript, }: MetaPixelProps): react_jsx_runtime.JSX.Element | null;

declare global {
    interface Window {
        fbq?: (...args: any[]) => void;
    }
}
/** Meta standard events you want to support */
declare const FB_STANDARD_EVENTS: readonly ["PageView", "ViewContent", "Search", "AddToCart", "InitiateCheckout", "AddPaymentInfo", "Purchase", "Lead", "CompleteRegistration"];
type FBStandardEvent = typeof FB_STANDARD_EVENTS[number];
/** Helpful param fragments */
type Money = {
    value?: number;
    currency?: string;
};
type Contents = {
    content_ids?: string[];
    content_type?: string;
} | {
    contents?: Array<{
        id: string;
        quantity?: number;
        item_price?: number;
    }>;
    content_type?: string;
};
/** Strong param typing per event (extend as needed) */
interface FBEventMap {
    PageView: Record<string, never>;
    ViewContent: Partial<Contents & Money> & {
        content_name?: string;
        content_category?: string;
    };
    Search: {
        search_string?: string;
    } & Partial<Money>;
    AddToCart: Partial<Contents & Money>;
    InitiateCheckout: Partial<Contents & Money> & {
        num_items?: number;
    };
    AddPaymentInfo: Partial<Contents & Money>;
    Purchase: Required<Money> & Partial<Contents> & {
        num_items?: number;
    };
    Lead: {
        value?: number;
        currency?: string;
        content_name?: string;
    };
    CompleteRegistration: {
        status?: boolean;
    } & Partial<Money>;
}
/** Track a standard event with strict param typing */
declare function fbTrack<E extends FBStandardEvent>(event: E, params?: FBEventMap[E]): void;
/** Track a custom event */
declare function fbTrackCustom<T extends Record<string, unknown> = Record<string, unknown>>(name: string, params?: T): void;
/** Optional: target a single Pixel if users run multiple IDs */
declare function fbTrackSingle<E extends FBStandardEvent>(pixelId: string, event: E, params?: FBEventMap[E]): void;
declare function fbTrackSingleCustom<T extends Record<string, unknown> = Record<string, unknown>>(pixelId: string, name: string, params?: T): void;

type Standard<E extends FBStandardEvent> = {
    type: "standard";
    name: E;
    params?: FBEventMap[E];
};
type Custom<T extends Record<string, unknown> = Record<string, unknown>> = {
    type: "custom";
    name: string;
    params?: T;
};
declare function useFbClick<E extends FBStandardEvent, T extends Record<string, unknown> = Record<string, unknown>>(opts: Standard<E> | Custom<T>): () => void;

export { type FBEventMap, type FBStandardEvent, FB_STANDARD_EVENTS, MetaPixel, fbTrack, fbTrackCustom, fbTrackSingle, fbTrackSingleCustom, useFbClick };
