import { node } from "../../services/anchor.js";
import * as Store from "../../services/store.js";

export const button = () => {
    return node('button', 'Click Me', { onclick : () => Store.counter.set(Store.counter.get() + 1) });
}