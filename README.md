## AnchorJS

A pseudo component based framework that started as a personal JS library.

## How To Use

You would first need to create an ```app.js``` file. Import ```anchor.js``` then create an HTML template using ```node()``` function

```js
import { node } from './services/anchor.js';

export const app = () => {
    return node('h1', 'Hello World');
} 
```

and export that file to be imported inside your ```index.js``` like so

```js
import { render } from "./src/services/anchor.js";
import { app } from "./src/app.js";

render({
    target : document.body,
    app : app(),
});
```

and you can do this repeatedly, create a new ```.js``` file use the syntax as shown in ```app.js``` then export & import it where ever you like. There are no rules in how you use it

### Core Functions

```node()``` - A function that generates HTML element. 
*   The first parameter accepts a string which is its tagname; 
*   ```optional``` The second parameter is a string or an object. A string for an element text, or an object that contain its attribute such as ```class``` ```onclick``` ```style``` ```dataset``` 
*   ```optional``` The third parameter is an array. An object for its attribute or an Array for its children
* ```optional``` The fourth parameter is a callback to the element to customize its behavior; state; or what you see fit to do with the element 

Example
```js 
node('div', { class : 'my-style'}, [
    node('p', 'this is an example', { style : 'color: red;' })
])
```

```signal()``` - A function based on the observer pattern, ```BehaviorSubject()``` in RxJS, or ```writable()``` stores in Svelte. Which accepts an initial value to be subscribe to and published. It is the core function that helps you create a reactive application without the need for a runtime like Zone.js or the virtualDOM.

Example
```js
const counter = signal(0);

const increaseCounter = () => counter.set(counter.get() + 1);

node('div', [
    node('h1', `${counter.get()}`, (e) => counter.subscribe((v) => e.innerText = `${e}`)),
    node('button', 'Click Me', { onclick : increaseCounter})
])
```

```nodeIf()``` - A function that hides or show your ```node()``` elements. 
*   The first parameter accepts a ```signal()``` object which is the state of your if-statement; 
*   The second parameter accepts an Array of ```node()``` elements
*   ```optional``` The third parameter is an *else-statement* that accepts an Array of ```node()``` elements that will be shown when your if-statement is false.

Example
```js
import { signal } from './src/services/achor.js';

const showPerson = signal(true);

nodeBlock([
    node('div', [
        node('button', 'Show/Hide', { onclick : () => showPerson.set(!showPerson.get()) })
    ]),
    nodeIf(showPerson, [
        node('div', [
            node('img', { src : './assets/images/user.jpg' }),
            node('h2', 'Allan Poe')
        ])
    ], [
        node('h1', 'No User')
    ]),
])
```

```nodeBlock()``` - A function that returns multiple ```node()``` elements

Example
```js
nodeBlock([
    node('h1', 'Hello World'),
    node('p', 'I am a paragraph')
])
```

```nodeFor()``` - A function that is essentially a for-loop, you already know what a for-loop is, you wouldn't be able to understand this if you don't. 

It is a for-loop function to generate multiple ```node()``` elements based on a template

* The first parameter accepts a ```signal()``` object containing the array  
* The second parameter is a callback to what will be rendered

```js
const arrayOfPeople = signal([
    { name : 'Rich Harris' },
    { name : 'Evan Yue' },
    { name : 'Jared Sumner' },
    { name : 'Jeff from Fireship.io' },
    { name : 'Kyle from Web Dev Simplified' },
    { name : 'Theo.gg' },
    { name : 'Hussein Nasser' },
]);

nodeFor(arrayOfPeople, (people, index) => {
    return node('h1', `${people.name}`)
})

// deconstructed object 
nodeFor(arrayOfPeople, ({ name }, index) => {
    return node('h1', `${name}`)
})
```

## Limitation 

Features lacking in AnchorJS

*   Client Side Routing (History or Hash) 
*   Scoped Styles
*   Most features you would have in a modern framework

## What's the purpose of this project? Why was it made?

This project was made as a proof-of-concept, a hobby, and for fun. 

It's predecessor ```HTML.JS``` was a personal JS library that was made to solve my particular problem of generating HTML alongside PHP and helped me create templates with ease but I had a difficult time doing life cycle hooks such as re-rendering, removing elements from the DOM, and having a consistent method of coding. 

When I finally started to use a framework like Svelte & Angular, I had a better idea in solving those previous issues. That's how AnchorJS came to be

## Should I use this in my next project? 

No, unless your project is either a test or for fun

## Maintainers

- [ice](mailto:icevelezdev@gmail.com) - **John Iceberg Velez** (author)

## Bug and Issues

I will not be able to debug and test all edge cases and fix all bugs. Feel free in creating an issue to be resolve. I am happy to improve this project further.

## License

```text
License: MIT 
Copyright (c) 2022 John Iceberg Velez <icevelezdev@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```