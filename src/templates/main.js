import { node, nodeBlock, nodeFor, signal } from "../services/anchor.js";

import { counter, auth, userData } from "../services/store.js";

import { button } from "./components/button.js";

export const main = () => {

    const arrayOfPeople = signal([
        { name : 'Rich Harris' },
        { name : 'Evan Yue' },
        { name : 'Jared Sumner' },
        { name : 'Jeff from Fireship.io' },
        { name : 'Kyle from Web Dev Simplified' },
        { name : 'Theo t3.gg' },
        { name : 'Hussein Nasser' },
    ]);

    const onMount = () => {
        console.log("I have been mounted");
    }

    const onRemove = () => {
        console.log("I have been removed");
    }

    return nodeBlock([
        node('h1', (e) => userData.subscribe(({ username }) => e.innerText = `Hello ${username}`)),
        node('div', [
            node('h2', (e) => counter.subscribe((value) => e.innerText = `${value * 2}`)),
            button(),
        ]),
        nodeFor(arrayOfPeople, ({ name }, index) => {
            return node('div', { style : 'display: flex; align-items: center; gap: 1rem;' }, [
                node('p', `${index+1}. ${name}`),
                node('div', [
                    node('button', 'Remove', { onclick : () => arrayOfPeople.splice(index) }),
                ])
            ])
        }),
        node('button', 'Go Back', { onclick : () => auth.isAuthenticated.set(false) }),
    ], { onMount, onRemove });
}