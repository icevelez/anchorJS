import { node, nodeBlock, nodeIf, nodeFor, signal } from "../services/anchor.js";
import { router, link, activeRoute } from "../services/router.js";

import { auth, usePlayground } from "../services/store.js";

import { home } from "../components/routes/home.js";
import { users } from "../components/routes/users.js";

export const main = () => {

    const onMount = () => {
        console.log("I have been mounted");
    }

    return nodeBlock([
        node('div', [
            node('a', 'Home', { use : link, href : '/' }),
            node('a', 'Users', { use : link, href : '/users' }),
            node('br'),
            node('button', 'Playground', { onclick : () => usePlayground.set(true) }),
        ]),
        router({
            basehref : '/anchor',
            routes : [
                {
                    name : 'home',
                    path : '/',
                    component : home,
                    // guard : () => true,
                    // redirect : '',
                },
                {
                    name : 'users',
                    paths : [
                        '/users',
                        '/users/u/new',
                        '/users/u/:user_uuid',
                        '/users/u/:user_uuid/edit',
                        '/users/u/:user_uuid/remove',
                        '/users/g/new',
                        '/users/g/:group_uuid',
                        '/users/g/:group_uuid/edit',
                        '/users/g/:group_uuid/remove',
                        '/users/g/:group_uuid/user/add',
                        '/users/g/:group_uuid/user/:user_uuid/remove',
                    ],
                    component : users
                },
                {
                    name : 'services',
                    paths : [
                        '/services',
                        '/services/new',
                        '/services/:service_uuid',
                        '/services/:service_uuid/edit',
                        '/services/:service_uuid/remove',
                    ],
                    component : () => { /* services */ }
                },
                {
                    path : '/*',
                    component : () => { /* 404 page not found */ },
                }
            ]
        }),
        node('button', 'Sign Out', { onclick : (e) => auth.isAuthenticated.set(false) }),
    ], { onMount });
}