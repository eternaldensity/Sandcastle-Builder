## Changelog

### 4.05 Method Not Allowed

#### pickten
- duplicate notification option bug
- fix typo that was breaking Not a Priest

#### xeymericx 
- Mark technicolour as tagged item

#### dfriedenbach
- fix a couple issues with exit through the abattoir

#### ED
- typo (unnecessary aphostrophe in DQ description)
- updated changelog
- added Discord link to index
- updated changelog again
- updated changelog redundantly
- Merry Christmas!
- Removed Elfish Destiny
- updated changelog because I missed mentioning the most important thing because I was distracted markig and closing the duplicate issue on GitHub
- reminded people they can still comment on a closed issue asking for it to be pushed to li

### 4.04 Fool Not Found

#### pokeball99
- Move changelog to its own file

#### Pikrass
- Typos

#### pickten
- Fix infinite backwards movement in TaT pix (bug #1471)
- Molpy.subtractObjects was not pure (bug #1481)

#### EPSIL0N 
- dragon equipment reward quick fix

#### coderpatsy
- Reset currentLog button when clearing logs
- Glass Blower description spacing

#### ED
- Fix NPBs mustard total castles built (bug #1477) - Mustard cleanup now happens after adding mustard
- Fix Temporal Duplication description wrong when locked (bug #1473)
- Updated changelog

### 4.01 April Fools!

#### snnw
- Put notifications in front of the beach

#### pickten
- Fix the vault buying issue
- Fix Ooh, Shiny
- Notifsilence rework
- Typos fixed
- Fix some confused code in retroact
- Quick Cleanup (Retro less self-restrictive, polarizer description etc)
- Fix a missing "Wait for it"
- Promote save functions to critical status
- More save types
- Add a toggle to pInsan
- Sokoban -- generation
- "Finish" Sokoban

#### IHaveNoFunnyName

- CDSP downgrade fix
- Typo fix (at least I assume it was a fix)
- Notif log rewrite

#### Pikrass

- Fix parenthesis in Dragon Queen's description
- Fix #1454 (awarding "There are two of them!")
- Fix detecting the '5' key with numpads and azerty leopards
- Allow +10/-10 nest buttons to set the value to maximum / minimum

#### ED

- changelog
- merging
- redundant ball removal from redandancy.js (radical inguinal orchiectomy)

### 4.002

#### pickten
- Fix a Math.random that should have been Math.random()
 * Relating to Two Pots O' Gold badge

#### snnw
- Blitzing lockFunction fix
- z-index for notifications

#### EPSIL0N
- Department reward fixes

#### ED
- Change cdn for jquery-ui for consistency and https
- This file
- Version number


### 4.001 Kitty Genocide Simulator 2015: Goating Intensifies

#### Syntech
- Dragons shouldn't be removed from NPs anymore
 * Technically this went in a hotfix but might as well list it here

#### pickten
- Fixed type mismatch
 * I.e. ED forgot to changed how dates are created in boosts.js to match everywhere else
 * Also was in a hotfix

#### EPSIL0N
- Fix to JD and longpix boosts not being rewarded
 * List of Depardment rewards wasn't being filled out properly
- Monument 0 change from 0 mnp times to 1 mnp
- Unlock repeatable boosts fix (Rob and Vault Keys issue)
- Vaults now award FC to people who have them unlocked even if they spent them all.
- Abbatoir shutter exploit fix.
- Kitkat will now report if a cat is drained in -NP Catpix
- FlipIt was being piggybacked on but doesn't work without atleast one FC.
- Change .making from int to float to capture non-int NP#s

#### ED
- This file
- Version number

### 4.0 Kitty Genocide Simulator 2015

#### erp-lsf
- New Option:
 * Cloud Sync

#### Calamitizer

- New Boosts:
 * Signpost
 * 3D Lens
 * Dimension Shards
 * Anticausal Autoclave
 * Dimension Panes
 * Kitty Catalogue
 * Portable Goalpost
 * Subspatial Plane-Packing
 * Σ-Stacking
 * Glass Ceiling Cat
 * Glass Ceiling Autovator
 * Exit through the Abattoir
 * Fields' Mettle
 * Lifedrain Autowinder
 * Panopticon
 * Never Jam Today
 * Eigenharmonics
 * Plumber's Vise
 * Tractor Beam
 * Leo DiCatrio
- 8 new badges
- Some boost typo fixes
- Some discovery typo fixes
- Changed prize category markup
- "Tangled Tessaract" renamed to "Tangled Tesseract"
- "Loopin Looie" renamed to "Temporal Anchor"
- "Ooo Shiny!" renamed to "Ooh, Shiny!"
- Expando now correctly pins down Badgers and Redunception descriptions, so you can actually read them
- Muse and other boosts now have correct descriptions when they're locked (Muse will no longer crash the game when favorited)
- BOXES BOXES

#### pickten

- Improved IP processing time so that IP could be much larger.
- Minor improvements to FindThings, logicats, and DORD as well.
- Got TaTpix mostly working.
- New Boosts:
 * Five new Stuffs (Blueness, Otherness, Blackness, Whiteness, and Grayness)
 * Argy
 * Blue's Hints
 * Ocean Blue
 * Meteor
 * Improved Scaling
 * Polarizer
 * Robotic Inker
 * Not a Priest
 * Equilibrium Constant
 * Hallowed Ground
 * Photoelectricity
 * Blue Fragment
 * Atomic Pump
 * A Splosion
 * Retroactivity
 * Concentrated Boom
 * Diluted Boom
 * pH
 * pOH
 * pInsanity
- 8 new badges
- 76 new discoveries (for t1i)

#### LuminousLeopards

 * More changes to Dragon hide times
 * Breath combat
 * Added a ceiling to the amount of Bonemeal it's possible to get with Shadow Strike
 * Changes to Annilment so the function doesn't run twice an mNP
 * Draconic Luck is now a thing, it provides a small bonus to lots of stuff
 * Removed def/atk multipliers for Lucky Ring and Anisoptera (these are Wyvern-level boosts so nobody had them yet anyway); added a Breath bonus per level of Anisoptera and a Luck bonus for Lucky Ring
 * Strength Potion no longer a fight option (this was in the code but not actually implemented anyway)
 * Depending on your level of Anisoptera you might find out some interesting things about RedundaKnights
 * Added a fudge factor to sap health from both dragons and RKs if a fight lasts too long (prevents ties)
 * Added a couple tiebreaker fight results just in case
 * Robotic Hatcher still requires Infinite Goats, but no longer starves your dragons.
 * Moved most RDKM information to Stats view. Added some useful information once you get far enough (luck, number/amount of potions)
 * Draconic potions/consumables now each have an active and a passive effect. The passive effect only works if you have at least two of the boost owned.
 * Lowered the ceiling on the number of Trilobites you can get at Wyverns and beyond, for balance purposes
 * You can now get two rewards from a fight if your attack is significantly higher than your defense.
 * New Wyrm boosts: Dragon Drum, Sea Mining
 * New Wyvern boosts: Safety Canary, Autumn of the Matriarch, Dragon Breath, Honor Among Serpents, Golden Bull, Chintzy Tiara, Diamond Dentures, Megan's Quick-Acting, Long Lasting Odorific Breath Spray, Baobab Tree Fort,
 Catalyzer, Way of the Tortoise, Way of the Panther, Tuple or Nothing, Ethyl Alcohol, Clannesque
 
#### EPSIL0N
 * Bug hunting and fixes
 * Rewrote Wisdom of the Ancients. Should be actually carry a worthwhile number between NPs.
 
#### Syntech, Xilwarg
 * Bug hunting and fixes

#### ED
 * Convert time manipulation to use the moment.js library
 * Change start-of-ONG finding code to manipulate time such that DST error don't occur
 * Add tooltips to index
 * Add shameless self-promotion to index
 * Add more names and disclaimers to this README
 
### 3.67 Enough Mustard for a Sandwich

#### stormrunnerz

 - Decrease processing time for each mNP when using favorites

#### dfriedenbach

 - Doublepost stats show progress towards next boost.
 - Add Safety Net counter to Doublepost description.
 - Safety Net power persists through Molpy Down.

#### Pikrass

 - Fix a typo on Between the Cracks' description
 - Fix glass saw's description about the number of blocks created

#### LuminousLeopards

- Changes to Dragon hide times
- Added a variance to Find probability/surviving fights based on attack/defense
- Changed Zookeeper's operation to a function
- CDSP / Panther Rush level clarification
- Check for 0 tools when destroying/building Castles
- Added a limit to This Sucks if WIWTMP > 8 that prevents QQs from being zeroed out.
- Fix borked QQ and FC divisors on previous fix
- New boost Annilment
- New boost Robotic Hatcher
- New boost Shadow Coda
- New boost Ventus Vehemens

### 3.66666 Still Repeating, of course

### 3.6666 Repeating, of course

### 3.6603

#### Waveney
- Magic Letters should be action
- Missing brackets for MouldCost

### 3.6602

#### Waveney
- Bug fixes to the Masterpieces unlocks and Running Factory Automation 0 times

### 3.6601

#### Waveney
- Bug fixes to Magic Letters, Diamond Recycling and one papal boost

### 3.66 - Leap YIP

#### Waveney
- Once you have a large enough Diamond supply there is a Papal Boost for Diamonds
- Papal boost to reduce time to make masterpieces
- The Diamond Masterpiece Cooker burns coal every mNP (originally intended behavior) 
- Small Nerf on Camelflarge (other things will later make up for this)
- New Boost "Magic Letters" will eventually lead to draconic magic
- New Boosts "Dragong", "All Claws on Deck" and "Diamond Recycling" to reduce the pain of masterpiece construction (a bit)
- New Boost Seacoal - improves coal supply
- Fix to prevent Mustard prices causing Greater Mustard

These Changes have been postponed, they are not yet ready, I was going to wait but I needed to get a fix out
- Tweaked a lot of combat numbers - you are more likely to get injured, less likely to lose out right
- If your dragons are offensive, you are more likely to get stuff (but risk injury)
- If your dragons are defensive, you are less likely to get stuff (but less likely to get injured)
- Small Nerf to healing (other things will later make up for this)

#### Epsilon
- Fixs to countdownCMS

### 3.65259636 Anomalistic YIP

#### Waveney
- As Time was awarded the Hugo for best graphic novel in 2013
- A new boost "Hugo" is now available which will improve everymolpies game no matter what stage they are at
- Papal Boost for Gold
- And a fix

### 3.65256363004 Siderial YIP

#### Waveney
- 2 small fixes for GDLP
- Added power level to CDSP description
- Typos changed

### 3.6525 Julian YIP

#### Waveney
- Fix to yesterdays fix on CDSP
- New Boost 'Grouchy Dragon, Leaping Panther' will allow CDSP to be raised beyond the Panther Rush limit, but it is tedious... 
- (Although theoretically you could get it to Infinity - I am not expecting anyone to achieve it through this boost)


### 3.6524219 Tropical YIP

#### Waveney
- Further fix to the logicat scrolling
- 1 other very very very complex bug on logicats that sometimes threw an error
- Fix to CDSP to enable updates after a downgrade

### 3.6521

#### Waveney
- Quick fix to the fix for the logicat scrolling issue

### 3.652

#### Waveney
- From now on, you will get a notification on the ONG, when a new version is available
- Fix to hover text in overview when zoomed in or out
- Fix to Diamond Mould maker to ensue you stay still even though CMS
- Fix dragon fights

#### erp-lsf
- Hopeful fix for the logicat scrolling issue (should have been in the previous version)
- Fix for Favourites Manager Boost

### 3.651

#### Waveney
- Fixed DMP typo
- Lock Cups of Tea and Healing potions on last use
- Many old issues fixed including:
- Improved Free Advice
- Layouts Pane on top of other ordinary panes
- Achronal Dragon now is an action if the next target is ready
- Display of numbers of Crates/Vaults opened (if known)
- Better treatment of Infinities on some Glass boosts
- Time Lord only an Action if it has an action

### 3.65 - YIP

#### Waveney
- New boost Glaciation
- New boost Anisoptera (for Wyverns so you can't get it yet)
- Fix to prevent Infnite Blitzing during Coma Molpy Style
- Added Molpify in a few places
- Added Masterpieces to stats
- Stopped Use of blackprints breaking Constructing from Blackprints unnecessarily
- Archimedes Lever is now toggleable
- Stopped mutiple instances of same masterpiece at different stages of construction


#### erp-lsf
- New Favourites Manager Boost (a gentle fave style tool that works in classic as well as normal)
- Fixed some typos
- Improved the API
- new option when you have scientific notation on, and determines when number will collapse into e-format.

#### Cloudy the Conqueror
- Fixes to Chromatic Heresy, Anisoptera and Configuring Faves
- Added treeishness to Masterpieces and fixed some descriptions

#### EPSILON
- Reflect pyric deaths in total dragons lost

### 3.64

#### Waveney
- Two new boosts Saturnav and Cake
- Dragon Nest shows curent linings when it has eggs within

### 3.6301

#### Waveney
- Do ZeroNilist's edit correctly
- Added warning to Black power if you have Archimedies Lever and don't have Cold Mould active

### 3.63

#### Waveney
- Now with something when you get/view masterpieces (more to come)
- Better/more consistent wording on Muse and the masterpiece maing boosts (thanks ZeroNilist)
- Woolly Jumper reduces the hassle of getting Maps from positive NPs
- Changed bugs and typos

### 3.6202

#### Waveney
- With more fledging again...
- Crunchy with Mustard now does nothing
- The new icons (3.61) might now appear

### 3.6201

#### Waveney
- With fledging again...

### 3.62

#### Waveney
- Confirmation check when you fledge more than one Dragon into an already ocupied NP
- Two new boosts to improve diamond supply
- Topiary now affects both normal and Cryogenic Fledging
- Overview updates after Fledging from Cryo
- Different bugs and typos

### 3.61

#### Waveney (lots of thanks to tyriac)
- Fixed scrolling of the Dragon Overview
- Nerfed Coal Digging
- Shades and Topiary Boosts
- Fixed MeteorONGS when colpix is on
- Fixed Now Where was I and most uses of Time travel
- Removed Mould making buttons when Masterpieces made
- Guidance for Dragon Queen Upgrade
- Fixed Hatchlings stuck at 0mNP
- Fixed many typos
- Improved dragon info accuracy

#### LucidCrux
- More Icons

### 3.6002

#### Waveney (lots of thanks to tyriac)
- Fix misnumbered discovery
- Fix dragon info box for multiple dragons
- Reduce Woolly Jumper notifications
- Fix Broken Rung issue
- Fix classic view overview button toggle
- Fix colourscheme bug
- Several fixes to Muse
- Fix Filling time bug
- Partial fix to Archimedes Lever
- Fixed Error message on burnishing completion
- Fixed bug causing some dragons to go missing on saves
- Fixed bugs with dragon overview when highest NP negative
- Wooly Jumper inactive when layouts not locked

### 3.6001

#### Waveney
- Fix long standing bug causing extra large rewards from digging
- Fix many typos (thanks tyriac)

### 3.6 Lots More Dragon Stuff

#### Waveney
- Smaller save files when you have lots of dragons
- Woolly Jumper works
- Dragon Overview works better, works in classic, works with the light colours
- Dragon Overview has a tooltip showing what the NP is
- Wyrms now possible as third dragon level
- Diamond Masterpieces are now theoretically possible (do tell when you make one) 
- Note there is nothing special when they are made as this is not yet coded
- Removed long standing bugs affecting some early badges
- Time Dialation is toggleable
- Badges can be lost!
- Muse, Black Powder and Time Reaper boosts
- There is an advantage to digging higher NPs
- Mirror Scales, Big Bite, Bigger Byte and Trilobite boosts
- Coal now possible from digging

### 3.5223

#### Waveney
- Sand Numbers every time
- Fix a few missing setting of the Anythng flag (not the anything flag which had no effect)
- Fix for Dragon Overview in your curent NP when it is obtained

### 3.5222

#### Waveney
- Fixed Sand Mould bug
- Speeded the program up by only updating the page when something happens
- The first part of the dragon Overview is opperational, If (and only if) you get the relevant Boost and are in normal mode and operate with the dark scheme.
- It looks awful in the light scheme, and is not yet accessable in classic.
- This was work in progress when I needed to fix the sand mould bug

### 3.5221

#### Waveney
- Fixed Dragon Upgrading

### 3.522

#### Waveney
- Stop experience being mustard

### 3.521

#### Waveney
- The Sand and Glass Mould makers and fillers are now shown in a more logical order
- Experience is only added once per fight.
- Faves should work with Cups of Tea
- It should be better at keeping count of hatchlings
- The Diamond Mould maker is technically buildable now, but can't yet be used
- It should be better at keeping track of the number of boosts
- It will now give a notification if you try and replace a large clutch with a smaller clutch (of the same type)
- Hopefully fewer typos

### 3.52

#### Waveney
- Draconic Experience is now stuff, some boosts will need this to be spent
- You will not get things like Teeth from digging, these will now be fight rewards
- Things like teeth will appear in the shop and have to be bought
- If you have a tooth, when the next one is available the boost will be displayed n the shop
- Reduced the threshold for getting Maps and the number of monuments for getting Maps and the number needed for Lodestone and the Queen
- New 'Hubble Double' boost
- Hatchlings due to fledge withn 500mNP will escape on loading (to reduce save scumming)
- Hatchlings will be ready to fledge 2000mNP after they are fed rather than 2000mNP after hatching.
- The loot search will default to boosts if you don't specify
- The stuff numbers pane can be scrolled
- Draconic fighting has lots of changes, do not assume what used to work for you as the nest lnings will work now.

You cannot currently:

- Progress beyond the second type of Dragon (DragonNewts)
- Have multiple nests (more maps will enable this in the near future)
- Fledge hatchlings in the minus world (this will be quite a long way ahead)
- Use the Dragon Overview Pane - it will provide a simple visual of where your dragons are.  (Started, but not ready)

### 3.5105

#### Waveney
- Return of the description of the robotic feeder missing
- Fix to fledging 
- Fix to a badge
- Fix to Hatchling wordage
- Fix for dragon type names for clutches > 1

### 3.5104

#### Waveney
- Totally screwed up the cap on draconic experience - should have been min not max
- If you have 1G or more experience (due to either the original bug, or my recent error
- It will reset it to 1M*Dragon Queen Level 
- Sorry.

### 3.5103

#### Waveney
- Fixed problem with Ninja Ritual not restarting
- Cap draconic experience (if you expolited the bug in 3.51)
- How big is a clutch
- Allow CDSP upgrades under 100 whatever the PR level

### 3.5102 Less Bugs

#### Waveney
- Fixed mustard if you failed to feed hatchlings
- Fixed a refresh
- Reduced cost of the Dragon Keeping Manual
- Fixed one bug on dragon fights

### 3.5101 Fewer Bugs

#### Waveney
- CDSP Multi- buy should work
- Fights now possible to win

### 3.51 

#### Waveney
- Typos-=some, fixes, tweaks
- Aleph e needs to be enabled to be used
- Prevent buying multiple cheap Dragon Eggs 
- Some nerfing of draconic boosts
- The limits of some things are now lower
- Changed the way Camelflarge works
- Several new Draconic and other boosts one of which is really for the future
- Recalibrated opponents
- CDSP limits and a multibuy
- Note: Still no Progress beyond the second type of Dragon (DragonNewts)

### 3.5005 Fix Five

#### Waveney
- No more object Object dragons

### 3.5004 Fix Math.ceil(Math.PI)

#### Waveney
- Cup of Tea typo, breath typo, Armour typo, limit defaults to 1
- Correct type of dragon displayed in the NP dragons Info
- Cups of Tea and Healing potions should work
- A nerf

#### LucidCrux
- Fix index not showng version and related error
- Fixed a typo

### 3.5003 Fix Math.floor(Math.PI)

#### Waveney
- Fixs for Dragon Upgrade, Armour and Teeth - thanks TFMurphy
- Fix for Temporal rift bug (nothing to do with 3.5) - thanks mart2058
- Fixs to get the right hiding/recovering when appropriate
- Make sure dragon stats are recaculated when needed
- The plural of Tooth is not Tooths
- Missing Refreshes added
- Fixed a bug with Molpying Down and 'The Ritual is Worn out'

### 3.5002 Fix two

#### Waveney
- Fix for the missing discoveries
- Fix for some of the missing refreshes
- Fix for a NaN

### 3.5001 Fix one

#### Waveney
- Fix for the crash because GetBlackPrint returned an invalid boost

### 3.5 - Here Be Dragons

#### Waveney
- Caged logicat single puzzle buy will reapear if no multi buy button shown
- New option to give the minimum number of decimal digits displayed
- Long overdue changes to the top of the ReadMe
- Many bug fixes, tweaks, nerfs and buffs
- Fixed long standing bug that stopped Sand Tools in new games working
- The Fading - New boost from high CDSP (more will follow with higher CDSP)
- Aleph e - Does for Chips/Blocks what Aleph One did for sand and castles
- The Alias for Crouching Dragon, Sleeping Panther is now CDSP not WiseDragon
- Coma Molpy Style now pauses all countdowns
- Lots of behind the sceens dragon stuff, leading to:

- !!! HERE BE DRAGONS !!!

- The Dragon Queen can lay eggs in lined nests, eggs can hatch, need feeding then they fledge
- The Raptorish Dragon Keeping Manual contains a lot of help
- Fledglings need to survive the locals when they are released
- Dragons can then dig for stuff (you might gain the ability to help them, by digging yourself)
- They might find Diamonds...  (And many other types of stuff)
- You can upgrade dragons one level, but not yet all the way
- Redundaknights are nasty dragon hating opponents - you can choose to hide (default, no digging) or fight
- Win or lose a fight you gain experience.  Lose and you may lose dragons.  Win and there will be rewards.
- Note Although the Dragons work with many Infinities, they would work (at lower levels) with only Sand, Castles, Glass Chips and Blocks
- Lots of new Dragon related Boosts (not all of which curently operate)
- Note while you could start making a Diamond Mould Maker, completing is (I think) currently impossble...
- New Pane for the state of the Dragons in the current NP
- Dragon Stats
- New Dragon related Badges (not all of which are currently possible to get)
- Note Export files may be a lot larger when many NPs have dragons
- New Papal Decree for Draconic Experience

You cannot currently:

- Progress beyond the second type of Dragon (DragonNewts)
- Make the Diamond Mould Maker (and the other boosts and monuments that follow)
- Have multiple nests (more maps will enable this in the near future)
- Fledge hatchlings in the minus world (this will be quite a long way ahead)
- Use the Dragon Overview Pane - it will provide a simple visual of where your dragons are.  (Soon)

#### Epsilon
- Several small fixes

### 3.4211

#### Waveney
- A couple of CDSP bugs caused by a global edit that was shouldn't have been

### 3.421 - Wrong order for a Lift off

#### Waveney
- CMNT price reduction (should only take a couple of days to afford now)
- Miscelaneous bugs removed (and probably some added)
- Ensure rate recalculations are made when needed
- More Draconic Foundations (you will still have to wait for it)
- Stuck Time lord fixed
- CDSP downgrade changes and the ability to easily switch between high and low power with one click
- A new badge

#### mart0258
- More silencing
- typos and mustard removed

### 3.4203

#### Waveney
- Speed of light typo
- Downgrade for CDSP without bug
- Nerf so it is very hard to get to Infinite Goats without Centanarian Mutant Ninja Tortoise (it should now behave as intended, not as I originally coded it)
- Badge typos fixed
- Few tweaks
- Hooks for further dranconic developments (you can't get at these yet)

### 3.4202

#### Waveney
- Downgrade for CDSP
- Mega means millions, not 100 thousands
- Generic way to give builds names as well as numbers
- A few tweaks and a very small buff

### 3.4201

#### Waveney
- How did that miss my testing...

### 3.42

#### Waveney
- New Boosts - "What if we tried more power?", "Mutant Tortoise", "Centenarian Mutant Ninja Tortoise"
- Fixed a few things
- New Badges for Ninja Ritual
- Fixed the New Boosts disapearing on upgrading bug (with a lot of help from Guizmus)
- Note this will still happen when you do this upgrade - it is a saving bug from the previous version
- New Beach colour when the NewPixBots are about to actvate (only used when you have Shadow Ninja)
- Saving can now handle arrays
- Fixed Panther Rush limit actions

#### AmauryLepicard
- Added a Clear Log button

#### LucidCrux
- New Icons for boosts
- Glassed Lightning and Lightning Rod changes

### 3.4121

#### Waveney
- Unbroke single logic puzzle

### 3.412

#### Waveney
- Bananananas Boost
- Fixes for very large Logicat Puzzle numbers and other things

#### LucidCrux
- Fixed classic scroll jumping (hopefully)
- Increase classic items per page limit to 3 digits
- Navigation boxes don't refresh if being typed in
- Discoveries and Monuments now included in badge search
- Italian plumber is much cheaper and easier to get, upgrades still cost the same

#### mart0258
- Auto show for new things: Never, Always, Not discoveries
- Silenced a few things
- Logged Flux Harvest
- Notifies about flux crystals from Vaults

### 3.411

#### Waveney
- Fix options bug

### 3.41

#### Waveney
- Fixed Mysterious Maps bug
- Partial solution to NavPane layout on Chrome
- Improve a few things
- Shadow Strike was misbehaving for large numbers of puzzles
- Ninja Tortoise Boost
- Many bugs removed (some probably added)
- Tangled Tessaract Boost
- Limited tool production for high AC when on the inefficient path
- Raptorification of DeMolpify function

#### LucidCrux
- Discoveries and Monuments now sorted by NP number
- Scroll position is (hopefully) kept with repaints
- Fixed tagged loot sort errors
- Fixed auto-use boosts from showing in loot (hopefully caught them all)
- Fixed some boosts not updating until hiding/showing again
- Search may work better

### 3.4005

#### Waveney
- 2 more fixes

#### LucidCrux
- Fixed scrolling/accessing loot bugs
- Fixed load problems for classic users
- other fixes

#### ED
- Fixed a Bug

### 3.4004

#### Waveney
- One more (bug predates 3.4)

### 3.4003

#### Waveney
- Even more fixes for Bugs

### 3.4002

#### Waveney
- More fixes for Bugs

### 3.4001

#### Waveney
- Fixes for Bugs

### 3.4

#### Waveney
- Cress boost for Mustard
- Papal decree for Mustard
- Reduce the number Maps needed for the Dragon Nesting Site
- Raised the costs for The Dragon Nest and Dragon Queen
- LucidCrux's Loot Page and search controls as seperate layoutable panes
- Mustard Tools work again
- Mustard Sale and Injector can now do all tools if you have enough Mustard
- Fix very long standing options default error
- Option for how many ONGs of logs to keep (default 3)
- Time Dilation Boost
- Many minor errors removed (and probably some added)
- Shadow Ninja Boost
- Downgrade for the Italian Plumber
- Some nerfing

#### LucidCrux
- Major Refactor / Redo of the way HTML is generated and div are drawn
- Redundikitties should no longer appear in sections turned off in the section list
- Loot pages
- Loot searching
- Hover is instant
- More random refactoring
- A few new icons

#### ED
- Fixed a bug

### 3.33333

#### LucidCrux
- Fixed two critical kitty bugs one affecting unlocks and another RRSR

#### Waveney
- Fixed one kitty bug

### 3.33332

#### LucidCrux
- RedaCtedredactEdrEdactEdredACteDreDacTedreDacteDrEdactedRedActedreda

#### Waveney
- Fixed Flux Harvest getting infinite Flux crystals WAY too soon
- Finished off creating discoveries up to T** **D
- Several minor bug fixes
- Single use logipuzzle button now disapears after 20 consecutive uses of the multi-buy button

#### JadeE1024
- Redacted Rescue
- Fave updates
- Mustard Automation fix
- Fixed the Jammed Jamming

### 3.33331

#### Waveney
- Fixed error on load for Index and Pure 
- Fixed Panther Rush upgrades to levels 1 and 2
- More Coloured options for decimal numbers
- Stop rifting to Minus until you have chips
- Better Stuff Sorting
- Molpy Down and Coma got lost on Clasic
- Fast Forward bug fix

### 3.3333

#### Waveney
- Refactored the options handling and grouped related options
- Fixed Chateau Bug
- More options for making the decimal parts of numbers clearer
- Option to choose the logicat colour scheme
- Discoveries as Faves work if/when badges are added
- Finally found why logicat needed negative points to go up
- Fireproof now reduces current Jamming
- Lodestone Boost
- Larger upgrades to Panther Rush

#### LucidCrux
- Kite and Key and Lightning in a Bottle can now unlock when 'lightning strikes twice'.
- Bonus for 'lightning strikes twice' now properly includes the Thunderbird bonus and
  has been set to a consistent 10% bonus on top of everything else instead.
- The double strike bonus is capped at 50k without Thunderbird and Temporal Duplication
- Fix rift image flickering
- Fix targeted time travel with mustard castles
- Fix infinite tools producing mustard
- Mustard tools show Mustard per click

#### Bakasan15
- Less intrusive log autoscroll
- Current log button
- Colours in log entries

#### mart0258
- TDE fixes, particularly the 0x multiplier

#### ED
- Started fixing log for classic
- Did some testing
- Refresh boost/badge on class (tag) change, to update faves
- Shadow Feeder only activates a limited number of times per NP (increase with Panther Rush or CDSP) (maybe still too high)
- Vaults can now give flux crystals under the right circumstances!

### 3.3332

#### Waveney
- Changed colours of Logicat Buttons to Greys
- Fixed bugs on Panther Rush and logicats
- Panther Rush Badges
- Option for decimal parts of numbers to be smaller
- Small performance improvement
- Logicats work in Faves and non faves at the same time

#### ED:
- Prevent Glass Ceiling 10 and 11 from being awarded by Logicat until you have Ceiling Broken
- Alias for Chateau
- Fix notification crash when earning badge with description as a function
- Found an oooooold missing linebreak in descripton of cost of buying Sand Refinery

#### LucidCrux
- Rift Fade
- Boost save/load changes
- Glass Ceiling price fix
- More major refactor work (lots and lots of changes and fixes)

#### eqbot
- Fix clicking not turning sand into castles
- Some sand/castles changes using LucidCrux's changes

#### mart0258:
- Date stamp notifications
- Fix blast furnace spam

#### Bakasan15:
- Log split up by ONG (use Back/Forward buttons. With autoscroll enabled, it'll automatically move forward when an ONG happens

### 3.3331

#### Waveney
- Change format of Radio Buttons for Logicats
- Fixed Tool counts after Molpy Down
- Fixed Chip rate calulation

#### LucidCrux:
- Fixed Mustard to 0 when clicking beach
- Rifts now fade over time
- Refactored Badges and Boosts

#### ED:
- Two new timetravel badges

### 3.333

#### Waveney
- Dragon Forge fixes
- Panther Rush unlocks on Logicats only
- Stop Tag changing at high AC level for Shadow Dragon and Caged Logicats
- Flux Harvest notification fix
- Precision loss in Flux Harvest fixed

#### LucidCrux:
- Remove redundant formatting

#### D0rako:
- Automata Control was changing to wrong tag
- Now Where Was I fix
- Dragon Forge description update (I forgot to do that months ago - ED)
- Prevent stretchable storage from untagging so BoF still works on them
- Chip Storage tag fix

#### eqbot
- total castles/sand dug fix

#### ED
- some changelog, version number
- Shadow Feeder was in wrong category

### 3.332

#### LucidCrux:
- fix broken Rift load

#### mart0258:
- Infinite sand -> infinite castles fix (it got disabled unintentionally)
- Automata Control tag fix

### 3.331

#### LucidCrux:
- Something went wrong, should be unwrong now.

### 3.33

#### Waveney:
- Many small fixes for the Pope
- Small fixes for Western Paradox
- Performance improvements for large Logicat rewards
- More Papal Decrees (Logicats, Ninja Stealth, Fractal Sandcastles, Tool Factory, Vacuums)
- (Note due to an error any decree selected prior to this upgrade will be not be selected afterwards)
- Black Hole Boost
- More choice for Dragon Forge Updates to AC
- Overtime Boost
- Several small nerfs
- Sand monument thumbnails only displayed after a mouseover
- Fixes for Infinite Flux Crystals 
- Reduced the start point to get Vacuum Cleaner
- Reduced the Vacuum costs of Panther rush (slightly)
- Allow Mustard or Bonemeal to be used instead of Vacuum for Panther Rush
- Larger Upgrades to This Sucks
- Small Buff Crouching Dragon, Sleeping Panther for high AC values
- Reformatted Logicats to use radio buttons
- Fix for incorrect (low, even negative) boost count
- Fix for thumbnails on sand monuments not being thumbnails

#### D0rako:
- Some boost tag/untag fixes
- Separate Blackprints from Blackprint Plans

#### mart0258:
- MHP result is now logged
- Archimedes won't construct moulds already being filled. 
- Reduce duplicate notifications
- Ensure caged logicat doesn't keep active puzzle on reload

#### LucidCrux:
- Fix Kite and Key, Lightning in a Bottle. They now also refer correctly to Lightning Rod instead of Glassed Lightning.
- Western Paradox does not require Ninja Herder
- New Boosts: Ritual Sacrifice and Ritual Rift
- Panel border fix
- Some code refactoring
- More icons
- More discoveries
- Time rifts are now visible images on pix
- Remove lock button on in-shop ceilings

#### ED:
- Add a few changelog entries, fix version number :P
- My 'Swedish advisor' made another suggestion.
- Merging, some minor fixes such as use of plural()

#### eqbot
- Some code refactoring (pretty important actually - ED)

#### Unponderable
- Flux Crystal notifications

#### mrkeldon
- Boost for auto shadowdragon

#### Dorus 
- Scale TF Load Letter into 10T

#### GeneralYouri
- Log + export being hidden by newpic

### 3.321

#### LucidCrux:
- Fix for Pope QQ
- Fix for Kite and Key

### 3.32

#### Waveney:
- Larger upgrades to Time Lord
- Larger upgrades to Dragon Forge
- A number of small fixes
- Factory Expansion stops at 61 runs unless 'Between the Cracks' or 'Aleph One'
- Option to sort boosts by Price or Name (Not for the tagged items)
- Highest Newpix can be in Minus Worlds
- Western Paradox Boost to increase time before NewPixBots operate
- The Pope - new boost with a choice of small effects
- (BTW The Pope is an OTT reference: The 'pope' is the first poster on a newpage)
- Fertiliser - new boost that can increase a Flux Harvest
- Option for European formatted numbers
- Simplified code for changing tagged states

#### LucidCrux:
- Borders of layout elements can be toggled and have colours changed! (unlock layout, then click the little square in the topleft corner of the panel you want to change)
- Major code reformat
- Lots of work merging in all the changes
- Kite and Key and Lightning in a Bottle boost to store Glassed Lighting % boost
- More new icons
- Linked export buttons

#### snnw:
- some timing fixes to ensure every NP really contains 1000 mNP
- remove top-level vertical scrollbar if page is zoomed out far enough

#### ED:
- fix up some issues with the border colour thing
- Swedish gramma fix (it's still Greek to me)
- Fixed the Stuff Counts and Income Counts to actually use the layout system properly (resizable element has to be separate from the draggable)
- Kept track of the changelog (I hope) and accepted pull requests and updated the version number
- removed an errant space from a description of a new boost

#### Unponderable:
- Notify when you try to use Achronal Dragon but don't have enough glass

#### D0rako:
- Fix to Ninja Ritual

#### AluisioASG:
- Fixed the formatting of basically the entire changelog since 1.0

### 3.31

#### Waveney:
- Safety Net Boost to stop Temporal rifts rifting to shortpix
- Safety Blanket Boost to stop losing longpix only boosts when on shortpix
- Aleph One Boost to allow unlimited Infinite purchases of sand and glass
- This Sucks upgrades actually cost the quoted prices
- Discovery and Monument counts in stats
- Reduction to Italian Plumber Spam
- Upgrades to Italian Plumber
- Valued Customer badge description corrected

#### LucidCrux:
- Lots of new icons!
- Significant changes to icon code to reduce the amount of CSS required (currently breaks the 4 coloured icons)
- LCB typo fix

#### Unponderable:
- Lots of untagging of tagged items which don't need to be tagged

#### ED:
- I didn't really do any programming and I still feel like I'm spending all my free time on this

### 3.301
- LucidCrux: grey versions icons for boosts in shop!! wow! (also some fancy CSS stuff I need to learn)
- mart0258: Flipside fix
- Something new in the Index. It's boring.

### 3.3
- Some description improvements
- Prevent too much panther poking
- Stuff and Income sections by LucidCrux: see your current Stuff amounts all in one handy place, also sand/chip/tool rates and per click
- Stuff section is now dynamically generated from all Stuff boosts that exist (thanks LucidCrux!)
- Void Goat fix - waveney
- Furnace/Blower fix - waveney
- More Time Lord info - waveney
- Rob Refresh fix = waveney
- Archimedes only spends bonemeal if he finds a mould to start
- Restored colouring on upgradable badges (e.g. a Discovery you don't have the Sand Monument of will be yellow)
- Fixed a discovery typo which waveney made :P
- Missing tool refresh in toolfactory

### 3.2994
- Badges can be faves!
- In stats view the alias of boosts and badges is shown. This can be used to refer to it in Shopping Assistant or Faves instead of the full name.
- Time Lord shows remaining jumps (thanks ddrdude/eqbot)

### 3.2993
- Unbroke Vacuum unlock (accidentally replaced the refreshFunction). This hadn't affected functionality except that your vacuum count wasn't visible if you didn't already have vacuum
- Missing parentheses in Panther Rush were making it lock when it shouldn't.
- Notification when a Key tries to buy a Crate/Vault and fails (to prevent empty logicat message)
- Panther Rush was unlocking regardless of blackprints and vacuum.
- Faves refresh on Load and when you make them Visible

### 3.2992
- Vacuum wasn't using Flux Crystals

### 3.2991
- Fix Panther Rush Logicat Level calculation
- tag QQ
- Toggles for Void Starer and Void Vault
- Prevent Ladder sand/mNP mustard
- Why is glass/click worked out twice? That'll need sorting out some time. Anyhow, Bone Clicker now actually really works
- Un-unerfed Void Starer a bit
- Added a new boost which sucks
- Between the Cracks is now a toggle, also it works on checking if you have sand/castles rather than just when buying sand/castles. So now it bypasses Fireproof and Vacuum Cleaner
- waveney's new boost to make obtaining flux crystals easier

### 3.299
- String-based prices were not working right in most cases.
- Vacuum Cleaner was activating at the wrong time so it wasn't letting you get Blitzing from logicats
- Lightning Strikes Twice wasn't refreshing GL or TDE
- Beachball boost adds a purple border for Temporal Rift
- Rosetta now refreshes when you click Start Construction (so having her as a Fave should work)
- Buying a glass boost from Rosetta should now Refresh her also

### 3.298
- Nerf flux crystal-> vacuum some more (also now it needs Qubes because why not?)
- Major nerf to Void Starer (didn't think that through :P)
- Logarithmic price increase for Time Lord upgrades
- Panther Rush price increased now that logicat pays out higher
- Higher Panther Rush has some exotic costs
- I'm feeling super generous so now comic-clicks activate shopping assistant.
- Zookeper implementation made more efficient
- Increased costs of Bags of Something (specifically blackprints)
- Boost to make Vaults relevant again
- If a Blast Furnace run is given out as a fallback reward, a notification is provided (because otherwise it can look like an empty Logicat reward)
- Bag of Jolting was broken all along
- Eww effect didn't match description

### 3.297
- Fix for Vacuum Cleaner unlock so it's available if you already have Magic Mirror
- Button to clear Logicat guesses if you want to start over
- Blackprints' description has a little more info
- Claim inversion is remembered (i.e. the 'not' in puzzles is only randomised once so it doesn't keep changing)
- Nerfed Flux Crystals->Vacuum exchange rate

### 3.296
- Zookeeper description points out the benefit of having over 1K AA runs available for it
- Did something interesting for large numbers of logicat rewards.
- Prevent message spam from Shopping Assistant item (e.g. keys) and prevent switching to the tab of auto-bought items (e.g. crates)
- Magic Mirror unlock fix was actually broken and crashing
- Made Vacuum Cleaner more expensive
- Active puzzle prevents Caged Logicat untagged

### 3.295
- Expando fixed for tools and boosts in shop

### 3.294
- GoatONG was a bit too powerful due to the 'locking it gives 2 prizes which could include itself especially if you savescum' effect.
- Redrawing the boosts (for various occasional reasons) removes the descriptions but it wasn't informing the boosts of this so they weren't redrawing them. (Yeah I should just change it to draw the descriptions when drawing the shop in the first place)

### 3.293
- Mucked around with how hover/refresh work to prevent extra redrawing of Caged Logicat
- Lightning Strikes Twice was (accidentally) capping the Glassed Lightning power to 500!
- Single Caged Logicat puzzle now gives you points (oops) also on answering a puzzle you are shown the number of points awarded.
- Logicat report (correct/incorrect/points) is notified before the rewards (thought it still breaks if you have a LOT of rewards, I'll deal with that later)
- Second Chance not offered if you only answer one question

### 3.292
- Seaish boosts only take 500 purifier/extruder level rather than 1000
- Now Where Was I boost by waveney
- Fix to Rob for Classic by waveney
- Logicat puzzle deducted as soon as you pay for one (so it can't also be used for Shadow Dragon): also waveney
- Castle Tool text clarified (waveney started it but I redid it my way)
- Fast Forward was utterly broken (took you to newpix NaN)
- Getting prizes from locking prizes wasn't taking into account that you might already have some prizes
- Bag of Holding nerfed to only hold 1W of each kind of Stuff. Having additional Bags of Something multiplies this by 1W for each.
- Shadow Dragon shows greedy/generous in bonemeal reward message
- Ninja Lockdown prevents Impervious Ninja from being given when enabled
- Factory Automation costs are not increased if you don't have AA (important for Bag of Moulding)
- WotA stats has more text.
- Magic Mirror is now unlocked when you activate the Camera if you currently have 10 or more Minus Discoveries (rather than keeping a counter of how many minus discoveries have been made)
- Hall of Mirrors mentions change to MHP cost
- Major Logicat Puzzle change: puzzles are guaranteed solvable, you can answer any number of questions you like (including none) and are rewarded based on the difference between the number of correct and incorrect answers.
- Lower reward and higher penalty on the second chance. Second chance is offered if you have at least 1 incorrect answer, but is optional (you are informed how many are incorrect)
- New option of combining some multiple of 10 puzzles together to save time (e.g. if you have 51 to 60 puzzles available you may pay for 50 puzzles answer a puzzle, and get 50 times the reward or penalty)
- Puzzles are possibly a little less interesting though: statements are made up of less parts (1 or sometimes 2, but no triples. I'll probably work on that, and add 'implies' at some point.)
- Unlock Buzz Saw if you already have infinite glass
- Added a way to avoid infinite sand (to allow blizting) when you have an infinite sand dig rate)
- Lightning Strikes Twice used to boost the power of Glassed Lightning but I changed it to boost the countdown a while ago. Now it does *both*
- Added a use for vacuum: getting more blackprints
- Recycling Beanies wasn't refreshing on upgrade.
- Glass Saw didn't refresh on use
- Prevent Zookeeper from refreshing Caged Logicat while it is displaying a puzzle
- Buffed Glass Saw a lot
- Notification about awarding Temporal Duplication wasn't accounting for owning Temporal Duplication because it was bought *after* it was described
- Changed Dragon Forge rounding so you'll get a minimum 0.04x rather than 0x duplication multiplier without a charged Lightning Rod

### 3.291
- The Autoscroll option was not added to Classic
- Changed Autoscroll option to say "Autoscroll Log"
- Price Protection logic was wrong for boosts

### 3.29
- Fix shopping assistant for tools
- Some Prizes
- A little work on DQ but won't be ready for quite a while
- Dragon Forge wasn't refreshed when upgrading with it
- Unlock Buzz Saw if you have infinite glass storage space
- Some changes to help prevent being stuck showing the wrong NewPix (from Glass Monuments) which in some cases was causing stuff to be flipped (for Minus) when it oughtn't be
- Made Time Lord more expensive due to complaints about it being too useful or something
- Log Autoscroll by AmauryLepicard, with option

### 3.289
- Reduced Ninja Herder requirement (shouldn't have been so high)
- Reduced Panther Rush cost (it's linear now rather than exponential)
- Buzz Saw to make your Glass Sawing easier (well, mine. because I'm bored of it)

### 3.288
- Added a little info to GL stats
- Handle Meteorpix
- Plural Flux Crystals in description
- Blackprints have a cost so they aren't treated as a temp boost (which caused the first map to become mustard instead)
- Negative map targets now persist
- New prizes
- Fixed some accidental references to Temporal Duplication which should have been TDE

### 3.287
- More Time Lord fix: it's now a boost that you can level up to do more jumping per ONG!
- Ninja Lockdown is now styled as a Toggle because it is.
- Another boost to help get goats and a related badge

### 3.286
- negative tools were causing infinite loops on factory automation and price calculation
- on loading prevent negative tools also

### 3.285
- This fixes crate keys. Because of weird reasons.

### 3.2842
- Fix Caged Logicat purchase

### 3.2841
- Finally fixed the old problem of showing the loot section of boosts which were bought and immediately locked

### 3.284
- Zookeeper was broken

### 3.283
- So basically I forgot to change the DoRD and Logicat rewards to check whether boosts cost anything using the new pricing system.
- Also some prices were manually set using the old system (navcode and ceilings 10 and 11)

### 3.282
- glassfix

### 3.281
- Some prices went missing
- GoatONG wasn't working
- That's all I have time to fix right now :(

### 3.28
- waveney fixed glass storage (which he also broke)
- I hadn't quite fixed shopping assistant for aliased boosts.
- Redid boost pricing! Fortunately I'd already done half the work with prize level costs
- Prices show stuff in the correct order (it was "stuff number and" rather than "and number stuff" :P (though I switched to + rather than and)
- Added a way to get goats: by ninjaing!
- Prevent MHP buttons from getting into the log
- TFLL's unlock condition removed but now it costs TF chips (yay new pricing system!)
- Prizes give prizes when locked (i.e. using singleuse prizes!)

### 3.278
- Refresh WWB
- Now you can Break the Mould from a Mould Maker even when construction is finished, in case things get weirdly stuck.
- Fixed some Molpy Down bugs
- Price protection purchase *always* crashed

### 3.2771
- Unbroke Achronal Dragon (oops that was a simple silly mistake which I should have spotted but didn't test because it was 'so simple' :(

### 3.277
- Prevent Time Lord
- Some waveney Rob fixes
- Technicolour Dream Cat now has a wider-reaching effect

### 3.276
- Finally got Panther Rush to behave itself. Also messed around with costs a bit.
- Mucked around with how Prizes work: the tiers are clearly separated and you need to get a new Bag to progress from tier to tier.

### 3.275
- Switching Glass Furnace broke the Molpy.IsEnabled function
- Made Panther Rush cheaper for faster logicat progression
- some refinery/chiller description cleanup
- Logicat level is formatted in Logicat description
- Changed the way maps work: you need 300 glass monuments to get the first map, and 5 more glass monuments to decypher each subsequent map. So you'll still end up needing most of the current available glass monuments to get 100 maps but you can start getting maps a lot sooner and then push forward NewPix to get at more maps.
- Some new prizes
- Mustard Sale unlock condition was still wrong
- Prize section visiblity wasn't being saved

### 3.274
- Break the Mould unlocks quicker: it wasn't counting the amount of factory automation you had and was just counting a fail once per machine per run.
- Countdowns are loaded as a float rather than an int (why didn't waveny fix that with the other things a month ago?? Probably didn't expect me to get crazy with the Temporal Duplication countdown)
- Hall of Mirrors is now a toggle (and it'll be off if you already have it but it defaults to on when you buy it) (toggling costs a goat to discourage from toggling it off before buying MHP and then on again after you've bought it)
- Temporal Duplication factor negative fix, and formula fix
- Glass Storages now offer machine purchases when you have infinite (important after Molpy Down) (oops!)
- Shopping Assistant would seem to work for boosts with an alias but it wouldn't actually buy. Fixed now.
- Waveney's robotic shopper thing maybe works?

### 3.273
- Castle destruction has been completely wrong for several versions, how did no one notice until recently?

## 3.272
- Molpy Down boosts (aka prizes) were too slow to get
- Prizes group actually shows up (oops)
- Some new prizes
- Prize stats text added
- CD,SP's influence on the maximum logicat puzzle number is now multiplied by the Panther Rush level (so the 100 puzzle requirement for Shadow Dragon is less ridiculously high now)
- Improve Automata Assemble description
- Boosts and Badges with no icon of their own use the icon of the group
- Typos can be applied before a < now (rather than avoiding strings with them entirely) so it should be a bit easier to go for the badge now
- Added a way to reset mustard tools. Also mustard tools are prevented from mustarding the sand-click-dig rate
- Glass Saw was fixed but the code to unstick people stuck by the bug was in the wrong place. That's been fixed now but also a hopefully useful value for Glass Saw has been guessed so they don't have to start at 1 and click many thousands of times achieving nothing to get it back to a useful power again

### 3.2711
- Fixed Glass Saw

### 3.271
- Missed Nest condition
- Previous nerfing wasn't quite enough
- Making glass blocks now destroys the chips which subtracts from the amount of chips gained so it reports gains accurately
- Production Control is now set to its maximum if have Nope! once you buy it after Molpy Down

### 3.27
- Infinite Saw rename fix
- New mustard badge
- Fixed an infinite loop
- Added mustard
- Boosts that raise a tool's outputs based on the number you have of another tool are now capped at 8000 tools. Except Bacon.
- Added a few dragon things. And something mysterious.
- Added a few new boosts that are kinda tricky to get because they involve Molpy Down and Bag of Holding...

### 3.265
- Prevent Magic Mirror from letting you jump to where you are
- Blackprints' Has check was failing if there was no next blackprint subject
- Fixed a toolfactory mustard issue.
- Warn about the 400 goat requirement for BoH
- When constructing from blackprints, do nothing if the subject is missing (so if you sell your goats while making BoH it'll just stall rather than continue and fail)
- Free Advice shows Lucky Twin unlock progress
- Some refactoring for whether boosts are enabled, so make it easier in the future to change visual style for enabled vs disabled boosts in a universal fashion
- Discoveries and Sand Monuments now hide their Make buttons when the monument is being filled (also they refresh straight away to ensure the description redraws)
- New Dragon to ease the drudgery of mould related tasks
- Goat unlocks were broken
- Navcode bots-destroyed message lacked numeric formatting (because it used to be for 30 max)

### 3.264
- Missing parentheses in WotA

### 3.263
- So I was right when I suspected I would miss something when I copied the glass extruder downgrade code to sand refinery
- Put a lower limit on WotA

### 3.262
- Prevent mustard Flag sand rate when you have infinite waves
- Suppress SGC message if you have infinite blocks

### 3.261
- Fixed some backwards logic (dragon forge, glass saw)
- New boost had a crash bug
- Prevent blackprint construction from reporting using negative FA runs
- Prevent Glassed Lightning from having over 500 countdown (also done on upgrade)

### 3.26
- Moved logicat levels to the new system so spending/gaining them is simpler code-wise
- Waveney's latest bunch of discoveries
- Constructing from Blackprints capped at 400 FA runs until you have Automata Engineers
- Figured out and fixed Temporal Duplication: removed the 'fix temp boosts stuck at 0' code :P
- I'd forgotten that Temp Boosts mean that html can get typos in it. So now any string with a < in it won't get typo'd (fixes weirdness like stuck strikethroughs in log)
- Some Dragon Foundry and Thunderbird nerfs
- Finally implemented Shadow Dragon to take care of extra logicat puzzles you have no use for
- Bag of Holding now costs to use!!
- Fixed some silliness that was causing the wrong Blackprints message to be shown in some cases
- More infinite glass issues
- Option descriptions were refreshing whenever tools were bought, which I think was causing some weirdness (colourscheme toggle was hard to click)
- Toggling No Sell updates faves
- Some stuff to help with infinite glass mustard, including glass saw, tool factory, and refinery/chiller fixes

### 3.251
- Fixed Monty Haul Problem's Goat[s] usage
- Put in a fix to ensure you get Château d'If if you have the Unreachable? Badge (which has the side effect of giving you Château d'If back when you Molpy down, which is okay I guess)
- I had put in one too many >0 for temp boost countdowns when I fixed it before, so people with negative were still stuck negative.
- Temporal Duplication warns that it's about to run out even if the countdown is not an integer
- Infinite block production prevented from mustarding chip storage: and if you have infinite blocks it doesn't bother making "more"
- TF counts toggle button always visible in Layout mode
- In NP 2101

### 3.25
- Badge clarification (Typo Storm)
- Advanced temporal duplication now applies to normal tool purchases
- Temporal Duplication now shows the multiplication factor, and countdown is formatted a bit nicer
- Gave TD a badge too
- Refactored add/spend/has chips/blocks/goats functions to make a generic resource system, in preparation for a generic price system
- Coma and Load weren't clearing the group toggle boxes
- Sand and Castles are unlockable... for what they're worth (which is nothing)
- Reduced minimum resizable size
- Ensured spending infinite glass won't result in mustard
- Made a boost costing infinite blocks
- Added a couple new boost categories, though one is still empty
- If you want a Fave for sand or castles, you can. Dunno why you would though. They exist more for implementation reasons than to be useful
- I think there was something else but I've forgotten. Oh yeah the amount of factory automation needed for blackprint-construction now scales.
- Fixed some Tool Factory Chips mustard caused by infinite tools (lots of 0*infinity and infinity/infinity)
- Also fixed for glass furnace+blower sand usage (infinity/infinity in that case)

### 3.244
- Find+Replace in All Opened Documents: Y U FAIL?

### 3.243
- More Refresh
- Countdown code for boosts assumed countdown was an integer which would reach 0 exactly. This is no longer true for Temporal Duplication
- Toned down colours a bit
- Prevent refreshing a fave from making it sometimes draggable when it shouldn't be
- When loading a layout without faves, avoid getting stuck with just 1 fave.
- Now allow up to 40 faves.
- Temporal Duplication not available so early now

### 3.242
- Advanced Temporal Duplication wasn't actually making more duplicates
- SGC should now do Stretchable Storage stuff
- Toggling stats view redraws faves
- IE running locally thought it supported localStorage when it didn't, preventing run
- New Flux related boost
- Tool rates for sand and glass are shown with more decimal places if <10
- Refresh a lot of boosts that weren't being refreshed. (for Faves)
- Fixed a bunch of places that were still altering glass amounts directly rather than using the functions (thus not refreshing)

### 3.241
- Prevent Faves that should be hidden from becoming unhidden (just had to move a line into a different function)
- Wasn't taking Layouts from cookie when loading if localstorage available but empty: instead loaded no layout.

### 3.24
- Redundakitty chain variables were not initialised to 0: showed up as mustard on a new game.
- Detect html5localstorage
- Save game to localStorage if it's present, otherwise use cookies
- Load from localStorage if it's present, otherwise load from cookies
- Save/load layouts using localStorage
- When saving to localStorage, remove the 2 layouts limit. Also save the ID of the selected layout rather than always defaulting to the first one
- Classic was missing the autosavelayout option, so I copied it over (I said Classic would be missing new features!)
- Made Fireproof "better"
- Moved scrumptious donuts, made them seaish
- Schrödinger's Gingercat produces a relevant amount of glass rather than a negligible amount
- Ensure View pane is visible if you go to Layout after using Classic
- Favourites. Still has a few width-related glitches on boosts that lock and reunlock, but it works pretty well for most stuff.
- Un-broke classic: looks like I somehow deleted a critical line.

### 3.234
- Missed flagging some temp boosts: nav code and the glass switching statuses. (Now they should unstick if stuck)
- Wasn't saving or loading the autosavelayouts option value
- When loading in Classic, set up the correct panel visibility, so you don't get missing panels, or messy overflows as the Comic and Options and Stats and Export all try to draw at the same time
- Typos now work in Minus
- Added Beret Guy

### 3.233
- Fixed temp boosts on loading: it was using the start rather than current values of power and countdown because of another change I made to allegedly make testing easier for myself. Riiiight.
- Finished Dragon Foundry
- Ensure recovery of any stuck boosts
- Minus Sand Monument images show up

### 3.232
- Forgot to add a Refresh() method to Badges, which broke timetravel to/from NP with discoveries.
- Refresh Production Control and Automata Control when glass levels change (and PC when PC changes!)
- Some tool rate badges
- Some dragon boosts
- Light is now the default colour scheme

### 3.231
- Timetravel wasn't refreshing discoveries (i.e. the jump button)
- Memory warping has a (small) chance of temporal invasion
- Changed Dragon Wisdom again (now it lets you get Panther Poke with a higher number of remaining Caged Logicat questions, so you can store up more with Zookeeper)
- Caged Logicat shows Zookeeper progress, and updates if you're using Expando
- On the ONG, Caged Logicat puzzles only resets to 10 remaining if you have less than 10.
- Achronal Dragon only shows 1 tool at at time, with a button to advance through the tools.
- Telling boosts to redraw won't expand them if they're not already visible
- Redraw ALL the main 8 glass boosts whenever glass is added or spent

### 3.23
- Mustard sand rate turns to 0
- Notify when sand rate drops to 0
- Dragon Forge blackprint cost was showing up as half of the correct value because I forgot AC costs 2 per level
- When you have No Need to be Neat, the amout bought of tools doesn't reset, so you can see all the tools immediately, rather than possibly having a lot of a tool which isn't yet visible
- Tagged boosts don't show the tagged loot section when bought if their group section is visible
- In classic mode, the sand/castles numbers box wasn't being unhidden if you Molpy Down
- Fixed index page to show version number and correct colour scheme from your save
- Hilarious new badge by waveney
- **Only saves first two layouts** to try to help prevent cookie too long until that's fixed. You can create and export more layouts but only two will save. If you want to rely on 'temporary' then only have 1 other layout. When you save layouts there will be a warning message informing you of how many were not saved.

### 3.221
- Fixed options not refrshing on page Refresh
- Stats should update regardless of whether the stats selector panel is visible (you still need to toggle that to go in and out of stats view for boosts and tools... maybe I should make that a separate option. But not right now.)
- Prevented layout pane from trying (and failing) to redraw in classic

### 3.22
- Classic layout in classic.html
- Loot visibility in classic works as it used to (if you save, then change what loot categories are visible, then load, it returns to how it was saved)
- BTW if any panes are missing in classic you'll need to go into the regular page and toggle them to visible and save that to the first layout
- Tool Factory data replaces sand/castle counts if you have tool factory and infinite numbers. If you have some finite numbers, the Version box gets bumped

### 3.211
- Alerts pane placeholder text
- Stats wasn't refreshing stuff when hidden (I only had a function trigger on showing panels, not hide)

### 3.21
- Fixed Coma Molpy Style (oops I had just started debugging that when I got distracted by an Expando issue and forgot to fix it before 3.2)
- Reduced newpix bounce to stay in the bounds of the box
- Fixed Caged Logicat to display actual number of questions left (sorry I should have checked Waveney's code)
- Put Achronal Dragon in the correct group
- Removed borders when the layout is locked (I'll make a way to have that togglable, but not right now)
- Prevent Bag Burning from force-molpifying the stats numbers: it used to be necessary to be readable but now it isn't
- Having Temporal Rift prevents you from getting new Caged Logicat questions on the ONG
- Instead of Tool Factory ownership controlling the TF Counts Pane, it controls visibility of the button to toggle the TF Counts Pane
- When unlocks are checked the options pane is refreshed, so when a new option is unlocked it appears immediately rather than requiring the options to be opened again.
- Unlocking the Layout prevents Click-digging. (But not the other ways)
- Default layout a bit less ugly
- Added a second default layout which can be accessed via Import New and typing 'default2'
- Yes there's still more fixed to be made but I think this is good for a first batch

### 3.2
- Glass Ceilings are their own boost group
- Also a Draconic boost group (even though the dragons are currently terrible)
- Dragon unlocks were checking if the potential reward was owned rather than unlocked, which was silly.
- Dragon Changes (hopefully should make them more useful)
- NaN (mustard) Time Travel price is autocorrected to Infinity
- waveney did a bunch of stuff: fix Discov Detector for Minus, fixed jump pricing for Minus travel, Magic Mirror and Locked Vaults
- Added a new absolutely free boost because I'm so generous
- Added a badge. You probably don't want it
- Boost to start making Molpy Down a little more interesting and less painful in the later game (there will be more...)
- Fix Swim Between the Flags bug (modulus operator can have a negative result)
- Add jQuery-UI (not latest version because it has a bug with draggable stuff and the scrollbar)
- Make lots of elements draggable and some resizable
- Flatten HTML hierarchy since it's not necessary for layout now
- Options/Stats/Export can be toggled on and off independently rather than replacing each other
- Added missing linebreaks in Mould fillers
- More items can be hidden
- Moving items to the right or bottom automatically scrolls the viewport
- Default layout
- Added a pane for offsite links, copied the links from the index to it.
- Added a new link to index
- Everything but the newpix is hidden until the layout loads, so you don't see an ugly mess (especially if your browser asks confirmation before running javascript)
- Split the stats tabs into separate panels
- Button to lock/unlock the layout, it's locked by default
- When layout is unlocked, you can toggle Snap to Panes and Snap to Grid
- Buttons for managing layouts: activate, rename, clone, overwrite, export, delete.
- You can't delete the active layout
- Toggling visibility of panels immediately affects the active layout. Moving or resizing an element does not affect a layout at all.
- Overwrite will store the positions, sizes, and visibility of everything in that layout
- the Load/Save Layouts buttons store all the current layout values in cookies. (If you have moved any panes and not used Overwrite, those changes aren't saved)
- When you load layouts, the top layout is automatically activated
- By default, layouts are automatically saved when you save your game.
- There's an option to not automatically save layouts, or to save layouts when the game autosaves (it still won't automatically Overwrite current positions/sizes into a layout)
- The Autosave Option boost now unlocks after 5 saves rather than 20
- You can get back the default layout (if you want it for some reason :P) by typing the word "default" into the Import New dialog, instead of a layout code
- BTW, layouts are exported individually so you can share individual layouts as you wish. Also they're not encoded so you can easily edit them externally if you want
- When you save layouts, the current screen layout is saved as 'temporary' and added to the end of the layouts list, in case you didn't Overwrite
- Notifications are not affected by scrollbar!

### 3.19
- Glass Monuments no longer tease that there's something to get after them, because it's not available yet so implying that there is something that players can't get yet would be mean so I'm not doing that any more :P
- Split code into separate files finally!

### 3.1898
- I misplaced a <20 when I put abs() around the newpixnumber everywhere... which made the maximum JDip level 0. oops.
- Un-broke index page (oi, waveney!)

### 3.1897
- Load and Import clear the log
- Molpy Down accounts for startPower of Boosts being a function (sorry that was breaking saves)
- Buff Panther Glaze x10
- Make np-based Badges which have upgrades to be built, more obvious. (includes a fallback if you have chromatic heresy off)
- Hide glass per mNP stats if you don't have AA

### 3.1896
- rogue semicolon in the GlassChillerIncrement function

### 3.1895
- Needed more abs (forgot I was using pow in some cases)
- Safety Pumpkin's stats were out of date (now moved to Safety Goggles)
- Fixed waveney's spelling of Furnace (I've made the same typo myself a lot :P)
- Added way to get Ninja Shortcomings if it was missed before the big Ninja Stealth multipliers

### 3.1894
- Some fixes and new discoveries from waveney
- Gave the abs a workout
- Found new badge

### 3.1893
- I forgot something.
- Update the descriptions too.

### 3.1892
- Nerf Castle Crush (wondered when that would get noticed :P)
- Plug Temporal Rift hole
- Glass Monument fix (wasn't setting previewNP back to 0 in one case)
- A few new discoveries and a badge
- Fiddled with MHP a little but don't think I fixed whatever's messing up the price displace for some :(
- I forgot something.

### 3.1891
- Negative chips fix, new badge, glass production stats - waveney
- Glass production stats take Furnace Crossfeed/Multitasking into account
- New Boost for those who forget to operate their camera

### 3.189
- Free Advice conditional advice fix
- Changed Imprevious Ninja to use Ninja Forgiveness instead of a countdown timer. Also it costs 1% of your Glass Chips in storage (minimum cost is 100 chips)

### 3.1881
- Fix panther salve toggle - it wasn't generic after all.

### 3.188
- Shopping Assistant tells you when you select an item which you already bought
- Unflipped some important lines in MHP Goat

### 3.1871
- Missed a . because HAAAAAAAAANDS (this is github's fault for complicated reasons I won't get into)
- So, how about capitalising a critical new function... and then not?
- Funny how both problems were caused by me modifying waveney's code :P I guess I shouldn't.

### 3.187
- Small buff from Panther Rush to Panther Poke
- Fixed out of control MHP pricing (multiply instead of a divide)
- Waveney's stretchable glass storage (heh, I actually need that in-game right now!)
- Apostrophe missing from a discovery (waveney fixing his own problem :P)
- Redundancy Removal: All the simple toggle boosts use the same toggle function now (rather than copypaste with names changed)
- Aliased Glass Chip Storage and Glass Block Storage to GlassChips and GlassBlocks to make the code shorter
- Hall of Mirrors boost (guess what that does!)
- Prevent Hauling of fractional castles
- Ensure Glass Saw can't leave your chip balance negative

### 3.1863
- Wasn't using the alias for the cards everywhere (ACTUALLY fixes gold and silver card)

### 3.1862
- Alias, not Aka! (fixes gold and silver card)

### 3.1861
- Math, it needs a capital letter!

### 3.186
- Such Glass fix - waveney
- Seaish Upgrade 100% sand usage prevented - waveney
- Goat badge was mispelled
- Renamed MHP upon TFMurphy's suggestion
- Fixed goat icon
- Price Protection wait time is configurable
- Keygrinder icon fix
- Dragon Wisdom typo fix (thanks again TFMurphy)
- Improved discounts from ASHF are now boosts that are available from the Department after you earn the corresponding badges

### 3.185
- I can't even rename a variable without messing up, sorry waveney
- messed around with some boost unlock conditions
- new badge

### 3.184
- More accurately determine user activity and bounce rate (don't count first 5 badges, and automatic stuff isn't counted as interaction so idlers aren't counted as active)
- Track buy/sell of tools
- Track upgrade/downgrade boosts
- Free Advice tells you how to get Sand/Castles to Glass, once you get Tool Factory
- Renamed anything with threshhold to threshold
- Shoutout to bay12forums: Just noticed some active visitors from there. I like to read stuff there on occasion (Battlefailed Saga!)
- Line on AA description about how it stops glass-gain messages since that would be spammy otherwise
- Removed Double or Nothing forever
- waveney's thing for supressing tiny glass notifications (changed to use a variable rather than literals, so it's easier to tweak if necessary)
- Didn't upgrade the PC upgrade limit because I don't want to.

### 3.183
- Making the Discoveries category use the appropriate icon slipped my mind, again
- Missing icon
- Inverted statements
- Recycling Beanies hint if you don't have enough BBs

### 3.182
- Typo fixes from waveney (SGR, MMolpy)
- Badge by waveney
- Got lost reading TVTropes, sorry. Guess I better push these bugfixes, but first:
- When you have Panther Glaze, the descriptions of the boosts it modified show how many glass chips they produce

### 3.181
- Factory Automation description changed to stop people asking how to upgrade it again after they temporal rift :P
- Fixed some transparency stupidity (btw yes if there's a lot of notifications on the screen, some will not go transparent at all until the others have vanished)
- Added an explanatory note to Bag Burning so people don't think it's broken and "fix" it with the console. *ahem*

### 3.18
- Lots more icons from BlitzGirl
- Temporal Rift fixed for infinite castles, like Molpy Down
- New Ninja boost
- Nerfed Fireproof a bit
- Some Not Lucky boost description changes (regarding not costing glass if you have infinite castles)
- Read TVTropes a lot
- Glass Tools now show glass stats instead of sand/castle stats when appropriate
- When building 0 castles, a castle multiplier of infinity (from flux surge?) will now result in 0 rather than mustard (NaN)

### 3.17
- Messed with chance of intruder bots in a certain circumstance...
- When loading, if highest NP visited is missing, using the current NewPix number
- When you have Bacon, Bag Burning is locked if you pass its threshold, so millions of bags are not continually burned pointlessly forever
- A boost for NewPixBots, related to the above item.
- If a spendable value gets to negative (i.e. number of glass blocks), you can now still buy stuff that costs 0 of that.
- This particularly fixes weirdness such as ASHF landing in the shop rather than in loot (because they still count as being bought for 0 because reasons)
- Fixed Furnace Multitasking description (thanks for pointing that out eldercain)
- Fixed a Logicat power bug in Dragon Forge (I can hardly believe I wrote that sentence and it means something)
- Finished the other new dragon
- Added some redundancy (it's been a while)

### 3.16
- New Boost Icons from BlitzGirl! (mostly tagged boosts)
- Zero more potential mustard (NaN) when loading
- Beachball Boost doesn't show ninja warning after you've ninja'd
- Redunception doesn't notify if Expando is active
- Automata Control optimised when you have all glass tools: no need to make tools that are about to be spent
- Sand particles don't need transparency
- Don't mess with transparency of more than 8 notifications
- Fixed a discovery on wrong NP
- When you Molpy Down with infinite castles, totalCastlesDown is set to Number.MAX_VALUE (previously it was unchanged if infinite castles) thanks EPSILON of DashNet IRC
- Chromatic Heresy is related to 'hue', right? ;)
- Formatting of negative decimal numbers was horribly broken. Not that there should be negative numbers, but now if there is, they're the right negative numbers!
- Remove spaces from tool icon IDs
- New Tool Icons also from BlitzGirl! Yay!!
- Constructing from Blackprints now does nothing if you somehow end up with less pages then needed
- Two new Tool boosts. (What is Friendship? Why does the hotdog not have any wolpeys?)
- Another Dragon, plus one not finished yet

### 3.153
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

### 3.152
- Allowed much higher production control

### 3.151
- Missed buckets in my phone-only mustard sand-tool-rate fix, which cost me a factory automation run because I had no sand unexpectedly

### 3.15
- Bunch of numbers in the save were being parsed as ints instead of floats, leading to problems now that the numbers are large enough
- In particular, glass storage sizes, but temporal duplicates were now able to go wrong too, and the number of active bots, and a few other things
- Thanks for doing that for me waveney :D

### 3.143
- Okay so the problem was that on my phone, javascript likes to think that Math.pow() should return 0 instead of Infinity for very large exponents
- And it was fine for castle tools since I was shortcutting their prices to infinity already. So now I'm doing that for sand tools also

### 3.142
- Messing with order of multiplication of sand tool rate multipliers, returning early for infinities, might fix the NaNs that only show up on my phone

### 3.1416
- Handle weird case where Constructing from Blackprints is constructing nothing (I don't even)
- Locked Crate reward no longer uses a loop to expand block storage. That was stupid
- Negative message on Discovery Detector (thanks waveney)
- New dragon
- Finally remembered to put jQuery.js back on the index page

### 3.1415
- Disabled the jQuery preload of next newpix because it was not working and was spitting out errors for some
- faster seaish (big) upgrades of Sand Purifier and Glass Extruder (waveney)
- Redundatracking, and some tracking bugfixes
- Beachball boost fix: ensure change to blue is after bots have activated
- Sawtracking

### 3.141
- Tracking update: convert integers to strings
- Less hovering

### 3.14
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

### 3.13
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

### 3.12
- I removed the molpies and grapevines from the wrong place
- The previous Tool Factory changes broke Tool Factory (and all your tools) if you didn't have Tool Factory
- If you don't have an earlier save, sorry but your tools are gone and I can't get them back. If you remember how many you had, feel free to edit them back in
- Also suggest suitable punishments for me
- So yeah I should test what happens if you *don't* have features that I'm changing as well as if you do.

### 3.11
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

### 3.1
- Fixed index to accept title change
- Panther Rush description improved so players don't expect to see it in their Loot
- Fixed castle display so it shows "1 castle" for that first castle rather than "1 castles"
- Molpify Ninja Stealth Build amount
- Truncate scientific notation numbers to 6 decimal places
- Boots typo
- Coloured border was not removed when loading a save with Beachball boost disabled
- Fixed another Beach CSS problem: turned out all the recent issues there were caused by using .background instead of .backgroundImage
- A couple new Glass Tool boosts

### 3.09
- If Locked Crate prices is mustarded, it becomes free (apart from the glass). Sorry I thought that couldn't happen in the wild.
- And a Badge because why not?
- More of Waveney's Discoveries
- Removed all the upgrade code for versions less than 2.1 because I doubt anyone is running those. If so, let me know and don't upgrade until I put it back.
- Showing full numbers in scientific notation instead of the shortened numbers is now a separate option rather than based on being in stats view
- Toggling Stats wasn't redrawing Badges
- Added Mushrooms as a counterpart to Badgers

### 3.08
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

### 3.07
- Moved AdjustFade so it's accessible to the index page (so the version number shows up again)
- Changed Locksmith to Mysterious Representations, which produces pages directly.
- Removed Zookeeper notification (just wait for Caged Logicat to show up)
- Track redundakitty chains, added a badge and a stat
- Actually fixed Overcompensating
- If Panther Rush is stuck in Loot from earlier bug, run its buy function to fix

### 3.06
- On buying a Crate Key, it will try to buy Locked Crate before using up the key making the Crate cheaper (so the key will be used to remove a lock, when it previously it was wasted)
- Added stats view for Trebuchet Pong, Grapevine, Ch*rpies, and Facebugs
- Beachball
- Exponential boosts now say "boosts by x% cumulatively per thing" to distinguish them from linear increases
- Wasn't Molpifying the division numbers for sand purifier or glass extruder

### 3.05
- Fixed Expando/Glass Monument interaction

### 3.04
- Prevent Locksmith from awarding ASHF when you already have it
- Overcompensating's buff wasn't applied to saves which already had Overcompensating owned
- Fix panther rush on-buy crash (fortunately it was in calculating the levels so it didn't waste any levels)
- Nerfed Locksmith a bit (even though it wasn't any more powerful than AA was previously if you knew how to leverage it...)
- Crate key message improved and not shown if from locksmith
- Boost unlock/lock/describe messages supressed from locksmith/zookeeper: just 1 message to show that one/both activated
- Disabled Expando because it's causing problems and I don't have time to fix it properly right now, sorry
- Glass Saw is a toggle now
- Molpy Down refreshes the Options

### 3.03
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

### 3.021
- Was missing a return so the castle tool price calc was still horribly slow

### 3.02
- Added Upgrade x10 button to Production Control
- Downgrade buttons on Production Control, Automata Control, Sand Refinery, and Glass Chiller are all hidden by No Sell
- But did anyone ever use those apart from accidentally?
- Fix stupid typo (pricePrice) which was messing up the shortcut calculation of infinte castle tool prices and therefore causing higher load times the more castle tools you/I have
- If no Blackprint-construction remains, the Blackprints-needed stat shows the amount needed for Automata Control
- Panther Rush now uses up 5 less Logicat levels, but still unlocks at the same point, meaning when you buy it you can't have less than 5 levels left

### 3.01
- Shopping donkey doesn't buy if no item (i.e. prevent crash.)
- Logicat's "correct answers needed" display now accounts for Panther Rush
- Bunch of new NP-based badges, by waveney (cos I was taking too long getting around to adding them)
- Fixxed some typoes
- Safety Goggles prevents Safety Hat unlock
- Glass Saw doesn't completely fill glass block storage (another waveney idea)
- Pluralisation (i.e. conditional 's') finally moved to a function. Please report any resulting/remaining pluralisation errors. Once. ;)
- CMS description clarified (I hope) a little.
- Added a new link to the index: something which I only just discovered exists :P
- Shorten Not Lucky message after np400
- Added an ONG countdown timer. For free!

### 3.0
- Bottle Battle in cyb group
- Panther Rush description improved
- Stat for chips per click
- Clean up mustarded totalcastlesbuilt for castletools
- Changed Panther Rush to increase the points from Logicats (Caged and Wild) instead of the number of Caged questions available
- It's half a point per level which means it's about as powerful before : at level 1, 10 answers is worth 15 answers and at level 2, 10 answers is worth 20. (it used to give 5 extra questions per level)
- Split DoRD/Logicat reward logic into two separate functions

### 2.991
- Beanie Builder upgrades are now in the beanish tech group

### 2.99
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

### 2.981
- Colpix option description fix

### 2.98
- Finally fixed AC upgrade price mustard!
- Compressed advanced badge save-storage (and fixed backward compatibility)
- Don't notify about chip/block gains if Automata Assemble is on
- Wording fix: Colpix
- Mustard when finishing blackprint construction

### 2.97
- Changed AC upgrades back to using chips, and changed the pricing

### 2.96
- The goggles, they unlock
- Glass Saw only doubles in power if you have double it's power in glass left over.
- Optimisation of Automata Assemble
- Automata Control starts from 1 since it's now detached from Production Control
- AC upgrade price fix (was checking wrong value... and I made it use Blocks. and was too cheap)
- AC locked and reset. It's now harder to get. Getting more NewPixBots will help get it. See Free Advice
- Badgers price fix
- Some new Ninja Badges
- Fixed some typos

### 2.95
- Single lettter typo
- Glasss Saw power multipler should worrk now
- Automata Assemble lets you upgrade glass storage any time.
- Control Automata price reflects the description
- Earning a Badge when you have Badgers recalculates sand dig rate
- DeMolpify function now handles empty string or undefined value (returns 0) which should prevent stack overflow

### 2.94
- Furnace Multitasking description was wrong after buy
- block gain/loss messages were not consistent with chips
- Performance increase if you have all Glass Tools enabled for Tool Factory and can afford them
- Redraw stuff when hiding Stats
- Fiddled with Glass Saw a bit
- Safety stuff

### 2.93
- Shopping Assistant remembers your choice. (BTW it doesn't work for Bigger Buckets. But you probably already have that)
- I think I fixed the issue of free boosts not being bought on occasion: castles were NaN after spending infinite castles
- A bunch more boosts for glass castle tools

### 2.92
- Flipside now not available until after you get Automata Assemble, since it's not really useful until then.
- Glass Mousepy
- Caged Logicat untagged if sleeping
- Panther Rush improves Panther Poke
- Glassed Lightning
- Fixed Badgers description
- The SpendSand function now ensures sand is not negative
- Boost to control AA power separate from TF power (defaults to current behaviour until you get it, and it starts at the current level)
- Finite/infinite tool price checks include the Price Factor now

### 2.91
- TFLL now allows you to load 10K if you don't have 50K
- Waves additionally show how many castles will be destroyed/built on the next ONG, if you have SBTF
- Panther Salve now shows progress towards LCB (oops)
- Rosetta now always displays how many NPBs for the next FA upgrade
- Stats show number of castles sacrificed via Molpy Down or Rift
- Automation Optimisation improved to allow Construction from Blackprints from occurring alongside other work
- Boost to allow construction of Glass Tools of finite price instead of infinite price
- Finally a new way to get Factory Automation runs

### 2.9
- Production Control for Tool Factory
- Panther Poke! This requires 2500 redactedclicks before you have any chance of seeing it
- Moved Blackprints stat into Other, and added Logicat Level to Other stats

### 2.898
- ONG performance increase - less looping on destruction
- Prevent fractional glass chips/blocks in storage, and prevent fractional size upgrades
- Larger upgrade increments for Sand Refinery and Glass Chiller (finally!)
- Glass Extruder was missing punctuation
- Buffed TFLL a little
- BG buffed a little also (it's not meant to be particularly powerful)

### 2.897
- Clarification on SBtF description and some explanation on its stats.
- stats tabs
- Logicastle description fix
- Break the Mould boost for when you decide making a mould was a bad idea
- 3 new blackprint boosts
- Notification log text is selectable
- Prevent Glass Saw from wasting chips making blocks for which you do not have storage space

### 2.896
- Show glass prices of tools when appropriate
- Raised Glass Saw limit by factor of 1000
- Prevent Caged Logicat from tiring out
- Panther Rush boost to increase the endurance of Caged Logicat
- Removed the 'of 1 needed' from sand display when castles are infinite
- Castle tool prices are always recalculated from scratch rather than subtracting previous price from current because the rounding errors are too much for reliability
- Prices that are definitely going to be infinite (i.e. over 1500 of a castle tool) are not calculated, just assumed to be infinite without calculating
- Glass gain/use messages show more decimal places (oops)
- New boost to make glass block production more efficient.

### 2.895
- Fixed SGL unlock
- And some other unlocks
- New Glass Block related boost
- Fixed Export toggle

### 2.894
- Some Glass multiplier boosts, mostly for sand tools

### 2.893
- Fixed ONGs with Backing Out boost
- Improved description of Molpies boost
- Fix Logicat message text
- Increase Panther Salve power even when you have infinite castles and Panther Glaze
- ASHF updates the price factor before activating Shopping Assistant.
- Prevent 0 fractal level from multiplying Not Lucky by 0 (though I think that could only happen if you have 0 sand or infinite castles, so it's probably unimportant)

### 2.892
- Made it possible to get Flux Capacitor if time travel costs more castles than you have
- Fixed logic for use of glass ceiling badges: they were being checked as if they were boosts
- Fixed description of factory automation: wasn't showing correct prices
- I think I fixed the swich between sand and glass production more properly now

### 2.891
- Fixed ch*rped up boost order, and tried to fix the side effects.
- Errors in filling glass mould fixed
- Updated Backing Out a bit and fixed typo in price

### 2.89
- Fixed Molpy Down/Coma button layout :P
- Tool Factory glass display
- Improved detection on when to recalc glass rate
- New high level Logicat reward
- Completed missing Bacon feature
- Updated Tool Factory description slightly but significantly

### 2.882
- Missing Molpy Down button
- Panther Salve negative value when disabled was being used in stats display
- Incorrect variable name in Badgers boost

### 2.881
- Prevent newpix background image transition from messing with the old opacity and transform transitions

### 2.88
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

### 2.87
- Fixed Glass Ceiling 0 not becoming available due to GCB Badge overwriting its department flag
- Made a way to unlock Castles to Glass
- Clarified descriptions of Sand to Glass and Castles to Glass a little
- Buffed Overcompensating because reasons
- Undid yesterday's nerf to Temporal Duplication
- Nerfed LaPetite a bit to ensure BBC is required for Infinite Sand rate

### 2.86
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

### 2.85
- Fixed Logicat issue caused by Bacon Mustard in the level reduction
- If you missed any Logicat rewards, you'll catch up next time you answer one.
- Added Safety Hat boost! Yay now we can all have Safety Hats in the Hotdog!

### 2.84
- Wasn't doing glass mould work in factory automation
- Prevent tool descriptions from hiding sand rate and ninja status
- 2 Boosts for a new tool (one of them requires high logicat and very high JDip)
- Burning Bags now go faster (and level faster) at higher levels
- Fiddled with JDip levels and destruction amounts a bunch. A lot actually.
- Yeah I didn't get time to do other important stuff because I spent so long on JDip

### 2.83
- Maybe there will never be a version 28. Maybe glass ceilings shouldn't lock on every load until then.

### 2.82
- Now properly importing old save: because lists don't work that way in javascript

### 2.81
- Now using more c**kies to save

### 2.8
- Tool Factory now does something
- Rewrote tool declaration code to use arguments dictionary like boosts and badges
- Fixed 2 Glass Ceiling prices: sorry I'm forcing a rebuy if you have them already :P
- Incomplete: Boosts for making tools produce glass

### 2.71
- Prevent Expando from crashing when you haven't unlocked all Tools

### 2.7
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

### 2.63
- Some little improvements to Shopping Assistant and key unlocking

### 2.62
- ASHF should not be given if there are no boosts available and you have infinite castles
- Shopping Assistant no longer buys locked boosts (thus preventing weird zombie state for DoN or Crate Key or Castle Crusher preventing them from being given by department due to being simultaneously bought and locked)

### 2.61
- Um, I wrote for instead of while and forgot to test

### 2.6
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

### 2.59
- Some new badges

### 2.58
- Logicat rewards now exclude boosts with their logicat level set to 0
- Nerfed WWB a little and increased the cost a bit
- The limit on Panther Salve and friends is now applied *after* it's boosted by Fractal Sandcastles
- Some more Factory Automation levels
- Not Lucky from Factory Automation doesn't show the 'not lucky' message

### 2.57
- Yeah I wasn't passing the automationLevel into the new function. oops.

### 2.56
- Moved some code around so department/logicat rewards are checked just before rewarding, rather than when other boosts are checked

### 2.55
- Improved Broken Rung to only count visible tools

### 2.54
- Brutal nerfing of Window Washers (though now it's cheaper to upgrade)
- Also nerfed LCB yet again
- A couple of totally minor new things
- Prevent Catmaran and LCB from using glass if you have no relevant tools to boost with
- Infinite castles prevents Flux Surge, Temporal Duplication or Temporal Rift from being Logicat rewards

### 2.53
- Flashy badge was too hard on my phone
- Fixed a price

### 2.52
- Deal with infinite prices (partially)

### 2.51
- Forgot to subtract traded scaffolds from CastleToolsOwned, leading to erroneous badge earn
- New postfix! It's worth 5 Ws

### 2.5
- I (might) love waffles
- Second Chance improved
- Locked Crate description improved to fit some usage changes
- Added some W badges
- Extra isFinite check
- Window Washers in the Château
- And recycling! (not quite complete: needs a button to power it up further)
- Took the easy way out of the stats-space issue, for now.

### 2.4
- Second Chance was free to use for uncaged Logicats
- Logicat results are now put in the log
- Got rid of redundant non decrementing countdowns on Redunception
- Got rid of redundant Redundant icon on Badges Earned when there's one on Discoveries
- Half the Erosion boost was still being applied to Wave destruction without earning it.

### 2.33
- Uh, how did that = get in there?

### 2.32
- Ensure Time Travel's power is 1 on buy (that was for a feature I never ended up making, whereby you could power up Time Travel to make bigger jumps. Now there's a better way of doing that.)
- Upgrade for person who has bought Time Travel and is stuck with it on power 0
- Apology

### 2.31
- Fixed erroneous save failed messages
- Factory Ninja is buffed based on logicat level

### 2.3
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
- And Refresh stuff when toggling it
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
- Fixed furnace-switch-description Refresh-mustard
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
- always show option descriptions, Refresh them if visible after load/import

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
