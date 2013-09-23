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
function Molpify(number, raftcastle, shrinkify)
{
	if(isNaN(number))return'Mustard';
	var molp='';
	
	if(shrinkify)
	{
		if(number>1000000000000000)
		{
			return Molpify(number / 1000000000000000, raftcastle)+'P';
		}
		if(number>1000000000000)
		{
			return Molpify(number / 1000000000000, raftcastle)+'T';
		}
		if(number>1000000000)
		{
			return Molpify(number / 1000000000, raftcastle)+'G';
		}
		if(number>1000000)
		{
			return Molpify(number / 1000000, raftcastle)+'M';
		}
		if(number>100000)
		{
			return Molpify(number / 1000, raftcastle)+'K';
		}
	}
	
	if(raftcastle>0)
	{
		var numCopy=number;
		//get the right number of decimal places to stick on the end:
		var raft=Math.round(numCopy*Math.pow(10,raftcastle)-Math.floor(numCopy)*Math.pow(10,raftcastle));
		molp=Molpify(numCopy)+(raft?('.'+raft):''); //stick them on the end if there are any
	}else
	{
		number=Math.floor(number);//drop the decimal bit
		number=(number+'').split('').reverse(); //convert to string, then array of chars, then backwards
		for(var i in number)
		{
			if(i%3==0 &&i>0) molp=','+molp;//stick commas in every 3rd spot but not 0th
			molp=number[i]+molp;
		}
	}
	return molp;
}
function PriceSort(a,b)
{
	if (a.sandPrice>b.sandPrice) return 1;
	else if (a.sandPrice<b.sandPrice) return -1;
	else
	if (a.castlePrice>b.castlePrice) return 1;
	else if (a.castlePrice<b.castlePrice) return -1;
	else return 0;
}
function FormatPrice(monies)
{
	return Molpify(Math.floor(monies*Molpy.priceFactor),1,!Molpy.showStats);
}
function Flint(stones){return parseInt(Math.floor(stones))}
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
function EvalMaybeFunction(bacon,babies)
{
	var B = typeof(bacon);
	var D = 'function';
	return(B===D?bacon(babies):bacon);	
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

var showhide={boosts:1,badges:1,badgesav:1};
function showhideButton(key)
{
	return '<input type="Button" value="'+(showhide[key]?'Visible':'Hidden')+'" onclick="showhideToggle(\''+key+'\')"></input>'
}
function showhideToggle(key)
{
	showhide[key]=!showhide[key];
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
		Molpy.version=0.981;
		
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
			Molpy.options.fancy=1;
			Molpy.options.ketchup=0;
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
			Flint(Molpy.options.autosave)+
			(Molpy.options.autoupdate?'1':'0')+
			(Molpy.options.sea?'1':'0')+
			(Molpy.options.fancy?'1':'0')+
			(Molpy.options.ketchup?'1':'0')+
			Flint(Molpy.options.colourscheme)+
			p;
			
			thread+=			
			Flint(Molpy.newpixNumber)+s+
			Flint(Molpy.sandDug)+s+
			Flint(Molpy.sandManual)+s+
			Flint(Molpy.sand)+s+
			Flint(Molpy.castlesBuilt)+s+
			Flint(Molpy.castles)+s+
			Flint(Molpy.castlesDestroyed)+s+
			Flint(Molpy.prevCastleSand)+s+
			Flint(Molpy.nextCastleSand)+s+
			Flint(Molpy.castlesSpent)+s+
			Flint(Molpy.sandSpent)+s+
			Flint(Molpy.beachClicks)+s+
			Flint(Molpy.ninjaFreeCount)+s+
			Flint(Molpy.ninjaStealth)+s+
			Flint(Molpy.ninjad)+s+
			Flint(Molpy.saveCount)+s+
			Flint(Molpy.loadCount)+s+
			Flint(Molpy.notifsReceived)+s+
			Flint(Molpy.timeTravels)+s+
			Flint(Molpy.npbONG)+s+
		
			Flint(Molpy.redactedCountup)+s+
			Flint(Molpy.redactedToggle)+s+
			Flint(Molpy.redactedVisible)+s+
			Flint(Molpy.redactedViewIndex)+s+
			Flint(Molpy.redactedClicks)+s+
			Flint(Molpy.highestNPvisited)+s+
			Flint(Molpy.totalCastlesDown)+s+
			Flint(Molpy.intruderBots)+s+
			p;
			//sand tools:
			for(var cancerbabies in Molpy.SandTools)
			{
				var cb = Molpy.SandTools[cancerbabies];
				thread += cb.amount+c+cb.bought+c+Flint(cb.totalSand)+s;
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
			Molpy.options.fancy=parseInt(pixels[5]);
			Molpy.options.ketchup=parseInt(pixels[6]);
			Molpy.options.colourscheme=parseInt(pixels[7]);
			
			pixels=thread[4].split(s);
			Molpy.newpixNumber=parseInt(pixels[0]);
			Molpy.sandDug=parseInt(pixels[1]);
			Molpy.sandManual=parseInt(pixels[2]);
			Molpy.sand=parseInt(pixels[3]);
			Molpy.castlesBuilt=parseInt(pixels[4]);
			Molpy.castles=parseInt(pixels[5]);
			Molpy.castlesDestroyed=parseInt(pixels[6]);
			Molpy.prevCastleSand=parseInt(pixels[7]);
			Molpy.nextCastleSand=parseInt(pixels[8]);
			Molpy.castlesSpent=parseInt(pixels[9]);
			Molpy.sandSpent=parseInt(pixels[10]);
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
			Molpy.redactedViewIndex=parseInt(pixels[23]);
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
					me.totalSand=parseInt(ice[2]);
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
					me.totalCastlesBuilt=parseInt(ice[2]);
					me.totalCastlesDestroyed=parseInt(ice[3]);
					if(!me.totalCastlesDestroyed)me.totalCastlesDestroyed=0;//mustard cleaning
					me.totalCastlesWasted=parseInt(ice[4]);
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
					if(me.bought)Molpy.BoostsOwned++;
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
				//reset structures and unlocks and stuff 
				
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
			}else return;
			Molpy.OptionDescription(bacon,1); //update description
		}
		Molpy.optionNames=['autosave','colourscheme','sandnumbers'];
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
				}else{
					return;
				}
			}
			g(bacon+'description').innerHTML='<br/>'+desc;
		}
		Molpy.UpdateColourScheme=function()
		{
			var heresy=(Molpy.Got('Chromatic Heresy')&&Molpy.Boosts['Chromatic Heresy'].power)?
				' heresy':'';
			
			if(Molpy.options.colourscheme)
			{
				document.body.className='lightscheme'+heresy;
			}else{
				document.body.className='darkscheme'+heresy;
			}
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
				Molpy.EarnBadge('Glass Factory');
			}
			if(Molpy.sand>=7000000){
				Molpy.EarnBadge('Silicon Valley');
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
				Molpy.Build(1);
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
					Molpy.ninjaStealth+=(1+Molpy.Got('Active Ninja')*2);
					
					if(Molpy.Got('Ninja Builder')) 
					{
						var stealthBuild=Molpy.ninjaStealth;
						if(Molpy.Got('Ninja Assistants')) stealthBuild*=Molpy.CastleTools['NewPixBot'].amount;
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
			}
			Molpy.ninjad=1;
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
			Molpy.ninjaTime = Molpy.baseNinjaTime/ninjaFactor;
			if(Molpy.Got('Molpies'))//molpy molpy molpy molpy molpy
			{
				multiplier+=0.01*Molpy.BadgesOwned;
			}
			if(Molpy.Got('Grapevine'))//grapevine
			{
				multiplier+=0.02*Molpy.BadgesOwned;
			}
			if(Molpy.Got('Blitzing'))
			{
				multiplier*=Molpy.Boosts['Blitzing'].power;
			}
			Molpy.computedSandPerClick=Molpy.sandPerClick()*multiplier;
			
			if(Molpy.Got('Overcompensating')) //doesn't apply to clicks
			{
				multiplier+=Molpy.Boosts['Overcompensating'].power;
			}
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
		Molpy.castleToolPriceFactor=1.1;
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
				var price=Math.floor(Molpy.priceFactor*this.basePrice*Math.pow(Molpy.castleToolPriceFactor,this.amount));				
				if (Molpy.castles>=price)
				{
					Molpy.SpendCastles(price);
					this.amount++;
					this.bought++;
					price=Math.floor(this.basePrice*Math.pow(Molpy.castleToolPriceFactor,this.amount));
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
					Molpy.Build(Math.floor(price*0.5),1);
					price=this.basePrice*Math.pow(Molpy.castleToolPriceFactor,this.amount);
					this.price=price;
					if (this.sellFunction) this.sellFunction();
					if (this.drawFunction) this.drawFunction();
					Molpy.shopRepaint=1;
					Molpy.recalculateDig=1;
					Molpy.SandToolsOwned--;
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
				this.price=Math.floor(this.basePrice*Math.pow(Molpy.castleToolPriceFactor,this.amount));
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
						Molpy.Build(price,1);
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
				var actuals ='<br/>Builds '+Molpify(bN)+(dN?(' if '+Molpify(dN)+((dN-1)?' are':' is')+' destroyed.'):'');
				if(Molpy.showStats)
				{
					if(this.totalCastlesDestroyed)
						desc+='Total castles '+this.actionDName+': '+Molpify(this.totalCastlesDestroyed,1)+
						'<br/>Total castles wasted: '+Molpify(this.totalCastlesWasted,1);
					if(this.totalCastlesBuilt)
						desc+='<br/>Total castles '+this.actionBName+': +'+Molpify(this.totalCastlesBuilt,1);
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
		Molpy.Boost=function(name,desc,sand,castles,stats,icon,buyFunction,startPower,startCountdown)
		{
			this.id=Molpy.BoostN;
			this.name=name;
			this.desc=desc;
			this.sandPrice=sand;
			this.castlePrice=castles;
			this.stats=stats;
			this.icon=icon;
			this.buyFunction=buyFunction;
			this.unlocked=0;
			this.bought=0;
			this.hardlocked=0; //prevent unlock by the department (this is not a saved value)
			this.order=this.id;
			this.hovered=0;
			this.power=0;
			this.countdown=0;
			if(startPower)
			{
				this.startPower=startPower;
				this.power=startPower;
			}
			this.startCountdown=startCountdown;
			if(order) this.order=order+this.id/1000;
			//(because the order we create them can't be changed after we save)
			
			
			this.buy=function()
			{
				var sp = Math.floor(Molpy.priceFactor*this.sandPrice);
				var cp = Math.floor(Molpy.priceFactor*this.castlePrice);
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
				if(Molpy.Boosts[bacon])
				{
					if(Molpy.Boosts[bacon].unlocked==1)
					{
						Molpy.Boosts[bacon].unlocked=0;
						Molpy.boostRepaint=1;
						Molpy.shopRepaint=1;
						Molpy.recalculateDig=1;
						if(Molpy.Boosts[bacon].bought==1);
						{
							Molpy.BoostsOwned--;
							Molpy.Boosts[bacon].bought=0;
						} //Orteil did this bit wrong :P
						if(!silent)
							Molpy.Notify('Boost Locked: '+bacon,1);
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
						Molpy.redactedVisible=0;
						Molpy.shopRepaint=1;
						Molpy.boostRepaint=1;
						Molpy.badgeRepaint=1;						
						Molpy.RandomiseRedactedTime();	
					}else{
						Molpy.redactedVisible=Math.ceil(Molpy.redactableThings*Math.random());
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
					var castles=Math.floor(Molpy.sand/1000);				
					Molpy.Notify('Blast Furnace in Operation!');
					Molpy.SpendSand(castles*1000);
					Molpy.Build(castles);
					return;				
				}
			
				var availRewards=[];
				var i = Molpy.departmentBoosts.length;
				var f=0;
				while(i--)
				{
					var me=Molpy.Boosts[Molpy.departmentBoosts[i]];
					if(!(me.unlocked||me.bought||me.hardlocked))
					{
						availRewards[f]=me;
						f++;
					}
				}
				
				if(f)
				{
					var red=GLRschoice(availRewards);
					if((red.sandPrice+red.castlePrice))
					{
						Molpy.Notify('The Department of Redundancy Department has produced:',1);
						Molpy.UnlockBoost(red.name);
					}else{
						Molpy.Notify('The Department of Redundancy Department has provided:',1);
						Molpy.GiveTempBoost(red.name,red.startPower,red.startCountdown);
					}
					return;
				}
			}
			
			if(Math.floor(2*Math.random()))
			{
				Molpy.Notify('You are Not Lucky');
				Molpy.Notify('Which is Good');
				var bonus=0;
				var i=0;
				while(i<Molpy.SandToolsN)
				{
					bonus+=Molpy.SandToolsById[i].amount*Math.pow(4,i+1);
					i++;
                } 
				i=0;
				while(i<Molpy.CastleToolsN)
				{
					bonus+=Molpy.CastleToolsById[i].amount*Math.pow(3,i+1);
					i++;
                }
				bonus += Molpy.BoostsOwned+Molpy.BadgesOwned;
				bonus += Molpy.redactedClicks*10;
				Molpy.Build(bonus);
			}else{
				var blitzSpeed=8,blitzTime=23;
				var BKJ = Molpy.Boosts['Blixtnedslag Kattungar, JA!'];
				if(BKJ.bought) blitzSpeed+= Molpy.redactedClicks-BKJ.power;
				Molpy.GiveTempBoost('Blitzing',blitzSpeed,blitzTime);
			}			
		}
		Molpy.CalcPriceFactor=function()
		{
			var baseval=1;
			var savings = 0;
			if(Molpy.Got(Molpy.IKEA))
			{
				savings+=Molpy.Boosts[Molpy.IKEA].power;
			}
			Molpy.priceFactor=Math.max(0,baseval-savings);
		}
		
		Molpy.RepaintLootSelection=function()
		{
			var str = '';
			if(Molpy.BoostsOwned)
			{
				str+= '<div class="floatsquare boost loot"><div class="icon '
					+(Molpy.redactedVisible==4?'redacted':'')
					+'"></div>Boosts<br/>'+showhideButton('boosts')+'</div>';
			}
			if(Molpy.BadgesOwned)
			{
				str+= '<div class="floatsquare badge loot"><div class="icon '
					+(Molpy.redactedVisible==5?'redacted':'')
					+'"></div>Badges<br/>Earned<br/>'+showhideButton('badges')+'</div>';
			}
			if(Molpy.BadgeN-Molpy.BadgesOwned)
			{
				str+= '<div class="floatsquare badge shop"><div class="icon '
					+(Molpy.redactedVisible==6?'redacted':'')
					+'"></div>Badges<br/>Available<br/>'+showhideButton('badgesav')+'</div>';
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
				str+='<div class="floatbox sand shop" onMouseOver="onhover(Molpy.SandToolsById['+me.id+'],event)" onMouseOut="onunhover(Molpy.SandToolsById['+me.id+'],event)"><div id="tool'+me.name+'" class="icon"></div><div class="title">'+me.name+' <a onclick="Molpy.SandToolsById['+me.id+'].buy();">Buy</a> <a onclick="Molpy.SandToolsById['+me.id+'].sell();">Sell</a></div>'+
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
				str+='<div class="floatbox castle shop" onMouseOver="onhover(Molpy.CastleToolsById['+me.id+'],event)" onMouseOut="onunhover(Molpy.CastleToolsById['+me.id+'],event)"><div id="tool'+me.name+'" class="icon"></div><div class="title">'+me.name+' <a onclick="Molpy.CastleToolsById['+me.id+'].buy();">Buy</a> <a onclick="Molpy.CastleToolsById['+me.id+'].sell();">Sell</a></div>'+
				(me.amount>0?'<div class="title owned">Owned: '+me.amount+'</div>':'')+
				'<span class="price">Price: '+FormatPrice(me.price)+(me.price<100?' Castles':' C')+'</span>'+
				'<div id="CastleToolDescription'+me.id+'"></div></div></div>';
				i++
			}
			if(i==redactedIndex) str+= Molpy.redactedShop;
			g('castletools').innerHTML=str;		
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
				var cn= me.className?me.className:'';
				str+='<div class="floatbox boost shop '+cn+'" onMouseOver="onhover(Molpy.BoostsById['+me.id+'],event)" onMouseOut="onunhover(Molpy.BoostsById['+me.id+'],event)"><div id="boost_'+(me.icon?me.icon:me.name)+'" class="icon"></div><div class="title">'+me.name+' <a onclick="Molpy.BoostsById['+me.id+'].buy();">Buy</a></div><span class="price">Price: '+FormatPrice(me.sandPrice)+' Sand + '+FormatPrice(me.castlePrice)+' Castles</span><div id="BoostDescription'+me.id+'"></div></div></div>';
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
					Molpy.redactedViewIndex=Math.floor((blist.length+1)*Math.random());
				}
				redactedIndex=Molpy.redactedViewIndex;
			}
			str='';			
			if(showhide.boosts){
				r=0;
				for (var i in blist)
				{
					if(r==redactedIndex) str+= Molpy.redactedLoot;
					var me=blist[i];
					var cn= me.className?me.className:'';
					str+='<div class="lootbox boost loot '+cn+'" onMouseOver="onhover(Molpy.BoostsById['+me.id+'],event)" onMouseOut="onunhover(Molpy.BoostsById['+me.id+'],event)"><div id="boost_'+(me.icon?me.icon:me.name)+'" class="icon"></div><div class="heading">[boost]</div><div class="title">'+me.name+'</div><div id="BoostDescription'+me.id+'"></div></div></div>';
					r++;
				}
				if(r==redactedIndex) str+= Molpy.redactedLoot;
			}
			Molpy.boostHTML=str;
			g('loot').innerHTML=Molpy.boostHTML+Molpy.badgeHTML;	
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
					var cn= me.className?me.className:'';
					str+='<div class="lootbox badge loot '+cn+'" onMouseOver="onhover(Molpy.BadgesById['+me.id+'],event)" onMouseOut="onunhover(Molpy.BadgesById['+me.id+'],event)"><div id="badge'+me.name+'" class="icon"></div><div class="heading">[badge]</div><div id="boost'+me.id+'"></div><div class="title">'+me.name+'</div><div id="BadgeDescription'+me.id+'"></div></div></div>';
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
					str+='<div class="lootbox badge shop" onMouseOver="onhover(Molpy.BadgesById['+me.id+'],event)" onMouseOut="onunhover(Molpy.BadgesById['+me.id+'],event)"><div id="badge'+me.name+'" class="icon"></div><div class="heading">[badge]</div><div id="boost'+me.id+'"></div><div class="title">'+(me.visibility<2?me.name:'????')+'</div><div id="BadgeDescription'+me.id+'"></div></div></div>';
					r++;
				}
				if(r==redactedIndex) str+= Molpy.redactedLoot;
			}
			Molpy.badgeHTML+=str;
			g('loot').innerHTML=Molpy.boostHTML+Molpy.badgeHTML;		
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
					me.power=0;
					Molpy.LockBoost(i);
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
			Molpy.Destroy(dAmount,1);
			Molpy.CastleTools['NewPixBot'].totalCastlesDestroyed+=dAmount;
			Molpy.Notify('By the NewpixBots');
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
		
		Molpy.ONGstart = ONGsnip(new Date());
		Molpy.Notify('ONG!',1);	
		
		Molpy.HandlePeriods();
		Molpy.UpdateBeach();
		//various machines fire and do stuff
		
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
		g('beach').style.background='url(http://xkcd.mscha.org/frame/'+Molpy.newpixNumber+')';
		g('beach').style.backgroundSize='auto';	
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
		g('version').innerHTML= '<br>Version: '+Molpy.version;
		
		var repainted=Molpy.shopRepaint||Molpy.boostRepaint||Molpy.badgeRepaint;
		if(repainted) Molpy.RepaintLootSelection();
		
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
