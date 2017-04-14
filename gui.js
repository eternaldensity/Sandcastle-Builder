Molpy.DefineGUI = function() {
	function InnerMolpify(number, raftcastle, shrinkify) {
		if(isNaN(number)) return 'Mustard';
		if(!isFinite(parseFloat(number))) return 'Infinite';
		if(number < 0) return '-' + InnerMolpify(-number, raftcastle, shrinkify);
		var molp = '';

		if(shrinkify == 2)
			shrinkify = 0;
		else if(Molpy && !shrinkify) shrinkify = !Molpy.options.science;

		if(shrinkify) {
			for( var i in postfixes) {
				var p = postfixes[i];
				if(number >= p.limit) {
					return InnerMolpify(number / p.divisor, raftcastle, 1) + p.postfix[Molpy.options.longpostfix];
				}
			}
		} else {
			if(number == 3) return 'Math.floor(Math.PI)';
			if(number == 4) return 'Math.ceil(Math.PI)';
		}

		if(raftcastle > 0) {
			var numCopy = number;
			//get the right number of decimal places to stick on the end:
			var raft = numCopy * Math.pow(10, raftcastle) - Math.floor(numCopy) * Math.pow(10, raftcastle);
			var sraft = Math.floor(raft) + '';
			if((sraft).length > raftcastle) {
				numCopy++;
				sraft = ''; //rounded decimal part up to 1
			} else if(raft) while(sraft.length < raftcastle) {
				sraft = '0' + sraft; //needs leading zeroes because it's a number like 1.01
			}
			molp = InnerMolpify(numCopy, 0, shrinkify) + (raft ? ('.' + sraft) : ''); //stick them on the end if there are any
		} else {
			number = Math.floor(number);
			//drop the decimal bit
			var sep = (number + '').indexOf('e') == -1; //true if not in exponential notation
			number = (number + '').split('').reverse(); //convert to string, then array of chars, then backwards
			for( var i in number) {
				if(sep && i % 3 == 0 && i > 0) molp = ',' + molp;//stick commas in every 3rd spot but not 0th
				molp = number[i] + molp;
			}
			if(!sep) {
				var dot = molp.indexOf('.') + 1;
				var exp = molp.indexOf('e');
				molp = molp.slice(0, dot) + molp.slice(dot, exp).slice(0, 6) + molp.slice(exp);//truncate after 6 decimal places
			}
		}
		return molp;
	}

	Molpy.IsChildOf = function(child, parent) {
		if(!child) return;
		var current = child;
		while(current = current.parentNode) {
			if(current == parent) return 1;
		}
	}
	
	Molpy.hoverTimer = 0;
	Molpy.hovering = false;
	
	Molpy.onMouseOver = function(e) {
		// Can add argument later if we want
		// Calls change to $().mouseover({arg1: 1, arg2: 3}, Molpy.onMouseOver)
		// and are referenced thus: e.data.arg1, e.data.arg2
		if(Molpy.Boosts['Expando'].IsEnabled) return;
		
		var over = e.data.overID;
		var div = this;
		setTimeout(function(){
			if(Molpy.mouseIsOver == over) $(div).find('.description').show();
		}, 200);
		
		Molpy.mouseIsOver = over;
		
		Molpy.hovering = true;
		
		if(!Molpy.Boosts['Expando'].unlocked) Molpy.UnlockBoost('Expando');
	}
	
	Molpy.onMouseOut = function(e) {
		if(Molpy.Boosts['Expando'].IsEnabled) return;
		var div = this;
		setTimeout(function(){
			if(Molpy.mouseIsOver != e.data.overID) $(div).find('.description').hide();
		}, 1000);
		Molpy.mouseIsOver = null;
		Molpy.hovering = false;
	}
	
	Molpy.monumentOver = function(e) {
		Molpy.onMouseOver.call(this, e);
		if(e.data.alias.indexOf('diamm') == 0) {
			setTimeout(function(){
				if(Molpy.mouseIsOver == e.data.overID) Molpy.Master.Create(e.data.np,'short');
				}, 500);
		} else if(e.data.alias.indexOf('monumg') == 0 && Molpy.previewNP != e.data.np) {
			Molpy.previewNP = e.data.np;
			Molpy.UpdateBeach(e.data.np);
		} else if(e.data.alias.indexOf('monums') == 0) {
			g('img-monums' + e.data.np).style.backgroundImage = Molpy.Url(Molpy.ThumbNewPixFor(Math.abs(e.data.np)));
		}
		
	}
	
	Molpy.monumentOut = function(e) {
		Molpy.onMouseOut.call(this, e);
		if(e.data.alias.indexOf('monumg') == 0 && Molpy.previewNP == e.data.np) {
			Molpy.previewNP = 0;
			Molpy.UpdateBeach();
		}
	}

	Molpy.ShowhideButton = function(key) {
		return '<input type="Button" value="' + (Molpy.activeLayout.lootVis[key] ? 'Hide' : 'Show') + '" onclick="Molpy.ShowhideToggle(\'' + key + '\')"></input>'
	}
	Molpy.ShowhideToggle = function(key, val) {
		Molpy.Anything = 1;
		if(val == undefined) {
			Molpy.activeLayout.lootVis[key] = !Molpy.activeLayout.lootVis[key];
		} else {
			Molpy.activeLayout.lootVis[key] = val == true;
		}
		if(Molpy.activeLayout.lootVis[key]) {
			if(key == 'tagged' || key == 'search' || key == 'faves') {
				for( var k in Molpy.activeLayout.lootVis) {
					Molpy.activeLayout.lootVis[k] = k == key; //when showing tagged or favourites, hide all others
				}
			} else {
				Molpy.activeLayout.lootVis.search = 0;
				Molpy.activeLayout.lootVis.tagged = 0; //hide tagged when showing anything else
                Molpy.activeLayout.lootVis.faves = 0; //hide favourites when showing anything else
			}
		}
		Molpy.restoreLootScroll = false;
		Molpy.lootPageNum = 1;
		Molpy.lootNeedRepaint = 1;
	}
	Molpy.ShowGroup = function(group, tagged) {
		if(Molpy.Redacted.drawType[Molpy.Redacted.drawType.length - 1] != 'hide1') {
			if(!Molpy.activeLayout.lootVis[group]) {
				if(tagged) {
                    if (!Molpy.activeLayout.lootVis.tagged) {
                        Molpy.ShowhideToggle('tagged');
                    }
				} else {
					Molpy.ShowhideToggle(group);
				}
			}
		}
	}

	Molpy.priceComparisons = ['GlassBlocks', 'Sand', 'Castles'];
	Molpy.IDSort = function(a,b) {
		return a.id > b.id;
	}
	Molpy.NameSort = function(a, b) {
		var an = a.sortName;
		var bn = b.sortName;
		return an > bn;
	}
	Molpy.PriceSort = function(a, b) {
		var p1 = a.CalcPrice(a.price);
		var p2 = b.CalcPrice(b.price);
		for( var i in Molpy.priceComparisons) {
			var stuff = Molpy.priceComparisons[i];
			var s1 = p1[stuff] || 0;
			var s2 = p2[stuff] || 0;
			if(s1 > s2)
				return 1;
			else if(s1 < s2) return -1;
		}
		return a.name > b.name;
	}
	Molpy.ClassNameSort = function(a, b) {
		var at = a.className || 'z';
		var bt = b.className || 'z';
		var ag = a.group;
		var bg = b.group;
		if(at > bt)
			return 1;
		else if(at < bt)
			return -1;
		else if(ag > bg)
			return 1;
		else if(ag < bg)
			return -1;
		else return Molpy.NameSort(a,b);
	}
	Molpy.FormatPrice = function(monies, item) {
		return Molpify(Math.floor(EvalMaybeFunction(monies, item, 1) * Molpy.priceFactor), 1);
	}

	Molpy.ToggleView = function(name, val) {
		if(!name) return;
		var sh = Molpy.activeLayout.boxVis;
		if(val == undefined) {
			sh[name] = !sh[name];
		} else {
			sh[name] = val == true;//ensure boolean for jQuery
		}
		$('#' + 'section' + name).toggleClass('hidden', !sh[name]);
		$('#toggle' + name).toggleClass('depressed', sh[name]);
		if(name == 'Export')
			$('.exportButton').toggleClass('depressed', sh[name]);
		if(sh[name]) {
			var refresh = Molpy['Refresh' + name];
			if(refresh) refresh();
		} else {
			var cleanup = Molpy['Cleanup' + name];
			if(cleanup) cleanup();
		}
	}

	Molpy.selectedFave = 'None';
	Molpy.SelectFave = function(f) {
		Molpy.selectedFave = f.options[f.selectedIndex].value;
		$('#faveControls').toggleClass('hidden', Molpy.selectedFave == 'None');
		$('#toggleFave').toggleClass('depressed', Molpy.activeLayout.faves[Molpy.selectedFave].vis == true);
	}

	Molpy.ConfigureFave = function(n) {
		Molpy.Anything = 1;
		if(n == undefined) n = Molpy.selectedFave;
		var f = Molpy.activeLayout.faves[n];
		var def = 'Chromatic Heresy';
		if(f.boost) def = f.boost.name;
		var name = prompt('Enter the name of the boost or badge you wish to display as Favourite ' + n + '.\nNames are case sensitive.\nLeave blank to disable.', def);

		if(name == undefined) return;
		if(name) {
			var item = Molpy.Boosts[name];
			if(!item) {
				item = Molpy.Boosts[Molpy.BoostAKA[name]];
			}
			if(!item) {
				item = Molpy.Badges[name];
			}
			if(!item) {
				item = Molpy.Badges[Molpy.BadgeAKA[name]];
			}
			if(item) {
				if(!(item.bought || item.earned)) {
					Molpy.Notify('You do not own ' + item.name, 1);
				} else {
					f.boost = item;
					Molpy.Notify('You have chosen ' + item.name + ' as Favourite ' + n, 0);
					Molpy.UnlockBoost('Sand');
					Molpy.UnlockBoost('Castles');
				}
			}
		} else {
			f.boost = 0;
		}
		f.BoostToScreen();
	}

	Molpy.ToggleFave = function(n, val) {
		Molpy.Anything = 1;
		if(n == undefined) n = Molpy.selectedFave;

		var name = 'sectionFave' + n;
		var f = Molpy.activeLayout.faves;
		if(val == undefined) {
			f[n].vis = !f[n].vis;
		} else {
			f[n].vis = val == true;//ensure boolean for jQuery
		}
		if(f[n].vis && f[n].boost) f[n].boost.Refresh();
		$('#' + name).toggleClass('hidden', !f[n].vis);
		$('#toggleFave').toggleClass('depressed', f[n].vis);
	}

	Molpy.ToggleViews = function(views) {
		var primary = views[0];
		var vis = Molpy.activeLayout.boxVis;
		Molpy.ToggleView(primary);
		if(vis[primary]) {
			for( var i in views) {
				if(+i) Molpy.ToggleView(views[i], false);
			}
		} else {
			Molpy.ToggleView(views[1], true);
		}
	}

	Molpy.RefreshStats = function() {
		if(!Molpy.molpish) return;
		Molpy.EarnBadge('Far End of the Bell Curve');
		Molpy.allNeedRepaint = 1;
		Molpy.UpdateFaves(1);
	}
	Molpy.CleanupStats = Molpy.RefreshStats;

	Molpy.RefreshExport = function() {
		if(!Molpy.molpish) return;
		_gaq && _gaq.push(['_trackEvent', 'Export', 'Begin']);
		var threads = Molpy.ToNeedlePulledThing();
		_gaq && _gaq.push(['_trackEvent', 'Export', 'Complete']);
		var thread = '';
		for( var i in threads) {
			thread += threads[i]
		}
		g('exporttext').value = Molpy.CuegishToBeanish(thread);
	}
	Molpy.RefreshLayouts = function() {
		if(!Molpy.molpish) return;
		Molpy.layoutNeedRepaint = 1;
	}
	Molpy.RefreshQuickLayout = Molpy.RefreshLayouts;

	Molpy.UpdateColourScheme = function() {
		var heresy = '';
		if(g('game')) {
			if(Molpy.Got('Chromatic Heresy') && Molpy.Boosts['Chromatic Heresy'].power > 0) {
				heresy = ' heresy'
			}
			Molpy.UpdateBeach();
		}

		if(Molpy.options.colourscheme) {
			document.body.className = 'lightscheme' + heresy;
		} else {
			document.body.className = 'darkscheme' + heresy;
		}
	}

	Molpy.AdjustFade = function() {
		var val = '';
		if(Molpy.options.fade) {
			for( var i in fadeProps) {
				if(+i) val += ', ';
				val += fadeProps[i] + ' ' + Molpy.options.fade / 2 + 's ease-out';
			}
		}
		var fc = $(fadeClasses);
		for( var j in vendors)
			fc.css(vendors[j] + 'transition', val);

		if(Molpy.options.fade) {
			val = ',background-image ' + Molpy.options.fade / 2 + 's ease-out';
		}
		var fc = $('#beach');
		for( var j in vendors)
			fc.css(vendors[j] + 'transition', 'opacity 0.1s ease-out,' + vendors[j] + 'transform 0.1s ease-out' + val);
	}

	if(!g('game')) {
		Molpy.Load();
		if(g('indexversion')) {
			g('indexversion').innerHTML = 'The Game of Time. Version ' + Molpy.version + (Molpy.versionName?' '+Molpy.versionName:'');
		} else {
			Molpy.StartIdle = function() {
				if(!Molpy.supportsLocalStorage) {
					g('idlescore').innerHTML = 'localstorage not supported';
					return;
				}
				var score = parseFloat(localStorage['idlescore']) || 0;
				var prestige = parseFloat(localStorage['idleprestige']) || 0;
				if(!Molpy.forcedReload) {
					prestige += score;
					score = 0;
				}
				g('idlescore').innerHTML = 'Score: ' + Molpify(score, 3);
				g('idleprestige').innerHTML = 'Prestige: ' + Molpify(prestige, 3);
				localStorage['idlescore'] = score;
				localStorage['idleprestige'] = prestige;
				setTimeout(Molpy.Idle, 1000);
			}
			Molpy.Idle = function() {
				var score = parseFloat(localStorage['idlescore']) || 0;
				var prestige = parseFloat(localStorage['idleprestige']) || 0;
				inc = 1 + Math.max(0, Math.floor(Math.log(prestige) * Math.LOG2E));
				score += inc;
				g('idlescore').innerHTML = 'Score: ' + Molpify(score, 3);
				localStorage['idlescore'] = score;
				if(score % 1000 == 0) _gaq && _gaq.push(['_trackEvent', 'PureIdle', 'Milestone', '' + score]);
				setTimeout(Molpy.Idle, 1000);
			}
		}
		return;
	}

	createClockHand();

	var fadeClasses = 'body , .floatbox , .lootbox , .minifloatbox , .floatsquare , .infobox , .icon , .descshow , .deschide , .badge.shop h1, #toolSTitle, #toolCTitle, #boostTitle';
	var vendors = ['-webkit-', '-moz-', '-o-', '-ms-', ''];
	var fadeProps = ['color', 'border-color', 'background-color', 'background-image'];

	Molpy.unlockedGroups = {};
	Molpy.PaintLootToggle = function(gr, kind) {
		var str = '';
		if(Molpy.unlockedGroups[gr]) {
			var type = kind == 4 ? 'boost' : 'badge';
			var id = Molpy.groupNames[gr][2] || '';
			if(id) id = ' id="' + id + '"';
			var r = (Molpy.Redacted.location == kind && Molpy.Redacted.group == gr);
			if(r) id = '';
			str += '<div class="floatsquare loot ' + (r ? 'redacted-area ' : '') + type + '"><h3>' + Molpy.groupNames[gr][1]
				+ '</h3><br>' + Molpy.ShowhideButton(gr) + '<div class="icon' + (r ? ' redacted"' : '"') + id + '></div></div>';
		}
		return str;
	}
	
	Molpy.RepaintLootSelection = function() {
		Molpy.lootSelectionNeedRepaint = 0;
		var str = '';
		var groups = ['boosts', 'stuff', 'land', 'ninj', 'cyb', 'hpt', 'bean', 'chron', 'dimen', 'ceil', 'drac', 'prize', 'varie','faves'];
		for( var i in groups) {
			str += Molpy.PaintLootToggle(groups[i], 4);
		}
		if(Molpy.BadgesOwned) {
			var r = Molpy.Redacted.location == 5 && Molpy.Redacted.group == 'badges';
			str += '<div class="floatsquare badge loot' + (r ? ' redacted-area' : '') + '"><h3>Badges<br>Earned</h3>'
				+ Molpy.ShowhideButton('badges') + '<div id="badges" class="icon ' + (r ? 'redacted' : '') + '"></div></div>';
		}
		var groups = ['discov', 'monums', 'monumg', 'diamm'];
		for( var i in groups) {
			str += Molpy.PaintLootToggle(groups[i], 5);
		}
		if(Molpy.BadgeN - Molpy.BadgesOwned) {
			var r = Molpy.Redacted.location == 6;
			str += '<div class="floatsquare badge shop' + (r ? ' redacted-area' : '') + '"><h3>Badges<br>Available</h3>'
				+ Molpy.ShowhideButton('badgesav') + '<div id ="badgesAv" class="icon ' + (r ? 'redacted' : '') + '"></div></div>';
		}
		if(Molpy.Boosts['Chromatic Heresy'].unlocked) {
			var r = Molpy.Redacted.location == 7;
			str += '<div class="floatsquare boost loot' + (r ? ' redacted-area' : ' alert') + '"><h3>Tagged<br>Items</h3>'
			    + Molpy.ShowhideButton('tagged') + '<div id="tagged" class="icon ' + (r ? 'redacted' : '') + '"></div></div>';
		}

		g('lootselection').innerHTML = str;
	}
	
	Molpy.removeGroupFromDispObjectsCategory = function(group, category) {
		for(var i in group) {
			var thing = group[i];
			var index = $.inArray(thing, Molpy.dispObjects[category]);
			if(index > -1) {
				Molpy.removeDiv(thing);
				Molpy.dispObjects[category].splice(index, 1);
			}
		}
	}
	

	Molpy.removeAllObjectDivs = function() {
		for(var i in Molpy.SandTool)
			Molpy.removeDiv(Molpy.SandTool[i]);
		for(var i in Molpy.CastleTool)
			Molpy.removeDiv(Molpy.CastleTool[i]);
		for(var i in Molpy.Boosts)
			Molpy.removeDiv(Molpy.Boosts[i]);
		for(var i in Molpy.Badges)
			Molpy.removeDiv(Molpy.Badges[i]);
	}
	
	Molpy.removeAllDisplayedDivs = function() {
		for(var grp in Molpy.dispObjects) {
			Molpy.removeGroupDivs(Molpy.dispObjects[grp]);
		}
	}
	
	Molpy.removeGroupDivs = function(group) {
		for(var obj in group) {
			Molpy.removeDiv(group[obj]);
		}
	}
	
	Molpy.removeDiv = function(object) {
		if(object.hasDiv()) {
			object.divElement.remove();
			object.divElement = null;
		}
	}
	
	Molpy.repaintAll = function() {
		Molpy.allNeedRepaint = 0;
	 	Molpy.CalcPriceFactor();
	 	Molpy.repaintLoot();
	 	Molpy.repaintShop();
	 	Molpy.repaintTools();
	 	Molpy.repaintFaves();
	}
	
	Molpy.restoreLootScroll = true;
	
	Molpy.getScrollLoc = function(divString) {
//		var div = $(divString);
//		var pos = [div.scrollTop(), div.scrollLeft()];
//		return pos;
	}
	
	Molpy.setScrollLoc = function(divString, pos) {
//		var div = $(divString);
//		div.scrollTop(pos[0]).scrollLeft(pos[1]);
	}
	
	Molpy.lootPerPage = 20;
	Molpy.lootPerPageBox = $('#navPerPage');
	Molpy.lootPageNum = 1;
	Molpy.lootPageNumBox = $('#navPageNum');
	Molpy.lootPageNumMax = $('#navMaxPages');
	
	Molpy.changeLootPage = function(change) {
		Molpy.Anything = 1;
		if(change != 'max' && change != 'first')
			Molpy.lootPageNum += change;
		else if(change == 'first')
			Molpy.lootPageNum = 1;
		else if(change == 'max')
			Molpy.lootPageNum = 'max';
		Molpy.restoreLootScroll = false;
		Molpy.lootNeedRepaint = 1;
	}
	
	Molpy.checkLootNums = function(force) {
		var perPage = parseInt(Molpy.lootPerPageBox.val());
		var pageNum = parseInt(Molpy.lootPageNumBox.val());
		if((force || !Molpy.lootPerPageBox.is(':focus')) && !isNaN(perPage) && perPage != Molpy.lootPerPage) {
			Molpy.lootPerPage = perPage;
			Molpy.lootNeedRepaint = 1;
		}
		if((force || !Molpy.lootPageNumBox.is(':focus')) && !isNaN(pageNum) && pageNum != Molpy.lootPageNum) {
			Molpy.lootPageNum = pageNum;
			Molpy.lootNeedRepaint = 1;
		}
	}
	
	Molpy.lootNavBoxChanged = function(e) {
		if (!e) e = window.event;
	    var keyCode = e.keyCode || e.which;
	    if (keyCode == '13'){
	      // Enter pressed
	      Molpy.checkLootNums(true);
	    }
	}
	
	Molpy.searchList = [];
	Molpy.lootSearchBoxChanged = function(e) {
		if (!e) e = window.event;
	    var keyCode = e.keyCode || e.which;
	    if (keyCode == '13'){
	      // Enter pressed
	      Molpy.searchLoot();
	    }
	}
	Molpy.searchLoot = function() {
		Molpy.Anything = 1;
		Molpy.ShowhideToggle('search', true);
		Molpy.restoreLootScroll = false;
		Molpy.lootNeedRepaint = 1;
	}
	
	Molpy.repaintLoot = function() {
		Molpy.lootNeedRepaint = 0;
		var pos = null;
		
		if(!noLayout) pos = Molpy.getScrollLoc('#loot');
		if(noLayout) pos = Molpy.getScrollLoc('#inventory');
		
		if(Molpy.lootPerPage < 1) Molpy.lootPerPage = 1;
		if(Molpy.lootPageNum < 1) Molpy.lootPageNum = 1;
		
		//clear out all the old loot stuff
		Molpy.removeGroupDivs(Molpy.dispObjects.boosts);
		Molpy.removeGroupDivs(Molpy.dispObjects.badges);
		Molpy.removeGroupDivs(Molpy.dispObjects.tagged);
        	Molpy.removeGroupDivs(Molpy.dispObjects.faves);
		Molpy.removeGroupDivs(Molpy.dispObjects.search);
		Molpy.dispObjects.boosts = [];
		Molpy.dispObjects.badges = [];
		Molpy.dispObjects.tagged = [];
        	Molpy.dispObjects.faves = [];
		Molpy.dispObjects.search = [];
		
		var taggedList = Molpy.TaggedLoot;
        	var favesList = [];
        	for(var i in Molpy.Boosts.favs.FavesList) {
            		favesList.push(Molpy.BoostsById[Molpy.Boosts.favs.FavesList[i]]);
        	}
		var boostList = [];
		var badgeList = [];
		
		var maxPageNum = 1;
		var startIndex = 0;
		var endIndex = 0;
		
		if(Molpy.activeLayout.lootVis.search) {
			Molpy.searchList = [];
			var searchText = $('#lootSearchBox').val().toLowerCase();
			if($('#searchBoosts').prop('checked') || !$('#searchBadges').prop('checked')){
				for(var i in Molpy.BoostsBought) {
					var me = Molpy.BoostsBought[i];
					if(me.name && me.name.toLowerCase().indexOf(searchText) >= 0) Molpy.searchList.push(me);
				}
			}
			if($('#searchBadges').prop('checked')){
				for(var i in Molpy.BadgesEarned) {
					var me = Molpy.BadgesEarned[i];
					if(me.name && me.name.toLowerCase().indexOf(searchText) >= 0) Molpy.searchList.push(me);
				}
				for(var i in Molpy.BadgesAvailable) {
					var me = Molpy.BadgesAvailable[i];
					if(me.name && me.name.toLowerCase().indexOf(searchText) >= 0) Molpy.searchList.push(me);
				}
				for(var i in Molpy.DiscovMonumEarned) {
					var me = Molpy.DiscovMonumEarned[i];
					if(me.name && me.name.toLowerCase().indexOf(searchText) >= 0) Molpy.searchList.push(me);
				}
			}
			maxPageNum = Math.ceil(Molpy.searchList.length / Molpy.lootPerPage);
		}
		else if(Molpy.activeLayout.lootVis.tagged) {
			maxPageNum = Math.ceil(taggedList.length / Molpy.lootPerPage);
		}
        	else if(Molpy.activeLayout.lootVis.faves) {
            		maxPageNum = Math.ceil(favesList.length / Molpy.lootPerPage);
        	}
		else {
			// Setup Boost list for use
			for(var i in Molpy.BoostsBought) {
				var me = Molpy.BoostsBought[i];
				if(Molpy.activeLayout.lootVis[me.group] && me.bought >= me.unlocked) boostList.push(me);
			}
			
			// Setup Badge list for use
			for(var i in Molpy.BadgesEarned) {
				var me = Molpy.BadgesEarned[i];
				if(Molpy.activeLayout.lootVis[me.group]) badgeList.push(me);
			}
			for(var i in Molpy.BadgesAvailable) {
				var me = Molpy.BadgesAvailable[i];
				if(Molpy.activeLayout.lootVis.badgesav) badgeList.push(me);
			}
			for(var i in Molpy.DiscovMonumEarned) {
				var me = Molpy.DiscovMonumEarned[i];
				if(Molpy.activeLayout.lootVis[me.group]) badgeList.push(me);
			}
			
			maxPageNum = Math.ceil((boostList.length + badgeList.length) / Molpy.lootPerPage);
		}
		
		BoostNum = boostList.length;
		BoostList = boostList.slice(0);

		if(Molpy.lootPageNum == 'max') Molpy.lootPageNum = maxPageNum;
		
		if(Molpy.lootPageNum > maxPageNum) Molpy.lootPageNum = maxPageNum;
		startIndex = (Molpy.lootPageNum - 1 ) * Molpy.lootPerPage;
		endIndex = startIndex + Molpy.lootPerPage - 1;
		
		if(Molpy.activeLayout.lootVis.search && Molpy.searchList.length> 0){
			Molpy.addGroupToDiv($('#loot'), Molpy.searchList, startIndex, endIndex, 'search', {autoAdd: true, recalc: false});
		} else if(Molpy.activeLayout.lootVis.tagged && taggedList.length > 0) {
            		Molpy.addGroupToDiv($('#loot'), taggedList, startIndex, endIndex, 'tagged', {autoAdd: true, recalc: false});
        	} else if(Molpy.activeLayout.lootVis.faves && favesList.length > 0) {
            		Molpy.addGroupToDiv($('#loot'), favesList, startIndex, endIndex, 'faves', {autoAdd: true, recalc: false});
		} else if(!(boostList.length == 0 && badgeList.length == 0)) {
			var boostStartIndex = 0;
			var boostEndIndex = -1;			
			var badgeStartIndex = 0;
			var badgeEndIndex = -1;
			
			if(boostList.length < startIndex) {
				badgeStartIndex = startIndex - boostList.length;
				badgeEndIndex = endIndex - boostList.length;
			} else {
				boostStartIndex = startIndex;
				if(boostList.length > endIndex){
					boostEndIndex = endIndex;
				} else {
					boostEndIndex = boostList.length - 1;
					badgeEndIndex = endIndex - boostList.length;
				}
			}
				
			Molpy.addGroupToDiv($('#loot'), boostList, boostStartIndex, boostEndIndex, 'boosts', {autoAdd: true, recalc: false});
			Molpy.addGroupToDiv($('#loot'), badgeList, badgeStartIndex, badgeEndIndex, 'badges', {autoAdd: true, recalc: false});
		}
		
		if(Molpy.restoreLootScroll) {
			if(!noLayout)
				Molpy.setScrollLoc('#loot', pos);
			else
				Molpy.setScrollLoc('#inventory', pos);
		}
		Molpy.restoreLootScroll = true;
		
		if(!Molpy.lootPerPageBox.is(':focus')) Molpy.lootPerPageBox.val(Molpy.lootPerPage);
		if(!Molpy.lootPageNumBox.is(':focus')) Molpy.lootPageNumBox.val(Molpy.lootPageNum);
		Molpy.lootPageNumMax.text(maxPageNum);
		
		Molpy.UnlockBoost('Chromatic Heresy');
	}
	

	Molpy.repaintShop = function() {
		Molpy.shopNeedRepaint = 0;
		var pos = null;
		
		if(!noLayout) pos = Molpy.getScrollLoc('#boosts');
		
		Molpy.removeGroupDivs(Molpy.dispObjects.shop);
		Molpy.dispObjects.shop = [];

		var shopList = [];
		for( var i in Molpy.Boosts) {
			var boost = Molpy.Boosts[i];
			if(boost.bought < boost.unlocked) shopList.push(boost);
		}
	
		if(Molpy.options.boostsort > 0)
			shopList.sort(Molpy.NameSort);
		else
			shopList.sort(Molpy.PriceSort);
		
		Molpy.addGroupToDiv($('#boosts'), shopList, 0, shopList.length - 1, 'shop', {autoAdd: true, recalc: true});
		
		if(!noLayout) Molpy.setScrollLoc('#boosts', pos);
	}
	
	Molpy.repaintTools = function(args) {
		if(!args) args = {};
		Molpy.toolsNeedRepaint = 0;
		
		// this causes scroll location to mess up, but is faster
		// would be good to write it so skipclear can be true
		//Molpy.removeGroupDivs(Molpy.dispObjects.tools);
		//Molpy.dispObjects.tools = [];
		
		Molpy.CalcPriceFactor();
		
		Molpy.repaintSandTools({skipClear: false, recalc: false});
		Molpy.repaintCastleTools({skipClear: false, recalc: false});
	}
	
	Molpy.repaintSandTools = function(args) {
		if(!args) args = {};
		Molpy.sandToolsNeedRepaint = 0;
		var pos = null;
		
		if(!noLayout) pos = Molpy.getScrollLoc('#sandtools');
		
		// Remove all Sand Tools from dispObjects for a fresh start
		if(!args.skipClear) {
			Molpy.removeGroupFromDispObjectsCategory(Molpy.SandTools, 'tools');
		}
		
		var toolsUnlocked = 1;
		for(var i in Molpy.SandToolsById){
			if(Molpy.SandToolsById[i].bought >= Molpy.SandToolsById[i].nextThreshold) toolsUnlocked ++;	
		}
		var max = Math.min(toolsUnlocked -1 , Molpy.SandToolsN - 1);
		
		var dorecalc = args.recalc == false ? false : true;
		Molpy.addGroupToDiv($('#sandtools'), Molpy.SandToolsById, 0, max, 'tools', {autoAdd: true, recalc: dorecalc});
		
		if(!noLayout) Molpy.setScrollLoc('#sandtools', pos);
	}
	
	Molpy.repaintCastleTools = function(args) {
		if(!args) args = {};
		Molpy.castleToolsNeedRepaint = 0;
		var pos = null;
		
		if(!noLayout) pos = Molpy.getScrollLoc('#castletools');
		
		// Remove all Castle Tools from dispObjects for a fresh start
		if(!args.skipClear) {
			Molpy.removeGroupFromDispObjectsCategory(Molpy.CastleTools, 'tools');
		}
		
		var toolsUnlocked = 1;
		for(var i in Molpy.CastleToolsById){
			if(Molpy.CastleToolsById[i].bought >= Molpy.CastleToolsById[i].nextThreshold) toolsUnlocked ++;	
		}
		var max = Math.min(toolsUnlocked - 1, Molpy.CastleToolsN - 1);
		
		var dorecalc = args.recalc == false ? false : true;
		Molpy.addGroupToDiv($('#castletools'), Molpy.CastleToolsById, 0, max, 'tools', {autoAdd: true, recalc: dorecalc});
		
		if(!noLayout) Molpy.setScrollLoc('#castletools', pos);
	}
	
	Molpy.repaintBoosts = function() {
		Molpy.boostNeedRepaint = 0;
		Molpy.badgesNeedRepaint = 0; // This includes all badge calls
		Molpy.repaintShop();
		Molpy.repaintLoot();
		Molpy.repaintFaves();
	}
	
	Molpy.repaintBadges = function() {
		Molpy.badgeNeedRepaint = 0;
		Molpy.repaintLoot();
		Molpy.repaintFaves();
	}
	
	Molpy.repaintFaves = function() {
		Molpy.favesNeedRepaint = 0;
		//Molpy.dispObjects.faves = [];
	}
	
	Molpy.repaintRedacted = function() {
		Molpy.redactedNeedRepaint = 0;
		
		if(Molpy.Redacted.location == 0 /*|| !Molpy.PuzzleGens.redacted.active*/) return;
		var redDiv = Molpy.Redacted.divList[Molpy.Redacted.location];
		
		if (0 && !Molpy.PuzzleGens.redacted.active ) {
			Molpy.Redacted.getDiv().detach(); // Take it out of where it is in case it exists already
			Molpy.Redacted.location = 0;
			return;
		}

		// Make sure the div is an open one, if not, re jump and set it again
		if(!redDiv || !redDiv.is(':visible')) {
			Molpy.Redacted.getDiv().detach(); // Take it out of where it is in case it exists already
			Molpy.Redacted.jump();
			if(Molpy.Redacted.location == 0) return; // No available spots to spawn
			redDiv = Molpy.Redacted.divList[Molpy.Redacted.location];
		} else if (Molpy.Redacted.keepPosition == 2) return
		else Molpy.Redacted.getDiv().detach(); // Take it out of where it is in case it exists already
		
		Molpy.Redacted.titleList[Molpy.Redacted.location].toggleClass('redacted-area', true);
		
		// Find max Index
		var maxIndex = 0;
		var lootArray = null;
		if(Molpy.Redacted.location <= 3) {
			maxIndex = redDiv.children().length + 1;
		} else if(Molpy.Redacted.location >= 4 && Molpy.Redacted.location <= 7) {
			if(Molpy.Redacted.location == 4) lootArray = Molpy.BoostsBought;
			else if(Molpy.Redacted.location == 5) lootArray = Molpy.BadgesEarned;
			else if(Molpy.Redacted.location == 6) lootArray = Molpy.BadgesAvailable;
			else if(Molpy.Redacted.location == 7) lootArray = Molpy.TaggedLoot;
			else if(Molpy.Redacted.location == 8) lootArray = Molpy.Boosts.favs.FavesList;
			maxIndex = lootArray.length;
			Molpy.lootSelectionNeedRepaint = 1;
		}
		
		// If a position is invalid, get a random new position
		if(Molpy.Redacted.dispIndex == -1 || Molpy.Redacted.dispIndex > maxIndex) {
			Molpy.Redacted.dispIndex = Math.floor(maxIndex * Math.random());
		}
		
		if(Molpy.Redacted.location >= 4 && Molpy.Redacted.location <= 6) {
			if (!lootArray || !lootArray.length) {
				Molpy.Redacted.location = 0;
				return;
			};
			if(Molpy.Redacted.dispIndex > lootArray.length -1)
				Molpy.Redacted.group = lootArray[lootArray.length - 1].group;
			else
				Molpy.Redacted.group = lootArray[Molpy.Redacted.dispIndex].group;
		}
		
		// Figure out where it will go
		var specialIndex = -1;
		if(Molpy.Redacted.location >= 4 && Molpy.Redacted.location <= 7) {
			if(lootArray[Molpy.Redacted.dispIndex] && lootArray[Molpy.Redacted.dispIndex].hasDiv()) {
				var div = lootArray[Molpy.Redacted.dispIndex].getDiv({});
				specialIndex = div ? div.index(): Molpy.Redacted.dispIndex;
			}
		} else {
			specialIndex = Molpy.Redacted.dispIndex;
		}
		
		if(specialIndex == 0) {
			redDiv.prepend(Molpy.Redacted.getDiv());
		}
		else if(specialIndex > redDiv.children().length - 1) {
			redDiv.append(Molpy.Redacted.getDiv());
		} else if(specialIndex > 0){
			redDiv.children().eq(specialIndex).before(Molpy.Redacted.getDiv());
		}
		if (Molpy.Redacted.keepPosition == 1 && specialIndex != -1) {
//			Molpy.Notify('Setting keepPosition to 2',1);
			Molpy.Redacted.keepPosition=2;
		}
	}
	
	Molpy.addGroupToDiv = function(whichDiv, group, startIndex, maxIndex, dispCat, args) {
		if(!args) args = {};
		if(args.recalc) Molpy.CalcPriceFactor();
		
		var fnew = args.forceNew || true;
		var addHover = args.hover || true;
		
		var i = startIndex;	
		while(i <= maxIndex && i < group.length) {
			var nh = false;
			var object = group[i];
			
			// If mouse is currently hovering over this, it will start hovered
			var overID = '' + object.name + object.id;
			if(Molpy.mouseIsOver == overID) nh = true;
			
			whichDiv.append(object.getDiv({forceNew: fnew, hover: addHover, nohide: nh}));
			
			if(args.autoAdd) {
				var suc = Molpy.dispObjects[dispCat].push(object);
			} else {
				if($.inArray(object, Molpy.dispObjects[dispCat]) == -1) Molpy.dispObjects[dispCat].push(object);
			}
			
			i ++;
		}
		
		Molpy.redactedNeedRepaint = 1;
	}
	
	Molpy.updateShop = function() {
		for(var i in Molpy.dispObjects.shop)
			Molpy.dispObjects.shop[i].updateAll();
	}
	
	Molpy.updateTools = function() {
		for(var i in Molpy.dispObjects.tools)
			Molpy.dispObjects.tools[i].updateAll();
	}
	
	Molpy.updateLoot = function() {
		for(var grp in Molpy.dispObjects)
			if(grp != 'boosts' || grp != 'tagged' || grp != 'faves') continue;
			for(var i in Molpy.dispObject[grp])
				Molpy.dispObjects[grp][i].updateAll();
	}
	
	Molpy.updateBoosts = function() {
		for(var grp in Molpy.dispObjects)
			if(grp != 'boosts' || grp != 'tagged' || grp != 'faves') continue;
			for(var i in Molpy.dispObject[grp])
				Molpy.dispObjects[grp][i].updateAll();
	}
	
	//the numbers that fly up when you click the pic for sand
	Molpy.sParticles = [];
	var str = '';
	for( var i = 0; i < 20; i++) {
		Molpy.sParticles[i] = {
			x: 0,
			y: 0,
			dx: 0,
			life: -1,
			text: ''
		};
		str += '<div id="sparticle' + i + '" class="notif"></div>';
	}
	g('sparticles').innerHTML = str;
	Molpy.sparticlesUpdate = function() {
		for( var i in Molpy.sParticles) {
			var me = Molpy.sParticles[i];
			if(me.life != -1) {

				me.y -= 300 / Molpy.fps;
				me.x += me.dx / Molpy.fps;

				me.life++;
				var el = me.l;
				me.l.style.left = Math.floor(me.x) + 'px';
				me.l.style.top = Math.floor(me.y) + 'px';
				el.style.opacity = 1;//-(me.life/(Molpy.fps*2));
				if(me.life >= Molpy.fps * 2) {
					me.life = -1;
					el.style.opacity = 0;
					el.style.display = 'none';
				}
			}
		}
	}

	Molpy.LayoutString = function(i) {
		var me = Molpy.layouts[i];
		var h = '<h1>' + me.name + '</h1>';
		var str = '<div class="layout minifloatbox">' + h;
		str += '<div class="minifloatbox layoutcontrol' + (me == Molpy.activeLayout ? ' depressed' : '') + '"><a onclick="Molpy.layouts[' + i + '].Activate()">Activate</a></div>';
		str += '<div class="minifloatbox layoutcontrol"><a onclick="Molpy.layouts[' + i + '].Rename()">Rename</a></div>';
		str += '<div class="minifloatbox layoutcontrol"><a onclick="Molpy.layouts[' + i + '].Clone()">Clone</a></div>';
		str += '<div class="minifloatbox layoutcontrol"><a onclick="Molpy.layouts[' + i + '].Overwrite()">Overwrite</a></div>';
		str += '<div class="minifloatbox layoutcontrol exportButton"><a onclick="Molpy.layouts[' + i + '].Export()">Export</a></div>';
		if(me != Molpy.activeLayout)
			str += '<div class="minifloatbox layoutcontrol"><a onclick="Molpy.layouts[' + i + '].Delete()">Delete</a></div>';

		return str + '</div>';
	}
	Molpy.RepaintLayouts = function() {
		Molpy.layoutNeedRepaint = 0;
		if(noLayout) return;
		if(Molpy.activeLayout.boxVis['Layouts']) {
			var str = '';
			for( var i in Molpy.layouts) {
				str += Molpy.LayoutString(i);
			}
			g('layouts').innerHTML = str;
		}
		if(Molpy.activeLayout.boxVis['QuickLayout']) {
			var str = '';
			for( var i in Molpy.layouts) {
				var me = Molpy.layouts[i];
				str += '<div class="minifloatbox layoutcontrol' + (me === Molpy.activeLayout ? ' depressed' : '')
					+ '"><a onclick="Molpy.layouts[' + i + '].Activate()">' + me.name + '</a></div>'
			}
			g('quickLayouts').innerHTML = str;
		}
	}

	Molpy.AddSandParticle = function(text) {
		//pick the first free (or the oldest) notification to replace it
		var highest = 0;
		var highestI = 0;
		for( var i in Molpy.sParticles) {
			if(Molpy.sParticles[i].life == -1) {
				highestI = i;
				break;
			}
			if(Molpy.sParticles[i].life > highest) {
				highest = Molpy.sParticles[i].life;
				highestI = i;
			}
		}
		var i = highestI;

		var rect = g('beach').getBoundingClientRect();
		var x = 0;
		var y = Math.floor((rect.height) * .7);
		x += (Math.random() - 0.5) * 180;
		y += (Math.random() - 0.5) * 120;
		var dx = (Math.random() - 0.5) * 60;

		var me = Molpy.sParticles[i];
		if(!me.l) me.l = g('sparticle' + i);
		me.life = 0;
		me.x = x;
		me.y = y;
		me.dx = dx;
		me.text = text;
		me.l.innerHTML = text;
		me.l.style.left = Math.floor(me.x) + 'px';
		me.l.style.top = Math.floor(me.y) + 'px';
		me.l.style.display = 'block';
	}

	//notifications.
	Molpy.notifs = [];
	Molpy.notifsY = 0;
	var str = '';
	for( var i = 0; i < 20; i++) {
		Molpy.notifs[i] = {
			x: 0,
			y: 0,
			life: -1,
			text: ''
		};
		str += '<div id="notif' + i + '" class="notif"></div>';
	}
	g('notifs').innerHTML = str;
	Molpy.notifsReceived = 0;
	Molpy.notifsUpdate = function() {
		var dy = 10 + Molpy.notifsY/100;
		Molpy.notifsY = 0;
		var trans = 0;
		for( var i in Molpy.notifs) {
			var me = Molpy.notifs[i];
			if(me.life != -1) {
				if(me.life < Molpy.fps * 3) Molpy.notifsY += me.l.clientHeight;

				var y = me.y;
				if(me.life < Molpy.fps / 2) {
					y -= dy;
				} else {
					y -= dy * (1 - (me.life - Molpy.fps / 2) / (Molpy.fps * 5));
				}
				me.y = y;
				me.life++;
				var el = me.l;
				el.style.left = Math.floor(-200 + me.x) + 'px';
				el.style.bottom = Math.floor(-y) + 'px';
				if(trans < 9) {
					el.style.opacity = 1 - Math.pow(me.life / (Molpy.fps * 5), 2);
					trans++;
				} else {
					el.style.opacity = 1;
				}
				if(me.life >= Molpy.fps * 5) {
					me.life = -1;
					el.style.opacity = 0;
					el.style.display = 'none';
				}
			}
		}
	}
	
	Molpy.Log = function() {
		this.np = Math.floor(Molpy.newpixNumber);
		this.time = moment();
		this.text = [];
		this.qty = [];
		this.joinedString = function() {
			str = "";
			for (i = 0; i < this.text.length; i++){
				str += "<div \">" + this.text[i];
				if (this.qty[i] > 1) str += "(x" + this.qty[i] + ")";
				str +="</div>";
			}
			return str;
		}
		return this;
	}
	
	Molpy.ClearLog = function() {
		Molpy.Anything = 1;
		Molpy.logArchive = []
		Molpy.logArchive[0] = new Molpy.Log();
		Molpy.logArchive[0].text.push("Loading...");
		Molpy.logArchive[0].qty.push(1);
		Molpy.currentLog = 0;
		Molpy.selectedLog = 0;
		Molpy.notifLogPaint = 1;
		Molpy.logUpdatePaint = 0;
		g('logCurrent').value="Current";
	}
	Molpy.ClearLog();
	Molpy.InMyPants = 0;
	
	Molpy.CleanLogs = function() { //gets rid of older logs
		if (!Molpy.options.loglimit) return;
		if (Molpy.logArchive.length > Molpy.options.loglimit) {
			Molpy.logArchive.shift();
			Molpy.currentLog--;
			Molpy.selectedLog--;
			if (Molpy.selectedLog < 0) Molpy.selectedLog = 0;
			Molpy.notifLogPaint = 1;
			Molpy.CleanLogs(); // In case more need to go
		}
	}

	Molpy.LogONG = function(){
		Molpy.currentLog++;
		Molpy.selectedLog = Molpy.currentLog;
		Molpy.logArchive[Molpy.selectedLog] = new Molpy.Log();
		Molpy.notifLogPaint = 1;
		Molpy.CleanLogs();
	}
	
	Molpy.LogBack = function(){
		Molpy.Anything = 1;
		if (Molpy.selectedLog > 0){
			Molpy.selectedLog--;
			Molpy.notifLogPaint = 1;
		}
	}
	
	Molpy.LogForward = function(){
		Molpy.Anything = 1;
		if (Molpy.selectedLog < Molpy.currentLog){
			Molpy.selectedLog++;
			Molpy.notifLogPaint = 1;
			if (Molpy.selectedLog == Molpy.currentLog) g('logCurrent').value="Current";
		}
	}
	
	Molpy.LogCurrent = function(){
		Molpy.Anything = 1;
		if (Molpy.selectedLog != Molpy.currentLog){
			Molpy.selectedLog = Molpy.currentLog;
			Molpy.notifLogPaint = 1;
		} else {
			var log = g('logItems');
			log.scrollTop = log.scrollHeight;
		}
		g('logCurrent').value="Current";
	}
	
	Molpy.logLengths = [Infinity,1,5,10,20,50,100];
	
	Molpy.Notify = function(text, importance,nolog) {
		if(importance==undefined) importance=0;
		if(Molpy.InMyPants) text += ' in my pants';
		text = format(text);
		if(importance + 1 >= Molpy.options['notifsilence'] && !nolog){
			var log = Molpy.logArchive[Molpy.currentLog];
			if (log.text[log.text.length - 1] == text){
				log.qty[log.text.length - 1] ++;
			} else {
				log.text.push(text);
				log.qty.push(1);
				if(log.text.length > Molpy.logLengths[Molpy.options['loglength']]){
					log.text.splice(0, Molpy.logLengths[Molpy.options['loglength']] - log.text.length);
					log.qty.splice(0, Molpy.logLengths[Molpy.options['loglength']] - log.text.length);
				}
			}
			Molpy.logUpdatePaint = 1;
		}
		if(Molpy.options['notifsilence']>importance){return;}
		//pick the first free (or the oldest) notification to replace it
		var highest = 0;
		var highestI = 0;
		for( var i in Molpy.notifs) {
			if(Molpy.notifs[i].life == -1) {
				highestI = i;
				break;
			}
			if(Molpy.notifs[i].life > highest) {
				highest = Molpy.notifs[i].life;
				highestI = i;
			}
		}
		var i = highestI;

		var x = Math.floor($(window).width() / 2);
		var y = Math.floor($(window).height() * 0.95);
		x += (Math.random() - 0.5) * 40;

		var me = Molpy.notifs[i];
		if(!me.l) me.l = g('notif' + i);
		me.life = 0;
		me.x = x;
		me.y = y + Molpy.notifsY;
		me.text = text;
		me.l.innerHTML = text;
		me.l.style.left = Math.floor(Molpy.notifs[i].x - 200) + 'px';
		me.l.style.bottom = Math.floor(-Molpy.notifs[i].y) + 'px';
		me.l.style.display = 'block';
		Molpy.notifsY += me.l.clientHeight;
		me.y += me.l.clientHeight;

		Molpy.notifsReceived++;
		Molpy.EarnBadge('Notified');
		if(Molpy.notifsReceived >= 2000) {
			Molpy.EarnBadge('Thousands of Them!');
		}
		
	}
	Molpy.PaintLogUpdate = function() {
		Molpy.logUpdatePaint = 0;
		g('logCurrent').value="*NEW*"
		if(Molpy.currentLog == Molpy.selectedLog){
			var log = g('logItems');
			var scroll = (log.scrollTop == (log.scrollHeight - log.clientHeight));
			log.innerHTML = Molpy.logArchive[Molpy.selectedLog].joinedString();
			if(scroll) {
				log.scrollTop = log.scrollHeight;
				g('logCurrent').value="Current";
			}
		}
		Molpy.logArchive[Molpy.currentLog].string += Molpy.logBuffer;
		Molpy.logBuffer = "";
	}
	Molpy.PaintNotifLog = function() {
		Molpy.notifLogPaint = 0;
		var title = g('logTitle');
		var today = Molpy.logArchive[Molpy.selectedLog].time;
		var h = today.hours();
		var m = today.minutes();
		if(m < 10) m = "0" + m;
		title.title = h + ":" + m;
		title.innerHTML = "Notification log for Newpix " + Molpy.logArchive[Molpy.selectedLog].np;
		var log = g('logItems');
		log.innerHTML = Molpy.logArchive[Molpy.selectedLog].joinedString();
		log.scrollTop = log.scrollHeight;
	}

	Molpy.subPixLetters = ['', 'a', 'b', 'c', 'd', 'e'];
	Molpy.fixLength=function(a,l){
		a=String(a)
		if(a.length<l){return Molpy.fixLength('0'+String(a),l)} else{return a}
	}
	Molpy.FormatNP = function(np, format) {
		var minus = (np < 0);
		var subp = Molpy.subPixLetters[Molpy.currentSubFrame];
		return (minus ? '-' : '') + np + subp;
	}
	Molpy.NewPixFloor=function(num){
		if((num>=1)||(num<0)){num=num-Math.floor(num)}
		num=Number(num.toFixed(3))
		return ['t1i-'][Number(Molpy.fracParts.indexOf(num))]
	}
	Molpy.NewPixFor = function(np) {
		np=Math.abs(np)
		var newp = Molpy.FormatNP(np);
		var floor = Math.floor(np);
		var frac=np-floor
		frac=Number(Number(frac.toFixed(3)))

		var x = 200 + flandom(200);
		var y = 200 + flandom(400);
		if(np===0) return 'http://xkcd.mscha.org/tmp/np0.png'
		if(Molpy.Got('Chromatic Heresy') && Molpy.options.colpix) {
			
			if(((floor > 3094)&&(frac==0))||((floor > 1417)&&(frac==0.1))){
				return 'http://placekitten.com/'+ (Molpy.IsEnabled('Chromatic Heresy') ? '' : 'g/') + x + '/' + y;
			}else if(frac==0){
				return 'http://139.162.169.39/Time/otcolorization/' + newp;
			} else if(Molpy.fracParts.indexOf(frac)>-1){
				return 'http://xkcd.mscha.org/otcstories/'+Molpy.NewPixFloor(frac)+Molpy.fixLength(floor,4)+'.png'
			} else if(Molpy.fracParts.indexOf(frac)==-1){return 'http://placekitten.com/g/' + x + '/' + y;} //ErrorCat is error
		} else {
			if(((floor > 3094)&&(frac===0))||((floor > 1417)&&(frac===0.1))){
				return 'http://placekitten.com/' + (Molpy.IsEnabled('Chromatic Heresy') ? '' : 'g/') +x + '/' + y;
			} else if(frac==0){
				return 'http://xkcd.mscha.org/frame/' + newp;
			} else if(Molpy.fracParts.indexOf(frac)>-1){
				return 'http://xkcd.mscha.org/otcstories/'+Molpy.NewPixFloor(frac)+Molpy.fixLength(floor,4)+'.png'
			} else if(Molpy.fracParts.indexOf(frac)==-1) {return 'http://placekitten.com/' +(Molpy.IsEnabled('Chromatic Heresy') ? '' : '/g') + x + '/' + y;} //ErrorCat is error
		}
	}
	Molpy.ThumbNewPixFor = function(np) {
		np = Math.abs(np);
		var newp = Molpy.FormatNP(np);
		var floor = Math.floor(np);
		var frac=np-floor
		frac=Number(frac.toFixed(3))
		if(((floor > 3094)&&(frac==0))||((floor > 1417)&&(frac==0.1)))
			return 'http://placekitten.com/' + (Molpy.IsEnabled('Chromatic Heresy') ? '' : '/g') +x + '/' + y;
		else if(frac==0){
			return 'http://xkcd.mscha.org/frame/' + newp;
		} else if(Molpy.fracParts.indexOf(frac)>-1){
			return 'http://xkcd.mscha.org/otcstories/'+Molpy.NewPixFloor(frac)+Molpy.fixLength(floor,4)+'.png'
		} else if(Molpy.fracParts.indexOf(frac)==-1){return 'http://placekitten.com/' + (Molpy.IsEnabled('Chromatic Heresy') ? '' : '/g') +x + '/' + y;} //ErrorCat is error
	}

	Molpy.Url = function(address) {
		return 'url(' + address + ')';
	}

	//call with argument to change to a specific np, otherwise defaults to the current np
	Molpy.UpdateBeach = function(np) {
		np = np || Molpy.newpixNumber;
		g('beach').style.backgroundImage = Molpy.Url(Molpy.NewPixFor(np));
		Molpy.preloadedBeach = 0;
	}
	Molpy.preloadedBeach = 0;
	Molpy.PreloadBeach = function(np) {
		//REMOVED because it's giving people console errors and wasn't working for me anyway:
		//$.get(Molpy.NewPixFor(np||Molpy.newpixNumber+1));
		if(!np) Molpy.preloadedBeach = 1;
	}
	/* In which we figure out how to draw stuff
	+++++++++++++++++++++++++++++++++++++++++++*/
	Molpy.drawFrame = 0;
	Molpy.Draw = function() {
		var castleAmt = Molpy.Boosts['Castles'].power; //so we don't need lots of lookups
		g('castlecount').innerHTML = Molpify(castleAmt, 1) + ' castle' + plural(castleAmt);
		g('sandcount').innerHTML = Molpify(Molpy.Boosts['Sand'].power, 1) + ' sand' + (isFinite(castleAmt) ? ' of ' + Molpify(Molpy.Boosts['Castles'].nextCastleSand, 1) + ' needed' : '');
		g('sandrate').innerHTML = Molpify(Molpy.Boosts['Sand'].sandPermNP, 1) + ' sand/mNP';
		g('chipcount').innerHTML = Molpify(Molpy.Boosts['TF'].power, 1) + ' chips';
		g('chiprate').innerHTML = Molpify(Molpy.Boosts['TF'].loadedPermNP, 1) + ' chips/mNP';
		g('newtools').innerHTML = 'Built ' + Molpify(Molpy.toolsBuilt, 1) + ' new tool' + plural(Molpy.toolsBuilt);

		if(noLayout) {
			var finite = isFinite(Molpy.Boosts['Sand'].power) || isFinite(castleAmt) || isFinite(Molpy.spmNP);
			var tf = Molpy.Got('TF');
			if (Molpy.TotalDragons) {
				$('#sectionDragonsNP').removeClass('hidden');
				$('#sectionTFCounts').addClass('hidden');
			} else if (tf) {
				$('#sectionTFCounts').removeClass('hidden');
			} else {
				$('#sectionTFCounts').addClass('hidden');
			}

			if(tf) {
				$('#sectionSandCounts').toggleClass('hidden', !finite);
				$('#sectionAbout').toggleClass('hidden', finite);
			} else {
				$('#sectionSandCounts').removeClass('hidden');
				$('#sectionAbout').removeClass('hidden');
			}
		} else {
			$('#toggleTFCounts').removeClass('hidden');
		}
		var str='Newpix'+(Molpy.newpixNumber<0?' -':' ') + (Math.floor(Math.abs(Molpy.newpixNumber)));
		if(Molpy.currentStory>=0){str=str+[' of t1i'][Molpy.currentStory]}
		g('newpixnum').innerHTML = str
		g('eon').innerHTML = Molpy.TimeEon;
		g('era').innerHTML = Molpy.TimeEra;
		g('period').innerHTML = Molpy.TimePeriod;
		$('.timeflip').toggleClass('flip-horizontal', (Molpy.previewNP ? Molpy.previewNP < 0 : Molpy.newpixNumber < 0));
		g('version').innerHTML = '<br>Version: ' + Molpy.version  + (Molpy.versionName?'<br>'+Molpy.versionName:'');
		var npd = Molpy.NPdata[Molpy.newpixNumber];
		if (npd && npd.amount) {
			var dq = Molpy.Boosts['DQ'];
			var dt = Molpy.DragonsById[npd.DragonType];
			var str = Molpify(npd.amount) + ' ' + dt.name + (npd.amount > 1?'s':'') + '<br>';
			str += ['Digging','Recovering','Hiding','Celebrating'][dq.overallState];
			if (dq.overallState > 0) str += ' for ' + MolpifyCountdown(dq.countdown, 1);
			str += '<br>';
			var Stats = Molpy.DragonStatsNow(Molpy.newpixNumber);
			str += 'Def: ' + Molpify(Stats.defence,2) + ' Atk: ' + Molpify(Stats.attack+0.001,2) + 
				' Dig:&nbsp;' + Molpify(Stats.dig,2) ;
			if (Stats.breath) str += ' Breath:&nbsp;' + Molpify(Stats.breath,2);
			if (Stats.magic1) str += ' Magic1:&nbsp;' + Molpify(Stats.magic1,2);
			if (Stats.magic2) str += ' Magic2:&nbsp;' + Molpify(Stats.magic2,2);
			if (Stats.magic3) str += ' Magic3:&nbsp;' + Molpify(Stats.magic3,2);
			g('DragonsNP').innerHTML = str;
		} else {
			g('DragonsNP').innerHTML = 'No Dragons here';
		}

		if(!noLayout) {
			g('stuffSandCount').innerHTML = 'Sand: ' + Molpify(Molpy.Boosts['Sand'].power, 3);
			g('stuffCastleCount').innerHTML = 'Castles: ' + Molpify(castleAmt, 3);
			g('stuffTFChipCount').innerHTML = 'TF Chips: ' + Molpify(Molpy.Boosts['TF'].Level, 3);
			for( var i in Molpy.BoostsByGroup['stuff']) {
				var bst = Molpy.BoostsByGroup['stuff'][i];
				if(bst.alias == "Sand" || bst.alias == "Castles") continue;
				if($('#stuff' + bst.alias + 'Count').length == 0) {
					$("#stuffItems").append("<div id=\"stuff" + bst.alias + "Count\"></div>");
				}
				if (bst.alias == 'Gold' && bst.Level < 1) {
					var name = 'Silver';
					var amt = bst.Level*1000;
					if (amt < 1) { name = 'Copper'; amt = Math.round(amt*1000)};
					g('stuff' + bst.alias + 'Count').innerHTML = name + ': ' + Molpify(amt, 3);
				} else {
					g('stuff' + bst.alias + 'Count').innerHTML = bst.plural + ': ' + Molpify(bst.Level, 3);
				}
				$('#stuff' + bst.alias + 'Count').toggleClass('hidden', !Molpy.Got(bst.alias));
			}

			g('incomeSandRate').innerHTML = 'Sand: ' + Molpify(Molpy.Boosts['Sand'].sandPermNP, 1) + '/mNP';
			g('incomeSandClickRate').innerHTML = 'Sand/click: ' + Molpify(Molpy.Boosts['Sand'].sandPerClick, 1);
			g('incomeChipRate').innerHTML = 'TF Chips: ' + Molpify(Molpy.Boosts['TF'].loadedPermNP, 1) + '/mNP';
			g('incomeChipClickRate').innerHTML = 'TF Chips/click: ' + Molpify(Molpy.Boosts['TF'].loadedPerClick, 1);
			g('incomeNewTools').innerHTML = 'Tools: ' + Molpify(Molpy.toolsBuilt, 1) + ' built this mNP';

			var tf = Molpy.Got('TF');
			$('#stuffTFChipCount').toggleClass('hidden', !tf);
			$('#incomeChipRate').toggleClass('hidden', !tf);
			$('#incomeChipClickRate').toggleClass('hidden', !tf);
			$('#incomeNewTools').toggleClass('hidden', !tf);
		}

		var repainted = Molpy.allNeedRepaint || Molpy.shopNeedRepaint || Molpy.boostNeedRepaint || Molpy.badgeNeedRepaint || Molpy.toolsNeedRepaint || Molpy.lootNeedRepaint;
		Molpy.lootSelectionNeedRepaint = Molpy.allNeedRepaint || Molpy.boostNeedRepaint || Molpy.badgeNeedRepaint || Molpy.lootNeedRepaint || Molpy.lootSelectionNeedRepaint;
		
		//var updated = Molpy.shopNeedUpdate || Molpy.toolsNeedUpdate || Molpy.lootNeedUpdate;

		//TODO want to repaint as little as possible, favoring updates instead
		if(Molpy.allNeedRepaint) {
			Molpy.repaintAll();
		}
		if(Molpy.boostNeedRepaint) {
			Molpy.repaintBoosts();
		}
		if(Molpy.badgeNeedRepaint) {
			Molpy.repaintBadges();
		}
		if(Molpy.lootNeedRepaint) {
			Molpy.repaintLoot();
		}
		if(Molpy.shopNeedRepaint) {
			Molpy.repaintShop();
		}
		if(Molpy.toolsNeedRepaint) {
			Molpy.repaintTools();
		}
		if(Molpy.layoutNeedRepaint) {
			Molpy.RepaintLayouts();
		}
		if(Molpy.lootSelectionNeedRepaint) Molpy.RepaintLootSelection();
		
		if(Molpy.shopNeedUpdate) {
			Molpy.updateShop();
		}
		if(Molpy.toolsNeedUpdate) {
			Molpy.updateTools();
		}
		if(Molpy.lootNeedUpdate) {
			Molpy.updateLoot();
		}
		
		if(Molpy.Redacted.location) Molpy.redactedHighlight(repainted);
		
		if(repainted && Molpy.options.fade) Molpy.AdjustFade();
		
		if(repainted) {
			for( var grp in Molpy.dispObjects) {
				if(!(grp == 'tools' || grp == 'shop')) continue;
				for(var i in Molpy.dispObjects[grp])
					Molpy.dispObjects[grp][i].updateBuy();
			}
		}
		
		if(Molpy.redactedNeedRepaint) Molpy.repaintRedacted();

		drawClockHand();
		Molpy.PaintStats();
		Molpy.UpdateFaves();
		Molpy.notifsUpdate();
		if(Molpy.notifLogPaint) Molpy.PaintNotifLog();
		if(Molpy.logUpdatePaint) Molpy.PaintLogUpdate();		
		if(Molpy.options.numbers) Molpy.sparticlesUpdate();

		Molpy.CheckBeachClass();
		
		Molpy.Boosts['Temporal Rift'].updateRiftIMG();
	}

	Molpy.MiniDraw = function() {
		Molpy.notifsUpdate();
		Molpy.redactedHighlight(0);
		if(Molpy.options.numbers) Molpy.sparticlesUpdate();
	}

	Molpy.redactedHighlight = function(repainted) {
		if(Molpy.Redacted.location) {
			var ra = $('.redacted-area');
			if(ra) {
				Molpy.drawFrame++;
				if(Molpy.drawFrame >= Molpy.fps / 3) Molpy.drawFrame = 0;
				if(repainted || Molpy.drawFrame == 0) {
					var className = Molpy.Redacted.classNames[Molpy.Redacted.location];
					if(Molpy.Boosts['Chromatic Heresy'].power > 0 && Molpy.Got('Technicolour Dream Cat') && Molpy.IsEnabled('Technicolour Dream Cat') && Molpy.Redacted.drawType[Molpy.Redacted.drawType.length - 1] != 'hide2') {
						ra.removeClass(Molpy.Redacted.tempAreaClass);
						Molpy.Redacted.tempAreaClass = ['alert', 'action', 'toggle', '', ''][flandom(4)];
						className += ' ' + Molpy.Redacted.tempAreaClass;
						ra.addClass(Molpy.Redacted.tempAreaClass);
					}
					var redacteditem = g('redacteditem');
					if(redacteditem) redacteditem.className = className;
				}
			}
		}
	}

	Molpy.PaintStats = function() {
		g('totalsandstat').innerHTML = Molpify(Molpy.Boosts['Sand'].totalDug, 4);
		g('manualsandstat').innerHTML = Molpify(Molpy.Boosts['Sand'].manualDug, 4);
		g('clicksstat').innerHTML = Molpify(Molpy.beachClicks, 4);
		g('spclickstat').innerHTML = Molpify(Molpy.Boosts['Sand'].sandPerClick, 4);
		g('sandspentstat').innerHTML = Molpify(Molpy.Boosts['Sand'].spent, 4);
		g('totalcastlesstat').innerHTML = Molpify(Molpy.Boosts['Castles'].totalBuilt, 4);
		g('destroyedcastlesstat').innerHTML = Molpify(Molpy.Boosts['Castles'].totalDestroyed, 4);
		g('downcastlesstat').innerHTML = Molpify(Molpy.Boosts['Castles'].totalDown, 4);
		g('spentcastlesstat').innerHTML = Molpify(Molpy.Boosts['Castles'].spent, 4);

		g('ninjatimestat').innerHTML = Molpify(Molpy.CastleTools['NewPixBot'].ninjaTime / Molpy.NPlength, 1) + 'mNP';
		g('ninjastealthstat').innerHTML = Molpify(Molpy.ninjaStealth, 1) + 'NP';
		g('ninjaforgivestat').innerHTML = Molpify(Molpy.Boosts['Ninja Hope'].power * Molpy.Got('Ninja Hope')
			+ Molpy.Boosts['Ninja Penance'].power * Molpy.Got('Ninja Penance') + Molpy.Boosts['Impervious Ninja'].power
			* Molpy.Got('Impervious Ninja'));

		g('dragontypestat').innerHTML = Molpy.DragonsById[Molpy.Level('DQ')].name;
		g('dragonnumbersstat').innerHTML = Molpify(Molpy.TotalDragons, 1);
		g('npswithdragonsstat').innerHTML = Molpify(Molpy.TotalNPsWithDragons, 1);
		g('dragondiggingstat').innerHTML = Molpify(Molpy.DragonDigRate, 3);
		g('dragonsloststat').innerHTML = Molpify(Molpy.Boosts['DQ'].totalloses, 2);
		g('dragonfightstat').innerHTML = Molpify(Molpy.Boosts['DQ'].totalfights, 2);

		g('loadcountstat').innerHTML = Molpify(Molpy.loadCount, 1);
		g('savecountstat').innerHTML = Molpify(Molpy.saveCount, 1);
		g('notifstat').innerHTML = Molpify(Molpy.notifsReceived, 2);
		g('autosavecountstat').innerHTML = Molpify(Molpy.autosaveCountup, 1);

		g('sandtoolsownedstat').innerHTML = Molpify(Molpy.SandToolsOwned, 4);
		g('castletoolsownedstat').innerHTML = Molpify(Molpy.CastleToolsOwned, 4);
		g('boostsownedstat').innerHTML = Molpify(Molpy.BoostsOwned, 4);
		g('badgesownedstat').innerHTML = Molpify(Molpy.BadgesOwned, 4);
		g('discoveriesstat').innerHTML = Molpify((Molpy.groupBadgeCounts.discov || 0), 4);
		g('sandmonstat').innerHTML = Molpify((Molpy.groupBadgeCounts.monums || 0), 4);
		g('glassmonstat').innerHTML = Molpify((Molpy.groupBadgeCounts.monumg || 0), 4);
		g('diammaststat').innerHTML = Molpify((Molpy.groupBadgeCounts.diamm || 0), 4);

		g('sandmultiplierstat').innerHTML = Molpify(Molpy.globalSpmNPMult * 100, 4) + '%';
		g('redactedstat').innerHTML = Molpy.Redacted.words + ": " + Molpify(Molpy.Redacted.totalClicks, 1);
		g('redactedmaxstat').innerHTML = 'Max ' + Molpy.Redacted.word + " Chain: " + Molpify(Molpy.Redacted.chainMax, 1);

		g('glasschipstat').innerHTML = Molpify(Molpy.Boosts['GlassChips'].power, 4);
		g('glassblockstat').innerHTML = Molpify(Molpy.Boosts['GlassBlocks'].power, 4);
		g('sandusestat').innerHTML = Molpify(Molpy.CalcGlassUse(), 6) + '%';

		$('#chipspmnp').toggleClass('hidden', !Molpy.Got('AA'));
		$('#blockspmnp').toggleClass('hidden', !Molpy.Got('AA'));
		g('chipspmnpstat').innerHTML = Molpify(Molpy.Boosts['GlassChips'].chipsPermNP, 3);
		g('blockspmnpstat').innerHTML = Molpify(Molpy.Boosts['GlassBlocks'].blocksPermNP, 3);

		g('blackstat').innerHTML = Molpy.BlackprintReport();

		g('logicatstat').innerHTML = Molpify(Molpy.Boosts['Logicat'].bought, 1);
		g('totaltoolchipsstat').innerHTML = Molpify(Molpy.Boosts['TF'].totalLoaded, 4);
		g('destroyedtoolchipsstat').innerHTML = Molpify(Molpy.Boosts['TF'].totalDestroyed, 4);
		g('manualchipsstat').innerHTML = Molpify(Molpy.Boosts['TF'].manualLoaded, 4);
		g('chipclickstat').innerHTML = Molpify(Molpy.Boosts['TF'].loadedPerClick, 4);
		g('storagestat').innerHTML = (Molpy.supportsLocalStorage ? 'html5localstorage' : 'c**kies');
	}

	Molpy.UpdateFaves = function(force) {
		var fav = Molpy.activeLayout.faves;
		for( var i in fav) {
			var f = fav[i];
			if(f.boost && (f.boost.faveRefresh || force)) {
				f.BoostToScreen();
			}
		}
		for( var i in fav) {
			var f = fav[i];
			if(f.boost && f.boost.faveRefresh) {
				f.boost.faveRefresh = 0;
			}
		}
	}

	Molpy.oldBeachClass = '';
	Molpy.UpdateBeachClass = function(stateClass) {
		stateClass = stateClass || '';
		if(Molpy.Boosts['Beachball'].power) {
			if(Molpy.oldBeachClass != stateClass) {
				$('#beach').removeClass(Molpy.oldBeachClass).addClass(stateClass);
				Molpy.oldBeachClass = stateClass;
			}
		} else if(Molpy.oldBeachClass) {
			$('#beach').removeClass(Molpy.oldBeachClass);
			Molpy.oldBeachClass = '';
		}
	}
	
	Molpy.clockDegrees = 0;
	function createClockHand() {
		var clockSizeX = 40, clockSizeY = 40, handOriginX = clockSizeX / 2, handOriginY = clockSizeY / 2, handSize = 12;
		var hand = document.createElement("div");
		$(hand).css({
			position: "relative",
			left: handOriginX + "px",
			top: handOriginY + "px",
			width: "2px",
			height: handSize + "px",
			backgroundColor: "#222",
		});
		g("clockface").appendChild(hand);
	}
	function drawClockHand() {
		if(!g('game')) {
			return;
		}
		if(!Molpy.ONGelapsed) {
			Molpy.ONGelapsed = moment().valueOf() - Molpy.ONGstart.valueOf();
		}
		var npPercent = Molpy.ONGelapsed / (Molpy.NPlength * 1000);
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

	Molpy.LockLayoutToggle = function() {
		Molpy.Anything = 1;
		Molpy.layoutLocked = !Molpy.layoutLocked;

		$('.draggable-element,.resizable-element').toggleClass('editlock', Molpy.layoutLocked);
		$('.ui-resizable-handle').toggleClass('hidden', Molpy.layoutLocked);
		$('#toggleSnap').toggleClass('hidden', Molpy.layoutLocked);
		$('#toggleGrid').toggleClass('hidden', Molpy.layoutLocked);
		$('#toggleLockLayout').toggleClass('depressed', Molpy.layoutLocked);
		//toggling hidden doesn't work for some reason, would be nice if it did
		if(Molpy.layoutLocked) {
			$('.ui-border-color-button').hide();
		} else {
			$('.ui-border-color-button').show();
		}
	}
	Molpy.SnapLayoutToggle = function() {
		Molpy.Anything = 1;
		Molpy.layoutSnap = !Molpy.layoutSnap;

		$('#toggleSnap').toggleClass('depressed', Molpy.layoutSnap);
		$('.draggable-element').draggable('option', 'snap', Molpy.layoutSnap)
	}
	Molpy.GridLayoutToggle = function() {
		Molpy.Anything = 1;
		Molpy.layoutGrid = !Molpy.layoutGrid;

		$('#toggleGrid').toggleClass('depressed', Molpy.layoutGrid);
		var size = Molpy.layoutGrid ? 10 : 1;
		$('.draggable-element').draggable('option', 'grid', [size, size])
	}

	//Handles player clicking, not needed for loading layouts
	Molpy.CycleBorderClick = function(e) {
		var sectionName = $(e.target).parent().attr('id').match(/section(.+)/)[1];
		Molpy.CyclePanelBorder(sectionName);
	}

	//Does the actual Color cycling
	Molpy.CyclePanelBorder = function(panelName) {
		var newColor = ++Molpy.activeLayout.borderColors[panelName] || (Molpy.activeLayout.borderColors[panelName] = 0);
		if(newColor >= 11) {
			Molpy.activeLayout.borderColors[panelName] = newColor = 0;
		}
		
		var thisPanel = $('#section' + panelName);
		var borderbutton = thisPanel.find('.ui-border-color-button')
		for(var i=0; i<11; i++){
			thisPanel.removeClass('bordercolor' + i);
			borderbutton.removeClass('bordercolor' + i);
		}
		
		thisPanel.addClass('borderActive bordercolor' + newColor);
		Molpy.activeLayout.borderColors[panelName] = newColor;
		if(newColor != 0) {
			borderbutton.css('border-color', '');
			borderbutton.addClass('bordercolor' + newColor);
		} else {
			thisPanel.removeClass('borderActive');
			borderbutton.css('border-color', '#999');
		}
	}

	Molpy.nFaves = 40;
	Molpy.Layout = function(args) {
		this.name = args.name || '';
		this.lootVis = $.extend({}, args.lootVis);
		this.boxVis = $.extend({}, args.boxVis);
		this.positions = $.extend({}, args.positions);
		this.sizes = $.extend({}, args.sizes);
		this.borderColors = $.extend({}, args.borderColors)
		if(!noLayout) {
			this.faves = Molpy.EmptyFavePanes(Molpy.nFaves);
		}

		this.toString = function() {
			var p = 'P'; //Pipe seParator
			var s = 'S'; //Semicolon
			var c = 'C'; //Comma

			var thread = '';
			var threads = [];
			thread += Molpy.version + p + p;//some extra space!
			thread += this.name.toLowerCase() + p;

			for( var i in Molpy.lootVisOrder) {
				thread += this.lootVis[Molpy.lootVisOrder[i]] ? 1 : 0;
			}
			thread += p;
			for( var i in Molpy.boxVisOrder) {
				thread += this.boxVis[Molpy.boxVisOrder[i]] ? 1 : 0;
			}
			thread += p;
			for( var i in Molpy.draggableOrder) {
				var item = this.positions[Molpy.draggableOrder[i]]
				thread += item.left + c + item.top + s;
			}
			thread += p;
			for( var i in Molpy.sizableOrder) {
				var item = this.sizes[Molpy.sizableOrder[i]]
				thread += item.width + c + item.height + s;
			}
			thread += p;
			for( var i in this.faves) {
				var item = this.faves[i];
				thread += item.toString() + s;
			}
			thread+=p;
			for(var i in Molpy.borderColorOrder) {
				var item=this.borderColors[Molpy.borderColorOrder[i]] || 0;
				thread += item + s;
			}
			thread += p;

			return thread;
		}

		this.FromString = function(string) {
			var p = 'P'; //Pipe seParator
			var s = 'S'; //Semicolon
			var c = 'C'; //Comma
			var threads = string.split(p);
			var version = parseFloat(threads[0]);
			this.name = threads[2].replace(/\W/g, '').toLowerCase();

			this.lootVis = {};
			var pixels = threads[3].split('');
			for( var i in Molpy.lootVisOrder) {
				var vis = parseInt(pixels[i]) == 1;//we want a boolean because jQuery
				this.lootVis[Molpy.lootVisOrder[i]] = vis;
			}

			this.boxVis = {};
			pixels = threads[4].split('');
			for( var i in Molpy.boxVisOrder) {
				var vis = parseInt(pixels[i]) == 1;//ditto
				this.boxVis[Molpy.boxVisOrder[i]] = vis;
			}

			this.positions = {};
			pixels = threads[5].split(s);
			for( var i in Molpy.draggableOrder) {
				if(!pixels[i]) pixels[i] = '0C0';
				var pos = pixels[i].split(c);
				this.positions[Molpy.draggableOrder[i]] = {
					left: parseFloat(pos[0]),
					top: parseFloat(pos[1])
				};
			}

			this.sizes = {};
			pixels = threads[6].split(s);
			for( var i in Molpy.sizableOrder) {
				if(!pixels[i]) pixels[i] = '0C0';
				var pos = pixels[i].split(c);
				this.sizes[Molpy.sizableOrder[i]] = {
					width: parseFloat(pos[0]),
					height: parseFloat(pos[1])
				};
			}
			if(threads[7] && !noLayout) {
				this.faves = Molpy.EmptyFavePanes(Molpy.nFaves);
				pixels = threads[7].split(s);
				for( var i in pixels) {
					if(!pixels[i]) break;
					var fav = this.faves[i];
					fav.FromString(pixels[i]);
					this.faves.push(fav);
				}
			}
			if(threads[8] && !noLayout) {
				this.borderColors = {};
				pixels = threads[8].split(s);
				for( var i in Molpy.borderColorOrder) {
					if(!pixels[i]) pixels[i] = '0';
					this.borderColors[Molpy.borderColorOrder[i]] = parseInt(pixels[i]) || 0;
				}
			}

			if ((this.boxVis['LootNavigation'] == 0) && (this.positions['LootNavigation'].left == 0) && 
					(this.positions['LootNavigation'].top == 0) && !noLayout) {
				this.boxVis['LootNavigation'] = 1;
				this.positions['LootNavigation'].left = this.positions['Inventory'].left;
				this.positions['LootNavigation'].top = this.positions['Inventory'].top;
				this.positions['Inventory'].top+=25;
			}
		}

		this.ToScreen = function() {
			Molpy.Overview.SetSizes();
			for( var i in Molpy.lootVisOrder) {
				var el = Molpy.lootVisOrder[i];
				Molpy.ShowhideToggle(el, this.lootVis[el] == true); //==true incase there are missing values (otherwise they would toggle instead of set to false)
			}
			for( var i in Molpy.boxVisOrder) {
				var el = Molpy.boxVisOrder[i];
				Molpy.ToggleView(el, this.boxVis[el] == true);
			}
			if(noLayout) return;
			for( var i in Molpy.draggableOrder) {
				var item = Molpy.draggableOrder[i];
				var pos = this.positions[item];
				$('#section' + item).css(pos);
			}
			for( var i in Molpy.sizableOrder) {
				var item = Molpy.sizableOrder[i];
				var size = this.sizes[item];
				$('#section' + item + 'Body').css(size);
			}
			for( var i in this.faves) {
				this.faves[i].ToScreen();
			}
			for( var i in Molpy.borderColorOrder) {
				var item = Molpy.borderColorOrder[i];
				this.borderColors[item]--;
				Molpy.CyclePanelBorder(item);
			}

			Molpy.FixPaneWidths();
		}

		this.FromScreen = function() {
			this.positions = {};
			this.sizes = {};
			for( var i in Molpy.draggableOrder) {
				var item = g('section' + Molpy.draggableOrder[i]);
				this.positions[Molpy.draggableOrder[i]] = {
					left: parseFloat(item.style.left),
					top: parseFloat(item.style.top)
				};
			}
			for( var i in Molpy.sizableOrder) {
				var item = $('#section' + Molpy.sizableOrder[i] + 'Body');
				this.sizes[Molpy.sizableOrder[i]] = {
					width: item.width(),
					height: item.height()
				};
			}
			this.lootVis = $.extend({}, Molpy.activeLayout.lootVis); //because the active layout's vis settings ARE the screen settings
			this.boxVis = $.extend({}, Molpy.activeLayout.boxVis);
			for( var i in this.faves) {
				this.faves[i].FromScreen();
			}
			this.borderColors = $.extend({}, Molpy.activeLayout.borderColors);
		}

		this.Export = function() {
			Molpy.Anything = 1;
			Molpy.ToggleView('Export');
			g('exporttext').value = this.toString();
		}
		this.Overwrite = function() {
			Molpy.Anything = 1;
			if(confirm('Really overwrite the layout "' + this.name + '"with the current settings?')) {
				this.FromScreen();
			}
		}
		this.Activate = function() {
			Molpy.Anything = 1;
			Molpy.activeLayout = this;
			this.ToScreen();
			Molpy.layoutNeedRepaint = 1;
		}
		this.Clone = function() {
			Molpy.Anything = 1;
			var clone = new Molpy.Layout(this);
			clone.name += ' clone';
			Molpy.layouts.push(clone);
			Molpy.layoutNeedRepaint = 1;
		}
		this.Delete = function() {
			Molpy.Anything = 1;
			if(Molpy.layouts.length < 2) {
				Molpy.Notify('You need at least 1 layout!',1);
				return;
			}
			if(confirm('Really delete the layout "' + this.name + '"?')) {
				var i = Molpy.layouts.indexOf(this);
				if(i >= 0) {
					Molpy.layouts.splice(i, 1);
					Molpy.layoutNeedRepaint = 1;
				}
			}
		}
		this.Rename = function() {
			Molpy.Anything = 1;
			var str = prompt('Enter a layout name here:', 'lowercase123');
			str = str.replace(/\W/g, '').toLowerCase();
			if(!str) return;
			this.name = str;
			Molpy.layoutNeedRepaint = 1;
		}

	}
	Molpy.NewLayout = function() {
		Molpy.Anything = 1;
		var newLayout = new Molpy.Layout({});
		newLayout.FromScreen();
		newLayout.name = "new";
		Molpy.layouts.push(newLayout);
		Molpy.layoutNeedRepaint = 1;
	}
	Molpy.ImportLayout = function() {
		Molpy.Anything = 1;
		var thread = prompt('Paste a valid layout code here:\n(write "default" or "default2" for the defaults)', '');
		if(!thread) return;
		if(thread == 'default') thread = Molpy.defaultLayoutData;
		if(thread == 'default2') thread = Molpy.defaultLayoutData2;
		var newLayout = new Molpy.Layout({});
		newLayout.FromString(thread);
		Molpy.layouts.push(newLayout);
		Molpy.layoutNeedRepaint = 1;
	}

	Molpy.FixPaneWidths = function() {
		$('#lootselection').css({width: $('#sectionInventoryBody').width()});
		$('.layoutcontrols').css({width: $('#sectionLayoutsBody').width()});
	}
	Molpy.IsStatsVisible = function() {
		return Molpy.activeLayout.boxVis['Stats'];
	}

	Molpy.FavePane = function(i) {
		this.i = i;
		this.boost = 0;
		this.vis = false;
		this.position = {
			left: 0,
			top: 0
		};
		this.size = {
			width: 140,
			height: 50
		};

		this.toString = function() {
			var c = 'C'; //Comma
			var id = 'n';
			if(this.boost) {
				id = '' + this.boost.id;
				if(Molpy.BoostsById[id] !== this.boost) {
					if (id >= Molpy.DiscoveriesStartAt) { id = -1000000 -id +Molpy.DiscoveriesStartAt; }
					else { id = 1 - id; }
				}
			}
			return id + c + (this.vis ? 1 : 0) + c + (this.position.left || 0) + c + (this.position.top || 0) + c + (this.size.width || 0) + c + (this.size.height || 0);
		}
		this.FromString = function(str) {
			var c = 'C'; //Comma
			var pixels = str.split(c);
			var n = pixels[0];
			if (n == 'n') { this.boost = 0 }
			else if (n >= 0) { this.boost = Molpy.BoostsById[parseInt(n) || 0] }
			else if (n > -1000000) { this.boost = Molpy.BadgesById[1 - parseInt(n) || 0] }
			else { this.boost = Molpy.BadgesById[Molpy.DiscoveriesStartAt + 1000000 + parseInt(n) || 0] };
			if (this.boost) this.boost.faveRefresh = 1;
			this.vis = pixels[1] == true;
			this.position = {
				left: parseFloat(pixels[2]),
				top: parseFloat(pixels[3])
			};
			this.size = {
				width: parseFloat(pixels[4]),
				height: parseFloat(pixels[5])
			};
		}
		this.ToScreen = function() {
			$('#sectionFave' + this.i).css(this.position);
			$('#sectionFaveBody' + this.i).css(this.size);
			this.BoostToScreen();
		}
		this.BoostToScreen = function() {
			var n = this.i;
			if(this.boost) {
				Molpy.DisplayingFave =1;
				g('optionFave' + n).text = this.boost.name;
				g('faveHeader' + n).innerHTML = '<H1 class="groupTitle">[' + this.boost.getHeading() + ']</H1><H2 class="objName">' + this.boost.getFormattedName() + '</H2>';
				if(this.boost.boost) {
					g('faveContent' + n).innerHTML = (this.boost.unlocked ? this.boost.getDesc() : 'This Boost is locked!');
					this.boost.updateBuy(1);
				} else {
					g('faveContent' + n).innerHTML = (this.boost.earned ? this.boost.getDesc() : 'This Badge is unearned!');
				}
				g('sectionFave' + n).className = 'draggable-element table-wrapper ' + this.boost.getFullClass();
				Molpy.DisplayingFave =0;
			} else {
				g('optionFave' + n).text = n + ' (empty)';
				g('faveHeader' + n).innerHTML = '';
				g('faveContent' + n).innerHTML = 'Fave ' + n;
				g('sectionFave' + n).className = 'draggable-element table-wrapper';
			}
			$('#sectionFave' + this.i).toggleClass('hidden', !this.vis).toggleClass('editlock', Molpy.layoutLocked);
		}
		this.FromScreen = function() {
			var item = g('sectionFave' + this.i);
			this.position = {
				left: parseFloat(item.style.left),
				top: parseFloat(item.style.top)
			};

			var item = $('#sectionFaveBody' + this.i);
			this.size = {
				width: item.width(),
				height: item.height()
			};

			this.vis = Molpy.activeLayout.faves[this.i].vis; //because the active layout's vis settings ARE the screen settings
		}
	}

	Molpy.EmptyFavePanes = function(n) {
		var f = [];
		for( var i = 0; i < n; i++) {
			f.push(new Molpy.FavePane(i));
		}
		return f;
	}
	Molpy.MakeFavePanes = function() {
		var str = '';
		for( var i in Molpy.activeLayout.faves) {
			str += '<div id="sectionFave' + i + '" class="hidden draggable-element table-wrapper">\<div id="faveHeader' + i
				+ '" class="table-header"></div>\<div id="sectionFaveBody' + i
				+ '" class="table-content resizable-element">\<div id="faveContent' + i
				+ '" class="table-content-wrapper">Fave ' + i + '\</div>\</div>\</div>';
		}
		if(str) g('sectionFavePanes').innerHTML = str;
		var str = '';
		for( var i in Molpy.activeLayout.faves) {
			str += '<option id="optionFave' + i + '" value="' + i + '">' + i + ' (empty)</option>';
		}
		if(str) g('selectFave').innerHTML = '<option>None</option>' + str;
	}
	Molpy.InitGUI = function() {
		Molpy.lootVisOrder = ['boosts', 'ninj', 'cyb', 'hpt', 'chron', 'bean', 'dimen', 'badges', 'badgesav', 'discov',
				'monums', 'monumg', 'tagged', 'ceil', 'drac', 'stuff', 'land', 'prize', 'varie','search', 'faves'];
		Molpy.boxVisOrder = ['Clock', 'Timer', 'View', 'File', 'Links', 'Beach', 'Shop', 'Inventory', 'SandTools',
				'CastleTools', 'Options', 'Stats', 'Log', 'Export', 'About', 'SandCounts', 'NPInfo', 'Layouts',
				'Codex', 'Alerts', 'SandStats', 'GlassStats', 'NinjaStats', 'OtherStats', 'QuickLayout', 'TFCounts',
				'Faves', 'StuffCounts', 'IncomeCounts','LootSearch','LootNavigation',
				'DragonStats','DragonsNP','DragonOverview'];
		Molpy.draggableOrder = ['Clock', 'Timer', 'View', 'File', 'Links', 'Beach', 'Options', 'Stats', 'Log',
				'Export', 'SandCounts', 'TFCounts', 'NPInfo', 'About', 'SandTools', 'CastleTools', 'Shop', 'Inventory',
				'Layouts', 'Codex', 'Alerts', 'SandStats', 'GlassStats', 'NinjaStats', 'OtherStats', 'QuickLayout',
				'Faves', 'StuffCounts', 'IncomeCounts','LootSearch','LootNavigation',
				'DragonStats','DragonsNP','DragonOverview'];
		Molpy.sizableOrder = ['View', 'File', 'Links', 'Options', 'Stats', 'Log', 'Export', 'SandTools', 'CastleTools',
				'Shop', 'Inventory', 'Layouts', 'Codex', 'Alerts', 'SandStats', 'GlassStats', 'NinjaStats',
				'OtherStats', 'QuickLayout', 'Faves', 'StuffCounts', 'IncomeCounts','LootSearch','LootNavigation',
				'DragonStats','DragonsNP','DragonOverview'];
		Molpy.borderColorOrder = ['Clock', 'Timer', 'View', 'File', 'Links', 'Beach', 'Shop', 'Inventory', 'SandTools',
				'CastleTools', 'Options', 'Stats', 'Log', 'Export', 'About', 'SandCounts', 'NPInfo', 'Layouts',
				'Codex', 'Alerts', 'SandStats', 'GlassStats', 'NinjaStats', 'OtherStats', 'QuickLayout', 'TFCounts',
				'Faves', 'StuffCounts', 'IncomeCounts','LootSearch','LootNavigation',
				'DragonStats','DragonsNP','DragonOverview'];
		$('#sectionInventoryBody').resize(Molpy.FixPaneWidths);
		$('#sectionLayoutsBody').resize(Molpy.FixPaneWidths);
		Molpy.activeLayout = new Molpy.Layout({
			name: 'default',
			lootVis: {
				boosts: 1,
				badges: 1,
			}
		});
		Molpy.activeLayout.FromString(Molpy.defaultLayoutData);
		if(!noLayout) Molpy.MakeFavePanes();
		Molpy.activeLayout.ToScreen();

		Molpy.layouts = [];
		Molpy.layouts.push(Molpy.activeLayout);
		if(!noLayout) {
			Molpy.layouts.push(new Molpy.Layout({}));
			Molpy.layouts[1].FromString(Molpy.defaultLayoutData2);
			Molpy.LoadLayouts();
			$('.resizable-element').resizable({cancel: '.editlock'});
			$('.draggable-element').draggable({cancel: '.editlock', scroll: true, grid: [10, 10], snap: true}).canColorBorder();
			Molpy.LockLayoutToggle();
		} else {
			Molpy.layoutLocked = true;
		}

		new Molpy.Puzzle('redacted', function() {
			Molpy.Redacted.drawType[Molpy.Redacted.drawType.length - 1] = 'show';
			Molpy.Redacted.onClick(Molpy.Redacted.drawType.length - 1,1);
		});
		
		Molpy.allNeedRepaint = 1;
	}
	
	Molpy.newObjectDiv = function(type, object, flags) {
		var headingHTML = '';
		var purchaseHTML = '';
		var ownedHTML = '';
		var priceHTML = '';
		var productionHTML = '';
		
		var heading = object.getHeading();
		if (heading == 'prize LMath.floor(Math.PI)') {
			heading = 'prize L&lfloor;&pi;&rfloor;';
		}
		if (heading =='prize LMath.ceil(Math.PI)') {
			heading = 'prize L&lceil;&pi;&rceil;';
		}
		if(heading != '') headingHTML = '	<H1 class="groupTitle">[' + heading + ']</H1>';
		
		var buysell = object.getBuySell();
		if(buysell != '') {
			purchaseHTML = '	<div class="purchase ">' + buysell + '</div>';
			var price = object.getPrice();		
			if(price != '') {
				priceHTML = '	<div class="price ">'
				          + Molpy.createPriceHTML(price)
				          + '	</div>';
			}
		}
		
		var owned = object.getOwned();
		if(owned != '') ownedHTML = '<div class="owned">Owned: ' + owned + '</div>';
		
		var production = object.getProduction();
		if(production != '') productionHTML = '	<div class="production">' + production + '</div>';
		
		var divHTML = '<div class="objDiv ' + object.getFullClass() + '">'
			        + '	<div class="icon ' + type + '_' + (object.icon ? object.icon : 'generic') + '" />'
			        + headingHTML
			        + '	<H2 class="objName">' + object.getFormattedName() + '</H2>'
			        + purchaseHTML
			        + ownedHTML
			        + priceHTML
			        + productionHTML
			        + '	<div class="description"><br />' + object.getDesc() + '</div>'
			        + '</div>';
		
		var div = $(divHTML);
		if(flags.hover) {
			var oid = '' + object.name + object.id;
			if(object.earned && object.np) {
				div.mouseover({overID: oid, np: object.np, alias: object.alias}, Molpy.monumentOver).mouseout({overID: oid, np: object.np, alias: object.alias}, Molpy.monumentOut);
			} else {
				div.mouseover({overID: oid}, Molpy.onMouseOver).mouseout({overID: oid}, Molpy.onMouseOut);
			}
			if(!Molpy.Boosts['Expando'].IsEnabled && !flags.nohide) {
				div.find('.description').hide();
			}
		}
		return div;
	}
	
	Molpy.createPriceHTML = function(price) {
		var innerHTML = 'Price:';
		for(var p in price) {
			var pNum = price[p];
			//change all number representations into a number (40,000 40k 4e4)
			pNum = isNaN(pNum) ? DeMolpify(pNum) : pNum;
//			if (!Molpy.Boosts[p]) {
//				Molpy.Notify('EEEP '+p,1)
//			} else {
				innerHTML += '<br>&nbsp;&nbsp;- ' + Molpify(pNum, 2) + ' ' + Molpy.Boosts[p].plural;
//			}
		}
		return innerHTML;
	}
	
	Molpy.defineWindowSizes = function() {
		if(noLayout) return;
		$("#sectionStuffCountsBody").resizable({
			 minHeight: 42,
			 minWidth: 150
			 });
		$("#sectionIncomeCountsBody").resizable({
			 minHeight: 42,
			 minWidth: 150
			 });
		 $("#sectionDragonOverviewBody").resizable({
			 minHeight: 120,
			 minWidth: 520
			 });
	}
}
