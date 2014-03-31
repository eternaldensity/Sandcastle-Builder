'use strict';
/**************************************************************
 * Helper Functions
 * 
 * This section contains the non-Molpy functions.
 *************************************************************/
function addCSSRule(sheet, selector, rules, index) {
	if(sheet.insertRule) {
		sheet.insertRule(selector + '{' + rules + '}', index);
	}
	else {
		sheet.addRule(selector, rules, index);
	}
}

jQuery.fn.canColorBorder = function() {
	return this.each(function() {
		var borderColorButton = $("<div class='ui-border-color-button'></div>");
		borderColorButton.click(Molpy.CycleBorderClick);
		$(this).append(borderColorButton);
	});
};

function ONGsnip(time) {
	if(time.getMinutes() >= 30 && Math.abs(Molpy.newpixNumber) <= 240) {
		time.setMinutes(30);
	} else {
		time.setMinutes(0);
	}
	time.setSeconds(0);
	time.setMilliseconds(0);
	return time;
}

Molpy.extend = function(obj, args, overwrite){
	for(var i in args){
		if(!obj[i] || overwrite == true) obj[i] = args[i];
	}
}

/**************************************************************
 * Molpy Initialization
 *************************************************************/
Molpy.Up = function() {
	Molpy.molpish = 0;

	Molpy.Wake = function() {
		Molpy.molpish = 0;
		Molpy.HardcodedData();//split some stuff into separate file
		
		/**************************************************************
		 * Variables
		 * 
		 * Main variables used for game engine.
		 *************************************************************/
		Molpy.Life = 0; //number of gameticks that have passed
		Molpy.fps = 30; //this is just for paint, not updates

		Molpy.time = new Date().getTime();
		Molpy.newpixNumber = 1; //to track which background to load, and other effects...
		Molpy.ONGstart = ONGsnip(new Date()); //contains the time of the previous ONG
		Molpy.NPlength = 1800; //seconds in current NewPix 
		Molpy.mNPlength = 1800; //milliseconds in milliNewPix
		Molpy.updateFactor = 1; //increase to update more often

		Molpy.options = [];

		Molpy.lateness = 0;
		Molpy.ketchupTime = 0;
		Molpy.ninjad = 0; //ninja flag for newpixbots
		Molpy.npbONG = 0; //activation flag for newpixbots

		Molpy.beachClicks = 0; //number of times beach has been clicked for sand
		Molpy.ninjaFreeCount = 0; //newpix with no clicks in ninja period (but with clicks later)
		Molpy.ninjaStealth = 0; //streak of uninterrupted ninja-free newpix
		Molpy.saveCount = 0; //number of times game has been saved
		Molpy.loadCount = 0; //number of times gave has been loaded
		Molpy.autosaveCountup = 0;
		Molpy.highestNPvisited = 1; //keep track of where the player has been
		Molpy.toolsBuilt = 0;
		Molpy.toolsBuiltTotal = 0;
		
		Molpy.dispObjects = {shop: [], tools: [], boosts: [], badges: [], tagged: [], search: [], faves: []} // Lists of objects currently being displayed
		Molpy.mouseIsOver = null;

		Molpy.DefinePersist();
		Molpy.DefineGUI();
		
		Molpy.floatEpsilon = 0.0000001; // Because floating point errors

		/**************************************************************
		 * Math
		 * 
		 * In which the mathematical methods of sandcastles are described
		 *************************************************************/

		Molpy.glassNotifyFactor = 1000000000;
		Molpy.GlassNotifyFlush = function() {
			Molpy.chipAddAmount = Math.round(Molpy.chipAddAmount);
			Molpy.chipWasteAmount = Math.round(Molpy.chipWasteAmount);
			Molpy.blockAddAmount = Math.round(Molpy.blockAddAmount);
			Molpy.blockWasteAmount = Math.round(Molpy.blockWasteAmount);
			if(Molpy.chipAddAmount > 0 && !Molpy.Boosts['AA'].power
				&& Molpy.chipAddAmount * Molpy.glassNotifyFactor > Molpy.Boosts['GlassChips'].power)
				Molpy.Notify('Gained ' + Molpify(Molpy.chipAddAmount, 3) + ' Glass Chip' + plural(Molpy.chipAddAmount), 1);
			if(Molpy.chipAddAmount < 0
				&& (-Molpy.chipAddAmount * Molpy.glassNotifyFactor) > Molpy.Boosts['GlassChips'].power)
				Molpy.Notify('Consumed ' + Molpify(-Molpy.chipAddAmount, 3) + ' Glass Chip' + plural(-Molpy.chipAddAmount), 1);
			Molpy.chipAddAmount = 0;

			if(Molpy.chipWasteAmount > 0)
				Molpy.Notify('Not enough Chip Storage for ' + Molpify(Molpy.chipWasteAmount) + ' Glass Chip' + plural(Molpy.chipWasteAmount), 1);
			Molpy.chipWasteAmount = 0;

			if(Molpy.blockAddAmount > 0 && !Molpy.Boosts['AA'].power
				&& Molpy.blockAddAmount * Molpy.glassNotifyFactor > Molpy.Boosts['GlassBlocks'].power)
				Molpy.Notify('Gained ' + Molpify(Molpy.blockAddAmount, 3) + ' Glass Block' + plural(Molpy.blockAddAmount), 1);
			if(Molpy.blockAddAmount < 0
				&& (-Molpy.blockAddAmount * Molpy.glassNotifyFactor) > Molpy.Boosts['GlassBlocks'].power)
				Molpy.Notify('Consumed ' + Molpify(-Molpy.blockAddAmount, 3) + ' Glass Block' + plural(-Molpy.blockAddAmount), 1);
			Molpy.blockAddAmount = 0;

			if(Molpy.blockWasteAmount > 0)
				Molpy.Notify('Not enough Block Storage for ' + Molpify(Molpy.blockWasteAmount, 3) + ' Glass Block' + plural(Molpy.blockWasteAmount), 1);
			Molpy.blockWasteAmount = 0;
		};

		Molpy.globalSpmNPMult = 1;
		Molpy.globalGpmNPMult = 1;
		Molpy.lastClick = 0;
		Molpy.ClickBeach = function(event, leopard, recursion) {
			Molpy.previewNP = 0;
			if(!Molpy.layoutLocked && !leopard) {
				Molpy.Notify('You cannnot click here while the layout is unlocked but you can use your leopard');
				return;
			}
			
			Molpy.beachClicks += 1;
			
			Molpy.Boosts['Sand'].clickBeach();
			Molpy.Boosts['TF'].clickBeach();
			Molpy.Boosts['Mustard'].clickBeach();
			
			Molpy.CheckClickAchievements();
			
			if(Molpy.ninjad == 0 && (!isFinite(Molpy.CastleTools['NewPixBot'].amount) || Molpy.CastleTools['NewPixBot'].amount)) {
				if(Molpy.npbONG == 1) {
					Molpy.StealthClick();
					var saveRitual = false;
					if(Molpy.Boosts['Ritual Sacrifice'].IsEnabled && Molpy.Boosts['Ninja Ritual'].power >= 25 && Molpy.Boosts['Ninja Ritual'].power < 101) {
						if(Molpy.Spend({Goats: 5})) {
							saveRitual = true;
							Molpy.Notify('Sacrificed 5 Goats to continue Ninja Ritual');
						} else {
							Molpy.Notify('You need 5 Goats for Ritual Sacrifice');
						}
					}
					if(Molpy.Boosts['Ritual Rift'].IsEnabled && !saveRitual) {
						var ritualRiftCost = Math.floor(Molpy.Boosts['Ninja Ritual'].power / 10);
						if(Molpy.Spend({FluxCrystals: ritualRiftCost})) {
							saveRitual = true;
							Molpy.Notify('Warped back in time with ' + ritualRiftCost + ' Flux Crystals to continue Ninja Ritual.');
						} else {
							Molpy.Notify('Not enough Flux Crystals for Ritual Rift.');
						}
					}
					if(!saveRitual){
						Molpy.Boosts['Ninja Ritual'].Level = 0;
					}
				} else if(Molpy.npbONG == 0) {
					if(Molpy.NinjaUnstealth()) {
						if(Molpy.CastleTools['NewPixBot'].currentActive) {
							Molpy.EarnBadge('Ninja');
						}
						if(Molpy.CastleTools['NewPixBot'].currentActive >= 10) {
							Molpy.EarnBadge('Ninja Strike');
						}
					}
					if(Molpy.Got('Ninja Ritual')) {
						Molpy.NinjaRitual();
						if(Molpy.Boosts['Ninja Ritual'].Level > 10)
							Molpy.UnlockBoost('Western Paradox');
						if(Molpy.Boosts['Ninja Ritual'].Level > 24)
							Molpy.UnlockBoost('Ritual Sacrifice');
						if(Molpy.Boosts['Ninja Ritual'].Level > 39 && Molpy.Boosts['Time Lord'].bought > 8)
							Molpy.UnlockBoost('Ritual Rift');
					}
					else if(Molpy.Has('Goats', 10)) Molpy.UnlockBoost('Ninja Ritual');
					if(Molpy.CastleTools['NewPixBot'].currentActive >= 1000) {
						Molpy.EarnBadge('KiloNinja Strike');
						if(Molpy.CastleTools['NewPixBot'].currentActive >= 1e6) {
							Molpy.EarnBadge('MegaNinja Strike');
							if(Molpy.CastleTools['NewPixBot'].currentActive >= 1e9) {
								Molpy.EarnBadge('GigaNinja Strike');
							}
						}
					}
				}
			} else if(Molpy.Got('VJ')) {
				var sawmod = Molpy.Got('Short Saw') ? 20 : 100;
				if(Molpy.beachClicks % sawmod == 0) {
					Molpy.Notify(Molpy.Boosts['VJ'].name);
					Molpy.Boosts['Castles'].build(Molpy.Boosts['VJ'].getReward(1));
					Molpy.Boosts['VJ'].power++;
					Molpy.Boosts['VJ'].Refresh();
					var sawType = 'Plain';
					if(Molpy.Got('Swedish Chef')) sawType = 'Swedish Chef';
					if(Molpy.Got('Phonesaw')) sawType = 'PhoneSaw';
					if(Molpy.Got('Ninjasaw')) sawType = 'Ninjasaw';

					if(Molpy.Got('Glass Saw')) {
						var p = Molpy.Boosts['Glass Saw'].power;
						if(p > 0) {
							sawType = 'Glass Saw';
							var maxGlass = Molpy.GlassCeilingCount() * 10000000 * p;
							var absMaxGlass = maxGlass;
							var rate = Molpy.ChipsPerBlock();
							maxGlass = Math.min(maxGlass, Math.floor(Molpy.Level('TF') / rate));
							var leave = 0;
							var bl = Molpy.Boosts['GlassBlocks'];
							if(Molpy.Got('Buzz Saw') && Molpy.Boosts['Stretchable Block Storage'].IsEnabled) {
								sawType = 'Buzz Saw';
								maxGlass = Math.max(maxGlass, 0) || 0;
							} else {
								if(Molpy.Boosts['AA'].power && Molpy.Boosts['Glass Blower'].IsEnabled) {
									leave = Molpy.Boosts['Glass Chiller'].power * (1 + Molpy.Boosts['AC'].power) / 2 * 10; // 10 mnp space
								}
								maxGlass = Math.min(maxGlass, bl.bought * 50 - bl.power - leave);
								maxGlass = Math.max(maxGlass, 0) || 0;
								var backoff = 1;
								while(bl.power + maxGlass > bl.bought * 50) {
									maxGlass -= backoff;
									backoff *= 2;
								}
							}
							if(!isFinite(maxGlass)) {
								Molpy.EarnBadge('Infinite Saw');
							}
							if(!isFinite(bl.Level)) Molpy.UnlockBoost('Buzz Saw');
							Molpy.Add('GlassBlocks', Math.floor(maxGlass*Molpy.Papal('GlassSaw')), Molpy.Got('Buzz Saw'));
							Molpy.Spend('TF', maxGlass * rate);
							if(Molpy.Has('TF', absMaxGlass * rate * 10))
								Molpy.Boosts['Glass Saw'].power = p * (10 + 5 * Molpy.Got('Buzz Saw'));
							else if(Molpy.Has('TF', absMaxGlass * rate * 2))
								Molpy.Boosts['Glass Saw'].power = p * (2 + Molpy.Got('Buzz Saw'));

							if(maxGlass && p > 1e15 && maxGlass / absMaxGlass < .01) {
								Molpy.UnlockBoost(['Buzz Saw', 'Stretchable Block Storage']);
							}
						} else {
							if(!p) Molpy.Boosts['Glass Saw'].power = 1;
						}
						Molpy.Boosts['Glass Saw'].Refresh();
					}

					_gaq.push(['_trackEvent', Molpy.Boosts['VJ'].name, sawType, '' + Molpy.Boosts['VJ'].power]);
				}
			}
			if(Molpy.Got('Bag Puns') && Molpy.Boosts['VJ'].bought != 1) {
				if(Molpy.beachClicks % 20 == 0) {
					Molpy.Notify(GLRschoice(Molpy.bp));
					if(++Molpy.Boosts['Bag Puns'].power > 100)	Molpy.UnlockBoost('VJ');
					Molpy.Boosts['Bag Puns'].Refresh();
				}
			}

			if(Molpy.Got('Spare Tools')) {
				GLRschoice(Molpy.tfOrder).create(1).Refresh();
			}

			Molpy.ninjad = 1;

			if(Molpy.oldBeachClass != 'beachongwarning') Molpy.UpdateBeachClass('beachsafe');
			Molpy.HandleClickNP();

			if(Molpy.Got('Temporal Rift') && Molpy.Boosts['Temporal Rift'].countdown < 5 && flandom(2) == 1) {
				Molpy.Notify('You accidentally slip through the temporal rift!,1');
				Molpy.RiftJump();
			}
			Molpy.Donkey();

			if(!recursion && Molpy.Got('Doubletap')) Molpy.ClickBeach(event, leopard, 1);
			Molpy.Boosts['Sand'].toCastles();
			Molpy.mustardCleanup();
		};
		g('beach').onclick = Molpy.ClickBeach;

		Molpy.StealthClick = function() {
			//clicking first time, after newpixbot		
			Molpy.EarnBadge('No Ninja');
			Molpy.ninjaFreeCount++;
			var ninjaInc = 1;
			if(Molpy.Got('Active Ninja') && Molpy.NPlength > 1800) {
				ninjaInc *= 3;
			}
			if(!Molpy.Boosts['Ninja Lockdown'].IsEnabled) {
				if(Molpy.Got('Ninja League')) {
					ninjaInc *= 100;
				}
				if(Molpy.Got('Ninja Legion')) {
					ninjaInc *= 1000;
				}
				if(Molpy.Got('Ninja Ninja Duck')) {
					ninjaInc *= 10;
				}
				ninjaInc *= Molpy.Papal('Ninja');
			}
			Molpy.ninjaStealth += ninjaInc;

			if(Molpy.Got('Ninja Builder')) {
				var stealthBuild = Molpy.CalcStealthBuild(1, 1);
				Molpy.Boosts['Castles'].build(stealthBuild + 1);
				var fn = 'Factory Ninja';
				if(Molpy.Got(fn)) {
					var runs = Molpy.ActivateFactoryAutomation();
					if(runs == 0 && Molpy.Boosts['Sand'].sandPermNP == Infinity) Molpy.EarnBadge('Pure Genius');
					!Molpy.Boosts[fn].power--;
					if(!Molpy.Boosts[fn].power) Molpy.LockBoost(fn);
				}
			} else {
				Molpy.Boosts['Castles'].build(1); //neat!
			}
			if(Molpy.ninjaStealth >= 6) {
				Molpy.EarnBadge('Ninja Stealth');
				Molpy.UnlockBoost('Stealthy Bot');
			}
			if(Molpy.ninjaStealth >= 16) {
				Molpy.EarnBadge('Ninja Dedication');
				Molpy.UnlockBoost('Ninja Builder');
			}
			if(Molpy.ninjaStealth >= 26) {
				Molpy.EarnBadge('Ninja Madness');
				Molpy.UnlockBoost('Ninja Hope');
			}
			if(Molpy.ninjaStealth >= 36) {
				Molpy.EarnBadge('Ninja Omnipresence');
			}
			if(Molpy.ninjaStealth > 4000) {
				Molpy.EarnBadge('Ninja Pact');
			}
			if(Molpy.ninjaStealth > 4000000) {
				Molpy.EarnBadge('Ninja Unity');
			}
			if(Molpy.Got('Stealth Cam')) Molpy.Shutter();

		};
		Molpy.CalcStealthBuild = function(vj, spend) {
			var stealthBuild = Molpy.ninjaStealth;
			if(Molpy.Got('Ninja Assistants')) stealthBuild *= Molpy.CastleTools['NewPixBot'].amount;
			if(Molpy.Got('Skull and Crossbones')) {
				stealthBuild = Math.floor(stealthBuild * Math.pow(1.05, Math.max(-1, Molpy.SandTools['Flag'].amount - 40)));
			}
			if(Molpy.Boosts['Glass Jaw'].IsEnabled) {
				if(Molpy.Has('GlassBlocks', 1)) {
					if(spend) Molpy.Spend('GlassBlocks', 1);
					stealthBuild *= 100;
				}
			}
			if(Molpy.Got('Ninja Climber')) {
				stealthBuild *= Molpy.SandTools['Ladder'].amount;
				if(spend) {
					Molpy.recalculateRates = 1;
				}
			}
			if(vj && Molpy.Boosts['Ninjasaw'].power && Molpy.Boosts['VJ'].IsEnabled) {
				if(Molpy.Has('GlassBlocks', 50)) {
					if(spend) Molpy.Spend('GlassBlocks', 50);
					stealthBuild *= Molpy.Boosts['VJ'].getReward();
				}
			}
			return stealthBuild;
		};

		var prevKey = '';
		Molpy.KeyDown = function(e) {
			var key = String.fromCharCode(e.keyCode || e.charCode);
			if(key == '5' && prevKey.toLowerCase() == 'f') {
				Molpy.ClickBeach(e, 1);
				Molpy.EarnBadge('Use Your Leopard');
			}
			prevKey = key;
		};
		window.onkeydown = Molpy.KeyDown;

		Molpy.NinjaUnstealth = function() {
			if(!Molpy.ninjaStealth) return 0; //Nothing to lose!
			if(Molpy.Got('Impervious Ninja')) {
				var payment = Math.floor(Molpy.Boosts['GlassChips'].power * .01);
				if(payment >= 100) {
					Molpy.Spend('GlassChips', payment);
					Molpy.Notify('Ninja Forgiven', 1);
					Molpy.Boosts['Impervious Ninja'].power--;
					if(Molpy.Boosts['Impervious Ninja'].power <= 0) {
						Molpy.LockBoost('Impervious Ninja');
					}
					return 0; //Safe
				}
			}
			if(Molpy.Got('Ninja Hope') && Molpy.Boosts['Ninja Hope'].power) {
				if(Molpy.Has('Castles', 10)) {
					Molpy.Destroy('Castles', 10);
					Molpy.Boosts['Ninja Hope'].power--;
					Molpy.Notify('Ninja Forgiven', 1);
					return 0;
				}
			}
			if(Molpy.Got('Ninja Penance') && Molpy.Boosts['Ninja Penance'].power) {
				if(Molpy.Has('Castles', 30)) {
					Molpy.Destroy('Castles', 30);
					Molpy.Boosts['Ninja Penance'].power--;
					Molpy.Notify('Ninja Forgiven', 1);
					return 0;
				}
			}
			Molpy.Boosts['Ninja Hope'].power = 1;
			Molpy.Boosts['Ninja Penance'].power = 2;
			if(Molpy.ninjaStealth) Molpy.Notify('Ninja Unstealthed', 1);
			if(Molpy.ninjaStealth >= 7 && Molpy.Got('Ninja Hope')) {
				Molpy.UnlockBoost('Ninja Penance');
			}
			if(Molpy.ninjaStealth >= 30 && Molpy.ninjaStealth < 36) {
				Molpy.EarnBadge('Ninja Shortcomings');
			}
			Molpy.ninjaStealth = 0;

			return 1;
		};

		Molpy.HandleClickNP = function() {
			var NP = Molpy.newpixNumber;
			if(NP == 404) Molpy.EarnBadge('Badge Not Found');
			if(NP == -404) Molpy.EarnBadge('Badge Found');
			if(NP == 2101) Molpy.EarnBadge('War was beginning.');
		};

		/* In which we calculate how much sand per milliNewPix we dig
		+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
		Molpy.calculateRates = function() {
			Molpy.recalculateRates = 0;
			
			Molpy.CastleTools['NewPixBot'].calculateNinjaTime();
			Molpy.Boosts['Sand'].calculateSandRates();
			Molpy.Boosts['Castles'].calculateGlobalMult();
			Molpy.Boosts['TF'].calculateLoadedPermNP();
			Molpy.CalcReportJudgeLevel();
			
			Molpy.shopNeedRepaint = 1;
		};
		
		Molpy.CalcReportJudgeLevel = function() {
			var judy = Molpy.JudgementDipReport()[0];
			if(Molpy.judgeLevel == -1){ //just loaded
				if(judy > 0) Molpy.Notify("Judgement Dip Level: " + Molpify(judy - 1, 2), 1);
			} else if(judy > Molpy.judgeLevel)//increase
			{
				if(Molpy.judgeLevel < 2 && judy > 2) { //jumped from safe to multiple levels of judgement
					Molpy.Notify('Judgement Dip is upon us!');
					Molpy.Notify("Judgement Dip Level: " + Molpify(judy - 1, 2), 1);
				} else if(judy > 2) {
					Molpy.Notify('Things got worse!!');
					Molpy.Notify("Judgement Dip Level: " + Molpify(judy - 1, 2), 1);
				} else if(judy == 2) {
					Molpy.Notify('Judgement Dip is upon us!', 1);
				} else if(judy == 1) {
					Molpy.Notify("You sense trouble. The bots are restless.", 1);
				}
			} else if(judy < Molpy.judgeLevel) { //decrease
				if(judy > 1) {
					Molpy.Notify('Things got better');
					Molpy.Notify("Judgement Dip Level: " + Molpify(judy - 1, 2), 1);
				} else if(judy == 1) {
					Molpy.Notify("You feel relief but fear lingers.", 1);
				} else if(judy == 0) {
					if(Molpy.Boosts['NavCode'].IsEnabled) {
						Molpy.Notify('Your alterations to the navigation code have saved the day!', 1);
					} else {
						Molpy.Notify('You feel safe.', 1);
					}
				}
			}
			Molpy.judgeLevel = judy;

			if(Molpy.judgeLevel) Molpy.EarnBadge('Judgement Dip Warning');
			if(Molpy.judgeLevel > 1) Molpy.EarnBadge('Judgement Dip');
		};

		/**************************************************************
		 * Boost Shop
		 *************************************************************/
		Molpy.shopNeedRepaint = 1;
		Molpy.sandToolPriceFactor = 1.1;
		Molpy.SandTools = [];
		Molpy.SandToolsById = [];
		Molpy.SandToolsN = 0;
		Molpy.CastleTools = [];
		Molpy.CastleToolsById = [];
		Molpy.CastleToolsN = 0;
		Molpy.SandToolsOwned = 0;
		Molpy.CastleToolsOwned = 0;
		Molpy.priceFactor = 1;

		Molpy.mustardTools = 0;
		Molpy.MustardCheck = function() {
			Molpy.mustardTools = 0;
			for(var i in Molpy.SandToolsById){
				if(isNaN(Molpy.SandToolsById[i].amount)) Molpy.mustardTools ++;	
			}
			for(var i in Molpy.CastleToolsById){
				if(isNaN(Molpy.CastleToolsById[i].amount)) Molpy.mustardTools ++;	
			}
			if(Molpy.mustardTools == 12) Molpy.EarnBadge('Mustard Tools');
		};

		Molpy.SandTool = function(args) {
			// Assign all properties passed in
			for(var prop in args) {
				if(typeof args[prop] !== 'undefined' )
					this[prop] = args[prop];
			}
			
			this.id = Molpy.SandToolsN;
			this.name = args.name;
			args.commonName = args.commonName.split('|');
			this.single = args.commonName[0];
			this.plural = args.commonName[1];
			this.actionName = args.commonName[2];
			this.desc = args.desc;
			this.basePrice = args.price;
			this.price = this.basePrice;
			this.spmNP = args.spmNP;
			this.totalSand = 0;
			this.storedSpmNP = 0;
			this.storedTotalSpmNP = 0;
			this.gpmNP = args.gpmNP;
			this.totalGlass = 0;
			this.storedGpmNP = 0;
			this.storedTotalGpmNP = 0;
			this.nextThreshold = args.nextThreshold;
			this.pic = args.pic;
			this.icon = args.icon || 'generic';
			this.background = args.background;
			this.buyFunction = args.buyFunction;
			this.drawFunction = args.drawFunction;
			this.divElement = null;

			this.amount = 0;
			this.bought = 0;
			this.temp = 0;

			this.buy = function() {
				if(Molpy.ProtectingPrice()) return;
				var times = Math.pow(4, Molpy.options.sandmultibuy);
				var bought = 0;
				var spent = 0;
				this.findPrice();
				while(times-- > 0) {
					var price = this.price * Molpy.priceFactor;
					if(!isFinite(price)) {
						Molpy.UnlockBoost('TF');
						Molpy.EarnBadge(this.name + ' Shop Failed');
					} else if(Molpy.Has('Castles', price)) {
						Molpy.Spend('Castles', price, 1);
						this.amount++;
						this.bought++;
						bought++;
						spent += price;
						this.findPrice();
						if(this.buyFunction) this.buyFunction(this);
						if(this.drawFunction) this.drawFunction();
						Molpy.toolsNeedRepaint = 1;
						Molpy.recalculateRates = 1;
						Molpy.SandToolsOwned++;
						Molpy.CheckBuyUnlocks(1);
					}
				}
				if(Molpy.Got('TDE')) {
					var tdf = Molpy.TDFactor(1) - 1;
					var dups = Math.floor(bought * tdf);
					this.amount += dups;
					this.temp += dups;
					bought += dups;
					this.findPrice();
				}
				if(bought) {
					Molpy.Notify('Spent ' + Molpify(spent, 3) + ' Castle' + plural(spent) + ', Bought '
						+ Molpify(bought, 3) + ' ' + (bought > 1 ? this.plural : this.single), 1);
					_gaq && _gaq.push(['_trackEvent', 'Buy Tool', this.name, '' + bought]);
				}
			};
			
			this.create = function(n) {
				this.amount += n;
				this.bought += n;
				Molpy.SandToolsOwned += n;
				if(Molpy.Got('Crystal Dragon') && Molpy.Got('TDE')) {
					var tdf = Molpy.TDFactor() - 1;
					var dups = Math.floor(n * tdf);
					this.amount += dups;
					this.temp += dups;
					Molpy.SandToolsOwned += dups;
				}
				return this;
			};
			
			this.sell = function() {
				if(this.amount > 0) {
					this.amount--;
					this.findPrice();

					if(this.temp > 0) {
						this.temp--;
						Molpy.Notify('Temporal Duplicate Destroyed!');
					} else {
						var d = 1;
						if(Molpy.Got('Family Discount')) d = .2;
						d *= Molpy.Boosts['ASHF'].startPower();
						Molpy.Boosts['Castles'].build(Math.floor(this.price * 0.5 * d), 1);
					}
					if(this.sellFunction) this.sellFunction();
					if(this.drawFunction) this.drawFunction();
					Molpy.toolsNeedRepaint = 1;
					Molpy.recalculateRates = 1;
					Molpy.SandToolsOwned--;
					_gaq && _gaq.push(['_trackEvent', 'Sell Tool', this.name, '1']);
					Molpy.UnlockBoost('No Sell');
					Molpy.CheckBuyUnlocks(1);
				}
			};
			
			this.destroyTemp = function() {
				var cost = this.temp * 5;
				if(Molpy.Has('GlassBlocks', cost)) {
					Molpy.Spend('GlassBlocks', cost);
					var destroy = Math.min(this.amount, this.temp);
					this.amount = Math.max(0, this.amount - this.temp);
					this.temp = 0;
					this.Refresh();
					Molpy.Add('AD', cost);
					_gaq && _gaq.push(['_trackEvent', 'Destroy Tool', this.name, '' + destroy]);
					Molpy.CheckDragon();
					Molpy.MustardCheck();
				}
			};
			
			this.isAffordable = function() {

				if(Molpy.ProtectingPrice()) return 0;
				var price = Math.floor(Molpy.priceFactor * this.basePrice * Math.pow(Molpy.sandToolPriceFactor, this.amount));
				return isFinite(price) && Molpy.Has('Castles', price);
			};
			
			this.Refresh = function() {
				Molpy.toolsNeedRepaint = 1;
				Molpy.recalculateRates = 1;
				this.findPrice();
				if(this.drawFunction) this.drawFunction();
			};
			
			this.findPrice = function() {
				if(this.amount > 9000)
					this.price = Infinity;
				else
					this.price = Math.floor(this.basePrice * Math.pow(Molpy.sandToolPriceFactor, this.amount));
			};
			
			// Methods for Div Creation
			this.getFullClass = function() {
				return 'floatbox tool sand shop';
			}
			
			this.getHeading = function() {return '';}
			
			this.getFormattedName = function() {
				var fname = '' + format(this.name);
				if(isNaN(this.amount))
					fname = 'Mustard ' + fname;
				else if(Molpy.Got('Glass Ceiling ' + (this.id * 2)))
					fname = 'Glass ' + fname;
				return fname;
			};
			
			this.getOwned = function() {
				return Molpify(this.amount, 3);
			}
			
			this.getPrice = function() {
				var price = '';
				if(isFinite(Molpy.priceFactor * this.price) || !Molpy.Got('TF') || !Molpy.Got('Glass Ceiling ' + this.id * 2))
					price = {Castles: (Math.floor(EvalMaybeFunction(this.price, this, 1) * Molpy.priceFactor))};
				else if(!isNaN(this.price))
					price = {GlassChips: 1000 * (this.id * 2 + 1)};
				return price;
			}
			
			this.getBuySell = function() {
				var numBuy = Math.pow(4, Molpy.options.sandmultibuy);
				var noBuy = this.isAffordable() ? '' : ' unbuyable';
				var buysell = '';
				if(isFinite(Molpy.priceFactor * this.price) || !(Molpy.Earned(this.name + ' Shop Failed') && Molpy.Got('TF'))) {
					buysell = '<a class="buySpan' + noBuy + '" onclick="Molpy.SandToolsById[' + this.id + '].buy();">Buy&nbsp;'
						+ numBuy + '</a>' + (Molpy.Boosts['No Sell'].power ? '' : ' <a class="sellSpan" onclick="Molpy.SandToolsById[' + this.id + '].sell();">Sell</a>');
				}
				return buysell;
			}
			
			this.getProduction = function() {
				var production = '';
				if(isNaN(this.amount))
					production = 'Mustard/click: 1';
				else if(this.storedTotalGpmNP)
					production = 'Glass/mNP: ' + Molpify(this.storedTotalGpmNP, (this.storedTotalGpmNP < 10 ? 3 : 1));
				else
					production = 'Sand/mNP: ' + Molpify(this.storedTotalSpmNP, (this.storedTotalSpmNP < 10 ? 3 : 1));
				
				return production;				
			}
			
			this.getDesc = function() {
				var desc = '';
				if(Molpy.IsStatsVisible()) {
					if(isFinite(Molpy.priceFactor * this.price) || !Molpy.Got('TF')
						|| !Molpy.Got('Glass Ceiling ' + (this.id * 2))) {
						desc = 'Total Sand ' + this.actionName + ': ' + Molpify(this.totalSand, 1) + '<br>Sand/mNP per '
							+ this.single + ': ' + Molpify(this.storedSpmNP, (this.storedSpmNP < 10 ? 3 : 1));
					} else {
						desc = 'Total Chips ' + this.actionName + ': ' + Molpify(this.totalGlass, 1)
							+ '<br>Glass/mNP per ' + this.single + ': '
							+ Molpify(this.storedGpmNP, (this.storedGpmNP < 10 ? 3 : 1));
					}

					desc += '<br>Total ' + this.plural + ' bought: ' + Molpify(this.bought);
					Molpy.EarnBadge('The Fine Print'); //TODO this probably needs to go somewhere else
				} else {
					desc = this.desc;
				}
				
				return desc;
			}
			
			// Args:
			//    forceNew (T/F): force recreation of the object's div
			//    hover (T/F): add hover mechanics to the div
			//    nohide (T/F): don't automatically hide the description when the div is created, useful for clicking a div's buttons
			this.getDiv = function(args) {
				if(this.divElement) {
					if(!args.forceNew)
						return this.divElement;
					this.divElement.remove();
				}
				this.divElement = Molpy.newObjectDiv('tool', this, {hover: (args.hover || false), nohide: (args.nohide || false)});
				return this.divElement;
			}
			
			this.hasDiv = function() {
				if(this.divElement) return true;
				return false;
			}
			
			// Methods for Div Updates
			
			this.repaint = function() {
				if(!this.divElement) return;
				
				var parent = this.divElement.parent();
				var index = this.divElement.index();
				Molpy.removeDiv(this);
				
				// If mouse is currently hovering over this, it will start hovered
				var nh = false;
				var overID = '' + this.name + this.id;
				if(Molpy.mouseIsOver == overID) nh = true;
				
				this.getDiv({forceNew: true, hover: true, nohide: nh});
				parent.children().eq(index).before(this.divElement);
				
			}
			
			this.updateAll = function() {
				this.updateBuy();
				this.updatePrice();
				this.updateProduction();
			}
			
			this.updateBuy = function() {
				if(!this.divElement) return;
				this.divElement.find('.buySpan').toggleClass('unbuyable', !this.isAffordable());
			};
			
			this.updatePrice = function() {
				if(!this.divElement) return;
				this.divElement.find('.price').innerHTML = Molpy.createPriceHTML(this.getPrice());
			}
			
			this.updateProduction = function() {
				if(!this.divElement) return;
				this.divElement.find('.production').innerHTML = this.getProduction();
			}
			
			// Create CSS style for tool
			if(this.gifIcon){
				addCSSRule(document.styleSheets[1], '.darkscheme .tool_' + this.icon + '.icon', "background-image:url('img/tool_" + this.icon + "_light_icon.gif' )");
				addCSSRule(document.styleSheets[1], '.lightscheme .tool_' + this.icon + '.icon', "background-image:url('img/tool_" + this.icon + "_dark_icon.gif' )");
			} else if(this.icon) {
				addCSSRule(document.styleSheets[1], '.darkscheme .tool_' + this.icon + '.icon', "background-image:url('img/tool_" + this.icon + "_light_icon.png' )");
				addCSSRule(document.styleSheets[1], '.lightscheme .tool_' + this.icon + '.icon', "background-image:url('img/tool_" + this.icon + "_dark_icon.png' )");
			}
			if(this.heresy){
				addCSSRule(document.styleSheets[1], '.darkscheme.heresy .tool_' + this.icon + '.icon', "background-image:url('img/tool_" + this.icon + "_light_heresy_icon.png' )");
				addCSSRule(document.styleSheets[1], '.lightscheme.heresy .tool_' + this.icon + '.icon', "background-image:url('img/tool_" + this.icon + "_dark_heresy_icon.png' )");
			}
			
			Molpy.SandTools[this.name] = this;
			Molpy.SandToolsById[this.id] = this;
			
			Molpy.SandToolsN++;
			
			return this;
		};

		Molpy.CastleTool = function(args) {
			// Assign all properties passed in
			for(var prop in args) {
				if(typeof args[prop] !== 'undefined' )
					this[prop] = args[prop];
			}
			
			this.id = Molpy.CastleToolsN;
			this.name = args.name;
			args.commonName = args.commonName.split('|');
			this.single = args.commonName[0];
			this.plural = args.commonName[1];
			this.actionDName = args.commonName[2];
			this.actionBName = args.commonName[3];
			this.desc = args.desc;
			this.price0 = args.price0;
			this.price1 = args.price1;
			this.prevPrice = args.price0;
			this.nextPrice = args.price1;
			this.price = this.prevPrice + this.nextPrice; //fib!
			this.destroyC = args.destroyC;
			this.buildC = args.buildC;
			this.destroyG = args.destroyG;
			this.buildG = args.buildG;
			this.totalCastlesBuilt = 0;
			this.totalCastlesDestroyed = 0;
			this.totalCastlesWasted = 0; //those destroyed for no gain
			this.totalGlassBuilt = 0;
			this.totalGlassDestroyed = 0;
			this.currentActive = 0;
			this.nextThreshold = args.nextThreshold;
			this.pic = args.pic;
			this.icon = args.icon || 'generic';
			this.background = args.background;
			this.buyFunction = args.buyFunction;
			this.drawFunction = args.drawFunction;
			this.destroyFunction = args.destroyFunction;
			this.divElement = null;

			this.amount = 0;
			this.bought = 0;
			this.temp = 0;

			this.buy = function() {
				if(Molpy.ProtectingPrice()) return;
				var times = Math.pow(4, Molpy.options.castlemultibuy);
				var bought = 0;
				var spent = 0;
				while(times-- > 0) {
					var price = Math.floor(Molpy.priceFactor * this.price);
					if(!isFinite(price)) {
						Molpy.UnlockBoost('TF');
						Molpy.EarnBadge(this.name + ' Shop Failed');
					} else if(Molpy.Has('Castles', price)) {
						Molpy.Spend('Castles', price, 1);
						this.amount++;
						this.bought++;
						bought++;
						spent += price;
						this.findPrice();
						if(this.buyFunction) this.buyFunction(this);
						if(this.drawFunction) this.drawFunction();
						Molpy.toolsNeedRepaint = 1;
						Molpy.recalculateRates = 1;
						Molpy.CastleToolsOwned++;
						Molpy.CheckBuyUnlocks(1);
					}
				}
				if(Molpy.Got('TDE')) {
					var tdf = Molpy.TDFactor(1) - 1;
					var dups = Math.floor(bought * tdf);
					this.amount += dups;
					this.temp += dups;
					bought += dups;
					this.findPrice();
					if(this.temp > 32) Molpy.UnlockBoost('AD');
				}
				if(bought) {
					Molpy.Notify('Spent ' + Molpify(spent, 3) + ' Castle' + plural(spent) + ', Bought '
						+ Molpify(bought, 3) + ' ' + (bought > 1 ? this.plural : this.single), 1);
					_gaq && _gaq.push(['_trackEvent', 'Buy Tool', this.name, '' + bought]);
				}
			};
			
			this.create = function(n) {
				this.amount += n;
				this.bought += n;
				Molpy.CastleToolsOwned += n;
				if(Molpy.Got('Crystal Dragon') && Molpy.Got('TDE')) {
					var tdf = Molpy.TDFactor() - 1;
					var dups = Math.floor(n * tdf);
					this.amount += dups;
					this.temp += dups;
					Molpy.CastleToolsOwned += dups;
				}
				return this;
			};
			
			this.sell = function() {
				this.findPrice();
				if(this.amount > 0) {
					if(this.temp > 0) {
						this.temp--;
						Molpy.Notify('Temporal Duplicate Destroyed!');
					} else {
						var d = 1;
						if(Molpy.Got('Family Discount')) d = .2;
						d *= Molpy.Boosts['ASHF'].startPower();
						Molpy.Boosts['Castles'].build(this.prevPrice * d, 1);
					}

					this.amount--;
					this.findPrice();
					if(this.sellFunction) this.sellFunction();
					if(this.drawFunction) this.drawFunction();
					Molpy.toolsNeedRepaint = 1;
					Molpy.recalculateRates = 1;
					Molpy.CastleToolsOwned--;
					_gaq && _gaq.push(['_trackEvent', 'Sell Tool', this.name, '1']);
					Molpy.UnlockBoost('No Sell');
					Molpy.CheckBuyUnlocks(1);
				}
			};
			
			this.destroyTemp = function() {
				var cost = this.temp * 10;
				if(Molpy.Has('GlassBlocks', cost)) {
					Molpy.Spend('GlassBlocks', cost);
					var destroy = Math.min(this.amount, this.temp);
					this.amount = Math.max(0, this.amount - this.temp);
					this.temp = 0;
					this.Refresh();
					Molpy.Add('AD', cost);
					_gaq && _gaq.push(['_trackEvent', 'Destroy Tool', this.name, '' + destroy]);
					Molpy.CheckDragon();
					Molpy.MustardCheck();
				}
				else
				{
					Molpy.Notify('Not nearly glassy enough.', 1);
				}
			};
			
			this.isAffordable = function() {
				if(Molpy.ProtectingPrice()) return 0;
				var price = Math.floor(Molpy.priceFactor * this.price);
				return isFinite(price) && Molpy.Has('Castles', price);
			};
			
			this.DestroyPhase = function() {
				var i = this.amount;
				var inf = Molpy.Got('Castles to Glass') && !isFinite(Molpy.Boosts['Castles'].power) && !isFinite(Molpy.priceFactor * this.price);
				var destroyN = EvalMaybeFunction(inf ? this.destroyG : this.destroyC);
				var destroyT = destroyN * i || 0;
				if(inf) {
					if(Molpy.Boosts['TF'].power >= destroyT) {
						this.currentActive += i;
						this.totalGlassDestroyed += destroyT;
						Molpy.Boosts['TF'].destroyGlass(destroyT);
						if(this.destroyFunction) this.destroyFunction();
						return;
					}
				} else {
					if(Molpy.Boosts['Castles'].power >= destroyT) {
						this.currentActive += i;
						this.totalCastlesDestroyed += destroyT;
						Molpy.Destroy('Castles', destroyT);
						if(this.destroyFunction) this.destroyFunction();
						return;
					}
				}
				if(inf) {
					var iAfford = Math.min(i, Math.floor(Molpy.Boosts['TF'].power / destroyN) || 0);
					this.currentActive += iAfford;
					this.totalGlassDestroyed += destroyN * iAfford || 0;
					Molpy.Boosts['TF'].destroyGlass(destroyN * iAfford || 0);

				} else {
					var iAfford = Math.min(i, Math.floor(Molpy.Boosts['Castles'].power / destroyN));
					var waste = 0;
					if(iAfford < i) {
						waste = Molpy.Boosts['Castles'].power - destroyN * iAfford;
					}
					this.currentActive += iAfford;
					this.totalCastlesDestroyed += destroyN * iAfford;
					this.totalCastlesWasted += waste;

					Molpy.Destroy('Castles', destroyN * iAfford + waste);
				}
				if(this.destroyFunction) this.destroyFunction();

			};
			
			this.BuildPhase = function() {
				var inf = Molpy.Got('Castles to Glass') && !isFinite(Molpy.Boosts['Castles'].power) && !isFinite(Molpy.priceFactor * this.price);
				var buildN = EvalMaybeFunction(inf ? this.buildG : this.buildC);
				buildN *= this.currentActive;
				if(inf) {
					buildN = Math.floor(buildN*Molpy.Papal('GlassCastle'));
					Molpy.Boosts['TF'].digGlass(buildN);
					this.totalGlassBuilt += buildN;
				} else {
					buildN = Math.floor(buildN*Molpy.Papal('Castles'));
					Molpy.Boosts['Castles'].build(buildN);
					if(isNaN(this.totalCastlesBuilt)) {
						this.totalCastlesBuilt = 0;
						Molpy.EarnBadge('Mustard Cleanup');
					}
					this.totalCastlesBuilt += buildN;
				}
				this.currentActive = 0;
			};
			
			this.findPrice = function() {
				var i = this.amount;
				if(isNaN(i)) {
					this.price = NaN;
					return;
				}
				if(i > 1500) { //don't even bother
					this.prevPrice = Infinity;
					this.nextPrice = Infinity;
					this.price = Infinity;
					return;
				}
				this.prevPrice = this.price0;
				this.nextPrice = this.price1;
				var p = this.prevPrice + this.nextPrice;
				while(i-- > 0) {
					this.prevPrice = this.nextPrice;
					this.nextPrice = p;
					p = this.prevPrice + this.nextPrice;
				}
				this.price = p;
			};
			
			this.Refresh = function() {
				Molpy.toolsNeedRepaint = 1;
				Molpy.recalculateRates = 1;
				this.findPrice();
				if(this.drawFunction) this.drawFunction();
			};
			
			// Methods for Div Creation
			this.getFullClass = function() {
				return 'floatbox tool castle shop';
			}
			
			this.getHeading = function() {return '';}
			
			this.getFormattedName = function() {
				var fname = '' + format(this.name);
				if(isNaN(this.amount))
					fname = 'Mustard ' + fname;
				else if(Molpy.Got('Glass Ceiling ' + (this.id * 2 + 1)))
					fname = 'Glass ' + fname;
				return fname;
			};
			
			this.getOwned = function() {
				return Molpify(this.amount, 3);
			}
			
			this.getPrice = function() {
				var price = '';
				if(isFinite(Molpy.priceFactor * this.price) || !Molpy.Got('TF') || !Molpy.Got('Glass Ceiling ' + this.id * 2 + 1))
					price = {Castles: (Math.floor(EvalMaybeFunction(this.price, this, 1) * Molpy.priceFactor))};
				else if(!isNaN(this.price))
					price = {GlassChips: 1000 * (this.id * 2 + 2)};
				return price;
			}
			
			this.getBuySell = function() {
				var numBuy = Math.pow(4, Molpy.options.castlemultibuy);
				var noBuy = this.isAffordable() ? '' : ' unbuyable';
				var buysell = '';
				if(isFinite(Molpy.priceFactor * this.price) || !(Molpy.Earned(this.name + ' Shop Failed') && Molpy.Got('TF'))) {
					buysell = '<a class="buySpan' + noBuy + '" onclick="Molpy.CastleToolsById[' + this.id + '].buy();">Buy&nbsp;'
						+ numBuy + '</a>' + (Molpy.Boosts['No Sell'].power ? '' : ' <a class="sellSpan" onclick="Molpy.CastleToolsById[' + this.id + '].sell();">Sell</a>');
				}
				return buysell;
			}
			
			this.getProduction = function() {
				var production = '';
				if(isNaN(this.amount))
					production += 'Mustard/click: 1<br>';
				if(this.currentActive && Molpy.CastleTools['NewPixBot'].ninjaTime > Molpy.ONGelapsed) {
					if(Molpy.ninjad) {
						production += "Ninja'd!";
					} else {
						production += 'Active: ' + Molpify(this.currentActive, 3) + '<br>Timer: '
							+ Molpify(Math.ceil((Molpy.CastleTools['NewPixBot'].ninjaTime - Molpy.ONGelapsed) / Molpy.NPlength));
					}
				}
				
				return production;				
			}
			
			this.getDesc = function() {
				var desc = '';
				var inf = Molpy.Got('Castles to Glass') && !isFinite(Molpy.Boosts['Castles'].power) && !isFinite(Molpy.priceFactor * this.price);
				var bN = EvalMaybeFunction(inf ? this.buildG : this.buildC);
				var dN = EvalMaybeFunction(inf ? this.destroyG : this.destroyC);
				var w = inf ? 'Chip' : 'Castle';
				var actuals = '<br>Each builds ' + Molpify(bN, 1) + ' ' + w + plural(bN)
					+ (dN ? (' if it destroys ' + Molpify(dN, 1) + ' ' + w + plural(dN)) : '');
				if(this.name == 'Wave' && Molpy.Got('SBTF') && !inf) {
					bN = this.buildC(1);
					dN = this.destroyC(1);
					actuals += '<br>Next ONG, each will build ' + Molpify(bN, 1) + ' ' + w + plural(bN)
						+ (dN ? (' if it destroys' + Molpify(dN, 1) + ' ' + w + plural(dN)) : '');
				}
				if(Molpy.IsStatsVisible()) {
					if(isFinite(Molpy.priceFactor * this.price) || !Molpy.Got('TF') || !Molpy.Got('Glass Ceiling ' + (this.id * 2 + 1))) {
						if(this.totalCastlesDestroyed)
							desc += 'Total Castles ' + this.actionDName + ': ' + Molpify(this.totalCastlesDestroyed)
								+ '<br>Total Castles wasted: ' + Molpify(this.totalCastlesWasted);
						if(this.totalCastlesBuilt)
							desc += '<br>Total Castles ' + this.actionBName + ': +' + Molpify(this.totalCastlesBuilt);
					} else {
						if(this.totalGlassDestroyed)
							desc += 'Total Chips ' + this.actionDName + ': ' + Molpify(this.totalGlassDestroyed);
						if(this.totalGlassBuilt)
							desc += '<br>Total Chips ' + this.actionBName + ': +' + Molpify(this.totalGlassBuilt);
					}
					desc += '<br>Total ' + this.plural + ' bought: ' + Molpify(this.bought);
					desc += '<br>' + actuals;
					Molpy.EarnBadge('Keeping Track');
				} else {
					desc = this.desc + actuals;
				}
				
				return desc;
			}
			
			// Args:
			//    forceNew (T/F): force recreation of the object's div
			//    hover (T/F): add hover mechanics to the div
			//    nohide (T/F): don't automatically hide the description when the div is created, useful for clicking a div's buttons
			this.getDiv = function(args) {
				if(this.divElement) {
					if(!args.forceNew)
						return this.divElement;
					this.divElement.remove();
				}
				this.divElement = Molpy.newObjectDiv('tool', this, {hover: (args.hover || false), nohide: (args.nohide || false)});
				return this.divElement;
			}
			
			this.hasDiv = function() {
				if(this.divElement) return true;
				return false;
			}
			
			// Methods for Div Updates
			
			this.repaint = function() {
				if(!this.divElement) return;
				
				var parent = this.divElement.parent();
				var index = this.divElement.index();
				Molpy.removeDiv(this);
				
				// If mouse is currently hovering over this, it will start hovered
				var nh = false;
				var overID = '' + this.name + this.id;
				if(Molpy.mouseIsOver == overID) nh = true;
				
				this.getDiv({forceNew: true, hover: true, nohide: nh});
				parent.children().eq(index).before(this.divElement);			
			}
			
			this.updateAll = function() {
				this.updateBuy();
				this.updatePrice();
				this.updateProduction();
			}
			
			this.updateBuy = function() {
				if(!this.divElement) return;
				this.divElement.find('.buySpan').toggleClass('unbuyable', !this.isAffordable());
			};
			
			this.updatePrice = function() {
				if(!this.divElement) return;
				this.divElement.find('.price').innerHTML = Molpy.createPriceHTML(this.getPrice());
			}
			
			this.updateProduction = function() {
				if(!this.divElement) return;
				this.divElement.find('.production').innerHTML = this.getProduction();
			}
			
			// Create CSS style for tool
			if(this.gifIcon){
				addCSSRule(document.styleSheets[1], '.darkscheme .tool_' + this.icon + '.icon', "background-image:url('img/tool_" + this.icon + "_light_icon.gif' )");
				addCSSRule(document.styleSheets[1], '.lightscheme .tool_' + this.icon + '.icon', "background-image:url('img/tool_" + this.icon + "_dark_icon.gif' )");
			} else if(this.icon) {
				addCSSRule(document.styleSheets[1], '.darkscheme .tool_' + this.icon + '.icon', "background-image:url('img/tool_" + this.icon + "_light_icon.png' )");
				addCSSRule(document.styleSheets[1], '.lightscheme .tool_' + this.icon + '.icon', "background-image:url('img/tool_" + this.icon + "_dark_icon.png' )");
			}
			if(this.heresy){
				addCSSRule(document.styleSheets[1], '.darkscheme.heresy .tool_' + this.icon + '.icon', "background-image:url('img/tool_" + this.icon + "_light_heresy_icon.png' )");
				addCSSRule(document.styleSheets[1], '.lightscheme.heresy .tool_' + this.icon + '.icon', "background-image:url('img/tool_" + this.icon + "_dark_heresy_icon.png' )");
			}

			Molpy.CastleTools[this.name] = this;
			Molpy.CastleToolsById[this.id] = this;
			Molpy.CastleToolsN++;
			return this;
		};

		Molpy.Level = function(stuff) {
			var b = Molpy.Boosts[stuff];
			return b && b.Level;
		};
		Molpy.IsEnabled = function(stuff) {
			var b = Molpy.Boosts[stuff];
			return b && b.IsEnabled;
		};
		Molpy.Has = function(stuff, amount) {
			if(typeof (stuff) === 'object') {
				for( var i in stuff) {
					if(!Molpy.Has(i, stuff[i])) return 0;
				}
				return 1;
			} else {
				var b = Molpy.Boosts[stuff];
				return b && b.Has(EvalMaybeFunction(amount, 0, 1));
			}
		};
		Molpy.Add = function(stuff, amount, s) {
			var b = Molpy.Boosts[stuff];
			return b && b.Add(EvalMaybeFunction(amount, 0, 1), s);
		};
		Molpy.Spend = function(stuff, amount, s) {
			if(typeof (stuff) === 'object') {
				if(!Molpy.Has(stuff)) return 0;
				for( var i in stuff) {
					Molpy.Spend(i, stuff[i]);
				}
				return 1;
			} else {
				amount = EvalMaybeFunction(amount, 0, 1);
				var b = Molpy.Boosts[stuff];
				return b && b.Has(amount) && b.Spend(amount, s);
			}
		};
		Molpy.PriceString = function(stuff, amount) {
			if(typeof (stuff) === 'object') {
				var str = '';
				var first = 1;
				for( var i in stuff) {
					var b = Molpy.Boosts[i];
					var s = stuff[i];
					if(!s) continue;
					if(first)
						first = 0;
					else
						str += ' + ';
					str += Molpy.PriceString(s == 1 ? b.single : b.plural, s);
				}
				return str;
			} else {
				return Molpify(EvalMaybeFunction(amount, 0, 1), 2) + '&nbsp;' + stuff; //todo: use a nice display name rather than alias
			}
		};
		Molpy.IsFree = function(stuff) {
			for( var i in stuff) {
				if(stuff[i]) return 0;
			}
			return 1;
		};
		Molpy.Destroy = function(stuff, amount, s) {
			var b = Molpy.Boosts[stuff];
			return b && amount >= 0 && b.Destroy(amount, s);
		};

		Molpy.BoostFuncs = {
			PosPowerLevel: [function() {
				return this.power;
			}, function(amount) {
				this.power = Math.max(0, amount) || 0;
				this.Refresh();
			}],
			RoundPosPowerLevel: [function() {
				return this.power;
			}, function(amount) {
				this.power = Math.round(Math.max(0, amount)) || 0;
				this.Refresh();
			}],
			Bought0Level: [function() {
				return this.bought;
			}, function(amount) {
				this.bought = amount;
				this.Refresh();
			}],
			Bought1Level: [function() {
				return this.bought - 1;
			}, function(amount) {
				this.bought = amount + 1;
				this.Refresh();
			}],
			Add: function(amount) {
				this.Level += amount;
				return 1;
			},
			Spend: function(amount) {
				this.Level -= amount;
				return 1;
			},
			Destroy: function(amount) {
				this.Level -= amount;
				return 1;
			},
			Has: function(amount) {
				return (amount <= 0 || this.Level >= amount) * 1;
			},
			BoolPowEnabled: [function() {
				return (this.power == true) * 1;
			}, function(val) {
				this.power = val;
			}],
			PosPowEnabled: [function() {
				return (this.power > 0) * 1;
			}, function(val) {
				this.power = val;
			}],
			RefreshPowerBuy: function() {
				if(this.power && !this.bought) {
					Molpy.UnlockBoost(this.alias);
					this.buy();
				}
			}
		};

		Molpy.boostNeedRepaint = 1;
		Molpy.boostHTML = '';
		Molpy.Boosts = [];
		Molpy.BoostsById = [];
		Molpy.BoostsByGroup = [];
		Molpy.BoostN = 0;
		Molpy.BoostsBought = [];
		Molpy.BoostsOwned = 0;
		Molpy.BoostAKA = [];
		Molpy.boostSilence = 0;
		var order = 0;
		Molpy.Boost = function(args) {
			// Notes
			// .department allows unlock by the department (this is not a saved value)
			// .logic allows unlock by logicat (this is not a saved value)
			
			this.id = Molpy.BoostN;
			this.order = this.id;
			if(order) this.order = order + this.id / 1000; //(because the order we create them can't be changed after we save)
			this.boost = true;
			this.unlocked = 0;
			this.bought = 0;
			this.power = 0;
			this.countdown = 0;
			
			// Assign all properties passed in
			for(var prop in args) {
				if(typeof args[prop] !== 'undefined' )
					this[prop] = args[prop];
			}
			
			// Special Assignments
			this.alias = args.alias || args.name;
			this.single = args.single || args.name;
			this.plural = args.plural || ((args.single || args.name) + 's');
			this.group = args.group || 'boosts';
			this.icon = args.icon || Molpy.groupNames[this.group][2];
			
			// Conditional assignments
			if(args.defStuff) {
				args.Level = args.Level || Molpy.BoostFuncs.PosPowerLevel;
				this.Has = args.Has || Molpy.BoostFuncs.Has;
				this.Add = args.Add || Molpy.BoostFuncs.Add;
				this.Spend = args.Spend || Molpy.BoostFuncs.Spend;
				this.Destroy = args.Destroy || Molpy.BoostFuncs.Destroy;
				this.refreshFunction = args.refreshFunction || Molpy.BoostFuncs.RefreshPowerBuy;
				delete this.defStuff;
			}
			
			if(args.Level) {
				this.Level = {}; // Clear automatic assignment
				Object.defineProperties(this, {
					"Level": {
						get: args.Level[0],
						set: args.Level[1]
					}
				});
			}
			
			if(args.IsEnabled) {
				this.IsEnabled = {}; // Clear automatic assignment
				Object.defineProperties(this, {
					"IsEnabled": {
						get: args.IsEnabled[0],
						set: args.IsEnabled[1]
					}
				});
			}
			
			if(args.startPower) this.power = ZeroIfFunction(args.startPower);
			
			// SaveData in in the format: saveOrder: [propertyName, defaultValue, type]
			// Valid types: 'int' 'float' 'array' Anything else will be assigned directly without processing
			var defSaveData = {
					0:['unlocked', 0, 'int'],
					1:['bought', 0, 'float'],
					2:['power', 0, 'float'],
					3:['countdown', 0, 'float']
			};
			if(!this.saveData){
				this.saveData = defSaveData;
			} else if(args.defSave){
				delete this.defSave
				Molpy.extend(this.saveData, defSaveData, false); // Add the default properties to save without overwriting
			}

			// Methods
			this.buy = function(auto) {
				if(!this.unlocked || this.bought) return; //shopping assistant tried to buy it when it was locked

				var realPrice = this.CalcPrice(this.price);
				var free = Molpy.IsFree(realPrice);
				if(Molpy.ProtectingPrice() && !free) return;
				if(!free && !Molpy.Spend(realPrice)) return;

				this.bought = 1;
				if(this.buyFunction) this.buyFunction();
				_gaq && _gaq.push(['_trackEvent', 'Boost', 'Buy', this.name, !free]);
				Molpy.boostNeedRepaint = 1;
				Molpy.recalculateRates = 1;
				Molpy.BoostsOwned++;
				Molpy.CheckBuyUnlocks();
				Molpy.unlockedGroups[this.group] = 1;
				this.Refresh();
				if(!Molpy.boostSilence && !free && this.bought && !auto && Molpy.options.autoshow) {
					Molpy.ShowGroup(this.group, this.className);
				}
				if(this.bought) Molpy.lootAddBoost(this);
			};
			
			this.isAffordable = function() {
				var realPrice = this.CalcPrice(this.price);
				if(Molpy.IsFree(realPrice)) return 1;
				if(Molpy.ProtectingPrice()) return 0;
				return Molpy.Has(realPrice);
			};
			
			this.CalcPrice = function(stuff) {
				var p = {};
				for( var i in stuff) {
					var v = Math.floor(Molpy.priceFactor * EvalMaybeFunction(stuff[i], this, 1));
					if(isNaN(v)) {
						v = 0;
						Molpy.EarnBadge('How do I Shot Mustard?');
					}
					if(v) p[i] = v;
				}
				return p;
			};
			
			this.Refresh = function(indirect) {
				Molpy.boostNeedRepaint = 1;

				this.faveRefresh = 1;
				if(!indirect && this.refreshFunction) this.refreshFunction();
			};
			
			this.GetAlias = function() {
				if(Molpy.IsStatsVisible() && this.name != this.alias) {
					return '<br>(Alias: ' + this.alias + ')';
				}
				return '';
			};
			
			this.describe = function() {
				if(!Molpy.boostSilence) {
					var desc = EvalMaybeFunction(this.desc, this);
					if(desc) Molpy.Notify(this.name + ': ' + desc, 1);
				}
			};
			
			this.resetSaveData = function() {
				for(var i in this.saveData)
					this.saveData[i][0] = this.saveData[i][1];
			}
			
			// Methods for Div Creation
			this.getFullClass = function() {
				return 'boost ' + (this.bought || this.countdown > 0 ? 'lootbox loot ' : 'floatbox shop ') + (this.className || '');
			}
			
			this.getHeading = function() {
				return "" + Molpy.groupNames[this.group][0]
			     + ((this.tier != undefined && ' L' + Molpify(EvalMaybeFunction(this.tier))) || '');
			}
			
			this.getFormattedName = function() {
				return '' + format(this.name);
			};
			
			this.getOwned = function() {return '';}
			
			this.getPrice = function() {
				var p = '';
				var realPrice = this.CalcPrice(this.price);
				if(!Molpy.IsFree(realPrice)) p = realPrice;
				return p;
			}
			
			this.getBuySell = function() {
				var buy = '';
				if(!this.bought && this.unlocked) {
					var noBuy = this.isAffordable() ? '' : ' unbuyable';
					buy = '<a class="buySpan' + noBuy + '" onclick="Molpy.BoostsById[' + this.id + '].buy();">Buy</a>';
				}
				return buy;
			}
			
			this.getProduction = function() {return '';}
			
			this.getDesc = function() {
				return format(EvalMaybeFunction((Molpy.IsStatsVisible() && this.stats) ? this.stats : this.desc, this))
				     + format(this.prizes && Molpy.IsStatsVisible() && ('<br>Gives ' + Molpify(this.prizes)
				            + ' random Prize' + plural(this.prizes) + ' from tier L' + EvalMaybeFunction(this.tier, 'show')
				            + ' when Locked or Reset.') || '')
				     + this.GetAlias();
			}
			
			// Args:
			//    forceNew (T/F): force recreation of the object's div
			//    hover (T/F): add hover mechanics to the div
			//    nohide (T/F): don't automatically hide the description when the div is created, useful for clicking a div's buttons
			this.getDiv = function(args) {
				if(this.divElement) {
					if(!args.forceNew)
						return this.divElement;
					this.divElement.remove();
				}
				this.divElement = Molpy.newObjectDiv('boost', this, {hover: (args.hover || false), nohide: (args.nohide || false)});
				return this.divElement;
			}
			
			this.hasDiv = function() {
				if(this.divElement) return true;
				return false;
			}
			
			// Methods for Div Updates
			
			this.repaint = function() {
				if(!this.divElement) return;
				
				var parent = this.divElement.parent();
				var index = this.divElement.index();
				Molpy.removeDiv(this);
				
				// If mouse is currently hovering over this, it will start hovered
				var nh = false;
				var overID = '' + this.name + this.id;
				if(Molpy.mouseIsOver == overID) nh = true;
				
				this.getDiv({forceNew: true, hover: true, nohide: nh});
				parent.children().eq(index).before(this.divElement);		
			}
			
			this.updateAll = function() {
				this.updateBuy();
				this.updatePrice();
				this.updateProduction();
			}
			
			this.updateBuy = function(fave) {
				if(!this.divElement) return;
				if(this.unlocked && (fave || !this.bought)) {
					this.divElement.find('.buySpan').toggleClass('unbuyable', !this.isAffordable());
				}
			};
			
			this.updatePrice = function() {
				if(!this.divElement) return;
				this.divElement.find('.price').innerHTML = Molpy.createPriceHTML(this.getPrice());
			}
			
			this.updateProduction = function() {
				if(!this.divElement) return;
				this.divElement.find('.production').innerHTML = this.getProduction();
			}

			// Add the boost to lists
			Molpy.Boosts[this.alias] = this;
			Molpy.BoostsById[this.id] = this;
			if(!Molpy.BoostsByGroup[this.group]) {
				Molpy.BoostsByGroup[this.group] = [];
			}
			Molpy.BoostsByGroup[this.group].push(this);
			if(this.name != this.alias) {
				Molpy.BoostAKA[this.name] = this.alias;
			}

			// Create CSS styles for the boost
			if(this.gifIcon){
				addCSSRule(document.styleSheets[1], '.darkscheme .boost_' + this.icon + '.icon', "background-image:url('img/boost_" + this.icon + "_dark_icon.gif' )");
				addCSSRule(document.styleSheets[1], '.lightscheme .boost_' + this.icon + '.icon', "background-image:url('img/boost_" + this.icon + "_light_icon.gif' )");
			} else if(this.icon) {
				addCSSRule(document.styleSheets[1], '.shop .boost_' + this.icon + '.icon', "background-image:url('img/boost_" + this.icon + "_grey_icon.png' )");
				addCSSRule(document.styleSheets[1], '.darkscheme .loot .boost_' + this.icon + '.icon', "background-image:url('img/boost_" + this.icon + "_dark_icon.png' )");
				addCSSRule(document.styleSheets[1], '.lightscheme .loot .boost_' + this.icon + '.icon', "background-image:url('img/boost_" + this.icon + "_light_icon.png' )");
			}
			if(this.heresy){
				addCSSRule(document.styleSheets[1], '.darkscheme.heresy .loot .boost_' + this.icon + '.icon', "background-image:url('img/boost_" + this.icon + "_dark_heresy_icon.png' )");
				addCSSRule(document.styleSheets[1], '.lightscheme.heresy .loot .boost_' + this.icon + '.icon', "background-image:url('img/boost_" + this.icon + "_light_heresy_icon.png' )");
			}
			
			Molpy.BoostN++;
			
			return this;
		};

		Molpy.UnlockBoost = function(bacon, auto) {
			if(typeof bacon === 'string') {
				var me = Molpy.Boosts[bacon];
				if(me) {
					if(me.unlocked == 0) {
						me.unlocked = 1;
						Molpy.shopNeedRepaint = 1;
						Molpy.recalculateRates = 1;
						if(!Molpy.boostSilence && !(Molpy.Got('ASHF') && me.alias == Molpy.shoppingItem)) {
							Molpy.Notify('Boost Unlocked: ' + me.name, 1);
							_gaq && _gaq.push(['_trackEvent', 'Boost', 'Unlock', me.name, true]);
						}
						if(me.unlockFunction) me.unlockFunction();
						me.Refresh();
						if(me.alias == Molpy.shoppingItem) {
							Molpy.Donkey();
						} else {
							Molpy.Mule(me.id);
						}
					}
				}
			} else { //yo wolpy I heard you like bacon...
				for( var i in bacon) {
					Molpy.UnlockBoost(bacon[i]);
				}
			}
		};
		Molpy.GiveTempBoost = function(bacon, power, countdown, desc) {
			var bb = Molpy.Boosts[bacon];
			if(bb) {
				if(desc) bb.desc = desc;
				bb.power = EvalMaybeFunction(power || bb.startPower);
				bb.countdown = EvalMaybeFunction(countdown || bb.startCountdown);
				bb.unlocked = 1;
				bb.buy(1);
				bb.describe();
				Molpy.recalculateRates = 1;
			}
		};
		Molpy.LockBoost = function(bacon) {
			if(typeof bacon === 'string') {
				var me = Molpy.Boosts[bacon];
				if(me) {
					if(me.unlocked == 1) {
						me.unlocked = 0;
						Molpy.lootRemoveBoost(me);
						Molpy.removeDiv(me);
						Molpy.shopNeedUpdate = 1;
						Molpy.toolsNeedUpdate = 1;
						Molpy.recalculateRates = 1;

						if(me.lockFunction) me.lockFunction();
						if(me.bought) {
							Molpy.BoostsOwned--;
							me.bought = 0;
							me.Refresh();
						}
						if(me.prizes) Molpy.LockPrize(me.id);
						if(!Molpy.boostSilence && !(Molpy.Got('ASHF') && me.alias == Molpy.shoppingItem)) {
							Molpy.Notify('Boost Locked: ' + me.name, 1);
							_gaq && _gaq.push(['_trackEvent', 'Boost', 'Lock', me.name, true]);
						}
						Molpy.CheckBuyUnlocks();
					}
				}
			} else { //so I put bacon in your bacon
				for( var i in bacon) {
					Molpy.LockBoost(bacon[i]);
				}
			}
		};
		Molpy.Got = function(back) { //I like big molpies and I can not lie
			return(Molpy.Boosts[back] ? Molpy.Boosts[back].bought : 0);
			//also, watch www.youtube.com/watch?v=tTYr3JuueF4
		};

		Molpy.previewNP = 0;

		Molpy.badgeNeedRepaint = 1;
		Molpy.badgeHTML = '';
		Molpy.Badges = [];
		Molpy.BadgesById = [];
		Molpy.BadgeAKA = [];
		Molpy.BadgesEarned = [];
		Molpy.BadgesAvailable = [];
		Molpy.BadgeN = 0;
		Molpy.BadgesOwned = 0;
		var order = 0;
		Molpy.Badge = function(args) {
			this.id = Molpy.BadgeN;
			this.order = this.id;
			if(order) this.order = order + this.id / 1000; //(because the order we create them can't be changed after we save)
			this.earned = 0;
			this.badge = true;
			
			// Assign all properties passed in
			for(var prop in args) {
				if(typeof args[prop] !== 'undefined' )
					this[prop] = args[prop];
			}
			
			// Special assignments
			this.alias = args.alias || args.name;
			this.visibility = args.vis || 0; //0 is normal, 1 is hidden description, 2 is hidden name, 3 is invisible
			this.group = args.group || 'badges';
			this.icon = args.icon || Molpy.groupNames[this.group][2];

			// Methods
			this.Refresh = function() {
				this.faveRefresh = 1;
			};
			
			this.GetAlias = function() {
				if((this.earned || this.visibility < 1) && Molpy.IsStatsVisible() && this.name != this.alias) {
					return '<br>(Alias: ' + this.alias + ')';
				}
				return '';
			};
			
			this.HasUpgrade = function() {
				if(this.np) {
					var nGroup = Molpy.nextBageGroup[this.group];
					var nBadge = Molpy.Badges[nGroup + this.np];
					if(nBadge && !nBadge.earned) {
						return true;
					}
				}
			};
			
			// Methods for Div Creation
			this.getFullClass = function() {
				var cn = 'badge lootbox ' + (this.earned ? 'loot ' : 'shop ') + (this.className || '');
				if(this.HasUpgrade()) cn += ' action ';
				if(this.np < 0) cn += 'flip-horizontal ';
				return cn;
			}
			
			this.getHeading = function() {
				return '' + Molpy.groupNames[this.group][0] + (this.HasUpgrade() ? '+' : '');
			}
			
			this.getFormattedName = function() {
				return '' + format((this.earned || this.visibility < 2 ? this.name : '????'));
			};
			
			this.getOwned = function() {return '';}
			
			this.getPrice = function() {return '';}
			
			this.getBuySell = function() {return '';}
			
			this.getProduction = function() {return '';}
			
			this.getDesc = function() {
				var text = EvalMaybeFunction((Molpy.IsStatsVisible() && this.stats) ? this.stats : this.desc, this);
				return format(((this.earned || this.visibility < 1) ? text : '????')) + this.GetAlias();
			}
			
			// Args:
			//    forceNew (T/F): force recreation of the object's div
			//    hover (T/F): add hover mechanics to the div
			//    nohide (T/F): don't automatically hide the description when the div is created, useful for clicking a div's buttons
			this.getDiv = function(args) {
				if(this.divElement) {
					if(!args.forceNew)
						return this.divElement;
					this.divElement.remove();
				}
				this.divElement = Molpy.newObjectDiv('badge', this, {hover: (args.hover || false), nohide: (args.nohide || false)});
				return this.divElement;
			}
			
			this.hasDiv = function() {
				if(this.divElement) return true;
				return false;
			}
			
			// Methods for Div Updates
			
			this.repaint = function() {
				if(!this.divElement) return;
				
				var parent = this.divElement.parent();
				var index = this.divElement.index();
				Molpy.removeDiv(this);
				
				// If mouse is currently hovering over this, it will start hovered
				var nh = false;
				var overID = '' + this.name + this.id;
				if(Molpy.mouseIsOver == overID) nh = true;
				
				this.getDiv({forceNew: true, hover: true, nohide: nh});
				parent.children().eq(index).before(this.divElement);		
			}
			
			this.updateAll = function() {} //badges don't really update, would be nice to get rid of this

			// Add Badge to lists
			Molpy.Badges[this.alias] = this;
			Molpy.BadgesById[this.id] = this;
			Molpy.BadgeAKA[this.name] = this.alias;
			
			// Create CSS style for badges with unique icons
			if(this.icon != 'discov' && this.icon != 'sandmonument' && this.icon != 'glassmonument' && this.icon != 'masterpiece') {
				if(this.gifIcon){
					addCSSRule(document.styleSheets[1], '.darkscheme .badge_' + this.icon + '.icon', "background-image:url('img/badge_" + this.icon + "_light_icon.gif' )");
					addCSSRule(document.styleSheets[1], '.lightscheme .badge_' + this.icon + '.icon', "background-image:url('img/badge_" + this.icon + "_dark_icon.gif' )");
				} else if(this.icon) {
					addCSSRule(document.styleSheets[1], '.darkscheme .loot .badge_' + this.icon + '.icon', "background-image:url('img/badge_" + this.icon + "_light_icon.png' )");
					addCSSRule(document.styleSheets[1], '.lightscheme .loot .badge_' + this.icon + '.icon', "background-image:url('img/badge_" + this.icon + "_dark_icon.png' )");
				}
				if(this.heresy){
					addCSSRule(document.styleSheets[1], '.darkscheme.heresy .loot .badge_' + this.icon + '.icon', "background-image:url('img/badge_" + this.icon + "_light_heresy_icon.png' )");
					addCSSRule(document.styleSheets[1], '.lightscheme.heresy .loot .badge_' + this.icon + '.icon', "background-image:url('img/badge_" + this.icon + "_dark_heresy_icon.png' )");
				}
			}
			
			Molpy.BadgeN++;
			
			return this;
		};

		Molpy.groupBadgeCounts = {};
		Molpy.EarnBadge = function(bacon, camera) {
			if(typeof bacon === 'string') {
				var baby = Molpy.Badges[bacon];
				if(baby) {
					if(baby.earned == 0 && !Molpy.needlePulling) {
						baby.earned = 1;
						Molpy.lootAddBadge(baby);
						_gaq && _gaq.push(['_trackEvent', 'Badge', 'Earn', baby.name, Molpy.BadgesOwned < 6 || baby.group != 'badges' && !camera]);
						if(Molpy.BadgesOwned == 0) Molpy.EarnBadge('Redundant Redundancy');
						Molpy.badgeNeedRepaint = 1;
						Molpy.recalculateRates = 1;
						Molpy.BadgesOwned++;
						Molpy.unlockedGroups[baby.group] = 1;
						if(baby.group == 'badges') {
							Molpy.Notify('Badge Earned: ' + baby.name, 1, 0, 0, EvalMaybeFunction(baby.desc));
						} else {
							Molpy.Notify((baby.np < 0 ? '<div class="flip-horizontal">' + baby.name + '</div>' : baby.name), 1);
						}

						Molpy.EarnBadge('Redundant');
						Molpy.CheckBuyUnlocks();
						if(Molpy.Earned('Badgers')) {
							Molpy.recalculateRates = 1;
						}
						if(baby.group == 'monumg' && Molpy.Got('Maps')) Molpy.Boosts['Maps'].Refresh();
						if(!Molpy.groupBadgeCounts[baby.group]) {
							Molpy.groupBadgeCounts[baby.group] = 1;
						} else {
							Molpy.groupBadgeCounts[baby.group]++;
						}
						if (Molpy.options.autoshow!=0)
						{
							if (Molpy.options.autoshow==1 || (baby.group != 'monumg' && baby.group != 'monums'))
								Molpy.ShowGroup(baby.group, baby.className);
						}

					}
				}
			} else { //so you can be bacon while you're bacon
				for( var i in bacon) {
					Molpy.EarnBadge(bacon[i]);
				}
			}
		};
		Molpy.Earned = function(bacon) {
			var baby = Molpy.Badges[bacon];
			return baby && baby.earned;
		};

		Molpy.Hands = [];
		Molpy.HandsById = [];
		Molpy.HandN = 0;
		Molpy.Hand = function(args) {
			this.CharactersById = []; //no name indexed array for characters because you can have duplicates
			this.CharacterN = 0;

			this.id = Molpy.HandN;
			this.name = args.name;

			Molpy.Hands[this.name] = this;
			Molpy.HandsById[this.id] = this;
			Molpy.HandN++;
			return this;
		};

		new Molpy.Hand({
			name: 'Dragons'
		});//player
		new Molpy.Hand({
			name: 'Castle'
		});//enemy!

		Molpy.Characters = [];//this is the list of all types of character. a hand will contain copies of these.
		Molpy.CharactersById = [];
		Molpy.CharacterN = 0;
		Molpy.Character = function(args) {
			this.id = Molpy.CharacterN;
			this.name = args.name;
			this.tier = args.tier;
			this.health = this.maxhealth = args.health;
			this.attack = args.attack;
			this.cooldown = this.maxcooldown = args.cooldown;
			this.space = args.space;
			this.inventory = [];
			this.intel = args.intel;//intelligence affects what actions can be performed by this character

			Molpy.Characters[this.name] = this;
			Molpy.CharactersById[this.id] = this;
			Molpy.CharacterN++;
			return this;
		};
		
		Molpy.Redacted = function(args) {
			this.word2 = Molpy.BeanishToCuegish("UmVkdW5kYW50");
			this.word = Molpy.BeanishToCuegish("UmVkdW5kYWtpdHR5");
			this.words = Molpy.BeanishToCuegish("UmVkdW5kYWtpdHRpZXM=");
			this.brackets = Molpy.BeanishToCuegish("JTI1NUJyZWR1bmRhbnQlMjU1RA==");
			this.spoiler = Molpy.BeanishToCuegish("JTI1M0NpZnJhbWUlMjUyMHNyYyUyNTNEJTI1MjJodHRwJTI1M0ElMjUyRiUyNTJGd3d3LnlvdXR1YmUuY29tJTI1MkZlbWJlZCUyNTJGb0hnNVNKWVJIQTAlMjUzRmF1dG9wbGF5JTI1M0QxJTI1MjIlMjUyMHdpZHRoJTI1M0QlMjUyMjEwMCUyNTIyJTI1MjBoZWlnaHQlMjUzRCUyNTIyNjglMjUyMiUyNTIwZnJhbWVib3JkZXIlMjUzRCUyNTIyMCUyNTIyJTI1MjBhbGxvd2Z1bGxzY3JlZW4lMjUzRSUyNTNDJTI1MkZpZnJhbWUlMjUzRQ==");
			
			this.totalClicks = 0;
			this.chainCurrent = 0;
			this.chainMax = 0;
			
			this.countup = 0;
			this.toggle = 0;
			this.possibleLocations = 7;
			this.location = 0; // Which section it will appear in
			this.group = ''; // Which group it will appear in
			this.dispIndex = -1;
			this.drawType = [];
			this.divElement = null;
			
			this.divList = {
					1: $('#sandtools'),
					2: $('#castletools'),
					3: $('#boosts'),
					4: $('#loot'), // in a boost group
					5: $('#loot'), // in a badge  group
					6: $('#loot'), // in badges available
					7: $('#loot')}; // in tagged list
			this.titleList = {
					1: $('#toolSTitle'),
					2: $('#toolCTitle'),
					3: $('#boostTitle'),
					4: $('#lootTitle'),
					5: $('#lootTitle'),
					6: $('#lootTitle'),
					7: $('#lootTitle')};
			
			this.classNames = ['hidden', 'floatbox sand tool shop', 'floatbox castle tool shop', 'floatbox boost shop',
			                   'lootbox boost loot', 'lootbox badge loot', 'lootbox badge shop', 'lootbox boost loot'];
			this.tempAreaClass = '';
			
			this.checkToggle = function() {
				if(this.toggle) {
					this.countup++;
					var redC = g('redactedcountdown');
					if(redC) redC.innerHTML = Molpify(this.toggle - this.countup);
					if(this.countup >= this.toggle) {
						this.countup = 0;
						if(this.location) {
							this.removeDiv();
							this.location = 0; //hide because the redacted was missed
							this.drawType = [];
							_gaq && _gaq.push(['_trackEvent', 'Redundakitty', 'Chain Timeout', '' + this.chainCurrent, true]);
							this.chainCurrent = 0;
							this.randomiseTime();
							Molpy.lootSelectionNeedRepaint = 1;
						} else {
							this.drawType = ['show'];
							this.jump();
							var stay = 6 * (4 + Molpy.Got('Kitnip') + Molpy.Got('SGC') * 2);
							this.toggle = stay;
							Molpy.repaintRedacted();
						}
					}
				} else {//initial setup
					this.randomiseTime();
				}
			};
			
			this.randomiseTime = function() {
				var min = 200 - 80 * (Molpy.Got('Kitnip') + Molpy.Got('Kitties Galore')) - 30 * Molpy.Got('RRSR');
				var spread = 90 - 20 * (Molpy.Got('Kitnip') + Molpy.Got('Kitties Galore') + Molpy.Got('RRSR'));
				this.toggle = min + Math.ceil(spread * Math.random());
				this.group = '';
				if(Molpy.Boosts['RRSR'].unlocked && !Molpy.Boosts['RRSR'].bought) {
					this.toggle *= 12;
				}
			};
			
			this.onClick = function(level) {
				level = level || 0;
				this.removeDiv();
				Molpy.lootSelectionNeedRepaint = 1;
				if(this.drawType[level] != 'show') {
					Molpy.UnlockBoost('Technicolour Dream Cat');
					this.drawType[level] = 'show';
					while(this.drawType.length > level + 1)
						this.drawType.pop(); //we don't need to remember those now
					this.jump();
					return;
				}

				if(Molpy.Got('RRSR') && flandom(20) == 1) {
					this.drawType[level] = 'hide1';
					this.toggle = 65;
					this.chainCurrent++;
					this.countup = this.chainCurrent;
				} else if(Molpy.Got('Redunception') && this.drawType.length < 21
					&& flandom(8 / this.drawType.length) == 0) {
					this.drawType[level] = 'recur';
					this.drawType.push('show');
					this.jump();
					this.chainCurrent++;
					if(this.drawType.length < 5 && this.toggle < 5) {
						this.toggle = 5;
						this.countup = this.chainCurrent;
					}
				} else if(Molpy.Got('Logicat') && this.drawType.length < 21
					&& flandom(6 / this.drawType.length) == 0) {
					Molpy.PuzzleGens.redacted.Generate();
					this.drawType[level] = 'hide2';
					this.jump();
					if(this.toggle < 20) {
						this.toggle = 20;
					}
					this.countup = 0;
					this.chainCurrent++;
				} else { // it goes away.					
					var item = g('redacteditem');
					if(item) item.className = 'hidden';
					this.location = 0;
					this.dispIndex = -1;
					this.drawType = [];
					this.countup = 0;
					this.randomiseTime();
					_gaq && _gaq.push(['_trackEvent', 'Redundakitty', 'Chain End', '' + this.chainCurrent]);
					this.chainCurrent = 0;
				}
				this.chainMax = Math.max(this.chainMax, this.chainCurrent);
				if(this.chainMax >= 42) Molpy.EarnBadge('Meaning');

				this.totalClicks++;
				if(this.drawType.length < 16) {
					Molpy.RewardRedacted();
					if(Molpy.Got('Double Department')) {
						Molpy.RewardRedacted();
					}
					Molpy.GlassNotifyFlush();
				}
				if(this.totalClicks >= 2) Molpy.EarnBadge('Not So ' + Molpy.Redacted.word2);
				if(this.totalClicks >= 14) Molpy.EarnBadge("Don't Litter!");
				if(this.totalClicks >= 16) Molpy.UnlockBoost('Kitnip');
				if(this.totalClicks >= 32) Molpy.UnlockBoost('DoRD');
				if(this.totalClicks >= 64) Molpy.Boosts['Kitties Galore'].department = 1;
				if(this.totalClicks >= 128) Molpy.EarnBadge('Y U NO BELIEVE ME?');
				if(this.totalClicks >= 256) Molpy.UnlockBoost('BKJ');
			};
			
			this.jump = function() {
				// If no possible spots are open, then no redacteds can spawn
				var possible = false;
				for(var i in this.divList)
					if(this.divList[i].is(':visible')) {
						possible = true;
						break;
					}
				if(!possible) this.location = 0;
				
				// There is at least one valid spawn location, grab a random one
				//TODO this can be made better by making a list of valid first and selecting from that instead
				var valid = false;
				var loopNum = 0;
				var randNum = 0;
				while(loopNum < 50 && valid == false) {
					randNum = Math.ceil((this.possibleLocations + 2) * Math.random());
					if(randNum > this.possibleLocations) randNum = 4;
					if(this.divList[randNum].is(':visible')) {
						this.location = randNum;
						valid = true;
					}
					loopNum ++;
				}
				
				// Unlucky RNG, didn't find a valid spawn location 
				if(!valid) this.location = 0;
				
				this.dispIndex = -1;
			};

			this.getHTML = function(heading, level) {
				level = level || 0;
				var drawType = this.drawType[level];
				var label = (drawType == 'show') ? 'Show' : 'Hide';
				
				heading = heading ? '<h1>' + Molpy.Redacted.brackets + '</h1>' : '';
				var countdown = (level == 0) ? '&nbsp;<span id="redactedcountdown" class="faded">' + Molpify(this.toggle - this.countup) + '</span>' : '';
				var str = '<div id="redacteditem">' + heading + '<div class="icon redacted"></div><h2">' + Molpy.Redacted.word
					+ countdown + '</h2><div><b>Spoiler:</b><input type="button" value="' + label + '" onclick="Molpy.Redacted.onClick(' + level + ')"</input>';
				
				if(drawType == 'recur') {
					str += this.getHTML(heading, level + 1);
				} else if(drawType == 'hide1') {
					str += Molpy.Redacted.spoiler;
				} else if(drawType == 'hide2') {
					str += Molpy.PuzzleGens.redacted.StringifyStatements();
				}

				return str + '</div></div>';
			}
			
			this.getDiv = function(heading, level, forceNew) {
				if(!this.divElement || forceNew) {
					if(forceNew) {
						this.removeDiv();
					}
					this.divElement = $(this.getHTML(heading, level));
				}
				
				return this.divElement;
			}
			
			this.removeDiv = function() {
				if(!this.divElement) return;
				this.divElement.remove();
				this.divElement = null;
				for(var i in Molpy.Redacted.titleList) {
					Molpy.Redacted.titleList[i].toggleClass('redacted-area', false);
				}
			}
		}
		Molpy.Redacted = new Molpy.Redacted(); // Why do I have to do this?
		
		Molpy.TaggedLoot = [];
		
		Molpy.BuildLootLists = function () {
			Molpy.TaggedLoot = [];
			Molpy.BoostsBought = [];
			Molpy.BadgesEarned = [];
			Molpy.BadgesAvailable = [];
			Molpy.DiscovMonumEarned = [];
			
			// Setup Boost list for use
			for(var i in Molpy.Boosts) {
				var me = Molpy.Boosts[i];
				if(me.bought) Molpy.BoostsBought.push(me);
				if(me.bought && me.className && me.className != '') {
					Molpy.TaggedLoot.push(me);
				}
			}
			
			// Setup Badge list for use
			for( var i in Molpy.BadgesById) {
				var me = Molpy.BadgesById[i];
				if(!me.earned && me.group == 'badges'){
					Molpy.BadgesAvailable.push(me);
				}
				else if(me.earned) {
					if(me.group == 'discov'
					   || me.group == 'monums'
					   || me.group == 'monumg'
					   || me.group == 'diamm') {
						Molpy.DiscovMonumEarned.push(me);
					}
					else if(me.group == 'badges') {
						Molpy.BadgesEarned.push(me);
					}
					
					if(me.className && me.className != '') Molpy.TaggedLoot.push(me);
				}
			}
			
			// Don't need to sort DiscovMonum because it is already in ID order
			Molpy.BoostsBought.sort(Molpy.NameSort);
			Molpy.BadgesAvailable.sort(Molpy.NameSort);
			Molpy.BadgesEarned.sort(Molpy.NameSort);
			Molpy.TaggedLoot.sort(Molpy.ClassNameSort);
		}
		
		Molpy.lootAddBoost = function(boost) {
			if(Molpy.BoostsBought.length < 4) {
				Molpy.BoostsBought.push(boost);
				Molpy.BoostsBought.sort(Molpy.NameSort);
			} else
				Molpy.lootSortedInsert(boost, Molpy.BoostsBought);
			
			Molpy.lootMaybeAddTagged(boost);
		}
		
		Molpy.lootAddBadge = function(badge) {
			if(badge.group == 'discov'
			   || badge.group == 'monums'
			   || badge.group == 'monumg'
			   || badge.group == 'diamm') {
				Molpy.lootAddDiscovMonum(badge);
				return;
			}
			
			if(Molpy.BadgesEarned.length < 4) {
				Molpy.BadgesEarned.push(badge);
				Molpy.BadgesEarned.sort(Molpy.NameSort);
			} else
				Molpy.lootSortedInsert(badge, Molpy.BadgesEarned);
			
			Molpy.lootMaybeAddTagged(badge);
			
			//remove badge from available list if it is in there
			var index = $.inArray(badge, Molpy.BadgesAvailable);
			if(index > -1)
				Molpy.BadgesAvailable.splice(index, 1);
		}
		
		Molpy.lootAddDiscovMonum = function(obj) {
			if(Molpy.DiscovMonumEarned.length < 4) {
				Molpy.DiscovMonumEarned.push(obj);
				Molpy.DiscovMonumEarned.sort(Molpy.IDSort);
			} else
				Molpy.lootSortedInsert(obj, Molpy.DiscovMonumEarned, 0, Molpy.DiscovMonumEarned.length, 'id');
			
			Molpy.lootMaybeAddTagged(obj);
		}
		
		Molpy.lootMaybeAddTagged = function(obj) {
			if(obj.className && obj.className != '') {
				if(Molpy.TaggedLoot.length < 4) {
					Molpy.TaggedLoot.push(obj);
					Molpy.TaggedLoot.sort(Molpy.ClassNameSort);
				} else
					Molpy.lootSortedInsert(obj, Molpy.TaggedLoot, 0, Molpy.TaggedLoot.length, 'className');
			}
		}
		
		Molpy.lootSortedInsert = function(object, array, start, end, sort) {
			start = start || 0;
			end = end || array.length;
			sort = sort || 'name';
			array.splice(Molpy.lootFindInsert(object, array, start, end, sort) + 1, 0, object)
		}
		
		Molpy.lootRemoveBoost = function(boost) {
			var index = $.inArray(boost, Molpy.BoostsBought);
			if(index > -1) {
				Molpy.BoostsBought.splice(index, 1);
				Molpy.lootNeedRepaint = 1;
			}
			index = $.inArray(boost, Molpy.TaggedLoot);
			if(index > -1) {
				Molpy.TaggedLoot.splice(index, 1);
				Molpy.lootNeedRepaint = 1;
			}
		}
		
		Molpy.lootCheckTagged = function(object) {
			if(!object.className || object.className == '') {
				var index = $.inArray(object, Molpy.TaggedLoot);
				if(index > -1) {
					Molpy.TaggedLoot.splice(index, 1);
				}
			} else {
				var index = $.inArray(object, Molpy.TaggedLoot);
				if(index <= -1) {
					Molpy.TaggedLoot.push(object);
					Molpy.TaggedLoot.sort(Molpy.ClassNameSort);
				}
			}
		}
		
		Molpy.lootFindInsert = function(object, array, start, end, sort) {
			start = start || 0;
			end = end || array.length;
			sort = sort || 'name';
			var pivot = Math.floor(start + (end - start) / 2);
			if (end-start <= 1 || array[pivot] === object) return pivot;
			
			// Figure out if we need to look before or after pivot for insertion point
			var searchAfter = true; 
			if(sort == 'className')
				searchAfter = Molpy.ClassNameSort(object, array[pivot]) > 0 ? true : false;
			else if(sort == 'id')
				searchAfter = Molpy.IDSort(object, array[pivot]) > 0 ? true : false;
			else
				searchAfter = Molpy.NameSort(object, array[pivot]) > 0 ? true : false;
			
			if(searchAfter) {
				return Molpy.lootFindInsert(object, array, pivot, end, sort);
			} else {
				return Molpy.lootFindInsert(object, array, start, pivot, sort);
			}
		}

		Molpy.RewardRedacted = function(forceDepartment, automationLevel) {
			var event = forceDepartment ? 'DoRD' : Molpy.Redacted.word;
			if(Molpy.Got('DoRD') && (!Math.floor(8 * Math.random()) || forceDepartment)) {
				if(Molpy.Got('Blast Furnace') && !Math.floor(4 * Math.random())) {
					_gaq && _gaq.push(['_trackEvent', event, 'Reward', 'Blast Furnace', true]);
					Molpy.RewardBlastFurnace();
					return;
				}

				Molpy.CheckDoRDRewards(automationLevel);

				var availRewards = [];
				for( var i in Molpy.Boosts) {
					var me = Molpy.Boosts[i];
					if(!me.unlocked && me.department) {
						availRewards.push(me);
					}
				}

				if(availRewards.length) {
					var red = GLRschoice(availRewards);
					if(!Molpy.IsFree(red.CalcPrice(red.price))) {
						if(!Molpy.boostSilence) Molpy.Notify('The DoRD has produced:', 1);
						Molpy.UnlockBoost(red.alias, 1);
					} else {
						if(!Molpy.boostSilence) Molpy.Notify('The DoRD has provided:', 1);
						Molpy.GiveTempBoost(red.alias);
					}
					return;
				}
			}
			var BKJ = Molpy.Boosts['BKJ'];
			if(BKJ.bought) {
				BKJ.power = (BKJ.power) + 1;
			}
			if(Math.floor(2 * Math.random())) {
				_gaq && _gaq.push(['_trackEvent', event, 'Reward', 'Not Lucky', true]);
				Molpy.RewardNotLucky(automationLevel);
			} else if(isFinite(Molpy.Boosts['Sand'].power)) {
				_gaq && _gaq.push(['_trackEvent', event, 'Reward', 'Blitzing', true]);
				Molpy.RewardBlitzing(automationLevel);
			} else {
				_gaq && _gaq.push(['_trackEvent', event, 'Reward', 'Blast Furnace Fallback', true]);
				Molpy.RewardBlastFurnace(1, 'Furnace Fallback');
			}
		};
		Molpy.RewardBlastFurnace = function(times, message) {
			var cb = 0;
			if(Molpy.Got('Furnace Crossfeed') && Molpy.NPlength > 1800 && isFinite(Molpy.Boosts['GlassChips'].power)) {
				if(Molpy.Boosts['Glass Furnace'].power && Molpy.Boosts['Furnace Crossfeed'].IsEnabled) {
					Molpy.Boosts['Sand Refinery'].makeChips(times);
					cb = 1;
				}
			}
			if(Molpy.Got('Furnace Multitasking') && Molpy.NPlength > 1800 && isFinite(Molpy.Boosts['GlassBlocks'].power)) {
				if(Molpy.Boosts['Glass Blower'].power && Molpy.Boosts['Furnace Multitasking'].IsEnabled) {
					Molpy.Boosts['Glass Chiller'].makeBlocks(times);
					cb = 1;
				}
			}
			if(!Molpy.boostSilence && (cb || isFinite(Molpy.Boosts['Castles'].power)) ) 
				Molpy.Notify(message || 'Blast Furnace in Operation!');
			if(cb) return;

			if(!isFinite(Molpy.Boosts['Castles'].power)) return; //We don't need to blast!

			var blastFactor = 1000;
			var boosted = 0;
			if(Molpy.Got('Fractal Sandcastles')) {
				blastFactor = Math.max(5, 1000 * Math.pow(0.94, Molpy.Boosts['Fractal Sandcastles'].power*Molpy.Papal('Fractal')));
				if(Molpy.Got('Blitzing')) {
					if(Molpy.Got('BKJ')) {
						blastFactor /= Math.max(1, (Molpy.Boosts['Blitzing'].power - 800) / 600);
						boosted = 1;
					}
					blastFactor /= 2;

				}
			}
			var castles = Math.floor(Molpy.Boosts['Sand'].power / blastFactor);
			if(boosted) {
				castles = Math.floor(Math.min(castles, Molpy.Boosts['Castles'].totalBuilt / 5));
			} else {
				castles = Math.floor(Math.min(castles, Molpy.Boosts['Castles'].totalBuilt / 3));
			}
			Molpy.Spend('Sand', castles * blastFactor);
			Molpy.Boosts['Castles'].build(castles);
		};
		Molpy.RewardNotLucky = function(automationLevel) {
			if(!automationLevel) {
				if(Math.abs(Molpy.newpixNumber) <= 400)
					Molpy.Notify('You are not Lucky (which is good)');
				else
					Molpy.Notify('Not Lucky!');
			}
			if(Molpy.Got('Soul Drain') && Molpy.Got('ShadwDrgn') && Math.random() >= .9) Molpy.Add('Bonemeal', 1);

			var twin = 0;
			if(Molpy.Got('TDE') && Molpy.Got('GlassBlocks')) {
				twin = 1;
				Molpy.Boosts['Lucky Twin'].power++;
				Molpy.Boosts['Lucky Twin'].Refresh();
				if(Molpy.Boosts['Lucky Twin'].power >= 13 * 13) Molpy.UnlockBoost('Lucky Twin');
				if(Molpy.Got('Lucky Twin')) {
					Molpy.Boosts['TDE'].countdown *= 1.2;
					if(Molpy.Boosts['TDE'].countdown > 9e45) {
						Molpy.EarnBadge('Never Alone');
						Molpy.Boosts['TDE'].countdown = 0;
					}
					Molpy.Boosts['TDE'].Refresh();
					if(!automationLevel) Molpy.Notify('Lucky Twin!');
				} else {
					if(!automationLevel) Molpy.Notify('You are doubly not Lucky!', 1);
				}

			}
			var bonus = 0;
			var i = 0;
			var items = 0;
			while(i < Molpy.SandToolsN) {
				bonus += Molpy.SandToolsById[i].amount * Math.pow(3.5, i + 1);
				items += Molpy.SandToolsById[i].amount;
				i++;
			}
			i = 0;
			while(i < Molpy.CastleToolsN) {
				bonus += Molpy.CastleToolsById[i].amount * Math.pow(2.5, i + 1);
				items += Molpy.CastleToolsById[i].amount;
				i++;
			}
			var bb = Molpy.BoostsOwned + Molpy.BadgesOwned;
			bonus += bb;
			items += bb;
			bonus += Molpy.Redacted.totalClicks * 10;
			if(Molpy.Got('BFJ')) {
				bonus *= (1 + 0.2 * Molpy.Boosts['BKJ'].power);
				if(Molpy.Got('Blitzing')) bonus *= Math.min(2, (Molpy.Boosts['Blitzing'].power - 800) / 200);
			}
			var finite = isFinite(Molpy.Boosts['Castles'].power);
			var pg = Molpy.Got('Panther Glaze');
			if(Molpy.Got('RRR') && Molpy.Boosts['RRR'].power && Molpy.Has('GlassBlocks', 30)) {
				bonus *= 10000;
				if(finite)
					Molpy.Spend('GlassBlocks', 30);
				else if(pg) Molpy.Add('GlassChips', 3000 * (twin + 1));
			}
			if(Molpy.Got('LCB') && Molpy.Boosts['LCB'].IsEnabled) {
				if(Molpy.SandTools['Ladder'].amount) {
					items += Math.floor(Molpy.SandTools['Ladder'].amount / 2);
					if(finite && Molpy.Has('GlassBlocks', 35)) {
						Molpy.Spend('GlassBlocks', 35);
					} else {
						Molpy.SandTools['Ladder'].amount--;
						Molpy.SandTools['Ladder'].Refresh();
						Molpy.SandToolsOwned--;
						if(!finite && pg) Molpy.Add('GlassChips', 3500 * (twin + 1));
					}
				}
				if(Molpy.SandTools['Bag'].amount) {
					items += Math.floor(Molpy.SandTools['Bag'].amount / 2);
					if(finite && Molpy.Has('GlassBlocks', 35)) {
						Molpy.Spend('GlassBlocks', 35);
					} else {
						Molpy.SandTools['Bag'].amount--;
						Molpy.SandTools['Bag'].Refresh();
						Molpy.SandToolsOwned--;
						if(!finite && pg) Molpy.Add('GlassChips', 3500 * (twin + 1));
					}
				}
			}
			if(Molpy.Got('Catamaran') && Molpy.Boosts['Catamaran'].IsEnabled) {
				if(Molpy.CastleTools['River'].amount) {
					items += (Molpy.CastleTools['River'].amount) * 6;
					if(finite && Molpy.Has('GlassBlocks', 45)) {
						Molpy.Spend('GlassBlocks', 45);
					} else {
						Molpy.CastleTools['River'].amount--;
						Molpy.CastleTools['River'].Refresh();
						Molpy.CastleToolsOwned--;
						if(!finite && pg) Molpy.Add('GlassChips', 4500 * (twin + 1));
					}
				}
				if(Molpy.CastleTools['Wave'].amount) {
					items += (Molpy.CastleTools['Wave'].amount) * 6;
					if(finite && Molpy.Has('GlassBlocks', 45)) {
						Molpy.Spend('GlassBlocks', 45);
					} else {
						Molpy.CastleTools['Wave'].amount--;
						Molpy.CastleTools['Wave'].Refresh();
						Molpy.CastleToolsOwned--;
						if(!finite && pg) Molpy.Add('GlassChips', 4500 * (twin + 1));
					}
				}
			}
			if(Molpy.Got('Redundant Raptor') && Molpy.Boosts['Redundant Raptor'].IsEnabled) {
				if(finite && Molpy.Has('GlassBlocks', 120)) {
					Molpy.Spend('GlassBlocks', 120);
					items += Molpy.Redacted.totalClicks * 2;
				} else if(!finite && pg) Molpy.Add('GlassChips', 12000 * (twin + 1));
			}
			var nerf = 0;
			if(Molpy.Got('Panther Salve') && Molpy.Boosts['Panther Salve'].power > 0) {
				Molpy.Boosts['Panther Salve'].power++;
				Molpy.Boosts['Panther Salve'].Refresh();
				if(finite && Molpy.Has('GlassBlocks', 10)) {
					Molpy.Spend('GlassBlocks', 10);
					bonus *= Math.pow(1.01, items);
					nerf = 1;
				} else if(!finite && pg) {
					Molpy.Add('GlassChips', 1000 * (twin + 1));
				}
			}
			if(Molpy.Got('Fractal Sandcastles')) {
				bonus *= Math.ceil((Molpy.Boosts['Fractal Sandcastles'].power + 1) / 10);
				nerf = 1;
			}
			if(nerf) bonus = Math.min(bonus, Molpy.Boosts['Castles'].totalBuilt / (50)); //just to keep things sane

			bonus = Math.floor(bonus);
			Molpy.Boosts['Castles'].build(bonus);
			if(Molpy.Got('GlassBlocks')) {
				var gift = 1;
				if(Molpy.Boosts['GlassBlocks'].luckyGlass > 0) {
					Molpy.Boosts['GlassBlocks'].luckyGlass -= 1;
					Molpy.Add('GlassBlocks', gift * (twin + 1));
				} else {
					Molpy.Add('GlassChips', gift * (twin + 1));
				}
				if(Molpy.Got('SGC')) {
					gift = Math.floor(Molpy.Boosts['GlassBlocks'].power / 50);
					var b = Molpy.Level('GlassBlocks');
					Molpy.Add('GlassBlocks', gift * (twin + 1), 1);
					if(isFinite(b) && Molpy.Boosts['AA'].IsEnabled)
						Molpy.Notify(Molpify(gift * (twin + 1), 3) + ' Glass Blocks from ' + Molpy.Boosts['SGC'].name,
								1);
				}
			}

		};
		Molpy.RewardBlitzing = function() {			
			if(Molpy.Got('GL')) {
				Molpy.Boosts['GL'].onBlitz();
				return;
			}
			var blitzSpeed = 800, blitzTime = 23;
			var BKJ = Molpy.Boosts['BKJ'];
			if(BKJ.bought) {
				blitzSpeed += BKJ.power * 20;
				if(BKJ.power > 24) Molpy.Boosts['BFJ'].department = 1;
			}
			if(Molpy.Got('Schizoblitz')) blitzSpeed *= 2;

			if(Molpy.Got('Blitzing')) {
				blitzSpeed += Molpy.Boosts['Blitzing'].power;
				blitzTime += Math.floor(Molpy.Boosts['Blitzing'].countdown / 2);
			}
			if(blitzSpeed >= 1000000) Molpy.EarnBadge('Blitz and Pieces');
			Molpy.GiveTempBoost('Blitzing', blitzSpeed, blitzTime);
		};

		Molpy.RewardLogicat = function(level) {
			Molpy.CheckLogicatRewards(0);
			var availRewards = [];
			for( var i in Molpy.Boosts) {
				var me = Molpy.Boosts[i];
				if(!me.unlocked && me.logic && level >= me.logic) {
					availRewards.push(me);
				}
			}

			if(availRewards.length) {
				var red = GLRschoice(availRewards);
				if(!Molpy.IsFree(red.CalcPrice(red.price))) {
					if(!Molpy.boostSilence) Molpy.Notify('Logicat rewards you with:', 1);
					Molpy.UnlockBoost(red.alias, 1);
				} else {
					if(!Molpy.boostSilence) Molpy.Notify('Your reward from Logicat:', 1);
					Molpy.GiveTempBoost(red.alias);
				}
				return;
			}
			Molpy.RewardRedacted(1);
			Molpy.GlassNotifyFlush();
		};

		Molpy.CalcPriceFactor = function() {
			var baseval = 1;
			if(Molpy.Got('ASHF')) {
				baseval *= (1 - Molpy.Boosts['ASHF'].power);
			}
			if(Molpy.Got('Family Discount')) {
				baseval *= (0.2);
			}
			Molpy.priceFactor = Math.max(0, baseval);
		};

		Molpy.DefineSandTools();
		Molpy.DefineCastleTools();
		Molpy.DefinePuzzles();
		Molpy.DefineBoosts();
		Molpy.DefineBadges();
		Molpy.DefineCharacters();
		Molpy.InitGUI();
	        Molpy.DefaultOptions();
		Molpy.UpdateColourScheme();

		Molpy.UpdateBeach();
		Molpy.HandlePeriods();
		Molpy.startDate = parseInt(new Date().getTime()); //used for save

		/*In which we announce that initialisation is complete
		++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

		Molpy.molpish = 1;
		Molpy.Load(); //autoload saved game
		Molpy.RefreshLayouts();
		Molpy.Loopist();
	};

	Molpy.ActivateNewPixBots = function() {
		Molpy.Boosts['Castles'].buildNotifyFlag = 0;
		var bots = Molpy.CastleTools['NewPixBot'];
		bots.BuildPhase();
		Molpy.Boosts['Castles'].buildNotifyFlag = 1;
		Molpy.Boosts['Castles'].build(0);
		Molpy.ActivateFactoryAutomation();
		Molpy.recalculateRates = 1;
	};
	Molpy.ActivateFactoryAutomation = function() {
		if(Molpy.Got('Factory Automation')) {
			var i = Molpy.Boosts['Factory Automation'].power + 1;
			_gaq && _gaq.push(['_trackEvent', 'Factory Automation', 'Attempt', '' + i, true]);
			var npb = Molpy.CastleTools['NewPixBot'];
			if(flandom(((Molpy.Got('Safety Pumpkin') + Molpy.Got('SG')) * 10 + 20 - i)) == 0) {
				if(npb.amount) {
					npb.amount--;
					npb.Refresh();
					Molpy.Notify('Industrial Accident!', 1);
					if(i > 14) Molpy.UnlockBoost('Safety Pumpkin');
				}
			}
			if(!Molpy.IsEnabled('Cracks') && !Molpy.IsEnabled('Aleph One')) i = Math.min(i, 61);
			i = Math.max(0, Math.min(i, Math.floor(npb.amount / 20)));
			var t = 0;
			var spent = 0;
			while(i-- > 0) {
				var sandToSpend = 2000000 * Math.pow(10000, i);
				if(Molpy.Has('Sand', sandToSpend)) {
					Molpy.Spend('Sand', sandToSpend, 1);
					t++;
					spent += sandToSpend;
				}
			}
			Molpy.Notify('Activating Factory Automation ' + t + ' time' + plural(t) + ' at a cost of ' + Molpify(spent, 4) + ' Sand', 1);

			Molpy.FactoryAutomationRun(t);
			_gaq && _gaq.push(['_trackEvent', 'Factory Automation', 'Succeed', '' + t, true]);

			Molpy.GlassNotifyFlush();
			return t;
		}
	};
	Molpy.FactoryAutomationRun = function(times) {
		var left = times;
		if(Molpy.Got('CfB')) {
			left = Molpy.DoBlackprintConstruction(times);
			if(Molpy.Got('AO')) left = times;
		}
		if(left) {
			left = Molpy.DoMouldWork(left);
			if(Molpy.Got('AO')) {
				left = times;
			}

			while(left--)
				Molpy.RewardRedacted(1, left);
		}
	};

	Molpy.DoMouldWork = function(left) {
		if(!Molpy.Boosts['Cold Mould'].IsEnabled) {
			if(left) left = Molpy.FillGlassMouldWork(left);
			if(left) left = Molpy.MakeGlassMouldWork(left);
			if(left) left = Molpy.FillSandMouldWork(left);
			if(left) left = Molpy.MakeSandMouldWork(left);

			if(Molpy.Got('AO') && Molpy.Got('Mould Press')) {
				while(left) {
					var start = left;
					left = Molpy.FillGlassMouldWork(left);
					if(left) left = Molpy.MakeGlassMouldWork(left);
					if(left) left = Molpy.FillSandMouldWork(left);
					if(left) left = Molpy.MakeSandMouldWork(left);
					if(start == left) break;
				}
			}
		}
		return left;
	};

	Molpy.Shutter = function() {
		if(Molpy.Spend('GlassChips', 10)) {
			if(Molpy.Got('Maps')) {
				if(Molpy.newpixNumber == Molpy.Boosts['Maps'].bought) {
					Molpy.Add('Maps', 1);
					if(Molpy.Has('Maps', 80))  Molpy.UnlockBoost('DNS'); 
					if(Molpy.Has('Maps', 40)) Molpy.UnlockBoost('Lodestone');
					Molpy.Notify('You found a new map!', 1);
					Molpy.ClearMap();
					return;
				}
			}

			var alias = 'discov' + Molpy.newpixNumber;
			if(!Molpy.Badges[alias]) {
				Molpy.Notify('You don\'t notice anything especially notable.');
				return;
			}
			if(Molpy.Earned(alias)) {
				Molpy.Notify('You already have this ' + Molpy.Badges[alias].name);
			} else {
				Molpy.EarnBadge(alias, 1);
			}
			if(Molpy.newpixNumber < 0
				&& !(Molpy.Boosts['Magic Mirror'].unlocked && Molpy.Boosts['Vacuum Cleaner'].unlocked)) {
				var minus = 0;
				for( var i = Molpy.Badges['discov-1'].id; i < Molpy.BadgesById.length - 1; i += 8) {
					if(Molpy.BadgesById[i].earned) {
						minus++;
						if(minus >= 10) {
							Molpy.UnlockBoost('Magic Mirror');
							if(isFinite(Molpy.Boosts['Sand'].sandPermNP)) break;
						}
						if(minus >= 50) {
							Molpy.UnlockBoost('Vacuum Cleaner');
						}
					}
				}
			}
		} else {
			Molpy.Notify('Out of Glass Chips');
		}
	};

	/**************************************************************
	 * Logic?
	 * 
	 * In which we explain how to think
	 * should be called once per milliNewPix
	 *************************************************************/
	Molpy.Think = function() {
		Molpy.toolsBuilt = 0;
		Molpy.Boosts['Sand'].toCastles();
		Molpy.checkLootNums();

		var pp = Molpy.Boosts['Price Protection'];
		if(pp.power > 1) pp.power--;
		if(!(Molpy.ketchupTime || Molpy.Boosts['Coma Molpy Style'].IsEnabled)) Molpy.CheckONG();
		Molpy.Redacted.checkToggle();

		for( var i in Molpy.Boosts)//count down any boosts with a countdown
		{
			var me = Molpy.Boosts[i];
			if(me.bought) {
				if(me.countdown) {
					me.countdown--;
					me.Refresh();
					if(me.countdown <= 0) {
						Molpy.LockBoost(i);
						me.power = 0;
						me.countdown = 0;
					} else {
						if(me.countdownFunction) me.countdownFunction();
					}
				}
			}
			if(me.bought) {
				if(me.classChange) {
					var newclass = me.classChange();
					if (newclass != me.className) {
						me.className = newclass;
						Molpy.lootCheckTagged(me);
						me.Refresh();
						Molpy.boostNeedRepaint = 1;
					}
				}
			}
		}
		for( var i in Molpy.Badges) {
			var me = Molpy.Badges[i];
			if(me.earned) {
				if(me.classChange) {
					var newclass = me.classChange();
					if (newclass != me.className) {
						me.className = newclass;
						Molpy.lootCheckTagged(me);
						me.Refresh();
						Molpy.badgeNeedRepaint = 1;
					}
				}
			}
		}

		if(Molpy.recalculateRates) Molpy.calculateRates();
		for( var i in Molpy.SandTools) {
			var me = Molpy.SandTools[i];
			me.totalSand = isFinite(me.storedTotalSpmNP) ? me.totalSand + me.storedTotalSpmNP : Infinity;
			me.totalGlass = isFinite(me.storedTotalGpmNP) ? me.totalGlass + me.storedTotalGpmNP : Infinity;
		}

		Molpy.Boosts['Sand'].dig(Molpy.Boosts['Sand'].sandPermNP*Molpy.Papal('Sand'));
		if(Molpy.IsEnabled('Vacuum Cleaner') && Molpy.Has('Sand', Infinity) && Molpy.Has(Molpy.VacCost)) {
			Molpy.Boosts['Sand'].Level = 0;
			var sucks = 1;
			if (Molpy.Got('Overtime') && Molpy.NPlength > 1800) sucks++;
			while (sucks--) {
				var vacs = Math.floor((Molpy.Level('TS') || 1)*Molpy.Papal('Dyson'));
				if(vacs > 1) {
					vacs = Math.min(vacs, Molpy.Level('FluxCrystals') / (Molpy.VacCost.FluxCrystals));
					vacs = Math.min(vacs, Molpy.Level('QQ') / (Molpy.VacCost.QQ));
					vacs = Math.floor(vacs);
				}
				Molpy.Spend({
					FluxCrystals: Molpy.VacCost.FluxCrystals * vacs,
					QQ: Molpy.VacCost.QQ * vacs
				});
				if (Molpy.Got('Black Hole')) vacs*=2;
				Molpy.Add('Vacuum', vacs);
				if (!isFinite(Molpy.Level('FluxCrystals'))) Molpy.UnlockBoost('Black Hole');
			}
		}
		Molpy.Boosts['GlassBlocks'].calculateBlocksPermNP();
		Molpy.Boosts['GlassChips'].calculateChipsPermNP();

		if(Molpy.Got('Sand to Glass')) Molpy.Boosts['TF'].digGlass(Math.floor(Molpy.Boosts['TF'].loadedPermNP*Molpy.Papal('GlassSand')));
		Molpy.GlassNotifyFlush();
		Molpy.RunToolFactory();
		if(Molpy.recalculateRates) Molpy.calculateRates();
		if(Molpy.BadgesOwned == 0) Molpy.EarnBadge('Redundant Redundancy');

		Molpy.Life++;
		Molpy.autosaveCountup++;
		if(Molpy.options.autosave) {
			if(Molpy.autosaveCountup >= Molpy.options.autosave * 5) {
				Molpy.Save(1);
			}
		}
		Molpy.PerformJudgement();
		Molpy.Donkey();

		if(Math.floor(Molpy.ONGelapsed / 1000) % 3 == 0) Molpy.flashes = 0;
		
		Molpy.toolsNeedRepaint = 1;
	};

	Molpy.PerformJudgement = function() {

		if(Molpy.Got('Fireproof') && Molpy.Got('NavCode') && !Molpy.Boosts['NavCode'].IsEnabled) {
			Molpy.Boosts['Castles'].power = 0;
			return;
		}

		if(Molpy.judgeLevel > 1 && Math.floor(Molpy.ONGelapsed / 1000) % 25 == 0) {
			var j = Molpy.JDestroyAmount();
			var dAmount = j * Molpy.CastleTools['NewPixBot'].amount * 25;
			if(!Molpy.Boosts['Bacon'].unlocked)
				if(!isFinite(dAmount) && Molpy.Got('Frenchbot') && Molpy.Has('Logicat', 100)) {
					Molpy.Spend('Logicat', 100);
					Molpy.UnlockBoost('Bacon');
				}
			dAmount = Math.ceil(Math.min(Molpy.Boosts['Castles'].power * .9, dAmount));
			if(Molpy.Boosts['Castles'].power) {
				var failed = Molpy.Destroy('Castles', dAmount, 1);
				Molpy.CastleTools['NewPixBot'].totalCastlesDestroyed += dAmount;
				if(!failed) Molpy.Notify('By the NewpixBots');
			}
		}
	};

	Molpy.CheckONG = function() {
		//if there's an ONG
		Molpy.ONGelapsed = new Date().getTime() - Molpy.ONGstart.getTime();
		if(Molpy.npbONG == 'mustard') {
			Molpy.npbONG = (Molpy.ONGelapsed >= Molpy.CastleTools['NewPixBot'].ninjaTime);//whoops
		}
		var npPercent = Molpy.ONGelapsed / (Molpy.NPlength * 1000);
		Molpy.CheckSubPix(npPercent);

		Molpy.clockDegrees = (npPercent * 360) + 180; //rotation from top
		g('sectionTimer').innerHTML = Math.floor((1000 - Molpy.ONGelapsed / Molpy.NPlength)*Molpy.NPlength/Molpy.mNPlength);
		if(Molpy.ONGelapsed >= Molpy.NPlength * 1000)//gotta convert to milliseconds
		{
			Molpy.ONG();
		} else if(Molpy.npbONG == 0 && Molpy.ninjad == 0) {
			if(Molpy.ONGelapsed >= Molpy.CastleTools['NewPixBot'].ninjaTime)//already in milliseconds
			{
				Molpy.npbONG = 1;
				if(Math.abs(Molpy.newpixNumber) > 1) //obviously you can't have any active npb in first newpix
				{
					Molpy.ActivateNewPixBots(); //wasn't ninja'd so we get some free sandcastles (neat!)
				}
			}
		}
		Molpy.CheckBeachClass();
	};
	Molpy.preloadedBeach = 0;
	Molpy.CheckBeachClass = function() {
		var stateClass = 'beachsafe';
		Molpy.ONGelapsed = new Date().getTime() - Molpy.ONGstart.getTime();
		if(!Molpy.ninjad) {
			if(Molpy.npbONG)
				stateClass = 'beachstreakextend';
			else
				stateClass = 'beachninjawarning';
		}
		if(Molpy.Got('Temporal Rift')) stateClass = 'beachriftwarning';
		if(Molpy.ONGelapsed / Molpy.NPlength >= 998 && !Molpy.Boosts['Coma Molpy Style'].IsEnabled) {
			stateClass = 'beachongwarning';
			if(!Molpy.preloadedBeach) {
				Molpy.PreloadBeach();
			}
		}
		Molpy.UpdateBeachClass(stateClass);
	};
	Molpy.currentSubFrame = 0;
	Molpy.CheckSubPix = function(npPercent) {
		var realSubFrame = 0;
		if(Math.floor(Math.abs(Molpy.newpixNumber)) == 2440) {
			realSubFrame = Math.floor(npPercent * 6);
		}
		if(realSubFrame >= 6) realSubFrame = 0;
		if(Molpy.newpixNumber > 0) {
			Molpy.newpixNumber = Math.floor(Molpy.newpixNumber) + realSubFrame / 6;
		} else {
			Molpy.newpixNumber = Math.ceil(Molpy.newpixNumber) - realSubFrame / 6;
		}
		if(realSubFrame > Molpy.currentSubFrame) {
			Molpy.Notify('MeteorONG!');
			Molpy.UpdateBeach();
			Molpy.currentSubFrame = realSubFrame;
		}
	};
	Molpy.ONG = function() {
		Molpy.newpixNumber += (Molpy.newpixNumber > 0 ? 1 : -1);
		_gaq && _gaq.push(['_trackEvent', 'NewPix', 'ONG', '' + Molpy.newpixNumber, true]);

		Molpy.currentSubFrame = 0;
		var np = Math.abs(Molpy.newpixNumber);
		if(np > Math.abs(Molpy.highestNPvisited)) {
			Molpy.highestNPvisited = Molpy.newpixNumber;
			if (Molpy.newpixNumber < 0) Molpy.EarnBadge('Below the Horizon');
		} else //in the past
		{
			if(np > 2) {
				Molpy.UnlockBoost('Time Travel');
			}
		}
		Molpy.Boosts['Fractal Sandcastles'].power = 0;
		Molpy.ONGstart = ONGsnip(new Date());
		Molpy.LogONG();
		Molpy.Notify('ONG!', 1);

		Molpy.HandlePeriods();
		Molpy.UpdateBeach();
		//various machines fire and do stuff

		if(Molpy.Boosts['Glass Furnace'].IsEnabled) {
			Molpy.Boosts['Sand Refinery'].makeChips();
		}
		if(Molpy.Boosts['Glass Blower'].IsEnabled) {
			Molpy.Boosts['Glass Chiller'].makeBlocks();
		}
		Molpy.Boosts['GlassBlocks'].luckyGlass = Molpy.Boosts['Glass Chiller'].power + 1; //reset amount of glass available to Not Lucky

		var activateTimes = 1 + Molpy.Got('Doublepost');
		Molpy.Boosts['Castles'].buildNotifyFlag = 0;
		Molpy.destroyNotifyFlag = 0;
		while(activateTimes--) {
			if(Molpy.Got('Backing Out')) {
				for(i in Molpy.CastleToolsById) {
					var t = Molpy.CastleToolsById[i];
					t.DestroyPhase();
					if(t.name != 'NewPixBot') t.BuildPhase();
				}
			} else {
				var i = Molpy.CastleToolsN;
				while(i-- > 0) {
					Molpy.CastleToolsById[i].DestroyPhase();
				}

				i = Molpy.CastleToolsN;
				while(i-- > 0) {
					var t = Molpy.CastleToolsById[i];
					if(t.name != 'NewPixBot') t.BuildPhase();
				}
			}
		}
		Molpy.destroyNotifyFlag = 1;
		Molpy.Destroy('Castles', 0);

		if(Molpy.Boosts['Castles'].nextCastleSand > 1) Molpy.EarnBadge('Castle Price Rollback');
		Molpy.Boosts['Castles'].prevCastleSand = 0; //sand cost of previous castle
		Molpy.Boosts['Castles'].nextCastleSand = 1; //sand cost of next castle
		Molpy.Boosts['Sand'].toCastles();

		if(Molpy.ninjad == 0) {
			var hadStealth = Molpy.ninjaStealth;
			if(Molpy.NinjaUnstealth() && hadStealth) Molpy.EarnBadge('Ninja Holidip');

			if(Molpy.Got('Ninja Ritual')) {
				if(!Molpy.Got('Ninja Herder')) {
					if(Molpy.Has('Ninja Ritual', 5)) {
						Molpy.EarnBadge('Lost Goats');
						Molpy.UnlockBoost('Ninja Herder');
					}
					Molpy.Boosts['Ninja Ritual'].Level = 0;
				} else {
					Molpy.NinjaRitual();
				}
			}
		}
		Molpy.ninjad = 0;//reset ninja flag
		Molpy.npbONG = 0;//reset newpixbot flag

		Molpy.Boosts['Temporal Rift'].department = 0;
		if(Molpy.newpixNumber % (50 - (Molpy.Got('Time Travel') + Molpy.Got('Flux Capacitor') + Molpy.Got('Flux Turbine') + Molpy.Earned('Minus Worlds')) * 10) == 0) {
			Molpy.Boosts['Temporal Rift'].department = (Math.random() * 6 >= 5) * 1;
		}
		if(Molpy.Got('SBTF')) {}
		if(Molpy.Got('Bag Burning') && !Molpy.Boosts['NavCode'].IsEnabled) {
			if(Molpy.SandTools['Bag'].amount > Molpy.npbDoubleThreshold + 1 && flandom(36) == 0) {
				Molpy.BurnBags(1);
			}
		}
		if(Molpy.Got('BBC')) {
			var bbc = Molpy.Boosts['BBC'];
			if(bbc.power >= 0) {
				if(Molpy.Has('GlassBlocks', 5)) {
					Molpy.Spend('GlassBlocks', 5);
					bbc.power = 1;
					var mhp = Molpy.Boosts['MHP'];
					if(mhp.unlocked && mhp.power > 20 && flandom(9) == 0) {
						mhp.power--;
						Molpy.boostNeedRepaint = 1;
					}
				} else {
					bbc.power = 0;
				}
			}
		}
		Molpy.GlassNotifyFlush();
		if(isFinite(Molpy.Boosts['Castles'].power)) Molpy.Boosts['MHP'].department = 1 * (flandom(3) == 0);
		if(Molpy.autosaveCountup > 1000) {
			Molpy.Notify('You have not saved in over a NewPix!!', 1);
		}
		if(!Molpy.Got('Temporal Rift')) {
			Molpy.Boosts['Time Lord'].reset();
			Molpy.Boosts['Flux Harvest'].Refresh();
			if(Molpy.Got('LogiPuzzle')) {
				var cl = Molpy.Boosts['LogiPuzzle'];
				if(!cl.Has(10)) {
					cl.Level = 10;
				} else {
					if(cl.Has(50)) Molpy.UnlockBoost('WotA');
					cl.Level = Math.min(cl.Level, 10 + Molpy.Level('WotA'));
				}
			}
			if(Molpy.IsEnabled('Shadow Feeder')) Molpy.Boosts['Shadow Feeder'].Level=1;
		}
		if(Molpy.Boosts['LR'].power > 500) {
			var MinPower = 0;
			var LRdecrease = Molpy.Boosts['LR'].power * .95;
			if(Molpy.Got('Lightning in a Bottle')){
				MinPower = Molpy.Boosts['Lightning in a Bottle'].power;
			} else if(Molpy.Got('Kite and Key')){
				MinPower = Molpy.Boosts['Kite and Key'].power;
			}
			if(LRdecrease < MinPower)
				Molpy.Boosts['LR'].power = MinPower;
			else
				Molpy.Boosts['LR'].power *= .95;
		}

		Molpy.Boosts['Glass Trolling'].IsEnabled = 0;
		Molpy.Boosts['Now Where Was I?'].Refresh();
		Molpy.Boosts['The Pope'].reset();
		Molpy.UpdateFaves();
		
		Molpy.Boosts['Temporal Rift'].changeState('closed');
	};

	Molpy.BurnBags = function(n, e) {
		if(e) {
			if(n > 1000) {
				n *= 2;
				e = 1000;
			} else if(n > 100) {
				n *= 5;
				e = 100;
			} else if(n >= 10) {
				n *= 10;
				e = 10;
			}
		} else
			e = 1;
		var o = n;
		n = Math.floor(Math.min(Molpy.SandTools['Bag'].amount, n));
		e = e * n / o;
		Molpy.SandTools['Bag'].amount -= n;
		Molpy.SandToolsOwned -= n;
		Molpy.SandTools['Bag'].Refresh();
		if(n == 1)
			Molpy.Notify('A Bag was burned!', 1);
		else
			Molpy.Notify(n + ' Bags were burned!', 1);
		return e;
	};

	Molpy.HandlePeriods = function() {
		//check length of current newpic
		if(Molpy.newpixNumber < 0) Molpy.EarnBadge('Minus Worlds');
		var np = Math.abs(Molpy.newpixNumber);
		if(np <= 240) {
			Molpy.NPlength = 1800;
			if(Molpy.Got('Doublepost')) {
				Molpy.Boosts['Safety Net'].power++;
				if(Molpy.Boosts['Safety Net'].power >= 10) Molpy.UnlockBoost('Safety Net');
				if(Molpy.Got('Safety Net') && Molpy.Boosts['Safety Net'].power >= 50)
					Molpy.UnlockBoost('Safety Blanket');
				if (Molpy.Boosts['Safety Net'].power >= 222 && Molpy.Got('Vacuum Cleaner')) Molpy.UnlockBoost('Overtime') 
				if (Molpy.Boosts['Safety Net'].power >= 555 && Molpy.Got('Overtime')) Molpy.UnlockBoost('Time Dilation') 
			}
			if(!Molpy.Got('Safety Blanket')) {
				Molpy.LockBoost('Overcompensating');
				Molpy.LockBoost('Doublepost');
				Molpy.LockBoost('Active Ninja');
				Molpy.LockBoost('Furnace Crossfeed');
				Molpy.LockBoost('Furnace Multitasking');
				Molpy.Boosts['Doublepost'].department = 0; //prevent the department from unlocking these
				Molpy.Boosts['Active Ninja'].department = 0;
				Molpy.Boosts['Furnace Crossfeed'].department = 0;
				Molpy.Boosts['Furnace Multitasking'].department = 0;
				var fa = Molpy.Boosts['Factory Automation'];
				if(fa.power > 0 && !Molpy.Got('SG')) {
					fa.power = 0;
					Molpy.Notify('Factory Automation Downgraded', 1);
				}
			}
		} else {
			Molpy.NPlength = 3600;
			Molpy.Boosts['Doublepost'].department = 1;
			Molpy.Boosts['Active Ninja'].department = 1;
			if(Molpy.Got('Glass Furnace')) Molpy.Boosts['Furnace Crossfeed'].department = 1;
			if(Molpy.Got('Furnace Crossfeed')) Molpy.Boosts['Furnace Multitasking'].department = 1;
		}
		Molpy.mNPlength = (Molpy.Got('Time Dilation')?1800:Molpy.NPlength);

		if(np > 241) {
			Molpy.EarnBadge("Have you noticed it's slower?");
		}
		if(np >= 250) {
			Molpy.UnlockBoost('Overcompensating');
		}
		Molpy.TimePeriod = ["Here be Kitties"];
		Molpy.TimeEra = ["Here be Kitties"];
		Molpy.TimeEon = ["Here be Kitties"];
		for( var i in Molpy.Periods) {
			var per = Molpy.Periods[i];
			if(np <= per[0]) {
				Molpy.TimePeriod = per[1];
				break;
			}
		}
		for( var i in Molpy.Eras) {
			var era = Molpy.Eras[i];
			if(np <= era[0]) {
				Molpy.TimeEra = era[1];
				break;
			}
		}
		for( var i in Molpy.Eons) {
			var eon = Molpy.Eons[i];
			if(np <= eon[0]) {
				Molpy.TimeEon = eon[1];
				break;
			}
		}
	};

	/**************************************************************
	 * In which loopists do their thing
	 *************************************************************/
	Molpy.Stop = 0;
	Molpy.Loopist = function() {
		var t = Molpy.time;
		Molpy.time = new Date().getTime();
		Molpy.ketchupTime = 0;
		Molpy.lateness += (Molpy.time - t);
		Molpy.lateness = Math.min(Molpy.lateness, 7200);//don't ketchup up too much
		while(Molpy.lateness > Molpy.mNPlength) {
			try {
				if(!Molpy.Stop) Molpy.Think();
			} catch(e) {
				alert('Something went wrong in Molpy.Think() ' + (Molpy.ketchupTime ? 'while ketching up: ' : ': ') + e + '\n\n' + e.stack);
				throw e;
				return;
			}
			Molpy.ketchupTime = 1;
			Molpy.lateness -= Molpy.mNPlength;
		}
		Molpy.ketchupTime = 0;
		try {
			Molpy.Draw();
		} catch(e) {
			alert('Something went wrong in Molpy.Draw(): ' + e + '\n\n' + e.stack);
			throw e;
			return;
		}
		setTimeout(Molpy.Loopist, 1000 / Molpy.fps);
	};
};
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-45954809-1']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script');
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(ga, s);
})();

/**************************************************************
 * Game Start
 * 
 * In which we make it go!
 *************************************************************/
Molpy.Up();
window.onload = function() {
	if(!Molpy.molpish) {
		Molpy.Wake();
		_gaq && _gaq.push(['_trackEvent', 'Setup', 'Complete', '' + Molpy.version, true]);
	}
};
