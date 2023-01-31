import { nodeIf } from "./services/anchor.js";

import { auth, isLoaded, usePlayground } from "./services/store.js";

import { signin } from "./components/signin.js";
import { main } from "./components/main.js";

export const app = () => {
    return nodeIf(auth.isAuthenticated, 
        main(), 
        signin()
    );
}
