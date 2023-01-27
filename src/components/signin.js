import { node } from "../services/anchor.js";
import { tools } from "../services/util.js";

import { auth } from "../services/store.js";

export const signin = () => {

    const signin = (e) => {
        e.preventDefault();

        const form = e.target;
        const { username, password } = tools.serializeForm(form);

        form.reset();
        
        auth.isAuthenticated.set(true);
    }

    return node('div', [
        node('div', [
            node('form', { onsubmit : signin }, [
                node('div', [
                    node('h3', 'App Abbreviation'),
                    node('h4', 'Full App Name Here'),
                ]),
                node('div', [
                    node('label', [
                        node('span', 'Username'),
                        node('input', { type : 'text', name : 'username', required : true }),
                    ]),
                    node('label', [
                        node('span', 'Password'),
                        node('input', { type : 'password', name : 'password', required : true }),
                    ]),
                    node('label', 'Error Message Here'),
                ]),
                node('div', [
                    node('button', 'Sign In', { type : 'submit' }),
                ])
            ]),
        ])
    ]);
}