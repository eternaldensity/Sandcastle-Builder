﻿Molpy.DefineGUI=function()
{
	Molpy.IsChildOf=function(child,parent)
	{
		if(!child)return;
		var current = child;
		while(current = current.parentNode)
		{
			if(current == parent)
				return 1;
		}
	}

	Molpy.Onhover=function(me,event)
	{
		if(me.hoverOnCounter>0||Molpy.Boosts['Expando'].power)
		{
			
			if(me.earned&&me.np&&Molpy.previewNP!=me.np&&me.alias.indexOf('monumg')==0)
			{
				Molpy.previewNP=me.np;
				Molpy.UpdateBeach(me.np);
			}
			return;
		}
		me.hoverOnCounter=Math.ceil(Molpy.fps/2);
		me.hoverOffCounter=-1;
	}
	Molpy.Onunhover=function(me,event)
	{				
		if(Molpy.IsChildOf(event.relatedTarget,event.currentTarget)) return;
		me.hoverOffCounter=Math.ceil(Molpy.fps*1.5);
		me.hoverOnCounter=-1;
		
		if(me.earned&&me.np&&Molpy.previewNP==me.np&&Molpy.Boosts['Expando'].power&&me.alias.indexOf('monumg')==0)
		{
			Molpy.previewNP=0;
			Molpy.UpdateBeach();
		}
	}

	Molpy.ShowhideButton=function(key)
	{
		return '<input type="Button" value="'+(Molpy.activeLayout.lootVis[key]?'Hide':'Show')+'" onclick="Molpy.ShowhideToggle(\''+key+'\')"></input>'
	}
	Molpy.ShowhideToggle=function(key,val)
	{
		if(val==undefined)
		{
			Molpy.activeLayout.lootVis[key]=!Molpy.activeLayout.lootVis[key];
		}else{
			Molpy.activeLayout.lootVis[key]=val==true;
		}
		if(Molpy.activeLayout.lootVis[key])
		{
			if(key=='tagged')
			{
				for(var k in Molpy.activeLayout.lootVis)
				{
					Molpy.activeLayout.lootVis[k]=k==key; //when showing tagged, hide all others
				}
			}else{
				Molpy.activeLayout.lootVis.tagged=0; //hide tagged when showing anything else
			}
		}
		Molpy.shopRepaint=1;
		Molpy.boostRepaint=1;
		Molpy.badgeRepaint=1;
	}
	Molpy.ShowGroup=function(group,tagged)
	{		
		if(Molpy.redactedDrawType[Molpy.redactedDrawType.length-1]!='hide1')
		{
			if(tagged)
			{
				if(!Molpy.activeLayout.lootVis.tagged)
				{
					Molpy.ShowhideToggle('tagged');
				}
			}else{
				if(!Molpy.activeLayout.lootVis[group])
				{
					Molpy.ShowhideToggle(group);
				}
			}
		}
	}
	
	Molpy.PriceSort=function(a,b)
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
	Molpy.ClassNameSort=function(a,b)
	{
		var at = a.className||'z';
		var bt = b.className||'z';
		var ag = a.group;
		var bg = b.group;
		var an = a.name;
		var bn = b.name
		if (at>bt) return 1;
		else if (at<bt) return -1;
		else
		if (ag>bg) return 1;
		else if (ag<bg) return -1;
		else
		if (an>bn) return 1;
		else if (an<bn) return -1;
		else return 0;
	}
	Molpy.FormatPrice=function(monies,item)
	{
		return Molpify(Math.floor(EvalMaybeFunction(monies,item,1)*Molpy.priceFactor),1);
	}
	
	Molpy.ToggleView=function(name,val)
	{
		var sh = Molpy.activeLayout.boxVis;
		if(val==undefined)
		{
			sh[name]=!sh[name];
		}else
		{
			sh[name]=val==true;//ensure boolean for jQuery
		}
		$('#'+'section'+name).toggleClass('hidden',!sh[name]);
		$('#toggle'+name).toggleClass('depressed',sh[name]);
		if(sh[name])
		{
			var refresh=Molpy['Refresh'+name];
			if(refresh)refresh();
		}
	}

	Molpy.RefreshOptions=function()
	{
		if(!Molpy.molpish)return;
		Molpy.EarnBadge('Decisions, Decisions');
		if(Molpy.Got('Autosave Option')){
			g('autosaveoption').className='minifloatbox';
		}else{
			g('autosaveoption').className='hidden';
		}
		if(Molpy.Got('Chromatic Heresy')){
			g('otcoloption').className='minifloatbox';
		}else{
			g('otcoloption').className='hidden';
		}
		if(Molpy.Got('Sand Tool Multi-Buy')){
			g('sandmultibuy').className='minifloatbox';
		}else{
			g('sandmultibuy').className='hidden';
		}
		if(Molpy.Got('Castle Tool Multi-Buy')){
			g('castlemultibuy').className='minifloatbox';
		}else{
			g('castlemultibuy').className='hidden';
		}
		if(Molpy.Earned('I love my flashy gif')){
			g('fadeoption').className='minifloatbox';
		}else{
			g('fadeoption').className='hidden';
		}
		var i = Molpy.optionNames.length
		while(i--)
		{
			Molpy.OptionDescription(Molpy.optionNames[i],1); //show all descriptions
		}
	}
	
	Molpy.RefreshStats=function()
	{
		Molpy.EarnBadge('Far End of the Bell Curve');
		Molpy.shopRepaint=1;
		Molpy.boostRepaint=1;
		Molpy.badgeRepaint=1;
	}
	Molpy.StatsTabChange=function(n)
	{
		$('.statsTab').removeClass('unhidden').addClass('hidden');
		$('#statsTab'+n).removeClass('hidden').addClass('unhidden');
		$('.statsButton').removeClass('selectedBox');
		$('#statsButton'+n).addClass('selectedBox');			
	}
	
	Molpy.RefreshExport=function()
	{
		if(!Molpy.molpish)return;
		_gaq&&_gaq.push(['_trackEvent','Export','Begin']);
		var threads = Molpy.ToNeedlePulledThing();
		_gaq&&_gaq.push(['_trackEvent','Export','Complete']);
		var thread='';
		for(var i in threads)
		{
			thread+=threads[i]
		}
		g('exporttext').value= Molpy.CuegishToBeanish(thread);
	}
	
	Molpy.flashes=0;
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
			Molpy.flashes++;
			if(Molpy.flashes==30)
			{
				Molpy.EarnBadge('I love my flashy gif');
			}
		}else if(bacon=='colpix')
		{
			Molpy.options.colpix++;
			if(Molpy.options.colpix>=2)Molpy.options.colpix=0;
			Molpy.UpdateColourScheme();
		}else if(bacon=='longpostfix')
		{
			Molpy.options.longpostfix++;
			if(Molpy.options.longpostfix>=2)Molpy.options.longpostfix=0;
			Molpy.shopRepaint=1;
		}else if(bacon=='sandmultibuy')
		{
			Molpy.options.sandmultibuy++;
			Molpy.shopRepaint=1;
			if(Molpy.options.sandmultibuy>5)Molpy.options.sandmultibuy=0;
		}else if(bacon=='castlemultibuy')
		{
			Molpy.options.castlemultibuy++;
			Molpy.shopRepaint=1;
			if(Molpy.options.castlemultibuy>5)Molpy.options.castlemultibuy=0;
		}else if(bacon=='fade')
		{
			Molpy.options.fade++;
			if(Molpy.options.fade>10)Molpy.options.fade=0;
			Molpy.AdjustFade();
		}else if(bacon=='science')
		{
			Molpy.options.science++;
			if(Molpy.options.science>1)Molpy.options.science=0;
			Molpy.shopRepaint=1;
			Molpy.boostRepaint=1;
			Molpy.badgeRepaint=1;
		}else return;
		
		Molpy.OptionDescription(bacon,1); //update description
		}
	Molpy.optionNames=['autosave','colourscheme','sandnumbers','colpix','longpostfix','sandmultibuy','castlemultibuy','fade','science'];
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
			}else if(bacon=='colpix')
			{
				var nu = Molpy.options.colpix;
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
			}else if(bacon=='science')
			{
				var sc = Molpy.options.science;
				if(!sc){
					desc="No";
				}else{
					desc="Yes";
				}
			}else if(bacon=='fade')
			{
				var f = Molpy.options.fade;
				if(!f){
					desc="No";
				}else{
					desc=Molpify(f/2,1)+'s';
				}
			}else if(bacon=='sandmultibuy')
			{
				desc = Math.pow(4,Molpy.options.sandmultibuy) + ' tool' + plural(Molpy.options.sandmultibuy+1)
			}else if(bacon=='castlemultibuy')
			{
				desc = Math.pow(4,Molpy.options.castlemultibuy) + ' tool' + plural(Molpy.options.castlemultibuy+1)
			}else{
				return;
			}
		}
		g(bacon+'description').innerHTML='<br>'+desc;
	}
	Molpy.UpdateColourScheme=function()
	{
		var heresy='';
		if(g('game'))
		{
			if(Molpy.Got('Chromatic Heresy')&&Molpy.Boosts['Chromatic Heresy'].power>0)
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
			
	Molpy.AdjustFade=function()
	{
		var val='';
		if(Molpy.options.fade)
		{
			for(var i in fadeProps)
			{
				if(+i) val+=', ';
				val+=fadeProps[i]+' '+Molpy.options.fade/2+'s ease-out';
			}
		}
		if(!$)return;
		var fc = $(fadeClasses);
		for(var j in vendors)
			fc.css(vendors[j]+'transition',val);	
			
		if(Molpy.options.fade)
		{
			val=',background-image '+Molpy.options.fade/2+'s ease-out';
		}		
		var fc = $('#beach');
		for(var j in vendors)
			fc.css(vendors[j]+'transition','opacity 0.1s ease-out,'+vendors[j]+'transform 0.1s ease-out'+val);
	}
	
	
	if(!g('game'))
	{
		Molpy.LoadC_STARSTAR_kie();
		g('indexversion').innerHTML='The Game of Time. Version '+Molpy.version;
		return;
	}
	
	createClockHand();
	
	var fadeClasses='body , .floatbox , .lootbox , .minifloatbox , .floatsquare , .infobox , .icon , .descshow , .deschide , .badge.shop h1';
	var vendors=['-webkit-','-moz-','-o-','-ms-',''];
	var fadeProps=['color','border-color','background-color','background-image'];
	
	Molpy.unlockedGroups={};
	Molpy.PaintLootToggle=function(gr,kind)
	{
		var str='';
		if(Molpy.unlockedGroups[gr])
		{
			var id = Molpy.groupNames[gr][2]||'';
			if(id) id= ' id="'+id+'"';
			var r = (Molpy.redactedVisible==kind&&Molpy.redactedGr==gr);
			if(r)id='';
			str+= '<div class="floatsquare loot '+(kind==4?'boost':'badge')+'"><h3>'+Molpy.groupNames[gr][1]+'</h3><br>'+Molpy.ShowhideButton(gr)
				+'<div class="icon'
				+(r?' redacted"':'"')
				+id+'></div></div>';
		}
		return str;
	}
	Molpy.RepaintLootSelection=function()
	{
		var str = '';
		var groups = ['boosts','ninj','cyb','hpt','bean','chron','ceil','drac'];
		for(var i in groups)
		{
			str+=Molpy.PaintLootToggle(groups[i],4);
		}
		if(Molpy.BadgesOwned)
		{
			str+= '<div class="floatsquare badge loot"><h3>Badges<br>Earned</h3>'
				+Molpy.ShowhideButton('badges')+'<div class="icon '
				+(Molpy.redactedVisible==5&& Molpy.redactedGr=='badges'?'redacted':'')
				+'"></div></div>';
		}
		var groups = ['discov','monums','monumg'];
		for(var i in groups)
		{
			str +=Molpy.PaintLootToggle(groups[i],5);
		}
		if(Molpy.BadgeN-Molpy.BadgesOwned)
		{
			str+= '<div class="floatsquare badge shop"><h3>Badges<br>Available</h3>'
				+Molpy.ShowhideButton('badgesav')+'<div class="icon '
				+(Molpy.redactedVisible==6?'redacted':'')
				+'"></div></div>';
		}
		if(Molpy.Boosts['Chromatic Heresy'].unlocked)
		{
			str+= '<div class="floatsquare boost loot alert"><h3>Tagged<br>Items</h3>'
				+Molpy.ShowhideButton('tagged')+'<div id="boost_chromatic" class="icon '
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
		var expando=Molpy.Boosts['Expando'].power;
		var toolsUnlocked=1;			
		for (var i in Molpy.SandTools)
		{
			if(Molpy.SandTools[i].bought>=Molpy.SandTools[i].nextThreshold)toolsUnlocked++;
		}
		
		if(Molpy.redactedVisible==1)
		{
			if(Molpy.redactedViewIndex==-1)
			{
				Molpy.redactedViewIndex=Math.floor((toolsUnlocked)*Math.random());					
			}
			redactedIndex=Molpy.redactedViewIndex;
		}

		var str='';
		var i=0;
		var nBuy = Math.pow(4,Molpy.options.sandmultibuy);
		while (i < Math.min(toolsUnlocked, Molpy.SandToolsN))
		{
			if(i==redactedIndex) str+= Molpy.RedactedHTML();
			var me=Molpy.SandToolsById[i];
			var formattedName = format(me.name);
			if(Molpy.Got('Glass Ceiling '+(i*2))) formattedName = 'Glass '+formattedName;
			var salebit='';
			if(isFinite(Molpy.priceFactor*me.price)||!(Molpy.Earned(me.name+' Shop Failed')&&Molpy.Got('Tool Factory')))
			{
				salebit='<br><a id="SandToolBuy'+me.id+'" onclick="Molpy.SandToolsById['+me.id+'].buy();">Buy&nbsp;'+nBuy+'</a>'
					+(Molpy.Boosts['No Sell'].power?'':' <a onclick="Molpy.SandToolsById['+me.id+'].sell();">Sell</a>');
			}
			var price = '';
			if(isFinite(Molpy.priceFactor*me.price)||!Molpy.Got('Tool Factory')||!Molpy.Got('Glass Ceiling '+i*2))
				price = Molpy.FormatPrice(me.price,me)+(me.price==1?' Castle':(me.price<100?' Castles':' Ca'));
			else
				price = Molpify(1000*(i*2+1),3)+' Chips';
			str+='<div class="floatbox tool sand shop" onMouseOver="Molpy.Onhover(Molpy.SandToolsById['+me.id
				+'],event)" onMouseOut="Molpy.Onunhover(Molpy.SandToolsById['+me.id+'],event)"><div id="tool'+me.name.replace(' ', '')
				+'" class="icon"></div><h2>'
				+formattedName+salebit+'</h2>'+
				(me.amount>0?'<div class="owned">Owned: '+Molpify(me.amount,3)
				+'</div>':'')+
				'<div class="price">Price: '+price+'</div>'+
				'<div id="SandToolProduction'+me.id+'"></div><div class="'
				+Molpy.DescClass(me)+'" id="SandToolDescription'+me.id+'"></div></div></div>';
			if(expando)me.hoverOnCounter=1;
			i++
		}
		if(i==redactedIndex) str+= Molpy.RedactedHTML();
		g('sandtools').innerHTML=str;
		
		toolsUnlocked=1;			
		for (var i in Molpy.CastleTools)
		{
			if(Molpy.CastleTools[i].bought>=Molpy.CastleTools[i].nextThreshold)toolsUnlocked++;
		}
		
		redactedIndex=-1;
		if(Molpy.redactedVisible==2)
		{
			if(Molpy.redactedViewIndex==-1)
			{
				Molpy.redactedViewIndex=Math.floor((toolsUnlocked)*Math.random());
			}
			redactedIndex=Molpy.redactedViewIndex;
		}
					
		str='';
		i=0;
		var nBuy = Math.pow(4,Molpy.options.castlemultibuy);
		while (i < Math.min(toolsUnlocked, Molpy.CastleToolsN))
		{
			if(i==redactedIndex) str+= Molpy.RedactedHTML();
			var me=Molpy.CastleToolsById[i];
			var formattedName = format(me.name);
			if(Molpy.Got('Glass Ceiling '+(i*2+1))) formattedName = 'Glass '+formattedName;
			var salebit='';
			if(isFinite(Molpy.priceFactor*me.price)||!(Molpy.Earned(me.name+' Shop Failed')&&Molpy.Got('Tool Factory')))
			{
				salebit='<br><a id="CastleToolBuy'+me.id+'" onclick="Molpy.CastleToolsById['+me.id+'].buy();">Buy&nbsp;'+nBuy+'</a>'
					+(Molpy.Boosts['No Sell'].power?'':' <a onclick="Molpy.CastleToolsById['+me.id+'].sell();">Sell</a>');
			}
			var price = '';
			if(isFinite(Molpy.priceFactor*me.price)||!Molpy.Got('Tool Factory')||!Molpy.Got('Glass Ceiling '+(i*2+1)))
				price = Molpy.FormatPrice(me.price,me)+(me.price==1?' Castle':(me.price<100?' Castles':' Ca'));
			else
				price = Molpify(1000*(i*2+2),3)+' Chips';
			str+='<div class="floatbox tool castle shop" onMouseOver="Molpy.Onhover(Molpy.CastleToolsById['+me.id
				+'],event)" onMouseOut="Molpy.Onunhover(Molpy.CastleToolsById['+me.id+'],event)"><div id="tool'+me.name.replace(' ', '')
				+'" class="icon"></div><h2>'+formattedName+salebit+'</h2>'
				+(me.amount>0?'<div class="owned">Owned: '+Molpify(me.amount,3)
				+'</div>':'')+
				'<div class="price">Price: '+price+'</div>'
				+'<div id="CastleToolProduction'+me.id+'"></div><div class="'+Molpy.DescClass(me)+'" id="CastleToolDescription'+me.id+'"></div></div></div>';
			if(expando)me.hoverOnCounter=1;
			i++
		}
		if(i==redactedIndex) str+= Molpy.RedactedHTML();
		g('castletools').innerHTML=str;		
	}
	
	//f= force (show regardless of group visibility
	//r = redacted index
	Molpy.BoostString=function(me,f,r)
	{		
		var cn= me.className||'';
		var group= me.group;
		if(r)
		{
			r=Molpy.RedactedHTML(1);
			Molpy.redactedGr=group;
		}else{
			r='';
		}
		
		if(!(Molpy.activeLayout.lootVis[group]||f))return'';
		if(cn)Molpy.UnlockBoost('Chromatic Heresy');
		
		
		cn = r+'<div class="boost '+(me.bought?'lootbox loot ':'floatbox shop ')+cn;
		var heading= '<h1>['+Molpy.groupNames[group][0]+']</h1>';
		var buy= '';
		if(!me.bought)
		{
			buy='<br><a id="BoostBuy'+me.id+'" onclick="Molpy.BoostsById['+me.id+'].buy();">Buy</a>';
			if(me.sandPrice||me.castlePrice||me.glassPrice)
			{
				buy+='<div class="price"> Price: ';
				if(me.sandPrice) buy +=Molpy.FormatPrice(me.sandPrice,me)+' Sand '+(me.castlePrice||me.glassPrice?'+ ':'');
				if(me.castlePrice) buy +=Molpy.FormatPrice(me.castlePrice,me)+' Castle'+plural(Molpy.FormatPrice(me.castlePrice,me))+' '+(me.glassPrice?'+ ':'');
				if(me.glassPrice) buy +=Molpy.FormatPrice(me.glassPrice,me)+' Glass Block'+plural(Molpy.FormatPrice(me.glassPrice));
				buy+='</div>';
			}
		}
		if(Molpy.Boosts['Expando'].power)me.hoverOnCounter=1;
		
		return cn+'" onMouseOver="Molpy.Onhover(Molpy.BoostsById['+me.id+'],event)" onMouseOut="Molpy.Onunhover(Molpy.BoostsById['+me.id
			+'],event)"><div id="boost_'+(me.icon?me.icon:me.id)+'" class="icon"></div>'+heading+'<h2>'+format(me.name)+buy+'</h2>'
			+'<div class="'+Molpy.DescClass(me)+'" id="BoostDescription'+me.id+'"></div></div></div>';
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
		alist.sort(Molpy.PriceSort);
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
			if(r==redactedIndex) str+= Molpy.RedactedHTML();
			var me=Molpy.BoostsInShop[i];
			str+=Molpy.BoostString(me,1);
			r++;
		}
		if(r==redactedIndex) str+= Molpy.RedactedHTML();
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
		blist.sort(Molpy.PriceSort);
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
	
	//f= force (show regardless of group visibility
	//r = redacted index
	Molpy.BadgeString=function(me,f,r)
	{
		var group=me.group
		if(r)
		{
			r=Molpy.RedactedHTML(1);
			Molpy.redactedGr=group;
		}
		else r='';
		
		if(!(Molpy.activeLayout.lootVis[group]||f))return'';
		if(f&!me.bought&&group!='badges')return''; //this is for badgesav group
		var cn= me.className||'';		
		var status='';
		if(me.np)
		{
			var nGroup = Molpy.nextBageGroup[group];
			var nBadge=Molpy.Badges[nGroup+me.np];
			if(nBadge&&!nBadge.earned)
			{
				status=' +';
				cn='action';
			}
		}
		var heading= '<h1>['+Molpy.groupNames[group][0]+']'+status+'</h1>';	
		if(cn&&me.earned)Molpy.UnlockBoost('Chromatic Heresy');
		cn+=' lootbox badge '+(me.earned?'loot':'shop');
		if(Molpy.Boosts['Expando'].power)me.hoverOnCounter=1;
		
		var str =  heading+'<div id="badge_'+(me.icon?me.icon:me.id)+'" class="icon"></div><h2>'+(me.earned||me.visibility<2?me.name:'????')
			+'</he><div class="'+Molpy.DescClass(me)+'" id="BadgeDescription'+me.id+'"></div></div>';
		str=Molpy.MaybeWrapFlipHoriz(str,group!='badges'&&me.np<0);
		return r+'<div class="'+cn+'" onMouseOver="Molpy.Onhover(Molpy.BadgesById['+me.id+'],event)" onMouseOut="Molpy.Onunhover(Molpy.BadgesById['+me.id
			+'],event)">'+str+'</div>';				 
	}
	
	Molpy.MaybeWrapFlipHoriz=function(str,condition)
	{
		if(condition)return Molpy.WrapFlipHoriz(str);
		return str;
	}
	Molpy.WrapFlipHoriz=function(str)
	{
		return'<div class="flip-horizontal">'+str+'</div>';
	}
	
	Molpy.RepaintBadges=function()
	{
		Molpy.badgeRepaint=0;
		var str='';			
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
			var me=blist[i];					
			str+=Molpy.BadgeString(me,0,r==redactedIndex);
			r++;
		}
		if(r==redactedIndex) str+= Molpy.RedactedHTML(1);
		
		Molpy.badgeHTML=str;
		str='';			
		if(Molpy.activeLayout.lootVis.badgesav){
			var blist=[];
			for (var i in Molpy.Badges)
			{
				var me=Molpy.Badges[i];
				if (!me.earned&&me.group=='badges')
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
				var me=blist[i];
				str+=Molpy.BadgeString(me,1,r==redactedIndex);
				r++;
			}
			if(r==redactedIndex) str+= Molpy.RedactedHTML(1);
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
		blist.sort(Molpy.ClassNameSort);
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
			str+=Molpy.BadgeString(me,1);
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
				el.style.opacity=1;//-(me.life/(Molpy.fps*2));
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
		var trans=0;
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
				if(trans<9)
				{
					el.style.opacity=1-Math.pow(me.life/(Molpy.fps*5),2);
					trans++;
				}else{
					el.style.opacity=1;
				}
				if (me.life>=Molpy.fps*5)
				{
					me.life=-1;
					el.style.opacity=0;
					el.style.display='none';
				}
			}
		}
	}

	Molpy.ClearLog=function()
	{
		Molpy.notifLog=[];
		Molpy.notifLogNext=0;
		Molpy.notifLogMax=39; //store 40 lines
		Molpy.notifLogPaint=0;
	}
	Molpy.ClearLog();
	Molpy.InMyPants=0;
	Molpy.Notify=function(text,log)
	{
		if(Molpy.InMyPants) text+= ' in my pants';
		text=format(text);
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
				str+=line+'<br>';
			}
			i++;
		}
		i = 0;
		while(i<Molpy.notifLogNext)
		{
			var line = Molpy.notifLog[i];
			if(line){
				str+=line+'<br>';
			}
			i++;
		}
		g('logItems').innerHTML=str;
	}

	Molpy.NewPixFor=function(np)
	{
		np = Math.abs(np);
		var x = 200+flandom(200);
		var y = 200+flandom(400);
		if(Molpy.Got('Chromatic Heresy')&&Molpy.options.colpix)
		{	
			if(np>3094)			
				return 'http://placekitten.com/'+x+'/'+y;
			else
				return 'http://178.79.159.24/Time/otcolorization/'+np;
		}else{
			if(np>3094)			
				return 'http://placekitten.com/g/'+x+'/'+y;
			else
				return 'http://xkcd.mscha.org/frame/'+np;
		}
	}
	Molpy.Url=function(address)
	{
		return 'url('+address+')';
	}
	
	//call with argument to change to a specific np, otherwise defaults to the current np
	Molpy.UpdateBeach=function(np)
	{
		np = np||Molpy.newpixNumber;
		g('beach').style.backgroundImage=Molpy.Url(Molpy.NewPixFor(np));
		Molpy.preloadedBeach=0;
	}
	Molpy.preloadedBeach=0;
	Molpy.PreloadBeach=function(np)
	{
		//REMOVED because it's giving people console errors and wasn't working for me anyway:
		//$.get(Molpy.NewPixFor(np||Molpy.newpixNumber+1));
		if(!np)Molpy.preloadedBeach=1;
	}
	/* In which we figure out how to draw stuff
	+++++++++++++++++++++++++++++++++++++++++++*/
	Molpy.redactedClassNames=['hidden','floatbox sand tool shop','floatbox castle tool shop',
		'floatbox boost shop','lootbox boost loot','lootbox badge loot','lootbox badge shop'];
	Molpy.drawFrame=0;
	Molpy.Draw=function()
	{
		g('castlecount').innerHTML=Molpify(Molpy.castles,1) + ' castle'+plural(Molpy.castles);
		g('sandcount').innerHTML=Molpify(Molpy.sand,1) + ' sand'+(isFinite(Molpy.castles)?' of ' + Molpify(Molpy.nextCastleSand,1) + ' needed':'');
		g('sandrate').innerHTML=Molpify(Molpy.sandPermNP,1) + ' sand/mNP';
		g('chipcount').innerHTML=Molpify(Molpy.Boosts['Tool Factory'].power,1) + ' chips';
		g('chiprate').innerHTML=Molpify(Molpy.glassPermNP,1) + ' chips/mNP';
		g('newtools').innerHTML='Built '+Molpify(Molpy.toolsBuilt,1)+' new tool'+plural(Molpy.toolsBuilt);

		$('#sectionTFCounts').toggleClass('hidden',!Molpy.Got('Tool Factory'));

		
		g('newpixnum').innerHTML='Newpix '+Molpify(Molpy.newpixNumber,3);
		g('eon').innerHTML=Molpy.TimeEon;
		g('era').innerHTML=Molpy.TimeEra;
		g('period').innerHTML=Molpy.TimePeriod;
		$('.timeflip').toggleClass('flip-horizontal',(Molpy.previewNP?Molpy.previewNP<0:Molpy.newpixNumber<0));
		g('version').innerHTML= '<br>Version: '+Molpy.version + (Molpy.version==3.11?'<br>Windows?':'');
		
		var repainted=Molpy.shopRepaint||Molpy.boostRepaint||Molpy.badgeRepaint;
		var tagRepaint=Molpy.boostRepaint||Molpy.badgeRepaint;
		var shopRepainted=Molpy.shopRepaint;
		
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
		if(tagRepaint&&Molpy.activeLayout.lootVis.tagged)
		{
			Molpy.RepaintTaggedLoot();
		}
		if(tagRepaint) Molpy.RepaintLootSelection();
		if(Molpy.redactedVisible)
		{		
			var redacteditem=g('redacteditem');
			if(redacteditem)
			{
				Molpy.drawFrame++;
				if(Molpy.drawFrame>=Molpy.fps/3)Molpy.drawFrame=0;
				if(repainted || Molpy.drawFrame==0)
				{
					var className=Molpy.redactedClassNames[Molpy.redactedVisible];
					if(Molpy.Boosts['Chromatic Heresy'].power>0 && Molpy.Got('Technicolour Dream Cat')
						&& Molpy.redactedDrawType[Molpy.redactedDrawType.length-1]!='hide2')
					{
						className+=' '+['alert','action','toggle','',''][flandom(4)];
					}
					redacteditem.className=className;
				}
			}
		}
		if(repainted) Molpy.AdjustFade();
		for(var i in Molpy.SandTools)
		{
			var me = Molpy.SandTools[i];
			Molpy.TickHover(me);
			me.updateBuy();
			
			if(me.amount,shopRepainted)
			{
				var desc = g('SandToolProduction'+me.id);
				if(desc)
				{
					if(desc.innerHTML==''||desc.innerHTML.indexOf('/mNP:')>-1)
					{
						if(me.storedTotalGpmNP)
							desc.innerHTML='Glass/mNP: '+Molpify(me.storedTotalGpmNP,1);	
						else
							desc.innerHTML='Sand/mNP: '+Molpify(me.storedTotalSpmNP,1);					
					}		
				}
			}
		}
		for(i in Molpy.CastleTools)
		{
			var me = Molpy.CastleTools[i];
			Molpy.TickHover(me,shopRepainted);
			me.updateBuy();
			
			var desc = g('CastleToolProduction'+me.id);
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
							desc.innerHTML='Active: '+Molpify(me.currentActive,3)+'<br>Timer: '
							+Molpify(Math.ceil((Molpy.ninjaTime-Molpy.ONGelapsed)/Molpy.NPlength));
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
				Molpy.TickHover(me,tagRepaint);
				me.updateBuy();
			}
		}
		for(i in Molpy.Badges)
		{
			var me = Molpy.Badges[i];
			//todo: skip badges which are hidden
			Molpy.TickHover(me,tagRepaint);			
		}

		drawClockHand();
		if(Molpy.IsStatsVisible()) Molpy.PaintStats();
		Molpy.notifsUpdate();
		if(Molpy.notifLogPaint)Molpy.PaintNotifLog();
		if(Molpy.options.numbers)Molpy.sparticlesUpdate();
		
		if(Molpy.scrumptiousDonuts==1)
		{
			g('scrumptiousdonuts').innerHTML=Molpy.BeanishToCuegish('JTI1M0NpZnJhbWUlMjUyMHNyYyUyNTNEJTI1MjJodHRwJTI1M0ElMjUyRiUyNTJGd3d3LnlvdXR1YmUuY29tJTI1MkZlbWJlZCUyNTJGR1U5Ukw2RDIzamslMjUzRmF1dG9wbGF5JTI1M0QxJTI1MjIlMjUyMHdpZHRoJTI1M0QlMjUyMjEwMCUyNTIyJTI1MjBoZWlnaHQlMjUzRCUyNTIyNjglMjUyMiUyNTIwZnJhbWVib3JkZXIlMjUzRCUyNTIyMCUyNTIyJTI1MjBhbGxvd2Z1bGxzY3JlZW4lMjUzRSUyNTNDJTI1MkZpZnJhbWUlMjUzRQ==');
		}else if(Molpy.scrumptiousDonuts==-1){
			g('scrumptiousdonuts').innerHTML='';
		}
		if(Molpy.scrumptiousDonuts>0){
			Molpy.scrumptiousDonuts--;
		}
		Molpy.shrinkAll=0;
				
		Molpy.CheckBeachClass();
	}
	
	Molpy.TickHover=function(me,repaint)
	{
		if(Molpy.Boosts['Expando'].power)
		{
			me.hoverOffCounter=-1;//prevent hide
			if(!me.hovering)
			{
				me.hoverOnCounter=1;//force show if not shown
			}
		}else
		{
			if(Molpy.shrinkAll)me.hoverOffCounter=Math.ceil(Molpy.fps*3.6);
		}
		if(me.hoverOnCounter>0)
		{	
			me.hoverOnCounter--;
			if(me.hoverOnCounter<=0)
			{
				me.hovering=1;
				me.showdesc();
				repaint=0;
				Molpy.UnlockBoost('Expando');
			}
		}
		if(me.hoverOffCounter>0)
		{
			me.hoverOffCounter--;
			if(me.hoverOffCounter<=0)
			{
				me.hovering=0;
				me.hidedesc();
			}
		}
		if(repaint&&me.hovering)
		{
			me.showdesc(1);
		}
	}	
	
	Molpy.DescClass=function(me)
	{
		if(me.hovering)return'descshow';
		return'deschide';
	}
		
	Molpy.PaintStats=function()
	{
		g('totalsandstat').innerHTML=Molpify(Molpy.sandDug,4);
		g('manualsandstat').innerHTML=Molpify(Molpy.sandManual,4);
		g('clicksstat').innerHTML=Molpify(Molpy.beachClicks,4);
		g('spclickstat').innerHTML=Molpify(Molpy.computedSandPerClick,4);
		g('sandspentstat').innerHTML=Molpify(Molpy.sandSpent,4);
		g('totalcastlesstat').innerHTML=Molpify(Molpy.castlesBuilt,4);
		g('destroyedcastlesstat').innerHTML=Molpify(Molpy.castlesDestroyed,4);
		g('downcastlesstat').innerHTML=Molpify(Molpy.totalCastlesDown,4);
		g('spentcastlesstat').innerHTML=Molpify(Molpy.castlesSpent,4);
		
		g('ninjatimestat').innerHTML=Molpify(Molpy.ninjaTime/Molpy.NPlength,1)+'mNP';		
		g('ninjastealthstat').innerHTML=Molpify(Molpy.ninjaStealth,1)+'NP';	
		g('ninjaforgivestat').innerHTML=Molpify(Molpy.Boosts['Ninja Hope'].power*Molpy.Got('Ninja Hope')
			+Molpy.Boosts['Ninja Penance'].power*Molpy.Got('Ninja Penance')+Molpy.Boosts['Impervious Ninja'].power*Molpy.Got('Impervious Ninja'));		
		
		g('loadcountstat').innerHTML=Molpify(Molpy.loadCount,1);
		g('savecountstat').innerHTML=Molpify(Molpy.saveCount,1);	
		g('notifstat').innerHTML=Molpify(Molpy.notifsReceived,2);	
		g('autosavecountstat').innerHTML=Molpify(Molpy.autosaveCountup,1);	
		
		g('sandtoolsownedstat').innerHTML=Molpify(Molpy.SandToolsOwned,4);			
		g('castletoolsownedstat').innerHTML=Molpify(Molpy.CastleToolsOwned,4);			
		g('boostsownedstat').innerHTML=Molpify(Molpy.BoostsOwned,4);			
		g('badgesownedstat').innerHTML=Molpify(Molpy.BadgesOwned,4);		
		
		g('sandmultiplierstat').innerHTML=Molpify(Molpy.globalSpmNPMult*100,4)+'%';			
		g('redactedstat').innerHTML=Molpy.redactedWords + ": " + Molpify(Molpy.redactedClicks,1);		
		g('redactedmaxstat').innerHTML='Max '+Molpy.redactedWord + " Chain: " + Molpify(Molpy.redactedChainMax,1);		
		
		g('glasschipstat').innerHTML=Molpify(Molpy.Boosts['GlassChips'].power,4);
		g('glassblockstat').innerHTML=Molpify(Molpy.Boosts['GlassBlocks'].power,4);
		g('sandusestat').innerHTML=Molpify(Molpy.CalcGlassUse(),6)+'%';

	    $('#chipspmnp').toggleClass('hidden',!Molpy.Got('AA'));
    	$('#blockspmnp').toggleClass('hidden',!Molpy.Got('AA'));
	    g('chipspmnpstat').innerHTML = Molpify(Molpy.chipspmnp,3);
    	g('blockspmnpstat').innerHTML = Molpify(Molpy.blockspmnp,3);
		
		g('blackstat').innerHTML='Collected '+Molpify(+Molpy.Boosts['Blackprints'].power
			+ Molpy.Boosts['Milo'].power/100,3)+' of '+Molpify(Molpy.GetBlackprintPages()|| Molpy.Boosts['AC'].power*2,1);
      
		g('logicatstat').innerHTML=Molpify(Molpy.Boosts['Logicat'].bought,1);
		g('totaltoolchipsstat').innerHTML=Molpify(Molpy.totalGlassBuilt,4);
		g('destroyedtoolchipsstat').innerHTML=Molpify(Molpy.totalGlassDestroyed,4);
		g('manualchipsstat').innerHTML=Molpify(Molpy.chipsManual,4);
		g('chipclickstat').innerHTML=Molpify(Molpy.chipsPerClick,4);		
	}
	
	Molpy.oldBeachClass='';
	Molpy.UpdateBeachClass=function(stateClass)
	{
		stateClass=stateClass||'';
		if(Molpy.Boosts['Beachball'].power)
		{
			if(Molpy.oldBeachClass!=stateClass)
			{
				$('#beach').removeClass(Molpy.oldBeachClass).addClass(stateClass);
				Molpy.oldBeachClass=stateClass;
			}
		}else if(Molpy.oldBeachClass)
		{
			$('#beach').removeClass(Molpy.oldBeachClass);
			Molpy.oldBeachClass='';
		}
	}
	
	Molpy.clockDegrees=0;
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
	function drawClockHand()
	{
		if(!g('game'))
		{
			return;
		}
		if(!Molpy.ONGelapsed){
			Molpy.ONGelapsed = new Date().getTime()-Molpy.ONGstart.getTime();
		}
		var npPercent = Molpy.ONGelapsed/(Molpy.NPlength*1000);
		Molpy.clockDegrees = (npPercent * 360) + 180; //rotation from top		

		$("#clockface").children('div').css({ 
			transformOrigin: "0% 0%",
			transform: "rotate(" + Molpy.clockDegrees + "deg)",
			'-ms-transform': "rotate(" + Molpy.clockDegrees + "deg)",
			'-ms-transform-origin': "0% 0%",
			WebkitTransform: "rotate(" + Molpy.clockDegrees + "deg)",
			'-webkit-transform-origin': "0% 0%"
        });
	}
	
	Molpy.Layout=function(args)
	{
		this.name=args.name||'';
		this.lootVis=args.lootVis||{};
		this.boxVis=args.boxVis||{};
		this.positions=args.positions||{};
		this.sizes=args.sizes||{};
		
		this.ToString=function()
		{
			var p='P'; //Pipe seParator
			var s='S'; //Semicolon
			var c='C'; //Comma
			
			var thread='';
			var threads=[];
			thread+=Molpy.version+p+p;//some extra space!
			thread+=this.name.toLowerCase()+p;
			
			for(var i in Molpy.lootVisOrder)
			{
				thread+=this.lootVis[Molpy.lootVisOrder[i]]?1:0;
			}
			thread+=p;
			for(var i in Molpy.boxVisOrder)
			{
				thread+=this.boxVis[Molpy.boxVisOrder[i]]?1:0;
			}
			thread+=p;
			for(var i in Molpy.draggableOrder)
			{
				var item=this.positions[Molpy.draggableOrder[i]]
				thread+=item.left+c+item.top+s;
			}
			thread+=p;
			for(var i in Molpy.sizableOrder)
			{
				var item=this.sizes[Molpy.sizableOrder[i]]
				thread+=item.width+c+item.height+s;
			}
			thread+=p;
			
			return thread;
		}
		
		this.FromString=function(string)
		{
			var p='P'; //Pipe seParator
			var s='S'; //Semicolon
			var c='C'; //Comma
			var threads=string.split(p);
			var version = parseFloat(threads[0]);
			this.name=threads[2];
			
			this.lootVis={};
			var pixels=threads[3].split('');
			for (var i in Molpy.lootVisOrder)
			{
				var vis = parseInt(pixels[i])==1;//we want a boolean because jQuery
				this.lootVis[Molpy.lootVisOrder[i]]=vis;
			}
			
			this.boxVis={};
			pixels=threads[4].split('');
			for (var i in Molpy.boxVisOrder)
			{
				var vis = parseInt(pixels[i])==1;//ditto
				this.boxVis[Molpy.boxVisOrder[i]]=vis;
			}	
			
			this.positions={};
			pixels=threads[5].split(s);
			for (var i in Molpy.draggableOrder)
			{
				if(!pixels[i]) pixels[i]='0C0';
				var pos = pixels[i].split(c);
				this.positions[Molpy.draggableOrder[i]]={left:parseFloat(pos[0]),top:parseFloat(pos[1])};
			}	
			
			this.sizes={};
			pixels=threads[6].split(s);
			for (var i in Molpy.sizableOrder)
			{
				if(!pixels[i]) pixels[i]='0C0';
				var pos = pixels[i].split(c);
				this.sizes[Molpy.sizableOrder[i]]={width:parseFloat(pos[0]),height:parseFloat(pos[1])};
			}	
		}
		
		this.ToScreen=function()
		{
		
			for(var i in Molpy.lootVisOrder)
			{
				var el=Molpy.lootVisOrder[i];
				Molpy.ShowhideToggle(el, this.lootVis[el]);
			}
			for(var i in Molpy.boxVisOrder)
			{
				var el=Molpy.boxVisOrder[i];
				Molpy.ToggleView(el, this.boxVis[el]);
			}
			
			for(var i in Molpy.draggableOrder)
			{
				var item=Molpy.draggableOrder[i];
				var pos = this.positions[item];
				$('#section'+item).css(pos);
			}
			for(var i in Molpy.sizableOrder)
			{
				var item=Molpy.sizableOrder[i];
				var size = this.sizes[item];
				$('#section'+item).css(size);
			}
		}
		
		this.FromScreen=function()
		{
			this.positions={};
			this.sizes={};
			for(var i in Molpy.draggableOrder)
			{
				var item = g('section'+Molpy.draggableOrder[i])
				this.positions[Molpy.draggableOrder[i]]={left:parseFloat(item.style.left),top:parseFloat(item.style.top)};
			}
			for(var i in Molpy.sizableOrder)
			{
				var item = $('#section'+Molpy.sizableOrder[i])
				this.sizes[Molpy.sizableOrder[i]]={width:item.width(),height:item.height()};
			}
		}
	}
	Molpy.lootVisOrder=['boosts','ninj','cyb','hpt','chron','bean','badges','badgesav','discov','monums','monumg','tagged','ceil','drac'];
	Molpy.boxVisOrder=['Clock','Timer','File','Links','Beach','Shop','Inventory','SandTools','CastleTools','Options','Stats','Log','Export','About','SandCounts','NPInfo','Layout','Codex','Alerts'];
	Molpy.draggableOrder=['Clock','Timer','View','File','Links','Beach','Options','Stats','Log','Export','SandCounts','TFCounts','NPInfo','About','SandTools','CastleTools','Shop','Inventory','Layout','Codex','Alerts'];
	Molpy.sizableOrder=['View','File','Links','Options','Stats','Log','Export','SandTools','CastleTools','Shop','Inventory','Layout','Codex','Alerts'];
	Molpy.activeLayout= new Molpy.Layout({name:'default',lootVis:{boosts:1,badges:1}});
	Molpy.activeLayout.FromString(Molpy.defaultLayoutData);
	Molpy.activeLayout.ToScreen();
	
	Molpy.IsStatsVisible=function()
	{
		return Molpy.activeLayout.lootVis['sectionStats'];
	}
	
	$('.resizable-element').resizable({cancel:'.editlock'});
	$('.draggable-element').draggable({cancel:'.editlock',scroll:true,grid:[10,10],snap:true});
	//$('.draggable-element,.resizable-element').addClass('editlock');
	//$('.ui-resizable-handle').addClass('hidden')
}