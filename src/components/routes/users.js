import { node, nodeBlock, nodeIf, nodeFor, signal } from "../../services/anchor.js";

import { 
    isLoaded,
    auth,
} from "../../services/store.js";

export const users = () => {

    return node('p', 'Hello Users');
}