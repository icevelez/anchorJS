import { signal } from "./anchor.js";

export const usePlayground = signal(false);
export const isLoaded = signal(false);

export const auth = Object.freeze({
    isAuthenticated : signal(false),
});

export const counter = signal(0);