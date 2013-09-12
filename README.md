# Sandcastle Builder

xkcd: 1190: Time: The Game

## Credits

Code by Eternal Density (and probably other OTTers)

Graphics likely by GLR and OTTers, when they are added

Parts of code and the clockface image by ChronosDragon

Inspired by Orteil's Cookie Clicker

Not for any commercial use!

## Changelog

### 0.913
- made temporary boosts system more extensible: counter and power variables are stored in the boost
- fixed incorrect blitzing power: was showing the time for the power
- made setting the css class of redacted items much neater and less chirpy
- temp boost notifications reshow on load with the remaining time
- temp boost countdown display updates when hovered
- prevent any badges from being earned before badges are loaded, to prevent renotifying.

### 0.912
- new boost to show something that already exists

### 0.911
- added new tools
- made True Colours boost unlock later
- moved more stuff into data.js
- new badge

### 0.91
- moved shop items into other js file to enriven the main js file.
- enriven means to make more riverish
- REDACTED=BeanishToCuegish("UmVkdW5kYWtpdHRpZXM=");
- Added REDACTED

### 0.904
- ninja unstealthed notification only appears if you have 1+ stealth
- fixed important logic mustard which was preventing ninja unstealth messages and unlocks on click

### 0.903
- save and load now keeps track of whether NBP have activated so you don't erroneously destealth when clicking

### 0.902
- when loading a save in longpix, ensure the ONG is on whole-hours
- some more ninja related boosts and badges
- destroy and build castles notifications

### 0.901
- demustard, mustard detection
- newpixbot delay stat
- made notification shadow white for light theme

### 0.9
- notifications!
- more badges!

### 0.89
- many sand rate badges and another badge
- 2 click boosts
- added sand per click stat
- renamed sand per click variables because they aren't mouse sand per mNP, duh
- scaffold boost

### 0.88
- colour scheme option!
- added light theme
- tweaked the dark theme a bit

### 0.87
- per tool stats (click stats, then hover over tool)

### 0.86
- fixed minor issue with Erosion (*sigh*) and nerfed it a little
- downgrade jQuery to 10.1.2 for IE users

### 0.8532
- seriously?
- so it wasn't fixing because the variable was Molpy.castlesDestroyed not Molpy.totalCastlesDestroyed.

### 0.8531
- oh.

### 0.853
- found the mustard was using this.totalCastlesDestroyed where 'this' was not valid.
- fixed hopefully all the mustard values

### 0.852
- fixed a castles=NaN mustard (though I still don't know what caused it, HELP!)

### 0.851
- erosion Boost is not applied if you don't have it
- castle tool descriptions have more flavour, build/destroy numbers are autofilled with actual values

### 0.85
- multiplier stat

### 0.84
- time since last save stat

### 0.831
- loading options was mustard all along, breaking autosave after loading.

### 0.83
- stats
- loadcount doesn't increment if no cookie is found on startup (only affects new games and me testing locally :P)
- number of badges earned is actually incremented when loading

### 0.82
- ninja stealth-related stuff only given if you have active newpixbots (if you buy none, no stealth)
- incrementing ninja stealth always gives 1 free castle!
- upgraders get half their current newpix number in castles cos I'm nice
- clock!

### 0.81
- removed autosave. kinda
- added a new badge and boost!

### 0.8
- options button
- AUTOSAVE defaulting to every 10mNP (18 seconds)
- space above descriptions on everything

### 0.73
- refactor so on-buy-item boost unlocks are checked on loading
- fixed Getting Sick of Clicking badge, and unearn if given wrongly
- added redundant badges
- added more ninja badges
- added first ONG price rollback badge
- added wave erosion boost and wipeout badge
- fixed Level Up description: it's for ladders not flags

### 0.721
- fix Ladder mustard

### 0.72
- Kindom - > Kingdom
- litle - > little
- Ninja status display needs to clear
- Glass Factory zeros
- Unearn GF if given wrongfully
- Buff Molpies.
- Buff flags and ladders a little
- Buff Scaffold and wave also
- Make Level Up far more expensive (was missing a zero)
- Add more boosts for Cuegan, Newpixbots, trebuchets
- Boost to give castles when incrementing ninja stealth based on its level

### 0.716
- actually changed the version number

### 0.715
- fixed 2 descriptions

### 0.71
- 2 ladder related boosts
- fixed overflow when newpix is expanded

### 0.7
- badges
- molpies boost gives extra spNP% based on badges
- improved stand tool production formatting
- coma resets badges
- added ninja state to save
