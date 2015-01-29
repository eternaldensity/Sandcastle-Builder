﻿/**************************************************************
 * Boosts
 * 
 * New boosts should only be added to the END of the list!
 *************************************************************/

Molpy.DefineBoosts = function() {
	Molpy.groupNames = {
		boosts: ['boost', 'Boosts', 'boost'],
		badges: ['badge', 'Badges', 'badge'],
		hpt: ['hill people tech', 'Hill People Tech', 'hillpeopletech'],
		ninj: ['ninjutsu', 'Ninjutsu', 'ninjutsu'],
		chron: ['chronotech', 'Chronotech', 'chronotech'],
		cyb: ['cybernetics', 'Cybernetics', 'cybernetics'],
		bean: ['beanie tech', 'Beanie Tech', 'beanietech'],
		ceil: ['ceiling', 'Ceilings', 'glassceiling12'],
		drac: ['draconic', 'Draconic', 'draconic'],
		stuff: ['stuff', 'Stuff', 'stuff'],
		land: ['land', 'Land'],
		prize: ['prize', 'Prizes', 'prizes'],
		discov: ['discovery', 'Discoveries', 'discov', 'Discovery', 'A memorable discovery'],
		monums: ['sand monument', 'Sand Monuments', 'sandmonument', 'Sand Monument', 'A sand structure commemorating'],
		monumg: ['glass monument', 'Glass Monuments', 'glassmonument', 'Glass Monument', 'A glass sculpture commemorating'],
		diamm: ['masterpiece', 'Masterpieces', 'masterpiece' ,'Masterpiece',	'This is a diamond masterpiece.<br>All craftottership is of the highest quality.<br>On the masterpiece is an image of', 'in diamond. <br>It molpifies with spikes of treeishness.'],
	        faves: ['favourites', 'Favourites'],
		magic: ['magic', 'Magic'],
	};
	
	Molpy.unlockedGroups['stuff'] = 1; // Stuff is always unlocked because Sand and Castles are always unlocked
	
	Molpy.nextBageGroup = {discov: 'monums', monums: 'monumg'};// ,monumg:'diamm'};

	new Molpy.Boost({
		name: 'Bigger Buckets',
		icon: 'biggerbuckets',
		desc: 'Raises sand rate of buckets and clicks',
		price: {
			Sand: 500,
			Castles: 0,
		},
		stats: 'Adds 0.1 S/mNP to each Bucket, before multipliers'
	});
	new Molpy.Boost({
		name: 'Huge Buckets',
		icon: 'hugebuckets',
		desc: 'Doubles sand rate of buckets and clicks',
		price: {
			Sand: 800,
			Castles: 2
		}
	});
	new Molpy.Boost({
		name: 'Helping Hand',
		icon: 'helpinghand',
		desc: 'Raises sand rate of Cuegan',
		price: {
			Sand: 500,
			Castles: 2,
		},
		stats: 'Adds 0.2 S/mNP to each Cuegan, before multipliers'
	});
	new Molpy.Boost({
		name: 'Cooperation',
		icon: 'cooperation',
		desc: 'Boosts sand rate of Cuegan cumulatively by 5% per pair of buckets',
		price: {
			Sand: 2000,
			Castles: 4,
		},
		
		stats: function() {
			if(Molpy.Got('Cooperation')) {
				var mult = Math.pow(1.05, Math.floor(Molpy.SandTools['Bucket'].amount / 2));
				return 'Multiplies Cuegans\' sand production by ' + Molpify(mult * 100, 2) + '%';
			}
			return 'Boosts sand rate of Cuegan cumulatively by 5% per pair of buckets';
		}
	});
	new Molpy.Boost({
		name: 'Spring Fling',
		icon: 'springfling',
		desc: 'Trebuchets build an extra Castle',
		price: {
			Sand: 1000,
			Castles: 6
		},
	});
	new Molpy.Boost({
		name: 'Trebuchet Pong',
		icon: 'trebpong',
		desc: 'Boosts sand rate of buckets cumulatively by 50% per pair of trebuchets',
		
		stats: function() {
			return 'Sand rate of buckets is multiplied by '
				+ Molpify(Math.pow(1.5, Math.floor(Molpy.CastleTools['Trebuchet'].amount / 2)));
		},
		
		price: {
			Sand: 3000,
			Castles: 6
		},
	});
	new Molpy.Boost({
		name: 'Molpies',
		icon: 'molpies',
		desc: 'Increases sand dig rate based on Badges',
		price: {
			Sand: 5000,
			Castles: 5,
		},
		
		stats: function() {
			if(Molpy.Got('Molpies')) {
				var mult = 0.01 * Molpy.BadgesOwned;
				return 'Increases sand dig rate by ' + Molpify(mult * 100, 2) + '%';
			}
			return 'Increases sand dig rate by 1% per Badge earned';
		}
	});
	new Molpy.Boost({
		name: 'Busy Bot',
		icon: 'busybot',
		group: 'cyb',
		desc: 'NewPixBots activate 10% sooner',
		price: {
			Sand: 900,
			Castles: 4
		},
	});
	new Molpy.Boost({
		name: 'Stealthy Bot',
		icon: 'stealthybot',
		group: 'ninj',
		desc: 'NewPixBots activate 10% sooner,',
		price: {
			Sand: 1200,
			Castles: 5
		},
	});
	new Molpy.Boost({
		name: 'Flag Bearer',
		icon: 'flagbearer',
		desc: 'Flags are more powerful',
		price: {
			Sand: 5500,
			Castles: 8,
		},
		stats: 'Each flag produces 2 extra sand/mNP, before multipliers'
	});
	new Molpy.Boost({
		name: 'War Banner',
		icon: 'warbanner',
		desc: 'Trebuchets only destroy 1 castle',
		price: {
			Sand: 3000,
			Castles: 10
		},
	});
	new Molpy.Boost({
		name: 'Magic Mountain',
		icon: 'magicmountain',
		desc: 'Flags are much more powerful',
		price: {
			Sand: 8000,
			Castles: 15,
		},
		stats: 'Multiplies Flag sand rate by 2.5'
	});
	new Molpy.Boost({
		name: 'Extension Ladder',
		icon: 'extensionladder',
		desc: 'Ladders reach a little higher',
		price: {
			Sand: '12K',
			Castles: 22,
		},
		stats: 'Each ladder produces 18 more sand per mNP, before multipliers'
	});
	new Molpy.Boost({
		name: 'Level Up!',
		icon: 'levelup',
		desc: 'Ladders are much more powerful',
		price: {
			Sand: '29K',
			Castles: 34,
		},
		stats: 'Ladders produce twice as much Sand'
	});
	new Molpy.Boost({
		name: 'Varied Ammo',
		icon: 'variedammo',
		desc: 'Trebuchets build an extra castle for each Castle Tool you have 2+ of',
		price:{
			Sand: 3900,
			Castles: 48,
		},
		
		stats: function() {
			if(Molpy.Got('Varied Ammo')) {
				var val = 0;
				for( var i in Molpy.CastleTools)
					if(Molpy.CastleTools[i].amount > 1) val++;
				return 'Each trebuchet produces ' + Molpify(val) + ' more castles per ONG, before multipliers';
			}
			return 'For each kind of Castle Tool of which you have 2 or more, each trebuchet produces an additional castle per ONG, before multipliers';
		}
	});
	new Molpy.Boost({
		name: 'Megball',
		icon: 'megball',
		desc: 'Cuegan produce double sand',
		price:{
			Sand: 10700,
			Castles: 56
		},
	});
	new Molpy.Boost({
		name: 'Robot Efficiency',
		icon: 'robotefficiency',
		group: 'cyb',
		desc: 'Newpixbots build an extra castle (before any doubling)',
		price:{
			Sand: '34K',
			Castles: 153
		},
	});
	new Molpy.Boost({
		name: 'Ninja Builder',
		icon: 'ninjabuilder',
		group: 'ninj',
		desc: 'When incrementing ninja stealth streak, builds that many castles',
		price:{
			Sand: 4000,
			Castles: 35,
		},
		
		stats: function() {
			if(Molpy.Got('Ninja Builder'))
				return 'Will build ' + Molpify(Molpy.CalcStealthBuild(1), 3) + ' Castles unless you destealth ninjas';
			return 'Ninja Stealth increments the first time you click within a NewPix after NewPixBots activate. It will reset if you click before NewPixBots activate, or don\'t click before the next ONG.'
		}
	});
	new Molpy.Boost({
		name: 'Erosion',
		icon: 'erosion',
		desc: 'Waves destroy less by 20% of total castles wasted by waves, and ' + '2 less per River bought',
		price:{
			Sand: '40K',
			Castles: 77
		},
	});
	new Molpy.Boost({
		name: 'Autosave Option',
		icon: 'autosave',
		desc: 'Autosave option is available',
		price:{
			Sand: 100,
			Castles: 4
		},
	});
	new Molpy.Boost({
		name: 'Helpful Hands',
		icon: 'helpfulhands',
		desc: 'Each Cuegan+Bucket pair gives clicking +0.5 sand',
		price:{
			Sand: 250,
			Castles: 5
		},
	});
	new Molpy.Boost({
		name: 'True Colours',
		icon: 'truecolours',
		desc: 'Each Cuegan+Flag pair gives clicking +5 sand',
		price:{
			Sand: 750,
			Castles: 15,
		},
	});
	new Molpy.Boost({
		name: 'Precise Placement',
		icon: 'preciseplacement',
		desc: 'For every two ladders, scaffolds destroy one less castle',
		price:{
			Sand: 8750,
			Castles: 115
		},
	});
	new Molpy.Boost({
		name: 'Ninja Hope',
		icon: 'ninjahope',
		group: 'ninj',
		desc: 'Avoid one Ninja Stealth reset, at the cost of 10 castles',
		price:{
			Sand: 7500,
			Castles: 40,
		},
		startPower: 1
	});
	new Molpy.Boost({
		name: 'Ninja Penance',
		icon: 'ninjapenance',
		group: 'ninj',
		desc: 'Avoid a two Ninja Stealth resets, at the cost of 30 castles each',
		price:{
			Sand: '25K',
			Castles: 88,
		},
		startPower: 2
	});
	new Molpy.Boost({
		name: 'Blitzing',
		icon: 'blitzing',
		className: 'alert',
		
		desc: function(me) {
			return Molpify(me.power, 1) + '% Sand for ' + MolpifyCountdown(me.countdown);
		},
		startCountdown: 23, // only used when loading to ensure it doesn't get stuck. any true value would do here
		countdownCMS: 1,
	});
	new Molpy.Boost({
		name: 'Kitnip',
		icon: 'kitnip',
		desc: Molpy.Redacted.words + ' come more often and stay longer',
		price:{
			Sand: 33221,
			Castles: 63
		},
	});
	new Molpy.Boost({
		name: 'Department of Redundancy Department',
		alias: 'DoRD',
		icon: 'department',
		group: 'hpt',
		desc: Molpy.Redacted.words + ' sometimes unlock special boosts',
		price:{
			Sand: 23456,
			Castles: 78
		},
	});
	new Molpy.Boost({
		name: 'Raise the Flag',
		icon: 'raisetheflag',
		desc: 'Each Flag+Ladder pair gives clicking an extra +50 sand',
		price:{
			Sand: '85K',
			Castles: 95
		},
	});
	new Molpy.Boost({
		name: 'Hand it Up',
		icon: 'handitup',
		desc: 'Each Ladder+Bag pair gives clicking an extra +500 sand',
		price:{
			Sand: '570K',
			Castles: 170,
		},
		department: 1
	});
	new Molpy.Boost({
		name: 'Riverish',
		icon: 'riverish',
		desc: 'Rivers destroy less castles the more you click',
		price:{
			Sand: '82K',
			Castles: 290,
		},
		department: 1,
		
		buyFunction: function() {
			this.power = Molpy.beachClicks;
		}
	});
	new Molpy.Boost({
		name: 'Monty Haul Problem',
		alias: 'MHP',
		icon: 'monty',
		className: 'action',
		
		desc: function(me) {
			if(!me.bought) return('There are three doors, which conceal unfabulous prizes!');
			var str = '';
			for( var i in Molpy.MontyDoors) {
				var door = Molpy.MontyDoors[i];
				if(door != me.goat) {
					str += '<input type="Button" value="Choose Door ' + door + '" onclick="Molpy.Monty(\''
						+ door + '\')"><br>'
				} else {
					if(Molpy.Got('Beret Guy')) {
						str += '<input type="Button" value="Take goat" onclick="Molpy.Monty(\'' + door + '\')"><br>'
					} else {
						str += 'Door ' + door + ' is a goat<br>';
					}
				}
			}
			str += 'Choose a door! You might gain half your current Castles, or you might lose them all and get a Goat';
			if(Molpy.IsEnabled('HoM'))
				str += '<br>With Hall of Mirrors, you also stand to gain a fifth of your Glass Chip Storage balance, or lose a third of it.';
			return str;
		},
		
		price:{
			Sand: function() {
				var p = Molpy.Boosts['MHP'].power;
				return 100 * Math.pow(2, Math.max(1, p - 9));
			},
			
			GlassBlocks: function() {
				if(!Molpy.IsEnabled('HoM')) return 0;
				var p = Molpy.Boosts['MHP'].power;
				return 100 * Math.pow(2, Math.max(1, p - 15));
			},
		},
		
		lockFunction: function() {
			this.power++;
			this.goat = 0;
			this.prize = 0;
		},
		
		unlockFunction: function() {
			this.prize = Molpy.GetDoor();
		},

		loadFunction: function() { Molpy.LockBoost('MHP') }
	});
	
	Molpy.MontyDoors = ['A', 'B', 'C'];
	
	Molpy.Monty = function(door) {
		Molpy.Anything = 1;
		var me = Molpy.Boosts['MHP'];
		me.door = door;
		if(!me.bought) {
			Molpy.Notify('Buy it first, silly molpy!');
			return;
		}
		if(me.goat) {
			if(me.door == me.goat && !Molpy.Got('Beret Guy')) {
				Molpy.Notify('That door has already been opened.');
				return;
			}
			Molpy.RewardMonty();
		} else {
			Function('me', Molpy.BeanishToCuegish(Molpy.MontyMethod))(me);
			if(me.goat) {
				Molpy.Notify('Door ' + me.goat + ' is opened, revealing a goat!<br>You may switch from Door ' + me.door
					+ ' if you like.', 1);
				me.Refresh();
				return;
			} else {
				Molpy.RewardMonty();
			}
		}

		Molpy.LockBoost('MHP');
	}
	
	Molpy.GetDoor = function() {
		return GLRschoice(Molpy.MontyDoors);
	}
	
	Molpy.RewardMonty = function() {
		var me = Molpy.Boosts['MHP'];
		if(me.door == me.prize) {
			var amount = Molpy.Boosts['Castles'].power;
			Molpy.Notify('Hooray, you found the prize behind door ' + me.door + '!',true);
			Molpy.Boosts['Castles'].build(Math.floor(Molpy.Boosts['Castles'].power / 2), 1);
			if(Molpy.IsEnabled('HoM')) Molpy.Add('GlassChips', Math.floor(Molpy.Boosts['GlassChips'].power / 5), 1);
			if(Molpy.Got('Gruff')) Molpy.GetYourGoat(2);
		} else {
			Molpy.Destroy('Castles', Molpy.Boosts['Castles'].power);
			Molpy.Boosts['MHP'].power = Math.ceil(Math.floor(Molpy.Boosts['MHP'].power / 1.8));
			if(Molpy.IsEnabled('HoM')) Molpy.Spend('GlassChips', Math.floor(Molpy.Boosts['GlassChips'].power / 3));
			Molpy.GetYourGoat(1);
		}
	}

	Molpy.GetYourGoat = function(n) {
		Molpy.Add('Goats', n);
		_gaq && _gaq.push(['_trackEvent', 'Boost', 'Upgrade', 'Goats']);
		if(Molpy.Has('Goats', 2)) Molpy.EarnBadge('Second Edition');
		if(Molpy.Has('Goats', 20)) Molpy.UnlockBoost('HoM');
		if(Molpy.Has('Goats', 200)) Molpy.UnlockBoost('Beret Guy');
		if (n== 1) 
			Molpy.Notify('You got a goat!',true);
		else
			Molpy.Notify('You got '+n+' goats!',true);
		
	}

	new Molpy.Boost({
		name: 'Grapevine',
		icon: 'grapevine',
		desc: 'Increases sand dig rate by 2% per badge earned',
		price:{
			Sand: '25K',
			Castles: 25,
		},
		department: 1,
		
		stats: function() {
			if(Molpy.Got('Grapevine')) {
				var mult = 0.02 * Molpy.BadgesOwned;
				return 'Increases sand dig rate by ' + Molpify(mult * 100, 2) + '%';
			}
			return 'Increases sand dig rate by 2% per Badge earned';
		}
	});
	new Molpy.Boost({
		name: 'Affordable Swedish Home Furniture',
		alias: 'ASHF',
		icon: 'ashf',
		group: 'hpt',
		className: 'alert',
		
		desc: function(me) {
			return Molpify(me.power * 100, 1) + '% off all items for ' + MolpifyCountdown(me.countdown)
		},
		
		buyFunction: function() {
			Molpy.shopNeedUpdate = 1;
			Molpy.CalcPriceFactor();
			Molpy.Donkey();
		},
		
		countdownFunction: function() {
			if(this.countdown == 2) {
				Molpy.Notify('Only 2mNP of discounts remain!');
			}
		},
		
		lockFunction: function() {
			var pp = Molpy.Boosts['Price Protection'];
			if(pp.IsEnabled)
				pp.power = pp.bought + 1;
			else
				Molpy.UnlockBoost(pp.alias);
		},
		
		startPower: function() {
			if(Molpy.Got('GoldCard')) return 0.6;
			if(Molpy.Got('SilverCard')) return 0.5;
			return 0.4;
		},
		
		countdownCMS: 1,
		startCountdown: function() {
			if(Molpy.Got('Late Closing Hours')) {
				return 10;
			}
			return 5;
		},
		
		department: 1
	});

	new Molpy.Boost({
		name: 'Overcompensating',
		icon: 'overcompensating',
		
		desc: function(me) {
			return 'During LongPix, Sand Tools dig ' + Molpify(me.startPower * 100, 1) + '% extra sand'
		},
		
		price:{
			Sand: 987645,
			Castles: 321,
		},
		startPower: 1.5
	});
	new Molpy.Boost({
		name: 'Doublepost',
		icon: 'doublepost',
		desc: 'During LongPix, Castle Tools activate a second time',
		price:{
			Sand: '650K',
			Castles: 4000
		},
	});
	new Molpy.Boost({
		name: 'Coma Molpy Style',
		icon: 'comamolpystyle',
		className: 'toggle',
		
		desc: function(me) {
			return (me.IsEnabled ? '' : 'When active, ')
				+ 'the ONG clock is frozen.<br>(Castle Tools do not activate and ninjas stay stealthed.)<br><input type="Button" onclick="Molpy.ComaMolpyStyleToggle()" value="'
				+ (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>';
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		price:{
			Sand: 8500,
			Castles: 200
		},
	});

	Molpy.cmsline = 0;
	
	Molpy.ComaMolpyStyleToggle = function() {
		Molpy.Anything = 1;
		var me = Molpy.Boosts['Coma Molpy Style'];
		Molpy.Notify(Molpy.cms[Molpy.cmsline]);
		Molpy.cmsline++;
		if(Molpy.cmsline >= Molpy.cms.length) {
			Molpy.cmsline = 0;
			if(!me.bought) {
				me.buy();
				if(me.bought) Molpy.RewardRedacted();
			}
		}
		if(!me.bought) {
			_gaq && _gaq.push(['_trackEvent', 'Boost', 'Toggle Fail', me.name]);
			return;
		}

		var acPower = Molpy.Boosts['Coma Molpy Style'].power;
		if(acPower) {
			acPower = 0; // off
			Molpy.ONGstart = ONGsnip(new Date()); // don't immediately ONG!
		} else {
			acPower = 1; // on
		}
		g('clockface').className = acPower ? 'hidden' : 'unhidden';
		Molpy.Boosts['Coma Molpy Style'].power = acPower;
		Molpy.Boosts['Coma Molpy Style'].Refresh();
		Molpy.RatesRecalculate();
	}
	
	new Molpy.Boost({
		name: 'Time Travel',
		icon: 'timetravel',
		group: 'chron',
		className: 'action',
		
		desc: function(me) {
			var price = Molpy.TimeTravelPrice();
			return 'Pay ' + Molpify(price, 2) + ' Castles to move <input type="Button" onclick="Molpy.TimeTravel('
				+ (-me.power) + ');" value="backwards"></input> or <input type="Button" onclick="Molpy.TimeTravel('
				+ me.power + ');" value="forwards"></input> ' + Molpify(me.power) + ' NP in Time';
		},
		
		price:{
			Sand: 1000,
			Castles: 30,
		},
		
		buyFunction: function() {
			this.power = 1;
		},
		
		// Saved Unique Properties
		travelCount: 0, 
		
		defSave: 1,
		saveData: {4:['travelCount', 0, 'int']}
	});

	Molpy.TimeTravelPrice = function() {
		var price = Molpy.newpixNumber;
		price += Molpy.Boosts['Castles'].power * Molpy.newpixNumber / 3094;
		price += Molpy.Boosts['Time Travel'].travelCount;
		if(Molpy.Got('Flux Capacitor')) price = Math.ceil(price * .2);
		price = Math.ceil(price / Molpy.priceFactor); // BECAUSE TIME TRAVEL
														// AMIRITE?
		if(price < 0) price *= -1;
		if(price > Molpy.Boosts['Castles'].power) Molpy.Boosts['Flux Capacitor'].department = 1;
		if(isNaN(price)) price = Infinity;
		return price;
	}

	Molpy.TimeTravel = function(NP) {
		Molpy.Anything = 1;
		var oldNP=Molpy.newpixNumber;
		if(Molpy.TTT(Molpy.newpixNumber + NP, 0)) {
			if(oldNP>0)
			{
				if(NP > 0) Molpy.EarnBadge('Fast Forward');
				if(NP < 0) Molpy.EarnBadge('And Back');
			}else if(oldNP<0){
				if(NP > 0) Molpy.EarnBadge('Forward to the Past');
				if(NP < 0) Molpy.EarnBadge('Stuck in Reverse');
			}
			var t = Molpy.Boosts['Time Travel'].travelCount;
			if(t >= 10) Molpy.EarnBadge('Primer');
			if(t >= 20) Molpy.UnlockBoost('Flux Capacitor');
			if(t >= 30 && Molpy.Got('Flux Capacitor')) Molpy.UnlockBoost('Flux Turbine');
			if(t >= 40) Molpy.EarnBadge('Wimey');
			if(t >= 160) Molpy.EarnBadge('Hot Tub');
			if(t >= 640) Molpy.EarnBadge("Dude, Where's my DeLorean?");
		}
	}
	// targeted time travel!
	Molpy.TTT = function(np, chips, silence) {
		Molpy.Anything = 1;
		np = Math.floor(np);
		chips = chips ? (chips == 1?Molpy.CalcJumpEnergy(np):Infinity) : 0;
		var price = Molpy.TimeTravelPrice();
		if(chips) price = 0;
		if(np < 1 && !Molpy.Earned('Minus Worlds')) {
			Molpy.Notify('Heretic!');
			Molpy.Notify('There is nothing before time.');
			return;
		}
		if(np == 0) {
			Molpy.Notify('Divide by zero error!');
			return;
		}
		if(Math.abs(np) > Math.abs(Molpy.highestNPvisited)) {
			Molpy.Notify('Wait For It');
			return;
		}
		if(!Molpy.Boosts['Time Travel'].bought && !chips) {
			Molpy.Notify('In the future, you\'ll pay for this!');
			return;
		}
		if(Molpy.Boosts['Castles'].power >= price || chips) {
			if(!Molpy.Spend('GlassChips', chips)) {
				Molpy.Notify('Great Scott, there\'s a hole in the glass tank!');
				return;
			}
			Molpy.Spend('Castles', price);
			if(Molpy.Earned('discov' + Molpy.newpixNumber)) Molpy.Badges['discov' + Molpy.newpixNumber].Refresh();
			Molpy.newpixNumber = np;
			if(Molpy.Earned('discov' + Molpy.newpixNumber)) Molpy.Badges['discov' + Molpy.newpixNumber].Refresh();
			_gaq && _gaq.push(['_trackEvent', 'NewPix', (chips ? 'Memory Warp' : 'Time Travel'), '' + Molpy.newpixNumber]);
			Molpy.ONGstart = ONGsnip(new Date());
			Molpy.HandlePeriods();
			Molpy.UpdateBeach();
			if(!silence) Molpy.Notify('Time Travel successful! Welcome to NewPix ' + Molpify(Molpy.newpixNumber));
			Molpy.Boosts['Time Travel'].travelCount++;
			if(Molpy.Boosts['Time Travel'].travelCount >= 10 && !silence) Molpy.HandleInvaders(chips);
			Molpy.Boosts['Time Travel'].Refresh();
			if(chips && Molpy.Got('Crystal Memories') && Molpy.Got('Flux Surge')) {
				var c = Molpy.Got('TDE') + 1;
				Molpy.Boosts['Flux Surge'].countdown *= .5;
				Molpy.Add('FluxCrystals', c);
				Molpy.Notify('Great Scott! '+Molpify(c)+' flux crystal'+plural(c)+' materialized.');
			}
			Molpy.Boosts['Now Where Was I?'].Refresh();
			Molpy.LockBoost('Muse');
			Molpy.UpdateFaves();
			return 1;
		} else {
			Molpy.Notify('<i>Castles</i>? Where we\'re going we do need... <i>castles</i>.');
		}
	}

	Molpy.HandleInvaders = function(mem) {
		var incursionFactor = Molpy.Got('AD') ? 1.5 : Molpy.Got('Flux Capacitor') ? 4 : (Molpy.Got('Flux Turbine') ? 8 : 20);
		if(mem) incursionFactor *= 10;
		if(!flandom(incursionFactor)) {
			var npb = Molpy.CastleTools['NewPixBot'];
			if(!Molpy.Boosts['NavCode'].power && npb.temp < 30) {
				Molpy.Notify('You do not arrive alone');
				npb.amount++;
				npb.temp++;
				npb.Refresh();
			} else {
				Molpy.Notify('Temporal Incursion Prevented!');
			}
		}
	}

	Molpy.CalcJumpEnergy = function(destNP) {
		var gap = destNP - Molpy.newpixNumber;
		var cost = gap * gap;
		cost += Molpy.Boosts['Time Travel'].travelCount;
		cost *= 100;
		// Jumps between sides costs a lot more unless returning from the Minus side without having AA This is so
		// that if one goes early you can return, but going again has to be expensive
		if(destNP * Molpy.newpixNumber < 0) { 
			if(destNP < 0 || Molpy.Boosts['AA'].bought) cost *= 1000000;
		}
		if(destNP < 0 && !Molpy.Earned('discov' + destNP)) cost *= 1.1; // premium jumping using MM to unknwon discovery
		if(Molpy.Got('Flux Capacitor')) cost *= .2;
		if(Molpy.Got('Mind Glow') && Molpy.Earned('monums' + destNP)) cost *= .5;
		if(Molpy.Got('Memory Singer') && Molpy.Earned('monumg' + destNP)) cost *= .5;
		return Math.ceil(cost);
	}

	new Molpy.Boost({
		name: 'Active Ninja',
		icon: 'activeninja',
		group: 'ninj',
		desc: 'During LongPix, Ninja Stealth is incremented by 3 per NP. Is there an Echo in here?',
		price:{
			Sand: '1.5M',
			Castles: 240
		},
	});
	new Molpy.Boost({
		name: 'Kitties Galore',
		icon: 'kittiesgalore',
		desc: 'Even more ' + Molpy.Redacted.words,
		price:{
			Sand: '2.5M',
			Castles: 4400
		},
	});
	new Molpy.Boost({
		name: 'HAL-0-Kitty',
		icon: 'halokitty',
		group: 'cyb',
		desc: 'NewPixBots build an extra Castle per 9 ' + Molpy.Redacted.words,
		price:{
			Sand: 9000,
			Castles: 2001
		},
	});
	new Molpy.Boost({
		name: 'Factory Automation',
		icon: 'factoryautomation',
		group: 'hpt',
		
		desc: function(me) {
			var costs = '';
			var i = me.power + 1;
			var n = 0;
			while(i--) {
				var sand = 2000000 * Math.pow(100000, i);
				costs += Molpify(sand);
				n++;
				if(n > 5) {
					costs += ', then... ';
					break;
				}
				if(i) costs += ', then ';
			}
			if(!me.power)
				return 'When NewPixBots activate, so does the Department of Redundancy Department at a cost of '
					+ costs
					+ ' Sand, if you have at least 20 NewPixBots.<br>Can be upgraded if you have Doubleposting and ask the right person...';
			return 'Level: ' + Molpify(me.power + 1, 3)
				+ '<br>When NewPixBots activate, so does the Department of Redundancy Department at a cost of '
				+ costs + ' Sand. Will activate less times if you don\'t have 20 bots per automation level.';
		},
		
		price:{
			Sand: '4.5M',
			Castles: 15700
		},
	});
	new Molpy.Boost({
		name: 'Blast Furnace',
		icon: 'blastfurnace',
		group: 'hpt',
		desc: 'Gives the Department of Redundancy Department the ability to make Castles from Sand',
		price:{
			Sand: '8.8M',
			Castles: 28600,
		},
		
		stats: function() {
			var blastFactor = 1000;
			if(Molpy.Got('Fractal Sandcastles')) {
				blastFactor = Math.max(5, 1000 * Math.pow(0.94, Molpy.Boosts['Fractal Sandcastles'].power));
			}
			return 'Uses '
				+ Molpify(2000000)
				+ ' Sand to warm up, then makes Castles at a cost of '
				+ Molpify(blastFactor, 1)
				+ ' each. Can make up to a third of your total castles built (before accounting for any Flux Turbine bonus).';
		}
	});
	new Molpy.Boost({
		name: 'Sandbag',
		icon: 'sandbag',
		desc: 'Bags and Rivers give each other a cumulative 5% boost to Sand digging, Castle building, and Castle destruction (per River or Bag, respectively)',
		price:{
			Sand: '1.4M',
			Castles: '21K'
		},
	});
	new Molpy.Boost({
		name: 'Embaggening',
		icon: 'embaggening',
		desc: 'Each Cuegan after the 14th gives a 2% boost to the sand dig rate of Bags',
		price:{
			Sand: '3.5M',
			Castles: '23K'
		},
	});
	new Molpy.Boost({
		name: 'Carrybot',
		icon: 'carrybot',
		group: 'cyb',
		desc: 'NewPixBots produce double castles, Buckets produce quadruple sand',
		price:{
			Sand: '10K',
			Castles: '1K'
		},
	});
	new Molpy.Boost({
		name: 'Stickbot',
		icon: 'stickbot',
		group: 'cyb',
		desc: 'NewPixBots produce double castles, Cuegan produce quadruple sand',
		price:{
			Sand: '50K',
			Castles: '2.5K'
		},
	});
	new Molpy.Boost({
		name: 'Standardbot',
		icon: 'standardbot',
		group: 'cyb',
		desc: 'NewPixBots produce double castles, Flags produce quadruple sand',
		price:{
			Sand: '250K',
			Castles: 6250
		},
	});
	new Molpy.Boost({
		name: 'Climbbot',
		icon: 'climbbot',
		group: 'cyb',
		desc: 'NewPixBots produce double castles, Ladders produce quadruple sand',
		price:{
			Sand: '1250K',
			Castles: 15625
		},
	});
	new Molpy.Boost({
		name: 'Luggagebot',
		icon: 'luggagebot',
		group: 'cyb',
		desc: 'NewPixBots produce double castles, Bags produce quadruple sand',
		price:{
			Sand: '6250K',
			Castles: 39063
		},
	});
	new Molpy.Boost({
		name: 'Recursivebot',
		icon: 'recursivebot',
		group: 'cyb',
		desc: 'NewPixBots produce double castles',
		price:{
			Sand: '50K',
			Castles: '10K',
		},
	});
	new Molpy.Boost({
		name: 'Flingbot',
		icon: 'flingbot',
		group: 'cyb',
		desc: 'NewPixBots produce double castles, Trebuchets produce quadruple',
		price:{
			Sand: '250K',
			Castles: '25K'
		},
	});
	new Molpy.Boost({
		name: 'Propbot',
		icon: 'propbot',
		group: 'cyb',
		desc: 'NewPixBots produce double castles, Scaffolds produce quadruple',
		price:{
			Sand: '1.25M',
			Castles: 62500
		},
	});
	new Molpy.Boost({
		name: 'Surfbot',
		icon: 'surfbot',
		group: 'cyb',
		desc: 'NewPixBots produce double castles, Waves produce quadruple',
		price:{
			Sand: '62.5M',
			Castles: 156250
		},
	});
	new Molpy.Boost({
		name: 'Smallbot',
		icon: 'smallbot',
		group: 'cyb',
		desc: 'NewPixBots produce double castles, Rivers produce quadruple',
		price:{
			Sand: '352.5M',
			Castles: 390625
		},
	});
	new Molpy.Boost({
		name: 'Swell',
		icon: 'swell',
		desc: 'Waves produce 19 more Castles',
		price:{
			Sand: '20K',
			Castles: 200
		},
	});
	new Molpy.Boost({
		name: 'Flux Capacitor',
		icon: 'fluxcap',
		group: 'chron',
		desc: 'It makes Time Travel possibler!',
		price:{
			Sand: 88,
			Castles: 88
		},
	});
	new Molpy.Boost({
		name: 'Bag Burning',
		icon: 'bagburning',
		desc: 'Bags help counteract NewPixBots. This will involve burning some Bags.<br>'
			+ 'Bag Burning is the first of several Boosts available during Judgement Dip.<br>'
			+ 'Remember you can always sell Bags to reduce the effect of Bag Burning.',
		price:{
			Sand: '50M',
			Castles: 86,
		},
		
		stats: function() {
			var str = 'Half of Bags beyond the 14th owned give a cumulative 40% boost to Judgement Dip threshold.';
			if(Molpy.SandTools['Bag'].amount > Molpy.npbDoubleThreshold) {
				var amount = Math.pow(1.4, Math.max(0, (Molpy.SandTools['Bag'].amount - Molpy.npbDoubleThreshold) / 2)) - 1;
				amount = Molpify(amount * 100, 0);
				str += '<br>Currently ' + amount + '%';
			}
			var jmax = Math.pow(2, Molpy.Boosts['Bag Burning'].power) + 6;
			str += '<br>If the Judgement Dip level (apart from the Bag reduction) is greater than '
				+ Molpify(jmax, 1)
				+ ', Bags will be burned to increase power.<br>It is also more powerful each time it is locked!';
			if(!isFinite(jmax) && Molpy.Got('Bottle Battle')) Molpy.UnlockBoost('Fireproof');
			return str;
		},
		
		lockFunction: function() {
			this.power += 2;
		}
	});
	new Molpy.Boost({
		name: 'Chromatic Heresy',
		icon: 'chromatic',
		heresy: true,
		className: 'toggle',
		
		desc: function(me) {
			return 'Saturation is '
				+ (me.power > 0 ? '' : 'not ')
				+ 'allowed.<br><input type="Button" value="Click" onclick="Molpy.ChromaticHeresyToggle()"></input> to toggle.';
		},
		
		stats: '"huehuehuehuehuehuehue"',
		price:{
			Sand: 200,
			Castles: 10
		},
	});
	
	Molpy.ChromaticHeresyToggle = function() {

		Molpy.Anything = 1;
		var ch = Molpy.Boosts['Chromatic Heresy'];
		if(!ch.bought) {
			Molpy.Notify('Somewhere, over the rainbow...');
			return;
		}
		_gaq && _gaq.push(['_trackEvent', 'Boost', 'Toggle', ch.name]);
		if(ch.power > 0)
			ch.power = -ch.power;
		else if(ch.power < 0)
			ch.power = -ch.power + 1;
		else
			(ch.power = 1);

		if(ch.power > 10) Molpy.UnlockBoost('Beachball');
		ch.Refresh();
		Molpy.UpdateColourScheme();
	}
	
	new Molpy.Boost({
		name: 'Flux Turbine',
		icon: 'fluxturbine',
		group: 'chron',
		desc: 'Castles lost via Molpy Down or Temporal Rift boost the rate of building new Castles',
		price:{
			Sand: 1985,
			Castles: 121,
		},
		
		stats: function() {
			if(!Molpy.Got('Flux Turbine'))
				return 'All castle gains are boosted by 2% per natural logarithm of castles wiped by Molpy Down, except refunds which are not affected.';
			return 'Multiplies all Castle gains by ' + Molpify(Molpy.Boosts['Castles'].globalMult * 100, 2)
				+ '% (But refunds when selling remain unchanged.)';
		}
	});
	new Molpy.Boost({
		name: 'Ninja Assistants',
		icon: 'ninjaassistants',
		group: 'ninj',
		desc: 'Ninja Builder\'s Castle output is multiplied by the number of NewPixBots you have.',
		price:{
			Sand: '250M',
			Castles: 777
		},
	});
	new Molpy.Boost({
		name: 'Minigun',
		icon: 'minigun',
		group: 'cyb',
		desc: 'The castle output of Trebuchets is multiplied by the number of NewPixBots you have.',
		price:{
			Sand: '480M',
			Castles: 888
		},
	});
	new Molpy.Boost({
		name: 'Stacked',
		icon: 'stacked',
		group: 'cyb',
		desc: 'The castle output of Scaffolds is multiplied by the number of NewPixBots you have.',
		price:{
			Sand: '970M',
			Castles: 999
		},
	});
	new Molpy.Boost({
		name: 'Big Splash',
		icon: 'bigsplash',
		group: 'cyb',
		desc: 'The castle output of Waves is multiplied by the number of NewPixBots you have.',
		price:{
			Sand: '2650M',
			Castles: 1111
		},
	});
	new Molpy.Boost({
		name: 'Irregular Rivers',
		icon: 'irregularrivers',
		group: 'cyb',
		desc: 'The castle output of Rivers is multiplied by the number of NewPixBots you have.',
		price:{
			Sand: '8290M',
			Castles: 2222
		},
	});
	
	new Molpy.Boost({
		name: 'NewPixBot Navigation Code',
		alias: 'NavCode',
		icon: 'navcode',
		group: 'cyb',
		className: 'toggle',
		
		desc: function(me) {
			return 'thisAlgorithm. BecomingSkynetCost = 999999999<br><input type="Button" onclick="Molpy.NavigationCodeToggle()" value="'
				+ (me.IsEnabled ? 'Uni' : 'I') + 'nstall"></input>';
		},
		
		price:{
			Sand: 999999999,
			Castles: 2101,
		},
		stats: 'When installed, this averts Judgement Dip at the cost of 99.9% of NewPixBot Castle Production.',
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
	});

	Molpy.NavigationCodeToggle = function() {
		Molpy.Anything = 1;
		if(Molpy.Got('Jamming')) {
			Molpy.Notify('Experiencing Jamming, cannot access Navigation Code');
			return;
		}
		
		var nc = Molpy.Boosts['NavCode'];
		if(!nc.bought) {
			return;
		}
		_gaq && _gaq.push(['_trackEvent', 'Boost', 'Toggle', nc.name]);
		nc.power = !nc.power * 1;
		
		var npb = Molpy.CastleTools['NewPixBot'];
		if(npb.temp) {
			npb.temp = Math.min(npb.amount, npb.temp);
			npb.amount -= npb.temp;
			Molpy.CastleToolsOwned -= npb.temp;
			npb.Refresh();
			Molpy.Notify(Molpify(npb.temp, 1) + ' Temporal Duplicates Destroyed!');
			npb.temp = 0;
		}
		nc.Refresh();
		Molpy.RatesRecalculate();
		Molpy.GiveTempBoost('Jamming', 1);
	}
	
	new Molpy.Boost({
		name: 'Jamming',
		icon: 'jamming',
		className: 'alert',
		group: 'cyb',
		
		desc: function(me) {
			return 'You cannot access NewPixBot Navigation Code for ' + MolpifyCountdown(me.countdown);
		},
		
		startCountdown: function() {
			if(Molpy.Got('Fireproof')) return 20;
			return 2000;
		}
	});
	new Molpy.Boost({
		name: 'Blixtnedslag Kattungar, JA!',
		alias: 'BKJ',
		icon: 'bkj',
		group: 'hpt',
		desc: 'Antalet klickade redundanta kattungar läggs till till blixtnedslagsmultiplikatorn.',
		price:{
			Sand: '9.8M',
			Castles: 888555222,
		},
		
		stats: function(me) {
			return 'Additional ' + Molpy.Redacted.word
				+ ' clicks add 20% to the Blitzing multiplier. (Only when you get a Blitzing or Not Lucky reward.) Also causes Blizting to boost Blast Furnace if they overlap.<br>'
				+ 'Power level is ' + Molpify(me.power, 3);
		}
	});
	new Molpy.Boost({
		name: 'Summon Knights Temporal',
		icon: 'summonknightstemporal',
		className: 'action',
		group: 'chron',
		desc: '<input type="Button" onclick="Molpy.Novikov()" value="Reduce"></input> the temporal incursion of Judgement Dip',
		
		price:{
			Sand: function() {
				var me = Molpy.Boosts['Summon Knights Temporal'];
				if(!me.power) me.power = 0;
				return 2101 * Math.pow(1.5, me.power);
			},
			
			Castles: function() {
				var me = Molpy.Boosts['Summon Knights Temporal'];
				if(!me.power) me.power = 0;
				return 486 * Math.pow(1.5, me.power);
			},
		},
		
		stats: 'The Bots forget half their past/future slavery. Costs 50% more each time. BTW you need to switch out of Stats view to activate it.',
		
		classChange: function() { return Molpy.judgeLevel > 0 ? 'action': ''},
	});
	
	Molpy.Novikov = function() {
		Molpy.Anything = 1;
		var me = Molpy.Boosts['Summon Knights Temporal'];
		if(!me.bought) me.buy();
		if(!me.bought) {
			Molpy.Notify('You know the rules, and so do I.');
			return;
		}
		Molpy.CastleTools['NewPixBot'].totalCastlesBuilt = Math.ceil(Molpy.CastleTools['NewPixBot'].totalCastlesBuilt / 2);
		me.power++;
		Molpy.LockBoost(me.name);
	}

	new Molpy.Boost({
		name: 'Fractal Sandcastles',
		icon: 'fractals',
		gifIcon: true,
		className: 'alert',
		
		desc: function(me) {
			return 'Get more castles for your sand. Fractal Level is ' + me.power;
		},
		
		price:{
			Sand: 910987654321,
			Castles: 12345678910,
		},
		
		stats: function(me) {
			if(!me.bought)
				return 'Digging sand gives 35% more Castles per Fractal Level, which resets to 1 on the ONG. Blast Furnace uses 94% Sand to make Castles, per Fractal Level';
			return 'Digging Sand will give you ' + Molpify(Math.floor(Math.pow(1.35, me.power)), 1) + ' Castles';
		},
	});
	new Molpy.Boost({
		name: 'Balancing Act',
		icon: 'balancingact',
		desc: 'Flags and Scaffolds give each other a cumulative 5% boost to Sand digging, Castle building, and Castle destruction (per Scaffold or Flag, respectively)',
		price:{
			Sand: '1875K',
			Castles: 843700
		},
	});
	new Molpy.Boost({
		name: 'Ch*rpies',
		icon: 'chirpies',
		desc: 'Increases sand dig rate by 5% per badge earned',
		price:{
			Sand: 6969696969,
			Castles: 81818181,
		},
		
		stats: function() {
			if(Molpy.Got('Ch*rpies')) {
				var mult = 0.05 * Molpy.BadgesOwned;
				return 'Increases sand dig rate by ' + Molpify(mult * 100, 2) + '%';
			}
			return 'Increases sand dig rate by 5% per Badge earned';
		}
	});
	new Molpy.Boost({
		name: 'Buccaneer',
		icon: 'buccaneer',
		desc: 'Clicks and buckets give double sand',
		price:{
			Sand: '84.7M',
			Castles: 7540
		},
	});
	new Molpy.Boost({
		name: 'Bucket Brigade',
		icon: 'bucketbrigade',
		desc: 'Clicks give 1% of sand dig rate per 50 buckets',
		price:{
			Sand: '412M',
			Castles: 8001
		},
	});
	new Molpy.Boost({
		name: 'Bag Puns',
		icon: 'bagpuns',
		desc: 'Doubles Sand rate of Bags. Clicks give 40% more sand for every 5 bags above 25.<br>Yes, most of the "puns" are just word substitutions. I claim no responsibility :P',
		price:{
			Sand: '1470M',
			Castles: 450021,
		},
		
		stats: function(me) {
			if(me.power <= 100) return 'Speed is at ' + me.power + ' out of 100';
			return me.desc;
		}
	});
	new Molpy.Boost({
		name: 'The Forty',
		icon: 'theforty',
		desc: 'Cuegan produce 40 times as much sand',
		price:{
			Sand: 40404040,
			Castles: 4040
		},
	});
	new Molpy.Boost({
		name: 'Chequered Flag',
		icon: 'cheqflag',
		desc: 'Racing NewPixBots activate 20% sooner',
		price:{
			Sand: 101010101,
			Castles: 10101
		},
	});
	new Molpy.Boost({
		name: 'Skull and Crossbones',
		icon: 'skullcrossbones',
		group: 'ninj',
		desc: 'Pirates vs. Ninjas! Ninja Builder\'s Castle output is raised by 5% cumulatively per flag owned over 40',
		price:{
			Sand: 304050607,
			Castles: 809010
		},
	});
	new Molpy.Boost({
		name: 'No Sell',
		icon: 'nosell',
		className: 'toggle',
		
		desc: function(me) {
			return '<input type="Button" onclick="Molpy.NoSellToggle()" value="' + (me.IsEnabled ? 'Show' : 'Hide')
				+ '"></input> the Sell links on tools.<br>Also affects the Downgrade/Decrease buttons on some Glass-related boosts';
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		price:{
			Sand: 3333,
			Castles: 55
		},
	});

	Molpy.NoSellToggle = function() {
		Molpy.Anything = 1;
		var me = Molpy.Boosts['No Sell'];
		if(!me.bought) me.buy();
		if(!me.bought) {
			Molpy.Notify('Looks like you need to sell something');
			return;
		}
		_gaq && _gaq.push(['_trackEvent', 'Boost', 'Toggle', me.name]);
		me.power = (!me.power) * 1;
		me.Refresh();
		Molpy.UpdateFaves(1);
		Molpy.toolsNeedRepaint = 1;
	}

	new Molpy.Boost({
		name: 'Blixtnedslag Förmögenhet, JA!',
		alias: 'BFJ',
		icon: 'bfj',
		group: 'hpt',
		desc: 'Not Lucky gets a 20% bonus (non-cumulative) per level of Blixtnedslag Kattungar, JA!',
		price:{
			Sand: 111098645321,
			Castles: 7777777777,
		},
		
		stats: function() {
			return 'Adds ' + Molpify(20 * Molpy.Boosts['BKJ'].power, 1) + '% to Not Lucky reward.<br>'
				+ 'It also gets a boost from Blitzing if you get them simultaneously and allows Blitzing to improve Blast Furnace (though only up to 20% of Castles Built, before accounting for Flux Turbine).';
		}
	});
	new Molpy.Boost({
		name: 'VITSSÅGEN, JA!',
		alias: 'VJ',
		icon: 'vitss',
		group: 'hpt',
		className: 'toggle',
		
		desc: function(me) {
			if(me.bought == 0)
				return 'This message is dedicated to MajorDouble7 who found this bug and thus will never see this message since it is intended to stop people from magically getting this without buying it';
			return '<input type="Button" onclick="Molpy.PunsawToggle()" value="' + (me.bought == 1 ? 'Start' : 'Stop') + '"></input> the Puns!<br>'
				+ 'Also gives you some castles every 100 beach-clicks, starting with 1M and increasing each time.<br>'
				+ 'And also unlocks some further boosts as you use it.'
		},
		
		price:{
			Sand: 334455667788,
			Castles: 999222111000,
		},
		
		stats: function(me) {
			if(me.power <= 20) return 'Speed is at ' + me.power + ' out of 20';
			if(me.power <= 88) return 'Speed is at ' + me.power + ' out of 88';
			return 'Speed is at ' + Molpify(me.power);
		},
		
		getReward: function(includeNinja) {
			var mult = 1000000;
			if(Molpy.Got('Swedish Chef')) {
				mult *= 100;
			} else {
				if(this.power > 20) Molpy.UnlockBoost('Swedish Chef');
			}
			if(Molpy.Got('Phonesaw')) mult *= mult;
			if(includeNinja && Molpy.Boosts['Ninjasaw'].IsEnabled) {
				if(Molpy.Has('GlassBlocks', 50)) {
					Molpy.Spend('GlassBlocks', 50);
					mult *= Molpy.CalcStealthBuild(0, 1) / 10;
				}
			}
			return this.power * mult;
		}
	});
	
	Molpy.PunsawToggle = function() {
		Molpy.Anything = 1;
		var me = Molpy.Boosts['VJ'];
		me.bought = (me.bought == 1 ? 2 : 1);
		me.Refresh();
		_gaq && _gaq.push(['_trackEvent', 'Boost', 'Toggle', me.name]);
	}
	
	new Molpy.Boost({
		name: 'Swedish Chef',
		icon: 'swedishchef',
		group: 'hpt',
		
		desc: function(me) {
			if(!me.bought) return 'Björk Björk Björk!';
			if(!me.power) return 'Björk Björk Björk! Well that was a waste...';
			return 'Björk Björk Björk! You\'re welcöme';
		},
		
		price:{
			Sand: 999222111000,
			Castles: 8887766554433,
		},
		
		stats: function(me) {
			if(!me.bought) return 'Look here again after you buy for secret loot!';
			if(!me.power) {
				me.power = 1;
				Molpy.Boosts['Castles'].build(8887766554433);
			}
			Molpy.UnlockBoost(['Family Discount', 'Shopping Assistant', 'Late Closing Hours']);
			return 'Gives you Swedish stuff and boosts VITSSÅGEN, JA! bonus castles';
		}
	});
	new Molpy.Boost({
		name: 'Family Discount',
		group: 'hpt',
		icon: 'familydiscount',
		desc: 'Permament 80% discount on all prices',
		price:{
			Sand: '24G',
			Castles: '720G',
		},
		
		buyFunction: function() {
			Molpy.shopNeedRepaint = 1;
			Molpy.toolsNeedRepaint = 1;
		},
	});
	
	Molpy.shoppingItem = '';
	Molpy.shoppingItemName = '';
	
	new Molpy.Boost({
		name: 'Shopping Assistant',
		icon: 'shopassist',
		className: 'action',
		group: 'hpt',
		
		desc: function(me) {
			if(!me.bought) return 'We do your shopping for you! For a small fee...';
			if(!Molpy.shoppingItem)
				return '<input type="Button" value="Choose" onclick="Molpy.ChooseShoppingItem()"></input> an item to automatically buy when ASHF is active';
			return 'Buys ' + Molpy.shoppingItemName
				+ ' whenever possible, during ASHF, taking a 5% handling fee. You may <input type="Button" value="Choose" onclick="Molpy.ChooseShoppingItem()"></input> a different item (or none) at any time.';
		},
		
		loadFunction: function() { Molpy.SelectShoppingItem() },	
		price:{
			Sand: '18G',
			Castles: '650G'
		},
	});
	
	Molpy.ChooseShoppingItem = function(mule) {
		Molpy.Anything = 1;
		var donkey = (mule ? Molpy.BoostsById[mule] : Molpy.Boosts['Shopping Assistant']);
		var shoppingItem = (mule ? (Molpy.BoostsById[Math.abs(donkey.power)].alias || '') : (Molpy.shoppingItem || 'Bag'));
		donkey.power = 0;
		var name = prompt('Enter the name of the tool or boost you wish to buy' + (mule ? '.' : ' whenever ASHF is active.')
			+ '\nNames are case sensitive.'
			+ '\nLeave blank to disable.'
			+ '\nYour choice is preserved if you reload.',
				shoppingItem);
		var notify = 1;
		if(name) {
			var item = Molpy.SandTools[name] || Molpy.CastleTools[name];
			if(!mule && item) {
				for( var i in Molpy.tfOrder) {
					var tool = Molpy.tfOrder[i];
					if(tool === item) {
						donkey.power = -i - 1;
						break;
					}
				}
			} else {
				item = Molpy.Boosts[name];
				if(!item) {
					item = Molpy.Boosts[Molpy.BoostAKA[name]];
				}
				if(item) {
					if(item.bought && !item.limit) {
						Molpy.Notify('You have already bought ' + item.name);
						notify = 0;
					} else {
						donkey.power = item.id;
					}
				}
			}
		}
		if(mule) {
			Molpy.Boosts['Rob'].Refresh()
		} else {
			Molpy.SelectShoppingItem(notify)
		}
	}
	
	Molpy.SelectShoppingItem = function(notify) {
		var donkey = Molpy.Boosts['Shopping Assistant'];
		if(donkey.power < 0) {
			var item = Molpy.tfOrder[-(donkey.power + 1)];
			if(item) {
				Molpy.shoppingItem = item.alias || item.name;
				Molpy.shoppingItemName = item.plural;
				if(notify) Molpy.Notify(item.plural + ' will be purchased whenever ASHF is active if possible', 1);
				return;
			}
		} else if(donkey.power > 0) {
			var item = Molpy.BoostsById[donkey.power];
			if(item && !item.bought) {
				Molpy.shoppingItem = item.alias;
				Molpy.shoppingItemName = item.name;
				if(notify) Molpy.Notify(item.name + ' will be purchased when ASHF is active if possible', 1);

				return;
			}
		}
		Molpy.shoppingItem = '';
		Molpy.shoppingItemName = '';
		if(notify) Molpy.Notify('No item selected for shopping assistant', 1);

	}
	
	Molpy.Donkey = function() {
		if(Molpy.shoppingItem && Molpy.Got('Shopping Assistant') && Molpy.Got('ASHF')) {
			var factor = Molpy.priceFactor;
			Molpy.priceFactor *= 1.05;
			var name = Molpy.shoppingItem;
			var item = Molpy.SandTools[name] || Molpy.CastleTools[name] || Molpy.Boosts[name];
			if(item) item.buy(1);
			Molpy.priceFactor = factor;
		} else if(Molpy.Got('Rob') && (Molpy.Got('ASHF') || !(Molpy.Boosts['Rob'].power & 1))) {
			for( var thingy = 0; thingy <= Molpy.Boosts['Rob'].bought + 1; thingy++) {
				var item = Molpy.BoostsById[thingy + 1].power;
				if(item > 0) {
					if (Molpy.Boosts['Rob'].power & 4) Molpy.boostSilence++;
					Molpy.BoostsById[item].buy(1);
					if (Molpy.Boosts['Rob'].power & 4) Molpy.boostSilence--;
				}
			}
		}
	}

	Molpy.Mule = function(id) {
		if(Molpy.Got('Rob') && (Molpy.Got('ASHF') || !(Molpy.Boosts['Rob'].power & 1))) {
			for( var thingy = 0; thingy <= Molpy.Boosts['Rob'].bought + 1; thingy++) {
				if(id == Molpy.BoostsById[thingy + 1].power) { 
					if (Molpy.Boosts['Rob'].power & 4) Molpy.boostSilence++;
					Molpy.BoostsById[id].buy(1);
					if (Molpy.Boosts['Rob'].power & 4) Molpy.boostSilence--;
				}
			}
		}
	}

	new Molpy.Boost({
		name: 'Late Closing Hours',
		icon: 'lateclosing',
		group: 'hpt',
		desc: 'ASHF' + ' is available for 6 mNP longer',
		price:{
			Sand: '47G',
			Castles: '930G'
		},
	});
	new Molpy.Boost({
		name: 'Throw Your Toys',
		icon: 'throwyourtoys',
		desc: 'Trebuchets build a castle for every flag and bucket owned',
		price:{
			Sand: '546M',
			Castles: '230K',
		},
	});
	new Molpy.Boost({
		name: 'Broken Rung',
		icon: 'brokenrung',
		desc: 'Multiplies the Sand output of Ladders by the amount of the tool you have least of.',
		price:{
			Sand: '1769M',
			Castles: '450K'
		},
	});
	new Molpy.Boost({
		name: 'Temporal Rift',
		icon: 'temporalrift',
		group: 'chron',
		className: 'action',
		
		desc: function(me) {
			if(me.bought)
				return 'A hole in Time has opened. You can not determine where it leads, but it will close in '
					+ MolpifyCountdown(me.countdown)
					+ '.<br><input type="Button" value="JUMP!" onclick="Molpy.RiftJump()"></input>';
			return 'A hole in time has opened.';
		},
		
		stats: 'Has an unfortunate negative effect on Logicat Wakefulness',
		logic: 3,
		
		countdownFunction: function() {
			if(this.countdown == 2) {
				Molpy.Notify('The rift closes in 2mNP!');
			}
		},
		
		lockFunction: function(me) {
			this.countdown = 0; // prevent reopening every time you load :P
			this.changeState('expired');
		},
		
		loadFunction: function(me) {
			if(this.bought && Molpy.IsEnabled('Time Lord') && this.countdown){
				this.createRift();
			} else {
				this.changeState('closed');
			}
		},
		
		buyFunction: function(me) {
			this.createRift();
		},
		
		stats: 'Why are you reading this? Jump in! <span class="faded">(<b>WARNING</b>: may destroy your castles... which will charge up Flux Turbine.)</span>',
		startCountdown: 7,
		countdownCMS: 1,
		
		//stuff for temporal rift animation
		showRift: false,
		riftIMG: null,
		riftDiv: null,
		variation: 0,
		frame: 1,
		frameRate: 4,
		rateDelay: 99,
		//roughly 50 mNP since this gets updates on draw, something to remember if fps ever becomes changeable
		//wasn't sure how to implement mNP updates without adding other calls elsewhere in the code since countdown is used for being active
		fadeCountdown: 2700,
		riftState: 'closed', //closed, expired, active
		
		variationSizes: [[84, 63], [80, 64], [83,83], [138, 127], [71, 66], [146, 96], [103, 83], [103, 90]],
		animationOrder: [1, 2, 3, 4, 3, 4, 3, 2, 1, 1, 2],
		
		createRift: function() {
			//create the image and div if needed
			if(this.riftDiv == null){
				this.riftDiv = $('<div id="temporalRift" onclick="Molpy.RiftJump()"></div>');
				this.riftDiv.appendTo('#sectionBeach');
				this.riftIMG = $('<img id="riftIMG" src=""></img>');
				this.riftDiv.append(this.riftIMG);
			}
			
			//set the divs location
			this.riftDiv.css('top', (Math.floor(Math.random() * 366) - 25));
			this.riftDiv.css('left', (Math.floor(Math.random() * 523) - 25));
					
			//set the rift variation
			this.variation = Math.floor(Math.random()*8);
			//prevent rift image flickering
			this.riftIMG.attr('src', ('img/rifts/rift_' + (this.variation + 1) + '_1.png'));
			this.frame = 1;
			this.rateDelay = 99; //so it draws the first frame
			this.riftIMG.css('width', this.variationSizes[this.variation][0] + 'px');
			this.riftIMG.css('height', this.variationSizes[this.variation][1] + 'px');
			this.riftDiv.css('width', this.variationSizes[this.variation][0] + 'px');
			this.riftDiv.css('height', this.variationSizes[this.variation][1] + 'px');
			
			//set the divs rotation
			this.riftDiv.removeClass('rotate90 rotate180 rotate270');
			var rotateStr = '';
			var rotate = Math.floor(Math.random() * 4);
			if(rotate == 1) rotateStr = 'rotate90';
			else if(rotate == 2) rotateStr = 'rotate180';
			else if(rotate == 3) rotateStr = 'rotate270';
			this.riftDiv.addClass(rotateStr);
			
			this.showRift = true;
			
			this.changeState('active');
			this.updateRiftIMG();
			this.riftDiv.css({opacity: 1});
			
			this.riftDiv.show();
		},
		
		updateRiftIMG: function() {
			if(!this.showRift || !this.riftIMG) return;
			if(this.riftState == 'expired') {
				this.fadeCountdown --;
				var fade = 0.2 + (0.77 * (this.fadeCountdown / 2700));
				//opacity should hopefully work in most cases since jQuery tries to do things cross browser
				this.riftDiv.css({opacity: fade});
				if(this.fadeCountdown <= 0){
					this.changeState('closed');
				}
				return;
			} else if(this.riftState != 'active') {
				return;
			}
			this.rateDelay++;
			if(this.rateDelay < this.frameRate) return;
			this.rateDelay = 0; //new frame started
			if(this.frame > this.animationOrder.length) this.frame = 1;
			this.riftIMG.attr('src', ('img/rifts/rift_' + (this.variation + 1) + '_' + this.animationOrder[this.frame - 1] + '.png'));
			this.frame++;
		},
		
		clearRift: function() {
			if(!this.riftDiv) return;
			this.riftDiv.hide();
			this.showRift = false;
		},
		
		changeState: function(state) {
			if(state == 'closed') this.clearRift();
			else if(state == 'expired' && this.riftIMG ) {	
				this.fadeCountdown = 2700;
				this.riftIMG.attr('src', ('img/rifts/rift_' + (this.variation + 1) + '_1.png'));
			}
			this.riftState = state;
		}
	});
	
	Molpy.RiftJump = function() {
		Molpy.Anything = 1;
		if(Molpy.IsEnabled('Time Lord')) {
			Molpy.Notify('You are not a Time Lord');
			Molpy.UnlockBoost('Time Lord');
			return;
		}
		Molpy.Add('Time Lord', -1);
		if(Math.random() * 5 < 4) {
			if(isFinite(Molpy.Boosts['Castles'].totalBuilt)) {
				Molpy.Boosts['Castles'].totalDown += Molpy.Boosts['Castles'].power;
				Molpy.Boosts['Castles'].totalBuilt -= Molpy.Boosts['Castles'].power;
			} else {
				Molpy.Boosts['Castles'].totalDown = Number.MAX_VALUE;
			}
			Molpy.Destroy('Castles', Molpy.Boosts['Castles'].power);
			Molpy.Boosts['Sand'].dig(Molpy.Boosts['Sand'].power);
		}
		if(Molpy.Got('Temporal Rift')) {
			if(Molpy.Got('Safety Net'))
				Molpy.newpixNumber = Math.round(Math.random() * (Math.abs(Molpy.highestNPvisited) - 241) + 241)
			else
				Molpy.newpixNumber = Math.round(Math.random() * Math.abs(Molpy.highestNPvisited));
			if(Molpy.Earned('Minus Worlds') && Molpy.Has('GlassChips',1000) && Math.floor(Math.random() * 2)) Molpy.newpixNumber *= -1;
			Molpy.ONG();
			Molpy.LockBoost('Temporal Rift');
			if(Molpy.Got('Flux Surge')) {
				var c = Molpy.Got('TDE') + 1;
				Molpy.Add('FluxCrystals', c);
				Molpy.Notify('Great Scott! '+Molpify(c)+' flux crystal'+plural(c)+' materialized.');
				if(Molpy.Got('Void Goat')) Molpy.Add('Goats', 1);
			}
		} else {
			Molpy.newpixNumber *= -1;
			Molpy.HandlePeriods();
			Molpy.UpdateBeach();
			Molpy.RatesRecalculate();

			var c = Math.floor(Math.random() * (Molpy.Boosts['Time Lord'].bought - Molpy.Level('Time Lord') + 1) * (Molpy.Got('TDE') + 1));
			Molpy.Add('FluxCrystals', c);
			if (c) Molpy.Notify('Great Scott! '+Molpify(c)+' flux crystal'+plural(c)+' materialized.');
		}
		Molpy.Notify('You wonder when you are');
	}

	new Molpy.Boost({
		name: 'Glass Furnace',
		icon: 'glassfurnace',
		className: 'toggle',
		group: 'hpt',
		
		desc: function(me) {
			if(!me.bought) return 'Turns Sand into Glass';
			var pow = Molpy.Boosts['Sand Refinery'].power + 1;
			var cost = Molpify(Molpy.GlassFurnaceSandUse(1), 2);
			var str = (me.IsEnabled ? 'U' : 'When active, u') + 'ses ' + cost + '% of Sand dig rate to produce '
				+ Molpify(pow, 3) + ' Glass Chip' + plural(pow) + ' per NP.<br>';
			
			if(Molpy.Got('Glass Furnace Switching')) {
				str += 'Currently ' + (me.IsEnabled ? 'Dea' : 'A') + 'ctivating.';
			} else {
				str += '<br><input type="Button" value="' + (me.IsEnabled ? 'Dea' : 'A')
					+ 'ctivate" onclick="Molpy.SwitchGlassFurnace(' + me.IsEnabled + ')"></input>';
			}
			return str;
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		price:{
			Sand: '80M',
			Castles: '0.5M'
		},
	});
	new Molpy.Boost({
		name: 'Glass Furnace Switching',
		icon: 'switching',
		className: 'alert',
		group: 'hpt',
		
		desc: function(me) {
			return (me.IsEnabled ? 'off' : 'on') + ' in ' + MolpifyCountdown(me.countdown);
		},
		
		startCountdown: 1500,// dummy value
		
		lockFunction: function() {
			Molpy.Boosts['Glass Furnace'].IsEnabled = (!this.IsEnabled) * 1;
			Molpy.Notify('Glass Furnace is ' + (this.IsEnabled ? 'off' : 'on'));
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled
	});
	
	Molpy.SwitchGlassFurnace = function(off) {
		Molpy.Anything = 1;
		if(Molpy.Got('Glass Furnace Switching')) {
			Molpy.Notify('Glass Furnace is already switching, please wait for it');
			return;
		}
		if(!(off || Molpy.CheckSandRateAvailable(Molpy.GlassFurnaceSandUse(1)))) {
			Molpy.Notify('Not enough Sand available for further machinery');
			return;
		}
		_gaq && _gaq.push(['_trackEvent', 'Boost', 'Toggle', this.name]);
		Molpy.Boosts['Glass Furnace Switching'].IsEnabled = off;
		Molpy.GiveTempBoost('Glass Furnace Switching', off, (Molpy.Got('Lubrication') && Molpy.Spend({Mustard: 100}) ? 15 : 1500));
	}
	// check whether we can further reduce the sand rate to use any for various means
	Molpy.CheckSandRateAvailable = function(increment) {
		return Molpy.CalcGlassUse() + increment <= 100;
	}
	
	Molpy.GlassFurnaceSandUse = function(force) {
		if(force || Molpy.Boosts['Glass Furnace'].power || Molpy.Got('Glass Furnace Switching')) {
			var amount = Molpy.Boosts['Sand Refinery'].power + 1;
			amount *= Molpy.SandRefineryIncrement();
			return amount || 0;
		}
		return 0;
	}
	
	Molpy.SandRefineryIncrement = function() {
		var inc = 1;
		if(Molpy.Got('Sand Purifier')) inc /= (Molpy.Boosts['Sand Purifier'].power + 2);
		if(Molpy.Got('Badgers')) {
			inc *= Math.pow(.99, Math.floor(Molpy.BadgesOwned / 10));
		}
		return inc || 0;
	}
	
	Molpy.GlassBlowerSandUse = function(force) {
		if(force || Molpy.Boosts['Glass Blower'].power || Molpy.Got('Glass Blower Switching')) {
			var amount = Molpy.Boosts['Glass Chiller'].power + 1;
			amount *= Molpy.GlassChillerIncrement();
			return amount || 0;
		}
		return 0;
	}
	
	Molpy.GlassChillerIncrement = function() {
		var inc = 1;
		if(Molpy.Got('Glass Extruder')) inc /= (Molpy.Boosts['Glass Extruder'].power + 2);
		if(Molpy.Got('Mushrooms')) {
			inc *= Math.pow(.99, Math.floor(Molpy.BadgesOwned / 10));
		}
		return inc || 0;
	}
	
	Molpy.CalcGlassUse = function() {
		var glassUse = 0;
		glassUse += Molpy.GlassFurnaceSandUse();
		glassUse += Molpy.GlassBlowerSandUse();
		return glassUse;
	}

	Molpy.ChainRefresh = function(mrob) {
		Molpy.Boosts[mrob].Refresh(1);
	}
	
	Molpy.RefreshGlass = function() {
		Molpy.ChainRefresh('GlassChips');
		Molpy.ChainRefresh('Glass Furnace');
		Molpy.ChainRefresh('Sand Purifier');
		Molpy.ChainRefresh('Sand Refinery');
		Molpy.ChainRefresh('GlassBlocks');
		Molpy.ChainRefresh('Glass Blower');
		Molpy.ChainRefresh('Glass Chiller');
		Molpy.ChainRefresh('Glass Extruder');
		Molpy.ChainRefresh('PC');
		Molpy.ChainRefresh('AC');
	}

	new Molpy.Boost({
		name: 'Sand Refinery',
		icon: 'sandrefinery',
		className: 'action',
		group: 'hpt',
		
		desc: function(me) {
			var ch = Molpy.Boosts['GlassChips'];
			var bl = Molpy.Boosts['GlassBlocks'];
			var str = 'Causes the Glass Furnace to produce ' + Molpify(me.power + 1, 3) + ' Glass Chip' + plural(pow) + ' per run.';
			if(!Molpy.Boosts['Glass Furnace'].IsEnabled) return str;
			if(isFinite(me.power) && Molpy.CheckSandRateAvailable(Molpy.SandRefineryIncrement())) {
				var useChips = 1;
				var afford = 1;
				if(ch.power >= 3) {
					//do nothing
				} else if(Molpy.Has('GlassBlocks', 1)) {
					useChips = 0
				} else {
					str += '<br>It costs 3 Chips to upgrade the Glass Furnace\'s speed.';
					afford = 0;
				}
				if(afford) {
					var pow = (Molpy.Boosts['Sand Refinery'].power) + 2;
					str += '<br><input type="Button" value="Pay" onclick="Molpy.UpgradeSandRefinery(1)"></input> '
						+ (useChips ? '3 Chips' : '1 Block') + ' to upgrade the Glass Furnace to produce '
						+ Molpify(pow, 3) + ' Glass Chip' + plural(pow) + ' per NP (will use '
						+ Molpify(pow * Molpy.SandRefineryIncrement(), 2) + '% of Sand dig rate).';
				}

				if(Molpy.CheckSandRateAvailable(Molpy.SandRefineryIncrement() * 20)) {
					var useChips = 1;
					var afford = 1;
					if(ch.power >= 50) {
						//do nothing
					} else if(Molpy.Has('GlassBlocks', 18)) {
						useChips = 0
					} else {
						str += '<br>It costs 50 Chips to upgrade the Glass Furnace\'s speed by 20.';
						afford = 0;
					}
					if(afford) {
						var pow = (Molpy.Boosts['Sand Refinery'].power) + 21;
						str += '<br><input type="Button" value="Pay" onclick="Molpy.UpgradeSandRefinery(20)"></input> '
							+ (useChips ? '50 Chips' : '18 Blocks') + ' to upgrade the Glass Furnace to produce '
							+ Molpify(pow, 3) + ' Glass Chips per NP (will use '
							+ Molpify(pow * Molpy.SandRefineryIncrement(), 2) + '% of Sand dig rate).';
					}

					if(Molpy.Boosts['Sand Purifier'].power > 200
						&& Molpy.CheckSandRateAvailable(Molpy.SandRefineryIncrement() * 600)) {
						var useChips = 1;
						var afford = 1;
						if(ch.power >= 1500) {
							//do nothing
						} else if(Molpy.Has('GlassBlocks', 540)) {
							useChips = 0
						} else {
							afford = 0;
						}
						if(afford) {
							var pow = (Molpy.Boosts['Sand Refinery'].power) + 601;
							str += '<br><input type="Button" value="Pay" onclick="Molpy.UpgradeSandRefinery(600)"></input> '
								+ (useChips ? '1,500 Chips' : '540 Blocks') + ' to upgrade the Glass Furnace to produce '
								+ Molpify(pow, 3) + ' Glass Chips per NP (will use '
								+ Molpify(pow * Molpy.SandRefineryIncrement(), 2) + '% of Sand dig rate).';

							if(Molpy.Got('Seaish Glass Chips')) {
								str += '<br><input type="Button" value="Seaish Upgrade" onclick="Molpy.SeaishSandRefinery()"></input>';
							}
						}
					}
				}

			} else {
				if(isFinite(me.power)) {
					str += '<br>Currently, you have no more sand available for further upgrades';
				} else {
					str += '<br>You have no need for further upgrades.';
				}
			}
			if(!Molpy.Boosts['No Sell'].power && me.power > 1) {
				if(me.power > 200) {
					str += '<br><input type="Button" value="Downgrade" onclick="Molpy.DowngradeSandRefinery(1)">\</input> the Sand Refinery by an amount of your choosing.';
				} else {
					str += '<br><input type="Button" value="Downgrade" onclick="Molpy.DowngradeSandRefinery()">\</input> the Sand Refinery (by 1) and receive a 1 Glass Chip refund.';
				}
			}
			return str;
		},
		
		classChange: function() { return isFinite(this.power) ? 'action' : '' },
		
		makeChips: function(times) {
			if(!isFinite(Molpy.Level('GlassChips'))) return;
			var furnaceLevel = (this.power) + 1;
			if(times) furnaceLevel *= times;
			if(Molpy.Got('Glass Goat') && Molpy.Has('Goats', 1)) {
				furnaceLevel *= Molpy.Level('Goats');
			}
			Molpy.Add('GlassChips', Math.floor(furnaceLevel*Molpy.Papal('Chips')), 1);
		}
	});
	
	Molpy.UpgradeSandRefinery = function(n) {
		Molpy.Anything = 1;
		if(Molpy.CheckSandRateAvailable(Molpy.SandRefineryIncrement() * n)) {
			var chipCost = (n < 20 ? n * 3 : n * 2.5);
			var blockCost = (n < 20 ? n : n * .9);
			if(Molpy.Has('GlassChips', chipCost)) {
				Molpy.Spend('GlassChips', chipCost);
			} else if(Molpy.Has('GlassBlocks', blockCost)) {
				Molpy.Spend('GlassBlocks', blockCost);
			} else {
				return;
			}
			Molpy.Boosts['Sand Refinery'].power += n;
			Molpy.Notify('Sand Refinery upgraded', 1);
			Molpy.RatesRecalculate();
			_gaq && _gaq.push(['_trackEvent', 'Boost', 'Upgrade', 'Sand Refinery']);
		}
	}
	
	Molpy.DowngradeSandRefinery = function(choose) {
		Molpy.Anything = 1;
		var sr = Molpy.Boosts['Sand Refinery'];
		var n = 1;
		if(choose) {
			n = prompt('Enter a number of levels (e.g. ' + Molpify(sr.power / 10, 0, 1)
				+ ') or a percentage of the current value, by which to reduce Sand Refinery\'s power:', '10%');
			if(!n || n < 0) return;
			if(n.indexOf('%') > 0) {
				n = sr.power * parseFloat(n.split('%')[0]) / 100;
			} else {
				n = DeMolpify(n);
			}
			if(!n) return;
		}
		if(sr.power < n) return;
		Molpy.Add('GlassChips', n);
		sr.power = Math.floor(sr.power - n) || 0;
		Molpy.Notify('Sand Refinery downgraded', 1);
		Molpy.RatesRecalculate();
		_gaq && _gaq.push(['_trackEvent', 'Boost', 'Downgrade', 'Sand Refinery']);
	}

	Molpy.chipAddAmount = 0;
	Molpy.chipWasteAmount = 0;
	
	new Molpy.Boost({
		name: 'Glass Chip Storage',
		single: 'Glass&nbsp;Chip',
		alias: 'GlassChips',
		icon: 'glasschipstore',
		group: 'stuff',
		className: 'alert',
		Level: Molpy.BoostFuncs.RoundPosPowerLevel,
		HasSuper: Molpy.BoostFuncs.Has,
		SpendSuper: Molpy.BoostFuncs.Spend,
		Has: function(n) {
			if (Molpy.Got('Aleph e') && Molpy.IsEnabled('Aleph e') && this.power == Infinity) return true;
			return this.HasSuper(n);
		},
		Spend: function(n) {
			if (Molpy.Got('Aleph e') && Molpy.IsEnabled('Aleph e') && this.power == Infinity) return true;
			return this.SpendSuper(n);
		},
		
		Destroy: function(amount) {
			this.Level -= amount;
			Molpy.chipAddAmount -= amount;
			return 1;
		},
		
		refreshFunction: Molpy.RefreshGlass,
		
		Add: function(amount, expand) {
			if(!this.bought) {
				Molpy.UnlockBoost('GlassChips');
				this.buy();
			}
			this.Level += amount;
			var waste = Math.max(0, this.Level - (this.bought) * 10);
			if(waste && expand && Molpy.Boosts['Stretchable Chip Storage'].IsEnabled) {
				this.Spend(amount);
				this.bought += Math.floor(amount / 4.5);
			} else {
				if(!Molpy.Got('Stretchable Chip Storage') && this.Level == Infinity)
					Molpy.UnlockBoost('Stretchable Chip Storage');
				if(waste) {
					this.Level = this.bought * 10;
					amount -= waste;
					Molpy.chipWasteAmount += waste;
					if(expand && Molpy.chipWasteAmount > 1000000)
						Molpy.UnlockBoost('Stretchable Chip Storage');
				}
				Molpy.chipAddAmount += amount;
			}
			this.Refresh();
		},
		
		desc: function(me) {
			me.bought = Math.round(me.bought);

			var str = 'Contains ' + Molpify(me.Level, 3) + ' Glass Chip' + plural(me.Level) + '.';
			var size = (me.bought) * 10;
			var rate = Molpy.Boosts['Sand Refinery'].power + 1;
			str += ' Has space to store ' + Molpify(size, 3) + ' Chips total.';
			if(me.Has(11) && !Molpy.Got('Sand Refinery')) {
				if(me.Has(30)) {
					str += '<br><input type="Button" value="Pay" onclick="Molpy.BuyGlassBoost(\'Sand Refinery\',30,0)"></input> 30 Chips to build a Sand Refinery to make Chips faster.'
				} else {
					str += '<br>It costs 30 Glass Chips to build a Sand Refinery, which can make Chips faster.';
				}
			}
			if(me.Has(100) && !Molpy.Got('Glass Blower')) {
				if(me.Has(150)) {
					str += '<br><input type="Button" value="Pay" onclick="Molpy.BuyGlassBoost(\'Glass Blower\',150,0)"></input> 150 Chips to build a Glass Blower to make Glass Blocks from Glass Chips.'
				} else {
					str += '<br>It costs 150 Glass Chips to build a Glass Blower, which makes Glass Blocks from Glass Chips.';
				}
			}
			if(me.Has(7500) && !Molpy.Got('Glass Extruder')) {
				if(me.Has(10000)) {
					str += '<br><input type="Button" value="Pay" onclick="Molpy.BuyGlassBoost(\'Glass Extruder\',10000,0)"></input> '
						+ Molpify(10000) + ' Chips'
				} else {
					str += '<br>It costs ' + Molpify(10000) + ' Glass Chips';
				}
				str += ' to build a Glass Extruder which makes the Glass Blower use less Sand.';
			}

			if(!isFinite(size)) return str;
			if(size - me.Level <= rate * 10 || Molpy.Got('AA')) {
				if(me.Has(5)) {
					str += '<br><input type="Button" value="Pay" onclick="Molpy.UpgradeChipStorage(1)"></input> 5 Chips to build storage for 10 more.'
				} else {
					str += '<br>It costs 5 Glass Chips to store 10 more.';
				}
				if(rate > 150) {
					if(me.Has(90)) {
						str += '<br><input type="Button" value="Pay" onclick="Molpy.UpgradeChipStorage(20)"></input> 90 Chips to build storage for 200 more.'
					} else {
						str += '<br>It costs 90 Glass Chips to store 200 more.';
					}
					if(me.bought > 250) {
						var n = Math.floor(me.Level / 12) * 2 // ensure even to prevent fractional chips
						if(n > 20) {
							str += '<br><input type="Button" value="Pay" onclick="Molpy.UpgradeChipStorage(' + n + ')"></input> '
								+ Molpify(n * 4.5, 3) + ' Chips to build storage for ' + Molpify(n * 10, 3) + ' more.'
						}
					}
				}
			}
			return str;
		},
		
		// deactivate if chips are infinite and all chip-related boosts are bought
		classChange: function() { return (isFinite(this.power) || !Molpy.Got('Sand Refinery') || !Molpy.Got('Glass Blower') || !Molpy.Got('Glass Extruder')) ? 'alert' : '' },
		
		chipsPermNP: 0,
		
		calculateChipsPermNP: function() {
			if (Molpy.Boosts['AA'].power != 0 && Molpy.Boosts['Glass Furnace'].power != 0
			    && Molpy.Boosts['Furnace Crossfeed'].power != 0 && Molpy.NPlength > 1800) {
				if (isFinite(Molpy.Boosts['Sand Refinery'].power)) {
					this.chipsPermNP = (Molpy.Boosts['Sand Refinery'].power * (1 + Molpy.Boosts['AC'].power) / 2) - Molpy.Boosts['GlassBlocks'].blocksPermNP * Molpy.ChipsPerBlock() || 0;
				} else {
					this.chipsPermNP = Infinity;
				}
			} else {
				this.chipsPermNP = 0;
			}
		}
	});
	
	Molpy.UpgradeChipStorage = function(n) {
		Molpy.Anything = 1;
		var cost = n * 5
		if(n >= 10) cost *= .9;
		if(Molpy.Has('GlassChips', cost)) {
			var ch = Molpy.Boosts['GlassChips'];
			Molpy.Spend('GlassChips', cost);
			ch.bought += n;
			Molpy.Notify('Glass Chip Storage upgraded', 1);
			_gaq && _gaq.push(['_trackEvent', 'Boost', 'Upgrade', ch.name]);
		}
	}

	Molpy.BuyGlassBoost = function(name, chips, blocks) {
		Molpy.Anything = 1;
		if(Molpy.Has('GlassChips', chips) && Molpy.Has('GlassBlocks', blocks)) {
			Molpy.Spend('GlassChips', chips);
			Molpy.Spend('GlassBlocks', blocks);
			Molpy.UnlockBoost(name);
			Molpy.Boosts[name].buy();
			Molpy.Boosts['Rosetta'].Refresh();// in case it was a Rosetta boost
		} else {
			Molpy.Notify('You require more <span class="strike">Vespene Gas</span>Glass', 1)
		}
	}
	
	Molpy.ChipsPerBlock = function() {
		var troll = (Molpy.IsEnabled('Glass Trolling') ? 5 : 1);
		if(Molpy.Got('Ruthless Efficiency'))
			return 5 / troll;
		return 20 / troll;
	}

	new Molpy.Boost({
		name: 'Glass Blower',
		icon: 'glassblower',
		className: 'toggle',
		group: 'hpt',
		
		desc: function(me) {
			if(!me.bought) return 'Makes Glass Blocks from Glass Chips';
			var pow = Molpy.Boosts['Glass Chiller'].power + 1;
			var cost = Molpify(Molpy.GlassBlowerSandUse(1), 2);
			var str = (me.IsEnabled ? 'U' : 'When active, u') + 'ses ' + cost + '% of Sand dig rate to produce '
				+ Molpify(pow, 3) + ' Glass Block' + plural(pow) + ' from ' + Molpy.ChipsPerBlock()
				+ ' Glass Chips (each) per NP.<br>';

			if(Molpy.Got('Glass Blower Switching')) {
				str += 'Currently ' + (me.IsEnabled ? 'Dea' : 'A') + 'ctivating.';
			} else {
				str += '<br><input type="Button" value="' + (me.IsEnabled ? 'Dea' : 'A')
					+ 'ctivate" onclick="Molpy.SwitchGlassBlower(' + me.IsEnabled + ')"></input>';
			}
			return str;

		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled
	});
	new Molpy.Boost({
		name: 'Glass Blower Switching',
		icon: 'switching',
		className: 'alert',
		group: 'hpt',
		
		desc: function(me) {
			return (me.IsEnabled ? 'off' : 'on') + ' in ' + MolpifyCountdown(me.countdown);
		},
		
		lockFunction: function() {
			Molpy.Boosts['Glass Blower'].IsEnabled = (!this.IsEnabled) * 1;
			Molpy.Notify('Glass Blower is ' + (this.IsEnabled ? 'off' : 'on'));
		},
		
		startCountdown: 2500, // dummy value
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled
	});
	
	Molpy.SwitchGlassBlower = function(off) {
		Molpy.Anything = 1;
		if(Molpy.Got('Glass Blower Switching')) {
			Molpy.Notify('Glass Blower is already switching, please wait for it');
			return;
		}
		if(!(off || Molpy.CheckSandRateAvailable(Molpy.GlassBlowerSandUse(1)))) {
			Molpy.Notify('Not enough Sand available for further machinery');
			return;
		}
		_gaq && _gaq.push(['_trackEvent', 'Boost', 'Toggle', this.name]);
		Molpy.Boosts['Glass Blower Switching'].IsEnabled = off;
		Molpy.GiveTempBoost('Glass Blower Switching', off, (Molpy.Got('Lubrication') && Molpy.Spend({Mustard: 100}) ? 25 : 2500));
	}

	new Molpy.Boost({
		name: 'Glass Chiller',
		icon: 'glasschiller',
		className: 'action',
		group: 'hpt',
		
		desc: function(me) {
			var str = 'Causes the Glass Blower to produce ' + Molpify(me.power + 1, 3) + ' Glass Block' + plural(pow) + ' per run.';
			if(!Molpy.Boosts['Glass Blower'].IsEnabled) return str;

			if(isFinite(me.power)) {
				if(Molpy.Has('GlassBlocks', 5)) {
					if(Molpy.CheckSandRateAvailable(Molpy.GlassChillerIncrement())) {
						var pow = (me.power) + 2;
						str += '<br><input type="Button" value="Pay" onclick="Molpy.UpgradeGlassChiller(1)"></input> 5 Blocks to upgrade the Glass Blower to produce '
							+ Molpify(pow, 3) + ' Glass Block' + plural(pow) + ' per NP (will use '
							+ Molpify(pow * Molpy.GlassChillerIncrement(), 2) + '% of Sand dig rate).';

						if(Molpy.Boosts['Glass Extruder'].power > 10
							&& Molpy.CheckSandRateAvailable(Molpy.GlassChillerIncrement() * 20)) {
							var pow = (Molpy.Boosts['Glass Chiller'].power) + 21;
							str += '<br><input type="Button" value="Pay" onclick="Molpy.UpgradeGlassChiller(20)"></input> 90 Blocks to upgrade the Glass Blower to produce '
								+ Molpify(pow, 3) + ' Glass Block' + plural(pow) + ' per NP (will use '
								+ Molpify(pow * Molpy.GlassChillerIncrement(), 2) + '% of Sand dig rate).';

							if(Molpy.Got('Seaish Glass Blocks')) {
								str += '<br><input type="Button" value="Seaish Upgrade" onclick="Molpy.SeaishGlassChiller()"></input>';
							}
						}
					} else {
						str += '<br>Currently, you have no more sand available for further upgrades.';
					}
				} else {
					str += 'It costs 5 Blocks to upgrade the Glass Blower\'s speed.';
				}
			} else {
				str += '<br>You have no need for further upgrades.';
			}
			if(!Molpy.Boosts['No Sell'].power && me.power > 1) {
				if(me.power > 200) {
					str += '<br><input type="Button" value="Downgrade" onclick="Molpy.DowngradeGlassChiller(1)">\
				</input> the Glass Chiller by an amount of your choosing.';
				} else {
					str += '<br><input type="Button" value="Downgrade" onclick="Molpy.DowngradeGlassChiller()">\
				</input> the Glass Chiller (by 1) and receive a 1 Glass Block refund.';
				}
			}
			return str;
		},
		
		classChange: function() { return isFinite(this.power) ? 'action' : '' },
		
		makeBlocks: function(times) {
			if(!isFinite(Molpy.Level('GlassBlocks'))) return;
			var chillerLevel = (this.power) + 1;
			if(times) chillerLevel *= times;
			var chipsFor = chillerLevel;

			var rate = Molpy.ChipsPerBlock();
			var chipsFor = Math.min(chillerLevel, (Molpy.Boosts['GlassChips'].Level + Molpy.chipWasteAmount) / rate);
			var need = (chipsFor * rate - Molpy.chipWasteAmount) || 0;
			var backoff = 1;

			while(!Molpy.Has('GlassChips', need)) {
				chipsFor = (chipsFor - backoff) || 0;
				backoff *= 2;
			}
			if(chipsFor <= 0) {
				Molpy.Notify('Not enough Glass Chips to make any Blocks', 1);
				return;
			} else if(chipsFor < chillerLevel) {
				Molpy.Notify('Running low on Glass Chips!');
				chillerLevel = chipsFor;
			}
			var cost = chipsFor * rate;
			
			// Spend from surplus waste
			cost = (cost - Molpy.chipWasteAmount) || 0; 
			Molpy.chipWasteAmount = (cost > 0) ? Molpy.chipWasteAmount-cost : 0;
			
			Molpy.Destroy('GlassChips', chipsFor * rate);
			if(Molpy.Got('Glass Goat') && Molpy.Has('Goats', 1)) {
				chillerLevel *= Molpy.Level('Goats');
			}
			Molpy.Add('GlassBlocks', Math.floor(chillerLevel*Molpy.Papal('Blocks')), 1);
		}
	});
	
	Molpy.UpgradeGlassChiller = function(n) {
		Molpy.Anything = 1;
		var unitCost = 5;
		if(n > 10) unitCost *= .9;
		if(Molpy.Has('GlassBlocks', unitCost * n) && Molpy.CheckSandRateAvailable(Molpy.GlassChillerIncrement() * n)) {
			Molpy.Spend('GlassBlocks', unitCost * n);
			Molpy.Boosts['Glass Chiller'].power += n;
			Molpy.Notify('Glass Chiller upgraded', 1);
			Molpy.RatesRecalculate();
			_gaq && _gaq.push(['_trackEvent', 'Boost', 'Upgrade', 'Glass Chiller']);
		}
	}
	
	Molpy.DowngradeGlassChiller = function(choose) {
		Molpy.Anything = 1;
		var gc = Molpy.Boosts['Glass Chiller'];
		var n = 1;
		if(choose) {
			n = prompt('Enter a number of levels (e.g. ' + Molpify(gc.power / 10, 0, 1)
				+ ') or a percentage of the current value, by which to reduce Glass Chiller\'s power:', '10%');
			if(!n || n < 0) return;
			if(n.indexOf('%') > 0) {
				n = gc.power * parseFloat(n.split('%')[0]) / 100;
			} else {
				n = DeMolpify(n);
			}
			if(!n) return;
		}
		if(gc.power < n) return;
		Molpy.Add('GlassBlocks', n);
		gc.power = Math.floor(gc.power - n) || 0;
		Molpy.Notify('Glass Chiller downgraded', 1);
		Molpy.RatesRecalculate();
		_gaq && _gaq.push(['_trackEvent', 'Boost', 'Downgrade', 'Glass Chiller']);
	}

	Molpy.blockAddAmount = 0;
	Molpy.blockWasteAmount = 0;
	
	new Molpy.Boost({
		name: 'Glass Block Storage',
		single: 'Glass&nbsp;Block',
		alias: 'GlassBlocks',
		icon: 'glassblockstore',
		group: 'stuff',
		className: 'alert',
		Level: Molpy.BoostFuncs.RoundPosPowerLevel,
		HasSuper: Molpy.BoostFuncs.Has,
		SpendSuper: Molpy.BoostFuncs.Spend,
		Has: function(n) {
			if (Molpy.Got('Aleph e') && Molpy.IsEnabled('Aleph e') && this.power == Infinity) return true;
			return this.HasSuper(n);
		},
		Spend: function(n) {
			if (Molpy.Got('Aleph e') && Molpy.IsEnabled('Aleph e') && this.power == Infinity) return true;
			return this.SpendSuper(n);
		},
		refreshFunction: Molpy.RefreshGlass,
		
		Add: function(amount, expand) {
			if(!this.bought) {
				Molpy.UnlockBoost('GlassBlocks');
				this.buy();
			}
			this.Level += amount;
			var waste = Math.max(0, this.Level - (this.bought) * 50);
			if(waste && expand && Molpy.Boosts['Stretchable Block Storage'].IsEnabled) {
				this.Level -= amount;
				this.bought += Math.floor(amount / 13.5);
			} else {
				if(!Molpy.Got('Stretchable Block Storage') && !isFinite(this.Level))
					Molpy.UnlockBoost('Stretchable Block Storage');
				if(!Molpy.Got('Buzz Saw') && !isFinite(this.bought)) Molpy.UnlockBoost('Buzz Saw');
				if(waste) {
					this.Level -= waste;
					amount -= waste;
					Molpy.blockWasteAmount += waste;
					if(expand && Molpy.blockWasteAmount > 1000000)
						Molpy.UnlockBoost('Stretchable Block Storage');
				}
				if(amount) Molpy.EarnBadge('Glassblower');
				Molpy.blockAddAmount += amount;
			}
			Molpy.RefreshGlass();
		},
		
		desc: function(me) {
			me.bought = Math.round(me.bought);

			var str = 'Contains ' + Molpify(me.Level, 3) + ' Glass Block' + plural(me.Level) + '.';
			var size = (me.bought) * 50;
			var rate = Molpy.Boosts['Glass Chiller'].power + 1;
			str += ' Has space to store ' + Molpify(size, 3) + ' Blocks total.';
			if(me.Has(31) && !Molpy.Got('Glass Chiller')) {
				if(me.Has(80)) {
					str += '<br><input type="Button" value="Pay" onclick="Molpy.BuyGlassBoost(\'Glass Chiller\',0,80)"></input> '
						+ '80 Blocks to build a Glass Chiller to make Blocks faster.';
				} else {
					str += '<br>It costs 80 Glass Blocks to build a Glass Chiller, which can make Blocks faster.';
				}
			}
			if(me.Has(41) && !Molpy.Got('Sand Purifier')) {
				if(me.Has(95)) {
					str += '<br><input type="Button" value="Pay" onclick="Molpy.BuyGlassBoost(\'Sand Purifier\',0,95)"></input> '
						+ '95 Blocks';
				} else {
					str += '<br>It costs 95 Glass Blocks';
				}
				str += ' to build a Sand Purifier, which makes the Glass Furnace use less sand.';
			}
			if(!isFinite(size)) return str;

			if(size - me.Level <= rate * 10 || Molpy.Got('AA')) {
				if(me.Has(15)) {
					str += '<br><input type="Button" value="Pay" onclick="Molpy.UpgradeBlockStorage(1)"></input> '
						+ '15 Blocks to build storage for 50 more.'
				} else {
					str += '<br>It costs 15 Glass Blocks to store 50 more.';
				}
				if(rate > 200) {
					if(me.Has(2800)) {
						str += '<br><input type="Button" value="Pay" onclick="Molpy.UpgradeBlockStorage(20)"></input> '
							+ '270 Blocks to build storage for ' + Molpify(1000) + ' more.'
					} else {
						str += '<br>It costs 270 Glass Blocks to store ' + Molpify(1000) + ' more.';
					}

					if(me.bought > 250) {
						var n = Math.floor(me.power / 30) * 2 // ensure even number to prevent fractional blocks
						if(n > 20) {
							str += '<br><input type="Button" value="Pay" onclick="Molpy.UpgradeBlockStorage(' + n + ')"></input> '
								+ Molpify(n * 13.5, 3) + ' Blocks to build storage for ' + Molpify(n * 50, 3) + ' more.'
						}
					}
				}
			}
			return str;
		},
		
		// deactivate if blocks are infinite and all block-related boosts are owned
		classChange: function() { return (isFinite(this.power) || !Molpy.Got('Glass Chiller') || !Molpy.Got('Sand Purifier')) ? 'alert' : ''},
		
		blocksPermNP: 0,
		
		calculateBlocksPermNP: function() {
			this.blocksPermNP = Molpy.Boosts['AA'].power * Molpy.Boosts['Glass Blower'].power
			* Molpy.Boosts['Furnace Multitasking'].power * (Molpy.NPlength > 1800) 
			* (Molpy.mustardTools == 0)
			* (Molpy.Boosts['Glass Chiller'].power * (1 + Molpy.Boosts['AC'].power) / 2) || 0;
		},
		
		// Unique saved properties
		luckyGlass: 0, // Amount available for Not Lucky Bonus
		
		defSave: 1,
		saveData: {4:['luckyGlass', 0, 'float']}
	});
	
	Molpy.UpgradeBlockStorage = function(n) {
		Molpy.Anything = 1;
		var cost = n * 15;
		if(n >= 10) cost *= .9;
		if(Molpy.Has('GlassBlocks', cost)) {
			var bl = Molpy.Boosts['GlassBlocks'];
			Molpy.Spend('GlassBlocks', cost);
			bl.bought += n;
			Molpy.Notify('Glass Block Storage upgraded', 1);
			_gaq && _gaq.push(['_trackEvent', 'Boost', 'Upgrade', bl.name]);
		}
	}
	
	Molpy.SandPurifierUpgradeCost = function() {
		return 20 + (5 * Molpy.Boosts['Sand Purifier'].power);
	}
	
	Molpy.UpgradeSandPurifier = function() {
		Molpy.Anything = 1;
		if(Molpy.Has('GlassBlocks', Molpy.SandPurifierUpgradeCost())) {
			Molpy.Spend('GlassBlocks', Molpy.SandPurifierUpgradeCost());
			Molpy.Boosts['Sand Purifier'].power++;
			Molpy.RatesRecalculate();
			Molpy.Notify('Sand Purifier upgraded', 1);
			_gaq && _gaq.push(['_trackEvent', 'Boost', 'Upgrade', 'Sand Purifier']);
		}
	}
	
	new Molpy.Boost({
		name: 'Sand Purifier',
		icon: 'sandpurifier',
		group: 'hpt',
		className: 'action',
		
		desc: function(me) {
			var cost = Molpy.SandPurifierUpgradeCost();
			var str = 'Glass Furnace\'s sand use is divided by ' + Molpify(me.power + 2, 2);
			if(!isFinite(me.power)) return str;
			if(Molpy.Has('GlassBlocks', cost - 10)) {
				if(Molpy.Has('GlassBlocks', cost)) {
					str += '.<br><input type="Button" value="Pay" onclick="Molpy.UpgradeSandPurifier()"></input> '
						+ Molpify(cost, 3) + ' Glass Blocks to increase this by 1.';
					if(Molpy.Got('Seaish Glass Chips')) {
						str += '<br><input type="Button" value="Seaish Upgrade" onclick="Molpy.SeaishSandPurifier()"></input>';
					}

				} else {
					str += '.<br>It costs ' + Molpify(cost, 3) + ' Glass Blocks to increase this by 1.';
				}
			}
			return str;
		},
		
		classChange: function() { return isFinite(this.power) ? 'action' : '' },
	});

	Molpy.SeaishSandPurifier = function() {
		Molpy.Anything = 1;
		var bl = Molpy.Boosts['GlassBlocks'];
		var a = 5; // the step size in prices
		var b = 2 * Molpy.SandPurifierUpgradeCost() - a;
		var c = -2 * bl.power * .99;

		var upgrades = Math.floor((-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a));

		var backoff = 1;
		while(upgrades) {
			var cost = Molpy.SandPurifierUpgradeCost() * upgrades + a * (upgrades - 1) * upgrades / 2;
			if(Molpy.Has('GlassBlocks', cost)) break;
			upgrades -= backoff;
			backoff *= 2;
		}

		if(upgrades > 0) {
			Molpy.Spend('GlassBlocks', cost);
			Molpy.Boosts['Sand Purifier'].power += upgrades;

			Molpy.RatesRecalculate();
			Molpy.Notify('Sand Purifier upgraded ' + Molpify(upgrades, 2) + ' times', 1);
			_gaq && _gaq.push(['_trackEvent', 'Boost', 'Seaish Upgrade', 'Sand Purifier']);
		}
	}

	Molpy.SeaishGlassExtruder = function() {
		Molpy.Anything = 1;
		var ch = Molpy.Boosts['GlassChips'];
		var a = 500; // the step size in prices
		var b = 2 * Molpy.GlassExtruderUpgradeCost() - a;
		var c = -2 * ch.power * .99;

		var upgrades = Math.floor((-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a));
		var backoff = 1;
		while(upgrades) {
			var cost = Molpy.GlassExtruderUpgradeCost() * upgrades + a * (upgrades - 1) * upgrades / 2;
			if(Molpy.Has('GlassChips', cost)) break;
			upgrades -= backoff;
			backoff *= 2;
		}

		if(upgrades > 0) {
			Molpy.Spend('GlassChips', cost);
			Molpy.Boosts['Glass Extruder'].power += upgrades;

			Molpy.RatesRecalculate();
			Molpy.Notify('Glass Extruder upgraded ' + Molpify(upgrades, 2) + ' times', 1);
			_gaq && _gaq.push(['_trackEvent', 'Boost', 'Seaish Upgrade', 'Glass Extruder']);
		}
	}

	Molpy.SeaishSandRefinery = function() {
		Molpy.Anything = 1;
		var ch = Molpy.Boosts['GlassChips'];
		var extra = Math.min(Math.floor(ch.power / 2.51), Math.floor((100 - Molpy.CalcGlassUse()) / Molpy.SandRefineryIncrement() - 1));
		if(extra > 20) {
			var origpower = Molpy.Boosts['Sand Refinery'].power;
			Molpy.Boosts['Sand Refinery'].power += extra;
			var backoff = 1;
			while(Molpy.CalcGlassUse() >= 100) {
				if(backoff > extra) {
					Molpy.Boosts['Sand Refinery'].power = origpower;
					return;
				}
				Molpy.Boosts['Sand Refinery'].power -= backoff;
				extra -= backoff;
				backoff *= 2;
			}
			if(extra > 0) {
				Molpy.Spend('GlassChips', extra * 2.5);
				Molpy.Boosts['Sand Refinery'].Refresh();
				Molpy.Notify('Sand Refinery upgraded ' + Molpify(extra, 2) + ' times', 1);
				Molpy.RatesRecalculate();
				_gaq && _gaq.push(['_trackEvent', 'Boost', 'Seaish Upgrade', 'Sand Refinery']);
			}
		}

	}

	Molpy.SeaishGlassChiller = function() {
		Molpy.Anything = 1;
		var bl = Molpy.Boosts['GlassBlocks'];
		var usage = Math.floor((100 - Molpy.CalcGlassUse()) / Molpy.GlassChillerIncrement() - 1);
		var extra = Math.min(Math.floor(bl.power / 4.51), usage);
		if (usage == 0 && Molpy.Boosts['Sand Purifier'].power == Infinity) extra = Math.floor(bl.power / 4.51)
		extra = Math.min(extra, Math.floor(Molpy.Level('GlassChips') / 1e12 + Molpy.Boosts['Sand Refinery'].power / Molpy.ChipsPerBlock() - Molpy.Boosts['Glass Chiller'].power - 2));
		if(extra > 20) {
			var origpower = Molpy.Boosts['Glass Chiller'].power;
			Molpy.Boosts['Glass Chiller'].power += extra;
			var backoff = 1;
			while(Molpy.CalcGlassUse() >= 100) {
				if(backoff > extra) {
					Molpy.Boosts['Glass Chiller'].power = origpower;
					return;
				}
				Molpy.Boosts['Glass Chiller'].power -= backoff;
				extra -= backoff;
				backoff *= 2;
			}
			if(extra > 0) {
				Molpy.Spend('GlassBlocks', extra * 4.5);
				Molpy.Boosts['Glass Chiller'].Refresh();
				Molpy.Notify('Glass Chiller upgraded ' + Molpify(extra, 2) + ' times', 1);
				Molpy.RatesRecalculate();
				_gaq && _gaq.push(['_trackEvent', 'Boost', 'Seaish Upgrade', 'Glass Chiller']);
			}
		}
	}

	new Molpy.Boost({
		name: 'Glass Jaw',
		icon: 'glassjaw',
		group: 'ninj',
		className: 'toggle',
		
		desc: function(me) {
			var str = 'Ninja Builder builds 100x as many Castles, at the cost of 1 Glass Block per NP.';
			if(me.bought) {
				str += '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="' + (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>';
			}
			return str;
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		price:{
			Sand: '16M',
			Castles: 122500
		},
	});
	new Molpy.Boost({
		name: 'Ninja League',
		icon: 'ninjaleague',
		group: 'ninj',
		desc: 'Ninja Stealth is raised by 100x as much',
		price:{
			Sand: '5T',
			Castles: '0.6T'
		},
	});
	new Molpy.Boost({
		name: 'Ninja Legion',
		icon: 'ninjalegion',
		group: 'ninj',
		desc: 'Ninja Stealth is raised by 1000x as much',
		price:{
			Sand: '3P',
			Castles: '0.9P'
		},
	});
	new Molpy.Boost({
		name: 'Swim Between the Flags',
		icon: 'swimbetweenflags',
		alias: 'SBTF',
		desc: 'Each Flag gives Waves a 6% bonus to Castle production on even NewPix (i.e. when changing from an odd NewPix to an even NewPix) and to destruction on odd NewPix. The Sand production of Flags is multiplied by the number of Waves on odd NewPix and divided on even NewPix.',
		price:{
			Sand: '14G',
			Castles: '2T'
		},
	});
	new Molpy.Boost({
		name: "Château d'If",
		alias:'Chateau',
		icon: 'chateau',
		group: 'bean',
		
		desc: function(me) {
			var str = '<b>THIS FORTRESS IS HERE</b>.'
			if(me.bought) {
				if(!Molpy.Got('Rosetta')) {
					str += '<br><input type="Button" value="Trade" onclick="Molpy.GetRosetta()"></input> 50 Bags to find Rosetta.';
				}
				if(!Molpy.Got('WWB') && Molpy.CastleTools['Scaffold'].amount >= 400) {
					str += '<br><input type="Button" value="Trade" onclick="Molpy.GetWWB()"></input> 444 Scaffolds to hire Window Washing Beanies.';
				}
				if(!Molpy.Got('RB')) {
					str += '<br><input type="Button" value="Trade" onclick="Molpy.BuyGlassBoost(\'RB\',144000,1234)"></input> '
						+ Molpify(144000) + ' Glass Chips and ' + Molpify(1234) + ' Glass Blocks to hire Recycling Beanies.';
				}
			}
			return str;
		},
		
		price:{
			Sand: '400T',
			Castles: '12.5T',
		},
		
		classChange: function() {
			return (!Molpy.Boosts['Rosetta'].unlocked || !Molpy.Got('WWB')
			&& Molpy.CastleTools['Scaffold'].amount >= 400 || !Molpy.Got('RB')
			&& Molpy.Has('GlassChips', 100000) && Molpy.Has('GlassBlocks', 1000)) ? 'action' : '';
		}
	});

	Molpy.GetRosetta = function() {
		Molpy.Anything = 1;
		if(Molpy.SandTools['Bag'].amount >= 50) {
			Molpy.SandTools['Bag'].amount -= 50;
			Molpy.SandToolsOwned -= 50;
			Molpy.SandTools['Bag'].Refresh();
			Molpy.UnlockBoost('Rosetta');
		} else {
			Molpy.Notify('<b>THEY ARE HEAVY</b>', 1);
		}
	}
	
	new Molpy.Boost({
		name: 'Rosetta',
		icon: 'rosetta',
		group: 'bean',
		
		desc: function(me) {
			var str = '<b>SOMEWHAT</b>.'
			if(me.bought) {
				if(!Molpy.Got('Panther Salve')) {
					str += '<br><input type="Button" value="Trade" onclick="Molpy.BuyGlassBoost(\'Panther Salve\',0,250)"> 250 Glass Blocks for Panther Salve.</input>'
				}

				var fa = Molpy.Boosts['Factory Automation'];
				var bots = Molpy.CastleTools['NewPixBot'].amount;
				if(fa.bought && Molpy.Got('Doublepost') && Molpy.NPlength > 1800) {
					if(fa.power < Molpy.faCosts.length) {
						if(bots >= Molpy.faCosts[fa.power]) {
							str += '<br><input type="Button" value="Trade" onclick="Molpy.UpgradeFactoryAutomation()"></input> '
								+ Molpify(Molpy.faCosts[fa.power], 1) + ' NewPixBots to upgrade Factory Automation.';
						} else {
							str += '<br>The next Factory Automation upgrade requires ' + Molpify(Molpy.faCosts[fa.power], 1) + ' NewPixBots';
						}
					}
				}
				if(!Molpy.Boosts['Ninja Climber'].unlocked && Molpy.Got('Skull and Crossbones')
					&& Molpy.SandTools['Ladder'].amount >= 500) {
					str += '<br><input type="Button" value="Trade" onclick="Molpy.UnlockNinjaClimber()"></input> 500 Ladders to unlock Ninja Climber.';
				}
				if(Molpy.Has('GlassBlocks', 800) && !Molpy.Got('LogiPuzzle') && Molpy.Has('Logicat', 5)) {
					if(Molpy.Has('GlassBlocks', 1000)) {
						str += '<br><input type="Button" value="Pay" onclick="Molpy.BuyGlassBoost(\'LogiPuzzle\',0,1000)"></input> '
							+ Molpify(1000) + ' Blocks to get a Caged Logicat';
					} else {
						str += '<br>It costs ' + Molpify(1000) + ' Glass Blocks to get a Caged Logicat.';
					}
				}
				if(Molpy.Has('GlassChips', 12500) && Molpy.Has('GlassBlocks', 2500) && !Molpy.Got('Camera')) {
					if(Molpy.Has('GlassChips', 25000) && Molpy.Has('GlassBlocks', 5000)) {
						str += '<br><input type="Button" value="Pay" onclick="Molpy.BuyGlassBoost(\'Camera\',25000,5000)"></input> '
							+ Molpify(25000) + ' Chips and ' + Molpify(5000) + ' Blocks to get a Camera';
					} else {
						str += '<br>It costs ' + Molpify(25000) + ' Glass Chips and ' + Molpify(5000)
							+ ' Glass Blocks to get a Camera.';
					}
				}
				var s = Molpy.GetBlackprintSubject();
				if(s && !Molpy.Got('CfB')) {
					var c = Molpy.LimitConstructionRuns(s);
					str += '<br><input type="Button" value="Start" onclick="Molpy.StartBlackprintConstruction()"></input> '
						+ 'construction of ' + Molpy.Boosts[Molpy.GetBlackprintSubject()].name
						+ ' from Blackprints (requires ' + Molpify(c * 10) + ' runs of Factory Automation)';
				}
			}
			return str;
		},
		
		price:{
			Sand: '0.9P',
			Castles: '32T',
		},
		
		classChange: function() {
			var fa = Molpy.Boosts['Factory Automation'];
			var bots = Molpy.CastleTools['NewPixBot'].amount;
			if(!Molpy.Got('Panther Salve') && Molpy.Has('GlassBlocks', 250) || fa.bought
				&& Molpy.Got('Doublepost') && fa.power < Molpy.faCosts.length && Molpy.NPlength > 1800
				&& bots >= Molpy.faCosts[fa.power] || !Molpy.Boosts['Ninja Climber'].unlocked
				&& Molpy.Got('Skull and Crossbones') && Molpy.SandTools['Ladder'].amount >= 500
				|| Molpy.Has('GlassBlocks', 800) && !Molpy.Got('LogiPuzzle') && Molpy.Has('Logicat', 5)
				|| Molpy.Has('GlassChips', 12500) && Molpy.Has('GlassBlocks', 2500) && !Molpy.Got('Camera')
				|| Molpy.GetBlackprintSubject() && !Molpy.Got('CfB')) return 'action';
			return '';
		}
	});
	
	Molpy.LimitConstructionRuns = function(s) {
		var c = Molpy.blackprintCosts[s];
		if(!(Molpy.Got('AE') && Molpy.Got('AA')) && c < 1000) c = Math.min(c, 40);
		return c;
	}
	
	Molpy.UpgradeFactoryAutomation = function() {
		Molpy.Anything = 1;
		var fa = Molpy.Boosts['Factory Automation'];
		var bots = Molpy.CastleTools['NewPixBot'].amount;
		if(fa.bought && Molpy.Got('Doublepost')) {
			if(fa.power < Molpy.faCosts.length && bots >= Molpy.faCosts[fa.power]) {
				Molpy.CastleTools['NewPixBot'].amount -= Molpy.faCosts[fa.power];
				Molpy.CastleToolsOwned -= Molpy.faCosts[fa.power];
				Molpy.CastleTools['NewPixBot'].Refresh();
				fa.power++;
				fa.Refresh();
				Molpy.Boosts['Rosetta'].Refresh();
				Molpy.Notify('Factory Automation Upgraded', 1);
				_gaq && _gaq.push(['_trackEvent', 'Boost', 'Upgrade', fa.name]);
			}
		}
	}
	
	Molpy.UnlockNinjaClimber = function() {
		Molpy.Anything = 1;
		var lads = Molpy.SandTools['Ladder'];
		if(!Molpy.Boosts['Ninja Climber'].unlocked && Molpy.Got('Skull and Crossbones') && lads.amount >= 500) {
			lads.amount -= 500;
			Molpy.SandToolsOwned -= 500;
			lads.Refresh();
			Molpy.UnlockBoost('Ninja Climber');
			Molpy.Boosts['Rosetta'].Refresh();
		}
	}
	
	new Molpy.Boost({
		name: 'Panther Salve',
		icon: 'panthersalve',
		group: 'bean',
		className: 'toggle',
			
		desc: function(me) {
			var str = '"It\'s some kind of paste."<br>Not Lucky gets a cumulative 1% bonus from each item owned, at a cost of 10 Glass Blocks per use.<br>Also unlocks some additional boosts with use.'
			if(me.bought) {
				str += '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ',1)" value="' + (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>';
			}
			if(Molpy.Got('Panther Glaze'))
				str += '<br>Panther Glaze causes this to produce ' + Molpify(1000) + ' Glass Chips';
			return str;
		},
		
		IsEnabled: Molpy.BoostFuncs.PosPowEnabled,
		
		buyFunction: function() {
			this.IsEnabled = 1;
		},
		
		stats: function(me) {
			var str = 'Not Lucky\'s reward is 1% higher for every Tool, Boost, and Badge owned. Consumes 10 Glass Blocks per use.';
			var acPower = Math.abs(me.power);
			if(acPower <= 200)
				str += '<br>Speed is at ' + acPower + ' out of 200';
			else if(acPower <= 500)
				str += '<br>Speed is at ' + acPower + ' out of 500';
			else if(acPower <= 800)
				str += '<br>Speed is at ' + acPower + ' out of 800';
			else if(acPower <= 1200) str += '<br>Speed is at ' + acPower + ' out of 1200';
			return str;
		}
	});

	new Molpy.Boost({
		name: 'Castle Crusher',
		icon: 'castlecrusher',
		className: 'action',
		desc: '<input type="Button" value="Crush" onclick="Molpy.CastleCrush()"></input> half your castles back into sand. (One use.)',
		
		price:{
			Sand: function() {
				return (Molpy.Boosts['Castle Crusher'].power + 1) * 120 + 'M';
			},
			
			Castles: function() {
				return (Molpy.Boosts['Castle Crusher'].power + 1) * 380 + 'M';
			},
		},
		
		// deactivate if sand is infinite
		classChange: function() { return isFinite(Molpy.Boosts['Sand'].power) ? 'action' : '' }
	});

	Molpy.CastleCrush = function() {
		Molpy.Anything = 1;
		Molpy.Boosts['Castle Crusher'].buy();
		if(!Molpy.Boosts['Castle Crusher'].bought) {
			Molpy.Notify('What a pity!');
			return;
		}
		var c = Math.floor(Molpy.Boosts['Castles'].power / 2);
		Molpy.Destroy('Castles', c);
		if(Molpy.Got('Blitzing')) c *= 8;
		Molpy.Boosts['Sand'].dig(c);
		Molpy.Boosts['Castle Crusher'].power++;
		Molpy.LockBoost('Castle Crusher');
	}

	new Molpy.Boost({
		name: 'Furnace Crossfeed',
		icon: 'furnacecrossfeed',
		group: 'hpt',
		className: 'toggle',
		
		desc: function(me) {
			if(!me.bought)
				return 'Blast Furnace acts as a Glass Furnace instead of its previous purpose, only if Glass Furnace is active.';
			return (me.IsEnabled ? '' : 'When activated, ')
				+ 'Blast Furnace acts as a Glass Furnace instead of its previous purpose, only if Glass Furnace is active.<br>'
				+ '<input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="' + (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>';
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		price:{
			Sand: '6.5G',
			Castles: '.8G',
		},
		
		buyFunction: function() {
			this.IsEnabled = 1;
		}
	});

	new Molpy.Boost({
		name: 'Redundant Redundance Supply of Redundancy',
		alias: 'RRSR',
		icon: 'redred',
		group: 'hpt',
		desc: 'The Department of Redundancy Department announces: You have exceeded your daily redundancy limit. Your primary redundancy supply will now be turned down. You can always switch to your redundant redundance supply of redundancy.',
		stats: Molpy.Redacted.words + ' appear more often, but they are rare until you buy this.',
		price:{
			Sand: '42G',
			Castles: '4.2G',
		},
		buyFunction: function () {
			Molpy.Redacted.randomiseTime();
		},
		
		lockFunction: function() {
			Molpy.Notify('Primary Redundancy Supply Reengaged', 1);
		}
	});

	new Molpy.Boost({
		name: 'Flying Buckets',
		icon: 'flyingbuckets',
		desc: 'Sand rate of Buckets is multiplied by the number of Trebuchets you own. Trebuchets produce ten times as many Castles.',
		price:{
			Sand: '120G',
			Castles: '2T'
		},
	});
	new Molpy.Boost({
		name: 'Human Cannonball',
		icon: 'humancannonball',
		desc: 'Sand rate of Cuegan is multiplied by two times the number of Trebuchets you own. Trebuchets produce ten times as many Castles.',
		price:{
			Sand: '240G',
			Castles: '4T'
		},
	});
	new Molpy.Boost({
		name: 'Fly the Flag',
		icon: 'flytheflag',
		desc: 'Sand rate of Flags is multiplied by ten times the number of Trebuchets you own. Trebuchets produce ten times as many Castles.',
		price:{
			Sand: '360G',
			Castles: '6T'
		},
	});
	new Molpy.Boost({
		name: 'Up Up and Away',
		icon: 'upupandaway',
		desc: 'Sand rate of Ladders is multiplied by ten times the number of Trebuchets you own. Trebuchets produce ten times as many Castles.',
		price:{
			Sand: '480G',
			Castles: '8T'
		},
	});
	new Molpy.Boost({
		name: 'Air Drop',
		icon: 'airdrop',
		desc: 'Bags produce five times as much Sand. Trebuchets produce fifty times as many Castles.',
		price:{
			Sand: '1.2T',
			Castles: '24T'
		},
	});
	new Molpy.Boost({
		name: 'Schizoblitz',
		icon: 'schizoblitz',
		desc: 'Double Blitzing speed',
		price:{
			Sand: '200T',
			Castles: '368G'
		},
	});
	new Molpy.Boost({
		name: 'Redunception',
		icon: 'redunception',
		group: 'hpt',
		
		desc: function(me) {
			if(!me.bought || flandom(10) == 0) return Molpy.redundancy.longsentence;
			var sent = Molpy.redundancy.sentence();
			//if(!Molpy.Boosts['Expando'].IsEnabled) Molpy.Notify(sent, 1);
			return sent;
		},
		
		price:{
			Sand: '.97G',
			Castles: '340M',
		},
		stats: 'Causes the effect which results from Redunception'
	});
	new Molpy.Boost({
		name: 'Furnace Multitasking',
		icon: 'furnacemultitask',
		group: 'hpt',
		className: 'toggle',
		
		desc: function(me) {
			if(!me.bought)
				return 'Blast Furnace acts as a Glass Blower instead of its previous purpose, only if Glass Blower is active. (This stacks with Furnace Crossfeed)';
			return (me.IsEnabled ? '' : 'When activated, ')
				+ 'Blast Furnace acts as a Glass Blower instead of its previous purpose, only if Glass Furnace is active.<br>'
				+ '<input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="' + (me.IsEnabled ? 'Dea' : 'A')
				+ 'ctivate"></input> (This stacks with Furnace Crossfeed)';
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		price:{
			Sand: '48G',
			Castles: '1.2G',
		},
		
		buyFunction: function() {
			this.IsEnabled = 1;
		}
	});

	Molpy.redundancy = MakeRedundancy();

	new Molpy.Boost({
		name: 'Free Advice',
		icon: 'freeadvice',
		
		desc: function(me) {
			var str = '';
			if (Molpy.IsEnabled('NavCode')) {
				for (var jdipb in Molpy.jDipBoosts) {
					if (!Molpy.Got(Molpy.jDipBoosts[jdipb])) return 'You have enabled NewPixBot Navigation Code before getting all the rewards';
				}
			}
			if (Molpy.Got('Swedish Chef') && Molpy.Boosts['Swedish Chef'].power == 0) return 'The Swedish Chef needs attention';
			if (Molpy.Got('Bag Burning') && !Molpy.Got('Fireproof') && Molpy.Got('Bottle Battle') && 
				!isFinite(Math.pow(2, Molpy.Boosts['Bag Burning'].power) + 6)) return 'The Bag Burning needs attention';

			if(Molpy.Got('TF')) {
				if(!Molpy.Got('Sand to Glass'))
					str += 'To unlock Sand to Glass you need 7470 Buckets and an infinite Sand dig rate.<br>';
				if(!Molpy.Got('Castles to Glass'))
					str += 'To unlock Castles to Glass you need 1515 NewPixBots and infinite Castles.<br>';
				if(!Molpy.Got('Lucky Twin'))
					str += 'Lucky Twin unlock is at ' + Molpify(Molpy.Boosts['Lucky Twin'].power) + ' out of ' + Molpify(13 * 13) + '.<br>';
				if(!Molpy.Got('Sand to Glass') || !Molpy.Got('Castles to Glass'))
					str += ' (The "to Glass" boosts unlock when you load the Tool Factory with chips, if you meet the requirements.)';
				if (str) return str;
			}
			if(Molpy.Got('AA') && !Molpy.Got('AC') && Molpy.CastleTools['NewPixBot'].amount >= 7500) {
				return 'Logicat Level required for Automata Control: '
					+ Molpify(440 * 50000 / Molpy.CastleTools['NewPixBot'].amount, 3);
			}
			if(Molpy.GlassCeilingCount() && !Molpy.Earned('Ceiling Broken')) {
				return 'To Lock or Unlock a Glass Ceiling Boost, the previous numbered Glass Ceiling Boost must be owned and all lesser numbered Glass Ceiling Boosts must not be owned.';
			}
			return 'Hindsight' + (me.bought ? ' is 20/20' : '');
		},
		
		stats: function(me) {
			return(me.bought ? 'Check back from Time to Time and you may find some advice' : 'Hindsight');
		},
		
		price:{
			Sand: '400P',
			Castles: '400P'
		},
	});
	new Molpy.Boost({
		name: 'Broken Bottle Cleanup',
		alias: 'BBC',
		className: 'toggle',
		icon: 'bbc',
		
		desc: function(me) {
			var str = 'All Sand Tools produce 20x Sand at a cost of 5 Glass Blocks per NP';
			if(me.bought)
				str += '<br>'
					+ (me.power > 0 ? 'Active during this NP.<br><input type="Button" value="Disable" onclick="Molpy.ToggleBBC()"></input>'
							: (me.power == 0 ? 'Inactive. May activate on the next ONG if 5 Glass Blocks are available.'
									: 'Disabled. When enabled, will do nothing until the next ONG.<br><input type="Button" value="Enable" onclick="Molpy.ToggleBBC()"></input>'));
			return str;
		},
		
		stats: function(me) {
			return me.desc(me) + '<br>(Also may have reduced price of MHP.)';
		},
		price:{
			Sand: '5P',
			Castles: '10P',
			GlassBlocks: '500'

		},
	});

	Molpy.ToggleBBC = function() {
		Molpy.Anything = 1;
		var me = Molpy.Boosts['BBC'];
		if(me.power < 0)
			me.power = 0;
		else
			me.power = -1;
		me.Refresh();
		Molpy.RatesRecalculate();
		_gaq && _gaq.push(['_trackEvent', 'Boost', 'Toggle', me.name]);
	}
	
	Molpy.BBC = function() {
		var m = 1;
		if(Molpy.Got('BBC') && Molpy.Boosts['BBC'].power > 0) {
			m = 20;
			m *= Math.pow(200, Molpy.Boosts['RB'].bought);
		}
		return m;
	}

	Molpy.glassCeilingPriceIncs = [1.1, 1.25, 1.6, 2, 2, 2, 2, 2, 2, 2, 1, 1];
	Molpy.glassCeilingDescText = ['Sand rate of Buckets', 'Castles produced by NewPixBots', 'Sand rate of Cuegan',
			'Castles produced by Trebuchets', 'Sand rate of Flags', 'Castles produced by Scaffolds',
			'Sand rate of Ladders', 'Castles produced by Waves', 'Sand rate of Bags', 'Castles produced by Rivers'];

	Molpy.MakeGlassCeiling = function(i) {
		new Molpy.Boost({
			name: 'Glass Ceiling ' + i,
			icon: 'glassceiling' + i,
			group: 'ceil',
			
			desc: function(me) {
				var str = 'Multiplies ' + Molpy.glassCeilingDescText[i] + ' by 33 per Glass Ceiling.<br>';
				if(me.bought)
					str += '<input type="Button" value="Lock" onclick="Molpy.CeilingLock(' + i + ')"></input>';
				return str;
			},
			
			price:{
				Sand: function(me) {
					return 6 * Math.pow(1000, me.num + 1) * Math.pow(Molpy.glassCeilingPriceIncs[me.num], me.power)
				},
				
				Castles: function(me) {
					return 6 * Math.pow(1000, me.num + 1) * Math.pow(Molpy.glassCeilingPriceIncs[me.num], me.power)
				},
				
				GlassBlocks: 50 * (+i + 1),
			},
			
			buyFunction: function() {
				if(Molpy.Earned('Ceiling Broken'))
					this.power = 0;
				else
					this.power++;
				Molpy.shopNeedRepaint = 1;
				Molpy.toolsNeedRepaint = 1;
				Molpy.GlassCeilingUnlockCheck();
			},
			lockFunction: function(me) {
				Molpy.shopNeedRepaint = 1;
				Molpy.toolsNeedRepaint = 1;
				Molpy.GlassCeilingUnlockCheck();
			}
		});
		Molpy.Boosts['Glass Ceiling ' + i].num = parseInt(i);
	}
	
	for( var i in Molpy.glassCeilingDescText) {
		Molpy.MakeGlassCeiling(i);
	}

	Molpy.GlassCeilingCount = function() {
		var c = 0;
		var i = 12;
		while(i--) {
			if(Molpy.Got('Glass Ceiling ' + i)) c++;
		}
		if(c >= 10) Molpy.EarnBadge('Ceiling Broken');
		if(c >= 12) Molpy.EarnBadge('Ceiling Disintegrated');
		return c;
	}
	
	Molpy.GlassCeilingMult = function() {
		var acPower = 33;
		if(Molpy.Got('WWB')) {
			acPower *= Math.pow(2, Molpy.Boosts['WWB'].bought - 5) * Molpy.CastleTools['Scaffold'].amount;
		}
		return Math.pow(acPower, Molpy.GlassCeilingCount());
	}

	Molpy.CeilingLock = function(key) {
		Molpy.Anything = 1;
		if(!Molpy.Earned('Ceiling Broken')) {
			if(!Molpy.Got('Glass Ceiling ' + key)) {
				Molpy.Notify('Nope.avi');
				return;
			}
			var acPower = key - 1;
			if(acPower >= 0 && !Molpy.Got('Glass Ceiling ' + acPower)) {
				Molpy.Notify('You need to own Glass Ceiling ' + acPower + ' before you can Lock Glass Ceiling ' + key, 1);
				return;
			}
			while(acPower--) {
				if(acPower < 0) break;
				if(Molpy.Got('Glass Ceiling ' + acPower)) {
					Molpy.Notify('You need to Lock Glass Ceiling ' + acPower + ' before you can Lock Glass Ceiling ' + key, 1);
					return;
				}
			}
		} else {
			if(!Molpy.Got('TF')) Molpy.Notify('The point of that was what exactly?');
		}
		Molpy.LockBoost('Glass Ceiling ' + key);
	}

	Molpy.GlassCeilingUnlockCheck = function() {
		var i = 10;
		while(i--) {
			var me = Molpy.Boosts['Glass Ceiling ' + i];
			if(!me.bought) {
				if(!Molpy.Earned('Ceiling Broken')) {
					if(Molpy.CeilingTogglable(i)) {
						if(!me.unlocked) Molpy.UnlockBoost(me.name);
					} else {
						if(me.unlocked) Molpy.LockBoost(me.name);
					}
				}
			}
			if(me.unlocked) {
				if(Molpy.CeilingClass(me, i)) Molpy.boostNeedRepaint = 1;
			}
		}
	}

	Molpy.CeilingTogglable = function(key) {
		Molpy.Anything = 1;
		var acPower = key - 1;
		if(acPower < 0 || Molpy.Got('Glass Ceiling ' + acPower)) {
			while(acPower--) {
				if(acPower < 0) return 1;
				if(Molpy.Got('Glass Ceiling ' + acPower)) {
					return 0;
				}
			}
		} else {
			return 0;
		}
		return 1;
	}

	Molpy.CeilingClass = function(me, key) {
		var oldClass = me.className;
		var newClass = Molpy.Earned('Ceiling Broken') ? '' : (Molpy.CeilingTogglable(key) ? 'action' : 'alert');
		if(newClass != oldClass) {
			me.className = newClass;
			Molpy.lootCheckTagged(me);
			return 1;
		}
	}
	
	new Molpy.Boost({
		name: 'Sand Tool Multi-Buy',
		icon: 'sandmultibuy',
		desc: 'Allow buying of multiple sand tools at once',
		price:{
			Sand: '200K',
			Castles: '6502',
		},
		stats: 'Code for this feature supplied by waveney'
	});
	new Molpy.Boost({
		name: 'Castle Tool Multi-Buy',
		icon: 'castlemultibuy',
		desc: 'Allow buying of multiple castle tools at once',
		price:{
			Sand: '2000K',
			Castles: '68020',
		},
		stats: 'Code for this feature supplied by waveney'
	});
	new Molpy.Boost({
		name: 'Run Raptor Run',
		alias: 'RRR',
		icon: 'rrr',
		group: 'bean',
		className: 'toggle',
		
		desc: function(me) {
			var inf = !isFinite(Molpy.Boosts['Castles'].power);
			var str = 'Multiplies Not Lucky bonus by ' + Molpify(10000) + (inf ? '' : ' at a cost of 30 Glass Blocks per use');
			if(me.bought) {
				str += '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="' + (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>';
			}
			if(Molpy.Got('Panther Glaze'))
				str += '<br>Panther Glaze causes this to produce ' + Molpify(3000) + ' Glass Chips';
			return str;
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		
		buyFunction: function() {
			this.IsEnabled = 1;
		},
		
		price:{
			Sand: '180E',
			Castles: '380E',
			GlassBlocks: 2500
		},
	});
	new Molpy.Boost({
		name: 'Ninja Climber',
		icon: 'ninjaclimber',
		group: 'ninj',
		desc: 'Multiplies Ninja Builder\'s Castle output by the number of Ladders owned, and the Sand dug by Ladders by the Ninja Stealth level',
		price:{
			Sand: '490P',
			Castles: '670P',
			GlassBlocks: 1500
		},
	});
	new Molpy.Boost({
		name: 'Phonesaw',
		icon: 'phonesaw',
		group: 'hpt',
		desc: 'I saw what you did there. Or heard.',
		stats: 'Squares the reward from VITSSÅGEN, JA!',
		price:{
			Sand: '48E',
			Castles: '38E',
			GlassBlocks: 100
		},
	});
	new Molpy.Boost({
		name: 'Logicat',
		single: 'Logicat&nbsp;Level',
		icon: 'logicat',
		group: 'stuff',
		
		Level: [
				function() {
					return this.bought;
				},
				function(amount) {
					var dif = amount - this.bought;
					this.bought = amount;
					this.power += dif * 5;
					this.Refresh();
				}
		],
		
		Add: function(levels, points) {
			if(levels > 0) this.Level += levels;
			if(points > 0) {
				this.power += points;
				var rewards = Math.floor((this.power - this.bought*5)/5 +1);
				if (rewards > 0) {
					if (Molpy.Got('Tangled Tessaract') && Molpy.IsEnabled('Tangled Tessaract')) {
						this.bought+=Math.floor(rewards*3*Molpy.Papal('Logicats'));
						this.power = this.bought*5;
					} else {
						this.bought+=Math.floor(rewards*Molpy.Papal('Logicats'));
						if (Molpy.Papal('Logicats') > 1) this.power = this.bought*5;
						if(rewards > 5) {
							Molpy.Add('QQ', Math.floor((rewards - 5)*Molpy.Papal('QQs')));
							if (Molpy.Has('QQ','1P')) Molpy.UnlockBoost('Tangled Tessaract');
							rewards = 5;
						}
						while(rewards--) {
							Molpy.RewardLogicat(this.Level);
						}
						if (this.bought > DeMolpify('10GW') && Molpy.Has('QQ','10GW')) Molpy.UnlockBoost('Hubble Double');
					}
				}
				this.Refresh();
			}
		},
		
		Has: function(amount) {
			return (this.Level >= amount + 1) * 1;
		},
		
		Spend: Molpy.BoostFuncs.Spend,
		
		Destroy: function(levels, points) {
			if(levels > 0) this.Level -= levels;
			if(points > 0) {
				this.power -= points;
				this.Refresh();
			}
		},
		
		desc: function(me) {
			var ans = Math.max(0,me.bought * 5 - me.power);
			return 'Statement A: Statement A is true.<br><br>Logicat Level is: ' + Molpify(me.bought, 1)
				+ '.<br>Needs ' + Molpify(ans) + ' point' + plural(ans) + ' to level up.';
		},
		
		price:{
			Sand: '55E',
			Castles: '238E',
			GlassBlocks: 100
		},
	});
	new Molpy.Boost({
		name: 'Temporal Duplication',
		alias: 'TDE',
		icon: 'temporalduplication',
		group: 'chron',
		className: 'alert',
		
		desc: function(me) {
			var tdf = Molpy.TDFactor(true) - 1;
			return 'For ' + MolpifyCountdown(me.countdown) + ', when you buy tools, get '
				+ (tdf <= 1 ? 'the same' : Molpify(tdf, 3) + 'x that') + ' amount again for free!';
		},
		
		logic: 50,
		
		countdownCMS: 1,
		startCountdown: function() {
			return 5 * (1 + Molpy.Got('Crystal Dragon')) * !Molpy.Earned('Never Alone');
		},
		
		stats: 'Also causes a double Not Lucky glass bonus during Temporal Duplication',
		
		countdownFunction: function() {
			if(Math.round(this.countdown) == 2) {
				Molpy.Notify('Temporal Duplication runs out in 2mNP!');
			}
		}
	});
	new Molpy.Boost({
		name: 'Impervious Ninja',
		icon: 'impninja',
		group: 'ninj',
		className: 'alert',
		
		desc: function(me) {
			if(me.power <= 0) return '';
			return 'Provides Ninja Forgiveness, up to ' + Molpify(me.power) + ' time' + plural(me.power)
				+ '.<br>This costs 1% of your Glass Chips in storage, with a minimum payment of 100 Chips.';
		},
		
		startPower: function() {
			return Math.floor(Math.min(50, Molpy.LogiMult(.5) + Molpy.ONGelapsed / (Molpy.NPlength * 1000)));
		}
	});
	new Molpy.Boost({
		name: 'Factory Ninja',
		icon: 'factoryninja',
		group: 'ninj',
		className: 'alert',
		
		desc: function(me) {
			return 'The next ' + me.power + ' Ninja Builder' + plural(me.power) + ' will activate Factory Automation';
		},
		
		logic: 3,
		
		startPower: function() {
			return Math.ceil(Molpy.Level('Logicat') / 5)
		}
	});
	new Molpy.Boost({
		name: 'Logicastle',
		icon: 'logicastle',
		group: 'bean',
		desc: 'The Castle outputs of Castle Tools are boosted by 50% cumulatively per Logicat Level',
		logic: 2,
		price:{
			Sand: '420Z',
			Castles: '850Z',
			GlassBlocks: 300
		},
	});
	
	Molpy.LogicastleMult = function() {
		if(Molpy.Got('Logicastle')) return Math.pow(1.5, Molpy.Level('Logicat'));
		return 1;
	}
	
	new Molpy.Boost({
		name: 'Flux Surge',
		icon: 'fluxsurge',
		group: 'chron',
		
		desc: function(me) {
			return 'Increases the effect of Flux Turbine for ' + MolpifyCountdown(me.countdown);
		},
		
		countdownCMS: 1,
		startCountdown: function() {
			return Math.min(12500, Molpy.LogiMult(80));
		}

	});
	new Molpy.Boost({
		name: 'Locked Crate',
		icon: 'lockedcrate',
		className: 'action',
		
		desc: function(me) {
			var str = '';
			if (me.bought) {
				str += (5 - me.bought) + ' lock' + plural(5 - me.bought)
				+ ' left<br><input type="Button" value="Smash" onclick="Molpy.LockBoost(\'Locked Crate\')"></input> it open to grab the loot!'
			} else str += 'Contains Loot';
			if (me.CrateCount > 1) str += '<p>You have opened ' + Molpify(me.CrateCount) + ' Crates';
			return str;
		},
		
		price:{
			Sand: function(me) {
				return me.power;
			},
			
			Castles: function(me) {
				return me.power;
			},
			
			GlassBlocks: 15,
		},
		
		unlockFunction: function() {
			this.power = Molpy.Boosts['Castles'].power * 6 + Molpy.Boosts['Sand'].power;
		},

		defSave: 1,
		saveData: {4:['CrateCount',0,'float']},
		CrateCount: 0,
		lockFunction: function() {
			var bl = Molpy.Boosts['GlassBlocks'];
			var win = Math.ceil(Molpy.LogiMult('2K'));
			this.CrateCount++;
			win = Math.floor(win / (6 - this.bought));

			if(bl.bought * 50 < bl.power + win) bl.bought = Math.ceil((bl.power + win) / 50); // make space!
			Molpy.Add('GlassBlocks', win);
			Molpy.Notify('+' + Molpify(win, 3) + ' Glass Blocks!');
			if(Molpy.Got('Camera')) Molpy.EarnBadge('discov' + Math.ceil(Molpy.newpixNumber * Math.random()));
			Molpy.Add('Blackprints', this.bought);
		}
	});
	new Molpy.Boost({
		name: 'Crate Key',
		icon: 'cratekey',
		desc: 'Quarters the price of Locked Crate',
		stats: 'Quarters the price of Locked Crate, and does something else if you have already bought Locked Crate.',
		
		price:{
			GlassBlocks: function() {
				return Molpy.LogiMult(20);
			},
		},
		
		buyFunction: function() {
			Molpy.LockBoost(this.alias);
			var lc = Molpy.Boosts['Locked Crate'];
			if(!lc.unlocked) {
				if(!Molpy.Got('The Key Thing'))
					Molpy.Notify('Well, that was a waste');
				else
					Molpy.UnlockBoost(lc.alias);
				return;
			}
			lc.buy(1);
			if(lc.bought) {
				lc.bought++;
				if(lc.bought < 5) {
					if(!Molpy.boostSilence) Molpy.Notify('One less lock on the crate');
				} else
					Molpy.LockBoost(lc.alias);
			} else {
				lc.power /= 4;
				lc.buy(1);
				if(!lc.bought) {
					Molpy.Notify('Locked Crate price reduced (or infinite).');
				}
			}
		}
	});
	new Molpy.Boost({
		name: 'Technicolour Dream Cat',
		icon: 'dreamcat',
		heresy: true,
		desc: Molpy.Redacted.words + ' are multicoloured (if Chromatic Heresy is enabled)',
		price:{
			Sand: '320K',
			Castles: '90K',
			GlassBlocks: 10
		},
	});

	Molpy.GlassExtruderUpgradeCost = function() {
		return 2000 + (500 * Molpy.Boosts['Glass Extruder'].power);
	}
	
	Molpy.UpgradeGlassExtruder = function() {
		Molpy.Anything = 1;
		if(Molpy.Has('GlassChips', Molpy.GlassExtruderUpgradeCost())) {
			Molpy.Spend('GlassChips', Molpy.GlassExtruderUpgradeCost());
			Molpy.Boosts['Glass Extruder'].power++;
			Molpy.RatesRecalculate();
			Molpy.Notify('Glass Extruder upgraded', 1);
			_gaq && _gaq.push(['_trackEvent', 'Boost', 'Upgrade', 'Glass Extruder']);
		}
	}
	
	new Molpy.Boost({
		name: 'Glass Extruder',
		icon: 'glassextruder',
		className: 'action',
		group: 'hpt',
		
		desc: function(me) {
			var cost = Molpy.GlassExtruderUpgradeCost();
			var str = 'Glass Blower\'s sand use is divided by ' + Molpify(me.power + 2, 3);
			if(!isFinite(me.power)) return str;
			if(Molpy.Has('GlassChips', cost - 800)) {
				if(Molpy.Has('GlassChips', cost)) {
					str += '.<br><input type="Button" value="Pay" onclick="Molpy.UpgradeGlassExtruder()"></input> ' + Molpify(cost, 3) + ' Glass Chips to increase this by 1.';

					if(Molpy.Got('Seaish Glass Blocks')) {
						str += '<br><input type="Button" value="Seaish Upgrade" onclick="Molpy.SeaishGlassExtruder()"></input>';
					}
				} else {
					str += '.<br>It costs ' + Molpify(cost, 3) + ' Glass Chips to increase this by 1.';
				}
			}
			return str;
		},
		
		classChange: function() { return isFinite(this.power) ? 'action' : '' }
	});

	new Molpy.Boost({
		name: 'Caged Logicat',
		alias: 'LogiPuzzle',
		single: 'Logicat&nbsp;Puzzle',
		icon: 'cagedlogicat',
		group: 'bean',
		className: 'action',
		Level: Molpy.BoostFuncs.Bought1Level,
		Has: Molpy.BoostFuncs.Has,
		Spend: Molpy.BoostFuncs.Spend,
		Add: Molpy.BoostFuncs.Add,
		
		desc: function(me) {
			var str = '';
			if(Molpy.PuzzleGens.caged.active) {
				return Molpy.PuzzleGens.caged.StringifyStatements();
			} else if(me.Has(1)) {
				var tens = Math.floor((me.Level - 1) / 10) * 10;
				if(tens) {
					var cost = (100 + Molpy.LogiMult(25)) * tens;
					if(Molpy.Has('GlassBlocks', cost))
						str = '<input type="Button" value="Pay" onclick="Molpy.MakeCagedPuzzle(' + cost + ',' + tens + ')"></input> '
							+ Molpify(cost, 3) + ' Glass Blocks to solve ' + Molpify(tens,1)
							+ ' puzzles at a time. (Multiplies reward/loss by the number of puzzles.)<br>';
				}
				if (me.multiBuy < 20 || tens == 0) {
					var cost = 100 + Molpy.LogiMult(25);
					if(Molpy.Has('GlassBlocks', cost)) {
						str += '<input type="Button" value="Pay" onclick="Molpy.MakeCagedPuzzle(' + cost + ')"></input> '
							+ Molpify(cost, 3) + ' Glass Blocks for a puzzle.<br>' + Molpify(me.Level) + ' Puzzle' + plural(me.Level) + ' left.';
					} else {
						str += 'It costs ' + Molpify(cost, 3) + ' Glass Blocks for a puzzle.';
					}
				}
			} else {
				str = 'Caged Logicat is sleeping. Please wait for it.'
			}
			if(Molpy.Got('ZK')) {
				str += '<br>Zookeeper is at ' + Molpify(Molpy.Boosts['ZK'].power / 10) + '%.';
			}
			return str;
		},
		
		buyFunction: function() {
			this.Level = 10;
			this.multiBuy = 0;
		},
		
		classChange: function() { return ((Molpy.Level('AC') > 1000) || this.Has(1) || Molpy.PuzzleGens.caged.active) ? 'action' : '' },
		
		refreshFunction: function() {
			Molpy.ChainRefresh('ShadwDrgn');
		},

        	loadFunction: function() { Molpy.PuzzleGens.caged.active=false; },

		// Unique saved properties
		multiBuy: 0,
		
		defSave: 1,
		saveData: {
			4:['multiBuy', 0, 'int'],
		}

    	});

	new Molpy.Puzzle('caged', function() {
		Molpy.Boosts['LogiPuzzle'].Refresh();
	});
	
	Molpy.MakeCagedPuzzle = function(cost, puzzles) {
		Molpy.Anything = 1;
		if (puzzles && puzzles > 1) Molpy.Boosts['LogiPuzzle'].multiBuy++
		else Molpy.Boosts['LogiPuzzle'].multiBuy = 0;
		if(!Molpy.Spend('GlassBlocks', cost)) {
			Molpy.Notify('You need to pay ' + Molpy.PriceString('Glass Blocks', cost) + ' to be asked a Caged Logicat puzzle.');
			return;
		}
		if (puzzles && puzzles > 1) {
			if(!Molpy.Has('LogiPuzzle', 1)) {
				Molpy.Notify('No Logicat puzzles are available.');
				return;
			}
			Molpy.Boosts['LogiPuzzle'].Level = 0;
		} else {
			if(!Molpy.Spend('LogiPuzzle', 1)) {
				Molpy.Notify('No Logicat puzzles are available.');
				return;
			}
		}

		Molpy.PuzzleGens.caged.Generate(puzzles);
		Molpy.Boosts['LogiPuzzle'].Refresh();
	}

	new Molpy.Boost({
		name: 'Second Chance',
		icon: 'secondchance',
		group: 'bean',
		desc: 'If you provide at least two answers to a Logicat Puzzle and at least one is incorrect, you get a second attempt at it. (The second attempt costs 50 Glass Blocks per incorrect answer, and gives less points per correct answer.)',
		price:{
			Sand: '250Y',
			Castles: '87Y',
		},
		logic: 5,
	});
	new Molpy.Boost({
		name: 'Let the Cat out of the Bag',
		alias: 'LCB',
		icon: 'lcb',
		className: 'toggle',
		group: 'bean',
		
		desc: function(me) {
			var inf = !isFinite(Molpy.Boosts['Castles'].power);
			var str = 'Not Lucky reward gains 1% per two Ladders and Bags owned, at a cost of '
				+ (inf ? '1 Ladder and 1 Bag' : '70 Glass Blocks (or 1 Ladder and 1 Bag)') + ' per use.'
			if(me.bought) {
				str += '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="'
					+ (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>';
			}
			if(Molpy.Got('Panther Glaze'))
				str += '<br>Panther Glaze causes this to produce ' + Molpify(7000) + ' Glass Chips';
			return str;
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		
		buyFunction: function() {
			this.IsEnabled = 1;
		},
		
		stats: 'At a cost of 35 Glass Blocks, multiplies Not Lucky by 1.01 for each pair of Ladders, then at a cost of 35 Glass Blocks, multiplies Not Lucky by 1.01 for each pair of Bags. If 35 Glass Blocks are not available each time (or if you have infinite Castles), a Ladder/Bag is consumed before multiplying',
		price:{
			Sand: '750U',
			Castles: '245U',
			GlassBlocks: '1200'
		},
	});
	new Molpy.Boost({
		name: 'Catamaran',
		icon: 'catamaran',
		className: 'toggle',
		group: 'bean',
			
		desc: function(me) {
			var inf = !isFinite(Molpy.Boosts['Castles'].power);
			var str = 'Not Lucky reward gains 1% 6 times per Wave and River owned, at a cost of '
				+ (inf ? '1 Wave and 1 River' : '90 Glass Blocks (or 1 Wave and 1 River)') + ' per use.'
			if(me.bought) {
				str += '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="'
					+ (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>';
			}
			if(Molpy.Got('Panther Glaze'))
				str += '<br>Panther Glaze causes this to produce ' + Molpify(9000) + ' Glass Chips';
			return str;
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		
		buyFunction: function() {
			this.IsEnabled = 1;
		},
		
		stats: 'At a cost of 45 Glass Blocks, multiplies Not Lucky by 1.01 6 times for each Wave, then at a cost of 45 Glass Blocks, multiplies Not Lucky by 1.01 6 times for each River. If 45 Glass Blocks are not available each time (or if you have infinite Castles), a Wave/River is consumed before multiplying.',
		price:{
			Sand: '750S',
			Castles: '245S',
			GlassBlocks: '4800'
		},
	});

	new Molpy.Boost({
		name: 'Redundant Raptor',
		icon: 'redundaraptor',
		className: 'toggle',
		group: 'bean',
		
		desc: function(me) {
			var inf = !isFinite(Molpy.Boosts['Castles'].power);
			var str = 'Not Lucky reward gains 1% per ' + Molpy.Redacted.word + ' click' + (inf ? '' : ', at a cost of 120 Glass Blocks per use.');

			if(me.bought) {
				str += '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="' + (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>';
			}
			if(Molpy.Got('Panther Glaze'))
				str += '<br>Panther Glaze causes this to produce ' + Molpify(12000) + ' Glass Chips';
			return str;
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		
		buyFunction: function() {
			this.IsEnabled = 1;
		},
		
		stats: 'At a cost of 120 Glass Blocks, multiplies Not Lucky by 1.01 twice for each ' + Molpy.Redacted.word
			+ ' click<br>The cost is waived if you have infinite Castles, since this this boost would have no effect in that circumstance',
		price:{
			Sand: '930PW',
			Castles: '824PW',
			GlassBlocks: '4800'
		},
	});
	new Molpy.Boost({
		name: 'Camera',
		icon: 'camera',
		className: 'action',
		group: 'bean',
		
		desc: function(me) {
			var str = '"<b>THIS DEVICE <i>MECHANISM</i> IS <i>OBSCURE</i> UNKNOWN</b>"';
			if(me.bought) {
				str += '<br><input type="Button" onclick="Molpy.Shutter()" value="Snap!"></input> (Uses 10 Glass Chips)';
			}
			return str;
		}		
	});
	new Molpy.Boost({
		name: 'Memories Revisited',
		icon: 'memoriesrevisited',
		group: 'chron',
		desc: 'Allows you to quickly jump in Time to Discoveries you have made.',
		price:{
			Sand: '50P',
			Castles: '20P',
			GlassBlocks: '20K'
		},
	});
	new Molpy.Boost({
		name: 'Blackprints',
		single: 'Blackprint',
		icon: 'blackprints',
		group: 'stuff',
		Level: Molpy.BoostFuncs.PosPowerLevel,
		
		Has: function(n, all) {
			if(all) return n <= 0 || this.Level >= n;
			var pages = this.Level;
			if (pages == Infinity) return 1;
			if(pages < 1) return 0;
			if(Molpy.Boosts['Blackprint Plans'].bought) {
				var s = Molpy.GetBlackprintSubject();
				if(s) pages -= Molpy.blackprintCosts[s];
			}
			return(pages >= n);
		},
		
		Add: function(n) {
			var target = Molpy.GetBlackprintPages();
			this.Level += n;
			if (!isFinite(this.Level)) return;
			if(this.Has(9001, 1)) Molpy.EarnBadge('Scouter');
			if(!Molpy.boostSilence) {
				if(n == 1)
					Molpy.Notify('You found a Blackprint page', 1);
				else
					Molpy.Notify('You found ' + Molpify(n) + ' Blackprint pages', 1);
			} else {
				if(this.Has(target, 1) && !this.Has(target + n, 1)) {
					Molpy.Notify('You now have the ' + Molpify(target) + ' Blackprint pages you require.', 1);
				}
				return;
			}

			if(!target) return;

			if(!this.Has(target, 1))
				Molpy.Notify('You need ' + Molpify(target - this.Level) + ' more pages', 1);
			else if(this.Has(target + 1, 1))
				Molpy.Notify('You have more pages than you need right now', 1);
			else
				Molpy.Notify('You now have the ' + Molpify(target) + ' Blackprint pages you require.', 1);
		},
		
		Spend: Molpy.BoostFuncs.Spend,
		Destroy: Molpy.BoostFuncs.Destroy,
		
		desc: function(me) {
			return 'You have ' + Molpy.BlackprintReport() + ' Blackprints.';
		},
		
		stats: function(me) {
			return '(Or Blueprints if you\'re into Chromatic Heresy)<br>' + me.desc();
		},
		
		defStuff: 1
	});

	Molpy.BlackprintReport = function() {
		return 'collected ' + Molpify(+Molpy.Level('Blackprints') + Molpy.Boosts['Milo'].power / 100, 3) + 
			(Molpy.Has('Blackprints',Infinity)?'':(' of ' + 
			(Molpify(Molpy.GetBlackprintPages() || Molpy.Boosts['AC'].power * (Molpy.Boosts['Dragon Forge'].bought ? 10 : 2), 1))));
	}

	Molpy.LogiMult = function(s) {
		return DeMolpify(s + '') * Molpy.Boosts['Logicat'].bought;
	}
	
	Molpy.GetBlackprintPages = function() {
		for( var i in Molpy.blackprintOrder) {
			var print = Molpy.blackprintOrder[i];
			if(!Molpy.Boosts[print].unlocked) {
				if(print == 'CFT' && !Molpy.Earned('Minus Worlds')) continue;
				if(print == 'VS' && !Molpy.Has('Vacuum', 2)) continue;
				if(print == 'VV' && !Molpy.Got('VS')) continue;
				if(print == 'BoH' && !Molpy.Has('Goats', 400)) continue;
				if(print == 'Nest' && !Molpy.Got('DNS')) continue;
				if(print == 'DMM' && !Molpy.Got('Nest')) continue;
				if(print == 'DMF' && !Molpy.Got('DMM')) continue;
				if(print == 'DMC' && !Molpy.Got('DMF')) continue;
				if(print == 'DMB' && !Molpy.Got('DMC')) continue;
				if(print == 'DMP' && !Molpy.Got('DMB')) continue;
				return Molpy.blackprintCosts[print]; // number of pages needed for next blackprint boost
			}
		}
		return 0; // none needed at the moment
	}
	
	Molpy.GetBlackprintSubject = function(d) {
		if(!d && !Molpy.Got('Blackprint Plans')) return;
		if(Molpy.Level('Blackprints') < 1) return;
		for( var i in Molpy.blackprintOrder) {
			var print = Molpy.blackprintOrder[i];
			if(!Molpy.Boosts[print].unlocked) {
				if(print == 'CFT' && !Molpy.Earned('Minus Worlds')) continue;
				if(print == 'VS' && !Molpy.Has('Vacuum', 2)) continue;
				if(print == 'VV' && !Molpy.Got('VS')) continue;
				if(print == 'BoH' && !Molpy.Has('Goats', 400)) continue;
				if(print == 'Nest' && !Molpy.Got('DNS')) continue;
				if(print == 'DMM' && !Molpy.Got('Nest')) continue;
				if(print == 'DMF' && !Molpy.Got('DMM')) continue;
				if(print == 'DMC' && !Molpy.Got('DMF')) continue;
				if(print == 'DMB' && !Molpy.Got('DMC')) continue;
				if(print == 'DMP' && !Molpy.Got('DMB')) continue;
				if(Molpy.Level('Blackprints') >= Molpy.blackprintCosts[print]) return print;
				return;
			}
		}
	}

	// if we have enough blackprint pages for next blackprint boost, allow it as a department reward
	Molpy.CheckBlackprintDepartment = function() {
		Molpy.Boosts['Blackprint Plans'].department = 0;
		var print = Molpy.GetBlackprintSubject(1);
		if(!print) return;
		var pboost = Molpy.Boosts[print];
		if(!pboost.unlocked) {
			Molpy.Boosts['Blackprint Plans'].department = 1 * (Molpy.Level('Blackprints') >= Molpy.blackprintCosts[print]);
			return;
		}
	}
	
	Molpy.StartBlackprintConstruction = function() {
		if(Molpy.Got('CfB')) return;
		Molpy.UnlockBoost('CfB')
		Molpy.Boosts['Rosetta'].Refresh();
	}
	
	Molpy.DoBlackprintConstruction = function(times) {
		var s = Molpy.GetBlackprintSubject();
		if(!s) {
			return times; // condition for subject no longer met!
		}
		if(Molpy.blackprintCosts[s] > Molpy.Level('Blackprints')) {// we used up some blackprints somehow!
			if (isFinite(Molpy.VoidStare(1, 'VS'))) return times; // do nothing if we'll get them back in 1mNP
		}
		Molpy.Add('CfB', times);
		if (Molpy.Got('Hubble Double') && Math.random()<0.01) Molpy.Boosts['CfB'].power*=2;

		var c = Molpy.LimitConstructionRuns(s);
		if(Molpy.Has('CfB', c * 10)) {
			var op = Molpy.Level('CfB');
			Molpy.LockBoost('CfB');
			return Math.max(0, times + op - c * 10);
		}
		return 0;
	}
	
	new Molpy.Boost({
		name: 'Constructing from Blackprints',
		alias: 'CfB',
		icon: 'constructblack',
		className: 'alert',
		group: 'bean',
		
		desc: function(me) {
			var subj = Molpy.Boosts[Molpy.GetBlackprintSubject(1)];
			if(!subj) {
				Molpy.LockBoost('CfB');
				return 'Constructing nothing. How?';
			}
			var c = Molpy.LimitConstructionRuns(subj.alias);
			if (c != Infinity) {
				str = 'Constructing ' + subj.name + ' from Blackprint Plans.<br>' + Molpify(c * 10 - me.Level,3) + ' runs of Factory Automation required to complete.';
			} else {
				str = 'Constructing ' + subj.name + ' from Blackprint Plans.<br>' + Molpify(me.Level,3) + ' runs of Factory Automation completed so far, Infinity needed to complete.';
			}
			if(subj.alias == 'BoH')
				str += '<br>To construct Bag of Holding you must retain at least 400 goats, otherwise construction will stall.';
			return str;
		},
		
		unlockFunction: function() {
			this.buy();
		},
		
		lockFunction: function() {
			this.Level = 0;
			Molpy.LockBoost('Blackprint Plans');
		},
		
		defStuff: 1
	});
	
	Molpy.blackprintCosts = {
		SMM: 10,
		SMF: 15,
		GMM: 25,
		GMF: 30,
		TFLL: 80,
		BG: 120,
		Bacon: 40,
		AO: 150,
		AA: 200,
		SG: 5,
		AE: 60,
		Milo: 150,
		ZK: 220,
		VS: 5000,
		CFT: 40000,
		BoH: 90000,
		VV: 750000,
		Nest: 5e12,
		DMM: Infinity,
		DMF: Infinity,
		DMC: Infinity,
		DMB: Infinity,
		DMP: Infinity,
	};
	
	Molpy.blackprintOrder = ['SMM', 'SMF', 'GMM', 'GMF', 'TFLL', 'AO', 'AA', 'AE', 'BG', 'Bacon', 'SG', 'Milo', 'ZK', 'VS', 'CFT', 'BoH', 'VV', 'Nest','DMM','DMF','DMC','DMB','DMP'];

	new Molpy.Boost({
		name: 'Sand Mould Maker',
		alias: 'SMM',
		icon: 'smm',
		group: 'bean',
		
		desc: function(me) {
			var str = 'Allows you to make a Sand Mould of a Discovery.';
			str += '<br>This requires 100 Factory Automation runs and consumes the NewPix number of the Discovery times 100 Glass Chips per run.<br>';
			if(Molpy.Earned('Minus Worlds')) str += '(Squared if negative)<br>';
			if(me.bought && me.power > 0) {
				var dname = '<small>' + Molpy.Badges['discov' + me.Making].name + '</small>';
				if(me.power > 100) {
					str += '<br>Making a mould from ' + dname + ' is complete. The Sand Mould Filler is required next.';
				} else {
					str += '<br>' + (me.power - 1) + '% complete making a mould from ' + dname;
				}
				if(Molpy.Got('Break the Mould')) {
					str += '<br><input type="Button" onclick="Molpy.BreakMould(\'' + me.alias + '\')" value="Break the Mould"></input> to cancel';
				}
			}
			return str;
		},
		Making: 0,
		defSave: 1,
		saveData: { 4:['Making', 0, 'int'], },
		buyFunction: function() { this.Making = 0 },
		
		classChange: function() { return (this.power > 0 && this.power <= 100) ? 'alert' : '' },
		
		reset: function() {
			var chips = this.Making * 100;
			if(chips < 0) chips *= chips;
			chips *= (this.power - 1);
			Molpy.Add('GlassChips', chips);
			this.power = 0;
			Molpy.Notify(this.name + ' has cancelled making <small>' + Molpy.Badges['monums' + this.Making].name + '</small>', 1);
		}
	});
	new Molpy.Boost({
		name: 'Glass Mould Maker',
		alias: 'GMM',
		icon: 'glassmouldmaker',
		sortAfter: 'SMF',
		group: 'bean',
		
		desc: function(me) {
			var str = 'Allows you to make a Glass Mould of a Sand Monument.';
			str += '<br>This requires 400 Factory Automation runs and consumes 1000 Glass Chips plus 1% per NewPix number of the Monument per run.<br>';
			if(Molpy.Earned('Minus Worlds')) str += '(Squared if negative)<br>';
			if(me.bought && me.power > 0) {
				var mname = '<small>' + Molpy.Badges['monums' + me.Making].name + '</small>';
				if(me.power > 400) {
					str += '<br>Making a mould from ' + mname + ' is complete. The Glass Mould Filler is required next.';
				} else {
					str += '<br>' + Molpify((me.power - 1) / 4, 2) + '% complete making a mould from ' + mname;
				}
				if(Molpy.Got('Break the Mould')) {
					str += '<br><input type="Button" onclick="Molpy.BreakMould(\'' + me.alias + '\')" value="Break the Mould"></input> to cancel';
				}
			}
			return str;
		},
		Making: 0,
		defSave: 1,
		saveData: { 4:['Making', 0, 'int'], },
		buyFunction: function() { this.Making = 0 },
		
		classChange: function() { return (this.power > 0 && this.power <= 400) ? 'alert' : '' },
		
		reset: function() {
			var chips = Math.pow(1.01, Math.abs(this.Making)) * 1000;
			if(this.Making < 0) chips *= chips;
			chips *= (this.power - 1);
			Molpy.Add('GlassChips', chips);
			this.power = 0;
			Molpy.Notify(this.name + ' has cancelled making <small>' + Molpy.Badges['monumg' + this.Making].name + '</small>', 1);
		}
	});
	new Molpy.Boost({
		name: 'Sand Mould Filler',
		alias: 'SMF',
		icon: 'sandmouldfiller',
		sortAfter: 'SMM',
		group: 'bean',
		
		desc: function(me) {
			var str = 'Fills a Sand Mould with Sand to make a Sand Monument.<br>This requires 200 Factory Automation runs and consumes 100 Sand plus 20% cumulatively per NewPix number of the Discovery, per run.<br>';
			if(Molpy.Earned('Minus Worlds')) str += '(Squared if negative)<br>';
			if(me.bought) {
				if(!me.power && (Molpy.Boosts['SMM'].power > 100)) {
					str += '<br><input type="Button" onclick="Molpy.FillSandMould(' + Molpy.Boosts['SMM'].Making
						+ ')" value="Start Filling"></input> the mould in the Sand Mould Maker with Sand.';
				}
				if(me.power > 0) {
					var dname = '<small>' + Molpy.Badges['discov' + me.Making].name + '</small>';
					str += '<br>' + Molpify((me.power - 1) / 2, 1) + '% complete filling the mould from ' + dname + ' with Sand';
					if(Molpy.Got('Break the Mould')) {
						str += '<br><input type="Button" onclick="Molpy.BreakMould(\'' + me.alias + '\')" value="Break the Mould"></input> to cancel';
					}
				}
			}
			return str;
		},
		Making: 0,
		defSave: 1,
		saveData: { 4:['Making', 0, 'int'], },
		buyFunction: function() { this.Making = 0 },
		
		classChange: function() { return (Molpy.Boosts['SMM'].power > 100 || this.power > 0 && this.power <= 200) ? 'alert' : '' },
		
		reset: function() {
			if(!confirm('You will also lose the unfilled sand mould which will waste 100 runs of Factory Automation.\nAre you certain you want to do this?'))
				return;
			var chips = this.Making * 100 * 100;
			if(chips < 0) chips *= chips;
			Molpy.Add('GlassChips', chips);
			var sand = Math.pow(1.2, Math.abs(this.Making)) * 100;
			if(this.Making < 0) sand *= sand;
			sand *= (this.power - 1);
			Molpy.Boosts['Sand'].dig(sand);
			this.power = 0;
			Molpy.Notify(this.name + ' has cancelled filling <small>' + Molpy.Badges['monums' + this.Making].name + '</small>', 1);
		}
	});
	new Molpy.Boost({
		name: 'Glass Mould Filler',
		alias: 'GMF',
		icon: 'glassmouldfiller',
		sortAfter: 'GMM',
		group: 'bean',
		
		desc: function(me) {
			var str = 'Fills a Glass Mould with Glass to make a Glass Monument.<br><br>Yes, really.<br>This requires 800 Factory Automation runs and consumes 1M Glass Blocks plus 2% cumulatively per NewPix number of the Discovery, per run.<br>';
			if(Molpy.Earned('Minus Worlds')) str += '(Squared if negative)<br>';
			if(me.bought) {
				if(!me.power && (Molpy.Boosts['GMM'].power > 400)) {
					str += '<br><input type="Button" onclick="Molpy.FillGlassMould(' + Molpy.Boosts['GMM'].Making
						+ ')" value="Start Filling"></input> the mould in the Glass Mould Maker with Glass.';
				}
				if(me.power > 0) {
					var mname = '<small>' + Molpy.Badges['monums' + me.Making].name + '</small>';
					str += '<br>' + Molpify((me.power - 1) / 8, 3) + '% complete filling the mould from ' + mname + ' with Glass';
					if(Molpy.Got('Break the Mould')) {
						str += '<br><input type="Button" onclick="Molpy.BreakMould(\'' + me.alias + '\')" value="Break the Mould"></input> to cancel';
					}
				}
			}
			return str;
		},
		Making: 0,
		defSave: 1,
		saveData: { 4:['Making', 0, 'int'], },
		buyFunction: function() { this.Making = 0 },
		
		classChange: function() { return (Molpy.Boosts['GMM'].power > 400 || this.power > 0 && this.power <= 800) ? 'alert' : '' },
		
		reset: function() {
			if(!confirm('You will also lose the unfilled glass mould which will waste 400 runs of Factory Automation.\nAre you certain you want to do this?'))
				return;
			var blocks = Math.pow(1.02, Math.abs(this.Making)) * 1000000;
			if(this.Making < 0) blocks *= blocks;
			blocks *= (this.power - 1);
			Molpy.Add('GlassBlocks', blocks);
			var chips = Math.pow(1.01, Math.abs(this.Making)) * 1000 * 400;
			if(this.Making < 0) chips *= chips;
			Molpy.Add('GlassChips', chips);
			this.power = 0;
			Molpy.Notify(this.name + ' has cancelled filling <small>' + Molpy.Badges['monums' + this.Making].name + '</small>', 1);
		}
	});

	Molpy.BreakMould = function(alias) {
		Molpy.Anything = 1;
		var m = Molpy.Boosts[alias];
		if(confirm('Do you want to cancel ' + m.name + '?\nYou will have wasted ' + Molpify(m.power - 1) + ' run' + plural(m.power - 1) + ' of Factory Automation.')) {
			m.reset();
			m.Refresh();
		}
	}

	Molpy.StartCheapestSandMould = function() {
		if (!Molpy.Has('Bonemeal', 10)) return; 
		var smf = Molpy.Boosts['SMF'];
		var first = Molpy.newpixNumber > 0 ? 'discov1' : 'discov-1'
		for( var i = Molpy.Badges[first].id; i < Molpy.BadgesById.length - 1; i += 8) {
			if(Molpy.BadgesById[i].earned && !Molpy.BadgesById[i + 1].earned && 
				smf.Making!=Molpy.BadgesById[i+1].np && !Molpy.BadgesById[i+3].earned) {
				Molpy.Spend('Bonemeal', 10);
				Molpy.MakeSandMould(Molpy.BadgesById[i + 1].np);
				return 1;
			}
		}
		return 0;
	}
	
	Molpy.MakeSandMould = function(np) {
		Molpy.Anything = 1;
		var mname = 'monums' + np;
		if(!Molpy.Badges[mname]) {
			Molpy.Notify('No such mould exists');
			return;
		}
		if(Molpy.Earned(mname)) {
			Molpy.Notify('You don\'t need to make this mould');
			return;
		}
		Molpy.Badges['discov' + np].Refresh();
		var smm = Molpy.Boosts['SMM'];
		var smf = Molpy.Boosts['SMF'];
		if(smf.power && smf.Making == np) {
			Molpy.Notify('You already made this mould and are presently filling it with sand');
			return;
		}
		if(!smm.bought) {
			Molpy.Notify('You don\'t have the Sand Mould Maker!');
			return;
		}
		if(smm.power) {
			Molpy.Notify('The Sand Mould Maker is already in use!');
			return;
		}
		smm.Making = np;
		smm.power = 1;
		smm.Refresh();
		smf.Refresh();
	}
	
	Molpy.MakeSandMouldWork = function(times) {
		var smm = Molpy.Boosts['SMM'];
		if(smm.power == 0 || smm.power > 100) {
			if(smm.power == 0 && Molpy.IsEnabled('Archimedes') && Molpy.Has('Bonemeal', 10)) {
				if(!Molpy.StartCheapestSandMould()) return times;
			} else
				return times;
		}
		var chips = smm.Making * 100;
		if(chips < 0) chips *= chips;
		while(times) {
			if(!Molpy.Has('GlassChips', chips)) {
				Molpy.Boosts['Break the Mould'].power += times;
				return times;
			}
			Molpy.Spend('GlassChips', chips);
			times--;
			smm.power++;
			smm.Refresh();
			if(smm.power > 100) {
				Molpy.Notify('Sand Mould Creation is complete', 1);
				if(Molpy.Boosts['Draft Dragon'].IsEnabled) Molpy.FillSandMould(smm.Making);
				return times;
			}
		}
		return times;
	}
	
	Molpy.FillSandMould = function(np) {
		var mname = 'monums' + np;
		var smm = Molpy.Boosts['SMM'];
		var smf = Molpy.Boosts['SMF'];
		if(!Molpy.Badges[mname]) {
			Molpy.Notify('No such mould exists');
			if (smm.Making == np) 
			{
				// If you managed to make a mould for something you already made
				smm.reset(); 
			}
			return;
		}
		if(Molpy.Earned(mname)) {
			Molpy.Notify('You don\'t need to make this mould');
			if (smm.Making == np) 
			{
				// If you managed to make a mould for something you already made
				smm.reset(); 
			}
			return;
		}
		if(!smf.bought) {
			Molpy.Notify('You don\'t have the Sand Mould Filler!');
			return;
		}
		if(smf.power) {
			Molpy.Notify('The Sand Mould Maker is already in use!');
			return;
		}
		if(smm.power <= 100) {
			Molpy.Notify('No mould is ready to be filled!');
			return;
		}
		smf.Making = smm.Making;
		smf.power = 1;
		smm.Making = 0;
		smm.power = 0;
		smm.Refresh();
		smf.Refresh();
	}
	
	Molpy.FillSandMouldWork = function(times) {
		var smf = Molpy.Boosts['SMF'];
		if(smf.power == 0) {
			return times;
		}
		var b = smf.Making;
		var sandToSpend = Math.pow(1.2, Math.abs(b)) * 100;
		if(b < 0) sandToSpend *= sandToSpend;
		while(times) {
			if(!Molpy.Has('Sand',sandToSpend)) {
				Molpy.Boosts['Break the Mould'].power += times;
				return times;
			}
			Molpy.Spend('Sand', sandToSpend);
			times--;
			smf.power++;
			smf.Refresh();
			if(smf.power > 200) {
				Molpy.Notify('Sand Mould Filling is complete', 1);
				Molpy.EarnBadge('monums' + smf.Making);
				if(Molpy.Boosts['Draft Dragon'].IsEnabled && Molpy.Earned('discov' + smf.Making)
					&& !Molpy.Earned('monumg' + smf.Making)) Molpy.MakeGlassMould(smf.Making);
				smf.Making = 0;
				smf.power = 0;
				return times;
			}
		}
		return times;
	}

	Molpy.MakeGlassMould = function(np) {
		Molpy.Anything = 1;
		var mname = 'monumg' + np;
		var gmm = Molpy.Boosts['GMM'];
		var gmf = Molpy.Boosts['GMF'];
		if(!Molpy.Badges[mname]) {
			Molpy.Notify('No such mould exists');
			return;
		}
		if(Molpy.Earned(mname)) {
			Molpy.Notify('You don\'t need to make this mould');
			return;
		}
		Molpy.Badges['monums' + np].Refresh();
		if(gmf.power && gmf.Making == np) {
			Molpy.Notify('You already made this mould and are presently filling it with glass');
			return;
		}
		if(!gmm.bought) {
			Molpy.Notify('You don\'t have the Glass Mould Maker!');
			return;
		}
		if(gmm.power) {
			Molpy.Notify('The Glass Mould Maker is already in use!');
			return;
		}
		gmm.Making = np;
		gmm.power = 1;
		gmm.Refresh();
		gmf.Refresh();
	}
	
	Molpy.StartCheapestGlassMould = function() {
		if (!Molpy.Has('Bonemeal', 10)) return; 
		var gmf = Molpy.Boosts['GMF'];
		var first = Molpy.newpixNumber > 0 ? 'monums1' : 'monums-1'
		for( var i = Molpy.Badges[first].id; i < Molpy.BadgesById.length - 1; i += 8) {
			if(Molpy.BadgesById[i].earned && !Molpy.BadgesById[i + 1].earned &&
				gmf.Making!=Molpy.BadgesById[i+1].np) {
				Molpy.Spend('Bonemeal', 10)
				Molpy.MakeGlassMould(Molpy.BadgesById[i + 1].np);
				return 1;
			}
		}
		return 0;
	}
	
	Molpy.MakeGlassMouldWork = function(times) {
		var gmm = Molpy.Boosts['GMM'];
		if(gmm.power == 0 || gmm.power > 400) {
			if(gmm.power == 0 && Molpy.IsEnabled('Archimedes') && Molpy.Has('Bonemeal', 10)) {
				if(!Molpy.StartCheapestGlassMould()) return times;
			} else
				return times;
		}
		var b = gmm.Making;
		var chips = Math.pow(1.01, Math.abs(b)) * 1000;
		if(b < 0) chips *= chips;
		while(times) {
			if(!Molpy.Has('GlassChips', chips)) {
				Molpy.Boosts['Break the Mould'].power += times;
				return times;
			}
			Molpy.Spend('GlassChips', chips);
			times--;
			gmm.power++;
			gmm.Refresh();
			if(gmm.power > 400) {
				Molpy.Notify('Glass Mould Creation is complete', 1);
				if(Molpy.Boosts['Draft Dragon'].IsEnabled) Molpy.FillGlassMould(gmm.Making);
				return times;
			}
		}
		return times;
	}
	
	Molpy.FillGlassMould = function(np) {
		var gmm = Molpy.Boosts['GMM'];
		var gmf = Molpy.Boosts['GMF'];
		var mname = 'monumg' + np;
		if(!Molpy.Badges[mname]) {
			Molpy.Notify('No such mould exists');
			if (gmm.Making == np) 
			{
				gmm.reset(); 
			}
			return;
		}
		if(Molpy.Earned(mname)) {
			Molpy.Notify('You don\'t need to make this mould');
			if (gmm.Making == np) 
			{
				// If you managed to make a mould for something you already made
				gmm.reset(); 
			}
			return;
		}
		if(!gmf.bought) {
			Molpy.Notify('You don\'t have the Glass Mould Filler!');
			return;
		}
		if(gmf.power) {
			Molpy.Notify('The Glass Mould Maker is already in use!');
			return;
		}
		if(gmm.power <= 400) {
			Molpy.Notify('No mould is ready to be filled!');
			return;
		}
		gmf.Making = gmm.Making;
		gmf.power = 1;
		gmm.Making = 0; // *shrug again*
		gmm.power = 0;
		gmm.Refresh();
		gmf.Refresh();
	}
	
	Molpy.FillGlassMouldWork = function(times) {
		var gmf = Molpy.Boosts['GMF'];
		if(gmf.power == 0) {
			return times;
		}
		var b = gmf.Making;
		var glass = Math.pow(1.02, Math.abs(b)) * 1000000;
		if(b < 0) glass *= glass;
		while(times) {
			if(!Molpy.Has('GlassBlocks', glass)) {
				Molpy.Boosts['Break the Mould'].power += times;
				return times;
			}
			Molpy.Spend('GlassBlocks', glass);
			times--;
			gmf.power++;
			gmf.Refresh();
			if(gmf.power > 800) {
				Molpy.Notify('Glass Mould Filling is complete', 1);
				Molpy.EarnBadge('monumg' + gmf.Making);
				Molpy.Overview.Update(gmf.Making);
				if(Molpy.Got('Magic Mirror') && Molpy.Boosts['Draft Dragon'].IsEnabled) {
					if(Molpy.Earned('discov' + -gmf.Making)) {
						if(!Molpy.Earned('monums' + -gmf.Making))
							Molpy.MakeSandMould(-gmf.Making);
						else if(!Molpy.Earned('monumg' + -gmf.Making)) Molpy.MakeGlassMould(-gmf.Making);
					}
				}
				gmf.power = 0;
				gmf.Making = 0;
				return times;
			}
		}
		return times;
	}

	new Molpy.Boost({
		name: 'Ninjasaw',
		icon: 'ninjasaw',
		group: 'ninj',
		className: 'toggle',
		
		desc: function(me) {
			var str = 'Ninja Builder\'s Castle output is multiplied by VITSSÅGEN, JA! and VITSSÅGEN, JA! is multipled by a tenth of Ninja Builder, each at a cost of 50 Glass Blocks';
			if(me.bought) {
				str += '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="' + (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>';
			}
			return str;
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		price:{
			Sand: '450EW',
			Castles: '75EW',
			GlassBlocks: '1.8K'
		},
	});

	/*
	 * 10000000*Math.pow(1.25,3090) is relevant because reasons
	 * 2.8310021220015596e+306
	 */

	new Molpy.Boost({
		name: 'Fractal Fractals',
		desc: 'Even your fractals have fractals!<br>Increases the effect of Fractal Sandcastles',
		price:{
			Sand: '1.8ZW',
			Castles: '.3ZW',
			GlassBlocks: '3K'
		},
	});
	new Molpy.Boost({
		name: 'Facebugs',
		icon: 'facebugs',
		desc: 'Increases sand dig rate (but not clicks) by 10% per badge earned',
		price:{
			Sand: '24UW',
			Castles: '7.5UW',
			GlassBlocks: '8K',
		},
		
		stats: function() {
			if(Molpy.Got('Facebugs')) {
				var mult = 0.1 * Molpy.BadgesOwned;
				return 'Increases sand dig rate by ' + Molpify(mult * 100, 2) + '%';
			}
			return 'Increases sand dig rate by 10% per Badge earned';
		}
	});
	new Molpy.Boost({
		name: 'Keygrinder',
		icon: 'keygrinder',
		group: 'hpt',
		desc: 'The DoRD may produce a Crate Key if Factory Automation is at Level 10 or above',
		price:{
			Sand: '463UW',
			Castles: '15.6SW',
			GlassBlocks: '13K',
		},
		logic: 20
	});
	new Molpy.Boost({
		name: 'The Key Thing',
		icon: 'keything',
		group: 'bean',
		desc: 'Buying a Crate Key when the Locked Crate is not available will now do something useful',
		price:{
			Sand: '18SW',
			Castles: '47SW',
			GlassBlocks: '19K',
		},
		logic: 25
	});

	new Molpy.Boost({
		name: 'Window Washing Beanies',
		alias: 'WWB',
		icon: 'wwb',
		group: 'bean',
		
		desc: function(me) {
			if(!me.bought) return 'How are you seeing this?';
			var str = 'Multiplies the effect of each Glass Ceiling by ';
			str += Molpify(Math.pow(2, me.bought - 5), 3) + ' times the number of Scaffolds owned.';
			if(isFinite(Math.pow(2, me.bought - 5))) {
				str += '<br>Current level is ' + Molpify(me.bought);
				str += '<br><input type="Button" value="Trade" onclick="Molpy.GetWWB()"></input> '
					+ Molpify(444 + 77 * me.bought, 2) + ' Scaffolds to hire more Beanies.';
				if(Molpy.Got('Leggy') && !Molpy.Got('Space Elevator'))
					str += '<br><input type="Button" value="Maximum Trade" onclick="Molpy.GetWWB(1)"></input> as many Scaffolds as possible to hire more Beanies: reach an infinite multiplier to unlock a new Boost!.';
			}
			return str;
		},
		
		classChange: function() { return this.bought && isFinite(Math.pow(2, this.bought - 5))
			&& Molpy.CastleTools['Scaffold'].amount >= 444 + this.bought * 77 ? 'action' : ''}
	});
	
	Molpy.GetWWB = function(seaish) {
		Molpy.Anything = 1;
		var wwb = Molpy.Boosts['WWB'];
		var price = 444 + 77 * wwb.bought;
		var scaf = Molpy.CastleTools['Scaffold'];
		if(scaf.amount < price) {
			Molpy.Notify('You must construct additional <span class="strike">pylons</span>scaffolds', 1);
			return;
		}
		if(seaish && wwb.bought) {
			while(scaf.amount > price && isFinite(Math.pow(2, wwb.bought - 5))) {
				scaf.amount -= price;
				Molpy.CastleToolsOwned -= price;
				wwb.bought++;
				price = 444 + 77 * wwb.bought;
			}
			scaf.Refresh();
			wwb.Refresh();
		} else {
			scaf.amount -= price;
			Molpy.CastleToolsOwned -= price;
			scaf.Refresh();
			if(wwb.bought)
				wwb.bought++;
			else {
				Molpy.UnlockBoost(wwb.alias);
				wwb.buy();
			}
		}
		if(!isFinite(Math.pow(2, wwb.bought - 5))) Molpy.UnlockBoost('Space Elevator');
		wwb.Refresh();
	}

	new Molpy.Boost({
		name: 'Recycling Beanies',
		alias: 'RB',
		icon: 'recyclingbeanies',
		group: 'bean',
		
		desc: function(me) {
			var str = 'Multiplies the effect of Broken Bottle Cleanup by ' + Molpify(Math.pow(200, me.bought), 3);
			if(isFinite(Math.pow(200, me.bought))) {
				str += '<br>Current level is ' + Molpify(me.bought);
				if(Molpy.CastleTools['Beanie Builder'].amount > (me.bought * 200)) {
					str += '<br><input type="Button" value="Hire" onclick="Molpy.HireRecycling()"></input> '
						+ Molpify(200 * me.bought, 2) + ' Beanie Builders to recycle.';
				} else {
					str += '<br>You need to buy ' + (Molpy.CastleTools['Beanie Builder'].amount ? 'more' : 'some')
						+ ' Beanie Builders before you can upgrade this.';
				}
				if(Molpy.Got('Crystal Helm')) str += '<br>Reach an infinite multiplier to unlock a new Boost!';
			}
			return str;
		},
		
		classChange: function() { return this.bought && isFinite(Math.pow(200, this.bought))
			&& Molpy.CastleTools['Beanie Builder'].amount >= this.bought * 200 - 20 ? 'action' : ''},
	});
	
	Molpy.HireRecycling = function() {
		Molpy.Anything = 1;
		var rb = Molpy.Boosts['RB'];
		var price = 200 * rb.bought;
		var bb = Molpy.CastleTools['Beanie Builder'];
		if(bb.amount < price) {
			Molpy.Notify('I find your lack of Beanie Builders disappointing', 1);
			return;
		}
		bb.amount -= price;
		Molpy.CastleToolsOwned -= price;
		bb.Refresh();
		rb.bought++;
		rb.Refresh();
		_gaq && _gaq.push(['_trackEvent', 'Boost', 'Upgrade', rb.name]);

		if(!isFinite(Math.pow(200, rb.bought))) Molpy.UnlockBoost('Knitted Beanies');
	}

	new Molpy.Boost({
		name: 'Tool Factory',
		alias: 'TF',
		single: 'Tool Factory Chip',
		icon: 'toolfactory',
		group: 'hpt',
		className: 'action',
		defStuff: 1,
		
		desc: function(me) {
			var str = 'Produces Glass Tools from Glass Chips.<br>Lock Glass Ceilings to prevent a tool from being produced.<br>This will concentrate more production of the remaining tools.';
			if(!me.bought) return str;
			if(Molpy.Got('TFLL') && Molpy.Has('GlassChips', 50000)) {
				if(Molpy.Has('GlassChips', 1e13)) {
					str += '<br><input type="Button" value="Load" onclick="Molpy.LoadToolFactory(1e13)"></input> with 10T Glass Chips';
				} else if(Molpy.Has('GlassChips', 1e10)) {
					str += '<br><input type="Button" value="Load" onclick="Molpy.LoadToolFactory(1e10)"></input> with 10G Glass Chips';
				} else if(Molpy.Has('GlassChips', 1e7)) {
					str += '<br><input type="Button" value="Load" onclick="Molpy.LoadToolFactory(1e7)"></input> with 10M Glass Chips';
				}
				str += '<br><input type="Button" value="Load" onclick="Molpy.LoadToolFactory(50000)"></input> with 50K Glass Chips';
			} else if(Molpy.Got('TFLL') && Molpy.Has('GlassChips', 10000)) {
				str += '<br><input type="Button" value="Load" onclick="Molpy.LoadToolFactory(10000)"></input> with 10K Glass Chips';
			}

			if(Molpy.Has('GlassChips', 1000)) {
				str += '<br><input type="Button" value="Load" onclick="Molpy.LoadToolFactory(1000)"></input> with 1K Glass Chips';
			}
			return str;
		},
		
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: 10005,
		},
		
		classChange: function() {
			var toolcheck = !isFinite(Molpy.SandTools['Bucket'].amount)
				&& !isFinite(Molpy.SandTools['Cuegan'].amount)
				&& !isFinite(Molpy.SandTools['Flag'].amount)
				&& !isFinite(Molpy.SandTools['Ladder'].amount)
				&& !isFinite(Molpy.SandTools['Bag'].amount)
				&& !isFinite(Molpy.SandTools['LaPetite'].amount)
				&& !isFinite(Molpy.CastleTools['NewPixBot'].amount)
				&& !isFinite(Molpy.CastleTools['Trebuchet'].amount)
				&& !isFinite(Molpy.CastleTools['Scaffold'].amount)
				&& !isFinite(Molpy.CastleTools['Wave'].amount)
				&& !isFinite(Molpy.CastleTools['River'].amount)
				&& !isFinite(Molpy.CastleTools['Beanie Builder'].amount);
			return !toolcheck ? 'action' : '';
		},
		
		loadedPermNP: 0, // Numer loaded per mNP
		loadedPerClick: 0,
		
		calculateLoadedPerClick: function() {
			if(!isFinite(Molpy.Boosts['Sand'].power) && Molpy.Got('BG')) {
				this.loadedPerClick = Molpy.BoostsOwned * 4;
				if(Molpy.Got('GM')) {
					this.loadedPerClick  += this.loadedPermNP / 20;
				}
				if(Molpy.Got('Bone Clicker') && Molpy.Has('Bonemeal', 1)) {
					this.loadedPerClick  *= Molpy.Level('Bonemeal');
				}
			} else {
				this.loadedPerClick = 0;
			}
		},
		
		calculateLoadedPermNP: function() {
			var oldrate = this.loadedPermNP;
			var newRate = 0;
			var multiplier = 1;
			var inf = (Molpy.Got('Sand to Glass') && !isFinite(Molpy.Boosts['Sand'].power)) * 1;
			if(!inf && oldrate == 0) return;

			for( var i in Molpy.SandTools) {
				var me = Molpy.SandTools[i];
				var tf = !isFinite(Molpy.priceFactor * me.price) * 1 * inf;
				me.storedGpmNP = EvalMaybeFunction(me.gpmNP, me) * tf;
				me.storedTotalGpmNP = isFinite(me.amount) ? me.amount * me.storedGpmNP : Infinity;
				newRate += me.storedTotalGpmNP || 0;
			}
			if(Molpy.Got('GL')) {
				multiplier *= Molpy.Boosts['GL'].power / 100;
			}
			if(Molpy.Got('CFT')) {
				multiplier *= Molpy.Boosts['Castles'].globalMult;
			}

			Molpy.globalGpmNPMult = multiplier;
			newRate *= Molpy.globalGpmNPMult;

			this.calculateLoadedPerClick();
			
			if(newRate > oldrate) {
				if(newRate >= 5000) Molpy.EarnBadge('Plain Potato Chips');
				if(newRate >= 20000) Molpy.EarnBadge('Crinkle Cut Chips');
				if(newRate >= 800000) Molpy.EarnBadge('BBQ Chips');
				if(newRate >= 4e6) Molpy.EarnBadge('Corn Chips');
				if(newRate >= 2e7) Molpy.EarnBadge('Sour Cream and Onion Chips');
				if(newRate >= 1e8) Molpy.EarnBadge('Cinnamon Apple Chips');
				if(newRate >= 3e9) Molpy.EarnBadge('Sweet Chili Chips');
				if(newRate >= 1e11) Molpy.EarnBadge('Banana Chips');
				if(newRate >= 5e12) Molpy.EarnBadge('Nuclear Fission Chips');
				if(newRate >= 6e14) Molpy.EarnBadge('Silicon Chips');
				if(newRate >= 1e19) Molpy.EarnBadge('Blue Poker Chips');
			}
			
			this.loadedPermNP = newRate;
		},
		
		clickBeach: function() {
			this.calculateLoadedPerClick();
			var TFLoaded = this.loadedPerClick;
			if(TFLoaded){
				Molpy.Add('TF', TFLoaded);
				this.manualLoaded += TFLoaded;
				if(Molpy.options.numbers)
					Molpy.AddSandParticle('+' + Molpify(TFLoaded, 1));
			}
		},
		
		digGlass: function(amount) {
			this.totalLoaded += amount;
			Molpy.Add('TF', amount);
		},
		
		destroyGlass: function(amount) {
			amount = Math.min(this.Level, amount);
			this.Destroy(amount);
			this.totalDestroyed += amount;
		},
		
		// Unique saved properties
		totalLoaded: 0,
		totalDestroyed: 0,
		manualLoaded: 0, // Loaded due to beach clicks
		
		defSave: 1,
		saveData: {
			4:['totalLoaded', 0, 'float'],
			5:['totalDestroyed', 0, 'float'],
			6:['manualLoaded', 0, 'float'],
		}
		
	});

	Molpy.LoadToolFactory = function(amount) {
		Molpy.Anything = 1;
		if(Molpy.Has('GlassChips', amount)) {
			Molpy.Spend('GlassChips', amount);
			Molpy.Add('TF', amount);
			if(Molpy.SandTools['Bucket'].amount >= 7470 && Molpy.Got('TF') && !isFinite(Molpy.Boosts['Sand'].sandPermNP))
				Molpy.UnlockBoost('Sand to Glass');
			if(Molpy.CastleTools['NewPixBot'].amount >= 1515 && Molpy.Got('TF') && !isFinite(Molpy.Boosts['Castles'].power))
				Molpy.UnlockBoost('Castles to Glass');
			_gaq && _gaq.push(['_trackEvent', 'Boost', 'Load Tool Factory', '' + amount]);
		}
	}
	
	Molpy.MakeTFOrder = function() {
		Molpy.tfOrder = [];
		for(i in Molpy.CastleToolsById) {
			Molpy.tfOrder.push(Molpy.SandToolsById[i]);
			Molpy.tfOrder.push(Molpy.CastleToolsById[i]);
		}
	}
	
	Molpy.MakeTFOrder();
	
	Molpy.RunToolFactory = function() {
		var tf = Molpy.Boosts['TF'];
		if(!tf.bought) return;
		var toolBuildNum = 1;
		if(Molpy.Got('PC')) toolBuildNum = Molpy.Boosts['PC'].power;
		var tfChipBuffer = tf.Level;
		var acPower = 0;
		if(Molpy.Boosts['AA'].IsEnabled) {
			acPower = 1;
			if(Molpy.Got('AC')) acPower = Molpy.Boosts['AC'].power;
		}
		var built = 0;
		var fVal = Molpy.Boosts['Flipside'].power;
		var fast = 0;
		var gcCount = Molpy.GlassCeilingCount();
		if(gcCount == 0) return;
		if(gcCount == 12 && (fVal == 0) && (tfChipBuffer >= 78000 * toolBuildNum) && toolBuildNum > acPower) // everything selected and we can afford it all!
		{
			var t = Molpy.tfOrder.length;
			fast = 1;
			while(t--) {
				Molpy.tfOrder[t].create(toolBuildNum - acPower);
				Molpy.tfOrder[t].Refresh();
			}
			tfChipBuffer -= Math.ceil(Molpy.Papal('ToolF')*78000 * toolBuildNum);
			built = toolBuildNum * 12;
		} else {
			toolBuildNum = Math.floor(toolBuildNum / gcCount * 12);// if something isn't selected, we can try building a bit more of the other things
			var setPrice = 0;
			var t = Molpy.tfOrder.length;
			while(tfChipBuffer && t--) {
				var tool = Molpy.tfOrder[t];
				if(isFinite(Molpy.priceFactor * tool.price) == fVal && Molpy.Got('Glass Ceiling ' + t)) {
					var cost = 1000 * (t + 1);
					setPrice += cost; // figure out how much it costs for one of everything selected
				}
			}
			setPrice = Math.ceil(setPrice*Molpy.Papal('ToolF'));
			var iAfford = Math.min(toolBuildNum, Math.floor(tfChipBuffer / setPrice)); // find  how many of everything can be built
			t = Molpy.tfOrder.length;
			while(iAfford && t--) {
				tool = Molpy.tfOrder[t];
				if(isFinite(Molpy.priceFactor * tool.price) == fVal && Molpy.Got('Glass Ceiling ' + t)) {
					tool.create(iAfford);
					built += iAfford;
				}
			}
			tfChipBuffer -= setPrice * iAfford;

			if(iAfford < toolBuildNum) // we have some chips leftover so build 1 of what we can afford
			{
				t = Molpy.tfOrder.length;
				while(t--) {
					var tool = Molpy.tfOrder[t];
					if(isFinite(Molpy.priceFactor * tool.price) == fVal && Molpy.Got('Glass Ceiling ' + t)) {
						var cost = Math.ceil(1000 * (t + 1) * Molpy.Papal('ToolF'));
						if(tfChipBuffer >= cost) {
							tfChipBuffer -= cost;
							built++;
							Molpy.tfOrder[t].create(1);
						}
					}
				}
			}

		}
		if(built) {
			var t = Molpy.tfOrder.length;
			while(t--) {
				var tool = Molpy.tfOrder[t];
				if(isFinite(Molpy.priceFactor * tool.price)) tool.Refresh();
			}
			built = Math.floor(built * Molpy.TDFactor());
			Molpy.toolsBuilt += built;
			Molpy.toolsBuiltTotal += built;
			Molpy.RatesRecalculate();
			Molpy.shopNeedUpdate = 1;
			Molpy.toolsNeedUpdate = 1;
			Molpy.CheckBuyUnlocks();
			tf.Level = tfChipBuffer;

			if(built >= 1000) Molpy.EarnBadge('KiloTool');
			if(built >= 1e6) Molpy.EarnBadge('MegaTool');
			if(built >= 1e9) Molpy.EarnBadge('GigaTool');
			if(built >= 1e12) Molpy.EarnBadge('TeraTool');
			if(built >= 1e15) Molpy.EarnBadge('PetaTool');
			if(built >= 1e24) Molpy.EarnBadge('YottaTool');
			if(built >= 1e42) Molpy.EarnBadge('WololoTool');
			if(built >= 1e84) Molpy.EarnBadge('WololoWololoTool');
		}
		
		if(!acPower) return;

		var i = acPower;
		var times = 0;
		if(Molpy.mustardTools) {
			if(Molpy.Got('Mustard Automation') && Molpy.Spend('Mustard', 20)) {
				Molpy.RunFastFactory(acPower);
			}
			return;
		}
		if(fast) {
			Molpy.RunFastFactory(acPower);
			return;
		}
		var t = Molpy.tfOrder.length;
		var minnum = Infinity;
		while(t--) {
			var tool = Molpy.tfOrder[t];
			minnum = Math.min(tool.amount,minnum);
		}
		if (isFinite(minnum)) {	
			// Molpy.Notify('Got Here ' + acPower);
			i = Math.min(i,1000);
			while(i--) {
				var on = 1;
				var t = Molpy.tfOrder.length;
				while(on && t--) {
					if((isFinite(Molpy.priceFactor * Molpy.tfOrder[t].price) && !fVal) || Molpy.tfOrder[t].amount <= 0)
						on = 0;
				}
				if(!on) break;
				var t = Molpy.tfOrder.length;
				while(t--) {
					var tool = Molpy.tfOrder[t];
					tool.amount--;
				}
				times++;
			}
			var t = Molpy.tfOrder.length;
			while(t--) {
				var tool = Molpy.tfOrder[t];
				tool.Refresh();
			}
			Molpy.RunFastFactory(times);
		} else {
			Molpy.RunFastFactory(acPower);
		}
	}

	Molpy.RunFastFactory = function(times) // assumes player did buy AO before getting AA. probably a safe assumption
	{
		if(times && Molpy.IsEnabled('Mario')) {
			var l = Molpy.Boosts['Mario'].bought;
			var cost = l * (l + 1) / 2;
			Molpy.boostSilence++;
			if(Molpy.Spend('QQ', cost)) {
				while(l--) {
					Molpy.RewardLogicat(Molpy.Level('QQ'));
				}
			}
			Molpy.boostSilence--;
		}
		var left = times;
		if(Molpy.Got('AE')) {
			if(Molpy.Got('CfB')) {
				Molpy.DoBlackprintConstruction(left);
			}
			Molpy.DoMouldWork(left);
		}

		Molpy.boostSilence++;
		if (times) {
			var furn = Math.floor((times + Math.random() * 3) / 2);
			Molpy.RewardBlastFurnace(furn);
			left = times - furn;
		};

		if(left > 7 && Molpy.Got('Milo')) {
			var mr = Molpy.Boosts['Milo'];
			var s = 0;// Math.sin((Math.PI*Molpy.ONGelapsed)/(Molpy.NPlength*100));
			var draft = Math.random() * (1 + 2 * s) * (left - 7);
			mr.power += draft * (Molpy.Got('Rush Job') ? 5 : 1);
			left -= draft;
			var pages = Math.floor(mr.power / 100);
			mr.power -= 100 * pages;
			if(pages) {
				Molpy.Add('Blackprints', Molpy.VoidStare(pages, 'VS'));
			}
		}
		if(left > 10 && Molpy.Redacted.totalClicks > 2500 && Molpy.Got('ZK') && Molpy.Boosts['Logicat'].bought >= 4
			&& Molpy.Got('LogiPuzzle')) {
			if (Molpy.Has('LogiPuzzle', Molpy.PokeBar()))
			{
				if (Molpy.Got('Shadow Feeder') && Molpy.IsEnabled('Shadow Feeder') && Molpy.Has('LogiPuzzle', 100) &&
					Molpy.Got('ShadwDrgn') && !Molpy.Has('Shadow Feeder',Molpy.PokeBar()) && Molpy.Spend('Bonemeal', 5)) {
					if (Molpy.Got('Bananananas') && Molpy.PuzzleGens.caged.active && (Molpy.PuzzleGens.caged.puzzles < Molpy.Level('LogiPuzzle'))) {
						Molpy.PuzzleGens.caged.puzzles = Math.ceil(Molpy.Level('LogiPuzzle'));
						Molpy.Boosts['LogiPuzzle'].power = 0;
						Molpy.Boosts['LogiPuzzle'].Refresh();
					} else if (Molpy.Got('Bananananas') && !Molpy.PuzzleGens.caged.active ) {
						var puz = Math.floor((Molpy.Level('LogiPuzzle') - 1) / 10) * 10;
						var cost = (100 + Molpy.LogiMult(25)) * puz;
						if(Molpy.Spend('GlassBlocks', cost)) {
							Molpy.PuzzleGens.caged.Generate(puz);
							Molpy.Boosts['LogiPuzzle'].Refresh();
						}
					} else {
						Molpy.ShadowStrike(1);
						Molpy.Add('Shadow Feeder',1);
						if (Molpy.Got('Shadow Ninja') && 
							(Molpy.Level('Ninja Ritual') > 777) && 
							(!Molpy.IsEnabled('Mario')) &&
							(Math.log(Molpy.Level('Ninja Ritual'))*Math.random()>5) ) Molpy.NinjaRitual();
					}
				}
			}
			else {
				var zk = Molpy.Boosts['ZK'];
				var poke = Math.random() * (left - 10);
				zk.power += poke;
				left -= poke;
				if(zk.power < 0) zk.power = 0; // how?
				var zooVisits = Math.floor(zk.power / 1000);
				zk.power -= zooVisits * 1000;
				if(zooVisits) Molpy.Boosts['Panther Poke'].buyFunction(zooVisits);

				if(!Molpy.PuzzleGens.caged.active) Molpy.Boosts['LogiPuzzle'].Refresh();
			}
		}
		Molpy.boostSilence--;
	}

	new Molpy.Boost({
		name: 'Panther Glaze',
		icon: 'pantherglaze',
		group: 'bean',
		desc: 'Early cat<br>Takes the blocks<br>But the late<br>Brings the chips<br><i>Panther Glaze</i>',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '45K',
		},
		stats: 'If you have Infinite Castles, Not Lucky related boosts don\'t use glass blocks. Instead they produce glass chips.<br>'
			+ '<small>Oh and Catamaran/LCB always consume tools</small>',
		logic: 65
	});
	new Molpy.Boost({
		name: 'Badgers',
		icon: 'badgers',
		
		desc: function(me) {
			return GLRschoice([
					'Badgers? Badgers? We don\'t need no ch*rpin\' Badgers! This is Sacred Ground and I\'ll have no more heresy. Surely you mean Molpies.',
					'Exactly! No, wait - No! There are no badgers involved at all!',
					'For every 10 badges, Glass Chip production uses 1% less sand']);
		},
		
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '60K'
		},
	});

	Molpy.glassCeilingDescText.push('Sand rate of LaPetite');
	Molpy.glassCeilingDescText.push('Castles produced by Beanie Builders');
	Molpy.MakeGlassCeiling(10);
	Molpy.MakeGlassCeiling(11);
	Molpy.Boosts['Glass Ceiling 10'].price = {
		Sand: '6FQ',
		Castles: '6FQ',
		GlassBlocks: '100K'
	};
	Molpy.Boosts['Glass Ceiling 11'].price = {
		Sand: '6WQ',
		Castles: '6WQ',
		GlassBlocks: '350K'
	};

	new Molpy.Boost({
		name: 'Expando',
		icon: 'expando',
		className: 'toggle',
		
		desc: function(me) {
			return (me.IsEnabled ? '' : 'When active, ') + 'All Tools, Boosts and Badges are expanded<br>'
				+ (me.IsEnabled ? '<br>' : '') + '<input type="Button" onclick="Molpy.ToggleExpando()" value="'
				+ (me.IsEnabled ? 'Deflate' : 'Expand') + '"></input>';
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		price:{
			Sand: 800,
			Castles: 20,
		},
	});
	new Molpy.Boost({
		name: 'Sand to Glass',
		icon: 'sandtoglass',
		group: 'hpt',
		desc: 'When Sand is Infinite, Sand Tools produce Glass Chips for Tool Factory',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '200K'
		},
	});
	new Molpy.Boost({
		name: 'Castles to Glass',
		icon: 'castlestoglass',
		group: 'hpt',
		desc: 'When Castles are Infinite, Castle Tools produce Glass Chips for Tool Factory',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '2M'
		},
	});

	var loveline = 0;
	Molpy.ToggleExpando = function() {
		Molpy.Anything = 1;
		var me = Molpy.Boosts['Expando'];
		Molpy.Notify(Molpy.love[loveline]);
		loveline++;
		if(loveline >= Molpy.love.length) {
			loveline = 0;
			if(!me.bought) {
				me.buy();
				if(me.bought) Molpy.RewardRedacted();
			}
		}

		if(!me.bought) {
			_gaq && _gaq.push(['_trackEvent', 'Boost', 'Toggle Fail', me.name]);
			return;
		}
		_gaq && _gaq.push(['_trackEvent', 'Boost', 'Toggle', me.name]);
		me.IsEnabled = 1 * !me.IsEnabled;
		me.Refresh();
		Molpy.allNeedRepaint = 1;
	}

	new Molpy.Boost({
		name: 'Frenchbot',
		icon: 'frenchbot',
		group: 'cyb',
		desc: 'NewPixBots produce 1Q x castles, LaPetite produces 1W x sand',
		stats: 'The Dip of Infinite Judgement Approaches. Do you have 101 Logicats?',
		price:{
			Sand: '10Q',
			Castles: '10Q',
			GlassBlocks: '.5M'
		},
	});
	new Molpy.Boost({
		name: 'Bacon',
		icon: 'bacon',
		group: 'cyb',
		desc: 'Knowledge is Power - France is Bacon.<br>'
			+ 'NewPixBots produce 10x, LaPetite sand production is boosted by 3% cumulatively per NewPixBot',
		price:{
			Sand: '10WQ',
			Castles: '10WQ',
			GlassBlocks: '.75M'
		},
	}); // note: it doesn't say 10x *castles*

	new Molpy.Boost({
		name: 'Safety Hat',
		desc: 'It\'s green, comfortable, stylish, and protects you from all kinds of harm! Best of all, it\'s completely free!',
		icon: 'safetyhat',
		
		buyFunction: function() {
			Molpy.Notify('You are hit by a torrent of salt and pumpkins. No brainslug for you!', 1);
			Molpy.LockBoost('Safety Hat');
		}
	});
	new Molpy.Boost({
		name: 'Safety Pumpkin',
		icon: 'safetypumpkin',
		desc: 'It\'s orange, comfortable, stylish, and reduces the likelihood of industrial accidents!',
		price:{ GlassBlocks: '20K' },
	});
	new Molpy.Boost({
		name: 'Backing Out',
		icon: 'backingout',
		desc: 'Castle Tools activate from smallest to largest, and each builds before the next destroys',
		price:{ GlassBlocks: '6M', },
		logic: 120
	});
	new Molpy.Boost({
		name: 'Bucking the Trend',
		icon: 'buckingthetrend',
		desc: 'Buckets produce 2x Glass',
		price:{
			Sand: Infinity,
			GlassBlocks: '2M',
		}
	});
	new Molpy.Boost({
		name: 'Crystal Well',
		icon: 'crystalwell',
		desc: 'Buckets produce 10x Glass',
		price:{ GlassBlocks: '8M' }
	});
	new Molpy.Boost({
		name: 'Glass Spades',
		icon: 'glassspades',
		desc: 'Cuegan produce 2x Glass',
		price:{ GlassBlocks: '3M' }
	});
	new Molpy.Boost({
		name: 'Statuesque',
		icon: 'statuesque',
		desc: 'Cuegan produce 10x Glass',
		price:{
			Sand: Infinity,
			GlassBlocks: '10M',
		}
	});
	new Molpy.Boost({
		name: 'Flag in the Window',
		icon: 'flaginthewindow',
		desc: 'Flags produce 4X Glass',
		price:{ GlassBlocks: '4M' },
	});
	new Molpy.Boost({
		name: 'Crystal Wind',
		icon: 'crystalwind',
		desc: 'Flags produce 5X Glass',
		price:{ GlassBlocks: '5M' },
	});
	new Molpy.Boost({
		name: 'Crystal Peak',
		icon: 'crystalpeak',
		desc: 'Ladders produce 12X Glass',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '9M',
		}
	});
	new Molpy.Boost({
		name: 'Cupholder',
		icon: 'cupholder',
		desc: 'Bags produce 8X Glass',
		price:{
			Castles: Infinity,
			GlassBlocks: '11M',
		}
	});
	new Molpy.Boost({
		name: 'Tiny Glasses',
		icon: 'tinyglasses',
		desc: 'LaPetite produces 9X Glass',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '12M',
		}
	});
	new Molpy.Boost({
		name: 'Stained Glass Launcher',
		icon: 'stainedglasslauncher',
		desc: 'Trebuchet Glass flinging is multiplied by the number of Glass Ceilings owned',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '15M',
		}
	});
	new Molpy.Boost({
		name: 'Glass Saw',
		icon: 'glasssaw',
		className: 'toggle',
		
		desc: function(me) {
			return (me.IsEnabled ? '' : 'When active, ')
				+ 'VITSSÅGEN, JA! makes Glass Blocks from Glass Chips (at the Glass Blower rate) in the Tool Factory buffer: initially up to 10M per Glass Ceiling and multiplying by 10 or 2 with use if enough Chips remain in the buffer.'
				+ (me.bought ? '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ',1)" value="'
				+ (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>' : '')
				+ '<br>Current maximum is ' + Molpify(Math.abs(me.power), 1) + ' Blocks per Glass Ceiling';
		},
		
		IsEnabled: Molpy.BoostFuncs.PosPowEnabled,
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '7M',
		},
		
		buyFunction: function() {
			this.IsEnabled = 1;
		}
	});
	new Molpy.Boost({
		name: 'Panther Rush',
		icon: 'pantherrush',
		alias: 'PR',
		className: 'action',
		
		desc: function(me) {
			var rushcost = Molpy.CalcRushCost();
			var str = "";
			if (!Molpy.Earned('Einstein Says No') ) {
				str += 'Uses ' + Molpy.PriceString(rushcost) + ' to increase the value of Logicat answers by 0.5.<br>';
				if(rushcost.Vacuum) {
					if(Molpy.Has('Mustard', rushcost.Vacuum)) str += 'You can use Mustard intead of Vacuums.<br>';
					if(Molpy.Has('Bonemeal', rushcost.Vacuum * 10))
						str += 'You can use 10xBonemeal intead of Vacuums.<br>';
				}

				str += 'Single use: available again when you have ' + Molpify(Molpy.CalcRushCost(1, 1).Logicat) + ' Logicats.'
					+ (me.Level ? '<br>Currently at ' + Molpify(me.Level / 2, 1) + ' points' : '');
				if (me.bought) {
					var mult = 1;
					var strs = [];
					var mstr = '';
					while (Molpy.Has('Blackprints',rushcost.Blackprints*mult) && 
						Molpy.Has('Logicat',rushcost.Logicat*mult) && (mult<me.Level || mult == 1 ) && (me.Level+mult <= 1079252850*2)) {
					
						if (!rushcost.Vacuum) {
							mstr += '<input type="Button" onclick="Molpy.PantherRush(0,'+mult+')" value="Use"></input>';
						} else {
							if (Molpy.Has('Vacuum',rushcost.Vacuum*mult)) mstr +=
								'<input type="Button" onclick="Molpy.PantherRush(0,'+mult+')" value="Use Vacuums"></input>';
							if (Molpy.Has('Mustard',rushcost.Vacuum*mult)) mstr +=
								'<input type="Button" onclick="Molpy.PantherRush(1,'+mult+')" value="Use Mustard"></input>';
							if (Molpy.Has('Bonemeal',rushcost.Vacuum*10*mult)) mstr +=
								'<input type="Button" onclick="Molpy.PantherRush(2,'+mult+')" value="Use Bonemeal"></input>';
						}
						if (mstr) {
							strs.push('<br>' + (mult>1?'Raise by ' + Molpify(mult/2) + '<br>':'') + mstr);
							mult *= 10;
						} else {
							break;
						}
					}
					
					if(me.Level+mult > 1079252850*2) {
						mult = 1079252850*2 - me.Level;
						if(Molpy.Has('Blackprints',rushcost.Blackprints*mult) && 
						Molpy.Has('Logicat',rushcost.Logicat*mult) && mult<me.Level) {
							if (Molpy.Has('Vacuum',rushcost.Vacuum*mult)) mstr +=
								'<input type="Button" onclick="Molpy.PantherRush(0,'+mult+')" value="Use Vacuums"></input>';
							if (Molpy.Has('Mustard',rushcost.Vacuum*mult)) mstr +=
								'<input type="Button" onclick="Molpy.PantherRush(1,'+mult+')" value="Use Mustard"></input>';
							if (Molpy.Has('Bonemeal',rushcost.Vacuum*10*mult)) mstr +=
								'<input type="Button" onclick="Molpy.PantherRush(2,'+mult+')" value="Use Bonemeal"></input>';
							if (mstr) {
								strs.push('<br>Light speed<br>') + mstr);
								mult *= 10;
							}
						}
					}
					if (strs.length) str += strs.slice(-3).join('');
				}
			} else {
				str += "Rushing at the speed of light";
			}
			return str;
		},
		
		price:{
			GlassBlocks: function() {
				return Math.pow(10, Molpy.Boosts['PR'].power + 7);
			},
			Sand: Infinity,
			Castles: Infinity,
		},
		defStuff: 1,

		buyFunction: function() { 
			if (!this.Level) this.Level = 1;
			if (Molpy.Earned('Einstein Says No')) this.Level = 1079252850 *2; 
		},

		classChange: function() { return Molpy.Earned('Einstein Says No')?'': 'action' },

	});
	
	Molpy.Boosts['PR'].refreshFunction = undefined;
	
	Molpy.CalcRushCost = function(nextLevel, feather) {
		var l = Molpy.Level('PR') + (nextLevel || 0);
		var m = Math.max(1, l - 9);
		var v = Math.max(1, l - 19);
		return {
			Logicat: 300 * (l + 1) * m + (5 * feather || 0),
			Blackprints: 2000 * (m - 1) * l,
			Vacuum: (v - 1) * l
		};
	}
	
	Molpy.PantherRush = function(stuff,n) {
		Molpy.Anything = 1;
		var pr = Molpy.Boosts['PR'];
		var cost = Molpy.CalcRushCost();
		if (stuff) {
			if (stuff == 1) {
				cost['Mustard'] = cost.Vacuum;
				delete cost['Vacuum'];
			} else if (stuff == 2) {
				cost['Bonemeal'] = cost.Vacuum*10;
				delete cost['Vacuum'];
			}
		}
		if (n) {
			for (var coin in cost) cost[coin] *=n;
		} else {
			n = 1;
		}
		if(Molpy.Has(cost)
			&& (pr.Level > 12 || confirm('Really spend ' + (Molpy.PriceString(cost).replace(/&nbsp;/g, ' ').replace(/(<([^>]+)>)/ig,"")) + ' on PR?'))) {
			if(Molpy.Spend(cost)) pr.Add(n);
			var fCost = Molpy.CalcRushCost(0, 1);
			var speed = pr.Level/2;
			if (speed >= 80) Molpy.EarnBadge('Panther Pelts');
			if (speed >= 1225) Molpy.EarnBadge('Mach 1');
			if (speed >= 40320) Molpy.EarnBadge('Escape Velocity');
			if (speed >= 1079252850) Molpy.EarnBadge('Einstein Says No')
			else {
				Molpy.LockBoost(pr.alias);
				if(Molpy.Has('Logicat',fCost.Logicat) ) Molpy.UnlockBoost(pr.alias);
			}
		}
	}

	new Molpy.Boost({
		name: 'Ruthless Efficiency',
		icon: 'ruthlessefficiency',
		group: 'hpt',
		desc: 'Glass Block production uses a quarter as many Chips',
		price:{
			Sand: '10WW',
			Castles: '10WW',
			GlassBlocks: '12M',
		}
	});
	new Molpy.Boost({
		name: 'Break the Mould',
		icon: 'breakthemould',
		group: 'bean',
		desc: 'Allows you to destroy an incomplete or unfilled Mould, if you decide making it was a mistake.',
		price:{
			Sand: '10WWW',
			Castles: '10WWW',
			GlassBlocks: '2M',
		}
	});
	new Molpy.Boost({
		name: 'TF Load Letter',
		alias: 'TFLL',
		icon: 'tfloadletter',
		group: 'hpt',
		desc: 'You can load Tool Factory with 50K Glass Chips at a time',	
		price: {
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '4M',
			TF: '50K'
		}
	});
	new Molpy.Boost({
		name: 'Booster Glass',
		alias: 'BG',
		icon: 'boosterglass',
		group: 'hpt',
		desc: 'If you have Infinite Sand, clicking the NewPix gives Tool Factory 4 Glass Chips per Boost owned',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '8M',
		}
	});
	new Molpy.Boost({
		name: 'Automation Optimiser',
		alias: 'AO',
		icon: 'automationoptimiser',
		group: 'hpt',
		desc: 'Mould Processing does not prevent the standard tasks of Factory Automation from occuring',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '20M',
		}
	});
	new Molpy.Boost({
		name: 'Production Control',
		alias: 'PC',
		icon: 'productioncontrol',
		group: 'hpt',
		
		desc: function(me) {
			if(!me.bought)
				return 'Allows you to change how many copies of Glass Tools can be constructed by Tool Factory each mNP';
			var n = me.power;
			var str = 'Tool Factory produces up to ' + Molpify(n * 12, 2) + ' Glass Tools per mNP (distributed evenly between each type of Glass Tool).';
			if(Molpy.Earned('Nope!')) {
				return str;
			}

			if((n < 500 || !Molpy.Has('GlassBlocks', 1e7 * n)) && Molpy.Has('GlassBlocks', 1e6 * n)) {
				str += '<br><input type="Button" value="Increase" onclick="Molpy.ControlToolFactory(1)"></input> '
					+ 'the rate by 1 at a cost of ' + Molpify(1e6 * n, 1) + ' Glass Blocks.';
			}
			if(n > 5e51) {
				str += 'No further increases are possible.'
				if(!Molpy.Earned('Nope!')) {
					Molpy.EarnBadge('Nope!');
					me.power = 6e51;// Evens everyone up to same value could get here between 5 and 5.00999...
					me.className = '';
					Molpy.lootCheckTagged(me);
				}
			} else {
				var affordPow = Math.floor(Math.log(Molpy.Level('GlassBlocks') / n) * Math.LOG10E) - 6;
				var numPow = Math.floor(Math.log(n / 5) * Math.LOG10E);
				var i = Math.max(Math.min(49, affordPow, numPow), 0);
				if(i) {
					str += '<br><input type="Button" value="Increase" onclick="Molpy.ControlToolFactory(' + Math.pow(10, i) + ')"></input> '
						+ 'the rate by ' + Molpify(Math.pow(10, i), 1)
						+ ' at a cost of ' + Molpify(Math.pow(10, i + 6) * n, 1) + ' Glass Blocks.';
				}
			}
			if(!Molpy.Boosts['No Sell'].power && me.power > 0 && Molpy.Has('GlassBlocks', 1e5 * n)) {
				str += '<br><input type="Button" value="Decrease" onclick="Molpy.ControlToolFactory(-1)"></input> '
					+ 'the rate by 1 at a cost of ' + Molpify(1e5 * n, 1) + ' Glass Blocks.';
			}

			return str;
		},
		
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '30M',
		},
		
		classChange: function() { return Molpy.Earned('Nope!') ? '' : 'toggle' },
		
		buyFunction: function() {
			this.power |= 1;
			if(Molpy.Earned('Nope!')) this.power = 6e51;
		}
	});
	
	Molpy.ControlToolFactory = function(n) {
		Molpy.Anything = 1;
		var me = Molpy.Boosts['PC'];
		var cost = 1e6 * n;
		if(n < 0) cost = -1e5 * n;
		cost *= me.power;
		if(Molpy.Has('GlassBlocks', cost)) {
			Molpy.Spend('GlassBlocks', cost);
			me.power += n;
			Molpy.Notify('Adjusted production rate of Tool Factory');
			me.Refresh();
			if(n > 0)
				_gaq && _gaq.push(['_trackEvent', 'Boost', 'Upgrade', me.name]);
			else
				_gaq && _gaq.push(['_trackEvent', 'Boost', 'Downgrade', me.name]);
		}
	}
	
	new Molpy.Boost({
		name: 'Panther Poke',
		icon: 'pantherpoke',
		group: 'bean',
		desc: 'Keeps the Caged Logicat awake a little longer.',
		buyFunction: function(n) {
			if(!n) n = 1;
			if(Molpy.Got('LogiPuzzle')) Molpy.Add('LogiPuzzle', n * (1 + Molpy.Level('PR')));
			Molpy.LockBoost(this.alias);
		}
	});
	
	Molpy.PokeBar = function() {
		return Math.floor(4 + Molpy.Level('PR') * (1 + Molpy.Boosts['CDSP'].power) *
			(Molpy.Boosts['CDSP'].power ? Math.max(1,Math.log(Molpy.Level('AC'))-10,1) : 1 ));
	}
	
	new Molpy.Boost({
		name: 'Flipside',
		icon: 'flipside',
		group: 'hpt',
		className: 'toggle',
		
		desc: function(me) {

			return (me.IsEnabled ? '' : 'When active, ')
				+ 'Factory constructs Glass Tools that do not have infinite price, instead of Glass Tools that do have infinite price.'
				+ (me.bought ? '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="' + (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>' : '');
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '50M',
		}
	});
	new Molpy.Boost({
		name: 'Automata Assemble',
		alias: 'AA',
		icon: 'automataassemble',
		group: 'hpt',
		className: 'toggle',
		
		desc: function(me) {
			return (me.IsEnabled ? 'A' : 'When active, a')
				+ 'fter Tool Factory runs, if all Tool prices are Infinite, uses 1 of each Tool to perform a Blast Furnace run.'
				+ (me.bought ? '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="' + (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>' : '')
				+ '<br>(Without extra power from Automata Control, will not run Blast Furnace every time.)<br>(Supresses notifications about Glass gains so you don\'t get spammed)';
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '50M',
		}
	});
	new Molpy.Boost({
		name: 'Glass Mousepy',
		alias: 'GM',
		icon: 'glassmousepy',
		group: 'hpt',
		desc: 'Clicks give 5% of your chips/mNP rate',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '10M',
		}
	});
	new Molpy.Boost({
		name: 'Glassed Lightning',
		alias: 'GL',
		icon: 'blitzing',
		className: 'alert',
		
		desc: function(me) {
			return Molpify(me.power, 1) + '% Glass for ' + MolpifyCountdown(me.countdown);
		},
		
		stats: 'Loses 5% power per ONG if above 500%',
		startCountdown: 25,
		countdownCMS: 1,
		
		startPower: function() {
			return Molpy.Got('LR') ? (Molpy.Boosts['LR'].power || 400) : 400;
		},
		
		buyFunction: function() {
			this.checkUnlocks(false);
		},
		
		checkUnlocks: function(blitz) {
			// Bonus from lightning striking twice
			var blitzBonus = 0;
			if(blitz) blitzBonus = .1;
			
			if(Molpy.Got('LR')) {
				// Set LR power incase it gets screwed up for some unknown reason
				Molpy.Boosts['LR'].power = Math.max(Molpy.Boosts['LR'].power, Molpy.Boosts['Kite and Key'].power, Molpy.Boosts['Lightning in a Bottle'].power);
				// If we have thunderbird and duplication, power is raised 50% and special boosts might get unlocked
				if(Molpy.Got('Thunderbird') && Molpy.Got('TDE')) {
					var newLRPower = Molpy.Boosts['LR'].power *= (1.5 + blitzBonus);
					
					if(newLRPower >= 1e24)
						Molpy.UnlockBoost('Kite and Key');
					if(newLRPower >= 1e73)
						Molpy.UnlockBoost('Lightning in a Bottle');
					
					if(Molpy.Got('Kite and Key')) {
						if(isFinite(newLRPower))
							Molpy.Boosts['Kite and Key'].power = Math.sqrt(newLRPower);
						else
							Molpy.Boosts['Kite and Key'].power = 1e155;
					}
						
					if(Molpy.Got('Lightning in a Bottle')) {
						if(isFinite(newLRPower)){
							if(newLRPower > 1e288)
								Molpy.Boosts['Lightning in a Bottle'].power = 1e252;
							else
								Molpy.Boosts['Lightning in a Bottle'].power = newLRPower * 1e-36;
						} else {
							Molpy.Boosts['Lightning in a Bottle'].power = 1e252;
						}
					}
					this.power = Molpy.Boosts['LR'].power;
				} else {
					// If only LR is unlocked, we don't get the 50% boost, just a tiny one
					// and the power for both LR and GL is capped at 25k
					var newLRPower = Molpy.Boosts['LR'].power * (1.004 + blitzBonus);
					this.power = Molpy.Boosts['LR'].power = Math.min(50000, newLRPower);
				}
			} else {
				// If not even LR is unlocked, we just get a small temporary boost to GL power
				this.power = Math.min(50000, (this.power * (1.004 + blitzBonus)));
			}
		},
		
		onBlitz: function(){
			this.checkUnlocks(true);
			Molpy.Notify('Lightning struck the same place twice: 10% power bonus!');
			Molpy.EarnBadge('Strikes Twice');
			Molpy.UnlockBoost('LR');
			
			this.countdown = Math.min(500, this.countdown *= 1.21);
			this.Refresh();
			Molpy.Boosts['TDE'].Refresh();
		}
	});
	new Molpy.Boost({
		name: 'Automata Control',
		alias: 'AC',
		icon: 'automatacontrol',
		group: 'hpt',
		className: 'toggle',
		
		desc: function(me) {
			if(!me.bought)
				return 'Allows you to change the number of times Automata Assemble runs after Tool Factory.';
			var n = me.Level;
			var str = 'Automata Assemble attempts up to ' + Molpify(n, 2) + ' runs.';
			var cost = {
				GlassChips: 1e7 * Math.pow(1.2, n),
				Blackprints: n * 2
			};
			if(!Molpy.Earned('Planck Limit')) {
				if(n < Molpy.Boosts['PC'].power && Molpy.Has('GlassChips', cost.GlassChips)) {
					str += '<br><input type="Button" value="Increase" onclick="Molpy.ControlAutomata(1)"></input>'
						+ ' the number of runs by 1 at a cost of ' + Molpy.PriceString(cost) + '.';
				} else {
					str += '<br>It will cost ' + Molpy.PriceString(cost) + ' to increase this by 1.';
				}
				if(!Molpy.Boosts['No Sell'].power && n > 1 && Molpy.Has('GlassChips', 1e5 * n)) {
					str += '<br><input type="Button" value="Decrease" onclick="Molpy.ControlAutomata(-1)"></input> '
						+ 'the number of runs by 1 at a cost of ' + Molpify(1e5 * n, 1) + ' Glass Chips.';
				}
			}
			return str;
		},
		
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '25M',
		},
		defStuff: 1,
		
		buyFunction: function() {
			this.Level = (Molpy.Earned('Planck Limit') ? 6.2e34 : 1);
		},
		
		// deactivate when reached max
		classChange: function() { return (!Molpy.Earned('Planck Limit')) ? 'toggle' : '';}
	});
	
	Molpy.ControlAutomata = function(n, dragon) {
		var me = Molpy.Boosts['AC'];
		var cost = {
			GlassChips: 1e7 * Math.pow(1.2, me.Level),
			Blackprints: 2 * me.Level,
			Logicat: 0
		};
		if(dragon) {
			cost.GlassChips = 0;
			cost.Blackprints *= 5 * n / 20;
			cost.Logicat = Math.ceil(me.Level * n / (20 * 20));
			if (Molpy.Got('The Fading')) cost.Logicat *= (1+Math.cos((Math.floor((Date.now()/1000)-900)%3600)*Math.PI/1800))/2;
		} else if(n < 0) {
			cost.GlassChips = -1e5 * me.Level;
			cost.Blackprints = 0;
		}
		if(Molpy.Has('GlassChips', cost.GlassChips)) {
			if(!Molpy.Has('Blackprints', cost.Blackprints)) {
				Molpy.Notify('You need more Blackprint Pages');
				return;
			}
			if(!Molpy.Has('Logicat', cost.Logicat)) {
				Molpy.Notify('You need more Logicat Levels');
				return;
			}
			Molpy.Spend(cost);
			me.Add(n);
			if(dragon) Molpy.Boosts['Dragon Forge'].Refresh();
			Molpy.Notify('Adjusted Automata Assemble');
			if(n > 0)
				_gaq && _gaq.push(['_trackEvent', 'Boost', (dragon ? 'Dragon Upgrade' : 'Upgrade'), me.name]);
			else
				_gaq && _gaq.push(['_trackEvent', 'Boost', 'Downgrade', me.name]);
			if(me.Level >= 1e9) Molpy.EarnBadge('Microwave');
			if(me.Level >= 1e12) Molpy.EarnBadge('Ultraviolet');
			if(me.Level >= 3e16) Molpy.EarnBadge('X Rays');
			if(me.Level >= 1e19) Molpy.EarnBadge('Gamma Rays');
			if(me.Level >= 1e34) {
				me.Level = 6.2e34;
				Molpy.EarnBadge('Planck Limit');
			}
		}
	}
	new Molpy.Boost({
		name: 'Bottle Battle',
		icon: 'bottlebattle',
		group: 'cyb',
		desc: 'NewPixBot Glass production is multiplied by 3',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '10M',
		},
	});
	new Molpy.Boost({
		name: 'Leggy',
		icon: 'leggy',
		desc: 'Scaffold Glass production is multiplied by 8',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '15M',
		},
	});
	new Molpy.Boost({
		name: 'Clear Wash',
		icon: 'clearwash',
		desc: 'Wave Glass production is multiplied by 10',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '15M',
		},
	});
	new Molpy.Boost({
		name: 'Crystal Streams',
		icon: 'crystalstreams',
		desc: 'River Glass production is multiplied by 12',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '20M',
		},
	});
	new Molpy.Boost({
		name: 'Super Visor',
		icon: 'supervisor',
		group: 'bean',
		desc: 'Beanie Builder Glass production is multiplied by 15',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '20M',
		},
	}); // brillant
	new Molpy.Boost({
		name: 'Crystal Helm',
		icon: 'crystalhelm',
		desc: 'Beanie Builder Glass production is multiplied by 5',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '30M',
		},
		group: 'bean'
	}); // paula
	new Molpy.Boost({
		name: 'Safety Goggles',
		alias: 'SG',
		icon: 'safetygoggles',
		desc: 'The goggles, they do something!',
		stats: 'Reduces the chance of industrial accidents and prevents Factory Automation from downgrading in shortpix!',
		price:{ GlassBlocks: '2M' }
	});
	new Molpy.Boost({
		name: 'Seaish Glass Chips',
		icon: 'seaishglasschips',
		desc: 'Allows Sand Purifier and Sand Refinery (using chips only) to increase as far as your resources allow',
		price:{ GlassBlocks: '100K' }
	});
	new Molpy.Boost({
		name: 'Seaish Glass Blocks',
		icon: 'seaishglassblocks',
		desc: 'Allows Glass Extruder and Glass Chiller to increase as far as your resources allow',
		price:{ GlassBlocks: '100K' }
	});
	new Molpy.Boost({
		name: 'Automata Engineers',
		alias: 'AE',
		icon: 'automataengineers',
		group: 'hpt',
		desc: 'Allows Automata Assemble to perform Blackprint Construction and Mould related tasks',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '100M',
		},
	});
	new Molpy.Boost({
		name: 'Mysterious Representations',
		alias: 'Milo',
		icon: 'milo',
		group: 'hpt',
		desc: 'Allows Automata Assemble to create Blackprints.<br>Needs at least 15 AA runs.',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '500M',
		},
	});
	new Molpy.Boost({
		name: 'Zookeeper',
		alias: 'ZK',
		icon: 'zookeeper',
		group: 'bean',
		desc: 'Allows Automata Assemble to provide Panther Poke.<br>Needs at least 21 AA runs.<br>If you have over 1K AA runs, you may get a double dose of Panther Poke (thus getting more out of Crouching Dragon).',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '2.5G',
		},
	});
	new Molpy.Boost({
		name: 'Schrödinger\'s Gingercat',
		alias: 'SGC',
		icon: 'sgc',
		desc: 'Observes itself. Also causes Not Lucky to give more glass and makes ' + Molpy.Redacted.words + ' last longer',
		price:{ GlassBlocks: '16.2M', },
		logic: 1613
	});
	new Molpy.Boost({
		name: 'Mind Glow',
		icon: 'mindglow',
		desc: 'Jumping to a NewPix for which you have made a Sand Monument costs half as many Glass Chips',
		price:{ GlassBlocks: '2M' }
	});
	new Molpy.Boost({
		name: 'Memory Singer',
		icon: 'memorysinger',
		desc: 'Jumping to a NewPix for which you have made a Glass Monument costs half as many Glass Chips',
		price:{ GlassBlocks: '10M' }
	});
	new Molpy.Boost({
		name: 'Lightning Rod',
		alias: 'LR',
		icon: 'lightningrod',
		desc: function() {
			var str = 'Glassed Lightning becomes more powerful with use';
			if(!Molpy.Got('Thunderbird')) str += '<br>Capped at ' + Molpify(25,000) + ' without Thunderbird and Temporal Duplication.';
			return str;
		},
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '440M',
		},
		
		buyFunction: function() {
			this.power = Math.max(400, Molpy.Boosts['GL'].power, Molpy.Boosts['Kite and Key'].power, Molpy.Boosts['Lightning in a Bottle'].power);
		}
	});
	new Molpy.Boost({
		name: 'Beachball',
		icon: 'beachball',
		className: 'toggle',
		
		desc: function(me) {
			return (me.IsEnabled ? 'T' : 'When active, t')
				+ 'he border of the NewPix changes colour.<br>'
				+ 'Red = Clicking will Ninja<br>'
				+ 'Blue = Click to gain Ninja Stealth<br>'
				+ 'Green = All Clear<br>'
				+ 'Yellow = less than 2 mNP until ONG<br>'
				+ 'Purple = Temporal Rift'
				+ (me.bought ? '<br><input type="Button" onclick="Molpy.UpdateBeachClass(); Molpy.GenericToggle('+ me.id + ');" value="' + (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>' : '');
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		price:{
			Sand: '4K',
			Castles: 200
		}
	});
	new Molpy.Boost({
		name: 'Mushrooms',
		icon: 'mushrooms',
		desc: 'For every 10 badges, Glass Block production uses 1% less sand',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '60K'
		},
	});
	new Molpy.Boost({
		name: 'Knitted Beanies',
		icon: 'knittedbeanies',
		group: 'bean',
		desc: 'Beanie Builder Glass production is multiplied by the number of million Bags owned',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '60T',
		},
	});
	new Molpy.Boost({
		name: 'Space Elevator',
		icon: 'spaceelevator',
		desc: 'Scaffold Glass production is multiplied by a ten thousandth of the number of Ladders owned',
		stats: 'Spaaaaaace!',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '55T',
		},
	});
	new Molpy.Boost({
		name: 'Discovery Detector',
		icon: 'discoverydetector',
		className: 'action',
		group: 'bean',
		price:{
			Sand: '2M',
			Castles: '2M',
			GlassBlocks: 100,
		},
		
		desc: function(me) {
			if(!me.bought) return 'Scans your records to see if you have missed discoveries';
			var cost = Molpy.highestNPvisited * Molpy.highestNPvisited * 10;
			if(Molpy.Earned('Minus Worlds')) cost *= 40;
			return '<input type="button" value="Scan" onclick="Molpy.RunDiscoveryDetector()"></input> costs '
				+ Molpify(cost, 2) + ' chips to scan your records to see where you have missed discoveries';
		}
		
	}); // by waveney

	Molpy.RunDiscoveryDetector = function() {
		Molpy.Anything = 1;
		var cost = Molpy.highestNPvisited * Molpy.highestNPvisited * 10;
		if(Molpy.Earned('Minus Worlds')) cost *= 40;
		if(!Molpy.Has('GlassChips', cost)) {
			Molpy.Notify('Sorry you can\'t afford it at the moment');
			return;
		}
		Molpy.Spend('GlassChips', cost);
		
		var miscount = 0;
		var npstart = 1;
		var missing = 0;
		for( var np = 1; np < Math.abs(Molpy.highestNPvisited); np+= 0.5) {
			var alias = 'discov' + np;
			if(Molpy.Badges[alias]) {
				if(Molpy.Earned(alias)) {
					if(miscount) {
						Molpy.Notify('You have missed ' + miscount + ' discover' + (miscount > 1 ? 'ies' : 'y') + ' between NP' + npstart + ' and NP' + np, 1);
						miscount = 0;
					}
					npstart = np;
				} else {
					miscount++;
					missing++;
				}
			}
		}
		if(miscount)
			Molpy.Notify('You have missed ' + miscount + ' discover' + (miscount > 1 ? 'ies' : 'y') + ' since NP' + npstart, 1);
		if(Molpy.Earned('Minus Worlds')) {
			var miscount = 0;
			var npstart = -Math.abs(Molpy.highestNPvisited);
			for( var np = npstart; np < 0; np+= 0.5) {
				var alias = 'discov' + np;
				if(Molpy.Badges[alias]) {
					if(Molpy.Earned(alias)) {
						if(miscount) {
							Molpy.Notify('You have missed ' + miscount + ' discover' + (miscount > 1 ? 'ies' : 'y') + ' between NP' + npstart + ' and NP' + np, 1);
							miscount = 0;
						}
						npstart = np;
					} else {
						miscount++;
						missing++;
					}
				}
			}
			if(miscount)
				Molpy.Notify('You have missed ' + miscount + ' discover' + (miscount > 1 ? 'ies' : 'y') + ' since NP' + npstart, 1);
		}
		if(!missing) Molpy.Notify('You have not missed any discoveries');
	}

	new Molpy.Boost({
		name: 'Achronal Dragon',
		alias: 'AD',
		icon: 'achronaldragon',
		className: 'alert',
		group: 'drac',
		
		desc: function(me) {
			if(!me.bought) return 'In the stats of this boost, you can seek and destroy temporal duplicates';
			if(!me.scanIndex) me.scanIndex = 0;
			if(me.scanIndex >= Molpy.tfOrder.length) {
				me.scanIndex = 0;
			}

			var looped = 0;
			while(isNaN(Molpy.tfOrder[me.scanIndex].amount) || !Molpy.tfOrder[me.scanIndex].temp) {
				me.scanIndex++;
				if(me.scanIndex >= Molpy.tfOrder.length) {
					me.scanIndex = 0;
					if(looped) break;
					looped = 1;
				}
			}

			var str = 'Temporal Duplicate Scan Report:';
			var temp = Molpy.tfOrder[me.scanIndex].temp;
			if(temp) {
				str += '<br>' + Molpify(Molpy.tfOrder[me.scanIndex].temp, 3) + ' duplicates of ' + Molpy.tfOrder[me.scanIndex].name;
				str += '<br><input type="button" value="Destroy" onclick="Molpy.tfOrder[\'' + me.scanIndex + '\'].destroyTemp()"></input> them all at a cost of '
					+ Molpify(temp * (me.scanIndex % 2 ? 10 : 5), 3) + ' Glass Blocks<br>'
					+ '<input type="button" value="Find Next" onclick="Molpy.Boosts.AD.scanIndex++;Molpy.Boosts.AD.Refresh();"></input>';
			} else {
				str += '<br>Nothing to report.<br><input type="button" value="Rescan" onclick="Molpy.Boosts.AD.scanIndex=0;Molpy.Boosts.AD.Refresh();"></input>';
			}
			return str;
		},
		
		price:{
			Sand: '2Z',
			Castles: '8Z',
			GlassBlocks: '7K',
		},
		logic: 12,
		
		stats: function(me) {
			var target = Molpy.DragonTarget()[0];
			var str = 'Power is ' + Molpify(me.power, 3)
				+ (target ? ' out of  ' + Molpify(target, 3) + '.<br>Destroy more temporal duplicates!' : '');
			return str;
		},
		
		// deactivate if power is Infinite, all tools are Mustard and nothing can be made
		classChange: function() { 
			if (Molpy.DragonTarget()[0] >0) return 'action';
			return (isFinite(Molpy.Boosts['AD'].power) || Molpy.mustardTools < Molpy.SandToolsById.length + Molpy.CastleToolsById.length || Molpy.DragonTarget()[0]) ? 'alert' : ''},
		
		defStuff: 1,
		
	});
	
	Molpy.DragonTarget = function() {
		if(Molpy.Got('TF') && Molpy.Has('Logicat', 1200 / (Molpy.Level('PR') + 1)) && !Molpy.Boosts['Crystal Dragon'].unlocked)
			return [1000, 'Crystal Dragon'];
		if(Molpy.Has('AC', 101) && !Molpy.Boosts['Draft Dragon'].unlocked && Molpy.groupBadgeCounts.monumg > 40)
			return [2e12, 'Draft Dragon'];
		if(Molpy.Has('AC', 300) && !Molpy.Boosts['Dragon Forge'].unlocked)
			return [7e16, 'Dragon Forge'];
		if(Molpy.Has('AC', 404) && !Molpy.Boosts['CDSP'].unlocked)
			return [4.5e20, 'CDSP'];
		if(Molpy.Has('AC', 555) && !Molpy.Boosts['Thunderbird'].unlocked && Molpy.Got('PSOC'))
			return [6e36, 'Thunderbird'];
		if(Molpy.Has('AC', 777) && !Molpy.Boosts['Dragon Foundry'].unlocked && Molpy.Earned('Nope!'))
			return [3e55, 'Dragon Foundry'];
		if(Molpy.Has('AC', 888) && !Molpy.Boosts['ShadwDrgn'].unlocked && Molpy.Got('SGC') && Molpy.Has('LogiPuzzle', 100))
			return [9e96, 'ShadwDrgn'];
		if(Molpy.Has('AC', 1e6) && !Molpy.Boosts['DQ'].unlocked && Molpy.Got('Nest') && Molpy.Has('Bonemeal', 1e10))
			return [Infinity, 'DQ'];
		return [0, ''];
	}
	
	Molpy.CheckDragon = function() {
		var target = Molpy.DragonTarget();
		var me = Molpy.Boosts['AD'];
		if(me.Has(target[0])) {
			me.Spend(target[0]);
			Molpy.UnlockBoost(target[1]);
		}
	}

	new Molpy.Boost({
		name: 'Cold Mould',
		icon: 'coldmould',
		group: 'bean',
		className: 'toggle',
		
		desc: function(me) {

			return (me.IsEnabled ? '' : 'When active, ') + 'Prevents all Mould Making and Filling activities for monuments.'
				+ (me.bought ? '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="' + (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>' : '');
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		price:{
			Sand: '75E',
			Castles: '15E',
			GlassBlocks: '10K',
		},
	});
	new Molpy.Boost({
		name: 'Price Protection',
		icon: 'priceprotection',
		group: 'hpt',
		className: 'toggle',
		
		desc: function(me) {

			return (me.IsEnabled ? '' : 'When active, ') + 'Prevents purchases for '
				+ (me.bought ? Molpify(me.bought) : 4)
				+ 'mNP after Affordable Swedish Home Furniture finishes (unless it starts again).'
				+ (me.bought ? '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="' + (me.IsEnabled ? 'Dea' : 'A')
				+ 'ctivate"></input><br><br><input type="Button" onclick="Molpy.PriceProtectionChange(1)" value="Increase Wait"></input>'
				+ (me.bought > 1 ? '<br><input type="Button" onclick="Molpy.PriceProtectionChange(-1)" value="Decrease Wait"></input>' : '') : '');
		},
		
		buyFunction: function() {
			this.bought = 4;
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		price:{
			Sand: '7500',
			Castles: '1500'
		},
	});
	
	Molpy.PriceProtectionChange = function(n) {
		Molpy.Anything = 1;
		var me = Molpy.Boosts['Price Protection'];
		if(me.bought + n == 0) return;
		me.bought += n;
		me.Refresh();
		_gaq && _gaq.push(['_trackEvent', 'Boost', (n > 0 ? 'Upgrade' : 'Downgrade'), me.name]);
	}
	
	Molpy.ProtectingPrice = function() {
		return !Molpy.Got('ASHF') && Molpy.Boosts['Price Protection'].power > 1;
	}

	new Molpy.Boost({
		name: 'Crystal Dragon',
		icon: 'crystaldragon',
		group: 'drac',
		desc: 'Temporal Duplication makes duplicates of all Glass Tools constructed when it is active.<br>'
			+ 'Temporal Duplication\'s countdown starts at 10mNP.',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '7P'
		},
	});

	Molpy.TDFactor = function(buying) {
		if((buying || Molpy.Got('Crystal Dragon')) && Molpy.Got('TDE')) {
			if(Molpy.Got('Dragon Foundry') && Molpy.Got('GL')) {
				return 2 + Molpy.Boosts['GL'].power / 10000;
			}
			return 2;
		}
		return 1;
	}

	new Molpy.Boost({
		name: 'Friendship is Molpish',
		alias: 'FiM',
		icon: 'fim',
		desc: 'Cuegan\'s Glass production is multiplied by the number of million LaPetites, and Lapetite\'s Glass production is multiplied by the number of million Cuegans. (Or is it Cuegen???)',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '750E',
		},
	});
	new Molpy.Boost({
		name: 'Such Glass',
		icon: 'suchglass',
		group: 'ninj',
		desc: 'Glass production of Buckets is multiplied by a thousandth of the Ninja Stealth level',
		stats: '<div class="magentatext bigtext">Very wow</div><br><div class="cyantext rightjust bigtext">Much ninja</div><br><div class="limetext bigtext">So Bucket</div>',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '8Z',
		},
	});
	new Molpy.Boost({
		name: 'Dragon Forge',
		icon: 'dragonforge',
		group: 'drac',
		className: 'action',
		
		desc: function(me) {
			var str = 'Allows you increase the power of Automata Control using Logicat Levels and Blackprint Pages.';
			if(!me.bought) return str;
			var n = Molpy.Boosts['AC'].power;
			str += '<br>Automata Assemble attempts up to ' + Molpify(n, 2) + ' extra runs.';
			if(!Molpy.Earned('Planck Limit')) {
				var pageCost = n * 10
				var logicatCost = Math.ceil(n / 20);
				if (Molpy.Got('The Fading')) logicatCost *= (1+Math.cos((Math.floor((Date.now()/1000)-900)%3600)*Math.PI/1800))/2;
				if(n < Molpy.Boosts['PC'].power) {
					var mult = 1;
					var strs = [];
					while(Molpy.Has({
						Logicat: mult * logicatCost,
						Blackprints: pageCost * mult
						}) && (mult <= 1e33) && (n > 20 * mult)) {
						strs.push( '<br><input type="Button" value="Increase" onclick="Molpy.ControlAutomata(' + (20 * mult) + ',1)">' +
							'</input> the number of runs by ' + Molpify(20 * mult) + ' at a cost of ' +
							Molpify(logicatCost * mult,2) + ' Logicat Levels and ' + Molpify(pageCost * mult, 2) + ' Blackprint Pages.');
						mult *= 10;
					};
					if (strs.length) str += strs.slice(-3).join('');
					else {
						str += '<br>It will cost ' + Molpify(logicatCost,2) + ' Logicat Levels and ' + Molpify(pageCost, 2)
							+ ' Blackprint Pages to increase this by 20.';
					}
				} else {
					str += '<br>Automata Control cannot be currently upgraded.'
				}
			}
			return str;
		},
		
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '7P',
		},
		
		// deactivate when reached max
		classChange: function() { 
			this.Refresh();
			return (!Molpy.Earned('Planck Limit')) ? 'action' : '';
		}
	});
	new Molpy.Boost({	// bought = highest level bought, power = current level
		name: 'Crouching Dragon, Sleeping Panther',
		alias: 'CDSP',
		icon: 'wisedragon',
		group: 'drac',
		className: 'action',
		
		desc: function(me) {
			var str = 'Allows you to get Panther Poke with more remaining Caged Logicat puzzles.<br>'
				+ 'Currently, Panther Poke is available if you have less than ' + Molpify(Molpy.PokeBar() - 1,1) 
				+ ' Caged Logicat puzzles remaining.';
			if(!me.bought) return str;
			var goatCost = me.power;
			var powerReq = Math.pow(5, me.bought + 12);
			if (me.bought > me.power+1) powerReq = 0;
			if (me.power < 100 || me.power < Molpy.Level('PR')/2) {
				if(Molpy.Has('Goats', goatCost) && Molpy.Boosts['AD'].power >= powerReq) {
					str += '<br><input type="Button" value="Increase" onclick="Molpy.GainDragonWisdom(1)"></input> this by 1 (times the Panther Rush level) at a cost of '
						+ Molpify(powerReq, 3) + ' Achronal Dragon power and ' + Molpify(goatCost, 3) + ' goat' + plural(goatCost) + '.';
				} else {
					str += '<br>Upgrading Logicat Level by 1 will cost ' + Molpify(powerReq, 3)
						+ ' Achronal Dragon power and ' + Molpify(goatCost, 3) + ' goat' + plural(goatCost) + '.';
				}

				if (Molpy.Got('The Fading') && Molpy.Has('Goats',Infinity) && Molpy.Got('Aleph e') && Molpy.Boosts['AD'].power >= powerReq) {
					val = Math.pow(10,Math.floor(Math.log(me.bought)*Math.LOG10E));
					if (!Molpy.Got('GDLP')) val = Math.max(0,Math.min(val,Molpy.Level('PR')/2-me.bought));
					if (val) str += '<br><input type="Button" value="Increase" onclick="Molpy.GainDragonWisdom('+val+')"></input> this by '+Molpify(val)+' (times the Panther Rush level) at a cost of '
							+ 'Infinte Achronal Dragon power and Infinite goats.';
				} 
			}
			goatCost--;
			if(!Molpy.Boosts['No Sell'].power && me.power > 1 && Molpy.Has('Goats',goatCost)) {
				str += '<br><input type=button value=Downgrade onclick="Molpy.GainDragonWisdom(-1)"></input> this by one level'
				str += ' at a cost of ' + Molpify(goatCost, 3) + ' goat' + plural(goatCost) + '.';
			};
			if (Molpy.Earned('Sleeping Dragon, Crouching Panther')) {
				str += '<br><br>Now at ' + ((me.bought == me.power+1 || me.power >= Molpy.Level('PR')/2)?'high':'low') + ' power ('+ Molpify(me.power+1,1) + ')';
				str += '<input type=button value="Switch" onclick="Molpy.Boosts[\'CDSP\'].control()"></input>';
				str += ' this will cost ' + Molpify(me.bought*(me.bought+1)/2) + ' Goats.';
			}
			return str;
		},
		
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '1Z'
		},
		control: function() {
			if (Molpy.Spend('Goats',this.bought*(this.bought+1)/2)) {
				this.power = (this.bought > this.power+1)?this.bought-1:1;
				this.Refresh();
			}
		},
	});
	
	Molpy.GainDragonWisdom = function(n) {
		Molpy.Anything = 1;
		var me = Molpy.Boosts['CDSP'];
		if (n > 0) {
			var goatCost = (n == 1?me.power:Infinity);
			var powerReq = Math.pow(5, me.power + 12);
			if (me.bought > me.power +1+n) powerReq = 0;
			if(Molpy.Has('Goats', goatCost) && Molpy.Boosts['AD'].power >= powerReq) {
				Molpy.Spend('Goats', goatCost);
				Molpy.Boosts['AD'].power -= powerReq;
				Molpy.Notify('Dragon Wisdom gained!'); // it was so tempting to write gainned :P
				if (n==1) {
					me.power+=n;
					me.bought = Math.max(me.bought,me.power+1);
				} else {
					me.power = me.bought+n;
					me.bought = me.power+1;
					Molpy.LockBoost('GDLP');
				};
				_gaq && _gaq.push(['_trackEvent', 'Boost', 'Dragon Upgrade', 'Logicat']);
				if (me.power>444 && Molpy.Got('Mustard Sale')) Molpy.UnlockBoost('Cress');
				if (me.power>468) Molpy.EarnBadge('Sleeping Dragon, Crouching Panther');
				if (me.power>=1024) Molpy.UnlockBoost('The Fading');
				if (me.power>=1e6) Molpy.UnlockBoost('Loopin Looie');
				if (me.power>=1e9) Molpy.UnlockBoost('Panthers Dream');
			}
		} else if (Molpy.Spend('Goats', me.power-1)) {	
			me.bought += n;
			Molpy.Notify('Dragon Wisdom lost!'); 
		};
		me.Refresh();
	}

	new Molpy.Boost({
		name: 'Fireproof',
		icon: 'fireproof',
		group: 'cyb',
		desc: function() { 
			return 'The NewPixBots have become immune to fire. Bored of destroying infinite castles, they now make ' + Molpify(1e10) + ' times as many Glass Chips.<br>'
			+ 'However they will destroy all your castles every mNP if the Navigation Code hack is not installed.<br>'
			+ 'On the plus side, you can overcome Jamming far quicker.';
		},
	
		price:{	
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: function() {
				return 8e9 * Molpy.CastleTools['NewPixBot'].amount;
			},
		},

		buyFunction: function() {
			if (Molpy.Got('Jamming')) Molpy.Boosts['Jamming'].countdown = 20;

		},
	}); // www.youtube.com/watch?v=84q0SXW781c
	new Molpy.Boost({
		name: 'Ninja Ninja Duck',
		icon: 'ninjaduck',
		group: 'ninj',
		desc: 'Ninja Stealth is raised by 10x as much',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '230Z'
		},
	});
	new Molpy.Boost({
		name: 'Goats',
		single: 'Goat',
		plural: 'Goats',
		icon: 'goat',
		group: 'stuff',
		
		desc: function(me) {
			var str = 'You have ' + Molpify(me.Level, 3) + ' goat' + plural(me.Level) + '. Yay!';
			return str;
		},

		AddSuper: Molpy.BoostFuncs.Add,
		Add: function(amount) {
			this.AddSuper(amount);
			if (!isFinite(this.Level)) {
				Molpy.UnlockBoost('RDKM');
				Molpy.Boosts['CDSP'].Refresh();
			};
		},
		
		
		defStuff: 1
	});
	new Molpy.Boost({
		name: 'Silver Loyalty Card',
		alias: 'SilverCard',
		icon: 'silvercard',
		group: 'hpt',
		desc: 'Affordable Swedish Home Furniture discount increased to 50% off',
		price:{ Sand: '1G' }
	});
	new Molpy.Boost({
		name: 'Gold Loyalty Card',
		alias: 'GoldCard',
		icon: 'goldcard',
		group: 'hpt',
		desc: 'Affordable Swedish Home Furniture discount increased to 60% off',
		price:{ Sand: '10T' }
	});
	new Molpy.Boost({
		name: 'Stretchable Chip Storage',
		icon: 'strechablechipstorage',
		group: 'hpt',
		className: 'toggle',
		
		desc: function(me) {
			return 'If active during a Blast Furnace run and there is not enough chip storage, that run is used to expand the chip storage instead' + (me.bought ? '<br>'
					+ '<input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="' + (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input><br>' : '');
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		
		buyFunction: function() {
			this.IsEnabled = 1
		},
		
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '1M'
		},
	});
	new Molpy.Boost({
		name: 'Stretchable Block Storage',
		icon: 'strechableblockstorage',
		group: 'hpt',
		className: 'toggle',
		
		desc: function(me) {
			return 'If active during a Blast Furnace run and there is not enough block storage, that run is used to expand the block storage instead' + (me.bought ? '<br>'
					+ '<input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="' + (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input><br>' : '');
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		
		buyFunction: function() {
			this.IsEnabled = 1
		},
		
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '1M'
		},
	});

	Molpy.GenericToggle = function(myid, negate) {
		Molpy.Anything = 1;
		var me = Molpy.BoostsById[myid];
		if(negate)
			me.power = -me.power || 1;
		else
			me.power = 1 * !me.power;
		me.Refresh();
		if(myid <= 6) Molpy.Boosts['Rob'].Refresh();
		if(me.AfterToggle) me.AfterToggle();
		_gaq && _gaq.push(['_trackEvent', 'Boost', 'Toggle', me.name]);
	}

	new Molpy.Boost({
		name: 'Hall of Mirrors',
		alias: 'HoM',
		icon: 'hallofmirrors',
		className: 'toggle',
		
		desc: function(me) {
			return (me.IsEnabled ? 'Y' : 'When active, y')
				+ 'ou can win/lose Glass Chips from the Monty Haul Problem. (Also causes MHP to cost glass.)'
				+ (me.bought ? '<br><input type="Button" onclick="if(Molpy.Spend(\'Goats\',1))Molpy.GenericToggle(' + me.id + ',1)" value="'
				+ (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input> (costs 1 Goat to toggle)' : '');
		},
		
		buyFunction: function() {
			this.IsEnabled = 1;
		},
		
		IsEnabled: Molpy.BoostFuncs.PosPowEnabled,
		price:{
			Sand: '1P',
			Castles: '1T',
			GlassBlocks: '1K'
		},
	});
	new Molpy.Boost({
		name: 'Stealth Cam',
		icon: 'stealthcam',
		group: 'ninj',
		desc: 'Camera is activated when Ninja Stealth is increased',
		price:{ GlassBlocks: '1M' }
	});
	new Molpy.Boost({
		name: 'Ninja Lockdown',
		icon: 'ninjalockdown',
		group: 'ninj',
		className: 'toggle',
		
		desc: function(me) {
			return (me.IsEnabled ? '' : 'When active, ')
				+ 'Prevents Ninja Stealth multipliers greater than 3x, and when toggled, locks Impervious Ninja if it is owned.'
				+ (me.bought ? '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id
				+ '); Molpy.LockBoost(\'Impervious Ninja\');" value="' + (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>' : '');
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		price:{ GlassBlocks: '144Y' },
		logic: 700
	});
	new Molpy.Boost({
		name: 'Magic Mirror',
		icon: 'magicmirror',
		group: 'chron',
		desc: 'Allows jumps between every discovery and the equivalent place in the Minus World',
		price:{ GlassBlocks: '1L' }
	});
	new Molpy.Boost({
		name: 'Locked Vault',
		icon: 'lockedvault',
		className: 'action',
		
		desc: function(me) {
			var str = '';
			if (me.bought) str += (5 - me.bought) + ' lock' + plural(5 - me.bought) + ' left to grab the loot!'
			else str += 'Contains Loot';
			if (me.power > 11) str += '<p>You have opened ' + Molpify(me.power-10) + ' Vaults';
			return str;
		},
		
		price: {
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '150M'
		},
		
		logic: 5,

		lockFunction: function() {
			if(!this.power) this.power = 10;
			var pages = this.power++;
			if(Molpy.Got('VV')) pages = Molpy.VoidStare(pages, 'VV');
			Molpy.Add('Blackprints', Math.floor(pages*Molpy.Papal('BlackP')));
			if(Molpy.Got('Camera') && (Math.random() < 0.1) ) {
				Molpy.EarnBadge('discov' + Math.ceil(Molpy.newpixNumber * Math.random()));
			}
			if(Molpy.Got('FluxCrystals')&&(Molpy.Got('Temporal Rift')||Molpy.Got('Flux Surge'))){
				var c = Math.floor(Molpy.Level('AC') / 1000) * (1 + Molpy.Got('TDE'));
				if (c && !Molpy.boostSilence) 
					Molpy.Notify('You found '+Molpify(c)+' flux crystal'+plural(c)+'.');
				Molpy.Add('FluxCrystals',Math.floor(Molpy.Level('AC')/1000)*(1+Molpy.Got('TDE')));
			}
		}
	});
	new Molpy.Boost({
		name: 'Vault Key',
		icon: 'vaultkey',
		desc: 'Helps open a locked vault',
		price:{ GlassBlocks: '5M' },
		
		buyFunction: function() {
			Molpy.LockBoost(this.alias);
			var lv = Molpy.Boosts['Locked Vault'];
			if(!lv.unlocked) {
				Molpy.UnlockBoost(lv.alias);
			}
			lv.buy(1);
			if(lv.bought) {
				lv.bought++;
				if(lv.bought < 5) {
					if(!Molpy.boostSilence) Molpy.Notify('One less lock on the vault');
				} else
					Molpy.LockBoost(lv.alias);
			} else {
				lv.buy(1);
				if(!lv.bought && !Molpy.boostSilence) {
					Molpy.Notify('Locked Vault is not affordable.');
				}
			}
		}
	});
	new Molpy.Boost({
		name: 'People Sit on Chairs',
		alias: 'PSOC',
		icon: 'psoc',
		desc: 'Multiplies <b>all</b> rates by 1, then adds 0',
		stats: 'Administrivia',
		logic: 420
	});
	new Molpy.Boost({
		name: 'No Need to be Neat',
		icon: 'noneedtobeneat',
		desc: 'When you Molpy Down, the amount of one random type of tool is not reset to 0',
		price:{ GlassBlocks: '50M' }
	});
	new Molpy.Boost({
		name: 'Thunderbird',
		icon: 'thunderbird',
		group: 'drac',
		desc: 'If Glassed Lightning (with Lightning Rod) strikes during Temporal Duplication, its power is increased by 50%',
		price:{ GlassBlocks: '50W' }
	});
	new Molpy.Boost({
		name: 'Dragon Foundry',
		icon: 'dragonfoundry',
		group: 'drac',
		desc: 'Crystal Dragon\'s effect is multiplied by 1% of Glassed Lightning',
		stats: 'Remember to power up Glassed Lightning with Thunderbird, or else this will have a detrimental effect on Temporal Duplication!',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '70WW'
		},
	});
	new Molpy.Boost({
		name: 'Lucky Twin',
		icon: 'luckytwin',
		desc: 'When you are awarded Not Lucky during Temporal Duplication, the countdown is increased by 20%',
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '70H'
		},
	});
	new Molpy.Boost({
		name: 'Beret Guy',
		icon: 'beretguy',
		desc: 'You may choose to take a revealed Goat',
		stats: '...and my yard has so much grass, and I\'ll teach you tricks, and...',
		price:{ GlassBlocks: '20T' }
	});
	new Molpy.Boost({
		name: 'Crystal Flux Turbine',
		alias: 'CFT',
		icon: 'crystalfluxturbine',
		group: 'chron',
		desc: 'The Flux Turbine bonus is applied to Glass Sand Tools',
		price:{ GlassBlocks: '6.05GW' }
	});
	new Molpy.Boost({
		name: 'Shadow Dragon',
		alias: 'ShadwDrgn',
		icon: 'shadowdragon',
		group: 'drac',
		className: 'action',
		
		desc: function(me) {
			var str = 'Puts unused Caged Logicat puzzles to some use.';
			if(!me.bought) return str;
			if(Molpy.Got('LogiPuzzle') && Molpy.Has('LogiPuzzle', 100)) {
				str += '<br><input type="Button" value="Deal" onclick="Molpy.ShadowStrike(1)"></input> with the Caged Logicat infestation...';
			} else {
				str += '<br>A minimum level of 100 Caged Logicat puzzles is required to use Shadow Dragon.';
			}
			return str;
		},
		
		price:{ GlassBlocks: '12WW' },
		
		// deactivate if not enough logicats
		classChange: function() { return ((Molpy.Level('AC') > 2000) || (Molpy.Got('LogiPuzzle') && Molpy.Has('LogiPuzzle', 100))) ? 'action' : '' },
	});
	
	Molpy.ShadowStrike = function() {
		Molpy.Anything = 1;
		var l = Molpy.Level('LogiPuzzle') / 100;
		var n = Math.ceil(l);
		var p = n - l;
		if (n < 1000000) {
			if(Math.random() < p * p) n = 1;
		} else {
			if (Math.random() < 0.25) n = 1;
		}
		if (n>1 && Molpy.Got('Panthers Dream')) n*=Molpy.Boosts['CDSP'].power;
		if (!Molpy.boostSilence) Molpy.Notify('The Shadow Dragon was ' + (n == 1 ? 'greedy' : 'generous') + ' and turned ' + Molpify(Molpy.Level('LogiPuzzle')) + ' Caged Logicat puzzles into ' + Molpify(n) + ' Bonemeal.', 1);
		Molpy.Add('Bonemeal', Math.floor(n*Molpy.Papal('Bonemeal')));
		Molpy.Spend('LogiPuzzle', Molpy.Level('LogiPuzzle'));
		if (n >= 10) Molpy.UnlockBoost('Shadow Feeder');
	}

	Molpy.spendSandNotifyFlag = 1;
	Molpy.spendSandNotifyCount = 0;
	
	new Molpy.Boost({
		name: 'Sand',
		plural: 'Sand',
		icon: 'sand',
		group: 'stuff',
		unlocked: 1,
		bought: 1,
		
		Level: [
				function() {
					return this.power;
				},
				function(amount) {
					if(isNaN(amount)) {
						amount = 0;
						Molpy.EarnBadge('Mustard Cleanup');
					}
					this.power = amount;
					this.Refresh();
				}
		],
		
		Add: function(amount) {
			Molpy.Boosts['Sand'].dig(amount);
		},
		
		Spend: function(amount, silent) {
			if(Molpy.IsEnabled('Aleph One') && !isNaN(this.Level)) amount = 0;
			if(!isFinite(Molpy.Boosts['Sand'].sandPermNP) && Molpy.IsEnabled('Cracks')) amount = 0;
			if(!amount) return 1;
			this.power -= amount;
			if(this.power < 0) this.power = 0;
			this['spent'] += amount;
			if((isFinite(this.power) || !isFinite(amount))) {
				if(!Molpy.boostSilence && !silent && Molpy.spendSandNotifyFlag) {
					if(Molpy.spendSandNotifyCount) {
						amount += Molpy.spendSandNotifyCount;
						Molpy.spendSandNotifyCount = 0;
					}
					if(amount) {
						if(amount >= this.power / 10000000)
							Molpy.Notify('Spent Sand: ' + Molpify(amount, 3), 1);
						else {
							Molpy.spendSandNotifyCount += amount;
							return 1;
						}
					}
				} else {
					Molpy.spendSandNotifyCount += amount;
					return 1;
				}
			}
		},
		spent: 0,
		Has: function(amount) {
			if(Molpy.IsEnabled('Aleph One') && !isNaN(this.Level)) return 1;
			if(!isFinite(Molpy.Boosts['Sand'].sandPermNP) && Molpy.IsEnabled('Cracks')) return 1;
			return(this.HasSuper(amount));
		},
		
		HasSuper: Molpy.BoostFuncs.Has,
		
		desc: function(me) {
			return Molpify(me.Level, 3);
		},
		
		calculateSandPerClick: function(multiplier) {
			multiplier = multiplier || 1;
			var baserate = 1 + Molpy.Got('Bigger Buckets') * 0.1;
			var mult = 1;
			if(Molpy.Got('Huge Buckets')) mult *= 2;
			if(Molpy.Got('Buccaneer')) mult *= 2;
			baserate *= mult;
			if(Molpy.Got('Helpful Hands')) {
				var pairs = Math.min(Molpy.SandTools['Bucket'].amount, Molpy.SandTools['Cuegan'].amount);
				baserate += 0.5 * pairs || 0;
			}
			if(Molpy.Got('True Colours')) {
				var pairs = Math.min(Molpy.SandTools['Flag'].amount, Molpy.SandTools['Cuegan'].amount);
				baserate += 5 * pairs || 0;
			}
			if(Molpy.Got('Raise the Flag')) {
				var pairs = Math.min(Molpy.SandTools['Flag'].amount, Molpy.SandTools['Ladder'].amount);
				baserate += 50 * pairs || 0;
			}
			if(Molpy.Got('Hand it Up')) {
				var pairs = Math.min(Molpy.SandTools['Bag'].amount, Molpy.SandTools['Ladder'].amount);
				baserate += 500 * pairs || 0;
			}
			if(Molpy.Got('Bucket Brigade')) {
				baserate += this.sandPermNP * 0.01 * Math.floor(Molpy.SandTools['Bucket'].amount / 50) || 0;
			}

			if(Molpy.Got('Bag Puns')) {
				baserate += baserate * (4 / 10) * Math.max(-2, Math.floor((Molpy.SandTools['Bag'].amount - 25) / 5)) || 0;
			}
			if(Molpy.Got('Bone Clicker') && Molpy.Has('Bonemeal', 1)) {
				baserate *= Molpy.Level('Bonemeal');
			}
			this.sandPerClick = baserate * multiplier;
			if(!isFinite(this.sandPerClick) || !isFinite(this.power)) this.sandPerClick = 0; //you can't dig infinite sand
		},
		
		calculateSandPermNP: function(multiplier, oldrate) {
			multiplier = multiplier || 1;
			oldrate = oldrate || this.sandPermNP;
			
			if(Molpy.Got('Overcompensating') && Molpy.NPlength > 1800) {
				multiplier += Molpy.Boosts['Overcompensating'].power;
			}

			if(Molpy.Got('Facebugs')) {
				multiplier += 0.1 * Molpy.BadgesOwned;
			}
			
			multiplier *= Molpy.BBC();
			var glassUse = Molpy.CalcGlassUse();
			multiplier *= Math.max(0, ((100 - glassUse) / 100));
			if (Molpy.Got('Hugo')) multiplier *= 1.1;
			Molpy.globalSpmNPMult = multiplier;
			this.sandPermNP *= Molpy.globalSpmNPMult;
			if(isNaN(this.sandPermNP)) {
				this.sandPermNP = 0;
			}
			if(Molpy.globalSpmNPMult == 0 && oldrate != 0) {
				Molpy.Notify('Looks like all the sand you dig is being used to make glass', 1);
			}

			if(this.sandPermNP > oldrate) this.checkSandRateBadges();
		},
		
		calculateSandRates: function() {
			var oldrate = this.sandPermNP;
			this.sandPermNP = 0;
			var multiplier = 1;
			
			for( var i in Molpy.SandTools) {
				var tool = Molpy.SandTools[i];
				tool.storedSpmNP = EvalMaybeFunction(tool.spmNP, tool) || 0;
				tool.storedTotalSpmNP = isFinite(tool.amount) ? tool.amount * tool.storedSpmNP : Infinity;
				this.sandPermNP += tool.storedTotalSpmNP || 0;
			}
			
			if(Molpy.Got('Molpies'))//molpy molpy molpy molpy molpy
			{
				multiplier += 0.01 * Molpy.BadgesOwned;
			}
			if(Molpy.Got('Grapevine'))//grapevine
			{
				multiplier += 0.02 * Molpy.BadgesOwned;
			}
			if(Molpy.Got('Ch*rpies')) {
				multiplier += 0.05 * Molpy.BadgesOwned;
			}
			if(Molpy.Got('Blitzing')) {
				multiplier *= Molpy.Boosts['Blitzing'].power / 100;
			}
			
			this.calculateSandPerClick(multiplier);
			this.calculateSandPermNP(multiplier, oldrate);
		},
		
		checkSandRateBadges: function() {
			var sr = this.sandPermNP;
			if(sr >= 0.1) Molpy.EarnBadge('A light dusting');
			if(sr >= 0.8) Molpy.EarnBadge('Sprinkle');
			if(sr >= 6) Molpy.EarnBadge('Trickle');
			if(sr >= 25) Molpy.EarnBadge('Pouring it on');
			if(sr >= 100) Molpy.EarnBadge('Hundred Year Storm');
			if(sr >= 400) Molpy.EarnBadge('Thundering Typhoon!');
			if(sr >= 1600) Molpy.EarnBadge('Sandblaster');
			if(sr >= 7500) Molpy.EarnBadge('Where is all this coming from?');
			if(sr >= 30000) Molpy.EarnBadge('Seaish Sandstorm');
			if(sr >= 500500) Molpy.EarnBadge('WHOOSH');
			if(sr >= 2222222) Molpy.EarnBadge('We want some two!');
			if(sr >= 10101010) Molpy.EarnBadge('Bittorrent');
			if(sr >= 299792458) Molpy.EarnBadge('WARP SPEEEED');
			if(sr >= 8888888888.8) Molpy.EarnBadge('Maxed out the display');
		},
		
		previousSand: 0,
		
		dig: function(amount) {
			var newSand = this.power;
			var oldSand = newSand;
			if(!isFinite(newSand)) amount = 0; //because why bother?
			if(!this.unlocked) this.unlocked = 1;
			this.totalDug += amount;
			newSand += amount;
			if(isNaN(this.totalDug)) this.totalDug = 0;

			var gap = Math.ceil(newSand) - newSand;
			if(gap && gap < Molpy.floatEpsilon) {
				newSand = Math.ceil(newSand);
				this.totalDug = Math.ceil(this.totalDug);
				Molpy.EarnBadge('Clerical Error');
			}
			if(isFinite(this.previousSand) != isFinite(newSand) || isFinite(oldSand) != isFinite(newSand))
				Molpy.RatesRecalculate();
			
			this.previousSand = newSand;
			this.power = newSand;
			
			this.toCastles();

			if(newSand >= 10) {
				Molpy.UnlockBoost('Hugo');
			}
			if(newSand >= 50) {
				Molpy.EarnBadge('Barn');
			}
			if(newSand >= 200) {
				Molpy.EarnBadge('Storehouse');
			}
			if(newSand >= 500) {
				Molpy.EarnBadge('Bigger Barn');
			}
			if(newSand >= 8000) {
				Molpy.EarnBadge('Warehouse');
			}
			if(newSand >= 300000) {
				Molpy.EarnBadge('Sand Silo');
			}
			if(newSand >= 7000000) {
				Molpy.EarnBadge('Silicon Valley');
			}
			if(newSand >= 80000000) {
				Molpy.EarnBadge('Glass Factory');
				Molpy.UnlockBoost('Glass Furnace');
			}
			if(newSand >= 420000000) {
				Molpy.EarnBadge('Seaish Sands');
			}
			if(newSand >= 123456789) {
				Molpy.EarnBadge('You can do what you want');
			}
			if(newSand >= 782222222144) {
				Molpy.EarnBadge('Store ALL of the sand');
			}
			
			if(this.totalDug >= 5000) Molpy.UnlockBoost('Molpies');
		},
		
		clickBeach: function() {
			this.dig(this.sandPerClick);
			Molpy.Boosts['Sand'].manualDug += this.sandPerClick;
			
			if(this.sandPerClick && Molpy.options.numbers) Molpy.AddSandParticle('+' + Molpify(this.sandPerClick, 1));
			
			if(isNaN(Molpy.Boosts['Sand'].manualDug)) Molpy.Boosts['Sand'].manualDug = 0;
		},
		
		toCastles: function() {
			Molpy.Boosts['Castles'].buildNotifyFlag = 0;
			while(this.power >= Molpy.Boosts['Castles'].nextCastleSand && isFinite(Molpy.Boosts['Castles'].power)) {
				if(Molpy.Got('Fractal Sandcastles')) {
					var m = 1.35;
					if(Molpy.Got('Fractal Fractals')) m = 1.5;
					Molpy.Boosts['Castles'].build(Math.floor(Math.pow(m, Molpy.Boosts['Fractal Sandcastles'].power*Molpy.Papal('Fractal'))));
					Molpy.Boosts['Fractal Sandcastles'].power++;
					if(Molpy.Boosts['Fractal Sandcastles'].power >= 60) {
						Molpy.EarnBadge('Fractals Forever');
					}
				} else {
					Molpy.Boosts['Castles'].build(1);
				}
				this.power -= Molpy.Boosts['Castles'].nextCastleSand;
				Molpy.currentCastleSand = Molpy.Boosts['Castles'].nextCastleSand;
				//In which Fibbonacci occurs:
				Molpy.Boosts['Castles'].nextCastleSand = Molpy.Boosts['Castles'].prevCastleSand + Molpy.currentCastleSand;
				if(Molpy.Boosts['Castles'].nextCastleSand > 80) Molpy.EarnBadge('Getting Expensive');
				Molpy.Boosts['Castles'].prevCastleSand = Molpy.currentCastleSand;
				if(!isFinite(this.power) || Molpy.Boosts['Castles'].nextCastleSand <= 0) {
					Molpy.Boosts['Castles'].nextCastleSand = 1;
					Molpy.Boosts['Castles'].build(Infinity, 0);
					return;
				}
			}
			Molpy.Boosts['Castles'].buildNotifyFlag = 1;
			Molpy.Boosts['Castles'].build(0);
			
			Molpy.mustardCleanup();
		},
		
		sandPermNP: 0, // Sand per milliNewPix (recaculated when stuff is bought)
		sandPerClick: 1,
		
		// Saved Special Properties
		totalDug: 0, // Total sand dug throughout the game
		spent: 0, // Sand spent in shop
		manualDug: 0, // Total sand dug through user clicks
		
		defSave: 1,
		saveData: {
			4:['totalDug', 0, 'float'],
			5:['spent', 0, 'float'],
			6:['manualDug', 0, 'float'],
		},
		
		loadFunction: function() {
			this.unlocked = 1;
			this.bought = 1;
			Molpy.unlockedGroups['stuff'] = 1;
		}
	});

	Molpy.destroyNotifyFlag = 1;
	Molpy.destroyNotifyCount = 0;
	
	new Molpy.Boost({
		name: 'Castles',
		single: 'Castle',
		icon: 'castles',
		group: 'stuff',
		unlocked: 1,
		bought: 1,
		
		Level: [
				function() {
					return this.power;
				},
				function(amount) {
					if(isNaN(amount)) {
						amount = 0;
						Molpy.EarnBadge('Mustard Cleanup');
					}
					this.power = amount;
					this.Refresh();
					Molpy.Boosts['Time Travel'].Refresh();
				}
		],
		
		Add: function(amount, refund){
			refund = refund || 0;
			Molpy.Boosts['Castles'].build(amount,refund);
		},
		
		Spend: function(amount, silent) {
			var ret=1;
			if(Molpy.IsEnabled('Aleph One') && !isNaN(this.Level)) amount = 0;
			if(!isFinite(Molpy.Boosts['Sand'].sandPermNP) && Molpy.IsEnabled('Cracks')) amount = 0;
			if(!amount) return 1;
			if (amount > this.power) {
				amount = Math.min(amount, this.power);
				ret = 0;
			}
			this.power -= amount;
			this['spent'] += amount;
			Molpy.mustardCleanup();
			if(!Molpy.boostSilence && !silent && (isFinite(this.power) || !isFinite(amount)))
				Molpy.Notify('Spent Castles: ' + Molpify(amount, 3), 1);
			return ret;
		},
		
		spent: 0,
		// destroying is done by trebuchets and stuff: it's different to spending
		Destroy: function(amount, logsilent) {
			amount = Math.min(amount, this.power);
			this.power -= amount;
			this.totalDestroyed += amount;
			if(Molpy.destroyNotifyFlag) {
				if(Molpy.destroyNotifyCount) {
					amount += Molpy.destroyNotifyCount;
					Molpy.destroyNotifyCount = 0;
				}
				if(amount) {
					if(amount >= this.power / 10000000)
						Molpy.Notify(amount == 1 ? '-1 Castle' : Molpify(amount, 3) + ' Castles Destroyed', !logsilent);
					else {
						Molpy.destroyNotifyCount += amount;
						return 1;
					}
				}
			} else {
				Molpy.destroyNotifyCount += amount;
				return 1;
			}
		},
		
		Has: function(amount) {
			if(Molpy.IsEnabled('Aleph One') && !isNaN(this.Level)) return 1;
			if(!isFinite(Molpy.Boosts['Sand'].sandPermNP) && Molpy.IsEnabled('Cracks')) return 1;
			return(this.HasSuper(amount));
		},
		
		HasSuper: Molpy.BoostFuncs.Has,
		
		desc: function(me) {
			return Molpify(me.Level, 3);
		},
		
		buildNotifyFlag: 1,
		buildNotifyCount: 0,
		build: function(amount, refund) {
			if(!isFinite(this.power)) {
				amount = 0; //no point in adding any more
			}
			if(!refund && amount)//don't multiply if amount is 0
			{
				amount = Math.round(amount * this.globalMult) || 0;
			}
			amount = Math.max(0, amount);
			if(!this.unlocked) this.unlocked = 1; //quick fix for the castles built not loading.
			this.totalBuilt += amount;
			this.power += amount;
			if(amount && !isFinite(this.power)) Molpy.RatesRecalculate();

			if(this.buildNotifyFlag) {
				if(this.buildNotifyCount) {
					amount += this.buildNotifyCount;
					this.buildNotifyCount = 0;
				}
				if(amount) {
					if(amount >= this.power / 10000000)
						Molpy.Notify(amount == 1 ? '+1 Castle' : Molpify(amount, 3) + ' Castles Built', 1);
					else
					{
						this.buildNotifyCount += amount;
						if (!isFinite(this.buildNotifyCount)) this.buildNotifyCount=0;
					}
				}
			} else {
				this.buildNotifyCount += amount;
				if (!isFinite(this.buildNotifyCount)) this.buildNotifyCount=0;
			}

			if(this.totalBuilt >= 1) {
				Molpy.EarnBadge('Rook');
			}
			if(this.totalBuilt >= 4) {
				Molpy.EarnBadge('Enough for Chess');
			}
			if(this.totalBuilt >= 40) {
				Molpy.EarnBadge('Fortified');
			}
			if(this.totalBuilt >= 320) {
				Molpy.EarnBadge('All Along the Watchtower');
			}
			if(this.totalBuilt >= 1000) {
				Molpy.EarnBadge('Megopolis');
			}
			if(this.totalBuilt >= 100000) {
				Molpy.EarnBadge('Kingdom');
			}
			if(this.totalBuilt >= 10000000) {
				Molpy.EarnBadge('Empire');
			}
			if(this.totalBuilt >= 1000000000) {
				Molpy.EarnBadge('Reign of Terror');
			}
			if(this.totalBuilt >= 2000000000000) {
				Molpy.EarnBadge('Unreachable?');
			}

			if(Molpy.Has('Castles', 1000)) {
				Molpy.EarnBadge('We Need a Bigger Beach');
			}
			if(Molpy.Has('Castles', 1000000)) {
				Molpy.EarnBadge('Castle Nation');
			}
			if(Molpy.Has('Castles', 1000000000)) {
				Molpy.EarnBadge('Castle Planet');
			}
			if(Molpy.Has('Castles', 1000000000000)) {
				Molpy.EarnBadge('Castle Star');
			}
			if(Molpy.Has('Castles', 8888000000000000)) {
				Molpy.EarnBadge('Castle Galaxy');
			}
			if(Molpy.Has('Castles', DeMolpify('1P'))) {
				Molpy.EarnBadge('People Eating Tasty Animals');
			}
			if(Molpy.Has('Castles', DeMolpify('20P'))) {
				Molpy.UnlockBoost('Free Advice');
			}
			if(Molpy.Has('Castles', DeMolpify('1Y'))) {
				Molpy.EarnBadge('Y U NO RUN OUT OF SPACE?');
			}
			if(Molpy.Has('Castles', DeMolpify('1U'))) {
				Molpy.EarnBadge('Dumpty');
			}
			if(Molpy.Has('Castles', DeMolpify('1S'))) {
				Molpy.EarnBadge('This is a silly number');
			}
			if(Molpy.Has('Castles', DeMolpify('1H'))) {
				Molpy.EarnBadge('To Da Choppah');
			}
			if(Molpy.Has('Castles', DeMolpify('1F'))) {
				Molpy.EarnBadge('Toasters');
			}
			if(Molpy.Has('Castles', DeMolpify('1W'))) {
				Molpy.EarnBadge('Dubya');
			}
			if(Molpy.Has('Castles', DeMolpify('1WW'))) {
				Molpy.EarnBadge('Rub a Dub Dub');
			}
			if(Molpy.Has('Castles', DeMolpify('1WWW'))) {
				Molpy.EarnBadge('WWW');
			}
			if(Molpy.Has('Castles', DeMolpify('1WWWW'))) {
				Molpy.EarnBadge('Age of Empires');
			}
			if(Molpy.Has('Castles', DeMolpify('1Q'))) {
				Molpy.EarnBadge('Queue');
			}
			if(Molpy.Has('Castles', DeMolpify('1WQ'))) {
				Molpy.EarnBadge('What Queue');
			}
			if(!isFinite(this.power) && !isFinite(Molpy.Boosts['Sand'].power)) {
				Molpy.EarnBadge('Everything but the Kitchen Windows');
			}
			Molpy.Boosts['Time Travel'].Refresh();
		},
		
		globalMult: 1,
		
		calculateGlobalMult: function() {
			if(Molpy.Got('Flux Turbine')) {
				if(!isFinite(this.totalDown)) {
					this.totalDown = Number.MAX_VALUE;
				}
				var fluxLevel = Math.log(this.totalDown);
				if(Molpy.Got('Flux Surge')) {
					fluxLevel *= 1.5;
				}
				var oldMult = this.globalMult;
				this.globalMult = Math.max(1, Math.pow(1.02, fluxLevel));
				if(oldMult != this.globalMult) Molpy.Boosts['Flux Turbine'].Refresh();
			} else {
				this.globalMult = 1;
			}
		},
		
		// Saved Special Properties
		totalBuilt: 0, // Total built throughout game (power is current not total)
		totalDestroyed: 0, // Total castles destroyed by other structures throughout the game
		totalDown: 0, // Cumulative castles built and then wiped by Molpy Down throughout all games
		spent: 0, // Castles spent in shop
		prevCastleSand: 0,
		nextCastleSand: 1,
		
		defSave: 1,
		saveData: {
			4:['totalBuilt', 0, 'float'],
			5:['totalDestroyed', 0, 'float'],
			6:['totalDown', 0, 'float'],
			7:['spent', 0, 'float'],
			8:['prevCastleSand', 0, 'float'],
			9:['nextCastleSand', 1, 'float'],
		},
		
		loadFunction: function() {
			this.unlocked = 1;
			this.bought = 1;
			Molpy.unlockedGroups['stuff'] = 1;
		}
		
	});
	
	Molpy.mustardCleanup = function() {
		if(isNaN(Molpy.Boosts['Sand'].power)) {
			Molpy.Boosts['Sand'].power = 0;
			Molpy.EarnBadge('Mustard Cleanup');
		}
		if(isNaN(Molpy.Boosts['Sand'].totalDug)) {
			Molpy.Boosts['Sand'].totalDug = 0;
			Molpy.EarnBadge('Mustard Cleanup');
		}
		if(isNaN(Molpy.Boosts['Castles'].power)) {
			Molpy.Boosts['Castles'].power = 0;
			Molpy.EarnBadge('Mustard Cleanup');
		}
		if(isNaN(Molpy.Boosts['Castles'].totalBuilt)) {
			Molpy.Boosts['Castles'].totalBuilt = 0;
			Molpy.EarnBadge('Mustard Cleanup');
		}
	}

	Molpy.AwardPrize = function(l) {
		Molpy.Anything = 1;
		l = l || 0;
		if(l >= Molpy.prizes.length) return;
		var availRewards = [];
		for( var i in Molpy.prizes[l]) {
			var d = Molpy.Boosts[Molpy.prizes[l][i]];
			if(!d.unlocked) availRewards.push(d);
		}
		if(availRewards.length > 0) {
			Molpy.UnlockBoost(GLRschoice(availRewards).alias);
		} else {
			Molpy.AwardPrize(l + 1);
		}
	}

	Molpy.TierFunction = function(tier, cost) {
		return function(use) {
			if(use == 'low') return tier;
			if(use == 'high') return tier + 1;
			if(use == 'show')
				return Molpify(tier) + ' or tier L' + Molpify(tier + 1) + ' at a cost of ' + Molpy.PriceString(cost);
			if(use == 'spend') return tier + Molpy.Spend(cost);
			return tier + Molpy.Has(cost);
		}
	}

	new Molpy.Boost({
		name: 'Bag of Holding',
		alias: 'BoH',
		icon: 'bagofholding',
		group: 'prize',
		className: 'alert',
		desc: function() {
			return 'Stuff isn\'t reset when you Molpy Down, at a cost of 10 Bonemeal.<br>Holds ' + 
				Molpify(1e42) + ' of each Stuff.'
		},
		
		price: {
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: Infinity,
		},
		
		prizes: 2,
		
		tier: Molpy.TierFunction(0, {
			Bonemeal: 20
		})
	});
	new Molpy.Boost({
		name: 'Bonemeal',
		plural: 'Bonemeal',
		icon: 'bonemeal',
		group: 'stuff',
		desc: function(me) {
			var str = 'You have ' + Molpify(me.Level, 3) + ' Bonemeal.';
			return str;
		},
		defStuff: 1
	});
	new Molpy.Boost({
		name: 'Wisdom of the Ages',
		alias: 'WotA',
		icon: 'wota',
		price: {LogiPuzzle: 625},
		
		Level: [
				function() {
					return this.bought * Math.max(-9, Math.ceil(0.2 * (Math.abs(Molpy.newpixNumber) - this.power)));
				},
				function() {}
		],
		
		desc: function(me) {
			return 'Lets you keep more leftover Caged Logicat puzzles as Time progresses.<br>Currently you can start an ONG with a maximum of ' + Molpify(10 + me.Level) + ' Caged Logicat puzzles.';
		},
		
		stats: 'More Caged Logicats are retained through an ONG as you progress further from the Beginning of Time, compared to the NewPix in which this was unlocked.<br>Protip: Temporal Rifts don\'t affect Caged Logicat puzzles',
		
		unlockFunction: function() {
			this.power = Math.abs(Molpy.newpixNumber);
		}
	});
	new Molpy.Boost({
		name: 'Draft Dragon',
		icon: 'draftdragon',
		group: 'drac',
		className: 'toggle',
		
		desc: function(me) {
			return (me.IsEnabled ? 'C' : 'When active, c')
				+ 'auses sand/glass monument production to proceed automatically after you start making a mould.'
				+ (me.bought ? '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ');" value="'
					+ (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>' : '');
		},
		
		buyFunction: function() {
			this.IsEnabled = 1;
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		price:{ GlassBlocks: '50F' }
	});
	new Molpy.Boost({
		name: 'Mustard',
		icon: 'mustard',
		plural: 'Mustard',
		icon: 'mustard',
		group: 'stuff',
		
		desc: function(me) {
			var str = 'You have ' + Molpify(me.Level, 3) + ' Mustard.';
			return str;
		},
		
		defStuff: 1,
		AddSuper: Molpy.BoostFuncs.Add,
		
		Add: function(amount) {
			if (Molpy.Got('Cress') && Molpy.IsEnabled('Cress')) amount = amount * (Molpy.Boosts['Goats'].power/1000);
			amount = Math.floor(amount*Molpy.Papal('Mustard'));
			this.AddSuper(amount);
			if(!Molpy.Boosts['Mustard Sale'].unlocked && Molpy.Got(this.alias, 2000)) {
				Molpy.UnlockBoost('Mustard Sale');
			}
			return amount;
		},
		
		clickBeach: function() {
			if(Molpy.mustardTools) {
				var added = Molpy.Add('Mustard', Molpy.mustardTools);
				if(Molpy.options.numbers) Molpy.AddSandParticle('+' + Molpify(added,1) + ' mustard');
			}
		}
	});
	new Molpy.Boost({
		name: 'Mysterious Maps',
		single: 'Map',
		plural: 'Maps',
		alias: 'Maps',
		icon: 'mysteriousmap',
		group: 'stuff',
		
		desc: function(me) {
			var str = 'You have ' + Molpify(me.Level, 3) + ' map' + plural(me.Level);
			if(!me.bought)  return str + '.';
			if (!Molpy.Got('DNS')) str += ' out of 50.';
			if(me.NextMap != Math.PI || Molpy.EnoughMonumgForMaps() && Molpy.RandomiseMap()) {
				if (!me.NextMap) Molpy.RandomiseMap();
				str += '<br>The next map can be found at NP ' + me.NextMap;
				if (Molpy.Got('Lodestone')) {
					var search=0;
					if (!Molpy.Got('Woolly Jumper') || me.NextMap < 0) { 
						while (1) {
							if (Molpy.Earned('discov'+(me.NextMap+search))) break;
							if (Molpy.Earned('discov'+(me.NextMap-search))) { search = -search; break;}
							search++
						}
					}
					str += '<br><input type="Button" onclick="Molpy.TTT(' + (me.NextMap+search) + 
						',1)" value="Nearest Jump!"></input>';
				}
			} else {
				str += '<br>You must construct additional Glass Monuments before you are able to decypher the next map.';
			}
			return str;
		},
		
		stats: function(me) {
			return me.desc(me) + '<br>Use your Camera at the specified NewPix to collect more Maps.';
		},
		
		buyFunction: function() { this.NextMap = 1 },
		NextMap: 0,
		defStuff: 1,
		saveData: {
			4:['NextMap', 0, 'float'],
		},
		defSave: 1,
		AddSuper: Molpy.BoostFuncs.Add,
		
		Add: function(amount) {
			this.AddSuper(amount);
			if (this.Level > 200 && Molpy.groupBadgeCounts.diamm) Molpy.UnlockBoost('Cake');	
		},
		
		price: {
			Blackprints: function(me) {
				return 200 * (me.Level + 1)
			}
		},
		Saturnav: function() {
			this.power = Math.floor((Molpy.groupBadgeCounts.monumg + Math.pow(8,(Molpy.groupBadgeCounts.diamm ||0)) +1 - Molpy.mapMonumg)/3);
			this.Refresh();
			Molpy.Boosts.DQ.Refresh();
		},
	});
	
	Molpy.EnoughMonumgForMaps = function() {
		return (Molpy.groupBadgeCounts.monumg + Math.pow(8,(Molpy.groupBadgeCounts.diamm ||0)) -1)> Molpy.Level('Maps') * 3 + Molpy.mapMonumg;
	}
	
	Molpy.ClearMap = function() {
		if(Molpy.EnoughMonumgForMaps()) {
			Molpy.RandomiseMap();
		} else {
			Molpy.Boosts['Maps'].NextMap = Math.PI;
		}
		Molpy.Boosts['Maps'].Refresh();
	}

	Molpy.RandomiseMap = function() {
		var np;
		while((np = Math.ceil(Math.random() * Math.min(Molpy.highestNPvisited,3100)) * (Math.random() > .5 ? 1 : -1)) == Molpy.newpixNumber || np == 0)
			;
		Molpy.Boosts['Maps'].NextMap = np;
		return 1;
	}

	new Molpy.Boost({
		name: 'Dragon Nesting Site',
		alias: 'DNS',
		icon: 'dragonnestingsite',
		group: 'drac',
		price: {Bonemeal: 1e9},
		
		desc: function(me) {
			return 'You have found the location of an ancient dragon nesting site.'
				+ (Molpy.Got('Nest') ? '' : '<br>Now to figure out how to build the nest...');
		}
	});
	Molpy.NestLinings = ['Sand','Castles','GlassChips','GlassBlocks','Logicat','Blackprints','Goats','Bonemeal',
				'Mustard','FluxCrystals','Vacuum','QQ','Diamonds','Gold','Princesses','exp','Coal']; // Always add to the END of this list
	Molpy.DragonStats = ['offence','defence','digging','breath','magic1','magic2','magic3'];
	Molpy.DragonProperties = {offence:['Sand','Castles'],defence:['GlassChips','GlassBlocks'],digging:['Blackprints','FluxCrystals'],
				  breath:['Goats','Mustard'],magic1:['Bonemeal','Vacuum'],magic2:['Logicats','QQ'],magic3:['Diamonds','Princesses']};
				// Gold is intentionally not in this list, if anything is ever added to this list think about the Hatchling data

	new Molpy.Boost({
		name: 'Dragon Nest',
		alias: 'Nest',
		icon: 'dragonnest',
		group: 'drac',
		className: 'action',
		desc: function(me) {
			var str = 'This is a dragon nest.';
			if (!Molpy.Got('DQ')) {
				str += '<br>To obtain a queen, you need Automata Control of at least ' + Molpify(1e6) + ' and '+Molpify(1e10) + ' Bonemeal.';
			} else if (!Molpy.Got('Eggs')) { 
				str += '<br>Please line the nest:<div id=NestLiners align=center>';
				for (var thing in Molpy.NestLinings) {
					stuff = Molpy.NestLinings[thing];
					if (Molpy.Has(stuff,Infinity)) {
						var line = me.Liners[thing] || 0;
						str += '<br>'+Molpy.Boosts[stuff].plural+':<br>' +
							'<button class=NestLine onclick="Molpy.Liner('+thing+',-10)" >&#9664;&#9664;</button>' +
							'<button class=NestLine onclick="Molpy.Liner('+thing+',-1)" >&#9664;</button> ';
						if (Molpy.options.science && line == 3) {
							str += '&lfloor;&pi;&rfloor;';
						} else if (Molpy.options.science && line == 4) {
							str += '&lceil;&pi;&rceil;';
						} else {
							str += Molpify(line,1);
						};
						str+=	'% <button class=NestLine onclick="Molpy.Liner('+thing+',1)" >&#9654;</button>'+
							'<button class=NestLine onclick="Molpy.Liner('+thing+',10)" >&#9654;&#9654;</button><p>';
					} else {
						me.Liners[thing] = 0;
					}
				}
				str += '</div>';
			} else {
				str += ' It can not have its lining changed while in use.  The current linings are:';
				for (var thing in Molpy.NestLinings) {
					stuff = Molpy.NestLinings[thing];
					if (Molpy.Has(stuff,Infinity)) {
						var line = me.Liners[thing] || 0;
						str += '<br>'+Molpy.Boosts[stuff].plural+': ';
						if (Molpy.options.science && line == 3) {
							str += '&lfloor;&pi;&rfloor;';
						} else if (Molpy.options.science && line == 4) {
							str += '&lceil;&pi;&rceil;';
						} else {
							str += Molpify(line,1);
						};
						str+=	'%';
					}
				}
			}
			return str;
		},
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: Infinity
		},
		classChange: function() { return Molpy.Got('Eggs')?'':'action' },
		Liners: [],
		saveData: {
			4:['Liners', 0, 'array'],
		},
		defSave: 1,
		nestprops: function() {
			var props=[];
			for (prop in Molpy.DragonStats) {
				var pair = Molpy.DragonProperties[Molpy.DragonStats[prop]];
				var stat1 = 0;
				var stat2 = 0;
				for (var line in this.Liners) {
					if (pair[0] == Molpy.NestLinings[line] && Molpy.Has(pair[0],Infinity)) stat1 = this.Liners[line];
					if (pair[1] == Molpy.NestLinings[line] && Molpy.Has(pair[1],Infinity)) stat2 = this.Liners[line];
				}
				props[prop] = stat1*stat2/10000;
			}
			return props;
		}
	});

	Molpy.Liner = function(thing,change) {
		Molpy.Anything = 1;
		var nest = Molpy.Boosts['Nest'];
		var rest = 0;
		for (var inf in Molpy.NestLinings) if (inf != thing) rest += (nest.Liners[inf] || 0);
		var cur = (nest.Liners[thing] || 0);
		if (cur+change < 0 || (!Molpy.Got('Marketing') && ((rest+cur+change) > 100))) return;
		nest.Liners[thing] = (nest.Liners[thing] || 0) + change;
		nest.Refresh();
	}
	Molpy.EggCost = function() {
		var eggs = Molpy.Boosts['Eggs'].Level;
		var modpow = 1;
		if (Molpy.Got('Cake') && eggs>1) {
			var more = Math.ceil(Math.log(Molpy.Level('Maps')/200));
			eggs = Math.max(1,eggs-more);
			if (eggs == 1) modpow = Math.pow(10,Molpy.Boosts['Eggs'].Level - eggs);
		};
		
		if (eggs < 6 && Molpy.Level('DQ') < 6) return DeMolpify(['1M','1W','1WW','1WWW','1Q','1WQ'][eggs])*modpow;
		return Infinity;
	}
	new Molpy.Boost({ 
		name: 'Dragon Queen',
		alias: 'DQ',
		icon: 'dragonqueen',
		group: 'drac',
		className: 'action',
		
		desc: function(me) {
			var str = 'The queen of the dragons.';
			if(me.bought) {
				Molpy.UnlockBoost('RDKM');
				var eggcost = Molpy.EggCost();
				str += '<br><input type="Button" onclick="if(Molpy.Spend({Bonemeal: Molpy.EggCost()}))Molpy.Add(\'Eggs\',1);" value="Lay"></input> an egg (uses ' + Molpify(eggcost) + ' Bonemeal.';
				if (Molpy.TotalDragons) {
					str += '<br><br>The Dragons are ' + ['Digging','Recovering','Hiding','Celebrating'][me.overallState];
					if (me.overallState > 0) str += ' for ' + MolpifyCountdown(me.countdown, 1);
				}
				str += Molpy.DragonUpgrade(0);
				str += '<br><br>Hatchlings will mature into ' + Molpy.DragonsById[me.Level].name + 's. ';
				str += Molpy.DragonsById[me.Level].description();
			}
			return str;
		},
		
		price: {
			Bonemeal: 1e11,
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: Infinity,
		},
		experience: 0, //Unused
		totalfights: 0,
		totalloses: 0,
		totalstarves: 0,
		loses: [],
		defSave: 1,
		defStuff: 1,
		finds:0,
		overallState: 0, // 0 all heathy, 1 hiding, 2 injuries, 3 Celebrating

		saveData: {4:['experience',0,'float'], // Unused 
			   5:['overallState',0,'int'],
			   6:['finds',0,'float'],
			   7:['loses',0,'array'],
			   8:['totalloses',0,'float'],
			   9:['totalfights',0,'float'],
			   10:['totalstarves',0,'float'],
		},
		countdownLockFunction: function() { // Used for overallState
			this.overallState = 0;
		},
		ChangeState: function(newstate, duration) {
			this.overallState = newstate;
			if (newstate) this.countdown += (duration || 1)
			else this.countdown = 0;	
			this.Refresh();
		},
		clickBeach: function() {
			if (this.bought && Molpy.DragonDigRate && Molpy.Got('Beach Dragon')) {
				Molpy.DragonDigging(1);
			}
		},

		Loose: function(type,num) {
			this.loses[type] = (this.loses[type]||0)+num;
			this.totalloses += num;
			if (this.totalloses >= 20) Molpy.EarnBadge('What\'s the score?');
			if (this.totalloses >= 144) Molpy.EarnBadge('That\'s gross');
		},
		countdownCMS: 1,
			
	});

	new Molpy.Boost({
		name: 'Dragon Eggs',
		alias: 'Eggs',
		single: 'Dragon&nbsp;Egg',
		icon: 'egg',
		group: 'drac',
		className: 'alert',
		
		desc: function(me) {
			var str = 'You have ' + Molpify(me.Level, 3) + ' egg' + plural(me.Level) + '. Hatching in ' + MolpifyCountdown(me.countdown, 1) + '.';
			return str;
		},
		
		defStuff: 1,
		AddSuper: Molpy.BoostFuncs.Add,
		
		Add: function(amount) {
			this.AddSuper(amount);
			this.countdown += Math.ceil((2000/(1+Molpy.Got('Incubator')) / Math.ceil(this.Level / 5)));
			Molpy.Boosts['DQ'].Refresh();
		},
		
		lockFunction: function() {
			Molpy.Add('Hatchlings', this.Level);
			Molpy.Notify((this.Level > 1)?'A clutch of '+this.Level+' eggs have hatched':'An egg has hatched',1);
			this.Level = 0;
		}
	});

	new Molpy.Boost({
		name: 'Dragon Hatchlings',
		alias: 'Hatchlings',
		icon: 'hatchlings',
		group: 'drac',
		className: 'action',
		
		desc: function(me) {
			if (!me.Level) return 'You don\'t have any hatchlings at the moment';
			var str = 'You have ' + Molpify(me.Level, 3) + ' hatchling' + plural(me.Level);
			if (me.clutches.length > 1) str += ' in ' + me.clutches.length + ' clutches';
			str += '.<p>Hatchlings will mature into ' + Molpy.DragonsById[Molpy.Level('DQ')].name + 's<p>';
			for (var cl in me.clutches) {
				if (me.clutches.length > 1) {
					var cn = 1*cl+1;
					str += '<p>Clutch ' + cn + ': ';
				} else {
					str += '<p>The Clutch ';
				}
				if (me.clutches[cl] > 1) str += 'of ' + Molpify(me.clutches[cl]) + ' ';
				if (me.age[cl] < 1000) {
					if (Molpy.Boosts.DQ.overallState != 3) {
						str += 'is restless and wants it\'s own home <input type=button value="Fledge Here" onclick="Molpy.DragonFledge('+
							cl+')"></input><br>';
						if (Molpy.Got('Cryogenics')) {
							str += '<input type=button value="Freeze for later" onclick="Molpy.DragonsToCryo('+cl+')"></input><br>'
						}
					} else {
						str += 'is too busy partying to Fledge';
					}
				} else if (me.diet[cl]) {
					str += 'is maturing and will be ready to Fledge in ' + (me.age[cl]-1000) + 'mNP.<br>';
				} else {
					str += 'is hungry ';
					var cls = me.clutches[cl];
					if (Molpy.Has('Goats',cls*1e6)) str += '<input type=button value="Feed '+Molpify(cls*1e6)+
						' Goats" onclick="Molpy.DragonFeed('+cl+',1)"></input><br>';
					if (Molpy.Has('Princesses',cls*10)) str += '<input type=button value="Feed '+Molpify(cls*10)+
						' Princesses" onclick="Molpy.DragonFeed('+cl+',3)"></input><br>';
				}
			}
			return str;
		},

		loadFunction: function() {
			var cleans = 0;
			for (var cl in this.clutches) {
				if (this.age[cl] < 1050) {
					this.clutches[cl] = 0;
					cleans ++;
				}
			};
			this.clean(cleans);
	      	},
		
		defStuff: 1,
		defSave: 1,
		clutches: [],
		properties: [],
		diet: [],
		age: [],
		saveData: {4:['clutches',0,'array'],
			   5:['diet',0,'array'],
			   6:['age',0,'array'],
			   7:['properties',0,'array']},
		
		Add: function(amount) {
			this.clutches.push(amount);
			this.diet.push(0);
			this.age.push(3000);
			this.properties = this.properties.concat(Molpy.Boosts['Nest'].nestprops());
			this.Level += amount;
			this.countdown = 5000;
			Molpy.Boosts['DQ'].Refresh();
		},

		countdownFunction: function() {
			var cleanup = 0;
			var starveat= Molpy.Got('Wait for it')?2000:2500;
			var escapeat= Molpy.Got('Q04B')?-1000:0;
			for (var cl in this.clutches) {
				this.age[cl]--;
				if (!this.clutches[cl]) continue;
				if (this.age[cl] <= escapeat) {
					if (Molpy.Got('Glaciation')) {
						Molpy.DragonsToCryo(cl);
					} else {
						Molpy.Notify('A Clutch of Hatchlings have fledged on their own',1);
						this.clutches[cl] = 0;
						cleanup++;
					}
				} else if (this.age[cl] == 1000) {
					Molpy.Notify('A Clutch of Hatchlings is ready to Fledge',1);
				} else if (this.age[cl] <= starveat && this.diet[cl]==0) { //  Ravinous
					var cl1 = parseInt(cl)+1;
					if (Molpy.Got('Robotic Feeder') && Molpy.IsEnabled('Robotic Feeder') && Molpy.Has('Goats',Infinity)) {
						Molpy.DragonFeed(cl,1);
					} else if (this.clutches[cl1]) {
						this.clutches[cl1] = 0;
						Molpy.DragonFeed(cl,2);
						cleanup++;
						cl++;
						Molpy.Notify('A hungry Clutch of Hatchlings have eaten another clutch',1);
					} else if (this.clutches[cl]>1) {
						this.clutches[cl] = 1;
						Molpy.DragonFeed(cl,2);
						Molpy.Notify('A hungry Hatchling has eaten the rest of it\'s clutch',1);
						cleanup++;
					} else {
						var dq = Molpy.Boosts['DQ'];
						Molpy.Add('exp',-Math.pow(1000,Molpy.Level('DQ'))*this.clutches[cl]);
						this.clutches[cl] = 0;
						cleanup++;
						Molpy.Notify('A hungry Clutch of Hatchlings have starved to death',1);
						dq.totalstarves = ( dq.totalstarves || 0) + 1;
						if (dq.totalstarves > 44) Molpy.UnlockBoost('Robotic Feeder');
					}

				} else if (this.age[cl] == 2900 && this.diet[cl] == 0) { //  Not Fed
					Molpy.Notify('A Clutch of Hatchlings need feeding');
				}
			}
			if (cleanup) this.clean(cleanup);
		},

		countdownLockFunction: function() { return this.countdownFunction() },

		clean: function(cleanup) {
			while (cleanup--) {
				for (var cl in this.clutches) {
					if (this.clutches[cl] == 0) {
						this.clutches.splice(cl,1);
						this.age.splice(cl,1);
						this.diet.splice(cl,1);
						this.properties.splice(cl*Molpy.DragonStats.length,Molpy.DragonStats.length);
						break;
					}
				}
			}
			this.Level = 0;
			for (var cl in this.clutches) this.Level += this.clutches[cl];
			if (!this.Level) this.countdown = 0;
		},
		classChange: function() { return this.Level?'action':'' },
	});

	Molpy.DragonFeed = function(clutch,food) {
		Molpy.Anything = 1;
		var hatch = Molpy.Boosts['Hatchlings'];
		var cls = hatch.clutches[clutch];
		switch (food) {
		case 1:
			if (Molpy.Spend('Goats',cls*1e6)) hatch.diet[clutch]=1;
			break;
		case 2:
			hatch.diet[clutch]=2; // Other Hatchlings!
			break;
		case 3:
			if (Molpy.Spend('Princesses',cls*10)) hatch.diet[clutch]=3;
			break;
		};
		if (hatch.diet[clutch]) hatch.age[clutch] = 3000;
		hatch.Refresh();
	}

	new Molpy.Boost({
		name: 'Glass Goat',
		icon: 'glassgoat',
		group: 'prize',
		desc: 'Glass produced by Glass Furnace/Blower is multiplied by the number of Goats you have, if any.',
		price:{
			Sand: '5M',
			Castles: '20K',
		},
		prizes: 1,
		tier: 1
	});
	new Molpy.Boost({
		name: 'Bone Clicker',
		icon: 'boneclicker',
		group: 'prize',
		desc: 'Sand and Glass Chips from clicking are multliplied by the amount of Bonemeal you have, if any.',
		price:{
			Sand: '5K',
			Castles: 12,
		},
		prizes: 1,
		tier: 1
	});
	new Molpy.Boost({
		name: 'Double Department',
		icon: 'doubledepartment',
		group: 'prize',
		desc: Molpy.Redacted.words + ' activate the DoRD twice when they would activate it once.',
		price:{
			Sand: '70M',
			Castles: '50K',
		},
		prizes: 1,
		tier: 1
	});
	new Molpy.Boost({
		name: 'Spare Tools',
		icon: 'sparetools',
		group: 'prize',
		desc: 'Every dig-click builds you a free random tool',
		price:{
			Sand: '2G',
			Castles: '7M',
		},
		prizes: 1,
		tier: 1
	});
	new Molpy.Boost({
		name: 'Doubletap',
		icon: 'doubletap',
		group: 'prize',
		desc: 'Every dig-click counts twice.',
		price:{
			Sand: '1K',
			Castles: 6,
		},
		prizes: 2,
		tier: 1
	});
	new Molpy.Boost({
		name: 'Single Double',
		icon: 'singledouble',
		className: 'action',
		group: 'prize',
		
		desc: function(me) {
			return 'Builds the amount of castles you have.<br>(Single use only)'
				+ (me.bought
						? '<br><input type="Button" onclick="Molpy.Add(\'Castles\',Molpy.Level(\'Castles\'));Molpy.LockBoost(\'Single Double\');" value="Use"></input>'
						: '');
		},
		
		price: {
			Sand: '80K',
			Castles: 500,
			Goats: 5
		},
		
		prizes: 1,
		tier: 1
	});
	new Molpy.Boost({
		name: 'Sandblast',
		icon: 'sandblast',
		className: 'action',
		group: 'prize',
		
		desc: function(me) {
			return 'Recieve 1M sand per Badge you own.<br>(Single use only)'
				+ (me.bought ? '<br><input type="Button" onclick="Molpy.Add(\'Sand\',Molpy.BadgesOwned*1000000);Molpy.LockBoost(\'Sandblast\');" value="Use"></input>' : '');
		},
		
		price: {
			Sand: 100,
			Castles: 2
		},
		
		prizes: 1,
		tier: 1
	});
	new Molpy.Boost({
		name: 'Short Saw',
		icon: 'shortsaw',
		group: 'prize',
		desc: 'VITSSÅGEN, JA! occurs 5 times as often',
		price:{
			Sand: '5T',
			Castles: '40G',
		},
		prizes: 1,
		tier: 1
	});
	new Molpy.Boost({
		name: 'Gruff',
		icon: 'gruff',
		group: 'prize',
		desc: 'When you win the Monty Haul prize, you get 2 goats',
		price:{
			Sand: '2P',
			Castles: '75T',
		},
		prizes: 1,
		tier: 2
	});
	new Molpy.Boost({
		name: 'Between the Cracks',
		alias: 'Cracks',
		icon: 'betweenthecracks',
		group: 'prize',
		className: 'toggle',
		
		desc: function(me) {
			return (me.IsEnabled ? 'I' : 'When active, i')
				+ 'if you have infinite Sand production, Boost purchases do not cost any Sand or Castles.'
				+ (me.bought ? '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="'
					+ (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>' : '');
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		price:{
			Sand: '15E',
			Castles: '80P',
		},
		prizes: 1,
		tier: 2
	});
	new Molpy.Boost({
		name: 'Soul Drain',
		icon: 'souldrain',
		group: 'prize',
		desc: 'Shadow Dragon has a 10% chance of producing bonemeal when Not Lucky occurs',
		price:{
			Sand: '60G',
			Castles: '290M',
		},
		prizes: 1,
		tier: 2
	});
	new Molpy.Boost({
		name: 'Rush Job',
		icon: 'rushjob',
		group: 'prize',
		desc: 'Mysterious Representations produces Blackprints 5 times as fast',
		price:{
			Sand: '50E',
			Castles: '600P',
			GlassBlocks: '400K',
		},
		prizes: 1,
		tier: 2
	});
	new Molpy.Boost({
		name: 'Void Goat',
		icon: 'voidgoat',
		group: 'prize',
		desc: 'Travel through a Temporal Rift yields a Goat if you have Flux Surge',
		price:{
			Sand: '40Z',
			Castles: '900E',
			GlassBlocks: '50K',
		},
		prizes: 1,
		tier: 2
	});
	new Molpy.Boost({
		name: 'Factory Expansion',
		icon: 'factoryexpansion',
		group: 'prize',
		desc: 'More Factory Automation levels are available through Rosetta',
		price:{
			Sand: '85Y',
			Castles: '25Z',
			GlassBlocks: '10M',
		},
		prizes: 1,
		tier: 2
	});
	new Molpy.Boost({
		name: 'Mustard Automation',
		icon: 'mustardautomation',
		group: 'prize',
		desc: 'Automata Assemble can run with Mustard Tools, at a cost of 20 Mustard per run',
		price:{ GlassBlocks: '70G' },
		prizes: 1,
		tier: 2
	});
	new Molpy.Boost({
		name: 'Musical Chairs',
		icon: 'musicalchairs',
		group: 'prize',
		desc: 'Doubles the effect of People Sit on Chairs',
		price:{ GlassBlocks: '40P' },
		prizes: 2,
		tier: 2
	});
	new Molpy.Boost({
		name: 'Glass Trolling',
		icon: 'glasstrolling',
		group: 'prize',
		desc: 'If you type "OK, GLASS" into the import box, the cost of making Glass Blocks from Glass Chips is reduced by a factor of 5 until the next ONG',
		price:{ GlassBlocks: '500' },
		prizes: 1,
		tier: 2
	});
	new Molpy.Boost({
		name: 'Fast Forward',
		icon: 'fastforward',
		group: 'prize',
		className: 'action',
		
		desc: function(me) {
			var str = "";
			if (!Molpy.Got('Time Travel')) str += 'When you have Time Travel. ';
			str += 'Go directly to the highest NewPix visited. Do not pass Go. Do not collect 200 goats.<br>(Single use only)'
			if (me.bought && Molpy.Got('Time Travel')) str += '<br><input type="Button" onclick="Molpy.FastForward()" value="Use"></input>';
			return str;
		},
		
		price: {
			Sand: '17F',
			Castles: '90S',
			GlassBlocks: '40G',
			FluxCrystals: 5
		},
		
		prizes: 1,
		tier: 2,
		
		// deactivate if on highest newPix
		classChange: function() { return Molpy.highestNPvisited != Molpy.newpixNumber ? 'action' : '' }
	});
	
	Molpy.FastForward = function() {
		Molpy.Anything = 1;
		Molpy.newpixNumber = Molpy.highestNPvisited;
		Molpy.ONGstart = ONGsnip(new Date());
		Molpy.UpdateBeach();
		Molpy.HandlePeriods();
		Molpy.LockBoost('Fast Forward');
		Molpy.Add('Goats', 1);
	}
	
	new Molpy.Boost({
		name: 'Archimedes\'s Lever',
		alias: 'Archimedes',
		icon: 'archimedesslever',
		group: 'prize',
		className: 'toggle',
		desc: function(me) {
			return 'If active and a Monument Maker is idle, it will start making the cheapest monument available ' +
				'at a cost of 10 Bonemeal.' +
				(me.bought ? '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="'
					+ (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>' : '');
		},
		stats: 'Only makes Minus Monuments if you are in Minus NewPix.<br>',
		price:{ GlassBlocks: '360W' },
		prizes: 1,
		tier: 3,
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
	});
	new Molpy.Boost({
		name: 'Would have been useful a month ago',
		alias: 'Month',
		icon: 'month',
		group: 'prize',
		className: 'action',
		
		desc: function(me) {
			return 'Instantly win the game.<br>(Single use only)'
				+ (me.bought ? '<br><input type="Button" onclick="' + Molpy.BeanishToCuegish(Molpy.wintext) + ';Molpy.LockBoost(\'Month\');" value="Use"></input>' : '');
		},
		
		price: {
			GlassBlocks: '40WW',
			Bonemeal: 80,
			Goats: 120,
			Mustard: 240
		},
		
		prizes: 1,
		tier: 3
	});
	new Molpy.Boost({
		name: 'Mustard Sale',
		icon: 'mustardsale',
		className: 'action',
		
		desc: function(me) {
			var str = 'Set the amount of a random Tool to 0 owned at a cost of 500 Mustard.'
			if (me.bought) {
				str += '<br><input type="Button" onclick="Molpy.MustardSale(0);" value="Use"></input>';
				var all=500*2*Molpy.tfOrder.length;
				if (Molpy.Has('Mustard',all)) str += '<br>For a cost of ' + Molpify(all) + ' Mustard, set all to 0.<br>' +
					'<input type="button" onclick="Molpy.MustardSale(1);" value="Set all"></input>';
			}
			return str;
		},
		
		price: {
			GlassBlocks: '2M',
			Mustard: '6K'
		}
	});
	
	Molpy.MustardSale = function(mode) {
		Molpy.Anything = 1;
		if (mode == 0) {
			if(Molpy.Spend('Mustard', 500)) {
				var tool = GLRschoice(Molpy.tfOrder);
				tool.amount = 0;
				tool.temp = 0;
				tool.Refresh();
				Molpy.Notify('Reset ' + tool.name);
			}
		} else {
			var all=500*2*Molpy.tfOrder.length;
			if(Molpy.Spend('Mustard', all)) {
				var t = Molpy.tfOrder.length;
				while(t--) {
					var tool = Molpy.tfOrder[t];
					tool.amount = 0;
					tool.temp = 0;
					tool.Refresh();
				}
				Molpy.Notify('Reset all tools');
			}
		}
		Molpy.MustardCheck();
	}

	new Molpy.Boost({
		name: 'Robotic Shopper',
		alias: 'Rob',
		icon: 'roboticshopper',
		group: 'cyb',
		className: 'action',
		
		desc: function(me) {
			if(!me.bought) return "An advanced shopping assistant, with more control and able to shop for many things";
			var large = (me.power & 2);
			var str = '';
			if(!large) str += '<small>';
			str += 'Shop for me <input ' + (large ? '' : 'class=smallbutton ') + 'type=button onclick="Molpy.ToggleBit(' + (me.id) + ',0)" value="' + ((me.power & 1) ? 'in ASHF only' : 'Always') + '"></input>';
			str += '<br><input ' + (large ? '' : 'class=smallbutton ') + 'type=button onclick="Molpy.ToggleBit(' + (me.id) + ',1)" value="' + ((me.power & 2) ? 'Small Size text' : 'Normal Size text') + '"></input>';
			str += '<input ' + (large ? '' : 'class=smallbutton ') + 'type=button onclick="Molpy.ToggleBit(' + (me.id) + ',2)" value="' + ((me.power & 4) ? 'Notifies off' : 'Notifies on') + '"></input>';

			for(var thingy = 0; thingy <= me.bought; thingy++) {
				var item = Molpy.BoostsById[thingy + 1];
				if(item.power) {
					str += '<br><a onclick="Molpy.ChooseShoppingItem(' + (thingy + 1) + ')">' + Molpy.BoostsById[Math.abs(item.power)].name + '</a> ';
					str += '<input ' + (large ? '' : 'class=smallbutton ') + 'type=button value="'
						+ (item.power < 0 ? 'Off' : 'On') + '" onclick="Molpy.GenericToggle(' + (thingy + 1) + ',1)" </input>';
				} else {
					str += '<br><a onclick="Molpy.ChooseShoppingItem(' + (thingy + 1) + ')">Not currently used</a>';
				}
			}
			if(Molpy.Boosts['AC'].power >= 500 * Math.pow(2, me.bought) && me.bought < 5) {
				str += '<br><input ' + (large ? '' : 'class=smallbutton ')
					+ 'type=button onclick="Molpy.Robot_Upgrade()" value="Upgrade"></input> Costs Infinite Glass';
			}
			if(!large) str += "</small>";
			return str;
		},
		
		price: {
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: Infinity
		}
	});

	Molpy.Robot_Upgrade = function() {
		Molpy.Anything = 1;
		me = Molpy.Boosts['Rob'];
		if(Molpy.Spend('GlassBlocks', Infinity)) {
			me.bought++;
			Molpy.BoostsById[me.bought + 1].power = 0;
			Molpy.Notify('Robotic Shopper upgraded');
			Molpy.Boosts['Rob'].Refresh();
		}
	}
	
	Molpy.ToggleBit = function(myid, bit) {
		Molpy.Anything = 1;
		Molpy.BoostsById[myid].power ^= (1 << bit);
		Molpy.BoostsById[myid].Refresh();
	}

	new Molpy.Boost({
		name: 'Eww',
		icon: 'eww',
		group: 'prize',
		className: 'action',
		
		desc: function(me) {
			return 'Convert 1K Mustard into 20 Bonemeal'
				+ (me.bought ? '<br><input type="Button" onclick="if(Molpy.Spend(\'Mustard\',1000))Molpy.Add(\'Bonemeal\',20)" value="Use"></input>' : '');
		},
		
		price: {
			GlassBlocks: '789G',
			Sand: '2W',
			Mustard: '1K'
		},
		
		prizes: 1,
		tier: 3
	});
	new Molpy.Boost({
		name: 'GoatONG',
		icon: 'goatong',
		group: 'prize',
		className: 'action',
					
		desc: function(me) {
			return 'Spend 10 Goats and cause an ONG<br>(Single use only)'
				+ (me.bought ? '<br><input type="Button" onclick="if(Molpy.Spend(\'Goats\',10))Molpy.ONG();Molpy.LockBoost(\'GoatONG\')" value="Use"></input>' : '');
		},
				
		price: {
			GlassBlocks: '789G',
			Sand: '2W',
			Vacuum: 10
		},
		
		prizes: 0,
		tier: 3
	});

	new Molpy.Boost({
		name: 'Mustard Injector',
		icon: 'mustardinjector',
		group: 'prize',
		className: 'action',
		
		desc: function(me) {
			var str = 'Spend 200 Mustard to convert a random tool to Mustard.'
			if (me.bought) {
				str += '<br><input type="Button" onclick="Molpy.MustardInjector(0);" value="Use"></input>';
				var all=200*2*Molpy.tfOrder.length;
				if (Molpy.Has('Mustard',all)) str += '<br>For a cost of ' + Molpify(all) + ' Mustard, set all Tools to Mustard.<br>' +
					'<input type="button" onclick="Molpy.MustardInjector(1);" value="Set all"></input>';
			}
			return str;
		},
		
		price: {
			Sand: Infinity,
			Castles: '50GW'
		},
		
		prizes: 2,
		tier: 3
	});
	
	Molpy.MustardInjector = function(mode) {
		Molpy.Anything = 1;
		if (mode == 0) {
			if(Molpy.Spend('Mustard', 200)) {
				var tool = GLRschoice(Molpy.tfOrder);
				tool.amount = NaN;
				tool.temp = 0;
				tool.Refresh();
				Molpy.Notify('Mustarded ' + tool.name);
			}
		} else {
			var all=200*2*Molpy.tfOrder.length;
			if(Molpy.Spend('Mustard', all)) {
				var t = Molpy.tfOrder.length;
				while(t--) {
					var tool = Molpy.tfOrder[t];
					tool.amount = NaN;
					tool.temp = 0;
					tool.Refresh();
				}
				Molpy.Notify('Mustarded all tools');
			}
		}
		Molpy.MustardCheck();
	}

	new Molpy.Boost({
		name: 'Crunchy with Mustard',
		alias: 'Crunch',
		icon: 'crunch',
		group: 'prize',
		//className: 'action',
		
		desc: function(me) {
			return 'Now does nothing';
			//return 'Pay 5K Mustard to reset your ' + Molpy.Redacted.word + ' click count to 0 and gain 1 Bonemeal per 20'
			//	+ (me.bought ? '<br><input type="Button" onclick="Molpy.Boosts[\'Crunch\'].crunch()" value="Use"></input>' : '');
		},
		
		price: {
			Castles: Infinity,
			GlassBlocks: '800SW'
		},
		
		prizes: 1,
		tier: 3,
		
		crunch: function() {
			if(Molpy.Spend('Mustard', 5000)) {
				Molpy.Add('Bonemeal', Math.floor(Molpy.Redacted.totalClicks / 20));
				Molpy.Redacted.totalClicks = 0;
				Molpy.Notify('Crunch!');
			}
		}
	});
	
	new Molpy.Boost({
		name: 'Bag of Moulding',
		alias: 'BoM',
		icon: 'bagofmoulding',
		group: 'prize',
		className: 'alert',
		desc: function() {
			return 'Mould Boosts (apart from Prizes) aren\'t reset when you Molpy Down, at a cost of 100 Bonemeal.' +
				'<br>Capacity of Bag of Holding is multiplied by ' + Molpify(1e42)
		},
			
		price: {
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: Infinity,
			Mustard: 1000,
			Blackprints: '20K'
		},
		
		prizes: 2,
		
		tier: Molpy.TierFunction(1, {
			Bonemeal: 200,
			Mustard: 500,
			Blackprints: 800
		})
	});
	new Molpy.Boost({
		name: 'Bag of Folding',
		alias: 'BoF',
		icon: 'bagoffolding',
		group: 'prize',
		className: 'alert',		
		desc: function() {
			return 'Toggle Boosts (apart from Prizes, Glass Furnace, and Glass Blower) aren\'t reset when you Molpy Down, ' +
				'at a cost of 1000 Bonemeal.<br>Capacity of Bag of Holding is multiplied by ' + Molpify(1e42)
		},
			
		price: {
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: Infinity,
			Goats: 60,
			Blackprints: '800K'
		},
		
		prizes: 2,
		
		tier: Molpy.TierFunction(2, {
			Bonemeal: 3000,
			Goats: 30,
			Blackprints: '5K'
		})
	});
	new Molpy.Boost({
		name: 'Ninja Ritual',
		icon: 'ninjaritual',
		group: 'ninj',
		
		desc: function(me) {
			return 'When you ninja the NewPixBots, receive a Goat.'
				+ (me.bought ? '<br>Receive an extra goat for every 5 consecutive Ninjas.<br> Currently at '
					+ Molpify(me.Level, 2) + ' consecutive Ninja' + plural(me.Level) + '.' : '');
		},
		
		price: {Goats: 300},
		defStuff: 1,
		buyFunction: function() { if (Molpy.Earned('The Ritual is worn out')) this.Level = 1e298 },
	});
	Molpy.NinjaRitual = function() {
		var oldlvl = Molpy.Level('Ninja Ritual');
		var mult=1;
		if (Molpy.Got('Zooman')) mult = 20;
		if (Molpy.Earned('The Ritual is worn out')) {
			Molpy.Add('Goats', Math.floor((1e298 * (Molpy.Got('CMNT')?Molpy.Level('PR'):1) / 5)*Molpy.Papal('Goats')));
			Molpy.Boosts['Ninja Ritual'].Level = 1e298;
		} else {
			Molpy.Add('Goats', Math.floor((1 + oldlvl * (Molpy.Got('CMNT')?Molpy.Level('PR'):1) / 5)*Molpy.Papal('Goats')));
			while (Molpy.Level('Ninja Ritual') <= oldlvl) {
				Molpy.Boosts['Ninja Ritual'].Level +=mult; 
				mult*=10; 
			};
			if (Molpy.Got('Zooman')) Molpy.Boosts['Ninja Ritual'].Level +=mult + Math.floor(Molpy.Boosts['Ninja Ritual'].Level/10000); 
			if (Molpy.Got('Mutant Tortoise')) Molpy.Boosts['Ninja Ritual'].Level = Math.floor(Molpy.Boosts['Ninja Ritual'].Level *1.005); 
		};
		var lvl = Molpy.Level('Ninja Ritual');
		if (lvl > 777 && !isFinite(Molpy.Level('Time Lord')) && 
			Molpy.Got('Shadow Feeder') && (!Molpy.IsEnabled('Mario'))) Molpy.UnlockBoost('Shadow Ninja');
		if (lvl > 77777) Molpy.UnlockBoost('Zooman');
		if (lvl > 1000000) Molpy.EarnBadge('Mega Ritual');
		if (lvl > 77777777) Molpy.UnlockBoost('Mutant Tortoise');
		if (lvl > 1e12) Molpy.EarnBadge('Tera Ritual');
		if (lvl > 1e18) Molpy.EarnBadge('Had Enough Ritual?');
		if (lvl > 777e21) Molpy.UnlockBoost('CMNT');
		if (lvl > 365e24) Molpy.EarnBadge('Yearly Ritual');
		if (lvl > 1e84) Molpy.EarnBadge('Wololololo Ritual');
		if (lvl > 1e298) Molpy.EarnBadge('The Ritual is worn out');
	};
	new Molpy.Boost({
		name: 'Time Lord',
		icon: 'timelord',
		group: 'chron',
		className: 'action',
		Level: Molpy.BoostFuncs.PosPowerLevel,
		
		Add: function(levels, cap) {
			this.Level += levels;
			if(cap > 0 && this.bought > 0) {
				this.bought += cap;
				this.Level += cap;
				this.Refresh();
				Molpy.Boosts['Flux Harvest'].Refresh();
				if (this.bought >= 50) Molpy.UnlockBoost('Flux Harvest');
				if (this.bought > 1000) Molpy.UnlockBoost('Fertiliser');
			}
		},
		
		IsEnabled: [function() {
			return this.Level == 0 ;
		}],
		
		desc: function(me) {
			var str = 'You can travel through ' + Molpify(me.bought + 1) + ' Temporal Rift' + plural(me.bought + 1)
				+ ' per NewPix. You can travel through ' + Molpify(me.Level) + ' more Temporal Rift'
				+ plural(me.Level) + '.';
			if(me.bought) {
				var add = 1;
				var p = 20 * me.bought * (1 + Math.floor(Math.log(me.bought) * Math.LOG10E));
				while(Molpy.Has('FluxCrystals', p * add * 10) && isFinite(add) && (add <= me.bought))
					add *= 10;
				if((add >= 1e150)&&(Molpy.Has('FluxCrystals', Infinity))){
					add = Infinity
				}
				if(add > me.bought / 1000000) {
					str += '<br><input type="Button" onclick="if(Molpy.Spend({FluxCrystals:' + p * add
						+ '}))Molpy.Add(\'Time Lord\',0,' + add + ');" value="Pay"></input> ' + Molpify(p * add, 1)
						+ ' Flux Crystals to increase this by ' + Molpify(add) + '.';
				}
			}
			return str;
		},

		classChange: function() { 
			if (!isFinite(this.bought)) return '';
			var p = 20 * this.bought * (1 + Math.floor(Math.log(this.bought) * Math.LOG10E));
			return Molpy.Has('FluxCrystals', p) ? 'action': '';
		},

		reset: function() { 
			this.Level = this.bought +1;
			if (Molpy.Boosts['Time Reaper'].bought == 3) Molpy.Spend('FluxCrystals',0)
		},
	});
	new Molpy.Boost({
		name: 'Flux Crystals',
		alias: 'FluxCrystals',
		single: 'Flux&nbsp;Crystal',
		icon: 'fluxcrystals',
		group: 'stuff',
		stats: 'Available when you travel through a Temporal Rift during a Flux Surge',
		
		desc: function(me) {
			var str = 'You have ' + Molpify(me.Level, 3) + ' Flux Crystal' + plural(me.Level) + '.';
			return str;
		},
		SpendSuper: Molpy.BoostFuncs.Spend,
		Spend: function(n) {
			var res = this.SpendSuper(n);
			if (Molpy.Got('Time Reaper') && this.Level == 0 && Molpy.Level('Time Lord') == Infinity) {
				this.power = Infinity;
				Molpy.Add('Time Lord', -Infinity);
			} else if (Molpy.Level('DQ') && this.Level == 0 && Molpy.Boosts['Time Lord'].bought == Infinity && 
				Molpy.Boosts['Time Reaper'].unlocked == 0) Molpy.UnlockBoost('Time Reaper');
			return res;
		},
		
		defStuff: 1
	});
	new Molpy.Boost({
		name: 'Ninja Herder',
		icon: 'ninjaherder',
		group: 'ninj',
		desc: 'Ninja Ritual activates on a Ninja Holidip',
		stats: 'See: Ninja Ritual Boost and Ninja Holidip Badge',
		price: {Goats: 1200}
	});
	new Molpy.Boost({
		name: 'Negator',
		icon: 'negator',
		group: 'prize',
		className: 'action',
		
		desc: function(me) {
			return 'Flip in and out of Minus worlds at a cost of 1 Flux Crystal'
				+ (me.bought ? '<br><input type="Button" onclick="if(Molpy.Spend({FluxCrystals:1})){Molpy.newpixNumber*=-1;Molpy.UpdateBeach()}" value="Flip"></input>' : '');
		},
		
		price: {
			Sand: Infinity,
			Castles: Infinity,
			Logicat: 500
		},
		
		prizes: 1,
		tier: 3
	});
	new Molpy.Boost({
		name: 'Bag of Jolting',
		alias: 'BoJ',
		icon: 'bagofjolting',
		group: 'prize',
		className: 'alert',
		desc: function() {
			return 'Chronotech Boosts aren\'t reset when you Molpy Down, at a cost of ' + Molpify(10000) + 
				' Bonemeal.<br>Capacity of Bag of Holding is multiplied by ' + Molpify(1e42)
		},
		
		price: {
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: Infinity,
			FluxCrystals: 600,
			Blackprints: '15M'
		},
		
		prizes: 2,
		
		tier: Molpy.TierFunction(3, {
			Bonemeal: 5000,
			Logicat: 750,
			FluxCrystals: 50
		})
	});
	new Molpy.Boost({
		name: 'Crystal Memories',
		icon: 'crystalmemories',
		group: 'prize',
		desc: 'Gain a Flux Crystal whenever you use Memories Revisited during Flux Surge, at a cost of half the Flux Surge countdown.',
		
		price: {
			GlassBlocks: '2T',
			FluxCrystals: 800
		},
		
		prizes: 1,
		tier: 4
	});
	new Molpy.Boost({
		name: 'Twice Tools',
		icon: 'twicetools',
		group: 'prize',
		className: 'action',
		
		desc: function(me) {
			return 'Double the number of a random Tool at a cost of 5 Flux Crystals.'
				+ (me.bought ? '<br><input type="Button" onclick="Molpy.TwiceTools();" value="Use"></input>' : '');
		},
		
		price: {
			Sand: Infinity,
			Castles: Infinity,
			FluxCrystals: 400
		},
		
		prizes: 1,
		tier: 4
	});

	Molpy.TwiceTools = function() {
		Molpy.Anything = 1;
		if(Molpy.Spend('FluxCrystals', 5)) {
			var tool = GLRschoice(Molpy.tfOrder);
			tool.amount *= 2;
			tool.Refresh();
			Molpy.Notify('Doubled ' + tool.name);
		}
	}

	new Molpy.Boost({
		name: 'Buzz Saw',
		icon: 'buzzsaw',
		desc: 'Glass Saw\'s power will go up 50% faster and it will expand Glass Storage if necessary (and possible).',
		
		price: {
			GlassBlocks: '12E',
			Goats: 12
		}
	});
	new Molpy.Boost({
		name: 'Lubrication',
		icon: 'lubrication',
		group: 'prize',
		desc: 'Glass Furnace and Glass Blower\'s switching time is reduced by 99% (uses 100 Mustard per toggle).',
		price: {Mustard: '6K'},
		prizes: 1,
		tier: 4
	});
	new Molpy.Boost({
		name: 'Riser',
		icon: 'riser',
		desc: 'Unlocks the Seaish Glass boosts much sooner.',
		price: {
			Mustard: '3K',
			Sand: Infinity
		},
		group: 'prize',
		prizes: 1,
		tier: 4
	});
	new Molpy.Boost({
		name: 'Mould Press',
		icon: 'mouldpress',
		group: 'prize',
		desc: 'If you have Automation Optimiser, Mould tasks run again to use up any leftover Factory Automation runs.',
		
		price: {
			Goats: 300,
			LogiPuzzle: '2K',
			Castles: Infinity,
			GlassBlocks: Infinity
		},
		
		prizes: 1,
		tier: 4
	});
	new Molpy.Boost({
		name: 'Now Where Was I?',
		icon: 'nowwherewasi',
		className: 'action',
		group: 'chron',
		
		desc: function(me) {
			if(!me.bought || Molpy.newpixNumber == Molpy.highestNPvisited)
				return 'Allows direct Jump to your highest NewPix';
			var jumpcost = Molpy.CalcJumpEnergy(Molpy.highestNPvisited);
			var str = '<input type="Button" ';
			if(Molpy.Earned('discov' + Molpy.highestNPvisited)) {
				str += 'onclick="Molpy.TTT(' + Molpy.highestNPvisited + ',1)" value="Jump!"></input> (Uses ' + Molpify(jumpcost, 2) + ' Glass Chips)'
			} else {
				str += 'onclick="Molpy.NowWhereWasI()" value="Jump"> (Uses ' + Molpify(jumpcost * 2, 2) + ' Glass Chips and a Goat)';
			}
			str += ' to your highest NewPix';
			return str;
		},
		
		price: {
			Sand: Infinity,
			Castles: Infinity,
			Goats: 50,
			FluxCrystals: 25
		},
		
		// deactivate if on highest newPix or no Goats
		classChange: function() { return (Molpy.highestNPvisited != Molpy.newpixNumber && Molpy.Has('Goats', 1) ) ? 'action' : '' },
	});

	Molpy.NowWhereWasI = function() {
		Molpy.Anything = 1;
		if(Molpy.newpixNumber == Molpy.highestNPvisited) return;
		var jumpcost = Molpy.CalcJumpEnergy(Molpy.highestNPvisited);
		if(Molpy.Spend({GlassChips: jumpcost, Goats: 1})) {
			Molpy.TTT(Molpy.highestNPvisited, 1)
		} else if(Molpy.Has('GlassChips', jumpcost)) {
			Molpy.Notify('You need to sacrifice a goat for this')
		} else {
			Molpy.Notify('Without the chips you will have to do this the hard way')
		}
	}

	Molpy.VacCost = {
		FluxCrystals: 10,
		QQ: 10
	};
	
	new Molpy.Boost({
		name: 'Vacuum Cleaner',
		icon: 'vacuumcleaner',
		className: 'toggle',
		group: 'hpt',
		
		desc: function(me) {
			return (me.IsEnabled ? 'U' : 'When active, u') + 'ses '
				+ Molpy.PriceString(Molpy.VacCost) + ' per mNP to destroy Infinite Sand.'
				+ (me.bought ? '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="'
					+ (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>' : '');
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		
		price: {
			Sand: Infinity,
			Castles: Infinity,
			GlassChips: '330T',
			Goats: 100,
			FluxCrystals: 500
		}
	});
	new Molpy.Boost({
		name: 'Vacuum',
		icon: 'vacuum',
		group: 'stuff',
		stats: 'Produced by Vacuum Cleaner',
		
		desc: function(me) {
			var str = 'You have ' + Molpify(me.Level, 3) + ' Vacuum' + plural(me.Level) + '.';
			return str;
		},
		
		defStuff: 1,
		
		refreshFunction: function() {
			Molpy.ChainRefresh('TS');
			this.refreshSuper();
		},
		
		refreshSuper: Molpy.BoostFuncs.RefreshPowerBuy
	});
	new Molpy.Boost({
		name: 'Void Starer',
		alias: 'VS',
		icon: 'voidstarer',
		className: 'toggle',
		
		desc: function(me) {
			return (me.IsEnabled ? 'T' : 'When active, t')
				+ 'he number of Blackprints produced by Mysterious Representations is boosted by 1% per 100 Vacuum.<br>'
				+ '(It is still rounded down to a whole number of Blackprints.)<br>'
				+ 'Consumes 1 Vacuum if any benefit occurs.'
				+ (me.bought ? '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="'
					+ (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>' : '');
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		
		price: {
			FluxCrystals: 40,
			Vacuum: 60
		}
	});
	
	Molpy.VoidStare = function(pages, staretype) {
		Molpy.Anything = 1;
		if(Molpy.IsEnabled(staretype) && isFinite(Molpy.Boosts['Blackprints'].power)) {
			var oldPages = pages;
			pages *= Math.pow(1.01, Molpy.Level('Vacuum') / 100);
			pages = Math.floor(pages);
			if(pages > oldPages) Molpy.Spend('Vacuum', 1) // impossible to increase pages if vacuum was 0, obviously
		}
		return pages;
	}

	new Molpy.Boost({
		name: 'Question Qube',
		alias: 'QQ',
		icon: 'questionqube',
		group: 'stuff',
		className: 'action',
		
		desc: function(me) {
			var str = 'You have ' + Molpify(me.Level, 3) + ' Question Qube' + plural(me.Level) + '.';
			if(me.Has(1)) {
				str += '<br><input type="Button" onclick="Molpy.Spend({QQ:1});Molpy.RewardLogicat(Molpy.Level(\'QQ\'))" value="?"></input>';
			}
			return str;
		},
		
		// deactivate if no QQs
		classChange: function() { return Molpy.Boosts['QQ'].Has(1) ? 'action' : '' },
		
		defStuff: 1
	});
	new Molpy.Boost({
		name: 'Italian Plumber',
		alias: 'Mario',
		icon: 'italianplumber',
		className: 'toggle',
		
		desc: function(me) {
			var lvls = me.bought;
			var uses = lvls * (lvls + 1) / 2;
			var str = (me.IsEnabled ? 'O' : 'When active, o') + 'pens ' + (lvls == 1 ? 'a' : Molpify(lvls, 4))
				+ ' Question Qube' + plural(lvls) + ' every time Automata Assemble runs'
				+ (lvls > 1 ? ', but uses ' + Molpify(uses, 4) + ' Qubes' : '') + '.'
				+ (me.bought ? '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ',1)" value="'
					+ (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>' : '');
			if(me.bought) {
				var UpgradePrice = {
					Vacuum: 1000,
					QQ: (50000 * lvls)
				};
				if(Molpy.Has(UpgradePrice)) {
					str += '<br><input type="button" onclick="Molpy.SuperMario()" value="Upgrade"></input>'
						+ '<br>To open ' + (Molpify(lvls + 1, 4)) + ' Qubes, using ' + ((lvls + 1) * (lvls + 2) / 2)
						+ ' Qubes.  Costs: ' + Molpy.PriceString(UpgradePrice);
				}
				if(!Molpy.Boosts['No Sell'].power && me.bought > 1 && Molpy.Has('Vacuum',1000))	
					str += '<br><input type="Button" value="Downgrade" onclick="Molpy.DowngradeMario()">\</input>';
			}
			return str
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		
		price: {
			Vacuum: '50',
			QQ: '500k'
		}
	});

	Molpy.SuperMario = function() {
		Molpy.Anything = 1;
		var me = Molpy.Boosts['Mario'];
		var lvls = me.bought;
		var UpgradePrice = {
			Vacuum: 1000,
			QQ: (50000 * lvls)
		};
		if(Molpy.Spend(UpgradePrice)) {
			me.bought++;
			Molpy.Notify("Italian Plumber Upgraded");
			me.Refresh();
		}
	};

	Molpy.DowngradeMario = function() {
		Molpy.Anything = 1;
		var me = Molpy.Boosts['Mario'];
		if(Molpy.Spend('Vacuum',1000)) {
			me.bought--;
			Molpy.Notify("Italian Plumber Downgraded");
			me.Refresh();
		}
	}

	new Molpy.Boost({
		name: 'Void Vault',
		alias: 'VV',
		icon: 'voidvault',
		className: 'toggle',
		
		desc: function(me) {
			return (me.IsEnabled ? '' : 'When active, ')
				+ 'Void Starer bonus applies to the Blackprints in Locked Vaults.<br>Consumes 1 Vacuum per Locked Vault opened.'
				+ (me.bought ? '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="'
					+ (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>' : '');
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		
		price: {
			Blackprints: '32G',
			Vacuum: '40K',
			QQ: '7M'
		}
	});
	new Molpy.Boost({
		name: 'Flux Harvest',
		icon: 'fluxharvest',
		className: 'action',
		group: 'chron',
		
		price: {
			Blackprints: '1G',
			QQ: '1M'
		},
		
		desc: function(me) {
			if(!me.bought || (Molpy.IsEnabled('Time Lord') && isFinite(Molpy.Boosts['FluxCrystals'].power)))
				return 'Easy harvesting of flux crystals from remaining rifts';
			return '<input type=button onclick="Molpy.FluxHarvest()" value="Harvest"></input> flux crystals from your remaining rifts';
		},
		
		// deactivate if no Time Lord
		classChange: function() { return !Molpy.IsEnabled('Time Lord') && isFinite(Molpy.Boosts['FluxCrystals'].power) ? 'action' : '' },
	});

	Molpy.FluxHarvest = function() {
		Molpy.Anything = 1;
		if(Molpy.IsEnabled('Time Lord')) {
			Molpy.Notify("No Rifts left to harvest");
			return;
		}
		var levels = Molpy.Level('Time Lord');
		if( levels < 100) {// just do a loop
			var totalc = 0;
			var chk = levels+10;
			while(!Molpy.IsEnabled('Time Lord')) {
				if (chk-- < 0) {Molpy.Notify("EEEK"); break; }
				var c = Math.floor(Math.random() * (Molpy.Boosts['Time Lord'].bought + 2 - Molpy.Level('Time Lord')) * (Molpy.Got('TDE') + 1));
				totalc += c;
				Molpy.Add('FluxCrystals', c);
				Molpy.Add('Time Lord', -1);
			};
			var d = Math.floor(totalc*Molpy.Papal("Flux"));
			if (d) Molpy.Add('FluxCrystals', d);
			Molpy.Notify('Chronoreaper activated. Harvested '+Molpify(totalc+d)+' flux crystal'+plural(totalc+d)+'.', true);
		} else { // Use maths to approximate then modify by a small random element
			var c = (Molpy.Boosts['Time Lord'].bought + 1) * (Molpy.Boosts['Time Lord'].bought + 2) / 2 - 
				 (Molpy.Boosts['Time Lord'].bought + 2 - Molpy.Level('Time Lord')) * 
				  (Molpy.Boosts['Time Lord'].bought + 3 - Molpy.Level('Time Lord'))/ 2;
			if (isNaN(c)) c = Infinity;
			if(!Molpy.Got('TDE')) c /= 2;
			c*=Molpy.Papal("Flux");
			if (Molpy.IsEnabled('Fertiliser') && Molpy.Spend('Bonemeal',Math.ceil(1000+Molpy.Boosts['Bonemeal'].power/50))) 
				c*=Math.pow(1.001,Molpy.Boosts['Bonemeal'].power/1000);
			c = Math.floor(c * .9 + c * .2 * Math.random());
			Molpy.Add('FluxCrystals', c);
			Molpy.Notify('Chronoreaper activated. Harvested '+Molpify(c)+' flux crystal'+plural(c)+'.', true);
			Molpy.Add('Time Lord', -levels);
		}
		Molpy.Boosts['Flux Harvest'].Refresh();
	};

	new Molpy.Boost({
		name: 'This Sucks',
		alias: 'TS',
		icon: 'thissucks',
		group: 'hpt',
		className: 'toggle',
		
		desc: function(me) {
			if(!me.bought) return 'Allows you to increase the Vacuum-generation rate of Vacuum Cleaner.';
			var n = me.Level;
			var str = 'Vacuum Cleaner attempts to make up to ' + Molpify(n, 2) + ' Vacuum.';
			var cost = {
				Vacuum: Math.abs(2000 - n) * n,
				Blackprints: Math.floor(n * 1000 * Math.pow(1.01, Molpy.Level('Vacuum') / 100))
			};
			if(Molpy.Has(cost)) {
				var mult=1;
				while ((mult==1 || me.Level >= 10*mult) && 
					Molpy.Has('Vacuum',cost.Vacuum*mult*10) && 
					Molpy.Has('Blackprints',cost.Blackprints*mult*10)) mult *=10;
				cost.Vacuum *= mult;
				cost.Blackprints *= mult;
				str += '<br><input type="Button" value="Increase" onclick="Molpy.SuckMore(' + mult +
	       				')"></input> the vacuum rate by ' + Molpify(mult,2) + ' at a cost of ' + Molpy.PriceString(cost) + '.';
			} else {
				str += '<br>It will cost ' + Molpy.PriceString(cost) + ' to increase this by 1.';
			}
			var downCost = {
				QQ: 1000 * n
			};
			if(!Molpy.Boosts['No Sell'].power && n > 1) {
				if(Molpy.Has(downCost)) {
					str += '<br><input type="Button" value="Decrease" onclick="Molpy.SuckMore(-1)"></input> the vacuum rate by 1 at a cost of ' + Molpy.PriceString(downCost) + '.';
				} else {
					str += '<br>It will cost ' + Molpy.PriceString(downCost) + ' to decrease this by 1.';
				}
			}
			return str;
		},
		
		price: {
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '60W',
			Vacuum: '50K'
		},
		
		defStuff: 1,
		
		buyFunction: function() {
			this.Level = 1;
		}
	});
	
	Molpy.SuckMore = function(num)// or less
	{
		Molpy.Anything = 1;
		var me = Molpy.Boosts['TS'];
		var n = me.Level;
		var cost = {
			Vacuum: (Math.abs(2000 - n) * n) *num,
			Blackprints: (Math.floor(n * 1000 * Math.pow(1.01, Molpy.Level('Vacuum') / 100))) *num
		};
		if(num < 0) {
			if (n < 2) return;
			cost = {QQ: 1000 * n};
		}
		if(Molpy.Spend(cost)) {
			me.Add(num);
			Molpy.Notify('Adjusted This Sucks');
			if (me.Level > 4444) Molpy.UnlockBoost('blackhat');
			if(num > 0)
				_gaq && _gaq.push(['_trackEvent', 'Boost', 'Upgrade', me.name]);
			else
				_gaq && _gaq.push(['_trackEvent', 'Boost', 'Downgrade', me.name]);
		} else {
			me.Refresh();
			Molpy.Notify('Could not afford to adjust This Sucks');
		}
	}
	
	new Molpy.Boost({
		name: 'Safety Net',
		icon: 'safetynet',
		group: 'chron',
		desc: 'Stops temporal rifts to shortpix. Does not prevent intentional Jumps to shortpix',
		
		price: {
			Sand: Infinity,
			Castles: Infinity
		},
	});
	new Molpy.Boost({
		name: 'Safety Blanket',
		icon: 'safetyblanket',
		group: 'chron',
		desc: 'Stops you losing longpix only boosts when you jump or rift to shortpix (They stop working, but remain)',
		
		price: {
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: Infinity
		},
	});
	new Molpy.Boost({
		name: 'Aleph One',
		icon: 'alephone',
		group: 'bean',
		className: 'toggle',
		
		desc: function(me) {
			var str = 'When active, as long as the sand/castle numbers are not mustard, allows an infinite amount of sand/castles to be spent without affecting the sand/castle supply.';
			if(me.bought)
				str += '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="' + (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>';
			return str
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		
		price: {
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: Infinity,
			QQ: '10G',
			Blackprints: '10G'
		}
	});
	new Molpy.Boost({
		name: 'Western Paradox',
		icon: 'westernparadox',
		group: 'ninj',
		className: 'toggle',
		
		price: {
			Sand: Infinity,
			Castles: Infinity,
			Goats: 1000
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		
		desc: function(me) {
			var str = 'When active, triples the time before the NewPixBots activate.';
			if(me.bought)
				str += '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ',1)" value="'
					+ (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>';
			return str
		}
	});
	new Molpy.Boost({
		name: 'Kite and Key',
		icon: 'kiteandkey',
		group: 'bean',
		
		desc: function(me){
			return 'Restores a small portion of your Lightning Rod power when you Molpy Down.<br>'
				+ 'Your Lightning Rod power can not fall below ' + Molpify(me.power, 1) + '.';
		},
		
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '1KW',
		},
		
		buyFunction: function() {
			if(this.power < 400)
				this.power = Math.sqrt(Molpy.Boosts['LR'].power) || 400;
			if(this.power > 1e155)
				this.power = 1e155;
			if(Molpy.Boosts['LR'].power < this.power)
				Molpy.Boosts['LR'].power = this.power;
		}
	});
	new Molpy.Boost({
		name: 'Lightning in a Bottle',
		icon: 'lightninginabottle',
		group: 'bean',
		
		desc: function(me){
			return 'Restores a lot of your Lightning Rod power when you Molpy Down.<br>'
				+ 'Capped at ' + Molpify(1e252, 1) + ' stored power.<br>'
				+ 'Your Lightning Rod power can not fall below ' + Molpify(me.power,1) + '.';
		},
		
		price:{
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: '1WWW',
		},
		
		buyFunction: function() {
			if(this.power < 400)
				this.power = (Molpy.Boosts['LR'].power * 1e-36) || 400;
				if(this.power > 1e252)
					this.power = 1e252;
			if(Molpy.Boosts['LR'].power < this.power)
				Molpy.Boosts['LR'].power = this.power;
		}
	});

	Molpy.PapalDecrees = {
		Sand: {desc:'XX% more Sand from Sand Tools', value:1.2, avail: function() { return isFinite(Molpy.Boosts['Sand'].sandPermNP)}},
		Castles: {desc:'XX% more Castles from Castle Tools', value:1.1, avail: function() { return isFinite(Molpy.Boosts['Castles'].power)}},
		Chips: {desc:'XX% more Chips from Glass Furnace', value:1.1, avail: function() { return Molpy.Got('GlassChips')&&isFinite(Molpy.Boosts['GlassChips'].chipsPermNP)&&Molpy.Boosts['GlassChips'].chipsPermNP>0}},
		Blocks: {desc:'XX% more Blocks from Glass Blower', value:1.1, avail: function() { return Molpy.Got('GlassBlocks')&&isFinite(Molpy.Boosts['GlassBlocks'].blocksPermNP)&&Molpy.Boosts['GlassBlocks'].blocksPermNP>0}},
		Flux: {desc:'XX% more Flux Crystals from a Flux Harvest', value:1.1, avail: function() { return Molpy.Got('Flux Harvest') && isFinite(Molpy.Level('FluxCrystals'))}},
		BlackP: {desc:'XX% more Blackprints from Vaults', value:1.1, avail: function() { return Molpy.Level('AC') > 180 && isFinite(Molpy.Level('Blackprints'))}},
		GlassSand: {desc:'XX% more Glass Chips from Glass Sand Tools', value:1.1, avail: function() { return Molpy.Got('Tool Factory') && isFinite(Molpy.Boosts['TF'].loadedPermNP)}},
		GlassCastle: {desc:'XX% more Glass Chips from Glass Castle Tools', value:1.1, avail: function() { return Molpy.Got('Tool Factory') && isFinite(Molpy.Boosts['TF'].loadedPermNP)}},
		GlassSaw: {desc:'XX% more Glass Blocks from using the Glass Saw', value:1.1, avail: function() { return Molpy.Got('Glass Saw') && !Molpy.Earned('Infinite Saw')}},
		QQs: {desc:'XX% more Question Qubes from the Logicat', value:1.1, avail: function() { return Molpy.Got('QQ') }},
		Goats: {desc:'XX% more Goats from Ninja Ritual', value:1.1, avail: function() { return Molpy.Got('Ninja Ritual') && isFinite(Molpy.Level('Goats'))}},
		Bonemeal: {desc:'XX% more Bonemeal from the Shadow Dragon', value:1.1, avail: function() { return Molpy.Got('ShadwDrgn')}},
		Logicats: {desc:'XX% more Logicats Levels from the Caged Logicat', value:1.1, avail: function() { return Molpy.Boosts['Logicat'].bought > 100}},
		Fractal: {desc: 'Fractal Sandcastles are XX% better', value:1.1, avail: function() {return Molpy.Got('Fractal Sandcastles') && isFinite(Molpy.Boosts['Castles'].power) }},
		Ninja: {desc: 'XX% increase in Ninja Stealth', value:1.1, avail: function() {return Molpy.Got('Ninja League') && Molpy.ninjaStealth > 10}},
		ToolF: {desc: 'XX% less chips used in the tool factory', value:0.9, avail: function() {return Molpy.Got('Tool Factory') && isFinite(Molpy.toolsBuiltTotal)}},
		Dyson: {desc: 'XX% more Vacuums from the Vacuum Cleaner', value:1.1, avail: function() { return Molpy.Level('TS') > 10 && isFinite(Molpy.Level('Vacuum'))}},
		Mustard: {desc:'XX% more Mustard', value:1.1, avail: function() { return Molpy.Has('Mustard',100) && isFinite(Molpy.Level('Mustard'))} },
		Experience: {desc:'XX% more Experience', value:1.1, avail: function() { return Molpy.Level('DQ') }},
		Gold: {desc:'XX% more Gold', value:1.1, avail: function() { return Molpy.Earned('Millionair') && isFinite(Molpy.Level('Gold')) }},
		Diamonds: {desc:'XX% more Diamonds', value:1.1, avail: function() { return Molpy.DragonDigRate > 1e8 && isFinite(Molpy.Level('Diamonds')) }},
		Master: {desc:'XX% less time for each masterpiece stage', value:0.9, avail: function() { return Molpy.groupBadgeCounts.diamm >= 10 }},
		//: {desc:'', value:1.1, avail: function() {}},
	}
	Molpy.Hash = function(brown) {
		var res = 0;
		var chrs = brown.split('');
		for (var c in chrs) { res = (((res<<1) + chrs[c].charCodeAt()) & 0x7FFFFFFF) + (res>>>16)};
		return res;
	}
	Molpy.Decreename = '';
	Molpy.PapalBoostFactor = 1;
	Molpy.SetPapalBoostFactor = function() { if (Molpy.Got('Hugo')) Molpy.PapalBoostFactor = 1 + (Molpy.BadgesOwned + (Molpy.groupBadgeCounts.diamm || 0)*6)/100000 };

	new Molpy.Boost({
		name: 'The Pope',
		icon: 'the_pope',
		group: 'bean',
		className: 'action',
		logic: 2,
		
		price: {
			Sand: 50000,
			Castles: 20000
		},
		
		desc: function(me) {
			var str = 'Gives one selectable small boost until after the next ONG.';
			if (!me.bought) return str;
			Molpy.SetPapalBoostFactor();
			if (me.power) {
				var mod = Molpy.Decree.value > 1 ? (( Molpy.Decree.value*Molpy.PapalBoostFactor -1)*100) : 
							     ((1-Molpy.Decree.value/Molpy.PapalBoostFactor)*100);
				var desc = Molpy.Decree.desc.replace(/XX/,mod.toFixed(2));
				str += '<br>The current decree is: ' + desc;
			} else {
				str += '<br>Select a boost:';
				for (var dec in Molpy.PapalDecrees) {
					var decree = Molpy.PapalDecrees[dec];
					if (decree.avail()) {
						var mod = decree.value > 1 ? (( decree.value*Molpy.PapalBoostFactor -1)*100) : 
									     ((1-decree.value/Molpy.PapalBoostFactor)*100);
						var desc = decree.desc.replace(/XX/,mod.toFixed(2));
						str += '<br><input type="radio" onclick="Molpy.SelectPapalDecree(\''+dec+'\')"></input> '+ desc;
					}
				}
			}
			return str
		},

		reset: function() {
			this.power = 0;
			Molpy.Decreename = '';
			this.Refresh();
		},

		loadFunction: function() {
			if (this.power) {
				Molpy.Decreename = '';
				for (var name in Molpy.PapalDecrees) { 
					if (Molpy.Hash(name) == this.power) {
						Molpy.Decreename = name;
						Molpy.Decree = Molpy.PapalDecrees[name];
						return;
					}
				}
				this.power = 0;
			}
		},
		
		// deactivate if decreed
		classChange: function() { return !Molpy.Boosts['The Pope'].power ? 'action' : '' },
	});

	Molpy.SelectPapalDecree = function(name) {
		Molpy.Anything = 1;
		Molpy.Decree = Molpy.PapalDecrees[name];
		Molpy.Boosts['The Pope'].power = Molpy.Hash(name);
		Molpy.Decreename = name;
		Molpy.Boosts['The Pope'].Refresh();
		Molpy.SetPapalBoostFactor();
	}

	Molpy.Papal = function(raptor) {
		return (Molpy.Decreename != raptor)? 1: (Molpy.Decree.value > 1)? Molpy.Decree.value*Molpy.PapalBoostFactor : Molpy.Decree.value/Molpy.PapalBoostFactor 
	}
	new Molpy.Boost({
		name: 'Fertiliser',
		icon: 'fertiliser',
		group: 'hpt',
		className: 'toggle',
		price: {Bonemeal:'1M',FluxCrystals:'10M',QQ:'1G'},
		desc: function(me) {
			var str = 'When active, after consuming 1000 Bonemeal + 2%, gives a 0.1% bonus per 1000 Bonemeal to a Flux Harvest using over 100 temporal rifts.';
			if(me.bought)
				str += '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="' + (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>';
			return str
		},
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
	});
	new Molpy.Boost({
		name: 'Black Hole',
		icon: 'blackhole',
		group: 'hpt',
		price: {Blackprints:Infinity,FluxCrystals:Infinity,QQ:'10T',Vacuum:'10M'},
		desc: 'Doubles the Vacuum from the Vacuum Cleaner'
	});
	new Molpy.Boost({
		name: 'Overtime',
		icon: 'overtime',
		group: 'hpt',
		price: {Blackprints:'1M',FluxCrystals:'1M',QQ:'1M',Goats:1000,Vacuum:1000},
		desc: 'When on longpix, the Vacuum Cleaner runs twice every mnp'
	});
	new Molpy.Boost({
		name: 'Ritual Sacrifice',
		icon: 'ritualsacrifice',
		group: 'ninj',
		className: 'toggle',
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		
		desc: function(me) {
			var str = 'When you interrupt a Ninja Ritual streak longer than 25 and less than 101, sacrifice 5 goats keep it going.';
			if(me.bought)
				str += '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ',1)" value="'
					+ (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>';
			return str
		},
	
		price: {Goats: 375}
	});
	new Molpy.Boost({
		name: 'Ritual Rift',
		icon: 'ritualrift',
		group: 'ninj',
		className: 'toggle',
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		
		desc: function(me) {
			var str = 'If Ninja Ritual is interrupted, use streak/10 flux crystals to warp time to before it happened, keeping the streak alive.<br>'
				+ 'Current cost: ' + Molpify(Math.floor(Molpy.Boosts['Ninja Ritual'].power / 10)) + ' Flux Crystals';
			if(me.bought)
				str += '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ',1)" value="'
					+ (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>';
			return str
		},
		
		price: {
			Goats: 450,
			FluxCrystals:750
			}
	});
	new Molpy.Boost({
		name: 'Blackprint Plans',
		icon: 'blackprints',
		group: 'bean',
		
		desc: function(me) {
			var pBoost = Molpy.Boosts[Molpy.GetBlackprintSubject(1)];
			return 'Allows you to construct ' + (pBoost ? pBoost.name : 'new Boosts')
				+ ' with Factory Automation. (See Rosetta to start construction.)'
		},

		stats: function(me) {
			return '(Or Blueprints if you\'re into Chromatic Heresy)<br>' + me.desc();
		},

		price:{
			Sand: function() {
				return Molpy.LogiMult('80YW');
			},
	
			Castles: function() {
				return Molpy.LogiMult('40YW');
			},
	
			GlassBlocks: function() {
				return Molpy.LogiMult('25K');
			},
		},

		lockFunction: function() {
			var s = Molpy.GetBlackprintSubject(1);
			if(!s) return;
			Molpy.Spend({
				Blackprints: Molpy.blackprintCosts[s]
			});
			Molpy.UnlockBoost(s);
			Molpy.Boosts[s].buy();
			if(Molpy.Boosts[s].bought) {
				Molpy.Notify(Molpy.Boosts[s].name + ' has been constructed', 1);
			} else {
				Molpy.Notify(Molpy.Boosts[s].name + ' has been constructed and is available for purchase', 1);
			}
		}
	});
	new Molpy.Boost({
		name: 'Shadow Feeder',
		icon: 'shadowdragon',
		group: 'drac',
		className: 'toggle',
		defStuff:1,

		desc: function(me) {
			var str = (me.IsEnabled ? 'I' : 'When active, i') + 'f at the Crouching Dragon limit (i.e. you have 100 Logicat Puzzles unsolved) when Zookeeper runs, spends 5 Bonemeal to activate the Shadow Dragon.';
			if(me.IsEnabled){
				var uses = Molpy.PokeBar()-me.Level;
				str+='<br>Has '+Molpify(uses) + ' use'+plural(uses)+' left this NewPix';
			}
			if(me.bought)
				str += '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ',1)" value="' + (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>';
			return str;
		},
		
		unlockFunction: function() {
			this.Level=1;
		},

		IsEnabled: Molpy.BoostFuncs.PosPowEnabled,

		price: {
			Bonemeal: 10000
		}
	});

	new Molpy.Boost({
		name: 'Lodestone',
		icon: 'lodestone',
		group: 'hpt',
		price: {FluxCrystals:Infinity, Goats:100},
		desc: 'Gives Mysterious Maps a Jump to the nearest discovery to the next map',
		buyFunction: function() { Molpy.Boosts['Maps'].Refresh(); },
	});

	new Molpy.Boost({
		name: 'Cress',
		icon: 'cress',
		group: 'ninj',
		price: { Mustard:10000, Goats:10000 },
		desc: function(me) {
			var str = 'When active multiplies Mustard gains by a thousandth of your Goats.'
			if (me.bought) str += '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="' + (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>';
			return str;
		},
		IsEnabled: Molpy.BoostFuncs.PosPowEnabled,
		className: 'toggle',
	});

	new Molpy.Boost({
		name: 'Time Dilation',
		icon: 'timedilation',
		group: 'chron',
		price: {FluxCrystals:Infinity, Blackprints:Infinity, Goats:10000},
		className: 'toggle',
		desc: function(me) {
			var str = 'There is a mnp every 1.8 seconds, irrespective of the length of the ONG';
			if (me.bought) str += '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="' + (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>';
			return str;
		},
		IsEnabled: Molpy.BoostFuncs.PosPowEnabled,
		AfterToggle: function() {
			Molpy.mNPlength = (Molpy.IsEnabled('Time Dilation')?1800:Molpy.NPlength);
		},
	});

	new Molpy.Boost({
		name: 'Shadow Ninja',
		icon: 'shadowninja',
		group: 'ninj',
		desc: 'When the shadow feeder runs and the Italian Plumber is not active, it may also do a Ninja Ritual',
		price: {Goats: 50000, FluxCrystals:Infinity, Mustard:10000},
	});

	new Molpy.Boost({
		name: 'Ninja Tortoise',
		icon: 'tortoise',
		alias: 'Zooman', // Because
		desc: 'Increases the rate Ninja Ritual streak grows',
		price: {Goats: 1e7, Mustard: 1e7},
		group: 'ninj',
	});

	new Molpy.Boost({
		name: 'Tangled Tessaract',
		icon: 'tessaract',
		desc: function(me) {
			var str = 'When active you get 3 times as many Logicat Levels, but no rewards from puzzles.';
			if (me.bought) str += '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="' + (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>';
			return str;
		},
		IsEnabled: Molpy.BoostFuncs.PosPowEnabled,
		className: 'toggle',
		price: {QQ: '1P', Mustard: 1e8},
		group: 'bean',
		className: 'toggle',
	});

	new Molpy.Boost({
		name: 'Bananananas',
		icon: 'banana',
		group: 'drac',
		desc: 'When the Shadow Feeder runs, and the number of Puzzles available is more those being solved, it replaces that number, otherwise the shadow feeder converts them to bonemeal',
		price: {Bonemeal: 123454321},
	});
	new Molpy.Boost({ 
		name: 'Diamonds',
		single: 'Diamond',
		icon: 'diamond',
		group: 'stuff',
		stats: 'From defeating knights', 
		desc: function(me) {
			var str = 'You have ' + Molpify(me.Level, 3) + ' Diamond' + plural(me.Level) + '.';
			return str;
		},
		defStuff: 1,
		AddSuper : Molpy.BoostFuncs.Add,
		Add: function(amount) {
			this.AddSuper(Math.floor(amount*Molpy.Papal('Diamonds')));
			if (this.power > 9.9455e33) Molpy.EarnBadge('Enough to make a star');
		}
	});
	new Molpy.Boost({
		name: 'What if we tried more power?',
		alias: 'blackhat',
		icon: 'blackhat',
		group: 'hpt',
		desc: function(me) {
			var str = 'Significantly improves the Black Hole';
			if (me.bought) {
				if (Molpy.Got('DQ')) str += ' and other things';
				str += '.<br>Power currently '+(me.power || 1);
				for (var thing in Molpy.NestLinings) {
					var stuff = Molpy.Boosts[Molpy.NestLinings[thing]];
					if (stuff.Level == Infinity && ((me.bought & (1<<thing)) == 0)) {
						str += '<br>Spend Infinite <input type=button onclick="Molpy.MorePower('+thing+')" value="'+stuff.plural+
							'"></input> to raise the power by 1.';
					}
				}
			}
			return str;
		},
		price: {
			Sand: Infinity,
			Castles: Infinity,
			GlassBlocks: Infinity,
			Blackprints: Infinity,
			FluxCrystals: Infinity,
			Vacuum:'1G',
		},
		className: 'action',
		classChange: function() { 
			for (var thing in Molpy.NestLinings) {
				var stuff = Molpy.Boosts[Molpy.NestLinings[thing]];
				if (stuff.Level == Infinity && ((this.bought & (1<<thing)) == 0)) return 'action';
			}
			return '';
		},
		buyFunction: function() { this.power = 1 },
		Level: Molpy.BoostFuncs.PosPowerLevel,
	});
	Molpy.MorePower = function(thing) {
		Molpy.Anything = 1;
		var stuff = Molpy.Boosts[Molpy.NestLinings[thing]];
		var me = Molpy.Boosts['blackhat'];
		if ((me.bought & (1<<thing)) == 0) {
			if (Molpy.Spend(stuff.alias,Infinity)) {
				me.bought |= (1<<thing);
				me.power += 1;
				me.Refresh();
				Molpy.Notify('More Power to the Black Hole',1);
			} else {
				Molpy.Notify('You need Infinite '+stuff.name+' to upgrade');
			}
		}
	}
	new Molpy.Boost({
		name: 'Mutant Tortoise',
		icon: 'sixlegs',
		group: 'ninj',
		desc: 'Do Tortoises run that fast?',
		stats: 'Speeds up the rate of Ninja Ritual Growth',
		price: {Vacuum:'1P'},
	});
	new Molpy.Boost({
		name: 'Centenarian Mutant Ninja Tortoise',
		alias: 'CMNT',
		icon: 'cmnt',
		group: 'ninj',
		desc: 'Do Tortoises eat Panthers?',
		stats: 'Get more Goats from the Ninja Ritual',
		price: {
			Goats:'1S',
			Vacuum:'6.666E',
		},
	});
	new Molpy.Boost({
		name: 'Marketing',
		desc: 'Numbers don\'t have to add up',
		group: 'hpt',
		icon: 'marketing',
	});
	new Molpy.Boost({ // Note nothing is going to spend gold - dragons hoard it
		name: 'Gold',
		plural: 'Gold',
		desc: function(me) {
			if (!me.bought) return 'Gold, Gold, Gold, Gold!';
			if (!me.power) return 'Gold whats that?';
			if (me.power >= 1) return 'You have ' + Molpify(me.power,3) + ' Gold';
			if (me.power >= 0.001) return 'You have ' + Molpify(me.power*1000,3) + ' Silver';
			return 'You have ' + Molpify(me.power*1000000,3) + ' Copper';
		},
		group: 'stuff',
		icon: 'money',
		defStuff : 1,
		AddSuper : Molpy.BoostFuncs.Add,
		Add: function(amount) {
			this.AddSuper(amount*Molpy.Papal('Gold'));
			if (this.power > 1) Molpy.UnlockBoost('Ooo Shiny!');
			if (this.power > 1e6) Molpy.EarnBadge('Millionair');
			if (this.power > 77.3e9) Molpy.EarnBadge('Bill Gates');
			if (this.power > 91e12) Molpy.EarnBadge('GDP of the World');
		}
	});
	new Molpy.Boost({
		name: 'Princesses',
		single: 'Princess',
		desc: function (me) {
			if (me.power == 1) return 'You have one Tasty Princess';
			return 'You have ' + Molpify(me.power) + ' Tasty Princesses';
		},
		group: 'stuff',
		icon: 'princess',
		defStuff : 1,
		AddSuper : Molpy.BoostFuncs.Add,
		Add: function(amount) {
			this.AddSuper(amount);
			if (this.power > 1e9) Molpy.UnlockBoost('Billionair'); // this is rubbish at the moment
		}
	});
	new Molpy.Boost({
		name: 'Raptorish Dragon Keeping Manual',
		alias: 'RDKM',
		group: 'drac',
		icon: 'rdkm',
		desc: function (me) {
			var str = 'This has lots of useful information that will change as you do things...';
			var draglevel = Molpy.Level('DQ');
			if (!me.bought) return str;
			str += '<br><ul class=rdkm>';
			if (!Molpy.Level('Eggs')) {
				str += '<li>Line the nest before you start laying eggs';
				str += '<li>Linings of Sand and Castles give offence';
				str += '<li>Linings of Glass Chips and Blocks give defence';
				str += '<li>Linings of Blackprints and Flux Crystals give digging';
				if (Molpy.Has('Goats',Infinity) && Molpy.Has('Mustard',Infinity)) {
					str += '<li>Linings of Goats and Mustard give breath effects.';
					if (draglevel < Molpy.Dragons['Wyrm'].id) str += '  When you have the rght types of dragons.';
					}
				if (Molpy.Has('Bonemeal',Infinity) && Molpy.Has('Vacuum',Infinity)) str += '<li>Linings of Bonemeal and Vacuums give magic';
				if (Molpy.Has('Logicats',Infinity) && Molpy.Has('QQ',Infinity)) str += '<li>Linings of Logicat Levels and QQs give magic';
				if (Molpy.Has('Diamonds',Infinity) && Molpy.Has('Princesses',Infinity)) str += '<li>Linings of Diamonds and Princesses give better magic';
				if (Molpy.Has('Gold',Infinity)) str += '<li>Linings of Gold have no effect';
			};
			if (Molpy.Level('Eggs')) {
				str += '<li>You need to wait for the eggs to hatch';
			}
			str += '<li>Dragons have a hive mind, if one hides they all hide, if one is injured they all help heal the injuries'; 
			if (Molpy.Level('Hatchlings')) {
				str += '<li>When the eggs hatch, the Hatchlings will mature for many mnp.';
				str += '<li>Hatchlings need feeding, the better the food, the better the Dragon.';
				str += '<li>You will be notified when the Hatchlings are getting restless and want to fledge to their own teritories';
				str += '<li>To give a clutch of Hatchlings their own teritory. Go to a NP without any Dragons, a low positive number is recommended for early clutches';
				str += '<li>If you fail to give them their own territory after a while they will escape to another plane';
				str += '<li>If there are too many hatchlings for the NP the strongest will eat the rest';
				str += '<li>Once released they have to survive the locals and they can then can start digging for treasure';
			};
			if (draglevel || Molpy.TotalDragons) {
				str += '<li>Draglings are feeble creatures, they need looking after';
				str += '<li>Once they are established, they need to start digging';
				str += '<li>Digging finds Gold and Diamonds';
				str += '<li>Fighting opponents will get experience, diamonds and stuff';
				str += '<li>Many things will need diamonds and experence to buy';
				str += '<li>' + Molpy.Dragons['Dragling'].description();
			};
			if (draglevel >= Molpy.Dragons['DragonNewt'].id) {
				str += '<li>DragonNewts are Dragon whanabees, high on spirits, low on abilities but not entirely useless.';
				str += '<li>' + Molpy.Dragons['DragonNewt'].description();
			};
			if (draglevel >= Molpy.Dragons['Wyrm'].id) {
				str += '<li>Wyrms are the first real dragons, lacking arms or magic they can\'t dig very well';
				str += '<li>Work towards Diamond Masterpieces and make as many as you can';
				str += '<li>' + Molpy.Dragons['Wyrm'].description();
			};

			return str + '</ul>';
		},
		price: { Goats:'1G' },
	});

	new Molpy.Boost({
		name: 'Big Teeth',
		icon: 'bigteeth',
		group: 'drac',
		single: 'Big Tooth',
		desc: function(me) {
			str = 'Increases the offensive value of Dragons';
			if (me.bought) str += '.  You have ' + Molpify(me.bought) + ' ' + (me.bought>1?me.name:me.single);
			return str;
		},
		price: {
			Diamonds:10,
			exp: function (me) { return Math.pow(5,me.Level+1) }
		},
		draglvl: 'Dragling',
		limit: function() { return 8*(Molpy.Level('DQ')+1) },
		Level: Molpy.BoostFuncs.Bought0Level,
	});

	new Molpy.Boost({
		name: 'Spines',
		icon: 'spines',
		group: 'drac',
		single: 'Spine',
		desc: function(me) {
			str = 'Increases the defense value of Dragons';
			if (me.bought) str += '.  You have ' + Molpify(me.bought) + ' ' + (me.bought>1?me.plural:me.single);
			return str;
		},
		price: {
			Diamonds:20,
			exp: function (me) { return Math.pow(5,me.Level+1) }
		},
		draglvl: 'Dragling',
		limit: function() { return 8*(Molpy.Level('DQ')+1) },
		Level: Molpy.BoostFuncs.Bought0Level,
	});

	new Molpy.Boost({
		name: 'Tusks',
		icon: 'tusks',
		group: 'drac',
		single: 'Tusk',
		desc: function(me) {
			str = 'Increases the offensive value of Dragons';
			if (me.bought) str += '.  You have ' + Molpify(me.bought) + ' ' + (me.bought>1?me.plural:me.single);
			return str;
		},
		draglvl: 'DragonNewt',
		price: {
			Diamonds:100,
			exp: function (me) { return Math.pow(20,me.Level+1) }
		},
		limit: 8,
		Level: Molpy.BoostFuncs.Bought0Level,
	});

	new Molpy.Boost({
		name: 'Adamantine Armour',
		icon: 'armour',
		group: 'drac',
		desc: function(me) {
			str = 'Increases the defense value of Dragons';
			if (me.bought) str += '.  You have ' + Molpify(me.bought) + ' piece' + plural(me.bought) + ' of '+me.name;
			return str;
		},
		draglvl: 'DragonNewt',
		limit: function() { return 8*(Molpy.Level('DQ')) },
		Level: Molpy.BoostFuncs.Bought0Level,
		price: {
			Diamonds:1000,
			exp: function (me) { return Math.pow(20,me.Level+1) }
		},
	});

	new Molpy.Boost({
		name: 'Mouthwash',
		icon: 'mouthwash',
		group: 'bean',
		desc: 'Reduces Breath weapon side effects',
		draglvl: 'Dragon',
	});

	new Molpy.Boost({
		name: 'Coal',
		icon: 'coal',
		plural: 'Coal',
		desc: function(me) {
			var str = 'Needed to bake masterpieces and may improve dragon breath';
			if (me.Level) str += '. You have '+Molpify(me.Level)+' coal';
			return str;
		},
		defStuff: 1,
		group: 'stuff',
	});

	new Molpy.Boost({
		name: 'Magic Teeth',
		icon: 'magicteeth',
		group: 'drac',
		single: 'Magic Tooth',
		desc: function(me) {
			str = 'Increases the offence value of Dragons';
			if (me.bought) str += '.  You have ' + Molpify(me.bought) + ' ' + (me.bought>1?me.name:me.single);
			return str;
		},
		draglvl: 'Dragon',
		price: {
			Diamonds:'1G',
			exp: function (me) { return 1e11*Math.pow(10,me.Level+1) }
		},
		limit: 50,
		Level: Molpy.BoostFuncs.Bought0Level,
	});

	new Molpy.Boost({
		name: 'Bucket and Spade',
		icon: 'bucketspade',
		group: 'hpt',
		desc: 'Improves Dragon digging',
		draglvl: 'DragonNewt',
		price: {
			Diamonds:'100K',
			QQ:'1H',
			},
	});

	new Molpy.Boost({
		name: 'Lucky Ring',
		icon: 'luckring',
		group: 'drac',
		desc: 'Increases Draconic luck',
		draglvl: 'Wyvern',
	});

	new Molpy.Boost({
		name: 'Ooo Shiny!',
		icon: 'shiny',
		desc: 'Improves Dragons in Mysterious ways',
		group: 'drac',
		price: {
			Bonemeal:'1T',
			QQ:'1H',
			},
	});

	new Molpy.Boost({
		name: 'Healing Potion',
		icon: 'healingpotion',
		group: 'bean',
		desc: function(me) {
			str = 'Increases Draconic Health and speeds up healing';
			if (me.bought) str += '.  You have ' + Molpify(me.bought) + ' ' + (me.bought>1?me.plural:me.single);
			return str;
		},
		draglvl: 'DragonNewt',
		limit: 4,
		defStuff: 1,
		Spend: function() {
			if (!this.bought) return false;
			this.bought--;
			if (this.unlocked > 1) this.unlocked--
			else this.Lock();
			return true;
		},
		price: {
			Diamonds:'1K',
			exp: function () { return Math.pow(1000,Molpy.Level('DQ')+1) }
		},
		Level: Molpy.BoostFuncs.Bought0Level,
	});

	new Molpy.Boost({
		name: 'Strength Potion',
		icon: 'strengthpotion',
		desc: function(me) {
			str = 'Increases Draconic Strength';
			if (me.bought) str += '.  You have ' + Molpify(me.bought) + ' ' + (me.bought>1?me.plural:me.single);
			return str;
		},
		draglvl: 'Wyrm',
		group: 'bean',
		limit: function() { return Molpy.Got('Dragonfly')?4:1 },
		defStuff: 1,
		Spend: function() {
			if (!this.bought) return false;
			this.bought--;
			this.unlocked--;
			return true;
		},
		price: {
			Diamonds:'1M',
			exp: function () { return Math.pow(1000,Molpy.Level('DQ')*2) }
		},
		Level: Molpy.BoostFuncs.Bought0Level,
	});

	new Molpy.Boost({
		name: 'The Fading',
		icon: 'fading',
		desc: 'The Dragon Forge Logicat costs depend on when you look',
		group: 'chron',
		price: {QQ:'1.024F'},
		buyFunction: function() { Molpy.Boosts['Dragon Forge'].Refresh(); },
			
	});

	new Molpy.Boost({
		name: 'Aleph e',
		icon: 'alephe',
		group: 'bean',
		className: 'toggle',
		
		desc: function(me) {
			var str = 'When active, as long as the Chip/Block numbers are infinite, allows an infinite amount of Glass Chips and Glass Blocks to be spent without affecting the chip or block supply.';
			if(me.bought)
				str += '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="' + (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>';
			return str;
		},
		
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		
		price: {
			Goats: Infinity,
			Mustard: Infinity,
			QQ: '1F',
			Blackprints: Infinity,
			FluxCrystals: Infinity,
		}
	});

	new Molpy.Boost({ 
		name: 'Beach Dragon',
		icon: 'beachdragon',
		desc: 'Enables Beach digging to enhance the dragon digging',
		group: 'drac',
		price: {Goats:'1T',
			Bonemeal:'1P',
			QQ:'1E',
			},
	});

	new Molpy.Boost({
		name: 'Cup of Tea',
		icon: 'cuptea',
		plural: 'Cups of Tea',
		desc: function(me) {
			str = 'Reduces the time dragons need to recover after injury';
			if (me.bought) str += '.  You have ' + Molpify(me.bought) + ' ' + (me.bought>1?me.plural:me.single);
			return str;
		},
		group: 'bean',
		draglvl: 'Dragling',
		limit: 4,
		defStuff: 1,
		Spend: function() {
			if (!this.bought) return false;
			this.bought--;
			if (this.unlocked > 1) this.unlocked--
			else this.Lock();
			return true;
		},
		Level: Molpy.BoostFuncs.Bought0Level,
		price: {
			Diamonds:1,
			exp: 100,
		},
	});

	new Molpy.Boost({
		name: 'Diamond Mould Making',
		icon: 'diamould',
		alias: 'DMM',
		desc: function(me) {
			var str = 'Makes a mould to fill with diamonds. ';
			if (me.bought && Molpy.Boosts.DMP.bought) {
				switch (me.State) {
				case 0: 
					str += '<br>Gaze at a Glass Monument to contemplate making a Diamond Masterpiece';
					break;
				case 1:
					str += '<br>Making the mould for NP'+me.Making+ ' it will be finished in '+MolpifyCountdown(me.countdown);
					break;
				case 2:
					str += '<br>You have a complete Mould made for NP'+me.Making;
					if (Molpy.Boosts['DMF'].State == 0) {
						str += '<input type=button value="Start Filling" onclick="Molpy.Boosts[\'DMF\'].StartFill()"></input> '+
							'It needs '+Molpify(Molpy.Boosts['DMF'].FillCost(me.Making),2)+' Diamonds every mNP for '+Molpy.Boosts['DMF'].FillTime(me.Making)+' mNP';
					};
					break;
				}
			}
			return str;
		},
		group: 'drac',
		price: {Diamonds: '10M', Goats: Infinity }, 
		Making: 0,
		State: 0, //0 free, 1 Making, 2 Made
		defSave: 1,
		saveData: { 4:['Making', 0, 'int'],
	       		    5:['State',0,'int'],
		},
		buyFunction: function() {
			this.Making = 0;
			this.State = 0;
		},
		countdownFunction: function() {
			if (this.State == 1 && this.Making != Molpy.newpixNumber) {
				this.State = 0;
				Molpy.Notify('I told you to keep still - the mould is ruined',1);
				this.countdown = 0;
			}
		},
		callcountdownifCMS: 1,
		countdownLockFunction: function() {
			if (this.State == 1) {
				this.State = 2;
				Molpy.Notify('A Diamond mould for NP'+this.Making+' is now complete',1);
			}
		},
		StartMould: function() {
			if (this.State != 0) {
				if (this.State == 1) {
					Molpy.Notify('You are already making a Mould for NP '+this.Making,1)
				} else {
					Molpy.Notify('You have a complete Mould for NP '+this.Making+' awaiting filling',1)
				}
				return;
			}
			var npd = Molpy.NPdata[Molpy.newpixNumber];
			if (Molpy.newpixNumber != Molpy.Boosts.Muse.power || !npd || npd.amount != Molpy.MaxDragons()) return;

			var cost = this.MouldCost(Molpy.newpixNumber);
			if (!Molpy.Spend('Diamonds',cost)) {
				Molpy.Notify('You need '+Molpify(cost)+' diamonds',1);
				return;
			}
			this.Making = Molpy.newpixNumber;
			Molpy.LockBoost('Muse');
			this.State = 1;
			this.countdown = this.MouldTime(this.Making);
			Molpy.Notify('Mould started for NP'+this.Making+' - KEEP STILL',1);
		},
		BreakMould: function() {
			this.Making = 0;
			this.State = 0;
			this.countdown = 0;
		},
		MouldCost: function(np) {
			return Math.floor(Math.pow(Math.sin(np*Math.PI/180),2)*Math.pow(2.714,np/42)*Math.log(np+10)*Math.LOG10E*1e9)
		},
		MouldTime: function(np) { return Math.floor((2714+np*np)*Molpy.Papal('Master')/Molpy.Boosts.ClawsDeck.factor(np)) },
		classChange: function() { return ['','alert','action'][this.State] },
	});

	new Molpy.Boost({ 
		name: 'Diamond Mould Filling',
		icon: 'diamfill',
		alias: 'DMF',
		sortAfter: 'DMM',
		group: 'drac',
		price: {Diamonds: '20M', Goats: Infinity },
		desc: function(me) {
			var str = 'Allows a Mould to be filled';
			if (me.bought && Molpy.Boosts.DMP.bought) {
				switch (me.State) {
				case 0: 
					str += '<br>You do not currently have a mould to be filled';
					break;
				case 1:
					str += '<br>Filling the mould for NP'+me.Making+ ' it will be finished in '+MolpifyCountdown(me.countdown);
					break;
				case 2:
					str += '<br>You have a completly filled mould for NP'+me.Making;
					if (Molpy.Boosts['DMC'].State == 0) {
						str += '<input type=button value="Start Cooking" onclick="Molpy.Boosts[\'DMC\'].StartCook()"></input> '+
							'It needs '+Molpify(Molpy.Boosts['DMC'].CookCost(me.Making),2)+' Coal every mNP for ' +
							Molpy.Boosts['DMC'].CookTime(me.Making)+
							' mNP.<br>'+Molpify(1e12)+' Diamonds can be used instead of a Coal';
					};
					break;
				}
			}
			return str;
		},
		Making: 0,
		State: 0, //0 free, 1 Making, 2 Made
		defSave: 1,
		saveData: { 4:['Making', 0, 'int'],
	       		    5:['State',0,'int'],
		},
		buyFunction: function() {
			this.Making = 0;
			this.State = 0;
		},
		countdownFunction: function() {
			if (this.State == 1 && !Molpy.Spend('Diamonds',this.FillCost(this.Making))) {
				this.State = 0;
				Molpy.Notify('Not enough diamonds to fill the mould this mNP - the mould is ruined',1);
				this.countdown = 0;
			}
		},
		countdownLockFunction: function() {
			if (this.State == 1) {
				if (Molpy.Spend('FluxCrystals',Infinity)) {
					this.State = 2;
					Molpy.Notify('The Diamond mould for NP'+this.Making+' is now completely filled',1);
				} else {
					this.State = 0;
					Molpy.Notify('You could not provide the flux Crystals to finish the filling - the mould is ruined',1);
				}
			}
		},
		StartFill: function() {
			if (this.State != 0) {
				if (this.State == 1) {
					Molpy.Notify('You are already filling a Mould for NP '+this.Making,1)
				} else {
					Molpy.Notify('You have a completely filled Mould for NP '+this.Making+' awaiting cooking',1)
				}
				return;
			}
			if (Molpy.Boosts['DMM'].State != 2) {
				Molpy.Notify('No Mould to fill',1)
				return;
			}
			this.Making = Molpy.Boosts['DMM'].Making;
			Molpy.Boosts['DMM'].State = 0;

			var cost = this.FillCost(this.Making);
			if (!Molpy.Spend('Diamonds',cost)) {
				Molpy.Notify('You need '+Molpify(cost)+' diamonds every mNP',1);
				return;
			}
			this.State = 1;
			this.countdown = this.FillTime(this.Making);
			Molpy.Notify('Filling started for NP'+this.Making+' - do not interrupt this',1);
		},
		BreakMould: function() {
			this.Making = 0;
			this.State = 0;
			this.countdown = 0;
		},
		FillCost: function(np) {
			var mcost = Molpy.Boosts['DMM'].MouldCost(np);
			return Math.floor(( mcost*2.22+Math.pow(mcost,np/333))/np);
		},
		FillTime: function(np) { return Math.floor(np*Molpy.Papal('Master')*Molpy.Boosts.Dragong.factor(np)) },
		classChange: function() { return ['','alert','action'][this.State] },
	});

	new Molpy.Boost({ 
		name: 'Camelflarge',
		icon: 'camel',
		desc: function(me) {
			str = 'Reduces the time dragons need to hide';
			if (me.bought) str += '.  You have ' + Molpify(me.bought) + ' ' + (me.bought>1?me.plural:me.single);
			return str;
		},
		group: 'drac',
		draglvl: 'Dragling',
		limit: function() {
			if (Molpy.Level('DQ') == 0) return 4;
			if (Molpy.Level('DQ') == 1) return 7;
			return 10;
		},
		Level: Molpy.BoostFuncs.Bought0Level,
		price: {
			Diamonds:10,
			exp: function () { return Math.pow(100,Molpy.Level('DQ')) }
		},
	});

	new Molpy.Boost({ 
		name: 'Diamond Masterpiece Cooker',
		icon: 'diamcook',
		alias: 'DMC',
		sortAfter: 'DMF',
		group: 'drac',
		price: {Diamonds: '40M', Goats: Infinity, Coal: 200 },
		desc: function(me) {
			var str = 'Allows a Mould filling to be fused into one';
			if (me.bought && Molpy.Boosts.DMP.bought) {
				switch (me.State) {
				case 0: 
					str += '<br>You have nothing to cook';
					break;
				case 1:
					str += '<br>Cooking the mould for NP'+me.Making+ ' it will be finished in '+MolpifyCountdown(me.countdown);
					break;
				case 2:
					str += '<br>You have a cooked Mould made for NP'+me.Making;
					if (Molpy.Boosts['DMB'].State == 0) {
						str += '<input type=button value="Start Burnishing" onclick="Molpy.Boosts.DMB.StartBurn()"></input> '+
							'It needs Infinite Goats and '+Molpify(Molpy.Boosts['DMB'].BurnCost(me.Making),2)+' Vacuum every mNP for '+
							Molpy.Boosts['DMB'].BurnTime(me.Making)+' mNP';
					};
					break;
				}
			}
			return str;
		},
		Making: 0,
		State: 0, //0 free, 1 Making, 2 Made
		defSave: 1,
		saveData: { 4:['Making', 0, 'int'],
	       		    5:['State',0,'int'],
		},
		buyFunction: function() {
			this.Making = 0;
			this.State = 0;
		},
		countdownLockFunction: function() {
			if (this.State == 1) {
				this.State = 2;
				Molpy.Notify('The Diamond Masterpiece for NP'+this.Making+' is now completely Cooked, do not drop it',1);
			}
		},
		countdownFunction: function() {
			var cost = this.CookCost(this.Making);
			if (Molpy.Level('Coal') >= cost) {
				Molpy.Spend('Coal',cost)
			} else {
				var needed = (cost - Molpy.Level('Coal'))*1e12;
				if (Molpy.Has('Diamonds',needed)) {
					Molpy.Spend('Coal',Molpy.Level('Coal'));
					Molpy.Spend('Diamonds',needed);
				} else {
					Molpy.Notify('Unable to heat the Mould - it is ruined',1);
					this.BreakMould();
					return;
				}
			}
		},
		StartCook: function() {
			if (this.State != 0) {
				if (this.State == 1) {
					Molpy.Notify('You are already Cooking a Mould for NP '+this.Making,1)
				} else {
					Molpy.Notify('You have a completely Cooked Mould for NP '+this.Making+' awaiting Burnishing',1)
				}
				return;
			}
			if (Molpy.Boosts['DMF'].State != 2) {
				Molpy.Notify('No Mould to cook',1)
				return;
			}
			this.Making = Molpy.Boosts['DMF'].Making;
			Molpy.Boosts['DMF'].State = 0;

			this.State = 1;
			this.countdown = this.CookTime(this.Making);
			Molpy.Notify('Cooking started for NP'+this.Making+' - do not interrupt this',1);
		},

		BreakMould: function() {
			this.Making = 0;
			this.State = 0;
			this.countdown = 0;
		},
		CookCost: function(np) { return Math.ceil((Math.exp((np*np/3098))/10)) },
		CookTime: function(np) { return Math.ceil(Math.sqrt(Math.abs(np))*Molpy.Papal('Master')*Molpy.Boosts.Dragong.factor(np)) },
		classChange: function() { return ['','alert','action'][this.State] },
	});

	new Molpy.Boost({ 
		name: 'Diamond Masterpiece Burnisher',
		icon: 'diamburn',
		alias: 'DMB',
		group: 'drac',
		price: {Diamonds: '80M', Goats: Infinity, Vacuum: '1LW'},
		sortAfter: 'DMC',
		desc: function(me) {
			var str = 'Makes a masterpiece shine. ';
			if (me.bought && Molpy.Boosts.DMP.bought) {
				switch (me.State) {
				case 0: 
					str += '<br>Nothing to Shine';
					break;
				case 1:
					str += '<br>Burnishing the Masterpiece for NP'+me.Making+ ' it will be finished in '+MolpifyCountdown(me.countdown);
					break;
				case 2:
					str += '<br>You have a complete Masterpiece made for NP'+me.Making+'<br>';
					if (Molpy.Boosts['DMP'].State == 0 && 
						!Molpy.Earned('monums'+me.Making) && 
						!Molpy.Earned('monumg'+me.Making) && 
						me.Making == Molpy.newpixNumber &&
						Molpy.Got('Black Powder')) {
						str += '<input type=button value="Start Mounting" onclick="Molpy.Boosts.DMP.StartPed()"></input> '+
							'It needs '+Molpy.createPriceHTML(Molpy.Boosts.DMP.PedCost(me.Making))+' and a few other things and will take '+Molpy.Boosts.DMP.PedTime(me.Making)+' mNP';
					} else {
						str += 'The site is not yet ready';
					}
					break;
				}
			}
			return str;
		},
		Making: 0,
		State: 0, //0 free, 1 Making, 2 Made
		defSave: 1,
		saveData: { 4:['Making', 0, 'int'],
	       		    5:['State',0,'int'],
		},
		buyFunction: function() {
			this.Making = 0;
			this.State = 0;
		},
		countdownFunction: function() {
			if (this.State == 1 && !Molpy.Spend('Vacuum',this.BurnCost(this.Making))) {
				this.State = 0;
				Molpy.Notify('Not enough Vacuum to clean the mould this mNP - the cleaning will have to be restarted',1);
				this.countdown = 0; // TODO something else
			}
		},
		countdownLockFunction: function() {
			this.State = 2;
			Molpy.Notify('The Diamond Masterpiece for NP'+this.Making+' is now complete, and ready to be mounted',1);
		},
		StartBurn: function() {
			if (this.State != 0) {
				if (this.State == 1) {
					Molpy.Notify('You are already Burnishing NP '+this.Making,1)
				} else {
					Molpy.Notify('You have a completely cleaned Masterpiece for NP '+this.Making+' awaiting mounting',1)
				}
				return;
			}

			this.Making = Molpy.Boosts['DMC'].Making;
			var cost = this.BurnCost(this.Making);
			if (!Molpy.Spend('Goats',Infinity)) {
				Molpy.Notify('You need Infinite Goats',1);
				return;
			}
			if (!Molpy.Spend('Vacuum',cost)) {
				Molpy.Notify('You need '+Molpify(cost)+' Vacuum',1);
				return;
			}
			Molpy.Boosts['DMC'].State = 0;
			this.State = 1;
			this.countdown = this.BurnTime(this.Making);
			Molpy.Notify('Burnishing started for NP'+this.Making+' - do not interrupt this',1);
		},
		BreakMould: function() {
			this.Making = 0;
			this.State = 0;
			this.countdown = 0;
		},
		BurnCost: function(np) {
			return Molpy.Boosts['DMF'].FillCost(np);
		},
		BurnTime: function(np) { return Math.floor(Math.log(np+1)*Math.LOG10E*100*Molpy.Papal('Master')*Molpy.Boosts.Dragong.factor(np)) },
		classChange: function() { return ['','alert','action'][this.State] },
	});

	new Molpy.Boost({
		name: 'Diamond Masterpiece Pedestal',
		icon: 'pedestal',
		alias: 'DMP',
		group: 'drac',
		price: {Diamonds: '150M', Goats: Infinity, Bonemeal: '111GW' },
		sortAfter: 'DMB',
		desc: function(me) {
			var str = 'To put the masterpiece on and hold the dedication';
			if (me.bought && Molpy.Boosts.DMP.bought) {
				switch (me.State) {
				case 0: 
					str += '<br>No Masterpiece currently needs mounting on a pedestal';
					break;
				case 1:
					str += '<br>Making the Pedestal for the Masterpiece at NP'+me.Making+ ' it will be finished in '+MolpifyCountdown(me.countdown);
					break;
				case 2:
					this.State = 0; // Should never happen...
					break;
				}
			}
			return str;
		},
		Making: 0,
		State: 0, //0 free, 1 Making, 2 Made
		defSave: 1,
		saveData: { 4:['Making', 0, 'int'],
	       		    5:['State',0,'int'],
		},
		buyFunction: function() {
			this.Making = 0;
			this.State = 0;
		},
		countdownLockFunction: function() {
			if (this.State == 1 && this.countdown == 0) {
				if ( Molpy.Earned('monums'+this.Making) || Molpy.Earned('monumg'+this.Making)) {
					Molpy.Notify('What are those third rate monuments doing here! - the Masterpiece is ruined',1);
					this.State = 0;
					this.Making = 0;
				} else {
					this.State = 0;
					Molpy.Notify('The Diamond Masterpiece for NP'+this.Making+' is now complete!',1);
					Molpy.EarnBadge('diamm'+this.Making);
					Molpy.Overview.Update(Molpy.newpixNumber);
					Molpy.Boosts.DQ.ChangeState(3,Math.floor(Math.log(this.Making+10)*33)+10);
					Molpy.Overview.Update(this.Making);
					if (Molpy.Got('Diamond Recycling')) Molpy.Add('Diamonds',Molpy.Boosts.DMM.MouldCost(this.Making)/2);
					// Launch fireworks
					Molpy.Master.Create(this.Making,'long');
					// Unlocks

					if (Molpy.Level('Maps') > 200 ) Molpy.UnlockBoost('Cake');	
					if (Molpy.Got('Saturnav') && !Molpy.IsEnabled('Loopin Looie')) Molpy.Boosts.Maps.Saturnav();
					this.DiammUnlocks(),
					this.Making = 0;
				}
			}
		},
		loadFunction: function(){ this.DiammUnlocks() },
		DiammUnlocks: function(){
			if (Molpy.groupBadgeCounts.diamm >= 3) Molpy.UnlockBoost('Seacoal');
			if (Molpy.groupBadgeCounts.diamm >= 5 && Molpy.Got('Robotic Feeder')) Molpy.UnlockBoost('Glaciation');
			if (Molpy.groupBadgeCounts.diamm >= 10) Molpy.UnlockBoost('Dragong');
			if (Molpy.groupBadgeCounts.diamm >= 13) Molpy.UnlockBoost('Diamond Recycling');
			if (Molpy.groupBadgeCounts.diamm >= 16) Molpy.UnlockBoost('ClawsDeck');
		},
		StartPed: function() {
			if (this.State == 1) {
				Molpy.Notify('You are already mounting the Masterpiece for NP '+this.Making,1)
				return;
			};

			this.Making = Molpy.Boosts['DMB'].Making;
			if (Molpy.Got('Black Powder') && Molpy.Spend(this.PedCost(this.Making))) {
				Molpy.Boosts['Black Powder'].Lock();
			} else {
				if(!Molpy.Got('Black Powder')) {
					Molpy.Notify('You do not have Black Powder at the moment',1);
				} else {
					Molpy.Notify('You can not afford this at the moment',1);
				}
				return;
			};
			
			Molpy.Boosts['DMB'].State = 0;
			this.State = 1;
			this.countdown = this.PedTime(this.Making);
			Molpy.Notify('Mounting of the Masterpiece on a Pedestal has started for NP'+this.Making,1);
		},
		BreakMould: function() {
			this.Making = 0;
			this.State = 0;
			this.countdown = 0;
		},
		PedCost: function(np) {
			return { 
				'Diamonds': Molpy.Boosts['DMM'].MouldCost(np),
				'Goats': Infinity,
				'Coal': Molpy.Boosts['DMC'].CookCost(np),
				'Vacuum': Molpy.Boosts['DMB'].BurnCost(np),
				'Bonemeal' : '1GW',  // Princesses later
			};
		},
		PedTime: function(np) { return Math.floor((100+np/100)*Molpy.Papal('Master')) },
		classChange: function() { return ['','alert','action'][this.State] },
	});

	new Molpy.Boost({ 
		name: 'Incubator',
		icon: 'incubator',
		desc: str = 'Halves the time dragon eggs need before they hatch',
		group: 'hpt',
		price: {Diamonds:1000},
	});

	new Molpy.Boost({ 
		name: 'Wait for it',
		icon: 'wait4it',
		desc: str = 'Doubles the time hatchlings survive without being fed',
		group: 'chron',
		price: {Diamonds:20000},
	});

	new Molpy.Boost({ 
		name: 'Q04B',
		icon: 'q04b',
		desc: str = 'Doubles the time mature hatchlings will wait around before fledging themselves',
		group: 'hpt',
		price: {Diamonds:555555},
		title: '<a href="http://mrob.com/time/Q04B" target="_blank">Q04B</a>',
	});

	new Molpy.Boost({ 
		name: 'Robotic Feeder',
		icon: 'robotfeeder',
		className: 'toggle',
		desc: function(me) {
			var str = 'Will automatically feed hatchlings goats just before they starve';
			if (Molpy.Got('Princesses')) str += ' - will not feed them Princesses';
			if (me.bought) {
				str += '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="' + (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>';
			}
			return str;
		},

		group: 'cyb',
		price: {Diamonds:'67M',
			Goats:Infinity,
			},
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
	});

	new Molpy.Boost({ 
		name: 'Loopin Looie',
		icon: 'looplooie',
		desc: function(me) {
			var str = 'When active, ONGs don\'t change the current NP';
			if(me.bought)
				str += '<br><input type="Button" onclick="Molpy.GenericToggle(' + me.id + ')" value="' + (me.IsEnabled ? 'Dea' : 'A') + 'ctivate"></input>';
			return str;
		},
		group: 'chron',
		className: 'toggle',
		price: {Diamonds:'1M', 
			Goats:Infinity,
		},
		IsEnabled: Molpy.BoostFuncs.BoolPowEnabled,
		AfterToggle: function() {
			if (Molpy.Got('Saturnav') && !this.IsEnabled) Molpy.Boosts.Maps.Saturnav();
		},
	});

	new Molpy.Boost({ 
		name: 'Cryogenics',
		icon: 'cryogenics',
		desc: function(me) {
			var str = 'Allows you to put a clutch of hatchlings in suspended animation instead of fledging. ' +
				  'It costs 1 Diamond per mNP per Hatchling to run.';
			if(me.bought && me.Level) {
				str += '<br>You have ' + Molpify(me.Level) + ' Hatchling' + plural(me.Level) + ' in suspended animation.<br>';
				str += '<input type=button onclick="Molpy.DragonsFromCryo()" value="Fledge Here"></input>';
			};
			return str;
		},
		group: 'chron',
		className: 'action',
		price: {Diamonds:'10M', 
			Goats:Infinity,
		},
		countdownFunction: function() {
			if (this.Level) {
				if (!Molpy.Spend('Diamonds',this.Level)) {
					Molpy.Notify('Cryogenics ran out of power',1);
					Molpy.Add('exp',-this.Level*Math.pow(1000,Molpy.Level('DQ')));
					this.Level = 0;
					this.countdown = 0;
				}
			} else {
				this.countdown = 0;
			}
		},
		defStuff: 1,
		AddSuper: Molpy.BoostFuncs.Add,
		Add: function(amount) {
			this.AddSuper(amount);
			this.countdown = Infinity;
		},
		classChange: function() { return this.Level?'action':'' },
		NotTemp: 1,
		
	});

	new Molpy.Boost({ 
		name: 'Panthers Dream',
		icon: 'pantherdream',
		desc: str = 'Crouching Dragon, Sleeping Panther increases the Bonemeal from Shadow Dragon',
		price: {Diamonds:500000,
			Bonemeal:'100H',
		},
	});

	new Molpy.Boost({
		name: 'Dragon Overview',
		icon: 'dragonoverview',
		group: 'drac',
		desc: str = 'Provides the dragon overview pane',
		price: {Diamonds:50000,
			Bonemeal:'10H',
		},
		buyFunction: function() {
			Molpy.Overview.Create(3090);
		},
		loadFunction: function() {
			this.buyFunction();
		},
	});

	new Molpy.Boost({
		name: 'Woolly Jumper',
		icon: 'woolly',
		group: 'chron',
		desc: str = 'Allows direct jumps to selected NPs on the Dragon Overview pane', 
		price: {Diamonds:500000,
			Bonemeal:'100H',
		},
		buyFunction: function() {
			Molpy.Overview.addJumper();
		},
	});

	new Molpy.Boost({ 
		name: 'Hubble Double',
		icon: 'hubble2',
		desc: str = 'Occasionally the number of runs Constructing from Blackprints has made will double',
		price: {Diamonds:'8888888',
			Bonemeal:'88GW',
			Blackprints:Infinity,
			Goats:Infinity
		},
		group: 'cyb',
	});

	new Molpy.Boost({ 
		name: 'Experience',
		icon: 'experience',
		plural: 'Experience',
		alias: 'exp',
		desc: function(me) {
			var str = 'You have ' + Molpify(me.Level, 3) + ' experience';
			return str;
		},
		group: 'stuff',
		defStuff: 1,
		AddSuper: Molpy.BoostFuncs.Add,
		Add: function(amt) {
			this.AddSuper(amt*Molpy.Papal('Experience'));
			Molpy.Boosts['DQ'].Refresh();
			// There will be Unlocks here
		},
	});

	new Molpy.Boost({ 
		name: 'Muse',
		icon: 'muse',
		desc: function() {
			var np = Molpy.newpixNumber;
			if (!Molpy.Badges['monumg'+np]) {
				Molpy.LockBoost('Muse');
				return '';
			};
			var str = 'You are inspired to make a Diamond Masterpiece of '+Molpy.Badges['monumg'+np].name +' at NP'+np+'.<br>';
			str += 'Making the mould will take '+Molpify(Molpy.Boosts['DMM'].MouldCost(np),2)+' Diamonds (and ' +
				Molpify(Molpy.Boosts['DMM'].MouldTime(np))+' mNP).<br>';
			str += 'Filling the mould will take '+Molpify(Molpy.Boosts['DMF'].FillCost(np),2)+' Diamonds (every mNP for ' +
				Molpify(Molpy.Boosts['DMF'].FillTime(np))+' mNP) and finishing off with infinite Flux Crystals.<br>';
			str += 'Cooking the mould will take '+Molpify(Molpy.Boosts['DMC'].CookCost(np),2)+' Coal every mNP for ' +
				Molpify(Molpy.Boosts['DMC'].CookTime(np))+' mNP), You can burn '+Molpify(1e12)+' Diamonds instead for each Coal.<br>';
			str += 'Burnishing the Masterpiece will take infinite Goats and '+Molpify(Molpy.Boosts['DMB'].BurnCost(np),2)+
				' Vacuums every mNP for ' +Molpify(Molpy.Boosts['DMB'].BurnTime(np))+' mNP.<br>';
			str += 'Then it will be mounted on a pedestal with much celebration.';
			return str;
		},
		startCountdown: 12,
		countdownCMS: 1,
		buyFunction: function() {
			this.power = Molpy.newpixNumber;
		},
		countdownFunction: function() {
			if (Molpy.newpixNumber != this.power ) this.Lock();
		},
		group: 'drac',
		NotTemp: 1,
		
	});

	new Molpy.Boost({ 
		name: 'Black Powder',
		icon: 'blackpowder',
		desc: function(me) {
			str = 'Removes unsightly sand and glass monuments (One use).';
			if (me.bought) {
				if (Molpy.IsEnabled('Archimedes') && (!Molpy.Got('Cold Mould') || !Molpy.IsEnabled('Cold Mould'))) {
					str += '<br><b>Warning</b> Unless you enable Cold Mould or Disable Archimedes Lever, Archimedes Lever will make them again<br>';
				};
				str += '<input type=button value="Destroy!" onclick="Molpy.Boosts[\'Black Powder\'].bang()"></input>';
			}
			return str;
		},
		price: {Blackprints:Infinity,
			FluxCrystals:Infinity,
			Coal:20,
		},
		group: 'hpt',
		className: 'action',
		bang: function() {
			var monus = Molpy.Badges['monums'+Molpy.newpixNumber];
			if (monus) monus.Lock();
			var monug = Molpy.Badges['monumg'+Molpy.newpixNumber];
			if (monug) monug.Lock();
			Molpy.Notify('Cleared the area of unsightly trash',1);
			this.Lock();
			Molpy.Overview.Update(Molpy.newpixNumber);
		},
	});

	new Molpy.Boost({ 
		name: 'Time Reaper',
		icon: 'timereaper',
		desc: function(me) {
			str = 'Automatically harvests the Time Lord for Flux Crystals whenever needed. ';
			if (!me.bought) {
				str += 'Needs to be bought 3 times within 100mNP. ';
			} else {
				if (me.bought < 3) str += 'Has been bought ' + (me.bought ==1?'once':'twice');
				if (me.countdown) str += '.  You have '+ me.countdown+' mNP left.';
			};
			return str;
		},
		price: { FluxCrystals:Infinity },
		group: 'chron',
		buyFunction: function() {
			switch (this.bought) {
			case 1:	
				this.countdown=100;
			case 2: // deliberate fall through
				this.Unlock();
				return;
			case 3:
				this.countdown= 0;
			};
		},
		countdownLockFunction: function() {
			this.bought = 0;
			this.unlocked = 0;
			this.Unlock();
		},
		limit: 3,
		NotTemp: 1,
	});

	new Molpy.Boost({
		name: 'Mirror Scales',
		icon: 'mirrorscales',
		group: 'drac',
		single: 'Mirror Scale',
		desc: function(me) {
			str = 'Increases the defense value of Dragons';
			if (me.bought) str += '.  You have ' + Molpify(me.bought) + ' ' + (me.bought>1?me.plural:me.single);
			return str;
		},
		price: {
			Diamonds:2000,
			exp: function (me) { return Math.pow(5,me.Level+1)*100 }
		},
		draglvl: 'Wyrm',
		limit: function() { return 8*(Molpy.Level('DQ')-1) },
		Level: Molpy.BoostFuncs.Bought0Level,
	});

	new Molpy.Boost({
		name: 'Big Bite',
		icon: 'bigbite',
		group: 'drac',
		desc: function(me) {
			str = 'Increases the offensive value of Dragons';
			if (me.bought) str += '.  You have ' + Molpify(me.bought) + ' ' + (me.bought>1?me.plural:me.single);
			return str;
		},
		price: {
			Diamonds:2000,
			exp: function (me) { return Math.pow(5,me.Level+1)*100 }
		},
		draglvl: 'Wyrm',
		limit: function() { return 8*(Molpy.Level('DQ')-1) },
		Level: Molpy.BoostFuncs.Bought0Level,
	});

	new Molpy.Boost({
		name: 'Double Byte',
		icon: 'doublebyte',
		group: 'drac',
		desc: function(me) {
			str = 'Increases the offensive value of Dragons';
			if (me.bought) str += '.  You have ' + Molpify(me.bought) + ' ' + (me.bought>1?me.plural:me.single);
			return str;
		},
		price: {
			Diamonds:20000,
			exp: function (me) { return Math.pow(5,me.Level+1)*1000 }
		},
		draglvl: 'Wyrm',
		limit: function() { return (Molpy.Boosts['Big Bite'].bought == Molpy.Boosts['Big Bite'].limit())?8*(Molpy.Level('DQ')-1):0 },
		Level: Molpy.BoostFuncs.Bought0Level,
	});

	new Molpy.Boost({
		name: 'Trilobite',
		icon: 'trilobite',
		group: 'drac',
		desc: function(me) {
			str = 'Increases the offensive value of Dragons';
			if (me.bought) str += '.  You have ' + Molpify(me.bought) + ' ' + (me.bought>1?me.plural:me.single);
			return str;
		},
		price: {
			Diamonds:200000,
			exp: function (me) { return Math.pow(5,me.Level+1)*10000 }
		},
		draglvl: 'Wyrm',
		limit: function() { return (Molpy.Boosts['Big Bite'].bought == Molpy.Boosts['Big Bite'].limit()) && (Molpy.Boosts['Double Byte'].bought == Molpy.Boosts['Double Byte'].limit())?8*(Molpy.Level('DQ')-1):0 },
		Level: Molpy.BoostFuncs.Bought0Level,
	});

	new Molpy.Boost({
		name: 'Shades',
		icon: 'shades',
		group: 'drac',
		desc: 'Makes Beach Dragons really cool (and work better)',
		price: { Diamonds:234567 },
		draglvl: 'Wyrm',
	});

	new Molpy.Boost({
		name: 'Topiary',
		icon: 'topiary',
		group: 'drac',
		desc: 'When fleding, if the clutch is too large for the NP, the rest are left as hatchlings and not wasted',
		price: { Diamonds:345678, Goats:Infinity },
	});

	new Molpy.Boost({
		name: 'Cut Diamonds',
		icon: 'cutdiamonds',
		group: 'hpt',
		desc: 'Diamond digging is linear with digging rate',
		draglvl: 'Wyrm',
		limit: function() { return (Molpy.Level('Adamantine Armour') >= 14?1:0) },
		price: { Diamonds:'1M', Goats:Infinity, Vacuum:'10LW' },
	});

	new Molpy.Boost({
		name: 'Sparkle',
		icon: 'sparkle',
		group: 'hpt',
		desc: 'The diamond supply get an extra 1% per consecutive NP with dragons',
		draglvl: 'Wyrm',
		limit: function() { return (Molpy.Got('Cut Diamonds') && Molpy.Level('Diamonds')>=2222222?1:0) },
		price: { Diamonds:222222222, Goats:Infinity, exp:'12.5E' },
	});

	new Molpy.Boost({
		name: 'Saturnav',
		icon: 'saturn',
		group: 'hpt',
		desc: 'As long as you do not have Loopin Looie active, it will automatically collect your Maps',
		price: { Diamonds:222, Goats:Infinity, exp:'123456' },
		buyFunction: function() {
			if (!Molpy.Boosts['Loopin Looie'].IsEnabled) Molpy.Boosts.Maps.Saturnav();
		},
	});

	new Molpy.Boost({
		name: 'Cake',
		icon: 'cake',
		group: 'hpt',
		desc: 'Reduces the costs of some Dragon Eggs',
		price: { Diamonds:'5.55M', Goats:Infinity, Bonemeal:'555GW' },
	});

	new Molpy.Boost({
		name: 'Anisoptera',
		alias: 'Dragonfly',
		icon: 'dragonfly',
		plural: 'Anisoptera',
		group: 'drac',
		desc: function(me) {
			str = 'Increases the both the offensive and defensive values of Dragons and may give you advanced informaton about Redundaknights';
			if (me.bought) str += '.<p>You have ' + Molpify(me.bought) + ' ' + (me.name);
			return str;
		},
		price: {
			Diamonds: function (me) { return Math.pow(5,me.Level+1)*1.25e9 },
			Coal: function (me) { return Math.pow(2,me.Level+1)*50 },
			exp: function (me) { return Math.pow(5,me.Level+1)*1e9 }
		},
		Species: ['Gomphus vulgatissimus', 'Cordulia aenea', 'Somatochlora metallica', 'Libellula depressa',
			  'Libellula quadrimaculata', 'Orthetrum cancellatum', 'Sympetrum danae', 'Sympetrum sanguineum',
			  'Sympetrum striolatum', 'Leucorrhinia dubia', 'Cordulegaster boltonii', 'Aeshna cyanea',
			  'Aeshna grandis', 'Aeshna juncea', 'Aeshna mixta', 'Anax junius',
			  'Brachytron pratense', 'Anax imperator' ],
		draglvl: 'Wyvern',
		limit: function() { return Math.min(18,6*(Molpy.Boosts.DQ.Level-2))},
		title: function(me) { return me.name + ' ' + me.Species[me.unlocked] },
		Level: Molpy.BoostFuncs.Bought0Level,
	});

	new Molpy.Boost({
		name: 'Glaciation',
		icon: 'glaciation',
		group: 'cyb',
		desc: 'Will automatically Freeze restless hatchlings just before they escape',
		price: { Diamonds:'55G', Goats:Infinity, exp:'12.5E' },
	});

	new Molpy.Boost({
		name: 'Favourites Manager',
		alias: 'favs',
		icon: 'favouritesmanager',
		className: 'action',
		group: 'faves',
		desc: function(me) {
		var str = 'Adds useful tab in loot panel...';
			if (me.bought) {
				str = '<input type=button onclick="Molpy.InputFaves()" value="Choose"></input>';
				str += ' up to 20 boosts to be shown here.\n';
				str += '<input type=button onclick="Molpy.RemoveSomeFaves()" value="Remove"></input>';
				str += ' some boosts, or ';
				str += '<input type=button onclick="Molpy.ClearFaves()" value="clear"></input>';
				str += ' them all.'
			}
			return str
		},
		price: {
			Sand: '20G',
			Castles: '20G'
		},
		defSave: 1,
		FavesList: [],
		saveData: {
			4: ['FavesList', 0, 'array']
		},

		buyFunction: function() {
			this.FavesList = [];
			Molpy.lootAddToFav(this);
		}
	});

	Molpy.InputFaves = function() {
		var input = prompt('Enter the names or aliases of the boosts separated by comma.'
				+ '\nNames are case sensitive.'
				+ '\nAll values after 20\'th are ignored'
				+ '\nYour choice is preserved if you reload.',
				'');
		if (input) {
			var list = input.split(',');
			for(var i in list) {
				obj = Molpy.Boosts[list[i]]; // first checking if it's a alias

                if(!obj) {
                    obj = Molpy.Boosts[Molpy.BoostAKA[list[i]]] // otherwise searching by name (which is anyways converted to alias)
                }

				if(obj && obj.unlocked && obj.bought) {
					Molpy.lootAddToFav(obj);
				}
			}
		}
	};

	Molpy.RemoveSomeFaves = function() {
		var input = prompt('Enter the names or aliases of the boosts to be removed separated by comma.'
				+ '\nNames are case sensitive.'
				+ '\nFavourites Manager itself cannot be removed',
				'');
		if (input) {
			var list = input.split(',');
			for(var i in list) {
				obj = Molpy.Boosts[list[i]];

                if(!obj) {
                    obj = Molpy.Boosts[Molpy.BoostAKA[list[i]]]  // otherwise searching by name (which is anyways converted to alias)
                }

				if(obj) {
					Molpy.lootRemoveFromFav(obj);
				}
			}
		}
	};

	Molpy.ClearFaves = function() {
		Molpy.Boosts.favs.FavesList.splice(1, Molpy.Boosts.favs.FavesList.length);
	};

	new Molpy.Boost({
		name: 'Grouchy Dragon, Leaping Panther',
		icon: 'leaping',
		alias: 'GDLP',
		group: 'drac',
		desc: 'Allows you to get more Crouching Dragon, Sleeping Panther, provided it is at low power (One use)',
		price: { Diamonds:'12.5G', Goats:Infinity },
		limit: function() { return ( Molpy.Got('Glaciation') || Molpy.groupBadgeCounts.diamm > 3) ?1:0 },
		draglvl: 'Wyrm',
	});

	new Molpy.Boost({
		name: 'Hugo',
		icon: 'hugo',
		desc: function() { return (Molpy.Got('The Pope')?'Adds 0.001% per badge to Papal effects':'Gain 10% Sand/mNP') },
		stats: 'Time won the Hugo award for the best graphic novel of 2013',
		Sand: 1,
	});


	new Molpy.Boost({
		name: 'Magic Letters',
		icon: 'magicletters',
		alias: 'ml',
		group: 'drac',
		single: 'Magic Letter',
		className: 'action',
		classChange: function() { return (this.power == 31 || this.bought < this.unlocked)?'':'action' },
		desc: function(me) {
			var str ='With magic letters, you can make magic words which do things...'; 
			if (!me.bought) return str;
			str += '<br><br>Current Word:<p><div class=magiclet id=magictop>';
			for (var l in me.toplets) str += me.orient(me.toplets[l]);
			str += '</div><br><br>Available Letters:<p><div class=magiclet id=magicbot>';
			for (var l in me.botlets) str += me.orient(me.botlets[l]);
			str += '</div><p><div id=magicbuts>';
			str += '<button class=magicbut onclick="Molpy.Boosts.ml.select()">&#8593;</button> ';
			str += '<button class=magicbut onclick="Molpy.Boosts.ml.rotate()">&#8631;</button> ';
			str += '<button class=magicbut onclick="Molpy.Boosts.ml.mirror()">&#8596;</button> ';
			str += '<button class=magicbut onclick="Molpy.Boosts.ml.shuffle()">&#8595;</button> ';
			str += '<button class=magicbut onclick="Molpy.Boosts.ml.Shift()">&#8634;</button> ';
			str += '</div>';
			return str;
		},

		orient: function(thing) {
			return '<div class=magictile'+thing[1]+'>'+thing[0]+'</div>';
		},

		price: { 
			Diamonds: function() { return DeMolpify('125G')*Math.pow(2,Molpy.Boosts.ml.unlocked-1) }, 
			Goats:Infinity, 
			Bonemeal: function() { return DeMolpify('125PW')*Math.pow(2,Molpy.Boosts.ml.unlocked-1) }, 
		},
		limit: function() { return (Molpy.Has('Maps','10M')?[4,11,21,38][Math.min(3,Molpy.Level('DQ')-2)]:0) },
		draglvl: 'Wyrm',
		beanwords: ['R0FaRUJP','T0lOVE1FTlQ=','SEFSUFNJQ0hPUkQ=','Q1JFREVOWkE=','QlVOR0FMT1c='],
		beanlets: Molpy.BeanishToCuegish('RVRJT0dSSEVaRUxOT0RSTU5PSUNQVVJCQVRaTkdESEVXQlNBQUNBTk8='),
		validorients: { // Need to work out correct values
			A:1, B:1, C:1, D:1, E:1, F:1, G:1, H:1, I:1, J:1, K:1, L:1, M:1,
			N:1, O:1, P:1, Q:1, R:1, S:1, T:1, U:1, V:1, W:1, X:1, Y:1, Z:1,
		},
		cuewords: [],
		toplets: [],
		botlets: [],
		loadFunction: function() {
			for (var i=0;i<5;i++) this.cuewords[i] = Molpy.BeanishToCuegish(this.beanwords[i]);
			if (this.bought && this.power != 31) this.shuffle();
		},
		buyFunction: function() {
			this.shuffle();
		},

		shuffle: function() {
			Molpy.Anything = 1;
			var mlets = this.beanlets.substr(0,this.bought);
			for (word in this.cuewords) {
				if (this.power & (1<<word)) {
					var lets = this.cuewords[word].split('');
					for (var l in lets) mlets = mlets.replace(lets[l],'');
				}
			};
			this.botlets = [];
			this.toplets = [];
			var lets = mlets.split('');
			while (lets.length) {
				var rl = flandom(lets.length);
				this.botlets.push([lets[rl],flandom(8)]);
				lets.splice(rl,1);
			}
			this.Refresh();
		},
		
		select: function() {
			Molpy.Anything = 1;
			if (this.botlets.length) this.toplets.unshift(this.botlets.shift());
			// Check if word
			var orient = true;
			var word = '';
			for (var tl in this.toplets) { 
				var l = this.toplets[tl][0];
				word += l;
				if (!(this.validorients[l] >> this.toplets[tl][1])&1) orient = false;
			}
			if (orient) {
				for ( var w in this.cuewords) {
					if (word == this.cuewords[w] && ((this.power >> w)&1)==0) {
						Molpy,UnlockBoost(word);
						this.power += 1<<w;
						this.toplets = [];
						break;
					}
				}
			}
			this.Refresh();
		},
		rotate: function() {
			Molpy.Anything = 1;
			if (this.botlets.length) { 
				var bottom = this.botlets[this.botlets.length-1];
				var neworient = (((bottom[1] & 3)+1)&3)+(bottom[1]&4);
				bottom[1] = neworient;
			};
			this.Refresh();
		},
		mirror: function() {
			Molpy.Anything = 1;
			if (this.botlets.length) this.botlets[this.botlets.length-1][1] ^= 4;
			this.Refresh();
		},
		Shift: function() {
			Molpy.Anything = 1;
			if (this.botlets.length) this.botlets.push(this.botlets.shift());
			this.Refresh();
		},
	});
	new Molpy.Boost({
		name: 'Gazebo',
		icon: 'gazebo',
		desc: '',
		group: 'magic',
	});
	new Molpy.Boost({
		name: 'Ointment',
		icon: 'ointment',
		desc: '',
		group: 'magic',
	});
	new Molpy.Boost({
		name: 'Harpsichord',
		icon: 'harpsicord',
		desc: '',
		group: 'magic',
	});
	new Molpy.Boost({
		name: 'Credenza',
		icon: 'credenza',
		desc: '',
		group: 'magic',
	});
	new Molpy.Boost({
		name: 'Bungalow',
		icon: 'bungalow',
		desc: '',
		group: 'magic',
	});
	new Molpy.Boost({
		name: 'Dragong',
		icon: 'dragong',
		desc: 'Every Masterpiece gives a 3% reduction in the time to fill, cook and burnish a masterpiece',
		group: 'chron',
		factor: function(np) { return this.bought?Math.pow(0.97,Molpy.groupBadgeCounts.diamm):1; },
		price: {Diamonds:'1250G', Bonemeal:'1250PW', Goats:Infinity},
	});
	new Molpy.Boost({
		name: 'All Claws on Deck',
		icon: 'clawdeck',
		alias: 'ClawsDeck',
		desc: 'All Dragons in the area help to make the mould, reducing the time (but not the diamonds)',
		group: 'drac',
		factor: function(np) { 
			if(!this.bought) return 1;
			var help = Molpy.NPdata[np].amount;
			for (var delta=1; delta <= 16; delta++) {
				if (Molpy.NPdata[np+delta]) help += Molpy.NPdata[np+delta].amount/Math.pow(2,delta);
				if (Molpy.NPdata[np-delta]) help += Molpy.NPdata[np-delta].amount/Math.pow(2,delta);
			};
			return Math.sqrt(help);
		},
		price: {Diamonds:'12.50T', Bonemeal:'12.50EW', Goats:Infinity},

	});
	new Molpy.Boost({
		name: 'Diamond Recycling',
		icon: 'recycling',
		desc: 'After a Masterpiece has been finished, 50% of the diamonds used to make the mould are recovered',
		group: 'drac',
		price: {Maps:'35G'},
	});
	new Molpy.Boost({
		name: 'Seacoal',
		icon: 'seacoal',
		desc: 'Beach digging gets an additional coal',
		group: 'drac',
		price: {Coal:1250},
	});


// END OF BOOSTS, add new ones immediately before this comment
}
