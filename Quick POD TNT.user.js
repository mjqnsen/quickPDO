// ==UserScript==
// @name         Quick POD
// @namespace    http://tampermonkey.net/
// @version      2024-04-06
// @description  TNT
// @author       Jansen
// @match        https://www.tnt.com/express/nl_nl/site/shipping-tools/tracking.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tnt.com
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const cons = urlParams.get('cons');
    const trackingDetailsReponse = await fetch("https://www.tnt.com/api/v3/shipment?con="+cons+"&locale=nl_NL&searchType=CON&channel=OPENTRACK").then(response => response.json());
    const trackingDetails = trackingDetailsReponse['tracker.output'].consignment[0];
    const {consignmentKey, customerReference, shipmentId} = trackingDetails;

    const referencesObj = customerReference.match("(.)-(.*?)-.*-.*");

    let answerInput;

    switch(referencesObj[1]) {
        case 'G':
            answerInput = '0243488040';
            break;
        case 'E':
            answerInput = '0243480530';
            break;
        case 'Y':
            answerInput = '0243488260';
            break;
        default:
            alert('Company not recognised based on reference number')
    }

    navigator.clipboard.writeText('POD_' + referencesObj[2]);

    const confidentialDetailsResponse = await fetch("https://www.tnt.com/api/v1/shipment/confidentialDetails?conNumber="+cons+"&consignmentKey="+consignmentKey+"&securityQuestionType=phoneNumber&securityQuestionValue=" + answerInput + "&shipmentId=" + shipmentId).then(response => response.json());
    window.open(confidentialDetailsResponse.confidentialDetailsOutput.confidentialData.podUrl, "mozillaWindow", "popup")
})();