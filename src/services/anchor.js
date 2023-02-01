export const render = ({ target, app }) => {
    target.replaceChildren();
    target.append(app);
}

export const signal = (initialValue = undefined) => {
    let value = initialValue;
    const subscribers = new Set();

    const get = () => value;

    const set = (setValue) => {
        value = setValue || null;
        subscribers.forEach((subscriber) => subscriber(value));
    }
    const update = (callback) => {
        if (typeof callback != 'function') return console.error("signal(): callback is not a function.");
        value = callback(value);
        subscribers.forEach((subscriber) => subscriber(value));
    };

    const subscribe = (subscriber) => {
        if (typeof subscriber != 'function') return console.error("signal(): callback is not a function.");
        subscribers.add(subscriber);
        if (value != undefined) subscriber(value);
    };
    const unsubscribe = (subscriber) => {
        if (typeof subscriber != 'function') return console.error("signal(): callback is not a function.");
        subscribers.delete(subscriber);
    }

    const clear = () => subscribers.clear();
    const length = () => subscribers.size;

    const assign = (newValue) => {
        if (typeof value !== 'object' || Array.isArray(value)) 
            return console.error("signal(): value is not an object.");
        if (typeof newValue != 'object' || Array.isArray(newValue)) 
            return console.error("signal(): new value is not an object.");
        set(Object.assign(value, newValue))
    }

    const push = (newValue) => {
        if (!(typeof value === 'object' && Array.isArray(value))) return console.error("signal(): value is not an array.");
        value.push(newValue);
        set(value)
    }

    const splice = (index) => {
        if (!(typeof value === 'object' && Array.isArray(value))) return console.error("signal(): value is not an array.");
        value.splice(index, 1);
        set(value);
    }

    return { subscribe, unsubscribe, update, set, assign, push, splice, get, length, clear  };
}

export const node = (tag = "error", attribute = "", children = "", _callback = "") => {
    
    if (typeof tag != "string" || tag == "") {
        const error = document.nodeent("error");
        error.innerText = "HTML tag name error.";
        return error;
    }

    const element = document.createElement(tag);

    if (typeof children == "function") [_callback, children] = [children, []];
    if (typeof attribute == "function") [_callback, attribute] = [attribute, {}];            
    if (typeof attribute === "string" || typeof attribute === "number") {
        element.innerText = attribute;
        attribute = {};
    }
    if (typeof children == "object" && !Array.isArray(children)) [attribute, children] = [children, []];
    
    if (Array.isArray(attribute)) [children, attribute] = [attribute, {}];

    Object.assign(element, { _anchorData : { isNode : true } });

    Object.keys(attribute).forEach((key, index) => {
        switch(key) {
            case "onMount":
                element._anchorData.onMount = attribute[key];
            break;
            case "onRemove":
                element._anchorData.onRemove = attribute[key];
            break;

            case "use":
                attribute[key](element);
            break;

            case "dataset":
                if (typeof attribute.dataset !== "object") return;
                Object.keys(attribute.dataset).forEach((key, index) => element.setAttribute(`data-${key}`, attribute.dataset[key]));
            break;

            default: 
                if (key.substring(0,2) === 'on') return element[key] = (e) => attribute[key](e);
                return element.setAttribute(key, attribute[key]); 
            break;
        }   
    });

    if (Array.isArray(children) && children.length > 0) children.forEach((item, index) => element.append(item));

    if (typeof _callback === "function") _callback(element);

    return element;
};

const anchorAddRemove = Object.freeze({
    remove : (children) => {
        if (children) {
            if (Array.isArray(children) && children.length > 0) return children.forEach((child) => {
                if (child.parentNode) child.parentNode.removeChild(child);
            })

            if (children.parentNode) children.parentNode.removeChild(children);
        }
    },
    add : (anchor, children) => {
        if (children) {
            if (Array.isArray(children) && children.length > 0) return children.forEach((child) => {
                if (anchor.parentNode) anchor.parentNode.insertBefore(child, anchor);
            })
            if (anchor.parentNode) anchor.parentNode.insertBefore(children, anchor);
        }
    },
});

export const nodeBlock = (children, attribute = null) => {

    const anchor = new Text();

    Object.assign(anchor, { _anchorData : { isBlock : true, children } });
    
    const { add, remove } = anchorAddRemove;

    if (attribute && attribute.onMount && typeof attribute.onMount === 'function') 
        anchor._anchorData.onMount = attribute.onMount;

    if (attribute && attribute.onRemove && typeof attribute.onRemove === 'function') 
        anchor._anchorData.onRemove = attribute.onRemove;
        
    anchor._anchorData.add = () => add(anchor, children);
    anchor._anchorData.remove = () => remove(children);

    return anchor;
}

export const nodeIf = (state, children, elseChildren = null) => {

    const anchor = new Text();

    Object.assign(anchor, { _anchorData : { isIf : true, children, elseChildren } });

    const { add, remove } = anchorAddRemove;

    state.subscribe((v) => {      
        if (v) {
            add(anchor, children);
            remove(elseChildren);
        } else {
            add(anchor, elseChildren);
            remove(children);
        }
    })

    anchor._anchorData.add = () => add(anchor, state.get() ? children : elseChildren);
    anchor._anchorData.remove = () => {
        remove(children);
        remove(elseChildren);
    };

    return anchor;
}

export const nodeFor = (state, callback) => {

    const anchor = new Text();
    Object.assign(anchor, { _anchorData : { isFor : true } });

    let existingElements = [];
    
    // lazy implementation, re-renders all elements in an array, would be nice to have a smart method of only rendering updated or new entries 

    const addElement = (element) => {
        existingElements.push(element);
        if (anchor.parentNode) anchor.parentNode.insertBefore(element, anchor);
    }

    const removeExistingElements = () => {
        if (existingElements.length <= 0) return;
        existingElements.forEach((element) => {
            if (element.parentNode) return element.parentNode.removeChild(element);
        });
        existingElements = [];
    }

    state.subscribe((arrayOfObjects) => {
        removeExistingElements();
        if (arrayOfObjects.length <= 0) return;
        arrayOfObjects.forEach((data, index) => {        
            if (typeof data !== 'object' || Array.isArray(data)) return console.error("forBlock(): data is not an object.");

            const element = callback(data, index);
            
            if (!element) return console.error("forBlock(): callback does not return an element.");

            return (Array.isArray(element)) ? element.forEach((fragmentElements) => {
                if (!fragmentElements) return console.error("forBlock(): callback does not return an element.");
                addElement(fragmentElements)
            }) : addElement(element);
        });
        anchor._anchorData.children = existingElements;
    });

    anchor._anchorData.add = () => {
        anchor._anchorData.children.forEach((element) => {
            anchor.parentNode.insertBefore(element, anchor);
        })
    }

    anchor._anchorData.remove = () => {
        anchor._anchorData.children.forEach((child) => {
            if (child.parentNode) child.parentNode.removeChild(child);
        });
    };

    return anchor;
}

// run anchor observer for nodeIf, nodeFor, onMount, onRemove event for isNode
const runObserver = () => {
    const observer = new MutationObserver((mutationList) => {
        for (const mutation of mutationList) {
            if (mutation.type !== 'childList') return;

            const addedNodes = Array.from(mutation.addedNodes);
            const removedNodes = Array.from(mutation.removedNodes);
    
            if (addedNodes.length > 0) addedNodes.forEach((node) => {
                const { _anchorData } = node;
                if (!_anchorData) return;
                if (_anchorData.isFor || _anchorData.isIf || _anchorData.isBlock) _anchorData.add();
                if (_anchorData.isNode || _anchorData.isBlock) {
                    if (typeof _anchorData.onMount === 'function') _anchorData.onMount();  
                }
            })

            if (removedNodes.length > 0) removedNodes.forEach((node) => {
                const { _anchorData } = node;
                if (!_anchorData) return;
                if (_anchorData.isFor || _anchorData.isIf || _anchorData.isBlock) _anchorData.remove();
                if (_anchorData.isNode || _anchorData.isBlock) {
                    if (typeof _anchorData.onRemove === 'function') _anchorData.onRemove();
                }
            })
        }
    });

    observer.observe(document.body, { subtree : true, childList : true });
};

runObserver();