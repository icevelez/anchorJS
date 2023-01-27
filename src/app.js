import { nodeIf } from "./services/anchor.js";

import { auth, isLoaded, usePlayground } from "./services/store.js";

import { playground } from "./components/playground.js";
import { signin } from "./components/signin.js";
import { main } from "./components/main.js";
import { loader } from "./components/loader.js";

export const app = () => {
    return nodeIf(usePlayground, 
        playground(), 
        nodeIf(auth.isAuthenticated, 
            nodeIf(isLoaded, 
                main(), 
                loader()), 
            signin()
        ));
}
