'use strict';
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

	new Molpy.SandTool({name:'Bucket',commonName:'bucket|buckets|poured',desc:'Pours a little sand',price:8,
		spmNP:function(){
			var baserate =0.1 + Molpy.Got('Bigger Buckets')*0.1;
			var mult=1;
			if(Molpy.Got('Huge Buckets'))mult*=2;
			if(Molpy.Got('Trebuchet Pong'))mult*=Math.pow(1.5,Math.floor(Molpy.CastleTools['Trebuchet'].amount/2));
			if(Molpy.Got('Carrybot'))mult*=4;
			if(Molpy.Got('Buccaneer'))mult*=2;
			if(Molpy.Got('Flying Buckets'))mult*=Molpy.CastleTools['Trebuchet'].amount;
			if(Molpy.Got('Glass Ceiling 0'))mult*=Molpy.GlassCeilingMult();
			return mult*baserate;			
		},
		gpmNP:function()
		{
			var baseval = 0.001;
			var mult=1;
			if(Molpy.Got('Bucking the Trend'))mult*=2;
			if(Molpy.Got('Crystal Well'))mult*=10;
			return baseval*mult;
		},
		nextThreshold:1
	});
	
	new Molpy.SandTool({name:'Cuegan',commonName:'cuegan|cuegans|tossed',desc:'Megan and Cueball toss in a bit of extra sand',price:50,
		spmNP:function(){
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
			if(Molpy.Got('Glass Ceiling 2'))mult*=Molpy.GlassCeilingMult();
			return baserate*mult;
		},
		gpmNP:function()
		{
			var baseval = 0.003;
			var mult=1;
			if(Molpy.Got('Glass Spades'))mult*=2;
			if(Molpy.Got('Statuesque'))mult*=10;
			return baseval*mult;
		},
		nextThreshold:2
	});
	
	new Molpy.SandTool({name:'Flag',commonName:'flag|flags|marked',desc:'Marks out even more sand',price:420,
	spmNP:function()
		{
			var baserate = 8+Molpy.Got('Flag Bearer')*2;
			var mult = 1;
			if(Molpy.Got('Magic Mountain'))mult*=2.5;
			if(Molpy.Got('Standardbot'))mult*=4;
			if(Molpy.Got('Balancing Act')) mult*=Math.pow(1.05,Molpy.CastleTools['Scaffold'].amount);
			if(Molpy.Got('SBTF'))
			{
				if(Molpy.newpixNumber%2==0)//even
				{
					mult/=Math.max(1,Molpy.CastleTools['Wave'].amount);
				}else{//odd
					mult*=Molpy.CastleTools['Wave'].amount;
				}
			}
			if(Molpy.Got('Fly the Flag'))mult*=10*Molpy.CastleTools['Trebuchet'].amount;
			if(Molpy.Got('Glass Ceiling '+4))mult*=Molpy.GlassCeilingMult();
			return baserate*mult;
		},
		gpmNP:function()
		{
			var baseval = 0.007;
			var mult=1;
			if(Molpy.Got('Flag in the Window'))mult*=4;
			if(Molpy.Got('Crystal Wind'))mult*=5;
			return baseval*mult;
		},
		nextThreshold:4
	});
	
	new Molpy.SandTool({name:'Ladder',commonName:'ladder|ladders|reached',desc:'Reaches higher sand',price:1700,
		spmNP:function()
		{
			var baserate = 54+Molpy.Got('Extension Ladder')*18;
			var mult = 1;
			if(Molpy.Got('Level Up!'))mult*=2;
			if(Molpy.Got('Climbbot'))mult*=4;
			if(Molpy.Got('Broken Rung'))
			{
				var min =Infinity;
				for(var i in Molpy.SandToolsById)
				{
					if(!+i||Molpy.SandToolsById[i-1].bought>=Molpy.SandToolsById[i-1].nextThreshold)
						min=Math.min(min,Molpy.SandToolsById[i].amount);
				}
				for(var i in Molpy.CastleToolsById)
				{
					if(!+i||Molpy.CastleToolsById[i-1].bought>=Molpy.CastleToolsById[i-1].nextThreshold)
						min=Math.min(min,Molpy.CastleToolsById[i].amount);
				}
				mult*=min;
			}
			if(Molpy.Got('Up Up and Away'))mult*=10*Molpy.CastleTools['Trebuchet'].amount;
			if(Molpy.Got('Glass Ceiling 6'))mult*=Molpy.GlassCeilingMult();
			if(Molpy.Got('Ninja Climber'))mult*=Molpy.ninjaStealth;
			return baserate*mult;
		},
		gpmNP:function()
		{
			var baseval = 0.015;
			var mult=1;
			if(Molpy.Got('Crystal Peak'))mult*=12;
			return baseval*mult;
		},
		nextThreshold:8
	});
	
	new Molpy.SandTool({name:'Bag',commonName:'bag|bags|carried',desc:'Carries sand from far away',price:12000,
		spmNP:function()
		{
			var baserate = 600;
			var mult = 1;
			if(Molpy.Got('Embaggening')&&Molpy.SandTools['Cuegan'].amount>14)
				mult*=Math.pow(1.02,Molpy.SandTools['Cuegan'].amount-14);
			if(Molpy.Got('Sandbag'))
				mult*=Math.pow(1.05,Molpy.CastleTools['River'].amount);
			if(Molpy.Got('Luggagebot'))mult*=4;
			if(Molpy.Got('Bag Puns'))mult*=2;
			if(Molpy.Got('Air Drop'))mult*=5;
			if(Molpy.Got('Glass Ceiling 8'))mult*=Molpy.GlassCeilingMult();
			return baserate*mult;
		},
		gpmNP:function()
		{
			var baseval = 0.031;
			var mult=1;
			if(Molpy.Got('Cupholder'))mult*=8;
			return baseval*mult;
		},
		nextThreshold:6000
	});
	
	new Molpy.SandTool({name:'LaPetite',commonName:'LaPetite|LaPetites|rescued',desc:'Rescues sand via raft',price:DeMolpify('2WQ'),
		spmNP:function(){
			var baserate =2e137;
			var mult=1;
			if(Molpy.Got('Glass Ceiling 10'))mult*=Molpy.GlassCeilingMult();
			if(Molpy.Got('Frenchbot'))
				mult*=1e42;
			if(Molpy.Got('Bacon'))
				mult*=Math.pow(1.03,Molpy.CastleTools['NewPixBot'].amount);
			return mult*baserate;			
		},
		gpmNP:function()
		{
			var baseval = 0.063;
			var mult=1;
			if(Molpy.Got('Tiny Glasses'))mult*=9;
			return baseval*mult;
		},
		nextThreshold:1
	});
}	

Molpy.DefineCastleTools=function()
{
	new Molpy.CastleTool({name:'NewPixBot',commonName:'newpixbot|newpixbots||automated',desc:'Automates castles after the ONG\n(if not ninja\'d)',price0:1,price1:0,destroyC:0,
		buildC:function()
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
			baseval*=Molpy.LogicastleMult();
			if(Molpy.Got('Glass Ceiling 1'))baseval*=Molpy.GlassCeilingMult();
			if(Molpy.Boosts['NewPixBot Navigation Code'].power)
				baseval=baseval*.001;
			if(Molpy.Got('Frenchbot'))
				baseval*=1e210;
			if(Molpy.Got('Bacon'))
				baseval*= 10;
			return Math.floor(baseval);
		},destroyG:0,
		buildG:function()
		{
			var baseval=2;
			if(Molpy.Got('Bacon'))
				baseval*= 10;
			if(Molpy.Got('Bottle Battle'))
				baseval*= 3;
			return baseval;
		},
		nextThreshold:1
	});
	
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
		
	new Molpy.CastleTool({name:'Trebuchet',commonName:'trebuchet|trebuchets|flung|formed',desc:'Flings some castles, forming more.',price0:13,price1:1,
		destroyC:function(){
			if(Molpy.Got('War Banner'))return 1;
			else return 2;
		},
		buildC:function()
		{
			var baseval=4;
			if(Molpy.Got('Spring Fling'))baseval++;
			if(Molpy.Got('Varied Ammo'))for(var i in Molpy.CastleTools) if(Molpy.CastleTools[i].amount>1)baseval++;
			if(Molpy.Got('Throw Your Toys')) baseval+=Molpy.SandTools['Bucket'].amount+Molpy.SandTools['Flag'].amount;
			if(Molpy.Got('Flingbot'))baseval*=4;
			if(Molpy.Got('Minigun')) baseval*=Molpy.CastleTools['NewPixBot'].amount;
			baseval*=Molpy.LogicastleMult();
			
			var mult = Math.pow(10,Molpy.Got('Flying Buckets')+Molpy.Got('Human Cannonball')
				+Molpy.Got('Fly the Flag')+Molpy.Got('Up Up and Away')+Molpy.Got('Air Drop'));				
			if(Molpy.Got('Air Drop'))mult*=5;
			if(Molpy.Got('Glass Ceiling 3'))mult*=Molpy.GlassCeilingMult();
			
			return Math.floor(baseval*mult);
		},
		destroyG:1,
		buildG:function(){
			var baseval=7;
			var mult=1;
			if(Molpy.Got('Stained Glass Launcher'))mult*=Molpy.GlassCeilingCount();
			return baseval*mult;
		},
		nextThreshold:2
	});
		
	new Molpy.CastleTool({name:'Scaffold',commonName:'scaffold|scaffolds|squished|raised',desc:'Squishes some castles, raising a place to put more.',price0:60,price1:100,
		destroyC:function()
		{
			var baseval = 6;	
			if(Molpy.Got('Balancing Act')) baseval*=Math.pow(1.05,Molpy.SandTools['Flag'].amount);			
			if(Molpy.Got('Precise Placement')) baseval-=Math.floor(Molpy.SandTools['Ladder'].amount*0.5);
			return Math.max(0,Math.floor(baseval));
		},
		buildC:function()
		{
			var baseval = 22;
			if(Molpy.Got('Propbot'))baseval*=4;
			if(Molpy.Got('Stacked')) baseval*=Molpy.CastleTools['NewPixBot'].amount;
			if(Molpy.Got('Balancing Act')) baseval*=Math.pow(1.05,Molpy.SandTools['Flag'].amount);
			baseval*=Molpy.LogicastleMult();
			if(Molpy.Got('Glass Ceiling 5'))baseval*=Molpy.GlassCeilingMult();
			return Math.floor(baseval);
		},destroyG:6,buildG:function()
		{
			var baseval=21;
			if(Molpy.Got('Leggy'))
				baseval*=8;
			return baseval;
		},
		nextThreshold:4
	});
		
	new Molpy.CastleTool({name:'Wave',commonName:'wave|waves|swept|deposited',desc:'Sweeps away some castles, depositing more in their place.',price0:300,price1:80,
		destroyC:function(next)
		{
			next=next||0;
			var baseval = 24;
			if(Molpy.Got('SBTF'))
			{
				if(Molpy.newpixNumber%2==1-next)//odd
				{
					baseval=Math.floor(baseval*Math.pow(1.06,Molpy.SandTools['Flag'].amount));
				}
			}
			
			if(Molpy.Got('Erosion'))
			{
				baseval-=Molpy.CastleTools['Wave'].totalCastlesWasted*0.2;
				baseval-= Molpy.CastleTools['River'].bought*2;
			}
			baseval=Math.floor(Math.max(baseval,0));
			return baseval;
		},
		buildC:function(next)
		{
			next=next||0;
			var baseval= 111;
			baseval+=Molpy.Got('Swell')*19;			
			if(Molpy.Got('Surfbot'))baseval*=4;
			if(Molpy.Got('Big Splash')) baseval*=Molpy.CastleTools['NewPixBot'].amount;
			baseval*=Molpy.LogicastleMult();
			if(Molpy.Got('SBTF'))
			{
				if(Molpy.newpixNumber%2==next)//even
				{
					baseval=baseval*Math.pow(1.06,Molpy.SandTools['Flag'].amount);
				}
			}
			if(Molpy.Got('Glass Ceiling 7'))baseval*=Molpy.GlassCeilingMult();
			return Math.floor(baseval);
		},
		nextThreshold:8,destroyG:19,buildG:function()
		{
			var baseval=55;
			if(Molpy.Got('Clear Wash'))
				baseval*= 10;
			return baseval;
		},
		destroyFunction:function()
		{
		if(this.totalCastlesDestroyed>=2000) Molpy.UnlockBoost('Erosion');
		if(this.totalCastlesDestroyed>=500) Molpy.EarnBadge('Wipeout');
		}
	});
		
	new Molpy.CastleTool({name:'River',commonName:'river|rivers|washed|left',desc:'Washes away many castles, but leaves many more new ones.',price0:1800,price1:1520,
		destroyC:function()
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
		buildC:function()
		{
			var baseval=690;	
			baseval*=Molpy.LogicastleMult();
			var mult=1;
			if(Molpy.Got('Sandbag'))
				mult*=Math.pow(1.05,Molpy.SandTools['Bag'].amount);
			if(Molpy.Got('Smallbot'))mult*=4;
			if(Molpy.Got('Irregular Rivers')) mult*=Molpy.CastleTools['NewPixBot'].amount;
			if(Molpy.Got('Glass Ceiling 9'))mult*=Molpy.GlassCeilingMult();
			return Math.floor(baseval*mult);
		}
		,destroyG:52,buildG:function()
		{
			var baseval=134;
			if(Molpy.Got('Crystal Streams'))
				baseval*= 12;
			return baseval;
		}
		,nextThreshold:1000
	});
	
	new Molpy.CastleTool({name:'Beanie Builder',commonName:'beanie builder|beanie builders|escavated|recreated',desc:'Excavate some castles and recreate copies elsewhere.',
		price0:DeMolpify('40Q'),price1:DeMolpify('60Q'),
		destroyC:function(){
			return DeMolpify('1Q');
		},
		buildC:function(){
			var baseval=DeMolpify('10Q');
			var mult=1;
			if(Molpy.Got('Glass Ceiling 11'))mult*=Molpy.GlassCeilingMult();
			
			return Math.floor(baseval*mult);
		}
		,destroyG:115,buildG:function()
		{
			var baseval=281;
			if(Molpy.Got('Super Visor'))
				baseval*= 15;
			if(Molpy.Got('Crystal Helm'))
				baseval*= 5;
			return baseval;
		}
		,nextThreshold:1
	});
}
	
Molpy.DefineBoosts=function()
{
	
	//only add to the end!
	new Molpy.Boost({name:'Bigger Buckets',desc:'Increases sand rate of buckets and clicks',sand:500,castles:0,stats:'Adds 0.1 S/mNP to each Bucket, before multipliers',icon:'biggerbuckets'});
	new Molpy.Boost({name:'Huge Buckets',desc:'Doubles sand rate of buckets and clicks',sand:800,castles:2,icon:'hugebuckets'});
	new Molpy.Boost({name:'Helping Hand',desc:'Increases sand rate of Cuegan',sand:500,castles:2,stats:'Adds 0.2 S/mNP to each Cuegan, before multipliers',icon:'helpinghand'});
	new Molpy.Boost({name:'Cooperation',desc:'Increases sand rate of Cuegan 5% per pair of buckets',sand:2000,castles:4,icon:'cooperation',
		stats:function()
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
	new Molpy.Boost({name:'Trebuchet Pong',desc:'Increases sand rate of buckets 50% per pair of trebuchets',sand:3000,castles:6,icon:'trebpong'});
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
	new Molpy.Boost({name:'Ninja Builder',desc:'When increasing ninja stealth streak, builds that many castles',
		sand:4000,castles:35,
		stats:function()
		{
			if(Molpy.Got('Ninja Builder')) 
				return 'Will build '+ Molpy.CalcStealthBuild(1)+ ' Castles unless you destealth ninjas';
			return 'Ninja Stealth increases the first time you click within a NewPix after NewPixBots activate. It will reset if you click before NewPixBots activate, or don\'t click before the next ONG.'	
			
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
		,icon:'blitzing',className:'alert'});
	new Molpy.Boost({name:'Kitnip',desc:Molpy.redactedWords+' come more often and stay longer',
		sand:33221,castles:63,
	icon:'kitnip'});
	new Molpy.Boost({name:'Department of Redundancy Department',aka:'DoRD',desc:Molpy.redactedWords
		+' sometimes unlock special boosts',sand:23456,castles:78,icon:'department',group:'hpt'});
	new Molpy.Boost({name:'Raise the Flag',desc:'Each Flag+Ladder pair gives clicking an extra +50 sand',
		sand:'85K',castles:95,icon:'raisetheflag'});
	new Molpy.Boost({name:'Hand it Up',desc:'Each Ladder+Bag pair gives clicking an extra +500 sand',
		sand:'570K',castles:170,department:1});
	new Molpy.Boost({name:'Riverish',desc:'Rivers destroy less castles the more you click',
		sand:'82K',castles:290,icon:'riverish',department:1,
		buyFunction:function()
		{
			this.power=Molpy.beachClicks;
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
		},icon:'doubleornothing',className:'action',lockFunction:function(){
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
			Molpy.Build(Molpy.castles,1); 
		}else{
			Molpy.Destroy(Molpy.castles);
			Molpy.Boosts['Double or Nothing'].power=Math.floor(Molpy.Boosts['Double or Nothing'].power/2);
		}
		Molpy.LockBoost('Double or Nothing');
	}
	new Molpy.Boost({name:'Grapevine',desc:'Increases sand dig rate by 2% per badge earned',sand:'25K',castles:25,icon:'grapevine',department:1});
	new Molpy.Boost({name:'Affordable Swedish Home Furniture',aka:'ASHF',desc: function(me){return Molpify(me.power*100,1)+'% off all items for '
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
		}
		,startPower:0.4,startCountdown:4,group:'hpt',department:1,className:'alert'});
	
	new Molpy.Boost({name:'Overcompensating',desc: function(me){
		return 'During LongPix, Sand Tools dig '+Molpify(me.startPower*100,1)+'% extra sand'}
		,sand:987645,castles:321,icon:'overcompensating',startPower:1.5});
	new Molpy.Boost({name:'Doublepost',desc:'During LongPix, Castle Tools activate a second time',
		sand:'650K',castles:4000,icon:'doublepost'});
	new Molpy.Boost({name:'Coma Molpy Style',desc: 
		function(me)
		{ 
			return (me.power? '':'When active, ') + 'Castle Tools do not activate and ninjas stay stealthed <br><input type="Button" onclick="Molpy.ComaMolpyStyleToggle()" value="'+(me.power? 'Dea':'A')+'ctivate"></input>';
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
		"Coma Molpy Style"
	]
	}
	var cmsline=0;
	Molpy.ComaMolpyStyleToggle=function()
	{
		var me=Molpy.Boosts['Coma Molpy Style'];

		Molpy.Notify(cms[cmsline]);
		cmsline++;
		if(cmsline>=cms.length)
		{
			cmsline=0;
			if(!me.bought)
			{
				Molpy.RewardRedacted();
				me.buy();
			}
		}
		if(!me.bought)
			return;
		
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
		Molpy.Boosts['Coma Molpy Style'].hoverOnCounter=1;
		Molpy.recalculateDig=1;
	}
	new Molpy.Boost({name:'Time Travel',desc: 
		function(me)
		{
			var price=Molpy.TimeTravelPrice();
			return 'Pay ' + Molpify(price,2) + ' Castles to move <input type="Button" onclick="Molpy.TimeTravel('+(-me.power)+');" value="backwards"></input> or <input type="Button" onclick="Molpy.TimeTravel('+me.power+');" value="forwards"></input> '+
			Molpify(me.power)+' NP in Time';
		}
		,sand:1000,castles:30,className:'action',group:'chron',
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
		if(price>Molpy.castles)
			Molpy.Boosts['Flux Capacitor'].department=1;
		return price;
	}
	
	Molpy.TimeTravel=function(NP)
	{		
		if(Molpy.TTT(Molpy.newpixNumber+NP,1))
		{
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
					var npb=Molpy.CastleTools['NewPixBot'];
					if(!Molpy.Boosts['NewPixBot Navigation Code'].power && npb.temp<30)
					{
						Molpy.Notify('You do not arrive alone');
						npb.amount++;
						npb.temp++;
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
	//targeted time travel!
	Molpy.TTT=function(np,factor,chips)
	{
		np = Math.floor(np);
		chips=chips||0;
		var price=Molpy.TimeTravelPrice()*factor;
		if(np <1)
		{
			Molpy.Notify('Heretic!');
			Molpy.Notify('There is nothing before time.');
			return;
		}
		if(np >Molpy.highestNPvisited)
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
			if(!Molpy.HasGlassChips(chips))
			{
				Molpy.Notify('Great Scott, there\'s a hole in the glass tank!');
				return;
			}
			Molpy.SpendGlassChips(chips);
			Molpy.SpendCastles(price);
			Molpy.newpixNumber=np;			
			Molpy.HandlePeriods();
			Molpy.UpdateBeach();
			Molpy.Notify('Time Travel successful! Welcome to NewPix '+Molpify(Molpy.newpixNumber));
			Molpy.timeTravels++;
			Molpy.Boosts['Time Travel'].hoverOnCounter=1;
			return 1;
		}else
		{
			Molpy.Notify('<i>Castles</i>? Where we\'re going we do need... <i>castles</i>.');
		}
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
			while(i--)
			{
				var sand = 2000000*Math.pow(100000,i);
				costs+=Molpify(sand);
				if(i)costs+=', then ';
			}
			return 'Level: '+Molpify(me.power+1,3)+'<br>When NewPixBots activate, so does the Department of Redundancy Department at a cost of '+costs+' Sand. Will activate less times if you don\'t have 20 bots per activation level.';
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
			return 'Uses '+Molpify(2000000)+' Sand to warm up, then makes Castles at a cost of ' + Molpify(blastFactor,1) + ' each';
		}
		,icon:'blastfurnace',group:'hpt'});
	
	new Molpy.Boost({name:'Sandbag',desc:'Bags and Rivers give each other a 5% increase to Sand digging, Castle building, and Castle destruction',sand:'1.4M',castles:'21K'});
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
	new Molpy.Boost({name:'Flux Capacitor',desc:'It makes Time Travel possibler!',sand:88,castles:88,group:'chron'});
	new Molpy.Boost({name:'Bag Burning',desc:'Bags help counteract NewPixBots',sand:'50M',castles:86,
		stats:function()
		{
			var str = 'Half of Bags beyond the 14th owned give a 40% increase to Judgement Dip threshhold.';
			if(Molpy.SandTools['Bag'].amount>Molpy.npbDoubleThreshhold)
			{
				var amount = Math.pow(1.4,Math.max(0,(Molpy.SandTools['Bag'].amount-Molpy.npbDoubleThreshhold)/2))-1;
				amount=Molpify(amount*100,0,1);
				str+='<br>Currently '+amount+'%';
			}
			str+='<br>If the Judgement Dip level (apart from the Bag reduction) is greater than '+Molpify(Math.pow(2,Molpy.Boosts['Bag Burning'].power)+6,1,1)+', Bags will be burned to increase power.';
			return str;
		}
		,lockFunction:function()
		{
			this.power++;
		}
		,buyFunction:function()
		{
			Molpy.BurnBags(this.power+1);
		}
		,icon:'bagburning'});
	new Molpy.Boost({name:'Chromatic Heresy',desc:
		function(me)
		{
			return 'Saturation is '+(me.power?'':'not ')+'allowed.<br><input type="Button" value="Click" onclick="Molpy.ChromaticHeresyToggle()"></input> to toggle.';
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
	new Molpy.Boost({name:'Flux Turbine',desc:'Castles lost via Molpy Down or Temporal Rift increase the rate of building new Castles',
		sand:1985,castles:121,
		stats:function()
		{
			if(!Molpy.Got('Flux Turbine')) return 'All castle gains are increased by 2% per natural logarithm of castles wiped by Molpy Down, except refunds which are not increased.';
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
		var npb=Molpy.CastleTools['NewPixBot'];
		if(npb.temp)
		{
			npb.temp = Math.min(npb.amount,npb.temp);
			npb.amount-=npb.temp;
			Molpy.CastleToolsOwned-=npb.temp;
			npb.refresh();
			Molpy.Notify(npb.temp + ' Temporal Duplicates Destroyed!');
			npb.temp=0;
		}
		Molpy.scrumptiousDonuts=-1;
		nc.hoverOnCounter=1;
		Molpy.recalculateDig=1;
		Molpy.GiveTempBoost('Jamming',1,2000);
	}
	new Molpy.Boost({name:'Jamming',desc:
		function(me)
		{		
			return 'You cannot access NewPixBot Navigation Code for '+Molpify(me.countdown,3)+'mNP';
		},className:'alert',group:'cyb'
		});	
	
	new Molpy.Boost({name:'Blixtnedslag Kattungar, JA!',aka:'BKJ',desc:'Antalet redundanta klickade kattungar läggs till blixtnedslag multiplikator.',sand:'9.8M',castles:888555222,stats:'Additional '+Molpy.redactedWord+' clicks add 20% to the Blitzing multiplier. (Only when you get a Blitzing or Not Lucky reward.) Also causes Blizting to boost Blast Furnace if they overlap.',icon:'bkj',group:'hpt'});
		
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
	new Molpy.Boost({name:'Balancing Act',desc:'Flags and Scaffolds give each other a 5% increase to Sand digging, Castle building, and Castle destruction',sand:'1875K',castles:843700,icon:'balancingact'});
	new Molpy.Boost({name:'Ch*rpies',desc:'Increases sand dig rate by 5% per badge earned',
		sand:6969696969,castles:81818181,icon:'chirpies'});
	new Molpy.Boost({name:'Buccaneer',desc:'Clicks and buckets give double sand',
		sand:'84.7M',castles:7540,icon:'buccaneer'});
	new Molpy.Boost({name:'Bucket Brigade',desc:'Clicks give 1% of sand dig rate per 50 buckets',
		sand:'412M',castles:8001,icon:'bucketbrigade'});
	new Molpy.Boost({name:'Bag Puns',desc:'Doubles Sand rate of Bags. Clicks give 40% more sand for every 5 bags above 25',sand:'1470M',castles:450021,icon:'bagpuns',stats:function(me)
		{
			if(me.power <= 100) return 'Speed is at '+me.power+' out of 100';
			return me.desc;
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
			,"Bagman and Robin"
			,"Bagman Forever"
			,"Bagman Begins"
			,"Bagman: The Dark Nip"
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
			,"Baghouse"
			,"Baggett Halverson"
			,"Bagengers"
			,"Agents of B.A.G."
			,"Bagel"
			,"Cabin in the Bag"
			,"Bagenity"
			,"Bag Suns"
			,"Dr. Horrible's Sing-Along Bag"
			,"Much Abag about Nothing"
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
			,"Bag of Our Fathers"
			,"Go ahead, make my bag!"
			,"We are the Bags. Resistance is futon"
			,"Three Men and a Baggy"
			,"12 Angry Bags"
			,"Bagland"
			,"Bag of The Tentacle"
			,"Full Metal Bag"
			,"The Bag on the River Kwai"
			,"The Bag Sleep"
			,"Bag Business"
			,"Bag Fiction"
			,"Once Upon a Time in Bag"
			,"The Third Bag"
			,"Raging Bag"
			,"Inglorious Bagterds"
			,"Bagzilla"
			,"Bagatar"
			,"Bagtanic"
			,"Clash of the Bags"
			,"For a Bagful of Dollars"
			,"Bill Bag: Vol 1"
			,"Million Dollar Baggy"
			,"Rosemanry's Baggy"
			,"A Streetbag Named Desire"
			,"Bag of Steel"
			,"Pacific Bag"
			,"Bags of Bloodsteel"
			,"Bag for the Holidips"
			,"Knights of Bagassdom"
			,"The Bag Commandments"
			,"Dr. Bag"
			,"From Russia With A Bag"
			,"Goldbag"
			,"Thunderbag"
			,"Bags Only Live Twice"
			,"On Her Majesty's Secret Bag"
			,"Bags Are Forever"
			,"Live and Let Bag"
			,"The Man with the Golden Bag"
			,"The Bag Who Loved Me"
			,"Bagraker"
			,"For Your Bags Only"
			,"Octobaggy"
			,"A View to a Bag"
			,"The Living Baglights"
			,"Licence to Bag"
			,"GoldenBag"
			,"Bag Never Dies"
			,"The Bag is Not Enough"
			,"Die Another Bag"
			,"Bag Royale"
			,"Bag of Solace"
			,"Bagfall"
			,"Bagmember"
			,"Double Bag Seven"
			,"Ocean's Bag"
			,"The Royal Tenenbags"
			,"Bags Wide Shut"
			,"A Bag Day's Night"
			,"The Baggit"
			,"Finnegan's Bag"
			,"One Hundred Bags of Solitude"
			,"Bagstock: 3 Dips Of Cuegan And Megball"
			,"The Sandcastle for Bagladesh"
			,"Jimi Hendrix and Bag of Gypsys: Live at the Sandcastle East"
			,"U2: Sandcastles And Bags"
			,"Neil Young: Bag of Gold"
			,"Divine Bagness"
			,"The Bag Holly Story"
			,"Immortal Sandcastle"
			,"Bag The Line"
			,"Pump Up The Sandcastle (Wait Hard!)"
			,"Phantom of the Sandcastle"
			,"The Bag Violin"
			,"A Little Bag Music"
			,"A Chorus Bag"
			,"My Bag Lady"
			,"My Fair Bag"
			,"Sweeny Todd: The Demon Bagger Of Fleet Street"
			,"The Baggy Horror Sandcastle Show"
			,"Bag# For Experienced Programmers"
			,"Upgrading and Repairing BAGs"
			,"Bag Design for Engineers"
			,"Bag Forms 2.0 Programming"
			,"Human-Bag Interaction"
			,"Steal This Bag Book 4.0"
			,"Visual BAG .NET in Easy Steps"
			,"The Bag Practice of Statistics"
			,"Bagculus"
			,"Security in Bagging"
			,"BAG/IP Protocol Suite"
			,"Linear Bagular"
			,"Accounting: What the Bags Mean"
			,"BAGIX Network Programming"
			,"Object-Oriented Systems Analysis and Design with BAG"
		]
	}
	
	new Molpy.Boost({name:'The Forty',desc:'Cuegan produce 40 times as much sand',sand:40404040,castles:4040,icon:'theforty'});
	new Molpy.Boost({name:'Chequered Flag',desc:'Racing NewPixBots activate 20% sooner',sand:101010101,castles:10101,icon:'cheqflag'});
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
		
	new Molpy.Boost({name:'Blixtnedslag Förmögenhet, JA!',aka:'BFJ',desc:'Not Lucky gets a 20% bonus (non-cumulative) per level of Blixtnedslag Kattungar, JA! It also gets a boost from Blitzing if you get them simultaneously.',sand:111098645321,castles:7777777777,
		stats:function()
		{
			return 'Adds ' + Molpify(20*Molpy.Boosts['BKJ'].power,1)+'% to Not Lucky reward';
		},icon:'bfj',group:'hpt'});
	new Molpy.Boost({name:'VITSSÅGEN, JA!',aka:'VJ',
		desc:function(me)
		{
			if(me.bought==0) return 'This message is dedicated to MajorDouble7 who found this bug and thus will never see this message since it is intended to stop people from magically getting this without buying it';
			return '<input type="Button" onclick="Molpy.PunsawToggle()" value="'+(me.bought==1? 'Start':'Stop')+'"></input> the Puns!'
		},sand:334455667788,castles:999222111000,icon:'vitss',
		stats:function(me)
		{
			if(me.power <= 20) return 'Speed is at '+me.power+' out of 20';
			if(me.power <= 88) return 'Speed is at '+me.power+' out of 88';
			return 'Speed is at '+Molpify(me.power);
		},group:'hpt',className:'toggle'});
	Molpy.PunsawToggle=function()
	{
		Molpy.Boosts['VJ'].bought = (Molpy.Boosts['VJ'].bought==1?2:1);
		Molpy.Boosts['VJ'].hoverOnCounter=1;
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
	Molpy.ChooseShoppingItem=function()
	{
		var donkey=Molpy.Boosts['Shopping Assistant'];
		donkey.power=0;
		var name = prompt('Enter the name of the tool or boost you wish to buy whenever ASHF is active.\nNames are case sensitive.\nLeave blank to disable.\nYour choice is preserved if you reload.',Molpy.shoppingItem||'Bag');
		if(name)
		{
			var item=Molpy.SandTools[name] || Molpy.CastleTools[name];
			if(item)
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
				if(item && !item.bought)
				{
					donkey.power=item.id;
				}
			}
		}
		Molpy.SelectShoppingItem(1)
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
			item.buy();
			Molpy.priceFactor=factor;
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
		if(Math.random()*5<4&&isFinite(Molpy.castlesBuilt))
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
			var cost=Molpify(Molpy.GlassFurnaceSandUse(1),2);
			var str= (me.power?'U':'When active, u')+'ses '+cost+'% of Sand dug to produce '+Molpify(pow,3)+' Glass Chip'+(pow>1?'s':'')+' per NP.<br>';
			
			if(Molpy.Got('Glass Furnace Switching'))
			{
			 str+='Currently '+(me.power?'Dea':'A')+'ctivating.';
			}else{
				str+='<br><input type="Button" value="'+(me.power?'Dea':'A')+'ctivate" onclick="Molpy.SwitchGlassFurnace('+me.power+')"></input>';
			}			
			return str;
		}
		,sand:'80M',castles:'0.5M',icon:'glassfurnace',className:'toggle',group:'hpt'});
	new Molpy.Boost({name:'Glass Furnace Switching',
		desc:function(me)
		{
			return (me.power?'off':'on')+' in '+Molpify(me.countdown,3)+'mNP';
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
		var inc=1;
		if(Molpy.Got('Sand Purifier'))
			inc/=(Molpy.Boosts['Sand Purifier'].power+2)
		if(Molpy.Got('Badgers'))
		{
			inc*=Math.pow(.99,Math.floor(Molpy.BadgesOwned/10));
		}
		return inc;
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
		if(!Molpy.Got('Glass Extruder'))return 1;
		return 1/(Molpy.Boosts['Glass Extruder'].power+2)
	}
	Molpy.CalcGlassUse=function()
	{
		var glassUse=0;
		glassUse+=Molpy.GlassFurnaceSandUse();
		glassUse+=Molpy.GlassBlowerSandUse();		
		return glassUse;
	}
	
	Molpy.HasGlassBlocks=function(num)
	{	
		return Molpy.Boosts['Glass Block Storage'].power >= num;
	}
	Molpy.SpendGlassBlocks=function(num)
	{	
		Molpy.Boosts['Glass Block Storage'].power -= num;
		Molpy.blockAddAmount-=num;
	}
	Molpy.HasGlassChips=function(num)
	{	
		return Molpy.Boosts['Glass Chip Storage'].power >= num;
	}
	Molpy.SpendGlassChips=function(num)
	{	
		Molpy.Boosts['Glass Chip Storage'].power -= num;
		Molpy.chipAddAmount-=num;
	}
	
	new Molpy.Boost({name:'Sand Refinery',desc:
		function(me)
		{		
			var ch = Molpy.Boosts['Glass Chip Storage'];
			var bl = Molpy.Boosts['Glass Block Storage'];
			var str ='';
			if(Molpy.CheckSandRateAvailable(Molpy.SandRefineryIncrement()))
			{
				var useChips=1;
				var afford=1;
				if(ch.power>=3)
				{
					
				}else if(Molpy.HasGlassBlocks(1))
				{
					useChips=0
				}else{
					str+= 'It costs 3 Chips to upgrade the Glass Furnace\'s speed';
					afford=0;
				}
				if(afford)
				{
					var pow=(Molpy.Boosts['Sand Refinery'].power)+2;
					str+= '<br><input type="Button" value="Pay" onclick="Molpy.UpgradeSandRefinery(1)"></input> '
						+(useChips?'3 Chips':'1 Block')+' to upgrade the Glass Furnace to produce '+Molpify(pow,3)
						+' Glass Chip'+(pow>1?'s':'')+' per NP (will use '+Molpify(pow*Molpy.SandRefineryIncrement(),2)+'% of Sand dug).';
				}
					
				if(Molpy.CheckSandRateAvailable(Molpy.SandRefineryIncrement()*20))
				{
					var useChips=1;
					var afford=1;
					if(ch.power>=50)
					{
						
					}else if(Molpy.HasGlassBlocks(18))
					{
						useChips=0
					}else{
						str+= '<br>It costs 50 Chips to upgrade the Glass Furnace\'s speed by 20';
						afford=0;
					}
					if(afford)
					{
						var pow=(Molpy.Boosts['Sand Refinery'].power)+21;
						str+= '<br><input type="Button" value="Pay" onclick="Molpy.UpgradeSandRefinery(20)"></input> '
							+(useChips?'50 Chips':'18 Blocks')+' to upgrade the Glass Furnace to produce '+Molpify(pow,3)
							+' Glass Chips per NP (will use '+Molpify(pow*Molpy.SandRefineryIncrement(),2)+'% of Sand dug).';
					}	
					
					if(Molpy.Boosts['Sand Purifier'].power>200&&Molpy.CheckSandRateAvailable(Molpy.SandRefineryIncrement()*600))
					{
						var useChips=1;
						var afford=1;
						if(ch.power>=1500)
						{
							
						}else if(Molpy.HasGlassBlocks(540))
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
								+' Glass Chips per NP (will use '+Molpify(pow*Molpy.SandRefineryIncrement(),2)+'% of Sand dug).';
								
							if (Molpy.Got('Seaish Glass Chips'))
							{
								str += '<br><input type="Button" value="Seaish Upgrade" onclick="Molpy.SeaishSandRefinery()"></input>';
							}
						}						
					}					
				}					
				
			}else{
				str+= 'Currently, you have no more sand available for further upgrades';
			}
			if(me.power>1 && !Molpy.HasGlassBlocks(ch.bought*10))
			{
				str+='<br><input type="Button" value="Downgrade" onclick="Molpy.DowngradeSandRefinery()"></input> the Sand Refinery (by 1) and receive a 1 Glass Chip refund.';
			}
			return str;
		}
		,icon:'sandrefinery',className:'action',group:'hpt'
	});
	Molpy.UpgradeSandRefinery=function(n)
	{
		var ch = Molpy.Boosts['Glass Chip Storage'];
		var bl = Molpy.Boosts['Glass Block Storage'];
		if(Molpy.CheckSandRateAvailable(Molpy.SandRefineryIncrement()*n))
		{
			var chipCost = (n<20?n*3:n*2.5);
			var blockCost = (n<20?n:n*.9);
			if(ch.power>=chipCost)
			{
				ch.power-=chipCost;
			}
			else if(Molpy.HasGlassBlocks(blockCost))
			{
				Molpy.SpendGlassBlocks(blockCost);
			}else{
				return;
			}
			Molpy.Boosts['Sand Refinery'].power+=n;
			Molpy.Notify('Sand Refinery upgraded',1);
			Molpy.recalculateDig=1;
		}		
	}
	Molpy.DowngradeSandRefinery=function()
	{
		var sr = Molpy.Boosts['Sand Refinery'];
		var ch = Molpy.Boosts['Glass Chip Storage'];
		if(sr.power<1)return;
		Molpy.AddChips(1);
		sr.power--;
		sr.hoverOnCounter=1;
		Molpy.Notify('Sand Refinery downgraded',1);
		Molpy.recalculateDig=1;			
	}
	
	new Molpy.Boost({name:'Glass Chip Storage',desc:
		function(me)
		{
			me.power=Math.round(me.power);
			me.bought=Math.round(me.bought);
			
			var str= 'Contains '+Molpify(me.power,3)+' Glass Chip'+(me.power>1?'s':'')+'.';
			var size=(me.bought)*10;
			var rate = Molpy.Boosts['Sand Refinery'].power+1;
			str+= ' Has space to store '+Molpify(size,3)+ ' Chips total.';
			if(size-me.power<=rate*10||Molpy.Got('AA'))
			{
				if(me.power>=5)
				{
					str+='<br><input type="Button" value="Pay" onclick="Molpy.UpgradeChipStorage(1)"></input> 5 Chips to build storage for 10 more.'
				}else{
					str+='<br>It costs 5 Glass Chips to store 10 more.';
				}
				if(rate>150)
				{
					if(me.power>=90)
					{
						str+='<br><input type="Button" value="Pay" onclick="Molpy.UpgradeChipStorage(20)"></input> 90 Chips to build storage for 200 more.'
					}else{
						str+='<br>It costs 90 Glass Chips to store 200 more.';
					}
					if(me.bought>250)
					{
						var n = Math.floor(me.power/12)*2 //ensure even to prevent fractional chips
						if(n>20)
						{
							str+='<br><input type="Button" value="Pay" onclick="Molpy.UpgradeChipStorage('+n+')"></input> '+Molpify(n*4.5,3)+' Chips to build storage for '
								+Molpify(n*10,3)+' more.'
						}
					}
				}
			}
			if(me.power>10&&!Molpy.Got('Sand Refinery'))
			{
				if(me.power>=30)
				{
					str+='<br><input type="Button" value="Pay" onclick="Molpy.BuyGlassBoost(\'Sand Refinery\',30,0)"></input> 30 Chips to build a Sand Refinery to make Chips faster.'
				}else{
					str+='<br>It costs 30 Glass Chips to build a Sand Refinery, which can make Chips faster.';
				}
			}			
			if(me.power>100&&!Molpy.Got('Glass Blower'))
			{
				if(me.power>=150)
				{
					str+= '<br><input type="Button" value="Pay" onclick="Molpy.BuyGlassBoost(\'Glass Blower\',150,0)"></input> 150 Chips to build a Glass Blower to make Glass Blocks from Glass Chips.'
				}else{
					str+='<br>It costs 150 Glass Chips to build a Glass Blower, which makes Glass Blocks from Glass Chips.';
				}
			}		
			if(me.power>7500&&!Molpy.Got('Glass Extruder'))
			{
				if(me.power>=10000)
				{
					str+= '<br><input type="Button" value="Pay" onclick="Molpy.BuyGlassBoost(\'Glass Extruder\',10000,0)"></input> '+Molpify(10000)+' Chips'
				}else{
					str+='<br>It costs '+Molpify(10000)+' Glass Chips';
				}
				str+=' to build a Glass Extruder which makes the Glass Blower use less Sand.';
			}
			return str;
		}
		,icon:'glasschipstore',className:'alert',group:'hpt'
	});
	Molpy.UpgradeChipStorage=function(n)
	{
		var ch = Molpy.Boosts['Glass Chip Storage'];
		var cost = n*5
		if(n>=10)cost*=.9;
		if(ch.power>=cost)
		{
			ch.power-=cost;
			ch.bought+=n;
			ch.hoverOnCounter=1;
			Molpy.Notify('Glass Chip Storage upgraded',1);
		}
	}
	
	Molpy.BuyGlassBoost=function(name,chips,blocks)
	{
		if(Molpy.HasGlassChips(chips)&&Molpy.HasGlassBlocks(blocks))
		{
			Molpy.SpendGlassChips(chips);
			Molpy.SpendGlassBlocks(blocks);
			Molpy.UnlockBoost(name);
			Molpy.Boosts[name].buy();			
		}else{
			Molpy.Notify('You require more <span class="strike">Vespene Gas</span>Glass',1)
		}
	}
	Molpy.ChipsPerBlock=function()
	{
		if(Molpy.Got('Ruthless Efficiency'))
		{
			return 5;
		}
		return 20;
	}
	
	//glass blower
	new Molpy.Boost({name:'Glass Blower',
		desc:function(me)
		{
			if(!me.bought) return 'Makes Glass Blocks from Glass Chips';
			var pow=Molpy.Boosts['Glass Chiller'].power+1;
			var cost=Molpify(Molpy.GlassBlowerSandUse(1),2);
			var str= (me.power?'U':'When active, u')+'ses '+cost+'% of Sand dug to produce '+Molpify(pow,3)+' Glass Block'+(pow>1?'s':'')
				+' from '+Molpy.ChipsPerBlock()+' Glass Chips (each) per NP.<br>';			
			
			if(Molpy.Got('Glass Blower Switching'))
			{
			 str+='Currently '+(me.power?'Dea':'A')+'ctivating.';
			}else{
				str+='<br><input type="Button" value="'+(me.power?'Dea':'A')+'ctivate" onclick="Molpy.SwitchGlassBlower('+me.power+')"></input>';
			}			
			return str;			
			
		}
		,icon:'glassblower',className:'toggle',group:'hpt'});
	new Molpy.Boost({name:'Glass Blower Switching',
		desc:function(me)
		{
			return (me.power?'off':'on')+' in '+Molpify(me.countdown,3)+'mNP';
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
			var str='';
			var bl = Molpy.Boosts['Glass Block Storage'];
			if(bl.power>=5)
			{
				if(Molpy.CheckSandRateAvailable(Molpy.GlassChillerIncrement()))
				{
					var pow=(Molpy.Boosts['Glass Chiller'].power)+2;
					str+= '<br><input type="Button" value="Pay" onclick="Molpy.UpgradeGlassChiller(1)"></input> 5 Blocks to upgrade the Glass Blower to produce '
						+Molpify(pow,3)+' Glass Block'+(pow>1?'s':'')+' per NP (will use '+Molpify(pow*Molpy.GlassChillerIncrement(),2)+'% of Sand dug).';
					
					if(Molpy.Boosts['Glass Extruder'].power>10&&Molpy.CheckSandRateAvailable(Molpy.GlassChillerIncrement()*20))
					{
						var pow=(Molpy.Boosts['Glass Chiller'].power)+21;
						str+= '<br><input type="Button" value="Pay" onclick="Molpy.UpgradeGlassChiller(20)"></input> 90 Blocks to upgrade the Glass Blower to produce '
							+Molpify(pow,3)+' Glass Block'+(pow>1?'s':'')+' per NP (will use '+Molpify(pow*Molpy.GlassChillerIncrement(),2)+'% of Sand dug).';
							
						if (Molpy.Got('Seaish Glass Blocks'))
						{
							str += '<br><input type="Button" value="Seaish Upgrade" onclick="Molpy.SeaishGlassChiller()"></input>';
						}
					}
					
				}else{
					str+= 'Currently, you have no more sand available for further upgrades';
				}
			}else
				str+= 'It costs 5 Blocks to upgrade the Glass Blower\'s speed';
			
			if(me.power>1 && !Molpy.HasGlassBlocks(bl.bought*50))
			{
				str+='<br><input type="Button" value="Downgrade" onclick="Molpy.DowngradeGlassChiller()"></input> the Glass Chiller (by 1) and receive a 1 Glass Block refund.';
			}
			return str;
		},icon:'glasschiller',className:'action',group:'hpt'
	});
	Molpy.UpgradeGlassChiller=function(n)
	{
		var bl = Molpy.Boosts['Glass Block Storage'];
		var unitCost=5;
		if(n>10) unitCost*=.9;
		if(bl.power>=unitCost*n && Molpy.CheckSandRateAvailable(Molpy.GlassChillerIncrement()*n))
		{
			bl.power-=unitCost*n;
			Molpy.Boosts['Glass Chiller'].power+=n;
			Molpy.Boosts['Glass Chiller'].hoverOnCounter=1;
			Molpy.Notify('Glass Chiller upgraded',1);
			Molpy.recalculateDig=1;
		}
	}
	Molpy.DowngradeGlassChiller=function()
	{
		var gc = Molpy.Boosts['Glass Chiller'];
		var bl = Molpy.Boosts['Glass Block Storage'];
		if(gc.power<1)return;
		Molpy.AddBlocks(1);
		gc.power--;
		gc.hoverOnCounter=1;
		Molpy.Notify('Glass Chiller downgraded',1);
		Molpy.recalculateDig=1;
	
	}
	
	new Molpy.Boost({name:'Glass Block Storage',desc:
		function(me)
		{
			me.power=Math.round(me.power);
			me.bought=Math.round(me.bought);
			
			var str= 'Contains '+Molpify(me.power,3)+' Glass Block'+(me.power>1?'s':'')+'.';
			var size=(me.bought)*50;
			var rate = Molpy.Boosts['Glass Chiller'].power+1;
			str+= ' Has space to store '+Molpify(size,3)+ ' Blocks total.';
			if(size-me.power<=rate*10||Molpy.Got('AA'))
			{
				if(me.power>=15)
				{
					str+= '<br><input type="Button" value="Pay" onclick="Molpy.UpgradeBlockStorage(1)"></input> 15 Blocks to build storage for 50 more.'
				}else{
					str+='<br>It costs 15 Glass Blocks to store 50 more.';
				}
				if(rate>200)
				{
					if(me.power>=2800)
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
			if(me.power>30&&!Molpy.Got('Glass Chiller'))
			{
				if(me.power>=80)
				{
					str+= ' <input type="Button" value="Pay" onclick="Molpy.BuyGlassBoost(\'Glass Chiller\',0,80)"></input> 80 Blocks to build a Glass Chiller to make Blocks faster.';
				}else{
					str+=' It costs 80 Glass Blocks to build a Glass Chiller, which can make Blocks faster.';
				}
			}
			if(me.power>40&&!Molpy.Got('Sand Purifier'))
			{
				if(me.power>=95)
				{
					str+= ' <input type="Button" value="Pay" onclick="Molpy.BuyGlassBoost(\'Sand Purifier\',0,95)"></input> 95 Blocks';
				}else{
					str+=' It costs 95 Glass Blocks';
				}
				str+=' to build a Sand Purifier, which makes the Glass Furnace use less sand.';
			}
			return str;
		}
		,icon:'glassblockstore',className:'alert',group:'hpt'
	});
	Molpy.UpgradeBlockStorage=function(n)
	{
		var bl = Molpy.Boosts['Glass Block Storage'];
		var cost=n*15;
		if(n>=10)cost*=.9;
		if(bl.power>=cost)
		{
			bl.power-=cost;
			bl.bought+=n;
			bl.hoverOnCounter=1;
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
			Molpy.Boosts['Sand Purifier'].hoverOnCounter=1;
			Molpy.recalculateDig=1;
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
		,className:'action',group:'hpt'}
	);
	
    Molpy.SeaishSandPurifier=function()
    {
        var upgrades = 0;
        var bl = Molpy.Boosts['Glass Block Storage'];
		var cost=0;
        while( (cost = Molpy.SandPurifierUpgradeCost()) < bl.power*.99 )
        {
            bl.power -= cost;
            upgrades++;
            Molpy.Boosts['Sand Purifier'].power++;
        }

        Molpy.Boosts['Sand Purifier'].hoverOnCounter=1;
        Molpy.recalculateDig=1;
        Molpy.Notify('Sand Purifier upgraded '+Molpify(upgrades,2) + ' times' ,1);
    }

    Molpy.SeaishGlassExtruder=function()
    {
        var upgrades = 0;
        var ch = Molpy.Boosts['Glass Chip Storage'];
		var cost=0;
        while( (cost = Molpy.GlassExtruderUpgradeCost()) < ch.power*.99 )
        {
            ch.power -= cost;
            upgrades++;
            Molpy.Boosts['Glass Extruder'].power++;
        }

        Molpy.Boosts['Glass Extruder'].hoverOnCounter=1;
        Molpy.recalculateDig=1;
        Molpy.Notify('Glass Extruder upgraded '+Molpify(upgrades,2) + ' times' ,1);
    }

    Molpy.SeaishSandRefinery=function()
    {
        var ch = Molpy.Boosts['Glass Chip Storage'];
        var extra = Math.min(Math.floor(ch.power/2.51),Math.floor((100 - Molpy.CalcGlassUse())/Molpy.SandRefineryIncrement()-1));
        if (extra>20) 
        {
            ch.power -= extra*2.5;
            Molpy.Boosts['Sand Refinery'].power+=extra;
            Molpy.Boosts['Sand Refinery'].hoverOnCounter=1;
            Molpy.Notify('Sand Refinery upgraded '+Molpify(extra,2)+' times',1);
            Molpy.recalculateDig=1;
        }       

    }

    Molpy.SeaishGlassChiller=function()
    {
        var bl = Molpy.Boosts['Glass Block Storage'];
        var extra = Math.min(Math.floor(bl.power/4.51),Math.floor((100 - Molpy.CalcGlassUse())/Molpy.GlassChillerIncrement()-1));
        if (extra>20) 
        {
            bl.power -= extra*4.5;
            Molpy.Boosts['Glass Chiller'].power+=extra;
            Molpy.Boosts['Glass Chiller'].hoverOnCounter=1;
            Molpy.Notify('Glass Chiller upgraded '+Molpify(extra,2)+' times',1);
            Molpy.recalculateDig=1;
        }       
    }	
	
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
	}
		
	new Molpy.Boost({name:'Ninja League',desc:'Ninja Stealth is raised by 100x as much'
		,sand:'5T',castles:'0.6T',icon:'ninjaleague',group:'ninj'});
		
	new Molpy.Boost({name:'Ninja Legion',desc:'Ninja Stealth is raised by 1000x as much'
		,sand:'3P',castles:'0.9P',group:'ninj'});
		
	new Molpy.Boost({name:'Swim Between the Flags',aka:'SBTF',desc:'Each Flag gives Waves a 6% bonus to Castle production on even NewPix (i.e. when changing from an odd NewPix to an even NewPix) and to destruction on odd NewPix. The Sand production of Flags is multiplied by the number of Waves on odd NewPix and divided on even NewPix.', sand:'14G', castles: '2T',icon:'swimbetweenflags'});
	
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
				||!Molpy.Got('RB')&&Molpy.HasGlassChips(100000)&&Molpy.HasGlassBlocks(1000)
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
			Molpy.SandTools['Bag'].refresh();
			Molpy.UnlockBoost('Rosetta');
		}else{
			Molpy.Notify('<b>THEY ARE HEAVY</b>',1);
		}
	}
	Molpy.faCosts=[55,65,85,115,145,175,205,240,280,330,440,560,700,900,1200,1500];
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
				if(Molpy.HasGlassBlocks(800)&&!Molpy.Got('Caged Logicat')&&Molpy.Boosts['Logicat'].bought>2)
				{
					if(Molpy.HasGlassBlocks(1000))
					{
						str+= '<br><input type="Button" value="Pay" onclick="Molpy.BuyGlassBoost(\'Caged Logicat\',0,1000)"></input> '+Molpify(1000)+' Blocks to get a Caged Logicat';
					}else{
						str+='<br>It costs '+Molpify(1000)+' Glass Blocks to get a Caged Logicat.';
					}
				}
				if(Molpy.HasGlassChips(12500)&&Molpy.HasGlassBlocks(2500)&&!Molpy.Got('Camera'))
				{
					if(Molpy.HasGlassChips(25000)&&Molpy.HasGlassBlocks(5000))
					{
						str+= '<br><input type="Button" value="Pay" onclick="Molpy.BuyGlassBoost(\'Camera\',25000,5000)"></input> '+Molpify(25000)+' Chips and '+Molpify(5000)+' Blocks to get a Camera';
					}else{
						str+='<br>It costs '+Molpify(25000)+' Glass Chips and '+Molpify(5000)+' Glass Blocks to get a Camera.';
					}
				}
				var s = Molpy.GetBlackprintSubject();
				if(s && !Molpy.Got('CfB'))
				{
					str+='<br><input type="Button" value="Start" onclick="Molpy.StartBlackprintConstruction()"></input> construction of '+Molpy.Boosts[Molpy.GetBlackprintSubject()].name+' from Blackprints (requires 100 runs of Factory Automation)';
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
			if(!Molpy.Got('Panther Salve')&&Molpy.HasGlassBlocks(250)
				||fa.bought&&Molpy.Got('Doublepost')&&fa.power<Molpy.faCosts.length&&bots>=Molpy.faCosts[fa.power]
				||!Molpy.Boosts['Ninja Climber'].unlocked&&Molpy.Got('Skull and Crossbones')&&Molpy.SandTools['Ladder'].amount>=500
				||Molpy.HasGlassBlocks(800)&&!Molpy.Got('Caged Logicat')&&Molpy.Boosts['Logicat'].bought>2
				||Molpy.HasGlassChips(12500)&&Molpy.HasGlassBlocks(2500)&&!Molpy.Got('Camera')
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
				Molpy.CastleTools['NewPixBot'].refresh();
				fa.power++;				
				Molpy.Boosts['Rosetta'].hoverOnCounter=1;
				Molpy.Notify('Factory Automation Upgraded',1);
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
			lads.refresh();
			Molpy.UnlockBoost('Ninja Climber');			
			Molpy.Boosts['Rosetta'].hoverOnCounter=1;
			Molpy.Notify('Factory Automation Upgraded',1);
		}
		
	}
	new Molpy.Boost({name:'Panther Salve',
		desc:function(me)
		{
			var str='"It\'s some kind of paste." Not Lucky gets a cumulative 1% bonus from each item owned, at a cost of 10 Glass Blocks per use.'
			if(me.bought)
			{
				str+=' <input type="Button" onclick="Molpy.PantherSalveToggle()" value="'
					+(me.power>0? 'Dea':'A')+'ctivate"></input>';	
			}
			return str;
		},buyFunction:function(){this.power=1;},
	stats:function(me)
	{
		var str ='Not Lucky\'s reward is 1% higher for every Tool, Boost, and Badge owned. Consumes 10 Glass Blocks per use.';
		var p = Math.abs(me.power);
		if(p <=200)
			str+='<br>Speed is at '+p+' out of 200';
		else if(p<=500)
			str+='<br>Speed is at '+p+' out of 500';
		else if(p<=800)
			str+='<br>Speed is at '+p+' out of 800';
		else if(p<=1200)
			str+='<br>Speed is at '+p+' out of 1200';
		return str;
	}
	,group:'bean',className:'toggle',icon:'panthersalve'});
	
	Molpy.PantherSalveToggle=function()
	{
		var me=Molpy.Boosts['Panther Salve'];
		me.power=-me.power;			
		me.hoverOnCounter=1;
	}
	
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
	
	new Molpy.Boost({name:'Furnace Crossfeed',
		desc:function(me)
		{
			if(!me.bought) return 'Blast Furnace acts as a Glass Furnace instead of its previous purpose, only if Glass Furnace is active.';
			return (me.power?'':'When activated, ')+'Blast Furnace acts as a Glass Furnace instead of its previous purpose, only if Glass Furnace is active.<br><input type="Button" onclick="Molpy.FurnaceCrossfeedToggle()" value="'+(me.power? 'Dea':'A')+'ctivate"></input>';
		},sand:'6.5G',castles:'.8G',icon:'furnacecrossfeed',group:'hpt',
		buyFunction:function(){this.power=1;}
	});
	Molpy.FurnaceCrossfeedToggle=function()
	{
		var fc=Molpy.Boosts['Furnace Crossfeed'];
		fc.power=(!fc.power)*1;
		fc.hoverOnCounter=1;
	}
	
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
		
	new Molpy.Boost({name:'Furnace Multitasking',
	desc:function(me)
		{
			if(!me.bought) return 'Blast Furnace acts as a Glass Blower instead of its previous purpose, only if Glass Blower is active. (This stacks with Furnace Crossfeed)';
			return (me.power?'':'When activated, ')+'Blast Furnace acts as a Glass Blower instead of its previous purpose, only if Glass Furnace is Blower.<br><input type="Button" onclick="Molpy.FurnaceMultitaskToggle()" value="'
				+(me.power? 'Dea':'A')+'ctivate"></input> (This stacks with Furnace Crossfeed)';
		},sand:'48G',castles:'1.2G',icon:'furnacemultitask',group:'hpt',
		buyFunction:function(){this.power=1;}
	});
	Molpy.FurnaceMultitaskToggle=function()
	{
		var fm=Molpy.Boosts['Furnace Multitasking'];
		fm.power=(!fm.power)*1;
		fm.hoverOnCounter=1;
	}
	
	Molpy.redundancy=MakeRedundancy();
	
	new Molpy.Boost({name:'Free Advice',
		desc:function(me)
		{
			if(Molpy.Got('AA')&&!Molpy.Got('AC')&&Molpy.CastleTools['NewPixBot'].amount>=7500)
			{
				return 'Logicat Level required for Automata Control: '+Molpify(440*50000/Molpy.CastleTools['NewPixBot'].amount,3);
			}
			if(Molpy.GlassCeilingCount())
			{
				return 'To Lock or Unlock a Glass Ceiling Boost, the previous numbered Glass Ceiling Boost must be owned and all lesser numbered Glass Ceiling Boosts must not be owned.';
			}
			return 'Hindsight'+(me.bought?' is 20/20':'');
		},
		stats:function(me)
		{
			return (me.bought?'This will be useful eventually :P':'Hindsight');
		},
		sand:'400P',castles:'400P'});
	
	new Molpy.Boost({name:'Broken Bottle Cleanup',aka:'BBC',
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
			return me.desc(me)+'<br>(Also may have reduced price of Double or Nothing.)';
		}
		,sand:'5P',castles:'10P',glass:'500',className:'toggle'});
		
	Molpy.ToggleBBC=function()
	{
		var me = Molpy.Boosts['BBC'];
		if(me.power<0)me.power=0;
		else me.power=-1;
		me.hoverOnCounter=1;
		Molpy.recalculateDig=1;
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
			glass: 50* (+i+1), group:'hpt',
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
			}
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
		var p = 33;
		if(Molpy.Got('WWB'))
		{
			p*=Math.pow(2,Molpy.Boosts['WWB'].bought-5)*Molpy.CastleTools['Scaffold'].amount;
		}
		return Math.pow(p,Molpy.GlassCeilingCount());
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
			var p = key-1;
			if(p>=0&&!Molpy.Got('Glass Ceiling '+p))
			{
				Molpy.Notify('You need to Own Glass Ceiling '+p+' before you can Lock Glass Ceiling '+key,1);
				return;
			}
			while(p--)
			{
				if(p<0) break;
				if(Molpy.Got('Glass Ceiling '+p))
				{
					Molpy.Notify('You need to Lock Glass Ceiling '+p+' before you can Lock Glass Ceiling '+key,1);
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
		var p = key-1;
		if(p<0||Molpy.Got('Glass Ceiling '+p))
		{
			while(p--)
			{
				if(p<0) return 1;
				if(Molpy.Got('Glass Ceiling '+p))
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
	new Molpy.Boost({name:'Run Raptor Run',aka:'RRR',
		desc:function(me)
		{
			var str='Multiplies Not Lucky bonus by '+Molpify(10000)+' at a cost of 30 Glass Blocks per use';
			if(me.bought)
			{
				str+=' <input type="Button" onclick="Molpy.RRRToggle()" value="'
					+(me.power>0? 'Dea':'A')+'ctivate"></input>';	
			}
			return str;
		},buyFunction:function(){this.power=1;},
		sand:'180E',castles:'380E',glass:2500,group:'bean',className:'toggle'
	});	Molpy.RRRToggle=function()
	{
		var me=Molpy.Boosts['RRR'];
		me.power=(!me.power)*1;			
		me.hoverOnCounter=1;
	}
	new Molpy.Boost({name:'Ninja Climber',desc:'Multiplies Ninja Builder\'s Castle output by the number of Ladders owned, and the Sand dug by Ladders by the Ninja Stealth level'
		,sand:'490P',castles:'670P',glass:1500,group:'ninj'
	});
	new Molpy.Boost({name:'Phonesaw',desc:'I saw what you did there. Or heard.'
		,sand:'48E',castles:'38E',glass:100,group:'hpt',icon:'phonesaw'
	});
	new Molpy.Boost({name:'Logicat',desc:
		function(me)
		{
			
			return 'Statement A: Statement A is true.<br><br>Logicat Level is: '+me.bought+'.<br>'+(me.bought*5-Math.floor(me.power))+' correct answers are needed to reach Logicat Level '+(me.bought+1);
		}
		,sand:'55E',castles:'238E',glass:100,group:'bean',icon:'logicat'
	});
	new Molpy.Boost({name:'Temporal Duplication',desc:
		function(me){return 'For '+Molpify(me.countdown,3)+'mNP, when you buy tools, get the same amount again for free!';}
		,group:'chron',className:'alert',logic:1,startCountdown:5
		,countdownFunction:function(){
			if(this.countdown==2)
			{
				Molpy.Notify('Temporal Duplication runs out in 2mNP!');
			}
		}
	});
	new Molpy.Boost({name:'Impervious Ninja',desc:
		function(me){return 'You cannot lose Ninja Stealth for '+Molpify(me.countdown,3)+'mNP';}
		,group:'ninj',logic:2,startCountdown:function()
		{
			return Math.min(50000, Molpy.LogiMult('.5K'));
		}
		,className:'alert'
	});
	new Molpy.Boost({name:'Factory Ninja',desc:
		function(me){return 'The next '+me.power+' Ninja Builder'+(me.power==1?'':'s')+' will activate Factory Automation';}
		,group:'ninj',logic:3,className:'alert',startPower:function()
		{
			return Math.ceil(Molpy.Boosts['Logicat'].bought/5)
		}
	});
	new Molpy.Boost({name:'Logicastle',desc:'The Castle outputs of Castle Tools gain 50% per Logicat Level'
		,group:'bean',logic:2,sand:'420Z',castles:'850Z',glass:300
	});
	Molpy.LogicastleMult=function()
	{
		if(Molpy.Got('Logicastle'))return Math.pow(1.5,Molpy.Boosts['Logicat'].bought);
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
			return (5-me.bought)+' locks remain<br><input type="Button" value="Smash" onclick="Molpy.LockBoost(\'Locked Crate\')"></input> it open to grab the loot!'
		},
		sand:function(me){ return me.power;},
		castles:function(me){ return me.power;},
		glass:15,logic:2,className:'action',
		unlockFunction:function()
		{
			this.power = Molpy.castles*6+Molpy.sand;
		},
		lockFunction:function()
		{
			var bl=Molpy.Boosts['Glass Block Storage'];
			var win = Math.ceil(Molpy.LogiMult('2K'));
			win = Math.floor(win/(6-this.bought));
			while(bl.bought*50<bl.power+win)bl.bought++; //make space!
			bl.power+=win;
			Molpy.Notify('+'+Molpify(win,3)+' Glass Blocks!');
			if(Molpy.Got('Camera'))
				Molpy.EarnBadge('discov'+Math.ceil(Molpy.newpixNumber*Math.random()));
			Molpy.BlackprintIncrement(this.bought);
				
		}
	});
	new Molpy.Boost({name:'Crate Key',desc:'Quarters the price of Locked Crate',stats:'Quarters the price of Locked Crate, and does something else if you have already bought Locked Crate.'
		,glass:function()
		{return Molpy.LogiMult(20);},
		buyFunction:function()
		{
			Molpy.LockBoost(this.aka);
			var lc = Molpy.Boosts['Locked Crate'];
			if(!lc.unlocked)
			{			
				if(!Molpy.Got('The Key Thing'))
					Molpy.Notify('Well, that was a waste');
				else
					Molpy.UnlockBoost(lc.aka);
				return;
			}
			if(lc.bought)
			{
				lc.bought++;
				if(lc.bought<5)
					Molpy.Notify('You wonder what good that did...');
				else
					Molpy.LockBoost(lc.aka);
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
		var ch = Molpy.Boosts['Glass Chip Storage'];
		if(ch.power>=Molpy.GlassExtruderUpgradeCost())
		{
			ch.power-=Molpy.GlassExtruderUpgradeCost();
			Molpy.Boosts['Glass Extruder'].power++;
			Molpy.Boosts['Glass Extruder'].hoverOnCounter=1;
			Molpy.recalculateDig=1;
			Molpy.Notify('Glass Extruder upgraded',1);
		}
	}
	new Molpy.Boost({name:'Glass Extruder',
		desc:function(me)
		{
			var cost = Molpy.GlassExtruderUpgradeCost();
			var str = 'Glass Blower\'s sand use is divided by '+(me.power+2);
			var ch = Molpy.Boosts['Glass Chip Storage'];
			if(ch.power >= cost-800)
			{
				if(ch.power>=cost)
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
		,className:'action',group:'hpt'}
	);
	
	new Molpy.Boost({name:'Caged Logicat',
		desc: function(me)
		{
			if(me.power&&Molpy.cagedPuzzleValue)
			{
				return Molpy.cagedPuzzleValue;
			}else if(me.bought>1){
				var cost=100+Molpy.LogiMult(25);
				if(Molpy.HasGlassBlocks(cost))
					return '<input type="Button" value="Pay" onclick="Molpy.MakeCagedPuzzle('+cost+')"></input> '+Molpify(cost,3)+' Glass Blocks for a puzzle';
				else return 'It costs '+Molpify(cost,3)+' Glass Blocks for a puzzle';
			}else{
				return 'Caged Logicat is sleeping. Please wait for it.';
			}
		},group:'bean',className:'action',
		buyFunction:function()
		{
			this.bought=11;
		},classChange:
		function()
		{
			var oldClass=this.className;
			var newClass = this.bought>1?'action':'';
			if(newClass!=oldClass)
			{
				this.className=newClass;
				return 1;
			}
		}
	});	

	Molpy.cagedSGen=InitStatementGen();
	Molpy.MakeCagedPuzzle=function(cost)
	{
		if(Molpy.HasGlassBlocks(cost))Molpy.SpendGlassBlocks(cost);
		
		Molpy.cagedSGen.FillStatements();
		Molpy.cagedPuzzleTarget=Molpy.cagedSGen.RandStatementValue();
		var str='Click a statement that is '+Molpy.cagedPuzzleTarget+':';
		var statements= Molpy.cagedSGen.StringifyStatements('Molpy.ClickCagedPuzzle');
		for(var i in statements)
		{
			str+='<br><br>'+statements[i];
		}
		Molpy.cagedPuzzleValue=str;
		Molpy.Boosts['Caged Logicat'].hoverOnCounter=1;
		Molpy.Boosts['Caged Logicat'].power=1;
		Molpy.cagedSGen.firstTry=1;
	}
	Molpy.ClickCagedPuzzle=function(name)
	{
		var clickedVal=Molpy.cagedSGen.StatementValue(name);
		if(clickedVal==Molpy.cagedPuzzleTarget)
		{
			Molpy.Notify('Correct',1);
			var lc = Molpy.Boosts['Logicat'];
			lc.power++;
			while(lc.power>=lc.bought*5)
			{
				Molpy.RewardLogicat(lc.bought);
				lc.bought++;
			}
		}
		else
		{
			Molpy.Notify('Incorrect',1);
			
			if(Molpy.cagedSGen.firstTry&&Molpy.Got('Second Chance')&&Molpy.HasGlassBlocks(50))
			{
				Molpy.SpendGlassBlocks(50);
				Molpy.cagedSGen.firstTry=0;
				Molpy.Notify('Try Again');
				return;
			}
			Molpy.Boosts['Logicat'].power-=0.5;
		}
		Molpy.cagedPuzzleValue='';
		Molpy.Boosts['Caged Logicat'].hoverOnCounter=1;
		Molpy.Boosts['Caged Logicat'].power=0;
		Molpy.Boosts['Caged Logicat'].bought--;
	}
	
	new Molpy.Boost({name:'Second Chance',desc:'If you answer a Logicat Puzzle incorrectly, you get a second attempt at it and don\'t lose half a Logicat point. (Uses 50 Glass Blocks)',
		sand:'250Y',castles:'87Y',group:'bean',logic:5});
	
	new Molpy.Boost({name:'Let the Cat out of the Bag',aka:'LCB',
		desc:function(me)
		{
			var str='Not Lucky reward gains 1% per two Ladders and Bags owned, at a cost of 70 Glass Blocks (or 1 Ladder and 1 Bag) per use.'
			if(me.bought)
			{
				str+=' <input type="Button" onclick="Molpy.CatBagToggle()" value="'
					+(me.power>0? 'Dea':'A')+'ctivate"></input>';	
			}
			return str;
		},buyFunction:function(){this.power=1;},
		stats:'At a cost of 35 Glass Blocks, multiplies Not Lucky by 1.01 for each pair of Ladders, then at a cost of 35 Glass Blocks, multiplies Not Lucky by 1.01 for each pair of Bags. If 35 Glass Blocks are not available each time, a Ladder/Bag is consumed before multiplying.',
		sand:'750U',castles:'245U',glass:'1200',className:'toggle',group:'bean'});
	Molpy.CatBagToggle=function()
	{
		var me=Molpy.Boosts['LCB'];
		me.power=(!me.power)*1;			
		me.hoverOnCounter=1;
	}
	
	new Molpy.Boost({name:'Catamaran',
		desc:function(me)
		{
			var str='Not Lucky reward gains 1% 6 times per Wave and River owned, at a cost of 90 Glass Blocks (or 1 Waves and 1 River) per use.'
			if(me.bought)
			{
				str+=' <input type="Button" onclick="Molpy.CatamaranToggle()" value="'
					+(me.power>0? 'Dea':'A')+'ctivate"></input>';	
			}
			return str;
		},buyFunction:function(){this.power=1;},
		stats:'At a cost of 45 Glass Blocks, multiplies Not Lucky by 1.01 6 times for each Wave, then at a cost of 45 Glass Blocks, multiplies Not Lucky by 1.01 6 times for each River. If 45 Glass Blocks are not available each time, a Wave/River is consumed before multiplying.',
		sand:'750S',castles:'245S',glass:'4800',className:'toggle',group:'bean'});
	Molpy.CatamaranToggle=function()
	{
		var me=Molpy.Boosts['Catamaran'];
		me.power=(!me.power)*1;			
		me.hoverOnCounter=1;
	}
	
	new Molpy.Boost({name:'Redundant Raptor',
		desc:function(me)
		{
			var str='Not Lucky reward gains 1% per '+Molpy.redactedWord+' click, at a cost of 120 Glass Blocks per use.'
			if(me.bought)
			{
				str+='<br><input type="Button" onclick="Molpy.RedRaptorToggle()" value="'
					+(me.power>0? 'Dea':'A')+'ctivate"></input>';	
			}
			return str;
		},buyFunction:function(){this.power=1;},
		stats:'At a cost of 120 Glass Blocks, multiplies Not Lucky by 1.01 twice for each '+Molpy.redactedWord+' click',
		sand:'930PW',castles:'824PW',glass:'4800',className:'toggle',group:'bean'});
	Molpy.RedRaptorToggle=function()
	{
		var me=Molpy.Boosts['Redundant Raptor'];
		me.power=(!me.power)*1;			
		me.hoverOnCounter=1;
	}
	
	new Molpy.Boost({name:'Camera',desc:function(me)
	{
		var str ='"<b>THIS DEVICE <i>MECHANISM</i> IS <i>OBSCURE</i> UNKNOWN</b>"';
		if(me.bought)
		{
			str+= '<br><input type="Button" onclick="Molpy.Shutter()" value="Snap!"></input> (Uses 10 Glass Chips)';
		}
		return str;
	},
		className:'action',group:'bean'
	});
	
	new Molpy.Boost({name:'Memories Revisited',desc:'Allows you to quickly jump in Time to Discoveries you have made.',
		sand:'50P',castles:'20P',glass:'20K',group:'chron'
	});
	
	new Molpy.Boost({name:'Blackprints',desc:
		function(me)
		{
			var pBoost=Molpy.Boosts[Molpy.GetBlackprintSubject(1)];
			if(!pBoost)
			{
				Molpy.LockBoost(me.aka);
				return 'This is not the boost you are looking for.';
			}
			return '(Or Blueprints if you\'re into Chromatic Heresy)<br>Allows you to construct '+pBoost.name+' with Factory Automation';
		}
		,sand:function(){return Molpy.LogiMult('80YW');},castles:function(){return Molpy.LogiMult('40YW');},glass:function(){return Molpy.LogiMult('25K');},
		lockFunction:function()
		{
			var s=Molpy.GetBlackprintSubject(1);
			if(!s)return;
			this.power-=Molpy.GetBlackprintPages();
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
		},
		group:'bean'
	});
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
				return Molpy.blackprintCosts[print]; //number of pages needed for next blackprint boost
		}
		return 0; //none needed at the moment
	}
	Molpy.GetBlackprintSubject=function(d)
	{
		if(!d&&!Molpy.Got('Blackprints'))return;
		var pages = Molpy.Boosts['Blackprints'].power;
		if(!pages)return;
		for(var i in Molpy.blackprintOrder)
		{
			var print=Molpy.blackprintOrder[i];
			if(!Molpy.Boosts[print].unlocked)
			{
				if(pages>=Molpy.blackprintCosts[print])
					return print;
				return;
			}
		}
	}
	Molpy.BlackprintIncrement=function(n)
	{
		var target = Molpy.GetBlackprintPages();
		var b = Molpy.Boosts['Blackprints'];
		b.power+=n;
		if(n==1)
			Molpy.Notify('You found a Blackprint page',1);
		else
			Molpy.Notify('You found '+n+' Blackprint pages',1);
			
		if(!target)return;
			
		if(b.power<target)
			Molpy.Notify('You need  '+Molpify(target-b.power)+' more pages',1);
		else if (b.power>target)
			Molpy.Notify('You have more pages than you need right now',1);
		else
			Molpy.Notify('You now have the '+target+' Blackprint pages you require.',1);
	}
	Molpy.HasSpareBlackprints=function(n)
	{
		var pages = Molpy.Boosts['Blackprints'].power;
		if(pages<1)return 0;
		if(Molpy.Got('Blackprints'))
		{
			pages-=Molpy.blackprintCosts[Molpy.GetBlackprintSubject()];
		}
		return(pages>=n);
	}
	
	//if we have enough blackprint pages for next blackprint boost, allow it as a department reward
	Molpy.CheckBlackprintDepartment=function()
	{
		Molpy.Boosts['Blackprints'].department=0;
		var pages = Molpy.Boosts['Blackprints'].power;
		if(!pages)return;
		for(var i in Molpy.blackprintOrder)
		{
			var print=Molpy.blackprintOrder[i];
			var pboost=Molpy.Boosts[print];
			if(!pboost.unlocked)
			{
				 Molpy.Boosts['Blackprints'].department=1*(pages>=Molpy.blackprintCosts[print]); 
				 return;
			}
		}
	}
	Molpy.StartBlackprintConstruction=function()
	{
		if(Molpy.Got('CfB'))return;
		Molpy.UnlockBoost('CfB')
	}
	Molpy.DoBlackprintConstruction=function(times)
	{
		var con=Molpy.Boosts['CfB'];
		con.power+=times;
		if(con.power>=100)
		{
			var op = con.power;
			Molpy.LockBoost('CfB');
			return times+op-100;
		}
		return 0;
	}
	new Molpy.Boost({name:'Constructing from Blackprints',aka:'CfB',
		desc:function(me)
		{
			return 'Constructing '+Molpy.Boosts[Molpy.GetBlackprintSubject(1)].name+' from Blackprints.<br>'+Molpify(100-me.power)+' runs of Factory Automation required to complete.';
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
		className:'alert',group:'bean'
	});
	Molpy.blackprintCosts={SMM:10,SMF:15,GMM:25,GMF:30,TFLL:80,BG:120,AO:150,AA:200,SG:5};
	Molpy.blackprintOrder=['SMM','SMF','GMM','GMF','TFLL','BG','AO','AA','SG'];
	
	new Molpy.Boost({name:'Sand Mould Maker',aka:'SMM',desc:
		function(me)
		{
			var str = 'Allows you to make a Sand Mould of a Discovery.';
			str+='<br>This requires 100 Factory Automation runs and consumes the NewPix number of the Discovery times 100 Glass Chips per run.<br>';
			if(me.bought&&me.power>0)
			{
				var dname='<small>'+Molpy.Badges['discov'+me.bought].name+'</small>';
				if(me.power>100)
				{
					str+='<br>Making a mould from '+dname+' is complete. The Sand Mould Filler is required next.';
				}else{
					str+='<br>'+(me.power-1)+'% complete making a mould from '+dname;
					if(Molpy.Got('Break the Mould'))
					{
						str+='<br><input type="Button" onclick="Molpy.BreakMould(\''+me.aka+'\')" value="Break the Mould"></input> to cancel';
					}
				}
			}
			return str;
		}
		,group:'bean',
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
			Molpy.AddChips(chips);
			this.power=0;
			Molpy.Notify(this.name+' has cancelled making <small>'+Molpy.Badges['monums'+this.bought].name+'</small>',1);
		}
	});
	new Molpy.Boost({name:'Glass Mould Maker',aka:'GMM',desc:
		function(me)
		{
			var str = 'Allows you to make a Glass Mould of a Sand Monument.';
			str+='<br>This requires 400 Factory Automation runs and consumes 1000 Glass Chips plus 1% per NewPix number of the Monument per run.<br>';
			if(me.bought&&me.power>0)
			{
				var mname='<small>'+Molpy.Badges['monums'+me.bought].name+'</small>';
				if(me.power>400)
				{
					str+='<br>Making a mould from '+mname+' is complete. The Glass Mould Filler is required next.';
				}else{
					str+='<br>'+Molpify((me.power-1)/4,2)+'% complete making a mould from '+mname;
					if(Molpy.Got('Break the Mould'))
					{
						str+='<br><input type="Button" onclick="Molpy.BreakMould(\''+me.aka+'\')" value="Break the Mould"></input> to cancel';
					}
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
			var chips =Math.pow(1.01,this.bought)*1000*(this.power-1);
			Molpy.AddChips(chips);
			this.power=0;
			Molpy.Notify(this.name+' has cancelled making <small>'+Molpy.Badges['monumg'+this.bought].name+'</small>',1);
		}
	});
	new Molpy.Boost({name:'Sand Mould Filler',aka:'SMF',desc:
		function(me)
		{
			var str ='Fills a Sand Mould with Sand to make a Sand Monument.<br>This requires 200 Factory Automation runs and consumes 100 Sand plus 20% per NewPix number of the Discovery, per run.';
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
						str+='<br><input type="Button" onclick="Molpy.BreakMould(\''+me.aka+'\')" value="Break the Mould"></input> to cancel';
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
			Molpy.AddChips(chips);
			var sand=Math.pow(1.2,this.bought)*100*(this.power-1);
			Molpy.Dig(sand);
			this.power=0;
			Molpy.Notify(this.name+' has cancelled filling <small>'+Molpy.Badges['monums'+this.bought].name+'</small>',1);
		}
	});
	new Molpy.Boost({name:'Glass Mould Filler',aka:'GMF',desc:
		function(me)
		{
			var str ='Fills a Glass Mould with Glass to make a Glass Monument.<br><br>Yes, really.<br>This requires 800 Factory Automation runs and consumes 1M Glass Blocks plus 2% per NewPix number of the Discovery, per run.';
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
						str+='<br><input type="Button" onclick="Molpy.BreakMould(\''+me.aka+'\')" value="Break the Mould"></input> to cancel';
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
				
			var blocks=Math.pow(1.02,this.bought)*1000000*(this.power-1);
			Molpy.AddBlocks(blocks);
			var chips =Math.pow(1.01,this.bought)*1000*400;
			Molpy.AddChips(chips);
			this.power=0;
			Molpy.Notify(this.name+' has cancelled filling <small>'+Molpy.Badges['monums'+this.bought].name+'</small>',1);
		}
	});
	
	Molpy.BreakMould=function(aka)
	{
		var m = Molpy.Boosts[aka];
		if(confirm('Do you want to cancel '+m.name+'?\nYou will have wasted '+(m.power-1)+' run'+(m.power==2?'':'s')+' of Factory Automation.'))
			m.reset();
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
	}
	Molpy.MakeSandMouldWork=function(times)
	{
		var smm=Molpy.Boosts['SMM'];
		if(smm.power==0||smm.power>100)
		{
			return times;
		}
		var chips =smm.bought*100;
		while (times) 
		{
			if(!Molpy.HasGlassChips(chips))
			{
				Molpy.Boosts['Break the Mould'].power++;
				return times;
			}
			Molpy.SpendGlassChips(chips);
			times--;
			smm.power++;
			if(smm.power>100)
			{
				Molpy.Notify('Sand Mould Creation is complete',1);
				return times;
			}
		}
		return times;
	}  	
	Molpy.FillSandMould=function(np)
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
		var smm=Molpy.Boosts['SMM'];
		var smf=Molpy.Boosts['SMF'];
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
	}
	Molpy.FillSandMouldWork=function(times)
	{
		var smf=Molpy.Boosts['SMF'];
		if(smf.power==0)
		{
			return times;
		}
		var sand=Math.pow(1.2,smf.bought)*100;
		while (times) 
		{
			if(!Molpy.sand >=sand)
			{
				Molpy.Boosts['Break the Mould'].power++;
				return times;
			}
			Molpy.SpendSand(sand);
			times--;
			smf.power++;
			if(smf.power>200)
			{
				Molpy.Notify('Sand Mould Filling is complete',1);
				Molpy.EarnBadge('monums'+smf.bought);
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
	}
	Molpy.MakeGlassMouldWork=function(times)
	{
		var gmm=Molpy.Boosts['GMM'];
		if(gmm.power==0||gmm.power>400)
		{
			return times;
		}
		var chips=Math.pow(1.01,gmm.bought)*1000;
		while (times) 
		{
			if(!Molpy.HasGlassChips(chips)) 
			{
				Molpy.Boosts['Break the Mould'].power++;
				return times;
			}
			Molpy.SpendGlassChips(chips);
			times--;
			gmm.power++;
			if(gmm.power>400)
			{
				Molpy.Notify('Glass Mould Creation is complete',1);
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
	}
	Molpy.FillGlassMouldWork=function(times)
	{
		var gmf=Molpy.Boosts['GMF'];
		if(gmf.power==0)
		{
			return times;
		}
		var glass=Math.pow(1.02,gmf.bought)*1000000;
		while (times) 
		{
			if(!Molpy.HasGlassBlocks(glass)) 
			{
				Molpy.Boosts['Break the Mould'].power++;
				return times;
			}
			Molpy.SpendGlassBlocks(glass);
			times--;
			gmf.power++;
			if(gmf.power>800)
			{
				Molpy.Notify('Glass Mould Filling is complete',1);
				Molpy.EarnBadge('monumg'+gmf.bought);
				gmf.bought=1;
				gmf.power=0;
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
				str+=' <input type="Button" onclick="Molpy.NinjasawToggle()" value="'+(me.power? 'Dea':'A')+'ctivate"></input>';
			}
			return str;
		}
		,sand:'450EW',castles:'75EW',glass:'1.8K',group:'ninj',className:'toggle'});
	Molpy.NinjasawToggle=function()
	{
		var ns=Molpy.Boosts['Ninjasaw'];
		ns.power=(!ns.power)*1;
		ns.hoverOnCounter=1;
	}	
	
	/*10000000*Math.pow(1.25,3090) is relevant because reasons
		2.8310021220015596e+306*/
		
	new Molpy.Boost({name:'Fractal Fractals',desc:'Even your fractals have fractals!<br>Increases the effect of Fractal Sandcastles',sand:'1.8ZW',castles:'.3ZW',glass:'3K'});
	new Molpy.Boost({name:'Facebugs',desc:'Increases sand dig rate (but not clicks) by 10% per badge earned',sand:'24UW',castles:'7.5UW',glass:'8K'});
	new Molpy.Boost({name:'Keygrinder',desc:'The DoRD may produce a Crate Key if Factory Automation is at Level 10 or above',sand:'463UW',castles:'15.6SW',glass:'13K',group:'hpt',logic:20});
	new Molpy.Boost({name:'The Key Thing',desc:'Buying a Crate Key when the Locked Crate is not available will now do something useful',sand:'18SW',castles:'47SW',glass:'19K',group:'bean',logic:25});
	
	new Molpy.Boost({name:'Window Washing Beanies',aka:'WWB',desc:
		function(me)
		{	
			if(!me.bought) return 'How are you seeing this?';
			var str = 'Multiplies the effect of each Glass Ceiling by ';
			str+=Molpify(Math.pow(2,me.bought-5),3)+' times the number of Scaffolds owned.';
			str+='<br><input type="Button" value="Trade" onclick="Molpy.GetWWB()"></input> '+(444+77*me.bought)+' Scaffolds to hire more Beanies.';
			return str;
		}
		,group:'bean',classChange:
		function()
		{
			var oldClass=this.className;
			var newClass = this.bought&&Molpy.CastleTools['Scaffold'].amount>=444+this.bought*77				
				?'action':'';
			if(newClass!=oldClass)
			{
				this.className=newClass;
				return 1;
			}
		}
	});
	Molpy.GetWWB=function()
	{
		var wwb=Molpy.Boosts['WWB'];
		var price = 444+77*wwb.bought;
		var scaf=Molpy.CastleTools['Scaffold'];
		if(scaf.amount<price)
		{
			Molpy.Notify('You must construct additional <span class="strike">pylons</span>scaffolds',1);
			return;
		}
		scaf.amount-=price;
		Molpy.CastleToolsOwned-=price;
		scaf.refresh();
		if(wwb.bought)wwb.bought++;
		else
		{
			Molpy.UnlockBoost(wwb.aka);
			wwb.buy();
		}
	}
	
	new Molpy.Boost({name:'Recycling Beanies',aka:'RB',desc:
		function(me)
		{
			var str= 'Multiplies the effect of Broken Bottle Cleanup by '+Molpify(Math.pow(200,me.bought),3);
			if(Molpy.CastleTools['Beanie Builder'].amount>(me.bought*200))
			{
				str+='<br><input type="Button" value="Hire" onclick="Molpy.HireRecycling()"></input> '+(200*me.bought)+' Beanie Builders to recycle.';
			}
			return str;
		}
		,group:'bean',classChange:
		function()
		{
			var oldClass=this.className;
			var newClass = this.bought&&Molpy.CastleTools['Beanie Builder'].amount>=this.bought*200-20				
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
		bb.refresh();
		rb.bought++;
	}
	
	new Molpy.Boost({name:'Tool Factory',desc:
		function(me)
		{
			var str='Produces Glass Tools from Glass Chips';
			if(!me.bought)return str;
			if(Molpy.Got('TFLL')&&Molpy.HasGlassChips(50000))
			{
				str+='<br><input type="Button" value="Load" onclick="Molpy.LoadToolFactory(50000)"></input> with 50K Glass Chips';
			}else if(Molpy.Got('TFLL')&&Molpy.HasGlassChips(10000))
			{
				str+='<br><input type="Button" value="Load" onclick="Molpy.LoadToolFactory(10000)"></input> with 10K Glass Chips';
			}
			
			if(Molpy.HasGlassChips(1000))
			{
				str+='<br><input type="Button" value="Load" onclick="Molpy.LoadToolFactory(1000)"></input> with 1K Glass Chips';
			}
			return str;
		}
	
		,sand:Infinity,castles:Infinity,glass:10005,group:'hpt',className:'action'
	});
	
	Molpy.LoadToolFactory=function(amount)
	{
		if(Molpy.HasGlassChips(amount))
		{
			Molpy.SpendGlassChips(amount);
			Molpy.Boosts['Tool Factory'].power+=amount;
			if(Molpy.SandTools['Bucket'].amount>=7470&&Molpy.Got('Tool Factory')&&!isFinite(Molpy.sandPermNP))Molpy.UnlockBoost('Sand to Glass');
			if(Molpy.CastleTools['NewPixBot'].amount>=1515&&Molpy.Got('Tool Factory')&&!isFinite(Molpy.castles))Molpy.UnlockBoost('Castles to Glass');
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
        var i = 1;
        if(Molpy.Got('PC')) i=Molpy.Boosts['PC'].power;
        var pow=tf.power;
        var built=0;
        var fVal=Molpy.Boosts['Flipside'].power;
        var fast=0;
        if (Molpy.GlassCeilingCount()==12 && (fVal==0) && (pow >= 78000*i))
        {
            var t = Molpy.tfOrder.length;
            fast=1;
            while(t--)
            {
                tool = Molpy.tfOrder[t];
                tool.amount += i;
                tool.bought += i;
            }
            Molpy.SandToolsOwned+= 6*i;             
            Molpy.CastleToolsOwned+= 6*i;               
            pow -= 78000*i;
            built = i*12;   
        }
        else
        {
            while(pow&&i--)
            {
                var t = Molpy.tfOrder.length;
                while(pow&&t--)
                {
                    var tool=Molpy.tfOrder[t];
                    if(isFinite(Molpy.priceFactor*tool.price)==fVal&&Molpy.Got('Glass Ceiling '+t))
                    {
                        var cost = 1000*(t+1);
                        if(pow>=cost)
                        {
                            pow-=cost;
                            tool.create();
                            built++;
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
                if(isFinite(Molpy.priceFactor*tool.price)) tool.refresh();
            }

            Molpy.toolsBuilt+=built;
            Molpy.toolsBuiltTotal+=built;
            Molpy.recalculateDig=1;
            Molpy.shopRepaint=1;
            Molpy.CheckBuyUnlocks();
            tf.power=pow;

        }
        if(!Molpy.Boosts['AA'].power)return;

        var p = 1;
        if(Molpy.Got('AC')) p=Molpy.Boosts['AC'].power;
        var i=p;
        var times=0;
        if (fast)
        {
            Molpy.RunFastFactory(p);
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
                tool.refresh();
            }
            times++;
        }
        Molpy.FactoryAutomationRun(times,2);
		
//      if(times)
//      {
//          Molpy.GlassNotifyFlush();
//          Molpy.Notify('Ran Factory Automation '+Molpify(times,1)+' times');
//      }
    }
    Molpy.RunFastFactory=function(times) //assumes player did buy AO before getting AA. probably a safe assumption
    {
        var t = Molpy.tfOrder.length;
        while(t--)
        {
            var tool=Molpy.tfOrder[t];
            tool.amount-= times;
        }

        var left = times;
        if(Molpy.Got('CfB'))
        {
              Molpy.DoBlackprintConstruction(left);
        }
        if (left) left=Molpy.FillGlassMouldWork(left);
        if (left) left=Molpy.MakeGlassMouldWork(left);
        if (left) left=Molpy.FillSandMouldWork(left);
        if (left) left=Molpy.MakeSandMouldWork(left);
		
		left=(times+Math.random()*3)/2;
        for(var i=0; i <left; i++) Molpy.RewardBlastFurnace();
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
			return (me.power? '':'When active, ') + 'All Tools, Boosts and Badges are expanded<br>'+(me.power? '<br>':'')+'<input type="Button" onclick="Molpy.ToggleExpando()" value="'+(me.power? 'Deflate':'Expand')+'"></input>';
		}
		,sand:800,castles:20,className:'toggle'
	});
	
	new Molpy.Boost({name:'Sand to Glass',desc:'When Sand is Infinite, Sand Tools produce Glass Chips for Tool Factory', sand:Infinity,castles:Infinity,glass:'200K',group:'hpt'});
	new Molpy.Boost({name:'Castles to Glass',desc:'When Castles are Infinite, Castle Tools produce Glass Chips for Tool Factory', sand:Infinity,castles:Infinity,glass:'2M',group:'hpt'});
	
	{ //#region more lyrics
		var bdy = 'Boom De Yada';
		var love=[
			'I love sandcastles',
			'I love our weird haiku',
			'I love the Book of Time',
			'I love to chart all you!',
			'I love the whole thread',
			'And all its hatted folks',
			bdy,bdy,bdy,bdy,
			'I love sigcouragement',
			'amu<span class="faded">semen</span>tcoffeesea',
			'I love the NewPixBot',
			'I love the Wiki!',
			'I love the whole thread',
			'And all its mysteries',
			bdy,bdy,'Bboz Dr Yndn','Bboz Dr Yndn',
			'I love photomanips',
			'I love our visitors',
			'I love to make you hats!',
			'I love inquisitors',
			'I love the whole thread',
			'The future\'s pretty cool!',
			bdy,bdy,bdy,bdy,
			'I love to journey',
			'I love our beesnakes two',
			'I love Time-mapping',
			'I love to cupcake you!',
			'I love the whole thread',
			'and all its footnote jokes',
			bdy,bdy,bdy,bdy,
			'I love newpages',
			'I love my flashy gif',
			'I <small>(might)</small> love waffles...',
			'I love to make you scripts',
			'I love the whole thread',
			'And all its mysteries',
			bdy,bdy,bdy,'<small>'+bdy+'</small>',
			'I love d-dactyls',
			'I love our blitzers',
			'I love to molpy-hunt',
			'I love the whispers',
			'I love the whole thread',
			'The future\'s pretty cool!',
			bdy,bdy,'<div class="flip">'+bdy+'</div>','<div class="flip">'+bdy+'</div>'
			];
	}
	
	var loveline=0;
	Molpy.ToggleExpando=function()
	{
		var me=Molpy.Boosts['Expando'];
		Molpy.Notify(love[loveline]);
		loveline++;
		if(loveline>=love.length)
		{
			loveline=0;
			if(!me.bought)
			{
				Molpy.RewardRedacted();
				me.buy();
			}
		}
		
		if(!me.bought)
		{
			return;
		}
		me.power=1*!me.power;
		if(!me.power)Molpy.shrinkAll=1;
		me.hoverOnCounter=1
	}
	
	new Molpy.Boost({name:'Frenchbot',desc:'NewPixBots produce 1Q x castles, LaPetite produces 1W x sand', stats:'The Dip of Infinite Judgement Approaches. Do you have 101 Logicats?', 
		sand:'10Q',castles:'10Q',glass:'.5M',group:'cyb'});
	new Molpy.Boost({name:'Bacon',desc:'Knowledge is Power - France is Bacon.<br>NewPixBots produce 10x, LaPetite sand production gains 3% per NewPixBot', 
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
	new Molpy.Boost({name:'Glass Saw',desc:'VITSSÅGEN, JA! makes Glass Blocks from Glass Chips (20 chips each) in the Tool Factory buffer: up to 10M per Glass Ceiling',glass:'7M',sand:Infinity,castles:Infinity,
		buyFunction:function(){this.power=1;}
	});
	new Molpy.Boost({name:'Panther Rush',desc:function(me)
		{
			return 'When you buy this, uses '+Molpify(200*(me.power+1),3)+' Logicat levels to increase the number of times you can use Caged Logicat by 5 per NP'
		},glass:function()
		{
			return 30000000+Molpy.Boosts['Panther Rush'].power*10000000;
		},sand:Infinity,castles:Infinity,
		buyFunction:function()
		{
			Molpy.Boosts['Logicat'].bought-=200*(this.power+1);
			Molpy.Boosts['Logicat'].power-=5*(200*(this.power+1));
			this.power++;
			Molpy.LockBoost(this.aka);
		}
	});
	
	new Molpy.Boost({name:'Ruthless Efficiency',desc:'Glass Block production uses a quarter as many Chips',glass:'12M',sand:'10WW',castles:'10WW', group:'hpt'});
	new Molpy.Boost({name:'Break the Mould',desc:'Allows you to destroy an incomplete or unfilled Mould, if you decide making it was a mistake.',glass:'2M',sand:'10WWW',castles:'10WWW', group:'bean'});
	
	new Molpy.Boost({name:'TF Load Letter',aka:'TFLL',desc:'You can load Tool Factory with 50K Glass Chips at a time',glass:'4M',sand:Infinity,castles:Infinity, group:'hpt'});
	new Molpy.Boost({name:'Booster Glass',aka:'BG',desc:'If you have Infinite Sand, clicking the NewPix gives Tool Factory 4 Glass Chips per Boost owned',glass:'8M',sand:Infinity,castles:Infinity, group:'hpt'});
	new Molpy.Boost({name:'Automation Optimiser',aka:'AO',desc:'Mould Processing does not prevent the standard tasks of Factory Automation from occuring',glass:'20M',sand:Infinity,castles:Infinity, group:'hpt'});
	new Molpy.Boost({name:'Production Control',aka:'PC',
		desc:function(me)
		{
			if(!me.bought) return 'Allows you to change how many copies of Glass Tools can be constructed by Tool Factory each mNP';
			var n = me.power;
			var str='Tool Factory produces up to '+Molpify(n,2)+' of any Glass Tool per mNP.';
			if(Molpy.HasGlassBlocks(1e6*n))
			{
				str+='<br><input type="Button" value="Increase" onclick="Molpy.ControlToolFactory(1)"></input> the rate by 1 at a cost of '+Molpify(1e6*n,1)+' Glass Blocks.';
			}
			if(me.power>0&&Molpy.HasGlassBlocks(1e5*n))
			{
				str+='<br><input type="Button" value="Decrease" onclick="Molpy.ControlToolFactory(-1)"></input> the rate by 1 at a cost of '+Molpify(1e5*n,1)+' Glass Blocks.';
			}
			return str;
		}
		,glass:'30M',sand:Infinity,castles:Infinity, group:'hpt',className:'toggle',
		buyFunction:function(){this.power=1;}
	});
	Molpy.ControlToolFactory=function(n)
	{
		var me = Molpy.Boosts['PC'];
		var cost=1e6*n;
		if(n<0) cost=-1e5*n;
		cost*=me.power;
		if(Molpy.HasGlassBlocks(cost))
		{
			Molpy.SpendGlassBlocks(cost);
			me.power+=n;
			Molpy.Notify('Adjusted production rate of Tool Factory');
		}
	}
	new Molpy.Boost({name:'Panther Poke',desc:'Keeps the Caged Logicat awake a little longer.', group:'bean',
		buyFunction:function(){
			Molpy.Boosts['Caged Logicat'].bought+=1+Molpy.Boosts['Panther Rush'].power;
			Molpy.LockBoost(this.aka);
		}
	});
	new Molpy.Boost({name:'Flipside',
	desc:function(me)
	{
		
		return (me.power? '':'When active, ') + 'Factory constructs Glass Tools that do not have infinite price, instead of Glass Tools that do have infinite price.'+(me.bought?'<br><input type="Button" onclick="Molpy.FlipsideToggle()" value="'+(me.power? 'Dea':'A')+'ctivate"></input>':'');
	}
	,glass:'50M',sand:Infinity,castles:Infinity, group:'hpt',className:'toggle'});
	Molpy.FlipsideToggle=function()
	{
		var me=Molpy.Boosts['Flipside'];
		me.power=1*!me.power;			
		me.hoverOnCounter=1;
	}
	
	new Molpy.Boost({name:'Automata Assemble',aka:'AA',
	desc:function(me)
	{
		
		return (me.power? 'A':'When active, a') + 'fter Tool Factory runs, if all Tool prices are Infinite, uses 1 of each Tool to perform a Factory Automation run.'+(me.bought?'<br><input type="Button" onclick="Molpy.AutoAssembleToggle()" value="'+(me.power? 'Dea':'A')+'ctivate"></input>':'');
	}
	,glass:'50M',sand:Infinity,castles:Infinity, group:'hpt',className:'toggle'});
	Molpy.AutoAssembleToggle=function()
	{
		var me=Molpy.Boosts['AA'];
		me.power=1*!me.power;			
		me.hoverOnCounter=1;
	}
	
	new Molpy.Boost({name:'Glass Mousepy',aka:'GM',desc:'Clicks give 5% of your chips/mNP rate',glass:'10M',sand:Infinity,castles:Infinity, group:'hpt'});
	new Molpy.Boost({name:'Glassed Lightning',aka:'GL',desc:function(me)
		{		
			return Molpify(me.power,1)+'% Glass for '+Molpify(me.countdown,3)+'mNP';
		}
		,icon:'blitzing',className:'alert',startCountdown:25,startPower:400
	});
	
	new Molpy.Boost({name:'Automata Control',aka:'AC',
		desc:function(me)
		{
			if(!me.bought) return 'Allows you to change the number of times Automata Assemble tries to run Factory Automation after Tool Factory.<br>(Otherwise it defaults to the level from Production Control)';
			var n = me.power;
			var str='Automata Assemble attempts up to '+Molpify(n,2)+' Factory Automation runs.';
			if(me.power<Molpy.Boosts['PC'].power&&Molpy.HasGlassChips(1e7*Math.pow(1.2,n)))
			{
				str+='<br><input type="Button" value="Increase" onclick="Molpy.ControlAutomata(1)"></input> the number of runs by 1 at a cost of '+Molpify(1e7*Math.pow(1.2,n),2)+' Glass Chips and '+Molpify(n*2,2)+' Blackprint Pages.';
			}
			if(me.power>1&&Molpy.HasGlassChips(1e5*n))
			{
				str+='<br><input type="Button" value="Decrease" onclick="Molpy.ControlAutomata(-1)"></input> the number of runs by 1 at a cost of '+Molpify(1e5*n,1)+' Glass Chips.';
			}
			return str;
		}
		,glass:'25M',sand:Infinity,castles:Infinity, group:'hpt',className:'toggle',
		buyFunction:function(){this.power=1;}
	});
	Molpy.ControlAutomata=function(n)
	{
		var me = Molpy.Boosts['AC'];
		var cost=1e7*Math.pow(1.2,me.power);
		var pages=2*me.power;
		if(n<0)
		{
			cost=-1e5*me.power;
			pages=0;
		}
		if(Molpy.HasGlassChips(cost))
		{
			if(!Molpy.HasSpareBlackprints(pages))
			{
				Molpy.Notify('You need more Blackprint Pages');
				return;
			}
			Molpy.Boosts['Blackprints'].power-=pages;
			Molpy.SpendGlassChips(cost);
			me.power+=n;
			Molpy.Notify('Adjusted Automata Assemble');
		}
	}
	new Molpy.Boost({name:'Bottle Battle',desc:'NewPixBot Glass production is multiplied by 3',glass:'10M',sand:Infinity,castles:Infinity});
	new Molpy.Boost({name:'Leggy',desc:'Scaffold Glass production is multiplied by 8',glass:'15M',sand:Infinity,castles:Infinity});
	new Molpy.Boost({name:'Clear Wash',desc:'Wave Glass production is multiplied by 10',glass:'15M',sand:Infinity,castles:Infinity});
	new Molpy.Boost({name:'Crystal Streams',desc:'River Glass production is multiplied by 12',glass:'20M',sand:Infinity,castles:Infinity});
	new Molpy.Boost({name:'Super Visor',desc:'Beanie Builder Glass production is multiplied by 15',glass:'20M',sand:Infinity,castles:Infinity});
	new Molpy.Boost({name:'Crystal Helm',desc:'Beanie Builder Glass production is multiplied by 5',glass:'30M',sand:Infinity,castles:Infinity});
	
	new Molpy.Boost({name:'Safety Goggles',aka:'SG',desc:'The goggles, they do something!',
		glass:'2M'		
	});
		
    new Molpy.Boost({name:'Seaish Glass Chips', desc:'Allows Sand Purifier and Sand Refinery to increase as far as your resources allow', glass:'100K'});
    new Molpy.Boost({name:'Seaish Glass Blocks', desc:'Allows Glass Extruder and Glass Chiller to increase as far as your resources allow', glass:'100K'});

	
	
	Molpy.groupNames={
		boosts:['boost','Boosts'],
		badges:['badge','Badges'],
		hpt:['hill people tech','Hill People Tech','boost_department'],
		ninj:['ninjutsu','Ninjutsu','boost_ninjabuilder'],
		chron:['chronotech','Chronotech','boost_lateclosing'],
		cyb:['cybernetics','Cybernetics','boost_robotefficiency'],
		bean:['beanie tech','Beanie Tech','boost_chateau'],
		discov:['discoveries','Discoveries',0,'Discovery','A memorable discovery'],
		monums:['sand monuments','Sand Monuments',0,'Sand Monument', 'A sand structure commemorating'],
		monumg:['glass monuments','Glass Monuments',0,'Glass Monument','A glass sculpture commemorating'],
		diamm:['masterpieces','Masterpieces',0,'Masterpiece','This is a diamond masterpice.<br>All craftottership is of the highest quality.<br>On the masterpiece is an image of','in diamond. <br>It molpifies with spikes of treeishness.'],
	};
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
	
	new Molpy.Badge({name:'Ninja', desc:'Ninja a NewPixBot',stats:'The pope starts to dig some sand. A black figure swings from a rope from the ceiling.'});
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
		},vis:2,icon:'judgementdipwarning',classChange:function(){return Molpy.CheckJudgeClass(this,0,'alert');}});
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
			div/=Molpy.BagBurnDiv();
		}
		return baseVal/div;
	}
	Molpy.BagBurnDiv=function()
	{
		return Math.min(1e294, Math.pow(1.4,Math.max(0,(Molpy.SandTools['Bag'].amount-Molpy.npbDoubleThreshhold)/2)));
	}
	Molpy.JudgementDipReport=function()
	{
		var bot=Molpy.CastleTools['NewPixBot'];
		var bots = bot.amount;
		if(Molpy.Got('Time Travel')||Molpy.newpixNumber<20)bots-=2;
		var botCastles=bot.totalCastlesBuilt*bots;
		var thresh = Molpy.JudgementDipThreshhold();
		var level = Math.max(0,Math.floor(botCastles/thresh));
		if(Molpy.Got('Bag Burning'))
		{
			var nobagLevel = Math.max(0,Math.floor((Molpy.BagBurnDiv()/thresh)*botCastles));
			if(nobagLevel>Math.pow(2,Molpy.Boosts['Bag Burning'].power)+6)
			{
				var rate = Molpy.BurnBags(Molpy.Boosts['Bag Burning'].power+1,1);
				Molpy.Boosts['Bag Burning'].power+=0.5*rate;
				if(Molpy.SandTools['Bag'].amount<Molpy.npbDoubleThreshhold)
				{
					Molpy.Notify('The NewPixBots extinguished the burning Bags!',1);
					Molpy.LockBoost('Bag Burning');
				}
			}
		}
		var countdown = ((level+1)*thresh - botCastles);
		countdown/=(bot.buildC()*bot.amount*bot.amount);
		if(Molpy.Got('Doublepost'))countdown/=2;
		countdown/=Molpy.globalCastleMult; //this is a bit approximate because of its rounding, but close enough for this, hopefully
		if(isNaN(countdown)||countdown<0)countdown=0;
		if(Molpy.Boosts['Coma Molpy Style'].power)
		{
			level=Math.floor(level/2);
		}
		var maxDipLevel=Molpy.MaxDipLevel(Molpy.newpixNumber);
		if(level > maxDipLevel)
		{
			level = maxDipLevel;
			countdown=0;
			while(Molpy.MaxDipLevel(Molpy.newpixNumber+countdown)<=level)
			{
				countdown++;
			}
		}
		
		Molpy.RewardDipLevel(level);
		return [level,Math.ceil(countdown)];
	}
	Molpy.MaxDipLevel=function(np)
	{
		var maxDipLevel=Math.floor(Math.pow(2,Math.max(0,(np-200))*Math.max(0,np-200)/250+np/2-20));
		return maxDipLevel;
	}
	Molpy.RewardDipLevel=function(level)
	{
	
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
			if(Molpy.Got('Minigun')||Molpy.Got('Stacked'))
				Molpy.Boosts['Big Splash'].department=1;
		}
		if(level>8)
		{
			if(Molpy.Got('Stacked')||Molpy.Got('Big Splash'))
				Molpy.Boosts['Irregular Rivers'].department=1;
		}
		if(level>12)
		{
			if(Molpy.Got('Big Splash')||Molpy.Got('Irregular Rivers'))
				Molpy.Boosts['NewPixBot Navigation Code'].department=1;
			Molpy.EarnBadge('On the 12th Dip of Judgement');
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
	}
	Molpy.JDestroyAmount=function()
	{
		var j=Molpy.judgeLevel-1;
		if(j<1)return 0;
		var a=Math.pow(j,1+Math.min(1,j/1000000)-Math.min(1,j/1e150));
		var b=Math.max(1,Math.min(1e12,j/1e150));
		return a*b;
	}
	new Molpy.Badge({name:'Judgement Dip',
		desc:function()
		{
			if(Molpy.Boosts['NewPixBot Navigation Code'].power) return 'The Bots have been foiled by altered navigation code';
			var j=Molpy.JDestroyAmount();
			if(j<1) return 'Safe. For now.';
			return 'The NewPixBots destroy ' + Molpify(j) + ' Castle'+(j==1?'':'s')+' each per mNP';			
		}
		,vis:3,icon:'judgementdip',classChange:function(){return Molpy.CheckJudgeClass(this,1,'alert');}});
	new Molpy.Badge({name:'Fast Forward',desc:'Travel Back to the Future',vis:1});
	new Molpy.Badge({name:'And Back',desc:'Return to the Past',vis:1});
	new Molpy.Badge({name:'Primer',desc:'Travel through Time 10 Times',vis:1});
	new Molpy.Badge({name:'Wimey',desc:'Travel through Time 40 Times',vis:1});
	new Molpy.Badge({name:'Hot Tub',desc:'Travel through Time 160 Times',vis:1});
	new Molpy.Badge({name:"Dude, Where's my DeLorean?",desc:'Travel through Time 640 Times',vis:1});
	new Molpy.Badge({name:'Use Your Leopard',desc:'Get a click by using your leopard to simulate reloading the page'});
	new Molpy.Badge({name:'Badge Not Found',desc:'Description Not Found'});
	new Molpy.Badge({name:'Fractals Forever',desc:'Reach Fractal Level 60, and Fractal Sandcastles will be retained if you Molpy Down.'});
	new Molpy.Badge({name:'Recursion',
		desc:function(){return 'Yo Dawg, we heard you earned '+Molpify(DeMolpify('50G'))+' Sand by clicking...';}
		});
	new Molpy.Badge({name:'Big Spender',
		desc:function(){return 'Spend '+Molpify(DeMolpify('200M'))+' Castles total';}
		});
	new Molpy.Badge({name:'Valued Customer',
		desc:function(){return 'Spend '+Molpify(DeMolpify('80G'))+' Castles total';}
		});
	new Molpy.Badge({name:'Beachscaper',desc:'Have 200 Sand Tools'});
	new Molpy.Badge({name:'Beachmover',desc:'Have 100 Castle Tools'});
	new Molpy.Badge({name:'Better This Way',desc:'Purchase 50 Boosts',stats:'So you\'re telling me Badgers build the castle by firing boots at the sand with trebuchets?'});
	new Molpy.Badge({name:'Recursion ',desc:'To Earn Recursion, you must first earn Recursion'});
	new Molpy.Badge({name:'Beachomancer',desc:'Have 1000 Sand Tools'});
	new Molpy.Badge({name:'Beachineer',desc:'Have 500 Castle Tools'});
	new Molpy.Badge({name:'Glass Factory',desc:'Have 80M sand'});
	new Molpy.Badge({name:'Glassblower',desc:'Make a Glass Block',vis:1});
	new Molpy.Badge({name:'Ninja Pact',desc:'Have a ninja stealth streak over 4K'});
	new Molpy.Badge({name:'Ninja Unity',desc:'Have a ninja stealth streak over 4M'});
	new Molpy.Badge({name:'Unreachable?', desc:'Build a total of 2T Castles. (I GUESS <b>SUPPOSE <i>MAYBE</i></b> IT WILL BE AN ISLAND <b>AGAIN</b>.))',vis:1});
	new Molpy.Badge({name:'Flung',desc:'Have 50 Trebuchets'});
	new Molpy.Badge({name:'People Eating Tasty Animals',desc:'Have 1 Peta Castle'});
	new Molpy.Badge({name:'Y U NO RUN OUT OF SPACE?',desc:'Have 1 Yotta Castle'});
	new Molpy.Badge({name:'Dumpty',desc:'Have 1 Umpty Castle'});
	new Molpy.Badge({name:'This is a silly number',desc:'Have 1 Squilli Castle'});
	new Molpy.Badge({name:'To Da Choppah',desc:'Have 1 Helo Castle'});
	new Molpy.Badge({name:'Toasters',desc:'Have 1 Ferro Castle'});
	new Molpy.Badge({name:'All Your Base',desc:'Have 2101 Sand Tools'});
	new Molpy.Badge({name:'Look Before You Leap',desc:'Have 3000 Sand Tools'});
	new Molpy.Badge({name:'Fully Armed and Operational Battlestation',desc:'Have 4000 Castle Tools'});
	new Molpy.Badge({name:'WHAT',desc:'Have over nine thousand Sand Tools',vis:1});
	new Molpy.Badge({name:'\\/\\/AR]-[AMMER',desc:'Have 40K Tools',vis:1});
	new Molpy.Badge({name:'Ceiling Broken',desc:'Have all 10 Glass Ceiling Boosts',stats:'allegedly'});
	new Molpy.Badge({name:'On the 12th Dip of Judgement',desc:'Reach Judgement Dip level 12'});
	new Molpy.Badge({name:'Machine Learning',desc:'Unlock all the Judgement Dip Boosts'});
	new Molpy.Badge({name:'Blitz and Pieces',desc:'Get Blitz Power to 1M%'});
	new Molpy.Badge({name:'Mustard Cleanup',desc:'Your numbers got too big!',vis:2});
	new Molpy.Badge({name:'Pyramid of Giza',desc:'Have 7,016,280 Glass Blocks'});
	new Molpy.Badge({name:'Personal Computer',desc:'Have 640K Glass Chips'});
	new Molpy.Badge({name:'I love my flashy gif',desc:'Change the colourscheme 20 times in a mNP',vis:1});
	new Molpy.Badge({name:'Dubya',desc:'Have at least a Wololo Castles',vis:1});
	new Molpy.Badge({name:'Rub a Dub Dub',desc:'Have at least a Wololo Wololo Castles',vis:1});
	new Molpy.Badge({name:'WWW',desc:'Have at least a Wololo Wololo Wololo Castles',vis:1});
	new Molpy.Badge({name:'Age of Empires',desc:'Have at least a Wololo Wololo Wololo Wololo Castles',vis:1});
	
	for(var i in Molpy.SandToolsById)
	{
		var t = Molpy.SandToolsById[i];
		new Molpy.Badge({name:t.name+' Shop Failed',desc:'The price of '+t.name+' is too ch*rping high!',vis:2});
	}
	for(var i in Molpy.CastleToolsById)
	{
		var t = Molpy.CastleToolsById[i];
		new Molpy.Badge({name:t.name+' Shop Failed',desc:'The price of '+t.name+' is too ch*rping high!',vis:2});
	}
	
	new Molpy.Badge({name:'Queue',desc:'Have at least a Quita Castles',vis:1});
	new Molpy.Badge({name:'What Queue',desc:'Have at least a Wololo Quita Castles',vis:1});
	new Molpy.Badge({name:'Everything but the Kitchen Windows',desc:'Have Infinite Sand and Castles'});
	new Molpy.Badge({name:'Ceiling Disintegrated',desc:'Have all 12 Glass Ceiling Boosts',vis:1});
	
	
	new Molpy.Badge({name:'KiloNinja Strike', desc:'Ninja 1K NewPixBots simultaneously',vis:1});
	new Molpy.Badge({name:'MegaNinja Strike', desc:'Ninja 1M NewPixBots simultaneously',vis:1});
	new Molpy.Badge({name:'GigaNinja Strike', desc:'Ninja 1G NewPixBots simultaneously',vis:1});
	
	
	//*************************************************
	//these MUST go last: add any new badges BEFORE them
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
	//Molpy.MakeQuadBadge({np:,name:'',desc:''});
}

Molpy.jDipBoosts=['NewPixBot Navigation Code','Irregular Rivers','Big Splash','Stacked','Minigun','Ninja Assistants'];		
Molpy.CheckBuyUnlocks=function()
{
	if(Molpy.needlePulling)return;
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
	if((me.amount>=100)&&Molpy.Earned('Flung'))Molpy.UnlockBoost('Human Cannonball');
	
	me=Molpy.SandTools['Flag'];
	if(me.amount>=1)Molpy.UnlockBoost('Flag Bearer');
	if(me.amount>=2)Molpy.UnlockBoost('War Banner');
	if(me.amount>=6)Molpy.UnlockBoost('Magic Mountain');
	if(me.amount>=Molpy.npbDoubleThreshhold)Molpy.UnlockBoost('Standardbot');
	if(me.amount>=25)Molpy.UnlockBoost('Chequered Flag');
	if(me.amount>=40)Molpy.UnlockBoost('Skull and Crossbones');
	if((me.amount>=100)&&Molpy.Earned('Flung'))Molpy.UnlockBoost('Fly the Flag');
	
	me=Molpy.SandTools['Ladder'];
	if(me.amount>=1)Molpy.UnlockBoost('Extension Ladder');
	if(me.amount>=Molpy.npbDoubleThreshhold)Molpy.UnlockBoost('Climbbot');
	if(me.amount>=25)Molpy.UnlockBoost('Broken Rung');
	if((me.amount>=100)&&Molpy.Earned('Flung'))Molpy.UnlockBoost('Up Up and Away');
	
	me=Molpy.CastleTools['NewPixBot'];
	if(me.amount>=3)Molpy.UnlockBoost('Busy Bot');
	if(me.amount>=8)Molpy.UnlockBoost('Robot Efficiency');
	if(me.amount>=Molpy.npbDoubleThreshhold&&Molpy.Got('Robot Efficiency'))Molpy.UnlockBoost('Recursivebot');
	if(me.amount>=17)Molpy.UnlockBoost('HAL-0-Kitty');
	if(me.amount>=22 && Molpy.Got('DoRD'))Molpy.UnlockBoost('Factory Automation');
	 
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
	if(me.amount>=30)Molpy.UnlockBoost('SBTF');
	
	me=Molpy.SandTools['Bag'];
	if(me.amount>=2)Molpy.UnlockBoost('Embaggening');
	if(me.amount>=Molpy.npbDoubleThreshhold)Molpy.UnlockBoost('Luggagebot');
	if(me.amount>=30)Molpy.UnlockBoost('Bag Puns');
	if((me.amount>=100)&&Molpy.Earned('Flung'))Molpy.UnlockBoost('Air Drop');
	var you=me;
	me = Molpy.CastleTools['River'];
	if(me.amount&&you.amount)Molpy.UnlockBoost('Sandbag');
	if(me.amount>=Molpy.npbDoubleThreshhold)Molpy.UnlockBoost('Smallbot');
	
	me=Molpy.SandTools['LaPetite'];
	if(me.amount>1000)
	{
		Molpy.UnlockBoost('Frenchbot');
	}
	if(Molpy.Earned('Fractals Forever')&& !Molpy.Got('Fractal Sandcastles'))
	{
		Molpy.UnlockBoost('Fractal Sandcastles');	
		Molpy.Boosts['Fractal Sandcastles'].power=0;	
		Molpy.Boosts['Fractal Sandcastles'].bought=1; //woo freebie!
		Molpy.boostRepaint=1;
		Molpy.recalculateDig=1;
		Molpy.BoostsOwned++;
	}	
	
	Molpy.Boosts['ASHF'].startPower=0.4;
	if(Molpy.castlesSpent>200000000)
	{
		Molpy.EarnBadge('Big Spender');
		Molpy.Boosts['ASHF'].startPower=0.5;
	}
	if(Molpy.castlesSpent>80000000000)
	{
		Molpy.EarnBadge('Valued Customer');
		Molpy.Boosts['ASHF'].startPower=0.6;
	}
	Molpy.Boosts['ASHF'].startCountdown=5;
	if(Molpy.Got('Late Closing Hours'))
	{
		Molpy.Boosts['ASHF'].startCountdown=10;
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
	
	if(Molpy.SandToolsOwned>=2101)Molpy.EarnBadge('All Your Base');
	if(Molpy.SandToolsOwned>=3000)Molpy.EarnBadge('Look Before You Leap');
	if(Molpy.CastleToolsOwned>=4000)Molpy.EarnBadge('Fully Armed and Operational Battlestation');
	if(Molpy.SandToolsOwned>9000)Molpy.EarnBadge('WHAT');
	if(Molpy.SandToolsOwned+Molpy.CastleToolsOwned>=40000)Molpy.EarnBadge('\\/\\/AR]-[AMMER');
		
	if(Molpy.Got('Ninja Builder')&&Molpy.Boosts['Glass Block Storage'].power>10)
		Molpy.UnlockBoost('Glass Jaw');
	
	
	if(Molpy.redactedClicks>=554 && (Molpy.Got('Overcompensating') || Molpy.Got('Doublepost')))
	{
		Molpy.UnlockBoost('Redundant Redundance Supply of Redundancy');
	}else{
		Molpy.LockBoost('Redundant Redundance Supply of Redundancy'); //prevent use in shortpix!
	}

	if(Molpy.GlassCeilingCount())
		Molpy.GlassCeilingUnlockCheck();
	if(Molpy.SandToolsOwned>=123)Molpy.UnlockBoost('Sand Tool Multi-Buy');
	if(Molpy.CastleToolsOwned>=234)Molpy.UnlockBoost('Castle Tool Multi-Buy');
	
	if(Molpy.Got('NewPixBot Navigation Code')) //just in case they didn't earn it the normal way
	{
		Molpy.EarnBadge('On the 12th Dip of Judgement');
	}
	if(Molpy.groupBadgeCounts.discov>10&&Molpy.Earned("Dude, Where's my DeLorean?"))
	{
		Molpy.UnlockBoost('Memories Revisited');
	}
	
	if(Molpy.HasGlassBlocks(7016280))Molpy.EarnBadge('Pyramid of Giza');
	if(Molpy.HasGlassChips(640000))Molpy.EarnBadge('Personal Computer');	
	
	if (Molpy.Boosts['Sand Purifier'].power > 1000) Molpy.UnlockBoost('Seaish Glass Chips');
	if (Molpy.Boosts['Glass Extruder'].power > 1000) Molpy.UnlockBoost('Seaish Glass Blocks');

}

Molpy.CheckRewards=function(automationLevel)
{

	if(Molpy.Got('Factory Automation'))
	{
		Molpy.Boosts['Blast Furnace'].department=1;
	}
	if(Molpy.Got('SBTF'))
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
	
	if(Molpy.redactedClicks>=320 && (Molpy.Got('Overcompensating') || Molpy.Got('Doublepost')))
	{
		Molpy.Boosts['Redunception'].department=1;
	}else{
		Molpy.LockBoost('Redunception'); //prevent use in shortpix!
		Molpy.Boosts['Redunception'].department=0;
	}
	if(Molpy.redactedClicks>=776)
	{
		Molpy.Boosts['Logicat'].department=1;
	}
	if(Molpy.redactedClicks>=431)
	{
		Molpy.Boosts['Technicolour Dream Cat'].department=1;
	}
	
	Molpy.Boosts['RRR'].department=1*(Molpy.Boosts['Panther Salve'].power > 200);	
	Molpy.Boosts['Redundant Raptor'].logic=2*(Molpy.Boosts['Panther Salve'].power > 500);	
	Molpy.Boosts['Catamaran'].logic=4*(Molpy.Boosts['Panther Salve'].power > 800);
	Molpy.Boosts['LCB'].logic=6*(Molpy.Boosts['Panther Salve'].power > 1200);	
	Molpy.Boosts['Phonesaw'].department=1*(Molpy.Boosts['VJ'].power >=88);		
	Molpy.Boosts['Ninjasaw'].logic=16*(Molpy.Got('Phonesaw'));
	
	var found=0;
	for(var i in Molpy.jDipBoosts)
	{
		var me = Molpy.Boosts[Molpy.jDipBoosts[i]];
		if(found&&!me.unlocked) me.department=1;
		if(me.unlocked) found++;
	}
	if(found==Molpy.jDipBoosts.length)
	{
		Molpy.EarnBadge('Machine Learning');
	}
	if(Molpy.Got('Flux Turbine')&&isFinite(Molpy.castles))
	{
		Molpy.Boosts['Flux Surge'].logic=4;
	}else
	{
		Molpy.Boosts['Flux Surge'].logic=0;
	}
	var finiteC = 1*isFinite(Molpy.castles);
	var finiteP=0;
	if(finiteC)
	{
		for(var i in Molpy.SandTools)
		{
			if(isFinite(Molpy.priceFactor*Molpy.SandTools[i].price))
			{
				finiteP=1;
				break;
			}
		}
		if(!finiteP)
		{
			for(var i in Molpy.CastleTools)
			{
				if(isFinite(Molpy.priceFactor*Molpy.CastleTools[i].price))
				{
					finiteP=1;
					break;
				}
			}
		}
	}
	Molpy.Boosts['Temporal Duplication'].logic=finiteC*finiteP;
	Molpy.Boosts['Temporal Rift'].logic=3*isFinite(Molpy.castles);
	
	Molpy.Boosts['Facebugs'].department=1*(Molpy.groupBadgeCounts.discov>20&&Molpy.Got('Ch*rpies'));
	Molpy.Boosts['Badgers'].department=1*(Molpy.groupBadgeCounts.monums>20&&Molpy.Got('Facebugs'));
	if(Molpy.Boosts['Locked Crate'].unlocked||Molpy.Got('The Key Thing'))
	{
		Molpy.Boosts['Crate Key'].logic=4;
	}else
	{
		Molpy.Boosts['Crate Key'].logic=0;
	}
	Molpy.CheckBlackprintDepartment();
	
	Molpy.Boosts['Fractal Fractals'].department=1*(Molpy.Boosts['Fractal Sandcastles'].power>=120);
	
	var key = Molpy.Boosts['Crate Key'];
	key.department=0;
	if(key.logic&&automationLevel>=10&&Math.floor(Math.random()*3)==0&&Molpy.Got('Keygrinder'))
	{
		key.department=1;						
	}
	Molpy.CheckASHF();
	var i = 10;
	var b = 1*Molpy.Earned('Ceiling Broken');
	while(i--)
	{
		Molpy.Boosts['Glass Ceiling '+i].department=b;
	}
	b=1*Molpy.Earned('Ceiling Disintegrated');
	Molpy.Boosts['Glass Ceiling 10'].department=b;
	Molpy.Boosts['Glass Ceiling 11'].department=b;
	
	if(Molpy.Got('Air Drop'))Molpy.Boosts['Schizoblitz'].department=1;
	if(Molpy.Got('Free Advice'))
	{
		Molpy.Boosts['Glass Ceiling 0'].department=1;
		if(Molpy.Earned('Beachomancer'))
			Molpy.Boosts['BBC'].department=1;
	}
	Molpy.Boosts['Bucking the Trend'].logic=10*(Molpy.SandTools['Bucket'].amount>=10000);
	Molpy.Boosts['Crystal Well'].logic=20*(Molpy.SandTools['Bucket'].amount>=20000);
	Molpy.Boosts['Glass Spades'].logic=30*(Molpy.SandTools['Cuegan'].amount>=10000);
	Molpy.Boosts['Statuesque'].logic=40*(Molpy.SandTools['Cuegan'].amount>=20000);
	Molpy.Boosts['Flag in the Window'].logic=50*(Molpy.SandTools['Flag'].amount>=10000);
	Molpy.Boosts['Crystal Wind'].logic=60*(Molpy.SandTools['Flag'].amount>=20000);
	Molpy.Boosts['Crystal Peak'].logic=70*(Molpy.SandTools['Ladder'].amount>=15000);
	Molpy.Boosts['Cupholder'].logic=80*(Molpy.SandTools['Bag'].amount>=12000);
	Molpy.Boosts['Tiny Glasses'].logic=90*(Molpy.SandTools['LaPetite'].amount>=8000);
	Molpy.Boosts['Glass Saw'].logic=150*(Molpy.glassPermNP>=4000);
	
	Molpy.Boosts['Panther Rush'].logic=200*(Molpy.Boosts['Panther Rush'].power+1);
	Molpy.Boosts['Ruthless Efficiency'].department=1*(Molpy.Boosts['Glass Chiller'].power>=1234);
	Molpy.Boosts['Break the Mould'].department=1*(Molpy.Boosts['Break the Mould'].power>=100);
	
	Molpy.Boosts['PC'].department=1*(Molpy.Got('Tool Factory')&&Molpy.CastleTools['NewPixBot'].amount>=5000);
	Molpy.Boosts['AC'].logic=440*(Molpy.Got('AA')&&(Molpy.CastleTools['NewPixBot'].amount>=7500?50000/Molpy.CastleTools['NewPixBot'].amount:0));
	Molpy.Boosts['Panther Poke'].department=1*(automationLevel>8&&Molpy.redactedClicks>2500&&Molpy.Got('Caged Logicat')&&Molpy.Boosts['Caged Logicat'].bought<4&&Math.floor(Math.random()*4)==0);
	Molpy.Boosts['Flipside'].logic=220*Molpy.Got('AA');
	
	Molpy.Boosts['GM'].department=1*(Molpy.chipsManual>=1e6);
	Molpy.Boosts['GL'].department=1*(Molpy.chipsManual>=5e6);
	Molpy.Boosts['Bottle Battle'].logic=150*(Molpy.CastleTools['NewPixBot'].amount>=10000);	
	Molpy.Boosts['Stained Glass Launcher'].logic=160*(Molpy.CastleTools['Trebuchet'].amount>=4000);	
	Molpy.Boosts['Leggy'].logic=180*(Molpy.CastleTools['Scaffold'].amount>=5000);	
	Molpy.Boosts['Clear Wash'].logic=200*(Molpy.CastleTools['Wave'].amount>=5000);	
	Molpy.Boosts['Crystal Streams'].logic=220*(Molpy.CastleTools['River'].amount>=6000);	
	Molpy.Boosts['Super Visor'].logic=240*(Molpy.CastleTools['Beanie Builder'].amount>=6000);	
	Molpy.Boosts['Crystal Helm'].logic=300*(Molpy.CastleTools['Beanie Builder'].amount>=12000);	
				
}
	
Molpy.CheckASHF=function()
{
	Molpy.Boosts['ASHF'].department=0;
	if(Molpy.BoostsInShop.length)
	{
		Molpy.Boosts['ASHF'].department=1;
		return;
	}
	if(!isFinite(Molpy.castles))return;
	for(var i in Molpy.SandTools)
	{
		if(isFinite(Molpy.priceFactor*Molpy.SandTools[i].price))
		{
			Molpy.Boosts['ASHF'].department=1;
			return;
		}
	}
	for(var i in Molpy.CastleTools)
	{
		if(isFinite(Molpy.priceFactor*Molpy.CastleTools[i].price))
		{
			Molpy.Boosts['ASHF'].department=1;
			return;
		}
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
    var c, c1, c2, c3 = 0;

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
var BlitzGirl={ChallengeAccepted:'JTI1M0NpJTI1M0VNb2xweSUyNTIwbW9scHklMjUyMG1vbHB5JTI1MjBtb2xweSUyNTJDJTI1M0NiciUyNTNFTW9scHklMjUyMG1vbHB5JTI1MjBtb2xweSUyNTIwbW9scHkuJTI1M0NiciUyNTNFTW9scHklMjUyMG1vbHB5JTI1MjBtb2xweSUyNTIwbW9scHklMjUyQyUyNTNDYnIlMjUzRUdyYXBldmluZSUyNTJDJTI1MjBncmFwZXZpbmUuJTI1M0MlMjUyRmklMjUzRQ==',Apolpgy:'TGV0JTI1MjBpdCUyNTIwYmUlMjUyMGtub3duJTI1MjB0aGF0JTI1MjB0aGlzJTI1MjBpcyUyNTIwYW4lMjUyMGFwb2xvZ3klMjUyMHRoYXQlMjUyMFRpbWUlMjUyMFRyYXZlbCUyNTIwd2FzJTI1MjBicm9rZW4lMjUyQyUyNTIwc3BlY2lmaWNhbGx5JTI1MjB0byUyNTIwQmxpdHpHaXJsJTI1MjAlMjUzQ3NtYWxsJTI1M0UlMjglMjUzQ2IlMjUzRUtuaWdodCUyNTIwVGVtcG9yYWwlMjUzQyUyNTJGYiUyNTNFJTI1MjBvZiUyNTIwdGhlJTI1MjBPbmUlMjUyMFRydWUlMjUyMENvbWljJTI1MkMlMjUyMEJsaXR6R2lybCUyNTIwdGhlJTI1MjBGaXJzdCUyNTJDJTI1MjBNb3BleSUyNTIwTW9scHklMjUyME1vbWUlMjUyQyUyNTIwT3R0aWZhY3RvciUyNTIwU3VwZXJpb3IlMjUyQyUyNTIwRmlyc3QlMjUyMG9mJTI1MjB0aGUlMjUyMFRydWUlMjUyMEZvbGxvd2VycyUyNTIwb2YlMjUyMFRpbWUlMjdzJTI1MjBUaW1lJTI1MkMlMjUyMFBhdHJpYXJjaCUyNTIwb2YlMjUyMHRoZSUyNTIwV2VzdGVybiUyNTIwUGFyYWRveCUyNTIwQ2h1cmNoJTI1MkMlMjUyMEdyZWF0JTI1MjBQaWxncmltJTI1MjBvZiUyNTIwdGhlJTI1MjBPbmUlMjUyMFRydWUlMjUyMENvbWljJTI1MkMlMjUyMEdyZWF0ZXN0JTI1MjBHcmFpbiUyNTIwb24lMjUyMHRoZSUyNTIwQmVhY2glMjUyMG9mJTI1MjBUaW1lJTI1MkMlMjUyMEhvcGUlMjUyMG9mJTI1MjB0aGUlMjUyME5vbi1Db21taXR0YWwlMjUyMFdhaXRlcnMlMjUyQyUyNTIwVGltZSUyNTIwQXJjaGl0ZWN0JTI1MjBvZiUyNTIwU2lnbnBvc3RpbmclMjUyQyUyNTIwU3VwcmVtZSUyNTIwT2JzZXJ2ZXIlMjUyMG9mJTI1MjBUaW1lJTI1MkMlMjUyMFNhaW50JTI1MjBvZiUyNTIwdGhlJTI1MjBUaW1ld2FpdGVycyUyNTJDJTI1MjBDYXJkaW5hbCUyNTIwVGVtcHVzJTI1MjBWaWF0b3IlMjUyQyUyNTIwQXJjaGJpc2hvcCUyNTIwb2YlMjUyMHRoZSUyNTIwUGFzdCUyNTJDJTI1MjBUcm91YmFkb3VyJTI1MjBvZiUyNTIwVGltZSUyNTJDJTI1MjBUaGUlMjUyMEJhcmQlMjUyMG9mJTI1MjBUaGUtQmVmb3JlJTI1MkMlMjUyMFRoZSUyNTIwUG9ldGVzcyUyNTIwb2YlMjUyMFRoZS1QcmVzZW50JTI1MkMlMjUyMFZlcnNpZmllciUyNTIwb2YlMjUyMFZveWFnZXMtWWV0LVRvLUJlJTI1MkMlMjUyME1vc3QlMjUyMFRydWUlMjUyMEZvbGxvd2VyZXIlMjUyQyUyNTIwQmVhdGVyJTI1MjBvZiUyNTIwUGFyYWRveGVzJTI1MkMlMjUyMEdob3N0JTI1MjBvZiUyNTIwUHJlc2VudFBpeCUyNTJDJTI1MjBJbmNvbWluZyUyNTIwSHVycmljYW5lJTI1MkMlMjUyME9tbmlsZWN0b3IlMjUyMG9mJTI1MjBUaW1lJTI1MkMlMjUyMFByaW5jZXNzJTI1MjBvZiUyNTIwUGVyc2lhJTI1MkMlMjUyMFJlZCUyNTIwU3BpZGVycyUyNTIwRXllcyUyNTJDJTI1MjBMYVBldGl0ZSUyNTIwQmxpdHpHaXJsJTI1MkMlMjUyMFNpc3RlciUyNTIwaW4lMjUyMFdhaXRpbmclMjUyQyUyNTIwQmlnJTI1MjBLbm93SXRBbGwlMjUyQyUyNTIwQmxpdHpyYW5kaXIlMjUyQyUyNTIwUmVhZGVyJTI1MkMlMjUyMEIuTy5CLiUyOSUyNTNDJTI1MkZzbWFsbCUyNTNF'};