// ==UserScript==
// @name         GEM Auto-Download Printouts
// @namespace    http://tampermonkey.net/
// @version      2025-10-26
// @description  Automatically downloads the raw HTML of the GEM pairings printout pages.
// @author       Donald Sutherland
// @website      https://github.com/don-suth/gem-tampermonkey
// @updateURL    https://raw.githubusercontent.com/don-suth/gem-tampermonkey/main/gem-auto-download-printouts.user.js
// @downloadURL  https://raw.githubusercontent.com/don-suth/gem-tampermonkey/main/gem-auto-download-printouts.user.js
// @match        https://gem.fabtcg.com/gem/*/run/*/print/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fabtcg.com
// @grant        GM_setClipboard
// ==/UserScript==

function createToast() {
    const toast = document.createElement("div");
    toast.id = "purpleFoxExporterToast";
    Object.assign(toast.style, {
        "position": 'fixed',
        "top": '30px',
        "left": '50%',
        "transform": 'translateX(-50%)',
        "background": '#2a952e',
        "color": '#fff',
        "padding": '10px 20px',
        "fontSize": '32px',
        "borderRadius": '6px',
        "boxShadow": '0 4px 12px rgba(0,0,0,0.2)',
        "zIndex": '9999',
        "opacity": '0',
        "text-align": "center",
        "text-shadow": "black 1px 1px 3px",
    });
    toast.onclick = () => { toast.style.opacity = "0" };

    const line1 = document.createElement("span");
    line1.id = "purpleFoxExporterToastLine1";
    Object.assign(line1.style, {
        "display": "block",
        "fontSize": "24px",
    });
    toast.appendChild(line1);

    const line2 = document.createElement("span");
    line2.id = "purpleFoxExporterToastLine2";
    Object.assign(line2.style, {
        "display": "block",
    });
    toast.appendChild(line2);

    const line3 = document.createElement("span");
    line3.id = "purpleFoxExporterToastLine3";
    Object.assign(line3.style, {
        "display": "block",
    });
    toast.appendChild(line3);

    const line4 = document.createElement("span");
    line4.id = "purpleFoxExporterToastLine4";
    Object.assign(line4.style, {
        "display": "block",
        "fontSize": "20px",
    });
    toast.appendChild(line4);

    document.body.appendChild(toast);
    return toast
}

function displayToast(line1, line2, line3, line4) {
    document.getElementById("purpleFoxExporterToastLine1").innerHTML = "<u>" + line1 + "</u> for";
    document.getElementById("purpleFoxExporterToastLine2").textContent = line2;
    document.getElementById("purpleFoxExporterToastLine3").textContent = line3;
    document.getElementById("purpleFoxExporterToastLine4").textContent = line4;
    const toast = document.getElementById("purpleFoxExporterToast");
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 4000);
}


(function() {
    'use strict';

    // Function to sanitize the filename by removing invalid characters
    function sanitizeFilename(filename) {
        // Replace invalid characters with underscores
        return filename.replace(/[\s\\/:*?"<>|]/g, '_');
    }

    // Find the name of the printout. This is the title of the first
    // page of the download, which may not be super accurate for
    // multi-print setups, but it will have at least the event name and
    // hopefully the round number.
    const tdElement = document.querySelector('h2');

    let tournamentName = tdElement.textContent.trim();
    tournamentName = sanitizeFilename(tournamentName);
    const timestamp = new Date().toISOString().replace(/[:]/g, "-");
    const filename = `${tournamentName}-${timestamp}.html`;

    // Get the raw HTML content of the page
    const htmlContent = document.documentElement.outerHTML;

    // Create a Blob from the HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;

    // Set the download attribute with the filename
    link.download = filename;

    // Create and click a link to execute the attachment download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Do the equivalent of selecting all text, and copying it to the clipboard for PurpleFox
    const purpleFoxExport = document.body.innerText;
    GM_setClipboard(purpleFoxExport);
    const toast = createToast();
    const eventData = document.title.split(" | Print ");
    displayToast(
        "Pairings",
        eventData[0],
        eventData[1],
        "✓ have been copied to clipboard",
    );
    window.addEventListener("beforeprint", () => { toast.style.opacity = "0"});
})();
