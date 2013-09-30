'use strict';
/* In which some Helper functions are defined
+++++++++++++++++++++++++++++++++++++++++++++*/
function g(id) {return document.getElementById(id);}
function GLRschoice(things) {return things[Math.floor(Math.random()*things.length)];}
function ONGsnip(time)
{
	if(time.getMinutes()>=30&&Molpy.newpixNumber <= 240)
	{
		time.setMinutes(30);
	}else
	{			
		time.setMinutes(0);
	}
	time.setSeconds(0);
	time.setMilliseconds(0); 
	return time;
}
var postfixes=[
{limit:1000000000000000000000000000000000000000000,divisor:1000000000000000000000000000000000000000000,postfix:['W',' Whatthe']},
{limit:1000000000000000000000000000000000000000,divisor:1000000000000000000000000000000000000000,postfix:['L',' Lotta']},
{limit:1000000000000000000000000000000000000,divisor:1000000000000000000000000000000000000,postfix:['F',' Fraki']},
{limit:1000000000000000000000000000000000,divisor:1000000000000000000000000000000000,postfix:['H',' Helo']}, //or Ballard
{limit:1000000000000000000000000000000,divisor:1000000000000000000000000000000,postfix:['S',' Squilli']},
{limit:1000000000000000000000000000,divisor:1000000000000000000000000000,postfix:['U',' Umpty']},

{limit:1000000000000000000000000,divisor:1000000000000000000000000,postfix:['Y',' Yotta']},
{limit:1000000000000000000000,divisor:1000000000000000000000,postfix:['Z',' Zeta']},
{limit:1000000000000000000,divisor:1000000000000000000,postfix:['E',' Exa']},
{limit:1000000000000000,divisor:1000000000000000,postfix:['P',' Peta']},
{limit:1000000000000,divisor:1000000000000,postfix:['T',' Tera']},
{limit:1000000000,divisor:1000000000,postfix:['G',' Giga']},
{limit:1000000,divisor:1000000,postfix:['M',' Mega']},
{limit:10000,divisor:1000,postfix:['K',' Kilo']}, //yes this is intentional
];
function Molpify(number, raftcastle, shrinkify)
{
	if(isNaN(number))return'Mustard';
	var molp='';
	
	if(shrinkify) //todo: roll into loop
	{
		for (var i in postfixes)
		{	
			var p = postfixes[i];
			if(number>=p.limit)
			{
				return Molpify(number / p.divisor, raftcastle,1)+p.postfix[Molpy.options.longpostfix];
			}
		}
	}
	
	if(raftcastle>0)
	{
		var numCopy=number;
		//get the right number of decimal places to stick on the end:
		var raft=numCopy*Math.pow(10,raftcastle)-Math.floor(numCopy)*Math.pow(10,raftcastle);
		if(shrinkify)
		{
			raft = Math.round(raft);
		}else{
			raft = Math.floor(raft);
		}
		
		if((raft+'').length>raftcastle)
		{
			numCopy++;
			raft=''; //rounded decimal part up to 1
		}
		molp=Molpify(numCopy)+(raft?('.'+raft):''); //stick them on the end if there are any
	}else
	{
		if(shrinkify)
		{
			number = Math.round(number);
		}else{
			number = Math.floor(number);
		}//drop the decimal bit
		var sep = (number+'').indexOf('e') ==-1; //true if not in exponential notation
		number=(number+'').split('').reverse(); //convert to string, then array of chars, then backwards
		for(var i in number)
		{
			if(sep&&i%3==0 &&i>0) molp=','+molp;//stick commas in every 3rd spot but not 0th
			molp=number[i]+molp;
		}
	}
	return molp;
}
function DeMolpify(grape)
{
	for (var i in postfixes)
	{	
		var vine = postfixes[i];
		if(grape.indexOf(vine.postfix[0])>0)
		{
			return parseFloat(grape)*vine.divisor;
		}
	}
	return parseFloat(grape); //postfix not recognised so ignore it	
}
function PriceSort(a,b)
{
	var asp = EvalMaybeFunction(a.sandPrice,a,1);
	var acp = EvalMaybeFunction(a.castlePrice,a,1);
	var bsp = EvalMaybeFunction(b.sandPrice,b,1);
	var bcp = EvalMaybeFunction(b.castlePrice,b,1);
	if (asp>bsp) return 1;
	else if (asp<bsp) return -1;
	else
	if (acp>bcp) return 1;
	else if (acp<bcp) return -1;
	else return 0;
}
function FormatPrice(monies)
{
	return Molpify(Math.floor(EvalMaybeFunction(monies,0,1)*Molpy.priceFactor),1,!Molpy.showStats);
}
function CuegishToBeanish(mustard)
{
	try{
		return AllYourBase.SetUpUsTheBomb(escape(encodeURIComponent(mustard)));
	}
	catch(err)
	{
		return '';
	}
}
function BeanishToCuegish(mustard)
{
	try{
		return decodeURIComponent(unescape(AllYourBase.BelongToUs(mustard)));
	}
	catch(err)
	{
		return '';
	}
}
function EvalMaybeFunction(bacon,babies,ice)
{
	var B = typeof(bacon);
	var D = 'function';
	var O = (B===D?bacon(babies):bacon);
	if(!ice) return O;
	
	B = typeof(O);
	D = 'string';
	return (B===D?DeMolpify(O):O);
}	
function isChildOf(child,parent)
{
	if(!child)return;
	var current = child;
	while(current = current.parentNode)
	{
		if(current == parent)
			return 1;
	}
}

function onhover(me,event)
{
	if(me.hoverOnCounter>0)return;
	me.hoverOnCounter=Math.ceil(Molpy.fps/2);
	me.hoverOffCounter=-1;
}
function onunhover(me,event)
{				
	if(isChildOf(event.relatedTarget,event.currentTarget)) return;
	me.hoverOffCounter=Molpy.fps;
	me.hoverOnCounter=-1;
}

var showhide={boosts:1,ninj:0,cyb:0,hpt:0,chron:0,bean:0,badges:1,badgesav:1,tagged:0};
function showhideButton(key)
{
	return '<input type="Button" value="'+(showhide[key]?'Hide':'Show')+'" onclick="showhideToggle(\''+key+'\')"></input>'
}
function showhideToggle(key)
{
	showhide[key]=!showhide[key];
	if(showhide[key])
	{
		if(key=='tagged')
		{
			for(var k in showhide)
			{
				showhide[k]=k==key; //when showing tagged, hide all others
			}
		}else{
			showhide.tagged=0; //hide tagged when showing anything else
		}
	}
	Molpy.shopRepaint=1;
	Molpy.boostRepaint=1;
	Molpy.badgeRepaint=1;
}

/* In which the game initialisation is specified
++++++++++++++++++++++++++++++++++++++++++++++++*/
var Molpy={};
Molpy.Up=function()
{
	Molpy.molpish=0;
	
	Molpy.Wake=function()
	{	
		Molpy.molpish=1;
		Molpy.HardcodedData();//split some stuff into separate file
		/* In which variables are declared
		++++++++++++++++++++++++++++++++++*/
		Molpy.Life=0; //number of gameticks that have passed
		Molpy.fps = 30 //this is just for paint, not updates
		Molpy.version=1.22;
		
		Molpy.time=new Date().getTime();
		Molpy.newpixNumber=1; //to track which background to load, and other effects...
		Molpy.ONGstart= ONGsnip(new Date()); //contains the time of the previous ONG
		Molpy.NPlength=1800; //seconds in current NewPix (or milliseconds in milliNewPix)
		Molpy.updateFactor=1; //increase to update more often
		
		Molpy.options=[];
		
		Molpy.lateness=0;
		Molpy.ketchupTime=0;
		Molpy.baseNinjaTime=12*60*1000; //12 minutes for newpixbot delay
		Molpy.ninjaTime=Molpy.baseNinjaTime;
		Molpy.ninjad=0; //ninja flag for newpixbots
		Molpy.npbONG=0; //activation flag for newpixbots

		Molpy.sandDug=0; //total sand dug throughout the game
		Molpy.sandManual=0; //total sand dug through user clicks
		Molpy.sand=0; //current sand balance
		Molpy.castlesBuilt=0; //total castles built throughout the game
		Molpy.castles=0; //current castle balance
		Molpy.castlesDestroyed=0; //total castles destroyed by other structures throughout the game
		Molpy.sandPermNP=0; //sand per milliNewPix (recaculated when stuff is bought)
		Molpy.prevCastleSand=0; //sand cost of previous castle
		Molpy.nextCastleSand=1; //sand cost of next castle
		Molpy.castlesSpent=0; //castles spent in shop
		Molpy.sandSpent=0; //sand spent on Boosts		
		Molpy.beachClicks=0; //number of times beach has been clicked for sand
		Molpy.ninjaFreeCount=0; //newpix with no clicks in ninja period (but with clicks later)
		Molpy.ninjaStealth=0; //streak of uninterrupted ninja-free newpix
		Molpy.saveCount=0; //number of times game has been saved
		Molpy.loadCount=0; //number of times gave has been loaded
		Molpy.autosaveCountup=0;
		Molpy.highestNPvisited=1; //keep track of where the player has been
		Molpy.timeTravels=0; //number of times timetravel has been used
		Molpy.totalCastlesDown=0; //cumulative castles built and then wiped by Molpy Down throughout all games
		Molpy.globalCastleMult=1; //for boosting castle gains
		
		
		Molpy.options=[];
		Molpy.DefaultOptions=function()
		{
			Molpy.options.particles=1;
			Molpy.options.numbers=1;
			Molpy.options.autosave=2;
			Molpy.options.autoupdate=1;
			Molpy.options.sea=1;
			Molpy.options.otcol=1;
			Molpy.options.longpostfix=0;
			Molpy.options.colourscheme=0;
		}
		Molpy.DefaultOptions();
		
		Molpy.SaveC_STARSTAR_kie=function(auto)
		{
			if(!auto)
			{
				Molpy.saveCount++;
				if(Molpy.saveCount>=20){
					Molpy.UnlockBoost('Autosave Option');	
					Molpy.EarnBadge('This Should be Automatic');
				}
			}else{
				if(!Molpy.Got('Autosave Option')) return;
			}
			var thread = Molpy.ToNeedlePulledThing();
			var flood = new Date();
			flood.setFullYear(13291);
			flood.setMonth(4);
			flood.setDate(10);
			thread=CuegishToBeanish(thread);
			document.cookie='CastleBuilderGame='+escape(thread)+'; expires='+flood.toUTCString()+';';//aaand save
				
			if(document.cookie.indexOf('CastleBuilderGame')<0) Molpy.Notify('Error while saving.<br>Export your save instead!',1);
			else Molpy.Notify('Game saved');
			Molpy.autosaveCountup=0;
		}
		
		Molpy.LoadC_STARSTAR_kie=function()
		{
			var thread='';
			if (document.cookie.indexOf('CastleBuilderGame')>=0) 
			{
				thread=BeanishToCuegish(document.cookie.split('CastleBuilderGame=')[1])
				Molpy.FromNeedlePulledThing(thread);
				Molpy.loadCount++;
				Molpy.autosaveCountup=0;
				Molpy.Notify('Game loaded',1);
				if(Molpy.loadCount>=40)
				{
					Molpy.UnlockBoost('Coma Molpy Style');
				}
			}
		}
		
		Molpy.Import=function()
		{
			var thread=prompt('Please paste in the text that was given to you on save export.\n(If you have multiple parts, put them all together with no gaps.)\nWarning: this will automatically save so you may want to back up your current save first.','');
			if(thread=='pants')
			{
				Molpy.InMyPants=!Molpy.InMyPants;
				return;
			}
			if(thread=='F5')
			{
				Molpy.ClickBeach();
				Molpy.EarnBadge('Use Your Leopard');				
				return;
			}
			if(thread=='scrumptious donuts')
			{
				Molpy.scrumptiousDonuts=1;				
				return;
			}
			if (thread && thread!='') Molpy.FromNeedlePulledThing(BeanishToCuegish(thread));
			Molpy.SaveC_STARSTAR_kie();
		}
		
		
		/* In which I do save and load!
		+++++++++++++++++++++++++++++++*/
		Molpy.ToNeedlePulledThing=function()
		{
			var p='P'; //Pipe seParator
			var s='S'; //Semicolon
			var c='C'; //Comma
			
			var thread='';
			thread+=Molpy.version+p+p;//some extra space!
			thread+=Molpy.startDate+p;
			
			thread+=
			(Molpy.options.particles?'1':'0')+
			(Molpy.options.numbers?'1':'0')+
			(Molpy.options.autosave)+
			(Molpy.options.autoupdate?'1':'0')+
			(Molpy.options.sea?'1':'0')+
			(Molpy.options.otcol?'1':'0')+
			(Molpy.options.longpostfix?'1':'0')+
			(Molpy.options.colourscheme)+
			p;
			
			thread+=			
			(Molpy.newpixNumber)+s+
			(Molpy.sandDug)+s+
			(Molpy.sandManual)+s+
			(Molpy.sand)+s+
			(Molpy.castlesBuilt)+s+
			(Molpy.castles)+s+
			(Molpy.castlesDestroyed)+s+
			(Molpy.prevCastleSand)+s+
			(Molpy.nextCastleSand)+s+
			(Molpy.castlesSpent)+s+
			(Molpy.sandSpent)+s+
			(Molpy.beachClicks)+s+
			(Molpy.ninjaFreeCount)+s+
			(Molpy.ninjaStealth)+s+
			(Molpy.ninjad)+s+
			(Molpy.saveCount)+s+
			(Molpy.loadCount)+s+
			(Molpy.notifsReceived)+s+
			(Molpy.timeTravels)+s+
			(Molpy.npbONG)+s+
		
			(Molpy.redactedCountup)+s+
			(Molpy.redactedToggle)+s+
			(Molpy.redactedVisible)+s+
			(0)+s+ //SPARE NUMBER BECAUSE redactedViewIndex is *ahem* redundant
			(Molpy.redactedClicks)+s+
			(Molpy.highestNPvisited)+s+
			(Molpy.totalCastlesDown)+s+
			(Molpy.intruderBots)+s+
			p;
			//sand tools:
			for(var cancerbabies in Molpy.SandTools)
			{
				var cb = Molpy.SandTools[cancerbabies];
				thread += cb.amount+c+cb.bought+c+(cb.totalSand)+s;
			}
			thread+=p;
			//castletools:
			for(var cancerbabies in Molpy.CastleTools)
			{
				var cb = Molpy.CastleTools[cancerbabies];
				thread += cb.amount+c+cb.bought+c+cb.totalCastlesBuilt+c+cb.totalCastlesDestroyed+c+
				cb.totalCastlesWasted+c+cb.currentActive+s;
			}
			thread+=p;
			//boosts:
			for(var cancerbabies in Molpy.Boosts)
			{
				var cb = Molpy.Boosts[cancerbabies];
				thread += cb.unlocked+c+cb.bought+c+cb.power+c+cb.countdown+s;
			}
			thread+=p;
			//badges:
			for(var cancerbabies in Molpy.Badges)
			{
				var cb = Molpy.Badges[cancerbabies];
				thread += cb.earned+s;
			}
			thread+=p;
			//coupons:
			thread+=p;
			return thread;
		}
		Molpy.needlePulling=0;
		Molpy.FromNeedlePulledThing=function(thread)
		{
			Molpy.needlePulling=1; //prevent earning badges that haven't been loaded
			var p='P'; //Pipe seParator
			var s='S'; //Semicolon
			var c='C'; //Comma
			if(!thread)return;
			if(thread.indexOf(p)<0)
			{
				p='|'; s=';'; c=','; //old style data
			}
			thread=thread.split(p);
			var version = parseFloat(thread[0]);
			if(version>Molpy.version)
			{
				alert('Error : you are a time traveller attempting to load a save from v'+version+' with v'+Molpy.version+'.');
				return;
			}
			var pixels = thread[2].split(s);
			Molpy.startDate=parseInt(pixels[0]);
			
			pixels=thread[3].split('');			//whoops used to have ';' here which wasn't splitting!
			Molpy.options.particles=parseInt(pixels[0]);
			Molpy.options.numbers=parseInt(pixels[1]);
			Molpy.options.autosave=parseInt(pixels[2]);
			Molpy.options.autoupdate=parseInt(pixels[3]);
			Molpy.options.sea=parseInt(pixels[4]);
			Molpy.options.otcol=parseInt(pixels[5]);
			Molpy.options.longpostfix=parseInt(pixels[6]);
			Molpy.options.colourscheme=parseInt(pixels[7]);
			if(!g('game'))
			{				
				Molpy.UpdateColourScheme();
				return;
			}
			
			pixels=thread[4].split(s);
			Molpy.newpixNumber=parseInt(pixels[0]);
			Molpy.sandDug=parseFloat(pixels[1]);
			Molpy.sandManual=parseFloat(pixels[2]);
			Molpy.sand=parseFloat(pixels[3]);
			Molpy.castlesBuilt=parseFloat(pixels[4]);
			Molpy.castles=parseFloat(pixels[5]);
			Molpy.parseFloat=parseInt(pixels[6]);
			Molpy.prevCastleSand=parseFloat(pixels[7]);
			Molpy.nextCastleSand=parseFloat(pixels[8]);
			Molpy.castlesSpent=parseFloat(pixels[9]);
			Molpy.sandSpent=parseFloat(pixels[10]);
			Molpy.beachClicks=parseInt(pixels[11]);
			Molpy.ninjaFreeCount=parseInt(pixels[12]);
			Molpy.ninjaStealth=parseInt(pixels[13]);
			Molpy.ninjad=parseInt(pixels[14])?1:0;
			Molpy.saveCount=parseInt(pixels[15]);
			Molpy.loadCount=parseInt(pixels[16]);			
			Molpy.notifsReceived=parseInt(pixels[17]);			
			Molpy.timeTravels=parseInt(pixels[18]);		
			Molpy.npbONG=parseInt(pixels[19]);		
			
			Molpy.redactedCountup=parseInt(pixels[20]);			
			Molpy.redactedToggle=parseInt(pixels[21]);			
			Molpy.redactedVisible=parseInt(pixels[22]);			
			//Molpy.redactedViewIndex=parseInt(pixels[23]); NOT NEEDED!
			Molpy.redactedClicks=parseInt(pixels[24]);	
			if(version < 0.92)
			{	
				//three variables not needed are skipped here
				Molpy.redactedClicks=parseInt(pixels[27]);	
				
				var blitzSpeed=parseInt(pixels[28]);	//these were saved here in 0.911 and 2
				var blitzTime=parseInt(pixels[29]);		//but now are put in the 'Blitzed' boost
			}
			Molpy.highestNPvisited=parseInt(pixels[25]);
			Molpy.totalCastlesDown=parseInt(pixels[26]);
			Molpy.intruderBots=parseInt(pixels[27]);
			
			
			pixels=thread[5].split(s);
			Molpy.SandToolsOwned=0;
			for (var i in Molpy.SandToolsById)
			{
				var me=Molpy.SandToolsById[i];
				if (pixels[i])
				{
					var ice=pixels[i].split(c);
					me.amount=parseInt(ice[0]);
					me.bought=parseInt(ice[1]);
					me.totalSand=parseFloat(ice[2]);
					Molpy.SandToolsOwned+=me.amount;
					me.refresh();
				}
				else
				{
					me.amount=0;me.bought=0;me.totalSand=0;
				}
			}
			pixels=thread[6].split(s);
			Molpy.CastleToolsOwned=0;
			for (var i in Molpy.CastleToolsById)
			{
				var me=Molpy.CastleToolsById[i];
				if (pixels[i])
				{
					var ice=pixels[i].split(c);
					me.amount=parseInt(ice[0]);
					me.bought=parseInt(ice[1]);
					me.totalCastlesBuilt=parseFloat(ice[2]);
					me.totalCastlesDestroyed=parseFloat(ice[3]);
					if(!me.totalCastlesDestroyed)me.totalCastlesDestroyed=0;//mustard cleaning
					me.totalCastlesWasted=parseFloat(ice[4]);
					me.currentActive=parseInt(ice[5]);
					Molpy.CastleToolsOwned+=me.amount;
					me.refresh();
				}
				else
				{
					me.amount=0;me.bought=0;
					me.totalCastlesDestroyed=0;
					me.totalCastlesWasted=0;
					me.totalCastlesBuilt=0;
					me.currentActive=0;
				}
			
			}
			pixels=thread[7].split(s);
			Molpy.BoostsOwned=0;
			for (var i in Molpy.BoostsById)
			{
				var me=Molpy.BoostsById[i];
				if (pixels[i])
				{
					var ice=pixels[i].split(c);
					me.unlocked=parseInt(ice[0]);
					me.bought=parseInt(ice[1]); 
					if(version<0.92)
                    {
                        me.power=0;
                        me.countdown=0;                        
                    }else{
                        me.power=parseInt(ice[2]);
                        me.countdown=parseInt(ice[3]);
                    }
					if(me.bought)
					{
						Molpy.BoostsOwned++;
						Molpy.unlockedGroups[me.group]=1;
					}
					if(me.countdown)
					{
						Molpy.GiveTempBoost(me.name,me.power,me.countdown);
					}
				}
				else
				{
					me.unlocked=0;me.bought=0;me.power=0;me.countdown=0;				
				}
			}
			if(thread[8])
			{
				pixels=thread[8].split(s);
			}else{
				pixels=[];
			}
			Molpy.BadgesOwned=0;
			for (var i in Molpy.BadgesById)
			{
				var me=Molpy.BadgesById[i];
				if (pixels[i])
				{
					var ice=pixels[i].split(c);
					me.earned=parseInt(ice[0]);
					if(me.earned)Molpy.BadgesOwned++;
				}
				else
				{
					me.earned=0;					
				}
			}			
			Molpy.needlePulling=0;//badges are loaded now
			
			if(version<0.8)
			{
				Molpy.options.autosave=2; //default to 5 millinewpix
			}
			if(version<0.82)
			{
				Molpy.Build(Molpy.newpixNumber/2);//cos I'm generous
			}
			if(version<0.831)
			{
				if(Molpy.saveCount>=20)
				{
					Molpy.UnlockBoost('Autosave Option');
					Molpy.EarnBadge('This Should be Automatic');
					Molpy.options.autosave=2;				
				}
				Molpy.options.colourscheme=0; //was NaN, steambottlish!
			}
			if(version<0.9)
			{
				Molpy.notifsReceived=0;
			}
			if(version<0.902)
			{			
				if(Molpy.ninjaStealth>=26)				
					Molpy.EarnBadge('Ninja Madness');				
				if(Molpy.Earned('Ninja Madness'))
					Molpy.UnlockBoost('Ninja Hope');
			}
			if(version<0.903)
			{
				Molpy.npbONG='mustard';
				//fix this later in execution when we can calculate it.
			}
			if(version<0.91)
			{
				Molpy.redactedCountup=0;
				Molpy.redactedToggle=0; 
				Molpy.redactedVisible=0; 
				Molpy.redactedViewIndex=-1;
				Molpy.redactedClicks=0;
			}
			if(version<0.913)
			{
				if(blitzTime)
				{
					Molpy.GiveTempBoost('Blitzing',blitzSpeed,blitzTime);
				}
			}
			if(version<0.941)
			{
				Molpy.Boosts['Overcompensating'].power=1.05;				
			}
			if(version<0.95)
			{
				Molpy.Boosts['Ninja Hope'].power=1;				
				Molpy.Boosts['Ninja Penance'].power=2;				
			}
			if(version<0.951)
			{
				Molpy.timeTravels=0;				
			}
			if(version<0.961)
			{
				if(Molpy.Got('Embaggening'))
				{
					Molpy.Notify('Refund!');
					Molpy.BuildCastles(12000);
				}
			}
			if(version<0.963)
			{
				Molpy.totalCastlesDown=0;
				Molpy.highestNPvisited=Molpy.newpixNumber;		//steambottle!	
			}
			if(version<0.97)
			{
				Molpy.intruderBots=0;
				for(var i in Molpy.npbDoublers)
				{
					var me = Molpy.Boosts[Molpy.npbDoublers[i]];
					if(me.bought)Molpy.LockBoost(me.name,1); //ha!
				}
			}
			if(version<0.983)
			{
				Molpy.Boosts['Double or Nothing'].power=0;
			}			
			if(version<0.992)
			{
				var bkj ='Blixtnedslag Kattungar, JA!';
				if(Molpy.Got(bkj))
				{
					Molpy.Boosts[bkj].power=Molpy.redactedClicks-Molpy.Boosts[bkj].power;
				}
			}
			
			Molpy.UpdateColourScheme();
			Molpy.LockBoost('Double or Nothing');
			if(Molpy.redactedVisible)
			{
				Molpy.redactedCountup=Molpy.redactedToggle;
				Molpy.CheckRedactedToggle();
			}
			
			Molpy.CheckBuyUnlocks(); //in case any new achievements have already been earned
			Molpy.CheckSandRateBadges(); //shiny!
			
			Molpy.ONGstart = ONGsnip(new Date()); //if you missed the ONG before loading, too bad!
			g('clockface').className= Molpy.Boosts['Coma Molpy Style'].power?'hidden':'unhidden';
			Molpy.HandlePeriods();
			Molpy.UpdateBeach();
			Molpy.recalculateDig=1;
			Molpy.shopRepaint=1;
			Molpy.boostRepaint=1;
			Molpy.badgeRepaint=1;
			Molpy.judgeLevel=-1;
			
			if(Molpy.showOptions) //needs refreshing
			{
				Molpy.showOptions=0;
				Molpy.OptionsToggle();
			}
		}
		
		/* In which a routine for resetting the game is presented
		+++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
		Molpy.Down=function(auto)
		{
			if(auto || confirm('Really Molpy Down?\n(Progress will be reset but achievements will not.)'))
			{
				Molpy.sandDug=0; 
				Molpy.sand=0; 
				Molpy.sandManual=0;
				Molpy.totalCastlesDown+=Molpy.castlesBuilt;
				Molpy.castlesBuilt=0;
				Molpy.castles=0; 
				Molpy.castlesDestroyed=0;
				Molpy.prevCastleSand=0;
				Molpy.nextCastleSand=1;
				Molpy.ninjaFreeCount=0;
				Molpy.ninjaStealth=0;
				
				Molpy.sandSpent=0;
				Molpy.castlesSpent=0;
				Molpy.beachClicks=0;
				Molpy.SandToolsOwned=0;
				Molpy.CastleToolsOwned=0;
				Molpy.BoostsOwned=0;
				Molpy.notifsReceived=0;
				
				Molpy.startDate=parseInt(new Date().getTime());
				Molpy.newpixNumber=1; 				
				Molpy.ONGstart = ONGsnip(new Date());
							
				for(i in Molpy.SandTools)
				{
					var me = Molpy.SandTools[i];
					me.amount=0;
					me.bought=0;
					me.totalSand=0;
					me.refresh();
				}
				for(i in Molpy.CastleTools)
				{
					var me = Molpy.CastleTools[i];
					me.amount=0;
					me.bought=0;
					if(i!='NewPixBot')
						me.totalCastlesBuilt=0;
					me.totalCastlesDestroyed=0;
					me.totalCastlesWasted=0;
					me.currentActive=0;
					me.refresh();
				}
				for(i in Molpy.Boosts)
				{
					var me = Molpy.Boosts[i];
					me.unlocked=0;
					me.bought=0;	
					me.power=0;
					if(me.startPower)
						me.power=me.startPower;
					me.countdown=0;
				}
				Molpy.recalculateDig=1;
				Molpy.boostRepaint=1;
				Molpy.shopRepaint=1;
				
				Molpy.UpdateBeach();
				Molpy.HandlePeriods();
				Molpy.EarnBadge('Not Ground Zero');
				Molpy.UpdateColourScheme();
			}
		}
		Molpy.Coma=function()
		{
			if(confirm('Really coma?\n(This will wipe all progress and badges!)') &&
			confirm('Seriously, this will reset ALL the things.\nAre you ABSOLUTELY sure?'))
			{
				//reset the badges
				Molpy.Down(1);				
				Molpy.saveCount=0;
				Molpy.loadCount=0;
				Molpy.highestNPvisited=0;
				Molpy.BadgesOwned=0;
				Molpy.redactedClicks=0;
				Molpy.timeTravels=0;
				Molpy.totalCastlesDown=0;
				Molpy.CastleTools['NewPixBot'].totalCastlesBuilt=0; //because we normally don't reset this.
				for (var i in Molpy.BadgesById)
				{
					Molpy.BadgesById[i].earned=0;						
				}
				Molpy.badgeRepaint=1;
			}
		}
		Molpy.showOptions=0;
		Molpy.OptionsToggle=function()
		{
			if(Molpy.showOptions)
			{
				Molpy.showOptions=0;
				g('beachAnchor').className='unhidden';
				g('beach').className='unhidden';
				g('options').className='hidden';
					
			}else{
				Molpy.showOptions=1;
				Molpy.showStats=0;
				Molpy.showExport=0;
				g('beachAnchor').className='hidden';
				g('beach').className='hidden';
				g('stats').className='hidden';
				g('export').className='hidden';
				g('options').className='unhidden';				
				Molpy.EarnBadge('Decisions, Decisions');
				if(Molpy.Got('Autosave Option')){
					g('autosaveoption').className='minifloatbox';
				}else{
					g('autosaveoption').className='hidden';
				}
				if(Molpy.Boosts['Chromatic Heresy'].power){
					g('otcoloption').className='minifloatbox';
				}else{
					g('otcoloption').className='hidden';
				}
				var i = Molpy.optionNames.length
				while(i--)
				{
					Molpy.OptionDescription(Molpy.optionNames[i],1); //show all descriptions
				}
			}
		}
		Molpy.ToggleOption=function(bacon)
		{
			if(bacon=='autosave')
			{
				Molpy.options.autosave++;
				if(Molpy.options.autosave>=9)Molpy.options.autosave=0;
			}else if(bacon=='sandnumbers')
			{
				Molpy.options.numbers++;
				if(Molpy.options.numbers>=2)Molpy.options.numbers=0;
			}else if(bacon=='colourscheme')
			{
				Molpy.options.colourscheme++;
				if(Molpy.options.colourscheme>=2)Molpy.options.colourscheme=0;
				Molpy.EarnBadge('Night and Dip');
				Molpy.UpdateColourScheme();
			}else if(bacon=='otcol')
			{
				Molpy.options.otcol++;
				if(Molpy.options.otcol>=2)Molpy.options.otcol=0;
				Molpy.UpdateColourScheme();
			}else if(bacon=='longpostfix')
			{
				Molpy.options.longpostfix++;
				if(Molpy.options.longpostfix>=2)Molpy.options.longpostfix=0;
				Molpy.shopRepaint=1;
			}else return;
			Molpy.OptionDescription(bacon,1); //update description
		}
		Molpy.optionNames=['autosave','colourscheme','sandnumbers','otcol','longpostfix'];
		Molpy.OptionDescription=function(bacon,caffeination)
		{
			var desc='';
			if(caffeination)
			{
				if(bacon=='autosave')
				{
					var auto = Molpy.options.autosave;
					if(auto){
						desc = 'Every ' + auto*5 + 'milliNewPix';
					}else{
						desc='Off (remember to save manually!)';
					}
				}else if(bacon=='colourscheme')
				{
					var sch = Molpy.options.colourscheme;
					if(!sch){
						desc="Dark Theme";
					}else{
						desc="Light Theme";
					}
				}else if(bacon=='sandnumbers')
				{
					var nu = Molpy.options.numbers;
					if(!nu){
						desc="No";
					}else{
						desc="Yes";
					}
				}else if(bacon=='otcol')
				{
					var nu = Molpy.options.otcol;
					if(!nu){
						desc="No";
					}else{
						desc="Yes";
					}
				}else if(bacon=='longpostfix')
				{
					var nu = Molpy.options.longpostfix;
					if(!nu){
						desc="No";
					}else{
						desc="Yes";
					}
				}else{
					return;
				}
			}
			g(bacon+'description').innerHTML='<br/>'+desc;
		}
		Molpy.UpdateColourScheme=function()
		{
			var heresy='';
			if(g('game'))
			{
				if(Molpy.Got('Chromatic Heresy')&&Molpy.Boosts['Chromatic Heresy'].power)
				{
					heresy=' heresy'
				}
				Molpy.UpdateBeach();
			}
			
			if(Molpy.options.colourscheme)
			{
				document.body.className='lightscheme'+heresy;
			}else{
				document.body.className='darkscheme'+heresy;
			}
		}
		
		
		if(!g('game'))
		{
			Molpy.LoadC_STARSTAR_kie();
			return;
		}
		
		
		Molpy.showStats=0;
		Molpy.StatsToggle=function()
		{
			if(Molpy.showStats)
			{
				Molpy.showStats=0;
				g('beachAnchor').className='unhidden';
				g('beach').className='unhidden';
				g('stats').className='hidden';
					
			}else{
				Molpy.showStats=1;
				Molpy.showOptions=0;
				Molpy.showExport=0;
				g('beachAnchor').className='hidden';
				g('beach').className='hidden';
				g('options').className='hidden';
				g('export').className='hidden';
				g('stats').className='unhidden';
				Molpy.EarnBadge('Far End of the Bell Curve');
			}
			Molpy.shopRepaint=1;
			Molpy.boostRepaint=1;
		}
		
		Molpy.showExport=0;
		Molpy.ExportToggle=function()
		{
			if(Molpy.showExport)
			{
				Molpy.showExport=0;
				g('beachAnchor').className='unhidden';
				g('beach').className='unhidden';
				g('stats').className='hidden';
				g('export').className='hidden';
					
			}else{
				Molpy.showExport=1;
				Molpy.showOptions=0;
				Molpy.showStats=0;
				g('beachAnchor').className='hidden';
				g('beach').className='hidden';
				g('options').className='hidden';
				g('stats').className='hidden';
				g('exporttext').value= CuegishToBeanish(Molpy.ToNeedlePulledThing());
				g('export').className='unhidden';
			}
		}
		
		/* In which the mathematical methods of sandcastles are described
		+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
		Molpy.Dig=function(amount)
		{
			Molpy.sandDug+=amount;
			Molpy.sand+=amount;
			
			var sandEpsilon = 0.0000001; //because floating point errors
			var gap = Math.ceil(Molpy.sand)-Molpy.sand;
			if(gap && gap < sandEpsilon)
			{	
				Molpy.sand = Math.ceil(Molpy.sand);
				Molpy.sandDug = Math.ceil(Molpy.sandDug);
				Molpy.EarnBadge('Clerical Error');
			}
			Molpy.SandToCastles();
			
			if(Molpy.sand>=50){
				Molpy.EarnBadge('Barn');
			}
			if(Molpy.sand>=200){
				Molpy.EarnBadge('Storehouse');
			}
			if(Molpy.sand>=500){
				Molpy.EarnBadge('Bigger Barn');	
			}
			if(Molpy.sandDug>=5000)Molpy.UnlockBoost('Molpies');						
			if(Molpy.sand>=8000){
				Molpy.EarnBadge('Warehouse');
			}
			if(Molpy.sand>=300000){
				Molpy.EarnBadge('Sand Silo');
			}
			if(Molpy.sand>=7000000){
				Molpy.EarnBadge('Silicon Valley');
			}
			if(Molpy.sand>=80000000){
				Molpy.EarnBadge('Glass Factory');
				Molpy.UnlockBoost('Glass Furnace');
			}
			if(Molpy.sand>=420000000){
				Molpy.EarnBadge('Seaish Sands');
			}
			if(Molpy.sand>=123456789){
				Molpy.EarnBadge('You can do what you want');
			}		
			if(Molpy.sand>=782222222144){
				Molpy.EarnBadge('Store ALL of the sand');
			}								
		}
		Molpy.SandToCastles=function()
		{
			Molpy.buildNotifyFlag=0;
			while(Molpy.sand >= Molpy.nextCastleSand)
			{
				if(Molpy.Got('Fractal Sandcastles'))
				{
					Molpy.Build(Math.floor(Math.pow(1.35,Molpy.Boosts['Fractal Sandcastles'].power)));
					Molpy.Boosts['Fractal Sandcastles'].power++;
					if(Molpy.Boosts['Fractal Sandcastles'].power>=60)
					{
						Molpy.EarnBadge('Fractals Forever');
					}
				}else{
					Molpy.Build(1);
				}
				Molpy.sand -= Molpy.nextCastleSand;
				Molpy.currentCastleSand = Molpy.nextCastleSand;
				//In which Fibbonacci occurs:
				Molpy.nextCastleSand = Molpy.prevCastleSand+Molpy.currentCastleSand;
				Molpy.prevCastleSand=Molpy.currentCastleSand
			}
			Molpy.buildNotifyFlag=1;
			Molpy.Build(0);
		}
		Molpy.buildNotifyFlag=1;
		Molpy.buildNotifyCount=0;
		Molpy.Build=function(amount,refund)
		{
			if(!refund)
			{
				amount = Math.round(amount*Molpy.globalCastleMult);
			}
			amount = Math.max(0,amount);
			Molpy.castlesBuilt+=amount;
			Molpy.castles+=amount;
			
			if(Molpy.buildNotifyFlag)
			{
				if(Molpy.buildNotifyCount)
				{
					amount+=Molpy.buildNotifyCount;
					Molpy.buildNotifyCount=0;
				}				
				if(amount){
					Molpy.Notify(amount==1?'+1 Castle':Molpify(amount)+ ' Castles Built',1);
				}
			}else{
				Molpy.buildNotifyCount+=amount;
			}				
			
			if(Molpy.castlesBuilt>=1){
				Molpy.EarnBadge('Rook');
			}
			if(Molpy.castlesBuilt>=4){
				Molpy.EarnBadge('Enough for Chess');
			}
			if(Molpy.castlesBuilt>=40){
				Molpy.EarnBadge('Fortified');
			}
			if(Molpy.castlesBuilt>=320){
				Molpy.EarnBadge('All Along the Watchtower');
			}
			if(Molpy.castlesBuilt>=1000){
				Molpy.EarnBadge('Megopolis');
			}
			if(Molpy.castlesBuilt>=100000){
				Molpy.EarnBadge('Kingdom');
			}
			if(Molpy.castlesBuilt>=10000000){
				Molpy.EarnBadge('Empire');
			}
			if(Molpy.castlesBuilt>=1000000000){
				Molpy.EarnBadge('Reign of Terror');
			}
			if(Molpy.castlesBuilt>=2000000000000){
				Molpy.EarnBadge('Unreachable?');
				Molpy.UnlockBoost("Château d'If");
			}
									
			
			if(Molpy.castles>=1000){
				Molpy.EarnBadge('We Need a Bigger Beach');
			}
			if(Molpy.castles>=1000000){
				Molpy.EarnBadge('Castle Nation');
			}
			if(Molpy.castles>=1000000000){
				Molpy.EarnBadge('Castle Planet');
			}
			if(Molpy.castles>=1000000000000){
				Molpy.EarnBadge('Castle Star');
			}
			if(Molpy.castles>=8888000000000000){
				Molpy.EarnBadge('Castle Galaxy');
			}
						
		
		}
		Molpy.MakeChips=function()
		{
			var furnaceLevel=(Molpy.Boosts['Sand Refinery'].power)+1;
			Molpy.UnlockBoost('Glass Chip Storage');
			var ch = Molpy.Boosts['Glass Chip Storage'];
			if(!ch.bought)
			{
				ch.buy();
			}
			ch.power+=furnaceLevel;
			var waste = Math.max(0,ch.power-(ch.bought)*10);
			ch.power-=waste;
			furnaceLevel-=waste;
			if(furnaceLevel)
            {
				Molpy.Notify('Made '+Molpify(furnaceLevel)+' Glass Chip'+(furnaceLevel>1?'s':''),1);
			}
			if(waste)
			{
				Molpy.Notify('Not enough Chip Storage for '+Molpify(waste)+' Glass Chip'+(waste>1?'s':''));
			}
		}
		Molpy.MakeBlocks=function()
		{
			var chillerLevel=(Molpy.Boosts['Glass Chiller'].power)+1;
			var chipsFor=chillerLevel;
			
			var ch = Molpy.Boosts['Glass Chip Storage'];
			while(ch.power < chipsFor*20)
			{
				chipsFor--;
			}
			if(!chipsFor)
			{
				Molpy.Notify('Not enough Glass Chips to make any Blocks',1);
				return;
			}else if (chillerLevel<chipsFor){
				Molpy.Notify('Running low on Glass Chips!');
				chillerLevel=chipsFor;
			}
			ch.power-=chipsFor*20;
			Molpy.UnlockBoost('Glass Block Storage');
			var bl = Molpy.Boosts['Glass Block Storage'];
			if(!bl.bought)
			{
				bl.buy();
			}
			bl.power+=chillerLevel;
			var waste = Math.max(0,bl.power-(bl.bought)*50);
			bl.power-=waste;
			chillerLevel-=waste;
			if(chillerLevel)
            {
				Molpy.EarnBadge('Glassblower');
				Molpy.Notify('Made '+Molpify(chillerLevel)+' Glass Block'+(chillerLevel>1?'s':''),1);
			}
			if(waste)
			{
				Molpy.Notify('Not enough Block Storage for '+Molpify(waste)+' Glass Block'+(waste>1?'s':''));
			}
		}
		
		Molpy.SpendCastles=function(amount)
		{
			if(!amount)return;
			amount = Math.min(amount,Molpy.castles);
			Molpy.castles-=amount;
			Molpy.castlesSpent+=amount;
			Molpy.Notify('Spent Castles: ' + Molpify(amount),1);
		}
		Molpy.SpendSand=function(amount)
		{
			if(!amount)return;
			Molpy.sand-=amount;
			Molpy.sandSpent+=amount;
			Molpy.Notify('Spent Sand: ' + Molpify(amount),1);
		}
		
		Molpy.destroyNotifyFlag=1;
		Molpy.destroyNotifyCount=0;
		Molpy.Destroy=function(amount,logsilent)
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
					Molpy.Notify(amount==1?'-1 Castle':amount+ ' Castles Destroyed',!logsilent);
				}
			}else{
				Molpy.destroyNotifyCount+=amount;
			}
			//destroying is done by trebuchets and stuff: it's different to spending
		}
		Molpy.sandPerClick=function()
		{			
			var baserate=1 + Molpy.Got('Bigger Buckets')*0.1;
			var mult=1;
			if(Molpy.Got('Huge Buckets'))mult*=2;
			if(Molpy.Got('Buccaneer'))mult*=2;
			baserate*=mult;
			if(Molpy.Got('Helpful Hands'))
			{
				var pairs = Math.min(Molpy.SandTools['Bucket'].amount, Molpy.SandTools['Cuegan'].amount);
				baserate+=0.5*pairs;
			}
			if(Molpy.Got('True Colours'))
			{
				var pairs = Math.min(Molpy.SandTools['Flag'].amount, Molpy.SandTools['Cuegan'].amount);
				baserate+=5*pairs;
			}
			if(Molpy.Got('Raise the Flag'))
			{
				var pairs = Math.min(Molpy.SandTools['Flag'].amount, Molpy.SandTools['Ladder'].amount);
				baserate+=50*pairs;
			}
			if(Molpy.Got('Hand it Up'))
			{
				var pairs = Math.min(Molpy.SandTools['Bag'].amount, Molpy.SandTools['Ladder'].amount);
				baserate+=500*pairs;
			}
			if(Molpy.Got('Bucket Brigade'))
			{
				baserate+=Molpy.sandPermNP*0.01*Math.floor(Molpy.SandTools['Bucket'].amount/50);
			}
			
			if(Molpy.Got('Bag Puns'))
			{
				baserate+= baserate*0.4*Math.max(-2,Math.floor((Molpy.SandTools['Bag'].amount-25)/5));
			}
			return baserate;
		}
		Molpy.computedSandPerClick=1;
		Molpy.globalSpmNPMult=1;
		Molpy.lastClick=0;
		Molpy.ClickBeach=function()
		{
			var newsand=Molpy.computedSandPerClick;
			Molpy.Dig(newsand);
			if(Molpy.options.numbers) Molpy.AddSandParticle('+'+Molpify(newsand,1));
			Molpy.sandManual+=newsand;
			Molpy.beachClicks+=1;
			Molpy.CheckClickAchievements();
			if( Molpy.ninjad==0&&Molpy.CastleTools['NewPixBot'].amount)
			{
				if(Molpy.npbONG==1)
				{
					//clicking first time, after newpixbot		
					Molpy.EarnBadge('No Ninja');
					Molpy.ninjaFreeCount++; 
					var ninjaInc = 1;
					if(Molpy.Got('Active Ninja'))
					{
						ninjaInc*=3;
					}
					if(Molpy.Got('Ninja League'))
					{
						ninjaInc*=100;
					}
					if(Molpy.Got('Ninja Legion'))
					{
						ninjaInc*=1000;
					}
					Molpy.ninjaStealth+=ninjaInc;
					
					if(Molpy.Got('Ninja Builder')) 
					{
						var stealthBuild=Molpy.ninjaStealth;
						if(Molpy.Got('Ninja Assistants')) stealthBuild*=Molpy.CastleTools['NewPixBot'].amount;
						if(Molpy.Got('Skull and Crossbones'))
						{
							stealthBuild*=Math.floor(Math.pow(1.05,Math.max(-1,Molpy.SandTools['Flag'].amount-40)));
						}
						if(Molpy.Boosts['Glass Jaw'].power)
						{
							var bl = Molpy.Boosts['Glass Block Storage'];
							if(bl.power>0)
							{
								bl.power--;
								stealthBuild*=100;
							}
						}
						Molpy.Build(stealthBuild+1);
					}else{
						Molpy.Build(1); //neat!
					}
					if(Molpy.ninjaStealth>=6)
					{
					 Molpy.EarnBadge('Ninja Stealth');
						Molpy.UnlockBoost('Stealthy Bot');
					} 
					if(Molpy.ninjaStealth>=16)
					{
						Molpy.EarnBadge('Ninja Dedication');			
						Molpy.UnlockBoost('Ninja Builder');	
					} 			
					if(Molpy.ninjaStealth>=26)
					{
						Molpy.EarnBadge('Ninja Madness');
						Molpy.UnlockBoost('Ninja Hope');
					}
 					if(Molpy.ninjaStealth>=36)
					{
						Molpy.EarnBadge('Ninja Omnipresence');
					}
 					if(Molpy.ninjaStealth>4000)
					{
						Molpy.EarnBadge('Ninja Pact');
					}	
 					if(Molpy.ninjaStealth>4000000)
					{
						Molpy.EarnBadge('Ninja Unity');
					}				
				}else if(Molpy.npbONG==0){
					if(Molpy.NinjaUnstealth())
					{
						if(Molpy.CastleTools['NewPixBot'].currentActive)
						{
							Molpy.EarnBadge('Ninja');
						}
						if(Molpy.CastleTools['NewPixBot'].currentActive>=10)
						{
							Molpy.EarnBadge('Ninja Strike');
						}
					}
				}
			}else if(Molpy.Got('VITSSÅGEN, JA!'))
			{
				if(Molpy.beachClicks%100==0)
				{
					Molpy.Notify('VITSSÅGEN, JA!');
					var p = Molpy.Boosts['VITSSÅGEN, JA!'].power;
					p++;
					if(Molpy.Got('Swedish Chef'))
					{
						Molpy.Build(100000000*p);
					}else{
						Molpy.Build(1000000*p);
						if(p>20)Molpy.UnlockBoost('Swedish Chef');
					}
					Molpy.Boosts['VITSSÅGEN, JA!'].power=p;
				}
			}
			if(Molpy.Got('Bag Puns')&&Molpy.Boosts['VITSSÅGEN, JA!'].bought!=1)
			{
				if(Molpy.beachClicks%20==0)
				{
					Molpy.Notify(GLRschoice(Molpy.bp));
					var p = Molpy.Boosts['Bag Puns'].power;
					p++;
					if(p>100)
					{
						Molpy.UnlockBoost('VITSSÅGEN, JA!');
					}
					Molpy.Boosts['Bag Puns'].power=p;
				}
			}
			Molpy.ninjad=1;
			Molpy.HandleClickNP();					
		}
		g('beach').onclick=Molpy.ClickBeach;	
		
		var prevKey='';
		Molpy.KeyDown=function(e)
		{
			var key= String.fromCharCode(e.keyCode||e.charCode);
			if(key=='5'&&prevKey.toLowerCase()=='f')
			{
				Molpy.ClickBeach();
				Molpy.EarnBadge('Use Your Leopard');
			}
			prevKey=key;
		}
		window.onkeydown=Molpy.KeyDown;
		
		Molpy.NinjaUnstealth=function()
		{
			if(Molpy.Got('Ninja Hope')&&Molpy.Boosts['Ninja Hope'].power)
			{
				if(Molpy.castles>=10){
					Molpy.Destroy(10);
					Molpy.Boosts['Ninja Hope'].power--;
					Molpy.Notify('Ninja Forgiven',1);
					return 0;
				}
			}
			if(Molpy.Got('Ninja Penance')&&Molpy.Boosts['Ninja Penance'].power)
			{
				if(Molpy.castles>=30){
					Molpy.Destroy(30);
					Molpy.Boosts['Ninja Penance'].power--;
					Molpy.Notify('Ninja Forgiven',1);
					return 0;
				}
			}
			Molpy.Boosts['Ninja Hope'].power=1;
			Molpy.Boosts['Ninja Penance'].power=2;
			if(Molpy.ninjaStealth)
				Molpy.Notify('Ninja Unstealthed',1);
			if(Molpy.ninjaStealth>=7&&Molpy.Got('Ninja Hope'))
			{
				Molpy.UnlockBoost('Ninja Penance');
			}
			if(Molpy.ninjaStealth>=30&&Molpy.ninjaStealth<36)
			{
				Molpy.EarnBadge('Ninja Shortcomings');
			}
			Molpy.ninjaStealth=0;
			return 1;
		}
		
		Molpy.HandleClickNP=function()
		{
			var NP = Molpy.newpixNumber;
			if(NP==404) Molpy.EarnBadge('Badge Not Found');
		}
		
		/* In which we calculate how much sand per milliNewPix we dig
		+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
		Molpy.CalculateDigSpeed=function()
		{
			var oldrate = Molpy.sandPermNP;
			Molpy.sandPermNP=0;
			var multiplier = 1;
			for (var i in Molpy.SandTools)
			{
				var me=Molpy.SandTools[i];
				me.storedSpmNP=EvalMaybeFunction(me.spmNP,me);
				me.storedTotalSpmNP=me.amount*me.storedSpmNP;
				Molpy.sandPermNP+=me.storedTotalSpmNP;
			}
			var ninjaFactor =1;
			if(Molpy.Got('Busy Bot'))ninjaFactor+=0.1;
			if(Molpy.Got('Stealthy Bot'))ninjaFactor+=0.1;
			if(Molpy.Got('Chequered Flag'))ninjaFactor+=0.1;
			Molpy.ninjaTime = Molpy.baseNinjaTime/ninjaFactor;
			if(Molpy.Got('Molpies'))//molpy molpy molpy molpy molpy
			{
				multiplier+=0.01*Molpy.BadgesOwned;
			}
			if(Molpy.Got('Grapevine'))//grapevine
			{
				multiplier+=0.02*Molpy.BadgesOwned;
			}
			if(Molpy.Got('Ch*rpies'))
			{
				multiplier+=0.05*Molpy.BadgesOwned;
			}
			if(Molpy.Got('Blitzing'))
			{
				multiplier*=Molpy.Boosts['Blitzing'].power/100;
			}
			Molpy.computedSandPerClick=Molpy.sandPerClick()*multiplier;
			
			//stuff beyond here doesn't apply to clicks
			if(Molpy.Got('Overcompensating')) 
			{
				multiplier+=Molpy.Boosts['Overcompensating'].power;
			}
			var glassUse=Molpy.CalcGlassUse();
			multiplier*=Math.max(0,((100-glassUse)/100));
			Molpy.globalSpmNPMult=multiplier;
			Molpy.sandPermNP*=Molpy.globalSpmNPMult;
			
			Molpy.recalculateDig=0;
			
			if(Molpy.sandPermNP>oldrate) Molpy.CheckSandRateBadges();
			
			var judy=Molpy.JudgementDipReport()[0];
			if(Molpy.judgeLevel==-1)//just loaded
			{
				if(judy>0)
					Molpy.Notify("Judgement Dip Level: "+Molpify(judy-1),1);
			}			
			else if(judy>Molpy.judgeLevel)//increase
			{
				if(Molpy.judgeLevel<2&&judy>2)//jumped from safe to multiple levels of judgement
				{
					Molpy.Notify('Judgement Dip is upon us!');
					Molpy.Notify("Judgement Dip Level: "+Molpify(judy-1),1);
				}else if(judy>2)
				{
					Molpy.Notify('Things got worse!!');
					Molpy.Notify("Judgement Dip Level: "+Molpify(judy-1),1);
				}
				else if(judy==2)
				{
					Molpy.Notify('Judgement Dip is upon us!',1);
				}
				else if(judy==1)
				{
					Molpy.Notify("You sense trouble. The bots are restless.",1);
				}
			}else if(judy<Molpy.judgeLevel)//decrease
			{
				if(judy>1)
				{
					Molpy.Notify('Things got better');
					Molpy.Notify("Judgement Dip Level: "+Molpify(judy-1),1);
				}
				else if(judy==1)
				{
					Molpy.Notify("You feel relief but fear lingers.",1);
				}
				else if(judy==0)
				{
					if(Molpy.Boosts['NewPixBot Navigation Code'].power)
					{
						Molpy.Notify('Your alterations to the navigation code have saved the day!',1);
					}else{
						Molpy.Notify('You feel safe.',1);
					}
				}
			}
			Molpy.judgeLevel=judy;
			
			if(Molpy.judgeLevel)Molpy.EarnBadge('Judgement Dip Warning');
			if(Molpy.judgeLevel>1)Molpy.EarnBadge('Judgement Dip');
			
			if(Molpy.Got('Flux Turbine'))
			{
				Molpy.globalCastleMult=Math.max(1,Math.pow(1.02,Math.log(Molpy.totalCastlesDown)));
			}else{
				Molpy.globalCastleMult=1;
			}
			
		}
		Molpy.CheckSandRateBadges=function()
		{
			var sr = Molpy.sandPermNP;
			if(sr>=0.1)Molpy.EarnBadge('A light dusting');
			if(sr>=0.8)Molpy.EarnBadge('Sprinkle');
			if(sr>=6)Molpy.EarnBadge('Trickle');
			if(sr>=25)Molpy.EarnBadge('Pouring it on');
			if(sr>=100)Molpy.EarnBadge('Hundred Year Storm');
			if(sr>=400)Molpy.EarnBadge('Thundering Typhoon!');
			if(sr>=1600)Molpy.EarnBadge('Sandblaster');
			if(sr>=7500)Molpy.EarnBadge('Where is all this coming from?');
			if(sr>=30000)Molpy.EarnBadge('Seaish Sandstorm');
			if(sr>=500500)Molpy.EarnBadge('WHOOSH');
			if(sr>=2222222)Molpy.EarnBadge('We want some two!');
			if(sr>=10101010)Molpy.EarnBadge('Bittorrent');
			if(sr>=299792458)Molpy.EarnBadge('WARP SPEEEED');
			if(sr>=8888888888.8)Molpy.EarnBadge('Maxed out the display');
		}
		
		
		/* In which the shop is implemented
		+++++++++++++++++++++++++++++++++++*/
		Molpy.shopRepaint=1;
		Molpy.sandToolPriceFactor=1.1;
		Molpy.SandTools=[];
		Molpy.SandToolsById=[];
		Molpy.SandToolsN=0;
		Molpy.CastleTools=[];
		Molpy.CastleToolsById=[];
		Molpy.CastleToolsN=0;
		Molpy.SandToolsOwned=0;
		Molpy.CastleToolsOwned=0;
		Molpy.priceFactor=1;
		
		Molpy.SandTool=function(name,commonName,desc,price,spmNP,drawFunction,buyFunction,
			pic,icon,background)
		{
			this.id=Molpy.SandToolsN;
			this.name=name;
			commonName=commonName.split('|');
			this.single=commonName[0];
			this.plural=commonName[1];
			this.actionName=commonName[2];
			this.desc=desc;
			this.basePrice=price;
			this.price=this.basePrice;
			this.spmNP=spmNP;
			this.totalSand=0;
			this.storedSpmNP=0;
			this.storedTotalSpmNP=0;
			this.pic=pic;
			this.icon=icon;
			this.background=background;
			this.buyFunction=buyFunction;
			this.drawFunction=drawFunction;
						
			this.amount=0;
			this.bought=0;
			
			this.buy=function()
			{
				var price=Math.floor(Molpy.priceFactor*this.basePrice*Math.pow(Molpy.sandToolPriceFactor,this.amount));				
				if (Molpy.castles>=price)
				{
					Molpy.SpendCastles(price);
					this.amount++;
					this.bought++;
					price=Math.floor(this.basePrice*Math.pow(Molpy.sandToolPriceFactor,this.amount));
					this.price=price;
					if (this.buyFunction) this.buyFunction(this);
					if (this.drawFunction) this.drawFunction();
					Molpy.shopRepaint=1;
					Molpy.recalculateDig=1;
					Molpy.SandToolsOwned++;
					Molpy.CheckBuyUnlocks();
				}
			}
			this.sell=function()
			{
				if (this.amount>0)
				{					
					this.amount--;
					var price=this.basePrice*Math.pow(Molpy.sandToolPriceFactor,this.amount);
					var d=1;
					if(Molpy.Got('Family Discount'))d=.2;
					if(Molpy.Boosts[Molpy.IKEA].startPower>0.5) d*=0.8; //sorry guys, no ikea-scumming
					Molpy.Build(Math.floor(price*0.5*d),1);
					this.price=price;
					if (this.sellFunction) this.sellFunction();
					if (this.drawFunction) this.drawFunction();
					Molpy.shopRepaint=1;
					Molpy.recalculateDig=1;
					Molpy.SandToolsOwned--;
					Molpy.UnlockBoost('No Sell');
					Molpy.CheckBuyUnlocks();
				}
			}
			this.showdesc=function()
			{
				var desc = '';
				if(Molpy.showStats)
				{
					desc='Total sand '+this.actionName+': '+Molpify(this.totalSand,1)+
					'<br/>Sand/mNP per '+this.single+': '+Molpify(this.storedSpmNP,1)+
					'<br/>Total '+this.plural+' bought: '+Molpify(this.bought);
					Molpy.EarnBadge('The Fine Print');
				}else
				{				
					desc=this.desc;
				}
				g('SandToolDescription'+this.id).innerHTML='<br/>'+desc;
			}
			this.hidedesc=function()
			{		
				var d=g('SandToolDescription'+this.id);
				if(d)d.innerHTML='';
			}
			this.refresh=function()
			{
				this.price=Math.floor(this.basePrice*Math.pow(Molpy.sandToolPriceFactor,this.amount));
				if (this.drawFunction) this.drawFunction();
			}
			
			
			Molpy.SandTools[this.name]=this;
			Molpy.SandToolsById[this.id]=this;
			Molpy.SandToolsN++;
			return this;
		}	
	
		Molpy.CastleTool=function(name,commonName,desc,price0,price1,destroyN,buildN,drawFunction,buyFunction,
			pic,icon,background)
		{
			this.id=Molpy.CastleToolsN;
			this.name=name;
			commonName=commonName.split('|');
			this.single=commonName[0];
			this.plural=commonName[1];
			this.actionDName=commonName[2];
			this.actionBName=commonName[3];
			this.desc=desc;
			this.price0=price0;
			this.price1=price1;
			this.prevPrice=price0;
			this.nextPrice=price1;
			this.price=this.prevPrice+this.nextPrice; //fib!
			this.destroyN=destroyN;
			this.buildN=buildN;
			this.totalCastlesBuilt=0;
			this.totalCastlesDestroyed=0;
			this.totalCastlesWasted=0; //those destroyed for no gain
			this.currentActive=0;
			this.pic=pic;
			this.icon=icon;
			this.background=background;
			this.buyFunction=buyFunction;
			this.drawFunction=drawFunction;
						
			this.amount=0;
			this.bought=0;
			
			this.buy=function()
			{
				var price=Math.floor(Molpy.priceFactor*(this.prevPrice+this.nextPrice));
				if (Molpy.castles>=price)
				{
					Molpy.SpendCastles(price);
					this.amount++;
					this.bought++;
					this.prevPrice=this.nextPrice;
					this.nextPrice=this.price;
					this.price=this.prevPrice+this.nextPrice;
					if (this.buyFunction) this.buyFunction(this);
					if (this.drawFunction) this.drawFunction();
					Molpy.shopRepaint=1;
					Molpy.recalculateDig=1;
					Molpy.CastleToolsOwned++;
					Molpy.CheckBuyUnlocks();
				}
			}
			this.sell=function()
			{				
				var price=this.prevPrice;
				if (this.amount>0)
				{
					if(this.name=='NewPixBot'&&Molpy.intruderBots)
					{
						Molpy.intruderBots--;
						Molpy.Notify('Intruder Destroyed!');
					}else{					
						var d=1;
						if(Molpy.Got('Family Discount'))d=.2;
						if(Molpy.Boosts[Molpy.IKEA].startPower>0.5) d*=0.7; //sorry guys, no ikea-scumming
						Molpy.Build(price*d,1);
					}
					
					this.amount--;
					this.prevPrice=this.nextPrice-this.prevPrice;
					this.price=this.nextPrice;
					this.nextPrice=price; //which is the former value of prevPrice
					if (this.sellFunction) this.sellFunction();
					if (this.drawFunction) this.drawFunction();
					Molpy.shopRepaint=1;
					Molpy.recalculateDig=1;
					Molpy.CastleToolsOwned--;
					Molpy.UnlockBoost('No Sell');
					Molpy.CheckBuyUnlocks();
				}
			}
			this.DestroyPhase=function()
			{
				var i = this.amount
				var destroyN=EvalMaybeFunction(this.destroyN);
				while(i--)
				{
					if(Molpy.castles >= destroyN)
					{
						this.currentActive++;
						this.totalCastlesDestroyed+=destroyN;
					}
					else
					{
						this.totalCastlesWasted+=Molpy.castles;
					}
					Molpy.Destroy(destroyN);
					if(this.onDestroy)this.onDestroy();
				}
			}
			this.BuildPhase=function()
			{
				var i = this.currentActive;
				var buildN =EvalMaybeFunction(this.buildN);
				while(i--)
				{
					Molpy.Build(buildN);
					this.totalCastlesBuilt+=buildN;
				}
				this.currentActive=0;
			}
			this.showdesc=function()
			{
				var desc = '';
				var bN = EvalMaybeFunction(this.buildN);
				var dN = EvalMaybeFunction(this.destroyN);
				var actuals ='<br/>Builds '+Molpify(bN,1,!Molpy.showStats)+(dN?(' if '+Molpify(dN,1,!Molpy.showStats)+((dN-1)?' are':' is')+' destroyed.'):'');
				if(Molpy.showStats)
				{
					if(this.totalCastlesDestroyed)
						desc+='Total castles '+this.actionDName+': '+Molpify(this.totalCastlesDestroyed)+
						'<br/>Total castles wasted: '+Molpify(this.totalCastlesWasted);
					if(this.totalCastlesBuilt)
						desc+='<br/>Total castles '+this.actionBName+': +'+Molpify(this.totalCastlesBuilt);
					desc+='<br/>Total '+this.plural+' bought: '+Molpify(this.bought);
					desc+='<br/>'+actuals;
					Molpy.EarnBadge('Keeping Track');
				}else
				{				
					desc=this.desc+actuals;
				}
			
			
				g('CastleToolDescription'+this.id).innerHTML='<br/>'+desc;
			}
			this.hidedesc=function(event)
			{
				var d=g('CastleToolDescription'+this.id);
				if(d)d.innerHTML='';
			}
			this.refresh=function()
			{
				//this.price= TODO relcalculate price!
				var i = this.amount;
				this.prevPrice=this.price0;
				this.nextPrice=this.price1;
				var p = this.prevPrice+this.nextPrice;
				while(i--)
				{
					this.prevPrice=this.nextPrice;
					this.nextPrice=p;
					p=this.prevPrice+this.nextPrice;
				}
				this.price=p;
				if (this.drawFunction) this.drawFunction();
			}
			
			
			Molpy.CastleTools[this.name]=this;
			Molpy.CastleToolsById[this.id]=this;
			Molpy.CastleToolsN++;
			return this;
		}
		
		
		Molpy.boostRepaint=1;
		Molpy.boostHTML='';
		Molpy.Boosts=[];
		Molpy.BoostsById=[];
		Molpy.BoostN=0;
		Molpy.BoostsInShop=[];
		Molpy.BoostsOwned=0;
		var order=0;
		Molpy.Boost=function(args)
		{
			this.id=Molpy.BoostN;
			this.name=args.name;
			this.desc=args.desc;
			this.sandPrice=args.sand||0;
			this.castlePrice=args.castles||0;
			this.stats=args.stats;
			this.icon=args.icon;
			this.buyFunction=args.buyFunction;
			this.unlocked=0;
			this.bought=0;
			this.hardlocked=0; //prevent unlock by the department (this is not a saved value)
			this.order=this.id;
			this.hovered=0;
			this.power=0;
			this.countdown=0;
			if(args.startPower)
			{
				this.startPower=args.startPower;
				this.power=args.startPower;
			}
			this.startCountdown=args.startCountdown;
			this.hardlocked=args.hardlocked;
			this.className=args.className;
			this.group=args.group||'boosts';
			this.lockFunction=args.lockFunction;
			
			if(order) this.order=order+this.id/1000;
			//(because the order we create them can't be changed after we save)
			
			
			this.buy=function()
			{
				var sp = Math.floor(Molpy.priceFactor*EvalMaybeFunction(this.sandPrice,this,1));
				var cp = Math.floor(Molpy.priceFactor*EvalMaybeFunction(this.castlePrice,this,1));
				if (!this.bought && Molpy.castles>=cp && Molpy.sand>=sp)
				{
					Molpy.SpendSand(sp);
					Molpy.SpendCastles(cp);
					this.bought=1;
					if (this.buyFunction) this.buyFunction(this);
					Molpy.boostRepaint=1;
					Molpy.recalculateDig=1;
					Molpy.BoostsOwned++;
					Molpy.CheckBuyUnlocks();
					Molpy.unlockedGroups[this.group]=1;
					if(sp+cp>0)
					{
						if(this.className)
						{
							if(!showhide.tagged)
							{
								showhideToggle('tagged');
							}
						}else{
							if(!showhide[this.group])
							{
								showhideToggle(this.group);
							}
						}
					}
				}				
			}
			this.showdesc=function()
			{
				var boo=g('BoostDescription'+this.id)
				if(boo)
				{	
					boo.innerHTML='<br/>'+EvalMaybeFunction((Molpy.showStats&&this.stats)?this.stats:this.desc,this);
				}
			}
			this.hidedesc=function()
			{					
				var d=g('BoostDescription'+this.id);
				if(d)d.innerHTML='';
			}
			this.describe=function()
			{			
				Molpy.Notify(this.name + ': ' + EvalMaybeFunction(this.desc,this),1);
			}
			
			Molpy.Boosts[this.name]=this;
			Molpy.BoostsById[this.id]=this;
			Molpy.BoostN++;
			return this;
		}	
		
		Molpy.UnlockBoost=function(bacon)
		{
			if(typeof bacon==='string')
			{
				if(Molpy.Boosts[bacon])
				{
					if(Molpy.Boosts[bacon].unlocked==0)
					{
						Molpy.Boosts[bacon].unlocked=1;
						Molpy.boostRepaint=1;
						Molpy.recalculateDig=1;
						Molpy.Notify('Boost Unlocked: '+bacon,1);
					}
				}
			}else{ //yo wolpy I heard you like bacon...
				for(var i in bacon){Molpy.UnlockBoost(bacon[i]);}
			}
		}		
		Molpy.GiveTempBoost=function(bacon,power,countdown,desc)
		{		
			var bb = Molpy.Boosts[bacon];
			if(bb)
			{
				if(desc)bb.desc=desc;
				bb.power=power;
				bb.countdown=countdown;
				bb.unlocked=1;					
				bb.describe();
				bb.buy();					
			}
		}
		Molpy.LockBoost=function(bacon,silent)
		{
			if(typeof bacon==='string')
			{
				var me = Molpy.Boosts[bacon];
				if(me)
				{
					if(me.unlocked==1)
					{
						me.unlocked=0;
						Molpy.boostRepaint=1;
						Molpy.shopRepaint=1;
						Molpy.recalculateDig=1;

						if(me.bought==1);
						{
							Molpy.BoostsOwned--;
							me.bought=0;
						} //Orteil did this bit wrong :P
						if(!silent)
							Molpy.Notify('Boost Locked: '+bacon,1);
						if(me.lockFunction)me.lockFunction();
						Molpy.CheckBuyUnlocks();
					}
				}
			}else{ //so I put bacon in your bacon
				for(var i in bacon){Molpy.LockBoost(bacon[i]);}
			}
		}		
		Molpy.Got=function(back)
		{	//I like big molpies and I can not lie
			return (Molpy.Boosts[back]?Molpy.Boosts[back].bought:0);
			//also, watch www.youtube.com/watch?v=tTYr3JuueF4
		}		
		
		Molpy.badgeRepaint=1
		Molpy.badgeHTML='';
		Molpy.Badges=[];
		Molpy.BadgesById=[];
		Molpy.BadgeN=0;
		Molpy.BadgesOwned=0;
		var order=0;
		Molpy.Badge=function(name,desc,visibility,icon,earnFunction)
		{
			this.id=Molpy.BadgeN;
			this.name=name;
			this.desc=desc
			this.icon=icon;
			this.earnFunction=earnFunction;
			this.earned=0;
			this.order=this.id;
			if(order) this.order=order+this.id/1000;
			//(because the order we create them can't be changed after we save)
			this.visibility=(visibility?visibility:0); //0 is normal, 1 is hidden description, 2 is hidden name, 3 is invisible
			
			this.showdesc=function()
			{
				g('BadgeDescription'+this.id).innerHTML='<br/>'+((this.earned||this.visibility<1)?
				EvalMaybeFunction(this.desc):'????');
			}
			this.hidedesc=function()
			{
				var d = g('BadgeDescription'+this.id);
				if(d)d.innerHTML='';
			}
			
			Molpy.Badges[this.name]=this;
			Molpy.BadgesById[this.id]=this;
			Molpy.BadgeN++;
			return this;
		}		
		Molpy.EarnBadge=function(bacon)
		{
			if(typeof bacon==='string')
			{
				if(Molpy.Badges[bacon])
				{
					if(Molpy.Badges[bacon].earned==0&&!Molpy.needlePulling)
					{
						Molpy.Badges[bacon].earned=1;
						if(Molpy.BadgesOwned==0) Molpy.EarnBadge('Redundant Redundancy');
						Molpy.badgeRepaint=1;
						Molpy.recalculateDig=1;
						Molpy.BadgesOwned++;
						Molpy.Notify('Badge Earned: '+bacon,1);
						Molpy.EarnBadge('Redundant');
						Molpy.CheckBuyUnlocks();
					}
				}
			}else{ //so you can be bacon while you're bacon
				for(var i in bacon){Molpy.EarnBadge(bacon[i]);}
			}
		}
		Molpy.Earned=function(bacon)
		{
			return Molpy.Badges[bacon].earned;
		}
		
		Molpy.redactedW=BeanishToCuegish("UmVkdW5kYW50");
		Molpy.redactedWord=BeanishToCuegish("UmVkdW5kYWtpdHR5");
		Molpy.redactedWords=BeanishToCuegish("UmVkdW5kYWtpdHRpZXM=");
		Molpy.redactedBrackets=BeanishToCuegish("JTI1NUJyZWR1bmRhbnQlMjU1RA==");
		Molpy.redactedSpoiler='<div><b>Spoiler:</b><input type="button" value="Show" onclick="Molpy.clickRedacted()"></input></div>';
		Molpy.redactedShop='<div id="redacteditem"><div class="icon redacted"></div><div class="title">'+Molpy.redactedWord+'</div>'+Molpy.redactedSpoiler+'</div>';
		Molpy.redactedLoot='<div id="redacteditem"><div class="icon redacted"></div><div class="heading">'+Molpy.redactedBrackets+'</div><div class="title">'+Molpy.redactedWord+'</div>'+Molpy.redactedSpoiler+'</div>';
		
		Molpy.redactedCountup=0;
		Molpy.redactedToggle=0; //disabled
		Molpy.redactedVisible=0; //hidden
		Molpy.redactedGr=''; //for boosts keep track of which group it's in
		Molpy.redactedViewIndex=-1;
		Molpy.redactableThings=6;
		Molpy.redactedClicks=0;
		Molpy.CheckRedactedToggle=function()
		{
			if(Molpy.redactedToggle)
			{
				Molpy.redactedCountup++;
				if(Molpy.redactedCountup>=Molpy.redactedToggle)
				{
					Molpy.redactedCountup=0;
					if(Molpy.redactedVisible)
					{
						Molpy.redactedVisible=0; //hide because the redacted was missed
						var BKJ = Molpy.Boosts['Blixtnedslag Kattungar, JA!'];
						Molpy.shopRepaint=1;
						Molpy.boostRepaint=1;
						Molpy.badgeRepaint=1;	
						Molpy.RandomiseRedactedTime();	
					}else{
						Molpy.redactedVisible=Math.ceil((Molpy.redactableThings+2)*Math.random());
						if(Molpy.redactedVisible>Molpy.redactableThings)Molpy.redactedVisible=4;
						Molpy.redactedViewIndex=-1;
						var stay = 6 *(4+ Molpy.Got('Kitnip'));
						Molpy.redactedToggle=stay;
						Molpy.shopRepaint=1;
						Molpy.boostRepaint=1;
						Molpy.badgeRepaint=1;
					}
				}
			}else{//initial setup
				Molpy.RandomiseRedactedTime();
			}
		}
		Molpy.RandomiseRedactedTime=function()
		{
			var min = 200-80*(Molpy.Got('Kitnip')+Molpy.Got('Kitties Galore'));
			var spread = 90-20*Molpy.Got('Kitnip'+Molpy.Got('Kitties Galore'));
			Molpy.redactedToggle=min+Math.ceil(spread*Math.random());
			Molpy.redactedGr='';
		}
		
		Molpy.clickRedacted=function()
		{
			var item=g('redacteditem');
			if(item) item.className='hidden';
			Molpy.redactedClicks++;
			Molpy.redactedVisible=0;
			Molpy.redactedViewIndex=-1;
			Molpy.shopRepaint=1;
			Molpy.boostRepaint=1;
			Molpy.badgeRepaint=1;
			Molpy.RandomiseRedactedTime();				
			Molpy.RewardRedacted();
			if(Molpy.redactedClicks>=2)
				Molpy.EarnBadge('Not So '+Molpy.redactedW);
			if(Molpy.redactedClicks>=14)
				Molpy.EarnBadge("Don't Litter!");
			if(Molpy.redactedClicks>=16)
				Molpy.UnlockBoost('Kitnip');
			if(Molpy.redactedClicks>=32)
				Molpy.UnlockBoost('Department of Redundancy Department');
			if(Molpy.redactedClicks>=64)
				Molpy.Boosts['Kitties Galore'].hardlocked=0;
			if(Molpy.redactedClicks>=128)
				Molpy.EarnBadge('Y U NO BELIEVE ME?');
			if(Molpy.redactedClicks>=256)
				Molpy.UnlockBoost('Blixtnedslag Kattungar, JA!');
		}

		Molpy.RewardRedacted=function(forceDepartment)
		{		
			if(Molpy.Got('Department of Redundancy Department') &&
				(!Math.floor(8*Math.random()) || forceDepartment))
			{
				if(Molpy.Got('Blast Furnace') && !Math.floor(4*Math.random()))
				{
					var blastFactor=1000;
					if(Molpy.Got('Fractal Sandcastles'))
					{
						blastFactor=Math.max(1,1000*Math.pow(0.98,Molpy.Boosts['Fractal Sandcastles'].power));
					}
					var castles=Math.floor(Molpy.sand/blastFactor);				
					Molpy.Notify('Blast Furnace in Operation!');
					Molpy.SpendSand(castles*blastFactor);
					Molpy.Build(castles);
					return;				
				}
			
				var availRewards=[];
				var i = Molpy.departmentBoosts.length;
				while(i--)
				{
					var me=Molpy.Boosts[Molpy.departmentBoosts[i]];
					if(!(me.unlocked||me.bought||me.hardlocked))
					{
						availRewards.push(me);
					}
				}
				
				if(availRewards.length)
				{
					var red=GLRschoice(availRewards);
					if((EvalMaybeFunction(red.sandPrice)+EvalMaybeFunction(red.castlePrice)))
					{
						Molpy.Notify('The DoRD has produced:',1);
						Molpy.UnlockBoost(red.name);
					}else{
						Molpy.Notify('The DoRD has provided:',1);
						Molpy.GiveTempBoost(red.name,red.startPower,red.startCountdown);
					}
					return;
				}
			}
			var BKJ = Molpy.Boosts['Blixtnedslag Kattungar, JA!'];			
			if(BKJ.bought)
			{
				BKJ.power=(BKJ.power)+1;
			}
			if(Math.floor(2*Math.random()))
			{
				Molpy.Notify('You are not Lucky (which is good)');
				var bonus=0;
				var i=0;
				var items=0;
				while(i<Molpy.SandToolsN)
				{
					bonus+=Molpy.SandToolsById[i].amount*Math.pow(3.5,i+1);
					items+=Molpy.SandToolsById[i].amount;
					i++;
                } 
				i=0;
				while(i<Molpy.CastleToolsN)
				{
					bonus+=Molpy.CastleToolsById[i].amount*Math.pow(2.5,i+1);
					items+=Molpy.CastleToolsById[i].amount;
					i++;
                }
				var bb = Molpy.BoostsOwned+Molpy.BadgesOwned;
				bonus+=bb;
				items+=bb;
				bonus += Molpy.redactedClicks*10;
				if(Molpy.Got('Blixtnedslag Förmögenhet, JA!'))
					bonus*= (1+0.2*BKJ.power)
				if(Molpy.Got('Panther Salve') && Molpy.Boosts['Glass Block Storage'].power >=2)		
				{				
					Molpy.Boosts['Glass Block Storage'].power-=2;
					bonus*=Math.pow(1.01,items);
				}
				
				bonus = Math.floor(bonus);
				Molpy.Build(bonus);
			}else{
				var blitzSpeed=800,blitzTime=23;
				if(BKJ.bought)
				{
					blitzSpeed+= BKJ.power*20;
					if(BKJ.power>24) Molpy.Boosts['Blixtnedslag Förmögenhet, JA!'].hardlocked=0;
				}
				Molpy.GiveTempBoost('Blitzing',blitzSpeed,blitzTime);
			}			
		}
		Molpy.CalcPriceFactor=function()
		{
			var baseval=1;
			if(Molpy.Got(Molpy.IKEA))
			{
				baseval*=(1-Molpy.Boosts[Molpy.IKEA].power);
			}
			if(Molpy.Got('Family Discount'))
			{
				baseval*=(0.2);
			}
			Molpy.priceFactor=Math.max(0,baseval);
		}
		
		Molpy.unlockedGroups={};
		Molpy.RepaintLootSelection=function()
		{
			var str = '';
			var groups = ['boosts','ninj','cyb','hpt','bean','chron'];
			for(var i in groups)
			{
				var gr = groups[i];
				if(Molpy.unlockedGroups[gr])
				{
					var id = Molpy.groupNames[gr][2]||'';
					if(id) id= ' id="'+id+'"';
					var r = (Molpy.redactedVisible==4&&Molpy.redactedGr==gr);
					if(r)id='';
					str+= '<div class="floatsquare boost loot">'+Molpy.groupNames[gr][1]+'<br/><br/>'+showhideButton(gr)
						+'<div class="icon'
						+(r?' redacted"':'"')
						+id+'></div></div>';
				}
			}
			if(Molpy.BadgesOwned)
			{
				str+= '<div class="floatsquare badge loot">Badges<br/>Earned<br/>'
					+showhideButton('badges')+'<div class="icon '
					+(Molpy.redactedVisible==5?'redacted':'')
					+'"></div></div>';
			}
			if(Molpy.BadgeN-Molpy.BadgesOwned)
			{
				str+= '<div class="floatsquare badge shop">Badges<br/>Available<br/>'
					+showhideButton('badgesav')+'<div class="icon '
					+(Molpy.redactedVisible==6?'redacted':'')
					+'"></div></div>';
			}
			if(Molpy.Boosts['Chromatic Heresy'].unlocked)
			{
				str+= '<div class="floatsquare boost loot alert">Tagged<br/>Items<br/>'
					+showhideButton('tagged')+'<div id="boost_chromatic" class="icon '
					+(Molpy.redactedVisible==7?'redacted':'')
					+'"></div></div>';
			}
			
			g('lootselection').innerHTML=str;
		}
	
		Molpy.RepaintShop=function()
		{
			Molpy.shopRepaint=0;
			Molpy.CalcPriceFactor();			
			var redactedIndex=-1;
			
			var toolsUnlocked=1;			
			for (var i in Molpy.SandTools)
			{
				if(Molpy.SandTools[i].bought)toolsUnlocked++;
			}
			
			if(Molpy.redactedVisible==1)
			{
				if(Molpy.redactedViewIndex==-1)
				{
					Molpy.redactedViewIndex=Math.floor((toolsUnlocked+1)*Math.random());					
				}
				redactedIndex=Molpy.redactedViewIndex;
			}

			var str='';
			var i=0;
			while (i < Math.min(toolsUnlocked, Molpy.SandToolsN))
			{
				if(i==redactedIndex) str+= Molpy.redactedShop;
				var me=Molpy.SandToolsById[i];
				str+='<div class="floatbox sand shop" onMouseOver="onhover(Molpy.SandToolsById['+me.id+'],event)" onMouseOut="onunhover(Molpy.SandToolsById['+me.id+'],event)"><div id="tool'+me.name+'" class="icon"></div><div class="title">'+me.name+' <a onclick="Molpy.SandToolsById['+me.id+'].buy();">Buy</a>'+(Molpy.Boosts['No Sell'].power?'':' <a onclick="Molpy.SandToolsById['+me.id+'].sell();">Sell</a>')+'</div>'+
				(me.amount>0?'<div class="title owned">Owned: '+me.amount+'</div>':'')+
				'<span class="price">Price: '+FormatPrice(me.price)+(me.price<100?' Castles':' C')+'</span>'+
				'<div id="SandToolDescription'+me.id+'"></div></div></div>';
				i++
			}
			if(i==redactedIndex) str+= Molpy.redactedShop;
			g('sandtools').innerHTML=str;
			
			toolsUnlocked=1;			
			for (var i in Molpy.CastleTools)
			{
				if(Molpy.CastleTools[i].bought)toolsUnlocked++;
			}
			
			redactedIndex=-1;
			if(Molpy.redactedVisible==2)
			{
				if(Molpy.redactedViewIndex==-1)
				{
					Molpy.redactedViewIndex=Math.floor((toolsUnlocked+1)*Math.random());
				}
				redactedIndex=Molpy.redactedViewIndex;
			}
						
			str='';
			i=0;
			while (i < Math.min(toolsUnlocked, Molpy.CastleToolsN))
			{
				if(i==redactedIndex) str+= Molpy.redactedShop;
				var me=Molpy.CastleToolsById[i];
				str+='<div class="floatbox castle shop" onMouseOver="onhover(Molpy.CastleToolsById['+me.id+'],event)" onMouseOut="onunhover(Molpy.CastleToolsById['+me.id+'],event)"><div id="tool'+me.name+'" class="icon"></div><div class="title">'+me.name+' <a onclick="Molpy.CastleToolsById['+me.id+'].buy();">Buy</a>'+(Molpy.Boosts['No Sell'].power?'':' <a onclick="Molpy.CastleToolsById['+me.id+'].sell();">Sell</a>')+'</div>'+
				(me.amount>0?'<div class="title owned">Owned: '+me.amount+'</div>':'')+
				'<span class="price">Price: '+FormatPrice(me.price)+(me.price<100?' Castles':' C')+'</span>'+
				'<div id="CastleToolDescription'+me.id+'"></div></div></div>';
				i++
			}
			if(i==redactedIndex) str+= Molpy.redactedShop;
			g('castletools').innerHTML=str;		
		}
		
		Molpy.BoostString=function(me,f,r)
		{		
			var cn= me.className||'';
			var group= me.group;
			if(r)
			{
				r=Molpy.redactedLoot;
				Molpy.redactedGr=group;
			}else{
				r='';
			}
			
			if(!(showhide[group]||f))return'';
			if(cn)Molpy.UnlockBoost('Chromatic Heresy');
			
			
			cn = r+'<div class="boost '+(me.bought?'lootbox loot ':'floatbox shop ')+cn;
			var heading= '<div class="heading">['+Molpy.groupNames[group][0]+']</div>';
			var buy= me.bought?'</div>':(' <a onclick="Molpy.BoostsById['+me.id+'].buy();">Buy</a></div>'
				+'<span class="price">Price: '+FormatPrice(me.sandPrice)+' Sand + '
				+FormatPrice(me.castlePrice)+' Castles</span>');
				
			
			
			return cn+'" onMouseOver="onhover(Molpy.BoostsById['+me.id+'],event)" onMouseOut="onunhover(Molpy.BoostsById['+me.id
				+'],event)"><div id="boost_'+(me.icon?me.icon:me.id)+'" class="icon"></div>'+heading+'<div class="title">'+me.name+buy
				+'<div id="BoostDescription'+me.id+'"></div></div></div>';
		}
		
		Molpy.RepaintBoosts=function()
		{
			Molpy.boostRepaint=0;			
			var alist=[];
			for (var i in Molpy.Boosts)
			{
				var me=Molpy.Boosts[i];
				if (!me.bought)
				{
					if (me.unlocked) alist.push(me);
				}
			}
			alist.sort(PriceSort);
			Molpy.BoostsInShop=[];
			for (var i in alist)
			{
				Molpy.BoostsInShop.push(alist[i]);
			}
			
			var redactedIndex=-1;
			if(Molpy.redactedVisible==3)
			{
				if(Molpy.redactedViewIndex==-1)
				{
					Molpy.redactedViewIndex=Math.floor((Molpy.BoostsInShop.length+1)*Math.random());
				}
				redactedIndex=Molpy.redactedViewIndex;
			}
			var str='';
			var r = 0;
			for (var i in Molpy.BoostsInShop)
			{
				if(r==redactedIndex) str+= Molpy.redactedShop;
				var me=Molpy.BoostsInShop[i];
				str+=Molpy.BoostString(me,1);
				r++;
			}
			if(r==redactedIndex) str+= Molpy.redactedShop;
			g('boosts').innerHTML=str;
			
			var blist=[];
			for (var i in Molpy.Boosts)
			{
				var me=Molpy.Boosts[i];
				if (me.bought)
				{
					blist.push(me);
				}
			}
			blist.sort(PriceSort);
			redactedIndex=-1;
			if(Molpy.redactedVisible==4)
			{
				if(Molpy.redactedViewIndex==-1)
				{
					Molpy.redactedViewIndex=Math.floor((blist.length)*Math.random());
				}
				redactedIndex=Molpy.redactedViewIndex;
			}
			str='';			
			r=0;
			for (var i in blist)
			{
				var me=blist[i];
				str+=Molpy.BoostString(me,0,r==redactedIndex);
				r++;
			}
			
			Molpy.boostHTML=str;
			g('loot').innerHTML=Molpy.boostHTML+Molpy.badgeHTML;	
		}
		
		Molpy.BadgeLootString=function(me)
		{
			var cn= me.className||'';			
			if(cn)Molpy.UnlockBoost('Chromatic Heresy');
			return '<div class="lootbox badge loot '+cn+'" onMouseOver="onhover(Molpy.BadgesById['+me.id+'],event)" onMouseOut="onunhover(Molpy.BadgesById['+me.id+'],event)"><div class="heading">[badge]</div><div id="badge_'+(me.icon?me.icon:me.id)+'" class="icon"></div><div class="title">'+me.name+'</div><div id="BadgeDescription'+me.id+'"></div></div></div>';
		}
		
		Molpy.RepaintBadges=function()
		{
			Molpy.badgeRepaint=0;
			var str='';			
			if(showhide.badges){
				var blist=[];
				for (var i in Molpy.Badges)
				{
					var me=Molpy.Badges[i];
					if (me.earned)
					{
						blist.push(me);
					}
				}
				var redactedIndex=-1;
				if(Molpy.redactedVisible==5)
				{
					if(Molpy.redactedViewIndex==-1)
					{
						Molpy.redactedViewIndex=Math.floor((blist.length+1)*Math.random());
					}
					redactedIndex=Molpy.redactedViewIndex;
				}
				var r=0;
				//do some sorting here?
				for (var i in blist)
				{
					if(r==redactedIndex) str+= Molpy.redactedLoot;
					var me=blist[i];					
					str+=Molpy.BadgeLootString(me);
					r++;
				}
				if(r==redactedIndex) str+= Molpy.redactedLoot;
			}
			Molpy.badgeHTML=str;
			str='';			
			if(showhide.badgesav){
				var blist=[];
				for (var i in Molpy.Badges)
				{
					var me=Molpy.Badges[i];
					if (!me.earned)
					{
						blist.push(me);
					}
				}
				
				var redactedIndex=-1;
				if(Molpy.redactedVisible==6)
				{
					if(Molpy.redactedViewIndex==-1)
					{
						Molpy.redactedViewIndex=Math.floor((blist.length+1)*Math.random());
					}
					redactedIndex=Molpy.redactedViewIndex;
				}			
				var r=0;
				//do some sorting here?
				for (var i in blist)
				{
					if(r==redactedIndex) str+= Molpy.redactedLoot;
					var me=blist[i];
					str+='<div class="lootbox badge shop" onMouseOver="onhover(Molpy.BadgesById['+me.id+'],event)" onMouseOut="onunhover(Molpy.BadgesById['+me.id+'],event)"><div class="heading">[badge]</div><div id="badge_'+(me.icon?me.icon:me.id)+'" class="icon"></div><div class="title">'+(me.visibility<2?me.name:'????')+'</div><div id="BadgeDescription'+me.id+'"></div></div></div>';
					r++;
				}
				if(r==redactedIndex) str+= Molpy.redactedLoot;
			}
			Molpy.badgeHTML+=str;
			g('loot').innerHTML=Molpy.boostHTML+Molpy.badgeHTML;		
		}
		
		Molpy.RepaintTaggedLoot=function()
		{
			var str='';
			var blist=[];
			for (var i in Molpy.Boosts)
			{
				var me=Molpy.Boosts[i];
				if (me.bought&&me.className)
				{
					blist.push(me);
				}
			}		
			for (var i in blist)
			{
				var me=blist[i];					
				str+=Molpy.BoostString(me,1);
			}
			
			blist=[];
			for (var i in Molpy.Badges)
			{
				var me=Molpy.Badges[i];
				if (me.earned&&me.className)
				{
					blist.push(me);
				}
			}			
			for (var i in blist)
			{
				var me=blist[i];					
				str+=Molpy.BadgeLootString(me);
			}
			g('loot').innerHTML=str;
		}
		//the numbers that fly up when you click the pic for sand
		Molpy.sParticles=[];
		var str='';
		for (var i=0;i<20;i++)
		{
			Molpy.sParticles[i]={x:0,y:0,dx:0,life:-1,text:''};
			str+='<div id="sparticle'+i+'" class="notif"></div>';
		}
		g('sparticles').innerHTML=str;
		Molpy.sparticlesUpdate=function()
		{
			for (var i in Molpy.sParticles)
			{
				var me=Molpy.sParticles[i];
				if (me.life!=-1)
				{
					
					me.y-=300/Molpy.fps;;
					me.x+=me.dx/Molpy.fps;
					
					me.life++;
					var el=me.l;
					me.l.style.left=Math.floor(me.x)+'px';
					me.l.style.top=Math.floor(me.y)+'px';
					el.style.opacity=1-(me.life/(Molpy.fps*2));
					if (me.life>=Molpy.fps*2)
					{
						me.life=-1;
						el.style.opacity=0;
						el.style.display='none';
					}
				}
			}
		}
		Molpy.AddSandParticle=function(text)
		{
			//pick the first free (or the oldest) notification to replace it
			var highest=0;
			var highestI=0;
			for (var i in Molpy.sParticles)
			{
				if (Molpy.sParticles[i].life==-1) {highestI=i;break;}
				if (Molpy.sParticles[i].life>highest)
				{
					highest=Molpy.sParticles[i].life;
					highestI=i;
				}
			}
			var i=highestI;
			
			var rect=g('beach').getBoundingClientRect();
			var x=0;
			var y=Math.floor((rect.height)*.7);
			x+=(Math.random()-0.5)*180;
			y+=(Math.random()-0.5)*120;
			var dx = (Math.random()-0.5)*60;
			
			var me=Molpy.sParticles[i];
			if (!me.l) me.l=g('sparticle'+i);
			me.life=0;
			me.x=x;
			me.y=y;
			me.dx=dx;
			me.text=text;
			me.l.innerHTML=text;
			me.l.style.left=Math.floor(me.x)+'px';
			me.l.style.top=Math.floor(me.y)+'px';
			me.l.style.display='block';
		}
		
		//notifications.
		Molpy.notifs=[];
		Molpy.notifsY=0;
		var str='';
		for (var i=0;i<20;i++)
		{
			Molpy.notifs[i]={x:0,y:0,life:-1,text:''};
			str+='<div id="notif'+i+'" class="notif"></div>';
		}
		g('notifs').innerHTML=str;
		Molpy.notifsReceived=0;
		Molpy.notifsUpdate=function()
		{
			Molpy.notifsY=0;
			for (var i in Molpy.notifs)
			{
				var me=Molpy.notifs[i];
				if (me.life!=-1)
				{
					if (me.life<Molpy.fps*3)Molpy.notifsY+=me.l.clientHeight;
					
					var y=me.y;
					if(me.life<Molpy.fps/2)
					{
						y-=10;
					}else{
						y-=10*(1-(me.life-Molpy.fps/2)/(Molpy.fps*5));
					}
					me.y=y;
					me.life++;
					var el=me.l;
					el.style.left=Math.floor(-200+me.x)+'px';
					el.style.bottom=Math.floor(-y)+'px';
					el.style.opacity=1-Math.pow(me.life/(Molpy.fps*5),2);
					if (me.life>=Molpy.fps*5)
					{
						me.life=-1;
						el.style.opacity=0;
						el.style.display='none';
					}
				}
			}
		}
		
		Molpy.notifLog=[];
		Molpy.notifLogNext=0;
		Molpy.notifLogMax=39; //store 40 lines
		Molpy.notifLogPaint=0;
		Molpy.InMyPants=0;
		Molpy.Notify=function(text,log)
		{
			if(Molpy.InMyPants) text+= ' in my pants';
			//pick the first free (or the oldest) notification to replace it
			var highest=0;
			var highestI=0;
			for (var i in Molpy.notifs)
			{
				if (Molpy.notifs[i].life==-1) {highestI=i;break;}
				if (Molpy.notifs[i].life>highest)
				{
					highest=Molpy.notifs[i].life;
					highestI=i;
				}
			}
			var i=highestI;
			
			var rect=g('game').getBoundingClientRect();
			var x=Math.floor((rect.left+rect.right)/2);
			var y=Math.floor((rect.bottom));
			x+=(Math.random()-0.5)*40;
			
			var me=Molpy.notifs[i];
			if (!me.l) me.l=g('notif'+i);
			me.life=0;
			me.x=x;
			me.y=y+Molpy.notifsY;
			me.text=text;
			me.l.innerHTML=text;
			me.l.style.left=Math.floor(Molpy.notifs[i].x-200)+'px';
			me.l.style.bottom=Math.floor(-Molpy.notifs[i].y)+'px';
			me.l.style.display='block';
			Molpy.notifsY+=me.l.clientHeight;
			me.y+=me.l.clientHeight;
			
			Molpy.notifsReceived++;
			Molpy.EarnBadge('Notified');
			if(Molpy.notifsReceived>=2000)
			{
				Molpy.EarnBadge('Thousands of Them!');
			}		
			if(log)
			{
				Molpy.notifLog[Molpy.notifLogNext]=text;
				Molpy.notifLogNext++;
				if(Molpy.notifLogNext>Molpy.notifLogMax)Molpy.notifLogNext=0;
				Molpy.notifLogPaint=1;
			}
		}
		
		Molpy.PaintNotifLog=function()
		{
			Molpy.notifLogPaint=0;
			var str='';
			var i = Molpy.notifLogNext;
			while(i<=Molpy.notifLogMax)
			{
				var line = Molpy.notifLog[i];
				if(line){
					str+=line+'<br/>';
				}
				i++;
			}
			i = 0;
			while(i<Molpy.notifLogNext)
			{
				var line = Molpy.notifLog[i];
				if(line){
					str+=line+'<br/>';
				}
				i++;
			}
			g('notiflogitems').innerHTML=str;
		}
				

		Molpy.DefineSandTools();
		Molpy.DefineCastleTools();
		Molpy.DefineBoosts();
		Molpy.DefineBadges();		
		
		Molpy.UpdateBeach();
		Molpy.HandlePeriods();
		Molpy.startDate=parseInt(new Date().getTime()); //used for save
		
		/*In which we announce that initialisation is complete
		++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
		
		
		Molpy.LoadC_STARSTAR_kie(); //autoload saved game
		Molpy.molpish=1;
		Molpy.Loopist();		
	}
	
	Molpy.ActivateNewPixBots=function()
	{
		Molpy.buildNotifyFlag=0;
		var bots = Molpy.CastleTools['NewPixBot'];
		bots.BuildPhase();
		Molpy.buildNotifyFlag=1;
		Molpy.Build(0);
		if(Molpy.Got('Factory Automation'))
		{
			if(Molpy.sand>=2000000)
			{
				Molpy.SpendSand(2000000);
				Molpy.RewardRedacted(1);
			}
		}
		Molpy.recalculateDig=1;
	}
	
	/*In which we explain how to think
	should be called once per milliNewPix
	++++++++++++++++++++++++++++++++++*/
	Molpy.Think=function()
	{
		Molpy.SandToCastles();
		if(! (Molpy.ketchupTime || Molpy.Boosts['Coma Molpy Style'].power))
			Molpy.CheckONG();
		Molpy.CheckRedactedToggle();
		
		for(var i in Molpy.Boosts)//count down any boosts with a countdown
		{
			var me = Molpy.Boosts[i];
			if(me.bought&&me.countdown)
			{
				me.countdown--;
				if(me.hovered)me.hovered=-2; //force redraw
				if(!me.countdown)
				{
					Molpy.LockBoost(i);
					me.power=0;
				}else if(me.hovered<0)me.hover();
			}
		}

		if(Molpy.recalculateDig) Molpy.CalculateDigSpeed();
		for(var i in Molpy.SandTools)
		{
			var me = Molpy.SandTools[i];
			me.totalSand+=me.storedTotalSpmNP;
			if(Molpy.showStats&&me.hovered<0)me.hover();
		}
		
		Molpy.Dig(Molpy.sandPermNP);
		if(Molpy.BadgesOwned==0) Molpy.EarnBadge('Redundant Redundancy');
		
		Molpy.Life++;
		if(Molpy.options.autosave){
			Molpy.autosaveCountup++;
			if(Molpy.autosaveCountup>=Molpy.options.autosave*5)
			{
				Molpy.SaveC_STARSTAR_kie(1);			
				Molpy.autosaveCountup=0;
			}
		}
		
		if(Molpy.judgeLevel>1 && Math.floor(Molpy.ONGelapsed/1000)%50==0)
		{
			var dAmount = (Molpy.judgeLevel-1)*Molpy.CastleTools['NewPixBot'].amount*50;
			if(Molpy.castles)
			{
				Molpy.Destroy(dAmount,1);
				Molpy.CastleTools['NewPixBot'].totalCastlesDestroyed+=dAmount;
				Molpy.Notify('By the NewpixBots');
			}
		}
		
		if(Molpy.shoppingItem && Molpy.Got('Shopping Assistant') && Molpy.Got(Molpy.IKEA))
		{
			var factor = Molpy.priceFactor;
			Molpy.priceFactor*=1.05;
			var name=Molpy.shoppingItem;
			var item = Molpy.SandTools[name] || Molpy.CastleTools[name] || Molpy.Boosts[name];
			item.buy();
			Molpy.priceFactor=factor;
		}
	}
	
	var clockDegrees=0;
	Molpy.CheckONG=function()
	{
		//if there's an ONG
		Molpy.ONGelapsed = new Date().getTime()-Molpy.ONGstart.getTime();
		if(Molpy.npbONG=='mustard')
		{
			Molpy.npbONG=(Molpy.ONGelapsed >= Molpy.ninjaTime);//whoops
		}
		var npPercent = Molpy.ONGelapsed/(Molpy.NPlength*1000);
		clockDegrees = (npPercent * 360) + 180; //rotation from top
		if(Molpy.ONGelapsed >= Molpy.NPlength*1000)//gotta convert to milliseconds
		{
			Molpy.ONG();
		}else
		if(Molpy.npbONG==0 && Molpy.ninjad==0)
		{
			if(Molpy.ONGelapsed >= Molpy.ninjaTime)//already in milliseconds
			{
				Molpy.npbONG=1;
				if(Molpy.newpixNumber>1) //obviously you can't have any active npb in first newpix
				{					
					Molpy.ActivateNewPixBots(); //wasn't ninja'd so we get some free sandcastles (neat!)
				}
			}
		}
	}
	Molpy.ONG=function()
	{
		Molpy.newpixNumber+=1;
		if(Molpy.newpixNumber > Molpy.highestNPvisited)
		{
			Molpy.highestNPvisited=Molpy.newpixNumber;
		}else //in the past
		{
			if(Molpy.newpixNumber > 2)
			{
				Molpy.UnlockBoost('Time Travel');
			}
		}
		Molpy.Boosts['Fractal Sandcastles'].power=0;
		Molpy.ONGstart = ONGsnip(new Date());
		Molpy.Notify('ONG!',1);	
		
		Molpy.HandlePeriods();
		Molpy.UpdateBeach();
		//various machines fire and do stuff
		
		if(Molpy.Boosts['Glass Furnace'].power)
		{
			Molpy.MakeChips();
		}
		if(Molpy.Boosts['Glass Blower'].power)
		{
			Molpy.MakeBlocks();
		}
		
		var activateTimes=1+Molpy.Got('Doublepost');
		while(activateTimes--)
		{
			Molpy.destroyNotifyFlag=0;
			var i = Molpy.CastleToolsN;
			while(i--)
			{
				var t = Molpy.CastleToolsById[i];
				t.DestroyPhase();
			}
			Molpy.destroyNotifyFlag=1;
			Molpy.Destroy(0);
			
			Molpy.buildNotifyFlag=0;
			i = Molpy.CastleToolsN;
			while(i--)
			{
				var t = Molpy.CastleToolsById[i];
				if(t.name!='NewPixBot')
					t.BuildPhase();
			}
			Molpy.buildNotifyFlag=1;
			Molpy.Build(0);
		}
		
		if(Molpy.nextCastleSand>1)
			Molpy.EarnBadge('Castle Price Rollback');
		Molpy.prevCastleSand=0; //sand cost of previous castle
		Molpy.nextCastleSand=1; //sand cost of next castle
		Molpy.SandToCastles();
		if(Molpy.ninjad==0)
		{
			var hadStealth = Molpy.ninjaStealth;
			if(Molpy.NinjaUnstealth())
				if(hadStealth)Molpy.EarnBadge('Ninja Holidip');
		}
		Molpy.ninjad=0;//reset ninja flag
		Molpy.npbONG=0;//reset newpixbot flag
		
		
		Molpy.Boosts['Temporal Rift'].hardlocked=1;
		if(Molpy.newpixNumber%
			(50-(Molpy.Got('Time Travel')+Molpy.Got('Flux Capacitor')+Molpy.Got('Flux Turbine'))*10)==0)
		{
			Molpy.Boosts['Temporal Rift'].hardlocked=(Math.random()*6<5)*1;
		}
	}
		
	Molpy.HandlePeriods=function()
	{
		//check length of current newpic
		if(Molpy.newpixNumber <= 240)
		{
			Molpy.NPlength=1800; 
			Molpy.LockBoost('Overcompensating');
			Molpy.LockBoost('Doublepost');
			Molpy.LockBoost('Active Ninja');
			Molpy.Boosts['Doublepost'].hardlocked=1;//prevent the department from unlocking it
			Molpy.Boosts['Active Ninja'].hardlocked=1;//prevent the department from unlocking it
		}else
		{		
			Molpy.NPlength=3600;
			Molpy.Boosts['Doublepost'].hardlocked=0;
			Molpy.Boosts['Active Ninja'].hardlocked=0;
		}
		if(Molpy.newpixNumber > 241)
		{
			Molpy.EarnBadge("Have you noticed it's slower?");
		}
		if(Molpy.newpixNumber >= 250)
		{
			Molpy.UnlockBoost('Overcompensating');
		}
		Molpy.TimePeriod=["Here be Dragons"];
		Molpy.TimeEra=["Here be Dragons"];
		Molpy.TimeEon=["Here be Dragons"];
		for(var i in Molpy.Periods)
		{
			var per = Molpy.Periods[i];
			if(Molpy.newpixNumber<=per[0])
			{
				Molpy.TimePeriod=per[1];
				break;
			}
		}
		for(var i in Molpy.Eras)
		{
			var era = Molpy.Eras[i];
			if(Molpy.newpixNumber<=era[0])
			{
				Molpy.TimeEra=era[1];
				break;
			}
		}
		for(var i in Molpy.Eons)
		{
			var eon = Molpy.Eons[i];
			if(Molpy.newpixNumber<=eon[0])
			{
				Molpy.TimeEon=eon[1];
				break;
			}
		}
	}
	Molpy.UpdateBeach=function()
	{
		if(Molpy.Boosts['Chromatic Heresy'].power&&Molpy.options.otcol)
		{	
			g('beach').style.background='url(http://178.79.159.24/Time/otcolorization/'+Molpy.newpixNumber+')';
			g('beach').style.backgroundSize='auto';	
		}else{
			g('beach').style.background='url(http://xkcd.mscha.org/frame/'+Molpy.newpixNumber+')';
			g('beach').style.backgroundSize='auto';	
		}
	}
	/* In which we figure out how to draw stuff
	+++++++++++++++++++++++++++++++++++++++++++*/
	Molpy.redactedClassNames=['hidden','floatbox sand tool shop','floatbox castle tool shop',
		'floatbox boost shop','lootbox boost loot','lootbox badge loot','lootbox badge shop'];
	Molpy.Draw=function()
	{
		g('castlecount').innerHTML=Molpify(Molpy.castles,1,!Molpy.showStats) + ' castles';
		g('sandcount').innerHTML=Molpify(Molpy.sand,1,!Molpy.showStats) + ' sand of ' + Molpify(Molpy.nextCastleSand,1,!Molpy.showStats) + ' needed';
		g('sandrate').innerHTML=Molpify(Molpy.sandPermNP,1,!Molpy.showStats) + ' sand/mNP';
		g('newpixnum').innerHTML='Newpix '+Molpy.newpixNumber;
		g('eon').innerHTML=Molpy.TimeEon;
		g('era').innerHTML=Molpy.TimeEra;
		g('period').innerHTML=Molpy.TimePeriod;
		g('version').innerHTML= '<br>Version: '+Molpy.version + (Molpy.version==1.21?' Gigawatts!':'');
		
		var repainted=Molpy.shopRepaint||Molpy.boostRepaint||Molpy.badgeRepaint;
		
		if(Molpy.shopRepaint)
		{
			Molpy.RepaintShop();
		}
		if(Molpy.boostRepaint)
		{
			Molpy.RepaintBoosts();
		}
		if(Molpy.badgeRepaint)
		{
			Molpy.RepaintBadges();
		}
		if(repainted&&showhide.tagged)
		{
			Molpy.RepaintTaggedLoot();
		}
		if(repainted) Molpy.RepaintLootSelection();
		if(repainted&&Molpy.redactedVisible)
		{		
			var redacteditem=g('redacteditem');
			if(redacteditem)
			{
				redacteditem.className=Molpy.redactedClassNames[Molpy.redactedVisible];
			}
		}
		for(var i in Molpy.SandTools)
		{
			var me = Molpy.SandTools[i];
			Molpy.TickHover(me);
			
			if(me.amount)
			{
				var desc = g('SandToolDescription'+me.id);
				if(desc)
				{
					if(desc.innerHTML==''||desc.innerHTML.indexOf('Sand/mNP:')>-1)
					{
						desc.innerHTML='Sand/mNP: '+Molpify(me.storedTotalSpmNP,1,!Molpy.showStats);					
					}		
				}
			}
		}
		for(i in Molpy.CastleTools)
		{
			var me = Molpy.CastleTools[i];
			Molpy.TickHover(me);
			
			var desc = g('CastleToolDescription'+me.id);
			if(desc)
			{
				if(desc.innerHTML==''||desc.innerHTML.indexOf('Active:')>-1 ||desc.innerHTML.indexOf("Ninja'd")>-1 )
				{
					if(me.currentActive && Molpy.ninjaTime>Molpy.ONGelapsed)
					{
						if(Molpy.ninjad)
						{
							desc.innerHTML="Ninja'd!";
						}else
						{
							desc.innerHTML='Active: '+me.currentActive+'<br/>Timer: '
							+Math.ceil((Molpy.ninjaTime-Molpy.ONGelapsed)/Molpy.NPlength);
						}
					}else{
						desc.innerHTML='';
					}
				}		
			}			
		}	
		for(i in Molpy.Boosts)
		{
			var me = Molpy.Boosts[i];
			if(me.unlocked)
			{
				Molpy.TickHover(me);
			}
		}
		for(i in Molpy.Badges)
		{
			var me = Molpy.Badges[i];
			//todo: skip badges which are hidden
			Molpy.TickHover(me);			
		}

		drawClockHand();
		if(Molpy.showStats) Molpy.PaintStats();
		Molpy.notifsUpdate();
		Molpy.sparticlesUpdate();
		
		if(Molpy.scrumptiousDonuts==1)
		{
			g('scrumptiousdonuts').innerHTML=BeanishToCuegish('JTI1M0NpZnJhbWUlMjUyMHNyYyUyNTNEJTI1MjJodHRwJTI1M0ElMjUyRiUyNTJGd3d3LnlvdXR1YmUuY29tJTI1MkZlbWJlZCUyNTJGR1U5Ukw2RDIzamslMjUzRmF1dG9wbGF5JTI1M0QxJTI1MjIlMjUyMHdpZHRoJTI1M0QlMjUyMjEwMCUyNTIyJTI1MjBoZWlnaHQlMjUzRCUyNTIyNjglMjUyMiUyNTIwZnJhbWVib3JkZXIlMjUzRCUyNTIyMCUyNTIyJTI1MjBhbGxvd2Z1bGxzY3JlZW4lMjUzRSUyNTNDJTI1MkZpZnJhbWUlMjUzRQ==');
			Molpy.Notify('Give you up,');
		}else if(Molpy.scrumptiousDonuts==-1){
			g('scrumptiousdonuts').innerHTML='';
		}
		if(Molpy.scrumptiousDonuts>0){
			Molpy.scrumptiousDonuts--;
		}
	}
	
	Molpy.TickHover=function(me)
	{
		if(me.hoverOnCounter>0)
		{	
			me.hoverOnCounter--;
			if(me.hoverOnCounter<=0)
			{
				me.showdesc();
			}
		}
		if(me.hoverOffCounter>0)
		{
			me.hoverOffCounter--;
			if(me.hoverOffCounter<=0)
			{
				me.hidedesc();
			}
		}
	}
		
	Molpy.PaintStats=function()
	{
		g('totalsandstat').innerHTML=Molpify(Molpy.sandDug,1);
		g('manualsandstat').innerHTML=Molpify(Molpy.sandManual);
		g('clicksstat').innerHTML=Molpify(Molpy.beachClicks);
		g('spclickstat').innerHTML=Molpify(Molpy.computedSandPerClick,1);
		g('sandspentstat').innerHTML=Molpify(Molpy.sandSpent);
		g('totalcastlesstat').innerHTML=Molpify(Molpy.castlesBuilt);
		g('destroyedcastlesstat').innerHTML=Molpify(Molpy.castlesDestroyed);
		g('spentcastlesstat').innerHTML=Molpify(Molpy.castlesSpent);
		
		g('ninjatimestat').innerHTML=Molpify(Molpy.ninjaTime/Molpy.NPlength,1)+'mNP';		
		g('ninjastealthstat').innerHTML=Molpify(Molpy.ninjaStealth)+'NP';	
		var forgives=Molpy.Got('Ninja Hope')+Molpy.Got('Ninja Penance');
		g('ninjaforgivestat').innerHTML=Molpy.Boosts['Ninja Hope'].power*Molpy.Got('Ninja Hope')
			+Molpy.Boosts['Ninja Penance'].power*Molpy.Got('Ninja Penance');		
		
		g('loadcountstat').innerHTML=Molpify(Molpy.loadCount);
		g('savecountstat').innerHTML=Molpify(Molpy.saveCount);	
		g('notifstat').innerHTML=Molpify(Molpy.notifsReceived);	
		g('autosavecountstat').innerHTML=Molpify(Molpy.autosaveCountup);	
		
		g('sandtoolsownedstat').innerHTML=Molpify(Molpy.SandToolsOwned);			
		g('castletoolsownedstat').innerHTML=Molpify(Molpy.CastleToolsOwned);			
		g('boostsownedstat').innerHTML=Molpify(Molpy.BoostsOwned);			
		g('badgesownedstat').innerHTML=Molpify(Molpy.BadgesOwned);		
		
		g('sandmultiplierstat').innerHTML=Molpify(Molpy.globalSpmNPMult*100,1)+'%';			
		g('redactedstat').innerHTML=Molpy.redactedWords + ": " + Molpify(Molpy.redactedClicks);		
		if(Molpy.notifLogPaint)Molpy.PaintNotifLog();
	}
	
	function createClockHand()
	{
		var clockSizeX = 40,
			clockSizeY = 40,
			handOriginX = clockSizeX / 2,
			handOriginY = clockSizeY / 2,
			handSize = 12;
		var hand = document.createElement("div");
		$(hand).css({ 
			position:"relative",
			left: handOriginX+"px",
			top: handOriginY+"px",
			width: "2px",
			height: handSize+"px",
			backgroundColor: "#222",
		});
		g("clockface").appendChild(hand);
    }
	$(document).ready(function () {
		createClockHand();
	});
	function drawClockHand()
	{
		if(!g('game'))return;
		if(!Molpy.ONGelapsed){
			Molpy.ONGelapsed = new Date().getTime()-Molpy.ONGstart.getTime();
		}
		var npPercent = Molpy.ONGelapsed/(Molpy.NPlength*1000);
		clockDegrees = (npPercent * 360) + 180; //rotation from top		

		$("#clockface").children('div').css({ 
			transformOrigin: "0% 0%",
			transform: "rotate(" + clockDegrees + "deg)",
			'-ms-transform': "rotate(" + clockDegrees + "deg)",
			'-ms-transform-origin': "0% 0%",
			WebkitTransform: "rotate(" + clockDegrees + "deg)",
			'-webkit-transform-origin': "0% 0%"
        });
	}
	
	/* In which loopists do their thing
	+++++++++++++++++++++++++++++++++++*/
	Molpy.Loopist=function()
	{
		Molpy.ketchupTime=0;
		Molpy.lateness+=((new Date().getTime()-Molpy.time));
		Molpy.lateness=Math.min(Molpy.lateness, 7200);//it's okay to skip a bit
		if(Molpy.lateness > Molpy.NPlength)
		{
			Molpy.Think();
			Molpy.lateness -= Molpy.NPlength;
		}
		Molpy.ketchupTime=1;
		while(Molpy.lateness > Molpy.NPlength)
		{
			Molpy.Think();
			Molpy.lateness -= Molpy.NPlength;
		}
		Molpy.ketchupTime=0;
		Molpy.Draw();
		Molpy.time=new Date().getTime();
		setTimeout(Molpy.Loopist, 1000/Molpy.fps);
	}	
}



/* In which we make it go!
++++++++++++++++++++++++++*/
Molpy.Up();
window.onload=function()
{
	if(!Molpy.molpish) Molpy.Wake();
};
