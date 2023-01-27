import { render } from "./src/services/anchor.js";
import { app } from "./src/app.js";

render({
    target : document.body,
    app : app(),
});