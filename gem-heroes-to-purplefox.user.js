// ==UserScript==
// @name         GEM PurpleFox Hero Extraction
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Extract information about heroes in the current GEM event, and export it for PurpleFox
// @author       Dan Collins <dcollins@batwing.tech>
// @author       Aurélie Violette
// @website      https://github.com/dcollinsn/gem-tampermonkey
// @updateURL    https://raw.githubusercontent.com/dcollinsn/gem-tampermonkey/main/gem-heroes-to-purplefox.user.js
// @downloadURL  https://raw.githubusercontent.com/dcollinsn/gem-tampermonkey/main/gem-heroes-to-purplefox.user.js
// @match        https://gem.fabtcg.com/gem/*/run/
// @icon         https://eor-us.purple-fox.fr/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// ==/UserScript==

function extractResult() {
    const PLAYER_REGEXP = /^\s+(.+?) \((\d+)\)/
    const HERO_REGEXP = /^\s+(.+)\n/
    const result = [];
    document.querySelectorAll("ol li div.row").forEach((player) => {
        const cells = player.querySelectorAll("div");
        const [,playerName = null, playerGameId = null] = cells[0].children[0].innerHTML.match(PLAYER_REGEXP) || []
        const [,hero = null] = cells[1].innerHTML.match(HERO_REGEXP) || []
        result.push({
            name: playerName,
            gameId: playerGameId,
            hero: hero
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
    const menu_command_id = GM_registerMenuCommand("Hero Export", doMenuCommand, "e");
})();
