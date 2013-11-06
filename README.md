# Sandcastle Builder

xkcd: 1190: Time: The Game

## Credits

Code by Eternal Density (and probably other OTTers)

Graphics likely by GLR and OTTers, when they are added

Parts of code and the clockface image by ChronosDragon.

Icons by ChronosDragon, BlitzGirl, and StormAngel/cmyk

Inspired by Orteil's C**kie Clicker

For personal amusement only.

## Changelog

## 2.898
- ONG performance increase - less looping on destruction
- Prevent fractional glass chips/blocks in storage, and prevent fractional size upgrades
- Larger upgrade increments for Sand Refinery and Glass Chiller (finally!)
- Glass Extruder was missing punctuation

## 2.897
- Clarification on SBtF description and some explanation on its stats.
- stats tabs
- Logicastle description fix
- Break the Mould boost for when you decide making a mould was a bad idea
- 3 new blackprint boosts
- Notification log text is selectable
- Prevent Glass Saw from wasting chips making blocks for which you do not have storage space

## 2.896
- Show glass prices of tools when appropriate
- Raised Glass Saw limit by factor of 1000
- Prevent Caged Logicat from tiring out
- Panther Rush boost to increase the endurance of Caged Logicat
- Removed the 'of 1 needed' from sand display when castles are infinite
- Castle tool prices are always recalculated from scratch rather than subtracting previous price from current because the rounding errors are too much for reliability
- Prices that are definitely going to be infinite (i.e. over 1500 of a castle tool) are not calculated, just assumed to be infinite without calculating
- Glass gain/use messages show more decimal places (oops)
- New boost to make glass block production more efficient.

## 2.895
- Fixed SGL unlock
- And some other unlocks
- New Glass Block related boost
- Fixed Export toggle

## 2.894
- Some Glass multiplier boosts, mostly for sand tools

## 2.893
- Fixed ONGs with Backing Out boost
- Improved description of Molpies boost
- Fix Logicat message text
- Increase Panther Salve power even when you have infinite castles and Panther Glaze
- ASHF updates the price factor before activating Shopping Assistant.
- Prevent 0 fractal level from multiplying Not Lucky by 0 (though I think that could only happen if you have 0 sand or infinite castles, so it's probably unimportant)

## 2.892
- Made it possible to get Flux Capacitor if time travel costs more castles than you have
- Fixed logic for use of glass ceiling badges: they were being checked as if they were boosts
- Fixed description of factory automation: wasn't showing correct prices
- I think I fixed the swich between sand and glass production more properly now

## 2.891
- Fixed ch*rped up boost order, and tried to fix the side effects.
- Errors in filling glass mould fixed
- Updated Backing Out a bit and fixed typo in price

## 2.89
- Fixed Molpy Down/Coma button layout :P
- Tool Factory glass display
- Improved detection on when to recalc glass rate
- New high level Logicat reward
- Completed missing Bacon feature
- Updated Tool Factory description slightly but significantly

## 2.882
- Missing Molpy Down button
- Panther Salve negative value when disabled was being used in stats display
- Incorrect variable name in Badgers boost

## 2.881
- Prevent newpix background image transition from messing with the old opacity and transform transitions

## 2.88
- Kitties Galore was in the department always instead of only after 64 clicks!
- Fade now applies to the newpix also
- Frivolous: prevent blank space when past T** E** with placeholders
- Expando now shrinks everything when you disable him (with a milliLongPix wait so you can toggle him off and on without losing him)
- Demustard sandDug and sandManual
- Tiny nerf to LaPetite again
- BBC wasn't causing recalculate of dig rates on toggle
- Game and per-tool glass totals are now saved. (this is quite separate to glass chip storage)
- JDip countdown is sanitized to 0 if not a number, or negative
- Tweaked the maximum JDip algorithm a bit

## 2.87
- Fixed Glass Ceiling 0 not becoming available due to GCB Badge overwriting its department flag
- Made a way to unlock Castles to Glass
- Clarified descriptions of Sand to Glass and Castles to Glass a little
- Buffed Overcompensating because reasons
- Undid yesterday's nerf to Temporal Duplication
- Nerfed LaPetite a bit to ensure BBC is required for Infinite Sand rate

## 2.86
- Added an extra little feature to the Flashy Gif badge (which took me some nopix of fiddling because it is fun to try to new things with css)
- You can how earn blackprint pages even when there is no need to do so.
- Prevent Mustard/Infinite sand dig clicks
- Fixed some typos
- Gave up on description expand/shrink animation due to issues
- BBC is included in the global sand rate rather than the individual tool rate
- Nerfed WWB a little because some balancing was out because I didn't have it fully leveled when testing.
- Combined glass messaging to reduce spam. Now it just gives a total proft/loss for chips and blocks
- You can get glass from sand tools (though not castles tools yet) but it's only available to Tool Factory currently
- Added 1 higher Factory Automation level
- Safety Pumpkin

## 2.85
- Fixed Logicat issue caused by Bacon Mustard in the level reduction
- If you missed any Logicat rewards, you'll catch up next time you answer one.
- Added Safety Hat boost! Yay now we can all have Safety Hats in the Hotdog!


## 2.84
- Wasn't doing glass mould work in factory automation
- Prevent tool descriptions from hiding sand rate and ninja status
- 2 Boosts for a new tool (one of them requires high logicat and very high JDip)
- Burning Bags now go faster (and level faster) at higher levels
- Fiddled with JDip levels and destruction amounts a bunch. A lot actually.
- Yeah I didn't get time to do other important stuff because I spent so long on JDip

## 2.83
- Maybe there will never be a version 28. Maybe glass ceilings shouldn't lock on every load until then.

## 2.82
- Now properly importing old save: because lists don't work that way in javascript

## 2.81
- Now using more c**kies to save

## 2.8
- Tool Factory now does something
- Rewrote tool declaration code to use arguments dictionary like boosts and badges
- Fixed 2 Glass Ceiling prices: sorry I'm forcing a rebuy if you have them already :P
- Incomplete: Boosts for making tools produce glass

## 2.71
- Prevent Expando from crashing when you haven't unlocked all Tools

## 2.7
- Mould Spelling
- Fixed: crashes on some notifications because I missed the "Molpy."
- Spending finite sand/castles when you have infinite of the same, does not notify
- Glass Monument making
- Badgers wasn't actually implemented
- RRR with GP now gives chips also
- Nerfed a tool
- Suppress low sand spent notifications
- Expando boost! For showing descriptions.
- Also includes a song
- Boosts songs are now accessible after buying as well as before
- Only one free redacted from playing a song before purchase (unless you can't afford it)
- A couple of index changes: index and otthercomic

## 2.63
- Some little improvements to Shopping Assistant and key unlocking

## 2.62
- ASHF should not be given if there are no boosts available and you have infinite castles
- Shopping Assistant no longer buys locked boosts (thus preventing weird zombie state for DoN or Crate Key or Castle Crusher prevening them from being given by department due to being simultaneously bought and locked)

## 2.61
- Um, I wrote for instead of while and forgot to test

## 2.6
- Castles are not built when you have infinite
- Sand is not turned into castles if you have infinite castles
- Fixed Badges Earned redacted icon not showing due to missing s
- Warn on the ONG if not saved in over a newpix (the time since save counter now counts regardless of whether you have autosave)
- No ASHF if you have no boosts to buy and all tools have infinite price
- Recycling Beanie desc(ription) fix, added the upgrade button also
- Panther Glaze
- Factored out function for adding glass blocks/chips from the glass furnace/blower, to avoid duplicating storage-space checks everywhere
- Badgers can now have stats, for extra flavour text
- Fiddled with new tool numbers
- Glass Ceiling stuff

## 2.59
- Some new badges

## 2.58
- Logicat rewards now exclude boosts with their logicat level set to 0
- Nerfed WWB a little and increased the cost a bit
- The limit on Panther Salve and friends is now applied *after* it's boosted by Fractal Sandcastles
- Some more Factory Automation levels
- Not Lucky from Factory Automation doesn't show the 'not lucky' message

## 2.57
- Yeah I wasn't passing the automationLevel into the new function. oops.

## 2.56
- Moved some code around so department/logicat rewards are checked just before rewarding, rather than when other boosts are checked

## 2.55
- Improved Broken Rung to only count visible tools

## 2.54
- Brutal nerfing of Window Washers (though now it's cheaper to upgrade)
- Also nerfed LCB yet again
- A couple of totally minor new things
- Prevent Catmaran and LCB from using glass if you have no relevant tools to boost with
- Infinite castles prevents Flux Surge, Temporal Duplication or Temporal Rift from being Logicat rewards

## 2.53
- Flashy badge was too hard on my phone 
- Fixed a price

## 2.52
- Deal with infinite prices (partially)

## 2.51
- Forgot to subtract traded scaffolds from CastleToolsOwned, leading to erroneous badge earn
- New postfix! It's worth 5 Ws

## 2.5
- I (might) love waffles
- Second Chance improved
- Locked Crate description improved to fit some usage changes
- Added some W badges
- Extra isFinite check
- Window Washers in the Château
- And recycling! (not quite complete: needs a button to power it up further)
- Took the easy way out of the stats-space issue, for now.

## 2.4
- Second Chance was free to use for uncaged Logicats
- Logicat results are now put in the log
- Got rid of redundant non decrementing countdowns on Redunception
- Got rid of redundant Redundant icon on Badges Earned when there's one on Discoveries
- Half the Erosion boost was still being applied to Wave destruction without earning it.

## 2.33
- Uh, how did that = get in there?

## 2.32
- Ensure Time Travel's power is 1 on buy (that was for a feature I never ended up making, whereby you could power up Time Travel to make bigger jumps. Now there's a better way of doing that.)
- Upgrade for person who has bought Time Travel and is stuck with it on power 0
- Apology

## 2.31
- Fixed erroneous save failed messages
- Factory Ninja is buffed based on logicat level

## 2.3
- Glass Block/Chip display decimal places is more consistent.
- zero temporal duplcate tool count when Molpy Down
- Trebuchet multliplier boosts weren't stacking properly
- Save badges more efficiently so we don't run out of cookie space!
- Unearned special badges don't get into the draw list (they weren't drawn anyhow) preventing Redacted from having too high a draw index
- Pulled out the dodgy code which was dealing with Redacted with too high a view index
- A new Key/Crate related boost

### 2.22
- Sand Mold stuff
- This means 91 more badges are technically achievable

### 2.21
- Added a key related boost
- 68 more Badges
- Button for large upgrade to Glass Block Storage
- Perhaps a countdown timer is redundant. Perhaps not.

### 2.2
- fixed typo crash bug (if you had Locked Crate)
- fixed temp boost countdown mustard
- made caged logicat a bit cheaper
- renerfed DoN
- Second Chance costs some glass on use
- Locked Crate costs less sand
- New Sand speed boost
- Added some further Factory Automation upgrades
- Added Stats item to show Blackprint Pages count
- New Fractal boost
- New Ninja boost
- Doubled the effect of Crate Key

### 2.1
- Checked the locked crate reward to ensure that it's expanding storage properly. Seems fine to be
- Evened out the locked crate reward a bit: starts higher but grows 2000 blocks per Logicat Level rather than 50%
- Doubled Redundant Raptor effect
- Impervious Ninja lasts between 1 and 50 NP, in half NP increments based on Logicat Level
- Flux Surge time also based on Logicat Level, though lower max and increment
- DoN is once again boosted by Flux Turbine
- Caged Logicat costs 100 blocks per Logicat Level, rather than just 100
- Fix Logicat rewards for boosts with alternate short name
- NPBs can only destroy a maximum of 90% of your castles in one go, regardless of how many NPBs there are.
- Two for One is now Temporal Duplication and is chronotech
- Number of temporal duplicates is remembered and duplicates cannot be sold
- Timetravelled NPBs use the same temporal duplicate tracking as above
- Crate Key is now only available from Logicat if Locked Crate is unlocked and unbought. Also its cost scales with Logicat level :P
- Flux Turbine bonus is not applied when building 0 castles
- Castles Down is not incremented if Infinite Castles have been built
- Blackprints
- Increased Glass Chip/Block Storage buying (Blocks still need an improvement in this area...)

### 2.06
- Fixed a badge numbering issue or two (some high-numbered discoveries may require rediscovery)
- Locked crate price bug fix

### 2.05
- Memories Revisited was erroneously unlocking because I wasn't resetting badge counts on reload (or coma)
- Reduced DoN price drop
- Memories Revisited shouldn't be tagged as Action
- Prevent a NavCode crash: was possible to get negative NPBs
- Added a failure message to Camera
- Also prevent console error when checking if non existent Badge is earned
- Always recalc dig and repaint shop when refreshing a tool price, so I don't have to do it explicitly every single time I destroy tools
- Fiddled with JDip destruction amounts. Will be same as normal (equal to level) for levels up to a million

### 2.04
- Some tool destruction wasn't updating the number of tools owned
- Removed corn
- descriptions stay for an extra half second
- Awesome new time travel boost which works with the new badges

### 2.03
- Fixed RRR to match its description
- RR is a toggle so it should be in the toggle class! (and thus blue to chromatic heretics)
- Sand use stat has 3 decimal places
- Fixed a badge typo
- NPB NavCode wasn't resetting the NPB price when destroying intruders
- Made judgement dip a little worse
- Boost Locked messages show full name of boosts
- Fiddled with bag burning a bit (though still no toggle, but that's the least of your worries)

### 2.02
- Redundant paragraphs were missing the first linebreak
- Chromatic Heresy wasn't heretical enough

### 2.01
- fixed some wrong variable names which don't seem to be doing much anyway
- I'll test those some other time and maybe remove them if they aren't needed
- Supposedly they make sure boost descriptions update after you click a button on them
- Fixed mustard where 0s after decimal points went missing. i.e 1.01 was displayed as 1.1 when showing 2 decimal places
- Saw that Orteil seems to have fixed this issue a completely different way :P
- Added a bunch more badges
- Fixed a new mustard I introduced: prevent unnecessary trailing 0s after the decimal point

### 2.0
- Ensure badges that shouldn't be earned aren't

### 1.98
- 150 new badges
- Made a boost I added a while ago obtainable
- Made it cost chips to use
- Redacted in Badges Available can't be invisible now
- Should also prevent double redacted icons in the loot toggle boxes (assuming that was possible)
- 100 of the new badges are not obtainable yet :P
- fixed BBC stats

### 1.97
- fixed NaN power to 0, may reduce savefile size
- fix some badge loading code
- fixed glass boost purchase logic mustard: didn't remove all of old condition

### 1.96
- BBC can be disabled
- BBC now uses shortname
- Locking a boost now notifies with the full name rather than abbreviation
- DoN price reduction rarer
- Fiddled with badge display code a bit

### 1.95
- SBTF

### 1.94
- Words
- Extruder price fix
- Made Glass Chip has/spend functions for consistency
- Notify when spending glass blocks/chips (new function will need to be used in more places to improve this)
- Don't notify when spending 0 (oops)

### 1.93
- Nerfed LCB even further
- Prevent Infinite sand (which becomes infinite castles) which was possible via SBTF and 0 Waves
- Deal a bit more gracefully with the inevitable Infinite Castles and prices
- VITSSÅGEN, JA! notification fixed (overeager Replace)
- I think I fixed the DoRD issue amongst all that
- BlitzGirl.ChallengeAccepted

### 1.92
- Buffed Two for One to stack with multibuy
- Yes I realise the implications of that.
- No I'm not giving you multisell :P
- Badges and Boosts can now be known in code by a shorter name than the display name
- Boosts can be bought by Shopping Assistant by shorter name. e.g. RRR, BKJ, BFJ, VJ, LCB
- Displays long names (and tool plurals) in the Shopping Assistant description
- Flux Surge isn't rewarded until you have Flux Turbine

### 1.91
- Messed with new Not lucky Boost numbers Just a bit
- Increased the Countdown time: Flux surge and Imp ninja
- Finished the Run raptor Run toggle, Buffed it some
- Break tags were Added (deScriptions with Buttons in)
- Added a New badge for Very high Blitzing speed
- Changelog is Writ with teTrameter Dactylic

### 1.9
- BAG Power Unfortunately Necessitates Something
- Badge drawing refactor: now works just like boosts so it's neater and I can easily add badge categories
- Fixed RRR parentheses mustard
- 2 new Not Lucky boosts... which are pretty powerful but probably not enough for waveney
- Judgement Dip/Report are now not Alert by default, because if they are inactive they switch off after a mNP anyway, and now that you can save your Show/Hide state, it's annoying to see them appear and vanish on load
- Another Not Lucky boost and buffed the previous 2
- Now they're probably overpowered. I dunno. I'm 2 nopix late for coma.

### 1.895
- trustedly mustardly
- show and hide loot options
- needed to be reclicked
- when you reload
- OTTers don't like that task
- but my new javascripts
- cookiefantasticly
- shoulder the load

### 1.894
- lockfunction should use this instead of me (fix temporal rift crash introduced in 1.891)
- changed unlockfunction for consistency

### 1.893
- glass storage upgrades more available

### 1.892
- Made Double or Nothing a bit less broken

### 1.891
- Fix Level Up! description
- Free Advice fix (I don't understand how it got like that)
- Prevent Temporal Rift from reopening on load if you save after having travelled through it.
- bp
- Glass Chiller downgrade
- Rift countdown +1

### 1.89
- Changed Glass Ceiing 9 to multiply Rivers' Castle Build number rather than Castle Destruction
- Trading with Rosetta now reduced the number of castle tools owned and updates sand dig rate calcs
- Trading to unlock Rosetta updates the number of sand tools ownedand sand dig rate
- Added a space to Erosion description (yes I remembered, StormAngle)
- Made Time Travel a teeny tiny bit more expensive
- Intentionally spelled StromAngel wrong for lulz

### 1.88
- New batch of icons by BlitzGirl!

### 1.87
- Fixed bag puns description
- Adjusted postfix longnames

### 1.86
- Changed the build/destroy notify threshhold to 1 in ten million
- Class Chiller number formatting
- Logicat is not a Technicolour Dream Cat
- New Second Chance boost
- Moved Caged Logicat purchase to Rosetta
- Rosetta now doesn't show as action (yellow) if you don't have doublepost or factory automation
- Number of correct Logicat answers required displayed was 5 higher than real value

### 1.85
- TDC changes faster
- Glass Extruder!
- New Logicat related boost (costs a LOT of glass blocks)
- Reduce boost toggle flicker
- Puzzles weren't shuffling statement order
- Made sure buttons in boosts have linebreaks before the buttons, for neatness
- Embaggening fix: wrong logic operator! thanks intheshax.

### 1.84
- Added another way to unlock the new boost because previously it required the far more expensive Redunception first. You can get it sooner if you can afford Redunception though.
- Some glass related stats on stats page
- Two wrong logicat answers are worth minus one correct answer now, so it's a little easier to level logicat.
- Sometimes logicat statements are longer.

### 1.83
- Fixed Glass Ceiling glass prices: they were all the same when they should not have been.
- Earning Ceiling Broken makes all the ceilings untagged, and you can lock any of them if you like, and they're all available from the Department if you do lock them, and the prices go back to their base values permanently. (Or for instance if you Molpy Down)
- Removed floor pie and ceiling pie from the code so I can actually read it.
- Fiddled with redacted timing, should work more consistently now
- Fixed incorrect number rounding
- When building or destroying castles, if the amount is less than 1/10000 of the castles you have, don't notify (the amount is added to the running total of castles to notify about later)
- Prevent "by the newpixbots" message from showing if the amount destroyed was not shown.
- Maximum judgement dip level based on newpix: Can't get Level 1 before NP12, level 2 before NP20, level 3 before NP24, Level 6 before NP34, level 12 before NP45...
- Added a cheap hopefully fun boost for people in the earlier game
- Messed around with the CSS a bunch, improved a couple of things

### 1.82
- Version now number shows up on index whether it loads a saved game or not
- Added a few words to redundancy

### 1.81
- Toned down the Factory Automation upgrade costs a little
- Combined Factory Automation sand-use messages to reduce message spam
- Recalculate dig speed when upgrade Sand Purifier
- Glass Chip storage can be upgraded in larger amounts one you have enough refinery power. (also more newlines in description)
- Singular glass block prices show up as singular
- Added a new Logicat reward (or a pair actually)
- Mmm, floor pie.

### 1.8
- Badge for Judgement Dip level 12
- Badge for unlocking all the Judgement Dip boosts
- Ensured that if you skip a Judgement Dip boost (i.e. by reloading at the wrong time) you can still get it without having to increase Judgement level again
- Fixed mustard in Sand Refinery description (once you reach prodution of 1000): was trying to multiply a number with a comma in it
- Preemptive similar fix for Glass Chiller
- Glass Ceiling boost delcaration in a loop rather than 10 separate and nearly identical declarations
- Glass Tool status updates when a Glass Ceiling is bought or locked
- Glass Ceiling unlock and colour class updates immediately rather than waiting for the next game tick so it's much smoother
- Logicat is finally here!
- Prevent activation of Temp Boosts when loading from causing boost-unlock message spam
- Temporal Rift and Flux Turbine descriptions/stats improved to reference each other
- Fixed import of totalCastlesDown - was parsing int rather than float so if you got too high it would truncate to single digit :P
- Reduced Redundakitty nesting: 150 is cool and all but it's a bit ridiculous really

### 1.79
- Added Phonesaw
- VITSSÅGEN, JA! and Bag Puns had their stats backwards: one showed 'out of 20' but activated at 100, and vice versa
- Definitely nothing else to do with Bag Puns

### 1.78
- Actually fixed DoN: now it doesn't crash on ONG. sorry everyone!
- So it turned out the Panther Salve toggle was broken all along anyway
- Also made Panther Salve blue
- And refresh stuff when toggling it
- And fixed the Panther Salve toggle actually because I was using an nonexistant function parameter
- Also tested it :P
- Multibuy Boosts renamed slightly

### 1.77
- I was checking the Panther Salve toggle value incorrectly
- Fixed Double or Nothing not apearing: forgot to round random number

### 1.76
- Don't lose ninja stealth if it's already 0 (and thus ignore forgiveness)
- VITSSÅGEN, JA! stats corrected: no more missing space!
- Nonbreaking space between buy and number
- Togglable Glass Ceilings are now Action (yellow) and untogglable are Alert (red)

### 1.75
- Tool purchases show up in the log
- fixed Major issue with Not Lucky reward
- nerfed the Not Lucky - Fractal Sandcastles combo slightly
- Panther Salve wasn't respecting its power toggle
- Run Raptor Run now costs glass to use

### 1.74
- Got rid of useless extra parts in the Sand Refinery description.

### 1.73
- Glass Refinery x20 upgrade
- Index export cleaned up
- Fixed bug when trying to get Rosetta (oops how long has that been broken?)
- Gave Rosetta more furnace automation upgrades
- New Not Lucky boost after Panther Salve
- New Ninja boost from Rosetta

### 1.72
- Buying Multi Style! (thanks for the code waveney)

### 1.71
- Added critical missing component of the glass ceiling boosts
- Buffed chequered flag
- DoN always locks again
- Several new badges

### 1.7
- 10 Glass related boosts
- build/destroy/spend messages now use nicer notation
- Tools now show glass boost status
- Fixed DoN which was only locking on load if you bought it
- BBC secret ability
- Sorry no multibuy or extra badges yet.

### 1.62
- Fixed totally wrong HasGlassBlocks and SpendGlassBlocks functions: they were checking and spending chips!
- Fixed wrong glass rate calculates which resulted in not letting you buy storage space as soon as you should be allowed to
- Fixed negative amounts of glass chips resulting from the first problem
- Fixed index export button
- Fixed large OTColoured: use background-size:contain instead of :auto (thanks MDN)

### 1.61
- Fixed boosts out of order

### 1.6
- Some error reporting to people don't have to find the javascript console and know more obviously that something went wrong
- emergency export button on Index page: exports cookie value directly without parsing it so that if the game is broken they can still get at their save and back it up or transfer it.
- Index now links to both the Time wiki main page and the game wiki page
- Boost prices now don't show amounts with 0
- Boost prices now handle glass blocks
- Added a boost which - surprise surprise - costs glass blocks
- Changed BR tags (the way I was doing it was an xhtml thing :P)

### 1.56
- ditto for isNaN() (which was only wrong in 1 out of 2 places. derp.)
- fixed the check for whether to allow purchase of more glass storage space.

### 1.55
- isFinite() works on more browsers than Number.isFinite. Okay.
- a missing space in sand purifier description
- DoN doesn't always lock on load

### 1.54
- Prevent index from trying to Notify after loading
- Upgrade/downgrade refinery and chiller now cause sand rate to recalculate immediately rather than waiting for something else to trigger it (oops)
- Furnace Automation now pre-spends sand so Blast Furnace doesn't prevent it from running multiple times.
- Noticed what in the bit of CSS I kept from Orteil was preventing text selection and disabled it for Redundant Information :D
- New high value boost
- Prevent stack overflow when people get infinite sand or make castles cost 0 sand
- Format infinite amounts properly
- Glass Blower now not stuck showing 1% in description (silly parentheses where they shouldn't be!)

### 1.532
- no I fixed Factory Automaton which doesn't exist.
- index shows version I think. can't test locally!

### 1.531
- Probably fixed factory automation not working or upgrading for old save files (like mine)
- Can't see the probem with Glass Blower description yet, no time to debug right now.

### 1.53
- Fixed the clock hand. I didn't write any of that code btw :P
- Furnace Crossfeed toggle
- looked at the grammar of *its* description and realised that *it's* wrong.
- new Furnace related boost (you can probably guess from my recent discussion with waveney)
- because **its** description is copied from the previously mentioned, **it's** wrong as well.
- Gave Rosetta a new purpose. Also waveney-discussion related
- Rewrote postfix specification code using exponential notation rather than a squillion zeroes. Also waveney's suggestion (though no new postfixes yet)
- I guess I'll dedicate this update to waveney.
- Added some words and sentence structure. StormAngel helped a bit.

### 1.522
- what idiot wrote the _utf8_decode function I'm using?????

### 1.521
- Fixed undefined i strict mode problem which popped up in the index page
- That's what I get for not testing with cookies since they don't work in chrome for local pages

### 1.52
- Glass blower has an 'each'
- Fixed 'When active X uses 0%...' mustard
- More words and sentence structure rejigging
- Prevent Panther Salve from being too overpowered
- Fixed 3 boosts where I defined descriptions twice, instead of description and stats
- Moved redundancy to a new file
- Noticed that 'strict' wasn't on in my data.js and then discovered the base64 unencode function needed a tiny syntax change :P
- Added redundant information to the index
- Buttons at the top are bigger, and moved Molpy Down and Coma into options
- Sand Refinery downgrade button. Refunds 1 chip. (doesn't have detail about the effect on production but obviously it's the opposite of upgrade)

### 1.51
- Tweaked some sentence generation, added some stuff, fixed some mustard
- Adjusted blitzing stack effects (there was some mustard in the code, also I wanted to make it double BF/NL at minimum)
- Notification when ASHF and Temporal Rift are about to expire
- You have a chance of slipping into the Rift accidentally as you dig (when it's active but not immediately)
- Sand Purifier fixes

### 1.5
- Tweaked Blast Furnace (fractals helps it more), made base ASHF time 5 not 4 mNP
- Glass Jaw is now easier to unlock for those who want to use it sooner rather than increase glass block production
- Extracted the various redundarewards into their own functions for neatness and easier reading of code
- Set limit per NP of Glass Blocks available as rewards (based on chiller), further not-luck gives chips
- Rewrote how redundaboxes are generated to be more treeish and extensible
- New boost (in the progression it comes before Redundant Redundance Supply of Redundancy)
- Blitzing multiplies subsequent Not Lucky and Blast Furnace rewards
- Blitzing stacks with Blitzing (adds power of current Blitz and half its countdown)
- Fractal Sandcastles boosts Not Lucky also
- Panther Salve uses more Glass
- New icons! (By BlitzGirl)
- Spent way too much time on the description of the new boost and I'm struggling to stay awake I just realized ugh.

### 1.5 musical version (incomplete but I'm not writing a second verse right now)
- Blast Furnace-fractal interaction is more benefici-al
- Home Furniture is now for 1 m.N.P. more available
- I rewrote redundaboxes to be more extensible
- The code is far more treeish and the function is maintainable
- The Lucky glass block prize per ONG is limited by Chill level
- And then until the next ONG only glass chips are available
- Glass Jaw can be unlocked as soon as you have ten blocks in the store
- The kit reward code has been split so reading it is not a bore

### 1.43
- New Icons for Fractal Sandcastles, by StormAngel88
- Original image was by cmyk

### 1.42
- New Icons by BlitzGirl!
- Fixed an old icon which was broken because I derped
- Somehow DoN wasn't tagged as Action because of capitalisation. I thought it was working before
- Fixed 0 castles from Trebuchets if you have none of the new multipliers
- Untag some things when no JD
- Irregular Rivers are not Waves in the description now
- TWV0YWwlMjUyME1vbHBpZXM= [REDACTED]
- That was redundant.
- Believe me!
- Tagged items are now sorted!

### 1.41
- Boost price fix: some were 1000 times what I intended

### 1.4
- Trebuchet badge and boosts
- Not Lucky Glass
- Schitzoblitz
- Boosts given by the department now opt-in rather than having to be put into a list of all possible department boosts and opting out until they want to be really available. This means it's simpler to add new ones since there's no triple handling. (This does not affect gameplay.)
- Import doesn't save if you cancel
- Refactored Badge definitions to use dictionary like Boosts do
- Fix SurfBot price: was missing an M
- Late Closing Hours should have been Hill People Tech

### 1.3
- Renamed Novikov Self-Consistency Principle to be more OTTish
- Fixed some Badge description mustard: I was trying to Molpify pre-Molpified numbers, now they are DeMolpified first.
- Index updated with film even though I haven't finished whatching it yet at the time of writing this.
- Okay now I have. Redundant Redundance Supply of Redundancy added.
- Fixed m*starded parentheses which were preventing the full benefit of Kitnip and Kitties Galore from being applied
- **Other Things that are Necessary in a Changelog:**
- *Molpy, molpy, molpy, molpy*
- *Molpy, molpy, molpy, molpy*
- *Molpy, molpy, molpy, molpy*
- *Grapevine, grapevine*

### 1.23
- VITSSÅGEN, JA! has nothing to do with this update
- Fixed (theoretical) Sand Refinery description mayonaisse caused by Sand Purifier division
- Furnance Crossfeed boost kills 2 of waveney's ch*rpies with one stone
- Combined the castles destroyed and built by Doublepost into just one notification each
- Combined castles created by tools and by the castle-sand price rollover into one notification
- 2 Boosts and 2 Badges now change their class (i.e. colour tag) depending on state

### 1.22
- VITSSÅGEN, JA! stats falls back to show description once powered up
- Glass Jaw now doesn't unlock until you have upgraded Glass Chiller at least once
- Glass Jaw also is now a Toggle (defaults to off so you may need to switch it on if you expect it to work)
- The above changes now prevent you from being in a situation where you need to Ninja-click 5 times to avoid being stuck unable to upgrade the Chiller ever
- Glass Furnace and Glass Blower now show 'currently activating/deactivating' instead of the activate/deactivate button, when appropriate
- A new department boost because I need it!
- Changed Ninja League/Legion un-hardlock placement so they won't become unavailable when you (by which I mean *I*) reload

### 1.21
- Fixed bean group name mayonaisse
- Made Sand Purifier upgradeable
- Fixed Glass Furnace and Glass Blower description mustard: was using the sand cost % value for the amount produced.
- Fixed Sand Refinery upgrade descripton text: was using the amount produced value for the future sand cost % value.
- Proactively fixed the same for Glass Chiller (currently they ARE the same value but they might not always be)
- Great Scott!

### 1.2
- Castle tools use postfixes for amounts of castles rather than long form
- New Badge
- New Boosts

### 1.1
- Added Option to Options, to toggle OTColoured (only available when Chromatic Heresy is on)
- Added Option for longer numeric postfixes (i.e. show Kilo instead of K)
- Added a bunch more non-SI numeric postfixes which I made up because why not?
- Now I can specify Boost prices as '2.3T' or '95M' instead of 2300000000000 and 95000000
- Yeah messing that up was what caused everything to go to mustard for a while
- Shopping Assistant now only buys during ASHF (if you have Late Closing Hours, you'll get as many as 9 buys per ASHF)
- New ninja stealth boosts and badges
- Prevent spending 20 chips when you have 19
- Swim Between the Flags boosts for Flags and Rivers
- Fix to Erosion which had weird math


### 1.0
- Glass Block stuff
- Glass Furnace can actually switch off now.
- Department messages shortened
- Fiddled with Swedish Chef a little
- Glass Jaw
- New pun
- VITSSÅGEN, JA! now can't be "bought" by toggling it.

### 0.99991
- VITSSÅGEN, JA! description works
- VITSSÅGEN, JA! toggle actually implemented
- VITSSÅGEN, JA! is now tagged as toggle so it shows up blue
- VITSSÅGEN, JA! is just fun to say
- VITSSÅGEN, JA!
- VITSSÅGEN, JA!
- VITSSÅGEN, JA!

### 0.9999
- Fixed postfix mixup
- parseFloat rather than parseInt on all sand and castle amounts when loading, just in case
- got rid of unnecessary Flint function (WHY was it using parseInt when SAVING??)
- singular Glass Chips are now 1 Glass Chip
- prevent further usage of sand rate for glass making purposes if it's already all in use
- gave a benefit to Double or Nothing destroying :P
- VITSSÅGEN, JA! now toggles

### 0.9998
- Fixed furnace-switch-description refresh-mustard
- Fiddled with show-hide-on-buy: tags override group and groups don't hide other groups
- Experimental Chromatic Heresy

### 0.9997
- Fixed boosts in shop being hidden by the group buttons
- When a boost is bought, show just its group
- Changed show/hide boxes a bit (is this better?)
- Renamed a boost and added new boost with the old name at a higher tier because reasons
- first stage of Next Big Thing (not exactly highly useful yet but you can buy and use stuff okay)

### 0.9996
- a timetravel-related boost (which may help you *get* time travel if you're lucky)
- boost groups now have buttons!
- redacted works with the new group buttons

### 0.9995
- VITSSÅGEN, JA! is more powerful
- Swedish Chef unlocks a bit sooner
- more boost group names
- a trebuchet boost
- a ladder boost

### 0.9994
- Swedish Chef follows on from VITSSÅGEN, JA!
- 3 More swedish/shopping related boosts
- fiddled with sell pricing a little to ensure no cheating :P
- update DON description

### 0.9993
- VITSSÅGEN, JA! actually works now
- Reduced BKJ and BFJ's power a lot but now they don't decay at all
- DoN's power doesn't decay, instead the price increases.
- Fiddled with some Judgement Dip + Time Travel stuff so time travellers have a chance of surviving

### 0.9992
- fix tagged loot mustard

### 0.9991
- fix buying badge mustard
- Fix css on links mustard
- fiddled with boost drawing because of reasons

### 0.999
- Some sort of title page thingy

### 0.998
- Missing a kitty delays the next kitty, increasing as you miss more but resetting when you click one or click for sand.
- VITSSÅGEN, JA!
- More tool badges
- Valued Customer and Fractals Forever made harder
- BFJ and FC more expensive
- Exa, Yotta and Zeta postfixes
- More BlitzGirl icons!
- Removed accidental overpowering of BKJ: forgot to remove some code when I reversed how its power works


### 0.997
- New Department Boost: Blixtnedslag Förmögenhet, JA! available after you get Blixtnedslag Kattungar, JA! powered up enough
- Nerfed Cooperation to 5% per bucket pair, rather than 10%. Combined with The Forty it made Cuegan far more powerful than Bags
- BKJ! now decays by 5 for a missed kitty

### 0.996
- Actions now get their own colour rather than being toggles
- New Cuegan boost (finally did The Forty which was suggested ages ago)
- 2 Flag boosts to ninjas

### 0.9952
- Ensure index page loads fresh .js files rather than cached

### 0.9951
- Mustard

### 0.995
- You must understand this line before you can understand it
- No Sell boost. Finally.
- Prevent negative click sand if you sell lots of bags
- BKJ! loses power a little quicker for missed kitties

### 0.994
- Updated version number to 0.993
- No, to 0.994 actually :P
- Added another boost for clicking, this one relating to Bags

### 0.993
- 2 new Bucket boosts!

### 0.992
- Fixed Balancing Act
- NPB Navigation Code now only prevent time-travellers when it's activated
- BKJ! counting logic is flipped around, and loses 1 power when you miss a redacted.

### 0.991
- Changed condition for Fractal Sandcastles, so people who are past the Recursion Period don't have to go back for it
- And a related badge
- Badges for spending a lot
- Boost for Scaffolds and flags
- Fixed Novikov price
- Ch*rpies
- Fixed department crash

### 0.99
- Fixed printing numbers with decimal parts which round up to whole numbers (1.99 should become 2 not 1.100)
- Nerfed Not Lucky a little
- Navigational Code destroys Time-Travelled Bots and prevents more when active
- Fixed incorrect incursion factor calculation
- Maximum 30 Time-Travelled Bots
- No notification if Judgement Dip Bots destroy 0 castles because you have none
- Ensure Judgement Dip level can't be negative
- Double or Nothing decreases in power rather than just dying
- New Boost: Novikov Self-Consistency Principle. Will help Time Travellers against the Bot incursion
- Made *bot Boosts even more expensive because Luggagebot was cheaper than Embaggening
- Nerfed Embaggening to only count Cuegans over 14.
- Fractal Sandcastles: Dug Sand turns into more Castles (incrementally). Also reduces the Blast Furnace Castle Cost
- Badge Not Found
- Another Badge which lets you keep Fractal Sandcastles when you Molpy Down!
- Factored out some boost and badge rendering code for reuse.
- Toggle button to show just the tagged boosts and badges
- Better detection of when to unlock Chromatic Heresy: don't need to add new tagged items to a long OR condition
- Finally decided there's too much stuff in this version to call it 0.983

### 0.982
- Icons for *bot Boosts
- Updated *bot Boosts' descriptions to match long-ago buff
- Rename Washbot to Surfbot because it's more molpish
- Double or Nothing isn't available after 10 locks

### 0.981
- Multiplied *bot Boost sand prices by 10
- Show/Hide Loot subkittegories

### 0.98
- Update Colour Scheme when Molpy Down
- Display correct Judgement Dip level during Coma Molpy Style
- Don't pop up Judgement Dip notifications when it hasn't changed (it thought it had changed because of how CMS changed the numbers)
- Made the boosts available in Judgement Dip only require the boost 2 levels before, rather than the one immediate previous
- (e.g. you only need Minigun for Big Splash to be available in the Department, before you needed Stacked)
- First log entry was repeated at the bottom
- Some layout improvements to fit large numbers better
- Large numbers are shortened: Kilo, Mega, Giga, Tera, Peta for 1,000s, 1,000,000s, 1,000,000,000s, 1,000,000,000,000s, and 1,000,000,000,000,000s
- Stats view shows full length numbers for when you want exact figures
- Huge Buckets now costs '2 Castles' rather than '1 Castles' so I don't have to write a conditional s
- Blixtnedslag Kattungar, JA! (after you buy this, every additional redundakitty will add 1 to the blitzing multiplier)
- Buffed Not Lucky some more
- Wipeout now actually checks if 500 castles have been destroyed by waves rather than 200 wasted.
- New icons! For many purchased boosts (also better Cuegan), by BlitzGirl

### 0.979
- Now anyone can definitely get the leopard badge by entering 'F5' in the right place
- scrumptious donuts

### 0.978
- Added a way for touchscreen-leopard users to type stuff in (or rather, just handled the events for the existing already existing method :P)
- Added a boost to avert Judgement Dip
- Scrumptious Donuts

### 0.977
- A whole raft of new Boosts in the Department, available as Judgement Dip progresses to higher levels

### 0.976
- Added leopard stuff including badge

### 0.975
- Occasional pants

### 0.974
- When loading, hide Redacted to prevent savescumming
- Fixed chromatic CSS for boosts in shop
- New boost for time travellers: Flux Turbine
- Found the Sand Tool sell code didn't do quite what I thought

### 0.973
- Removed some references to old hover stuff
- More buttons
- Added some (not all yet) Boost stats
- Sometimes stats will show some extra info on a boost before you buy it
- Made Precise Placement cost a lot more: I think I never changed it after copypasting
- Heresy

### 0.972
- Judgement Dip notifications logged
- Prevent DON savescumming
- Description hover now works in firefox (probably Safari too, let me know)

### 0.971
- Not Lucky reward general increase, sand tools benefit more than castle tools
- Fixed Ninja Penance not decrementing when used
- Bag Burning Boost: helps fight the NewPixBots
- Totally revamped the hover code
- Half second delay on show description, full second on hide
- That means you can move the mouse over the badges and boosts at a reasonable speed without them popping up

### 0.97
- fixed Dip heresy
- fixed Where is All this coming from boost not unlocking
- made *bot boosts a bit harder to get, more expensive, and locked them all :P
- moved Bot Efficience back to being before Recursivebot
- *bot boosts now also boost their related tool, by 4.
- Judgement Dip triggers reworked
- Judgement Dip destruction now occures only every 50mNP
- Prevent infinite sandcastle gain loop via timetravel
- Prevent free timetravel

### 0.963
- an inoccuous boost rename
- track total castles built wiped by Molpy Down
- fixed tracking highest NP visited (oops, that would have been messing with Time Travel)
- a several new badges, mostly for Time Travel use
- actually increment number of time travels!
- added a way to help finance time travel
- and a time travel boost to help even more!

### 0.962
- 10 NewPixBot boosts
- a Wave boost
- changed how redundakitties are clicked

### 0.961
- Encheapened Embaggening, with refund
- Hide higher end shop items until you buy the cheaper ones

### 0.96
- Even more ChronosDragon icons
- fiddled with a bunch of CSS and a few of the shades on badge headings
- removed [available] and [earned] on badges because they are redundant (and waste space)
- clock visibility is set properly after loading
- added 2 bag boosts

### 0.952
- Fixed 2 typos, one causing weird description, one causing failure to load Factory Automation

### 0.951
- Options visibility toggle had some lines flipped around somehow
- Keep track of number of times time travel is used
- Reset some more stuff on Coma which I forgot to add
- Three new boosts relating to the department and newpixbots

### 0.95
- Ninja forgiveness now uses boost power property so you don't need Hope for Penance to work
- ChronosDragon's epic icons of epicosious treefulosity

### 0.943
- typo: bag->bags
- typo: added missing 'Style' from lyrics
- new boost: kitties galore
- typo: ; being output in notification log

### 0.942
- time delay before descriptions vanish
- links in boost descriptions work
- temp boosts with countdowns will continue updating without descriptions vanishing (until they finish)
- a new boost is finally working! (it may be very handy to some and has a neat easteregg)
- another new boost for those who molpy down
- and a completely new boost to help with ninja stealth when the pix grow long

### 0.9411
- high level sand click badges now bases on sand dug by clicks, not clicks
- this should have been in the previous version but forgot to list it and it didn't work anyway.

### 0.941
- removed some version-specific lock-on-load for badges which were made more expensive long ago
- Overcompensating description fixed, ensure it's 105%
- ensure Erosion can't make Wave's destruction negative
- notificaction/sandnumber text 8 points smaller
- always show option descriptions, refresh them if visible after load/import

### 0.94
- track highest NP visited (doesn't reset with Molpy Down)
- some treeish new boosts - not finished/available yet
- notifications logged to stats page
- took a newline out of the Counter box so there's room for numbers to get big and take up multiple lines
- buffed Erosion so it's relevant if you have Rivers
- Department reward selcection algorithm is more treeish
- buffed the Not Lucky reward
- implemented mrob27's export riverification idea

### 0.936
- export to textfield
- favicon

### 0.935
- gave overcompensating the proper power value when loading old saves

### 0.934
- option for click numbers
- notifications move better

### 0.933
- layout nicification

### 0.932
- padding

### 0.931
- added 2 longpix boosts

- fiddles with some department stuff a little

### 0.93
- sand particles!
- when redacted were supposedly vanishing they weren't actually causing refreshes so they stuck around.

### 0.924:
- badge for experiencing the longpix

### 0.9231:
- disabled having the department activate 100% every redactedreward even when it's not bought

### 0.923:
- bigger buckets x2 sand is now applied BEFORE Helpful Hands, True Colours, and so on
- fixed some reversed logic, a missing return from the random list element function, and a missing .length, so now the Department should work.
- implemented grapevine. Cos it didn't actually do anything before. oops.

### 0.922:
- improved import/export prompt messages

### 0.921:
- upped some prices

### 0.92:
- no longer saving the redacted timing numbers: wasn't necessary
- added some redacted related badges
- added kitnip, which affects redacted timing
- department of redundancy department!
- changed 'Where is this coming from?' to 'Where is all this coming from?'
- when starting, define newpixnumber BEFORE trying to use it to set the ONG date (prevents erroneous ONGs)
- added some boosts for the department and a normal one for click boosting
- price factor stuff
- if export string is over 2000, split into multiple prompts.
- (should replace that entirely, soon. cos it doesn't work on my phone.)

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
