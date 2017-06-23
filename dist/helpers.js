"use strict";
// Hot Module Replacement
function bootloader(main) {
    switch (document.readyState) {
        case 'loading':
            document.addEventListener('DOMContentLoaded', function () { return main(); });
            break;
        case 'interactive':
        case 'complete':
        default:
            main();
    }
}
exports.bootloader = bootloader;
// create new elements
function createNewHosts(cmps) {
    var components = cmps.map(function (componentNode) {
        var newNode = document.createElement(componentNode.tagName);
        // display none
        var parentNode = componentNode.parentNode;
        parentNode.insertBefore(newNode, componentNode);
        return { newNode: newNode, orginalCmp: componentNode };
    });
    return function () {
        components.forEach(function (cmp) {
            cmp.orginalCmp.remove();
        });
    };
}
exports.createNewHosts = createNewHosts;
// remove old styles
function removeNgStyles() {
    var docHead = document.head;
    Array.prototype.slice.call(docHead.querySelectorAll('style'), 0)
        .filter(function (style) { return style.innerText.indexOf('_ng') !== -1; })
        .map(function (el) { return docHead.removeChild(el); });
}
exports.removeNgStyles = removeNgStyles;
/**
 * get input values
 *
 * Extended by: Gabriel Schuster <github.com@actra.de>
 * Now gets values of inputs (including "checked" status radios, checkboxes), textareas and selects (including multiselects)
 * Tries to identify the elements as exact as possible, falls back to numeric index when identification fails
 */
function getInputValues() {
    var inputs = document.querySelectorAll('input, textarea, select');
    return Array.prototype.slice.call(inputs).map(function (input) {
        var store = {
            tag: input.tagName.toLowerCase(),
            'type': null,
            id: 'string' === typeof input.id && input.id.length ? input.id : null,
            name: 'string' === typeof input.name && input.name.length ? input.name : null,
            value: '',
            checked: false,
            options: []
        };
        if ('input' === input.tagName.toLowerCase() || 'textarea' === input.tagName.toLowerCase()) {
            Object.assign(store, { 'type': input.type });
            if ('input' === input.tagName.toLowerCase() && ('checkbox' === input.type || 'radio' === input.type)) {
                return Object.assign(store, { value: input.value, checked: !!input.checked });
            }
            else if ('input' === input.tagName.toLowerCase() && ('image' === input.type || 'button' === input.type || 'submit' === input.type || 'reset' === input.type)) {
                // These types don't need any config and won't be set later but they match "input"
                return store;
            }
            else {
                return Object.assign(store, { value: input.value });
            }
        }
        else if ('select' === input.tagName.toLowerCase()) {
            var options_1 = [];
            input.childNodes.forEach(function (option, i) {
                options_1.push({
                    value: 'string' === typeof option['value'] && option['value'].length ? option['value'] : null,
                    selected: !!option['selected']
                });
            });
            return Object.assign(store, { options: options_1 });
        }
        return store;
    });
}
exports.getInputValues = getInputValues;
/**
 * set input values
 *
 * Extended by: Gabriel Schuster <github.com@actra.de>
 */
function setInputValues($inputs) {
    var inputs = document.querySelectorAll('input, textarea');
    $inputs.forEach(function (store, i) {
        if ('input' === store.tag || 'textarea' === store.tag) {
            if ('input' === store.tag && ('checkbox' === store.type || 'radio' === store.type)) {
                var selector = 'input' + (null !== store.id ? '#' + store.id : '') + '[type="' + store.type + '"]' + (null !== store.name ? '[name="' + store.name + '"]' : '') +
                    '[value="' + store.value + '"]';
                var element = document.body.querySelector(selector);
                if (element && !!store.checked) {
                    element['checked'] = 'checked';
                    element.dispatchEvent(new CustomEvent('input', { detail: element['checked'] }));
                }
            }
            else if ('input' === store.tagName.toLowerCase() && ('image' === store.type || 'button' === store.type || 'submit' === store.type || 'reset' === store.type)) {
            }
            else {
                if (null === store.id && null === store.name) {
                    if (store.value.length && inputs[i] && inputs[i].tagName.toLowerCase() === store.tag && ('textarea' === store.tag || inputs[i].getAttribute('type') === store.type) &&
                        ('string' !== typeof inputs[i].id || !inputs[i].id.length) && ('string' !== typeof inputs[i].getAttribute('name') || !inputs[i].getAttribute('name').length)) {
                        inputs[i]['value'] = store.value;
                        inputs[i].dispatchEvent(new CustomEvent('input', { detail: inputs[i]['value'] }));
                    }
                }
                else {
                    var selector = 'input' + (null !== store.id ? '#' + store.id : '') + ('input' === store.tag ? '[type="' + store.type + '"]' : '') +
                        (null !== store.name ? '[name="' + store.name + '"]' : '');
                    var element = document.body.querySelector(selector);
                    if (element && store.value.length) {
                        element['value'] = store.value;
                        element.dispatchEvent(new CustomEvent('input', { detail: element['value'] }));
                    }
                }
            }
        }
        else if ('select' === store.tag) {
            var select_1 = null;
            if (null === store.id && null === store.name) {
                if (inputs[i] && inputs[i].tagName.toLowerCase() === store.tag && ('string' !== typeof inputs[i].id || !inputs[i].id.length) &&
                    ('string' !== typeof inputs[i].getAttribute('name') || !inputs[i].getAttribute('name').length)) {
                    select_1 = inputs[i];
                }
            }
            else {
                var selector = 'select' + (null !== store.id ? '#' + store.id : '') + (null !== store.name ? '[name="' + store.name + '"]' : '');
                var element = document.body.querySelector(selector);
                if (element) {
                    select_1 = element;
                }
            }
            if (select_1) {
                store.options.forEach(function (storedOption, j) {
                    var option = select_1.querySelector('option[value="' + storedOption.value + '"]');
                    if (!option && select_1.childNodes[j] && ('string' !== typeof select_1.childNodes[j]['value'] || !select_1.childNodes[j]['value'].length)) {
                        option = select_1.childNodes[j];
                    }
                    if (option && !!storedOption.selected) {
                        option['selected'] = 'selected';
                        option.dispatchEvent(new CustomEvent('input', { detail: option['selected'] }));
                    }
                });
            }
        }
    });
}
exports.setInputValues = setInputValues;
// get/set input values
function createInputTransfer() {
    var $inputs = getInputValues();
    return function restoreInputValues() {
        setInputValues($inputs);
    };
}
exports.createInputTransfer = createInputTransfer;
//# sourceMappingURL=helpers.js.map