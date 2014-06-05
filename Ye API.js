// APIs for the code in Sandcastle Builder
//
// BOOSTS

ALWAYS add new boosts to the end.  Existing boosts can however be replaced by new ones.

Boosts can be accssed either by Molpy.Boosts[ALIAS] or Molpy.BoostsById[ID]

What		type		use and comments

id		int	A	Set internally by the program on setup

name		text	M	Used for the boost in the display and to identify
				boost in the absence of an alias

alias		text	O	Used to identify the boost internally and may be used in Robotic Shopper etc
				If not set, the name is used.

icon		text	O	Used to give the root icon name whendisplaying the boost in the loot

group		text	O	Used to give the group name for the boost, if absent "boost" is used.
				Must be one of the group names defined at the top of the boosts file, 
				you get weird errors otherwise.

desc		MayBeF	?	Used to provide a description of the boost - can be fairly dynamic

price		hash	O	hash of stuff and number needed, the number can be in quotes and will be DeMolpifed
				the number needed can itself be a function.

stats		MayBeF	O	Alternative description when in stats mode

startPower	MayBeF	O	Initial power level when bought

startCountdown	MayBeF	O	Initial countdown value - for temporary boosts

className	text	O	Initial className for tagged items - '', 'alert', 'toggle', 'action' 

department	int	O	if 1, it is awarded through the DORD maybe changed by CheckDoRDRewards in data.js

buyFunction	Func	O	Called as part of the boost buying

lockFunction	Func	O	Called when the boost is locked

unlockFunction	Func	O	Called when the boost is unlocked

loadFunction	Func	O	Called when the game is loaded

countdownFunction
		Func	O	Called when the countdown is in use every mnp

countdownLockFunction
		Func	O	Called when the countdown reaches 0

IsEnabled	

defSave		int	O

saveData	hash	O

classChange	Func	O	returns current className - allows for dynamic class changes

gifIcon		Bool	O

logic		int?	O	Gives static logicat level for boost - maybe changed by CheckLogicatRewards in data.js

single		text	O	Gives the correct text for a single item of the boost

plural		text	O	Gives the correct text for multiple items of the boost (otherwise an s is added)

Level

Has		Func(n)	O	Returns true if you have n of them item

Spend		Func(n)	O	return true if it spends n of the item (planning on defaulting n to 1 for some boosts)

Add		Func(n)	O	Adds n of the item (can be negative)

refreshFunction	Func	O

heresy		Bool	O	Coloured icons/effects

defStuff	int	O

clickBeach	Func	O	For beach actions

unlocked	int	O	if 1, the boost is unlocked when the game starts, boost will be in shop if unlocked > bought

prizes		int	O	number of prizes the boost is

tier		

draglvl		text	O	gives dragon level the boost becomes available

limit		MayBeF	O	Number of the boost that can be held at once

NotTemp		int	O	Prevents boosts with complex countdowns being treated as temporary on load

***************************************************************************************
# Badges

id		int	A	Set internally to the Idenity of the Badge on setup.

name		text	M	Name of badge

alias		text	O	short form of badge, not used other than for dicoveries, may remove this

vis		int	O	1: description hidden until badge got
				2: hidden Name
				3: Invisible until got

desc		MayBeF	M?	Description of the badge

stats		MayBeF	O	More information about the badge

heresy		bool	O	Coloured icons/effects

classChange	Func	O	returns current className - allows for dynamic class changes




***************************************************************************************

# Discoveries

The discoveries are CURRENTLY in the same file as the badges.  This will change when the TaTimages are used.


***************************************************************************************

# Tools

***************************************************************************************
# Options

Add new options in the order they should appear

Add the new option to the END of the Save Order, NEVER EVER DELETE from this list

id		int	A	Set internally to the Idenity of the Option on setup.

name		text	M	used to reference the option in the code

title		text	O	Title of option (if different from name)

defaultval	int	O	Default vallue (if not 0)

visability	MayBeF	O	Show the option, default 1, -1 never shown

onchange	Func	O	Actions to take if/when it changes, also called on load

range		int	O	highest value (currently the maximum is 9) default 1

text		MaybeF	O	Text for the option, if an array it is indexed by the value to get the text

breakafter	int	O	if 1, the next option starts on a new line in the display (just for neatness and grouping)

