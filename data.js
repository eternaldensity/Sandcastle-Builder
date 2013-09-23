Molpy.HardcodedData=function()
{	
	Molpy.Periods=[
		[9,"The Debut/What? Period"],
		[23,"The Dark Period"],
		[44,"The Sandcastle Period"],
		[74,"The Megan Period"],
		[87,"The Happiness Period"],
		[104,"The Male Period"],
		[124,"The Rebuild Period"],
		[136,"Age of the Slow Pixel"],
		[145,"The Great Expansion"],
		[167,"The Populated Period of Expansion"],
		[178,"\"Wanna Swim?\" Period"],
		[182,"Second Age of the Slow Pixel"],
		[211,"Operation Connect Castle"],
		[233,"Attack of the Trebuchet"],
		[324,"Second Megan Period"],
		[375,"The Architect Age"],	
		[420,"Recursion"],
		[462,"The Poles"],
		[478,"The Scaffolding"],
		[493,"The Tasting"],
		[543,"The Scaffolding continued"],
		[582,"The Observation/Observed Platform"],
		[666,"The Building of the Rooks"],
		[725,"The Next Level"],
		[798,"Third Megan Period"],
		[802,"The Little French Girl Period"],
		[826,"Fourth Megan Period"],
		[840,"\"The Sea Can Do Whatever It Wants\" Period"],
		[868,"The Additional Flags Period"],
		[874,"Third Age of the Slow Pixel"],
		[882,"The Bag Period"],
		[971,"The Fading"],
		[997,"The First Journey Period"],
		[1001,"The Fake Loop"],
		[1021,"Second Journey Period"],
		[1077,"The River Period"],
		[1121,"Third Journey Period"],
		[1149,"Second River Period"],
		[1228,"Fourth Journey Period"],
		[1300,"The Hills Period"],
		[1336,"Fifth Journey Period"],
		[1359,"The Tree Period"],
		[1376,"Cueball's Quest"],
		[1403,"Sixth Journey Period"],
		[1423,"Third River Period"],
		[1502,"Seventh Journey Period"],
		[1552,"\"Wow\" Baobab Period"],
		[1578,"Vineyard Period"],
		[1611,"Questioning the Quest at the Abandoned Habitation"],
		[1661,"Megan's Quest"],
		[1725,"Into the Mountains"],
		[1765,"\"Snake!\""],
		[1825,"The Tree Stumps"],
		[1882,"Chirp"],
		[1928,"The Tiny River Period"],
		[1969,"The \"Wowterfall\" Period"],
		[2014,"Eighth Journey Period"],
		[2065,"The Epic of Pricklymolp"],
		[2141,"The Fluttermolpy Discussion"],
		[2178,"The Weird Tree Period"],
		[2225,"The Abandoned Former Habitation on the Mountain Plateau"],
		[2317,"The Attack"],
		[2356,"Ninth Journey Period"],
		[2388,"The Sunset Period"],
		[2440,"Cueball's Watch"],
		[2530,"Megan's Watch"],
		[2567,"Cueball's Awakening"],
		[2610,"The Observation at the Summit"],
		[2615,"The Bucket Period"],
		[2645,"Into Thin Air"],
		[2693,"First Encounter"],
		[2714,"Communication Period"],
		[2737,"Pictogram Period"],
		[2788,"Tenth Journey Period"],
		[2801,"The Map Period"],
		[2813,"The Flag Period"],
		[2839,"The City Period"],
		[2856,"The Castle Period"],
		[2920,"The Understanding"],
		[3015,"RUN."],
		[3029,"Meeting The Forty"],
		[3088,"The Raftcastle"],
		[3094,"The End"],
	]
	
	Molpy.Eras=[
		[124,"The Pre-expansion Era"],
		[420,"The Castleiferous Era"],
		[582,"The Industrial Era"],
		[798,"The Developing Era"],
		[971,"The Enlightenment Era"],
		[1021,"The Shoreline Era"],
		[1228,"The River Era"],
		[1423,"The Hills and Forest Era"],
		[1661,"The Discovery Era"],
		[2356,"The Mountain Era"],
		[1661,"The Night Era"],
		[2615,"The Summit Era"],
		[2813,"The Contact Era"],
		[2920,"The Civilization Era"],
		[3094,"The Rescue Era"]
	]
	
	Molpy.Eons=[
		[971,"The Sandcastle Eon"],
		[2615,"The Journey Eon"],
		[3094,"The Encounter Eon"]
	]
}
Molpy.DefineSandTools=function()
{

	new Molpy.SandTool('Bucket','bucket|buckets|poured','Pours a little sand',8,
		function(){
			var baserate =0.1 + Molpy.Got('Bigger Buckets')*0.1;
			var mult=1;
			if(Molpy.Got('Huge Buckets'))mult*=2;
			if(Molpy.Got('Trebuchet Pong'))mult*=Math.pow(1.5,Math.floor(Molpy.CastleTools['Trebuchet'].amount/2));
			if(Molpy.Got('Carrybot'))mult*=4;
			return mult*baserate;
			
			;}
	);
	
	new Molpy.SandTool('Cuegan','cuegan|cuegans|tossed','Megan and Cueball toss in a bit of extra sand',50,
		function(){
			var baserate = 0.6+Molpy.Got('Helping Hand')*0.2;
			var mult = 1;
			if(Molpy.Got('Megball')) mult*=2;
			if(Molpy.Got('Cooperation'))
			{
				mult*=Math.pow(1.1,Math.floor(Molpy.SandTools['Bucket'].amount/2));
			}
			if(Molpy.Got('Stickbot'))mult*=4;
			return baserate*mult;
			;}
	);
	
	new Molpy.SandTool('Flag','flag|flags|marked','Marks out even more sand',420,
	function()
		{
			var baserate = 8+Molpy.Got('Flag Bearer')*2;
			var mult = 1;
			if(Molpy.Got('Magic Mountain'))mult*=2.5;
			if(Molpy.Got('Standardbot'))mult*=4;
			return baserate*mult;
		}
	);
	
	new Molpy.SandTool('Ladder','ladder|ladders|reached','Reaches higher sand',1700,
		function()
		{
			var baserate = 54+Molpy.Got('Extension Ladder')*18;
			var mult = 1;
			if(Molpy.Got('Level Up!'))mult*=2;
			if(Molpy.Got('Climbbot'))mult*=4;
			return baserate*mult;
		}
	);
	
	new Molpy.SandTool('Bag','bag|bags|carried','Carries sand from far away',12000,
		function()
		{
			var baserate = 600;
			var mult = 1;
			if(Molpy.Got('Embaggening'))
				mult*=Math.pow(1.02,Molpy.SandTools['Cuegan'].amount);
			if(Molpy.Got('Sandbag'))
				mult*=Math.pow(1.05,Molpy.CastleTools['River'].amount);
			if(Molpy.Got('Luggagebot'))mult*=4;
			return baserate*mult;
		}
	);
}	

Molpy.DefineCastleTools=function()
{
	new Molpy.CastleTool('NewPixBot','newpixbot|newpixbots||automated','Automates castles after the ONG\n(if not ninja\'d)',1,0,0,
		function()
		{
			var baseval=1;		
			if(Molpy.Got('Robot Efficiency')) baseval++;
			if(Molpy.Got('HAL-0-Kitty')) baseval+=Math.floor(Molpy.redactedClicks/9);
			var pow=0;
			for(var i in Molpy.npbDoublers)
			{
				var me = Molpy.Boosts[Molpy.npbDoublers[i]];
				if(me.bought)pow++;
			}
			
			baseval*=Math.pow(2,pow);
			if(Molpy.Boosts['NewPixBot Navigation Code'].power)
				baseval=Math.floor(baseval*.001);
			return baseval;
		} 
	);
	
	Molpy.npbDoublers = ['Carrybot',
		'Stickbot',
		'Standardbot',
		'Climbbot',
		'Luggagebot',
		'Recursivebot',
		'Flingbot',
		'Propbot',
		'Washbot',
		'Smallbot'];
	Molpy.npbDoubleThreshhold=14;
		
	new Molpy.CastleTool('Trebuchet','trebuchet|trebuchets|flung|formed','Flings some castles, forming more.',13,1,
		function(){
			if(Molpy.Got('War Banner'))return 1;
			else return 2;
		},
		function(){
		 var baseval=4;
			if(Molpy.Got('Spring Fling'))baseval++;
			if(Molpy.Got('Varied Ammo'))for(i in Molpy.CastleTools) if(Molpy.CastleTools[i].amount>1)baseval++;
			if(Molpy.Got('Flingbot'))baseval*=4;
			if(Molpy.Got('Minigun')) baseval*=Molpy.CastleTools['NewPixBot'].amount;
			return baseval;
		}
	);
		
	new Molpy.CastleTool('Scaffold','scaffold|scaffolds|squished|raised','Squishes some castles, raising a place to put more.',60,100,
		function()
		{
			var baseval = 6;				
			if(Molpy.Got('Precise Placement')) baseval-=
				Math.floor(Math.min(baseval,Molpy.SandTools['Ladder'].amount*0.5));
			return baseval;
		},
		function()
		{
			var baseval = 22;
			if(Molpy.Got('Propbot'))baseval*=4;
			if(Molpy.Got('Stacked')) baseval*=Molpy.CastleTools['NewPixBot'].amount;
			return baseval;
		}
	);
		
	new Molpy.CastleTool('Wave','wave|waves|swept|deposited','Sweeps away some castles, depositing more in their place.',300,80,
		function()
		{
			var baseval = 24;				
			if(Molpy.Got('Erosion')) baseval-=
				Math.floor(baseval,Molpy.CastleTools['Wave'].totalCastlesWasted*0.2);
			baseval -= Molpy.CastleTools['River'].bought*2;
			baseval=Math.max(baseval,0);
			return baseval;
		},
		function()
		{
			var baseval= 111;
			baseval+=Molpy.Got('Swell')*19;			
			if(Molpy.Got('Washbot'))baseval*=4;
			if(Molpy.Got('Big Splash')) baseval*=Molpy.CastleTools['NewPixBot'].amount;
			return baseval;
		}
	);
	Molpy.CastleTools['Wave'].onDestroy=function()
	{
		if(this.totalCastlesDestroyed>=2000) Molpy.UnlockBoost('Erosion');
		if(this.totalCastlesDestroyed>=500) Molpy.EarnBadge('Wipeout');
	}
		
	new Molpy.CastleTool('River','river|rivers|washed|left','Washes away many castles, but leaves many more new ones.',1800,520,
		function()
		{
			var baseval = 160;
			if(Molpy.Got('Riverish'))
			{
				var newClicks=Molpy.beachClicks-Molpy.Boosts['Riverish'].power;
				var log=Math.log(newClicks);
				if(log>0)
				{
					var reduction=Math.min(baseval,log*log);
					baseval-=reduction;
				}
			}
			var mult=1;
			if(Molpy.Got('Sandbag'))
				mult*=Math.pow(1.05,Molpy.SandTools['Bag'].amount);
			return Math.floor(baseval*mult);
		},
		function()
		{
			var baseval=690;	
			var mult=1;
			if(Molpy.Got('Sandbag'))
				mult*=Math.pow(1.05,Molpy.SandTools['Bag'].amount);
			if(Molpy.Got('Smallbot'))mult*=4;
			if(Molpy.Got('Irregular Rivers')) mult*=Molpy.CastleTools['NewPixBot'].amount;
			return Math.floor(baseval*mult);
		}
	);
}
	
Molpy.DefineBoosts=function()
{
	
	//only add to the end!
	new Molpy.Boost('Bigger Buckets','Increases sand rate of buckets and clicks',500,0,'Adds 0.1 S/mNP to each Bucket, before multipliers','biggerbuckets');
	new Molpy.Boost('Huge Buckets','Doubles sand rate of buckets and clicks',800,2,0,'hugebuckets');
	new Molpy.Boost('Helping Hand','Increases sand rate of Cuegan',500,2,'Adds 0.2 S/mNP to each Cuegan, before multipliers','helpinghand');
	new Molpy.Boost('Cooperation','Increases sand rate of Cuegan 10% per pair of buckets',2000,4,
		function()
		{			
			if(Molpy.Got('Cooperation'))
			{
				var mult=Math.pow(1.1,Math.floor(Molpy.SandTools['Bucket'].amount/2));
				return 'Multiplies Cuegans\' sand production by ' + Molpify(mult*100,2)+'%';
			}
			return 'Multiplies by 10% per pair of buckets';
		}
	);
	new Molpy.Boost('Spring Fling','Trebuchets build an extra Castle',1000,6,0,'springfling');
	new Molpy.Boost('Trebuchet Pong','Increases sand rate of buckets 50% per pair of trebuchets',3000,6);
	new Molpy.Boost('Molpies','Increases sand dig rate based on Badges',5000,5,
		function()
		{
			if(Molpy.Got('Molpies'))
			{
				var mult=0.01*Molpy.BadgesOwned;
				return 'Multiplies all sand rates by '+ Molpify(mult*100,2)+'%';
			}
			return 'Multiplies all sand rates by 1% per Badge earned';
		},'molpies'
	);
	new Molpy.Boost('Busy Bot','NewPixBots activate 10% sooner',900,4);
	new Molpy.Boost('Stealthy Bot','NewPixBots activate 10% sooner',1200,5);
	new Molpy.Boost('Flag Bearer','Flags are more powerful',5500,8, 'Each flag produces 2 extra sand/mNP, before multipliers','flagbearer');
	new Molpy.Boost('War Banner','Trebuchets only destroy 1 castle',3000,10,0,'warbanner');
	new Molpy.Boost('Magic Mountain','Flags are much more powerful',8000,15,'Multiplies Flag sand rate by 2.5','magicmountain');
	new Molpy.Boost('Extension Ladder','Ladders reach a little higher',12000,22,'Each ladder produces 18 extra castles per ONG, before multipliers');
	new Molpy.Boost('Level Up!','Ladders are much more powerful',29000,34,'Ladders produce 2 times as many castles per ONG','levelup');
	new Molpy.Boost('Varied Ammo','Trebuchets build an extra castle for each Castle Tool you have 2+ of',3900,48,
		function()
		{
			if(Molpy.Got('Varied Ammo'))
			{
				var val = 0;
				for(i in Molpy.CastleTools) if(Molpy.CastleTools[i].amount>1)val++;
				return 'Each trebuchet produces '+Molpify(val)+ ' more castles per ONG, before multipliers';
			}
			return 'For each kind of Castle Tool of which you have 2 or more, each trebuchet produces an additional castle per ONG, before multipliers';
		}
	);
	new Molpy.Boost('Megball','Cuegan produce double sand',10700,56,0,'megball');
	new Molpy.Boost('Robot Efficiency','Newpixbots build an extra castle (before any doubling)',34000,153);
	new Molpy.Boost('Ninja Builder','When increasing ninja stealth streak, builds that many castles',4000,35,
		function()
		{
			if(Molpy.Got('Ninja Builder')) 
				return 'Will build '+ (Molpy.ninjaStealth+(1+Molpy.Got('Active Ninja')*2))+ ' Castles unless you destealth ninjas';
			return 'Ninja Stealth increases the first time you click within a NewPix after NewPixBots activate. It will reset if you click before NewPixBots activate, or don\'t click before the next ONG.'	
			
		},'ninjabuilder'
	);
	new Molpy.Boost('Erosion','Waves destroy less by 20% of total castles wasted by waves, and 2 less per River bought',40000,77,
	0
	,'erosion');
	new Molpy.Boost('Autosave Option','Autosave option is available',100,4,0,'autosave');
	new Molpy.Boost('Helpful Hands','Each Cuegan+Bucket pair gives clicking +0.5 sand',250,5,
	0
	,'helpfulhands');
	new Molpy.Boost('True Colours','Each Cuegan+Flag pair gives clicking +5 sand',750,15,
	0
	,'truecolours');
	new Molpy.Boost('Precise Placement','For every two ladders, scaffolds destroy one less castle',8750,115);
	new Molpy.Boost('Ninja Hope','Avoid one Ninja Stealth reset, at the cost of 10 castles',7500,40,0,'ninjahope',0,1); //startpower 1
	new Molpy.Boost('Ninja Penance','Avoid a two Ninja Stealth resets, at the cost of 30 castles each',25000,88,0,'ninjapenance',0,2); //starpower 2
	new Molpy.Boost('Blitzing',function(me)
		{		
			return Molpify(me.power,1)+'x Sand for '+Molpify(me.countdown)+'mNP';
		}
		,0,0,0,'blitzing');
	Molpy.Boosts['Blitzing'].className='alert';
	new Molpy.Boost('Kitnip',Molpy.redactedWords+' come more often and stay longer',33221,63,
	0
	,'kitnip');
	new Molpy.Boost('Department of Redundancy Department',Molpy.redactedWords+' sometimes unlock special boosts',23456,78,0,
	'department');
	new Molpy.Boost('Raise the Flag', 'Each Flag+Ladder pair gives clicking an extra +50 sand',85000,95);
	new Molpy.Boost('Hand it Up', 'Each Ladder+Bag pair gives clicking an extra +500 sand',570000,170);
	new Molpy.Boost('Riverish', 'Rivers destroy less castles the more you click',82000,290,0,'riverish',
		function(me)
		{
			me.power=Molpy.beachClicks;
		}
		);
	new Molpy.Boost('Double or Nothing', '<input type="Button" value="Click" onclick="Molpy.DoubleOrNothing()"></input> to double or lose your current castle balance',200,0);
	Molpy.Boosts['Double or Nothing'].className='toggle';
	Molpy.DoubleOrNothing=function()
	{
		if(!Molpy.Boosts['Double or Nothing'].bought)
		{
			Molpy.Notify('Buy it first, silly molpy!');
			return;
		}
		if(Math.floor(Math.random()*2))
		{
			Molpy.Build(Molpy.castles);
		}else{
			Molpy.Destroy(Molpy.castles);
		}
		Molpy.LockBoost('Double or Nothing');
	}
	new Molpy.Boost('Grapevine', 'Increases sand dig rate by 2% per badge earned',25000,25);
	Molpy.IKEA='Affordable Swedish Home Furniture';
	new Molpy.Boost(Molpy.IKEA, function(me){return Molpify(me.power*100,1)+'% off all items for '+Molpify(me.countdown)+'mNP'}
		,0,0,0,0,
		function(){
			Molpy.shopRepaint=1;
		}
		,0.4,4);
	Molpy.Boosts[Molpy.IKEA].className='alert';
	
	new Molpy.Boost('Overcompensating', function(me){
		return 'During LongPix, Sand Tools dig '+Molpify(me.startPower*100,1)+'% extra sand'}
		,987645,321,0,'overcompensating',0,1.05);
	new Molpy.Boost('Doublepost', 'During LongPix, Castle Tools activate a second time',650000,4000,0,'doublepost');
	new Molpy.Boost('Coma Molpy Style', 
		function(me)
		{ 
			return (me.power? '':'When active, ') + 'Castle Tools do not activate and ninjas stay stealthed <br/><input type="Button" onclick="Molpy.ComaMolpyStyleToggle()" value="'+(me.power? 'Dea':'A')+'ctivate"></input>';
		}
		,8500,200,0,'comamolpystyle');
	Molpy.Boosts['Coma Molpy Style'].className='toggle';
	
	{//#REGION Lyrics :P	
	var cms=[
		"Coma Molpy Style",
		"Molpy Style",
		"Blitzin' the thread, just one more page until I ketch it",
		"Read through the decrees, signposts, ONGs and ponder ev'ry tidbit",
		"All I need is just a bit of Time to read all of it",
		"But Outside says I have to quit",
		"Mustard might appear",
		"The other night we saw an extra star just disappear",
		"Some extra Cueganites went too, turned back into thin air",
		"An extra alt-text dot is gone as well, will we ever know where?",
		"Were they ever there?",
		"In the O.T.T., follow the decree",
		"Cos I'm the pope, hey!",
		"So post some rope, hey!",
		"When you're postin', you can be boastin'",
		"About out aims, hey!",
		"To have no flames, hey!",
		"Cos we turn our disagreements into games, -ames, -ames, -ames, -a-a-a-a-a-a-a-aaaa...",
		"Coma Molpy Style",
		"Molpy Style",
		"Co - co - co - co - Coma Molpy Style",
		"Molpy Style",
		"Co - co - co - co - Coma Molpy Style",
		"Heyyyy, Neat Sandcastle",
		"Co - co - co - co - Coma Molpy Style",
		"Heyyyy, Neat Sandcastle",
		"Co - co - co - co - Coma Molpy Style",
		"Back in the present wearing hats with all the OTTers",
		"Bumping the firstposts, and discussing all the Elders",
		"Some have not been seen in wix, so have they yet forgot us?",
		"But some are still posting with us",
		"There's a spoiler here!",
		"It is a link to the live image, not the hashed one there!",
		"Don't want the blitzing to be ruined that would not be fair",
		"Better edit the hash in and next time ONG with care",
		"Next time that you dare",
		"Postcounts growin', the cakes are flowin'",
		"The lurkers lurk, hey",
		"The m*stards ch*rp, hey",
		"You make up your mind, to not fall behind",
		"Cannot shirk, hey",
		"The speed's berserk, hey",
		"Staying up forever just can't work, -erk, -erk, -erk, -r-r-r-r-r-r-r-r-rrrrr...",
		"Coma Molpy Style",
		"Molpy Style",
		"Co - co - co - co - Coma Molpy Style",
		"Molpy Style",
		"Co - co - co - co - Coma Molpy Style",
		"Heyyyy, Neat Sandcastle",
		"Co - co - co - co - Coma Molpy Style",
		"Heyyyy, Neat Sandcastle",
		"Co - co - co - co - Coma Molpy Style",
		"Walk with me, until you see the tree",
		"Molpy molpy beanie river grapevine sea!",
		"Walk with me, avoid all heresy",
		"Molpy molpy bucket river OTC! (ain't no redunakitty!)",
		"Coma Molpy Style",
		"Co-co-co - co-co-co",
		"Heyyyy, Neat Sandcastle",
		"Co - co - co - co - Coma Molpy Style",
		"Heyyyy, Neat Sandcastle",
		"Co - co - co - co - Coma Molpy Style",
		"Co-co-co - co-co-co",
		"Coma Molpy Style",
		"[End of the song. BTW you should buy this]"
	]
	}
	var cmsline=0;
	Molpy.ComaMolpyStyleToggle=function()
	{
		if(!Molpy.Boosts['Coma Molpy Style'].bought)
		{
			Molpy.Notify(cms[cmsline]);
			cmsline++;
			if(cmsline>=cms.length)
			{
				cmsline=0;
				Molpy.RewardRedacted();
			}
			return;
		}
		var p = Molpy.Boosts['Coma Molpy Style'].power;
		if(p)
		{
			p=0; //off
			Molpy.ONGstart = ONGsnip(new Date()); //don't immediately ONG!
		}else
		{
			p=1; //on		
		}
		g('clockface').className= p?'hidden':'unhidden';	
		Molpy.Boosts['Coma Molpy Style'].power=p;
		Molpy.Boosts['Coma Molpy Style'].hoverOnConter=1;
		Molpy.recalculateDig=1;
	}
	new Molpy.Boost('Time Travel', 
		function(me)
		{
			var price=Math.ceil(Molpy.newpixNumber*Molpy.priceFactor);
			if(Molpy.Got('Flux Capacitor'))price=Math.ceil(price*.2);
			return 'Pay ' + Molpify(price) + ' Castles to move <input type="Button" onclick="Molpy.TimeTravel('+(-me.power)+');" value="backwards"></input> or <input type="Button" onclick="Molpy.TimeTravel('+me.power+');" value="forwards"></input> '+
			Molpify(me.power)+' NP in Time';
		}
		,1000,30,0,0,0,1);
	Molpy.Boosts['Time Travel'].className='action';
	Molpy.intruderBots=0;
	Molpy.TimeTravel=function(NP)
	{		
		NP = Math.floor(NP);
		var price=Math.ceil(Molpy.newpixNumber*Molpy.priceFactor);
		if(Molpy.Got('Flux Capacitor'))price=Math.ceil(price*.2);
		if(Molpy.newpixNumber+NP <1)
		{
			Molpy.Notify('Heretic!');
			Molpy.Notify('There is nothing before time.');
			return;
		}
		if(Molpy.newpixNumber+NP >Molpy.highestNPvisited)
		{
			Molpy.Notify('Wait For It');
			return;
		}
		if(!Molpy.Boosts['Time Travel'].bought)
		{
			Molpy.Notify('In the future, you\'ll pay for this!');
			return;
		}
		if(Molpy.castles >=price)
		{
			Molpy.SpendCastles(price);
			Molpy.newpixNumber+=NP;			
			Molpy.HandlePeriods();
			Molpy.UpdateBeach();
			Molpy.Notify('Time Travel successful! Welcome to NewPix '+Molpify(Molpy.newpixNumber));
			Molpy.timeTravels++;
			Molpy.Boosts['Time Travel'].hoverOnCounter=1;
			if(NP>0)
				Molpy.EarnBadge('Fast Forward');
			if(NP<0)
				Molpy.EarnBadge('And Back');
			var t = Molpy.timeTravels;
			if(t>=10)
			{
				Molpy.EarnBadge('Primer');
				var incursionFactor=Molpy.Got('Flux Capacitor')?4
					:(Molpy.Got('Flux Capacitor')?8
					:20);
				if(!Math.floor(Math.random()*incursionFactor))
				{
					Molpy.Notify('You do not arrive alone');
					var npb=Molpy.CastleTools['NewPixBot'];
					npb.amount++;
					if(Molpy.intruderBots)
					{
						Molpy.intruderBots++;
					}else{
						Molpy.intruderBots=1;
					}
					Molpy.shopRepaint=1;
					Molpy.recalculateDig=1;
					npb.refresh();
				}
			}
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
	new Molpy.Boost('Active Ninja',
		'During LongPix, Ninja Stealth is incremented by 3 per NP. Is there an Echo in here?',1500000,240,0,'activeninja');
	new Molpy.Boost('Kitties Galore','Even more '+Molpy.redactedWords,2500000,4400,0,'kittiesgalore');
	Molpy.Boosts['Kitties Galore'].hardlocked=1;	
	
	new Molpy.Boost('HAL-0-Kitty','NewPixBots build an extra Castle per 9 '+Molpy.redactedWords,9000,2001,
	0
	,'halokitty');
	new Molpy.Boost('Factory Automation','When NewPixBots activate, so does the Department of Redundancy Department at a cost of '+Molpify(2000000)+' Sand', 4500000,15700,0,'factoryautomation');
	new Molpy.Boost('Blast Furnace','Gives the Department of Redundancy Department the ability to make Castles from Sand',
		8800000,28600,0,'blastfurnace');
	Molpy.Boosts['Blast Furnace'].hardlocked=1;	
	
	Molpy.departmentBoosts=['Hand it Up', 'Riverish', 'Double or Nothing', 'Grapevine', Molpy.IKEA, 'Doublepost','Active Ninja',
		'Kitties Galore', 'Blast Furnace','Ninja Assistants','Minigun','Stacked',
		'Big Splash','Irregular Rivers','NewPixBot Navigation Code'];
	new Molpy.Boost('Sandbag','Bags and Rivers give each other a 5% increase to Sand digging, Castle building, and Castle destruction',1400000,21000);
	new Molpy.Boost('Embaggening','Each Cuegan gives a 2% boost to the sand dig rate of Bags',3500000,23000,
	0
	,'embaggening');
	new Molpy.Boost('Carrybot','NewPixBots produce double castles',10000,100);
	new Molpy.Boost('Stickbot','NewPixBots produce double castles',40000,200);
	new Molpy.Boost('Standardbot','NewPixBots produce double castles',160000,400);
	new Molpy.Boost('Climbbot','NewPixBots produce double castles',640000,800);
	new Molpy.Boost('Luggagebot','NewPixBots produce double castles',2560000,1600);
	new Molpy.Boost('Recursivebot','NewPixBots produce double castles',100000,1000);
	new Molpy.Boost('Flingbot','NewPixBots produce double castles',400000,2000);
	new Molpy.Boost('Propbot','NewPixBots produce double castles',1600000,4000);
	new Molpy.Boost('Washbot','NewPixBots produce double castles',6400000,8000);
	new Molpy.Boost('Smallbot','NewPixBots produce double castles',25600000,16000);
	
	new Molpy.Boost('Swell','Waves produce 29 more Castles',20000,200);
	new Molpy.Boost('Flux Capacitor','It makes Time Travel possibler!',88,88);
	new Molpy.Boost('Bag Burning','Bags help counteract NewPixBots',50000000,0,0,'bagburning');
	new Molpy.Boost('Chromatic Heresy',
		function(me)
		{
			return 'Saturation is '+(me.power?'':'not ')+'allowed. <input type="Button" value="Click" onclick="Molpy.ChromaticHeresyToggle()"></input> to toggle.';
		},200,10,0,'chromatic');
	Molpy.Boosts['Chromatic Heresy'].className='toggle';
	Molpy.ChromaticHeresyToggle=function()
	{
		var ch = Molpy.Boosts['Chromatic Heresy'];
		if(!ch.bought)
		{
			Molpy.Notify('Somewhere, over the rainbow...');
			return;
		}
		ch.power=!ch.power*1;
		ch.hoverOnCounter=1;
		Molpy.UpdateColourScheme();
		
	}
	new Molpy.Boost('Flux Turbine','Castles lost via Molpy Down increase the rate of building new Castles',1985,121,
		function()
		{
			if(!Molpy.Got('Flux Turbine')) return 'All castle gains are increased by 2% per natural logarithm of castles wiped by Molpy Down, except refunds which are not increased.';
			return 'Multiplies all Castle gains by ' + Molpify(Molpy.globalCastleMult*100,2)+'% (But refunds when selling remain unchanged.)';
		});
	new Molpy.Boost('Ninja Assistants', 'Ninja Builder\'s castle output is multiplied by the number of NewPixBots you have.',250000000,777);
	new Molpy.Boost('Minigun', 'The castle output of Trebuchets is multiplied by the number of NewPixBots you have.',480000000,888);
	new Molpy.Boost('Stacked', 'The castle output of Scaffolds is multiplied by the number of NewPixBots you have.',970000000,999);
	new Molpy.Boost('Big Splash', 'The castle output of Waves is multiplied by the number of NewPixBots you have.',2650000000,1111);
	new Molpy.Boost('Irregular Rivers', 'The castle output of Waves is multiplied by the number of NewPixBots you have.',8290000000,2222);	
	
	Molpy.Boosts['Ninja Assistants'].hardlocked=1;	
	Molpy.Boosts['Minigun'].hardlocked=1;	
	Molpy.Boosts['Stacked'].hardlocked=1;	
	Molpy.Boosts['Big Splash'].hardlocked=1;	
	Molpy.Boosts['Irregular Rivers'].hardlocked=1;	
	
	Molpy.scrumptiousDonuts=-1;
	new Molpy.Boost('NewPixBot Navigation Code', 
		function()
		{
			return 'thisAlgorithm. BecomingSkynetCost = 999999999 <input type="Button" onclick="Molpy.NavigationCodeToggle()" value="' +
				(Molpy.Boosts['NewPixBot Navigation Code'].power?'Uni':'I')+'nstall"></input>';
		}
		,999999999,2101, 'When installed, this averts Judgement Dip at the cost of 99.9% of NewPixBot Castle Production.');	
		
	Molpy.NavigationCodeToggle=function()
	{		
		if(Molpy.Got('Jamming'))
		{
			Molpy.Notify('Experiencing Jamming, cannot access Navigation Code');
			if(Molpy.scrumptiousDonuts<0)
			{
				Molpy.Notify('Things I will never do:');
				Molpy.scrumptiousDonuts=120;
			}
			return;
		}
		var nc = Molpy.Boosts['NewPixBot Navigation Code'];
		if(!nc.bought)
		{
			if(Molpy.scrumptiousDonuts<0)
			{
				Molpy.Notify('Things I will never do:');
				Molpy.scrumptiousDonuts=120;
			}
			return;
		}
		nc.power=!nc.power*1;
		Molpy.scrumptiousDonuts=-1;
		nc.hoverOnCounter=1;
		Molpy.recalculateDig=1;
		Molpy.GiveTempBoost('Jamming',1,2000);
	}
	new Molpy.Boost('Jamming', 
		function(me)
		{		
			return 'You cannot access NewPixBot Navigation Code for '+Molpify(me.countdown)+'mNP';
		}
		,0,0);
	Molpy.Boosts['NewPixBot Navigation Code'].className='toggle';
	Molpy.Boosts['NewPixBot Navigation Code'].hardlocked=1;
	Molpy.Boosts['Jamming'].className='alert';
	
	
	new Molpy.Boost('Blixtnedslag Kattungar, JA!', 'Antalet redundanta klickade kattungar läggs till blixtnedslag multiplikator.',9800000,888555222,0,'blixtnedslag',
		function(me)
		{
			me.power=Molpy.redactedClicks;
		});
}
	
	
Molpy.DefineBadges=function()
{	
	new Molpy.Badge('Amazon Patent','1-Click');
	new Molpy.Badge('Oops','You clicked it again');
	new Molpy.Badge('Just Starting','10 clicks');
	new Molpy.Badge('Busy Clicking','100 clicks');
	new Molpy.Badge('Click Storm','1,000 clicks');
	new Molpy.Badge('Getting Sick of Clicking','Dig 100,000 sand by clicking');
	new Molpy.Badge('Why am I still clicking?','Dig 5,000,000 sand by clicking');
	new Molpy.Badge('Click Master','Dig 100,000,000 sand by clicking',2);
	
	new Molpy.Badge('Rook','Make a castle');
	new Molpy.Badge('Enough for Chess','Make 4 castles');
	new Molpy.Badge('Fortified','Make 40 castles');
	new Molpy.Badge('All Along the Watchtower','Make 320 castles');
	new Molpy.Badge('Megopolis','Make 1,000 castles');
	new Molpy.Badge('Kingdom','Make 100,000 castles');
	new Molpy.Badge('Empire','Make 10,000,000 castles');
	new Molpy.Badge('Reign of Terror','Make 1,000,000,000 castles',2);
	
	new Molpy.Badge('We Need a Bigger Beach','Have 1,000 castles');
	new Molpy.Badge('Castle Nation','Have 1,000,000 castles');
	new Molpy.Badge('Castle Planet','Have 1,000,000,000 castles');
	new Molpy.Badge('Castle Star','Have 1,000,000,000,000 castles');
	new Molpy.Badge('Castle Galaxy','Have 8,888,000,000,000,000 castles',1);
	
	new Molpy.Badge('Barn','Have 50 sand');
	new Molpy.Badge('Storehouse','Have 200 sand');
	new Molpy.Badge('Bigger Barn','Have 500 sand');
	new Molpy.Badge('Warehouse','Have 8,000 sand');
	new Molpy.Badge('Glass Factory','Have 300,000 sand');
	new Molpy.Badge('Silicon Valley','Have 7,000,000 sand');
	new Molpy.Badge('Seaish Sands','Have 420,000,000 sand',1);
	new Molpy.Badge('You can do what you want','Have 123,456,789 sand',2);
	
	new Molpy.Badge('Ninja', 'Ninja a NewPixBot');
	new Molpy.Badge('No Ninja', 'Click for sand after not ninjaing NewPixBot');
	new Molpy.Badge('Ninja Stealth', 'Make non-ninjaing clicks 6 newpix in a row');
	new Molpy.Badge('Ninja Dedication', 'Reach ninja stealth streak 16');
	new Molpy.Badge('Ninja Madness', 'Reach ninja stealth streak 26');
	new Molpy.Badge('Ninja Omnipresence', 'Reach ninja stealth streak 36');
	new Molpy.Badge('Ninja Strike', 'Ninja 10 NewPixBots simultaneously');
	new Molpy.Badge('Ninja Holidip', 'Lose ninja stealth by not clicking');
	
	new Molpy.Badge('Wipeout', 'Destroy a total of 500 castles with waves');
	new Molpy.Badge('Redundant Redundancy', 'Earn 0 badges',1);
	new Molpy.Badge('Redundant', 'Earn at least 1 badge',1);
	new Molpy.Badge('Clerical Error', 'Receive a badge you haven\'t earned',1);
	new Molpy.Badge('Castle Price Rollback', 'Experience an ONG');
	new Molpy.Badge('This Should be Automatic', 'Manually save 20 times');
	
	new Molpy.Badge('A light dusting', 'Have a sand dig rate of 0.1 SpmNP');
	new Molpy.Badge('Sprinkle', 'Have a sand dig rate of 0.8 SpmNP');
	new Molpy.Badge('Trickle', 'Have a sand dig rate of 6 SpmNP');
	new Molpy.Badge('Pouring it on', 'Have a sand dig rate of 25 SpmNP');
	new Molpy.Badge('Hundred Year Storm', 'Have a sand dig rate of 100 SpmNP');
	new Molpy.Badge('Thundering Typhoon!', 'Have a sand dig rate of 400 SpmNP');
	new Molpy.Badge('Sandblaster', 'Have a sand dig rate of 1,600 SpmNP');
	new Molpy.Badge('Where is all this coming from?', 'Have a sand dig rate of 7,500 SpmNP');
	new Molpy.Badge('Seaish Sandstorm', 'Have a sand dig rate of 30,000 SpmNP',1);
	new Molpy.Badge('WHOOSH', 'Have a sand dig rate of 500,500 SpmNP',1);
	new Molpy.Badge('We want some two!', 'Have a sand dig rate of 2,222,222 SpmNP',1);
	new Molpy.Badge('Bittorrent', 'Have a sand dig rate of 10,101,010 SpmNP',1);
	new Molpy.Badge('WARP SPEEEED', 'Have a sand dig rate of 299,792,458 SpmNP',1);
	new Molpy.Badge('Maxed out the display', 'Have a sand dig rate of 8,888,888,888.8 SpmNP',2);
	
	new Molpy.Badge('Store ALL of the sand','Have 782,222,222,144 sand',2);		
	
	new Molpy.Badge('Notified','Receive a notification');
	new Molpy.Badge('Thousands of Them!','Receive 2000 notifications',1);
	new Molpy.Badge('Decisions, Decisions','With an option on additional decisions',1);
	new Molpy.Badge('Night and Dip','Change Colour Schemes',1);
	new Molpy.Badge('Far End of the Bell Curve','View Stats',1);
	new Molpy.Badge('The Fine Print','View the stats of a Sand Tool',1);
	new Molpy.Badge('Keeping Track','View the stats of a Castle Tool',1);
	
	new Molpy.Badge('Ninja Shortcomings','Lose a Ninja Stealth Streak of between 30 and 35');
	new Molpy.Badge('Not Ground Zero','Molpy Down',1);
	new Molpy.Badge('Not So '+Molpy.redactedW,'Click 2 '+Molpy.redactedWords,1);
	new Molpy.Badge("Don't Litter!",'Click 14 '+Molpy.redactedWords,1);
	new Molpy.Badge('Y U NO BELIEVE ME?','Click 101 '+Molpy.redactedWords,1);
	new Molpy.Badge("Have you noticed it's slower?",'Experience the LongPix');
	new Molpy.Badge("Judgement Dip Warning",
		function()
		{
			var report=Molpy.JudgementDipReport();
			if(Molpy.Boosts['NewPixBot Navigation Code'].power) return 'The Bots have been foiled by altered navigation code';
			var level = report[0];
			var countdown = report[1];
			if(!level) return 'Safe. For now.';
			if(level==1) return 'The countdown is at ' + Molpify(countdown)+'NP';
			return 'Judgement dip is upon us! But it can get worse. The countdown is at ' + Molpify(countdown)+
			'NP';
		},2);
	Molpy.JudgementDipThreshhold=function()
	{
		if(Molpy.Boosts['NewPixBot Navigation Code'].power) return [0,Infinity];
		var baseVal= 500000000;
		var div = 1+ Molpy.Got('Factory Automation')+Molpy.Got('Blast Furnace')+Molpy.Got('Time Travel')
			+Molpy.Got('Flux Capacitor')+Molpy.Got('Flux Turbine')+Molpy.Got('Recursivebot')+Molpy.Got('Robot Efficiency')
			+Molpy.Got('Ninja Assistants')+Molpy.Got('Minigun')+Molpy.Got('Stacked')+Molpy.Got('Big Splash')+Molpy.Got('Irregular Rivers');
		if(Molpy.Got('Bag Burning'))
		{
			div/=Math.pow(1.4,Math.max(0,(Molpy.SandTools['Bag'].amount-Molpy.npbDoubleThreshhold)/2));
		}
		return baseVal/div;
	}
	Molpy.JudgementDipReport=function()
	{
		var bot=Molpy.CastleTools['NewPixBot'];
		var botCastles=bot.totalCastlesBuilt*bot.amount;
		var thresh = Molpy.JudgementDipThreshhold();
		var level = Math.floor(botCastles/thresh);
		var countdown = ((level+1)*thresh - botCastles);
		countdown/=(bot.buildN()*bot.amount*bot.amount);
		if(Molpy.Got('Doublepost'))countdown/=2;
		countdown/=Molpy.globalCastleMult; //this is a bit approximate because of its rounding, but close enough for this, hopefully
		if(Molpy.Boosts['Coma Molpy Style'].power)
		{
			level=Math.floor(level/2);
		}
		
		if(level>3 && Molpy.SandTools['Bag'].amount>Molpy.npbDoubleThreshhold)
		{
			Molpy.UnlockBoost('Bag Burning');
		}
		if(level>4)
		{
			Molpy.Boosts['Ninja Assistants'].hardlocked=0;
		}
		if(level>5)
		{
			Molpy.Boosts['Minigun'].hardlocked=0;
		}
		if(level>6)
		{
				Molpy.Boosts['Stacked'].hardlocked=0;
		}
		if(level>7)
		{
			if(Molpy.Got('Minigun'))
				Molpy.Boosts['Big Splash'].hardlocked=0;
		}
		if(level>8)
		{
			if(Molpy.Got('Stacked'))
				Molpy.Boosts['Irregular Rivers'].hardlocked=0;
		}
		if(level>12)
		{
			if(Molpy.Got('Big Splash'))
				Molpy.Boosts['NewPixBot Navigation Code'].hardlocked=0;
		}
		if(level>30)
		{
			if(Molpy.Got('Flux Turbine'))
			{
				Molpy.Boosts['NewPixBot Navigation Code'].hardlocked=0;
				Molpy.Boosts['NewPixBot Navigation Code'].sandPrice=33000;
				Molpy.Boosts['NewPixBot Navigation Code'].castlePrice=7400;
			}
		}
		return [level,Math.ceil(countdown)];
	}
	new Molpy.Badge("Judgement Dip",
		function()
		{
			if(Molpy.Boosts['NewPixBot Navigation Code'].power) return 'The Bots have been foiled by altered navigation code';
			var j=Molpy.judgeLevel-1;
			if(j<1) return 'Safe. For now.';
			return 'The NewPixBots destroy ' + Molpify(j) + ' Castle'+(j==1?'':'s')+' each per mNP';			
		}
		,3);
	Molpy.Badges['Judgement Dip Warning'].className='alert';
	Molpy.Badges['Judgement Dip'].className='alert';
	new Molpy.Badge('Fast Forward','Travel Back to the Future',1);
	new Molpy.Badge('And Back','Return to the Past',1);
	new Molpy.Badge('Primer','Travel through Time 10 Times',1);
	new Molpy.Badge('Wimey','Travel through Time 40 Times',1);
	new Molpy.Badge('Hot Tub','Travel through Time 160 Times',1);
	new Molpy.Badge("Dude, Where's my DeLorean?",'Travel through Time 640 Times',2);
	new Molpy.Badge('Use Your Leopard','Get a click by using your leopard to simulate reloading the page');
}
		
Molpy.CheckBuyUnlocks=function()
{
	var me=Molpy.SandTools['Bucket'];
	if(me.amount>=1)Molpy.UnlockBoost('Bigger Buckets');
	if(me.amount>=4)Molpy.UnlockBoost('Huge Buckets');
	if(me.amount>=Molpy.npbDoubleThreshhold)Molpy.UnlockBoost('Carrybot');
	
	me=Molpy.SandTools['Cuegan'];
	if(me.amount>=1)Molpy.UnlockBoost('Helping Hand');
	if(me.amount>=4)Molpy.UnlockBoost('Cooperation');
	if(me.amount>=8)Molpy.UnlockBoost('Megball');
	if(me.amount>=Molpy.npbDoubleThreshhold)Molpy.UnlockBoost('Stickbot');
	
	me=Molpy.SandTools['Flag'];
	if(me.amount>=1)Molpy.UnlockBoost('Flag Bearer');
	if(me.amount>=2)Molpy.UnlockBoost('War Banner');
	if(me.amount>=6)Molpy.UnlockBoost('Magic Mountain');
	if(me.amount>=Molpy.npbDoubleThreshhold)Molpy.UnlockBoost('Standardbot');
	
	me=Molpy.SandTools['Ladder'];
	if(me.amount>=1)Molpy.UnlockBoost('Extension Ladder');
	if(me.amount>=Molpy.npbDoubleThreshhold)Molpy.UnlockBoost('Climbbot');
	
	me=Molpy.CastleTools['NewPixBot'];
	if(me.amount>=3)Molpy.UnlockBoost('Busy Bot');
	if(me.amount>=8)Molpy.UnlockBoost('Robot Efficiency');
	if(me.amount>=Molpy.npbDoubleThreshhold&&Molpy.Got('Robot Efficiency'))Molpy.UnlockBoost('Recursivebot');
	if(me.amount>=17)Molpy.UnlockBoost('HAL-0-Kitty');
	if(me.amount>=22 && Molpy.Got('Department of Redundancy Department'))Molpy.UnlockBoost('Factory Automation');
	if(Molpy.Got('Factory Automation'))
	{
		Molpy.Boosts['Blast Furnace'].hardlocked=0;
	}
	 
	me=Molpy.CastleTools['Trebuchet'];
	if(me.amount>=1)Molpy.UnlockBoost('Spring Fling');
	if(me.amount>=2)Molpy.UnlockBoost('Trebuchet Pong');				
	if(me.amount>=5)Molpy.UnlockBoost('Varied Ammo');	
	if(me.amount>=Molpy.npbDoubleThreshhold)Molpy.UnlockBoost('Flingbot');	
	
	me=Molpy.CastleTools['Scaffold'];
	if(me.amount>=2)Molpy.UnlockBoost('Precise Placement');
	if(me.amount>=4)Molpy.UnlockBoost('Level Up!');
	if(me.amount>=Molpy.npbDoubleThreshhold)Molpy.UnlockBoost('Propbot');
	
	me=Molpy.CastleTools['Wave'];
	if(me.amount>=2)Molpy.UnlockBoost('Swell');
	if(me.amount>=Molpy.npbDoubleThreshhold)Molpy.UnlockBoost('Washbot');
	
	me=Molpy.SandTools['Bag'];
	if(me.amount>=2)Molpy.UnlockBoost('Embaggening');
	if(me.amount>=Molpy.npbDoubleThreshhold)Molpy.UnlockBoost('Luggagebot');
	var you=me;
	me = Molpy.CastleTools['River'];
	if(me.amount&&you.amount)Molpy.UnlockBoost('Sandbag');
	if(me.amount>=Molpy.npbDoubleThreshhold)Molpy.UnlockBoost('Smallbot');
	
	if(Molpy.Got('Coma Molpy Style')||Molpy.Got('Double or Nothing')||Molpy.Got('Time Travel')||Molpy.Got('Judgement Dip Warning'))
	{
		Molpy.UnlockBoost('Chromatic Heresy');
	}
}

Molpy.CheckClickAchievements=function()
{
	var c = Molpy.beachClicks;
	Molpy.EarnBadge('Amazon Patent');
	if(c>=2){
		Molpy.EarnBadge('Oops');
	}
	if(c>=10){
		Molpy.EarnBadge('Just Starting');
	}
	if(c>=100){
		Molpy.EarnBadge('Busy Clicking');
		Molpy.UnlockBoost('Helpful Hands');
	}
	if(c>=1000){
		Molpy.EarnBadge('Click Storm');
		Molpy.UnlockBoost('Raise the Flag');
	}
	if(c>=3333){
		Molpy.UnlockBoost('True Colours');
	}
	c = Molpy.sandManual;
	if(c>=100000){
		Molpy.EarnBadge('Getting Sick of Clicking');
	}
	if(c>=5000000){
		Molpy.EarnBadge('Why am I still clicking?');
	}
	if(c>=100000000){
		Molpy.EarnBadge('Click Master');
	}						
}	
/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*  via stackoverflow :D
*
**/
var AllYourBase = {

// private property
_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

// public method for encoding
SetUpUsTheBomb : function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = AllYourBase._utf8_encode(input);

    while (i < input.length) {

        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

    }

    return output;
},

// public method for decoding
BelongToUs : function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

    }

    output = AllYourBase._utf8_decode(output);

    return output;

},

// private method for UTF-8 encoding
_utf8_encode : function (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }

    return utftext;
},

// private method for UTF-8 decoding
_utf8_decode : function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while ( i < utftext.length ) {

        c = utftext.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        }
        else if((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else {
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }

    }

    return string;
}

}
