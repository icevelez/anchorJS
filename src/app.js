import { nodeIf } from "./services/anchor.js";

import { auth, isLoaded, usePlayground } from "./services/store.js";

import { signin } from "./templates/signin.js";
import { main } from "./templates/main.js";

export const app = () => {
    return nodeIf(auth.isAuthenticated, 
        main(), 
        signin()
    );
}
