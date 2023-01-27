import { node, nodeBlock, nodeIf, nodeFor, signal } from "../services/anchor.js";
import { usePlayground } from "../services/store.js";

export const playground = () => {
    
    const show = signal(true);
    const text = signal("Hello Dok");
    const people = signal([
        {
            name : 'Takeru'
        },
        {
            name : 'Hussein Nasser'
        },
        {
            name : 'Joshua Morony'
        },
        {
            name : 'Evan Yue'
        }
    ]);

    const setText = (e) => text.set(e.target.value);
    const addPerson = () => people.push({ name : `${text.get()}` });
    const removePerson = (name) => people.set(people.get().filter((item) => item.name != name));

    return nodeBlock([
        node('h1', 'Hello Playground'),
        node('button', 'Go Back', { onclick : () => usePlayground.set(false) }),
        node('button', 'Hide or Show', { onclick : () => show.set(!show.get()) }),
        node('button', 'Add', { onclick : addPerson }),
        node('div', [
            node('h1', (e) => text.subscribe((v) => e.innerText = v)),
            node('input', { type : 'text', onkeyup : setText  }, (e) => text.subscribe((v) => e.value = v)),
        ]),
        nodeIf(show, [
            nodeFor(people, ({ name }, index) => nodeBlock([
                node('h1', `${name}, ${index+1}`),
                node('button', 'Remove', { onclick : () => removePerson(name) })
            ])),
        ]),
        node('h1', 'End'),
        node('div', { style : 'background: red' }, [
            node('p', 'I am red', { style : 'color:white;' })
        ])
    ]);
}