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
			if(Molpy.Got('Buccaneer'))mult*=2;
			if(Molpy.Got('Flying Buckets'))mult*=Molpy.CastleTools['Trebuchet'].amount;
			return mult*baserate;			
			}
	);
	
	new Molpy.SandTool('Cuegan','cuegan|cuegans|tossed','Megan and Cueball toss in a bit of extra sand',50,
		function(){
			var baserate = 0.6+Molpy.Got('Helping Hand')*0.2;
			var mult = 1;
			if(Molpy.Got('Megball')) mult*=2;
			if(Molpy.Got('Cooperation'))
			{
				mult*=Math.pow(1.05,Math.floor(Molpy.SandTools['Bucket'].amount/2));
			}
			if(Molpy.Got('Stickbot'))mult*=4;
			if(Molpy.Got('The Forty'))mult*=40;
			if(Molpy.Got('Human Cannonball'))mult*=2*Molpy.CastleTools['Trebuchet'].amount;
			return baserate*mult;
			}
	);
	
	new Molpy.SandTool('Flag','flag|flags|marked','Marks out even more sand',420,
	function()
		{
			var baserate = 8+Molpy.Got('Flag Bearer')*2;
			var mult = 1;
			if(Molpy.Got('Magic Mountain'))mult*=2.5;
			if(Molpy.Got('Standardbot'))mult*=4;
			if(Molpy.Got('Balancing Act')) mult*=Math.pow(1.05,Molpy.CastleTools['Scaffold'].amount);
			if(Molpy.Got('Swim Between the Flags'))
			{
				if(Molpy.newpixNumber%2==0)//even
				{
					mult/=Molpy.CastleTools['Wave'].amount;
				}else{//odd
					mult*=Molpy.CastleTools['Wave'].amount;
				}
			}
			if(Molpy.Got('Fly the Flag'))mult*=10*Molpy.CastleTools['Trebuchet'].amount;
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
			if(Molpy.Got('Broken Rung'))
			{
				var min =1000;
				for(var i in Molpy.SandTools)min=Math.min(min,Molpy.SandTools[i].amount);
				for(var i in Molpy.CastleTools)min=Math.min(min,Molpy.CastleTools[i].amount);
				mult*=min;
			}
			if(Molpy.Got('Up Up and Away'))mult*=10*Molpy.CastleTools['Trebuchet'].amount;
			return baserate*mult;
		}
	);
	
	new Molpy.SandTool('Bag','bag|bags|carried','Carries sand from far away',12000,
		function()
		{
			var baserate = 600;
			var mult = 1;
			if(Molpy.Got('Embaggening')||Molpy.SandTools['Cuegan'].amount>14)
				mult*=Math.pow(1.02,Molpy.SandTools['Cuegan'].amount-14);
			if(Molpy.Got('Sandbag'))
				mult*=Math.pow(1.05,Molpy.CastleTools['River'].amount);
			if(Molpy.Got('Luggagebot'))mult*=4;
			if(Molpy.Got('Bag Puns'))mult*=2;
			if(Molpy.Got('Air Drop'))mult*=5;
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
		'Surfbot',
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
			if(Molpy.Got('Throw Your Toys')) baseval+=Molpy.SandTools['Bucket'].amount+Molpy.SandTools['Flag'].amount;
			if(Molpy.Got('Flingbot'))baseval*=4;
			if(Molpy.Got('Minigun')) baseval*=Molpy.CastleTools['NewPixBot'].amount;
			
			var mult =
				10*(Molpy.Got('Flying Buckets')+Molpy.Got('Human Cannonball')+Molpy.Got('Fly the Flag')
				+Molpy.Got('Up Up and Away')+Molpy.Got('Air Drop')*5);
			mult = mult||1;
			
			return baseval*mult;
		}
	);
		
	new Molpy.CastleTool('Scaffold','scaffold|scaffolds|squished|raised','Squishes some castles, raising a place to put more.',60,100,
		function()
		{
			var baseval = 6;	
			if(Molpy.Got('Balancing Act')) baseval*=Math.pow(1.05,Molpy.SandTools['Flag'].amount);			
			if(Molpy.Got('Precise Placement')) baseval-=Math.floor(Molpy.SandTools['Ladder'].amount*0.5);
			return Math.max(0,Math.floor(baseval));
		},
		function()
		{
			var baseval = 22;
			if(Molpy.Got('Propbot'))baseval*=4;
			if(Molpy.Got('Stacked')) baseval*=Molpy.CastleTools['NewPixBot'].amount;
			if(Molpy.Got('Balancing Act')) baseval*=Math.pow(1.05,Molpy.SandTools['Flag'].amount);
			return Math.floor(baseval);
		}
	);
		
	new Molpy.CastleTool('Wave','wave|waves|swept|deposited','Sweeps away some castles, depositing more in their place.',300,80,
		function()
		{
			var baseval = 24;
			if(Molpy.Got('Swim Between the Flags'))
			{
				if(Molpy.newpixNumber%2==1)//odd
				{
					baseval=Math.floor(baseval*Math.pow(1.06,Molpy.SandTools['Flag'].amount));
				}
			}
			
			if(Molpy.Got('Erosion')) baseval-=Molpy.CastleTools['Wave'].totalCastlesWasted*0.2;
			baseval -= Molpy.CastleTools['River'].bought*2;
			baseval=Math.floor(Math.max(baseval,0));
			return baseval;
		},
		function()
		{
			var baseval= 111;
			baseval+=Molpy.Got('Swell')*19;			
			if(Molpy.Got('Surfbot'))baseval*=4;
			if(Molpy.Got('Big Splash')) baseval*=Molpy.CastleTools['NewPixBot'].amount;
			if(Molpy.Got('Swim Between the Flags'))
			{
				if(Molpy.newpixNumber%2==0)//even
				{
					baseval=Math.floor(baseval*Math.pow(1.06,Molpy.SandTools['Flag'].amount));
				}
			}
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
	new Molpy.Boost({name:'Bigger Buckets',desc:'Increases sand rate of buckets and clicks',sand:500,castles:0,stats:'Adds 0.1 S/mNP to each Bucket, before multipliers',icon:'biggerbuckets'});
	new Molpy.Boost({name:'Huge Buckets',desc:'Doubles sand rate of buckets and clicks',sand:800,castles:2,icon:'hugebuckets'});
	new Molpy.Boost({name:'Helping Hand',desc:'Increases sand rate of Cuegan',sand:500,castles:2,stats:'Adds 0.2 S/mNP to each Cuegan, before multipliers',icon:'helpinghand'});
	new Molpy.Boost({name:'Cooperation',desc:'Increases sand rate of Cuegan 5% per pair of buckets',sand:2000,castles:4,
		desc:function()
		{			
			if(Molpy.Got('Cooperation'))
			{
				var mult=Math.pow(1.05,Math.floor(Molpy.SandTools['Bucket'].amount/2));
				return 'Multiplies Cuegans\' sand production by ' + Molpify(mult*100,2)+'%';
			}
			return 'Multiplies by 5% per pair of buckets';
		}
	});
	new Molpy.Boost({name:'Spring Fling',desc:'Trebuchets build an extra Castle',sand:1000,castles:6,icon:'springfling'});
	new Molpy.Boost({name:'Trebuchet Pong',desc:'Increases sand rate of buckets 50% per pair of trebuchets',sand:3000,castles:6});
	new Molpy.Boost({name:'Molpies',desc:'Increases sand dig rate based on Badges',sand:5000,castles:5,
		desc:function()
		{
			if(Molpy.Got('Molpies'))
			{
				var mult=0.01*Molpy.BadgesOwned;
				return 'Multiplies all sand rates by '+ Molpify(mult*100,2)+'%';
			}
			return 'Multiplies all sand rates by 1% per Badge earned';
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
	new Molpy.Boost({name:'Extension Ladder',desc:'Ladders reach a little higher',sand:'12K',castles:22,
		stats:'Each ladder produces 18 more sand per mNP, before multipliers'});
	new Molpy.Boost({name:'Level Up!',desc:'Ladders are much more powerful',sand:'29K',castles:34,
		stats:'Ladders produce 2 times as many castles per ONG',icon:'levelup'});
	new Molpy.Boost({name:'Varied Ammo',desc:'Trebuchets build an extra castle for each Castle Tool you have 2+ of',sand:3900,castles:48,
		stats:function()
		{
			if(Molpy.Got('Varied Ammo'))
			{
				var val = 0;
				for(i in Molpy.CastleTools) if(Molpy.CastleTools[i].amount>1)val++;
				return 'Each trebuchet produces '+Molpify(val)+ ' more castles per ONG, before multipliers';
			}
			return 'For each kind of Castle Tool of which you have 2 or more, each trebuchet produces an additional castle per ONG, before multipliers';
		}
	});
	new Molpy.Boost({name:'Megball',desc:'Cuegan produce double sand',sand:10700,castles:56,icon:'megball'});
	new Molpy.Boost({name:'Robot Efficiency',desc:'Newpixbots build an extra castle (before any doubling)',
		sand:'34K',castles:153,icon:'robotefficiency',group:'cyb'});
	new Molpy.Boost({name:'Ninja Builder',desc:'When increasing ninja stealth streak, builds that many castles',
		sand:4000,castles:35,
		stats:function()
		{
			if(Molpy.Got('Ninja Builder')) 
				return 'Will build '+ (Molpy.ninjaStealth+(1+Molpy.Got('Active Ninja')*2))+ ' Castles unless you destealth ninjas';
			return 'Ninja Stealth increases the first time you click within a NewPix after NewPixBots activate. It will reset if you click before NewPixBots activate, or don\'t click before the next ONG.'	
			
		},icon:'ninjabuilder',group:'ninj'
	});
	new Molpy.Boost({name:'Erosion',desc:'Waves destroy less by 20% of total castles wasted by waves, and'
		+'2 less per River bought',sand:'40K',castles:77,icon:'erosion'});
	new Molpy.Boost({name:'Autosave Option',desc:'Autosave option is available',sand:100,castles:4,icon:'autosave'});
	new Molpy.Boost({name:'Helpful Hands',desc:'Each Cuegan+Bucket pair gives clicking +0.5 sand',
		sand:250,castles:5,icon:'helpfulhands'});
	new Molpy.Boost({name:'True Colours',desc:'Each Cuegan+Flag pair gives clicking +5 sand',
		sand:750,castles:15,icon:'truecolours'});
	new Molpy.Boost({name:'Precise Placement',desc:'For every two ladders, scaffolds destroy one less castle',
		sand:8750,castles:115});
	new Molpy.Boost({name:'Ninja Hope',desc:'Avoid one Ninja Stealth reset, at the cost of 10 castles',
		sand:7500,castles:40,icon:'ninjahope',startPower:1,group:'ninj'}); 
	new Molpy.Boost({name:'Ninja Penance',desc:'Avoid a two Ninja Stealth resets, at the cost of 30 castles each',
		sand:'25K',castles:88,icon:'ninjapenance',startPower:2,group:'ninj'}); 
	new Molpy.Boost({name:'Blitzing',desc:function(me)
		{		
			return Molpify(me.power,1)+'% Sand for '+Molpify(me.countdown)+'mNP';
		}
		,icon:'blitzing',className:'alert'});
	new Molpy.Boost({name:'Kitnip',desc:Molpy.redactedWords+' come more often and stay longer',
		sand:33221,castles:63,
	icon:'kitnip'});
	new Molpy.Boost({name:'Department of Redundancy Department',desc:Molpy.redactedWords
		+' sometimes unlock special boosts',sand:23456,castles:78,icon:'department',group:'hpt'});
	new Molpy.Boost({name:'Raise the Flag',desc:'Each Flag+Ladder pair gives clicking an extra +50 sand',
		sand:'85K',castles:95});
	new Molpy.Boost({name:'Hand it Up',desc:'Each Ladder+Bag pair gives clicking an extra +500 sand',
		sand:'570K',castles:170,department:1});
	new Molpy.Boost({name:'Riverish',desc:'Rivers destroy less castles the more you click',
		sand:'82K',castles:290,icon:'riverish',department:1,
		buyFunction:function(me)
		{
			me.power=Molpy.beachClicks;
		}
		});
	new Molpy.Boost({name:'Double or Nothing',desc: 
		function(me)
		{
			return '<input type="Button" value="Click" onclick="Molpy.DoubleOrNothing()"></input> to double your current castle balance or lose it all.';
		}
		,sand:function()
		{
			var p = Molpy.Boosts['Double or Nothing'].power;
			return 100*Math.pow(2,Math.max(1,p-9));
		},icon:'doubleornothing',department:1,className:'action',lockFunction:function(){
			this.power++;
		}
	});
	Molpy.DoubleOrNothing=function()
	{
		if(!Molpy.Boosts['Double or Nothing'].bought)
		{
			Molpy.Notify('Buy it first, silly molpy!');
			return;
		}
		if(Math.floor(Math.random()*2))
		{
			var amount=Molpy.castles;
			Molpy.Build(Molpy.castles);
		}else{
			Molpy.Destroy(Molpy.castles);
			Molpy.Boosts['Double or Nothing'].power=Math.floor(Molpy.Boosts['Double or Nothing'].power/2);
		}
		Molpy.LockBoost('Double or Nothing');
	}
	new Molpy.Boost({name:'Grapevine',desc:'Increases sand dig rate by 2% per badge earned',sand:'25K',castles:25,icon:'grapevine',department:1});
	Molpy.IKEA='Affordable Swedish Home Furniture';
	new Molpy.Boost({name:Molpy.IKEA,desc: function(me){return Molpify(me.power*100,1)+'% off all items for '+Molpify(me.countdown)+'mNP'}
		,buyFunction:function(){
			Molpy.shopRepaint=1;
		}
		,countdownFunction:function(){
			if(this.countdown==2)
			{
				Molpy.Notify('Only 2mNP of discounts remain!');
			}
		}
		,startPower:0.4,startCountdown:4,group:'hpt',department:1,className:'alert'});
	
	new Molpy.Boost({name:'Overcompensating',desc: function(me){
		return 'During LongPix, Sand Tools dig '+Molpify(me.startPower*100,1)+'% extra sand'}
		,sand:987645,castles:321,icon:'overcompensating',startPower:1.05});
	new Molpy.Boost({name:'Doublepost',desc:'During LongPix, Castle Tools activate a second time',
		sand:'650K',castles:4000,icon:'doublepost'});
	new Molpy.Boost({name:'Coma Molpy Style',desc: 
		function(me)
		{ 
			return (me.power? '':'When active, ') + 'Castle Tools do not activate and ninjas stay stealthed <br/><input type="Button" onclick="Molpy.ComaMolpyStyleToggle()" value="'+(me.power? 'Dea':'A')+'ctivate"></input>';
		}
		,sand:8500,castles:200,icon:'comamolpystyle',className:'toggle'});
	
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
	new Molpy.Boost({name:'Time Travel',desc: 
		function(me)
		{
			var price=Math.ceil(Molpy.newpixNumber*Molpy.priceFactor);
			if(Molpy.Got('Flux Capacitor'))price=Math.ceil(price*.2);
			return 'Pay ' + Molpify(price) + ' Castles to move <input type="Button" onclick="Molpy.TimeTravel('+(-me.power)+');" value="backwards"></input> or <input type="Button" onclick="Molpy.TimeTravel('+me.power+');" value="forwards"></input> '+
			Molpify(me.power)+' NP in Time';
		}
		,sand:1000,castles:30,startPower:1,className:'action',group:'chron'});
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
					:(Molpy.Got('Flux Turbine')?8
					:20);
				if(!Math.floor(Math.random()*incursionFactor))
				{
					if(!Molpy.Boosts['NewPixBot Navigation Code'].power && Molpy.intruderBots<=30)
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
					}else{
						Molpy.Notify('Temporal Incursion Prevented!');
					}
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
	new Molpy.Boost({name:'Active Ninja',desc:
		'During LongPix, Ninja Stealth is incremented by 3 per NP. Is there an Echo in here?',
			sand:'1.5M',castles:240,icon:'activeninja',group:'ninj'});
	new Molpy.Boost({name:'Kitties Galore',desc:'Even more '+Molpy.redactedWords,
		sand:'2.5M',castles:4400,icon:'kittiesgalore',department:1});	
	
	new Molpy.Boost({name:'HAL-0-Kitty',desc:'NewPixBots build an extra Castle per 9 '+Molpy.redactedWords,
		sand:9000,castles:2001,icon:'halokitty',group:'cyb'});
	new Molpy.Boost({name:'Factory Automation',desc:'When NewPixBots activate, so does the Department of Redundancy Department at a cost of '+Molpify(2000000)+' Sand',sand:'4.5M',castles:15700,icon:'factoryautomation',group:'hpt'});
	new Molpy.Boost({name:'Blast Furnace',desc:'Gives the Department of Redundancy Department the ability to make Castles from Sand',
		sand:'8.8M',castles:28600,
		stats:function()
		{
			var blastFactor=1000;
			if(Molpy.Got('Fractal Sandcastles'))
			{
				blastFactor=Math.max(1,1000*Math.pow(0.98,Molpy.Boosts['Fractal Sandcastles'].power));
			}
			return 'Uses '+Molpify(2000000)+' Sand to warm up, then makes Castles at a cost of ' + Molpify(blastFactor,1) + ' each';
		}
		,icon:'blastfurnace',group:'hpt'});
	
	new Molpy.Boost({name:'Sandbag',desc:'Bags and Rivers give each other a 5% increase to Sand digging, Castle building, and Castle destruction',sand:'1.4M',castles:'21K'});
	new Molpy.Boost({name:'Embaggening',desc:'Each Cuegan after the 14th gives a 2% boost to the sand dig rate of Bags',
		sand:'3.5M',castles:'23K',icon:'embaggening'});
	new Molpy.Boost({name:'Carrybot',desc:'NewPixBots produce double castles, Buckets produce quadruple',
		sand:'10K',castles:'1K',icon:'carrybot',group:'cyb'});
	new Molpy.Boost({name:'Stickbot',desc:'NewPixBots produce double castles, Cuegan produce quadruple',
		sand:'50K',castles:'2.5K',icon:'stickbot',group:'cyb'});
	new Molpy.Boost({name:'Standardbot',desc:'NewPixBots produce double castles, Flags produce quadruple',
		sand:'250K',castles:6250,icon:'standardbot',group:'cyb'});
	new Molpy.Boost({name:'Climbbot',desc:'NewPixBots produce double castles, Ladders produce quadruple',
		sand:'1250K',castles:15625,icon:'climbbot',group:'cyb'});
	new Molpy.Boost({name:'Luggagebot',desc:'NewPixBots produce double castles, Bags produce quadruple',
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
	
	new Molpy.Boost({name:'Swell',desc:'Waves produce 29 more Castles',sand:'20K',castles:200});
	new Molpy.Boost({name:'Flux Capacitor',desc:'It makes Time Travel possibler!',sand:88,castles:88,group:'chron'});
	new Molpy.Boost({name:'Bag Burning',desc:'Bags help counteract NewPixBots',sand:'50M',castles:86,
		stats:function()
		{
			var str = 'Half of Bags beyond the 14th owned give a 40% increase to Judgement Dip threshhold.';
			if(Molpy.SandTools['Bag'].amount>Molpy.npbDoubleThreshhold)
			{
				var amount = Math.pow(1.4,Math.max(0,(Molpy.SandTools['Bag'].amount-Molpy.npbDoubleThreshhold)/2))-1;
				amount=Molpify(amount*100,0,1);
				str+=' Currently '+amount+'%';
			}
			return str;
		}
		,icon:'bagburning'});
	new Molpy.Boost({name:'Chromatic Heresy',desc:
		function(me)
		{
			return 'Saturation is '+(me.power?'':'not ')+'allowed. <input type="Button" value="Click" onclick="Molpy.ChromaticHeresyToggle()"></input> to toggle.';
		},sand:200,castles:10,icon:'chromatic',className:'toggle'});
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
	new Molpy.Boost({name:'Flux Turbine',desc:'Castles lost via Molpy Down increase the rate of building new Castles',
		sand:1985,castles:121,
		stats:function()
		{
			if(!Molpy.Got('Flux Turbine')) return 'All castle gains are increased by 2% per natural logarithm of castles wiped by Molpy Down, except refunds which are not increased.';
			return 'Multiplies all Castle gains by ' + Molpify(Molpy.globalCastleMult*100,2)+'% (But refunds when selling remain unchanged.)';
		},group:'chron'});
	new Molpy.Boost({name:'Ninja Assistants',desc:'Ninja Builder\'s castle output is multiplied by the number of NewPixBots'
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
	new Molpy.Boost({name:'NewPixBot Navigation Code',desc: 
		function(me)
		{
			return 'thisAlgorithm. BecomingSkynetCost = 999999999 <input type="Button" onclick="Molpy.NavigationCodeToggle()" value="' +
				(me.power?'Uni':'I')+'nstall"></input>';
		},sand:999999999,castles:2101,
		stats:'When installed, this averts Judgement Dip at the cost of 99.9% of NewPixBot Castle Production.',
		icon:'navcode',className:'toggle',group:'cyb',
		classChange:function(){return Molpy.CheckJudgeClass(this,1,'toggle',this.power);}
	});	
		
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
		if(Molpy.intruderBots)
		{
			Molpy.CastleTools['NewPixBot'].amount-=Molpy.intruderBots;
			Molpy.Notify(Molpy.intruderBots + ' Intruders Destroyed!');
			Molpy.intruderBots=0;
		}
		Molpy.scrumptiousDonuts=-1;
		nc.hoverOnCounter=1;
		Molpy.recalculateDig=1;
		Molpy.GiveTempBoost('Jamming',1,2000);
	}
	new Molpy.Boost({name:'Jamming',desc:
		function(me)
		{		
			return 'You cannot access NewPixBot Navigation Code for '+Molpify(me.countdown)+'mNP';
		},className:'alert',group:'cyb'
		});	
	
	new Molpy.Boost({name:'Blixtnedslag Kattungar, JA!',desc:'Antalet redundanta klickade kattungar läggs till blixtnedslag multiplikator.',sand:'9.8M',castles:888555222,stats:'Additional '+Molpy.redactedWord+' clicks add 20% to the Blitzing multiplier. (Only when you get a Blitzing or Not Lucky reward.) Also causes Blizting to boost Blast Furnace if they overlap.',icon:'bkj',group:'hpt'});
		
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
			if(!me.bought)return 'Digging sand gives 35% more Castles per Fractal Level, which resets to 1 on the ONG. Blast Furnace uses 98% Sand to make Castles, per Fractal Level';
			return 'Digging Sand will give you ' + Molpify(Math.floor(Math.pow(1.35,me.power)),1,!Molpy.showStats)+' Castles';
		},className:'alert',icon:'fractals'});
	new Molpy.Boost({name:'Balancing Act',desc:'Flags and Scaffolds give each other a 5% increase to Sand digging, Castle building, and Castle destruction',sand:'1875K',castles:843700,icon:'balancingact'});
	new Molpy.Boost({name:'Ch*rpies',desc:'Increases sand dig rate by 5% per badge earned',
		sand:6969696969,castles:81818181,icon:'chirpies'});
	new Molpy.Boost({name:'Buccaneer',desc:'Clicks and buckets give double sand',
		sand:'84.7M',castles:7540,icon:'buccaneer'});
	new Molpy.Boost({name:'Bucket Brigade',desc:'Clicks give 1% of sand dig rate per 50 buckets',
		sand:'412M',castles:8001,icon:'bucketbrigade'});
	new Molpy.Boost({name:'Bag Puns',desc:'Doubles Sand rate of Bags. Clicks give 40% more sand for every 5 bags above 25',sand:'1470M',castles:450021,stats:function(me)
		{
			if(me.power <= 20) return 'Speed is at '+me.power+'out of 20';
		}});
	{//#region puns	
		Molpy.bp = [
			"One True Comic II: The Baginning"
			,"One True Comic 2: Electric Bagaloo"
			,"2 Bags 2 Curious"
			,"The Re-Adventures of Bagsitting"
			,"Conan the Bagbarian 2"
			,"Bag to the Future"
			,"Bag Runner 2: The Last Replicant"
			,"Bag Wars - Episode V - The Sandcastle Strikes Back"
			,"A Tale of Two Bags"
			,"Cueball: The Guy Who Bagged Me"
			,"Harry Potter and the Chamber of Bags"
			,"Bagman: The Dark Watery Stuff Rises"
			,"The Passion of the Bags"
			,"The Good The Bag And The Ugly"
			,"B For Bagdetta"
			,"Theater Of Bags"
			,"Bag Of Blood"
			,"The Day The Bag Stood Still "
			,"Bag Wars Episode IV - A New Loop"
			,"The Big Bag Theory"
			,"American Baggy"
			,"Cue and Meg's Excellent Bagventure"
			,"The Bagfather: Part II"
			,"The Hunt for Bag October"
			,"Bag Storm Rising"
			,"Clear and Present Bags"
			,"The Temporal Strikes Bag"
			,"The Bagmaker"
			,"The Pelican Bag"
			,"The Gingerbag Man"
			,"Runaway Bag"
			,"Transbaggers"
			,"Bagformers"
			,"The Hunger Bags"
			,"Rucksack at Tiffany's"
			,"Bagglestar Galactica"
			,"Cool Bag Loop"
			,"Groundbag Day"
			,"Bag2: Hyperbag"
			,"Bagger's Game"
			,"Bagger's Shadow"
			,"Speaker for the Bag"
			,"Bagocide"
			,"Shadow of the Bagemon"
			,"The Lord of the Bags 1: The Fellowship of the Bags"
			,"The Lord of the Bags 2: The Two Sandcastles"
			,"The Lord of the Bags 3: The Return of La Petite"
			,"Requiem for a Bag"
			,"The Bag Before Time"
			,"Baggie Nights"
			,"Bagnolia"
			,"Punch-Drunk Bags"
			,"There Will Be Bags"
			,"The Bagloliers"
			,"Children of the Bag"
			,"Bagcatcher"
			,"Bagstarter"
			,"The Green Bag"
			,"The Running Bag"
			,"Bag By Me"
			,"Firebag"
			,"Buffy The Bag Slayer"
			,"Citizen Bag"
			,"Seven Bagurai"
			,"Bag Ocean 3: Until the End of Time"
			,"No Castle for Old Bags"
			,"Casabaga"
			,"Lawrence of Bagrabia"
			,"Bagard of Oz"
			,"The Andromeda Bag"
			,"The Terminal Bag"
			,"Eaters of the Bag"
			,"The Great Bag Robbery"
			,"Rising Bag"
			,"The Lost Bag"
			,"Bagframe"
			,"State of Bag"
			,"Drop That Strangebag, or: How I Learned to Stop Worrying and Love the Loop"
			,"Jurassic Bag"
			,"Bag Trek Into Darkness"
			,"The Bagtrix Reloaded"
			,"Bag Window"
			,"The Thomas Crown Bag"
			,"3 Bags Of The Condor"
			,"A Good Day to Bag Hard"
			,"Bag to the Beach"
			,"The Hitchhiker's Guide to Baggage"
			,"The Bag at the End of the Universe"
			,"Bags, the Universe and Everything"
			,"So Long and Thanks for All the Bags"
			,"Mostly Bagless"
			,"And Another Bag"
			,"Beauty and the Bag"
			,"Bagspotting"
			,"Three bags and a baby"
			,"Bag Life!"
			,"Rosencrantz & Guildenstern are Bags"
			,"Men in Bag"
			,"Secrets of the Bag-Bag Sisterhood"
			,"Fried Bag Tomatoes"
			,"Bag Beauty"
			,"Singing in the Bag"
			,"Fiddler in the Bag"
			,"Return to Bag Mountain"
			,"Bags Bunny"
			,"Brokebag Mountain: Two in the Bag"
			,"Breaking Bag"
			,"It's a Bag, Bag, Bag, Bag World"
			,"B*A*G*S"
			,"Bag Trouble in Little China"
			,"'<i>The Papal Pun- <b>A Bagwork Orange</b></i>'"
			,"Bag Story"
			,"A Bag's Life"
			,"Bagsters, Inc."
			,"Bagging Nemo"
			,"BAGG∙E"
			,"Bagatouille"
			,"The Inbagibles"
			,"The Incredibags"
			,"Cabin in the Bag"
			,"Bagalon 5"
			,"The Bag Lebowski"
			,"Silence of the Bags"
			,"Starbag SB-1"
			,"Starbag Atlantis"
			,"Starbag Universe"
			,"Tron Bagacy"
			,"The Last Bagfighter"
			,"Bagaxy Quest"
			,"The Italian Bag"
			,"Half-Bag 3 Confirmed!"
			,"The Big Bag Wolpy"
			,"The Bag of Music"
			,"Iron Bag"
			,"Baglander"
			,"The Molpy, the Bag, and the Castle"
			,"Treasures of the Bag"
			,"Romeo and Bagguette"
			,"Bags for Dummies"
			,"Tomb Bagger"
			,"Raiders of the Lost Bag"
			,"Bagnado"
			,"Bag vs. Predator"
			,"Bagception"
			,"Baginator"
			,"The Legend of Bagger Vance"
		]
	}
	
	new Molpy.Boost({name:'The Forty',desc:'Cuegan produce 40 times as much sand',sand:40404040,castles:4040,icon:'theforty'});
	new Molpy.Boost({name:'Chequered Flag',desc:'Racing NewPixBots activate 10% sooner',sand:101010101,castles:10101,icon:'cheqflag'});
	new Molpy.Boost({name:'Skull and Crossbones',desc:'Pirates vs. Ninjas! Ninja Builder\'s Castle output is increased by 5% per flag owned over 40',sand:304050607,castles:809010,icon:'skullcrossbones',group:'ninj'});
	new Molpy.Boost({name:'No Sell',desc:
		function(me)
		{
			return '<input type="Button" onclick="Molpy.NoSellToggle()" value="'+(me.power? 'Show':'Hide')+'"></input> the Sell links on tools.';
		},sand:3333,castles:55,icon:'nosell',className:'toggle'});
	
	Molpy.NoSellToggle=function()
	{
		var me=Molpy.Boosts['No Sell'];
		if(!me.bought)me.buy();
		if(!me.bought)
		{
			Molpy.Notify('Looks like you need to sell something');
			return;
		}
		me.power = (!me.power)*1;
		me.hoverOnCounter=1;
		Molpy.shopRepaint=1;
	}
		
	new Molpy.Boost({name:'Blixtnedslag Förmögenhet, JA!',desc:'Not Lucky gets a 20% bonus (non-cumulative) per level of Blixtnedslag Kattungar, JA! It also gets a boost from Blitzing if you get them simultaneously.',sand:111098645321,castles:7777777777,
		stats:function()
		{
			return 'Adds ' + Molpify(20*Molpy.Boosts['Blixtnedslag Kattungar, JA!'].power,1)+'% to Not Lucky reward';
		},icon:'bfj',group:'hpt'});
	new Molpy.Boost({name:'VITSSÅGEN, JA!',
		desc:function(me)
		{
			if(me.bought==0) return 'This message is dedicated to MajorDouble7 who found this bug and thus will never see this message since it is intended to stop people from magically getting this without buying it';
			return '<input type="Button" onclick="Molpy.PunsawToggle()" value="'+(me.bought==1? 'Start':'Stop')+'"></input> the Puns!'
		},sand:334455667788,castles:999222111000,icon:'vitss',
		stats:function(me)
		{
			if(me.power <= 100) return 'Speed is at '+me.power+'out of 100';
			return me.desc(me);
		},group:'hpt',className:'toggle'});
	Molpy.PunsawToggle=function()
	{
		Molpy.Boosts['VITSSÅGEN, JA!'].bought = (Molpy.Boosts['VITSSÅGEN, JA!'].bought==1?2:1);
		Molpy.boostRepaint=1;
		Molpy.Boosts['VITSSÅGEN, JA!'].hoverOnCounter=1;
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
			if(!me.power)
			{
				me.power=1;
				Molpy.Build(8887766554433);
			}
			if(!me.bought) return 'Look here again after you buy for secret loot!';
			
			Molpy.UnlockBoost(['Family Discount','Shopping Assistant','Late Closing Hours']);
			return 'Gives you Swedish stuff and boosts VITSSÅGEN, JA! bonus castles';
		},icon:'swedishchef',group:'hpt'});
	new Molpy.Boost({name:'Family Discount',desc:'Permament 80% discount on all prices',sand:'24G',castles:'720G',
		buyFunction:function(){Molpy.shopRepaint=1;},group:'hpt',icon:'familydiscount'}
	);
	Molpy.shoppingItem='';
	new Molpy.Boost({name:'Shopping Assistant',desc:
		function(me)
		{
			if(!me.bought)
				return 'We do your shopping for you! For a small fee...';
			if(!Molpy.shoppingItem)
				return '<input type="Button" value="Choose" onclick="Molpy.ChooseShoppingItem()"></input> an item to automatically buy when '+Molpy.IKEA+' is active';
			return 'Buys '+Molpy.shoppingItem+' whenever possible, taking a 5% handling fee. You may <input type="Button" value="Choose" onclick="Molpy.ChooseShoppingItem()"></input> a different item (or none) at any time.';
		},sand:'18G',castles:'650G',icon:'shopassist',className:'action',group:'hpt'});
	Molpy.ChooseShoppingItem=function()
	{
		var name = prompt('Enter the name of the tool or boost you wish to buy whenever ASHF is active.\nNames are case sensitive.\nLeave blank to disable.\nYour choice is not preserved if you reload.',Molpy.shoppingItem||'Bag');
		if(name)
		{
			var item=Molpy.SandTools[name] || Molpy.CastleTools[name];
			if(item)
			{
				Molpy.shoppingItem=name;
				Molpy.Notify(item.plural + ' will be purchased whenever ASHF is active if possible',1);
				return;
			}
			var item = Molpy.Boosts[name];
			if(item && !item.bought)
			{
				Molpy.shoppingItem=name;
				Molpy.Notify(name + ' will be purchased when ASHF is active if possible',1);
				return;
			}
		}
		Molpy.shoppingItem='';
		Molpy.Notify('No item selected for shopping assistant',1);
	}
	new Molpy.Boost({name:'Late Closing Hours',desc:Molpy.IKEA+' is available for 6 mNP longer',
		sand:'47G',castles:'930G',icon:'lateclosing',group:'hpt'});
	new Molpy.Boost({name:'Throw Your Toys',desc:'Trebuchets build a castle for every flag and bucket owned',sand:'546M',castles: '230K'});
	new Molpy.Boost({name:'Broken Rung',desc:'Multiplies the Sand output of Ladders by the amount of the tool you have least of.',
		sand:'1769M',castles: '450K',icon:'brokenrung'});
	
	new Molpy.Boost({name:'Temporal Rift',
		desc:function(me)
		{
			if(me.bought)return 'A hole in Time has opened. You can not determine where it leads, but it will close in '+me.countdown+'mNP.<br/><input type="Button" value="JUMP!" onclick="Molpy.RiftJump()"></input>';
			return 'A hole in time has opened.';
		}
		,countdownFunction:function()
		{
			if(this.countdown==2)
			{
				Molpy.Notify('The rift closes in 2mNP!');
			}
		}
		,startCountdown:6,group:'chron',className:'action'});
	Molpy.RiftJump=function()
	{
		if(Math.random()*5<4)
		{
			Molpy.totalCastlesDown+=Molpy.castles;
			Molpy.castlesBuilt-=Molpy.castles;
			Molpy.Destroy(Molpy.castles);
			Molpy.Dig(Molpy.sand);
		}
		Molpy.newpixNumber=Math.round(Math.random()*Molpy.highestNPvisited);
		Molpy.ONG();
		Molpy.LockBoost('Temporal Rift');
		Molpy.Notify('You wonder when you are');
	}
	
	new Molpy.Boost({name:'Glass Furnace',
		desc:function(me)
		{
			if(!me.bought) return 'Turns Sand into Glass';
			var pow=Molpy.Boosts['Sand Refinery'].power+1;
			var cost=Molpify(Molpy.GlassFurnaceSandUse(1),1);
			var str= (me.power?'U':'When active, u')+'ses '+cost+'% of Sand dug to produce '+pow+' Glass Chip'+(pow>1?'s':'')+' per NP.<br/>';
			
			if(Molpy.Got('Glass Furnace Switching'))
			{
			 str+='Currently '+(me.power?'Dea':'A')+'ctivating.';
			}else{
				str+='<input type="Button" value="'+(me.power?'Dea':'A')+'ctivate" onclick="Molpy.SwitchGlassFurnace('+me.power+')"></input>';
			}			
			return str;
		}
		,sand:'80M',castles:'0.5M',icon:'glassfurnace',className:'toggle',group:'hpt'});
	new Molpy.Boost({name:'Glass Furnace Switching',
		desc:function(me)
		{
			return (me.power?'off':'on')+' in '+Molpify(me.countdown)+'mNP';
		},lockFunction:
		function()
		{
			Molpy.Boosts['Glass Furnace'].power = (!this.power)*1;
			Molpy.Notify('Glass Furnace is '+(this.power?'off':'on'));
		}
		,className:'alert',group:'hpt'
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
		this.power=off;
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
			return amount;
		}
		return 0;
	}
	Molpy.SandRefineryIncrement=function()
	{
		if(!Molpy.Got('Sand Purifier'))return 1;
		return 1/(Molpy.Boosts['Sand Purifier'].power+2)
	}
	Molpy.GlassBlowerSandUse=function(force)
	{
		if(force||Molpy.Boosts['Glass Blower'].power||Molpy.Got('Glass Blower Switching'))
		{
			var amount = Molpy.Boosts['Glass Chiller'].power+1;
			amount*=Molpy.GlassChillerIncrement();
			return amount;
		}
		return 0;
	}
	Molpy.GlassChillerIncrement=function()
	{
		return 1;//(Molpy.Got('some boost I have not made yet')?0.5:1);		
	}
	Molpy.CalcGlassUse=function()
	{
		var glassUse=0;
		glassUse+=Molpy.GlassFurnaceSandUse();
		glassUse+=Molpy.GlassBlowerSandUse();		
		return glassUse;
	}
	
	new Molpy.Boost({name:'Sand Refinery',desc:
		function(me)
		{		
			var ch = Molpy.Boosts['Glass Chip Storage'];
			var bl = Molpy.Boosts['Glass Block Storage'];
			if(Molpy.CheckSandRateAvailable(Molpy.SandRefineryIncrement()))
			{
				var useChips=1;
				if(ch.power>=3)
				{
					
				}else if(bl.power>0)
				{
					useChips=0
				}else{
					return 'It costs 3 Chips to upgrade the Glass Furnace\'s speed';
				}
				var pow=Molpify((Molpy.Boosts['Sand Refinery'].power)+2);
					return '<input type="Button" value="Pay" onclick="Molpy.UpgradeSandRefinery()"></input> '
					+(useChips?'3 Chips':'1 Block')+' to upgrade the Glass Furnace to produce '+pow
					+' Glass Chip'+(pow>1?'s':'')+' per NP (will use '+Molpify(pow*Molpy.SandRefineryIncrement(),2)+'% of Sand dug).';
			}else{
				return 'Currently, you have no more sand available for further upgrades';
			}
		}
		,icon:'sandrefinery',className:'action',group:'hpt'
	});
	Molpy.UpgradeSandRefinery=function()
	{
		var ch = Molpy.Boosts['Glass Chip Storage'];
		var bl = Molpy.Boosts['Glass Block Storage'];
		if(Molpy.CheckSandRateAvailable(Molpy.SandRefineryIncrement()))
		{
			if(ch.power>=3)
			{
				ch.power-=3;
			}
			else if(bl.power>=1)
			{
				bl.power-=1;
			}else{
				return;
			}
			Molpy.Boosts['Sand Refinery'].power++;
			Molpy.Notify('Sand Refinery upgraded',1);
			Molpy.boostRepaint=1;
		}
		
	}
	
	new Molpy.Boost({name:'Glass Chip Storage',desc:
		function(me)
		{
			var str= 'Contains '+Molpify(me.power)+' Glass Chip'+(me.power>1?'s':'')+'.';
			var size=(me.bought)*10;
			str+= ' Has space to store '+Molpify(size,1,!Molpy.showStats)+ ' Chips total.';
			if(size-me.power<=me.power*5)
			{
				if(me.power>=5)
				{
					str+= ' <input type="Button" value="Pay" onclick="Molpy.UpgradeChipStorage()"></input> 5 Chips to build storage for 10 more.'
				}else{
					str+=' It costs 5 Glass Chips to store 10 more.';
				}
			}
			if(me.power>10&&!Molpy.Got('Sand Refinery'))
			{
				if(me.power>=30)
				{
					str+= ' <input type="Button" value="Pay" onclick="Molpy.BuyGlassBoost(\'Sand Refinery\',30,0)"></input> 30 Chips to build a Sand Refinery to make Chips faster.'
				}else{
					str+=' It costs 30 Glass Chips to build a Sand Refinery, which can make Chips faster.';
				}
			}			
			if(me.power>100&&!Molpy.Got('Glass Blower'))
			{
				if(me.power>=150)
				{
					str+= ' <input type="Button" value="Pay" onclick="Molpy.BuyGlassBoost(\'Glass Blower\',150,0)"></input> 150 Chips to build a Glass Blower to make Glass Blocks from Glass Chips.'
				}else{
					str+=' It costs 150 Glass Chips to build a Glass Blower, which makes Glass Blocks from Glass Chips.';
				}
			}
			return str;
		}
		,icon:'glasschipstore',className:'alert',group:'hpt'
	});
	Molpy.UpgradeChipStorage=function()
	{
		var ch = Molpy.Boosts['Glass Chip Storage'];
		if(ch.power>=5)
		{
			ch.power-=5;
			ch.bought++;
			Molpy.boostRepaint=1;
			Molpy.Notify('Glass Chip Storage upgraded',1);
		}
	}
	
	Molpy.BuyGlassBoost=function(name,chips,blocks)
	{
		var ch = Molpy.Boosts['Glass Chip Storage'];
		var bl = Molpy.Boosts['Glass Block Storage'];
		if(ch.power>=chips&&bl.power>=blocks)
		{
			ch.power-=chips;
			bl.power-=blocks;
			Molpy.UnlockBoost(name);
			Molpy.Boosts[name].buy();			
		}
	}
	
	
	//glass blower
	new Molpy.Boost({name:'Glass Blower',
		desc:function(me)
		{
			if(!me.bought) return 'Makes Glass Blocks from Glass Chips';
			var pow=Molpy.Boosts['Glass Chiller'].power+1;
			var cost=Molpify((Molpy.GlassBlowerSandUse(1),1));
			var str= (me.power?'U':'When active, u')+'ses '+cost+'% of Sand dug to produce '+pow+' Glass Block'+(pow>1?'s':'')
				+' from 20 Glass Chips (each) per NP.<br/>';			
			
			if(Molpy.Got('Glass Blower Switching'))
			{
			 str+='Currently '+(me.power?'Dea':'A')+'ctivating.';
			}else{
				str+='<input type="Button" value="'+(me.power?'Dea':'A')+'ctivate" onclick="Molpy.SwitchGlassBlower('+me.power+')"></input>';
			}			
			return str;			
			
		}
		,icon:'glassblower',className:'toggle',group:'hpt'});
	new Molpy.Boost({name:'Glass Blower Switching',
		desc:function(me)
		{
			return (me.power?'off':'on')+' in '+Molpify(me.countdown)+'mNP';
		},lockFunction:
		function()
		{
			Molpy.Boosts['Glass Blower'].power = (!this.power)*1;
			Molpy.Notify('Glass Blower is '+(this.power?'off':'on'));
		}
		,className:'alert',group:'hpt'
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
		Molpy.GiveTempBoost('Glass Blower Switching',off,2500);
	}
	
	new Molpy.Boost({name:'Glass Chiller',desc:
		function(me)
		{		
			var bl = Molpy.Boosts['Glass Block Storage'];
			if(bl.power>=5)
			{
				if(Molpy.CheckSandRateAvailable(Molpy.GlassChillerIncrement()))
				{
					var pow=Molpify((Molpy.Boosts['Glass Chiller'].power)+2);
					return '<input type="Button" value="Pay" onclick="Molpy.UpgradeGlassChiller()"></input> 5 Blocks to upgrade the Glass Blower to produce '+pow+' Glass Block'+(pow>1?'s':'')+' per NP (will use '+(pow*Molpy.GlassChillerIncrement())+'% of Sand dug).';
				}else{
					return 'Currently, you have no more sand available for further upgrades';
				}
			}
			return 'It costs 5 Blocks to upgrade the Glass Blower\'s speed';
		},icon:'glasschiller',className:'action',group:'hpt'
	});
	Molpy.UpgradeGlassChiller=function()
	{
		var bl = Molpy.Boosts['Glass Block Storage'];
		if(bl.power>=5 && Molpy.CheckSandRateAvailable(Molpy.GlassChillerIncrement()))
		{
			bl.power-=5;
			Molpy.Boosts['Glass Chiller'].power++;
			Molpy.Notify('Glass Chiller upgraded',1);
			Molpy.boostRepaint=1;
		}
	}
	
	new Molpy.Boost({name:'Glass Block Storage',desc:
		function(me)
		{
			var str= 'Contains '+Molpify(me.power)+' Glass Block'+(me.power>1?'s':'')+'.';
			var size=(me.bought)*50;
			str+= ' Has space to store '+Molpify(size,1,!Molpy.showStats)+ ' Blocks total.';
			if(size-me.power<=me.power*5)
			{
				if(me.power>=15)
				{
					str+= ' <input type="Button" value="Pay" onclick="Molpy.UpgradeBlockStorage()"></input> 15 Blocks to build storage for 50 more.'
				}else{
					str+=' It costs 15 Glass Blocks to store 50 more.';
				}
			}
			if(me.power>30&&!Molpy.Got('Glass Chiller'))
			{
				if(me.power>=80)
				{
					str+= ' <input type="Button" value="Pay" onclick="Molpy.BuyGlassBoost(\'Glass Chiller\',0,80)"></input> 80 Blocks to build a Glass Chiller to make Blocks faster.'
				}else{
					str+=' It costs 80 Glass Blocks to build a Glass Chiller, which can make Blocks faster.';
				}
			}
			if(me.power>40&&!Molpy.Got('Sand Purifier'))
			{
				if(me.power>=95)
				{
					str+= ' <input type="Button" value="Pay" onclick="Molpy.BuyGlassBoost(\'Sand Purifier\',0,95)"></input> 95 Blocks to build a Sand Purifier, which makes the Glass Furnace use less sand.'
				}else{
					str+=' It costs 95 Glass Blocks to build a Sand Purifier, which makes the Glass Furnace use less sand.';
				}
			}
			return str;
		}
		,icon:'glassblockstore',className:'alert',group:'hpt'
	});
	Molpy.UpgradeBlockStorage=function()
	{
		var bl = Molpy.Boosts['Glass Block Storage'];
		if(bl.power>=15)
		{
			bl.power-=15;
			bl.bought++;
			Molpy.boostRepaint=1;
			Molpy.Notify('Glass Block Storage upgraded',1);
		}
	}
	Molpy.SandPurifierUpgradeCost=function()
	{
		return 20+(5*Molpy.Boosts['Sand Purifier'].power);
	}
	Molpy.UpgradeSandPurifier=function()
	{
		var bl = Molpy.Boosts['Glass Block Storage'];
		if(bl.power>=Molpy.SandPurifierUpgradeCost())
		{
			bl.power-=Molpy.SandPurifierUpgradeCost();
			Molpy.Boosts['Sand Purifier'].power++;
			Molpy.boostRepaint=1;
			Molpy.Notify('Sand Purifier upgraded',1);
		}
	}
	new Molpy.Boost({name:'Sand Purifier',
		desc:function(me)
		{
			var cost = Molpy.SandPurifierUpgradeCost();
			var str = 'Glass Furnace\'s sand use is divided by '+(me.power+2);
			var bl = Molpy.Boosts['Glass Block Storage'];
			if(bl.power >= cost-10)
			{
				if(bl.power>=cost)
				{
					str+='. <input type="Button" value="Pay" onclick="Molpy.UpgradeSandPurifier()"></input> '+cost
						+ ' Glass Blocks to increase this by 1.';
				}else{
					str+='. It costs '+cost+ 'Glass Blocks to increase this by 1.';				
				}
			}
			return str;
		},className:'action',group:'hpt'});
	new Molpy.Boost({name:'Glass Jaw',
		desc:function(me)
		{
			var str= 'Ninja Builder builds 100x as many Castles, at the cost of 1 Glass Block per NP.';
			if(me.bought){
				str+=' <input type="Button" onclick="Molpy.GlassJawToggle()" value="'+(me.power? 'Dea':'A')+'ctivate"></input>';
			}
			return str;
		}
		,sand:'16M',castles:122500,icon:'glassjaw',group:'ninj',className:'toggle'});
	Molpy.GlassJawToggle=function()
	{
		var gj=Molpy.Boosts['Glass Jaw'];
		gj.power=(!gj.power)*1;
		gj.hoverOnCounter=1;
		Molpy.boostRepaint=1;
	}
		
	new Molpy.Boost({name:'Ninja League',desc:'Ninja Stealth is raised by 100x as much'
		,sand:'5T',castles:'0.6T',icon:'ninjaleague',group:'ninj'});
		
	new Molpy.Boost({name:'Ninja Legion',desc:'Ninja Stealth is raised by 1000x as much'
		,sand:'3P',castles:'0.9P',group:'ninj'});
		
	new Molpy.Boost({name:'Swim Between the Flags',desc:'Each Flag gives Waves a 6% bonus to Castle production on even NewPix and to destruction on odd NewPix. The Sand production of Flags is multiplied by the number of Waves on odd NewPix and divided on even NewPix.', sand:'14G', castles: '2T'});
	
	new Molpy.Boost({name:"Château d'If",
		desc:function(me)
		{
			var str = '<b>THIS FORTRESS IS HERE</b>.'
			if(me.bought)
			{
				if(!Molpy.Got('Rosetta'))
				{
					return '<input type="Button" value="Trade" onclick="Molpy.GetRosetta()"> 50 Bags to find Rosetta.</input>'
				}
			}
			return str;
		}, sand:'400T',castles:'12.5T',icon:'chateau',group:'bean',className:'action',
		classChange:function()
		{
			var oldClass=this.className;
			var newClass = Molpy.Boosts['Rosetta'].unlocked?'':'action';
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
			Molpy.shopRepaint=1;
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
					return '<input type="Button" value="Trade" onclick="Molpy.BuyGlassBoost(\'Panther Salve\',0,250)"> 250 Glass Blocks for Panther Salve.</input>'
				}
			}
			return str;
		}, sand:'0.9P',castles:'32T',icon:'rosetta',group:'bean',className:'action',
		classChange:function()
		{
			var oldClass=this.className;
			var newClass = Molpy.Got('Panther Salve')?'':'action';
			if(newClass!=oldClass)
			{
				this.className=newClass;
				return 1;
			}
		}
		});
		
	new Molpy.Boost({name:'Panther Salve',desc:'"It\'s some kind of paste." Not Lucky gets a cumulative 1% bonus from each item owned, at a cost of 10 Glass Blocks per use.',
	desc:'Not Lucky\'s reward is 1% higher for every Tool, Boost, and Badge owned. Consumes 10 Glass Blocks per use.',group:'bean'});
	
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
		Molpy.Destroy(c);
		if(Molpy.Got('Blitzing'))c*=(Molpy.Boosts['Blitzing'].power/100)
		Molpy.Dig(c);
		Molpy.Boosts['Castle Crusher'].power++;
		Molpy.LockBoost('Castle Crusher');
	}
	
	new Molpy.Boost({name:'Furnace Crossfeed',desc:'Blast Furnace now acts as a Glass Furnace instead of it\'s previous purpose, only if Glass Furnace is active.',sand:'6.5G',castles:'.8G',icon:'furnacecrossfeed',group:'hpt'});
	
	new Molpy.Boost({name:'Redundant Redundance Supply of Redundancy',
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
			if(!me.bought||Math.floor(Math.random()*10)==0) return Molpy.redundancy.longsentence;
			var sent = Molpy.redundancy.sentence();
			Molpy.Notify(sent,1);
			return sent;
		}
		,sand:'.97G',castles:'340M',stats:'Causes the effect which results from Redunception',icon:'redunception',group:'hpt'});
	
	function make(thinglist,arg)
	{
		return EvalMaybeFunction(GLRschoice(thinglist),arg);
	}
	function capitalise(string)
	{
		return string.charAt(0).toUpperCase()+string.slice(1);
	}
	Molpy.MakeRedundancy=function()
	{	
		var redundancy={};
		redundancy.paragraph=function()
		{
			var str='';
			var s = Math.floor(Math.random()*10)+2;
			while(s--)
			{
				str+=redundancy.sentence();
				if(s) str+=' ';
			}
			return str;
		}
		redundancy.sentence=function(){return make(redundancy.sentences);}
		redundancy.sentences=[
			function(){return capitalise(make(redundancy.defclauses))+make(redundancy.sentenceEnds);}
		];
		redundancy.sentenceEnds=['.','.','.','.','.','.','.','.','.','.','.','.','.','!','!','????',', and that was that.',' in my pants.',' or perhaps not.',' (or so you\'ve been lead to believe).',', right?',', don\'t you think?',' and that was that.',' which was the last anyone said on the matter.',' leading to the tragic events of today.', ' except in bed.',' but no one cared.',' but I am okay with that now.',', really.','...',' so, yeah...',' and you can probably see where this is going.',' but I don\'t believe a single word of it.',' and I\'m sure it\'ll happen one of these dips.'];
		redundancy.makeTransClause=function(){return make(redundancy.subjects)+' '+make(redundancy.transverbs)+' '+make(redundancy.objects);};
		redundancy.makeIntransCluase=function(){return make(redundancy.subjects)+' '+make(redundancy.intransverbs);};
		redundancy.makeCompoundClause=function(){return make(redundancy.interjections)+', '+make(redundancy.defclauses);};
		redundancy.makeInterjected=function(){return make(redundancy.interjections)+', '+make(redundancy.defclauses);};
		redundancy.defclauses=[
			redundancy.makeTransClause,
			redundancy.makeTransClause,
			redundancy.makeTransClause,
			function(){ return redundancy.makeTransClause()+' '+make(redundancy.comparison);},
			redundancy.makeIntransCluase,
			redundancy.makeIntransCluase,
			function(){return make(redundancy.subjects)+' '+make(redundancy.linkingverbs)+' '+make(redundancy.adjective);},
			function(){return make(redundancy.subjects)+' '+make(redundancy.linkingverbs)+' '+make(redundancy.objects);},
			redundancy.makeCompoundClause,
			redundancy.makeCompoundClause,
			redundancy.makeInterjected,
			redundancy.makeInterjected
		];
		redundancy.makeSubjNoun=function(){return make(redundancy.subjnouns);};
		redundancy.subjects=[
			function(){return make(redundancy.subjnouns)+' and '+make(redundancy.subjnouns);},
			function(){return make(redundancy.subjnouns)+' '+make(redundancy.adjphrase);},
			function(){return make(redundancy.subjnouns)+' '+make(redundancy.prepphrase);},
			redundancy.makeSubjNoun,
			redundancy.makeSubjNoun,
			redundancy.makeSubjNoun,
			redundancy.makeSubjNoun
		];
		redundancy.subjnouns=[
			function(){return make(redundancy.department);},
			function(){return make(redundancy.creature);},
			function(){return make(redundancy.person);},
			function(){return make(redundancy.thing);},
			function(){return make(redundancy.character);}
		];
		redundancy.makeObjNoun=function(){return make(redundancy.objnouns);};
		redundancy.objects=[
			function(){return make(redundancy.objnouns)+' and '+make(redundancy.objnouns);},
			function(){return make(redundancy.objnouns)+' '+make(redundancy.adjphrase);},
			function(){return make(redundancy.objnouns)+' '+make(redundancy.prepphrase);},
			redundancy.makeObjNoun,
			redundancy.makeObjNoun,
			redundancy.makeObjNoun,
			redundancy.makeObjNoun
		];
		redundancy.objnouns=[
			function(){return make(redundancy.department);},
			function(){return make(redundancy.creature);},
			function(){return make(redundancy.person);},
			function(){return make(redundancy.thing);},
			function(){return make(redundancy.character);}
		];
		redundancy.department=[
			function(noart){return (noart?'':'the ')+'Department of Redundancy Department';},
			function(noart){return (noart?'':'the ')+'Department';},
			function(noart){return (noart?'':'the ')+make(redundancy.adjective)+' Department of Redundancy Department';},
			function(noart){return (noart?'':'the ')+make(redundancy.adjective)+' Department';},
		];
		redundancy.makeAdjective=function(){return make(redundancy.adjectives);};
		redundancy.makeModifiedAdjective=function(){return make(redundancy.adjmodifier)+ ' ' + make(redundancy.adjectives);};
		redundancy.adjective=[
			redundancy.makeAdjective,
			redundancy.makeAdjective,
			redundancy.makeAdjective,
			redundancy.makeAdjective,
			redundancy.makeModifiedAdjective,
			redundancy.makeModifiedAdjective,
			redundancy.makeModifiedAdjective,
			redundancy.makeModifiedAdjective,
			function(){return make(redundancy.creature,1)+ '-like';},
			function(){return make(redundancy.creature,1)+ 'ish';},
			function(){return make(redundancy.adjmodifier)+ ' ' +make(redundancy.creature,1)+ '-like';},
			function(){return make(redundancy.adjmodifier)+ ' ' +make(redundancy.creature,1)+ 'ish';}
		]
		redundancy.adjectives=['redundant','redundant','redundant','redundant','real','other','wrong','former','old','new','incredible','reliable','solid', 'cute','angry','squashed','wet','dry','spotted','striped','blue','green','brown','red','white','black','yellow','blood-soaked','clear','dirty','clean','shiny','late','blitzing','tired','formal','wonderful','overbearing','tacky','dead','deconstructed','cybernetic','boring','flammable','rotten','friendly','treeish','seaish','zanclean','riverish','steambottlish','weird','wingish','molpish','mustardy','chirping','bogus','ninjad','extreme','amazing','quick','iron','chilled','delicous','stubborn','interesting','dedicated','tall','short','important','fast','prolific'];
		redundancy.adjmodifier=['very', 'somewhat','kinda','partly','not','nearly','almost','quite','not quite','almost but not quite entirely','entirely','fully','totally','a little bit','far too','incredibly','barely','most','least',
			function(){return make(redundancy.adjective)+'ly';},
			function(){return make(redundancy.prefix)+make(redundancy.adjective);}
		];
		redundancy.prefix=['un','non','in','anti','sub','super','post','pre','ex','in','redunda'];
		redundancy.conjunctions=[';','but','and','so','while','because','after','before','if','which is why','but then','yet','however','nevertheless','henceforth'];
		redundancy.creature=[
			function(noart){return (noart?'':'the ')+make(redundancy.creatures);},
			function(noart){return (noart?'':'the ')+make(redundancy.adjectives)+' '+make(redundancy.creatures);}
		];
		redundancy.creatures=['molpy','molpy','molpy','redundakitty','kitty','beesnake','pricklymolp','raptorcat','chirpy','keyboard','raptor','rabtor','snake','wolpy','seawolpy','dolphy','badger'];
		redundancy.character=[
			function(noart){return make(redundancy.characters);},
			function(noart){return make(redundancy.adjectives)+' '+make(redundancy.characters);}
		];
		redundancy.characters=['Cueball','Megan','LaPetite','Bunny','Mini-Bunny','White Bunny','Gray Bun','Black Bun','Curly Bun','Pulled Back','Headband','Meg-a-like','Hat-Hair','Loopsy','Rose','Bob','Leopard','Sandy','She-Bangs','Littlest Bangs Brother','Middle Bangs Brother','Newest Bangs Brother','Sparse','Curly','Buzz','Brick','Forelock','Roundhair','Lopside','Shortdo','Shorty','Mini-Shortdo','Spike','Two-Tone','Mini-Two-Tone','Afro','Part','Baldo','Rosetta','B-1','B-2','B-3','Expando'];
		redundancy.interjections=['CH*RP','chirping mustard','ch*rping m*stard','m*stard','mustard','by GLR','oh','neat','neat','yeah','yeah','hey','no','yes','alright','nooooooooo','finally','chirp everything'];
		redundancy.person=[
			function(){return make(redundancy.people);}
		];
		redundancy.makeSubPerson=function(){return make(redundancy.subspecifier)+' '+make(redundancy.group);};
		redundancy.people=['the one who reads this','xe who is reading','the clicking person','whoever is on the outside of the screen looking in','one of your friends','a random OTTer','GLR','the stranger looking in the window','someone standing behind you','one of your parents','your mother','your long lost cousin from Australia','the Pope','the Mome','a Blitzer','an Old One','he','she','it','xe','a modern major general',
			redundancy.makeSubPerson,
			redundancy.makeSubPerson,
			redundancy.makeSubPerson,
			redundancy.makeSubPerson,
			redundancy.makeSubPerson,
			redundancy.makeSubPerson,
			redundancy.makeSubPerson,
			redundancy.makeSubPerson,
			redundancy.makeSubPerson,
			redundancy.makeSubPerson
		];
		redundancy.subspecifier=[
			function(){return 'the most '+make(redundancy.adjectives)+' '+make(redundancy.individual);},
			function(){return 'the least '+make(redundancy.adjectives)+' '+make(redundancy.individual);}
		];
		redundancy.individual=['man','woman','child','person','being','OTTer','musician','writer','singer','coder','poster','quoter',
			function(){return 'sentient '+make(redundancy.thing,1);}];
		redundancy.group=['in the world','in the Mediterranean','on Mars','on the moon','in the future','of our time','since sliced bread','other than me','other than you','ever','in <SUBJECT HOMETOWN HERE>','since the Mayans','in the known world','in the internet','on the blogosphere','in the real world','(excluding Chuck Norris)','(even taking Leeroy Jenkins into consideration)','in the hidden cow level','in all of Minecraft','in this needle-pulled thing',
			function(){return 'apart from '+make(redundancy.person);}];
		redundancy.thing=[
			function(noart){return (noart?'':make(redundancy.thingmods)+' ')+make(redundancy.things);},
			function(noart){return (noart?'':make(redundancy.thingmods)+' ')+make(redundancy.adjectives)+' '+make(redundancy.things);}
		];
		redundancy.thingmods=['the', 'my', 'your'];
		redundancy.things=['message','screen','tool','badge','boost','pointer','leopard','information','love','bot','ONG','bucket','flag','ladder','sea','river','wave','trebuchet','scaffold','sand','castle','sandcastle','warning','data','bag','bag','pun','pun','post','OTC','OTT','NewPix','hat','avatar','computer','paper','phone','webpage','thing','pants','pants','pants','cuegan','cake','cake','tree','baobab','steambottle','dilgunnerang','hut','shack','tent','raft','yurt','dip','mushroom','ruin','plant','sack','door','window','brick','m*ustard','grape','vine','grapevine','cheese','break','bacon','cancer','baby','ice','magnet','bacon'];
		redundancy.transverbs=[
			function(){return make(redundancy.transverb);},
			function(){return make(redundancy.adverb)+' '+make(redundancy.transverb);},
			function(){return make(redundancy.transverbs)+', and '+make(redundancy.transverbs);},
			function(){return make(redundancy.transverb)+' ('+make(redundancy.prepphrase)+')';}
		];
		redundancy.transverb=['kicks','clicks','requires','asks','requests','needs','sees','likes','destroys','drops','chases','eats','throws','burns','carries','fires','builds','destroys','quotes','wears','questions','chirps', function(){return 'is '+make(redundancy.things)+'ing'}];
		redundancy.intransverbs=[
			function(){return make(redundancy.intransverb);},
			function(){return make(redundancy.adverb)+' '+make(redundancy.intransverb);},
			function(){return make(redundancy.intransverbs)+', and '+make(redundancy.intransverbs);},
			function(){return make(redundancy.intransverb)+' '+make(redundancy.comparison);},
			function(){return make(redundancy.intransverb)+' '+make(redundancy.prepphrase);}
		];
		redundancy.intransverb=['jumps','laughs','burns','cries','explodes','melts','runs','sings','worries','dies','lives','decays','eats','plays','turns','spins','posts','burrows','types','reboots','refreshes','reloads','wonders', function(){return 'is '+make(redundancy.things)+'ing'}];
		redundancy.prepphrase=[function(){return make(redundancy.prepositions)+' '+make(redundancy.objects);}];
		redundancy.prepositions=['in','in','on','over','under','inside','outside','behind','from','within','from within','beside','underneath','near','at','for','into','of','in front of','nowhere near','to','from','close to','with','along','towards','away from'];
		redundancy.adjphrase=[
			function(){return make(redundancy.adjphrasestart)+' '+make(redundancy.transverbs)+' '+make(redundancy.objects);},
			function(){return make(redundancy.adjphrasestart)+' '+make(redundancy.intransverbs);},
			function(){return make(redundancy.adjphrasestart)+' '+make(redundancy.linkingverbs)+' '+make(redundancy.adjective);},
		];
		redundancy.adjphrasestart=['which','who'];
		redundancy.makeAdverb=function(){return make(redundancy.adverbs);};
		redundancy.adverb=[
			redundancy.makeAdverb,
			redundancy.makeAdverb,
			redundancy.makeAdverb,
			redundancy.makeAdverb,
			function(){return make(redundancy.adjectives)+'ly';},
			function(){return make(redundancy.adjectives)+'ishly';},
		];
		redundancy.comparison=[
			function(){return 'like a '+make(redundancy.creature,1);},
			function(){return 'like a '+make(redundancy.thing,1);},
			function(){return 'like a '+make(redundancy.department,1);},
		];
		redundancy.adverbs=['kinda','almost','often','always','nearly','partly','never'];
		redundancy.linkingverbs=['is','might be','will be', 'will have been', 'is going to be', 'is going to have been', 'could be', 'could have been','might be', 'might have been', 'should be', 'should have been', 'must be', 'must have been'];
		redundancy.longsentence='The Department of Redundancy Department redundantly wishes to redundantly wish you (who are being redundantly wished by the Department of redundancy Department, redundantly) to be redundantly informed by the Department of Redundancy Department that the Department of Redundancy Department which is currently redundantly informing you has redundant information from the Department of Redundancy Department with which to redundantly inform you in order that you may be redundantly informed by the Department of Redundancy Department according to the redundant wishes of the Department of Redundancy Department which has that redundant information, at least according to other redundant information provided redundantly to you by the Department of Redundancy Department prior to the Department of Redundancy Department redundantly informing you with the redundant information with which it is currently redundantly informing you.';
		Molpy.redundancy=redundancy;
		Molpy.make=make;
	}
	Molpy.MakeRedundancy();
	
	Molpy.groupNames={boosts:['boost','Boosts'],
		hpt:['hill people tech','Hill People Tech','boost_department'],
		ninj:['ninjutsu','Ninjutsu','boost_ninjabuilder'],
		chron:['chronotech','Chronotech','boost_lateclosing'],
		cyb:['cybernetics','Cybernetics','boost_robotefficiency'],
		bean:['beanie tech','Beanie Tech','boost_chateau']};
}
	
	
Molpy.DefineBadges=function()
{	
	new Molpy.Badge({name:'Amazon Patent',desc:'1-Click'});
	new Molpy.Badge({name:'Oops',desc:'You clicked it again'});
	new Molpy.Badge({name:'Just Starting',desc:'10 clicks'});
	new Molpy.Badge({name:'Busy Clicking',desc:'100 clicks'});
	new Molpy.Badge({name:'Click Storm',desc:'1,000 clicks'});
	new Molpy.Badge({name:'Getting Sick of Clicking',desc:'Dig 100K sand by clicking'});
	new Molpy.Badge({name:'Why am I still clicking?',desc:'Dig 5M sand by clicking'});
	new Molpy.Badge({name:'Click Master',desc:'Dig 100M sand by clicking',visiblity:2});
	
	new Molpy.Badge({name:'Rook',desc:'Make a castle'});
	new Molpy.Badge({name:'Enough for Chess',desc:'Make 4 castles'});
	new Molpy.Badge({name:'Fortified',desc:'Make 40 castles'});
	new Molpy.Badge({name:'All Along the Watchtower',desc:'Make 320 castles'});
	new Molpy.Badge({name:'Megopolis',desc:'Make 1,000 castles'});
	new Molpy.Badge({name:'Kingdom',desc:'Make 100K castles'});
	new Molpy.Badge({name:'Empire',desc:'Make 10M castles'});
	new Molpy.Badge({name:'Reign of Terror',desc:'Make 1G castles',vis:2});
	
	new Molpy.Badge({name:'We Need a Bigger Beach',desc:'Have 1K castles'});
	new Molpy.Badge({name:'Castle Nation',desc:'Have 1M castles'});
	new Molpy.Badge({name:'Castle Planet',desc:'Have 1G castles'});
	new Molpy.Badge({name:'Castle Star',desc:'Have 1T castles'});
	new Molpy.Badge({name:'Castle Galaxy',desc:'Have 8,888T',vis:1});
	
	new Molpy.Badge({name:'Barn',desc:'Have 50 sand'});
	new Molpy.Badge({name:'Storehouse',desc:'Have 200 sand'});
	new Molpy.Badge({name:'Bigger Barn',desc:'Have 500 sand'});
	new Molpy.Badge({name:'Warehouse',desc:'Have 8K sand'});
	new Molpy.Badge({name:'Sand Silo',desc:'Have 300K sand'});
	new Molpy.Badge({name:'Silicon Valley',desc:'Have 7M sand'});
	new Molpy.Badge({name:'Seaish Sands',desc:'Have 420M sand',vis:1});
	new Molpy.Badge({name:'You can do what you want',desc:'Have 123,456,789 sand',vis:2});
	
	new Molpy.Badge({name:'Ninja', desc:'Ninja a NewPixBot'});
	new Molpy.Badge({name:'No Ninja', desc:'Click for sand after not ninjaing NewPixBot'});
	new Molpy.Badge({name:'Ninja Stealth', desc:'Make non-ninjaing clicks 6 newpix in a row'});
	new Molpy.Badge({name:'Ninja Dedication', desc:'Reach ninja stealth streak 16'});
	new Molpy.Badge({name:'Ninja Madness', desc:'Reach ninja stealth streak 26'});
	new Molpy.Badge({name:'Ninja Omnipresence', desc:'Reach ninja stealth streak 36'});
	new Molpy.Badge({name:'Ninja Strike', desc:'Ninja 10 NewPixBots simultaneously'});
	new Molpy.Badge({name:'Ninja Holidip', desc:'Lose ninja stealth by not clicking'});
	
	new Molpy.Badge({name:'Wipeout', desc:'Destroy a total of 500 castles with waves'});
	new Molpy.Badge({name:'Redundant Redundancy', desc:'Earn 0 badges',vis:1});
	new Molpy.Badge({name:'Redundant', desc:'Earn at least 1 badge',vis:1});
	new Molpy.Badge({name:'Clerical Error', desc:'Receive a badge you haven\'t earned',vis:1});
	new Molpy.Badge({name:'Castle Price Rollback', desc:'Experience an ONG'});
	new Molpy.Badge({name:'This Should be Automatic', desc:'Manually save 20 times'});
	
	new Molpy.Badge({name:'A light dusting', desc:'Have a sand dig rate of 0.1 SpmNP'});
	new Molpy.Badge({name:'Sprinkle', desc:'Have a sand dig rate of 0.8 SpmNP'});
	new Molpy.Badge({name:'Trickle', desc:'Have a sand dig rate of 6 SpmNP'});
	new Molpy.Badge({name:'Pouring it on', desc:'Have a sand dig rate of 25 SpmNP'});
	new Molpy.Badge({name:'Hundred Year Storm', desc:'Have a sand dig rate of 100 SpmNP'});
	new Molpy.Badge({name:'Thundering Typhoon!', desc:'Have a sand dig rate of 400 SpmNP'});
	new Molpy.Badge({name:'Sandblaster', desc:'Have a sand dig rate of 1,600 SpmNP'});
	new Molpy.Badge({name:'Where is all this coming from?', desc:'Have a sand dig rate of 7,500 SpmNP'});
	new Molpy.Badge({name:'Seaish Sandstorm', desc:'Have a sand dig rate of 30K SpmNP',vis:1});
	new Molpy.Badge({name:'WHOOSH', desc:'Have a sand dig rate of 500,500 SpmNP',vis:1});
	new Molpy.Badge({name:'We want some two!', desc:'Have a sand dig rate of 2,222,222 SpmNP',vis:1});
	new Molpy.Badge({name:'Bittorrent', desc:'Have a sand dig rate of 10,101,010 SpmNP',vis:1});
	new Molpy.Badge({name:'WARP SPEEEED', desc:'Have a sand dig rate of 299,792,458 SpmNP',vis:1});
	new Molpy.Badge({name:'Maxed out the display', desc:'Have a sand dig rate of 8,888,888,888.8 SpmNP',vis:2});
	
	new Molpy.Badge({name:'Store ALL of the sand',desc:'Have 782,222,222,144 sand',vis:2});		
	
	new Molpy.Badge({name:'Notified',desc:'Receive a notification'});
	new Molpy.Badge({name:'Thousands of Them!',desc:'Receive 2000 notifications',vis:1});
	new Molpy.Badge({name:'Decisions, Decisions',desc:'With an option on additional decisions',vis:1});
	new Molpy.Badge({name:'Night and Dip',desc:'Change Colour Schemes',vis:1});
	new Molpy.Badge({name:'Far End of the Bell Curve',desc:'View Stats',vis:1});
	new Molpy.Badge({name:'The Fine Print',desc:'View the stats of a Sand Tool',vis:1});
	new Molpy.Badge({name:'Keeping Track',desc:'View the stats of a Castle Tool',vis:1});
	
	new Molpy.Badge({name:'Ninja Shortcomings',desc:'Lose a Ninja Stealth Streak of between 30 and 35'});
	new Molpy.Badge({name:'Not Ground Zero',desc:'Molpy Down',vis:1});
	new Molpy.Badge({name:'Not So '+Molpy.redactedW,desc:'Click 2 '+Molpy.redactedWords,vis:1});
	new Molpy.Badge({name:"Don't Litter!",desc:'Click 14 '+Molpy.redactedWords,vis:1});
	new Molpy.Badge({name:'Y U NO BELIEVE ME?',desc:'Click 101 '+Molpy.redactedWords,vis:1});
	new Molpy.Badge({name:"Have you noticed it's slower?",desc:'Experience the LongPix'});
	Molpy.CheckJudgeClass=function(me,level,name,force)
		{
			var oldClass=me.className;
			var newClass = (force||Molpy.judgeLevel>level)?name:'';
			if(newClass!=oldClass)
			{
				me.className=newClass;
				return 1;
			}
		}
	new Molpy.Badge({name:'Judgement Dip Warning',
		desc:function()
		{
			var report=Molpy.JudgementDipReport();
			if(Molpy.Boosts['NewPixBot Navigation Code'].power) return 'The Bots have been foiled by altered navigation code';
			var level = report[0];
			var countdown = report[1];
			if(!level) return 'Safe. For now.';
			if(level==1) return 'The countdown is at ' + Molpify(countdown)+'NP';
			return 'Judgement dip is upon us! But it can get worse. The countdown is at ' + Molpify(countdown)+
			'NP';
		},vis:2,icon:'judgementdipwarning',className:'alert',classChange:function(){return Molpy.CheckJudgeClass(this,0,'alert');}});
	Molpy.JudgementDipThreshhold=function()
	{
		if(Molpy.Boosts['NewPixBot Navigation Code'].power) return [0,Infinity];
		var baseVal= 500000000;
		var div = 1;
		for(var i in Molpy.Boosts)
		{
			if(Molpy.Got(i))
			{
				var gr = Molpy.Boosts[i].group;
				if(gr=='cyb'||gr=='chron'||gr=='hpt')
				{
					div++;
					if(div>25)
						div*=1.35;
					if(div>40)
						div*=1.35;
				}
			}
		}
		if(Molpy.Got('Bag Burning'))
		{
			div/=Math.pow(1.4,Math.max(0,(Molpy.SandTools['Bag'].amount-Molpy.npbDoubleThreshhold)/2));
		}
		return baseVal/div;
	}
	Molpy.JudgementDipReport=function()
	{
		var bot=Molpy.CastleTools['NewPixBot'];
		var bots = bot.amount;
		if(Molpy.Got('Time Travel')||Molpy.newpixNumber<20)bots-=2;
		var botCastles=bot.totalCastlesBuilt*bots;
		var thresh = Molpy.JudgementDipThreshhold();
		var level = Math.max(0,Math.floor(botCastles/thresh));
		var countdown = ((level+1)*thresh - botCastles);
		countdown/=(bot.buildN()*bot.amount*bot.amount);
		if(Molpy.Got('Doublepost'))countdown/=2;
		countdown/=Molpy.globalCastleMult; //this is a bit approximate because of its rounding, but close enough for this, hopefully
		if(Molpy.Boosts['Coma Molpy Style'].power)
		{
			level=Math.floor(level/2);
		}
		
		if(level>3)
		{
			if(Molpy.Got('Time Travel') && 
				!(Molpy.Got('Overcompensating')||Molpy.Got('Doublepost')))
			{
				Molpy.UnlockBoost('Summon Knights Temporal');
			}
			if(Molpy.SandTools['Bag'].amount>Molpy.npbDoubleThreshhold)
			{
				Molpy.UnlockBoost('Bag Burning');
			}
		}
		if(level>4)
		{
			Molpy.Boosts['Ninja Assistants'].department=1;
		}
		if(level>5)
		{
			Molpy.Boosts['Minigun'].department=1;
		}
		if(level>6)
		{
				Molpy.Boosts['Stacked'].department=1;
		}
		if(level>7)
		{
			if(Molpy.Got('Minigun'))
				Molpy.Boosts['Big Splash'].department=1;
		}
		if(level>8)
		{
			if(Molpy.Got('Stacked'))
				Molpy.Boosts['Irregular Rivers'].department=1;
		}
		if(level>12)
		{
			if(Molpy.Got('Big Splash'))
				Molpy.Boosts['NewPixBot Navigation Code'].department=1;
		}
		if(level>30)
		{
			if(Molpy.Got('Flux Turbine'))
			{
				Molpy.Boosts['NewPixBot Navigation Code'].department=1;
				Molpy.Boosts['NewPixBot Navigation Code'].sandPrice='33K';
				Molpy.Boosts['NewPixBot Navigation Code'].castlePrice=7400;
			}
		}
		return [level,Math.ceil(countdown)];
	}
	new Molpy.Badge({name:'Judgement Dip',
		desc:function()
		{
			if(Molpy.Boosts['NewPixBot Navigation Code'].power) return 'The Bots have been foiled by altered navigation code';
			var j=Molpy.judgeLevel-1;
			if(j<1) return 'Safe. For now.';
			return 'The NewPixBots destroy ' + Molpify(j) + ' Castle'+(j==1?'':'s')+' each per mNP';			
		}
		,vis:3,icon:'judgementdip',className:'alert',classChange:function(){return Molpy.CheckJudgeClass(this,1,'alert');}});
	new Molpy.Badge({name:'Fast Forward',desc:'Travel Back to the Future',vis:1});
	new Molpy.Badge({name:'And Back',desc:'Return to the Past',vis:1});
	new Molpy.Badge({name:'Primer',desc:'Travel through Time 10 Times',vis:1});
	new Molpy.Badge({name:'Wimey',desc:'Travel through Time 40 Times',vis:1});
	new Molpy.Badge({name:'Hot Tub',desc:'Travel through Time 160 Times',vis:1});
	new Molpy.Badge({name:"Dude, Where's my DeLorean?",desc:'Travel through Time 640 Times',vis:2});
	new Molpy.Badge({name:'Use Your Leopard',desc:'Get a click by using your leopard to simulate reloading the page'});
	new Molpy.Badge({name:'Badge Not Found',desc:'Description Not Found'});
	new Molpy.Badge({name:'Fractals Forever',desc:'Reach Fractal Level 60, and Fractal Sandcastles will be retained if you Molpy Down.'});
	new Molpy.Badge({name:'Recursion',
		desc:function(){return 'Yo Dawg, we heard you earned '+Molpify(DeMolpify('50G'),0,!Molpy.showStats)+' Sand by clicking...';}
		});
	new Molpy.Badge({name:'Big Spender',
		desc:function(){return 'Spend '+Molpify(DeMolpify('200M'),0,!Molpy.showStats)+' Castles total';}
		});
	new Molpy.Badge({name:'Valued Customer',
		desc:function(){return 'Spend '+Molpify(DeMolpify('80G'),0,!Molpy.showStats)+' Castles total';}
		});
	new Molpy.Badge({name:'Beachscaper',desc:'Have 200 Sand Tools'});
	new Molpy.Badge({name:'Beachmover',desc:'Have 100 Castle Tools'});
	new Molpy.Badge({name:'Better This Way',desc:'Purchase 50 Boosts'});
	new Molpy.Badge({name:'Recursion ',desc:'To Earn Recursion, you must first earn Recursion'});
	new Molpy.Badge({name:'Beachomancer',desc:'Have 1000 Sand Tools'});
	new Molpy.Badge({name:'Beachineer',desc:'Have 500 Castle Tools'});
	new Molpy.Badge({name:'Glass Factory',desc:'Have 80M sand'});
	new Molpy.Badge({name:'Glassblower',desc:'Make a Glass Block',vis:2});
	new Molpy.Badge({name:'Ninja Pact',desc:'Have a ninja stealth streak over 4K'});
	new Molpy.Badge({name:'Ninja Unity',desc:'Have a ninja stealth streak over 4M'});
	new Molpy.Badge({name:'Unreachable?', desc:'Build a total of 2T Castles. (I GUESS <b>SUPPOSE <i>MAYBE</i></b> IT WILL BE AN ISLAND <b>AGAIN</b>.))',vis:1});
	new Molpy.Badge({name:'Flung',desc:'Have 50 Trebuchets'});
}
		
Molpy.CheckBuyUnlocks=function()
{
	var me=Molpy.SandTools['Bucket'];
	if(me.amount>=1)Molpy.UnlockBoost('Bigger Buckets');
	if(me.amount>=4)Molpy.UnlockBoost('Huge Buckets');
	if(me.amount>=Molpy.npbDoubleThreshhold)Molpy.UnlockBoost('Carrybot');
	if(me.amount>=30)Molpy.UnlockBoost('Buccaneer');
	if(me.amount>=50)Molpy.UnlockBoost('Bucket Brigade');
	if(me.amount>=100&&Molpy.Earned('Flung'))Molpy.UnlockBoost('Flying Buckets');
	
	me=Molpy.SandTools['Cuegan'];
	if(me.amount>=1)Molpy.UnlockBoost('Helping Hand');
	if(me.amount>=4)Molpy.UnlockBoost('Cooperation');
	if(me.amount>=8)Molpy.UnlockBoost('Megball');
	if(me.amount>=Molpy.npbDoubleThreshhold)Molpy.UnlockBoost('Stickbot');
	if(me.amount>=40)Molpy.UnlockBoost('The Forty');
	if(me.amount>=100&&Molpy.Earned('Flung'))Molpy.UnlockBoost('Human Cannonball');
	
	me=Molpy.SandTools['Flag'];
	if(me.amount>=1)Molpy.UnlockBoost('Flag Bearer');
	if(me.amount>=2)Molpy.UnlockBoost('War Banner');
	if(me.amount>=6)Molpy.UnlockBoost('Magic Mountain');
	if(me.amount>=Molpy.npbDoubleThreshhold)Molpy.UnlockBoost('Standardbot');
	if(me.amount>=25)Molpy.UnlockBoost('Chequered Flag');
	if(me.amount>=40)Molpy.UnlockBoost('Skull and Crossbones');
	if(me.amount>=100&&Molpy.Earned('Flung'))Molpy.UnlockBoost('Fly the Flag');
	
	me=Molpy.SandTools['Ladder'];
	if(me.amount>=1)Molpy.UnlockBoost('Extension Ladder');
	if(me.amount>=Molpy.npbDoubleThreshhold)Molpy.UnlockBoost('Climbbot');
	if(me.amount>=25)Molpy.UnlockBoost('Broken Rung');
	if(me.amount>=100&&Molpy.Earned('Flung'))Molpy.UnlockBoost('Up Up and Away');
	
	me=Molpy.CastleTools['NewPixBot'];
	if(me.amount>=3)Molpy.UnlockBoost('Busy Bot');
	if(me.amount>=8)Molpy.UnlockBoost('Robot Efficiency');
	if(me.amount>=Molpy.npbDoubleThreshhold&&Molpy.Got('Robot Efficiency'))Molpy.UnlockBoost('Recursivebot');
	if(me.amount>=17)Molpy.UnlockBoost('HAL-0-Kitty');
	if(me.amount>=22 && Molpy.Got('Department of Redundancy Department'))Molpy.UnlockBoost('Factory Automation');
	if(Molpy.Got('Factory Automation'))
	{
		Molpy.Boosts['Blast Furnace'].department=1;
	}
	 
	me=Molpy.CastleTools['Trebuchet'];
	if(me.amount>=1)Molpy.UnlockBoost('Spring Fling');
	if(me.amount>=2)Molpy.UnlockBoost('Trebuchet Pong');				
	if(me.amount>=5)Molpy.UnlockBoost('Varied Ammo');	
	if(me.amount>=Molpy.npbDoubleThreshhold)Molpy.UnlockBoost('Flingbot');				
	if(me.amount>=20)Molpy.UnlockBoost('Throw Your Toys');	
	if(me.amount>=50)Molpy.EarnBadge('Flung');	
	
	me=Molpy.CastleTools['Scaffold'];
	if(me.amount>=2)Molpy.UnlockBoost('Precise Placement');
	if(me.amount>=4)Molpy.UnlockBoost('Level Up!');
	if(me.amount>=Molpy.npbDoubleThreshhold)Molpy.UnlockBoost('Propbot');
	if(me.amount>=20)Molpy.UnlockBoost('Balancing Act');
	
	me=Molpy.CastleTools['Wave'];
	if(me.amount>=2)Molpy.UnlockBoost('Swell');
	if(me.amount>=Molpy.npbDoubleThreshhold)Molpy.UnlockBoost('Surfbot');
	if(me.amount>=30)Molpy.UnlockBoost('Swim Between the Flags');
	
	me=Molpy.SandTools['Bag'];
	if(me.amount>=2)Molpy.UnlockBoost('Embaggening');
	if(me.amount>=Molpy.npbDoubleThreshhold)Molpy.UnlockBoost('Luggagebot');
	if(me.amount>=30)Molpy.UnlockBoost('Bag Puns');
	if(me.amount>=100&&Molpy.Earned('Flung'))Molpy.UnlockBoost('Air Drop');
	var you=me;
	me = Molpy.CastleTools['River'];
	if(me.amount&&you.amount)Molpy.UnlockBoost('Sandbag');
	if(me.amount>=Molpy.npbDoubleThreshhold)Molpy.UnlockBoost('Smallbot');
	
	if(Molpy.Earned('Fractals Forever')&& !Molpy.Got('Fractal Sandcastles'))
	{
		Molpy.UnlockBoost('Fractal Sandcastles');	
		Molpy.Boosts['Fractal Sandcastles'].power=0;	
		Molpy.Boosts['Fractal Sandcastles'].bought=1; //woo freebie!
		Molpy.boostRepaint=1;
		Molpy.recalculateDig=1;
		Molpy.BoostsOwned++;
	}	
	
	Molpy.Boosts[Molpy.IKEA].startPower=0.4;
	if(Molpy.castlesSpent>200000000)
	{
		Molpy.EarnBadge('Big Spender');
		Molpy.Boosts[Molpy.IKEA].startPower=0.5;
	}
	if(Molpy.castlesSpent>80000000000)
	{
		Molpy.EarnBadge('Valued Customer');
		Molpy.Boosts[Molpy.IKEA].startPower=0.6;
	}
	Molpy.Boosts[Molpy.IKEA].startCountdown=5;
	if(Molpy.Got('Late Closing Hours'))
	{
		Molpy.Boosts[Molpy.IKEA].startCountdown=10;
	}
	
	if(Molpy.BadgesOwned>=69)
	{
		Molpy.UnlockBoost('Ch*rpies');
	}
	
	if(Molpy.SandToolsOwned>=200)Molpy.EarnBadge('Beachscaper');
	if(Molpy.CastleToolsOwned>=100)Molpy.EarnBadge('Beachmover');
	if(Molpy.SandToolsOwned>=1000)Molpy.EarnBadge('Beachomancer');
	if(Molpy.CastleToolsOwned>=500)Molpy.EarnBadge('Beachineer');
	if(Molpy.BoostsOwned>=50)Molpy.EarnBadge('Better This Way');
	
	if(Molpy.Got('Ninja Builder')&&Molpy.Boosts['Glass Block Storage'].power>10)
		Molpy.UnlockBoost('Glass Jaw');
	
	if(Molpy.Got('Swim Between the Flags'))
	{
		Molpy.Boosts['Castle Crusher'].department=1;
	}
	if(Molpy.Earned('Ninja Omnipresence') && Molpy.Got('Active Ninja'))
	{
		Molpy.Boosts['Ninja League'].department=1;
	}
	if(Molpy.Earned('Ninja Pact') && Molpy.Got('Ninja League'))
	{
		Molpy.Boosts['Ninja Legion'].department=1;
	}
	
	if(Molpy.redactedClicks>=554 && (Molpy.Got('Overcompensating') || Molpy.Got('Doublepost')))
	{
		Molpy.UnlockBoost('Redundant Redundance Supply of Redundancy');
	}else{
		Molpy.LockBoost('Redundant Redundance Supply of Redundancy'); //prevent use in shortpix!
	}
	if(Molpy.redactedClicks>=320 && (Molpy.Got('Overcompensating') || Molpy.Got('Doublepost')))
	{
		Molpy.Boosts['Redunception'].department=1;
	}else{
		Molpy.LockBoost('Redunception'); //prevent use in shortpix!
		Molpy.Boosts['Redunception'].department=0;
	}
	
	if(Molpy.Got('Air Drop'))Molpy.Boosts['Schizoblitz'].department=1;
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
	if(c>=50000000000){
		Molpy.EarnBadge('Recursion');
		Molpy.EarnBadge('Recursion ');
		Molpy.UnlockBoost('Fractal Sandcastles');
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
