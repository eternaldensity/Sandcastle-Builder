# APIs for the code in Sandcastle Builder

## Boosts

**ALWAYS** add new boosts to the end. Existing boosts can however be replaced by new ones.
Boosts can be accessed either by Molpy.Boosts[ALIAS] or Molpy.BoostsById[ID].

Third column explains is parameter (A)utomatic, (M)ust be present or (O)ptional. 

What                  | Type    |AMO| Use and comments 
----------------------|---------|---|-----------------
id                    | int     | A | Set internally by the program on setup
unlocked              |	float   | AO| If 1, the boost is unlocked when the game starts, boost will be in shop if unlocked > bought
bought                | float   | A | Number of times the boost has been bought (will be in shop if bought < unlocked)
power                 | float   | ? | Used for many things to record additional property of boost.  Uses vary.
Level                 | float   | O | Derived from power for a lot of boosts, (usually when defStuff = 1)
name                  | text    | M | Used for the boost in the display and to identify boost in the absence of an alias
alias                 | text    | O | Used to identify the boost internally and may be used in Robotic Shopper etc. If not set, the name is used.
title                 | MayBeF  | O | Used for dynamic names of boosts - gives current name (can include html)
icon                  | text    | O | Used to give the root icon name when displaying the boost in the loot
group                 |	text    | O | Used to give the group name for the boost, if absent "boost" is used. Must be one of the group names defined at the top of the boosts file, you get weird errors otherwise.
desc                  | MayBeF  | ? | Used to provide a description of the boost - can be fairly dynamic
price                 | hash    | O | Hash of stuff and number needed, the number can be in quotes and will be DeMolpifed. The number needed can itself be a function.
stats                 | MayBeF  | O | Alternative description when in stats mode
startPower            | MayBeF  | O | Initial power level when bought
startCountdown        |	MayBeF  | O | Initial countdown value - for temporary boosts
countdownCMS          | int     | O | IF 1, runs countdown through Coma Mopy Style
className             | text    | O | Initial className for tagged items - '', 'alert', 'toggle', 'action' 
department            |	int     | O | If 1, it is awarded through the DORD maybe changed by CheckDoRDRewards in data.js
buyFunction           |	Func    | O | Called as part of the boost buying
lockFunction          |	Func    | O | Called when the boost is locked
unlockFunction        |	Func    | O | Called when the boost is unlocked
loadFunction          |	Func    | O | Called when the game is loaded
countdownFunction     | Func    | O | Called when the countdown is in use every mnp
countdownLockFunction |	Func    | O | Called when the countdown reaches 0
IsEnabled             |         |   |	
defSave               | int     | O |
saveData              |	hash    | O |
classChange           |	Func    | O | Returns current className - allows for dynamic class changes
gifIcon               |	Bool    | O | If 1, icon is a gif, oherwise it is a png
logic                 | int?    | O | Gives static logicat level for boost - maybe changed by CheckLogicatRewards in data.js
single                | text    | O | Gives the correct text for a single item of the boost
plural                | text    | O | Gives the correct text for multiple items of the boost (otherwise an s is added)
Level                 |         |   |
Has                   | Func(n) | O | Returns true if you have n of them item
Spend                 | Func(n) | O | Return true if it spends n of the item (planning on defaulting n to 1 for some boosts)
Add                   |	Func(n) | O | Adds n of the item (can be negative)
refreshFunction       |	Func    | O |
heresy                | Bool    | O | Coloured icons/effects
defStuff              |	int     | O | If 1, use default 
clickBeach            |	Func    | O | For beach actions
prizes                | int     | O | Number of prizes the boost is
tier                  |         |   |		
draglvl               | text    | O | Gives dragon level the boost becomes available
limit                 | MayBeF  | O | Number of the boost that can be held at once
NotTemp               |	int     | O | Prevents boosts with complex countdowns being treated as temporary on load
sortAfter             |	text    | O | Gives the alias of the boost it is to apear after instead of alphabetical
AfterToggle           |	Func    | O | Called after use of Generic Toggle

## Badges

What                  | Type    |AMO | Use and comments 
----------------------|---------|----|-----------------
id                    |	int     | A  | Set internally to the Idenity of the Badge on setup.
name                  | text    | M  | Name of badge
alias                 | text    | O  | Short form of badge, not used other than for dicoveries, may remove this
vis                   | int     | O  | <ul><li> 1: description hidden until badge got </li><li> 2: hidden Name </li><li> 3: Invisible until got </li></ul>
desc                  | MayBeF  | M? | Description of the badge
stats                 | MayBeF  | O  | More information about the badge
heresy                | bool    | O  | Coloured icons/effects
classChange           |	Func    | O  | Returns current className - allows for dynamic class changes

## Discoveries

The discoveries are **CURRENTLY** in the same file as the badges.  This will change when the TaTimages are used.

## Tools

### Sand Tools

### Castle Tools

## Options

Add new options in the order they should appear
Add the new option to the **END** of the Save Order, **NEVER EVER DELETE** from this list

What                  | Type    | AMO| Use and comments 
----------------------|---------|----|-----------------
id                    |	int     | A  | Set internally to the Idenity of the Option on setup.
name                  | text    | M  | Used to reference the option in the code
title                 | text    | O  | Title of option (if different from name)
defaultval            | int     | O  | Default vallue (if not 0)
visability	      | MayBeF  | O  | Show the option, default 1, -1 never shown
onchange              |	Func    | O  | Actions to take if/when it changes, also called on load
range                 |	int     | O  | Highest value (currently the maximum is 9) default 1
text                  | MaybeF  | O  | Text for the option, if an array it is indexed by the value to get the text
breakafter            |	int     | O  | If 1, the next option starts on a new line in the display (just for neatness and grouping)
