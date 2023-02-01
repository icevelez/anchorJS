import { node, nodeBlock, signal } from "../services/anchor.js";

export const main = () => {

    const counter = signal(0);

    const increaseCounter = () => counter.set(counter.get() + 1);
    
    return nodeBlock([
        node('h1', 'Hello Main'),
        node('div', [
            node('h2', `${counter.get()}`, (e) => counter.subscribe((v) => e.innerText = `${counter.get()}`)),
            node('button', 'Click Me', { onclick : increaseCounter })
        ])
    ]);
}