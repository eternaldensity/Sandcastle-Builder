Molpy.DefinePersist=function()
{
	Molpy.SaveC_STARSTAR_kie=function(auto)
	{
		if(!auto)
		{
			Molpy.saveCount++;				
			_gaq&&_gaq.push(['_trackEvent','Save','Begin']);
			if(Molpy.saveCount>=20){
				Molpy.UnlockBoost('Autosave Option');	
				Molpy.EarnBadge('This Should be Automatic');
			}
		}else{
			if(!Molpy.Got('Autosave Option')) return;	
		}
		var threads = Molpy.ToNeedlePulledThing();
		var flood = new Date();
		flood.setFullYear(13291);
		flood.setMonth(4);
		flood.setDate(10);
		for(var i in threads)
		{
			var thread=CuegishToBeanish(threads[i]);
			var dough='CastleBuilderGame'+i+'='+escape(thread)+'; expires='+flood.toUTCString()+';'
			document.cookie=dough;//aaand save
				
			if(document.cookie.indexOf('CastleBuilderGame')<0) 
			{
				Molpy.Notify('Error while saving.<br>Export your save instead!',1);
				return;
			}
		}
		document.cookie='CastleBuilderGame=;'; //clear old cookie
		Molpy.Notify('Game saved');
		auto||_gaq&&_gaq.push(['_trackEvent','Save','Complete',''+Molpy.saveCount]);
		
		Molpy.autosaveCountup=0;
	}
	
	Molpy.LoadC_STARSTAR_kie=function()
	{
	
		var thread='';
		if (document.cookie.indexOf('CastleBuilderGame')>=0) 
		{
			var k=['',0,1,2,3,4];
			for(i in k)
			{
				var dough = document.cookie.split('CastleBuilderGame'+k[i]+'=')[1];
				if(dough)
					thread+=BeanishToCuegish(unescape(dough).split(';')[0])||'';
			}
			_gaq&&_gaq.push(['_trackEvent','Load','Begin']);
			Molpy.FromNeedlePulledThing(thread);
			Molpy.loadCount++;
			_gaq&&_gaq.push(['_trackEvent','Load','Complete',''+Molpy.loadCount]);
			Molpy.autosaveCountup=0;
			if(g('game'))
			{
				Molpy.Notify('Game loaded',1);
				if(Molpy.loadCount>=40)
				{
					Molpy.UnlockBoost('Coma Molpy Style');
				}
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
		if(thread=='typo')
		{
			Molpy.options.typo=1*!Molpy.options.typo;
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
		if(thread=='Molpy')
		{
			Molpy.Notify(BeanishToCuegish(BlitzGirl.ChallengeAccepted),1);	
			return;
		}
		if (thread && thread!='')
		{
			_gaq&&_gaq.push(['_trackEvent','Import','Begin']);
			Molpy.FromNeedlePulledThing(BeanishToCuegish(thread));
			_gaq&&_gaq.push(['_trackEvent','Import','Complete']);
			Molpy.SaveC_STARSTAR_kie();
		}
	}
	
	
	/* In which I do save and load!
	+++++++++++++++++++++++++++++++*/
	Molpy.ToNeedlePulledThing=function(exporting)
	{						
		var p='P'; //Pipe seParator
		var s='S'; //Semicolon
		var c='C'; //Comma
		
		var thread='';
		var threads=[];
		thread+=Molpy.version+p+p;//some extra space!
		thread+=Molpy.startDate+p;
		
		thread+=
		(Molpy.options.particles?'1':'0')+
		(Molpy.options.numbers?'1':'0')+
		(Molpy.options.autosave)+
		(Molpy.options.autoupdate?'1':'0')+
		(Molpy.options.sea?'1':'0')+
		(Molpy.options.colpix?'1':'0')+
		(Molpy.options.longpostfix?'1':'0')+
		(Molpy.options.colourscheme)+
		(Molpy.options.sandmultibuy)+
		(Molpy.options.castlemultibuy)+
		(Molpy.options.fade)+
		(Molpy.options.typo)+
		(Molpy.options.science)+
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
		(Molpy.lGlass)+s+
		(Molpy.redactedClicks)+s+
		(Molpy.highestNPvisited)+s+
		(Molpy.totalCastlesDown)+s+
		(Molpy.totalGlassBuilt)+s+
		(Molpy.totalGlassDestroyed)+s+
		(Molpy.chipsManual)+s+
		(Molpy.redactedChain)+s+
		(Molpy.redactedChainMax)+s+
		
		p;
		//sand tools:
		for(var cancerbabies in Molpy.SandTools)
		{
			var cb = Molpy.SandTools[cancerbabies];
			thread += cb.amount+c+cb.bought+c+cb.totalSand+c+cb.temp+c+cb.totalGlass+s;
		}
		thread+=p;
		//castletools:
		for(var cancerbabies in Molpy.CastleTools)
		{
			var cb = Molpy.CastleTools[cancerbabies];
			thread += cb.amount+c+cb.bought+c+cb.totalCastlesBuilt+c+cb.totalCastlesDestroyed+c+
			cb.totalCastlesWasted+c+cb.currentActive+c+cb.temp+c+cb.totalGlassBuilt+c+cb.totalGlassDestroyed+s;
		}
		thread+=p;
		threads.push(thread);
		thread='';
		//boosts:
		for(var cancerbabies in Molpy.Boosts)
		{
			var cb = Molpy.Boosts[cancerbabies];
			thread += cb.unlocked+c+cb.bought+c+cb.power+c+cb.countdown+s;
		}
		thread+=p;
		threads.push(thread);
		thread='';
		//badges:
		for(var cancerbabies in Molpy.Badges)
		{
			var cb = Molpy.Badges[cancerbabies];
			if(cb.group=='badges')
				thread += cb.earned;
		}
		thread+=p;
		//showhide:
		for(var i in Molpy.options.showhideNamesOrder)
		{
			thread+=Molpy.options.showhide[Molpy.options.showhideNamesOrder[i]]?1:0;
		}
		thread+=p;
		threads.push(thread);
		thread='';
		//stuff pretending to be badges:			
		var id=Molpy.Badges['discov1'].id;			
		while(id+3<Molpy.BadgeN)
		{
			thread+=toOct([Molpy.BadgesById[id].earned,Molpy.BadgesById[id+1].earned,Molpy.BadgesById[id+2].earned,Molpy.BadgesById[id+3].earned]).toString(16);
			id+=4;
		}
		thread+=p;
		
		threads.push(thread);
		return threads;
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
		_gaq&&_gaq.push(['_trackEvent','Load','Version',''+version,true]);
		if(version>Molpy.version)
		{
			alert('Error : you are a time traveller attempting to load a save from v'+version+' with v'+Molpy.version+'.');
			return;
		}
		g('title').innerHTML=GLRschoice(['Sandcastle Builder','Sandcastle Builder','Sandcastle Builder','Sandy Clicker','Injokes: The Game','Hotdog of Things that are on my side for 600, Alex','The Dwarf Fortress of Idle Games']);
		
		var pixels = thread[2].split(s);
		Molpy.startDate=parseInt(pixels[0]);
		
		pixels=thread[3].split('');			//whoops used to have ';' here which wasn't splitting!
		Molpy.options.particles=parseInt(pixels[0])||0;
		Molpy.options.numbers=parseInt(pixels[1])||0;
		Molpy.options.autosave=parseInt(pixels[2])||0;
		Molpy.options.autoupdate=parseInt(pixels[3])||0;
		Molpy.options.sea=parseInt(pixels[4])||0;
		Molpy.options.colpix=parseInt(pixels[5])||0;
		Molpy.options.longpostfix=parseInt(pixels[6])||0;
		Molpy.options.colourscheme=parseInt(pixels[7])||0;
		Molpy.options.sandmultibuy=(parseInt(pixels[8]))||0;
		Molpy.options.castlemultibuy=(parseInt(pixels[9]))||0;
		Molpy.options.fade=(parseInt(pixels[10]))||0;
		Molpy.options.typo=(parseInt(pixels[11]))||0;
		Molpy.options.science=(parseInt(pixels[12]))||0;
		if(!g('game'))
		{				
			Molpy.AdjustFade();
			Molpy.UpdateColourScheme();
			return;
		}
		Molpy.ClearLog();
		
		pixels=thread[4].split(s);
		Molpy.newpixNumber=parseInt(pixels[0])||0;
		Molpy.sandDug=parseFloat(pixels[1])||0;
		Molpy.sandManual=parseFloat(pixels[2])||0;
		Molpy.sand=parseFloat(pixels[3])||0;
		Molpy.castlesBuilt=parseFloat(pixels[4])||0;
		Molpy.castles=parseFloat(pixels[5])||0;
		Molpy.castlesDestroyed=parseFloat(pixels[6])||0;
		Molpy.prevCastleSand=parseFloat(pixels[7])||0;
		Molpy.nextCastleSand=parseFloat(pixels[8])||0;
		Molpy.castlesSpent=parseFloat(pixels[9])||0;
		Molpy.sandSpent=parseFloat(pixels[10])||0;
		Molpy.beachClicks=parseInt(pixels[11])||0;
		Molpy.ninjaFreeCount=parseInt(pixels[12])||0;
		Molpy.ninjaStealth=parseInt(pixels[13])||0;
		Molpy.ninjad=parseInt(pixels[14])?1:0;
		Molpy.saveCount=parseInt(pixels[15])||0;
		Molpy.loadCount=parseInt(pixels[16])||0;	
		Molpy.notifsReceived=parseInt(pixels[17])||0;			
		Molpy.timeTravels=parseInt(pixels[18])||0;		
		Molpy.npbONG=parseInt(pixels[19])||0;		
		
		Molpy.redactedCountup=parseInt(pixels[20])||0;			
		Molpy.redactedToggle=parseInt(pixels[21])||0;			
		Molpy.redactedVisible=parseInt(pixels[22])||0;			
		Molpy.lGlass=parseFloat(pixels[23])||0;
		Molpy.redactedClicks=parseInt(pixels[24])||0;	
		if(version < 0.92)
		{	
			//three variables not needed are skipped here
			Molpy.redactedClicks=parseInt(pixels[27])||0;	
			
			var blitzSpeed=parseInt(pixels[28])||0;	//these were saved here in 0.911 and 2
			var blitzTime=parseInt(pixels[29])||0;		//but now are put in the 'Blitzed' boost
		}
		Molpy.highestNPvisited=parseInt(pixels[25])||Math.abs(Molpy.newpixNumber);
		Molpy.totalCastlesDown=parseFloat(pixels[26])||0;
		if(version < 2.1)
			Molpy.tempIntruderBots=parseFloat(pixels[27])||0;
		
		Molpy.totalGlassBuilt=parseFloat(pixels[27])||0;
		Molpy.totalGlassDestroyed=parseFloat(pixels[28])||0;
		Molpy.chipsManual=parseFloat(pixels[29])||0;
		Molpy.redactedChain=parseFloat(pixels[30])||0;
		Molpy.redactedChainMax=parseFloat(pixels[31])||0;
		
		pixels=thread[5].split(s);
		Molpy.SandToolsOwned=0;
		for (var i in Molpy.SandToolsById)
		{
			var me=Molpy.SandToolsById[i];
			if (pixels[i])
			{
				var ice=pixels[i].split(c);
				me.amount=parseFloat(ice[0])||0;
				me.bought=parseFloat(ice[1])||0;
				me.totalSand=parseFloat(ice[2])||0;
				me.temp=parseFloat(ice[3])||0;
				me.totalGlass=parseFloat(ice[4])||0;
				Molpy.SandToolsOwned+=me.amount;
				me.refresh();
			}
			else
			{
				me.amount=0;me.bought=0;me.totalSand=0;me.totalGlass=0;
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
				me.amount=parseFloat(ice[0])||0;
				me.bought=parseFloat(ice[1])||0;
				me.totalCastlesBuilt=parseFloat(ice[2])||0;
				me.totalCastlesDestroyed=parseFloat(ice[3])||0;
				if(!me.totalCastlesDestroyed)me.totalCastlesDestroyed=0;//mustard cleaning
				if(version<3.03)
				{
					Molpy.castlesDestroyed+=me.totalCastlesDestroyed;
				}
				me.totalCastlesWasted=parseFloat(ice[4])||0;
				me.currentActive=parseFloat(ice[5])||0;
				me.temp=parseFloat(ice[6])||0;
				me.totalGlassBuilt=parseFloat(ice[7])||0;
				me.totalGlassDestroyed=parseFloat(ice[8])||0;
				Molpy.CastleToolsOwned+=me.amount;
				me.refresh();
			}
			else
			{
				me.amount=0;me.bought=0;
				me.totalCastlesBuilt=0;
				me.totalCastlesDestroyed=0;
				me.totalCastlesWasted=0;
				me.currentActive=0;
				me.totalGlassBuilt=0;
				me.totalGlassDestroyed=0;
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
				me.unlocked=parseInt(ice[0])||0;
				me.bought=me.unlocked&&parseFloat(ice[1])||0; //ensure boosts that are locked aren't somehow set as bought
				if(version<0.92)
				{
					me.power=0;
					me.countdown=0;                        
				}else{
					me.power=parseFloat(ice[2])||0;
					me.countdown=parseInt(ice[3])||0;
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
				if(isNaN(me.power))
					me.power=0; //compression! :P
				if(isNaN(me.countdown))
					me.countdown=0;
			}
			else
			{
				me.unlocked=0;me.bought=0;me.power=0;me.countdown=0;				
			}
		}
		if(thread[8])
		{
			if(version<2.3)
				pixels=thread[8].split(s);
			else
				pixels=thread[8].split('');
		}else{
			pixels=[];
		}
		Molpy.BadgesOwned=0;
		Molpy.groupBadgeCounts={};
		for (var i in Molpy.BadgesById)
		{
			var me=Molpy.BadgesById[i];
			if(me.group=='badges')
			if (pixels[i])
			{
				me.earned=parseInt(pixels[i])&&1||0;
				if(me.earned)
				{
					Molpy.BadgesOwned++;											
					if(!Molpy.groupBadgeCounts[me.group])
					{
						Molpy.groupBadgeCounts[me.group]=1;
					}else
					{
						Molpy.groupBadgeCounts[me.group]++;
					}
				}
			}
			else
			{
				me.earned=0;					
			}
		}
		if(thread[9])
		{
			pixels=thread[9].split('');
		}else{
			pixels=[];
		}
		for (var i in Molpy.options.showhideNamesOrder)
		{
			var vis = parseInt(pixels[i]);
			if(!isNaN(vis))
				Molpy.options.showhide[Molpy.options.showhideNamesOrder[i]]=vis;
		}	

		if(thread[10])
		{
			if(version<2.3)
				pixels=thread[10].split(s);
			else
				pixels=thread[10].split('');
		}else{
			pixels=[];
		}
		var j=0;
		
		if(version<2.98)
		{
			var cam=version >=2||Molpy.Got('Camera');
			var i = 0;
			var offset=0;
			while (i+offset<Molpy.BadgeN)
			{
				var me=Molpy.BadgesById[i+offset];
				if(j||me.group!='badges')
				{
					if(!j)j=i;
					if(cam&&pixels[i-j])
					{
						me.earned=parseInt(pixels[i-j])&&1||0;
						if(me.earned)
						{
							Molpy.BadgesOwned++;	
							Molpy.unlockedGroups[me.group]=1;										
							if(!Molpy.groupBadgeCounts[me.group])
							{
								Molpy.groupBadgeCounts[me.group]=1;
							}else
							{
								Molpy.groupBadgeCounts[me.group]++;
							}
						}
					}
					else
					{
						me.earned=0;					
					}
				}
				i++;
				if(j) offset=Math.floor((i-j)/3);
			}
		}else
		{
			var id=Molpy.Badges['discov1'].id;
			for(var i in pixels)
			{
				var enhance=fromOct(parseInt(pixels[i]||0,16));
				for(var j in enhance)
				{
					var me=Molpy.BadgesById[id+ +j];
					me.earned=enhance[j]||0;
					if(me.earned)
					{
						Molpy.BadgesOwned++;	
						Molpy.unlockedGroups[me.group]=1;										
						if(!Molpy.groupBadgeCounts[me.group])
						{
							Molpy.groupBadgeCounts[me.group]=1;
						}else
						{
							Molpy.groupBadgeCounts[me.group]++;
						}
					}
				}
				id+=4;
				if(version<3.1892)
					id+=4;
			}
			while(id<Molpy.BadgeN)
			{
				Molpy.BadgesById[id].earned=0;
				id++;
			}
		}
		Molpy.SelectShoppingItem();
		
		Molpy.needlePulling=0;//badges are loaded now
		
		if(version<2.1)
		{
			Molpy.CastleTools['NewPixBot'].temp=Molpy.tempIntruderBots;
			if(!isFinite(Molpy.castlesDown))
			{
				Molpy.castlesDown=DeMolpify('1WTF'); //:P
			}
		}
		if(version<2.32)
		{
			var tt=Molpy.Boosts['Time Travel'];
			if(tt.bought&&tt.power!=1)
			{
				tt.power=1;
				Molpy.Notify(BeanishToCuegish(BlitzGirl.Apology),1);
			}
		}
		if(version<2.8)
		{
			if(Molpy.Got('Glass Ceiling 10'))
			{
				Molpy.LockBoost('Glass Ceiling 10');
				Molpy.UnlockBoost('Glass Ceiling 10');
			}
			if(Molpy.Got('Glass Ceiling 11'))
			{
				Molpy.LockBoost('Glass Ceiling 11');
				Molpy.UnlockBoost('Glass Ceiling 11');
			}
		}
		if(version<2.85)
		{
			if(Molpy.Boosts['Bacon'].unlocked)
			{
				if(Molpy.Boosts['Logicat'].bought>100)
				{
					Molpy.Boosts['Logicat'].bought-=100;
					Molpy.Boosts['Logicat'].power-=400;
				}else
				{
					Molpy.Boosts['Logicat'].power+=100;
					Molpy.LockBoost('Bacon');
					Molpy.Notify('That should not have unlocked quite yet. A higher Logicat Level is needed.');
				}
			}
		}
		if(version<2.891)
		{
			if(Molpy.Got('Safety Hat'))
			{
				Molpy.Boosts['Safety Hat'].bought=0;
				Molpy.Boosts['Safety Hat'].unlocked=0;
				Molpy.BoostsOwned--;
			}
			if(Molpy.Got('Backing Out')&&Molpy.Boosts['Logicat'].bought<120)
			{
				Molpy.Boosts['Backing Out'].bought=0;
				Molpy.Boosts['Backing Out'].unlocked=0;
				Molpy.BoostsOwned--;
			}
		}
		if(version<2.895)
		{
			if(Molpy.CastleTools['Trebuchet'].amount<4000)
			{
				if(Molpy.Got('Stained Glass Launcher'))
				{
					Molpy.Boosts['Stained Glass Launcher'].bought=0;
					Molpy.Boosts['Stained Glass Launcher'].unlocked=0;
					Molpy.BoostsOwned--;
					Molpy.AddBlocks(1200000); //assume all discounts were used :P
				}else
					Molpy.Boosts['Stained Glass Launcher'].unlocked=0;
				
			}
			if(Molpy.SandTools['Ladder'].amount<15000)
			{				
				if(Molpy.Got('Crystal Peak'))
				{
					Molpy.Boosts['Crystal Peak'].bought=0;
					Molpy.Boosts['Crystal Peak'].unlocked=0;
					Molpy.BoostsOwned--;
					Molpy.AddBlocks(720000);
				}else
					Molpy.Boosts['Crystal Peak'].unlocked=0;
			}	
			if(Molpy.SandTools['Bag'].amount<12000)
			{
				if(Molpy.Got('Cupholder'))
				{
					Molpy.Boosts['Cupholder'].bought=0;
					Molpy.Boosts['Cupholder'].unlocked=0;
					Molpy.BoostsOwned--;
					Molpy.AddBlocks(880000);
				}else
					Molpy.Boosts['Cupholder'].unlocked=0;
			}
			if(Molpy.SandTools['LaPetite'].amount<8000)
			{
				if(Molpy.Got('Tiny Glasses'))
				{
					Molpy.Boosts['Tiny Glasses'].bought=0;
					Molpy.Boosts['Tiny Glasses'].unlocked=0;
					Molpy.BoostsOwned--;
					Molpy.AddBlocks(960000);
				}else
					Molpy.Boosts['Tiny Glasses'].unlocked=0;	
			}					
		}
		if(version<2.95)
		{
			if(Molpy.Got('Glass Saw'))Molpy.Boosts['Glass Saw'].buyFunction();
		}
		if(version<2.96)
		{
			Molpy.LockBoost('AC');
			Molpy.Boosts['AC'].power=1;
		}
		if(version<3.07)
		{
			Molpy.Boosts['Overcompensating'].power=Molpy.Boosts['Overcompensating'].startPower;
			if(Molpy.Got('Panther Rush'))Molpy.Boosts['Panther Rush'].buyFunction();
		}
		if(version<3.13)
		{
			if(!Molpy.Earned('Getting Expensive')&&!isFinite(Molpy.castles))
			{
				Molpy.Notify('Added a new Badge to help very early beginners, and you seem to be beyond the point where you could easily get it normally, so here it is.',1);
				Molpy.EarnBadge('Getting Expensive');
			}
		}
		if(version<3.186)
		{
			if(Molpy.Got('Price Protection'))Molpy.Boosts['Price Protection'].bought=4;
		}
		if(version<3.187)
		{
			if(Molpy.Boosts['MHP'].power>12)Molpy.Boosts['MHP'].power=12;
		}
		if(version<3.189)
		{
			if(Molpy.Got('Impervious Ninja'))
			{
				var imp = Molpy.Boosts['Impervious Ninja'];
				imp.power=Math.ceil(imp.countdown/1000);
				imp.countdown=0;
				Molpy.Notify('Impervious Ninja change: it now gives '+Molpify(imp.power)+' Ninja Forgiveness, rather than a countdown. Also it uses 1% of your Glass Chips (in storage) per use.',1);
			}
		}
		if(version<Molpy.version) //hey let's do this every upgrade!
		{	
			Molpy.Notify('Upgraded to new version!',1);		
			if(Molpy.Boosts['Safety Hat'].unlocked&&Molpy.Got('Safety Pumpkin')&&!Molpy.Boosts['SG'].unlocked)
				Molpy.UnlockBoost('SG');
			else if(!Molpy.Got('SG'))
				Molpy.UnlockBoost('Safety Hat');
		}
		Molpy.UpdateColourScheme();
		Molpy.AdjustFade();
		Molpy.LockBoost('MHP');
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
			
			auto||_gaq&&_gaq.push(['_trackEvent','Molpy Down','Begin',''+Molpy.newpixNumber]);
			Molpy.sandDug=0; 
			Molpy.sand=0; 
			Molpy.sandManual=0;
			Molpy.chipsManual=0;
			if(isFinite(Molpy.castlesBuilt))
				Molpy.totalCastlesDown+=Molpy.castlesBuilt;
			else Molpy.totalCastlesDown=Number.MAX_VALUE;
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
			Molpy.options.sandmultibuy=0;
			Molpy.options.castlemultibuy=0;
						
			for(i in Molpy.SandTools)
			{
				var me = Molpy.SandTools[i];
				me.amount=0;
				me.bought=0;
				me.totalSand=0;
				me.totalGlass=0;
				me.temp=0;
				me.refresh();
			}
			for(i in Molpy.CastleTools)
			{
				var me = Molpy.CastleTools[i];
				me.amount=0;
				me.bought=0;
				me.temp=0;
				if(i!='NewPixBot')
					me.totalCastlesBuilt=0;
				me.totalCastlesDestroyed=0;
				me.totalCastlesWasted=0;
				me.currentActive=0;
				me.totalGlassBuilt=0;
				me.totalGlassDestroyed=0;
				me.refresh();
			}
			for(i in Molpy.Boosts)
			{
				var me = Molpy.Boosts[i];
				me.unlocked=0;
				me.bought=0;	
				me.power=0;
				if(me.startPower)
					me.power=EvalMaybeFunction(me.startPower);
				me.countdown=0;
			}
			Molpy.recalculateDig=1;
			Molpy.boostRepaint=1;
			Molpy.shopRepaint=1;
			
			Molpy.showOptions=0;
			Molpy.OptionsToggle();
			
			Molpy.UpdateBeach();
			Molpy.HandlePeriods();
			Molpy.EarnBadge('Not Ground Zero');
			Molpy.AdjustFade();
			Molpy.UpdateColourScheme();
			auto||_gaq&&_gaq.push(['_trackEvent','Molpy Down','Complete',''+Molpy.highestNPvisited]);
		}
	}
	Molpy.Coma=function()
	{
		if(confirm('Really coma?\n(This will wipe all progress and badges!)') &&
		confirm('Seriously, this will reset ALL the things.\nAre you ABSOLUTELY sure?'))
		{
			//reset the badges
			_gaq.push(['_trackEvent','Coma','Begin',''+Molpy.newpixNumber]);
			Molpy.options.fade=0;
			Molpy.Down(1);				
			Molpy.saveCount=0;
			Molpy.loadCount=0;
			var highest = Molpy.highestNPvisited;
			Molpy.highestNPvisited=0;
			Molpy.BadgesOwned=0;
			Molpy.groupBadgeCounts={};
			Molpy.redactedClicks=0;
			Molpy.timeTravels=0;
			Molpy.totalCastlesDown=0;
			Molpy.toolsBuiltTotal=0;
			Molpy.totalGlassBuilt=0;
			Molpy.totalGlassDestroyed=0;
			Molpy.CastleTools['NewPixBot'].totalCastlesBuilt=0; //because we normally don't reset this.
			for (var i in Molpy.BadgesById)
			{
				Molpy.BadgesById[i].earned=0;						
			}
			Molpy.badgeRepaint=1;
			_gaq.push(['_trackEvent','Coma','Complete',''+Molpy.highestNPvisited]);
		}
	}
}