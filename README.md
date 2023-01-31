## Anchor JS

A pseudo component based framework.

---

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

### AnchorJS Functions

```signal()``` - is a function based on the observer pattern; pub-sub; behaviorSubject in RxJS; Writable stores in Svelte. Which accepts an initial value to be subscribe to and published. It is the core function that helps you create a reactive application without the need for a runtime like Zone.js or the virtualDOM.

Example
```js
const counter = signal(0);

const increaseCounter = () => counter.set(counter.get() + 1);

node('div', [
    node('h1', `${counter.get()}`, (e) => counter.subscribe((v) => e.innerText = `${e}`)),
    node('button', 'Click Me', { onclick : increaseCounter})
])
```

```node()``` - is a function that generates HTML element. 
*   The first parameter accepts a string which is its tagname; 
*   ```optional``` The second parameter is either a string or an object, a string if you want a text inside, or an object that contain its attribute such as ```class``` ```onclick``` ```style``` ```dataset``` 
*   ```optional``` The third parameter is either an object or an array. An object for its attribute or an Array for its children

Example
```js 
node('div', { class : 'my-style'}, [
    node('p', 'this is an example', { style : 'color: red;' })
])
```

```NodeIf()``` - is a function that hides or show your ```node()``` elements. 
*   The first parameter accepts a ```signal()``` object that is the state of your if-statement; 
*   The second parameter accepts an Array of ```node()``` elements
*   ```optional``` The third parameter is an *else-statement* that accepts an Array of ```node()``` elements that will be shown when your if-statement is false.

Example
```js
import { signal } from './src/services/achor.js';

const showPerson = signal(true);

nodeIf(showPerson, [
    node('div', [
        node('img', { src : './assets/images/user.jpg' }),
        node('h2', 'Allan Poe')
    ])
], [
    node('h1', 'No User')
])
```

---

## Why AnchorJS was made

It was made as a hobby and for fun

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