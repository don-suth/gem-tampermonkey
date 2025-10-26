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

function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    Object.assign(toast.style, {
        position: 'fixed',
        top: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#2a952e',
        color: '#fff',
        padding: '10px 20px',
        fontSize: '32px',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        zIndex: '9999',
        opacity: '0',
        transition: 'opacity 0.3s ease-in-out',
    });
    document.body.appendChild(toast);
    // Fade in
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
    });
    // Fade out and remove after 2 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

function createButton() {
    const testButton = document.createElement("button");
    testButton.classList.add("fab-btn");

    testButton.textContent = "PurpleFox Export";
    testButton.innerHTML = '<i class="fa fa-clipboard"></i> PurpleFox Export';
    testButton.title = "title";
    Object.assign(testButton.style, {
        position: 'fixed',
        top: '60px',
        right: '60px',
        fontSize: '22px',
    });
    testButton.style.setProperty("--btn-bg", "#5c0099");
    testButton.style.setProperty("--btn-bg-hover", "#a31aff");
    testButton.onclick = function(){showToast("✓ Copied to clipboard!")};
    document.getElementById("content").firstElementChild.prepend(testButton);
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

function doMenuCommand(event) {
    const result = extractResult();
    GM_setClipboard(JSON.stringify(result));
}

(function() {
    'use strict';
    const menu_command_id = GM_registerMenuCommand("PurpleFox Export", doMenuCommand, "e");
})();
