"use client";

import { fbTrack, fbTrackCustom, type FBStandardEvent, type FBEventMap } from "./fbpixel";

type Standard<E extends FBStandardEvent> = { type: "standard"; name: E; params?: FBEventMap[E] };
type Custom<T extends Record<string, unknown> = Record<string, unknown>> = {
    type: "custom"; name: string; params?: T;
};

export function useFbClick<
    E extends FBStandardEvent,
    T extends Record<string, unknown> = Record<string, unknown>
>(opts: Standard<E> | Custom<T>) {
    return () => {
        if (opts.type === "standard") fbTrack(opts.name, opts.params);
        else fbTrackCustom<T>(opts.name, opts.params);
    };
}
