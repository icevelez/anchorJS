import { node, nodeBlock, nodeFor, signal } from "../services/anchor.js";

export const main = () => {

    const counter = signal(0);

    const increaseCounter = () => counter.set(counter.get() + 1); 

    const arrayOfPeople = signal([
        { name : 'Rich Harris' },
        { name : 'Evan Yue' },
        { name : 'Jared Sumner' },
        { name : 'Jeff from Fireship.io' },
        { name : 'Kyle from Web Dev Simplified' },
        { name : 'Theo.gg' },
        { name : 'Hussein Nasser' },
    ]);

    return nodeBlock([
        node('h1', 'Hello Main'),
        node('div', [
            node('h2', `${counter.get()}`, (e) => counter.subscribe((v) => e.innerText = `${counter.get()}`)),
            node('button', 'Click Me', { onclick : increaseCounter })
        ]),
        nodeFor(arrayOfPeople, ({ name }, index) => {
            return node('div', { style : 'display: flex; align-items: center; gap: 1rem;' }, [
                node('p', `${index+1}. ${name}`),
                node('div', [
                    node('button', 'Remove', { onclick : () => arrayOfPeople.splice(index) }),
                ])
            ])
        })
    ]);
}