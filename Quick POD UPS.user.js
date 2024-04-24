// ==UserScript==
// @name         Quick POD
// @namespace    http://tampermonkey.net/
// @version      2024-04-01
// @description  UPS
// @author       Jansen
// @match        https://www.ups.com/track*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ups.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(selector, callback) {
        const targetNode = document.documentElement;

        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const elements = document.querySelectorAll(selector);
                    if (elements.length > 0) {
                        observer.disconnect();
                        callback(elements[0]);
                        return;
                    }
                }
            }
        });

        const config = { childList: true, subtree: true };
        observer.observe(targetNode, config);
    }


    function print() {
        const referencestring = document.getElementById("stApp_PODtxtReferenceNumber").children[0].innerText
        document.title = 'POD_' + referencestring.match(".*-(.*?)-.*-.*")[1]
        setTimeout(() => document.getElementById("stApp_POD_btnPrint").click(), 250)
    }

    // Wait for an element with class "my-element" to appear
    waitForElement('#stApp_btnProofOfDeliveryonDetails', (element) => {
        element.click();

       waitForElement(".modal-header > button", (element) => {
                print();
       });
    });


})();