/**************************************************************
 * Badges
 * 
 * New badges should only be added to the END of the list
 * and before the Discoveries section!
 *************************************************************/

Molpy.DefineBadges = function() {
	new Molpy.Badge({
		name: 'Amazon Patent',
		desc: '1-Click'
	});
	new Molpy.Badge({
		name: 'Oops',
		desc: 'You clicked it again'
	});
	new Molpy.Badge({
		name: 'Just Starting',
		desc: '10 clicks'
	});
	new Molpy.Badge({
		name: 'Busy Clicking',
		desc: '100 clicks'
	});
	new Molpy.Badge({
		name: 'Click Storm',
		desc: '1,000 clicks'
	});
	new Molpy.Badge({
		name: 'Getting Sick of Clicking',
		desc: 'Dig 100K sand by clicking'
	});
	new Molpy.Badge({
		name: 'Why am I still clicking?',
		desc: 'Dig 5M sand by clicking'
	});
	new Molpy.Badge({
		name: 'Click Master',
		desc: 'Dig 100M sand by clicking',
		vis: 2
	});
	new Molpy.Badge({
		name: 'Rook',
		desc: 'Make a castle'
	});
	new Molpy.Badge({
		name: 'Enough for Chess',
		desc: function() { return 'Make ' + Molpify(4) + ' castles'}
	});
	new Molpy.Badge({
		name: 'Fortified',
		desc: 'Make 40 castles'
	});
	new Molpy.Badge({
		name: 'All Along the Watchtower',
		desc: 'Make 320 castles'
	});
	new Molpy.Badge({
		name: 'Megopolis',
		desc: 'Make 1,000 castles'
	});
	new Molpy.Badge({
		name: 'Kingdom',
		desc: 'Make 100K castles'
	});
	new Molpy.Badge({
		name: 'Empire',
		desc: 'Make 10M castles'
	});
	new Molpy.Badge({
		name: 'Reign of Terror',
		desc: 'Make 1G castles',
		vis: 2
	});
	new Molpy.Badge({
		name: 'We Need a Bigger Beach',
		desc: 'Have 1K castles'
	});
	new Molpy.Badge({
		name: 'Castle Nation',
		desc: 'Have 1M castles'
	});
	new Molpy.Badge({
		name: 'Castle Planet',
		desc: 'Have 1G castles'
	});
	new Molpy.Badge({
		name: 'Castle Star',
		desc: 'Have 1T castles'
	});
	new Molpy.Badge({
		name: 'Castle Galaxy',
		desc: 'Have 8,888T',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Barn',
		desc: 'Have 50 sand'
	});
	new Molpy.Badge({
		name: 'Storehouse',
		desc: 'Have 200 sand'
	});
	new Molpy.Badge({
		name: 'Bigger Barn',
		desc: 'Have 500 sand'
	});
	new Molpy.Badge({
		name: 'Warehouse',
		desc: 'Have 8K sand'
	});
	new Molpy.Badge({
		name: 'Sand Silo',
		desc: 'Have 300K sand'
	});
	new Molpy.Badge({
		name: 'Silicon Valley',
		desc: 'Have 7M sand'
	});
	new Molpy.Badge({
		name: 'Seaish Sands',
		desc: 'Have 420M sand',
		vis: 1
	});
	new Molpy.Badge({
		name: 'You can do what you want',
		desc: 'Have 123,456,789 sand',
		vis: 2
	});
	new Molpy.Badge({
		name: 'Ninja',
		desc: 'Ninja a NewPixBot',
		stats: 'The pope starts to dig some sand. A black figure swings from a rope from the ceiling.'
	});
	new Molpy.Badge({
		name: 'No Ninja',
		desc: 'Click for sand after not ninjaing NewPixBot'
	});
	new Molpy.Badge({
		name: 'Ninja Stealth',
		desc: 'Make non-ninjaing clicks 6 newpix in a row'
	});
	new Molpy.Badge({
		name: 'Ninja Dedication',
		desc: 'Reach ninja stealth streak 16'
	});
	new Molpy.Badge({
		name: 'Ninja Madness',
		desc: 'Reach ninja stealth streak 26'
	});
	new Molpy.Badge({
		name: 'Ninja Omnipresence',
		desc: 'Reach ninja stealth streak 36'
	});
	new Molpy.Badge({
		name: 'Ninja Strike',
		desc: 'Ninja 10 NewPixBots simultaneously'
	});
	new Molpy.Badge({
		name: 'Ninja Holidip',
		desc: 'Lose ninja stealth by not clicking'
	});
	new Molpy.Badge({
		name: 'Wipeout',
		desc: 'Destroy a total of 500 castles with waves'
	});
	new Molpy.Badge({
		name: 'Redundant Redundancy',
		desc: 'Earn 0 badges',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Redundant',
		desc: 'Earn at least 1 badge',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Clerical Error',
		desc: 'Receive a badge you haven\'t earned',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Castle Price Rollback',
		desc: 'Experience an ONG<br>This is when the amount of Sand needed for making new Castles resets back to 1, and any Castle Tools you own activate.'
	});
	new Molpy.Badge({
		name: 'This Should be Automatic',
		desc: 'Manually save 20 times'
	});
	new Molpy.Badge({
		name: 'A light dusting',
		desc: 'Have a sand dig rate of 0.1 SpmNP'
	});
	new Molpy.Badge({
		name: 'Sprinkle',
		desc: 'Have a sand dig rate of 0.8 SpmNP'
	});
	new Molpy.Badge({
		name: 'Trickle',
		desc: 'Have a sand dig rate of 6 SpmNP'
	});
	new Molpy.Badge({
		name: 'Pouring it on',
		desc: 'Have a sand dig rate of 25 SpmNP'
	});
	new Molpy.Badge({
		name: 'Hundred Year Storm',
		desc: 'Have a sand dig rate of 100 SpmNP'
	});
	new Molpy.Badge({
		name: 'Thundering Typhoon!',
		desc: 'Have a sand dig rate of 400 SpmNP'
	});
	new Molpy.Badge({
		name: 'Sandblaster',
		desc: 'Have a sand dig rate of 1,600 SpmNP'
	});
	new Molpy.Badge({
		name: 'Where is all this coming from?',
		desc: 'Have a sand dig rate of 7,500 SpmNP'
	});
	new Molpy.Badge({
		name: 'Seaish Sandstorm',
		desc: 'Have a sand dig rate of 30K SpmNP',
		vis: 1
	});
	new Molpy.Badge({
		name: 'WHOOSH',
		desc: 'Have a sand dig rate of 500,500 SpmNP',
		vis: 1
	});
	new Molpy.Badge({
		name: 'We want some two!',
		desc: 'Have a sand dig rate of 2,222,222 SpmNP',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Bittorrent',
		desc: 'Have a sand dig rate of 10,101,010 SpmNP',
		vis: 1
	});
	new Molpy.Badge({
		name: 'WARP SPEEEED',
		desc: 'Have a sand dig rate of 299,792,458 SpmNP',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Maxed out the display',
		desc: 'Have a sand dig rate of 8,888,888,888.8 SpmNP',
		vis: 2
	});
	new Molpy.Badge({
		name: 'Store ALL of the sand',
		desc: 'Have 782,222,222,144 sand',
		vis: 2
	});
	new Molpy.Badge({
		name: 'Notified',
		desc: 'Receive a notification'
	});
	new Molpy.Badge({
		name: 'Thousands of Them!',
		desc: 'Receive 2000 notifications',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Decisions, Decisions',
		desc: 'With an option on additional decisions',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Night and Dip',
		desc: 'Change Colour Schemes',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Far End of the Bell Curve',
		desc: 'View Stats',
		vis: 1
	});
	new Molpy.Badge({
		name: 'The Fine Print',
		desc: 'View the stats of a Sand Tool',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Keeping Track',
		desc: 'View the stats of a Castle Tool',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Ninja Shortcomings',
		desc: 'Lose a Ninja Stealth Streak of between 30 and 35'
	});
	new Molpy.Badge({
		name: 'Not Ground Zero',
		desc: 'Molpy Down',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Not So ' + Molpy.Redacted.word2,
		desc: 'Click 2 ' + Molpy.Redacted.words,
		vis: 1
	});
	new Molpy.Badge({
		name: "Don't Litter!",
		desc: 'Click 14 ' + Molpy.Redacted.words,
		vis: 1
	});
	new Molpy.Badge({
		name: 'Y U NO BELIEVE ME?',
		desc: 'Click 101 ' + Molpy.Redacted.words,
		vis: 1
	});
	new Molpy.Badge({
		name: "Have you noticed it's slower?",
		desc: 'Experience the LongPix'
	});
	new Molpy.Badge({
		name: 'Judgement Dip Warning',
		icon: 'judgementdipwarning',
		heresy: true,
		vis: 2,
		
		desc: function() {
			var report = Molpy.JudgementDipReport();
			if(Molpy.Boosts['NavCode'].power)
				return 'The Bots have been foiled by altered navigation code';
			var level = report[0];
			var countdown = report[1];
			if(!level) return 'Safe. For now.';
			if(level == 1)
				return 'The countdown is at ' + Molpify(countdown) + 'NP';
			return 'Judgement dip is upon us! But it can get worse. The countdown is at ' + Molpify(countdown) + 'NP';
		},
		
		classChange: function() { return Molpy.judgeLevel > 0 ? 'action': ''},
	});
	
	Molpy.JudgementDipThreshold = function() {
		var baseVal = 500000000;
		var div = 1;
		for( var i in Molpy.Boosts) {
			if(Molpy.Got(i)) {
				var gr = Molpy.Boosts[i].group;
				if(gr == 'cyb' || gr == 'chron' || gr == 'hpt') {
					div++;
					if(div > 25) div *= 1.35;
					if(div > 40) div *= 1.35;
				}
			}
		}
		if(Molpy.Got('Bag Burning')) {
			div /= Molpy.BagBurnDiv();
		}
		if(!Molpy.Got('DORD')) { div /= 2 };
		return baseVal / div;
	}
	
	Molpy.BagBurnDiv = function() {
		var max = 1e294
		var div = Math.pow(1.4,	Math.max(0, (Molpy.SandTools['Bag'].amount - Molpy.npbDoubleThreshold) / 2));
		if(div > max) {
			if(Molpy.Got('Bacon')) Molpy.LockBoost('Bag Burning');
			return max;
		}
		return div;
	}
	
	Molpy.JudgementDipReport = function() {
		if(Molpy.Boosts['NavCode'].power) return [0, Infinity];
		var bot = Molpy.CastleTools['NewPixBot'];
		var bots = bot.amount;
		var np = Math.abs(Molpy.newpixNumber);
		if(Molpy.Got('Time Travel') || np < 20) bots -= 2;
		var botCastles = bot.totalCastlesBuilt * bots;
		var thresh = Molpy.JudgementDipThreshold();
		var level = Math.max(0, Math.floor(botCastles / thresh));
		if(Molpy.Got('Bag Burning')) {
			var nobagLevel = Math.max(0, Math.floor((Molpy.BagBurnDiv() / thresh) * botCastles));
			if(nobagLevel > Math.pow(2, Molpy.Boosts['Bag Burning'].power) + 6) {
				var rate = Molpy.BurnBags(Molpy.Boosts['Bag Burning'].power + 1, 1);
				Molpy.Boosts['Bag Burning'].power += rate;
				if(Molpy.SandTools['Bag'].amount < Molpy.npbDoubleThreshold) {
					Molpy.Notify('The NewPixBots extinguished the burning Bags!', 1);
					Molpy.LockBoost('Bag Burning');
				}
			}
		}
		var countdown = ((level + 1) * thresh - botCastles);
		countdown /= (bot.buildC() * bot.amount * bot.amount);
		if(Molpy.Got('Doublepost')) countdown /= 2;
		countdown /= Molpy.Boosts['Castles'].globalMult; // this is a bit approximate because of its rounding, but close enough for this, hopefully
		if(isNaN(countdown) || countdown < 0) countdown = 0;
		if(Molpy.Boosts['Coma Molpy Style'].power) {
			level = Math.floor(level / 2);
		}
		var maxDipLevel = Molpy.MaxDipLevel(np);
		if(level > maxDipLevel) {
			level = maxDipLevel;
			countdown = 0;
			while(Molpy.MaxDipLevel(np + countdown) <= level) {
				countdown++;
			}
		}

		Molpy.RewardDipLevel(level);
		return [level, Math.ceil(countdown)];
	}
	
	Molpy.MaxDipLevel = function(np) {
		var maxDipLevel = Math.floor(Math.pow(2, Math.max(0, (np - 200))
			* Math.max(0, np - 200) / 250 + np / 2 - 20));
		return maxDipLevel;
	}
	
	Molpy.RewardDipLevel = function(level) {
		if(level > 3) {
			if(Molpy.Got('Time Travel') && !(Molpy.Got('Overcompensating') || Molpy.Got('Doublepost')) &&
				isFinite(Molpy.CastleTools['NewPixBot'].totalCastlesBuilt)) 
			{
				Molpy.UnlockBoost('Summon Knights Temporal');
			}
			if(Molpy.SandTools['Bag'].amount > Molpy.npbDoubleThreshold && !Molpy.Got('Fireproof'))
				Molpy.UnlockBoost('Bag Burning');
		}
		if(level > 4) {
			Molpy.Boosts['Ninja Assistants'].department = 1;
		}
		if(level > 5) {
			Molpy.Boosts['Minigun'].department = 1;
		}
		if(level > 6) {
			Molpy.Boosts['Stacked'].department = 1;
		}
		if(level > 7) {
			if(Molpy.Got('Minigun') || Molpy.Got('Stacked'))
				Molpy.Boosts['Big Splash'].department = 1;
		}
		if(level > 8) {
			if(Molpy.Got('Stacked') || Molpy.Got('Big Splash'))
				Molpy.Boosts['Irregular Rivers'].department = 1;
		}
		if(level > 12) {
			if(Molpy.Got('Big Splash') || Molpy.Got('Irregular Rivers'))
				Molpy.Boosts['NavCode'].department = 1;
			Molpy.EarnBadge('On the 12th Dip of Judgement');
		}
		if(level > 30) {
			if(Molpy.Got('Flux Turbine')) {
				Molpy.Boosts['NavCode'].department = 1;
				Molpy.Boosts['NavCode'].price = {Sand: '33K', Castles: 7400};
			}
		}
	}
	
	Molpy.JDestroyAmount = function() {
		var j = Molpy.judgeLevel - 1;
		if(j < 1) return 0;
		var a = Math.pow(j, 1 + Math.min(1, j / 1000000) - Math.min(1, j / 1e150));
		var b = Math.max(1, Math.min(1e12, j / 1e150));
		return a * b;
	}
	
	new Molpy.Badge({
		name: 'Judgement Dip',
		icon: 'judgementdip',
		heresy: 'true',
		vis: 3,
		
		desc: function() {
			if(Molpy.Boosts['NavCode'].power)
				return 'The Bots have been foiled by altered navigation code';
			var j = Molpy.JDestroyAmount();
			if(j < 1) return 'Safe. For now.';
			return 'The NewPixBots destroy ' + Molpify(j) + ' Castle' + plural(j) + ' each per mNP';
		},

		classChange: function() { return Molpy.judgeLevel > 1 ? 'alert': ''},
	});
	new Molpy.Badge({
		name: 'Fast Forward',
		desc: 'Travel Back to the Future',
		vis: 1
	});
	new Molpy.Badge({
		name: 'And Back',
		desc: 'Return to the Past',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Primer',
		desc: 'Travel through Time 10 Times',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Wimey',
		desc: 'Travel through Time 40 Times',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Hot Tub',
		desc: 'Travel through Time 160 Times',
		vis: 1
	});
	new Molpy.Badge({
		name: "Dude, Where's my DeLorean?",
		desc: 'Travel through Time 640 Times',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Use Your Leopard',
		desc: 'Get a click by using your leopard to simulate reloading the page',
		stats: 'Type F5 into the Import dialog'
	});
	new Molpy.Badge({
		name: 'Badge Not Found',
		desc: 'Description Not Found'
	});
	new Molpy.Badge({
		name: 'Fractals Forever',
		desc: 'Reach Fractal Level 60, and Fractal Sandcastles will be retained if you Molpy Down.'
	});
	new Molpy.Badge({
		name: 'Recursion',
		desc: function() {
			return 'Yo Dawg, we heard you earned ' + Molpify(DeMolpify('50G'))
				+ ' Sand by clicking...';
		}
	});
	new Molpy.Badge({
		name: 'Big Spender',
		desc: function() {
			return 'Spend ' + Molpify(DeMolpify('200M')) + ' Castles total';
		}
	});
	new Molpy.Badge({
		name: 'Valued Customer',
		desc: function() {
			return 'Spend ' + Molpify(DeMolpify('8T')) + ' Castles total';
		}
	});
	new Molpy.Badge({
		name: 'Beachscaper',
		desc: 'Have 200 Sand Tools'
	});
	new Molpy.Badge({
		name: 'Beachmover',
		desc: 'Have 100 Castle Tools'
	});
	new Molpy.Badge({
		name: 'Better This Way',
		desc: 'Purchase 50 Boosts',
		stats: 'So you\'re telling me Badgers build the castle by firing boots at the sand with trebuchets?'
	});
	new Molpy.Badge({
		name: 'Recursion ',
		desc: 'To Earn Recursion, you must first earn Recursion'
	});
	new Molpy.Badge({
		name: 'Beachomancer',
		desc: 'Have 1000 Sand Tools'
	});
	new Molpy.Badge({
		name: 'Beachineer',
		desc: 'Have 500 Castle Tools'
	});
	new Molpy.Badge({
		name: 'Glass Factory',
		desc: 'Have 80M sand'
	});
	new Molpy.Badge({
		name: 'Glassblower',
		desc: 'Make a Glass Block',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Ninja Pact',
		desc: 'Have a ninja stealth streak over 4K'
	});
	new Molpy.Badge({
		name: 'Ninja Unity',
		desc: 'Have a ninja stealth streak over 4M'
	});
	new Molpy.Badge({
		name: 'Unreachable?',
		desc: 'Build a total of 2T Castles. (I GUESS <b>SUPPOSE <i>MAYBE</i></b> IT WILL BE AN ISLAND <b>AGAIN</b>.))',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Flung',
		desc: 'Have 50 Trebuchets'
	});
	new Molpy.Badge({
		name: 'People Eating Tasty Animals',
		desc: 'Have 1 Peta Castle'
	});
	new Molpy.Badge({
		name: 'Y U NO RUN OUT OF SPACE?',
		desc: 'Have 1 Yotta Castle'
	});
	new Molpy.Badge({
		name: 'Dumpty',
		desc: 'Have 1 Umpty Castle'
	});
	new Molpy.Badge({
		name: 'This is a silly number',
		desc: 'Have 1 Squilli Castle'
	});
	new Molpy.Badge({
		name: 'To Da Choppah',
		desc: 'Have 1 Helo Castle'
	});
	new Molpy.Badge({
		name: 'Toasters',
		desc: 'Have 1 Ferro Castle'
	});
	new Molpy.Badge({
		name: 'All Your Base',
		desc: 'Have 2101 Sand Tools'
	});
	new Molpy.Badge({
		name: 'Look Before You Leap',
		desc: 'Have 3000 Sand Tools'
	});
	new Molpy.Badge({
		name: 'Fully Armed and Operational Battlestation',
		desc: 'Have 4000 Castle Tools'
	});
	new Molpy.Badge({
		name: 'WHAT',
		desc: 'Have over nine thousand Sand Tools',
		vis: 1
	});
	new Molpy.Badge({
		name: '\\/\\/AR]-[AMMER',
		desc: 'Have 40K Tools',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Ceiling Broken',
		desc: 'Have all 10 Glass Ceiling Boosts',
		stats: 'allegedly'
	});
	new Molpy.Badge({
		name: 'On the 12th Dip of Judgement',
		desc: 'Reach Judgement Dip level 12'
	});
	new Molpy.Badge({
		name: 'Machine Learning',
		desc: 'Unlock all the Judgement Dip Boosts'
	});
	new Molpy.Badge({
		name: 'Blitz and Pieces',
		desc: 'Get Blitz Power to 1M%'
	});
	new Molpy.Badge({
		name: 'Mustard Cleanup',
		desc: 'The amount of some Stuff you had was not a number, and was corrected to 0',
		vis: 2
	});
	new Molpy.Badge({
		name: 'Pyramid of Giza',
		desc: 'Have 7,016,280 Glass Blocks'
	});
	new Molpy.Badge({
		name: 'Personal Computer',
		desc: 'Have 640K Glass Chips'
	});
	new Molpy.Badge({
		name: 'I love my flashy gif',
		desc: 'Change the colourscheme 20 times in a mNP',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Dubya',
		desc: 'Have at least a Wololo Castles',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Rub a Dub Dub',
		desc: 'Have at least a Wololo Wololo Castles',
		vis: 1
	});
	new Molpy.Badge({
		name: 'WWW',
		desc: 'Have at least a Wololo Wololo Wololo Castles',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Age of Empires',
		desc: 'Have at least a Wololo Wololo Wololo Wololo Castles',
		vis: 1
	});

	for( var i in Molpy.SandToolsById) {
		var t = Molpy.SandToolsById[i];
		new Molpy.Badge({
			name: t.name + ' Shop Failed',
			desc: 'The price of ' + t.name + ' is too ch*rping high!',
			vis: 2
		});
	}
	
	for( var i in Molpy.CastleToolsById) {
		var t = Molpy.CastleToolsById[i];
		new Molpy.Badge({
			name: t.name + ' Shop Failed',
			desc: 'The price of ' + t.name + ' is too ch*rping high!',
			vis: 2
		});
	}

	new Molpy.Badge({
		name: 'Queue',
		desc: 'Have at least a Quita Castles',
		vis: 1
	});
	new Molpy.Badge({
		name: 'What Queue',
		desc: 'Have at least a Wololo Quita Castles',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Everything but the Kitchen Windows',
		desc: 'Have Infinite Sand and Castles'
	});
	new Molpy.Badge({
		name: 'Ceiling Disintegrated',
		desc: 'Have all 12 Glass Ceiling Boosts',
		vis: 1
	});
	new Molpy.Badge({
		name: 'KiloNinja Strike',
		desc: 'Ninja 1K NewPixBots simultaneously',
		vis: 1
	});
	new Molpy.Badge({
		name: 'MegaNinja Strike',
		desc: 'Ninja 1M NewPixBots simultaneously',
		vis: 1
	});
	new Molpy.Badge({
		name: 'GigaNinja Strike',
		desc: 'Ninja 1G NewPixBots simultaneously',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Strikes Twice',
		desc: 'Attempt to receive Blitzing while you have Glassed Lightning (this will instead give Glassed Lightning more power)'
	});
	new Molpy.Badge({
		name: 'Meaning',
		desc: 'Reach a ' + Molpy.Redacted.Word + ' streak of 42'
	});
	new Molpy.Badge({
		name: 'How do I Shot Mustard?',
		desc: 'The price of something was not a number, and was corrected to 0',
		stats: 'One way to get this is to have Locked Crate appear in the shop immediately after spending infinite sand'
	});
	new Molpy.Badge({
		name: 'KiloTool',
		desc: 'Make 1K Glass Tools per mNP'
	});
	new Molpy.Badge({
		name: 'MegaTool',
		desc: 'Make 1M Glass Tools per mNP'
	});
	new Molpy.Badge({
		name: 'GigaTool',
		desc: 'Make 1G Glass Tools per mNP'
	});
	new Molpy.Badge({
		name: 'TeraTool',
		desc: 'Make 1T Glass Tools per mNP'
	});
	new Molpy.Badge({
		name: 'Scouter',
		desc: 'Have over nine thousand Blackprints'
	});
	new Molpy.Badge({
		name: 'Getting Expensive',
		desc: 'Each time Sand is converted into a Castle, the next Castle costs more sand.<br>But don\'t worry: the price will reset back to 1 when the timer beside the clock reaches 0.',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Plain Potato Chips',
		desc: function() { return 'Have a Glass Chip production rate from Glass Tools of at least ' + Molpify(5000) + ' Chips/mNP'},
		vis: 1
	});
	new Molpy.Badge({
		name: 'Crinkle Cut Chips',
		desc: function() { return 'Have a Glass Chip production rate from Glass Tools of at least ' + Molpify(20000) + ' Chips/mNP'},
		vis: 1
	});
	new Molpy.Badge({
		name: 'BBQ Chips',
		desc: function() { return 'Have a Glass Chip production rate from Glass Tools of at least ' + Molpify(800000) + ' Chips/mNP'},
		vis: 1
	});
	new Molpy.Badge({
		name: 'Corn Chips',
		desc: function() { return 'Have a Glass Chip production rate from Glass Tools of at least ' + Molpify(4e6) + ' Chips/mNP'},
		vis: 1
	});
	new Molpy.Badge({
		name: 'Sour Cream and Onion Chips',
		desc: function() { return 'Have a Glass Chip production rate from Glass Tools of at least ' + Molpify(2e7) + ' Chips/mNP'},
		vis: 1
	});
	new Molpy.Badge({
		name: 'Cinnamon Apple Chips',
		desc: function() { return 'Have a Glass Chip production rate from Glass Tools of at least ' + Molpify(1e8) + ' Chips/mNP'},
		vis: 1
	});
	new Molpy.Badge({
		name: 'Sweet Chili Chips',
		desc: function() { return 'Have a Glass Chip production rate from Glass Tools of at least ' + Molpify(3e9) + ' Chips/mNP'},
		vis: 1
	});
	new Molpy.Badge({
		name: 'Banana Chips',
		desc: function() { return 'Have a Glass Chip production rate from Glass Tools of at least ' + Molpify(1e11) + ' Chips/mNP'},
		vis: 1
	});
	new Molpy.Badge({
		name: 'Nuclear Fission Chips',
		desc: function() { return 'Have a Glass Chip production rate from Glass Tools of at least ' + Molpify(5e12) + ' Chips/mNP'},
		vis: 1
	});
	new Molpy.Badge({
		name: 'Silicon Chips',
		desc: function() { return 'Have a Glass Chip production rate from Glass Tools of at least ' + Molpify(6e14) + ' Chips/mNP'},
		vis: 1
	});
	new Molpy.Badge({
		name: 'Blue Poker Chips',
		desc: function() { return 'Have a Glass Chip production rate from Glass Tools of at least ' + Molpify(1e19) + ' Chips/mNP'},
		vis: 1
	});
	new Molpy.Badge({
		name: 'Neat!',
		desc: 'All your tools appear to have the same number owned',
		stats: 'Requies at least a million of each tool',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Mains Power',
		desc: 'Automata Control level at least 230',
		vis: 1
	});
	new Molpy.Badge({
		name: 'It Hertz',
		desc: 'Automata Control level at least 50',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Second Edition',
		desc: 'Have at least two Goats'
	});
	new Molpy.Badge({
		name: 'Nope!',
		desc: 'Power Control is at the limit',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Minus Worlds',
		desc: 'Take a jaunt to the negative NewPix',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Badge Found',
		desc: 'Description Found',
		stats: 'What is this, I don\'t even?'
	});
	new Molpy.Badge({
		name: 'Typo Storm',
		desc: 'Encounter 1000 different typos in a play session (resets on reload)',
		stats: 'Toggle typo mode by typing "typo" into the Import dialog.<br>'
			+ 'The number of typos are limitted by the NewPix you are on.<br>'
			+ 'Actual typos the the developers make don\'t count.<br>'
			+ 'For instance, "limitted".<br>'
			+ 'Sorry.'
	});
	new Molpy.Badge({
		name: 'Pure Genius',
		desc: 'Inspite of an Infinite Sand rate, you manage to have no sand to run the Factory Ninja',
		vis: 1
	});
	new Molpy.Badge({
		name: 'PetaTool',
		desc: 'Make 1P Glass Tools per mNP',
		stats: 'Worry about your Tool Factory catching fire',
		vis: 1
	});
	new Molpy.Badge({
		name: 'YottaTool',
		desc: 'Make 1Y Glass Tools per mNP',
		stats: 'Yours Truly',
		vis: 1
	});
	new Molpy.Badge({
		name: 'WololoTool',
		desc: 'Make 1W Glass Tools per mNP',
		stats: 'Still so far to go!',
		vis: 1
	});
	new Molpy.Badge({
		name: 'WololoWololoTool',
		desc: 'Make 1WW Glass Tools per mNP',
		stats: 'Really'
	});
	new Molpy.Badge({
		name: 'Never Alone',
		desc: 'Increase the Temporal Duplication countdown to 9WNP',
		stats: 'Makes Temporal Duplication Permament(er)'
	});
	new Molpy.Badge({
		name: 'Infinite Saw',
		desc: 'Use Glass Saw to make infinite Glass Blocks'
	});
	new Molpy.Badge({
		name: 'War was beginning.',
		desc: 'What happen?',
		stats: function() {
			return Molpy.BeanishToCuegish(GLRschoice(Molpy.wing0));
		},
		vis: 1
	});
	new Molpy.Badge({
		name: 'Mustard Tools',
		desc: 'Get mustard on all your tools'
	});
	new Molpy.Badge({
		name: 'Lost Goats',
		desc: 'Miss out on getting some goats due to a Ninja Holidip',
		stats: 'See: Ninja Ritual Boost and Ninja Holiday Badge'
	});
	new Molpy.Badge({
		name: 'Microwave',
		desc: 'Automata Control level at least 1G',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Ultraviolet',
		desc: 'Automata Control level at least 1T',
		vis: 1
	});
	new Molpy.Badge({
		name: 'X Rays',
		desc: 'Automata Control level at least 30P',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Gamma Rays',
		desc: 'Automata Control level at least 10E',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Planck Limit',
		desc: 'Automata Control level at limit',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Below the Horizon',
		desc: 'The Highest Newpix Number is in Minus Worlds',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Forward to the Past',
		desc: 'Travel to a less negative Newpix',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Stuck in Reverse',
		desc: 'Travel to a more negative Newpix',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Panther Pelts',
		desc: 'Panther Rush at least 80',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Mach 1',
		desc: 'Panther Rush at least 1225',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Escape Velocity',
		desc: 'Panther Rush at least 40320',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Einstein Says No',
		desc: 'Panther Rush at the Limit',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Mega Ritual',
		desc: 'Ninja Ritual > 1M',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Tera Ritual',
		desc: 'Ninja Ritual > 1T',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Had Enough Ritual?',
		desc: 'Ninja Ritual > 1E',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Yearly Ritual',
		desc: 'Ninja Ritual > 365Y',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Wololololo Ritual',
		desc: 'Ninja Ritual > 1WW',
		vis: 1
	});
	new Molpy.Badge({
		name: 'The Ritual is worn out',
		desc: 'Ninja Ritual at the Limit',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Sleeping Dragon, Crouching Panther',
		desc: 'Crouching Dragon, Sleeping Panther > 468',
		stats: 'You may find this useful...',
		vis: 1
	});
	new Molpy.Badge({
		name: 'First Colonist',
		desc: 'Dragons have colonised a NP',
		vis: 1
	});
	new Molpy.Badge({
		name: 'There are two of them!',
		desc: 'Survive colonising when there are two opponents',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Found Something!',
		desc: 'Diggining Dragons have found their first treasure',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Wheee Diamonds',
		desc: 'Found a diamond',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Millionair',
		desc: 'Have a Million Gold',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Bill Gates',
		desc: 'Have more Gold than Bill has dollars', 
		vis: 1
	});
	new Molpy.Badge({
		name: 'GDP of the World',
		desc: 'Have more Gold than the World\'s GDP in dollars', 
		vis: 1
	});
	new Molpy.Badge({
		name: 'Enough to make a Star',
		desc: 'Have more Diamonds than the mass of the Sun in Carats',
		stats: 'Did you know there is probably more Diamond in the universe than sand!',
		vis: 1
	});
	new Molpy.Badge({
		name: 'What\'s the score?',
		desc: 'Lost more than 20 dragons in fights',
		vis: 1
	});
	new Molpy.Badge({
		name: 'That\'s gross',
		desc: 'Lost more than 144 dragons in fights',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Absolute Zero',
		desc: 'Traveled outside of Time',
		vis: 2
	});
	new Molpy.Badge({
		name: 'YouTube Star',
		desc: 'Taken an entirely unhealthy number of pictures of cats',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Master Debater',
		desc: 'Moved the goalpost at least 66 times',
		vis: 1
	});
	new Molpy.Badge({
		name: 'The Big Freeze',
		desc: '<i>If the density of the universe is less than the critical density, there isn’t enough gravitational pull to stop or reverse the outward expansion...</i>',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Started from the bottom, now we\'re here',
		desc: 'Enter TaTPix',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Time-traveling Alien Parasite',
		desc: 'Futilely attempt to change the future, over and over',
		vis: 1
	});
	new Molpy.Badge({
		name: 'And It Don\'t Stop',
		desc: 'Played the game as long after T** **d as before',
		vis: 1
	});
	new Molpy.Badge({
		name: 'Picky Taste',
		desc: 'You know exactly what kind of boosts you like',
		vis: 1
	});
/**************************************************************
 * Discoveries
 * 
 * These MUST go last: add any new badges BEFORE them!
 *************************************************************/
	Molpy.DiscoveriesStartAt = Molpy.BadgeN;

	Molpy.MakeSpecialBadge = function(args, kind) {
		new Molpy.Badge({
			name: Molpy.groupNames[kind][3] + ': ' + (args.np < 0 ? 'Minus ' : '') + args.name,
			alias: kind + args.np,
			np: args.np,
			desc: function(me) {
				var str = Molpy.groupNames[kind][4] + ': ' + args.desc + '<br><small>(in NP' + me.np + ')</small>';
				if(me.group == 'discov') {
					if(Molpy.Got('Memories Revisited')) {
						if(Molpy.newpixNumber != me.np) {
							str += '<br><input type="Button" onclick="Molpy.TTT(' + me.np + ',1)" value="Jump!"></input> (Uses '
								+ Molpify(Molpy.CalcJumpEnergy(me.np), 2) + ' Glass Chips)'
						}
						if(Molpy.Got('Magic Mirror') && Molpy.newpixNumber != -me.np) {
							str += '<br><div class="flip-horizontal"><input type="Button" onclick="Molpy.TTT(' + (-me.np)
								+ ',1)" value="Jump!"></input> to the other side (Uses '
								+ Molpify(Molpy.CalcJumpEnergy(-me.np), 2) + ' Glass Chips)</div>';
						}
					}
					if(Molpy.Got('SMM') && !(Molpy.Boosts['SMM'].power || Molpy.Boosts['SMF'].power
						&& Molpy.Boosts['SMF'].Making == me.np)	&& !Molpy.Earned('monums' + me.np) && !Molpy.Earned('diamm' + me.np)) {
						str += '<br><br>Sudo <input type="Button" onclick="Molpy.MakeSandMould(' + me.np
							+ ')" value="Make"></input> a mould from this Discovery, which can be filled with sand to create a Monument'
					}
				} else if(me.group == 'monums') {
					if(Molpy.Got('GMM') && !(Molpy.Boosts['GMM'].power || Molpy.Boosts['GMF'].power
						&& Molpy.Boosts['GMF'].Making == me.np) && !Molpy.Earned('monumg' + me.np) && !Molpy.Earned('diamm' + me.np)) {
						str += '<br><br>Sudo <input type="Button" onclick="Molpy.MakeGlassMould(' + me.np
							+ ')" value="Make"></input> a mould from this Sand Monument, which can be filled with glass to create a Glass Monument'
					}
					str += '<div id="img-monums' + me.np + '" class="npthumb" style="background-image:"></div>';
				} else if(me.group == 'monumg' && Molpy.Got('Muse') && Molpy.Boosts.Muse.power == me.np) {
					var np = math.floor(Molpy.newpixNumber);
					str += '<br>You are inspired to do this properly ' +
						'<input type=button value="Start" onclick="Molpy.Boosts.DMM.StartMould()"></input>' +
						'to make a Diamond Mould.  Making the mould will take '+Molpify(Molpy.Boosts.DMM.MouldCost(np))+
						' Diamonds (and ' + Molpify(Molpy.Boosts.DMM.MouldTime(np))+' mNP).<br>';
				} else if(me.group == 'diamm'){
					str += ' ' + Molpy.groupNames['diamm'][5];
				}
				return str;
			},
			earnFunction: args.earnFunction,
			visibility: args.visibility,
			group: kind
		});
	}
	
	Molpy.MakeQuadBadge = function(args) {
		Molpy.MakeSpecialBadge(args, 'discov');
		Molpy.MakeSpecialBadge(args, 'monums');
		Molpy.MakeSpecialBadge(args, 'monumg');
		Molpy.MakeSpecialBadge(args, 'diamm');
		if(args.np > 0) {
			args.np *= -1;
			Molpy.MakeQuadBadge(args);
		}
	}

	Molpy.CountDiscov = function() {
		var badges = Molpy.BadgesById
		var count = 0;
		for (var i = 0; i < badges.length; i++) {
			if (badges[i].group == 'discov') count++;
		}
		Molpy.totalDiscov = count;
	}
		
	Molpy.MakeQuadBadge({np:1,name:'In the Beginning',desc:'the first time we saw Megan and Cueball sitting by the sea'});
	Molpy.MakeQuadBadge({np:16,name:'Dip',desc:'when Cueball dipped his toe in the fluid'});
	Molpy.MakeQuadBadge({np:25,name:'Start of Construction',desc:'when Megan began building the first castle'});
	Molpy.MakeQuadBadge({np:34,name:'One Done',desc:'the first Sandcastle\'s completion'});
	Molpy.MakeQuadBadge({np:50,name:'Barrier',desc:'completion of the first wall'});
	Molpy.MakeQuadBadge({np:52,name:'First Parting Words',desc:'the first words were spoken, and Cueball left'});
	Molpy.MakeQuadBadge({np:75,name:'He Returns',desc:'when Cueball came back'});
	Molpy.MakeQuadBadge({np:88,name:'Silent Exit',desc:'when Megan left without a word'});
	Molpy.MakeQuadBadge({np:103,name:'The Fall of Man',desc:'when Cueball fell down and damaged the castle'});
	Molpy.MakeQuadBadge({np:124,name:'Abandonment',desc:'when Cueball left us with no one to watch'});
	Molpy.MakeQuadBadge({np:137,name:'So That\'s What They\'re up to',desc:'our first glimpse of the second castle'});
	Molpy.MakeQuadBadge({np:143,name:'As According to the Prophesy',desc:'the prophesied newpix came to pass'});
	Molpy.MakeQuadBadge({np:146,name:'Been Busy',desc:'when we first saw Megan working on the second castle'});
	Molpy.MakeQuadBadge({np:158,name:'There he is!',desc:'when we finally saw Cueball working on the second castle too'});
	Molpy.MakeQuadBadge({np:161,name:'Amu<span class="faded">semen</span>t Castle',desc:'when we wondered what this castle was made of'});
	Molpy.MakeQuadBadge({np:170,name:'Wanna Swim?',desc:'the second text ever, and the first "Yeah"'});
	Molpy.MakeQuadBadge({np:175,name:'You OK?',desc:'the time that Megan got some in her mouth and the third text appeared'});
	Molpy.MakeQuadBadge({np:177,name:'Gone to Clean Up',desc:'when Megan had left for the second time'});
	Molpy.MakeQuadBadge({np:179,name:'Better Go Too',desc:'when Cueball also left'});
	Molpy.MakeQuadBadge({np:210,name:'That Looks Grand',desc:'when Cueball completed the bridge connecting the two castles together'});
	Molpy.MakeQuadBadge({np:211,name:'Shake It Off',desc:'when Cueball shook the sand off his hands'});
	Molpy.MakeQuadBadge({np:212,name:'Didn\'t See that Coming',desc:'when something flew through the air towards Cueball from behind'});
	Molpy.MakeQuadBadge({np:213,name:'Surprise Attack',desc:'the moment Cueball realised he was under fire'});
	Molpy.MakeQuadBadge({np:214,name:'Cornered',desc:'when the corner was knocked off the bridge'});
	Molpy.MakeQuadBadge({np:218,name:'Trebuchet',desc:'when the trebuchet was finaly completely visible'});
	Molpy.MakeQuadBadge({np:219,name:'Liftoff',desc:'the moment we saw Megan fire the trebuchet'});
	Molpy.MakeQuadBadge({np:221,name:'KO\'d',desc:'when Megan knocked out part of the bridge'});
	Molpy.MakeQuadBadge({np:224,name:'Joy!',desc:'Megan throwing her arms up as Cueball launched the trebuchet'});
	Molpy.MakeQuadBadge({np:232,name:'Take Cover!',desc:'when Cuegan jumped for cover after firing the trebuchet almost vertically'});
	Molpy.MakeQuadBadge({np:260,name:'Shake it Out',desc:'the time when Megan woke up and shook the sand out of her hair'});
	Molpy.MakeQuadBadge({np:308,name:'Wave',desc:'when Cuegan wave to one another after Cueball came back from a long absence'});
	Molpy.MakeQuadBadge({np:309,name:'Whoops!',desc:'the time that Megan slipped off the sand mound she had built'});
	Molpy.MakeQuadBadge({np:320,name:'Sentences',desc:'when the fourth text appeared, in which a question was asked about the whereabouts of the river'});
	Molpy.MakeQuadBadge({np:376,name:'Clearly Recursion',desc:'when it became visible that Cueball was building a scale model of the castles'});
	Molpy.MakeQuadBadge({np:390,name:'Investigation',desc:'the time that Cueball took a break to have a closer look at the fluid'});
	Molpy.MakeQuadBadge({np:402,name:'Tiny',desc:'Megan holding up something very tiny'});
	Molpy.MakeQuadBadge({np:403,name:'D\'awwwwwwww!',desc:'when we got a very close up of Megan holding the world\'s cutest trebuchette'});
	Molpy.MakeQuadBadge({np:408,name:'Lack of Understanding',desc:'the fifth text, in which Megan does not understand what the sea is doing'});
	Molpy.MakeQuadBadge({np:414,name:'Been Fun',desc:'the sixth text, in which Cueball does not think they can build it much taller'});
	Molpy.MakeQuadBadge({np:421,name:'The First Pole',desc:'when Megan brought the first pole'});
	Molpy.MakeQuadBadge({np:451,name:'Breath Easy',desc:'when Megan finished lifting the first pole into position and had a chance to catch her breath'});
	Molpy.MakeQuadBadge({np:460,name:'Legs in Place',desc:'when all four poles had been raised to their positions'});
	Molpy.MakeQuadBadge({np:466,name:'Heave!',desc:'when Cuegan were pulling the first bit of scaffolding up by rope'});
	Molpy.MakeQuadBadge({np:469,name:'Ladder',desc:'when we first saw a ladder'});
	Molpy.MakeQuadBadge({np:472,name:'Climb',desc:'the time when Megan first climbed a ladder'});
	Molpy.MakeQuadBadge({np:486,name:'The Tasting',desc:'the moment Cueball took a sip'});
	Molpy.MakeQuadBadge({np:487,name:'The Spit',desc:'the moment Cueball forcefully ejected the fluid from his mouth'});
	Molpy.MakeQuadBadge({np:488,name:'More Spitting',desc:'when Cueball said Yuck'});
	Molpy.MakeQuadBadge({np:490,name:'Worse',desc:'the moment we learned that Cueball has had worse'});
	Molpy.MakeQuadBadge({np:524,name:'Connected',desc:'when the two sides of the scaffolding were joined'});
	Molpy.MakeQuadBadge({np:562,name:'Not this Fast',desc:'when Cuegan discussed the sea level rising and falling, on the mostly built observation platform'});
	Molpy.MakeQuadBadge({np:563,name:'Solemn Chant',desc:'in which we encounter the words which shaped OTTer speech forever: "The River Is Small. The Sea is Big."'});
	Molpy.MakeQuadBadge({np:583,name:'Bucket',desc:'when Cueball brought a bucket'});
	Molpy.MakeQuadBadge({np:623,name:'Castling',desc:'the moment Cueball finished building the Rooks'});
	Molpy.MakeQuadBadge({np:632,name:'Flagging',desc:'when Cueball put flags on the Rooks'});
	Molpy.MakeQuadBadge({np:637,name:'Questioning',desc:'when Megan wondered if it rained on the sea, as they stood on the observation platform'});
	Molpy.MakeQuadBadge({np:638,name:'Waste',desc:'when Cueball shared his feelings about hypothetical rain on the sea'});
	Molpy.MakeQuadBadge({np:640,name:'Hills',desc:'the time that the hills were first mentioned, as the origin of the river'});
	Molpy.MakeQuadBadge({np:641,name:'<i>Other</i> Rivers?',desc:'when Cueball wondered about other rivers, as Megan attached a rope to a pole'});
	Molpy.MakeQuadBadge({np:653,name:'Next Level',desc:'when Cuegan finished lifting the next horizontal piece above the platform'});
	Molpy.MakeQuadBadge({np:659,name:'Must',desc:'when Cueball declared the necessity of other rivers to prevent the sea from drying up'});
	Molpy.MakeQuadBadge({np:661,name:'<i>Anything</i>',desc:'when Megan and Cueball discuss not knowing how things work'});
	Molpy.MakeQuadBadge({np:673,name:'This should work',desc:'when Megan started a bucket ride'});
	Molpy.MakeQuadBadge({np:674,name:'So Far So Good',desc:'Megan riding up in a bucket'});
	Molpy.MakeQuadBadge({np:675,name:'Aaaaaaaaaaaaaa',desc:'the instant of Megan\'s fall off the bucket'});
	Molpy.MakeQuadBadge({np:792,name:'Nap',desc:'when Megan took a nap on the platform after finishing the Top Castle'});
	Molpy.MakeQuadBadge({np:799,name:'Third Character',desc:'the initial appearance of LaPetite'});
	Molpy.MakeQuadBadge({np:802,name:'Short Stay',desc:'when LaPetite left, having made a big impression on our hearts'});
	Molpy.MakeQuadBadge({np:806,name:'Megan Up!',desc:'when Megan Molpies Up, though we had no idea it was called that at the time'});
	Molpy.MakeQuadBadge({np:812,name:'Retrieval',desc:'Megan picking up the fallen flag'});
	Molpy.MakeQuadBadge({np:814,name:'Relecation',desc:'Megan putting the fallen flag in a new place'});
	Molpy.MakeQuadBadge({np:825,name:'That Should Hold it',desc:'when Megan left the newly-built sand barrier which she made from a bridge'});
	Molpy.MakeQuadBadge({np:828,name:'Pair',desc:'when Cuegan returned together'});
	Molpy.MakeQuadBadge({np:832,name:'Worry',desc:'Megan suggesting that the sea won\'t stop'});
	Molpy.MakeQuadBadge({np:833,name:'Whatever it Wants',desc:'when we learned that the sea can do whatever it wants, even make more of itself forever'});
	Molpy.MakeQuadBadge({np:834,name:'Yeah',desc:'when Megan agreed that there\'s a reason for everything'});
	Molpy.MakeQuadBadge({np:835,name:'Reason',desc:'Megan pointing out that the reason for something isn\'t always a <b>good</b> one'});
	Molpy.MakeQuadBadge({np:838,name:'Maybe',desc:'when Cueball suggested that there may be something wrong with the other rivers'});
	Molpy.MakeQuadBadge({np:845,name:'Extra flags',desc:'Megan bringing some more flags for the top castle'});
	Molpy.MakeQuadBadge({np:855,name:'I Like Our Castle',desc:'Megan\'s declaration after placing more flags'});
	Molpy.MakeQuadBadge({np:856,name:'Wet Blanket',desc:'when Cueball made a dire prediction about the fate of their castle'});
	Molpy.MakeQuadBadge({np:857,name:'Just Yeah',desc:'when Megan had only one word of reply to Cueball\'s doomsaying'});
	Molpy.MakeQuadBadge({np:859,name:'Logical',desc:'when Cueball explained his reasoning behind the conclusion of other rivers existing'});
	Molpy.MakeQuadBadge({np:860,name:'Overflow',desc:'Megan\'s alternate theory for the rising sea'});
	Molpy.MakeQuadBadge({np:861,name:'Speculation Abounds',desc:'Cueball suggests another theory and admits a lack of knowledge'});
	Molpy.MakeQuadBadge({np:862,name:'Yeah Again',desc:'Megan continues the laconic trend'});
	Molpy.MakeQuadBadge({np:864,name:'Best Idea Ever',desc:'the critical moment when Megan suggested finding out why the sea was rising and Cueball immediately agreed'});
	Molpy.MakeQuadBadge({np:865,name:'Bags',desc:'when Megan went to get bags'});
	Molpy.MakeQuadBadge({np:875,name:'Laden',desc:'Megan returning with a bag'});
	Molpy.MakeQuadBadge({np:878,name:'Finishing Touch',desc:'the moment Megan added one last flag to the castle'});
	Molpy.MakeQuadBadge({np:881,name:'Basement For You!',desc:'Megan saying <small>bye</small>'});
	Molpy.MakeQuadBadge({np:925,name:'Crumbling',desc:'when part of the castle fell into the liquid'});
	Molpy.MakeQuadBadge({np:951,name:'She Returns',desc:'the brief moment in The Fading when LaPetite returned, and there was much rejoicing'});
	Molpy.MakeQuadBadge({np:969,name:'She Returns Again',desc:'LaPetite\'s second return, hardly visible due to The Fading'});
	Molpy.MakeQuadBadge({np:970,name:'What a Drag',desc:'when we saw (with enhancement) that LaPetite was dragging something to the castle'});
	Molpy.MakeQuadBadge({np:971,name:'All Gone',desc:'the completion of The Fading'});
	Molpy.MakeQuadBadge({np:972,name:'New Ground',desc:'when we saw a completely new scene'});
	Molpy.MakeQuadBadge({np:973,name:'Walkers',desc:'the first time we saw Cuegan walking on their journey'});	
	//the next bunch were written by waveney (thanks!)
	Molpy.MakeQuadBadge({np:985,name:'This Far',desc:'when Cueball asks whether Megan has ever been this far'});
	Molpy.MakeQuadBadge({np:989,name:'Drinking',desc:'Cueball and Megan stop to drink'});
	Molpy.MakeQuadBadge({np:999,name:'Change Direction',desc:'when the picture changes orientation by 90 degrees'});
	Molpy.MakeQuadBadge({np:1004,name:'Doesn\'t end',desc:'Megan says: Maybe the sea doesn\'t end.'});
	Molpy.MakeQuadBadge({np:1005,name:'Very Far',desc:'Cueball says: We haven\'t walked very far.'});
	Molpy.MakeQuadBadge({np:1006,name:'Not Ending',desc:'Megan doth say: Yeah.  But that\'s what the first part of not ending looks like.'});
	Molpy.MakeQuadBadge({np:1018,name:'Steam bottle',desc:'Megan says: If we don\'t find something today, we\'ll have to start using the steam bottle.'});
	Molpy.MakeQuadBadge({np:1024,name:'Yes',desc:'"Yes." "Yes what?"'});
	Molpy.MakeQuadBadge({np:1025,name:'Other Rivers',desc:'Megan says: "There are other rivers."'});
	Molpy.MakeQuadBadge({np:1029,name:'Dropped',desc:'Cueball drops his bottle in the river'});
	Molpy.MakeQuadBadge({np:1036,name:'Lasso',desc:'Cueball attempts to lasso the bottle'});
	Molpy.MakeQuadBadge({np:1038,name:'Lasso 2',desc:'Megan attempts to lasso the bottle'});
	Molpy.MakeQuadBadge({np:1041,name:'Too Dangerous',desc:'"Maybe I could -"  "Too dangerous."'});
	Molpy.MakeQuadBadge({np:1042,name:'Accident',desc:'Megan: It\'s OK, it was an accident.'});
	Molpy.MakeQuadBadge({np:1044,name:'Right',desc:'Megan say Cueball is right!'});
	Molpy.MakeQuadBadge({np:1045,name:'Not Fast',desc:'This river\'s <i>not</i> moving very fast.'});
	Molpy.MakeQuadBadge({np:1049,name:'Not Enough',desc:'Megan: I don\'t think it\'s enough water.'});
	Molpy.MakeQuadBadge({np:1052,name:'Not Broken',desc:'Cueball: And this river doesn\'t <i>look</i> broken.'});
	Molpy.MakeQuadBadge({np:1053,name:'Pretty Neat',desc:'Cueball: It\'s pretty neat though.'});
	Molpy.MakeQuadBadge({np:1058,name:'Sorry',desc:'Cueball says sorry'});
	Molpy.MakeQuadBadge({np:1066,name:'Still Rising',desc:'Megan: It\'s still rising.'});
	Molpy.MakeQuadBadge({np:1067,name:'Strange',desc:'The sea couldn\'t wait.'});
	Molpy.MakeQuadBadge({np:1069,name:'Find a ford',desc:'Megan: Walk upriver to find a ford or turn back?'});
	Molpy.MakeQuadBadge({np:1071,name:'Understand Everything',desc:'Cueball: We don\'t understand everything yet.'});
	Molpy.MakeQuadBadge({np:1072,name:'Understand Anything',desc:'Megan: Everything is a little ambitious.  We barely understand <i>anything</i>.'});
	Molpy.MakeQuadBadge({np:1073,name:'First Part',desc:'Cueball: But that\'s what the first part of understanding everything looks like.'});
	Molpy.MakeQuadBadge({np:1093,name:'Ours at its driest',desc:'Cueball: I\'m glad we found this river.'});
	Molpy.MakeQuadBadge({np:1096,name:'Bigger',desc:'Megan: This river is even bigger than it looked.'});
	Molpy.MakeQuadBadge({np:1123,name:'Fill the Sea',desc:'Megan: Maybe it <i>is</i> big enough to fill the sea.'});
	Molpy.MakeQuadBadge({np:1130,name:'Rope',desc:'Cueball: Our rope isn\'t strong enough.'});
	Molpy.MakeQuadBadge({np:1131,name:'Hold this',desc:'Cueball: Hold this or you\'ll fall.'});
	Molpy.MakeQuadBadge({np:1142,name:'Stuff',desc:'Cueball: Our river fills with stuff.'});
	Molpy.MakeQuadBadge({np:1143,name:'This river',desc:'Cueball: This river doesn\'t look like that.'});
	Molpy.MakeQuadBadge({np:1144,name:'Empty places',desc:'Megan: Maybe it only flows through empty places.'});
	Molpy.MakeQuadBadge({np:1146,name:'Continue',desc:'They continue upriver'});
	Molpy.MakeQuadBadge({np:1159,name:'How High',desc:'Megan: I wonder how high the water is now.'});
	Molpy.MakeQuadBadge({np:1160,name:'Been days',desc:'Megan: Not a lot of us by the shore this time of year.'});
	Molpy.MakeQuadBadge({np:1161,name:'Tents get wet',desc:'Megan: It\'d have to rise a lot higher before any tents got wet.'});
	Molpy.MakeQuadBadge({np:1178,name:'Bigger Hills',desc:'Cueball: This river flows from bigger hills than ours.'});
	Molpy.MakeQuadBadge({np:1179,name:'Crossing soon',desc:'Cueball: If we don\'t reach a crossing soon, we\'ll be in them.'});
	Molpy.MakeQuadBadge({np:1181,name:'Cliff',desc:'Looking over a cliff to the river'});
	Molpy.MakeQuadBadge({np:1184,name:'Swim in',desc:'Megan: I wonder if it\'s <i>possible</i> to swim in.'});
	Molpy.MakeQuadBadge({np:1212,name:'You OK',desc:'Megan asks, "You OK?"'});
	Molpy.MakeQuadBadge({np:1213,name:'Just Thinking',desc:'Cueball is just thinking'});
	Molpy.MakeQuadBadge({np:1218,name:'Follow river',desc:'Megan: Should we follow the river through there?'});
	Molpy.MakeQuadBadge({np:1219,name:'Over those',desc:'Cueball: Lets see if we can go over those and rejoin it further up.'});
	Molpy.MakeQuadBadge({np:1233,name:'Windier',desc:'Megan: It must get windier up here.'});
	Molpy.MakeQuadBadge({np:1261,name:'Bigger Dunes',desc:'Cueball: These are bigger than they looked'});
	Molpy.MakeQuadBadge({np:1265,name:'Megan Falls',desc:'Megan falls when dune surfing'});
	Molpy.MakeQuadBadge({np:1276,name:'Raptor',desc:'First raptor spotted (a swift)'});
	Molpy.MakeQuadBadge({np:1338,name:'Treeish',desc:'The First tree - Neat!'});
	Molpy.MakeQuadBadge({np:1343,name:'River Further',desc:'Megan: The river isn\'t much further...'});
	Molpy.MakeQuadBadge({np:1353,name:'Second Raptor',desc:'Second Raptor (unidentified)'});
	Molpy.MakeQuadBadge({np:1363,name:'Berries Picked',desc:'Cueball picks some berries'});
	Molpy.MakeQuadBadge({np:1368,name:'Sticks',desc:'Cueball finds the first traces of people'});
	Molpy.MakeQuadBadge({np:1378,name:'Berries Eaten',desc:'Cueball gives berries to Megan'});
	Molpy.MakeQuadBadge({np:1380,name:'Campsite',desc:'Cueball: There are people here.  Or were.  I found some sort of campsite.'});
	Molpy.MakeQuadBadge({np:1381,name:'Recent?',desc:'Megan asks if is recent; Cueball says it has been empty for a while'});
	Molpy.MakeQuadBadge({np:1383,name:'Thirsty',desc:'They go to the river'});
	Molpy.MakeQuadBadge({np:1386,name:'Left Behind?',desc:'They discuss what is in the camp'});
	Molpy.MakeQuadBadge({np:1396,name:'Ibises',desc:'Ibises are seen eating in the damp ground'}); // '"Ibises is the current plural according to Wikipedia" - According to waveney' - According to ED
	Molpy.MakeQuadBadge({np:1398,name:'Ibises Fly',desc:'The Ibises fly away as they approach'});
	Molpy.MakeQuadBadge({np:1407,name:'Beautiful',desc:'They agree the place is beautiful'});
	Molpy.MakeQuadBadge({np:1408,name:'No People',desc:'Megan: I\'m surprised we haven\'t been seen by any people yet.'});
	Molpy.MakeQuadBadge({np:1409,name:'Live Here',desc:'Megan: If it\'s this empty, <i>we</i> should live here.'});
	Molpy.MakeQuadBadge({np:1412,name:'Tasting Better',desc:'Cueball: Did you notice the sea tasting <i>better</i>?'});
	Molpy.MakeQuadBadge({np:1413,name:'Taste Seawater',desc:'Megan: I don\'t know. I try <i>not</i> to taste seawater.  Why?'});
	Molpy.MakeQuadBadge({np:1414,name:'Get Fresher',desc:'Cueball says the sea should get fresher'});
	Molpy.MakeQuadBadge({np:1415,name:'Tasted Fresher',desc:'Cueball says it was a litle fresher before they left'});
	Molpy.MakeQuadBadge({np:1416,name:'Extra water',desc:'Megan: Probably. I mean, how high was the sea then?  The extra water couldn\'t have been more than a tiny part of it.'});
	Molpy.MakeQuadBadge({np:1419,name:'We may as well continue',desc:'Cueball says they should continue - either to figure the sea or to keep finding beautiful places'});
	Molpy.MakeQuadBadge({np:1420,name:'Sounds fun',desc:'Megan: That sounds fun.'});
	Molpy.MakeQuadBadge({np:1434,name:'Ribbit hole',desc:'Megan falls due to a ribbit hole'});
	Molpy.MakeQuadBadge({np:1437,name:'I Found A-',desc:'Megan sitting up and explaining'});
	Molpy.MakeQuadBadge({np:1438,name:'Cueball Helps',desc:'Cueball helps Megan up'});
	Molpy.MakeQuadBadge({np:1458,name:'Beesnake',desc:'Megan looks at the Beesnake'});
	Molpy.MakeQuadBadge({np:1476,name:'Campsite 2',desc:'They find a second campsite'});
	Molpy.MakeQuadBadge({np:1495,name:'<small>Oof</small>',desc:'Megan: Oof.'});
	Molpy.MakeQuadBadge({np:1497,name:'Megan\'s OK',desc:'Megan says she is ok'});
	Molpy.MakeQuadBadge({np:1502,name:'Wow',desc:'Megan looks out and says "Wow."'});
	Molpy.MakeQuadBadge({np:1503,name:'Baobabs',desc:'Baobab trees'});
	Molpy.MakeQuadBadge({np:1510,name:'Baobabs close',desc:'They look up close to the first Baobab'});
	Molpy.MakeQuadBadge({np:1513,name:'Markings on trunk',desc:'They find markings on the Baobab'});
	Molpy.MakeQuadBadge({np:1514,name:'Wonder what they mean',desc:'They can\'t understand the markings'});
	Molpy.MakeQuadBadge({np:1525,name:'The bent Baobab',desc:'Megan: I wonder if it\'s supposed to be like that.'});
	Molpy.MakeQuadBadge({np:1526,name:'Knows what it\'s doing',desc:'Cueball: It\'s a pretty big tree.  It probably knows what it\'s doing.'});
	Molpy.MakeQuadBadge({np:1552,name:'First Grapevine',desc:'They look at the first grapevine'});
	Molpy.MakeQuadBadge({np:1557,name:'Take some grapes?',desc:'Cueball: Do you think it\'s OK to take some?'});
	Molpy.MakeQuadBadge({np:1558,name:'Yes take grapes',desc:'Megan: Yeah.  It doesn\'t look like anyone\'s been here for a while.'});
	Molpy.MakeQuadBadge({np:1587,name:'Examine campsite',desc:'They examine another abandoned campsite'});
	Molpy.MakeQuadBadge({np:1589,name:'Stuff floats down our river',desc:'Cueball: This looks like the stuff that floats down our river.'});
	Molpy.MakeQuadBadge({np:1590,name:'Hill People?',desc:'They wonder if they are related to the Hill people'});
	Molpy.MakeQuadBadge({np:1592,name:'Megans doubt',desc:'Megan: But the markings on that tree didn\'t look familiar'});
	Molpy.MakeQuadBadge({np:1594,name:'Cross with a raft',desc:'Megan: We could cross the river now.  We\'ve found more than enough wood for a raft.'});
	Molpy.MakeQuadBadge({np:1595,name:'Yeah',desc:'Cueball agrees with Megan'});
	Molpy.MakeQuadBadge({np:1598,name:'Almost Mountains',desc:'Cueball: We\'re almost in the mountains.'});
	Molpy.MakeQuadBadge({np:1600,name:'Learning Lots',desc:'Cueball: We walked along the sea for days and we didn\'t learn anything.  Up here we\'re learning lots.'});
	Molpy.MakeQuadBadge({np:1601,name:'Not why the sea rose',desc:'They still have not found out why the sea has risen'});
	Molpy.MakeQuadBadge({np:1602,name:'Food and water',desc:'Cueball: There\'s food and water here.  I don\'t want to go all the way back down, walk along the sea for a few more days, then have to turn around.'});
	Molpy.MakeQuadBadge({np:1603,name:'Answer every question',desc:'Cueball: Maybe the sea is too big to understand.  We can\'t answer every question'});
	Molpy.MakeQuadBadge({np:1604,name:'Answer <i>any</i> question',desc:'Megan: No.  But I think we can answer <i>any</i> question'});
	Molpy.MakeQuadBadge({np:1605,name:'No need to turn around',desc:'Megan: Still, I agree.  No need to turn around yet.'});
	Molpy.MakeQuadBadge({np:1606,name:'Neat mountains',desc:'Megan: And those mountains <i>do</i> look neat.'});
	Molpy.MakeQuadBadge({np:1608,name:'Stock up',desc:'Megan goes back for food, Cueball will get the water'});
	Molpy.MakeQuadBadge({np:1616,name:'Squirpy',desc:'Megan sees the squirpy'});
	Molpy.MakeQuadBadge({np:1617,name:'Hi, Squirpy',desc:'Megan says Hi to the squirpy'});
	Molpy.MakeQuadBadge({np:1622,name:'Won\'t eat you',desc:'Megan talks to the squirpy'});
	Molpy.MakeQuadBadge({np:1625,name:'Want some food?',desc:'Food is offered to the squirpy'});
	Molpy.MakeQuadBadge({np:1669,name:'Where are the people?',desc:'Cueball wonders where the people who used to tend the plants are'});
	Molpy.MakeQuadBadge({np:1686,name:'Playing with shadows',desc:'Cueball is playing with shadows'});
	Molpy.MakeQuadBadge({np:1687,name:'What are you doing?',desc:'Megan asks what Cueball is doing'});
	// rev. through here -Calamitizer
	Molpy.MakeQuadBadge({np:1688,name:'Cueball has been making shapes',desc:'He explains what he is doing'});
	Molpy.MakeQuadBadge({np:1689,name:'Weird shadows',desc:'Megan: When I stare down at mine for long enough while I walk, it starts to look really weird'});
	Molpy.MakeQuadBadge({np:1692,name:'Better than following the Sea',desc:'Megan drops a big clue as to what direction they were travelling when they started'});	
	Molpy.MakeQuadBadge({np:1707,name:'Pass it up',desc:'Bags are handed up from Cueball to Megan'});
	Molpy.MakeQuadBadge({np:1708,name:'Have a hand',desc:'Megan helps Cueball up the escarpment'});
	Molpy.MakeQuadBadge({np:1713,name:'Easier up here',desc:'Cueball: It\'s prettier right by the river but it\'s easier to wlak up here'});
	Molpy.MakeQuadBadge({np:1714,name:'Greener further up',desc:'Megan: Well, it all gets greener further up'});
	Molpy.MakeQuadBadge({np:1718,name:'Mountains are farther',desc:'Cueball: The mountains are further away than they looked'});
	Molpy.MakeQuadBadge({np:1739,name:'Snake!',desc:'Cueball sees a snake'});
	Molpy.MakeQuadBadge({np:1740,name:'Fall',desc:'Cueball falls on top of Megan'});
	Molpy.MakeQuadBadge({np:1742,name:'Are you OK?',desc:'Megan checks up on Cueball'});
	Molpy.MakeQuadBadge({np:1743,name:'I think so',desc:'He is OK'});
	Molpy.MakeQuadBadge({np:1744,name:'Bite you?',desc:'He hasn\'t been bitten'});
	Molpy.MakeQuadBadge({np:1745,name:'What kind?',desc:'Megan asks about the type of snake'});
	Molpy.MakeQuadBadge({np:1746,name:'Brownish and shiny, kind of blotchy',desc:'The snake is described'});
	Molpy.MakeQuadBadge({np:1747,name:'Spikes over eyes?',desc:'Megan asks if it has spikes over its eyes'});
	Molpy.MakeQuadBadge({np:1748,name:'Head and tail',desc:'Cueball: It was weird, stubby at both ends, like it forgot to have a head and tail'});
	Molpy.MakeQuadBadge({np:1749,name:'Hmm...',desc:'Megan ponders'});
	Molpy.MakeQuadBadge({np:1750,name:'Go around',desc:'Megan: No idea, but let\'s go around and watch your feet'});
	Molpy.MakeQuadBadge({np:1758,name:'No snakes',desc:'Megan checks a new way up'});
	Molpy.MakeQuadBadge({np:1793,name:'Looking Back',desc:'Megan keeps looking back'});
	Molpy.MakeQuadBadge({np:1795,name:'Almost see the sea',desc:'Megan: I think I can almost see the sea from here'});
	Molpy.MakeQuadBadge({np:1797,name:'Hard to tell',desc:'Cueball: I don\'t know.  It\'s hard to tell what\'s land and what\'s sky'});
	Molpy.MakeQuadBadge({np:1802,name:'Another Beesnake',desc:'Megan observes another beesnake'});
	Molpy.MakeQuadBadge({np:1821,name:'Cooler',desc:'Megan: It\'s cooler up here'});
	Molpy.MakeQuadBadge({np:1826,name:'Quiet chirps',desc:'Cueball: Are you hearing quiet chirps?'});
	Molpy.MakeQuadBadge({np:1828,name:'Not now',desc:'Cueball has stopped hearing them'});
	Molpy.MakeQuadBadge({np:1830,name:'Sky chirps',desc:'Megan: I heard chirps from the sky once'});
	Molpy.MakeQuadBadge({np:1831,name:'Stars and chirps',desc:'Megan says she heard chirping while looking at stars'});
	Molpy.MakeQuadBadge({np:1832,name:'Stars flicker',desc:'Megan thought she saw a few stars flicker'});
	Molpy.MakeQuadBadge({np:1837,name:'Chirp',desc:'A quiet chirp'});
	Molpy.MakeQuadBadge({np:1838,name:'Another Chirp',desc:'Another chirp - Megan looks up'});
	Molpy.MakeQuadBadge({np:1839,name:'Chirps ahead',desc:'Cueball: It\'s coming from up ahead'});
	Molpy.MakeQuadBadge({np:1840,name:'Chirp three',desc:'They investigate the chirps'});
	Molpy.MakeQuadBadge({np:1844,name:'Chirp in a tree',desc:'A Chirp is in a tree'});
	Molpy.MakeQuadBadge({np:1845,name:'Chirp in a tree 2',desc:'The sequel to chirp in a tree'});
	Molpy.MakeQuadBadge({np:1847,name:'Chirp in a tree 3',desc:'The Chirps in trees trilogy continues'});
	Molpy.MakeQuadBadge({np:1848,name:'Megan Chirps',desc:'Megan tries saying Chirp back'});
	Molpy.MakeQuadBadge({np:1849,name:'Chirp in a tree 4',desc:'The chirp trilogy part 4'});
	Molpy.MakeQuadBadge({np:1850,name:'Megan chirps again',desc:'This is getting repetative'});
	Molpy.MakeQuadBadge({np:1852,name:'Why is it chirping?',desc:'They wonder why it is chirping'});
	Molpy.MakeQuadBadge({np:1853,name:'Chirp in a tree 5',desc:'The fifth part of the trilogy'});
	Molpy.MakeQuadBadge({np:1854,name:'Angry',desc:'Megan: I guess it\'s angry that we\'re here'});
	Molpy.MakeQuadBadge({np:1855,name:'Chirp in a tree 6',desc:'The chirp trilogy part IV'});
	Molpy.MakeQuadBadge({np:1857,name:'Chirp in a tree 7',desc:'Another chirp, another raptor flying in'});
	Molpy.MakeQuadBadge({np:1859,name:'Chirp in a tree 8',desc:'Another chirp, the other raptor is closing in'});
	Molpy.MakeQuadBadge({np:1860,name:'Nearly There',desc:'Raptor close to Chirp'});
	Molpy.MakeQuadBadge({np:1862,name:'What\'s it doing?',desc:'Megan: What\'s it doing? Cueball: I think it gave it something '});
	Molpy.MakeQuadBadge({np:1863,name:'Oh Food',desc:'Megan: Oh! Food!  I bet the loud one is a baby'});
	Molpy.MakeQuadBadge({np:1864,name:'Chirp Chirp',desc:'2 chirps in a tree'});
	Molpy.MakeQuadBadge({np:1865,name:'Both Loud',desc:'Cueball: Now they\'re both loud'});
	Molpy.MakeQuadBadge({np:1866,name:'CHIRP',desc:'A loud Chirp'});
	Molpy.MakeQuadBadge({np:1867,name:'Not going to eat you',desc:'They say they are not eating them but are not believed'});
	Molpy.MakeQuadBadge({np:1868,name:'Protecting Baby',desc:'Megan: That\'s OK.  It\'s just protecting its baby'});
	Molpy.MakeQuadBadge({np:1869,name:'CHIRP again',desc:'The parent raptor give a loud chirp'});
	Molpy.MakeQuadBadge({np:1870,name:'Water ahead',desc:'Megan thinks she can see water up ahead'});
	Molpy.MakeQuadBadge({np:1874,name:'Doing a good job',desc:'Cueball: Don\'t worry!  You\'re doing a good job'});
	Molpy.MakeQuadBadge({np:1885,name:'Hi!',desc:'Megan: leaps from a tree saying Hi!'});
	Molpy.MakeQuadBadge({np:1886,name:'Splat!',desc:'Megan lands on Cueball!'});
	Molpy.MakeQuadBadge({np:1888,name:'Tiny River',desc:'Megan has found a tiny river'});
	Molpy.MakeQuadBadge({np:1890,name:'You OK?',desc:'Megan checks Cueball is OK'});
	Molpy.MakeQuadBadge({np:1917,name:'Facebug!',desc:'A beesnake lands on Megan'});
	Molpy.MakeQuadBadge({np:1918,name:'Mrrr Gbishx',desc:'Really'});
	Molpy.MakeQuadBadge({np:1926,name:'HEY!',desc:'Wake up'});
	Molpy.MakeQuadBadge({np:1927,name:'See what I found',desc:'Megan is excited'});
	Molpy.MakeQuadBadge({np:1928,name:'River Connected',desc:'Megan: This river is flowing toward the big one, so I followed it to see if they connected'});
	Molpy.MakeQuadBadge({np:1929,name:'Wait for it',desc:'They follow the stream'});
	Molpy.MakeQuadBadge({np:1932,name:'Wow',desc:'What has Cueball seen?'});
	Molpy.MakeQuadBadge({np:1933,name:'Definately WOW!',desc:'The excitement is justified'});
	Molpy.MakeQuadBadge({np:1934,name:'Yes WOW!',desc:'Look around, it is worth it'});
	Molpy.MakeQuadBadge({np:1935,name:'Keep looking',desc:'Its wowerful'});
	Molpy.MakeQuadBadge({np:1936,name:'Still worth it',desc:'The view is stunning'});
	Molpy.MakeQuadBadge({np:1938,name:'Land goes up',desc:'Megan:I guess the land goes up, but the river stays at the same level'});
	Molpy.MakeQuadBadge({np:1939,name:'River going up too',desc:'Megan: The river has been going up, too.  But not as fast as the land'});
	Molpy.MakeQuadBadge({np:1941,name:'Water wear away rock',desc:'Megan: can water really wear away rock like this?'});
	Molpy.MakeQuadBadge({np:1942,name:'I guess it can',desc:'Cueball: I guess it can'});
	Molpy.MakeQuadBadge({np:1944,name:'How long',desc:'Megan: I ca\'t imagine how long it must have taken'});
	Molpy.MakeQuadBadge({np:1945,name:'Yeah...',desc:'Cueball: Yeah...'});
	Molpy.MakeQuadBadge({np:1950,name:'Crumbly rocks',desc:'Cueball: A lot of these rocks are pretty crumbly'});
	Molpy.MakeQuadBadge({np:1951,name:'Sandy Rocks',desc:'Cueball: Even down there, between all the big rocks, the cliff walls look sandy.  Water eats away sand pretty fast'});
	Molpy.MakeQuadBadge({np:1953,name:'Yeah',desc:'Megan says Yeah.'});
	Molpy.MakeQuadBadge({np:1957,name:'How deep',desc:'Megan: I woder how deep it gets'});
	Molpy.MakeQuadBadge({np:1958,name:'Right through the mountain',desc:'Cueball: Maybe it goes right through the mountain, and it\'s as deep as the mountain is tall'});
	Molpy.MakeQuadBadge({np:1959,name:'Even deeper',desc:'Megan: It could be even deeper.  We don\'t know how far down the water goes'});
	Molpy.MakeQuadBadge({np:1960,name:'Hmm',desc:'Cueball: Hmm'});
	Molpy.MakeQuadBadge({np:1961,name:'Deeper than the sea',desc:'The discuss it can\'t be deeper than the sea'});
	Molpy.MakeQuadBadge({np:1962,name:'How would it get started',desc:'Megan: But then, a river couldn\'t cat all the way through aa mountain, either.  Because how would it get started'});
	Molpy.MakeQuadBadge({np:1964,name:'Top of a mountain',desc:'Megan: I wonder what the top of a mountain is like?'});
	Molpy.MakeQuadBadge({np:1966,name:'Find out',desc:'Cueball: Let\'s find out'});
	Molpy.MakeQuadBadge({np:2023,name:'Journey\'s End?',desc:'Cueball is pathetic'});
	Molpy.MakeQuadBadge({np:2024,name:'Easier Spot?',desc:'Can they do it?'});
	Molpy.MakeQuadBadge({np:2034,name:'OH!',desc:'Cueball spots Prickly'});
	Molpy.MakeQuadBadge({np:2045,name:'Careful!',desc:'Megan: Careful!, Cueball: It\'s OK'});
	Molpy.MakeQuadBadge({np:2048,name:'Pickly',desc:'Megan: Does it Hurt?  Cueball: It\'s a little prickly'});
	Molpy.MakeQuadBadge({np:2049,name:'Never this close',desc:'They discuss Prickly'});
	Molpy.MakeQuadBadge({np:2050,name:'Really Neat',desc:'Megan: It\'s really neat.'});
	Molpy.MakeQuadBadge({np:2051,name:'Stop Bothering',desc:'Cueball: OK, we\'ll stop bothering you'});
	Molpy.MakeQuadBadge({np:2063,name:'Prickly carries on',desc:'Prckly is no longer disturbed by them'});
	Molpy.MakeQuadBadge({np:2074,name:'Bop',desc:'Megan bops a seed head from a plant'});
	Molpy.MakeQuadBadge({np:2097,name:'You OK?',desc:'Megan stops, Cueball: You OK?'});
	Molpy.MakeQuadBadge({np:2098,name:'Yup!',desc:'Why did she stop?'});
	Molpy.MakeQuadBadge({np:2100,name:'Wet blanket again',desc:'Cueball: Maybe it\'s time to turn around'});
	Molpy.MakeQuadBadge({np:2101,name:'World is too big',desc:'Cueball: The world is too big.  It can go on longer than we can'});
	Molpy.MakeQuadBadge({np:2102,name:'Still going',desc:'Megan is continuing'});
	Molpy.MakeQuadBadge({np:2103,name:'Long way from home',desc:'Cueball: But one day we wo\'nt be.  And we\'re a long way from home'});
	Molpy.MakeQuadBadge({np:2105,name:'Cueball Questions',desc:'Cueball: Earlier I thought you wanted to turn around and go back to the sea'});
	Molpy.MakeQuadBadge({np:2106,name:'I want to understand',desc:'Megan: I don\'t want to go back to it.  I want to <i>Understand</i> it.'});
	Molpy.MakeQuadBadge({np:2108,name:'By Climbing?',desc:'Cueball: By Climbing? The Sea is down, not up'});
	Molpy.MakeQuadBadge({np:2114,name:'Beautiful Wings',desc:'Megan: These bugs have such beautifl wings'});
	Molpy.MakeQuadBadge({np:2115,name:'Thousand lifetimes',desc:'Megan gets philosophical'});
	Molpy.MakeQuadBadge({np:2118,name:'See the top',desc:'Megan: I wanna see the top'});
	Molpy.MakeQuadBadge({np:2119,name:'More world',desc:'Cueball: What do you think we\'ll find? Megan: More world, maybe different'});
	Molpy.MakeQuadBadge({np:2139,name:'Chomp',desc:'It may have had beautiful wings, now it\'s lunch'});
	Molpy.MakeQuadBadge({np:2154,name:'Bag throwing',desc:'They throw the bags up'});
	Molpy.MakeQuadBadge({np:2158,name:'Rope',desc:'Megan throws the rope down to help Cueball up'});
	Molpy.MakeQuadBadge({np:2166,name:'Weird',desc:'They look a weird broken tree'});
	Molpy.MakeQuadBadge({np:2171,name:'Pfffthh',desc:'It does not taste very good'});
	Molpy.MakeQuadBadge({np:2182,name:'Oh!',desc:'Megan sees a rock cain'});
	Molpy.MakeQuadBadge({np:2196,name:'Hut',desc:'They see the abandoned hut'}); 	
	Molpy.MakeQuadBadge({np:2202,name:'Hello?',desc:'Is there anybody in?'});
	Molpy.MakeQuadBadge({np:2205,name:'See Anything?',desc:'Megan looks in the hut'});
	Molpy.MakeQuadBadge({np:2206,name:'Stuff',desc:'Megan finds some funiture, shelves and a broken bowl'});
	Molpy.MakeQuadBadge({np:2215,name:'Oh Hey-',desc:'Megan has seen something'});
	Molpy.MakeQuadBadge({np:2216,name:'It\'s a stream',desc:'Megan: There\'s a stream back here'});
	Molpy.MakeQuadBadge({np:2217,name:'Something on top',desc:'Megan: And it almost looks like there\'s something on top of the mountain'});
	Molpy.MakeQuadBadge({np:2218,name:'Could be',desc:'Cueball: Hmm...  Could be'});
	Molpy.MakeQuadBadge({np:2221,name:'Sandcastles here',desc:'Cueball: I think whoever lived here liked building castles, too'});
	Molpy.MakeQuadBadge({np:2224,name:'Here',desc:'Cueball offers a flag for the sandcastle'});
	Molpy.MakeQuadBadge({np:2225,name:'You bought a flag',desc:'Megan: Oh! You broght a flag?  Cueball: Yeah, I-'});
	Molpy.MakeQuadBadge({np:2226,name:'<b><i>- LOOK OUT!</i></b>',desc:'What is that in the bushes?'});
	Molpy.MakeQuadBadge({np:2227,name:'Lucky Leaps',desc:'Cueball pulls Megan down'});
	Molpy.MakeQuadBadge({np:2228,name:'Attack!',desc:'Lucky attacks Cueball'});
	Molpy.MakeQuadBadge({np:2229,name:'CHOMP',desc:'Lucky is going for Cueball'});
	Molpy.MakeQuadBadge({np:2230,name:'Can Megan help',desc:'Is Cueball lunch?'});
	Molpy.MakeQuadBadge({np:2231,name:'Megan shouts',desc:'Hey! <i>Hey! <b>Over here!</b></i>'});
	Molpy.MakeQuadBadge({np:2232,name:'Thwapstick',desc:'Lucky Snarl\'s'});
	Molpy.MakeQuadBadge({np:2233,name:'Thwap again',desc:'Lucky: Hisss'});
	Molpy.MakeQuadBadge({np:2234,name:'Head shot',desc:'Megan hits lucky on the nut'});
	Molpy.MakeQuadBadge({np:2235,name:'Lucky Runs',desc:'Lucky makes break'});
	Molpy.MakeQuadBadge({np:2237,name:'Checking up',desc:'Megan: Are you OK? Cueball:I, um... I think so?'});
	Molpy.MakeQuadBadge({np:2238,name:'Claws',desc:'Megan: It didn\'t bite you?  Cueball: It had claws I saw them.  Megan: But you\'re not bleeding?'});
	Molpy.MakeQuadBadge({np:2239,name:'No?',desc:'Cueball is uninjured!'});
	Molpy.MakeQuadBadge({np:2240,name:'Bag saved Cueball',desc:'Cueball thinks the bag saved him'});
	Molpy.MakeQuadBadge({np:2241,name:'Lucky',desc:'They discuss lucky'});
	Molpy.MakeQuadBadge({np:2242,name:'Megan had hit Lucky',desc:'Megan: Yeah'});
	Molpy.MakeQuadBadge({np:2243,name:'Brave',desc:'Cueball: That was brave'});
	Molpy.MakeQuadBadge({np:2244,name:'Grabbed me',desc:'Megan: You grabbed me.  If you hadn\'t pulled me down and - Cueball: are <i>you</i> OK?'});
	Molpy.MakeQuadBadge({np:2245,name:'Megan is fine',desc:'Megan says she is fine'});
	Molpy.MakeQuadBadge({np:2246,name:'No, you\'re not',desc:'Cueball thinks otherwise'});
	Molpy.MakeQuadBadge({np:2247,name:'Hurt your Leg',desc:'Megan: What? Cueball: You hurt your leg'});
	Molpy.MakeQuadBadge({np:2248,name:'Banged it',desc:'Megan: No I just banged it on somethig when- Cueball: You\'re bleeding'});
	Molpy.MakeQuadBadge({np:2249,name:'Oh',desc:'Megan: What?  No, I - <i>OH</i>'});
	Molpy.MakeQuadBadge({np:2250,name:'Claw marks',desc:'There are claw marks on Megan'});
	Molpy.MakeQuadBadge({np:2252,name:'<small>Where is it</small>',desc:'Cueball is looking for something'});
	Molpy.MakeQuadBadge({np:2253,name:'Blood',desc:'Megan: This is a surprising amount of blood'});
	Molpy.MakeQuadBadge({np:2254,name:'Bandage needed',desc:'Cueball gives basiic first aid advice'});
	Molpy.MakeQuadBadge({np:2255,name:'Tear the Bag',desc:'Cueball thinks he could use the bag as bandage'});
	Molpy.MakeQuadBadge({np:2266,name:'Ruined flag',desc:'Megan: Sorry for ruining your flag'});
	Molpy.MakeQuadBadge({np:2267,name:'It\'s for you',desc:'Cueball: It\'s OK.  After all, I brought it for you'});
	Molpy.MakeQuadBadge({np:2268,name:'Thank you',desc:'Megan is humbled'});
	Molpy.MakeQuadBadge({np:2270,name:'Beautiful red',desc:'Megan like\'s it'});
	Molpy.MakeQuadBadge({np:2283,name:'Long Walk home',desc:'Megan says it\'s a long way to go home'});
	Molpy.MakeQuadBadge({np:2284,name:'Can you walk?',desc:'Cueball: Can you even walk?  How are you feeling?'});
	Molpy.MakeQuadBadge({np:2285,name:'Thirsty',desc:'Megan is thirsty'});
	Molpy.MakeQuadBadge({np:2290,name:'Does it hurt?',desc:'Cueball is checking up'});
	Molpy.MakeQuadBadge({np:2291,name:'It hurts',desc:'Megan: It didn\'t at first.  Now it does'});
	Molpy.MakeQuadBadge({np:2296,name:'Something on the mountain',desc:'Cueball: I think you\'re right.  There\'s some kind of structure on the mountain'});
	Molpy.MakeQuadBadge({np:2300,name:'Megan can walk',desc:'Megan: I think I can walk OK'});
	Molpy.MakeQuadBadge({np:2301,name:'Hurt more',desc:'It hurts but it doesn\'t really hurt more when I lean on it'});
	Molpy.MakeQuadBadge({np:2302,name:'Bad cut',desc:'Cueball says it could get worse'});
	Molpy.MakeQuadBadge({np:2303,name:'Need help',desc:'Cueball: We need help'});
	Molpy.MakeQuadBadge({np:2304,name:'Keep going up',desc:'Megan: Do you think we should keep going up?'});
	Molpy.MakeQuadBadge({np:2305,name:'People on top',desc:'Cueball: We can\'t be more than a day or so from the top.  There may be people there'});
	Molpy.MakeQuadBadge({np:2306,name:'Hill People?',desc:'Are they hill people?'});
	Molpy.MakeQuadBadge({np:2307,name:'Villages?',desc:'They discuss what is up the top'});
	Molpy.MakeQuadBadge({np:2308,name:'Farther from home',desc:'Megan gets philosophical'});
	Molpy.MakeQuadBadge({np:2309,name:'Decision time',desc:'Megan decides to go on - Yay!'});
	Molpy.MakeQuadBadge({np:2310,name:'Gentleman',desc:'Cueball says he will carry everything'});
	Molpy.MakeQuadBadge({np:2313,name:'Instructions',desc:'Cueball: You tell me if your leg starts hurting too much'});
	Molpy.MakeQuadBadge({np:2325,name:'Help you over',desc:'Cueball: I\'ll step in and help you over'});
	Molpy.MakeQuadBadge({np:2328,name:'<small>ow</small>',desc:'Having lept the stream Megan says a quiet ow'});
	Molpy.MakeQuadBadge({np:2339,name:'Molpy Alert',desc:'Something in the grass ahead'});
	Molpy.MakeQuadBadge({np:2344,name:'Colder Here',desc:'Megan: It\'s definitly colder up here'});
	Molpy.MakeQuadBadge({np:2354,name:'Not great',desc:'Megan is not feeling too good'});
	Molpy.MakeQuadBadge({np:2355,name:'Dangerous',desc:'They discuss dangerous creatures'});
	Molpy.MakeQuadBadge({np:2373,name:'Need sleep',desc:'As the sun goes down they agree they need sleep'});
	Molpy.MakeQuadBadge({np:2374,name:'Scary',desc:'Megan: It didn\'t seem scary before.  Pausing to sleep wherever we were'});
	Molpy.MakeQuadBadge({np:2376,name:'First watch',desc:'Cueball will take the first watch'});
	Molpy.MakeQuadBadge({np:2377,name:'Take a rest',desc:'Cueball: No, you need to rest.  I\'ll wake you if I get tired'});
	Molpy.MakeQuadBadge({np:2379,name:'Hit it',desc:'Megan: Or if something is trying to eat you, and you need me to hit it'});
	Molpy.MakeQuadBadge({np:2393,name:'Nighttime',desc:'This is the clue for 11,000 years in the future'}); 
	Molpy.MakeQuadBadge({np:2440.5,name:'METEOR!',desc:'Wow, it\'s a meteor!'});
	Molpy.MakeQuadBadge({np:2454,name:'Hey',desc:'Cueball wakes Megan'});
	Molpy.MakeQuadBadge({np:2455,name:'Wake Up',desc:'Megan is unenthusiastic'});
	Molpy.MakeQuadBadge({np:2456,name:'Your Turn',desc:'Next shift'});
	Molpy.MakeQuadBadge({np:2459,name:'All quiet?',desc:'Megan: All quiet?'});
	Molpy.MakeQuadBadge({np:2460,name:'Still Hurts',desc:'Cueball checks Megans health'});
	Molpy.MakeQuadBadge({np:2461,name:'Next Shift',desc:'Megan: But I got some rest.  Your turn now'});
	Molpy.MakeQuadBadge({np:2466,name:'Chirp at night',desc:'There is a chirp in the middle of the night'});// GLR is obviusly not a birder
	Molpy.MakeQuadBadge({np:2470,name:'Another Chirp at night',desc:'There is another chirp at night'});// Chirps would be associated with passerines which don't make noises at night
	Molpy.MakeQuadBadge({np:2471,name:'Do you hear that?',desc:'Megan should let sleeping Cueballs sleep'});
	Molpy.MakeQuadBadge({np:2472,name:'He did',desc:'Cueball: Yeah'});
	Molpy.MakeQuadBadge({np:2473,name:'What are they doing?',desc:'Cueball: I wonder what they\'re doing'});
	Molpy.MakeQuadBadge({np:2531,name:'Cueball awakes',desc:'Megan: Finally!'});
	Molpy.MakeQuadBadge({np:2532,name:'Long Sleep?',desc:'It\'s geting late and Megan is bored'});
	Molpy.MakeQuadBadge({np:2533,name:'Leg Check',desc:'Cueball: How\'s your leg?'});
	Molpy.MakeQuadBadge({np:2535,name:'Looks OK',desc:'Megan: Looks OK'});
	Molpy.MakeQuadBadge({np:2536,name:'Cueball has doubt',desc:'Cueball: It does?  Megan: Sure'});
	Molpy.MakeQuadBadge({np:2540,name:'Look for people',desc:'Megan: OK.  We get to the top.  We look for people'});
	Molpy.MakeQuadBadge({np:2541,name:'Plan B',desc:'Megan: If we don\'t see any, we start back home'});
	Molpy.MakeQuadBadge({np:2542,name:'Plans accepted',desc:'Cueball: Sounds Good'});
	Molpy.MakeQuadBadge({np:2553,name:'Neat',desc:'Rocky outcrop'});
	Molpy.MakeQuadBadge({np:2554,name:'Wonder what',desc:'Cueball: I wonder what it\'s for'});
	Molpy.MakeQuadBadge({np:2558,name:'Careful',desc:'Cueball helps Megan up'});
	Molpy.MakeQuadBadge({np:2561,name:'Huh',desc:'Cueball: Huh'});
	Molpy.MakeQuadBadge({np:2572,name:'Whats that!',desc:'So that was what was Neat'});
	Molpy.MakeQuadBadge({np:2579,name:'Other side',desc:'Cueball: I guess the mountains don\'t go back down on the other side'});
	Molpy.MakeQuadBadge({np:2586,name:'I found People',desc:'Megan: I found people'});
	Molpy.MakeQuadBadge({np:2587,name:'Where!?',desc:'Cueball: Where!?  Megan: Over there'});
	Molpy.MakeQuadBadge({np:2588,name:'Far away',desc:'Megan: It\'s far away. But do you see the dust?'});
	Molpy.MakeQuadBadge({np:2589,name:'Glinting',desc:'Megan has seen flashes of light and glinting'});
	Molpy.MakeQuadBadge({np:2591,name:'Not Far',desc:'Megan: It\'s not far.  We can reach them tonight'});
	Molpy.MakeQuadBadge({np:2592,name:'Walking painful?',desc:'Cueball: Good!  Is walking still not too painful?'});
	Molpy.MakeQuadBadge({np:2593,name:'Climbing hurt',desc:'Megan: Walking is OK.  Climbing hurt'});
	Molpy.MakeQuadBadge({np:2594,name:'Wanted to see',desc:'Cueball: You could have asked me to climb up here for you.  Megan: But I wanted to see'});
	Molpy.MakeQuadBadge({np:2595,name:'What that thing is?',desc:'Megan: Have you figured out what that thing is?'});
	Molpy.MakeQuadBadge({np:2596,name:'Hold something',desc:'Cueball: It looks like it\'s supposed to hold something'});
	Molpy.MakeQuadBadge({np:2597,name:'Weapon',desc:'Cueball: You can point it at things.  Maybe it\'s a weapon'});
	Molpy.MakeQuadBadge({np:2598,name:'Maybe',desc:'Megan is not convinced'});
	Molpy.MakeQuadBadge({np:2599,name:'Aimed at what?',desc:'Meagn: But why woul there be a weapon way up here?  What\'s it aimed at?'});
	Molpy.MakeQuadBadge({np:2600,name:'Lanched enough',desc:'Cueball: Right now you\'re pointing it at our home.  Haven\'t you launched enough things at our castle?  Megan: No'});
	Molpy.MakeQuadBadge({np:2609,name:'Our poor castle',desc:'Megan: Our poor castle.  I wonder what\'s left of it'});
	Molpy.MakeQuadBadge({np:2612,name:'Floating Bucket',desc:'A floating bucket'});
	Molpy.MakeQuadBadge({np:2628,name:'Another tower',desc:'Cueball: I think that\'s another tower'});
	Molpy.MakeQuadBadge({np:2629,name:'Megan agrees',desc:'Megan: I think so, too'});
	Molpy.MakeQuadBadge({np:2632,name:'Are you ok?',desc:'Megan <i>You</i> OK?'});
	Molpy.MakeQuadBadge({np:2633,name:'Rest a moment',desc:'Cueball: Yeah. I Just need to rest for a moment'});
	Molpy.MakeQuadBadge({np:2634,name:'Out of breath',desc:'They are not used being this high '});
	Molpy.MakeQuadBadge({np:2636,name:'Diferent air',desc:'Cueball: I wonder if the air up here is different'});
	Molpy.MakeQuadBadge({np:2637,name:'Cooler',desc:'Megan: Could be.  It\'s definitely cooler'});
	Molpy.MakeQuadBadge({np:2646,name:'On that hill!',desc:'Cueball: I can see someone on that hill!'});
	Molpy.MakeQuadBadge({np:2647,name:'Hellooo!',desc:'Megan: Oh yeah! <b>HEY! HELLOOO!!</b>'});
	Molpy.MakeQuadBadge({np:2648,name:'Still too far',desc:'Cueball: Still too far to hear'});
	Molpy.MakeQuadBadge({np:2650,name:'<b>HEY!</b>',desc:'Megan: <b>HEY!</b>'});
	Molpy.MakeQuadBadge({np:2652,name:'Seen us',desc:'Megan: Well, they\'ve seen us'});
	Molpy.MakeQuadBadge({np:2654,name:'Beanie!',desc:'The first beanie'});
	Molpy.MakeQuadBadge({np:2655,name:'Three Beanies',desc:'There are three of them'});
	Molpy.MakeQuadBadge({np:2657,name:'Megan asks for help',desc:'Megan: Hi.  We\'re from far away, and my leg is hurt.  Can you help us'});
	Molpy.MakeQuadBadge({np:2658,name:'Beanish!',desc:'Beanies talk Beanish'});
	Molpy.MakeQuadBadge({np:2660,name:'Huh.',desc:'Cueball: Huh.  Megan: Ok. Umm.'});
	Molpy.MakeQuadBadge({np:2661,name:'When words fail...',desc:'Megan shows the Beanies her injured leg.'});
	Molpy.MakeQuadBadge({np:2663,name:'Understanding',desc:'The Beanies seem to understand the problem and discuss it.'});
	Molpy.MakeQuadBadge({np:2666,name:'A Closer Look',desc:'Two of the Beanies take a closer look at Megan\'s leg.'});
	Molpy.MakeQuadBadge({np:2667,name:'Something',desc:'A Beanie returns carrying something.'});
	Molpy.MakeQuadBadge({np:2669,name:'I Wonder',desc:'Cueball: They seem to know what they\'re doing.  Megan: Yeah. I wonder what that is.'});
	Molpy.MakeQuadBadge({np:2670,name:'What is that?',desc:'Megan: That. What is that?'});
	Molpy.MakeQuadBadge({np:2671,name:'A Beanish explanation',desc:'The something turns out to be...something.'});
	Molpy.MakeQuadBadge({np:2672,name:'-ow-',desc:'Cueball: It\'s some kind of paste. Does it hurt?  Megan: Not-ow-Not Really.'});
	Molpy.MakeQuadBadge({np:2675,name:'All patched up',desc:'Megan: Um, thank you.'});
	Molpy.MakeQuadBadge({np:2676,name:'This way',desc:'The Beanies seem to want Cueball and Megan to follow them.'});
	Molpy.MakeQuadBadge({np:2681,name:'Another Tower',desc:'The Beanies have another tower.'});
	Molpy.MakeQuadBadge({np:2685,name:'Just water',desc:'Megan: It\'s just water.'});
	Molpy.MakeQuadBadge({np:2686,name:'Little Yawn',desc:'Cueball yawns.'});
	Molpy.MakeQuadBadge({np:2687,name:'The language barrier',desc:'Megan: How do we talk to them? We can figure this out.'});
	Molpy.MakeQuadBadge({np:2688,name:'From the sea',desc:'Megan: We\'re from down there. The sea. We\'re from the...'});
	Molpy.MakeQuadBadge({np:2689,name:'Big Yawn',desc:'Megan yawns even bigger than Cueball did.'});
	Molpy.MakeQuadBadge({np:2690,name:'Have to sleep',desc:'Megan: ...We\'re from the sea. We\'re from the sea and we have to sleep.'});
	Molpy.MakeQuadBadge({np:2692,name:'692 46',desc:'Pretty sure those aren\'t numbers.'});
	Molpy.MakeQuadBadge({np:2693,name:'Lights out',desc:'Darkness as Cueball and Megan sleep.'});
	Molpy.MakeQuadBadge({np:2697,name:'Two cups',desc:'Cueball and a Beanie grab a couple cups of water.'});
	Molpy.MakeQuadBadge({np:2703,name:'Cultural exchange',desc:'Cueball tries a little Beanish.'});
	Molpy.MakeQuadBadge({np:2704,name:'Biggest Yawn',desc:'Megan wakes up with a yawn.'});
	Molpy.MakeQuadBadge({np:2706,name:'A new word',desc:'Cueball: I learned a word. I think.  Megan: Oh?'});
	Molpy.MakeQuadBadge({np:2707,name:'"Water"',desc:'Cueball: *Beanish* "Water." Probably.'});
	Molpy.MakeQuadBadge({np:2709,name:'"Drink"',desc:'Cueball: Or "drink!"  Megan: Hmm.'});
	Molpy.MakeQuadBadge({np:2710,name:'A faster way',desc:'Megan: There must be a faster way to...'});
	Molpy.MakeQuadBadge({np:2711,name:'Revelation',desc:'Cueball has a revelation.'});
	Molpy.MakeQuadBadge({np:2713,name:'It\'s OK!',desc:'Megan assures the Beanie they mean no harm.'});
	Molpy.MakeQuadBadge({np:2715,name:'A picture\'s worth',desc:'Cueball draws in the dirt to communicate.'});
	Molpy.MakeQuadBadge({np:2717,name:'My turn',desc:'The Beanie adds to the drawing.'});
	Molpy.MakeQuadBadge({np:2720,name:'Motion picture',desc:'Cueball describes their journey with pictures.'});
	Molpy.MakeQuadBadge({np:2722,name:'Coinkydink',desc:'The one Beanish word Cueball knows just so happens to be very useful.'});
	Molpy.MakeQuadBadge({np:2723,name:'Gibberish',desc:'The Beanie talks more Beanish.'});
	Molpy.MakeQuadBadge({np:2724,name:'Failure to communicate',desc:'Unfortunately, Cueball and Megan didn\'t magically learn Beanish.'});
	Molpy.MakeQuadBadge({np:2727,name:'Why is that happening?',desc:'Megan: Yes! The sea is rising.  Cueball: Why is that happening?'});
	Molpy.MakeQuadBadge({np:2729,name:'More Beanish',desc:'Yup. There is a lot of it.'});
	Molpy.MakeQuadBadge({np:2731,name:'The sequel',desc:'Following Cueball\'s example, the Beanie uses the drawing to indicate further travel.'});
	Molpy.MakeQuadBadge({np:2732,name:'Going somewhere',desc:'Megan: They\'re going somewhere...  Cueball: and want us to come, too.'});
	Molpy.MakeQuadBadge({np:2733,name:'Languages',desc:'The Beanie indicates their two languages using circles and triangles.'});
	Molpy.MakeQuadBadge({np:2734,name:'Multilingual',desc:'A third figure seems to be able to speak many languages.'});
	Molpy.MakeQuadBadge({np:2735,name:'Speech!',desc:'Cueball: Oh, speech! There\'s someone we can talk to?'});
	Molpy.MakeQuadBadge({np:2736,name:'Trilogy',desc:'The Beanie draws the sun\'s path in the sky.'});
	Molpy.MakeQuadBadge({np:2737,name:'I get it',desc:'Cueball: I get it- It\'s less than a day away. Then let\'s do it.'});
	Molpy.MakeQuadBadge({np:2739,name:'Packing up',desc:'The Beanies start packing up their equipment.'});
	Molpy.MakeQuadBadge({np:2762,name:'Rabbit',desc:'A rabbit pops its head up.'});
	Molpy.MakeQuadBadge({np:2763,name:'See it?',desc:'A Beanie points out the rabbit.'});
	Molpy.MakeQuadBadge({np:2777,name:'Wildlife',desc:'A rabbit and beasnake roam in the bushes.'});
	Molpy.MakeQuadBadge({np:2789,name:'Beneath the leaves',desc:'The group sits down beneath a tree to eat.'});
	Molpy.MakeQuadBadge({np:2791,name:'Yum',desc:'Cueball: It\'s good, whatever it is.'});
	Molpy.MakeQuadBadge({np:2792,name:'Another new word',desc:'A Beanie offers up a new word.'});
	Molpy.MakeQuadBadge({np:2793,name:'Megan\'s turn',desc:'Megan: Huh, ok. *Beanish*'});
	Molpy.MakeQuadBadge({np:2797,name:'Recognition',desc:'More Beanish...but is one of those words familiar?'});
	Molpy.MakeQuadBadge({np:2798,name:'Zig-zags',desc:'A Beanie shows off an image.'});
	Molpy.MakeQuadBadge({np:2799,name:'Some kind of map',desc:'Megan: I heard "water."  Cueball: Is it some kind of a map?'});
	Molpy.MakeQuadBadge({np:2800,name:'Triangle things',desc:'Megan: I guess. But it\'s just a jumble of lines.  Cueball: Maybe those triangle things are rivers?'});
	Molpy.MakeQuadBadge({np:2801,name:'*Beanish*',desc:'Yet again.'});
	Molpy.MakeQuadBadge({np:2813,name:'City!',desc:'Cueball: Wow.  There\'s a whole <i>City</i> up there.'});
	Molpy.MakeQuadBadge({np:2814,name:'Gate',desc:'The city with children playing and Expando'});
	Molpy.MakeQuadBadge({np:2816,name:'Welcome',desc:'A beanie points something out'});
	Molpy.MakeQuadBadge({np:2818,name:'Greatings',desc:'Greatings are exchanged between a Beanie and Expando'});
	Molpy.MakeQuadBadge({np:2822,name:'Little Houses',desc:'Cueball likes the houses while a Beanie points something out to Megan'});
	Molpy.MakeQuadBadge({np:2823,name:'Oh Wow',desc:'Cueball: Oh.  Megan: Oh Wow.'});
	Molpy.MakeQuadBadge({np:2824,name:'Zoom out',desc:'Whats up the hill?'});
	Molpy.MakeQuadBadge({np:2825,name:'Zoom out more',desc:'The castle!'});
	Molpy.MakeQuadBadge({np:2826,name:'Real Castle',desc:'Megan: A real castle!  I never thought I\'d see a real castle!'});
	Molpy.MakeQuadBadge({np:2827,name:'Breathtaking',desc:'Cueball: I wasn\'t sure there were real castles.  Megan: Look at it.  It\'s breathtaking'});
	Molpy.MakeQuadBadge({np:2830,name:'Too Small',desc:'Megan: <small>Our castle was too small</small>'});
	Molpy.MakeQuadBadge({np:2831,name:'Come on',desc:'A Beanie urges them on'});
	Molpy.MakeQuadBadge({np:2836,name:'Beanette Greetings',desc:'Beanette exchanges greatings with a Beanie'});
	Molpy.MakeQuadBadge({np:2837,name:'Beanette greets Amtoo',desc:'Beanette is much more enthusiastic greeting Amtoo...'});
	Molpy.MakeQuadBadge({np:2840,name:'Gatehouse',desc:'They apprach the gatehouse'});
	Molpy.MakeQuadBadge({np:2842,name:'Down the steps',desc:'They go down the steps into the castle'});
	Molpy.MakeQuadBadge({np:2844,name:'Neat!',desc:'Megan says Neat! again'});
	Molpy.MakeQuadBadge({np:2846,name:'Great Hall',desc:'They enter the great hall'});
	Molpy.MakeQuadBadge({np:2851,name:'Door and steps up',desc:'At the far end of the hall is a door and steps up'});
	Molpy.MakeQuadBadge({np:2854,name:'Open the door',desc:'A Beanie opens the door'});
	Molpy.MakeQuadBadge({np:2858,name:'Rosetta says hello',desc:'Rosetta looks up and says hello'});
	Molpy.MakeQuadBadge({np:2859,name:'Greetings to Rosetta',desc:'Beanies greet Rosetta'});
	Molpy.MakeQuadBadge({np:2860,name:'Questions',desc:'Rosetta questions the beanies'});
	Molpy.MakeQuadBadge({np:2861,name:'Answers',desc:'Answers from Amtoo and another Beanie'});
	Molpy.MakeQuadBadge({np:2862,name:'Presenting',desc:'Cuegan are present to Rosetta'});
	Molpy.MakeQuadBadge({np:2863,name:'Understand Us?',desc:'Cueball: Hello!, Megan Do you understand us?'});
	Molpy.MakeQuadBadge({np:2865,name:'Somewhat',desc:'<span class=rosetta>Somewhat</span>'});
	Molpy.MakeQuadBadge({np:2867,name:'Understand you',desc:'Megan: I think we understand you, too!'});
	Molpy.MakeQuadBadge({np:2868,name:'Whence',desc:'<span class=rosetta>Whence have you t*aveled he*e</span>'});
	Molpy.MakeQuadBadge({np:2869,name:'From the Sea',desc:'Cueball: We came here up the mountain.  Megan: We\'re from the sea.'});
	Molpy.MakeQuadBadge({np:2870,name:'From the desert below?',desc:'Rosetta: <span class=rosetta>You arose here from the desrt below?  Npobody lives there.</span>'});
	Molpy.MakeQuadBadge({np:2872,name:'Didn\'t Understand',desc:'Megan: We, Um... We didn\'t quite understand that'});
	Molpy.MakeQuadBadge({np:2873,name:'Take 2',desc:'Rosetta: <span class=rosetta><b>I</b> am so**y. Your L**guage is *** those S**en by the ****fftoue  ***  But I learned it.</span>'});
	Molpy.MakeQuadBadge({np:2874,name:'Patience',desc:'Rosetta: <span class=rosetta>Please be patient</span> Cueball: Of course'});
	Molpy.MakeQuadBadge({np:2875,name:'Dismiss',desc:'Rosetta dismisses the beanies'});
	Molpy.MakeQuadBadge({np:2877,name:'Bye-bye',desc:'Beanies say bye-bye and leave'});
	Molpy.MakeQuadBadge({np:2878,name:'Understand Nothing',desc:'Rosetta: <span class=rosetta>They understand Nothing so they will tend to matters.</span> Megan: Of course'});
	Molpy.MakeQuadBadge({np:2879,name:'Your Bags',desc:'<span class=rosetta>Your Bags</span>'});
	Molpy.MakeQuadBadge({np:2880,name:'What for',desc:'Megan: What do you want our bags for?  Rosetta: <span class=rosetta>They a*e heavy</span>  Megan: ... Oh.  Thank you!'});
	Molpy.MakeQuadBadge({np:2885,name:'Thank you!',desc:'Cueball: Thank you!  Rosetta:<span class=rosetta>you a*e welcome</span>'});
	Molpy.MakeQuadBadge({np:2886,name:'Your Home',desc:'Rosetta: <span class=rosetta>Tell me where your home is</span>'});
	Molpy.MakeQuadBadge({np:2887,name:'Near a river',desc:'Megan: We live by the shore, near a river that flows down to the Sea every year.  Rosetta: <span class=rosetta>What River?</span>'});
	Molpy.MakeQuadBadge({np:2888,name:'Smaller River',desc:'Megan: It\'s a smaller river - not the one that flows your land.  We collect things that float down it'});
	Molpy.MakeQuadBadge({np:2889,name:'People in Hills',desc:'Cueball: There are people in the hills where our river comes from.  Megan: They don\'t like us'});
	Molpy.MakeQuadBadge({np:2890,name:'How many?',desc:'Rosetta: <span class=rosetta>H** many people **** are you?</span>'});
	Molpy.MakeQuadBadge({np:2891,name:'About Forty',desc:'Cueball: There are about forty of us.  Rosetta:<span class=rosetta>what is forty?  all my numbers are too small</span>.  Megan: Um. Four ten times.  Five eight times.  Rosetta: <span class=rosetta>Yes Good</span> '});
	Molpy.MakeQuadBadge({np:2892,name:'With you',desc:'<span class=rosetta>You carry these people with you?</span>'});
	Molpy.MakeQuadBadge({np:2893,name:'Here Alone',desc:'Megan: We came here alone, to find out why the sea is changing'});
	Molpy.MakeQuadBadge({np:2894,name:'You do not know!',desc:'Rosetta: <span class=rosetta>you do not know! I*********</span>'});
	Molpy.MakeQuadBadge({np:2895,name:'Stand Alone',desc:'Rosetta: <span class=rosetta>Your sea does not stand alone!  There is another sea ***** ****yond the **** it has be**** to *** *** evels differ  *** ows</span>'});
	Molpy.MakeQuadBadge({np:2896,name:'Megan Understands',desc:'Megan: No, I think I understand.  There\'s a second sea, a higher one, and its waters have started flowing into ours.  Cueball: Why? What connected them?  Megan: Yeah- what changed?'});
	Molpy.MakeQuadBadge({np:2897,name:'Hills Change',desc:'Rosetta: <span class=rosetta>In time even the hills change!  When people first **** and first bu***** ates the sea where joined but ***here was a great ******* and the passage was *** your sea ****** with to few rivers under the sun **shrank* **nd the water fe** the sea ha***nd a way back in.</span>'});
	Molpy.MakeQuadBadge({np:2898,name:'How different?',desc:'Cueball: ...How different are the sea\' heights?  How high will the water eventually rise?  Should we move our home?  Rosetta: <span class=rosetta>Do you know whe*e you a*e?</span>'});
	Molpy.MakeQuadBadge({np:2899,name:'No',desc:'Cueball: No.  Rosetta: <span class=rosetta>I\'ll *** build you a map to understanding</span>'});
	Molpy.MakeQuadBadge({np:2901,name:'Map!',desc:'You are here'});
	Molpy.MakeQuadBadge({np:2902,name:'This will be sea',desc:'Rosetta: <span class=rosetta>And this *our **lief  about the sea new shore</span>'});
	Molpy.MakeQuadBadge({np:2903,name:'Cover mountains?',desc:'Megan: The sea can cover mountains?'});
	Molpy.MakeQuadBadge({np:2904,name:'We Learned',desc:'Rosetta: <span class=rosetta></span>'});
	Molpy.MakeQuadBadge({np:2905,name:'***',desc:'Rosetta: <span class=rosetta>N***T *Sh****n?</span>'});
	Molpy.MakeQuadBadge({np:2907,name:'Shoreline',desc:'Megan: The shoreline goes right through where the castle is where we are right now'});
	Molpy.MakeQuadBadge({np:2908,name:'Island',desc:'Rosetta: <span class=rosetta>The castle once was an island!  We found it and have tried to rebuild it!</span>'});
	Molpy.MakeQuadBadge({np:2909,name:'****',desc:'Rosetta: <span class=rosetta>I supose ** be an *********!</span>'});
	Molpy.MakeQuadBadge({np:2910,name:'Who are you?',desc:'Cueball: Who are you?  Rosetta: <span class=rosetta>We are the learners.  This fortress is *** with **** and I am their leader</span>'});
	Molpy.MakeQuadBadge({np:2911,name:'Inside the sea',desc:'Megan: I still can\'t imagine it.  Every place we\'ve walked will someday be inside the sea.'});
	Molpy.MakeQuadBadge({np:2912,name:'Get Home',desc:'Megan: We need to get back home.  We need to get started on plans to move.  Can we have one of your maps?  That would help - ... are you ok?'});
	Molpy.MakeQuadBadge({np:2913,name:'Sorry',desc:'Rosetta: <span class=rosetta>I\'m Sorry</span> Cueball: What?'});
	Molpy.MakeQuadBadge({np:2914,name:'We Failed',desc:'Rosetta: <span class=rosetta>When we discovered the sea was coming under the bank we tried to shore it up.  We <b>Failed</b> we tried to remove everybody from the basin! But we did not know of your group</span>'});
	Molpy.MakeQuadBadge({np:2915,name:'No it\'s Ok!',desc:'Megan: No, it\'s Ok! I\'ve been thinking.  At the rate we saw the sea rising, it will take years to -, Rosetta: <span class=rosetta><b>NO!</b></span>'});
	Molpy.MakeQuadBadge({np:2916,name:'Days!',desc:'Rosetta: <span class=rosetta>As the waterflows, it widens the breach.  The Berm is giving way.  The sea will rush through in a *******T The planets mightiest river will once again come thundering down the mountainside.  The sea will fill not in years but in DAYS!</span>'});
	Molpy.MakeQuadBadge({np:2917,name:'Too Long',desc:'Rosetta: <span class=rosetta>The jo*ney to your land is much too long.  *** Not Send *** only sea **** encircled and drowned by the ***ide</span>'});
	Molpy.MakeQuadBadge({np:2918,name:'Too late',desc:'Rosetta: <span class=rosetta>The world you know is ending...</span>'});
	Molpy.MakeQuadBadge({np:2919,name:'Goodbyes from here',desc:'Rosetta: <span class=rosetta>You must say your goodbyes from here.  You cannot go back down the abyss.  For you have walked too far and now there is no more time to walk.  The ocean is coming.</span>'});
	Molpy.MakeQuadBadge({np:2922,name:'RUN',desc:'<b>RUN</b>'});
	Molpy.MakeQuadBadge({np:2928,name:'Oh! Hi!',desc:'They meat Amtoo and Beanette'});
	Molpy.MakeQuadBadge({np:2929,name:'Thankyou',desc:'Amtoo pulls his beanie on and they say thankyou'});
	Molpy.MakeQuadBadge({np:2930,name:'Goodbye!',desc:'Megan and Amtoo say goodbye'});
	Molpy.MakeQuadBadge({np:2931,name:'Getting Late',desc:'Cueball: It\'s getting late.  Megan: We can make it to the tower tonight'});
	Molpy.MakeQuadBadge({np:2932,name:'All the way',desc:'Cueball: We can\'t run the whole way.  Meagan: Nope'});
	Molpy.MakeQuadBadge({np:2936,name:'Expando again',desc:'Expando says greets them again'});
	Molpy.MakeQuadBadge({np:2937,name:'Hi probably',desc:'Cueball: Hi! probably'});
	Molpy.MakeQuadBadge({np:2945,name:'Not much further!',desc:'Cueball: Not much further!'});
	Molpy.MakeQuadBadge({np:2951,name:'Night!',desc:'They are inside the tower'});
	Molpy.MakeQuadBadge({np:2953,name:'Dreamed of water',desc:'Cueball: I dreamed I woke up in the water'});
	Molpy.MakeQuadBadge({np:2957,name:'Don\'t Mind',desc:'Cueball: I hope they don\'t mind us taking some of the food and water here'});
	Molpy.MakeQuadBadge({np:2958,name:'Creepy',desc:'Cueball: Maybe we should have stayed to ask.  But I was starting to get a little creeped out'});
	Molpy.MakeQuadBadge({np:2962,name:'Faster way back',desc:'Cueball: Still, maybe they could have helped us find a faster way back'});
	Molpy.MakeQuadBadge({np:2963,name:'Wrong',desc:'Cueball: ... Are you ok?  Megan: I did something that was wrong.'});
	Molpy.MakeQuadBadge({np:2965,name:'Stole Maps!',desc:'Cueball: You stole the maps!  Megan: I\'ll give them back someday! I hope.  Cueball: This is great!  There are so many!'});
	Molpy.MakeQuadBadge({np:2970,name:'Climb down',desc:'They climb down by the first tower'});
	Molpy.MakeQuadBadge({np:2972,name:'Stuff works',desc:'They discuss the Panther Salve'});
	Molpy.MakeQuadBadge({np:2973,name:'Steal more',desc:'Megan ponders what more should have been stolen'});
	Molpy.MakeQuadBadge({np:2976,name:'Lucky?',desc:'Is that lucky on a rock?'});
	Molpy.MakeQuadBadge({np:2977,name:'Yes it is!',desc:'Lucky looks up'});
	Molpy.MakeQuadBadge({np:2978,name:'Lucky runs',desc:'Lucky does not want to meet a thwapstick again'});
	Molpy.MakeQuadBadge({np:2986,name:'Run Prickly',desc:'Cueball: <small>Just go uphill don\'t stop, don\'t get stuck.  You can make it</small>'});
	Molpy.MakeQuadBadge({np:2989,name:'Chirp!',desc:'The chirps are flapping'});
	Molpy.MakeQuadBadge({np:2992,name:'Breather',desc:'They take a brief rest'});
	Molpy.MakeQuadBadge({np:2995,name:'Empty Hills?',desc:'Cueball: Well, no one\'s coming running down yelling or throwing stuff I guess the hills are empty.  Megan: I wish we had time to go up and explore them.  I\'d love to learn how they get all that stuff.'});
	Molpy.MakeQuadBadge({np:2996,name:'Hill people tower',desc:'The hill people have a tower as well'});
	Molpy.MakeQuadBadge({np:2998,name:'Is that the Sea?',desc:'Cueball: Is that the Sea?  Megan: Should it be in view already?'});
	Molpy.MakeQuadBadge({np:3001,name:'Know this place',desc:'They know the place but it souldn\'t be wet'});
	Molpy.MakeQuadBadge({np:3002,name:'This rock',desc:'Cueball: loves his rock'});
	Molpy.MakeQuadBadge({np:3003,name:'Wait',desc:'Megan: Whoa, wait.'});
	Molpy.MakeQuadBadge({np:3004,name:'Crossed the riverbed',desc:'Megan: Look at the spot where we crossed the riverbed'});
	Molpy.MakeQuadBadge({np:3006,name:'There they are!',desc:'They see some Cueganites'});
	Molpy.MakeQuadBadge({np:3007,name:'How deep',desc:'They are getting wet feet'});
	Molpy.MakeQuadBadge({np:3008,name:'Cross here',desc:'Should they cross here?'});
	Molpy.MakeQuadBadge({np:3009,name:'Cross now',desc:'Cross while they can'});
	Molpy.MakeQuadBadge({np:3010,name:'Something Wrong',desc:'Cueball: I can feel it flowing... But something seems wrong. Hang on.'});
	Molpy.MakeQuadBadge({np:3011,name:'Augh!',desc:'Cueball finds a deep spot'});
	Molpy.MakeQuadBadge({np:3012,name:'Fresh',desc:'They call the water Fresh'});
	Molpy.MakeQuadBadge({np:3013,name:'Keep the maps dry',desc:'Cueball leads the way'});
	Molpy.MakeQuadBadge({np:3014,name:'Strong current',desc:'They struggle in the flowing water'});
	Molpy.MakeQuadBadge({np:3015,name:'Water rising',desc:'The water is rising, but who is off the image?'});
	Molpy.MakeQuadBadge({np:3016,name:'You\'re Back!',desc:'They meet some of the Cueganites'});
	Molpy.MakeQuadBadge({np:3017,name:'Learned Everything',desc:'Mini-Bunny: Where did you go? Megan: To the mountains! We learned everything! Mini-Bunny: Everything? Megan: Most of it!  Where\'s everyone else?'});
	Molpy.MakeQuadBadge({np:3018,name:'Empty Hills',desc:'Mini-Bunny says the hills are empty and the cuganites are seeing what is left'});
	Molpy.MakeQuadBadge({np:3019,name:'Everyone is talking',desc:'But no one is listening.'});
	Molpy.MakeQuadBadge({np:3020,name:'Even more are talking',desc:'They talk on crossingg swiming, what is at sea and who is missing'});
	Molpy.MakeQuadBadge({np:3021,name:'Megans planning',desc:'Everyone together, we need to run'});
	Molpy.MakeQuadBadge({np:3023,name:'All is dark',desc:'Where are they?'});
	Molpy.MakeQuadBadge({np:3024,name:'Megan talks',desc:'Megan explains what is happening and the urgentcy'});
	Molpy.MakeQuadBadge({np:3025,name:'Trapped',desc:'Cuegan carry on telling the rest what the problems are'});
	Molpy.MakeQuadBadge({np:3026,name:'Bags might work',desc:'Need bags and rope'});
	Molpy.MakeQuadBadge({np:3027,name:'Hey!',desc:'Littlest Bangs Brother says Hey! interupting Megan'});
	Molpy.MakeQuadBadge({np:3028,name:'Cousin!',desc:'LBB has found his cousin!'});
	Molpy.MakeQuadBadge({np:3030,name:'What\'s that?',desc:'Something is floating past'});
	Molpy.MakeQuadBadge({np:3031,name:'La Petite returns',desc:'La Petite is LBBs cousin and what is she on?'});
	Molpy.MakeQuadBadge({np:3032,name:'Raftcastle',desc:'La Petite has made the castle into a boat!'});
	Molpy.MakeQuadBadge({np:3033,name:'No Brakes',desc:'How do you stop a raftcastle?'});
	Molpy.MakeQuadBadge({np:3035,name:'Plan B',desc:'Megan has a new plan'});
	Molpy.MakeQuadBadge({np:3036,name:'Raft up a river!',desc:'Megan outlines what they are going to do'});
	Molpy.MakeQuadBadge({np:3037,name:'Dark again',desc:'What is happening?'});
	Molpy.MakeQuadBadge({np:3038,name:'Busy Busy Busy',desc:'Cueganites doing lots of jobs'});
	Molpy.MakeQuadBadge({np:3039,name:'Load everything abord',desc:'Sticks, sheets, Yurts, bags...'});
	Molpy.MakeQuadBadge({np:3040,name:'And More',desc:'More stuff is loaded'});
	Molpy.MakeQuadBadge({np:3041,name:'This place is ending',desc:'Megan: The water is coming over the banks!  This place is ending and it\'s time to go'});
	Molpy.MakeQuadBadge({np:3043,name:'Push off',desc:'Away they gowith the castle and another raft'});
	Molpy.MakeQuadBadge({np:3049,name:'Zoom out',desc:'The rafts along with trees and other debries float away'});
	Molpy.MakeQuadBadge({np:3050,name:'Really Hard',desc:'Mini-Bunny: This is really hard.  If we drift into the shallows we can sort of push back toward the main channel.  But only barely.'});
	Molpy.MakeQuadBadge({np:3051,name:'Done Great',desc:'Megan says they are doing great'});
	Molpy.MakeQuadBadge({np:3052,name:'Speeding up',desc:'Megan thinks they are speeding up'});
	Molpy.MakeQuadBadge({np:3053,name:'Bump!',desc:'What hit the rafts?'});
	Molpy.MakeQuadBadge({np:3054,name:'Oof',desc:'It made Megan go Oof.'});
	Molpy.MakeQuadBadge({np:3055,name:'Calling this the front',desc:'Megan: Is thee any way to keep us pointing forward?  Megan: We could start calling this the front'});
	Molpy.MakeQuadBadge({np:3056,name:'Look!',desc:'What is behind them?'});
	Molpy.MakeQuadBadge({np:3057,name:'It\'s Them',desc:'There are more Cuganites floating on something else'});
	Molpy.MakeQuadBadge({np:3058,name:'Lots are talking',desc:'How to get the raftcastle to the overload others'});
	Molpy.MakeQuadBadge({np:3059,name:'Float past',desc:'Will they join up?'});
	Molpy.MakeQuadBadge({np:3060,name:'Rope throw',desc:'Will it reach'});
	Molpy.MakeQuadBadge({np:3062,name:'Closer',desc:'They are getting closer, but will the tress get in the way?'});
	Molpy.MakeQuadBadge({np:3064,name:'Try again',desc:'The rope is thrown again.'});
	Molpy.MakeQuadBadge({np:3065,name:'This time it works',desc:'Pull'});
	Molpy.MakeQuadBadge({np:3066,name:'Forty!',desc:'All forty cuganites are here'});
	Molpy.MakeQuadBadge({np:3067,name:'Ride it out',desc:'They will have to ride it out'});
	Molpy.MakeQuadBadge({np:3076,name:'Night time',desc:'Its dark again, with stars, the milky way and galaxies'});
	Molpy.MakeQuadBadge({np:3078,name:'<small>hey</small>',desc:'Megan: <small>hey</small>'});
	Molpy.MakeQuadBadge({np:3079,name:'Everyone asleep',desc:'Just Megan and Cueball on the raft'});
	Molpy.MakeQuadBadge({np:3081,name:'New Castle!',desc:'They are making a new sand castle'});
	Molpy.MakeQuadBadge({np:3082,name:'Land!',desc:'Cueball: Land!'});
	Molpy.MakeQuadBadge({np:3083,name:'Since Sunrise',desc:'Megan: We\'ve been heading right toward it since sunrise'});
	Molpy.MakeQuadBadge({np:3084,name:'Wake up!',desc:'Cueball: Land! Wake up, everybody'});
	Molpy.MakeQuadBadge({np:3085,name:'Wow!',desc:'They land and explore'});
	Molpy.MakeQuadBadge({np:3086,name:'Where are we',desc:'Cueball: Where do you think we are?  Megan: I don\'t know'});
	Molpy.MakeQuadBadge({np:3087,name:'Find out',desc:'Megan: But I bet we can  figure it out!  C\'mon let\'s see what\'s through here!'});
	Molpy.MakeQuadBadge({np:3089,name:'The End',desc:'Sob sob cry, bring on the ice cream'});
	Molpy.MakeQuadBadge({np:0,name:'Chronocenter',desc:'The extradimensional core of Time'});
	//t1i discoveries
	Molpy.MakeQuadBadge({np:11.1, name:"A wild Beanie appears!", desc: "11 pix before humanoid life. A new record?"});
	Molpy.MakeQuadBadge({np:13.1, name: "Another one?", desc: "The beanies might have an adventure."})
	Molpy.MakeQuadBadge({np:90.1, name:"Herd you wanted people", desc: "77 consecutive pix with no people."});
	Molpy.MakeQuadBadge({np:197.1, name:"The Sea", desc: "The first sign of OTTishness in over 180 pix."})
	Molpy.MakeQuadBadge({np:202.1, name:"Wave", desc: "The sea is uneven."})
	Molpy.MakeQuadBadge({np:203.1, name: "Hour-long Night", desc: "The first night lasts an hour. It is uneventful."})
	Molpy.MakeQuadBadge({np:209.1, name: "The Forty arrive", desc: "We hear a familiar voice from a familiar scene."})
	Molpy.MakeQuadBadge({np:212.1, name: "T** **d again?", desc: "In which we see the familiar scene."})
	Molpy.MakeQuadBadge({np:216.1, name: "Well that was quick", desc: "In which t1i suddenly seemed to have ended."})
	Molpy.MakeQuadBadge({np:228.1, name: "Not over yet", desc: "The scene changes to reveal something new."})
	Molpy.MakeQuadBadge({np:237.1, name: "Settling in", desc: "In which we see the collected Forty once more."})
	Molpy.MakeQuadBadge({np:262.1, name: "Let's find out", desc: "Cueball and Megan go to meet their islandmates."}) //That should totally be a word.
	Molpy.MakeQuadBadge({np:291.1, name: "Different air", desc: "The air is different."})
	Molpy.MakeQuadBadge({np:292.1, name: "Seen the top already", desc: "In which we learn that Cueball and Megan have seen the top of the mountain"})
	Molpy.MakeQuadBadge({np:294.1, name: "Breathe", desc: "Megan wonders if people can breathe on mountains."})
	Molpy.MakeQuadBadge({np:304.1, name: "Another snake", desc: "Cueball sees a different snake."})
	Molpy.MakeQuadBadge({np:317.1, name: "Just thinking", desc: "Cueball explains his slowness."})
	Molpy.MakeQuadBadge({np:345.1, name: "It moved", desc: ""})
	Molpy.MakeQuadBadge({np:400.1, name:"The Top", desc:""})
	Molpy.MakeQuadBadge({np:418.1, name:"Another Castle", desc:""})
	Molpy.MakeQuadBadge({np:426.1, name:"I miss our beach", desc:""})
	Molpy.MakeQuadBadge({np:432.1, name:"They've been here", desc:""})
	Molpy.MakeQuadBadge({np:440.1, name:"The Beanie fortress", desc:""})
	Molpy.MakeQuadBadge({np:441.1, name:"Mountain identified", desc:""})
	Molpy.MakeQuadBadge({np:448.1, name:"Two flags", desc:""})
	Molpy.MakeQuadBadge({np:455.1, name:"Beanie cam", desc:""})
	Molpy.MakeQuadBadge({np:556.1, name:"The other half", desc:""})
	Molpy.MakeQuadBadge({np:633.1, name:"Warning signs", desc:""})
	Molpy.MakeQuadBadge({np:649.1, name:"Not a castle", desc:""})
	Molpy.MakeQuadBadge({np:658.1, name:"Recent", desc:""})
	Molpy.MakeQuadBadge({np:679.1, name:"There's a cave", desc:""})
	Molpy.MakeQuadBadge({np:680.1, name:"Someone inside", desc:""})
	Molpy.MakeQuadBadge({np:681.1, name:"Beanies!", desc:""})
	Molpy.MakeQuadBadge({np:685.1, name:"Oh no!", desc:""})
	Molpy.MakeQuadBadge({np:760.1, name:"Back home", desc:""})
	Molpy.MakeQuadBadge({np:772.1, name:"Beanies learn quickly", desc:""})
	Molpy.MakeQuadBadge({np:788.1, name:"and draw well", desc:""})
	Molpy.MakeQuadBadge({np:804.1, name:"Close call", desc:""})
	Molpy.MakeQuadBadge({np:808.1, name:"Cueball gets excited", desc:""})
	Molpy.MakeQuadBadge({np:844.1, name:"Beanies learn extremely quickly", desc:""})
	Molpy.MakeQuadBadge({np:864.1, name:"Not Superman", desc:""})
	Molpy.MakeQuadBadge({np:924.1, name:"Assorted Art", desc:""})
	Molpy.MakeQuadBadge({np:926.1, name:"Some sort of molpy", desc:""})
	Molpy.MakeQuadBadge({np:956.1, name:"She knows everything", desc:""})
	Molpy.MakeQuadBadge({np:997.1, name:"Bad water", desc:""})
	Molpy.MakeQuadBadge({np:1023.1, name:"The plan", desc:""})
	Molpy.MakeQuadBadge({np:1094.1, name:"Crunch", desc:""})
	Molpy.MakeQuadBadge({np:1097.1, name:"Stuck", desc:""})
	Molpy.MakeQuadBadge({np:1105.1, name:"Lasso", desc:""})
	Molpy.MakeQuadBadge({np:1115.1, name:"Looking weird", desc:""})
	Molpy.MakeQuadBadge({np:1173.1, name:"Burial site", desc:""})
	Molpy.MakeQuadBadge({np:1202.1, name:"Fossils", desc:""})
	Molpy.MakeQuadBadge({np:1229.1, name:"Map", desc:""})
	Molpy.MakeQuadBadge({np:1291.1, name:"Back already", desc:""})
	Molpy.MakeQuadBadge({np:1321.1, name:"Oil barrels", desc:""})
	Molpy.MakeQuadBadge({np:1323.1, name:"Radioactive", desc:""})
	Molpy.MakeQuadBadge({np:1373.1, name:"Who taught them", desc:""})
	Molpy.MakeQuadBadge({np:1395.1, name:"Summon bigger boat", desc:""})
	Molpy.MakeQuadBadge({np:1408.1, name:"T** **d for real.", desc:""})
	Molpy.MakeQuadBadge({np:1414.1, name:"Rosetta returns", desc:""})
	//Molpy.MakeQuadBadge({np:,name:'',desc:''});
}
