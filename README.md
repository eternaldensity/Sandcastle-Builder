# Sandcastle Builder

xkcd: 1190: Time: The Game

## Credits

Code mostly by Eternal Density.

Parts of code and the clockface image by ChronosDragon.

Quite a bit of code by waveney.

Icons by ChronosDragon, BlitzGirl, and StormAngel/cmyk.

'NewPix' by Randall Munroe. 'Colpix' by various.

Inspired by Orteil's C**kie Clicker.

For personal amusement only.

## Changelog

## 3.16
- New Boost Icons from BlitzGirl! (mostly tagged boosts)
- Zero more potential mustard (NaN) when loading
- Beachball Boost doesn't show ninja warning after you've ninja'd
- Redunception doesn't notify if Expando is active
- Automata Control optimised when you have all glass tools: no need to make tools that are about to be spent
- Sand particles don't need transparency
- Don't mess with transparancy of more than 8 notifications
- Fixed a discovery on wrong NP
- When you Molpy Down with infinite castles, totalCastlesDown is set to Number.MAX_VALUE (previously it was unchanged if infinite castles) thanks EPSILON of DashNet IRC
- Chromatic Heresy is related to 'hue', right? ;)
- Formatting of negative decimal numbers was horribly broken. Not that there should be negative numbers, but now if there is, they're the right negative numbers!
- Remove spaces from tool icon IDs
- New Tool Icons also from BlitzGirl! Yay!!
- Constructing from Blackprints now does nothing if you somehow end up with less pages then needed
- What is Friendship?
- Hotdoge
- Another Dragon, plus one not finished yet

## 3.153
- Discovery Detector messages go to log
- Typo in Discovery Detector (yay not mine)
- I forgot to wrap the Sand Monument images in the new URL function I'd extracted when attempting to do preloading
- So now Sand Monument images will actually appear
- Another DD change by waveney
- Stats shows partial blackprints, also by waveney (wish I'd thought of that! Well I hope I would have, but it's a moot point question now :P)
- Forgot to change a number when I supposedly made Mysterious Representations activate at lower AC levels, making it go backwards
- I updated Google Chrome and now I can't look at the console and sources at the same time. (Just felt like complaining)
- Panther Rush checks that you have the required logicat levels when buying it
- Panther Rush asks the user if you really want to spend the logicat levels before using them
- Panther Rush reunlocks after usage if you have enough Logicat levels for its next (or current, if you declined to buy it) level
- That's because the confirmation actually happens after buying so it has to lock and unlock to ensure the number of boosts owned comes out right
- Assuming it does come out right (let me know if you see any wonky numbers: someone reported an issue with negative boosts owned a while back and though I haven't bene able to reproduce it, that doesn't mean it can't happen in some circumstances)
- Rambled in changelog. I'm surprised I managed to avoid doing that for so long. I tend to ramble. Especially when... nevermind

## 3.152
- Allowed much higher production control

## 3.151
- Missed buckets in my phone-only mustard sand-tool-rate fix, which cost me a factory automation run because I had no sand unexpectedly

## 3.15
- Bunch of numbers in the save were being parsed as ints instead of floats, leading to problems now that the numbers are large enough
- In particular, glass storage sizes, but temporal duplicates were now able to go wrong too, and the number of active bots, and a few other things
- Thanks for doing that for me waveney :D

## 3.143
- Okay so the problem was that on my phone, javascript likes to think that Math.pow() should return 0 instead of Infinity for very large exponents
- And it was fine for castle tools since I was shortcutting their prices to infinity already. So now I'm doing that for sand tools also

## 3.142
- Messing with order of multiplication of sand tool rate multipliers, returning early for infinities, might fix the NaNs that only show up on my phone

## 3.1416
- Handle weird case where Constructing from Blackprints is constructing nothing (I don't even)
- Locked Crate reward no longer uses a loop to expand block storage. That was stupid
- Negative message on Discovery Detector (thanks waveney)
- New dragon
- Finally remembered to put jQuery.js back on the index page

## 3.1415
- Disabled the jQuery preload of next newpix because it was not working and was spitting out errors for some
- faster seaish (big) upgrades of Sand Purifier and Glass Extruder (waveney)
- Redundatracking, and some tracking bugfixes
- Beachball boost fix: ensure change to blue is after bots have activated
- Sawtracking

## 3.141
- Tracking update: convert integers to strings
- Less hovering

## 3.14
- Automata Control next upgrade price shown
- Strikethrough on unaffordable stuff
- Waveney's discovery detector
- Finally fixed tool price formatting so that NewPixBot costs 1 Castle not 1 Castles
- Prices are divs not spans so they don't start on the same line as the buy link
- Some Google Analytics stuff
- Achronal Dragon to track and destroy temporal duplicates (if you want to)
- Add/Spend Glass Chips now makes the following descriptions update (per mNP): Glass Chip Storage, Sand Refinery, Glass Extruder
- Add/Spend Glass Blocks now makes the following descriptions update (per mNP): Glass Block Storage, Sand Purifier, Glass Chiller
- Cold Mould boost to pause Mould activities
- Price Protection boost to prevent accidental buys after ASHF ends (is togglable)
- Added a bunch of tool chip rate badges
- Preloading the next newpix 2mNP before the ONG (except it isn't working yet, I think)
- Changed Beachball boost to warn 2mNP before ONG rather than 1 (because of the above)

## 3.13
- Now you can call Molpify like this: Molpify(someNumber, decimalPlaces,2) and it won't apply all the letter prefix things, regardless of your game's scientific notation setting
- The 'enough chips for making blocks' check was backwards all along
- Changed Broken Rung condition: for instance while 6000 bags bought will make LaPetite visible (unchanged), 6000 bags *owned* is needed for 0 LaPetite to affect Broken Rung
- New Badge for beginners to teach about waiting for the ONG
- Also extended the description of Castle Price Rollback badge
- Added google analytics to track pageviews.  Let me know if that is a terrible idea
- BKJ power level moved to display on stats rather than description
- Also improved BFJ description/stats a bit
- Nerfed Blast Furnace a little pre-BFJ (was limited to total castles built /2, now it's /3) but buffed it with BFJ (was /10, now /5)
- So Blast Furnace with BFJ (and Blitzing) is still more limited by the total castles built than otherwise, but if your total castles built is huge then it's better than without (i.e if you've used Molpy Down you can potentially catch back up faster)
- Blast Furnace with Blitzing without BFJ is twice as effective as without Blitzing, which is unchanged from before but I just thought I'd mention it.
- Fixed Tool Factory giving things it shouldn't: I forgot to copy a condition

## 3.12
- I removed the molpies and grapevines from the wrong place
- The previous Tool Factory changes broke Tool Factory (and all your tools) if you didn't have Tool Factory
- If you don't have an earlier save, sorry but your tools are gone and I can't get them back. If you remember how many you had, feel free to edit them back in
- Also suggest suitable punishments for me
- So yeah I should test what happens if you *don't* have features that I'm changing as well as if you do.

## 3.11
- Panther Rush description missing word
- Ensure WWB/RB's unlock Boosts will unlock if you're already eligible for them.
- Don't show trade/hint for WWB when infinite factor
- Remove WWB from tagged items when infinite factor
- Adjust Knitted Beanies and Space Elevator prices
- Wasn't a way to see BKJ! power level
- Locking glass ceilings now distributes Tool Factory's production over the remaining glass tools
- i.e. if you have PC=1 and lock 6 of 12 glass ceilings, it'll make 2 of the remaining 6 tools per mNP (assuming you can afford it!)
- or if you lock 11 you'll get 12x the 1 you didn't lock
- Upgrading to new version now says 'upgrading to new version instead of:
- *Molpy, molpy, molpy, molpy*
- *Molpy, molpy, molpy, molpy*
- *Molpy, molpy, molpy, molpy*
- *Grapevine, grapevine*
- More PC multiupgrades: now in a for loop!
- Changed Tool Factory (other than the simple can afford to buy everything case) to bulk buy the largest number of tools it can buy the same amount of, then buy 1 of anything leftover
- Bag burning should power up twice as fast, also removed the random burning of single bags.
- Longer description for Bag Burning
- Some Tool rate badges
- DestroyPhase function no longer loops once per castle tool owned (which is kinda slow when you get millions), instead uses division :P
- A single over nine thousand joke wasn't enough. Especially since I made it months ago.

## 3.1
- Fixed index to accept title change
- Panther Rush description improved so players don't expect to see it in their Loot
- Fixed castle display so it shows "1 castle" for that first castle rather than "1 castles"
- Molpify Ninja Stealth Build amount
- Truncate scientific notation numbers to 6 decimal places
- Boots typo
- Coloured border was not removed when loading a save with Beachball boost disabled
- Fixed another Beach CSS problem: turned out all the recent issues there were caused by using .background instead of .backgroundImage
- A couple new Glass Tool boosts

## 3.09
- If Locked Crate prices is mustarded, it becomes free (apart from the glass). Sorry I thought that couldn't happen in the wild.
- And a Badge because why not?
- More of Waveney's Discoveries
- Removed all the upgrade code for versions less than 2.1 because I doubt anyone is running those. If so, let me know and don't upgrade until I put it back.
- Showing full numbers in scientific notation instead of the shortened numbers is now a separate option rather than based on being in stats view
- Toggling Stats wasn't redrawing Badges
- Added Mushrooms as a counterpart to Badgers

## 3.08
- Mys*t*erious typo fixed
- Unneeded Factory Automation Upgraded message removed from Ninja Climber
- Mysterious Representations now works from AC level 15 (Zookeeper still works from 21), updated descriptions accordingly
- Blast Furnace doesn't do any blastfurnacing if you have infinite castles (doesn't effect crossfeed/multitasking)
- Keygrinder's check for key availability now doesn't need to have a logicat reward to have run first
- Spent a while reading some /vg/ igg threads which showed up when I googled VITSSÅGEN. Very amuse!
- Found a bunch of stuff that needs fixing, thanks /vg/ (lulz typo, I just saw someone pointing that out... sigh)
- Noticed that VITSSÅGEN, JA!'s description didn't mention that it gives castles every 100 clicks, since that was originally a totally unimportant fringe benefit
- VJ and Panther Salve also didn't mention that they unlock other boosts with use.
- Phonesaw also didn't say what it does, added that to its stats.
- Fixed 'activation level': meant 'automation level', duh.
- Clear target answer after completing a logicat question
- 50 Glass Block cost for Second Chance is not applied until you click the second answer
- Instructions on how to use your leopard
- Prevent Tool Factory Load Letter (and subsequent) if you don't have Tool Factory
- Added Bacon to Blackprints build list for people who managed to get infinite sand rate without it and don't want to wait (yes I wrote dip before, that was wrong)
- Bigger load sizes for TFLL
- With Booster Glass, show +numbers on click (if the click-numbers option is enabled)
- Fixed stupid CSS weirdness preventing the resizing of Colpix

## 3.07
- Moved AdjustFade so it's accessible to the index page (so the version number shows up again)
- Changed Locksmith to Mysterious Representations, which produces pages directly.
- Removed Zookeeper notification (just wait for Caged Logicat to show up)
- Track redundakitty chains, added a badge and a stat
- Actually fixed Overcompensating
- If Panther Rush is stuck in Loot from earlier bug, run its buy function to fix

## 3.06
- On buying a Crate Key, it will try to buy Locked Crate before using up the key making the Crate cheaper (so the key will be used to remove a lock, when it previously it was wasted)
- Added stats view for Trebuchet Pong, Grapevine, Ch*rpies, and Facebugs
- Beachball
- Exponential boosts now say "boosts by x% cumulatively per thing" to distinguish them from linear increases
- Wasn't Molpifying the division numbers for sand purifier or glass extruder

## 3.05
- Fixed Expando/Glass Monument interaction

## 3.04
- Prevent Locksmith from awarding ASHF when you already have it
- Overcompensating's buff wasn't applied to saves which already had Overcompensating owned
- Fix panther rush on-buy crash (fortunately it was in calculating the levels so it didn't waste any levels)
- Nerfed Locksmith a bit (even though it wasn't any more powerful than AA was previously if you knew how to leverage it...)
- Crate key message improved and not shown if from locksmith
- Boost unlock/lock/describe messages supressed from locksmith/zookeeper: just 1 message to show that one/both activated
- Disabled Expando because it's causing problems and I don't have time to fix it properly right now, sorry
- Glass Saw is a toggle now
- Molpy Down refreshes the Options

## 3.03
- Changed all occurrences of "% of sand dug" to "% of sand dig rate", so glass-production costs are clearer (thanks Vidyogamasta for pointing that out... 2 weeks ago)
- Waveney's improvement to Glass Saw: instead of leaving 5% of Block Storage empty, it leaves space equal to 10mNP worth of Automata Assemble's Factory Automation (so it'll still fill block storage if you don't have AA going)
- Automata Assemble now uses same function for running FA in all cases
- Automata Assemble description updated to show that it only activates Blast Furnace (and subsequent functions based on crossfeed/multitasking)
- New boosts to add ability for AA to do Blackprints/Moulds work, and produce Keys and Panther Poke
- Monument Time Travel doesn't use any castles now but it costs more chips. (based on the square of the distance, so multiple short hops are cheaper than a long jump)
- Destruction verb for NewPixBots because their destruction counter is used in Judgement Dip
- Furnace Multitasking was not locking in shortpix, which lead to weirdness with AA because it quickly used up all your (well, my) Chips making Blocks
- Sand Monuments show a thumbnail of their NP and Glass Monuments change the main image to their image
- SGC added. No that does not stand for Seaish Glass Chips
- Seaish Glass Chips description improved to explain what it doesn't do
- A couple of monument related boosts (untested...)
- Seaish upgrade for Glass Chiller is limited so it won't use more chips than the Glass Furnace is making
- *The Sea is Big*

## 3.021
- Was missing a return so the castle tool price calc was still horribly slow

## 3.02
- Added Upgrade x10 button to Production Control
- Downgrade buttons on Production Control, Automata Control, Sand Refinery, and Glass Chiller are all hidden by No Sell
- But did anyone ever use those apart from accidentally?
- Fix stupid typo (pricePrice) which was messing up the shortcut calculation of infinte castle tool prices and therefore causing higher load times the more castle tools you/I have
- If no Blackprint-construction remains, the Blackprints-needed stat shows the amount needed for Automata Control
- Panther Rush now uses up 5 less Logicat levels, but still unlocks at the same point, meaning when you buy it you can't have less than 5 levels left

## 3.01
- Shopping donkey doesn't buy if no item (i.e. prevent crash.)
- Logicat's "correct answers needed" display now accounts for Panther Rush
- Bunch of new NP-based badges, by waveney (cos I was taking too long getting around to adding them)
- Fixxed some typoes
- Safety Goggles prevents Safety Hat unlock
- Glass Saw doesn't competely fill glass block storage (another waveney idea)
- Pluralisation (i.e. conditional 's') finally moved to a function. Please report any resulting/remaining pluralisation errors. Once. ;)
- CMS description clarified (I hope) a little.
- Added a new link to the index: something which I only just discovered exists :P
- Shorten Not Lucky message after np400
- Added an ONG countdown timer. For free!

## 3.0
- Bottle Battle in cyb group
- Panther Rush description improved
- Stat for chips per click
- Clean up mustarded totalcastlesbuilt for castletools
- Changed Panther Rush to increase the points from Logicats (Caged and Wild) instead of the number of Caged questions available
- It's half a point per level which means it's about as powerful before : at level 1, 10 answers is worth 15 answers and at level 2, 10 answers is worth 20. (it used to give 5 extra questions per level)
- Split DoRD/Logicat reward logic into two separate functions

## 2.991
- Beanie Builder upgrades are now in the beanish tech group

## 2.99
- Smashing a crate open only gives whole blocks
- Prevent infinite castles down
- Missing 1* for Ruthless Efficiency department flag
- Suppress glass ceiling lock message with Tool Factory
- Prevent Impervious Ninja from preventing the new Ninja Strike badges from being earned
- Seaish Glass upgrading (courtesy of waveney)
- Stat for Sand use for glass now shows more decimal places
- Fixed Sand Refinery being able to go over 100% sand usage
- Dealt with some typos
- Extra way to get Safety Goggles apart from the Safety Hat way
- Fixed AC price and upgrade cost. And now it uses some Blackprint Pages too

## 2.981
- Colpix option description fix

## 2.98
- Finally fixed AC upgrade price mustard!
- Compressed advanced badge save-storage (and fixed backward compatibility)
- Don't notify about chip/block gains if Automata Assemble is on
- Wording fix: Colpix
- Mustard when finishing blackprint construction

## 2.97
- Changed AC upgrades back to using chips, and changed the pricing

## 2.96
- The goggles, they unlock
- Glass Saw only doubles in power if you have double it's power in glass left over.
- Optimisation of Automata Assemble
- Automata Control starts from 1 since it's now detached from Production Control
- AC upgrade price fix (was checking wrong value... and I made it use Blocks. and was too cheap)
- AC locked and reset. It's now harder to get. Getting more NewPixBots will help get it. See Free Advice
- Badgers price fix
- Some new Ninja Badges
- Fixed some typos

## 2.95
- Single lettter typo
- Glasss Saw power multipler should worrk now
- Automata Assemble lets you upgrade glass storage any time.
- Control Automata price reflects the description
- Earning a Badge when you have Badgers recalculates sand dig rate
- DeMolpify function now handles empty string or undefined value (returns 0) which should prevent stack overflow

## 2.94
- Furnace Multitasking description was wrong after buy
- block gain/loss messages were not consistent with chips
- Performance increase if you have all Glass Tools enabled for Tool Factory and can afford them
- Redraw stuff when hiding Stats
- Fiddled with Glass Saw a bit
- Safety stuff

## 2.93
- Shopping Assistant remembers your choice. (BTW it doesn't work for Bigger Buckets. But you probably already have that)
- I think I fixed the issue of free boosts not being bought on occasion: castles were NaN after spending infinite castles
- A bunch more boosts for glass castle tools

## 2.92
- Flipside now not available until after you get Automata Assemble, since it's not really useful until then.
- Glass Mousepy
- Caged Logicat untagged if sleeping
- Panther Rush improves Panther Poke
- Glassed Lightning
- Fixed Badgers description
- The SpendSand function now ensures sand is not negative
- Boost to control AA power separate from TF power (defaults to current behaviour until you get it, and it starts at the current level)
- Finite/infinite tool price checks include the Price Factor now

## 2.91
- TFLL now allows you to load 10K if you don't have 50K
- Waves additionally show how many castles will be destroyed/built on the next ONG, if you have SBTF
- Panther Salve now shows progress towards LCB (oops)
- Rosetta now always displays how many NPBs for the next FA upgrade
- Stats show number of castles sacrificed via Molpy Down or Rift
- Automation Optimisation improved to allow Construction from Blackprints from occurring alongside other work
- Boost to allow construction of Glass Tools of finite price instead of infinite price
- Finally a new way to get Factory Automation runs

## 2.9
- Production Control for Tool Factory
- Panther Poke! This requires 2500 redactedclicks before you have any chance of seeing it
- Moved Blackprints stat into Other, and added Logicat Level to Other stats

## 2.898
- ONG performance increase - less looping on destruction
- Prevent fractional glass chips/blocks in storage, and prevent fractional size upgrades
- Larger upgrade increments for Sand Refinery and Glass Chiller (finally!)
- Glass Extruder was missing punctuation
- Buffed TFLL a little
- BG buffed a little also (it's not meant to be particularly powerful)

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
