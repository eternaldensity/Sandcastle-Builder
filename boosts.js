Molpy.DefineBoosts=function()
{	
	Molpy.groupNames={
		boosts:['boost','Boosts'],
		badges:['badge','Badges'],
		hpt:['hill people tech','Hill People Tech','department'],
		ninj:['ninjutsu','Ninjutsu','ninjabuilder'],
		chron:['chronotech','Chronotech','lateclosing'],
		cyb:['cybernetics','Cybernetics','robotefficiency'],
		bean:['beanie tech','Beanie Tech','chateau'],
		ceil:['ceiling','Ceilings','glassceiling12'],
		drac:['draconic','Draconic','achronaldragon'],
		stuff:['stuff','Stuff'],
		land:['land','Land'],
		prize:['prize','Prizes'],
		discov:['discoveries','Discoveries','discov','Discovery','A memorable discovery'],
		monums:['sand monuments','Sand Monuments',0,'Sand Monument', 'A sand structure commemorating'],
		monumg:['glass monuments','Glass Monuments',0,'Glass Monument','A glass sculpture commemorating'],
		diamm:['masterpieces','Masterpieces',0,'Masterpiece','This is a diamond masterpice.<br>All craftottership is of the highest quality.<br>On the masterpiece is an image of','in diamond. <br>It molpifies with spikes of treeishness.'],
	};
	Molpy.nextBageGroup={discov:'monums',monums:'monumg'};//,monumg:'diamm'};

	//only add to the end!
	new Molpy.Boost({name:'Bigger Buckets',desc:'Raises sand rate of buckets and clicks',sand:500,castles:0,stats:'Adds 0.1 S/mNP to each Bucket, before multipliers',icon:'biggerbuckets'});
	new Molpy.Boost({name:'Huge Buckets',desc:'Doubles sand rate of buckets and clicks',sand:800,castles:2,icon:'hugebuckets'});
	new Molpy.Boost({name:'Helping Hand',desc:'Raises sand rate of Cuegan',sand:500,castles:2,stats:'Adds 0.2 S/mNP to each Cuegan, before multipliers',icon:'helpinghand'});
	new Molpy.Boost({name:'Cooperation',desc:'Boosts sand rate of Cuegan cumulatively by 5% per pair of buckets',sand:2000,castles:4,icon:'cooperation',
		stats:function()
		{			
			if(Molpy.Got('Cooperation'))
			{
				var mult=Math.pow(1.05,Math.floor(Molpy.SandTools['Bucket'].amount/2));
				return 'Multiplies Cuegans\' sand production by ' + Molpify(mult*100,2)+'%';
			}
			return 'Boosts sand rate of Cuegan cumulatively by 5% per pair of buckets';
		}
	});
	new Molpy.Boost({name:'Spring Fling',desc:'Trebuchets build an extra Castle',sand:1000,castles:6,icon:'springfling'});
	new Molpy.Boost({name:'Trebuchet Pong',desc:'Boosts sand rate of buckets cumulatively by 50% per pair of trebuchets',
		stats:function(){return 'Sand rate of buckets is multiplied by '+ Molpify(Math.pow(1.5,Math.floor(Molpy.CastleTools['Trebuchet'].amount/2)));}
		,sand:3000,castles:6,icon:'trebpong'
	});
	new Molpy.Boost({name:'Molpies',desc:'Increases sand dig rate based on Badges',sand:5000,castles:5,
		stats:function()
		{
			if(Molpy.Got('Molpies'))
			{
				var mult=0.01*Molpy.BadgesOwned;
				return 'Increases sand dig rate by '+ Molpify(mult*100,2)+'%';
			}
			return 'Increases sand dig rate by 1% per Badge earned';
		},icon:'molpies'
	});
	new Molpy.Boost({name:'Busy Bot',desc:'NewPixBots activate 10% sooner',sand:900,castles:4,icon:'busybot',group:'cyb'});
	new Molpy.Boost({name:'Stealthy Bot',desc:'NewPixBots activate 10% sooner,',sand:1200,castles:5,icon:'stealthybot',group:'ninj'});
	new Molpy.Boost({name:'Flag Bearer',desc:'Flags are more powerful',sand:5500,castles:8,
		stats:'Each flag produces 2 extra sand/mNP, before multipliers',icon:'flagbearer'});
	new Molpy.Boost({name:'War Banner',desc:'Trebuchets only destroy 1 castle',
		sand:3000,castles:10,icon:'warbanner'});
	new Molpy.Boost({name:'Magic Mountain',desc:'Flags are much more powerful',
		sand:8000,castles:15,stats:'Multiplies Flag sand rate by 2.5',icon:'magicmountain'});
	new Molpy.Boost({name:'Extension Ladder',desc:'Ladders reach a little higher',sand:'12K',castles:22,icon:'extensionladder',
		stats:'Each ladder produces 18 more sand per mNP, before multipliers'});
	new Molpy.Boost({name:'Level Up!',desc:'Ladders are much more powerful',sand:'29K',castles:34,
		stats:'Ladders produce twice as much Sand',icon:'levelup'});
	new Molpy.Boost({name:'Varied Ammo',desc:'Trebuchets build an extra castle for each Castle Tool you have 2+ of',sand:3900,castles:48,icon:'variedammo',
		stats:function()
		{
			if(Molpy.Got('Varied Ammo'))
			{
				var val = 0;
				for(var i in Molpy.CastleTools) if(Molpy.CastleTools[i].amount>1)val++;
				return 'Each trebuchet produces '+Molpify(val)+ ' more castles per ONG, before multipliers';
			}
			return 'For each kind of Castle Tool of which you have 2 or more, each trebuchet produces an additional castle per ONG, before multipliers';
		}
	});
	new Molpy.Boost({name:'Megball',desc:'Cuegan produce double sand',sand:10700,castles:56,icon:'megball'});
	new Molpy.Boost({name:'Robot Efficiency',desc:'Newpixbots build an extra castle (before any doubling)',
		sand:'34K',castles:153,icon:'robotefficiency',group:'cyb'});
	new Molpy.Boost({name:'Ninja Builder',desc:'When incrementing ninja stealth streak, builds that many castles',
		sand:4000,castles:35,
		stats:function()
		{
			if(Molpy.Got('Ninja Builder')) 
				return 'Will build '+ Molpify(Molpy.CalcStealthBuild(1),3)+ ' Castles unless you destealth ninjas';
			return 'Ninja Stealth increments the first time you click within a NewPix after NewPixBots activate. It will reset if you click before NewPixBots activate, or don\'t click before the next ONG.'	
			
		},icon:'ninjabuilder',group:'ninj'
	});
	new Molpy.Boost({name:'Erosion',desc:'Waves destroy less by 20% of total castles wasted by waves, and '
		+'2 less per River bought',sand:'40K',castles:77,icon:'erosion'});
	new Molpy.Boost({name:'Autosave Option',desc:'Autosave option is available',sand:100,castles:4,icon:'autosave'});
	new Molpy.Boost({name:'Helpful Hands',desc:'Each Cuegan+Bucket pair gives clicking +0.5 sand',
		sand:250,castles:5,icon:'helpfulhands'});
	new Molpy.Boost({name:'True Colours',desc:'Each Cuegan+Flag pair gives clicking +5 sand',
		sand:750,castles:15,icon:'truecolours'});
	new Molpy.Boost({name:'Precise Placement',desc:'For every two ladders, scaffolds destroy one less castle',
		sand:8750,castles:115,icon:'preciseplacement'});
	new Molpy.Boost({name:'Ninja Hope',desc:'Avoid one Ninja Stealth reset, at the cost of 10 castles',
		sand:7500,castles:40,icon:'ninjahope',startPower:1,group:'ninj'}); 
	new Molpy.Boost({name:'Ninja Penance',desc:'Avoid a two Ninja Stealth resets, at the cost of 30 castles each',
		sand:'25K',castles:88,icon:'ninjapenance',startPower:2,group:'ninj'}); 
	new Molpy.Boost({name:'Blitzing',desc:function(me)
		{		
			return Molpify(me.power,1)+'% Sand for '+Molpify(me.countdown,3)+'mNP';
		}
		,icon:'blitzing',className:'alert',
		startCountdown:23 //only used when loading to ensure it doesn't get stuck. any true value would do here
	});
	new Molpy.Boost({name:'Kitnip',desc:Molpy.redactedWords+' come more often and stay longer',
		sand:33221,castles:63,
	icon:'kitnip'});
	new Molpy.Boost({name:'Department of Redundancy Department',alias:'DoRD',desc:Molpy.redactedWords
		+' sometimes unlock special boosts',sand:23456,castles:78,icon:'department',group:'hpt'});
	new Molpy.Boost({name:'Raise the Flag',desc:'Each Flag+Ladder pair gives clicking an extra +50 sand',
		sand:'85K',castles:95,icon:'raisetheflag'});
	new Molpy.Boost({name:'Hand it Up',desc:'Each Ladder+Bag pair gives clicking an extra +500 sand',
		sand:'570K',castles:170,department:1,icon:'handitup'});
	new Molpy.Boost({name:'Riverish',desc:'Rivers destroy less castles the more you click',
		sand:'82K',castles:290,icon:'riverish',department:1,
		buyFunction:function()
		{
			this.power=Molpy.beachClicks;
		}
		});
	new Molpy.Boost({name:'Monty Haul Problem',alias:'MHP',desc: 
		function(me)
		{
			var str='';
			for(var i in Molpy.MontyDoors)
			{
				var door = Molpy.MontyDoors[i];
				if(door!=me.goat)
				{
					str+='<input type="Button" value="Choose Door '+door+'" onclick="Molpy.Monty(\''+door+'\')"><br>'
				}else
				{
					if(Molpy.Got('Beret Guy'))
					{
						str+='<input type="Button" value="Take goat" onclick="Molpy.Monty(\''+door+'\')"><br>'
						
					}else
					{
						str+='Door '+door+' is a goat<br>';
					}
				}
			}
			str+='Choose a door! You might gain half your current Castles, or you might lose them all and get a Goat';
			if(Molpy.IsEnabled('HoM')) str+='<br>With Hall of Mirrors, you also stand to gain a fifth of your Glass Chip Storage balance, or lose a third of it.';
			return str;
		},
		sand:function()
		{
			var p = Molpy.Boosts['MHP'].power;
			return 100*Math.pow(2,Math.max(1,p-9));
		},
		glass:function()
		{
			if(!Molpy.IsEnabled('HoM'))return 0;
			var p = Molpy.Boosts['MHP'].power;
			return 100*Math.pow(2,Math.max(1,p-15));			
		},
		icon:'monty',className:'action',
		lockFunction:function(){
			this.power++;
			this.goat=0;
			this.prize=0;
		},
		unlockFunction:function(){
			this.prize=Molpy.GetDoor();
		}
	});
	Molpy.MontyDoors=['A','B','C'];
	Molpy.Monty=function(door)
	{
		var me=Molpy.Boosts['MHP'];
		me.door=door;
		if(!me.bought)
		{
			Molpy.Notify('Buy it first, silly molpy!');
			return;
		}
		if(me.goat)
		{
			if(me.door==me.goat&&!Molpy.Got('Beret Guy'))
			{
				Molpy.Notify('That door has already been opened.');
				return;
			}
			Molpy.RewardMonty();
		}else
		{
			Function('me',Molpy.BeanishToCuegish(Molpy.MontyMethod))(me);
			if(me.goat)
			{
				Molpy.Notify('Door '+me.goat+' is opened, revealing a goat!<br>You may switch from Door '+me.door+' if you like.',1);
				me.Refresh();
				return;
			}else
			{
				Molpy.RewardMonty();				
			}
		}
		
		Molpy.LockBoost('MHP');
	}
	Molpy.GetDoor=function(){return GLRschoice(Molpy.MontyDoors);}
	Molpy.RewardMonty=function()
	{
		var me=Molpy.Boosts['MHP'];
		if(me.door==me.prize)
		{
			var amount=Molpy.castles;
			Molpy.Notify('Hooray, you found the prize behind door '+me.door+'!');
			Molpy.Build(Math.floor(Molpy.castles/2),1); 
			if(Molpy.IsEnabled('HoM'))
				Molpy.Add('GlassChips',Math.floor(Molpy.Boosts['GlassChips'].power/5),1); 
			if(Molpy.Got('Gruff'))
			{
				Molpy.GetYourGoat(2);
			}
		}else{
			Molpy.Destroy('Castles',Molpy.castles); 
			Molpy.Boosts['MHP'].power=Math.ceil(Math.floor(Molpy.Boosts['MHP'].power/1.8));
			if(Molpy.IsEnabled('HoM'))
				Molpy.Spend('GlassChips',Math.floor(Molpy.Boosts['GlassChips'].power/3));
			Molpy.GetYourGoat(1);
		}
	}
	
	Molpy.GetYourGoat=function(n)
	{
		Molpy.Add('Goats',n);
		_gaq&&_gaq.push(['_trackEvent','Boost','Upgrade','Goats']);	
		if(Molpy.Has('Goats',2))Molpy.EarnBadge('Second Edition');
		if(Molpy.Has('Goats',20))Molpy.UnlockBoost('HoM');
		if(Molpy.Has('Goats',200))Molpy.UnlockBoost('Beret Guy');
		Molpy.Notify('You got a goat!');
	}
	
	new Molpy.Boost({name:'Grapevine',desc:'Increases sand dig rate by 2% per badge earned',sand:'25K',castles:25,icon:'grapevine',department:1,
		stats:function()
		{
			if(Molpy.Got('Grapevine'))
			{
				var mult=0.02*Molpy.BadgesOwned;
				return 'Increases sand dig rate by '+ Molpify(mult*100,2)+'%';
			}
			return 'Increases sand dig rate by 2% per Badge earned';
		}
	});
	new Molpy.Boost({name:'Affordable Swedish Home Furniture',alias:'ASHF',desc: function(me){return Molpify(me.power*100,1)+'% off all items for '
		+Molpify(me.countdown,3)+'mNP'}
		,buyFunction:function(){
			Molpy.shopRepaint=1;
			Molpy.CalcPriceFactor();
			Molpy.Donkey();
		}
		,countdownFunction:function(){
			if(this.countdown==2)
			{
				Molpy.Notify('Only 2mNP of discounts remain!');
			}
		},lockFunction:function(){
			var pp = Molpy.Boosts['Price Protection'];
			if(pp.IsEnabled)pp.power=pp.bought+1;
			else Molpy.UnlockBoost(pp.alias);
		}
		,startPower:function()
		{
			if(Molpy.Got('GoldCard')) return 0.6;
			if(Molpy.Got('SilverCard')) return 0.5;
			return 0.4;
		}
		,startCountdown:function()
		{
			if(Molpy.Got('Late Closing Hours'))
			{
				return 10;
			}
			return 5;
		}
		,group:'hpt',department:1,className:'alert'});
	
	new Molpy.Boost({name:'Overcompensating',desc: function(me){
		return 'During LongPix, Sand Tools dig '+Molpify(me.startPower*100,1)+'% extra sand'}
		,sand:987645,castles:321,icon:'overcompensating',startPower:1.5});
	new Molpy.Boost({name:'Doublepost',desc:'During LongPix, Castle Tools activate a second time',
		sand:'650K',castles:4000,icon:'doublepost'});
	new Molpy.Boost({name:'Coma Molpy Style',desc: 
		function(me)
		{ 
			return (me.IsEnabled? '':'When active, ') + 'the ONG clock is frozen.<br>(Castle Tools do not activate and ninjas stay stealthed.)<br><input type="Button" onclick="Molpy.ComaMolpyStyleToggle()" value="'+(me.IsEnabled? 'Dea':'A')+'ctivate"></input>';
		}
		,IsEnabled:Molpy.BoostFuncs.BoolPowEnabled,sand:8500,castles:200,icon:'comamolpystyle',className:'toggle'});
	
	Molpy.cmsline=0;
	Molpy.ComaMolpyStyleToggle=function()
	{
		var me=Molpy.Boosts['Coma Molpy Style'];
		Molpy.Notify(Molpy.cms[Molpy.cmsline]);
		Molpy.cmsline++;
		if(Molpy.cmsline>=Molpy.cms.length)
		{
			Molpy.cmsline=0;
			if(!me.bought)
			{
				me.buy();
				if(me.bought)
					Molpy.RewardRedacted();
			}
		}
		if(!me.bought)
		{
			_gaq&&_gaq.push(['_trackEvent','Boost','Toggle Fail',me.name]);	
			return;
		}
		
		var acPower = Molpy.Boosts['Coma Molpy Style'].power;
		if(acPower)
		{
			acPower=0; //off
			Molpy.ONGstart = ONGsnip(new Date()); //don't immediately ONG!
		}else
		{
			acPower=1; //on		
		}
		g('clockface').className= acPower?'hidden':'unhidden';	
		Molpy.Boosts['Coma Molpy Style'].power=acPower;
		Molpy.Boosts['Coma Molpy Style'].Refresh();
		Molpy.recalculateDig=1;
	}
	new Molpy.Boost({name:'Time Travel',desc: 
		function(me)
		{
			var price=Molpy.TimeTravelPrice();
			return 'Pay ' + Molpify(price,2) + ' Castles to move <input type="Button" onclick="Molpy.TimeTravel('+(-me.power)+');" value="backwards"></input> or <input type="Button" onclick="Molpy.TimeTravel('+me.power+');" value="forwards"></input> '+
			Molpify(me.power)+' NP in Time';
		}
		,sand:1000,castles:30,className:'action',group:'chron',icon:'timetravel',
		buyFunction:function()
		{
			this.power=1;
		}
	});
	
	Molpy.TimeTravelPrice=function()
	{
		var price=Molpy.newpixNumber;
		price+=Molpy.castles*Molpy.newpixNumber/3094;
		price+=Molpy.timeTravels;
		if(Molpy.Got('Flux Capacitor'))price=Math.ceil(price*.2);
		price = Math.ceil(price/Molpy.priceFactor); //BECAUSE TIME TRAVEL AMIRITE?
		if(price<0)price*=-1;
		if(price>Molpy.castles)
			Molpy.Boosts['Flux Capacitor'].department=1;
		if(isNaN(price))price=Infinity;
		return price;
	}
	
	Molpy.TimeTravel=function(NP)
	{		
		if(Molpy.TTT(Molpy.newpixNumber+NP,0))
		{
			if(NP>0)
				Molpy.EarnBadge('Fast Forward');
			if(NP<0)
				Molpy.EarnBadge('And Back');
			var t = Molpy.timeTravels;
			if(t>=10)
				Molpy.EarnBadge('Primer');			
			if(t>=20)
				Molpy.UnlockBoost('Flux Capacitor');
			if(t>=30&&Molpy.Got('Flux Capacitor'))
				Molpy.UnlockBoost('Flux Turbine');
			if(t>=40)
				Molpy.EarnBadge('Wimey');
			if(t>=160)
				Molpy.EarnBadge('Hot Tub');
			if(t>=640)
				Molpy.EarnBadge("Dude, Where's my DeLorean?");
			
		}
	}
	//targeted time travel!
	Molpy.TTT=function(np,chips)
	{
		np = Math.floor(np);
		chips=chips?Molpy.CalcJumpEnergy(np):0;
		var price=Molpy.TimeTravelPrice();
		if(chips)price=0;
		if(np <1&&!Molpy.Earned('Minus Worlds'))
		{
			Molpy.Notify('Heretic!');
			Molpy.Notify('There is nothing before time.');
			return;
		}
		if(np==0)
		{
			Molpy.Notify('Divide by zero error!');
			return;
		}
		if(Math.abs(np) >Molpy.highestNPvisited)
		{
			Molpy.Notify('Wait For It');
			return;
		}
		if(!Molpy.Boosts['Time Travel'].bought&&!chips)
		{
			Molpy.Notify('In the future, you\'ll pay for this!');
			return;
		}
		if(Molpy.castles >=price)
		{
			if(!Molpy.Has('GlassChips',chips))
			{
				Molpy.Notify('Great Scott, there\'s a hole in the glass tank!');
				return;
			}
			Molpy.Spend('GlassChips',chips);
			Molpy.Spend('Castles',price);
			if(Molpy.Earned('discov'+Molpy.newpixNumber))Molpy.Badges['discov'+Molpy.newpixNumber].Refresh();
			Molpy.newpixNumber=np;
			if(Molpy.Earned('discov'+Molpy.newpixNumber))Molpy.Badges['discov'+Molpy.newpixNumber].Refresh();
			_gaq&&_gaq.push(['_trackEvent','NewPix',(chips?'Memory Warp':'Time Travel'),''+Molpy.newpixNumber]);			
			Molpy.ONGstart= ONGsnip(new Date()); 
			Molpy.HandlePeriods();
			Molpy.UpdateBeach();
			Molpy.Notify('Time Travel successful! Welcome to NewPix '+Molpify(Molpy.newpixNumber));
			Molpy.timeTravels++;
			if(Molpy.timeTravels>=10) Molpy.HandleInvaders(chips);
			Molpy.Boosts['Time Travel'].Refresh();
			return 1;
		}else
		{
			Molpy.Notify('<i>Castles</i>? Where we\'re going we do need... <i>castles</i>.');
		}
	}
	
	Molpy.HandleInvaders=function(mem)
	{
		var incursionFactor=Molpy.Got('AD')?1.5
		:Molpy.Got('Flux Capacitor')?4
		:(Molpy.Got('Flux Turbine')?8
		:20);
		if(mem)incursionFactor*=10;
		if(!flandom(incursionFactor))
		{
			var npb=Molpy.CastleTools['NewPixBot'];
			if(!Molpy.Boosts['NavCode'].power && npb.temp<30)
			{
				Molpy.Notify('You do not arrive alone');
				npb.amount++;
				npb.temp++;
				npb.Refresh();
			}else{
				Molpy.Notify('Temporal Incursion Prevented!');
			}
		}
	}
	
	Molpy.CalcJumpEnergy=function(destNP)
	{
		var gap = destNP-Molpy.newpixNumber;
		var cost= gap*gap;
		cost+=Molpy.timeTravels;
		cost*=100;
		if(destNP*Molpy.newpixNumber < 0) 
		{ // Jumps between sides costs a lot more unless returning from the Minus side without having AA 
		  // This is so that if one goes early you can return, but going again has to be expensive
			if (destNP < 0 || Molpy.Boosts['AA'].bought) cost*=1000000;
		}
		if(destNP < 0 && !Molpy.Earned('discov'+destNP)) cost*=1.1; // premium jumping using MM to unknwon discovery
		if(Molpy.Got('Flux Capacitor'))cost*=.2;
		if(Molpy.Got('Mind Glow')&&Molpy.Earned('monums'+destNP))cost*=.5;
		if(Molpy.Got('Memory Singer')&&Molpy.Earned('monumg'+destNP))cost*=.5;
		return Math.ceil(cost);
	}
	
	new Molpy.Boost({name:'Active Ninja',desc:
		'During LongPix, Ninja Stealth is incremented by 3 per NP. Is there an Echo in here?',
			sand:'1.5M',castles:240,icon:'activeninja',group:'ninj'});
	new Molpy.Boost({name:'Kitties Galore',desc:'Even more '+Molpy.redactedWords,
		sand:'2.5M',castles:4400,icon:'kittiesgalore'});	
	
	new Molpy.Boost({name:'HAL-0-Kitty',desc:'NewPixBots build an extra Castle per 9 '+Molpy.redactedWords,
		sand:9000,castles:2001,icon:'halokitty',group:'cyb'});
	new Molpy.Boost({name:'Factory Automation',
		desc:function(me)
		{
			var costs = '';			
			var i = me.power+1;
			var n = 0;
			while(i--)
			{
				var sand = 2000000*Math.pow(100000,i);
				costs+=Molpify(sand);
				n++;
				if(n>5)	
				{
					costs+=', then... ';
					break;
				}
				if(i)costs+=', then ';
			}
			if(!me.power)return 'When NewPixBots activate, so does the Department of Redundancy Department at a cost of '+costs+' Sand, if you have at least 20 NewPixBots.<br>Can be upgraded if you have Doubleposting and ask the right person...';
			return 'Level: '+Molpify(me.power+1,3)+'<br>When NewPixBots activate, so does the Department of Redundancy Department at a cost of '+costs+' Sand. Will activate less times if you don\'t have 20 bots per automation level.';
		},
		sand:'4.5M',castles:15700,icon:'factoryautomation',group:'hpt'});
	new Molpy.Boost({name:'Blast Furnace',desc:'Gives the Department of Redundancy Department the ability to make Castles from Sand',
		sand:'8.8M',castles:28600,
		stats:function()
		{
			var blastFactor=1000;
			if(Molpy.Got('Fractal Sandcastles'))
			{
				blastFactor=Math.max(5,1000*Math.pow(0.94,Molpy.Boosts['Fractal Sandcastles'].power));
			}
			return 'Uses '+Molpify(2000000)+' Sand to warm up, then makes Castles at a cost of ' + Molpify(blastFactor,1) + ' each. Can make up to a third of your total castles built (before accounting for any Flux Turbine bonus).';
		}
		,icon:'blastfurnace',group:'hpt'});
	
	new Molpy.Boost({name:'Sandbag',desc:'Bags and Rivers give each other a cumulative 5% boost to Sand digging, Castle building, and Castle destruction (per River or Bag, respectively)',
		sand:'1.4M',castles:'21K',icon:'sandbag'});
	new Molpy.Boost({name:'Embaggening',desc:'Each Cuegan after the 14th gives a 2% boost to the sand dig rate of Bags',
		sand:'3.5M',castles:'23K',icon:'embaggening'});
	new Molpy.Boost({name:'Carrybot',desc:'NewPixBots produce double castles, Buckets produce quadruple sand',
		sand:'10K',castles:'1K',icon:'carrybot',group:'cyb'});
	new Molpy.Boost({name:'Stickbot',desc:'NewPixBots produce double castles, Cuegan produce quadruple sand',
		sand:'50K',castles:'2.5K',icon:'stickbot',group:'cyb'});
	new Molpy.Boost({name:'Standardbot',desc:'NewPixBots produce double castles, Flags produce quadruple sand',
		sand:'250K',castles:6250,icon:'standardbot',group:'cyb'});
	new Molpy.Boost({name:'Climbbot',desc:'NewPixBots produce double castles, Ladders produce quadruple sand',
		sand:'1250K',castles:15625,icon:'climbbot',group:'cyb'});
	new Molpy.Boost({name:'Luggagebot',desc:'NewPixBots produce double castles, Bags produce quadruple sand',
		sand:'6250K',castles:39063,icon:'luggagebot',group:'cyb'});
	new Molpy.Boost({name:'Recursivebot',desc:'NewPixBots produce double castles',
		sand:'50K',castles:'10K',icon:'recursivebot',group:'cyb'});
	new Molpy.Boost({name:'Flingbot',desc:'NewPixBots produce double castles, Trebuchets produce quadruple',
		sand:'250K',castles:'25K',icon:'flingbot',group:'cyb'});
	new Molpy.Boost({name:'Propbot',desc:'NewPixBots produce double castles, Scaffolds produce quadruple',
		sand:'1.25M',castles:62500,icon:'propbot',group:'cyb'});
	new Molpy.Boost({name:'Surfbot',desc:'NewPixBots produce double castles, Waves produce quadruple',
		sand:'62.5M',castles:156250,icon:'surfbot',group:'cyb'});
	new Molpy.Boost({name:'Smallbot',desc:'NewPixBots produce double castles, Rivers produce quadruple',
		sand:'352.5M',castles:390625,icon:'smallbot',group:'cyb'});
	
	new Molpy.Boost({name:'Swell',desc:'Waves produce 29 more Castles',sand:'20K',castles:200,icon:'swell'});
	new Molpy.Boost({name:'Flux Capacitor',desc:'It makes Time Travel possibler!',sand:88,castles:88,group:'chron',icon:'fluxcap'});
	new Molpy.Boost({name:'Bag Burning',desc:'Bags help counteract NewPixBots. This will involve burning some Bags.<br>Bag Burning is the first of several Boosts available during Judgement Dip.<br>Remember you can always sell Bags to reduce the effect of Bag Burning.',sand:'50M',castles:86,
		stats:function()
		{
			var str = 'Half of Bags beyond the 14th owned give a cumulative 40% boost to Judgement Dip threshold.';
			if(Molpy.SandTools['Bag'].amount>Molpy.npbDoubleThreshold)
			{
				var amount = Math.pow(1.4,Math.max(0,(Molpy.SandTools['Bag'].amount-Molpy.npbDoubleThreshold)/2))-1;
				amount=Molpify(amount*100,0);
				str+='<br>Currently '+amount+'%';
			}
			var jmax=Math.pow(2,Molpy.Boosts['Bag Burning'].power)+6;
			str+='<br>If the Judgement Dip level (apart from the Bag reduction) is greater than '+Molpify(jmax,1)+', Bags will be burned to increase power.<br>It is also more powerful each time it is locked!';
			if(!isFinite(jmax)&&Molpy.Got('Bottle Battle'))Molpy.UnlockBoost('Fireproof');
			return str;
		}
		,lockFunction:function()
		{
			this.power+=2;
		}
		,icon:'bagburning'});
	new Molpy.Boost({name:'Chromatic Heresy',desc:
		function(me)
		{
			return 'Saturation is '+(me.IsEnabled?'':'not ')+'allowed.<br><input type="Button" value="Click" onclick="Molpy.ChromaticHeresyToggle()"></input> to toggle.';
		},stats:'"huehuehuehuehuehuehue"',sand:200,castles:10,icon:'chromatic',className:'toggle'});
	Molpy.ChromaticHeresyToggle=function()
	{
	
		var ch = Molpy.Boosts['Chromatic Heresy'];
		if(!ch.bought)
		{
			Molpy.Notify('Somewhere, over the rainbow...');
			return;
		}
		_gaq&&_gaq.push(['_trackEvent','Boost','Toggle',ch.name]);	
		if(ch.power>0)ch.power=-ch.power;
		else if(ch.power<0)ch.power=-ch.power+1;
		else(ch.power=1);
		
		if(ch.power>10)Molpy.UnlockBoost('Beachball');
		ch.Refresh();
		Molpy.UpdateColourScheme();
	}
	new Molpy.Boost({name:'Flux Turbine',desc:'Castles lost via Molpy Down or Temporal Rift boost the rate of building new Castles',
		sand:1985,castles:121,
		stats:function()
		{
			if(!Molpy.Got('Flux Turbine')) return 'All castle gains are boosted by 2% per natural logarithm of castles wiped by Molpy Down, except refunds which are not affected.';
			return 'Multiplies all Castle gains by ' + Molpify(Molpy.globalCastleMult*100,2)+'% (But refunds when selling remain unchanged.)';
		},group:'chron'});
	new Molpy.Boost({name:'Ninja Assistants',desc:'Ninja Builder\'s Castle output is multiplied by the number of NewPixBots'
		+' you have.',sand:'250M',castles:777,icon:'ninjaassistants',group:'ninj'});
	new Molpy.Boost({name:'Minigun',desc:'The castle output of Trebuchets is multiplied by the number of NewPixBots you have.',
		sand:'480M',castles:888,icon:'minigun',group:'cyb'});
	new Molpy.Boost({name:'Stacked',desc:'The castle output of Scaffolds is multiplied by the number of NewPixBots you have.',
		sand:'970M',castles:999,icon:'stacked',group:'cyb'});
	new Molpy.Boost({name:'Big Splash',desc:'The castle output of Waves is multiplied by the number of NewPixBots you have.',
		sand:'2650M',castles:1111,icon:'bigsplash',group:'cyb'});
	new Molpy.Boost({name:'Irregular Rivers',desc:'The castle output of Rivers is multiplied by the number of NewPixBots'
		+' you have.',sand:'8290M',castles:2222,icon:'irregularrivers',group:'cyb'});
	
	Molpy.scrumptiousDonuts=-1;
	new Molpy.Boost({name:'NewPixBot Navigation Code',alias:'NavCode',desc: 
		function(me)
		{
			return 'thisAlgorithm. BecomingSkynetCost = 999999999<br><input type="Button" onclick="Molpy.NavigationCodeToggle()" value="' +
				(me.IsEnabled?'Uni':'I')+'nstall"></input>';
		},sand:999999999,castles:2101,
		stats:'When installed, this averts Judgement Dip at the cost of 99.9% of NewPixBot Castle Production.',
		icon:'navcode',className:'toggle',group:'cyb',IsEnabled:Molpy.BoostFuncs.BoolPowEnabled,
		classChange:function(){return Molpy.CheckJudgeClass(this,1,'toggle',this.power);}
	});	
		
	Molpy.NavigationCodeToggle=function()
	{		
		if(Molpy.Got('Jamming'))
		{
			Molpy.Notify('Experiencing Jamming, cannot access Navigation Code');
			if(Molpy.scrumptiousDonuts<0)
			{
				Molpy.scrumptiousDonuts=120;
			}
			return;
		}
		var nc = Molpy.Boosts['NavCode'];
		if(!nc.bought)
		{
			if(Molpy.scrumptiousDonuts<0)
			{
				Molpy.scrumptiousDonuts=120;
			}
			return;
		}
		_gaq&&_gaq.push(['_trackEvent','Boost','Toggle',nc.name]);	
		nc.power=!nc.power*1;
		var npb=Molpy.CastleTools['NewPixBot'];
		if(npb.temp)
		{
			npb.temp = Math.min(npb.amount,npb.temp);
			npb.amount-=npb.temp;
			Molpy.CastleToolsOwned-=npb.temp;
			npb.Refresh();
			Molpy.Notify(Molpify(npb.temp,1) + ' Temporal Duplicates Destroyed!');
			npb.temp=0;
		}
		Molpy.scrumptiousDonuts=-1;
		nc.Refresh();
		Molpy.recalculateDig=1;
		Molpy.GiveTempBoost('Jamming',1);
	}
	new Molpy.Boost({name:'Jamming',desc:
		function(me)
		{		
			return 'You cannot access NewPixBot Navigation Code for '+Molpify(me.countdown,3)+'mNP';
		},className:'alert',group:'cyb',startCountdown:function()
		{
			if(Molpy.Got('Fireproof'))return 20;
			return 2000;
		}
		});	
	
	new Molpy.Boost({name:'Blixtnedslag Kattungar, JA!',alias:'BKJ',desc:'Antalet redundanta klickade kattungar läggs till blixtnedslag multiplikator.'
		,sand:'9.8M',castles:888555222,stats:function(me)
		{
		return 'Additional '+Molpy.redactedWord+
			' clicks add 20% to the Blitzing multiplier. (Only when you get a Blitzing or Not Lucky reward.) Also causes Blizting to boost Blast Furnace if they overlap.<br>Power level is '
			+Molpify(me.power,3);
		}
		 ,icon:'bkj',group:'hpt'
	});
		
	new Molpy.Boost({name:'Summon Knights Temporal',desc:'<input type="Button" onclick="Molpy.Novikov()" value="Reduce"></input> the temporal incursion of Judgement Dip',
		sand:function()
		{
			var me=Molpy.Boosts['Summon Knights Temporal'];
			if(!me.power)me.power=0;
			return 2101*Math.pow(1.5,me.power);
		},castles:function()
		{
			var me=Molpy.Boosts['Summon Knights Temporal'];
			if(!me.power)me.power=0;
			return 486*Math.pow(1.5,me.power);
		},stats: 'The Bots forget half their past/future slavery. Costs 50% more each time. BTW you need to switch out of Stats view to activate it.',className:'action',group:'chron',classChange:function(){return Molpy.CheckJudgeClass(this,0,'action');}}
	);
	Molpy.Novikov=function()
	{
		var me=Molpy.Boosts['Summon Knights Temporal'];
		if(!me.bought)me.buy();
		if(!me.bought)
		{
			Molpy.Notify('You know the rules, and so do I.');
			return;
		}
		Molpy.CastleTools['NewPixBot'].totalCastlesBuilt=Math.ceil(Molpy.CastleTools['NewPixBot'].totalCastlesBuilt/2);
		me.power++;
		Molpy.LockBoost(me.name);
	}	
	
	new Molpy.Boost({name:'Fractal Sandcastles',
		desc:function(me)
		{
			return 'Get more castles for your sand. Fractal Level is '+me.power;
		}
		,sand:910987654321,castles:12345678910,
		stats:function(me)
		{
			if(!me.bought)return 'Digging sand gives 35% more Castles per Fractal Level, which resets to 1 on the ONG. Blast Furnace uses 94% Sand to make Castles, per Fractal Level';
			return 'Digging Sand will give you ' + Molpify(Math.floor(Math.pow(1.35,me.power)),1)+' Castles';
		},className:'alert',icon:'fractals'});
	new Molpy.Boost({name:'Balancing Act',desc:'Flags and Scaffolds give each other a cumulative 5% boost to Sand digging, Castle building, and Castle destruction (per Scaffold or Flag, respectively)',sand:'1875K',castles:843700,icon:'balancingact'});
	new Molpy.Boost({name:'Ch*rpies',desc:'Increases sand dig rate by 5% per badge earned',
		sand:6969696969,castles:81818181,icon:'chirpies',
		stats:function()
		{
			if(Molpy.Got('Ch*rpies'))
			{
				var mult=0.05*Molpy.BadgesOwned;
				return 'Increases sand dig rate by '+ Molpify(mult*100,2)+'%';
			}
			return 'Increases sand dig rate by 5% per Badge earned';
		}
	});
	new Molpy.Boost({name:'Buccaneer',desc:'Clicks and buckets give double sand',
		sand:'84.7M',castles:7540,icon:'buccaneer'});
	new Molpy.Boost({name:'Bucket Brigade',desc:'Clicks give 1% of sand dig rate per 50 buckets',
		sand:'412M',castles:8001,icon:'bucketbrigade'});
	new Molpy.Boost({name:'Bag Puns',desc:'Doubles Sand rate of Bags. Clicks give 40% more sand for every 5 bags above 25.<br>Yes, most of the "puns" are just word substitutions. I claim no responsibility :P',sand:'1470M',castles:450021,icon:'bagpuns',stats:function(me)
		{
			if(me.power <= 100) return 'Speed is at '+me.power+' out of 100';
			return me.desc;
		}});

	new Molpy.Boost({name:'The Forty',desc:'Cuegan produce 40 times as much sand',sand:40404040,castles:4040,icon:'theforty'});
	new Molpy.Boost({name:'Chequered Flag',desc:'Racing NewPixBots activate 20% sooner',sand:101010101,castles:10101,icon:'cheqflag'});
	new Molpy.Boost({name:'Skull and Crossbones',desc:'Pirates vs. Ninjas! Ninja Builder\'s Castle output is raised by 5% cumulatively per flag owned over 40',sand:304050607,castles:809010,icon:'skullcrossbones',group:'ninj'});
	new Molpy.Boost({name:'No Sell',desc:
		function(me)
		{
			return '<input type="Button" onclick="Molpy.NoSellToggle()" value="'+(me.IsEnabled? 'Show':'Hide')+'"></input> the Sell links on tools.<br>Also affects the Downgrade/Decrease buttons on some Glass-related boosts';
		},IsEnabled:Molpy.BoostFuncs.BoolPowEnabled,sand:3333,castles:55,icon:'nosell',className:'toggle'});
	
	Molpy.NoSellToggle=function()
	{
		var me=Molpy.Boosts['No Sell'];
		if(!me.bought)me.buy();
		if(!me.bought)
		{
			Molpy.Notify('Looks like you need to sell something');
			return;
		}
		_gaq&&_gaq.push(['_trackEvent','Boost','Toggle',me.name]);	
		me.power = (!me.power)*1;
		me.Refresh();
		Molpy.UpdateFaves(1);
		Molpy.shopRepaint=1;
	}
		
	new Molpy.Boost({name:'Blixtnedslag Förmögenhet, JA!',alias:'BFJ',desc:'Not Lucky gets a 20% bonus (non-cumulative) per level of Blixtnedslag Kattungar, JA!',sand:111098645321,castles:7777777777,
		stats:function()
		{
			return 'Adds ' + Molpify(20*Molpy.Boosts['BKJ'].power,1)+'% to Not Lucky reward.<br>It also gets a boost from Blitzing if you get them simultaneously and allows Blitzing to improve Blast Furnace (though only up to 20% of Castles Built, before accounting for Flux Turbine).';
		},icon:'bfj',group:'hpt'});
	new Molpy.Boost({name:'VITSSÅGEN, JA!',alias:'VJ',
		desc:function(me)
		{
			if(me.bought==0) return 'This message is dedicated to MajorDouble7 who found this bug and thus will never see this message since it is intended to stop people from magically getting this without buying it';
			return '<input type="Button" onclick="Molpy.PunsawToggle()" value="'+(me.bought==1? 'Start':'Stop')+'"></input> the Puns!<br>Also gives you some castles every 100 beach-clicks, starting with 1M and increasing each time.<br>And also unlocks some further boosts as you use it.'
		},sand:334455667788,castles:999222111000,icon:'vitss',
		stats:function(me)
		{
			if(me.power <= 20) return 'Speed is at '+me.power+' out of 20';
			if(me.power <= 88) return 'Speed is at '+me.power+' out of 88';
			return 'Speed is at '+Molpify(me.power);
		},group:'hpt',className:'toggle'});
	Molpy.PunsawToggle=function()
	{
		var me=Molpy.Boosts['VJ'];
		me.bought = (me.bought==1?2:1);
		me.Refresh();
		_gaq&&_gaq.push(['_trackEvent','Boost','Toggle',me.name]);	
	}
	new Molpy.Boost({name:'Swedish Chef',desc:
		function(me)
		{
			if(!me.bought)
				return 'Björk Björk Björk!';
			if(!me.power)
				return 'Björk Björk Björk! Well that was a waste...';
			return 'Björk Björk Björk! You\'re welcöme';
		},sand:999222111000,castles:8887766554433,
		stats:function(me)
		{
			if(!me.bought) return 'Look here again after you buy for secret loot!';
			if(!me.power)
			{
				me.power=1;
				Molpy.Build(8887766554433);
			}			
			Molpy.UnlockBoost(['Family Discount','Shopping Assistant','Late Closing Hours']);
			return 'Gives you Swedish stuff and boosts VITSSÅGEN, JA! bonus castles';
		},icon:'swedishchef',group:'hpt'});
	new Molpy.Boost({name:'Family Discount',desc:'Permament 80% discount on all prices',sand:'24G',castles:'720G',
		buyFunction:function(){Molpy.shopRepaint=1;},group:'hpt',icon:'familydiscount'}
	);
	Molpy.shoppingItem='';
	Molpy.shoppingItemName='';
	new Molpy.Boost({name:'Shopping Assistant',desc:
		function(me)
		{
			if(!me.bought)
				return 'We do your shopping for you! For a small fee...';
			if(!Molpy.shoppingItem)
				return '<input type="Button" value="Choose" onclick="Molpy.ChooseShoppingItem()"></input> an item to automatically buy when '+'ASHF'+' is active';
			return 'Buys '+Molpy.shoppingItemName+' whenever possible, taking a 5% handling fee. You may <input type="Button" value="Choose" onclick="Molpy.ChooseShoppingItem()"></input> a different item (or none) at any time.';
		},sand:'18G',castles:'650G',icon:'shopassist',className:'action',group:'hpt'
	});
	Molpy.ChooseShoppingItem=function(mule)
	{
		var donkey=(mule?Molpy.BoostsById[mule]:Molpy.Boosts['Shopping Assistant']);
		var shoppingItem = (mule?(Molpy.BoostsById[Math.abs(donkey.power)].alias || ''):(Molpy.shoppingItem || 'Bag'));
		donkey.power=0;
		var name = prompt('Enter the name of the tool or boost you wish to buy'+(mule?'':' whenever ASHF is active')+'.\nNames are case sensitive.\nLeave blank to disable.\nYour choice is preserved if you reload.',shoppingItem);
		var notify=1;
		if(name)
		{
			var item=Molpy.SandTools[name] || Molpy.CastleTools[name];
			if(!mule && item)
			{
				for(var i in Molpy.tfOrder)
				{
					var tool=Molpy.tfOrder[i];
					if(tool===item)
					{
						donkey.power=-i-1;
						break;
					}
				}
			}else{
				item = Molpy.Boosts[name];
				if(!item)
				{
					item=Molpy.Boosts[Molpy.BoostAKA[name]];
				}
				if(item)
				{
					if(item.bought)
					{
						Molpy.Notify('You have already bought '+item.name);
						notify=0;
					}else{
						donkey.power=item.id;
					}
				}
			}
		}
		if (mule) { Molpy.Boosts['Rob'].Refresh() }
		else { Molpy.SelectShoppingItem(notify) }
	}
	Molpy.SelectShoppingItem=function(notify)
	{
		var donkey=Molpy.Boosts['Shopping Assistant'];
		if(donkey.power<0)
		{
			var item=Molpy.tfOrder[-(donkey.power+1)];
			if(item)
			{
				Molpy.shoppingItem=item.name;
				Molpy.shoppingItemName=item.plural;
				if(notify)
					Molpy.Notify(item.plural + ' will be purchased whenever ASHF is active if possible',1);
				return;
			}
		}else if(donkey.power>0)
		{
			var item = Molpy.BoostsById[donkey.power];
			if(item && !item.bought)
			{
				Molpy.shoppingItem=item.name;
				Molpy.shoppingItemName=item.name;				
				if(notify)
					Molpy.Notify(item.name + ' will be purchased when ASHF is active if possible',1);
				
				return;
			}
		}
		Molpy.shoppingItem='';
		Molpy.shoppingItemName='';
		if(notify)
			Molpy.Notify('No item selected for shopping assistant',1);
		
	}
	Molpy.Donkey=function()
	{
		if(Molpy.shoppingItem && Molpy.Got('Shopping Assistant') && Molpy.Got('ASHF'))
		{
			var factor = Molpy.priceFactor;
			Molpy.priceFactor*=1.05;
			var name=Molpy.shoppingItem;
			var item = Molpy.SandTools[name] || Molpy.CastleTools[name] || Molpy.Boosts[name];
			if(item)
				item.buy();
			Molpy.priceFactor=factor;
		} else if (Molpy.Got('Rob') && (Molpy.Got('ASHF') || !(Molpy.Boosts['Rob'].power&1))) {
			for (var thingy=0; thingy <= Molpy.Boosts['Rob'].bought+1; thingy++) {
				var item = Molpy.BoostsById[thingy+1].power;
				if (item>0) Molpy.BoostsById[item].buy();
			}
		}
	}

	Molpy.Mule=function(id) {
		if (Molpy.Got('Rob') && (Molpy.Got('ASHF') || !(Molpy.Boosts['Rob'].power&1))) {
			for (var thingy=0; thingy <= Molpy.Boosts['Rob'].bought+1; thingy++) {
				if (id == Molpy.BoostsById[thingy+1].power) Molpy.BoostsById[id].buy();
			}
		}
	}
	
	new Molpy.Boost({name:'Late Closing Hours',desc:'ASHF'+' is available for 6 mNP longer',
		sand:'47G',castles:'930G',icon:'lateclosing',group:'hpt'});
	new Molpy.Boost({name:'Throw Your Toys',desc:'Trebuchets build a castle for every flag and bucket owned',sand:'546M',castles: '230K'});
	new Molpy.Boost({name:'Broken Rung',desc:'Multiplies the Sand output of Ladders by the amount of the tool you have least of.',
		sand:'1769M',castles: '450K',icon:'brokenrung'});
	
	new Molpy.Boost({name:'Temporal Rift',
		desc:function(me)
		{
			if(me.bought)return 'A hole in Time has opened. You can not determine where it leads, but it will close in '+Molpify(me.countdown,3)+'mNP.<br><input type="Button" value="JUMP!" onclick="Molpy.RiftJump()"></input>';
			return 'A hole in time has opened.';
		}
		,stats:'Has an unfortunate negative effect on Logicat Wakefulness'
		,logic:3,countdownFunction:function()
		{
			if(this.countdown==2)
			{
				Molpy.Notify('The rift closes in 2mNP!');
			}
		},
		lockFunction:function(me)
		{
			this.countdown=0; //prevent reopening every time you load :P
		}
		,stats:'Why are you reading this? Jump in! <span class="faded">(<b>WARNING</b>: may destroy your castles... which will charge up Flux Turbine.)</span>',startCountdown:7,group:'chron',className:'action'});
	Molpy.RiftJump=function()
	{
		if(Molpy.timeLord)
		{
			Molpy.Notify('You are not a Time Lord');
		}
		Molpy.timeLord=1;
		if(Math.random()*5<4)
		{
			if(isFinite(Molpy.castlesBuilt))
			{
				Molpy.totalCastlesDown+=Molpy.castles;
				Molpy.castlesBuilt-=Molpy.castles;	
			}else{	
				Molpy.totalCastlesDown=Number.MAX_VALUE;
			}
			Molpy.Destroy('Castles',Molpy.castles);	
			Molpy.Dig(Molpy.sand);	
		}
		if(Molpy.Got('Temporal Rift'))
		{
			Molpy.newpixNumber=Math.round(Math.random()*Molpy.highestNPvisited);
			if(Molpy.Earned('Minus Worlds')&&Math.floor(Math.random()*2))Molpy.newpixNumber*=-1;;
			Molpy.ONG();
			Molpy.LockBoost('Temporal Rift');
			if(Molpy.Got('Void Goat')&&Molpy.Got('Flux Surge'))Molpy.Add('Goat',1);
		}else
		{
			Molpy.newpixNumber*=-1;
			Molpy.HandlePeriods();
			Molpy.UpdateBeach();
			Molpy.recalculateDig=1;
		}
		Molpy.Notify('You wonder when you are');
	}
	
	new Molpy.Boost({name:'Glass Furnace',
		desc:function(me)
		{
			if(!me.bought) return 'Turns Sand into Glass';
			var pow=Molpy.Boosts['Sand Refinery'].power+1;
			var cost=Molpify(Molpy.GlassFurnaceSandUse(1),2);
			var str= (me.IsEnabled?'U':'When active, u')+'ses '+cost+'% of Sand dig rate to produce '+Molpify(pow,3)+' Glass Chip'+plural(pow)+' per NP.<br>';
			
			if(Molpy.Got('Glass Furnace Switching'))
			{
			 str+='Currently '+(me.IsEnabled?'Dea':'A')+'ctivating.';
			}else{
				str+='<br><input type="Button" value="'+(me.IsEnabled?'Dea':'A')+'ctivate" onclick="Molpy.SwitchGlassFurnace('+me.IsEnabled+')"></input>';
			}			
			return str;
		}
		,IsEnabled:Molpy.BoostFuncs.BoolPowEnabled,sand:'80M',castles:'0.5M',icon:'glassfurnace',className:'toggle',group:'hpt'});
	new Molpy.Boost({name:'Glass Furnace Switching',
		desc:function(me)
		{
			return (me.IsEnabled?'off':'on')+' in '+Molpify(me.countdown,3)+'mNP';
		}
		,startCountdown:1500//dummy value
		,lockFunction:
		function()
		{
			Molpy.Boosts['Glass Furnace'].IsEnabled = (!this.IsEnabled)*1;
			Molpy.Notify('Glass Furnace is '+(this.IsEnabled?'off':'on'));
		}
		,IsEnabled:Molpy.BoostFuncs.BoolPowEnabled,className:'alert',group:'hpt'
	});
	Molpy.SwitchGlassFurnace=function(off)
	{
		if(Molpy.Got('Glass Furnace Switching'))
		{
			Molpy.Notify('Glass Furnace is already switching, please wait for it');
			return;
		}
		if(!(off||Molpy.CheckSandRateAvailable(Molpy.GlassFurnaceSandUse(1))))
		{
			Molpy.Notify('Not enough Sand available for further machinery');
			return;
		}
		_gaq&&_gaq.push(['_trackEvent','Boost','Toggle',this.name]);	
		Molpy.Boosts['Glass Furnace Switching'].IsEnabled=off;
		Molpy.GiveTempBoost('Glass Furnace Switching',off,1500);
	}
	//check whether we can further reduce the sand rate to use any for various means
	Molpy.CheckSandRateAvailable=function(increment)
	{
		return Molpy.CalcGlassUse()+increment <= 100;
	}
	Molpy.GlassFurnaceSandUse=function(force)
	{
		if(force||Molpy.Boosts['Glass Furnace'].power||Molpy.Got('Glass Furnace Switching'))
		{
			var amount = Molpy.Boosts['Sand Refinery'].power+1;
			amount*=Molpy.SandRefineryIncrement();
			return amount||0;
		}
		return 0;
	}
	Molpy.SandRefineryIncrement=function()
	{
		var inc=1;
		if(Molpy.Got('Sand Purifier'))
			inc/=(Molpy.Boosts['Sand Purifier'].power+2);
		if(Molpy.Got('Badgers'))
		{
			inc*=Math.pow(.99,Math.floor(Molpy.BadgesOwned/10));
		}
		return inc||0;
	}
	Molpy.GlassBlowerSandUse=function(force)
	{
		if(force||Molpy.Boosts['Glass Blower'].power||Molpy.Got('Glass Blower Switching'))
		{
			var amount = Molpy.Boosts['Glass Chiller'].power+1;
			amount*=Molpy.GlassChillerIncrement();
			return amount||0;
		}
		return 0;
	}
	Molpy.GlassChillerIncrement=function()
	{	
		var inc = 1;
		if(Molpy.Got('Glass Extruder'))
			inc/=(Molpy.Boosts['Glass Extruder'].power+2);
		if(Molpy.Got('Mushrooms'))
		{
			inc*=Math.pow(.99,Math.floor(Molpy.BadgesOwned/10));
		}
		return inc||0;
	}
	Molpy.CalcGlassUse=function()
	{
		var glassUse=0;
		glassUse+=Molpy.GlassFurnaceSandUse();
		glassUse+=Molpy.GlassBlowerSandUse();		
		return glassUse;
	}
	
	Molpy.ChainRefresh=function(mrob)
	{
		Molpy.Boosts[mrob].Refresh(1);
	}
	Molpy.RefreshGlass=function()
	{	
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
	
	new Molpy.Boost({name:'Sand Refinery',desc:
		function(me)
		{		
			var ch = Molpy.Boosts['GlassChips'];
			var bl = Molpy.Boosts['GlassBlocks'];
			var str='Causes the Glass Furnace to produce '+Molpify(me.power+1,3)+' Glass Chip'+plural(pow)+' per run.';
			if(isFinite(me.power)&&Molpy.CheckSandRateAvailable(Molpy.SandRefineryIncrement()))
			{
				var useChips=1;
				var afford=1;
				if(ch.power>=3)
				{
					
				}else if(Molpy.Has('GlassBlocks',1))
				{
					useChips=0
				}else{
					str+= 'It costs 3 Chips to upgrade the Glass Furnace\'s speed.';
					afford=0;
				}
				if(afford)
				{
					var pow=(Molpy.Boosts['Sand Refinery'].power)+2;
					str+= '<br><input type="Button" value="Pay" onclick="Molpy.UpgradeSandRefinery(1)"></input> '
						+(useChips?'3 Chips':'1 Block')+' to upgrade the Glass Furnace to produce '+Molpify(pow,3)
						+' Glass Chip'+plural(pow)+' per NP (will use '+Molpify(pow*Molpy.SandRefineryIncrement(),2)+'% of Sand dig rate).';
				}
					
				if(Molpy.CheckSandRateAvailable(Molpy.SandRefineryIncrement()*20))
				{
					var useChips=1;
					var afford=1;
					if(ch.power>=50)
					{
						
					}else if(Molpy.Has('GlassBlocks',18))
					{
						useChips=0
					}else{
						str+= '<br>It costs 50 Chips to upgrade the Glass Furnace\'s speed by 20.';
						afford=0;
					}
					if(afford)
					{
						var pow=(Molpy.Boosts['Sand Refinery'].power)+21;
						str+= '<br><input type="Button" value="Pay" onclick="Molpy.UpgradeSandRefinery(20)"></input> '
							+(useChips?'50 Chips':'18 Blocks')+' to upgrade the Glass Furnace to produce '+Molpify(pow,3)
							+' Glass Chips per NP (will use '+Molpify(pow*Molpy.SandRefineryIncrement(),2)+'% of Sand dig rate).';
					}	
					
					if(Molpy.Boosts['Sand Purifier'].power>200&&Molpy.CheckSandRateAvailable(Molpy.SandRefineryIncrement()*600))
					{
						var useChips=1;
						var afford=1;
						if(ch.power>=1500)
						{
							
						}else if(Molpy.Has('GlassBlocks',540))
						{
							useChips=0
						}else{
							afford=0;
						}
						if(afford)
						{
							var pow=(Molpy.Boosts['Sand Refinery'].power)+601;
							str+= '<br><input type="Button" value="Pay" onclick="Molpy.UpgradeSandRefinery(600)"></input> '
								+(useChips?'1,500 Chips':'540 Blocks')+' to upgrade the Glass Furnace to produce '+Molpify(pow,3)
								+' Glass Chips per NP (will use '+Molpify(pow*Molpy.SandRefineryIncrement(),2)+'% of Sand dig rate).';
								
							if (Molpy.Got('Seaish Glass Chips'))
							{
								str += '<br><input type="Button" value="Seaish Upgrade" onclick="Molpy.SeaishSandRefinery()"></input>';
							}
						}						
					}					
				}					
				
			}else{
				if(isFinite(me.power))
				{
					str+='<br>Currently, you have no more sand available for further upgrades';
				}else{
					str+='<br>You have no need for further upgrades.';
				}
			}
			if(!Molpy.Boosts['No Sell'].power&&me.power>1)
			{
				if(me.power>200)
				{
					str+='<br><input type="Button" value="Downgrade" onclick="Molpy.DowngradeSandRefinery(1)">\
						</input> the Sand Refinery by an amount of your choosing.';
				}else{
					str+='<br><input type="Button" value="Downgrade" onclick="Molpy.DowngradeSandRefinery()">\
						</input> the Sand Refinery (by 1) and receive a 1 Glass Chip refund.';
				}
			}
			return str;
		}
		,icon:'sandrefinery',className:'action',group:'hpt'
	});
	Molpy.UpgradeSandRefinery=function(n)
	{
		if(Molpy.CheckSandRateAvailable(Molpy.SandRefineryIncrement()*n))
		{
			var chipCost = (n<20?n*3:n*2.5);
			var blockCost = (n<20?n:n*.9);
			if(Molpy.Has('GlassChips',chipCost))
			{
				Molpy.Spend('GlassChips',chipCost);
			}
			else if(Molpy.Has('GlassBlocks',blockCost))
			{
				Molpy.Spend('GlassBlocks',blockCost);
			}else{
				return;
			}
			Molpy.Boosts['Sand Refinery'].power+=n;
			Molpy.Notify('Sand Refinery upgraded',1);
			Molpy.recalculateDig=1;
			_gaq&&_gaq.push(['_trackEvent','Boost','Upgrade','Sand Refinery']);	
		}		
	}
	Molpy.DowngradeSandRefinery=function(choose)
	{
		var sr = Molpy.Boosts['Sand Refinery'];
		var n = 1;
		if(choose)
		{
			n = prompt('Enter a number of levels (e.g. '+Molpify(sr.power/10,0,1)+') or a percentage of the current value, by which to reduce Sand Refinery\'s power:','10%');
			if(!n)return;
			if(n.indexOf('%')>0)
			{
				n = sr.power*parseFloat(n.split('%')[0])/100;
			}else
			{
				n=DeMolpify(n);
			}
			if(!n)return;
		}
		if(sr.power<n)return;
		Molpy.Add('GlassChips',n);
		sr.power=Math.floor(sr.power-n)||0;
		Molpy.Notify('Sand Refinery downgraded',1);
		Molpy.recalculateDig=1;			
		_gaq&&_gaq.push(['_trackEvent','Boost','Downgrade','Sand Refinery']);	
	}
	
	
	Molpy.chipAddAmount=0;
	Molpy.chipWasteAmount=0;	
	new Molpy.Boost({name:'Glass Chip Storage',alias:'GlassChips',
		Level:Molpy.BoostFuncs.RoundPosPowerLevel,
		Has:Molpy.BoostFuncs.Has,
		Spend:Molpy.BoostFuncs.Spend,
		Destroy:function(amount)
		{
			this.Level-=amount;
			Molpy.chipAddAmount-=amount;
			return 1;
		},
		refreshFunction:Molpy.RefreshGlass,
		Add:function(amount,expand)
		{
			if(!this.bought)
			{
				Molpy.UnlockBoost('GlassChips');
				this.buy();
			}
			this.Level+=amount;
			var waste = Math.max(0,this.Level-(this.bought)*10);
			if (waste && expand && Molpy.Boosts['Stretchable Chip Storage'].power)
			{
				this.Spend(amount);
				this.bought += Math.floor(amount/4.5);
			}
			else
			{
				if (waste)
				{
					this.Level-=waste;
					amount-=waste;
					Molpy.chipWasteAmount+=waste;
					if (expand && Molpy.chipWasteAmount > 1000000) Molpy.UnlockBoost('Stretchable Chip Storage');
				}
				Molpy.chipAddAmount+=amount;
			}				
			this.Refresh();			
		},
		desc:function(me)
		{
			me.bought=Math.round(me.bought);
			
			var str= 'Contains '+Molpify(me.Level,3)+' Glass Chip'+plural(me.Level)+'.';
			var size=(me.bought)*10;
			var rate = Molpy.Boosts['Sand Refinery'].power+1;
			str+= ' Has space to store '+Molpify(size,3)+ ' Chips total.';
			if(me.Has(11)&&!Molpy.Got('Sand Refinery'))
			{
				if(me.Has(30))
				{
					str+='<br><input type="Button" value="Pay" onclick="Molpy.BuyGlassBoost(\'Sand Refinery\',30,0)"></input> 30 Chips to build a Sand Refinery to make Chips faster.'
				}else{
					str+='<br>It costs 30 Glass Chips to build a Sand Refinery, which can make Chips faster.';
				}
			}			
			if(me.Has(100)&&!Molpy.Got('Glass Blower'))
			{
				if(me.Has(150))
				{
					str+= '<br><input type="Button" value="Pay" onclick="Molpy.BuyGlassBoost(\'Glass Blower\',150,0)"></input> 150 Chips to build a Glass Blower to make Glass Blocks from Glass Chips.'
				}else{
					str+='<br>It costs 150 Glass Chips to build a Glass Blower, which makes Glass Blocks from Glass Chips.';
				}
			}		
			if(me.Has(7500)&&!Molpy.Got('Glass Extruder'))
			{
				if(me.Has(10000))
				{
					str+= '<br><input type="Button" value="Pay" onclick="Molpy.BuyGlassBoost(\'Glass Extruder\',10000,0)"></input> '+Molpify(10000)+' Chips'
				}else{
					str+='<br>It costs '+Molpify(10000)+' Glass Chips';
				}
				str+=' to build a Glass Extruder which makes the Glass Blower use less Sand.';
			}
			
			if(!isFinite(size))return str;
			if(size-me.Level<=rate*10||Molpy.Got('AA'))
			{
				if(me.Has(5))
				{
					str+='<br><input type="Button" value="Pay" onclick="Molpy.UpgradeChipStorage(1)"></input> 5 Chips to build storage for 10 more.'
				}else{
					str+='<br>It costs 5 Glass Chips to store 10 more.';
				}
				if(rate>150)
				{
					if(me.Has(90))
					{
						str+='<br><input type="Button" value="Pay" onclick="Molpy.UpgradeChipStorage(20)"></input> 90 Chips to build storage for 200 more.'
					}else{
						str+='<br>It costs 90 Glass Chips to store 200 more.';
					}
					if(me.bought>250)
					{
						var n = Math.floor(me.Level/12)*2 //ensure even to prevent fractional chips
						if(n>20)
						{
							str+='<br><input type="Button" value="Pay" onclick="Molpy.UpgradeChipStorage('+n+')"></input> '+Molpify(n*4.5,3)+' Chips to build storage for '
								+Molpify(n*10,3)+' more.'
						}
					}
				}
			}
			return str;
		}
		,icon:'glasschipstore',group:'stuff',className:'alert'
	});
	Molpy.UpgradeChipStorage=function(n)
	{
		var cost = n*5
		if(n>=10)cost*=.9;
		if(Molpy.Has('GlassChips',cost))
		{
			var ch = Molpy.Boosts['GlassChips'];
			Molpy.Spend('GlassChips',cost);
			ch.bought+=n;
			Molpy.Notify('Glass Chip Storage upgraded',1);
			_gaq&&_gaq.push(['_trackEvent','Boost','Upgrade',ch.name]);	
		}
	}
	
	Molpy.BuyGlassBoost=function(name,chips,blocks)
	{
		if(Molpy.Has('GlassChips',chips)&&Molpy.Has('GlassBlocks',blocks))
		{
			Molpy.Spend('GlassChips',chips);
			Molpy.Spend('GlassBlocks',blocks);
			Molpy.UnlockBoost(name);
			Molpy.Boosts[name].buy();			
		}else{
			Molpy.Notify('You require more <span class="strike">Vespene Gas</span>Glass',1)
		}
	}
	Molpy.ChipsPerBlock=function()
	{
		var troll=(Molpy.IsEnabled('Glass Trolling')?5:1);
		if(Molpy.Got('Ruthless Efficiency'))
		{
			return 5/troll;
		}
		return 20/troll;
	}
	
	//glass blower
	new Molpy.Boost({name:'Glass Blower',
		desc:function(me)
		{
			if(!me.bought) return 'Makes Glass Blocks from Glass Chips';
			var pow=Molpy.Boosts['Glass Chiller'].power+1;
			var cost=Molpify(Molpy.GlassBlowerSandUse(1),2);
			var str= (me.IsEnabled?'U':'When active, u')+'ses '+cost+'% of Sand dig rate to produce '+Molpify(pow,3)+' Glass Block'+plural(pow)
				+' from '+Molpy.ChipsPerBlock()+' Glass Chips (each) per NP.<br>';			
			
			if(Molpy.Got('Glass Blower Switching'))
			{
			 str+='Currently '+(me.IsEnabled?'Dea':'A')+'ctivating.';
			}else{
				str+='<br><input type="Button" value="'+(me.IsEnabled?'Dea':'A')+'ctivate" onclick="Molpy.SwitchGlassBlower('+me.IsEnabled+')"></input>';
			}			
			return str;			
			
		}
		,IsEnabled:Molpy.BoostFuncs.BoolPowEnabled,icon:'glassblower',className:'toggle',group:'hpt'});
	new Molpy.Boost({name:'Glass Blower Switching',
		desc:function(me)
		{
			return (me.IsEnabled?'off':'on')+' in '+Molpify(me.countdown,3)+'mNP';
		},lockFunction:
		function()
		{
			Molpy.Boosts['Glass Blower'].IsEnabled = (!this.IsEnabled)*1;
			Molpy.Notify('Glass Blower is '+(this.IsEnabled?'off':'on'));
		}
		,startCountdown:2500//dummy value
		,IsEnabled:Molpy.BoostFuncs.BoolPowEnabled,className:'alert',group:'hpt'
	});
	Molpy.SwitchGlassBlower=function(off)
	{
		if(Molpy.Got('Glass Blower Switching'))
		{
			Molpy.Notify('Glass Blower is already switching, please wait for it');
			return;
		}
		if(!(off||Molpy.CheckSandRateAvailable(Molpy.GlassBlowerSandUse(1))))
		{
			Molpy.Notify('Not enough Sand available for further machinery');
			return;
		}
		_gaq&&_gaq.push(['_trackEvent','Boost','Toggle',this.name]);
		Molpy.Boosts['Glass Blower Switching'].IsEnabled=off;
		Molpy.GiveTempBoost('Glass Blower Switching',off,2500);
	}
	
	new Molpy.Boost({name:'Glass Chiller',desc:
		function(me)
		{		
			var str='Causes the Glass Blower to produce '+Molpify(me.power+1,3)+' Glass Block'+plural(pow)+' per run.';
			if(isFinite(me.power))
			{
				if(Molpy.Has('GlassBlocks',5))
				{
					if(Molpy.CheckSandRateAvailable(Molpy.GlassChillerIncrement()))
					{
						var pow=(me.power)+2;
						str+= '<br><input type="Button" value="Pay" onclick="Molpy.UpgradeGlassChiller(1)"></input> 5 Blocks to upgrade the Glass Blower to produce '
							+Molpify(pow,3)+' Glass Block'+plural(pow)+' per NP (will use '+Molpify(pow*Molpy.GlassChillerIncrement(),2)+'% of Sand dig rate).';
						
						if(Molpy.Boosts['Glass Extruder'].power>10&&Molpy.CheckSandRateAvailable(Molpy.GlassChillerIncrement()*20))
						{
							var pow=(Molpy.Boosts['Glass Chiller'].power)+21;
							str+= '<br><input type="Button" value="Pay" onclick="Molpy.UpgradeGlassChiller(20)"></input> 90 Blocks to upgrade the Glass Blower to produce '
								+Molpify(pow,3)+' Glass Block'+plural(pow)+' per NP (will use '+Molpify(pow*Molpy.GlassChillerIncrement(),2)+'% of Sand dig rate).';
								
							if (Molpy.Got('Seaish Glass Blocks'))
							{
								str += '<br><input type="Button" value="Seaish Upgrade" onclick="Molpy.SeaishGlassChiller()"></input>';
							}
						}
						
					}else{
						str+='<br>Currently, you have no more sand available for further upgrades.';
					}
				}else
					str+= 'It costs 5 Blocks to upgrade the Glass Blower\'s speed.';
			}else{
				str+='<br>You have no need for further upgrades.';
			}
			if(!Molpy.Boosts['No Sell'].power&&me.power>1)
			{
				if(me.power>200)
				{
					str+='<br><input type="Button" value="Downgrade" onclick="Molpy.DowngradeGlassChiller(1)">\
						</input> the Glass Chiller by an amount of your choosing.';
				}else{
					str+='<br><input type="Button" value="Downgrade" onclick="Molpy.DowngradeGlassChiller()">\
						</input> the Glass Chiller (by 1) and receive a 1 Glass Block refund.';
				}
			}
			return str;
		},icon:'glasschiller',className:'action',group:'hpt'
	});
	Molpy.UpgradeGlassChiller=function(n)
	{
		var unitCost=5;
		if(n>10) unitCost*=.9;
		if(Molpy.Has('GlassBlocks',unitCost*n) && Molpy.CheckSandRateAvailable(Molpy.GlassChillerIncrement()*n))
		{
			Molpy.Spend('GlassBlocks',unitCost*n);
			Molpy.Boosts['Glass Chiller'].power+=n;
			Molpy.Notify('Glass Chiller upgraded',1);
			Molpy.recalculateDig=1;
			_gaq&&_gaq.push(['_trackEvent','Boost','Upgrade','Glass Chiller']);	
		}
	}
	Molpy.DowngradeGlassChiller=function(choose)
	{
		var gc = Molpy.Boosts['Glass Chiller'];
		var n = 1;
		if(choose)
		{
			n = prompt('Enter a number of levels (e.g. '+Molpify(gc.power/10,0,1)+') or a percentage of the current value, by which to reduce Glass Chiller\'s power:','10%');
			if(!n)return;
			if(n.indexOf('%')>0)
			{
				n = gc.power*parseFloat(n.split('%')[0])/100;
			}else
			{
				n=DeMolpify(n);
			}
			if(!n)return;
		}
		if(gc.power<n)return;
		Molpy.Add('GlassBlocks',n);
		gc.power=Math.floor(gc.power-n)||0;
		Molpy.Notify('Glass Chiller downgraded',1);
		Molpy.recalculateDig=1;
		_gaq&&_gaq.push(['_trackEvent','Boost','Downgrade','Glass Chiller']);		
	}
	
	Molpy.blockAddAmount=0;
	Molpy.blockWasteAmount=0;
	new Molpy.Boost({name:'Glass Block Storage',alias:'GlassBlocks',	
		Level:Molpy.BoostFuncs.RoundPosPowerLevel,
		Has:Molpy.BoostFuncs.Has,
		Spend:Molpy.BoostFuncs.Spend,
		refreshFunction:Molpy.RefreshGlass,
		Add:function(amount,expand)
		{
			if(!this.bought)
			{
				Molpy.UnlockBoost('GlassBlocks');
				this.buy();
			}
			this.Level+=amount;
			var waste = Math.max(0,this.Level-(this.bought)*50);
			if (waste && expand && Molpy.Boosts['Stretchable Block Storage'].power)
			{
				this.Level -= amount;
				this.bought += Math.floor(amount/13.5);
			}
			else
			{
				if (!Molpy.Got('Stretchable Block Storage') && this.Level == Infinity) waste=amount;
				if (waste)
				{
					this.Level-=waste;
					amount-=waste;
					Molpy.blockWasteAmount+=waste;
					if (expand && Molpy.blockWasteAmount > 1000000) Molpy.UnlockBoost('Stretchable Block Storage');
				}
				if(amount) Molpy.EarnBadge('Glassblower');
				Molpy.blockAddAmount+=amount;
			}
			Molpy.RefreshGlass();			
		},
		desc:function(me)
		{
			me.bought=Math.round(me.bought);
			
			var str= 'Contains '+Molpify(me.Level,3)+' Glass Block'+plural(me.Level)+'.';
			var size=(me.bought)*50;
			var rate = Molpy.Boosts['Glass Chiller'].power+1;
			str+= ' Has space to store '+Molpify(size,3)+ ' Blocks total.';
			if(me.Has(31)&&!Molpy.Got('Glass Chiller'))
			{
				if(me.Has(80))
				{
					str+= '<br><input type="Button" value="Pay" onclick="Molpy.BuyGlassBoost(\'Glass Chiller\',0,80)"></input> 80 Blocks to build a Glass Chiller to make Blocks faster.';
				}else{
					str+='<br>It costs 80 Glass Blocks to build a Glass Chiller, which can make Blocks faster.';
				}
			}
			if(me.Has(41)&&!Molpy.Got('Sand Purifier'))
			{
				if(me.Has(95))
				{
					str+= '<br><input type="Button" value="Pay" onclick="Molpy.BuyGlassBoost(\'Sand Purifier\',0,95)"></input> 95 Blocks';
				}else{
					str+='<br>It costs 95 Glass Blocks';
				}
				str+=' to build a Sand Purifier, which makes the Glass Furnace use less sand.';
			}
			if(!isFinite(size))return str;
			
			if(size-me.Level<=rate*10||Molpy.Got('AA'))
			{
				if(me.Has(15))
				{
					str+= '<br><input type="Button" value="Pay" onclick="Molpy.UpgradeBlockStorage(1)"></input> 15 Blocks to build storage for 50 more.'
				}else{
					str+='<br>It costs 15 Glass Blocks to store 50 more.';
				}
				if(rate>200)
				{
					if(me.Has(2800))
					{
						str+= '<br><input type="Button" value="Pay" onclick="Molpy.UpgradeBlockStorage(20)"></input> 270 Blocks to build storage for '+Molpify(1000)+' more.'
					}else{
						str+='<br>It costs 270 Glass Blocks to store '+Molpify(1000)+' more.';
					}
					
					if(me.bought>250)
					{
						var n = Math.floor(me.power/30)*2 //ensure even number to prevent fractional blocks
						if(n>20)
						{
							str+='<br><input type="Button" value="Pay" onclick="Molpy.UpgradeBlockStorage('+n+')"></input> '+Molpify(n*13.5,3)+' Blocks to build storage for '
								+Molpify(n*50,3)+' more.'
						}
					}
				}
			}
			return str;
		}
		,icon:'glassblockstore',group:'stuff',className:'alert'
	});
	Molpy.UpgradeBlockStorage=function(n)
	{
		var cost=n*15;
		if(n>=10)cost*=.9;
		if(Molpy.Has('GlassBlocks',cost))
		{
			var bl = Molpy.Boosts['GlassBlocks'];
			Molpy.Spend('GlassBlocks',cost);
			bl.bought+=n;
			Molpy.Notify('Glass Block Storage upgraded',1);
			_gaq&&_gaq.push(['_trackEvent','Boost','Upgrade',bl.name]);	
		}
	}
	Molpy.SandPurifierUpgradeCost=function()
	{
		return 20+(5*Molpy.Boosts['Sand Purifier'].power);
	}
	Molpy.UpgradeSandPurifier=function()
	{
		if(Molpy.Has('GlassBlocks',Molpy.SandPurifierUpgradeCost()))
		{
			Molpy.Spend('GlassBlocks',Molpy.SandPurifierUpgradeCost());
			Molpy.Boosts['Sand Purifier'].power++;
			Molpy.recalculateDig=1;
			Molpy.Notify('Sand Purifier upgraded',1);
			_gaq&&_gaq.push(['_trackEvent','Boost','Upgrade','Sand Purifier']);	
		}
	}
	new Molpy.Boost({name:'Sand Purifier',
		desc:function(me)
		{
			var cost = Molpy.SandPurifierUpgradeCost();
			var str = 'Glass Furnace\'s sand use is divided by '+Molpify(me.power+2,2);
			if(!isFinite(me.power))return str;
			if(Molpy.Has('GlassBlocks',cost-10))
			{
				if(Molpy.Has('GlassBlocks',cost))
				{
					str+='.<br><input type="Button" value="Pay" onclick="Molpy.UpgradeSandPurifier()"></input> '+Molpify(cost,3)
						+ ' Glass Blocks to increase this by 1.';
					if (Molpy.Got('Seaish Glass Chips'))
					{
						str += '<br><input type="Button" value="Seaish Upgrade" onclick="Molpy.SeaishSandPurifier()"></input>';
					}	
						
				}else{
					str+='.<br>It costs '+Molpify(cost,3)+ ' Glass Blocks to increase this by 1.';				
				}
			}
			return str;
		}
		,className:'action',group:'hpt',icon:'sandpurifier'}
	);
	
  Molpy.SeaishSandPurifier=function()
    {
        var bl = Molpy.Boosts['GlassBlocks'];
		var a = 5; // the step size in prices
		var b = 2*Molpy.SandPurifierUpgradeCost() - a;
		var c = -2*bl.power*.99;

		var upgrades = Math.floor((-b+Math.sqrt(b*b-4*a*c))/(2*a)); 

		var backoff = 1;
		while (upgrades) {
			var cost = Molpy.SandPurifierUpgradeCost()*upgrades +a*(upgrades-1)*upgrades/2;
			if (Molpy.Has('GlassBlocks',cost)) break;
			upgrades -= backoff;
			backoff*=2;
		}

		if (upgrades>0) {
			Molpy.Spend('GlassBlocks',cost);
			Molpy.Boosts['Sand Purifier'].power+= upgrades;

			Molpy.recalculateDig=1;
			Molpy.Notify('Sand Purifier upgraded '+Molpify(upgrades,2) + ' times' ,1);
			_gaq&&_gaq.push(['_trackEvent','Boost','Seaish Upgrade','Sand Purifier']);	
        }
    }

    Molpy.SeaishGlassExtruder=function()
    {
        var ch = Molpy.Boosts['GlassChips'];
		var a = 500; // the step size in prices
		var b = 2*Molpy.GlassExtruderUpgradeCost() - a;
		var c = -2*ch.power*.99;

		var upgrades = Math.floor((-b+Math.sqrt(b*b-4*a*c))/(2*a)); 
		var backoff = 1;
		while (upgrades) {
			var cost = Molpy.GlassExtruderUpgradeCost()*upgrades +a*(upgrades-1)*upgrades/2;
			if (Molpy.Has('GlassChips',cost)) break;
			upgrades -= backoff;
			backoff*=2;
		}

		if (upgrades > 0) {
			Molpy.Spend('GlassChips',cost);
			Molpy.Boosts['Glass Extruder'].power+= upgrades;

			Molpy.recalculateDig=1;
			Molpy.Notify('Glass Extruder upgraded '+Molpify(upgrades,2) + ' times' ,1);
			_gaq&&_gaq.push(['_trackEvent','Boost','Seaish Upgrade','Glass Extruder']);	
		}
    }

    Molpy.SeaishSandRefinery=function()
    {
        var ch = Molpy.Boosts['GlassChips'];
        var extra = Math.min(Math.floor(ch.power/2.51),Math.floor((100 - Molpy.CalcGlassUse())/Molpy.SandRefineryIncrement()-1));
        if (extra>20) 
        {
            Molpy.Boosts['Sand Refinery'].power+=extra;
	    var backoff = 1;
	    while ( Molpy.CalcGlassUse() >= 100)
	    {
            	Molpy.Boosts['Sand Refinery'].power-=backoff;
		extra -= backoff;
	        backoff*=2;
	    }
	    if (extra > 0) {
                Molpy.Spend('GlassChips',extra*2.5);
                Molpy.Boosts['Sand Refinery'].Refresh();
                Molpy.Notify('Sand Refinery upgraded '+Molpify(extra,2)+' times',1);
                Molpy.recalculateDig=1;
			_gaq&&_gaq.push(['_trackEvent','Boost','Seaish Upgrade','Sand Refinery']);	
	    }
        }       

    }

    Molpy.SeaishGlassChiller=function()
    {
        var bl = Molpy.Boosts['GlassBlocks'];
        var extra = Math.min(Math.floor(bl.power/4.51),Math.floor((100 - Molpy.CalcGlassUse())/Molpy.GlassChillerIncrement()-1));
		extra = Math.min(extra, Math.floor(Molpy.Level('GlassChips')/1e12+Molpy.Boosts['Sand Refinery'].power/Molpy.ChipsPerBlock()-Molpy.Boosts['Glass Chiller'].power-2));
        if (extra>20) 
        {
            Molpy.Boosts['Glass Chiller'].power+=extra;
			var backoff = 1;
			while ( Molpy.CalcGlassUse() >= 100)
			{
					Molpy.Boosts['Glass Chiller'].power-=backoff;
			extra -= backoff;
				backoff*=2;
			}
			if (extra > 0) {
				Molpy.Spend('GlassBlocks',extra*4.5);
				Molpy.Boosts['Glass Chiller'].Refresh();
				Molpy.Notify('Glass Chiller upgraded '+Molpify(extra,2)+' times',1);
				Molpy.recalculateDig=1;
				_gaq&&_gaq.push(['_trackEvent','Boost','Seaish Upgrade','Glass Chiller']);	
			}
        }	
    }	
	
	new Molpy.Boost({name:'Glass Jaw',
		desc:function(me)
		{
			var str= 'Ninja Builder builds 100x as many Castles, at the cost of 1 Glass Block per NP.';
			if(me.bought){
				str+='<br><input type="Button" onclick="Molpy.GenericToggle('+me.id+')" value="'+(me.IsEnabled? 'Dea':'A')+'ctivate"></input>';
			}
			return str;
		}
		,IsEnabled:Molpy.BoostFuncs.BoolPowEnabled,sand:'16M',castles:122500,icon:'glassjaw',group:'ninj',className:'toggle'});
		
	new Molpy.Boost({name:'Ninja League',desc:'Ninja Stealth is raised by 100x as much'
		,sand:'5T',castles:'0.6T',icon:'ninjaleague',group:'ninj'});
		
	new Molpy.Boost({name:'Ninja Legion',desc:'Ninja Stealth is raised by 1000x as much'
		,sand:'3P',castles:'0.9P',group:'ninj',icon:'ninjalegion'});
		
	new Molpy.Boost({name:'Swim Between the Flags',alias:'SBTF',desc:'Each Flag gives Waves a 6% bonus to Castle production on even NewPix (i.e. when changing from an odd NewPix to an even NewPix) and to destruction on odd NewPix. The Sand production of Flags is multiplied by the number of Waves on odd NewPix and divided on even NewPix.', sand:'14G', castles: '2T',icon:'swimbetweenflags'});
	
	new Molpy.Boost({name:"Château d'If",
		desc:function(me)
		{
			var str = '<b>THIS FORTRESS IS HERE</b>.'
			if(me.bought)
			{
				if(!Molpy.Got('Rosetta'))
				{
					str+= '<br><input type="Button" value="Trade" onclick="Molpy.GetRosetta()"></input> 50 Bags to find Rosetta.';
				}
				if(!Molpy.Got('WWB')&&Molpy.CastleTools['Scaffold'].amount>=400)
				{
					str+= '<br><input type="Button" value="Trade" onclick="Molpy.GetWWB()"></input> 444 Scaffolds to hire Window Washing Beanies.';
				}
				if(!Molpy.Got('RB'))
				{
					str+= '<br><input type="Button" value="Trade" onclick="Molpy.BuyGlassBoost(\'RB\',144000,1234)"></input> '+Molpify(144000)+' Glass Chips and '+Molpify(1234)+' Glass Blocks to hire Recycling Beanies.';
				}
			}
			return str;
		}, sand:'400T',castles:'12.5T',icon:'chateau',group:'bean',
		classChange:function()
		{
			var oldClass=this.className;
			var newClass = (!Molpy.Boosts['Rosetta'].unlocked
				||!Molpy.Got('WWB')&&Molpy.CastleTools['Scaffold'].amount>=400
				||!Molpy.Got('RB')&&Molpy.Has('GlassChips',100000)&&Molpy.Has('GlassBlocks',1000)
				)
				?'action':'';
			if(newClass!=oldClass)
			{
				this.className=newClass;
				return 1;
			}
		}});
		
	Molpy.GetRosetta=function()
	{
		if(Molpy.SandTools['Bag'].amount>=50)
		{
			Molpy.SandTools['Bag'].amount-=50;			
			Molpy.SandToolsOwned-=50;			
			Molpy.SandTools['Bag'].Refresh();
			Molpy.UnlockBoost('Rosetta');
		}else{
			Molpy.Notify('<b>THEY ARE HEAVY</b>',1);
		}
	}
	new Molpy.Boost({name:'Rosetta',
		desc:function(me)
		{
			var str = '<b>SOMEWHAT</b>.'
			if(me.bought)
			{
				if(!Molpy.Got('Panther Salve'))
				{
					str+= '<br><input type="Button" value="Trade" onclick="Molpy.BuyGlassBoost(\'Panther Salve\',0,250)"> 250 Glass Blocks for Panther Salve.</input>'
				}
				
				var fa = Molpy.Boosts['Factory Automation'];
				var bots=Molpy.CastleTools['NewPixBot'].amount;
				if(fa.bought && Molpy.Got('Doublepost'))
				{
					if(fa.power<Molpy.faCosts.length)
					{
						if(bots>=Molpy.faCosts[fa.power])
						{
							str+='<br><input type="Button" value="Trade" onclick="Molpy.UpgradeFactoryAutomation()"></input> '+Molpify(Molpy.faCosts[fa.power],1)+' NewPixBots to upgrade Factory Automation.';
						}else{
							str+='<br>The next Factory Automation upgrade requires '+Molpify(Molpy.faCosts[fa.power],1)+' NewPixBots';
						}
					}
				}
				if(!Molpy.Boosts['Ninja Climber'].unlocked&&Molpy.Got('Skull and Crossbones')&&Molpy.SandTools['Ladder'].amount>=500)
				{
						str+='<br><input type="Button" value="Trade" onclick="Molpy.UnlockNinjaClimber()"></input> 500 Ladders to unlock Ninja Climber.';
				}
				if(Molpy.Has('GlassBlocks',800)&&!Molpy.Got('Caged Logicat')&&Molpy.Has('Logicat',5))
				{
					if(Molpy.Has('GlassBlocks',1000))
					{
						str+= '<br><input type="Button" value="Pay" onclick="Molpy.BuyGlassBoost(\'Caged Logicat\',0,1000)"></input> '+Molpify(1000)+' Blocks to get a Caged Logicat';
					}else{
						str+='<br>It costs '+Molpify(1000)+' Glass Blocks to get a Caged Logicat.';
					}
				}
				if(Molpy.Has('GlassChips',12500)&&Molpy.Has('GlassBlocks',2500)&&!Molpy.Got('Camera'))
				{
					if(Molpy.Has('GlassChips',25000)&&Molpy.Has('GlassBlocks',5000))
					{
						str+= '<br><input type="Button" value="Pay" onclick="Molpy.BuyGlassBoost(\'Camera\',25000,5000)"></input> '+Molpify(25000)+' Chips and '+Molpify(5000)+' Blocks to get a Camera';
					}else{
						str+='<br>It costs '+Molpify(25000)+' Glass Chips and '+Molpify(5000)+' Glass Blocks to get a Camera.';
					}
				}
				var s = Molpy.GetBlackprintSubject();
				if(s && !Molpy.Got('CfB'))
				{
					var c = Molpy.blackprintCosts[s];
					if(!Molpy.Got('AE'))c=Math.min(c,40);
					str+='<br><input type="Button" value="Start" onclick="Molpy.StartBlackprintConstruction()"></input> construction of '+Molpy.Boosts[Molpy.GetBlackprintSubject()].name+' from Blackprints (requires '+Molpify(c*10)+' runs of Factory Automation)';
				}
			}
			return str;
		}, sand:'0.9P',castles:'32T',icon:'rosetta',group:'bean',
		classChange:function()
		{
			var oldClass=this.className;
			var newClass = '';
			var fa = Molpy.Boosts['Factory Automation'];
			var bots=Molpy.CastleTools['NewPixBot'].amount;
			if(!Molpy.Got('Panther Salve')&&Molpy.Has('GlassBlocks',250)
				||fa.bought&&Molpy.Got('Doublepost')&&fa.power<Molpy.faCosts.length&&bots>=Molpy.faCosts[fa.power]
				||!Molpy.Boosts['Ninja Climber'].unlocked&&Molpy.Got('Skull and Crossbones')&&Molpy.SandTools['Ladder'].amount>=500
				||Molpy.Has('GlassBlocks',800)&&!Molpy.Got('Caged Logicat')&&Molpy.Has('Logicat',5)
				||Molpy.Has('GlassChips',12500)&&Molpy.Has('GlassBlocks',2500)&&!Molpy.Got('Camera')
				||Molpy.GetBlackprintSubject()&&!Molpy.Got('CfB')
			)
				newClass='action';
			if(newClass!=oldClass)
			{
				this.className=newClass;
				return 1;
			}
		}
	});
	Molpy.UpgradeFactoryAutomation=function()
	{	
		var fa = Molpy.Boosts['Factory Automation'];
		var bots=Molpy.CastleTools['NewPixBot'].amount;
		if(fa.bought && Molpy.Got('Doublepost'))
		{
			if(fa.power<Molpy.faCosts.length&&bots>=Molpy.faCosts[fa.power])
			{
				Molpy.CastleTools['NewPixBot'].amount-=Molpy.faCosts[fa.power];
				Molpy.CastleToolsOwned-=Molpy.faCosts[fa.power];
				Molpy.CastleTools['NewPixBot'].Refresh();
				fa.power++;		
				fa.Refresh();
				Molpy.Boosts['Rosetta'].Refresh();
				Molpy.Notify('Factory Automation Upgraded',1);
				_gaq&&_gaq.push(['_trackEvent','Boost','Upgrade',fa.name]);	
			}
		}
	}
	Molpy.UnlockNinjaClimber=function()
	{	
		var lads=Molpy.SandTools['Ladder'];
		if(!Molpy.Boosts['Ninja Climber'].unlocked&&Molpy.Got('Skull and Crossbones')&&lads.amount>=500)
		{
			lads.amount-=500;
			Molpy.SandToolsOwned-=500;
			lads.Refresh();
			Molpy.UnlockBoost('Ninja Climber');			
			Molpy.Boosts['Rosetta'].Refresh();
		}
		
	}
	new Molpy.Boost({name:'Panther Salve',
		desc:function(me)
		{
			var str='"It\'s some kind of paste."<br>Not Lucky gets a cumulative 1% bonus from each item owned, at a cost of 10 Glass Blocks per use.<br>Also unlocks some additional boosts with use.'
			if(me.bought)
			{
				str+='<br><input type="Button" onclick="Molpy.GenericToggle('+me.id+',1)" value="'
					+(me.IsEnabled? 'Dea':'A')+'ctivate"></input>';	
			}
			if(Molpy.Got('Panther Glaze')) str+='<br>Panther Glaze causes this to produce '+Molpify(1000)+' Glass Chips';
			return str;
		},IsEnabled:Molpy.BoostFuncs.PosPowEnabled,buyFunction:function(){this.IsEnabled=1;},
	stats:function(me)
	{
		var str ='Not Lucky\'s reward is 1% higher for every Tool, Boost, and Badge owned. Consumes 10 Glass Blocks per use.';
		var acPower = Math.abs(me.power);
		if(acPower <=200)
			str+='<br>Speed is at '+acPower+' out of 200';
		else if(acPower<=500)
			str+='<br>Speed is at '+acPower+' out of 500';
		else if(acPower<=800)
			str+='<br>Speed is at '+acPower+' out of 800';
		else if(acPower<=1200)
			str+='<br>Speed is at '+acPower+' out of 1200';
		return str;
	}
	,group:'bean',className:'toggle',icon:'panthersalve'});
		
	new Molpy.Boost({name:'Castle Crusher',desc:'<input type="Button" value="Crush" onclick="Molpy.CastleCrush()"></input> half your castles back into sand. (One use.)',
	sand:function(){
		return (Molpy.Boosts['Castle Crusher'].power+1)*120+'M';
	},castles:function(){
		return (Molpy.Boosts['Castle Crusher'].power+1)*380+'M';
	},icon:'castlecrusher',className:'action'});
	
	Molpy.CastleCrush=function()
	{
		Molpy.Boosts['Castle Crusher'].buy();
		if(!Molpy.Boosts['Castle Crusher'].bought)
		{
			Molpy.Notify('What a pity!');
			return;
		}
		var c = Math.floor(Molpy.castles/2);
		Molpy.Destroy('Castles',c);
		if(Molpy.Got('Blitzing'))c*=8;
		Molpy.Dig(c);
		Molpy.Boosts['Castle Crusher'].power++;
		Molpy.LockBoost('Castle Crusher');
	}
	
	new Molpy.Boost({name:'Furnace Crossfeed',
		desc:function(me)
		{
			if(!me.bought) return 'Blast Furnace acts as a Glass Furnace instead of its previous purpose, only if Glass Furnace is active.';
			return (me.IsEnabled?'':'When activated, ')+'Blast Furnace acts as a Glass Furnace instead of its previous purpose, only if Glass Furnace is active.<br><input type="Button" onclick="Molpy.GenericToggle('+me.id+')" value="'+(me.IsEnabled? 'Dea':'A')+'ctivate"></input>';
		},IsEnabled:Molpy.BoostFuncs.BoolPowEnabled,sand:'6.5G',castles:'.8G',icon:'furnacecrossfeed',group:'hpt',className:'toggle',
		buyFunction:function(){this.IsEnabled=1;}
	});
	
	new Molpy.Boost({name:'Redundant Redundance Supply of Redundancy',alias:'RRSR',
	desc:'The Department of Redundancy Department announces: You have exceeded your daily redundancy limit. Your primary redundancy supply will now be turned down. You can always switch to your redundant redundance supply of redundancy.',
	stats: Molpy.redactedWords+' appear more often, but they are rare until you buy this.',sand:'42G',castles:'4.2G',buyFunction:Molpy.RandomiseRedactedTime,icon:'redred',group:'hpt',lockFunction:function(){Molpy.Notify('Primary Redundancy Supply Reengaged',1);}});
	
	new Molpy.Boost({name:'Flying Buckets',desc:'Sand rate of Buckets is multiplied by the number of Trebuchets you own. Trebuchets produce ten times as many Castles.',sand:'120G',castles:'2T'});
	new Molpy.Boost({name:'Human Cannonball',desc:'Sand rate of Cuegan is multiplied by two times the number of Trebuchets you own. Trebuchets produce ten times as many Castles.',sand:'240G',castles:'4T'});
	new Molpy.Boost({name:'Fly the Flag',desc:'Sand rate of Flags is multiplied by ten times the number of Trebuchets you own. Trebuchets produce ten times as many Castles.',sand:'360G',castles:'6T'});
	new Molpy.Boost({name:'Up Up and Away',desc:'Sand rate of Ladders is multiplied by ten times the number of Trebuchets you own. Trebuchets produce ten times as many Castles.',sand:'480G',castles:'8T'});
	new Molpy.Boost({name:'Air Drop',desc:'Bags produce five times as much Sand. Trebuchets produce fifty times as many Castles.',sand:'1.2T',castles:'24T'});
	new Molpy.Boost({name:'Schizoblitz',desc:'Double Blitzing speed',sand:'200T',castles:'368G',icon:'schizoblitz'});
	new Molpy.Boost({name:'Redunception',
		desc:function(me)
		{
			if(!me.bought||flandom(10)==0) return Molpy.redundancy.longsentence;
			var sent = Molpy.redundancy.sentence();
			if(!Molpy.Boosts['Expando'].IsEnabled)
				Molpy.Notify(sent,1);
			return sent;
		}
		,sand:'.97G',castles:'340M',stats:'Causes the effect which results from Redunception',icon:'redunception',group:'hpt'});
		
	new Molpy.Boost({name:'Furnace Multitasking',
	desc:function(me)
		{
			if(!me.bought) return 'Blast Furnace acts as a Glass Blower instead of its previous purpose, only if Glass Blower is active. (This stacks with Furnace Crossfeed)';
			return (me.IsEnabled?'':'When activated, ')+'Blast Furnace acts as a Glass Blower instead of its previous purpose, only if Glass Furnace is active.<br><input type="Button" onclick="Molpy.GenericToggle('+me.id+')" value="'
				+(me.IsEnabled? 'Dea':'A')+'ctivate"></input> (This stacks with Furnace Crossfeed)';
		},IsEnabled:Molpy.BoostFuncs.BoolPowEnabled,sand:'48G',castles:'1.2G',icon:'furnacemultitask',group:'hpt',className:'toggle',
		buyFunction:function(){this.IsEnabled=1;}
	});
	
	Molpy.redundancy=MakeRedundancy();
	
	new Molpy.Boost({name:'Free Advice',
		desc:function(me)
		{
			if(Molpy.Got('Tool Factory'))
			{
				var str='';
				if(!Molpy.Got('Sand to Glass')) str+= 'To unlock Sand to Glass you need 7470 Buckets and an infinite Sand dig rate.<br>';
				if(!Molpy.Got('Castles to Glass')) str+= 'To unlock Castles to Glass you need 1515 NewPixBots and infinite Castles.<br>';
				if(!Molpy.Got('Lucky Twin')) str+= 'Lucky Twin unlock is at '+Molpify(Molpy.Boosts['Lucky Twin'].power)+' out of '+Molpify(13*13)+'.<br>';
				if(str)return str+'(The "to Glass" boosts unlock when you load the Tool Factory with chips, if you meet the requirements.)';
			}
			if(Molpy.Got('AA')&&!Molpy.Got('AC')&&Molpy.CastleTools['NewPixBot'].amount>=7500)
			{
				return 'Logicat Level required for Automata Control: '+Molpify(440*50000/Molpy.CastleTools['NewPixBot'].amount,3);
			}
			if(Molpy.GlassCeilingCount()&&!Molpy.Earned('Ceiling Broken'))
			{
				return 'To Lock or Unlock a Glass Ceiling Boost, the previous numbered Glass Ceiling Boost must be owned and all lesser numbered Glass Ceiling Boosts must not be owned.';
			}
			return 'Hindsight'+(me.bought?' is 20/20':'');
		},
		stats:function(me)
		{
			return (me.bought?'Check back from Time to Time and you may find some advice':'Hindsight');
		},
		sand:'400P',castles:'400P'});
	
	new Molpy.Boost({name:'Broken Bottle Cleanup',alias:'BBC',
		desc:function(me)
		{
			var str =  'All Sand Tools produce 20x Sand at a cost of 5 Glass Blocks per NP';
			if(me.bought) str+='<br>'
				+(me.power>0?'Active during this NP.<br><input type="Button" value="Disable" onclick="Molpy.ToggleBBC()"></input>'
				:(me.power==0?'Inactive. May activate on the next ONG if 5 Glass Blocks are available.'
				:'Disabled. When enabled, will do nothing until the next ONG.<br><input type="Button" value="Enable" onclick="Molpy.ToggleBBC()"></input>'));
			return str;
		}
		,stats:function(me)
		{
			return me.desc(me)+'<br>(Also may have reduced price of MHP.)';
		}
		,sand:'5P',castles:'10P',glass:'500',className:'toggle',icon:'bbc'});
		
	Molpy.ToggleBBC=function()
	{
		var me = Molpy.Boosts['BBC'];
		if(me.power<0)me.power=0;
		else me.power=-1;
		me.Refresh();
		Molpy.recalculateDig=1;
		_gaq&&_gaq.push(['_trackEvent','Boost','Toggle',me.name]);	
	}
	Molpy.BBC=function()
	{
		var m = 1;
		if(Molpy.Got('BBC')&&Molpy.Boosts['BBC'].power>0)
		{
			m=20;
			m*=Math.pow(200,Molpy.Boosts['RB'].bought);
		}
		return m;
	}
	
	Molpy.glassCeilingPriceIncs=[1.1,1.25,1.6,2,2,2,2,2,2,2,1,1];
	Molpy.glassCeilingDescText=['Sand rate of Buckets','Castles produced by NewPixBots','Sand rate of Cuegan',
		'Castles produced by Trebuchets','Sand rate of Flags','Castles produced by Scaffolds',
		'Sand rate of Ladders','Castles produced by Waves','Sand rate of Bags','Castles produced by Rivers'];
	
	Molpy.MakeGlassCeiling=function(i)
	{	
		new Molpy.Boost({name:'Glass Ceiling '+i, desc:'Multiplies '+Molpy.glassCeilingDescText[i]
			+' by 33 per Glass Ceiling.<br><input type="Button" value="Lock" onclick="Molpy.CeilingLock('+i+')"></input>',
			sand: function(me){ return 6*Math.pow(1000,me.num+1)*Math.pow(Molpy.glassCeilingPriceIncs[me.num],me.power)},
			castles: function(me){ return 6*Math.pow(1000,me.num+1)*Math.pow(Molpy.glassCeilingPriceIncs[me.num],me.power)},
			glass: 50* (+i+1), group:'ceil',
			buyFunction:function(){
				if(Molpy.Earned('Ceiling Broken'))
					this.power=0;
				else
					this.power++;
				Molpy.shopRepaint=1;
				Molpy.GlassCeilingUnlockCheck();
			},
			lockFunction:function(me)
			{
				Molpy.shopRepaint=1;
				Molpy.GlassCeilingUnlockCheck();
			},icon:'glassceiling'+i
		});
		Molpy.Boosts['Glass Ceiling '+i].num=parseInt(i);
	}
	for(var i in Molpy.glassCeilingDescText)
	{
		Molpy.MakeGlassCeiling(i);
	}
	
	Molpy.GlassCeilingCount=function()
	{
		var c = 0;
		var i = 12;
		while(i--)
		{
			if(Molpy.Got('Glass Ceiling '+i)) c++;
		}
		if(c>=10)Molpy.EarnBadge('Ceiling Broken');
		if(c>=12)Molpy.EarnBadge('Ceiling Disintegrated');
		return c;
	}
	Molpy.GlassCeilingMult=function()
	{
		var acPower = 33;
		if(Molpy.Got('WWB'))
		{
			acPower*=Math.pow(2,Molpy.Boosts['WWB'].bought-5)*Molpy.CastleTools['Scaffold'].amount;
		}
		return Math.pow(acPower,Molpy.GlassCeilingCount());
	}
	
	Molpy.CeilingLock=function(key)
	{
		if(!Molpy.Earned('Ceiling Broken'))
		{
			if(!Molpy.Got('Glass Ceiling '+key))
			{
				Molpy.Notify('Nope.avi');
				return;
			}
			var acPower = key-1;
			if(acPower>=0&&!Molpy.Got('Glass Ceiling '+acPower))
			{
				Molpy.Notify('You need to own Glass Ceiling '+acPower+' before you can Lock Glass Ceiling '+key,1);
				return;
			}
			while(acPower--)
			{
				if(acPower<0) break;
				if(Molpy.Got('Glass Ceiling '+acPower))
				{
					Molpy.Notify('You need to Lock Glass Ceiling '+acPower+' before you can Lock Glass Ceiling '+key,1);
					return;				
				}
			}
		}else
		{
			if(!Molpy.Got('Tool Factory'))
				Molpy.Notify('The point of that was what exactly?');
		}
		Molpy.LockBoost('Glass Ceiling '+key);
	}
	
	Molpy.GlassCeilingUnlockCheck=function()
	{
		var i = 10;
		while(i--)
		{
			var me = Molpy.Boosts['Glass Ceiling '+i];
			if(!me.bought)
			{
				if(!Molpy.Earned('Ceiling Broken'))
				{
					if(Molpy.CeilingTogglable(i))
					{
						if(!me.unlocked)Molpy.UnlockBoost(me.name);
					}else{
						if(me.unlocked)Molpy.LockBoost(me.name);
					}
				}
			}
			if(me.unlocked)
			{
				if(Molpy.CeilingClass(me,i)) Molpy.boostRepaint=1;
			}
		}
	}
	
	Molpy.CeilingTogglable=function(key)
	{	
		var acPower = key-1;
		if(acPower<0||Molpy.Got('Glass Ceiling '+acPower))
		{
			while(acPower--)
			{
				if(acPower<0) return 1;
				if(Molpy.Got('Glass Ceiling '+acPower))
				{
					return 0;					
				}
			}
		}else{
			return 0;
		}
		return 1;
	}
	
	Molpy.CeilingClass=function(me,key)
	{
		var oldClass=me.className;
		var newClass=Molpy.Earned('Ceiling Broken')?'':(Molpy.CeilingTogglable(key)?'action':'alert');
		if(newClass!=oldClass)
		{
			me.className=newClass;
			return 1;
		}
	}
	new Molpy.Boost({name:'Sand Tool Multi-Buy',desc:'Allow buying of multiple sand tools at once'
		,sand:'200K',castles:'6502',stats:'Code for this feature supplied by waveney',icon:'sandmultibuy'
	});
	new Molpy.Boost({name:'Castle Tool Multi-Buy',desc:'Allow buying of multiple castle tools at once'
		,sand:'2000K',castles:'68020',stats:'Code for this feature supplied by waveney',icon:'castlemultibuy'
	});
	new Molpy.Boost({name:'Run Raptor Run',alias:'RRR',
		desc:function(me)
		{
			var inf=!isFinite(Molpy.castles);
			var str='Multiplies Not Lucky bonus by '+Molpify(10000)+(inf?'':' at a cost of 30 Glass Blocks per use');
			if(me.bought)
			{
				str+='<br><input type="Button" onclick="Molpy.GenericToggle('+me.id+')" value="'
					+(me.IsEnabled? 'Dea':'A')+'ctivate"></input>';	
			}
			if(Molpy.Got('Panther Glaze')) str+='<br>Panther Glaze causes this to produce '+Molpify(3000)+' Glass Chips';
			return str;
		},
		IsEnabled:Molpy.BoostFuncs.BoolPowEnabled,
		buyFunction:function(){this.IsEnabled=1;},
		sand:'180E',castles:'380E',glass:2500,group:'bean',className:'toggle',icon:'rrr'
	});	
	new Molpy.Boost({name:'Ninja Climber',desc:'Multiplies Ninja Builder\'s Castle output by the number of Ladders owned, and the Sand dug by Ladders by the Ninja Stealth level'
		,sand:'490P',castles:'670P',glass:1500,group:'ninj',icon:'ninjaclimber'
	});
	new Molpy.Boost({name:'Phonesaw',desc:'I saw what you did there. Or heard.',stats:'Squares the reward from VITSSÅGEN, JA!'
		,sand:'48E',castles:'38E',glass:100,group:'hpt',icon:'phonesaw'
	});
	new Molpy.Boost({name:'Logicat',
		Level:[function(){return this.bought;},
			function(amount)
			{
				var dif = amount-this.bought;
				this.bought=amount;
				this.power+=dif*5;
				this.Refresh();
			}],
		Add:function(levels,points)
		{
			if(levels>0)this.Level+=levels;
			if(points>0)
			{
				this.power+=points;
				while(this.power>=this.bought*5)
				{
					Molpy.RewardLogicat(this.Level);
					this.bought++;
				}
				this.Refresh();
			}
		},
		Has:function(amount){return (this.Level>=amount+1)*1;},
		Spend:Molpy.BoostFuncs.Spend,
		Destroy:function(levels,points)
		{
			if(levels>0)this.Level-=levels;
			if(points>0)
			{
				this.power-=points;
				this.Refresh();
			}
		},
		desc:function(me)
		{
			var ans=Math.ceil((me.bought*5-Math.floor(me.power))/(1+Molpy.Level('Panther Rush')/2));
			return 'Statement A: Statement A is true.<br><br>Logicat Level is: '+Molpify(me.bought,1)
				+'.<br>Needs '+ans+' correct answer'+plural(ans)+' to level up.';
		}
		,sand:'55E',castles:'238E',glass:100,group:'stuff',icon:'logicat'
	});
	new Molpy.Boost({name:'Temporal Duplication',alias:'TDE',desc:
		function(me)
		{
			var tdf=Molpy.TDFactor()-1;
			return 'For '+(me.countdown==0?'ever':me.countdown>=1000?Molpify(me.countdown/1000)+'NP':Molpify(me.countdown)+'mNP')+', when you buy tools, get '+(tdf==1?'the same':Molpify(tdf,1)+'x that')+' amount again for free!';
		}
		,group:'chron',className:'alert',logic:50,
		startCountdown:function()
		{
			return 5*(1+Molpy.Got('Crystal Dragon'))*!Molpy.Earned('Never Alone');
		}
		,stats:'Also causes a double Not Lucky glass bonus during Temporal Duplication'
		,countdownFunction:function(){			
			if(Math.round(this.countdown)==2)
			{
				Molpy.Notify('Temporal Duplication runs out in 2mNP!');
			}
		}
	});
	new Molpy.Boost({name:'Impervious Ninja',desc:
		function(me){
			if(me.power<=0)return '';
			return 'Provides Ninja Forgiveness, up to '+Molpify(me.power)+' time'+plural(me.power)+'.<br>This costs 1% of your Glass Chips in storage, with a minimum payment of 100 Chips.';
		}
		,group:'ninj',logic:2,startPower:function()
		{
			return Math.floor(Math.min(50, Molpy.LogiMult(.5)+Molpy.ONGelapsed/(Molpy.NPlength*1000)));
		}
		,className:'alert',icon:'impninja'
	});
	new Molpy.Boost({name:'Factory Ninja',desc:
		function(me){return 'The next '+me.power+' Ninja Builder'+plural(me.power)+' will activate Factory Automation';}
		,group:'ninj',logic:3,className:'alert',startPower:function()
		{
			return Math.ceil(Molpy.Level('Logicat')/5)
		}
	});
	new Molpy.Boost({name:'Logicastle',desc:'The Castle outputs of Castle Tools are boosted by 50% cumulatively per Logicat Level'
		,group:'bean',logic:2,sand:'420Z',castles:'850Z',glass:300,icon:'logicastle'
	});
	Molpy.LogicastleMult=function()
	{
		if(Molpy.Got('Logicastle'))return Math.pow(1.5,Molpy.Level('Logicat'));
		return 1;
	}
	new Molpy.Boost({name:'Flux Surge',desc:
		function(me){return 'Increases the effect of Flux Turbine for the next '+Molpify(me.countdown,3)+'mNP';}
		,group:'chron',startCountdown:function()
		{
			return Math.min(12500, Molpy.LogiMult(80));
		}
		
	});
	new Molpy.Boost({name:'Locked Crate',
		desc:function(me){
			if(!me.bought) return 'Contains Loot';
			return (5-me.bought)+' lock'+plural(5-me.bought)+' left<br><input type="Button" value="Smash" onclick="Molpy.LockBoost(\'Locked Crate\')"></input> it open to grab the loot!'
		},
		sand:function(me){ return me.power;},
		castles:function(me){ return me.power;},
		glass:15,className:'action',icon:'lockedcrate',
		unlockFunction:function()
		{
			this.power = Molpy.castles*6+Molpy.sand;
		},
		lockFunction:function()
		{
			var bl=Molpy.Boosts['GlassBlocks'];
			var win = Math.ceil(Molpy.LogiMult('2K'));
			win = Math.floor(win/(6-this.bought));
			
			if(bl.bought*50<bl.power+win)bl.bought=Math.ceil((bl.power+win)/50); //make space!
			Molpy.Add('GlassBlocks',win);
			Molpy.Notify('+'+Molpify(win,3)+' Glass Blocks!');
			if(Molpy.Got('Camera'))
				Molpy.EarnBadge('discov'+Math.ceil(Molpy.newpixNumber*Math.random()));
			Molpy.Add('Blackprints',this.bought);
				
		}
	});
	new Molpy.Boost({name:'Crate Key',desc:'Quarters the price of Locked Crate',stats:'Quarters the price of Locked Crate, and does something else if you have already bought Locked Crate.'
		,glass:function()
		{return Molpy.LogiMult(20);},
		buyFunction:function()
		{
			Molpy.LockBoost(this.alias);
			var lc = Molpy.Boosts['Locked Crate'];
			if(!lc.unlocked)
			{			
				if(!Molpy.Got('The Key Thing'))
					Molpy.Notify('Well, that was a waste');
				else
					Molpy.UnlockBoost(lc.alias);
				return;
			}
			lc.buy();
			if(lc.bought)
			{
				lc.bought++;
				if(lc.bought<5)
				{
					if(!Molpy.boostSilence)Molpy.Notify('One less lock on the crate');
				}
				else
					Molpy.LockBoost(lc.alias);
			}else{
				lc.power/=4;
				lc.buy();
			}
		}
	});
	new Molpy.Boost({name:'Technicolour Dream Cat',desc:Molpy.redactedWords+' are multicoloured (if Chromatic Heresy is enabled)',
		sand:'320K',castles:'90K',glass:10,icon:'dreamcat'});
		
		
	Molpy.GlassExtruderUpgradeCost=function()
	{
		return 2000+(500*Molpy.Boosts['Glass Extruder'].power);
	}
	Molpy.UpgradeGlassExtruder=function()
	{
		if(Molpy.Has('GlassChips',Molpy.GlassExtruderUpgradeCost()))
		{
			Molpy.Spend('GlassChips',Molpy.GlassExtruderUpgradeCost());
			Molpy.Boosts['Glass Extruder'].power++;
			Molpy.recalculateDig=1;
			Molpy.Notify('Glass Extruder upgraded',1);
			_gaq&&_gaq.push(['_trackEvent','Boost','Upgrade','Glass Extruder']);	
		}
	}
	new Molpy.Boost({name:'Glass Extruder',
		desc:function(me)
		{
			var cost = Molpy.GlassExtruderUpgradeCost();
			var str = 'Glass Blower\'s sand use is divided by '+Molpify(me.power+2,3);
			if(!isFinite(me.power))return str;
			if(Molpy.Has('GlassChips',cost-800))
			{
				if(Molpy.Has('GlassChips',cost))
				{
					str+='.<br><input type="Button" value="Pay" onclick="Molpy.UpgradeGlassExtruder()"></input> '+Molpify(cost,3)
						+ ' Glass Chips to increase this by 1.';
						
					if (Molpy.Got('Seaish Glass Blocks'))
					{
						str += '<br><input type="Button" value="Seaish Upgrade" onclick="Molpy.SeaishGlassExtruder()"></input>';
					}
				}else{
					str+='.<br>It costs '+Molpify(cost,3)+ ' Glass Chips to increase this by 1.';				
				}
			}
			return str;
		}
		,className:'action',group:'hpt',icon:'glassextruder'}
	);
	
	new Molpy.Boost({name:'Caged Logicat',
		Level:Molpy.BoostFuncs.Bought1Level,
		Has:Molpy.BoostFuncs.Has,
		Spend:Molpy.BoostFuncs.Spend,
		Add:Molpy.BoostFuncs.Add,
		desc: function(me)
		{
			var str='';
			if(Molpy.cagedPuzzleValue)
			{
				return Molpy.cagedPuzzleValue;
			}else if(me.Has(1)){
				var cost=100+Molpy.LogiMult(25);
				if(Molpy.Has('GlassBlocks',cost))
					str= '<input type="Button" value="Pay" onclick="Molpy.MakeCagedPuzzle('+cost+')"></input> '+Molpify(cost,3)+' Glass Blocks for a puzzle.<br>'+Molpify(me.Level)+' Puzzle'+plural(me.Level)+' left.';
				else str= 'It costs '+Molpify(cost,3)+' Glass Blocks for a puzzle.';
			}else{
				str= 'Caged Logicat is sleeping. Please wait for it.'
			}
			if(Molpy.Got('ZK'))
			{	
				str+='<br>Zookeeper is at '+Molpify(Molpy.Boosts['ZK'].power/10)+'%.';
			}
			return str;
		}
		,group:'bean',className:'action',icon:'cagedlogicat',
		buyFunction:function()
		{
			this.Level=10;
		},classChange:
		function()
		{
			var oldClass=this.className;
			var newClass = this.Has(1)?'action':'';
			if(newClass!=oldClass)
			{
				this.className=newClass;
				return 1;
			}
		},
		refreshFunction:function()
		{
			Molpy.ChainRefresh('ShadwDrgn');
		}
	});	

	Molpy.cagedSGen=InitStatementGen();
	Molpy.MakeCagedPuzzle=function(cost)
	{
		if(Molpy.Has('GlassBlocks',cost))Molpy.Spend('GlassBlocks',cost);
		
		Molpy.cagedSGen.FillStatements(0,Molpy.Level('Logicat'));
		Molpy.cagedPuzzleTarget=Molpy.cagedSGen.RandStatementValue();
		var str='Click a statement that is '+Molpy.cagedPuzzleTarget+':';
		var statements= Molpy.cagedSGen.StringifyStatements('Molpy.ClickCagedPuzzle');
		for(var i in statements)
		{
			str+='<br><br>'+statements[i];
		}
		Molpy.cagedPuzzleValue=str;
		Molpy.Boosts['Caged Logicat'].Refresh();
		Molpy.cagedSGen.firstTry=1;
	}
	Molpy.ClickCagedPuzzle=function(name)
	{
		if(!Molpy.cagedPuzzleValue)
		{
			Molpy.Destroy('Logicat',1);
			Molpy.Spend('Caged Logicat',1);
			return;			
		}
		var skip=0;
		if(!Molpy.cagedSGen.firstTry)
		{
			if(Molpy.Has('GlassBlocks',50))
			{
				Molpy.Spend('GlassBlocks',50);
			}else{
				Molpy.Notify('You can\'t afford a seccond try.');
				skip=1;
			}
		}
		
		if(!skip)
		{
			var clickedVal=Molpy.cagedSGen.StatementValue(name);
			if(clickedVal==Molpy.cagedPuzzleTarget)
			{
				Molpy.Notify('Correct',1);
				Molpy.Add('Logicat',0,1+Molpy.Level('Panther Rush')/2);
			}
			else
			{
				Molpy.Notify('Incorrect',1);
				
				if(Molpy.cagedSGen.firstTry&&Molpy.Got('Second Chance')&&Molpy.Has('GlassBlocks',50))
				{
					Molpy.cagedSGen.firstTry=0;
					Molpy.Notify('Try Again');
					return;
				}
				Molpy.Destroy('Logicat',0,0.5+Molpy.Level('Panther Rush')/2);
			}
		}
		Molpy.cagedPuzzleValue='';
		Molpy.cagedPuzzleTarget='';
		Molpy.Spend('Caged Logicat',1);
	}
	
	new Molpy.Boost({name:'Second Chance',desc:'If you answer a Logicat Puzzle incorrectly, you get a second attempt at it and don\'t lose half a Logicat point. (Uses 50 Glass Blocks)',
		sand:'250Y',castles:'87Y',group:'bean',logic:5,icon:'secondchance'});
	
	new Molpy.Boost({name:'Let the Cat out of the Bag',alias:'LCB',
		desc:function(me)
		{
			var inf=!isFinite(Molpy.castles);
			var str='Not Lucky reward gains 1% per two Ladders and Bags owned, at a cost of '+(inf?'1 Ladder and 1 Bag':'70 Glass Blocks (or 1 Ladder and 1 Bag)')+' per use.'
			if(me.bought)
			{
				str+='<br><input type="Button" onclick="Molpy.GenericToggle('+me.id+')" value="'
					+(me.IsEnabled? 'Dea':'A')+'ctivate"></input>';	
			}
			if(Molpy.Got('Panther Glaze')) str+='<br>Panther Glaze causes this to produce '+Molpify(700)+' Glass Chips';
			return str;
		},
		IsEnabled:Molpy.BoostFuncs.BoolPowEnabled,
		buyFunction:function(){this.IsEnabled=1;},
		stats:'At a cost of 35 Glass Blocks, multiplies Not Lucky by 1.01 for each pair of Ladders, then at a cost of 35 Glass Blocks, multiplies Not Lucky by 1.01 for each pair of Bags. If 35 Glass Blocks are not available each time (or if you have infinite Castles), a Ladder/Bag is consumed before multiplying',
		sand:'750U',castles:'245U',glass:'1200',className:'toggle',group:'bean',icon:'lcb'
	});
	
	new Molpy.Boost({name:'Catamaran',
		desc:function(me)
		{
			var inf=!isFinite(Molpy.castles);
			var str='Not Lucky reward gains 1% 6 times per Wave and River owned, at a cost of '+(inf?'1 Wave and 1 River':'90 Glass Blocks (or 1 Wave and 1 River)')+' per use.'
			if(me.bought)
			{
				str+='<br><input type="Button" onclick="Molpy.GenericToggle('+me.id+')" value="'
					+(me.IsEnabled? 'Dea':'A')+'ctivate"></input>';	
			}
			if(Molpy.Got('Panther Glaze')) str+='<br>Panther Glaze causes this to produce '+Molpify(9000)+' Glass Chips';
			return str;
		},
		IsEnabled:Molpy.BoostFuncs.BoolPowEnabled,
		buyFunction:function(){this.IsEnabled=1;},
		stats:'At a cost of 45 Glass Blocks, multiplies Not Lucky by 1.01 6 times for each Wave, then at a cost of 45 Glass Blocks, multiplies Not Lucky by 1.01 6 times for each River. If 45 Glass Blocks are not available each time (or if you have infinite Castles), a Wave/River is consumed before multiplying.',
		sand:'750S',castles:'245S',glass:'4800',className:'toggle',group:'bean',icon:'catamaran'
	});

	
	new Molpy.Boost({name:'Redundant Raptor',
		desc:function(me)
		{
			var inf=!isFinite(Molpy.castles);
			var str='Not Lucky reward gains 1% per '+Molpy.redactedWord+' click'+(inf?'':', at a cost of 120 Glass Blocks per use.');
			
			if(me.bought)
			{
				str+='<br><input type="Button" onclick="Molpy.GenericToggle('+me.id+')" value="'
					+(me.IsEnabled? 'Dea':'A')+'ctivate"></input>';	
			}
			if(Molpy.Got('Panther Glaze')) str+='<br>Panther Glaze causes this to produce '+Molpify(12000)+' Glass Chips';
			return str;
		},
		IsEnabled:Molpy.BoostFuncs.BoolPowEnabled,
		buyFunction:function(){this.IsEnabled=1;},
		stats:'At a cost of 120 Glass Blocks, multiplies Not Lucky by 1.01 twice for each '+Molpy.redactedWord+' click<br>The cost is waived if you have infinite Castles, since this this boost would have no effect in that circumstance',
		sand:'930PW',castles:'824PW',glass:'4800',className:'toggle',group:'bean',icon:'redundaraptor'
	});
	
	new Molpy.Boost({name:'Camera',desc:function(me)
	{
		var str ='"<b>THIS DEVICE <i>MECHANISM</i> IS <i>OBSCURE</i> UNKNOWN</b>"';
		if(me.bought)
		{
			str+= '<br><input type="Button" onclick="Molpy.Shutter()" value="Snap!"></input> (Uses 10 Glass Chips)';
		}
		return str;
	},
		className:'action',group:'bean',icon:'camera'
	});
	
	new Molpy.Boost({name:'Memories Revisited',desc:'Allows you to quickly jump in Time to Discoveries you have made.',
		sand:'50P',castles:'20P',glass:'20K',group:'chron'
	});
	
	new Molpy.Boost({name:'Blackprints',
		
		Level:Molpy.BoostFuncs.PosPowerLevel,
		Has:function(n,all)
		{
			if(all)return n<=0||this.Level>=n;
			var pages = this.Level;
			if(pages<1)return 0;
			if(this.bought)
			{
				var s = Molpy.GetBlackprintSubject();
				if(s) pages-=Molpy.blackprintCosts[s];
			}
			return(pages>=n);
		},
		Add:function(n)
		{
			var target = Molpy.GetBlackprintPages();
			this.Level+=n;
			if(this.Has(9001,1))Molpy.EarnBadge('Scouter');
			if(!Molpy.boostSilence)
			{
				if(n==1)
					Molpy.Notify('You found a Blackprint page',1);
				else
					Molpy.Notify('You found '+n+' Blackprint pages',1);
			}else
			{
				if(this.Has(target,1) && !this.Has(target+n,1))
				{
					Molpy.Notify('You now have the '+target+' Blackprint pages you require.',1);
				}
				return;
			}
				
			if(!target)return;
				
			if(!this.Has(target,1))
				Molpy.Notify('You need '+Molpify(target-this.Level)+' more pages',1);
			else if (this.Has(target+1,1))
				Molpy.Notify('You have more pages than you need right now',1);
			else
				Molpy.Notify('You now have the '+target+' Blackprint pages you require.',1);
		},
		Spend:Molpy.BoostFuncs.Spend,
		Destroy:Molpy.BoostFuncs.Destroy,
		desc:function(me)
		{		
			var pBoost=Molpy.Boosts[Molpy.GetBlackprintSubject(1)];
			return 'Allows you to construct '+(pBoost?pBoost.name:'new Boosts')+' with Factory Automation.<br>You have '+Molpy.BlackprintReport();
		},
		stats:function(me)
		{
			return '(Or Blueprints if you\'re into Chromatic Heresy)<br>'+me.desc();
		}
		,sand:function(){return Molpy.LogiMult('80YW');},
		castles:function(){return Molpy.LogiMult('40YW');},
		glass:function(){return Molpy.LogiMult('25K');},
		lockFunction:function()
		{
			var s=Molpy.GetBlackprintSubject(1);
			if(!s)return;
			this.Spend(Molpy.blackprintCosts[s]);
			Molpy.UnlockBoost(s);
			Molpy.Boosts[s].buy();
			if(Molpy.Boosts[s].bought)
			{
				Molpy.Notify(Molpy.Boosts[s].name+' has been constructed',1);
			}else{
				Molpy.Notify(Molpy.Boosts[s].name+' has been constructed and is available for purchase',1);
			}
		},
		buyFunction:function()
		{
			Molpy.Notify('See Rosetta about your Blackprints',1);
			Molpy.Boosts['Rosetta'].Refresh();
		},
		group:'stuff',icon:'blackprints'
	});
	
	Molpy.BlackprintReport=function()
	{
		return 'Collected '+Molpify(+Molpy.Level('Blackprints')
			+ Molpy.Boosts['Milo'].power/100,3)+' of '+Molpify(Molpy.GetBlackprintPages() ||
				Molpy.Boosts['AC'].power*(Molpy.Boosts['Dragon Forge'].bought?10:2),1);
	}
	
	Molpy.LogiMult=function(s)
	{
		return DeMolpify(s+'')*Molpy.Boosts['Logicat'].bought;
	}
	Molpy.GetBlackprintPages=function()
	{
		for(var i in Molpy.blackprintOrder)
		{
			var print=Molpy.blackprintOrder[i];
			if(!Molpy.Boosts[print].unlocked)
			{
				if(print=='TFLL'&&!Molpy.Got('Tool Factory')) return 0;
				if(print=='CFT'&&!Molpy.Earned('Minus Worlds')) continue;
				if(print=='BoH'&&!Molpy.Has('Goats',400)) continue;
				if(print=='Nest'&&!Molpy.Got('DNS')) continue;
				return Molpy.blackprintCosts[print]; //number of pages needed for next blackprint boost
			}
		}
		return 0; //none needed at the moment
	}
	Molpy.GetBlackprintSubject=function(d)
	{
		if(!d&&!Molpy.Got('Blackprints'))return;
		if(Molpy.Level('Blackprints')<1)return;
		for(var i in Molpy.blackprintOrder)
		{
			var print=Molpy.blackprintOrder[i];
			if(!Molpy.Boosts[print].unlocked)
			{				
				if(print=='TFLL'&&!Molpy.Got('Tool Factory')) return;
				if(print=='CFT'&&!Molpy.Earned('Minus Worlds')) continue;
				if(print=='BoH'&&!Molpy.Has('Goats',400)) continue;
				if(print=='Nest'&&!Molpy.Got('DNS')) continue;
				if(Molpy.Level('Blackprints')>=Molpy.blackprintCosts[print])
					return print;
				return;
			}
		}
	}
	
	//if we have enough blackprint pages for next blackprint boost, allow it as a department reward
	Molpy.CheckBlackprintDepartment=function()
	{
		Molpy.Boosts['Blackprints'].department=0;
		var print=Molpy.GetBlackprintSubject(1);
		if(!print)return;
		var pboost=Molpy.Boosts[print];
		if(!pboost.unlocked)
		{
			 Molpy.Boosts['Blackprints'].department=1*(Molpy.Level('Blackprints')>=Molpy.blackprintCosts[print]); 
			 return;
		}
		
	}
	Molpy.StartBlackprintConstruction=function()
	{
		if(Molpy.Got('CfB'))return;
		Molpy.UnlockBoost('CfB')
	}
	Molpy.DoBlackprintConstruction=function(times)
	{
		var s = Molpy.GetBlackprintSubject();
		if(!s)
		{
			return times; //condition for subject no longer met!
		}
		var c = Molpy.blackprintCosts[s];
		if(c>Molpy.Level('Blackprints'))
		{//we used up some blackprints somehow!
			return times; //do nothing
		}
		var con=Molpy.Boosts['CfB'];
		con.power+=times;
		 
		if(!Molpy.Got('AE'))c=Math.min(c,40);
		if(con.power>=c*10)
		{
			var op = con.power;
			Molpy.LockBoost('CfB');
			return Math.max(0,times+op-c*10);
		}
		return 0;
	}
	new Molpy.Boost({name:'Constructing from Blackprints',alias:'CfB',
		desc:function(me)
		{
			var subj = Molpy.Boosts[Molpy.GetBlackprintSubject(1)];
			if(!subj)
			{
				Molpy.LockBoost('CfB');
				return 'Constructing nothing. How?';
			}
			var c = Molpy.blackprintCosts[subj.alias];
			if(!Molpy.Got('AE'))c=Math.min(c,40);
			str = 'Constructing '+subj.name+' from Blackprints.<br>'+Molpify(c*10-me.power)+' runs of Factory Automation required to complete.';
			if(subj.alias=='BoH')str+='<br>To construct Bag of Holding you must retain at least 400 goats, otherwise construction will stall.';
			return str;
		},
		unlockFunction:function()
		{
			this.buy();
		},
		lockFunction:function()
		{
			this.power=0;
			Molpy.LockBoost('Blackprints');
		},
		className:'alert',group:'bean',icon:'constructblack'
	});
	Molpy.blackprintCosts={SMM:10,SMF:15,GMM:25,GMF:30,TFLL:80,BG:120,Bacon:40,AO:150,AA:200,SG:5,AE:60,Milo:150,ZK:220,CFT:40000,BoH:90000,Nest:5e6};
	Molpy.blackprintOrder=['SMM','SMF','GMM','GMF','TFLL','AO','AA','AE','BG','Bacon','SG','Milo','ZK','CFT','BoH','Nest'];
	
	new Molpy.Boost({name:'Sand Mould Maker',alias:'SMM',desc:
		function(me)
		{
			var str = 'Allows you to make a Sand Mould of a Discovery.';
			str+='<br>This requires 100 Factory Automation runs and consumes the NewPix number of the Discovery times 100 Glass Chips per run.<br>';
			if(Molpy.Earned('Minus Worlds'))str+='(Squared if negative)<br>';
			if(me.bought&&me.power>0)
			{
				var dname='<small>'+Molpy.Badges['discov'+me.bought].name+'</small>';
				if(me.power>100)
				{
					str+='<br>Making a mould from '+dname+' is complete. The Sand Mould Filler is required next.';
				}else{
					str+='<br>'+(me.power-1)+'% complete making a mould from '+dname;
				}
				if(Molpy.Got('Break the Mould'))
				{
					str+='<br><input type="Button" onclick="Molpy.BreakMould(\''+me.alias+'\')" value="Break the Mould"></input> to cancel';
				}
			}
			return str;
		}
		,group:'bean',icon:'smm',
		classChange:function()
		{
			var oldClass=this.className;
			var newClass = (this.power>0&&this.power<=100)?'alert':'';
			if(newClass!=oldClass)
			{
				this.className=newClass;
				return 1;
			}
		},
		reset:function()
		{
			var chips =this.bought*100*(this.power-1);
			if(chips<0)chips*=chips;
			Molpy.Add('GlassChips',chips);
			this.power=0;
			Molpy.Notify(this.name+' has cancelled making <small>'+Molpy.Badges['monums'+this.bought].name+'</small>',1);
		}
	});
	new Molpy.Boost({name:'Glass Mould Maker',alias:'GMM',desc:
		function(me)
		{
			var str = 'Allows you to make a Glass Mould of a Sand Monument.';
			str+='<br>This requires 400 Factory Automation runs and consumes 1000 Glass Chips plus 1% per NewPix number of the Monument per run.<br>';
			if(Molpy.Earned('Minus Worlds'))str+='(Squared if negative)<br>';
			if(me.bought&&me.power>0)
			{
				var mname='<small>'+Molpy.Badges['monums'+me.bought].name+'</small>';
				if(me.power>400)
				{
					str+='<br>Making a mould from '+mname+' is complete. The Glass Mould Filler is required next.';
				}else{
					str+='<br>'+Molpify((me.power-1)/4,2)+'% complete making a mould from '+mname;
				}
				if(Molpy.Got('Break the Mould'))
				{
					str+='<br><input type="Button" onclick="Molpy.BreakMould(\''+me.alias+'\')" value="Break the Mould"></input> to cancel';
				}
			}
			return str;
		}
		,group:'bean',
		classChange:function()
		{
			var oldClass=this.className;
			var newClass = (this.power>0&&this.power<=400)?'alert':'';
			if(newClass!=oldClass)
			{
				this.className=newClass;
				return 1;
			}
		},
		reset:function()
		{
			var chips =Math.pow(1.01,Math.abs(this.bought))*1000*(this.power-1);
			if(this.bought<0)chips*=chips;
			Molpy.Add('GlassChips',chips);
			this.power=0;
			Molpy.Notify(this.name+' has cancelled making <small>'+Molpy.Badges['monumg'+this.bought].name+'</small>',1);
		}
	});
	new Molpy.Boost({name:'Sand Mould Filler',alias:'SMF',desc:
		function(me)
		{
			var str ='Fills a Sand Mould with Sand to make a Sand Monument.<br>This requires 200 Factory Automation runs and consumes 100 Sand plus 20% per NewPix number of the Discovery, per run.<br>';
			if(Molpy.Earned('Minus Worlds'))str+='(Squared if negative)<br>';
			if(me.bought)
			{
				if(!me.power&&(Molpy.Boosts['SMM'].power>100))
				{
					str+='<br><input type="Button" onclick="Molpy.FillSandMould('+Molpy.Boosts['SMM'].bought+')" value="Start Filling"></input> the mould in the Sand Mould Maker with Sand.';
				}
				if(me.power>0)
				{
					var dname='<small>'+Molpy.Badges['discov'+me.bought].name+'</small>';
					str+='<br>'+Molpify((me.power-1)/2,1)+'% complete filling the mould from '+dname+' with Sand';		
					if(Molpy.Got('Break the Mould'))
					{
						str+='<br><input type="Button" onclick="Molpy.BreakMould(\''+me.alias+'\')" value="Break the Mould"></input> to cancel';
					}			
				}
			}
			return str;
		}
		,group:'bean',
		classChange:function()
		{
			var oldClass=this.className;
			var newClass = (Molpy.Boosts['SMM'].power>100||this.power>0&&this.power<=200)?'alert':'';
			if(newClass!=oldClass)
			{
				this.className=newClass;
				return 1;
			}
		},
		reset:function()
		{
			if(!confirm('You will also lose the unfilled sand mould which will waste 100 runs of Factory Automation.\nAre you certain you want to do this?'))
				return;
			var chips =this.bought*100*100;
			if(chips<0)chips*=chips;
			Molpy.Add('GlassChips',chips);
			var sand=Math.pow(1.2,Math.abs(this.bought))*100*(this.power-1);
			if(this.bought<0)sand*=sand;
			Molpy.Dig(sand);
			this.power=0;
			Molpy.Notify(this.name+' has cancelled filling <small>'+Molpy.Badges['monums'+this.bought].name+'</small>',1);
		}
	});
	new Molpy.Boost({name:'Glass Mould Filler',alias:'GMF',desc:
		function(me)
		{
			var str ='Fills a Glass Mould with Glass to make a Glass Monument.<br><br>Yes, really.<br>This requires 800 Factory Automation runs and consumes 1M Glass Blocks plus 2% per NewPix number of the Discovery, per run.<br>';
			if(Molpy.Earned('Minus Worlds'))str+='(Squared if negative)<br>';
			if(me.bought)
			{
				if(!me.power&&(Molpy.Boosts['GMM'].power>400))
				{
					str+='<br><input type="Button" onclick="Molpy.FillGlassMould('+Molpy.Boosts['GMM'].bought+')" value="Start Filling"></input> the mould in the Glass Mould Maker with Glass.';
				}
				if(me.power>0)
				{
					var mname='<small>'+Molpy.Badges['monums'+me.bought].name+'</small>';
					str+='<br>'+Molpify((me.power-1)/8,3)+'% complete filling the mould from '+mname+' with Glass';				
					if(Molpy.Got('Break the Mould'))
					{
						str+='<br><input type="Button" onclick="Molpy.BreakMould(\''+me.alias+'\')" value="Break the Mould"></input> to cancel';
					}	
				}
			}
			return str;
		}
		,group:'bean',
		classChange:function()
		{
			var oldClass=this.className;
			var newClass = (Molpy.Boosts['GMM'].power>400||this.power>0&&this.power<=800)?'alert':'';
			if(newClass!=oldClass)
			{
				this.className=newClass;
				return 1;
			}
		},
		reset:function()
		{
			if(!confirm('You will also lose the unfilled glass mould which will waste 400 runs of Factory Automation.\nAre you certain you want to do this?'))
				return;
				
			var blocks=Math.pow(1.02,Math.abs(this.bought))*1000000*(this.power-1);
			if(this.bought<0)blocks*=blocks;
			Molpy.Add('GlassBlocks',blocks);
			var chips =Math.pow(1.01,Math.abs(this.bought))*1000*400;
			if(this.bought<0)chips*=chips;
			Molpy.Add('GlassChips',chips);
			this.power=0;
			Molpy.Notify(this.name+' has cancelled filling <small>'+Molpy.Badges['monums'+this.bought].name+'</small>',1);
		}
	});
	
	Molpy.BreakMould=function(alias)
	{
		var m = Molpy.Boosts[alias];
		if(confirm('Do you want to cancel '+m.name+'?\nYou will have wasted '+Molpify(m.power-1)+' run'+plural(m.power-1)+' of Factory Automation.'))
		{
			m.reset();
			m.Refresh();
		}
	}
	
	Molpy.StartCheapestSandMould=function()
	{
		var first=Molpy.newpixNumber>0?'discov1':'discov-1'
		for(var i = Molpy.Badges[first].id;i<Molpy.BadgesById.length-1;i+=8)
		{
			if(Molpy.BadgesById[i].earned&&!Molpy.BadgesById[i+1].earned)
			{
				Molpy.MakeSandMould(Molpy.BadgesById[i+1].np);
				return 1;
			}
		}
		return 0;
	}
	Molpy.MakeSandMould=function(np)
	{
		var mname='monums'+np;
		if(!Molpy.Badges[mname])
		{
			Molpy.Notify('No such mould exists');
			return;
		}
		if(Molpy.Earned(mname))
		{
			Molpy.Notify('You don\'t need to make this mould');
			return;
		}
		Molpy.Badges['discov'+np].Refresh();
		var smm=Molpy.Boosts['SMM'];
		var smf=Molpy.Boosts['SMF'];
		if(smf.power&&smf.bought==np)
		{
			Molpy.Notify('You already made this mould and are presently filling it with sand');
			return;
		}
		if(!smm.bought)
		{
			Molpy.Notify('You don\'t have the Sand Mould Maker!');
			return;
		}
		if(smm.power)
		{
			Molpy.Notify('The Sand Mould Maker is already in use!');
			return;
		}
		smm.bought=np;
		smm.power=1;
		smm.Refresh();
		smf.Refresh();
	}
	Molpy.MakeSandMouldWork=function(times)
	{
		var smm=Molpy.Boosts['SMM'];
		if(smm.power==0||smm.power>100)
		{
			if(smm.power==0&&Molpy.Got('Archimedes')&&Molpy.Spend('Bonemeal',10))
			{
				if(!Molpy.StartCheapestSandMould())return times;
			}else
				return times;
		}
		var chips =smm.bought*100;
		if(chips<0)chips*=chips;
		while (times) 
		{
			if(!Molpy.Has('GlassChips',chips))
			{
				Molpy.Boosts['Break the Mould'].power+=times;
				return times;
			}
			Molpy.Spend('GlassChips',chips);
			times--;
			smm.power++;
			smm.Refresh();
			if(smm.power>100)
			{
				Molpy.Notify('Sand Mould Creation is complete',1);
				if(Molpy.Boosts['Draft Dragon'].IsEnabled) Molpy.FillSandMould(smm.bought);
				return times;
			}
		}
		return times;
	}  	
	Molpy.FillSandMould=function(np)
	{
		var mname='monums'+np;
		var smm=Molpy.Boosts['SMM'];
		var smf=Molpy.Boosts['SMF'];
		if(!Molpy.Badges[mname])
		{
			Molpy.Notify('No such mould exists');
			return;
		}
		if(Molpy.Earned(mname))
		{
			Molpy.Notify('You don\'t need to make this mould');
			return;
		}
		if(!smf.bought)
		{
			Molpy.Notify('You don\'t have the Sand Mould Filler!');
			return;
		}
		if(smf.power)
		{
			Molpy.Notify('The Sand Mould Maker is already in use!');
			return;
		}
		if(smm.power<=100)
		{
			Molpy.Notify('No mould is ready to be filled!');
			return;
		}
		smf.bought=smm.bought;
		smf.power=1;
		smm.bought=1; //not that it really matters. *shrug*
		smm.power=0;
		smm.Refresh();
		smf.Refresh();
	}
	Molpy.FillSandMouldWork=function(times)
	{
		var smf=Molpy.Boosts['SMF'];
		if(smf.power==0)
		{
			return times;
		}
		var b = smf.bought;
		var sand=Math.pow(1.2,Math.abs(b))*100;
		if(b<0)sand*=sand;
		while (times) 
		{
			if(Molpy.sand <sand)
			{
				Molpy.Boosts['Break the Mould'].power+=times;
				return times;
			}
			Molpy.Spend('Sand',sand);
			times--;
			smf.power++;
			smf.Refresh();
			if(smf.power>200)
			{
				Molpy.Notify('Sand Mould Filling is complete',1);
				Molpy.EarnBadge('monums'+smf.bought);
				if(Molpy.Boosts['Draft Dragon'].IsEnabled&&Molpy.Earned('discov'+ smf.bought)&&!Molpy.Earned('monumg'+ smf.bought)) Molpy.MakeGlassMould(smf.bought);
				smf.bought=1;
				smf.power=0;
				return times;
			}
		}
		return times;
	}  		
	
	Molpy.MakeGlassMould=function(np)
	{
		var mname='monumg'+np;
		if(!Molpy.Badges[mname])
		{
			Molpy.Notify('No such mould exists');
			return;
		}
		if(Molpy.Earned(mname))
		{
			Molpy.Notify('You don\'t need to make this mould');
			return;
		}
		Molpy.Badges['monums'+np].Refresh();
		var gmm=Molpy.Boosts['GMM'];
		var gmf=Molpy.Boosts['GMF'];
		if(gmf.power&&gmf.bought==np)
		{
			Molpy.Notify('You already made this mould and are presently filling it with glass');
			return;
		}
		if(!gmm.bought)
		{
			Molpy.Notify('You don\'t have the Glass Mould Maker!');
			return;
		}
		if(gmm.power)
		{
			Molpy.Notify('The Glass Mould Maker is already in use!');
			return;
		}
		gmm.bought=np;
		gmm.power=1;	
		gmm.Refresh();
		gmf.Refresh();
	}
	Molpy.StartCheapestGlassMould=function()
	{
		var first=Molpy.newpixNumber>0?'monums1':'monums-1'
		for(var i = Molpy.Badges[first].id;i<Molpy.BadgesById.length-1;i+=8)
		{
			if(Molpy.BadgesById[i].earned&&!Molpy.BadgesById[i+1].earned)
			{
				Molpy.MakeGlassMould(Molpy.BadgesById[i+1].np);
				return 1;
			}
		}
		return 0;
	}
	Molpy.MakeGlassMouldWork=function(times)
	{
		var gmm=Molpy.Boosts['GMM'];
		if(gmm.power==0||gmm.power>400)
		{
			if(gmm.power==0&&Molpy.Got('Archimedes')&&Molpy.Spend('Bonemeal',10))
			{
				if(!Molpy.StartCheapestGlassMould())return times;
			}else
				return times;
		}
		var b = gmm.bought;
		var chips=Math.pow(1.01,Math.abs(b))*1000;
		if(b<0)chips*=chips;
		while (times) 
		{
			if(!Molpy.Has('GlassChips',chips)) 
			{
				Molpy.Boosts['Break the Mould'].power+=times;
				return times;
			}
			Molpy.Spend('GlassChips',chips);
			times--;
			gmm.power++;
			gmm.Refresh();
			if(gmm.power>400)
			{
				Molpy.Notify('Glass Mould Creation is complete',1);				
				if(Molpy.Boosts['Draft Dragon'].IsEnabled) Molpy.FillGlassMould(gmm.bought);
				return times;
			}
		}
		return times;
	}   
	Molpy.FillGlassMould=function(np)
	{
		var mname='monumg'+np;
		if(!Molpy.Badges[mname])
		{
			Molpy.Notify('No such mould exists');
			return;
		}
		if(Molpy.Earned(mname))
		{
			Molpy.Notify('You don\'t need to make this mould');
			return;
		}
		var gmm=Molpy.Boosts['GMM'];
		var gmf=Molpy.Boosts['GMF'];
		if(!gmf.bought)
		{
			Molpy.Notify('You don\'t have the Glass Mould Filler!');
			return;
		}
		if(gmf.power)
		{
			Molpy.Notify('The Glass Mould Maker is already in use!');
			return;
		}
		if(gmm.power<=400)
		{
			Molpy.Notify('No mould is ready to be filled!');
			return;
		}
		gmf.bought=gmm.bought;
		gmf.power=1;
		gmm.bought=1; // *shrug again*
		gmm.power=0;	
		gmm.Refresh();
		gmf.Refresh();	
	}
	Molpy.FillGlassMouldWork=function(times)
	{
		var gmf=Molpy.Boosts['GMF'];
		if(gmf.power==0)
		{
			return times;
		}
		var b = gmf.bought;
		var glass=Math.pow(1.02,Math.abs(b))*1000000;
		if(b<0)glass*=glass;
		while (times) 
		{
			if(!Molpy.Has('GlassBlocks',glass)) 
			{
				Molpy.Boosts['Break the Mould'].power+=times;
				return times;
			}
			Molpy.Spend('GlassBlocks',glass);
			times--;
			gmf.power++;
			gmf.Refresh();
			if(gmf.power>800)
			{
				Molpy.Notify('Glass Mould Filling is complete',1);
				Molpy.EarnBadge('monumg'+gmf.bought);
				if(Molpy.Got('Magic Mirror')&&Molpy.Boosts['Draft Dragon'].IsEnabled)
				{				
					if(Molpy.Earned('discov'+ -gmf.bought))
					{
						if(!Molpy.Earned('monums'+ -gmf.bought)) Molpy.MakeSandMould(-gmf.bought);
						else if(!Molpy.Earned('monumg'+ -gmf.bought)) Molpy.MakeGlassMould(-gmf.bought);
					}
				}
				gmf.power=0;
				gmf.bought=1;
				return times;
			}
		}
		return times;
	}
		
	new Molpy.Boost({name:'Ninjasaw',
		desc:function(me)
		{
			var str= 'Ninja Builder\'s Castle output is multiplied by VITSSÅGEN, JA! and VITSSÅGEN, JA! is multipled by a tenth of Ninja Builder, each at a cost of 50 Glass Blocks';
			if(me.bought){
				str+='<br><input type="Button" onclick="Molpy.GenericToggle('+me.id+')" value="'+(me.IsEnabled? 'Dea':'A')+'ctivate"></input>';
			}
			return str;
		}
		,IsEnabled:Molpy.BoostFuncs.BoolPowEnabled,sand:'450EW',castles:'75EW',glass:'1.8K',group:'ninj',className:'toggle',icon:'ninjasaw'
	});	
	
	/*10000000*Math.pow(1.25,3090) is relevant because reasons
		2.8310021220015596e+306*/
		
	new Molpy.Boost({name:'Fractal Fractals',desc:'Even your fractals have fractals!<br>Increases the effect of Fractal Sandcastles',sand:'1.8ZW',castles:'.3ZW',glass:'3K'});
	new Molpy.Boost({name:'Facebugs',desc:'Increases sand dig rate (but not clicks) by 10% per badge earned',sand:'24UW',castles:'7.5UW',glass:'8K',
		stats:function()
		{
			if(Molpy.Got('Facebugs'))
			{
				var mult=0.1*Molpy.BadgesOwned;
				return 'Increases sand dig rate by '+ Molpify(mult*100,2)+'%';
			}
			return 'Increases sand dig rate by 10% per Badge earned';
		}
	});
	new Molpy.Boost({name:'Keygrinder',desc:'The DoRD may produce a Crate Key if Factory Automation is at Level 10 or above',sand:'463UW',castles:'15.6SW',glass:'13K',group:'hpt',logic:20,icon:'keygrinder'});
	new Molpy.Boost({name:'The Key Thing',desc:'Buying a Crate Key when the Locked Crate is not available will now do something useful',sand:'18SW',castles:'47SW',glass:'19K',group:'bean',logic:25,icon:'keything'});
	
	new Molpy.Boost({name:'Window Washing Beanies',alias:'WWB',desc:
		function(me)
		{	
			if(!me.bought) return 'How are you seeing this?';
			var str = 'Multiplies the effect of each Glass Ceiling by ';
			str+=Molpify(Math.pow(2,me.bought-5),3)+' times the number of Scaffolds owned.';
			if(isFinite(Math.pow(2,me.bought-5)))
			{
				str+='<br>Current level is '+Molpify(me.bought);
				str+='<br><input type="Button" value="Trade" onclick="Molpy.GetWWB()"></input> '+Molpify(444+77*me.bought,2)+' Scaffolds to hire more Beanies.';
				if(Molpy.Got('Leggy')&&!Molpy.Got('Space Elevator')) str+='<br><input type="Button" value="Maximum Trade" onclick="Molpy.GetWWB(1)"></input> as many Scaffolds as possible to hire more Beanies: reach an infinite multiplier to unlock a new Boost!.';
			}
			return str;
		}
		,group:'bean',icon:'wwb',classChange:
		function()
		{
			var oldClass=this.className;
			var newClass = this.bought&&isFinite(Math.pow(2,this.bought-5))&&Molpy.CastleTools['Scaffold'].amount>=444+this.bought*77				
				?'action':'';
			if(newClass!=oldClass)
			{
				this.className=newClass;
				return 1;
			}
		}
	});
	Molpy.GetWWB=function(seaish)
	{
		var wwb=Molpy.Boosts['WWB'];
		var price = 444+77*wwb.bought;
		var scaf=Molpy.CastleTools['Scaffold'];
		if(scaf.amount<price)
		{
			Molpy.Notify('You must construct additional <span class="strike">pylons</span>scaffolds',1);
			return;
		}
		if(seaish&&wwb.bought)
		{
			while(scaf.amount>price&&isFinite(Math.pow(2,wwb.bought-5)))
			{
				scaf.amount-=price;
				Molpy.CastleToolsOwned-=price;
				wwb.bought++;
				price = 444+77*wwb.bought;
			}
			scaf.Refresh();
			wwb.Refresh();
		}else
		{
			scaf.amount-=price;
			Molpy.CastleToolsOwned-=price;
			scaf.Refresh();
			if(wwb.bought)wwb.bought++;
			else
			{
				Molpy.UnlockBoost(wwb.alias);
				wwb.buy();
			}
		}
		if(!isFinite(Math.pow(2,wwb.bought-5))) Molpy.UnlockBoost('Space Elevator');
	}
	
	new Molpy.Boost({name:'Recycling Beanies',alias:'RB',desc:
		function(me)
		{
			var str= 'Multiplies the effect of Broken Bottle Cleanup by '+Molpify(Math.pow(200,me.bought),3);
			if(isFinite(Math.pow(200,me.bought)))
			{
				str+='<br>Current level is '+Molpify(me.bought);
				if(Molpy.CastleTools['Beanie Builder'].amount>(me.bought*200))
				{
					str+='<br><input type="Button" value="Hire" onclick="Molpy.HireRecycling()"></input> '+Molpify(200*me.bought,2)+' Beanie Builders to recycle.';
				}else{
					str+='<br>You need to buy '+(Molpy.CastleTools['Beanie Builder'].amount?'more':'some')+' Beanie Builders before you can upgrade this.';
				}
				if(Molpy.Got('Crystal Helm'))str+='<br>Reach an infinite multiplier to unlock a new Boost!';
			}
			return str;
		}
		,group:'bean',icon:'recyclingbeanies',classChange:
		function()
		{
			var oldClass=this.className;
			var newClass = this.bought&&isFinite(Math.pow(200,this.bought))&&Molpy.CastleTools['Beanie Builder'].amount>=this.bought*200-20				
				?'action':'';
			if(newClass!=oldClass)
			{
				this.className=newClass;
				return 1;
			}
		}
	});
	Molpy.HireRecycling=function()
	{
		var rb=Molpy.Boosts['RB'];
		var price = 200*rb.bought;
		var bb=Molpy.CastleTools['Beanie Builder'];
		if(bb.amount<price)
		{
			Molpy.Notify('I find your lack of Beanie Builders disappointing',1);
			return;
		}
		bb.amount-=price;
		Molpy.CastleToolsOwned-=price;
		bb.Refresh();
		rb.bought++;
		_gaq&&_gaq.push(['_trackEvent','Boost','Upgrade',rb.name]);	
		
		if(!isFinite(Math.pow(200,rb.bought)))Molpy.UnlockBoost('Knitted Beanies');
	}
	
	new Molpy.Boost({name:'Tool Factory',
		defStuff:1,
		desc:function(me)
		{
			var str='Produces Glass Tools from Glass Chips.<br>Lock Glass Ceilings to prevent a tool from being produced.<br>This will concentrate more production of the remaining tools.';
			if(!me.bought)return str;
			if(Molpy.Got('TFLL')&&Molpy.Has('GlassChips',50000))
			{
				if(Molpy.Has('GlassChips',1e10))
				{
					str+='<br><input type="Button" value="Load" onclick="Molpy.LoadToolFactory(1e10)"></input> with 10G Glass Chips';
				}else if(Molpy.Has('GlassChips',1e7))
				{
					str+='<br><input type="Button" value="Load" onclick="Molpy.LoadToolFactory(1e7)"></input> with 10M Glass Chips';
				}
				str+='<br><input type="Button" value="Load" onclick="Molpy.LoadToolFactory(50000)"></input> with 50K Glass Chips';
			}else if(Molpy.Got('TFLL')&&Molpy.Has('GlassChips',10000))
			{
				str+='<br><input type="Button" value="Load" onclick="Molpy.LoadToolFactory(10000)"></input> with 10K Glass Chips';
			}
			
			if(Molpy.Has('GlassChips',1000))
			{
				str+='<br><input type="Button" value="Load" onclick="Molpy.LoadToolFactory(1000)"></input> with 1K Glass Chips';
			}
			return str;
		}
	
		,sand:Infinity,castles:Infinity,glass:10005,group:'hpt',className:'action'
	});
	
	Molpy.LoadToolFactory=function(amount)
	{
		if(Molpy.Has('GlassChips',amount))
		{
			Molpy.Spend('GlassChips',amount);
			Molpy.Add('Tool Factory',amount);
			if(Molpy.SandTools['Bucket'].amount>=7470&&Molpy.Got('Tool Factory')&&!isFinite(Molpy.sandPermNP))Molpy.UnlockBoost('Sand to Glass');
			if(Molpy.CastleTools['NewPixBot'].amount>=1515&&Molpy.Got('Tool Factory')&&!isFinite(Molpy.castles))Molpy.UnlockBoost('Castles to Glass');
			_gaq&&_gaq.push(['_trackEvent','Boost','Load Tool Factory',''+amount]);	
		}
	}
	Molpy.MakeTFOrder=function()
	{
		Molpy.tfOrder=[];
		for(i in Molpy.CastleToolsById)
		{
			Molpy.tfOrder.push(Molpy.SandToolsById[i]);
			Molpy.tfOrder.push(Molpy.CastleToolsById[i]);
		}
	}
	Molpy.MakeTFOrder();
	Molpy.RunToolFactory=function()
    {
        var tf = Molpy.Boosts['Tool Factory'];
		if(!tf.bought)return;
        var toolBuildNum = 1;
        if(Molpy.Got('PC')) toolBuildNum=Molpy.Boosts['PC'].power;
        var tfChipBuffer=tf.Level;
		var acPower = 0;
        if(Molpy.Boosts['AA'].IsEnabled)
		{
			acPower=1;
			if(Molpy.Got('AC')) acPower=Molpy.Boosts['AC'].power;
		}
        var built=0;
        var fVal=Molpy.Boosts['Flipside'].power;
        var fast=0;
		var gcCount=Molpy.GlassCeilingCount();
		if(gcCount==0)return;
        if (gcCount==12 && (fVal==0) && (tfChipBuffer >= 78000*toolBuildNum)) //everything selected and we can afford it all!
        {
            var t = Molpy.tfOrder.length;
            fast=1;
            while(t--)
            {
                Molpy.tfOrder[t].create(toolBuildNum-acPower);
            }              
            tfChipBuffer -= 78000*toolBuildNum;
            built = toolBuildNum*12;   
        }
        else
        {
			toolBuildNum=Math.floor(toolBuildNum/gcCount*12);//if something isn't selected, we can try building a bit more of the other things
			var setPrice=0;
			
			var t = Molpy.tfOrder.length;
			while(tfChipBuffer&&t--)
			{
				var tool=Molpy.tfOrder[t];
				if(isFinite(Molpy.priceFactor*tool.price)==fVal&&Molpy.Got('Glass Ceiling '+t))
				{
					var cost = 1000*(t+1);
					setPrice+=cost; //figure out how much it costs for one of everything selected
				}
            }
			var iAfford= Math.min(toolBuildNum,Math.floor(tfChipBuffer/setPrice)); //find how many of everything can be built
			
            t = Molpy.tfOrder.length;
            while(iAfford&&t--)
            {
                tool = Molpy.tfOrder[t];
				if(isFinite(Molpy.priceFactor*tool.price)==fVal&&Molpy.Got('Glass Ceiling '+t))
				{
					tool.create(iAfford);
					built+=iAfford;
				}
            }              
            tfChipBuffer -= setPrice*iAfford;
			
			if(iAfford<toolBuildNum) //we have some chips leftover so build 1 of what we can afford
			{
				t = Molpy.tfOrder.length;
				while(t--)
				{
					var tool=Molpy.tfOrder[t];
					if(isFinite(Molpy.priceFactor*tool.price)==fVal&&Molpy.Got('Glass Ceiling '+t))
					{
						var cost = 1000*(t+1);
						if(tfChipBuffer>=cost)
						{
							tfChipBuffer-=cost;
							built++;
							Molpy.tfOrder[t].create(1);
						}
					}
				}
            }
			
        }
        if(built)
        {       
            var t = Molpy.tfOrder.length;
            while(t--)
            {
                var tool=Molpy.tfOrder[t];
                if(isFinite(Molpy.priceFactor*tool.price)) tool.Refresh();
            }
			built*=Molpy.TDFactor();
            Molpy.toolsBuilt+=built;
            Molpy.toolsBuiltTotal+=built;
            Molpy.recalculateDig=1;
            Molpy.shopRepaint=1;
            Molpy.CheckBuyUnlocks();
            tf.Level=tfChipBuffer;
			
			if(built>=1000)Molpy.EarnBadge('KiloTool');
			if(built>=1e6)Molpy.EarnBadge('MegaTool');
			if(built>=1e9)Molpy.EarnBadge('GigaTool');
			if(built>=1e12)Molpy.EarnBadge('TeraTool');
			if(built>=1e15)Molpy.EarnBadge('PetaTool');
			if(built>=1e24)Molpy.EarnBadge('YottaTool');
			if(built>=1e42)Molpy.EarnBadge('WololoTool');
			if(built>=1e84)Molpy.EarnBadge('WololoWololoTool');

        }
        if(!acPower)return;

        var i=acPower;
        var times=0;
        if (fast)
        {
			Molpy.RunFastFactory(acPower);
			return;
        }
		if(Molpy.mustardTools)
		{
			if(Molpy.Got('Mustard Automation')&&Molpy.Spend('Mustard',20))
			{
				Molpy.RunFastFactory(acPower);
			}
            return;
		}
        while(i--)
        {
            var on = 1;
            var t = Molpy.tfOrder.length;
            while(on&&t--)
            {
                if(isFinite(Molpy.priceFactor*Molpy.tfOrder[t].price)) on=0;
            }
            if(!on)break;
            var t = Molpy.tfOrder.length;
            while(t--)
            {
                var tool=Molpy.tfOrder[t];
                tool.amount--;
                tool.Refresh();
            }
            times++;
        }
        Molpy.RunFastFactory(times);
		
//      if(times)
//      {
//          Molpy.GlassNotifyFlush();
//          Molpy.Notify('Ran Factory Automation '+Molpify(times,1)+' times');
//      }
    }

    Molpy.RunFastFactory=function(times) //assumes player did buy AO before getting AA. probably a safe assumption
    {
        var left = times;
		if(Molpy.Got('AE'))
		{
			if(Molpy.Got('CfB'))
			{
				  Molpy.DoBlackprintConstruction(left);
			}
			if(!Molpy.Boosts['Cold Mould'].IsEnabled)
			{
				if (left) left=Molpy.FillGlassMouldWork(left);
				if (left) left=Molpy.MakeGlassMouldWork(left);
				if (left) left=Molpy.FillSandMouldWork(left);
				if (left) left=Molpy.MakeSandMouldWork(left);
			}
		}
		
		var furn=Math.floor((times+Math.random()*3)/2);
		if (Molpy.Got('Stretchable Chip Storage')) Molpy.RewardBlastFurnace(furn);
		else {
        		for(var i=0; i <furn; i++) Molpy.RewardBlastFurnace();
		}
		left=times-furn;
		Molpy.boostSilence=1;
		if(left>7&&Molpy.Got('Milo'))
		{
			var mr = Molpy.Boosts['Milo'];
			var s = 0;//Math.sin((Math.PI*Molpy.ONGelapsed)/(Molpy.NPlength*100));
			var draft=Math.random()*(1+2*s)*(left-7);
			mr.power+=draft*(Molpy.Got('Rush Job')?5:1);
			left-=draft;			
			var pages=0;
			while(mr.power>=100)
			{
				pages++;
				mr.power-=100;
			}
			if(pages)
				Molpy.Add('Blackprints',pages);
		}
		if(left>10&&Molpy.redactedClicks>2500&&Molpy.Got('ZK')&&Molpy.Boosts['Logicat'].bought>=4&&Molpy.Got('Caged Logicat')&&Molpy.Boosts['Caged Logicat'].bought<Molpy.PokeBar())
		{
			var zk = Molpy.Boosts['ZK'];
			var poke=Math.random()*(left-10);
			zk.power+=poke;
			left-=poke;
			while(zk.power>=1000)
			{
				Molpy.Boosts['Panther Poke'].buyFunction();
				zk.power-=1000;
			}			
			Molpy.Boosts['Caged Logicat'].Refresh();
		}
		Molpy.boostSilence=0;
    }
	
	new Molpy.Boost({name:'Panther Glaze',desc:'Early cat<br>Takes the blocks<br>But the late<br>Brings the chips<br><i>Panther Glaze</i>',sand:Infinity,castles:Infinity,glass:'45K',group:'bean',stats:'If you have Infinite Castles, Not Lucky related boosts don\'t use glass blocks. Instead they produce glass chips.<br><small>Oh and Catamaran/LCB always consume tools</small>',logic:65});
	new Molpy.Boost({name:'Badgers',desc:function(me)
		{
			return GLRschoice(['Badgers? Badgers? We don\'t need no ch*rpin\' Badgers! This is Sacred Ground and I\'ll have no more heresy. Surely you mean Molpies.','Exactly! No, wait - No! There are no badgers involved at all!','For every 10 badges, Glass Chip production uses 1% less sand']);
		},
		sand:Infinity,castles:Infinity,glass:'60K'
	});
	
	Molpy.glassCeilingDescText.push('Sand rate of LaPetite');
	Molpy.glassCeilingDescText.push('Castles produced by Beanie Builders');
	Molpy.MakeGlassCeiling(10);
	Molpy.MakeGlassCeiling(11);
	Molpy.Boosts['Glass Ceiling 10'].sandPrice='6FQ';
	Molpy.Boosts['Glass Ceiling 10'].castlePrice='6FQ';
	Molpy.Boosts['Glass Ceiling 11'].sandPrice='6WQ';
	Molpy.Boosts['Glass Ceiling 11'].castlePrice='6WQ';
	Molpy.Boosts['Glass Ceiling 10'].glassPrice='100K';
	Molpy.Boosts['Glass Ceiling 11'].glassPrice='350K';
	Molpy.Boosts['Glass Ceiling 10'].logic=80;
	Molpy.Boosts['Glass Ceiling 11'].logic=90;	
	
	new Molpy.Boost({name:'Expando',desc: 
		function(me)
		{ 
			return (me.IsEnabled? '':'When active, ') + 'All Tools, Boosts and Badges are expanded<br>'+(me.IsEnabled? '<br>':'')+'<input type="Button" onclick="Molpy.ToggleExpando()" value="'+(me.IsEnabled? 'Deflate':'Expand')+'"></input>';
		},
		IsEnabled:Molpy.BoostFuncs.BoolPowEnabled,sand:800,castles:20,className:'toggle',icon:'expando'
	});
	
	new Molpy.Boost({name:'Sand to Glass',desc:'When Sand is Infinite, Sand Tools produce Glass Chips for Tool Factory', sand:Infinity,castles:Infinity,glass:'200K',group:'hpt'});
	new Molpy.Boost({name:'Castles to Glass',desc:'When Castles are Infinite, Castle Tools produce Glass Chips for Tool Factory', sand:Infinity,castles:Infinity,glass:'2M',group:'hpt'});
	
	var loveline=0;
	Molpy.ToggleExpando=function()
	{
		var me=Molpy.Boosts['Expando'];
		Molpy.Notify(Molpy.love[loveline]);
		loveline++;
		if(loveline>=Molpy.love.length)
		{
			loveline=0;
			if(!me.bought)
			{
				me.buy();
				if(me.bought)
					Molpy.RewardRedacted();
			}
		}
		
		if(!me.bought)
		{
			_gaq&&_gaq.push(['_trackEvent','Boost','Toggle Fail',me.name]);	
			return;
		}
		_gaq&&_gaq.push(['_trackEvent','Boost','Toggle',me.name]);	
		me.IsEnabled=1*!me.IsEnabled;
		if(!me.IsEnabled)Molpy.shrinkAll=1;
		me.Refresh();
	}
	
	new Molpy.Boost({name:'Frenchbot',desc:'NewPixBots produce 1Q x castles, LaPetite produces 1W x sand', stats:'The Dip of Infinite Judgement Approaches. Do you have 101 Logicats?', 
		sand:'10Q',castles:'10Q',glass:'.5M',group:'cyb'});
	new Molpy.Boost({name:'Bacon',desc:'Knowledge is Power - France is Bacon.<br>NewPixBots produce 10x, LaPetite sand production is boosted by 3% cumulatively per NewPixBot', 
		sand:'10WQ',castles:'10WQ',glass:'.75M',group:'cyb'
	}); //note: it doesn't say 10x *castles*
	
	new Molpy.Boost({name:'Safety Hat',desc:'It\'s green, comfortable, stylish, and protects you from all kinds of harm! Best of all, it\'s completely free!',
		buyFunction:function()
		{
			Molpy.Notify('You are hit by a torrent of salt and pumpkins. No brainslug for you!',1);
			Molpy.LockBoost('Safety Hat');
		}
	});
	
	new Molpy.Boost({name:'Safety Pumpkin',desc:'It\'s orange, comfortable, stylish, and reduces the likelihood of industrial accidents!',
		glass:'20K'
	});
	
	new Molpy.Boost({name:'Backing Out',desc:'Castle Tools activate from smallest to largest, and each builds before the next destroys',glass:'6M',logic:120});
	new Molpy.Boost({name:'Bucking the Trend',desc:'Buckets produce 2x Glass',glass:'2M',sand:Infinity});
	new Molpy.Boost({name:'Crystal Well',desc:'Buckets produce 10x Glass',glass:'8M'});
	new Molpy.Boost({name:'Glass Spades',desc:'Cuegan produce 2x Glass',glass:'3M'});
	new Molpy.Boost({name:'Statuesque',desc:'Cuegan produce 10x Glass',glass:'10M',sand:Infinity});
	new Molpy.Boost({name:'Flag in the Window',desc:'Flags produce 4X Glass',glass:'4M'});
	new Molpy.Boost({name:'Crystal Wind',desc:'Flags produce 5X Glass',glass:'5M'});
	new Molpy.Boost({name:'Crystal Peak',desc:'Ladders produce 12X Glass',glass:'9M',sand:Infinity,castles:Infinity});
	new Molpy.Boost({name:'Cupholder',desc:'Bags produce 8X Glass',glass:'11M',castles:Infinity});
	new Molpy.Boost({name:'Tiny Glasses',desc:'LaPetite produces 9X Glass',glass:'12M',sand:Infinity,castles:Infinity});
	new Molpy.Boost({name:'Stained Glass Launcher',desc:'Trebuchet Glass flinging is multiplied by the number of Glass Ceilings owned',glass:'15M',sand:Infinity,castles:Infinity});
	new Molpy.Boost({name:'Glass Saw',desc:function(me)
	{		
		return (me.IsEnabled? '':'When active, ') + 'VITSSÅGEN, JA! makes Glass Blocks from Glass Chips (at the Glass Blower rate) in the Tool Factory buffer: initially up to 10M per Glass Ceiling and doubling with use.'+(me.bought?'<br><input type="Button" onclick="Molpy.GenericToggle('+me.id+',1)" value="'+(me.IsEnabled? 'Dea':'A')+'ctivate"></input>':'')+'<br>Current maximum is '+Molpify(Math.abs(me.power),1)+' Blocks per Glass Ceiling';
	},
	IsEnabled:Molpy.BoostFuncs.PosPowEnabled,
	glass:'7M',sand:Infinity,castles:Infinity,className:'toggle',
		buyFunction:function(){this.IsEnabled=1;}
	});
	
	Molpy.rushCost=80;
	new Molpy.Boost({name:'Panther Rush',desc:function(me)
		{
			return 'Uses '+Molpify(Molpy.CalcRushCost(),3)+' Logicat levels to increase the value of Logicat answers by 0.5.<br>Single use: available again when you have '
				+Molpify(Molpy.CalcRushCost(1)+5,3)+' Logicat levels.'+(me.Level?'<br>Currently at '+Molpify(me.Level/2,1)+' points':'')+(me.bought?'<br><input type="Button" onclick="Molpy.PantherRush()" value="Use"></input>':'');
		},glass:function()
		{
			return Math.pow(10,Molpy.Boosts['Panther Rush'].power+7);
		},sand:Infinity,castles:Infinity,className:'action',defStuff:1
	});
	Molpy.Boosts['Panther Rush'].refreshFunction=undefined;
	Molpy.CalcRushCost=function(p)
	{
		var l = Molpy.Level('Panther Rush')+(p||0);
		return (Molpy.rushCost+l)*(l+1);
	}
	Molpy.PantherRush=function()
	{
		var pr = Molpy.Boosts['Panther Rush'];
		var levels = Molpy.CalcRushCost();
		if(Molpy.Has('Logicat',levels+5)&&confirm('Really spend '+Molpify(levels,3)+' Logicat levels on Panther Rush?'))
		{				
			if(Molpy.Spend('Logicat',levels))
				pr.Add(1);
			levels = Molpy.CalcRushCost();		
			Molpy.LockBoost(pr.alias);
			if(Molpy.Has('Logicat',levels+5))Molpy.UnlockBoost(pr.alias);		
		}
	}
	
	new Molpy.Boost({name:'Ruthless Efficiency',desc:'Glass Block production uses a quarter as many Chips',glass:'12M',sand:'10WW',castles:'10WW', group:'hpt'});
	new Molpy.Boost({name:'Break the Mould',desc:'Allows you to destroy an incomplete or unfilled Mould, if you decide making it was a mistake.',glass:'2M',sand:'10WWW',castles:'10WWW', group:'bean',icon:'breakthemould'});
	
	new Molpy.Boost({name:'TF Load Letter',alias:'TFLL',desc:'You can load Tool Factory with 50K Glass Chips at a time',glass:'4M',sand:Infinity,castles:Infinity, group:'hpt'});
	new Molpy.Boost({name:'Booster Glass',alias:'BG',desc:'If you have Infinite Sand, clicking the NewPix gives Tool Factory 4 Glass Chips per Boost owned',glass:'8M',sand:Infinity,castles:Infinity, group:'hpt'});
	new Molpy.Boost({name:'Automation Optimiser',alias:'AO',desc:'Mould Processing does not prevent the standard tasks of Factory Automation from occuring',glass:'20M',sand:Infinity,castles:Infinity, group:'hpt'});
	new Molpy.Boost({name:'Production Control',alias:'PC',
		desc:function(me)
		{
			if(!me.bought) return 'Allows you to change how many copies of Glass Tools can be constructed by Tool Factory each mNP';
			if(Molpy.Earned('Nope!'))
			{
				me.power = 6e51;
			}
			var n = me.power;
			var str='Tool Factory produces up to '+Molpify(n,2)+' of any Glass Tool per mNP.';
			if(Molpy.Earned('Nope!'))
			{
				return str;
			}
			
			if((n < 500 || ! Molpy.Has('GlassBlocks',1e7*n)) && Molpy.Has('GlassBlocks',1e6*n))
			{
				str+='<br><input type="Button" value="Increase" onclick="Molpy.ControlToolFactory(1)"></input> the rate by 1 at a cost of '+Molpify(1e6*n,1)+' Glass Blocks.';
			}
			for(var i = 1;i<50;i++)//nope!
			{				
				if((n >= 5*Math.pow(10,i) || !Molpy.Has('GlassBlocks',Math.pow(10,i+7)*n)) && n < 5*Math.pow(10,i+2))
				{
					if(Molpy.Has('GlassBlocks',Math.pow(10,i+6)*n))
					{
						str+='<br><input type="Button" value="Increase" onclick="Molpy.ControlToolFactory('+Math.pow(10,i)+')"></input> the rate by '+Molpify(Math.pow(10,i),1) 
							+' at a cost of '+Molpify(Math.pow(10,i+6)*n,1)+' Glass Blocks.';
					}else break;
				}
			}
			if (n > 5e51) 
			{		
				str += 'No further increases are possible.'
				if (!Molpy.Earned('Nope!'))
				{
					Molpy.EarnBadge('Nope!');
					me.power = 6e51;// Evens everyone up to same value could get here between 5 and 5.00999...
					me.className = '';
				}
			}
			if(!Molpy.Boosts['No Sell'].power&&me.power>0&&Molpy.Has('GlassBlocks',1e5*n))
			{
				str+='<br><input type="Button" value="Decrease" onclick="Molpy.ControlToolFactory(-1)"></input> the rate by 1 at a cost of '+Molpify(1e5*n,1)+' Glass Blocks.';
			}
			
			return str;
		}
		,glass:'30M',sand:Infinity,castles:Infinity, group:'hpt',classChange:function(){this.className = (Molpy.Earned('Nope!')?'':'toggle')},
		buyFunction:function(){this.power=1;}
	});
	Molpy.ControlToolFactory=function(n)
	{
		var me = Molpy.Boosts['PC'];
		var cost=1e6*n;
		if(n<0) cost=-1e5*n;
		cost*=me.power;
		if(Molpy.Has('GlassBlocks',cost))
		{
			Molpy.Spend('GlassBlocks',cost);
			me.power+=n;
			Molpy.Notify('Adjusted production rate of Tool Factory');
			me.Refresh();
			if(n>0)
				_gaq&&_gaq.push(['_trackEvent','Boost','Upgrade',me.name]);	
			else
				_gaq&&_gaq.push(['_trackEvent','Boost','Downgrade',me.name]);
		}
	}
	new Molpy.Boost({name:'Panther Poke',desc:'Keeps the Caged Logicat awake a little longer.', group:'bean',
		buyFunction:function(){
			Molpy.Add('Caged Logicat',1+Molpy.Level('Panther Rush'));
			Molpy.LockBoost(this.alias);
		}
	});
	Molpy.PokeBar=function()
	{
		return 4+Molpy.Level('Panther Rush')*(1+Molpy.Boosts['WiseDragon'].power);
	}
	new Molpy.Boost({name:'Flipside',
		desc:function(me)
		{
			
			return (me.IsEnabled? '':'When active, ') + 'Factory constructs Glass Tools that do not have infinite price, instead of Glass Tools that do have infinite price.'+(me.bought?'<br><input type="Button" onclick="Molpy.GenericToggle('+me.id+')" value="'+(me.IsEnabled? 'Dea':'A')+'ctivate"></input>':'');
		}
		,IsEnabled:Molpy.BoostFuncs.BoolPowEnabled,glass:'50M',sand:Infinity,castles:Infinity, group:'hpt',className:'toggle'
	});
	
	new Molpy.Boost({name:'Automata Assemble',alias:'AA',
		desc:function(me)
		{
			
			return (me.IsEnabled? 'A':'When active, a') + 'fter Tool Factory runs, if all Tool prices are Infinite, uses 1 of each Tool to perform a Blast Furnace run.'+(me.bought?'<br><input type="Button" onclick="Molpy.GenericToggle('+me.id+')" value="'+(me.IsEnabled? 'Dea':'A')+'ctivate"></input>':'')+'<br>(Without extra power from Automata Control, will not run Blast Furnace every time.)<br>(Supresses notifications about Glass gains so you don\'t get spammed)';
		}
		,IsEnabled:Molpy.BoostFuncs.BoolPowEnabled,glass:'50M',sand:Infinity,castles:Infinity, group:'hpt',className:'toggle'
	});
	
	new Molpy.Boost({name:'Glass Mousepy',alias:'GM',desc:'Clicks give 5% of your chips/mNP rate',glass:'10M',sand:Infinity,castles:Infinity, group:'hpt'});
	new Molpy.Boost({name:'Glassed Lightning',alias:'GL',desc:function(me)
		{		
			return Molpify(me.power,1)+'% Glass for '+Molpify(me.countdown,3)+'mNP';
		}
		,icon:'blitzing',className:'alert',startCountdown:25,startPower:function()
		{
			return Molpy.Boosts['LR'].power||400;
		},buyFunction:function()
		{
			if(Molpy.Got('LR'))
			{
				Molpy.Boosts['LR'].power*=1.004;
				if(Molpy.Got('Thunderbird')&&Molpy.Got('TDE'))
				{
					Molpy.Boosts['LR'].power*=1.5;
				}
			}
			
		}
	});
	
	new Molpy.Boost({name:'Automata Control',alias:'AC',
		desc:function(me)
		{
			if(!me.bought) return 'Allows you to change the number of times Automata Assemble tries to run Factory Automation after Tool Factory.<br>(Otherwise it defaults to the level from Production Control)';
			var n = me.Level;
			var str='Automata Assemble attempts up to '+Molpify(n,2)+' Factory Automation runs.';
			var chipCost=1e7*Math.pow(1.2,n);
			var pageCost=n*2;
			if(n<Molpy.Boosts['PC'].power&&Molpy.Has('GlassChips',chipCost))
			{
				str+='<br><input type="Button" value="Increase" onclick="Molpy.ControlAutomata(1)"></input> the number of runs by 1 at a cost of '+Molpify(chipCost,2)+' Glass Chips and '+Molpify(pageCost,2)+' Blackprint Pages.';
			}else{
                str+='<br>It will cost '+Molpify(chipCost,2)+' Glass Chips and '+Molpify(pageCost,2)+' Blackprint Pages to increase this by 1.';
            }
			if(!Molpy.Boosts['No Sell'].power&&n>1&&Molpy.Has('GlassChips',1e5*n))
			{
				str+='<br><input type="Button" value="Decrease" onclick="Molpy.ControlAutomata(-1)"></input> the number of runs by 1 at a cost of '+Molpify(1e5*n,1)+' Glass Chips.';
			}
			return str;
		}
		,glass:'25M',sand:Infinity,castles:Infinity, group:'hpt',className:'toggle',defStuff:1,
		buyFunction:function(){this.Level=1;}
	});
	Molpy.ControlAutomata=function(n,dragon)
	{
		var me = Molpy.Boosts['AC'];
		var chipCost=1e7*Math.pow(1.2,me.Level);
		var pageCost=2*me.Level;
		var logicatCost=0;
		if(dragon)
		{
			chipCost=0;
			pageCost*=5;
			logicatCost=Math.ceil(me.Level/20);
		}else if(n<0)
		{
			chipCost=-1e5*me.Level;
			pageCost=0;
		}
		if(Molpy.Has('GlassChips',chipCost))
		{
			if(!Molpy.Has('Blackprints',pageCost))
			{
				Molpy.Notify('You need more Blackprint Pages');
				return;
			}
			if(!Molpy.Has('Logicat',logicatCost))
			{
				Molpy.Notify('You need more Logicat Levels');
				return;
			}
			Molpy.Spend('Blackprints',pageCost);
			Molpy.Spend('Logicat',logicatCost);
			Molpy.Spend('GlassChips',chipCost);
			me.Add(n);
			Molpy.Notify('Adjusted Automata Assemble');
			if(n>0)
				_gaq&&_gaq.push(['_trackEvent','Boost',(dragon?'Dragon Upgrade':'Upgrade'),me.name]);
			else
				_gaq&&_gaq.push(['_trackEvent','Boost','Dowgrade',me.name]);
		}
	}
	new Molpy.Boost({name:'Bottle Battle',desc:'NewPixBot Glass production is multiplied by 3',glass:'10M',sand:Infinity,castles:Infinity,group:'cyb'});
	new Molpy.Boost({name:'Leggy',desc:'Scaffold Glass production is multiplied by 8',glass:'15M',sand:Infinity,castles:Infinity});
	new Molpy.Boost({name:'Clear Wash',desc:'Wave Glass production is multiplied by 10',glass:'15M',sand:Infinity,castles:Infinity});
	new Molpy.Boost({name:'Crystal Streams',desc:'River Glass production is multiplied by 12',glass:'20M',sand:Infinity,castles:Infinity});
	new Molpy.Boost({name:'Super Visor',desc:'Beanie Builder Glass production is multiplied by 15',glass:'20M',sand:Infinity,castles:Infinity,group:'bean'}); //brillant
	new Molpy.Boost({name:'Crystal Helm',desc:'Beanie Builder Glass production is multiplied by 5',glass:'30M',sand:Infinity,castles:Infinity,group:'bean'}); //paula
	
	new Molpy.Boost({name:'Safety Goggles',alias:'SG',desc:'The goggles, they do something!',stats:'Reduces the chance of industrial accidents and prevents Factory Automation from downgrading in shortpix!',glass:'2M'		
	});
		
    new Molpy.Boost({name:'Seaish Glass Chips', desc:'Allows Sand Purifier and Sand Refinery (using chips only) to increase as far as your resources allow', glass:'100K'});
    new Molpy.Boost({name:'Seaish Glass Blocks', desc:'Allows Glass Extruder and Glass Chiller to increase as far as your resources allow', glass:'100K'});

	new Molpy.Boost({name:'Automata Engineers',alias:'AE',desc:'Allows Automata Assemble to perform Blackprint Construction and Mould related tasks'
		,glass:'100M',sand:Infinity,castles:Infinity, group:'hpt'});
	new Molpy.Boost({name:'Mysterious Representations',alias:'Milo',desc:'Allows Automata Assemble to create Blackprints.<br>Needs at least 15 AA runs.'
		,glass:'500M',sand:Infinity,castles:Infinity, group:'hpt'});
	new Molpy.Boost({name:'Zookeeper',alias:'ZK',desc:'Allows Automata Assemble to provide Panther Poke.<br>Needs at least 21 AA runs.'
		,glass:'2.5G',sand:Infinity,castles:Infinity, group:'bean'});
		
	new Molpy.Boost({name:'Schrödinger\'s Gingercat',alias:'SGC',desc:'Observes itself. Also causes Not Lucky to give more glass and makes '+Molpy.redactedWords+' last longer',glass:'16.2M',logic:1613});
	
	new Molpy.Boost({name:'Mind Glow',desc:'Jumping to a NewPix for which you have made a Sand Monument costs half as many Glass Chips',glass:'2M'});
	new Molpy.Boost({name:'Memory Singer',desc:'Jumping to a NewPix for which you have made a Glass Monument costs half as many Glass Chips',glass:'10M'});
	new Molpy.Boost({name:'Lightning Rod',alias:'LR',desc:'Glassed Lightning becomes more powerful with use',glass:'440M',sand:Infinity,castles:Infinity,
		buyFunction:function(){this.power=Molpy.Boosts['GL'].power||400;}
	});
	
	new Molpy.Boost({name:'Beachball',desc:function(me)
	{
		
		return (me.IsEnabled? 'T':'When active, t') + 'he border of the NewPix changes colour.<br>Red = Clicking will Ninja<br>Blue = Click to gain Ninja Stealth<br>Green = All Clear<br>Yellow = less than 2 mNP until ONG'+(me.bought?'<br><input type="Button" onclick="Molpy.UpdateBeachClass(); Molpy.GenericToggle('+me.id+');" value="'+(me.IsEnabled? 'Dea':'A')+'ctivate"></input>':'');
	}
	,IsEnabled:Molpy.BoostFuncs.BoolPowEnabled,sand:'4K',castles:200,className:'toggle'});
	
	new Molpy.Boost({name:'Mushrooms',desc:'For every 10 badges, Glass Block production uses 1% less sand',	sand:Infinity,castles:Infinity,glass:'60K'});
	new Molpy.Boost({name:'Knitted Beanies',desc:'Beanie Builder Glass production is multiplied by the number of million Bags owned',glass:'60T',sand:Infinity,castles:Infinity,group:'bean'});
	new Molpy.Boost({name:'Space Elevator',desc:'Scaffold Glass production is multiplied by a ten thousandth of the number of Ladders owned',stats:'Spaaaaaace!',glass:'55T',sand:Infinity,castles:Infinity});
	
	new Molpy.Boost({name:'Discovery Detector',sand:'2M',castles:'2M',glass:100,className:'action',group:'bean',
            desc:function(me)
            {
                if (!me.bought) return 'Scans your records to see if you have missed discoveries';
                var cost=Molpy.highestNPvisited*Molpy.highestNPvisited*10;
	        if (Molpy.Earned('Minus Worlds')) cost*=40;
                return '<input type="button" value="Scan" onclick="Molpy.RunDiscoveryDetector()"></input> costs '+Molpify(cost,2)+ ' chips to scan your records to see where you have missed discoveries';
            }
        }); //by waveney

    Molpy.RunDiscoveryDetector=function()
    {
        var cost=Molpy.highestNPvisited*Molpy.highestNPvisited*10;
	if (Molpy.Earned('Minus Worlds')) cost*=40;
        if (!Molpy.Has('GlassChips',cost))
        {
            Molpy.Notify('Sorry you can\'t afford it at the moment');
            return;
        }
        Molpy.Spend('GlassChips',cost);

        var miscount =0;
        var npstart = 1;
	var missing = 0;
        for (var np=1; np<Molpy.highestNPvisited; np++)
        {
            var alias='discov'+np;
            if(Molpy.Badges[alias])
            {
                if(Molpy.Earned(alias))
                {
                    if (miscount)
                    {
			Molpy.Notify('You have missed '+miscount+' discover'+(miscount>1?'ies':'y')+' between NP'+npstart+' and NP'+np,1);
                        miscount=0;
                    }
                    npstart=np;
                }
                else
                {
                    miscount++;
	   	    missing++;
                }
            }
        }
        if (miscount) Molpy.Notify('You have missed '+miscount+' discover'+(miscount>1?'ies':'y')+' since NP'+npstart,1);
	if (Molpy.Earned('Minus Worlds'))
	{
	    var miscount =0;
            var npstart = -Molpy.highestNPvisited;
            for (var np=npstart; np<0; np++)
            {
           	var alias='discov'+np;
            	if(Molpy.Badges[alias])
            	{
                    if(Molpy.Earned(alias))
                    {
                    	if (miscount)
                    	{
		  	    Molpy.Notify('You have missed '+miscount+' discover'+(miscount>1?'ies':'y')+' between NP'+npstart+' and NP'+np,1);
                            miscount=0;
                        }
                    	npstart=np;
                    }
                    else
                    {
                        miscount++;
	   	        missing++;
                    }
                }
            }
            if (miscount) Molpy.Notify('You have missed '+miscount+' discover'+(miscount>1?'ies':'y')+' since NP'+npstart,1);
	}

	if (!missing) Molpy.Notify('You have not missed any discoveries');
    }
	
	new Molpy.Boost({name:'Achronal Dragon',alias:'AD',
		desc:function(me)
		{
			if(!me.bought) return'In the stats of this boost, you can seek and destroy temporal duplicates';	
			if(!me.scanIndex)me.scanIndex=0;
			if(me.scanIndex>=Molpy.tfOrder.length)
			{
				me.scanIndex=0;
			}
			
			var looped=0;
			while(!Molpy.tfOrder[me.scanIndex].temp)
			{
				me.scanIndex++;
				if(me.scanIndex>=Molpy.tfOrder.length)
				{
					me.scanIndex=0;
					if(looped)break;
					looped=1;
				}
			}
			
			var str='Temporal Duplicate Scan Report:';
			var temp=Molpy.tfOrder[me.scanIndex].temp;
			if(temp)
			{
				str+='<br>'+Molpify(Molpy.tfOrder[me.scanIndex].temp,3)+' duplicates of '+Molpy.tfOrder[me.scanIndex].name;
				str+='<br><input type="button" value="Destroy" onclick="Molpy.tfOrder[\''+me.scanIndex+'\'].destroyTemp()"></input> them all at a cost of '+Molpify(temp*(me.scanIndex%2?10:5),3)+' Glass Blocks<br><input type="button" value="Find Next" onclick="Molpy.Boosts.AD.scanIndex++;Molpy.Boosts.AD.Refresh();"></input>';
			}else{
				str+='<br>Nothing to report.<br><input type="button" value="Rescan" onclick="Molpy.Boosts.AD.scanIndex=0;Molpy.Boosts.AD.Refresh();"></input>';
			}
			return str;
		}
		,sand:'2Z',castles:'8Z',glass:'7K',logic:12,className:'alert',group:'drac',icon:'achronaldragon',
		stats:function(me)
		{
			var target=Molpy.DragonTarget()[0];
			var str='Power is '+Molpify(me.power,3)+(target?' out of  '+Molpify(target,3)+'.<br>Destroy more temporal duplicates!':'');
			return str;
		},
		defStuff:1
	});
	Molpy.DragonTarget=function()
	{
		if(Molpy.Got('Tool Factory')&&Molpy.Has('Logicat',1200/(Molpy.Level('Panther Rush')+1))&&!Molpy.Boosts['Crystal Dragon'].unlocked) return [1000,'Crystal Dragon'];
		if(Molpy.Has('AC',101)&&!Molpy.Boosts['Draft Dragon'].unlocked&&Molpy.groupBadgeCounts.monumg>40) return [2e12,'Draft Dragon'];
		if(Molpy.Has('AC',300)&&!Molpy.Boosts['Dragon Forge'].unlocked) return [7e16,'Dragon Forge'];
		if(Molpy.Has('AC',404)&&!Molpy.Boosts['WiseDragon'].unlocked) return [4.5e20,'WiseDragon'];
		if(Molpy.Has('AC',555)&&!Molpy.Boosts['Thunderbird'].unlocked&&Molpy.Got('PSOC')) return [6e36,'Thunderbird'];
		if(Molpy.Has('AC',777)&&!Molpy.Boosts['Dragon Foundry'].unlocked&&Molpy.Earned('Nope!')) return [3e55,'Dragon Foundry'];
		if(Molpy.Has('AC',888)&&!Molpy.Boosts['ShadwDrgn'].unlocked&&Molpy.Got('SGC')&&Molpy.Has('Caged Logicat',100)) return [9e96,'ShadwDrgn'];
		if(Molpy.Has('AC',4000)&&!Molpy.Boosts['DQ'].unlocked&&Molpy.Got('Nest')&&Molpy.Has('Bonemeal',2000)) return [Infinity,'DQ'];
		return [0,''];
	}
	Molpy.CheckDragon=function()
	{
		var target=Molpy.DragonTarget();
		var me = Molpy.Boosts['AD'];
		if(me.Has(target[0]))
		{
			me.Spend(target[0]);
			Molpy.UnlockBoost(target[1]);
		}
	}
	
	new Molpy.Boost({name:'Cold Mould',
		desc:function(me)
		{
			
			return (me.IsEnabled? '':'When active, ') + 'Prevents all Mould Making and Filling activities.'+(me.bought?'<br><input type="Button" onclick="Molpy.GenericToggle('+me.id+')" value="'+(me.IsEnabled? 'Dea':'A')+'ctivate"></input>':'');
		},		
		IsEnabled:Molpy.BoostFuncs.BoolPowEnabled,glass:'10K',sand:'75E',castles:'15E', group:'bean',className:'toggle',icon:'coldmould'
	});
	new Molpy.Boost({name:'Price Protection',
		desc:function(me)
		{
			
			return (me.IsEnabled? '':'When active, ') + 'Prevents purchases for '+(me.bought?Molpify(me.bought):4)+'mNP after Affordable Swedish Home Furniture finishes (unless it starts again).'+(me.bought?'<br><input type="Button" onclick="Molpy.GenericToggle('+me.id+')" value="'+(me.IsEnabled? 'Dea':'A')+'ctivate"></input><br><br><input type="Button" onclick="Molpy.PriceProtectionChange(1)" value="Increase Wait"></input>'+(me.bought>1?'<br><input type="Button" onclick="Molpy.PriceProtectionChange(-1)" value="Decrease Wait"></input>':''):'');
		}
		,buyFunction:function()
		{
			me.bought=4;
		}
		,IsEnabled:Molpy.BoostFuncs.BoolPowEnabled,sand:'7500',castles:'1500', group:'hpt',className:'toggle',icon:'priceprotection'
	});
	Molpy.PriceProtectionChange=function(n)
	{
		var me=Molpy.Boosts['Price Protection'];
		if(me.bought+n==0)return;
		me.bought+=n;			
		me.Refresh();
		_gaq&&_gaq.push(['_trackEvent','Boost',(n>0?'Upgrade':'Downgrade'),me.name]);	
	}
	Molpy.ProtectingPrice=function()
	{
		return !Molpy.Got('ASHF')&&Molpy.Boosts['Price Protection'].power>1;		
	}
	
	new Molpy.Boost({name:'Crystal Dragon',desc:'Temporal Duplication makes duplicates of all Glass Tools constructed when it is active.<br>Temporal Duplication\'s countdown starts at 10mNP.',sand:Infinity,castles:Infinity,glass:'7P',group:'drac'});
	
	Molpy.TDFactor=function(buying)
	{
		if((buying||Molpy.Got('Crystal Dragon'))&&Molpy.Got('TDE'))
		{
			if(Molpy.Got('Dragon Foundry')&&Molpy.Got('GL'))
			{
				return 1+Math.floor(Molpy.Boosts['GL'].power/10000);
			}
			return 2;
		}
		return 1;
	}
	
	new Molpy.Boost({name:'Friendship is Molpish',alias:'FiM',desc:'Cuegan\'s Glass production is multiplied by the number of million LaPetites, and Lapetite\'s Glass production is multiplied by the number of million Cuegans. (Or is it Cuegen???)',glass:'750E',sand:Infinity,castles:Infinity});
	
	new Molpy.Boost({name:'Such Glass',desc:'Glass production of Buckets is multiplied by a thousandth of the Ninja Stealth level',stats:'<div class="magentatext bigtext">Very wow</div><br><div class="cyantext rightjust bigtext">Much ninja</div><br><div class="limetext bigtext">So Bucket</div>',glass:'8Z',sand:Infinity,castles:Infinity,group:'ninj'});
	
	new Molpy.Boost({name:'Dragon Forge',desc:function(me)
		{		
			var str = 'Allows you increase the power of Automata Control using Logicat Levels and Blackprint Pages.';
			if(!me.bought) return str;
			var n = Molpy.Boosts['AC'].power;
			str+='<br>Automata Assemble attempts up to '+Molpify(n,2)+' Factory Automation runs.';
			var pageCost=n*10
			var logicatCost=Math.ceil(n/20);
			if(n<Molpy.Boosts['PC'].power)
			{
				str+='<br><input type="Button" value="Increase" onclick="Molpy.ControlAutomata(20,1)"></input> the number of runs by 20 at a cost of '+Molpify(logicatCost)+' Logicat Levels and '+Molpify(pageCost,2)+' Blackprint Pages.';
			}else{
                str+='<br>It will cost '+Molpify(logicatCost)+' Logicat Levels and '+Molpify(pageCost,2)+' Blackprint Pages to increase this by 20.';
            }
			return str;
		}
		,sand:Infinity,castles:Infinity,glass:'7P',group:'drac',className:'action'});
		new Molpy.Boost({name:'Crouching Dragon, Sleeping Panther',alias:'WiseDragon',desc:function(me)
		{
			var str = 'Allows you to get Panther Poke with more remaining Caged Logicat puzzles.<br>Currently, Panther Poke is available if you have less than '+Molpify(Molpy.PokeBar()-1)+' Caged Logicat puzzles remaining.';
			if(!me.bought)return str;
			var goatCost = me.power;
			var powerReq=Math.pow(5,me.power+12);
			if(Molpy.Has('Goats',goatCost)&&Molpy.Boosts['AD'].power>=powerReq)
			{	
				str+='<br><input type="Button" value="Increase" onclick="Molpy.GainDragonWisdom(1)"></input> this by 1 (times the Panther Rush level) at a cost of '+Molpify(powerReq,3)+' Achronal Dragon power and '+Molpify(goatCost,3)+' goat'+plural(goatCost)+'.';
			}else
			{
				str+='<br>Upgrading Logicat Level by 1 will cost '+Molpify(powerReq,3)+' Achronal Dragon power and '+Molpify(goatCost,3)+' goat'+plural(goatCost)+'.';
			}
			return str;
		}
		,sand:Infinity,castles:Infinity,glass:'1Z',group:'drac',className:'action'
	});
	Molpy.GainDragonWisdom=function(n)
	{
		var me = Molpy.Boosts['WiseDragon'];
		var goatCost = me.power*n;
		var powerReq=Math.pow(5,me.power+12);
		if(Molpy.Has('Goats',goatCost)&&Molpy.Boosts['AD'].power>=powerReq)
		{
			Molpy.Spend('Goats',goatCost);
			Molpy.Boosts['AD'].power-=powerReq;
			Molpy.Notify('Dragon Widsom gained!'); //it was so tempting to write gainned :P
			me.power++;
			me.Refresh();
			_gaq&&_gaq.push(['_trackEvent','Boost','Dragon Upgrade','Logicat']);
		}
	}
	
	new Molpy.Boost({name:'Fireproof',desc:'The NewPixBots have become immune to fire. Bored of destroying infinite castles, they now make '+Molpify(1e10)+' times as many Glass Chips.<br>However they will destroy all your castles every mNP if the Navigation Code hack is not installed.<br>On the plus side, you can overcome Jamming far quicker.',sand:Infinity,castles:Infinity,glass:function(){return 8e9*Molpy.CastleTools['NewPixBot'].amount;},group:'cyb'}); //www.youtube.com/watch?v=84q0SXW781c
	
	new Molpy.Boost({name:'Ninja Ninja Duck',desc:'Ninja Stealth is raised by 10x as much'
		,sand:Infinity,castles:Infinity,glass:'230Z',group:'ninj',icon:'ninjaduck'});
		
	new Molpy.Boost({name:'Goats',desc:function(me)
		{
			var str = 'You have '+Molpify(me.Level,3)+' goat'+plural(me.Level)+'. Yay!';
			return str;
		}
		,icon:'goat',group:'stuff',defStuff:1
	});
	
	new Molpy.Boost({name:'Silver Loyalty Card',alias:'SilverCard',desc:'Affordable Swedish Home Furniture discount increased to 50% off',group:'hpt',sand:'1G'});
	new Molpy.Boost({name:'Gold Loyalty Card',alias:'GoldCard',desc:'Affordable Swedish Home Furniture discount increased to 60% off',group:'hpt',sand:'10T'});
	
	
	new Molpy.Boost({name:'Stretchable Chip Storage',desc:function(me)
		{
		return 'If active during a Blast Furnace run and there is not enough chip storage, that run is used to expand the chip storage instead'+(me.bought?'<br><input type="Button" onclick="Molpy.GenericToggle('+me.id+')" value="'+(me.IsEnabled? 'Dea':'A')+'ctivate"></input><br>':'');
		},
		IsEnabled:Molpy.BoostFuncs.BoolPowEnabled, buyFunction:function() {this.IsEnabled=1}, group:'hpt', sand:Infinity, castles:Infinity, glass:'1M',className:'toggle'});
	new Molpy.Boost({name:'Stretchable Block Storage',desc:function(me)
		{
		return 'If active during a Blast Furnace run and there is not enough block storage, that run is used to expand the block storage instead'+(me.bought?'<br><input type="Button" onclick="Molpy.GenericToggle('+me.id+')" value="'+(me.IsEnabled? 'Dea':'A')+'ctivate"></input><br>':'');
		},
		IsEnabled:Molpy.BoostFuncs.BoolPowEnabled, buyFunction:function() {this.IsEnabled=1},group:'hpt', sand:Infinity, castles:Infinity, glass:'1M',className:'toggle'});
	
	Molpy.GenericToggle=function(myid,negate)
	{
		var me = Molpy.BoostsById[myid];
		if(negate)
			me.power=-me.power||1;
		else
			me.power=1*!me.power;      
		me.Refresh();
	        if (myid <=6) Molpy.Boosts['Rob'].Refresh();
		_gaq&&_gaq.push(['_trackEvent','Boost','Toggle',me.name]);
	}
	
	new Molpy.Boost({name:'Hall of Mirrors',alias:'HoM',desc:function(me)
	{		
		return (me.IsEnabled? 'Y':'When active, y') + 'ou can win/lose Glass Chips from the Monty Haul Problem'+(me.bought?'<br><input type="Button" onclick="if(Molpy.Spend(\'Goats\',1))Molpy.GenericToggle('+me.id+',1)" value="'+(me.IsEnabled? 'Dea':'A')+'ctivate"></input> (costs 1 Goat to toggle)':'');
	},
	buyFunction:function(){this.IsEnabled=1;},className:'toggle',
	IsEnabled:Molpy.BoostFuncs.PosPowEnabled,sand:'1P',castles:'1T',glass:'1K'});
	new Molpy.Boost({name:'Stealth Cam',desc:'Camera is activated when Ninja Stealth is increased',glass:'1M',group:'ninj'});
	new Molpy.Boost({name:'Ninja Lockdown',
		desc:function(me)
		{			
			return (me.IsEnabled? '':'When active, ') + 'Prevents Ninja Stealth multipliers greater than 3x, and when toggled, locks Impervious Ninja if it is owned.'+(me.bought?'<br><input type="Button" onclick="Molpy.GenericToggle('+me.id+'); Molpy.LockBoost(\'Impervious Ninja\');" value="'+(me.IsEnabled? 'Dea':'A')+'ctivate"></input>':'');
		},
		IsEnabled:Molpy.BoostFuncs.BoolPowEnabled,glass:'144Y',group:'ninj',logic:700});
	new Molpy.Boost({name:'Magic Mirror',desc:'Allows jumps between every discovery and the equivalent place in the Minus World',glass:'1L',group:'chron'});
	new Molpy.Boost({name:'Locked Vault',
		desc:function(me){
			if(!me.bought) return 'Contains Loot';
			return (5-me.bought)+' lock'+plural(5-me.bought)+' left to grab the loot!'
		},
		sand:Infinity,
		castles:Infinity,
		glass:'150M',logic:5,className:'action',
		lockFunction:function()
		{
			if (!this.power) this.power=10;
			Molpy.Add('Blackprints',this.power++);
			if(Molpy.Got('Camera'))
			{
				for(var i=0;i<10;i++)
				{
					Molpy.EarnBadge('discov'+Math.ceil(Molpy.newpixNumber*Math.random()));
				}
			}
		}
	});
	new Molpy.Boost({name:'Vault Key',desc:'Helps open a locked vault',glass:'5M',
		buyFunction:function()
		{
			Molpy.LockBoost(this.alias);
			var lv = Molpy.Boosts['Locked Vault'];
			if(!lv.unlocked)
			{			
				Molpy.UnlockBoost(lv.alias);
			}
			lv.buy();
			if(lv.bought)
			{
				lv.bought++;
				if(lv.bought<5)
				{
					if(!Molpy.boostSilence)Molpy.Notify('One less lock on the vault');
				}
				else
					Molpy.LockBoost(lv.alias);
			}else{
				lv.buy();
			}
		}
	});
	
	new Molpy.Boost({name:'People Sit on Chairs',alias:'PSOC',desc:'Multiplies <b>all</b> rates by 1, then adds 0',stats:'Administrivia',logic:420});
	new Molpy.Boost({name:'No Need to be Neat',desc:'When you Molpy Down, the amount of one random type of tool is not reset to 0',glass:'50M'});
	new Molpy.Boost({name:'Thunderbird',desc:'If Glassed Lightning (with Lightning Rod) strikes during Temporal Duplication, its power is increased by 50%',glass:'50W',group:'drac'});
	new Molpy.Boost({name:'Dragon Foundry',desc:'Crystal Dragon\'s effect is multiplied by 1% of Glassed Lightning',stats:'Remember to power up Glassed Lightning with Thunderbird, or else this will have a detrimental effect on Temporal Duplication!',sand:Infinity,castles:Infinity,glass:'70WW',group:'drac'});
	new Molpy.Boost({name:'Lucky Twin',desc:'When you are awarded Not Lucky during Temporal Duplication, the countdown is increased by 20%',sand:Infinity,castles:Infinity,glass:'70H'});
	new Molpy.Boost({name:'Beret Guy',desc:'You may choose to take a revealed Goat',stats:'...and my yard has so much grass, and I\'ll teach you tricks, and...',glass:'20T'});
	
	new Molpy.Boost({name:'Crystal Flux Turbine',alias:'CFT',desc:'The Flux Turbine bonus is applied to Glass Sand Tools',glass:'6.05GW',group:'chron'});
	new Molpy.Boost({name:'Shadow Dragon',alias:'ShadwDrgn',
		desc:function(me)
		{
			var str='Puts unused Caged Logicat puzzles to some use.';
			if(!me.bought)return str;
			if(Molpy.Has('Caged Logicat',100))
			{
				str+='<br><input type="Button" value="Deal" onclick="Molpy.ShadowStrike(1)"></input> with the Caged Logicat infestation...';
			}else
			{
				str+='<br>A minimum level of 100 Caged Logicat puzzles is required to use Shadow Dragon.';
			}
			return str;
		}
		,glass:'12WW',group:'drac',className:'action'
	});
	Molpy.ShadowStrike=function()
	{
		var l = Molpy.Level('Caged Logicat')/100;
		var n = Math.ceil(l);
		var p = n-l;
		if(Math.random()<p*p)n = 1;
		Molpy.Notify('You turned '+Molpify(Molpy.Level('Caged Logicat'))+' Caged Logicat puzzles into '+Molpify(n)+' Bonemeal.',1);
		Molpy.Add('Bonemeal',n);
		Molpy.Spend('Caged Logicat',Molpy.Level('Caged Logicat'));
	}

	Molpy.spendSandNotifyFlag=1;
	Molpy.spendSandNotifyCount=0;
	new Molpy.Boost({name:'Sand',
		Level:[function(){return Molpy.sand;},function(amount){Molpy.sand=amount;this.Refresh();}],
		Add:Molpy.Dig,
		Spend:function(amount,silent)
		{
			if(!amount)return;
			Molpy.sand-=amount;
			if(Molpy.sand<0)Molpy.sand=0;
			Molpy.sandSpent+=amount;
			if((isFinite(Molpy.sand)||!isFinite(amount)))
			{
				if(!silent&&Molpy.spendSandNotifyFlag)
				{
					if(Molpy.spendSandNotifyCount)
					{
						amount+=Molpy.spendSandNotifyCount;
						Molpy.spendSandNotifyCount=0;
					}				
					if(amount){
						if(amount >= Molpy.sand/10000000)
							Molpy.Notify('Spent Sand: ' + Molpify(amount,3),1);
						else
						{
							Molpy.spendSandNotifyCount+=amount;
							return 1;
						}
					}
				}else{
					Molpy.spendSandNotifyCount+=amount;
					return 1;
				}
			}
		},
		Has:Molpy.BoostFuncs.Has,
		desc:function(me){return Molpify(me.Level,3);}
		,group:'stuff'
	});
	
	Molpy.destroyNotifyFlag=1;
	Molpy.destroyNotifyCount=0;
	new Molpy.Boost({name:'Castles',
		Level:[function(){return Molpy.castles;},function(amount)
		{
			Molpy.castles=amount;
			this.Refresh();
			Molpy.Boosts['Time Travel'].Refresh();
		}],
		Add:Molpy.Build,
		Spend:function(amount,silent)
		{
			if(!amount)return;
			amount = Math.min(amount,Molpy.castles);
			Molpy.castles-=amount;
			Molpy.castlesSpent+=amount;
			if(isNaN(Molpy.castles))
			{
				Molpy.castles=0;
				Molpy.EarnBadge('Mustard Cleanup');
			}
			if(!silent&&(isFinite(Molpy.castles)||!isFinite(amount)))
				Molpy.Notify('Spent Castles: ' + Molpify(amount,3),1);
		},
		Destroy:function(amount,logsilent)
		{
			amount = Math.min(amount,Molpy.castles);
			Molpy.castles-=amount;
			Molpy.castlesDestroyed+=amount;
			if(Molpy.destroyNotifyFlag)
			{
				if(Molpy.destroyNotifyCount)
				{
					amount+=Molpy.destroyNotifyCount;
					Molpy.destroyNotifyCount=0;
				}				
				if(amount){
					if(amount >= Molpy.castles/10000000)
						Molpy.Notify(amount==1?'-1 Castle':Molpify(amount,3)+ ' Castles Destroyed',!logsilent);
					else
					{
						Molpy.destroyNotifyCount+=amount;
						return 1;
					}
				}
			}else{
				Molpy.destroyNotifyCount+=amount;
				return 1;
			}
			//destroying is done by trebuchets and stuff: it's different to spending
		},
		Has:Molpy.BoostFuncs.Has,
		desc:function(me){return Molpify(me.Level,3);}
		,group:'stuff'
	});	
	
	Molpy.AwardPrize=function(l)
	{
		l=l||0;
		if(l>=Molpy.prizes.length)return;
		var availRewards =[];
		for(var i in Molpy.prizes[l])
		{
			var d = Molpy.Boosts[Molpy.prizes[l][i]];
			if(!d.unlocked)availRewards.push(d);
		}
		if(availRewards.length>0)
		{
			Molpy.UnlockBoost(GLRschoice(availRewards).alias);
		}else{
			Molpy.AwardPrize(l+1);
		}
	}
	
	Molpy.TierFunction=function(tier,cost)
	{
		return function(use)
		{
			if(use=='low')return tier;
			if(use=='high')return tier+1;
			if(use=='show')return Molpify(tier)+' or tier L'+Molpify(tier+1)+' at a cost of '+Molpy.PriceString(cost);
			if(use=='spend')return tier+Molpy.Spend(cost);
			return tier+Molpy.Has(cost);
		}
	}
	
	new Molpy.Boost({name:'Bag of Holding',alias:'BoH',desc:'Stuff isn\'t reset when you Molpy Down, at a cost of 10 Bonemeal',
		glass:Infinity,sand:Infinity,castles:Infinity,className:'alert',prizes:2,tier:Molpy.TierFunction(0,{Bonemeal:20}),group:'prize'});	
	new Molpy.Boost({name:'Bonemeal',desc:function(me)
		{
			var str = 'You have '+Molpify(me.Level,3)+' bonemeal.';
			return str;
		}
		,icon:'bonemeal',group:'stuff',defStuff:1
	});
	new Molpy.Boost({name:'Wisdom of the Ages',alias:'WotA',
		Level:[function()
		{
			return this.bought*Math.max(-9,Math.ceil(0.2*(Math.abs(Molpy.newpixNumber)-this.power)));
		},
		function(){}],
		desc:function(me)
		{
			return 'Lets you keep more leftover Caged Logicat puzzles as Time progresses.<br>Currently you can start an ONG with a maximum of '+Molpify(10+me.Level)+' Caged Logicat puzzles.';
		},
		stats:'Protip: Temporal Rifts don\'t affect Caged Logicat puzzles',
		unlockFunction:function(){this.power=Math.abs(Molpy.newpixNumber);}
	});
	
	new Molpy.Boost({name:'Draft Dragon',
		desc:function(me)
		{
			return (me.IsEnabled? 'C':'When active, c') + 'auses sand/glass monument production to proceed automatically after you start making a mould.'+(me.bought?'<br><input type="Button" onclick="Molpy.GenericToggle('+me.id+');" value="'+(me.IsEnabled? 'Dea':'A')+'ctivate"></input>':'');
		},buyFunction:function(){this.IsEnabled=1;},
		IsEnabled:Molpy.BoostFuncs.BoolPowEnabled,
		group:'drac',className:'toggle',glass:'50F'
	});	
	new Molpy.Boost({name:'Mustard',
		desc:function(me)
		{
			var str = 'You have '+Molpify(me.Level,3)+' mustard.';
			return str;
		}
		,icon:'mustard',group:'stuff',defStuff:1,
		AddSuper:Molpy.BoostFuncs.Add,
		Add:function(amount)
		{
			this.AddSuper(amount);
			if(!Molpy.Boosts['Mustard Sale'].unlocked&&Molpy.Spend(this.alias,2000))
			{
				Molpy.UnlockBoost('Mustard Sale');
			}
		}
	});
	new Molpy.Boost({name:'Mysterious Maps',alias:'Maps',
		desc:function(me)
		{
			var str = 'You have '+Molpify(me.Level,3)+' map'+plural(me.Level);
			if(Molpy.Got('DNS')||!me.bought)
			{
				return str+'.';
			}
			str+=' out of 200.';
			if(me.bought>-1 || Molpy.EnoughMonumgForMaps()&&Molpy.RandomiseMap())
			{
				str+='<br>The next map can be found at NP '+me.bought;
			}else{
				str+='<br>You must construct additional Glass Monuments before you are able to decypher the next map.';
			}
			return str;
		},
		stats:function(me){return me.desc(me)+'<br>You need to ninja-unstealth to find a map.';}
		,buyFunction:Molpy.RandomiseMap
		,icon:'maps',group:'stuff',defStuff:1
	});
	Molpy.EnoughMonumgForMaps=function()
	{
		return Molpy.groupBadgeCounts.monumg>Molpy.Level('Maps')*5+Molpy.mapMonumg;
	}
	Molpy.ClearMap=function()	
	{
		if(Molpy.EnoughMonumgForMaps())
		{
			Molpy.RandomiseMap();
		}else{
			Molpy.Boosts['Maps'].bought=-1
		}
		Molpy.Boosts['Maps'].Refresh();
	}
	
	Molpy.RandomiseMap=function()	
	{
		var np;
		while((np = Math.ceil(Math.random()*Molpy.highestNPvisited)*(Math.random()>.5?1:-1))==Molpy.newpixNumber);
		Molpy.Boosts['Maps'].bought=np;
		return 1;
	}
	
	new Molpy.Boost({name:'Dragon Nesting Site',alias:'DNS',
		desc:function(me){return 'You have found the location of an ancient dragon nesting site.'+(Molpy.Got('Nest')?'':'<br>Now to figure out how to build the nest...');},
		group:'drac'
	});
	new Molpy.Boost({name:'Dragon Nest',alias:'Nest',
		desc:function(me){return 'This is a dragon nest.'+(Molpy.Got('DQ')?'':'<br>To obtain a queen, you need Automata Control of at least 4000, and 2000 Bonemeal.');},
		group:'drac',sand:Infinity,castles:Infinity,glass:Infinity
	});
	new Molpy.Boost({name:'Dragon Queen',alias:'DQ',
		desc:function(me){return 'The queen of the dragons.';},
		group:'drac',sand:Infinity,castles:Infinity,glass:Infinity,
		buyFunction:function()
		{
			if(!Molpy.Spend('Bonemeal',2000))Molpy.LockBoost(this.alias);
		}
	});
	new Molpy.Boost({name:'Dragon Eggs',alias:'Eggs',
		desc:function(me)
		{
			var str = 'You have '+Molpify(me.Level,3)+' egg'+plural(me.Level);
			return str+'.';
		}
		,icon:'egg',group:'drac',defStuff:1
	});
	new Molpy.Boost({name:'Dragon Hatchlings',alias:'Hatchlings',
		desc:function(me)
		{
			var str = 'You have '+Molpify(me.Level,3)+' hatchlings'+plural(me.Level);
			return str+'.';
		}
		,icon:'hatchlings',group:'drac',defStuff:1
	});
		
	new Molpy.Boost({name:'Glass Goat',desc:'Glass produced by Glass Furnace/Blower is multiplied by the number of Goats you have, if any.',
		sand:'5M',castles:'20K',prizes:1,tier:1,group:'prize'});
	new Molpy.Boost({name:'Bone Clicker',desc:'Sand and Glass Chips from clicking are multliplied by the amount of Bonemeal you have, if any.',
		sand:'5K',castles:12,group:'prize',prizes:1,tier:1});
	new Molpy.Boost({name:'Double Department',desc:Molpy.redactedWords+' activate the DoRD twice when they would activate it once.',
		sand:'70M',castles:'50K',group:'prize',prizes:2,tier:1});
	new Molpy.Boost({name:'Spare Tools',desc:'Every dig-click builds you a free random tool',
		sand:'2G',castles:'7M',group:'prize',prizes:1,tier:1});
	new Molpy.Boost({name:'Doubletap',desc:'Every dig-click counts twice.',sand:'1K',castles:6,group:'prize',prizes:2,tier:1});
	new Molpy.Boost({name:'Single Double',
		desc:function(me)
		{
			return 'Builds the amount of castles you have.<br>(Single use only)'+(me.bought?'<br><input type="Button" onclick="Molpy.Add(\'Castles\',Molpy.Level(\'Castles\'));Molpy.LockBoost(\'Single Double\');" value="Use"></input>':'');
		},
		sand:'80K',castles:500,group:'prize',prizes:1,tier:1,className:'action'
	});
	new Molpy.Boost({name:'Sandblast',
		desc:function(me)
		{
			return 'Recieve 1M sand per Badge you own.<br>(Single use only)'+(me.bought?'<br><input type="Button" onclick="Molpy.Add(\'Sand\',Molpy.BadgesOwned*1000000);Molpy.LockBoost(\'Sandblast\');" value="Use"></input>':'');
		},
		sand:100,castles:2,group:'prize',prizes:1,tier:1,className:'action'
	});
	new Molpy.Boost({name:'Short Saw',desc:'VITSSÅGEN, JA! occurs 5 times as often',sand:'5T',castles:'40G',group:'prize',prizes:1,tier:1});
	new Molpy.Boost({name:'Gruff',desc:'When you win the Monty Haul prize, you get 2 goats',sand:'2P',castles:'75T',group:'prize',prizes:1,tier:2});
	new Molpy.Boost({name:'Between the Cracks',alias:'Cracks',desc:'If you have infinite Sand production, Boost boost purchases do not spend any Sand or Castles',
		sand:'15E',castles:'80P',group:'prize',prizes:1,tier:2});
	new Molpy.Boost({name:'Soul Drain',desc:'Shadow Dragon has a 10% chance of producing bonemeal when Not Lucky occurs',
		sand:'60G',castles:'290M',group:'prize',prizes:1,tier:2});
	new Molpy.Boost({name:'Rush Job',desc:'Mysterious Representations produces Blackprints 5 times as fast',
		sand:'50E',castles:'600P',glass:'400K',group:'prize',prizes:1,tier:2});
	new Molpy.Boost({name:'Void Goat',desc:'Travel through a Temporal Rift yields a Goat if you have Flux Surge',
		sand:'40Z',castles:'900E',glass:'50K',group:'prize',prizes:1,tier:2});
	new Molpy.Boost({name:'Factory Expansion',desc:'More Factory Automation levels are available through Rosetta',
		sand:'85Y',castles:'25Z',glass:'10M',group:'prize',prizes:1,tier:2});
	new Molpy.Boost({name:'Mustard Automation',desc:'Automata Assemble can run with Mustard Tools, at a cost of 20 Mustard per run',glass:'70G',group:'prize',prizes:1,tier:2});
	new Molpy.Boost({name:'Musical Chairs',desc:'Doubles the effect of People Sit on Chairs',glass:'40P',group:'prize',prizes:2,tier:2});
	new Molpy.Boost({name:'Glass Trolling',desc:'If you type "OK, GLASS" into the import box, the cost of making Glass Blocks from Glass Chips is reduced by a factor of 5 until the next ONG',glass:'500',group:'prize',prizes:1,tier:2});
	new Molpy.Boost({name:'Fast Forward',
		desc:function(me)
		{
			return 'Go directly to the highest NewPix visited. Do not pass Go. Do not collect 200 goats.<br>(Single use only)'+(me.bought?'<br><input type="Button" onclick="Molpy.FastForward()" value="Use"></input>':'');
		},
		sand:'17F',castles:'90S',glass:'40G',group:'prize',prizes:1,tier:2,className:'action'
	});
	Molpy.FastForward=function()
	{
		Molpy.newpixNumber=Molpy.highestNewpixvisited;
		Molpy.UpdateBeach();
		Molpy.HandlePeriods();
		Molpy.LockBoost('Fast Forward');
		Molpy.Add('Goats',1);
	}
	new Molpy.Boost({name:'Archimedes\'s Lever',alias:'Archimedes',
		desc:'If a Monument Maker is idle, it will start making the cheapest monument available at a cost of 10 Bonemeal.',
		stats:'Only makes Minus Monuments if you are in Minus NewPix.<br>',glass:'360W',group:'prize',prizes:1,tier:3});
	
	new Molpy.Boost({name:'Would have been useful a month ago',alias:'Month',
		desc:function(me)
		{
			return 'Instantly win the game.<br>(Single use only)'+(me.bought?'<br><input type="Button" onclick="'+Molpy.BeanishToCuegish(Molpy.wintext)+';Molpy.LockBoost(\'Month\');" value="Use"></input>':'');
		},
		glass:'40WW',group:'prize',prizes:2,tier:3,className:'action'
	});

	new Molpy.Boost({name:'Mustard Sale',
		desc:function(me)
		{
			return 'Set the amount of a random Tool to 0 owned at a cost of 500 Mustard.'+(me.bought?'<br><input type="Button" onclick="Molpy.MustardSale();" value="Use"></input>':'');
		},glass:'2M',className:'action'
	});
	Molpy.MustardSale=function()
	{
		if(Molpy.Spend('Mustard',500))
		{
			var tool=GLRschoice(Molpy.tfOrder);
			tool.amount=0;
			tool.temp=0;
			tool.Refresh();
			Molpy.Notify('Reset '+tool.name);
		}
	}

	new Molpy.Boost({name:'Robotic Shopper',alias:'Rob',
		desc:function(me)
		{
			if (!me.bought) return "An advanced shopping assistant, with more control and able to shop for many things";
			var large = (me.power &2);
			var str = '';
			if (!large) str += '<small>';
			str += 'Shop for me <input '+(large?'':'class=smallbutton ')+'type=button onclick="Molpy.ToggleBit('+(me.id)+',0)" value="'+((me.power&1)?'in ASHF only':'Always')+'"></input>';
			str += '<br><input '+(large?'':'class=smallbutton ')+'type=button onclick="Molpy.ToggleBit('+(me.id)+',1)" value="'+((me.power&2)?'Small Size text':'Normal Size text')+'"></input>';

			for (thingy = 0; thingy <= me.bought; thingy++)
			{
				var item=Molpy.BoostsById[thingy+1];
				if (item.power) {
					str += '<br><a onclick="Molpy.ChooseShoppingItem('+(thingy+1)+')">'+Molpy.BoostsById[Math.abs(item.power)].name+'</a> ';
					str += '<input '+(large?'':'class=smallbutton ')+'type=button value="'+(item.power<0?'Off':'On')+'" onclick="Molpy.GenericToggle('+(thingy+1)+',1)" </input>';
				} else {
					str += '<br><a onclick="Molpy.ChooseShoppingItem('+(thingy+1)+')">Not currently used</a>';
				}
			}
			if (Molpy.Boosts['AC'].power >= 500*Math.pow(2,me.bought) && me.bought<5)
			{
				str += '<br><input '+(large?'':'class=smallbutton ')+'type=button onclick="Molpy.Robot_Upgrade()" value="Upgrade"></input> Costs Infinite Glass';
			}
			if (!large) str += "</small>";
			return str;
		},
		sand:Infinity,castles:Infinity,glass:Infinity,group:'cyb',class:'action'
	});

	Molpy.Robot_Upgrade=function() {
		me = Molpy.Boosts['Rob'];
		if (Molpy.Spend('GlassBlocks',Infinity)) {
			me.bought++;
			Molpy.BoostsById[me.bought+1].power = 0;
			Molpy.Notify('Robotic Shopper upgraded');
			Molpy.Boosts['Rob'].Refresh();
		}
	}
	Molpy.ToggleBit=function(myid,bit) {
		Molpy.BoostsById[myid].power ^= (1<<bit);
		Molpy.Boosts['Rob'].Refresh();
	}
	
	new Molpy.Boost({name:'Eww',
		desc:function(me)
		{
			return 'Convert 1K Mustard into 20 Bonemeal'+(me.bought?'<br><input type="Button" onclick="if(Molpy.Spend(\'Mustard\',1000))Molpy.Add(\'Bonemeal\',5)" value="Use"></input>':'');
		},
		glass:'789G',sand:'2W',group:'prize',prizes:1,tier:3,className:'action'
	});
	
	new Molpy.Boost({name:'GoatONG',
		desc:function(me)
		{
			return 'Spend a Goat and cause an ONG<br>(Single use only)'+(me.bought?'<br><input type="Button" onclick="if(Molpy.Spend(\'Goat\',1))Molpy.ONG();Molpy.LockBoost(\'GoatONG\')" value="Use"></input>':'');
		},
		glass:'789G',sand:'2W',group:'prize',prizes:1,tier:3,className:'action'
	});
	
	new Molpy.Boost({name:'Mustard Injector',
		desc:function(me)
		{
			return 'Spend 200 Mustard to convert a random tool to Mustard'+(me.bought?'<br><input type="Button" onclick="Molpy.MustardInjector()" value="Use"></input>':'');
		},
		sand:Infinity,castles:'50GW',group:'prize',prizes:1,tier:3,className:'action'
	});
	Molpy.MustardInjector=function()
	{
		if(Molpy.Spend('Mustard',200))
		{
			var tool=GLRschoice(Molpy.tfOrder);
			tool.amount=NaN;
			tool.temp=0;
			tool.Refresh();
			Molpy.Notify('Mustarded '+tool.name);
		}
	}
	
	new Molpy.Boost({name:'Crunchy with Mustard',alias:'Crunch',
		desc:function(me)
		{
			return 'Pay 5K Mustard to reset your '+Molpy.redactedWord+' click count to 0 and gain 1 Bonemeal per 20'+(me.bought?'<br><input type="Button" onclick="Molpy.RedactedCrunch()" value="Use"></input>':'');
		},
		castles:Infinity,glass:'800SW',group:'prize',prizes:1,tier:3,className:'action'
	});
	Molpy.RedactedCrunch=function()
	{
		if(Molpy.Spend('Mustard',5000))
		{
			Molpy.Add('Bonemeal',Math.floor(Molpy.redactedClicks/20));
			Molpy.redactedClicks=0;
			Molpy.Notify('Crunch!');
		}
	}
	new Molpy.Boost({name:'Bag of Moulding',alias:'BoM',desc:'Mould Boosts (apart from Prizes) aren\'t reset when you Molpy Down, at a cost of 100 Bonemeal',
		glass:Infinity,sand:Infinity,castles:Infinity,className:'alert',prizes:2,tier:Molpy.TierFunction(1,{Bonemeal:200,Mustard:500,Blackprints:20}),group:'prize'});	
	new Molpy.Boost({name:'Bag of Folding',alias:'BoF',desc:'Toggle Boosts (apart from Prizes) aren\'t reset when you Molpy Down, at a cost of 1000 Bonemeal',
		glass:Infinity,sand:Infinity,castles:Infinity,className:'alert',prizes:2,tier:Molpy.TierFunction(2,{Bonemeal:3000,Goats:30,Blackprints:500}),group:'prize'});	
		
	//END OF BOOSTS, add new ones immediately before this comment
}
