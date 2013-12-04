'use strict';
/* In which some Helper functions are defined
+++++++++++++++++++++++++++++++++++++++++++++*/
function g(id) {return document.getElementById(id);}
function ONGsnip(time)
{
	if(time.getMinutes()>=30&&Math.abs(Molpy.newpixNumber) <= 240)
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
{limit:1e210,divisor:1e210,postfix:['Q',' Quita']},
{limit:1e42,divisor:1e42,postfix:['W',' Wololo']},
{limit:1e39,divisor:1e39,postfix:['L',' Lotta']},
{limit:1e36,divisor:1e36,postfix:['F',' Ferro']},
{limit:1e33,divisor:1e33,postfix:['H',' Helo']}, //or Ballard
{limit:1e30,divisor:1e30,postfix:['S',' Squilli']},
{limit:1e27,divisor:1e27,postfix:['U',' Umpty']},

{limit:1e24,divisor:1e24,postfix:['Y',' Yotta']},
{limit:1e21,divisor:1e21,postfix:['Z',' Zeta']},
{limit:1e18,divisor:1e18,postfix:['E',' Exa']},
{limit:1e15,divisor:1e15,postfix:['P',' Peta']},
{limit:1e12,divisor:1e12,postfix:['T',' Tera']},
{limit:1e9,divisor:1e9,postfix:['G',' Giga']},
{limit:1e6,divisor:1e6,postfix:['M',' Mega']},
{limit:9e3,divisor:1e3,postfix:['K',' Kilo']}, //WHAT
];
function Molpify(number, raftcastle, shrinkify)
{
	if(isNaN(number))return'Mustard';
	if(!isFinite(parseFloat(number)))return'Infinite';
	if(number<0)return '-'+Molpify(-number,raftcastle,shrinkify);
	var molp='';
	
	if(shrinkify==2)shrinkify=0;
	else if(Molpy&&!shrinkify)shrinkify=!Molpy.options.science;
	
	if(shrinkify)
	{
		for (var i in postfixes)
		{	
			var p = postfixes[i];
			if(number>=p.limit)
			{
				return Molpify(number / p.divisor, raftcastle,1)+p.postfix[Molpy.options.longpostfix];
			}
		}
	}else{
		if(number==3)return 'Math.floor(Math.PI)';
		if(number==4)return 'Math.ceil(Math.PI)';
	}
	
	if(raftcastle>0)
	{
		var numCopy=number;
		//get the right number of decimal places to stick on the end:
		var raft=numCopy*Math.pow(10,raftcastle)-Math.floor(numCopy)*Math.pow(10,raftcastle);
		var sraft = Math.floor(raft)+'';
		if((sraft).length>raftcastle)
		{
			numCopy++;
			sraft=''; //rounded decimal part up to 1
		}else if(raft) while(sraft.length<raftcastle)
		{
			sraft='0'+sraft; //needs leading zeroes because it's a number like 1.01
		}
		molp=Molpify(numCopy,0,shrinkify)+(raft?('.'+sraft):''); //stick them on the end if there are any
	}else
	{
		number = Math.floor(number);
		//drop the decimal bit
		var sep = (number+'').indexOf('e') ==-1; //true if not in exponential notation
		number=(number+'').split('').reverse(); //convert to string, then array of chars, then backwards
		for(var i in number)
		{
			if(sep&&i%3==0 &&i>0) molp=','+molp;//stick commas in every 3rd spot but not 0th
			molp=number[i]+molp;
		}
		if(!sep)
		{
			var dot=molp.indexOf('.')+1;
			var exp=molp.indexOf('e');
			molp=molp.slice(0,dot)+molp.slice(dot,exp).slice(0,6)+molp.slice(exp);//truncate after 6 decimal places
		}
	}
	return molp;
}

/* In which the game initialisation is specified
++++++++++++++++++++++++++++++++++++++++++++++++*/
var Molpy={};
Molpy.Up=function()
{
	Molpy.molpish=0;
	
	Molpy.Wake=function()
	{
		Molpy.molpish=0;
		Molpy.HardcodedData();//split some stuff into separate file
		/* In which variables are declared
		++++++++++++++++++++++++++++++++++*/
		Molpy.Life=0; //number of gameticks that have passed
		Molpy.fps = 30 //this is just for paint, not updates
		Molpy.version=3.2;
		
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
		Molpy.chipsManual=0;
		Molpy.sand=0; //current sand balance
		Molpy.castlesBuilt=0; //total castles built throughout the game
		Molpy.castles=0; //current castle balance
		Molpy.castlesDestroyed=0; //total castles destroyed by other structures throughout the game
		Molpy.sandPermNP=0; //sand per milliNewPix (recaculated when stuff is bought)
		Molpy.glassPermNP=0; 
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
		Molpy.lGlass=0;
		Molpy.totalGlassBuilt=0;
		Molpy.totalGlassDestroyed=0;
		Molpy.toolsBuilt=0;
		Molpy.toolsBuiltTotal=0;
		Molpy.blockspmnp = 0;
		Molpy.chipspmnp = 0;
		
		Molpy.options=[];
		Molpy.DefaultOptions=function()
		{
			Molpy.options.particles=1;
			Molpy.options.numbers=1;
			Molpy.options.autosave=2;
			Molpy.options.autoupdate=1;
			Molpy.options.sea=1;
			Molpy.options.colpix=1;
			Molpy.options.longpostfix=0;
			Molpy.options.colourscheme=0;
			Molpy.options.sandmultibuy=0;
			Molpy.options.castlemultibuy=0;
			Molpy.options.fade=0;
			Molpy.options.typo=0;
			Molpy.options.science=0;
		}
		Molpy.DefaultOptions();
		Molpy.DefinePersist();
		Molpy.DefineGUI();

		
		/* In which the mathematical methods of sandcastles are described
		+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
		var sandEpsilon = 0.0000001; //because floating point errors
		var previousSand=0;
		Molpy.Dig=function(amount)
		{
			var oldSand=Molpy.sand;
			if(!isFinite(Molpy.sand))amount=0; //because why bother?
			Molpy.sandDug+=amount;
			Molpy.sand+=amount;
			if(isNaN(Molpy.sandDug))Molpy.sandDug=0;
			
			var gap = Math.ceil(Molpy.sand)-Molpy.sand;
			if(gap && gap < sandEpsilon)
			{	
				Molpy.sand = Math.ceil(Molpy.sand);
				Molpy.sandDug = Math.ceil(Molpy.sandDug);
				Molpy.EarnBadge('Clerical Error');
			}
			Molpy.SandToCastles();
			if(isFinite(previousSand)!=isFinite(Molpy.sand)
				||isFinite(oldSand)!=isFinite(Molpy.sand))
				Molpy.recalculateDig=1;
			previousSand=Molpy.sand;
			
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
			while(Molpy.sand >= Molpy.nextCastleSand && isFinite(Molpy.castles))
			{
				if(Molpy.Got('Fractal Sandcastles'))
				{
					var m=1.35;
					if(Molpy.Got('Fractal Fractals')) m = 1.5;
					Molpy.Build(Math.floor(Math.pow(m,Molpy.Boosts['Fractal Sandcastles'].power)));
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
				if(Molpy.nextCastleSand > 80) Molpy.EarnBadge('Getting Expensive');
				Molpy.prevCastleSand=Molpy.currentCastleSand
				if(!isFinite(Molpy.sand) || Molpy.nextCastleSand<=0)
				{
					Molpy.nextCastleSand=1;
					Molpy.castles=Infinity;
					Molpy.castlesBuilt=Infinity;
					return;
				}
			}
			Molpy.buildNotifyFlag=1;
			Molpy.Build(0);
			
			if(isNaN(Molpy.sand))
			{
				Molpy.sand=0;
				Molpy.EarnBadge('Mustard Cleanup');
			}
			if(isNaN(Molpy.castles))
			{
				Molpy.castles=0;
				Molpy.EarnBadge('Mustard Cleanup');
			}
			if(isNaN(Molpy.castlesBuilt))
			{
				Molpy.castlesBuilt=0;
				Molpy.EarnBadge('Mustard Cleanup');
			}
		}
		Molpy.buildNotifyFlag=1;
		Molpy.buildNotifyCount=0;
		Molpy.Build=function(amount,refund)
		{
			if(!isFinite(Molpy.castles))
			{
				amount=0; //no point in adding any more
			}
			if(!refund&&amount)//don't multiply if amount is 0
			{
				amount = Math.round(amount*Molpy.globalCastleMult)||0;
			}
			amount = Math.max(0,amount);
			Molpy.castlesBuilt+=amount;
			Molpy.castles+=amount;
			if(amount&&!isFinite(Molpy.castles))Molpy.recalculateDig=1;
			
			if(Molpy.buildNotifyFlag)
			{
				if(Molpy.buildNotifyCount)
				{
					amount+=Molpy.buildNotifyCount;
					Molpy.buildNotifyCount=0;
				}				
				if(amount){
					if(amount >= Molpy.castles/10000000)
						Molpy.Notify(amount==1?'+1 Castle':Molpify(amount,3)+ ' Castles Built',1);
					else
						Molpy.buildNotifyCount+=amount;
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
			if(Molpy.castles>=DeMolpify('1P')){
				Molpy.EarnBadge('People Eating Tasty Animals');
			}
			if(Molpy.castles>=DeMolpify('20P')){
				Molpy.UnlockBoost('Free Advice');
			}
			if(Molpy.castles>=DeMolpify('1Y')){
				Molpy.EarnBadge('Y U NO RUN OUT OF SPACE?');
			}
			if(Molpy.castles>=DeMolpify('1U')){
				Molpy.EarnBadge('Dumpty');
			}
			if(Molpy.castles>=DeMolpify('1S')){
				Molpy.EarnBadge('This is a silly number');
			}
			if(Molpy.castles>=DeMolpify('1H')){
				Molpy.EarnBadge('To Da Choppah');
			}
			if(Molpy.castles>=DeMolpify('1F')){
				Molpy.EarnBadge('Toasters');
			}
			if(Molpy.castles>=DeMolpify('1W')){
				Molpy.EarnBadge('Dubya');
			}
			if(Molpy.castles>=DeMolpify('1WW')){
				Molpy.EarnBadge('Rub a Dub Dub');
			}
			if(Molpy.castles>=DeMolpify('1WWW')){
				Molpy.EarnBadge('WWW');
			}
			if(Molpy.castles>=DeMolpify('1WWWW')){
				Molpy.EarnBadge('Age of Empires');
			}
			if(Molpy.castles>=DeMolpify('1Q')){
				Molpy.EarnBadge('Queue');
			}
			if(Molpy.castles>=DeMolpify('1WQ')){
				Molpy.EarnBadge('What Queue');
			}
			if(!isFinite(Molpy.castles)&&!isFinite(Molpy.sand)){
				Molpy.EarnBadge('Everything but the Kitchen Windows');
			}
		}
		Molpy.MakeChips=function()
		{
			var furnaceLevel=(Molpy.Boosts['Sand Refinery'].power)+1;
			Molpy.AddChips(furnaceLevel,1);
		}
		Molpy.chipAddAmount=0;
		Molpy.chipWasteAmount=0;
		Molpy.AddChips=function(amount,expand)
		{
			Molpy.UnlockBoost('GlassChips');
			var ch = Molpy.Boosts['GlassChips'];
			if(!ch.bought)
			{
				ch.buy();
			}
			ch.power+=amount;
			var waste = Math.max(0,ch.power-(ch.bought)*10);
			if (waste && expand && Molpy.Boosts['Stretchable Chip Storage'].power)
			{
				ch.power -= amount;
				ch.bought += Math.floor(amount/4.5);
			}
			else
			{
				if (waste)
				{
					ch.power-=waste;
					amount-=waste;
					Molpy.chipWasteAmount+=waste;
					if (expand && Molpy.chipWasteAmount > 1000000) Molpy.UnlockBoost('Stretchable Chip Storage');
				}
				Molpy.chipAddAmount+=amount;
			}			
			if(Molpy.Boosts['Expando'].power)
			{
				Molpy.Boosts['GlassChips'].hoverOnCounter=1;
				Molpy.Boosts['Sand Refinery'].hoverOnCounter=1;
				Molpy.Boosts['Glass Chiller'].hoverOnCounter=1;
			}
		}
		Molpy.blockAddAmount=0;
		Molpy.blockWasteAmount=0;
		Molpy.MakeBlocks=function()
		{
			var chillerLevel=(Molpy.Boosts['Glass Chiller'].power)+1;
			var chipsFor=chillerLevel;
			
			var ch = Molpy.Boosts['GlassChips'];
			var rate=Molpy.ChipsPerBlock();
			while(ch.power < chipsFor*rate)
			{
				chipsFor--;
			}
			if(!chipsFor)
			{
				Molpy.Notify('Not enough Glass Chips to make any Blocks',1);
				return;
			}else if (chipsFor<chillerLevel){
				Molpy.Notify('Running low on Glass Chips!');
				chillerLevel=chipsFor;
			}
			ch.power-=chipsFor*rate;
			Molpy.chipAddAmount-=chipsFor*rate;
			Molpy.AddBlocks(chillerLevel,1);
		}
		Molpy.AddBlocks=function(amount,expand)
		{
			Molpy.UnlockBoost('GlassBlocks');
			var bl = Molpy.Boosts['GlassBlocks'];
			if(!bl.bought)
			{
				bl.buy();
			}
			bl.power+=amount;
			var waste = Math.max(0,bl.power-(bl.bought)*50);
			if (waste && expand && Molpy.Boosts['Stretchable Block Storage'].power)
			{
				bl.power -= amount;
				bl.bought += Math.floor(amount/13.5);
			}
			else
			{
				if (waste)
				{
				bl.power-=waste;
				amount-=waste;
				Molpy.blockWasteAmount+=waste;
				if (expand && Molpy.blockWasteAmount > 1000000) Molpy.UnlockBoost('Stretchable Block Storage');
				}
				if(amount) Molpy.EarnBadge('Glassblower');
				Molpy.blockAddAmount+=amount;
			}
			if(Molpy.Boosts['Expando'].power)
			{
				Molpy.Boosts['GlassBlocks'].hoverOnCounter=1;
				Molpy.Boosts['Sand Purifier'].hoverOnCounter=1;
				Molpy.Boosts['Glass Extruder'].hoverOnCounter=1;
			}
			
		}
		Molpy.glassNotifyFactor=1000000000;
		Molpy.GlassNotifyFlush=function()
		{
			Molpy.chipAddAmount=Math.round(Molpy.chipAddAmount);
			Molpy.chipWasteAmount=Math.round(Molpy.chipWasteAmount);
			Molpy.blockAddAmount=Math.round(Molpy.blockAddAmount);
			Molpy.blockWasteAmount=Math.round(Molpy.blockWasteAmount);
			if(Molpy.chipAddAmount>0 && !Molpy.Boosts['AA'].power && Molpy.chipAddAmount*Molpy.glassNotifyFactor > Molpy.Boosts['GlassChips'].power)
				Molpy.Notify('Gained '+Molpify(Molpy.chipAddAmount,3)+' Glass Chip'+plural(Molpy.chipAddAmount),1);
			if(Molpy.chipAddAmount<0 && (-Molpy.chipAddAmount*Molpy.glassNotifyFactor) > Molpy.Boosts['GlassChips'].power)
				Molpy.Notify('Consumed '+Molpify(-Molpy.chipAddAmount,3)+' Glass Chip'+plural(-Molpy.chipAddAmount),1);
			Molpy.chipAddAmount=0;
			
			if(Molpy.chipWasteAmount>0)
				Molpy.Notify('Not enough Chip Storage for '+Molpify(Molpy.chipWasteAmount)+' Glass Chip'+plural(Molpy.chipWasteAmount),1);
			Molpy.chipWasteAmount=0;
			
			if(Molpy.blockAddAmount>0 && !Molpy.Boosts['AA'].power && Molpy.blockAddAmount*Molpy.glassNotifyFactor > Molpy.Boosts['GlassBlocks'].power)
				Molpy.Notify('Gained '+Molpify(Molpy.blockAddAmount,3)+' Glass Block'+plural(Molpy.blockAddAmount),1);
			if(Molpy.blockAddAmount<0 && (-Molpy.blockAddAmount*Molpy.glassNotifyFactor) > Molpy.Boosts['GlassBlocks'].power)
				Molpy.Notify('Consumed '+Molpify(-Molpy.blockAddAmount,3)+' Glass Block'+plural(-Molpy.blockAddAmount),1);
			Molpy.blockAddAmount=0;
			
			if(Molpy.blockWasteAmount>0)
				Molpy.Notify('Not enough Block Storage for '+Molpify(Molpy.blockWasteAmount,3)+' Glass Block'+plural(Molpy.blockWasteAmount),1);
			Molpy.blockWasteAmount=0;
		}
		Molpy.DigGlass=function(amount)
		{
			Molpy.totalGlassBuilt+=amount;
			Molpy.Boosts['Tool Factory'].power+=amount;
		}
		Molpy.DestroyGlass=function(amount)
		{
			var tf=Molpy.Boosts['Tool Factory'];
			amount=Math.min(tf.power,amount);
			tf.power-=amount;
			Molpy.totalGlassDestroyed+=amount;
		}
		
		Molpy.SpendCastles=function(amount,silent)
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
		}
		Molpy.spendSandNotifyFlag=1;
		Molpy.spendSandNotifyCount=0;
		Molpy.SpendSand=function(amount,silent)
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
				baserate+= baserate*(4/10)*Math.max(-2,Math.floor((Molpy.SandTools['Bag'].amount-25)/5));
			}
			return baserate;
		}
		Molpy.computedSandPerClick=1;
		Molpy.globalSpmNPMult=1;
		Molpy.globalGpmNPMult=1;
		Molpy.lastClick=0;
		Molpy.chipsPerClick=0;
		Molpy.ClickBeach=function()
		{
			var newsand=Molpy.computedSandPerClick;
			Molpy.Dig(newsand);
			if(newsand&&Molpy.options.numbers) Molpy.AddSandParticle('+'+Molpify(newsand,1));
			Molpy.sandManual+=newsand;
			if(isNaN(Molpy.sandManual))Molpy.sandManual=0;
			if(!isFinite(Molpy.sand)&&Molpy.Got('BG'))
			{
				Molpy.chipsPerClick=Molpy.BoostsOwned*4
				if(Molpy.Got('GM'))
				{
					Molpy.chipsPerClick+=Molpy.glassPermNP/20;
				}
				Molpy.Boosts['Tool Factory'].power+=Molpy.chipsPerClick;
				Molpy.chipsManual+=Molpy.chipsPerClick;
				if(Molpy.chipsPerClick&&Molpy.options.numbers) Molpy.AddSandParticle('+'+Molpify(Molpy.chipsPerClick,1));
			}
			Molpy.beachClicks+=1;
			Molpy.CheckClickAchievements();
			if( Molpy.ninjad==0&&Molpy.CastleTools['NewPixBot'].amount)
			{
				if(Molpy.npbONG==1)
				{
					Molpy.StealthClick();
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
					if(Molpy.CastleTools['NewPixBot'].currentActive>=1000)
					{
						Molpy.EarnBadge('KiloNinja Strike');
						if(Molpy.CastleTools['NewPixBot'].currentActive>=1e6)
						{
							Molpy.EarnBadge('MegaNinja Strike');
							if(Molpy.CastleTools['NewPixBot'].currentActive>=1e9)
							{
								Molpy.EarnBadge('GigaNinja Strike');
							}
						}
					}
				}
			}else if(Molpy.Got('VJ'))
			{
				if(Molpy.beachClicks%100==0)
				{
					Molpy.Notify(Molpy.Boosts['VJ'].name);
					Molpy.Build(Molpy.CalcVJReward(1));
					Molpy.Boosts['VJ'].power++;
					var sawType='Plain';
                    if(Molpy.Got('Swedish Chef'))sawType='Swedish Chef';
                    if(Molpy.Got('Phonesaw'))sawType='PhoneSaw';
                    if(Molpy.Got('Ninjasaw'))sawType='Ninjasaw';
					
                    if(Molpy.Got('Glass Saw'))
                    {
                        var p = Molpy.Boosts['Glass Saw'].power;
						if(p>0)
						{
							sawType='Glass Saw';
							var maxGlass=Molpy.GlassCeilingCount()*10000000*p;
							var absMaxGlass=maxGlass;
							var rate = Molpy.ChipsPerBlock();
							maxGlass=Math.min(maxGlass,Math.floor(Molpy.Boosts['Tool Factory'].power/rate));
							var leave = 0;
							var bl = Molpy.Boosts['GlassBlocks'];
							if (Molpy.Boosts['AA'].power && Molpy.Boosts['Glass Blower'].power)
							{
								leave = Molpy.Boosts['Glass Chiller'].power *(1+Molpy.Boosts['AC'].power)/2*10; // 10 mnp space
							}
							maxGlass=Math.min(maxGlass,bl.bought*50-bl.power - leave);
							maxGlass=Math.max(maxGlass,0);
							var backoff = 1;
							while (bl.power+maxGlass > bl.bought*50 )
							{
								maxGlass -= backoff;
								backoff *= 2;
							}
							Molpy.AddBlocks(maxGlass);
							Molpy.Boosts['Tool Factory'].power-=maxGlass*rate;
							Molpy.Boosts['Tool Factory'].power=Math.max(0,Molpy.Boosts['Tool Factory'].power);
							if(Molpy.Boosts['Tool Factory'].power > absMaxGlass*rate*2)
								Molpy.Boosts['Glass Saw'].power=p*2;
						}
                    }
					
					_gaq.push(['_trackEvent',Molpy.Boosts['VJ'].name,sawType,''+Molpy.Boosts['VJ'].power]);
				}
			}
			if(Molpy.Got('Bag Puns')&&Molpy.Boosts['VJ'].bought!=1)
			{
				if(Molpy.beachClicks%20==0)
				{
					Molpy.Notify(GLRschoice(Molpy.bp));
					var p = Molpy.Boosts['Bag Puns'].power;
					p++;
					if(p>100)
					{
						Molpy.UnlockBoost('VJ');
					}
					Molpy.Boosts['Bag Puns'].power=p;
				}
			}
			Molpy.ninjad=1;
			
			if(Molpy.oldBeachClass!='beachongwarning')
				Molpy.UpdateBeachClass('beachsafe');
			Molpy.HandleClickNP();	

			if(Molpy.Got('Temporal Rift') && Molpy.Boosts['Temporal Rift'].countdown<5 && flandom(2)==1)
			{
				Molpy.Notify('You accidentally slip through the temporal rift!,1');
				Molpy.RiftJump();
			}
		}
		g('beach').onclick=Molpy.ClickBeach;	
		
		Molpy.CalcVJReward=function(includeNinja)
		{
		
			var p = Molpy.Boosts['VJ'].power;
			var mult=1000000;
			if(Molpy.Got('Swedish Chef'))
			{
				mult*=100;
			}else{
				if(p>20)Molpy.UnlockBoost('Swedish Chef');
			}
			if(Molpy.Got('Phonesaw')) mult*=mult;
			if(includeNinja&&Molpy.Boosts['Ninjasaw'].power)
			{
				if(Molpy.HasGlassBlocks(50))
				{
					Molpy.SpendGlassBlocks(50);
					mult*=Molpy.CalcStealthBuild(0,1)/10;
				}
			}
			return p*mult;
		}
		
		Molpy.StealthClick=function()
		{		
			//clicking first time, after newpixbot		
			Molpy.EarnBadge('No Ninja');
			Molpy.ninjaFreeCount++; 
			var ninjaInc = 1;
			if(Molpy.Got('Active Ninja'))
			{
				ninjaInc*=3;
			}
			if(!Molpy.Boosts['Ninja Lockdown'].power)
			{
				if(Molpy.Got('Ninja League'))
				{
					ninjaInc*=100;
				}
				if(Molpy.Got('Ninja Legion'))
				{
					ninjaInc*=1000;
				}
				if(Molpy.Got('Ninja Ninja Duck'))
				{
					ninjaInc*=10;
				}
			}
			Molpy.ninjaStealth+=ninjaInc;
			
			if(Molpy.Got('Ninja Builder')) 
			{
				var stealthBuild=Molpy.CalcStealthBuild(1,1);
				Molpy.Build(stealthBuild+1);
				var fn='Factory Ninja';
				if(Molpy.Got(fn))
				{
					Molpy.ActivateFactoryAutomation();
					!Molpy.Boosts[fn].power--
					if(!Molpy.Boosts[fn].power)
						Molpy.LockBoost(fn);
				}
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
			if(Molpy.Got('Stealth Cam'))Molpy.Shutter();
				
		}
		Molpy.CalcStealthBuild=function(vj,spend)
		{
			var stealthBuild = Molpy.ninjaStealth;
			if(Molpy.Got('Ninja Assistants')) stealthBuild*=Molpy.CastleTools['NewPixBot'].amount;
			if(Molpy.Got('Skull and Crossbones'))
			{
				stealthBuild=Math.floor(stealthBuild*Math.pow(1.05,Math.max(-1,Molpy.SandTools['Flag'].amount-40)));
			}
			if(Molpy.Boosts['Glass Jaw'].power)
			{
				if(Molpy.HasGlassBlocks(1))
				{
					if(spend)
						Molpy.SpendGlassBlocks(1);
					stealthBuild*=100;
				}
			}
			if(Molpy.Got('Ninja Climber'))
			{
				stealthBuild*=Molpy.SandTools['Ladder'].amount;
				if(spend)
				{
					Molpy.recalculateDig=1;
				}
			}
			if(vj&&Molpy.Boosts['Ninjasaw'].power&&Molpy.Boosts['VJ'].power)
			{
				if(Molpy.HasGlassBlocks(50))
				{
					if(spend)
						Molpy.SpendGlassBlocks(50);
						stealthBuild*=Molpy.CalcVJReward();
				}
			}
			
			return stealthBuild;
		}
		
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
			if(!Molpy.ninjaStealth)return 0; //Nothing to lose!
			if(Molpy.Got('Impervious Ninja'))
			{
				var payment = Math.floor(Molpy.Boosts['GlassChips'].power*.01);
				if(payment>=100)
				{
					Molpy.SpendGlassChips(payment);
					Molpy.Notify('Ninja Forgiven',1);
					Molpy.Boosts['Impervious Ninja'].power--;
					if(Molpy.Boosts['Impervious Ninja'].power<=0)
					{
						Molpy.LockBoost('Impervious Ninja');
					}
					return 0; //Safe
				}
			}
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
			if(NP==-404) Molpy.EarnBadge('Badge Found');
		}
		
		/* In which we calculate how much sand per milliNewPix we dig
		+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
		Molpy.CalculateDigSpeed=function()
		{
			Molpy.recalculateDig=0;
			
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
			if(Molpy.Got('Chequered Flag'))ninjaFactor+=0.2;
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
			if(!isFinite(Molpy.computedSandPerClick))Molpy.computedSandPerClick=0; //you can't dig infinite sand
			
			//stuff beyond here doesn't apply to clicks
			if(Molpy.Got('Overcompensating')) 
			{
				multiplier+=Molpy.Boosts['Overcompensating'].power;
			}
			
			if(Molpy.Got('Facebugs'))
			{
				multiplier+=0.1*Molpy.BadgesOwned;
			}
			multiplier*=Molpy.BBC();
			var glassUse=Molpy.CalcGlassUse();
			multiplier*=Math.max(0,((100-glassUse)/100));
			Molpy.globalSpmNPMult=multiplier;
			Molpy.sandPermNP*=Molpy.globalSpmNPMult;
						
			if(Molpy.sandPermNP>oldrate) Molpy.CheckSandRateBadges();
			
			Molpy.CalcReportJudgeLevel();
			
			if(Molpy.Got('Flux Turbine'))
			{
				if (!isFinite(Molpy.totalCastlesDown))
				{
					Molpy.totalCastlesDown = Number.MAX_VALUE;
				}
				var fluxLevel = Math.log(Molpy.totalCastlesDown);
				if(Molpy.Got('Flux Surge'))
				{
					fluxLevel*=1.5;
				}
				Molpy.globalCastleMult=Math.max(1,Math.pow(1.02,fluxLevel));
			}else{
				Molpy.globalCastleMult=1;
			}
			Molpy.shopRepaint=1;
			Molpy.CalculateGlassRate();
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
		Molpy.CalcReportJudgeLevel=function()
		{
			var judy=Molpy.JudgementDipReport()[0];
			if(Molpy.judgeLevel==-1)//just loaded
			{
				if(judy>0)
					Molpy.Notify("Judgement Dip Level: "+Molpify(judy-1,2),1);
			}			
			else if(judy>Molpy.judgeLevel)//increase
			{
				if(Molpy.judgeLevel<2&&judy>2)//jumped from safe to multiple levels of judgement
				{
					Molpy.Notify('Judgement Dip is upon us!');
					Molpy.Notify("Judgement Dip Level: "+Molpify(judy-1,2),1);
				}else if(judy>2)
				{
					Molpy.Notify('Things got worse!!');
					Molpy.Notify("Judgement Dip Level: "+Molpify(judy-1,2),1);
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
					Molpy.Notify("Judgement Dip Level: "+Molpify(judy-1,2),1);
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
		}
		
		Molpy.CalculateGlassRate=function()
		{
			var oldrate = Molpy.glassPermNP;
			Molpy.glassPermNP=0;
			var multiplier = 1;
			var inf=(Molpy.Got('Sand to Glass')&&!isFinite(Molpy.sand))*1;
			if(!inf && oldrate==0)return;
			
			for (var i in Molpy.SandTools)
			{
				var me=Molpy.SandTools[i];
				var tf=!isFinite(Molpy.priceFactor*me.price)*1*inf;
				me.storedGpmNP=EvalMaybeFunction(me.gpmNP,me)*tf;
				me.storedTotalGpmNP=me.amount*me.storedGpmNP;
				Molpy.glassPermNP+=me.storedTotalGpmNP;
			}				
			if(Molpy.Got('GL'))
			{
				multiplier*=Molpy.Boosts['GL'].power/100;
			}
			
			Molpy.globalGpmNPMult=multiplier;
			Molpy.glassPermNP*=Molpy.globalGpmNPMult;	
			
			if(!isFinite(Molpy.sand)&&Molpy.Got('BG'))
			{
				Molpy.chipsPerClick=Molpy.BoostsOwned*4
				if(Molpy.Got('GM'))
				{
					Molpy.chipsPerClick+=Molpy.glassPermNP/20;
				}
			}else
			{
				Molpy.chipsPerClick=0;
			}
			if(Molpy.glassPermNP>oldrate)
			{
				if(Molpy.glassPermNP>=5000)Molpy.EarnBadge('Plain Potato Chips');
				if(Molpy.glassPermNP>=20000)Molpy.EarnBadge('Crinkle Cut Chips');
				if(Molpy.glassPermNP>=800000)Molpy.EarnBadge('BBQ Chips');
				if(Molpy.glassPermNP>=4e6)Molpy.EarnBadge('Corn Chips');
				if(Molpy.glassPermNP>=2e7)Molpy.EarnBadge('Sour Cream and Onion Chips');
				if(Molpy.glassPermNP>=1e8)Molpy.EarnBadge('Cinnamon Apple Chips');
				if(Molpy.glassPermNP>=3e9)Molpy.EarnBadge('Sweet Chili Chips');
				if(Molpy.glassPermNP>=1e11)Molpy.EarnBadge('Banana Chips');
				if(Molpy.glassPermNP>=5e12)Molpy.EarnBadge('Nuclear Fission Chips');
				if(Molpy.glassPermNP>=6e14)Molpy.EarnBadge('Silicon Chips');
				if(Molpy.glassPermNP>=1e19)Molpy.EarnBadge('Blue Poker Chips');
			}
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
		
		Molpy.SandTool=function(args)
		{
			this.id=Molpy.SandToolsN;
			this.name=args.name;
			args.commonName=args.commonName.split('|');
			this.single=args.commonName[0];
			this.plural=args.commonName[1];
			this.actionName=args.commonName[2];
			this.desc=args.desc;
			this.basePrice=args.price;
			this.price=this.basePrice;
			this.spmNP=args.spmNP;
			this.totalSand=0;
			this.storedSpmNP=0;
			this.storedTotalSpmNP=0;
			this.gpmNP=args.gpmNP;
			this.totalGlass=0;
			this.storedGpmNP=0;
			this.storedTotalGpmNP=0;
			this.nextThreshold=args.nextThreshold;
			this.pic=args.pic;
			this.icon=args.icon;
			this.background=args.background;
			this.buyFunction=args.buyFunction;
			this.drawFunction=args.drawFunction;
						
			this.amount=0;
			this.bought=0;
			this.temp=0;
			
			this.buy=function()
			{
				if(Molpy.ProtectingPrice())return;
				var times = Math.pow(4,Molpy.options.sandmultibuy );
				var bought=0;
				var spent=0;
				this.findPrice();
				while (times--)
				{
					var price=this.price*Molpy.priceFactor;
					if(!isFinite(price))
					{
						Molpy.UnlockBoost('Tool Factory');
						Molpy.EarnBadge(this.name+' Shop Failed');
					}else if (Molpy.castles>=price){
						Molpy.SpendCastles(price,1);
						this.amount++;
						this.bought++;
						bought++;
						spent+=price;
						this.findPrice();
						if (this.buyFunction) this.buyFunction(this);
						if (this.drawFunction) this.drawFunction();
						Molpy.shopRepaint=1;
						Molpy.recalculateDig=1;
						Molpy.SandToolsOwned++;
						Molpy.CheckBuyUnlocks();
					}
				}
				if(Molpy.Got('Temporal Duplication'))
				{
					this.amount+=bought;
					this.temp+=bought;
					bought+=bought;
					this.findPrice();
				}
				if(bought)
				{
					Molpy.Notify('Spent '+Molpify(spent,3)+' Castle'+plural(spent)+', Bought '+Molpify(bought,3)+' '+(bought>1?this.plural:this.single),1);
					_gaq&&_gaq.push(['_trackEvent','Buy Tool',this.name,''+bought]);
				}
			}
			this.create=function(n)
			{
				this.amount+=n;
				this.bought+=n;
				Molpy.SandToolsOwned+=n;
				if(Molpy.Got('Crystal Dragon')&&Molpy.Got('Temporal Duplication'))
				{
					this.amount+=n;
					this.temp+=n;
					Molpy.SandToolsOwned+=n;					
				}
			}
			this.sell=function()
			{
				if (this.amount>0)
				{					
					this.amount--;
					this.findPrice();
					
					if(this.temp>0)
					{
						this.temp--;
						Molpy.Notify('Temporal Duplicate Destroyed!');
					}else{
						var d=1;
						if(Molpy.Got('Family Discount'))d=.2;
						d*=Molpy.Boosts['ASHF'].startPower();
						Molpy.Build(Math.floor(this.price*0.5*d),1);
					}
					if (this.sellFunction) this.sellFunction();
					if (this.drawFunction) this.drawFunction();
					Molpy.shopRepaint=1;
					Molpy.recalculateDig=1;
					Molpy.SandToolsOwned--;
					_gaq&&_gaq.push(['_trackEvent','Sell Tool',this.name,'1']);
					Molpy.UnlockBoost('No Sell');
					Molpy.CheckBuyUnlocks();
				}
			}
			this.destroyTemp=function()
			{
				var cost = this.temp*5;
				if(Molpy.HasGlassBlocks(cost))
				{
					Molpy.SpendGlassBlocks(cost);
					var destroy=Math.min(this.amount,this.temp);
					this.amount=Math.max(0,this.amount-this.temp);
					this.temp=0;
					this.refresh();
					Molpy.Boosts['Achronal Dragon'].power+=cost;
					Molpy.Boosts['Achronal Dragon'].hoverOnCounter=1;
					_gaq&&_gaq.push(['_trackEvent','Destroy Tool',this.name,''+destroy]);
					Molpy.CheckDragon();
				}
			}
			this.updateBuy=function()
			{
				$('#SandToolBuy'+this.id).toggleClass('unbuyable',!this.isAffordable());
			}
			this.isAffordable=function()
			{
			
				if(Molpy.ProtectingPrice())return 0;
				var price=Math.floor(Molpy.priceFactor*this.basePrice*Math.pow(Molpy.sandToolPriceFactor,this.amount));
				return isFinite(price)&&Molpy.castles>=price;
			}
			this.showdesc=function(keep)
			{
				var d=g('SandToolDescription'+this.id);
				if(!d)return;
				if(keep&&d.innerHTML)return;
				var desc = '';
				if(Molpy.IsStatsVisible())
				{
								
					if(isFinite(Molpy.priceFactor*this.price)||!Molpy.Got('Tool Factory')||!Molpy.Got('Glass Ceiling '+(this.id*2)))
					{						
						desc='Total Sand '+this.actionName+': '+Molpify(this.totalSand,1)+
						'<br>Sand/mNP per '+this.single+': '+Molpify(this.storedSpmNP,1);
					}else{
						
						desc='Total Chips '+this.actionName+': '+Molpify(this.totalGlass,1)+
						'<br>Glass/mNP per '+this.single+': '+Molpify(this.storedGpmNP,1);
					}	
					
					desc+='<br>Total '+this.plural+' bought: '+Molpify(this.bought);
					Molpy.EarnBadge('The Fine Print');
				}else
				{				
					desc=this.desc;
				}
				d.innerHTML='<br>'+desc;		
			}
			this.hidedesc=function()
			{		
				var d=g('SandToolDescription'+this.id);
				if(d)d.innerHTML='';
			}
			this.refresh=function()
			{
				Molpy.shopRepaint=1;
				Molpy.recalculateDig=1;
				this.findPrice();
				if (this.drawFunction) this.drawFunction();
			}
			this.findPrice=function()
			{
				if(this.amount>9000)this.price=Infinity
				else
					this.price=Math.floor(this.basePrice*Math.pow(Molpy.sandToolPriceFactor,this.amount));
			}
			
			
			Molpy.SandTools[this.name]=this;
			Molpy.SandToolsById[this.id]=this;
			Molpy.SandToolsN++;
			return this;
		}	
	
		Molpy.CastleTool=function(args)
		{
			this.id=Molpy.CastleToolsN;
			this.name=args.name;
			args.commonName=args.commonName.split('|');
			this.single=args.commonName[0];
			this.plural=args.commonName[1];
			this.actionDName=args.commonName[2];
			this.actionBName=args.commonName[3];
			this.desc=args.desc;
			this.price0=args.price0;
			this.price1=args.price1;
			this.prevPrice=args.price0;
			this.nextPrice=args.price1;
			this.price=this.prevPrice+this.nextPrice; //fib!
			this.destroyC=args.destroyC;
			this.buildC=args.buildC;
			this.destroyG=args.destroyG;
			this.buildG=args.buildG;
			this.totalCastlesBuilt=0;
			this.totalCastlesDestroyed=0;
			this.totalCastlesWasted=0; //those destroyed for no gain
			this.totalGlassBuilt=0;
			this.totalGlassDestroyed=0;
			this.currentActive=0;
			this.nextThreshold=args.nextThreshold;
			this.pic=args.pic;
			this.icon=args.icon;
			this.background=args.background;
			this.buyFunction=args.buyFunction;
			this.drawFunction=args.drawFunction;
			this.destroyFunction=args.destroyFunction;
						
			this.amount=0;
			this.bought=0;
			this.temp=0;
			
			this.buy=function()
			{
				if(Molpy.ProtectingPrice())return;
				var times = Math.pow(4, Molpy.options.castlemultibuy);
				var bought=0;
				var spent=0;
				while (times--)
				{
					var price=Math.floor(Molpy.priceFactor*this.price);
					if(!isFinite(price))
					{
						Molpy.UnlockBoost('Tool Factory');
						Molpy.EarnBadge(this.name+' Shop Failed');
					}else if (Molpy.castles>=price){
						Molpy.SpendCastles(price,1);
						this.amount++;
						this.bought++;
						bought++;
						spent+=price;
						this.findPrice();
						if (this.buyFunction) this.buyFunction(this);
						if (this.drawFunction) this.drawFunction();
						Molpy.shopRepaint=1;
						Molpy.recalculateDig=1;
						Molpy.CastleToolsOwned++;
						Molpy.CheckBuyUnlocks();
					}
				}
				if(Molpy.Got('Temporal Duplication'))
				{
					this.amount+=bought;
					this.temp+=bought;
					bought+=bought;
					this.findPrice();
					if(this.temp>32) Molpy.UnlockBoost('Achronal Dragon');
				}
				if(bought)
				{
					Molpy.Notify('Spent '+Molpify(spent,3)+' Castle'+plural(spent)+', Bought '+Molpify(bought,3)+' '+(bought>1?this.plural:this.single),1);
					_gaq&&_gaq.push(['_trackEvent','Buy Tool',this.name,''+bought]);
				}
			}
			this.create=function(n)
			{	
				this.amount+=n;
				this.bought+=n;
				Molpy.CastleToolsOwned+=n;
				if(Molpy.Got('Crystal Dragon')&&Molpy.Got('Temporal Duplication'))
				{
					this.amount+=n;
					this.temp+=n;
					Molpy.CastleToolsOwned+=n;					
				}			
			}
			this.sell=function()
			{				
				this.findPrice();
				if (this.amount>0)
				{
					if(this.temp>0)
					{
						this.temp--;
						Molpy.Notify('Temporal Duplicate Destroyed!');
					}else{					
						var d=1;
						if(Molpy.Got('Family Discount'))d=.2;
						d*=Molpy.Boosts['ASHF'].startPower();
						Molpy.Build(this.prevPrice*d,1);
					}
					
					this.amount--;
					this.findPrice();
					if (this.sellFunction) this.sellFunction();
					if (this.drawFunction) this.drawFunction();
					Molpy.shopRepaint=1;
					Molpy.recalculateDig=1;
					Molpy.CastleToolsOwned--;
					_gaq&&_gaq.push(['_trackEvent','Sell Tool',this.name,'1']);
					Molpy.UnlockBoost('No Sell');
					Molpy.CheckBuyUnlocks();
				}
			}
			this.destroyTemp=function()
			{
				var cost = this.temp*10;
				if(Molpy.HasGlassBlocks(cost))
				{
					Molpy.SpendGlassBlocks(cost);
					var destroy=Math.min(this.amount,this.temp);
					this.amount=Math.max(0,this.amount-this.temp);
					this.temp=0;
					this.refresh();
					Molpy.Boosts['Achronal Dragon'].power+=cost;
					Molpy.Boosts['Achronal Dragon'].hoverOnCounter=1;
					_gaq&&_gaq.push(['_trackEvent','Destroy Tool',this.name,''+destroy]);
					Molpy.CheckDragon();
				}
			}
			this.updateBuy=function()
			{
				$('#CastleToolBuy'+this.id).toggleClass('unbuyable',!this.isAffordable());
			}
			this.isAffordable=function()
			{
				if(Molpy.ProtectingPrice())return 0;
				var price=Math.floor(Molpy.priceFactor*this.price);
				return isFinite(price)&&Molpy.castles>=price;
			}
			this.DestroyPhase=function()
			{
				var i = this.amount
				var inf = Molpy.Got('Castles to Glass')&&!isFinite(Molpy.castles)&&!isFinite(Molpy.priceFactor*this.price);
				var destroyN=EvalMaybeFunction(inf?this.destroyG:this.destroyC);
				if (inf)
				{
					if (Molpy.Boosts['Tool Factory'].power >= destroyN*i)
					{
						this.currentActive+=i;
						this.totalGlassDestroyed+=destroyN*i;
						Molpy.DestroyGlass(destroyN*i);
						if(this.destroyFunction)this.destroyFunction();
						return;
					}
				}
				else 
				{
					if(Molpy.castles >= destroyN*i)
					{
						this.currentActive+=i;
						this.totalCastlesDestroyed+=destroyN*i;
						Molpy.Destroy(destroyN*i);
						if(this.destroyFunction)this.destroyFunction();
						return;
					}
				}
				if(inf)
				{
					var iAfford = Math.min(i,Math.floor(Molpy.Boosts['Tool Factory'].power/destroyN));
					this.currentActive+=iAfford;
					this.totalGlassDestroyed+=destroyN*iAfford;
					Molpy.DestroyGlass(destroyN*iAfford);
					
				}else{
					var iAfford = Math.min(i,Math.floor(Molpy.castles/destroyN));
					var waste=0;
					if(iAfford<i)
					{
						waste = Molpy.castles-destroyN*iAfford;
					}
					this.currentActive+=iAfford;
					this.totalCastlesDestroyed+=destroyN*iAfford;
					this.totalCastlesWasted+=waste;
					
					Molpy.Destroy(destroyN*iAfford+waste);
				}
				if(this.destroyFunction)this.destroyFunction();
				
			}
			this.BuildPhase=function()
			{
				var inf = Molpy.Got('Castles to Glass')&&!isFinite(Molpy.castles)&&!isFinite(Molpy.priceFactor*this.price);
				var buildN =EvalMaybeFunction(inf?this.buildG:this.buildC);
				buildN*=this.currentActive;
				if(inf)
				{
					Molpy.DigGlass(buildN);
					this.totalGlassBuilt+=buildN;
				}else{
					Molpy.Build(buildN);
					if(isNaN(this.totalCastlesBuilt))
					{
						this.totalCastlesBuilt=0;
						Molpy.EarnBadge('Mustard Cleanup');
					}
					this.totalCastlesBuilt+=buildN;
				}
				this.currentActive=0;
			}
			this.showdesc=function(keep)
			{
				var d=g('CastleToolDescription'+this.id);
				if(!d)return;
				if(keep&&d.innerHTML)return;
				var desc = '';
				var inf = Molpy.Got('Castles to Glass')&&!isFinite(Molpy.castles)&&!isFinite(Molpy.priceFactor*this.price);
				var bN = EvalMaybeFunction(inf?this.buildG:this.buildC);
				var dN = EvalMaybeFunction(inf?this.destroyG:this.destroyC);
				var w=inf?'Chip':'Castle';
				var actuals ='<br>Builds '+Molpify(bN,1)+' '+w+plural(bN)+(dN?(' if '+Molpify(dN,1)+' '+w+((dN!=1)?'s are':' is')+' destroyed.'):'');
				if(this.name=='Wave'&&Molpy.Got('SBTF')&&!inf)
				{
					bN=this.buildC(1);
					dN=this.destroyC(1);
					actuals+='<br>Next ONG, will build '+Molpify(bN,1)+' '+w+plural(bN)+(dN?(' if '+Molpify(dN,1)+' '+w+((dN!=1)?'s are':' is')+' destroyed.'):'');
				}
				if(Molpy.IsStatsVisible())
				{				
					if(isFinite(Molpy.priceFactor*this.price)||!Molpy.Got('Tool Factory')||!Molpy.Got('Glass Ceiling '+(this.id*2+1)))
					{
						if(this.totalCastlesDestroyed)
							desc+='Total Castles '+this.actionDName+': '+Molpify(this.totalCastlesDestroyed)+
							'<br>Total Castles wasted: '+Molpify(this.totalCastlesWasted);
						if(this.totalCastlesBuilt)
							desc+='<br>Total Castles '+this.actionBName+': +'+Molpify(this.totalCastlesBuilt);
					}else{
						if(this.totalGlassDestroyed)
							desc+='Total Chips '+this.actionDName+': '+Molpify(this.totalGlassDestroyed);
						if(this.totalGlassBuilt)
							desc+='<br>Total Chips '+this.actionBName+': +'+Molpify(this.totalGlassBuilt);
					}								
					desc+='<br>Total '+this.plural+' bought: '+Molpify(this.bought);
					desc+='<br>'+actuals;
					Molpy.EarnBadge('Keeping Track');
				}else
				{				
					desc=this.desc+actuals;
				}
				d.innerHTML='<br>'+desc;		
			}
			this.hidedesc=function(event)
			{
				var d=g('CastleToolDescription'+this.id);
				if(d)d.innerHTML='';
			}
			this.findPrice=function()
			{			
				var i = this.amount;
				if(i>1500)
				{	//don't even bother
					this.prevPrice=Infinity;
					this.nextPrice=Infinity;
					this.price=Infinity;
					return;
				}
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
			}
			this.refresh=function()
			{
				Molpy.shopRepaint=1;
				Molpy.recalculateDig=1;
				this.findPrice();
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
		Molpy.BoostAKA=[];
		Molpy.boostSilence=0;
		var order=0;
		Molpy.Boost=function(args)
		{
			this.id=Molpy.BoostN;
			this.name=args.name;
			this.alias=args.alias||args.name;
			this.desc=args.desc;
			this.sandPrice=args.sand||0;
			this.castlePrice=args.castles||0;
			this.glassPrice=args.glass||0;
			this.stats=args.stats;
			this.icon=args.icon;
			this.buyFunction=args.buyFunction;
			this.countdownFunction=args.countdownFunction;
			this.unlocked=0;
			this.bought=0;
			this.department=args.department; //allow unlock by the department (this is not a saved value)
			this.logic=args.logic; //allow unlock by logicat (this is not a saved value)
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
			this.className=args.className;
			this.classChange=args.classChange;
			this.group=args.group||'boosts';
			this.lockFunction=args.lockFunction;
			this.unlockFunction=args.unlockFunction;
			this.reset=args.reset;
			
			if(order) this.order=order+this.id/1000;
			//(because the order we create them can't be changed after we save)
			
			
			this.buy=function()
			{
				if(!this.unlocked)return; //shopping assistant tried to buy it when it was locked
				if(isNaN(Molpy.sand))
				{
					Molpy.sand=0;
					Molpy.EarnBadge('Mustard Cleanup');
				}
				if(isNaN(Molpy.castles))
				{
					Molpy.castles=0;
					Molpy.EarnBadge('Mustard Cleanup');
				}
				
				var sp = Math.floor(Molpy.priceFactor*EvalMaybeFunction(this.sandPrice,this,1));
				if(isNaN(sp)){this.power=0;sp=0;Molpy.EarnBadge('How do I Shot Mustard?')};
				var cp = Math.floor(Molpy.priceFactor*EvalMaybeFunction(this.castlePrice,this,1));
				var gp = Math.floor(Molpy.priceFactor*EvalMaybeFunction(this.glassPrice,this,1));
				
				if(Molpy.ProtectingPrice()&&sp+cp+gp)return; //don't need or want price protection on free items!
				
				if (!this.bought && (!cp||Molpy.castles>=cp) && (!sp||Molpy.sand>=sp) && (!gp||Molpy.HasGlassBlocks(gp)))
				{
					Molpy.SpendSand(sp);
					Molpy.SpendCastles(cp);
					Molpy.SpendGlassBlocks(gp);
					this.bought=1;
					_gaq&&_gaq.push(['_trackEvent','Boost','Buy',this.name,!(sp||cp||gp)]);
					if (this.buyFunction) this.buyFunction();
					Molpy.boostRepaint=1;
					Molpy.recalculateDig=1;
					Molpy.BoostsOwned++;
					Molpy.CheckBuyUnlocks();
					Molpy.unlockedGroups[this.group]=1;
					if(!Molpy.boostSilence&&sp+cp>0)
					{
						Molpy.ShowGroup(this.group,this.className);
					}
				}				
			}
			this.updateBuy=function()
			{
				if(this.unlocked&&!this.bought)
				{					
					$('#BoostBuy'+this.id).toggleClass('unbuyable',!this.isAffordable());
				}			
			}
			this.isAffordable=function()
			{	
				var sand = Molpy.sand||0;
				var castles= Molpy.castles||0;
				
				var sp = Math.floor(Molpy.priceFactor*EvalMaybeFunction(this.sandPrice,this,1))||0;
				var cp = Math.floor(Molpy.priceFactor*EvalMaybeFunction(this.castlePrice,this,1))||0;
				var gp = Math.floor(Molpy.priceFactor*EvalMaybeFunction(this.glassPrice,this,1))||0;
				if(!(sp+cp+gp))return 1;//free is always affordable
				if(Molpy.ProtectingPrice())return 0;
				return (!cp||castles>=cp) && (!sp||sand>=sp) && (!gp||Molpy.HasGlassBlocks(gp));
			}
			this.showdesc=function(keep)
			{
				var d=g('BoostDescription'+this.id)
				if(d)
				{	
					if(keep&&d.innerHTML)return;
					d.innerHTML='<br>'+EvalMaybeFunction((Molpy.IsStatsVisible()&&this.stats)?this.stats:this.desc,this);
				}
			}
			this.hidedesc=function()
			{					
				var d=g('BoostDescription'+this.id);
				if(d)d.innerHTML='';
			}
			this.describe=function()
			{			
				if(!Molpy.boostSilence)
				{
					var desc = EvalMaybeFunction(this.desc,this);
					if(desc)Molpy.Notify(this.name + ': ' +desc ,1);
				}
			}
			
			Molpy.Boosts[this.alias]=this;
			Molpy.BoostsById[this.id]=this;
			if(this.name!=this.alias)
			{
				Molpy.BoostAKA[this.name]=this.alias;
			}
			Molpy.BoostN++;
			return this;
		}	
		
		Molpy.UnlockBoost=function(bacon)
		{
			if(typeof bacon==='string')
			{
				var baby=Molpy.Boosts[bacon];
				if(baby)
				{
					if(baby.unlocked==0)
					{
						baby.unlocked=1;
						Molpy.boostRepaint=1;
						Molpy.recalculateDig=1;
						if(!Molpy.boostSilence)
						{
							Molpy.Notify('Boost Unlocked: '+baby.name,1);
							_gaq&&_gaq.push(['_trackEvent','Boost','Unlock',baby.name,true]);
						}
						if(baby.unlockFunction)baby.unlockFunction();
						if(baby.name==Molpy.shoppingItem)
							Molpy.Donkey();
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
				bb.power=EvalMaybeFunction(power);
				bb.countdown=EvalMaybeFunction(countdown);
				bb.unlocked=1;					
				bb.describe();
				bb.buy();
				Molpy.recalculateDig=1;
			}
		}
		Molpy.LockBoost=function(bacon)
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

						if(me.lockFunction)me.lockFunction();
						if(me.bought==1);
						{
							Molpy.BoostsOwned--;
							me.bought=0;
						} //Orteil did this bit wrong :P
						if(!Molpy.boostSilence)
						{
							Molpy.Notify('Boost Locked: '+me.name,1);
							_gaq&&_gaq.push(['_trackEvent','Boost','Lock',me.name,true]);
						}
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
			
		Molpy.previewNP=0;
		
		Molpy.badgeRepaint=1
		Molpy.badgeHTML='';
		Molpy.Badges=[];
		Molpy.BadgesById=[];
		Molpy.BadgeN=0;
		Molpy.BadgesOwned=0;
		var order=0;
		Molpy.Badge=function(args)
		{
			this.id=Molpy.BadgeN;
			this.np=args.np;
			this.name=args.name;
			this.alias=args.alias||args.name;
			this.desc=args.desc
			this.stats=args.stats;
			this.icon=args.icon;
			this.earnFunction=args.earnFunction;
			this.earned=0;
			this.order=this.id;
			if(order) this.order=order+this.id/1000;
			//(because the order we create them can't be changed after we save)
			this.visibility=args.vis||0; //0 is normal, 1 is hidden description, 2 is hidden name, 3 is invisible
			this.className=args.className;
			this.classChange=args.classChange;
			this.group=args.group||'badges';
			
			this.showdesc=function(keep)
			{
				var d = g('BadgeDescription'+this.id);
				if(d)
				{
					if(keep&&d.innerHTML)return;
					d.innerHTML='<br>'+((this.earned||this.visibility<1)?
						EvalMaybeFunction((Molpy.IsStatsVisible()&&this.stats)?this.stats:this.desc,this):'????');
				}
				if(this.earned&&this.np&&Molpy.previewNP!=this.np&&!Molpy.Boosts['Expando'].power&&this.alias.indexOf('monumg')==0)
				{
					Molpy.previewNP=this.np;
					Molpy.UpdateBeach(this.np);
				}
			}
			this.hidedesc=function()
			{
				var d = g('BadgeDescription'+this.id);
				if(d)d.innerHTML='';
				if(this.np&&this.alias.indexOf('monumg')==0)
				{
					if(Molpy.previewNP==this.np)
					{
						Molpy.previewNP=0;
						Molpy.UpdateBeach();
					}
				}
			}
			
			Molpy.Badges[this.alias]=this;
			Molpy.BadgesById[this.id]=this;
			Molpy.BadgeN++;
			return this;
		}		
		
		Molpy.groupBadgeCounts={};
		Molpy.EarnBadge=function(bacon,camera)
		{
			if(typeof bacon==='string')
			{
				var baby=Molpy.Badges[bacon];
				if(baby)
				{
					if(baby.earned==0&&!Molpy.needlePulling)
					{
						baby.earned=1;
						_gaq&&_gaq.push(['_trackEvent','Badge','Earn',baby.name,Molpy.BadgesOwned<6||baby.group!='badges'&&!camera]);
						if(Molpy.BadgesOwned==0) Molpy.EarnBadge('Redundant Redundancy');
						Molpy.badgeRepaint=1;
						Molpy.recalculateDig=1;
						Molpy.BadgesOwned++;
						Molpy.unlockedGroups[baby.group]=1;
						if(baby.group=='badges')
						{
							Molpy.Notify('Badge Earned: '+baby.name,1);
						}else{
							Molpy.Notify(Molpy.MaybeWrapFlipHoriz(baby.name,baby.np<0),1);
						}
						
						Molpy.EarnBadge('Redundant');
						Molpy.CheckBuyUnlocks();
						if(Molpy.Earned('Badgers'))
						{
							Molpy.recalculateDig=1;
						}
						if(!Molpy.groupBadgeCounts[baby.group])
						{
							Molpy.groupBadgeCounts[baby.group]=1;
						}else
						{
							Molpy.groupBadgeCounts[baby.group]++;
						}
						Molpy.ShowGroup(baby.group,baby.className);
					
					}
				}
			}else{ //so you can be bacon while you're bacon
				for(var i in bacon){Molpy.EarnBadge(bacon[i]);}
			}
		}
		Molpy.Earned=function(bacon)
		{
			var baby = Molpy.Badges[bacon];
			return baby&&baby.earned;
		}
		
		Molpy.MakeSpecialBadge=function(args,kind)
		{
			new Molpy.Badge({name:Molpy.groupNames[kind][3]+': '+(args.np<0?'Minus ':'')+args.name,alias:kind+args.np,np:args.np,
				desc:function(me)
				{
					var str = Molpy.groupNames[kind][4]+': '+args.desc+'<br><small>(in NP'+me.np+')</small>';
					if(me.group=='discov')
					{
						if(Molpy.newpixNumber!=me.np&&Molpy.Got('Memories Revisited'))
						{
							str+='<br><input type="Button" onclick="Molpy.TTT('+me.np+',1)" value="Jump!"></input> (Uses '+Molpify(Molpy.CalcJumpEnergy(me.np),2)+' Glass Chips)'
							if (Molpy.Got('Magic Mirror'))
							{
								str+='<br>'+Molpy.WrapFlipHoriz('<input type="Button" onclick="Molpy.TTT('+ (-me.np)+',1)" value="Jump!"></input> to the other side (Uses '+Molpify(Molpy.CalcJumpEnergy(-me.np),2)+' Glass Chips)')
							}
						}
						if(Molpy.Got('SMM')&&!Molpy.Boosts['SMM'].power&&!Molpy.Earned('monums'+me.np))
						{
							str+='<br><br>Sudo <input type="Button" onclick="Molpy.MakeSandMould('+me.np+')" value="Make"></input> a mould from this Discovery, which can be filled with sand to create a Monument'
						}
					}else if(me.group=='monums')
					{
						if(Molpy.Got('GMM')&&!Molpy.Boosts['GMM'].power&&!Molpy.Earned('monumg'+me.np))
						{
							str+='<br><br>Sudo <input type="Button" onclick="Molpy.MakeGlassMould('+me.np+')" value="Make"></input> a mould from this Sand Monument, which can be filled with glass to create a Glass Monument'
						}
						str+='<div class="npthumb" style="background-image: '+Molpy.Url(Molpy.NewPixFor(abs(me.np)))+(me.np<0?'flip-horizontal':'')+'"><div>';
					}
					return str;
				}
				,icon:kind,
				earnFunction:args.earnFunction,visibility:args.visibility,group:kind});
		}
		Molpy.MakeQuadBadge=function(args)
		{
			Molpy.MakeSpecialBadge(args,'discov');
			Molpy.MakeSpecialBadge(args,'monums');
			Molpy.MakeSpecialBadge(args,'monumg');
			Molpy.MakeSpecialBadge(args,'diamm');
			if(args.np>0)
			{
				args.np*=-1;
				Molpy.MakeQuadBadge(args);
			}
		}
		
		Molpy.redactedW=Molpy.BeanishToCuegish("UmVkdW5kYW50");
		Molpy.redactedWord=Molpy.BeanishToCuegish("UmVkdW5kYWtpdHR5");
		Molpy.redactedWords=Molpy.BeanishToCuegish("UmVkdW5kYWtpdHRpZXM=");
		Molpy.redactedBrackets=Molpy.BeanishToCuegish("JTI1NUJyZWR1bmRhbnQlMjU1RA==");
		Molpy.redactedSpoilerValue=Molpy.BeanishToCuegish("JTI1M0NpZnJhbWUlMjUyMHNyYyUyNTNEJTI1MjJodHRwJTI1M0ElMjUyRiUyNTJGd3d3LnlvdXR1YmUuY29tJTI1MkZlbWJlZCUyNTJGYkJ5ZWNDRDR0SjAlMjUzRmF1dG9wbGF5JTI1M0QxJTI1MjIlMjUyMHdpZHRoJTI1M0QlMjUyMjEwMCUyNTIyJTI1MjBoZWlnaHQlMjUzRCUyNTIyNjglMjUyMiUyNTIwZnJhbWVib3JkZXIlMjUzRCUyNTIyMCUyNTIyJTI1MjBhbGxvd2Z1bGxzY3JlZW4lMjUzRSUyNTNDJTI1MkZpZnJhbWUlMjUzRQ==");
		Molpy.redactedDrawType=[];
		Molpy.RedactedHTML=function(heading,level)
		{
			level=level||0;
			var drawType = Molpy.redactedDrawType[level];
			var spoiler = '';
			var label = 'Hide';
			if(drawType=='show') label='Show';
			heading=heading?'<h1>'+Molpy.redactedBrackets+'</h1>':'';
			var countdown=(level==0?'&nbsp;<span id="redactedcountdown" class="faded">'+Molpify(Molpy.redactedToggle-Molpy.redactedCountup)+'</span>':'');
			var str = '<div id="redacteditem">'+heading+'<div class="icon redacted"></div><h2">'
				+Molpy.redactedWord+countdown+'</h2><div><b>Spoiler:</b><input type="button" value="'
				+label+'" onclick="Molpy.ClickRedacted('+level+')"</input>';
			if(drawType=='recur')
			{
				str+=Molpy.RedactedHTML(heading,level+1);
			}else if( drawType=='hide1')
			{
				str+=Molpy.redactedSpoilerValue;
			}else if( drawType=='hide2')
			{
				str+=Molpy.redactedPuzzleValue;
			}
				
			return str+'</div></div>';
		}
		
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
				var redC=g('redactedcountdown');
				if(redC)redC.innerHTML=Molpify(Molpy.redactedToggle-Molpy.redactedCountup);
				
				if(Molpy.redactedCountup>=Molpy.redactedToggle)
				{
					Molpy.redactedCountup=0;
					if(Molpy.redactedVisible)
					{
						Molpy.redactedVisible=0; //hide because the redacted was missed
						Molpy.redactedDrawType=[];
						Molpy.shopRepaint=1;
						Molpy.boostRepaint=1;
						Molpy.badgeRepaint=1;
						_gaq&&_gaq.push(['_trackEvent','Redundakitty','Chain Timeout',''+Molpy.redactedChain,true]);	
						Molpy.redactedChain=0;
						Molpy.RandomiseRedactedTime();	
					}else{
						Molpy.redactedDrawType=['show'];
						Molpy.RedactedJump();
						var stay = 6 *(4+ Molpy.Got('Kitnip')+Molpy.Got('SGC')*2);
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
			var min = 200-80*(Molpy.Got('Kitnip')+Molpy.Got('Kitties Galore'))-30*Molpy.Got('RRSR');
			var spread = 90-20*(Molpy.Got('Kitnip')+Molpy.Got('Kitties Galore')+Molpy.Got('RRSR'));
			Molpy.redactedToggle=min+Math.ceil(spread*Math.random());
			Molpy.redactedGr='';
			if(Molpy.Boosts['RRSR'].unlocked
				&& !Molpy.Boosts['RRSR'].bought)
			{
				Molpy.redactedToggle*=12;
			}
		}
		
		Molpy.ClickRedacted=function(level)
		{
			level=level||0;
			Molpy.shopRepaint=1;
			Molpy.boostRepaint=1;
			Molpy.badgeRepaint=1;
			if(Molpy.redactedDrawType[level]!='show')
			{
				Molpy.UnlockBoost('Technicolour Dream Cat');
				Molpy.redactedDrawType[level]='show'; 
				while(Molpy.redactedDrawType.length>level+1)
					Molpy.redactedDrawType.pop(); //we don't need to remember those now
				Molpy.RedactedJump();
				return;
			}
			
			
			if(Molpy.Got('RRSR') && flandom(20)==1)
			{
				Molpy.redactedDrawType[level]='hide1';
				Molpy.redactedToggle=65;
				Molpy.redactedChain++;	
				Molpy.redactedCountup=Molpy.redactedChain;
			}else
			if (Molpy.Got('Redunception') && Molpy.redactedDrawType.length <21 
				&& flandom(8/Molpy.redactedDrawType.length)==0)
			{
				Molpy.redactedDrawType[level]='recur';
				Molpy.redactedDrawType.push('show');
				Molpy.RedactedJump();
				Molpy.redactedChain++;
				if(Molpy.redactedDrawType.length < 5 && Molpy.redactedToggle<5)
				{
					Molpy.redactedToggle=5;
					Molpy.redactedCountup=Molpy.redactedChain;
				}
			}else
			if (Molpy.Got('Logicat') && Molpy.redactedDrawType.length <21
				&& flandom(6/Molpy.redactedDrawType.length)==0)
			{
				Molpy.MakeRedactedPuzzle();
				Molpy.redactedDrawType[level]='hide2';
				Molpy.RedactedJump();
				if(Molpy.redactedToggle<20)
				{
					Molpy.redactedToggle=20;
				}
				Molpy.redactedCountup=0;
				Molpy.redactedChain++;
			}else
			{ // it goes away.					
				var item=g('redacteditem');
				if(item) item.className='hidden';
				Molpy.redactedVisible=0;
				Molpy.redactedViewIndex=-1;
				Molpy.redactedDrawType=[];
				Molpy.redactedCountup=0; //whoops forgot that!
				Molpy.RandomiseRedactedTime();
				_gaq&&_gaq.push(['_trackEvent','Redundakitty','Chain End',''+Molpy.redactedChain]);
				Molpy.redactedChain=0;
			}
			Molpy.redactedChainMax=Math.max(Molpy.redactedChainMax,Molpy.redactedChain);
			if(Molpy.redactedChainMax>=42)Molpy.EarnBadge('Meaning');
			
			Molpy.redactedClicks++;		
			if( Molpy.redactedDrawType.length<16)
			{
				Molpy.RewardRedacted();
				Molpy.GlassNotifyFlush();
			}
			if(Molpy.redactedClicks>=2)
				Molpy.EarnBadge('Not So '+Molpy.redactedW);
			if(Molpy.redactedClicks>=14)
				Molpy.EarnBadge("Don't Litter!");
			if(Molpy.redactedClicks>=16)
				Molpy.UnlockBoost('Kitnip');
			if(Molpy.redactedClicks>=32)
				Molpy.UnlockBoost('DoRD');
			if(Molpy.redactedClicks>=64)
				Molpy.Boosts['Kitties Galore'].department=1;
			if(Molpy.redactedClicks>=128)
				Molpy.EarnBadge('Y U NO BELIEVE ME?');
			if(Molpy.redactedClicks>=256)
				Molpy.UnlockBoost('BKJ');
		}
		
		Molpy.RedactedJump=function()
		{		
			//JUMP!
			Molpy.redactedVisible=Math.ceil((Molpy.redactableThings+2)*Math.random());
			if(Molpy.redactedVisible>Molpy.redactableThings)Molpy.redactedVisible=4;		
			Molpy.redactedViewIndex=-1;
		}

		Molpy.RewardRedacted=function(forceDepartment,automationLevel)
		{	
			var event=forceDepartment?'DoRD':Molpy.redactedWord;
			if(Molpy.Got('DoRD') &&
				(!Math.floor(8*Math.random()) || forceDepartment))
			{
				if(Molpy.Got('Blast Furnace') && !Math.floor(4*Math.random()))
				{
					
					_gaq&&_gaq.push(['_trackEvent',event,'Reward','Blast Furnace',true]);
					Molpy.RewardBlastFurnace();
					return;
				}				
				
				Molpy.CheckDoRDRewards(automationLevel);				
			
				var availRewards=[];
				for(var i in Molpy.Boosts)
				{
					var me=Molpy.Boosts[i];
					if(!me.unlocked&&me.department)
					{
						availRewards.push(me);
					}
				}
				
				if(availRewards.length)
				{
					var red=GLRschoice(availRewards);
					if((EvalMaybeFunction(red.sandPrice,red)+EvalMaybeFunction(red.castlePrice,red)+EvalMaybeFunction(red.glassPrice,red)))
					{
						Molpy.Notify('The DoRD has produced:',1);
						Molpy.UnlockBoost(red.alias);
					}else{
						Molpy.Notify('The DoRD has provided:',1);
						Molpy.GiveTempBoost(red.alias,red.startPower,red.startCountdown);
					}
					return;
				}
			}
			var BKJ = Molpy.Boosts['BKJ'];			
			if(BKJ.bought)
			{
				BKJ.power=(BKJ.power)+1;
			}
			if(Math.floor(2*Math.random()))
			{
				_gaq&&_gaq.push(['_trackEvent',event,'Reward','Not Lucky',true]);
				Molpy.RewardNotLucky(automationLevel);
			}else if(isFinite(Molpy.sand)){
				_gaq&&_gaq.push(['_trackEvent',event,'Reward','Blitzing',true]);
				Molpy.RewardBlitzing(automationLevel);
			}else
			{
				_gaq&&_gaq.push(['_trackEvent',event,'Reward','Blast Furnace Fallback',true]);
				Molpy.RewardBlastFurnace();
			}
		}
		Molpy.RewardBlastFurnace=function()
		{
			var cb=0;
			if(Molpy.Got('Furnace Crossfeed'))
			{
				if(Molpy.Boosts['Glass Furnace'].power && Molpy.Boosts['Furnace Crossfeed'].power)
				{
					Molpy.MakeChips();
					cb=1;
				}
			}
			if(Molpy.Got('Furnace Multitasking'))
			{
				if(Molpy.Boosts['Glass Blower'].power && Molpy.Boosts['Furnace Multitasking'].power)
				{
					Molpy.MakeBlocks();
					cb=1;
				}
			}
			if(cb)return;
			
			if(!isFinite(Molpy.castles))return; //We don't need to blast!

			var blastFactor=1000;
			var boosted=0;
			if(Molpy.Got('Fractal Sandcastles'))
			{
				blastFactor=Math.max(5,1000*Math.pow(0.94,Molpy.Boosts['Fractal Sandcastles'].power));
				if(Molpy.Got('Blitzing'))
				{
					if(Molpy.Got('BKJ'))
					{
						blastFactor/=Math.max(1,(Molpy.Boosts['Blitzing'].power-800)/600);
						boosted=1;
					}
					blastFactor/=2;
					
				}
			}
			var castles=Math.floor(Molpy.sand/blastFactor);		
			if(boosted)
			{
				castles=Math.floor(Math.min(castles,Molpy.castlesBuilt/5));
			}else{
				castles=Math.floor(Math.min(castles,Molpy.castlesBuilt/3));
			}
			Molpy.Notify('Blast Furnace in Operation!');
			Molpy.SpendSand(castles*blastFactor);
			Molpy.Build(castles);
		}
		Molpy.RewardNotLucky=function(automationLevel)
		{
			if(!automationLevel)
			{
				if(Math.abs(Molpy.newpixNumber)<=400)
					Molpy.Notify('You are not Lucky (which is good)');
				else
					Molpy.Notify('Not Lucky!');			
			}
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
			if(Molpy.Got('BFJ'))
			{
				bonus*= (1+0.2*Molpy.Boosts['BKJ'].power)
				if(Molpy.Got('Blitzing'))
					bonus*=Math.min(2,(Molpy.Boosts['Blitzing'].power-800)/200);
			}
			var finite=isFinite(Molpy.castles);
			var pg = Molpy.Got('Panther Glaze');
			if(Molpy.Got('RRR') && Molpy.Boosts['RRR'].power && Molpy.HasGlassBlocks(30))
			{
				bonus*=10000;
				if(finite)
					Molpy.SpendGlassBlocks(30);
				else if(pg)
					Molpy.AddChips(3000);
			}
			if(Molpy.Got('LCB') && Molpy.Boosts['LCB'].power)
			{
				if(Molpy.SandTools['Ladder'].amount)	
				{
					items+=Math.floor(Molpy.SandTools['Ladder'].amount/2);
					if(finite&&Molpy.HasGlassBlocks(35))				
					{
						Molpy.SpendGlassBlocks(35);
					}
					else 			
					{
						Molpy.SandTools['Ladder'].amount--;
						Molpy.SandTools['Ladder'].refresh();
						Molpy.SandToolsOwned--;
						if(!finite&&pg)
							Molpy.AddChips(3500);
					}
				}
				if(Molpy.SandTools['Bag'].amount)	
				{
					items+=Math.floor(Molpy.SandTools['Bag'].amount/2);
					if(finite&&Molpy.HasGlassBlocks(35))				
					{
						Molpy.SpendGlassBlocks(35);
					}
					else 			
					{
						Molpy.SandTools['Bag'].amount--;
						Molpy.SandTools['Bag'].refresh();
						Molpy.SandToolsOwned--;
						if(!finite&&pg)
							Molpy.AddChips(3500);
					}
				}
			}
			if(Molpy.Got('Catamaran') && Molpy.Boosts['Catamaran'].power)
			{
				if(Molpy.CastleTools['River'].amount)
				{
					items+=(Molpy.CastleTools['River'].amount)*6;
					if(finite&&Molpy.HasGlassBlocks(45))				
					{
						Molpy.SpendGlassBlocks(45);
					}
					else 				
					{
						Molpy.CastleTools['River'].amount--;
						Molpy.CastleTools['River'].refresh();
						Molpy.CastleToolsOwned--;
						if(!finite&&pg)
							Molpy.AddChips(4500);
					}
				}
				if(Molpy.CastleTools['Wave'].amount)	
				{
					items+=(Molpy.CastleTools['Wave'].amount)*6;
					if(finite&&Molpy.HasGlassBlocks(45))				
					{
						Molpy.SpendGlassBlocks(45);
					}
					else 			
					{
						Molpy.CastleTools['Wave'].amount--;
						Molpy.CastleTools['Wave'].refresh();
						Molpy.CastleToolsOwned--;
						if(!finite&&pg)
							Molpy.AddChips(4500);
					}
				}
			}
			if(Molpy.Got('Redundant Raptor') && Molpy.Boosts['Redundant Raptor'].power)
			{
				if(finite&&Molpy.HasGlassBlocks(120))				
				{
					Molpy.SpendGlassBlocks(120);
					items+=Molpy.redactedClicks*2;
				}else if(!finite&&pg)
					Molpy.AddChips(12000);
			}
			var nerf=0;
			if(Molpy.Got('Panther Salve') && Molpy.Boosts['Panther Salve'].power>0)
			{
				Molpy.Boosts['Panther Salve'].power++;
				if(finite&&Molpy.HasGlassBlocks(10))
				{				
					Molpy.SpendGlassBlocks(10);
					bonus*=Math.pow(1.01,items);
					nerf=1;
				}
				else if(!finite&&pg)
				{
					Molpy.AddChips(1000);
				}
			}
			if(Molpy.Got('Fractal Sandcastles'))
			{
				bonus*=Math.ceil((Molpy.Boosts['Fractal Sandcastles'].power+1)/10);
				nerf=1;
			}
			if(nerf)
				bonus=Math.min(bonus,Molpy.castlesBuilt/(50)); //just to keep things sane
			
			bonus = Math.floor(bonus);
			Molpy.Build(bonus);
			if(Molpy.Got('GlassBlocks'))
			{
				var gift=1;
				if(Molpy.Got('SGC'))gift+=Molpy.redactedClicks*Molpy.Boosts['Logicat'].bought;
				if(Molpy.lGlass>0)
				{
					Molpy.lGlass-=gift/100;
					Molpy.AddBlocks(gift);
					if(gift>1&&Molpy.Boosts['AA'].power) Molpy.Notify(Molpify(gift,3)+' Glass Blocks from '+Molpy.Boosts['SGC'].name,1);
				}else{
					gift=Math.ceil(gift/100);
					Molpy.AddChips(gift);				
					if(gift>1&&Molpy.Boosts['AA'].power) Molpy.Notify(Molpify(gift,3)+' Glass Chips from '+Molpy.Boosts['SGC'].name,1);
				}
			}
		}
		Molpy.RewardBlitzing=function()
		{
			if(Molpy.Got('GL'))
			{
				Molpy.Boosts['GL'].power*=1.21; //GW :P
				Molpy.Notify('Lightning struck the same place twice!');
				Molpy.EarnBadge('Strikes Twice');
				Molpy.UnlockBoost('LR');
				return;
			}
			var blitzSpeed=800,blitzTime=23;
			var BKJ = Molpy.Boosts['BKJ'];
			if(BKJ.bought)
			{
				blitzSpeed+= BKJ.power*20;
				if(BKJ.power>24) Molpy.Boosts['BFJ'].department=1;
			}
			if(Molpy.Got('Schizoblitz'))blitzSpeed*=2;
			
			if(Molpy.Got('Blitzing'))
			{
				blitzSpeed+=Molpy.Boosts['Blitzing'].power;
				blitzTime+=Math.floor(Molpy.Boosts['Blitzing'].countdown/2);
			}
			if(blitzSpeed>=1000000) Molpy.EarnBadge('Blitz and Pieces');
			Molpy.GiveTempBoost('Blitzing',blitzSpeed,blitzTime);
		}
		
		Molpy.redactedSGen=InitStatementGen();
		Molpy.MakeRedactedPuzzle=function()
		{
			Molpy.redactedSGen.FillStatements(0,Molpy.Boosts['Logicat'].bought);
			Molpy.redactedPuzzleTarget=Molpy.redactedSGen.RandStatementValue();
			var str='Click a statement that is '+Molpy.redactedPuzzleTarget+':';
			var statements= Molpy.redactedSGen.StringifyStatements('Molpy.ClickRedactedPuzzle');
			for(var i in statements)
			{
				str+='<br><br>'+statements[i];
			}
			Molpy.redactedPuzzleValue=str;
			Molpy.redactedSGen.firstTry=1;
		}
		Molpy.ClickRedactedPuzzle=function(name)
		{
			var skip=0;
			if(!Molpy.redactedSGen.firstTry)
			{
				if(Molpy.HasGlassBlocks(50))
				{
					Molpy.SpendGlassBlocks(50);
				}else{
					Molpy.Notify('You can\'t afford a seccond try.');
					skip=1;
				}
			}
			
			if(!skip)
			{
				var clickedVal=Molpy.redactedSGen.StatementValue(name);
				if(clickedVal==Molpy.redactedPuzzleTarget)
				{
					Molpy.Notify('Correct',1);
					var lc = Molpy.Boosts['Logicat'];
					lc.power+=1+(Molpy.Boosts['Panther Rush'].power)/2;
					while(lc.power>=lc.bought*5)
					{
						Molpy.RewardLogicat(lc.bought);
						lc.bought++;
					}
				}
				else
				{
					Molpy.Notify('Incorrect',1);
					
					if(Molpy.redactedSGen.firstTry&&Molpy.Got('Second Chance')&&Molpy.HasGlassBlocks(50))
					{
						Molpy.redactedSGen.firstTry=0;
						Molpy.Notify('Try Again');
						return;
					}
					Molpy.Boosts['Logicat'].power-=0.5;
				}
			}
		
			Molpy.redactedDrawType[Molpy.redactedDrawType.length-1]='show';
			
			Molpy.redactedPuzzleTarget='Oh no you don\'t!';
			Molpy.shopRepaint=1;
			Molpy.boostRepaint=1;
			Molpy.badgeRepaint=1;
		}
		Molpy.RewardLogicat=function(level)
		{
			Molpy.CheckLogicatRewards(0);
			var availRewards=[];
			for(var i in Molpy.Boosts)
			{
				var me=Molpy.Boosts[i];
				if(!me.unlocked&&me.logic&&level>=me.logic)
				{
					availRewards.push(me);
				}
			}
			
			if(availRewards.length)
			{
				var red=GLRschoice(availRewards);
				if((EvalMaybeFunction(red.sandPrice,red)+EvalMaybeFunction(red.castlePrice,red)+EvalMaybeFunction(red.glassPrice,red)))
				{
					Molpy.Notify('Logicat rewards you with:',1);
					Molpy.UnlockBoost(red.alias);
				}else{
					Molpy.Notify('Your reward from Logicat:',1);
					Molpy.GiveTempBoost(red.alias,red.startPower,red.startCountdown);
				}
				return;
			}
			Molpy.RewardRedacted(1);
			Molpy.GlassNotifyFlush();
		}
		
		Molpy.CalcPriceFactor=function()
		{
			var baseval=1;
			if(Molpy.Got('ASHF'))
			{
				baseval*=(1-Molpy.Boosts['ASHF'].power);
			}
			if(Molpy.Got('Family Discount'))
			{
				baseval*=(0.2);
			}
			Molpy.priceFactor=Math.max(0,baseval);
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
		Molpy.ActivateFactoryAutomation();
		Molpy.recalculateDig=1;
	}
	Molpy.ActivateFactoryAutomation=function()
	{
		if(Molpy.Got('Factory Automation'))
		{
			var i = Molpy.Boosts['Factory Automation'].power+1;
			_gaq&&_gaq.push(['_trackEvent','Factory Automation','Attempt',''+i,true]);
			var npb=Molpy.CastleTools['NewPixBot'];
			if(flandom(((Molpy.Got('Safety Pumpkin')+Molpy.Got('SG'))*10+20-i))==0)
			{
				if(npb.amount)
				{
					npb.amount--;
					npb.refresh();
					Molpy.Notify('Industrial Accident!',1);
					if(i>14)
						Molpy.UnlockBoost('Safety Pumpkin');
				}
			}
			var t=0;
			var spent=0;
			while(i--)
			{
				var sand = 2000000*Math.pow(10000,i);
				if(Molpy.sand>=sand)
				{
					Molpy.SpendSand(sand,1);
					t++;
					spent+=sand;
				}
			}
			t=Math.min(t,Math.floor(npb.amount/20));
			Molpy.Notify('Activating Factory Automation '+t+' time'+plural(t)+' at a cost of '+Molpify(spent,4)+' Sand',1);

			Molpy.FactoryAutomationRun(t);
			_gaq&&_gaq.push(['_trackEvent','Factory Automation','Succeed',''+t,true]);
			
			Molpy.GlassNotifyFlush();
		}
	}
	Molpy.FactoryAutomationRun=function(times)
	{
		var left =times;
		if(Molpy.Got('CfB'))
		{
			left=Molpy.DoBlackprintConstruction(times);
			if(Molpy.Got('AO'))left=times;
		}
		if(left)
		{
			if(!Molpy.Boosts['Cold Mould'].power)
			{
				if (left) left=Molpy.FillGlassMouldWork(left);
				if (left) left=Molpy.MakeGlassMouldWork(left);
				if (left) left=Molpy.FillSandMouldWork(left);
				if (left) left=Molpy.MakeSandMouldWork(left);
				if(Molpy.Got('AO'))left=times;
			}
			
			while(left--)
				Molpy.RewardRedacted(1,left);
		}
	}
	
	Molpy.Shutter=function()
	{
		if(Molpy.HasGlassChips(10))
		{
			Molpy.SpendGlassChips(10);
			var alias='discov'+Molpy.newpixNumber;
			if(!Molpy.Badges[alias])
			{
				Molpy.Notify('You don\'t notice anything especially notable.');
				return;
			}
			if(Molpy.Earned(alias))
			{
				Molpy.Notify('You already have this '+Molpy.Badges[alias].name);
			}else{
				Molpy.EarnBadge(alias,1);
				if (Molpy.newpixNumber < 0) {
					if (Molpy.Boosts['Magic Mirror'].power) 
					{
						if (Molpy.Boosts['Magic Mirror'].power++ >= 10) Molpy.UnlockBoost('Magic Mirror');
					}	
					else Molpy.Boosts['Magic Mirror'].power = 1;
				}
			}
		}else
		{
			Molpy.Notify('Out of Glass Chips');
		}
	}
	
	/*In which we explain how to think
	should be called once per milliNewPix
	++++++++++++++++++++++++++++++++++*/
	Molpy.Think=function()
	{
		Molpy.toolsBuilt=0;
		Molpy.SandToCastles();
		
		var pp = Molpy.Boosts['Price Protection'];
		if(pp.power>1)pp.power--;
		if(! (Molpy.ketchupTime || Molpy.Boosts['Coma Molpy Style'].power))
			Molpy.CheckONG();
		Molpy.CheckRedactedToggle();
		
		for(var i in Molpy.Boosts)//count down any boosts with a countdown
		{
			var me = Molpy.Boosts[i];
			if(me.bought)
			{
				if(me.countdown)
				{
					me.countdown--;
					if(me.hovered)me.hovered=-2; //force redraw
					if(!me.countdown)
					{
						Molpy.LockBoost(i);
						me.power=0;
					}else
					{
						if(me.countdownFunction)me.countdownFunction();
						if(me.hovered<0)me.hover();
					}
				}
			}
			if(me.unlocked)
			{
				if(me.classChange)
				{
					if(me.classChange())
					{
						Molpy.boostRepaint=1;
					}
				}
			}
		}
		for(var i in Molpy.Badges)
		{
			var me = Molpy.Badges[i];
			if(me.earned)
			{
				if(me.classChange)
				{
					if(me.classChange())
					{
						Molpy.badgeRepaint=1;
					}
				}
			}
		}

		if(Molpy.recalculateDig) Molpy.CalculateDigSpeed();
		for(var i in Molpy.SandTools)
		{
			var me = Molpy.SandTools[i];
			me.totalSand+=me.storedTotalSpmNP;
			me.totalGlass+=me.storedTotalGpmNP;
			if(Molpy.IsStatsVisible()&&me.hovered<0)me.hover();
		}
		
		Molpy.Dig(Molpy.sandPermNP);
		Molpy.blockspmnp = Molpy.Boosts['AA'].power * Molpy.Boosts['Glass Blower'].power *Molpy.Boosts['Furnace Multitasking'].power
			*(Molpy.Boosts['Glass Chiller'].power * (1 + Molpy.Boosts['AC'].power)/2 );
		Molpy.chipspmnp = Molpy.Boosts['AA'].power * Molpy.Boosts['Glass Furnace'].power * Molpy.Boosts['Furnace Crossfeed'].power 
			*(Molpy.Boosts['Sand Refinery'].power * (1 + Molpy.Boosts['AC'].power)/2 ) - Molpy.blockspmnp*Molpy.ChipsPerBlock();
		
		if(Molpy.Got('Sand to Glass'))
			Molpy.DigGlass(Molpy.glassPermNP);
		Molpy.GlassNotifyFlush()
		Molpy.RunToolFactory();
		if(Molpy.recalculateDig) Molpy.CalculateDigSpeed();
		if(Molpy.BadgesOwned==0) Molpy.EarnBadge('Redundant Redundancy');
		
		Molpy.Life++;
		Molpy.autosaveCountup++;
		if(Molpy.options.autosave){
			if(Molpy.autosaveCountup>=Molpy.options.autosave*5)
			{
				Molpy.SaveC_STARSTAR_kie(1);
			}
		}
		
		if(Molpy.judgeLevel>1 && Math.floor(Molpy.ONGelapsed/1000)%25==0)
		{
			var j = Molpy.JDestroyAmount();
			var dAmount = j*Molpy.CastleTools['NewPixBot'].amount*25;
			if(!Molpy.Boosts['Bacon'].unlocked)
			if(!isFinite(dAmount)&&Molpy.Got('Frenchbot')&&Molpy.Boosts['Logicat'].bought>100)
			{
				Molpy.Boosts['Logicat'].bought-=100;
				Molpy.Boosts['Logicat'].power-=500;
				Molpy.UnlockBoost('Bacon');
			}
			dAmount = Math.ceil(Math.min(Molpy.castles*.9, dAmount));
			if(Molpy.castles)
			{
				var failed = Molpy.Destroy(dAmount,1);
				Molpy.CastleTools['NewPixBot'].totalCastlesDestroyed+=dAmount;
				if(!failed)
					Molpy.Notify('By the NewpixBots');
			}
		}
		Molpy.Donkey();
		
		if(Math.floor(Molpy.ONGelapsed/1000)%3==0)
			Molpy.flashes=0;
	}
	
	Molpy.CheckONG=function()
	{
		//if there's an ONG
		Molpy.ONGelapsed = new Date().getTime()-Molpy.ONGstart.getTime();
		if(Molpy.npbONG=='mustard')
		{
			Molpy.npbONG=(Molpy.ONGelapsed >= Molpy.ninjaTime);//whoops
		}
		var npPercent = Molpy.ONGelapsed/(Molpy.NPlength*1000);
		Molpy.clockDegrees = (npPercent * 360) + 180; //rotation from top
		g('sectionTimer').innerHTML= 1000-Math.floor(Molpy.ONGelapsed/Molpy.NPlength);
		if(Molpy.ONGelapsed >= Molpy.NPlength*1000)//gotta convert to milliseconds
		{
			Molpy.ONG();
		}else
		if(Molpy.npbONG==0 && Molpy.ninjad==0)
		{
			if(Molpy.ONGelapsed >= Molpy.ninjaTime)//already in milliseconds
			{
				Molpy.npbONG=1;
				if(Math.abs(Molpy.newpixNumber)>1) //obviously you can't have any active npb in first newpix
				{					
					Molpy.ActivateNewPixBots(); //wasn't ninja'd so we get some free sandcastles (neat!)
				}
			}
		}
		Molpy.CheckBeachClass();
	}
	Molpy.preloadedBeach=0;
	Molpy.CheckBeachClass=function()
	{
		var stateClass='beachsafe';
		Molpy.ONGelapsed = new Date().getTime()-Molpy.ONGstart.getTime();
		if(!Molpy.ninjad)
		{
			if((Molpy.ONGelapsed-Molpy.ninjaTime)/Molpy.NPlength>1)			
				stateClass='beachstreakextend';
			else stateClass='beachninjawarning';
		}
		
		if(Molpy.ONGelapsed/Molpy.NPlength>=998&&!Molpy.Boosts['Coma Molpy Style'].power)
		{
			stateClass='beachongwarning';
			if(!Molpy.preloadedBeach)
			{
				Molpy.PreloadBeach();
			}
		}
		Molpy.UpdateBeachClass(stateClass);
	}
	Molpy.ONG=function()
	{
		Molpy.newpixNumber+=(Molpy.newpixNumber>0?1:-1);
		_gaq&&_gaq.push(['_trackEvent','NewPix','ONG',''+Molpy.newpixNumber,true]);
		
		var np=Math.abs(Molpy.newpixNumber);
		if(np > Molpy.highestNPvisited)
		{
			Molpy.highestNPvisited=np;
		}else //in the past
		{
			if(np > 2)
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
		Molpy.lGlass = Molpy.Boosts['Glass Chiller'].power+1; //reset amount of glass available to Not Lucky
		
		var activateTimes=1+Molpy.Got('Doublepost');
		Molpy.buildNotifyFlag=0;
		Molpy.destroyNotifyFlag=0;
		while(activateTimes--)
		{
			if(Molpy.Got('Backing Out'))
			{
				for(i in Molpy.CastleToolsById)
				{
					var t = Molpy.CastleToolsById[i];
					t.DestroyPhase();
					if(t.name!='NewPixBot')
						t.BuildPhase();
				}
			}else
			{
				var i = Molpy.CastleToolsN;
				while(i--)
				{
					Molpy.CastleToolsById[i].DestroyPhase();
				}
			
				i = Molpy.CastleToolsN;
				while(i--)
				{
					var t = Molpy.CastleToolsById[i];
					if(t.name!='NewPixBot')
						t.BuildPhase();
				}
			}
		}
		Molpy.destroyNotifyFlag=1;
		Molpy.Destroy(0);
		
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
		
		
		Molpy.Boosts['Temporal Rift'].department=0;
		if(Molpy.newpixNumber%
			(50-(Molpy.Got('Time Travel')+Molpy.Got('Flux Capacitor')+Molpy.Got('Flux Turbine')+Molpy.Earned('Minus Worlds'))*10)==0)
		{
			Molpy.Boosts['Temporal Rift'].department=(Math.random()*6>=5)*1;
		}
		if(Molpy.Got('SBTF'))
		{
		}
		if(Molpy.Got('Bag Burning')&& !Molpy.Boosts['NewPixBot Navigation Code'].power)
		{
			if(Molpy.SandTools['Bag'].amount>Molpy.npbDoubleThreshold+1 && flandom(36)==0)
			{
				Molpy.BurnBags(1);
			}
		}
		if(Molpy.Got('BBC'))
		{
			var bbc =Molpy.Boosts['BBC'];
			if(bbc.power>=0)
			{
				if(Molpy.HasGlassBlocks(5))
				{
					Molpy.SpendGlassBlocks(5);
					bbc.power=1;
					var mhp = Molpy.Boosts['MHP'];
					if(mhp.unlocked&&mhp.power>20&&flandom(9)==0)
					{
						mhp.power--;
						Molpy.boostRepaint=1;
					}
				}else{
					bbc.power=0;
				}
			}
		}
		Molpy.GlassNotifyFlush();
		if(isFinite(Molpy.castles))
			Molpy.Boosts['MHP'].department=1*(flandom(3)==0);
		if(Molpy.autosaveCountup>1000)
		{
			Molpy.Notify('You have not saved in over a NewPix!!',1);
		}
		if(Molpy.Got('Caged Logicat'))
			Molpy.Boosts['Caged Logicat'].bought=11;
	}
	
	Molpy.BurnBags=function(n,e)
	{	
		if(e)
		{
			if(n>1000)
			{
				n*=2;
				e=1000;
			}else if(n>100)
			{
				n*=5;
				e=100;
			}else if(n>=10)
			{
				n*=10;
				e=10;
			}
		}else e=1;
		var o=n;
		n=Math.floor(Math.min(Molpy.SandTools['Bag'].amount,n));
		e=e*n/o;
		Molpy.SandTools['Bag'].amount-=n;
		Molpy.SandToolsOwned-=n;
		Molpy.SandTools['Bag'].refresh();
		if(n==1)
			Molpy.Notify('A Bag was burned!',1);
		else
			Molpy.Notify(n+' Bags were burned!',1);
		return e;
	}
		
	Molpy.HandlePeriods=function()
	{
		//check length of current newpic
		if(Molpy.newpixNumber<0)Molpy.EarnBadge('Minus Worlds');
		var np = Math.abs(Molpy.newpixNumber);
		if(np <= 240)
		{
			Molpy.NPlength=1800; 
			Molpy.LockBoost('Overcompensating');
			Molpy.LockBoost('Doublepost');
			Molpy.LockBoost('Active Ninja');
			Molpy.LockBoost('Furnace Crossfeed');
			Molpy.LockBoost('Furnace Multitasking');
			Molpy.Boosts['Doublepost'].department=0;	//prevent the department from unlocking these
			Molpy.Boosts['Active Ninja'].department=0;
			Molpy.Boosts['Furnace Crossfeed'].department=0;
			Molpy.Boosts['Furnace Multitasking'].department=0;
			var fa = Molpy.Boosts['Factory Automation'];
			if(fa.power>0 &&!Molpy.Got('SG'))
			{
				fa.power=0;
				Molpy.Notify('Factory Automation Downgraded',1);
			}
		}else
		{		
			Molpy.NPlength=3600;
			Molpy.Boosts['Doublepost'].department=1;
			Molpy.Boosts['Active Ninja'].department=1;
			if(Molpy.Got('Glass Furnace'))
				Molpy.Boosts['Furnace Crossfeed'].department=1;
			if(Molpy.Got('Furnace Crossfeed'))
				Molpy.Boosts['Furnace Multitasking'].department=1;
		}
		if(np > 241)
		{
			Molpy.EarnBadge("Have you noticed it's slower?");
		}
		if(np >= 250)
		{
			Molpy.UnlockBoost('Overcompensating');
		}
		Molpy.TimePeriod=["Here be Kitties"];
		Molpy.TimeEra=["Here be Kitties"];
		Molpy.TimeEon=["Here be Kitties"];
		for(var i in Molpy.Periods)
		{
			var per = Molpy.Periods[i];
			if(np<=per[0])
			{
				Molpy.TimePeriod=per[1];
				break;
			}
		}
		for(var i in Molpy.Eras)
		{
			var era = Molpy.Eras[i];
			if(np<=era[0])
			{
				Molpy.TimeEra=era[1];
				break;
			}
		}
		for(var i in Molpy.Eons)
		{
			var eon = Molpy.Eons[i];
			if(np<=eon[0])
			{
				Molpy.TimeEon=eon[1];
				break;
			}
		}
	}
	
	/* In which loopists do their thing
	+++++++++++++++++++++++++++++++++++*/
	Molpy.Loopist=function()
	{
		Molpy.ketchupTime=0;
		Molpy.lateness+=((new Date().getTime()-Molpy.time));
		Molpy.lateness=Math.min(Molpy.lateness, 7200);//don't ketchup up too much
		while(Molpy.lateness > Molpy.NPlength)
		{
			try{
				Molpy.Think();
			}catch(e)
			{
				alert('Something went wrong in Molpy.Think() '+(Molpy.ketchupTime?'while ketching up: ':': ')+e+'\n\n'+e.stack);
				throw e;
				return;
			}
			Molpy.ketchupTime=1;
			Molpy.lateness -= Molpy.NPlength;
		}
		Molpy.ketchupTime=0;
		try{
			Molpy.Draw();
		}catch(e)
		{
			alert('Something went wrong in Molpy.Draw(): '+e+'\n\n'+e.stack);
			throw e;
			return;
		}
		Molpy.time=new Date().getTime();
		setTimeout(Molpy.Loopist, 1000/Molpy.fps);
	}	
}
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-45954809-1']);
_gaq.push(['_trackPageview']);

(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();


/* In which we make it go!
++++++++++++++++++++++++++*/
Molpy.Up();
window.onload=function()
{
	if(!Molpy.molpish)
	{
		Molpy.Wake();
		_gaq&&_gaq.push(['_trackEvent','Setup','Complete',''+Molpy.version,true]);
	}
};
