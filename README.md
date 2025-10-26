# GEM Tampermonkey scripts
Tampermonkey scripts for working with Flesh and Blood's GEM Tournament Software

# PurpleFox Export
This is a modified version of [Dan Collins' Tampermonkey scripts](https://github.com/dcollinsn/gem-tampermonkey) which in turn was modified from [Aurelie Violette's Google Chrome extension](https://github.com/AurelieV/gem-extract).

Key changes that I've made:
- `gem-to-purplefox.user.js`:
  - Added a button in the GEM interface to copy results, as an alternative/addition to the Tampermonkey menu item.
  - Added a toast / notification when copying results, which highlights what you've copied from what event.
    - This was both for success feedback and additional safeguards against (for example) copying the results from the wrong event.
- `gem-auto-download-printouts.user.js`:
  - Additionally copies the printout in a PurpleFox compatible format to the clipboard, and displays a toast / notification when doing so.

