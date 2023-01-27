import { node } from "../services/anchor.js";

import { 
    isLoaded,
} from "../services/store.js";

export const loader = () => {

    const onMount = () => {
        console.log("Starting Loading...");
        
        setTimeout(() => {
            console.log("Done Loading.");
            isLoaded.set(true)
        }, 5000);

    };

    const onRemoved = () => {
        console.log("I have been removed");
    }

    return node('div', { onMount : onMount, onRemoved : onRemoved }, [
        node('div', [
            node('div', [
                node('p', 'Loader'),
            ]),
        ])
    ]);
}