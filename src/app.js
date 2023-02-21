import { node, nodeBlock } from "./services/anchor.js";
import { counter, name } from "./services/store.js";

export const app = () => {
    return nodeBlock([
        node('h1', (e) => name.subscribe((n) => e.innerText = `Hello ${n}`)),
        node('input', { onkeyup : (e) => name.set(e.target.value) }, (e) => name.subscribe((n) => e.value = `${n}`)),
        node('div', [
            node('h2', (e) => counter.subscribe((count) => e.innerText = `Count: ${count}`)),
            node('button', 'Increase', { onclick : () => counter.set(counter.get()+1) }),
            node('button', 'Decrease', { onclick : () => counter.set(counter.get()-1) }),
        ])
    ])
}