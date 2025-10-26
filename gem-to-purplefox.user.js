// ==UserScript==
// @name         GEM PurpleFox Extract
// @namespace    http://tampermonkey.net/
// @version      2025-10-26
// @description  Extract information about the current GEM round, and format it for PurpleFox.
// @author       Donald Sutherland
// @website      https://github.com/don-suth/gem-tampermonkey
// @updateURL    https://raw.githubusercontent.com/don-suth/gem-tampermonkey/main/gem-to-purplefox.user.js
// @downloadURL  https://raw.githubusercontent.com/don-suth/gem-tampermonkey/main/gem-to-purplefox.user.js
// @match        https://gem.fabtcg.com/gem/*/run/*/report/
// @icon         https://eor-us.purple-fox.fr/favicon.ico
// @grant        GM_registerMenuCommand
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
        "transition": 'opacity 0.3s ease-in-out',
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
}

function displayToast(line1, line2, line3, line4) {
    document.getElementById("purpleFoxExporterToastLine1").innerHTML = "<u>" + line1 + "</u> for";
    document.getElementById("purpleFoxExporterToastLine2").textContent = line2;
    document.getElementById("purpleFoxExporterToastLine3").textContent = line3;
    document.getElementById("purpleFoxExporterToastLine4").textContent = line4;
    const toast = document.getElementById("purpleFoxExporterToast")
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
    });
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 4000);
}

function extractResult() {
    const PLAYER_REGEXP = /^\s+(.+) \((\d+)\)/
    const result = [];
    document.querySelectorAll(".match-row").forEach((row) => {
        const cells = row.querySelectorAll(".match-element");
        const [,playerName1 = null, playerGameId1 = null] = cells[1].children[0].innerHTML.match(PLAYER_REGEXP) || []
        const [,playerName2 = null, playerGameId2 = null] = cells[2].children[0].innerHTML.match(PLAYER_REGEXP) || []
        result.push({
            tableNumber: parseInt(cells[0].innerHTML),
            playerName1,
            playerGameId1,
            playerName2,
            playerGameId2,
            result: cells[3].querySelector("select").value || null
        });
    });
    return result;
}

function setClipboardToResults() {
    const result = extractResult();
    GM_setClipboard(JSON.stringify(result));
    const mainContent = document.getElementById("content");
    const eventNameHeading = mainContent.querySelector("h1");
    const roundHeading = eventNameHeading.nextElementSibling;
    displayToast(
        "Results",
        eventNameHeading.firstChild.textContent,
        roundHeading.textContent.trim(),
        "✓ have been copied to clipboard",
        );
}

function doMenuCommand(event) {
    setClipboardToResults();
}

function createButton() {
    const testButton = document.createElement("button");
    testButton.classList.add("fab-btn");

    testButton.textContent = "PurpleFox Export";
    testButton.innerHTML = '<i class="fa fa-clipboard"></i> PurpleFox Export';
    testButton.title = "title";
    testButton.id = "purplefoxButton";
    Object.assign(testButton.style, {
        "fontSize": '22px',
        "float": "right",
    });
    testButton.style.setProperty("--btn-bg", "#5c0099");
    testButton.style.setProperty("--btn-bg-hover", "#a31aff");
    testButton.onclick = setClipboardToResults;
    document.getElementById("content").querySelector("h1").appendChild(testButton);
}

(function() {
    'use strict';
    createButton();
    createToast();
    const menu_command_id = GM_registerMenuCommand("PurpleFox Export", doMenuCommand, "e");
})();
