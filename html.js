export const global = {
    body : "",
};

export const zero = (num) => {

    let string = "";

    //if (num < 1000) string += "0";
    if (num < 100) string += "0";
    if (num < 10) string += "0";

    return string + num;
}
export const render = (element, child) => {
    element.innerHTML = "";
    element.append(child);
}

export const check = (element) => {
    if (element === null) {
        console.trace("EASYHTML: element is null");
        return document.createElement("error");
    }
    return element;
};

export const byId = (id) => { return check(document.getElementById(id)); };
export const byName = (name) => { return check(document.getElementsByName(name)); };
export const byTag = (tag) => { return check(document.getElementsByTagName(tag)); };
export const byClass = (name) => { return check(document.getElementsByClassName(name)); };

export const select = (select) => { return check(document.querySelector(select)); };
export const event = (element, event, callback) => { return check(element).addEventListener(event, () => callback()); };

export const create = (tag = "error", attribute = "", children = "", _callback = "") => {
    if (typeof tag === "string" && tag === "error" || tag === "") {
        let error = document.createElement("error");
        error.innerText = "html tag name error.";
        return error;
    }
    
    let element = document.createElement(tag);

    if (typeof attribute === "function") {
        _callback = attribute;
        attribute = {};
    }

    if (typeof children === "function") {
        _callback = children;
        children = "";
    }

    if (typeof attribute !== "object") {
        element.innerHTML = `${attribute}`;
        
        if (typeof children === "object")
            if (children.length > 0)
                children.forEach((item, index) => element.append(item));
                
        if (typeof _callback === "function") _callback(element);
        return element;
    }

    if (children === "" && attribute.length > 0) {
        children = attribute;
        attribute = {};
    }
    
    if (tag === "tr" && attribute.cell != null)  {
        if (attribute.cell.length > 0) {
            attribute.cell.forEach((item) => element.append(create((attribute.head) ? "th" : "td", { innerText : item, data : { cell : item }})))
        }
    }

    Object.keys(attribute).forEach((key, index) => {
        switch(key) {
            case "titleText":
                element.title = element.innerText = attribute[key];
            break;

            case "link":
                element.href = attribute[key]; 
            break;

            case "in": 
            case "innerHTML": 
                element.innerHTML = attribute[key]; 
            break;

            case "text":
            case "innerText": 
                element.innerText = `${attribute[key]}`; 
            break;
            
            case "eventclick": 
                element.setAttribute('data-eventclick', attribute.eventclick);
            break;

            case "eventhover":
                element.setAttribute(`data-eventhover`, attribute.eventhover);
            break;

            case "data":
                if (typeof attribute.data !== "object") return;
                Object.keys(attribute.data).forEach((key, index) => element.setAttribute(`data-${key}`, attribute.data[key]));
            break;

            case "event":
                element.addEventListener(attribute[key].type, () => attribute[key].callback());
            break;

            case "click":
                element.addEventListener('click', () => attribute.click());
            break;

            case "hover":
                element.addEventListener('hover', () => attribute.hover());
            break;

            case "css":
                element.setAttribute("style", attribute[key]); 
            break;

            default: 
                element.setAttribute(key, attribute[key]); 
            break;
        }   
    });

    if (typeof children === "object")
        if (children.length > 0)
            children.forEach((item, index) => element.append(item));

    if (typeof _callback === "function") _callback(element);
    
    return element;
};

export const scss = (filename = "", parentClassName) => {
    if (filename == "") return console.log("easyhtml.js: Error! scss() filename null.");

    fetch(filename).then(response => response.text()).then(data => {
        let nCSS = create("style");
        let oCSS = data.split('\n');

        oCSS.forEach(word => {
            if (word.match(/.*{/g) && !word.match(/\@.*{/g)) word = `.${parentClassName} ${word}`;
            nCSS.innerHTML += `${word}`;
        });

        document.head.append(nCSS);
    });
}

export const xhr = async ({url, urlOption, json = false, stream = false, streamLength = 0}, { success, error }) => {
    
    let response = await fetch(url, urlOption);

    if (!response.ok) {
        error(response);
        return;
    }
    
    let reader = response.body.getReader();
    let textLeft = "";
    let data = (stream) ? [] : "";
    let hasBeenCalled = false;

    while (true) { 
        const { value, done } = await reader.read();
        if (done) break;

        const decoder = new TextDecoder();
        let text = decoder.decode(value);

        if (stream) {
            let regObj = /({[^]*})/g;
            let string = (textLeft + text);
            let current = string.match(regObj);
    
            if (current != null) {
                current = (current.length > 0) ? current[0].toString() : "";
                current = JSON.parse(`[${current}]`);
                current.forEach((i) => data.push(i));
            }
    
            textLeft = string.replace(regObj, "").replace("]", "").replace("[", "");
        } else {
            data += text;
        }

        if (data.length >= streamLength && stream && !hasBeenCalled) {
            success(data);
            hasBeenCalled = true;
        }
    }
    
    if (json && !stream) data = JSON.parse(data);
    (!stream) && success(data);
};

export const params = () => {
    let url = window.location.href.split("?"); 
    url = (url.length >= 2) ? url[1].split("&") : [];

    let object = {};

    url.forEach((item) => {
        let i = item.indexOf("=");
        item = [item.slice(0, i), item.slice(i+1)];
        object[item[0]] = item[1];
    });

    return object;
}

export const exportTableToExcel = (tableSelect, filename = '') => {
    let downloadLink;
    let dataType = 'application/vnd.ms-excel';
    let tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    
    // Specify file name
    filename = filename?filename+'.xls':'excel_data.xls';
    
    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
        let blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
}

export const caps = (str) => {
    str = str.toString();
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const generateString = (length) => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;

    let result = '';
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}