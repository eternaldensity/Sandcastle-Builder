Molpy.DefinePersist = function() {
	Molpy.CuegishToBeanish = function(mustard) {
		try {
			return AllYourBase.SetUpUsTheBomb(escape(encodeURIComponent(mustard)));
		} catch(err) {
			return '';
		}
	}
	Molpy.BeanishToCuegish = function(mustard) {
		try {
			return decodeURIComponent(unescape(AllYourBase.BelongToUs(mustard)));
		} catch(err) {
			return '';
		}
	}

	Molpy.ToOct = function(l) {
		return l[0] | l[1] << 1 | l[2] << 2 | l[3] << 3;
	}
	Molpy.FromOct = function(o) {
		return [o & 1 && 1, o & 2 && 1, o & 4 && 1, o & 8 && 1];
	}

	function supports_html5_storage() {
		try {
			return 'localStorage' in window && window['localStorage'] != null;
		} catch(e) {
			return false;
		}
	}
	Molpy.supportsLocalStorage = supports_html5_storage();
	Molpy.LocalSaveExists = function() {
		return localStorage['version'];
	}

	Molpy.Save = function(auto) {
		if(!auto) {
			Molpy.saveCount++;
			_gaq && _gaq.push(['_trackEvent', 'Save', 'Begin']);
			if(Molpy.saveCount >= 5) {
				Molpy.UnlockBoost('Autosave Option');
				Molpy.EarnBadge('This Should be Automatic');
			}
		} else {
			if(!Molpy.Got('Autosave Option')) return;
		}
		var success = 0;
		if(Molpy.supportsLocalStorage) {
			success = Molpy.SaveLocalStorage();
			if(!Molpy.LocalSaveExists()) {
				Molpy.Notify('localstorage save failed, trying cookies instead');
				success = Molpy.SaveC_STARSTAR_kie();
			}
		} else {
			success = Molpy.SaveC_STARSTAR_kie();
		}
		if(!success) return;
		Molpy.Notify('Game saved');
		auto || _gaq && _gaq.push(['_trackEvent', 'Save', 'Complete', '' + Molpy.saveCount]);

		Molpy.autosaveCountup = 0;

		if(Molpy.options.autosavelayouts > (auto || 0)) {
			Molpy.SaveLayouts();
		}
	}

	Molpy.SaveC_STARSTAR_kie = function() {
		var threads = Molpy.ToNeedlePulledThing();
		for( var i in threads) {
			var thread = Molpy.CuegishToBeanish(threads[i]);
			var dough = 'CastleBuilderGame' + i + '=' + escape(thread) + '; expires=' + Molpy.Flood() + ';'
			document.cookie = dough;//aaand save

			if(document.cookie.indexOf('CastleBuilderGame') < 0) {
				Molpy.Notify('Error while saving.<br>Export your save instead!', 1);
				return;
			}
		}
		document.cookie = 'CastleBuilderGame=;'; //clear old cookie
		return 1;
	}

	Molpy.SaveLocalStorage = function() {
		localStorage['version'] = Molpy.version;
		localStorage['startDate'] = Molpy.startDate;
		localStorage['Options'] = Molpy.OptionsToString();
		localStorage['Gamenums'] = Molpy.GamenumsToString();
		localStorage['SandTools'] = Molpy.SandToolsToString();
		localStorage['CastleTools'] = Molpy.CastleToolsToString();
		localStorage['Boosts'] = Molpy.BoostsToString();
		localStorage['Badges'] = Molpy.BadgesToString();
		localStorage['OtherBadges'] = Molpy.OtherBadgesToString();
		return 1;
	}

	Molpy.Flood = function() {
		var flood = new Date();
		flood.setFullYear(13291);
		flood.setMonth(4);
		flood.setDate(10);
		return flood.toUTCString();
	}

	Molpy.Load = function() {
		_gaq && _gaq.push(['_trackEvent', 'Load', 'Begin']);

		var success;
		if(Molpy.supportsLocalStorage && Molpy.LocalSaveExists()) {
			success = Molpy.LoadLocalStorage();
		} else {
			success = Molpy.LoadC_STARSTAR_kie();
		}

		if(!success) return;
		Molpy.loadCount++;
		_gaq && _gaq.push(['_trackEvent', 'Load', 'Complete', '' + Molpy.loadCount]);
		Molpy.autosaveCountup = 0;
		if(g('game')) {
			Molpy.Notify('Game loaded', 1);
			if(Molpy.loadCount >= 40) {
				Molpy.UnlockBoost('Coma Molpy Style');
			}
		}
		if(noLayout) Molpy.LoadLayouts(); //this seems odd, but the layout is loaded in this case so the loot visibility is set, as in classic
	}

	Molpy.LoadC_STARSTAR_kie = function() {

		var thread = '';
		if(document.cookie.indexOf('CastleBuilderGame') >= 0) {
			var k = ['', 0, 1, 2, 3, 4];
			for(i in k) {
				var dough = document.cookie.split('CastleBuilderGame' + k[i] + '=')[1];
				if(dough) thread += Molpy.BeanishToCuegish(unescape(dough).split(';')[0]) || '';
			}
			Molpy.FromNeedlePulledThing(thread);
		} else {
			Molpy.Notify && Molpy.Notify('No saved cookies were found');
			return 0;
		}
		return 1;
	}

	Molpy.LoadLocalStorage = function() {
		Molpy.needlePulling = 1; //prevent earning badges that haven't been loaded
		var version = parseFloat(localStorage['version']);
		Molpy.PreLoadTasks(version);
		if(!Molpy.ValidateVersion(version)) return;

		Molpy.startDate = localStorage['startDate'];

		Molpy.OptionsFromString(localStorage['Options']);
		if(!g('game')) {
			Molpy.AdjustFade();
			Molpy.UpdateColourScheme();
			return;
		}
		Molpy.GamenumsFromString(localStorage['Gamenums'], version);
		Molpy.ClearLog();
		Molpy.SandToolsFromString(localStorage['SandTools']);
		Molpy.CastleToolsFromString(localStorage['CastleTools'], version);
		Molpy.BoostsFromString(localStorage['Boosts'], version);
		Molpy.BadgesFromString(localStorage['Badges'], version);
		Molpy.OtherBadgesFromString(localStorage['OtherBadges'], version);
		return Molpy.PostLoadTasks(version);
	}

	Molpy.layoutsLoaded = 0;
	Molpy.SaveLayouts = function() {
		Molpy.MakeTempLayout();
		for( var i in Molpy.layouts) {
			var thread = Molpy.layouts[i].toString();
			if(Molpy.supportsLocalStorage) {
				localStorage['Layout' + i] = escape(thread);
				if(Molpy.activeLayout === Molpy.layouts[i]) {
					localStorage['activeLayoutID'] = '' + i;
				}
			} else {
				thread = Molpy.CuegishToBeanish(thread);
				var dough = 'SBLayout' + i + '=' + escape(thread) + '; expires=' + Molpy.Flood() + ';'
				document.cookie = dough;
				if(+i) break;
			}
		}
		i++;
		if(!noLayout) {
			Molpy.Notify('Saved ' + i + ' layout' + plural(i));
			if(i < Molpy.layouts.length) {
				Molpy.Notify(' Did not save ' + (Molpy.layouts.length - i) + ' layout' + plural(Molpy.layouts.length - i)
					+ ' to save on cookie space until that\'s fixed. You can export them manually.', 1);
			}
		}
		while(Molpy.layoutsLoaded > i)//delete any extra if there are less than previously saved
		{
			if(Molpy.supportsLocalStorage) {
				localStorage.removeItem('Layout' + i);
			} else {
				document.cookie = 'SBLayout' + i + '=;';
			}
			i++;
		}
	}
	Molpy.MakeTempLayout = function() {
		if(noLayout) return;
		var lastLayout = Molpy.layouts[Molpy.layouts.length - 1];
		if(lastLayout.name != 'temporary')
			Molpy.layouts.push(new Molpy.Layout({name: 'temporary'}));
		var tempLayout = Molpy.layouts[Molpy.layouts.length - 1];
		tempLayout.FromScreen();
		Molpy.layoutRepaint = 1;
	}
	Molpy.LoadLayouts = function() {
		var layouts = [];
		for( var i = 0; i < 100; i++) {
			var dough = thread = '';
			if(Molpy.supportsLocalStorage) {
				dough = localStorage['Layout' + i];
				if(dough) thread = unescape(dough);
			}
			if(!Molpy.supportsLocalStorage || !thread) {
				var cName = 'SBLayout' + i + '=';
				dough = document.cookie.split(cName)[1];
				if(dough) thread = Molpy.BeanishToCuegish(unescape(dough).split(';')[0]);
			}
			if(!thread) break;
			var loadedLayout = new Molpy.Layout({});
			loadedLayout.FromString(thread);
			layouts.push(loadedLayout);
		}
		if(i) {
			Molpy.layoutsLoaded = i;
			Molpy.layouts = layouts;
			var active = 0;
			if(noLayout) {
				Molpy.layouts[active].boxVis = {
					Clock: true,
					Timer: true,
					Beach: true,
					Shop: true,
					Inventory: true,
					SandTools: true,
					CastleTools: true,
					About: true,
					SandCounts: true,
					NPInfo: true
				};
			} else {
				Molpy.layouts[active].boxVis.View = true;
				if(Molpy.supportsLocalStorage) {
					active = parseInt(localStorage['activeLayoutID']) || 0;
					if(active < 0 || active >= Molpy.layouts.length) active = 0;
				}
			}
			Molpy.layouts[active].Activate();
		}
	}

	Molpy.Import = function() {
		var thread = prompt(
				'Please paste in the text that was given to you on save export.\nWarning: this will automatically save so you may want to back up your current save first.',
				'');
		if(thread == 'pants') {
			Molpy.InMyPants = !Molpy.InMyPants;
			return;
		}
		if(thread == 'typo') {
			Molpy.Setoption('typo',1 * !Molpy.options.typo);
			return;
		}
		if(thread == 'F5') {
			Molpy.ClickBeach(0, 1);
			Molpy.EarnBadge('Use Your Leopard');
			return;
		}
		if(thread == 'scrumptious donuts') {
			Molpy.scrumptiousDonuts = 1;
			return;
		}
		if(thread == 'Molpy') {
			Molpy.Notify(Molpy.BeanishToCuegish(Molpy.BlitzGirl.ChallengeAccepted), 1);
			return;
		}
		if(thread == 'OK, GLASS' && Molpy.Got('Glass Trolling')) {
			Molpy.Boosts['Glass Trolling'].IsEnabled = 1;
			return;
		}

		if(thread && thread != '') {
			_gaq && _gaq.push(['_trackEvent', 'Import', 'Begin']);
			Molpy.FromNeedlePulledThing(Molpy.BeanishToCuegish(thread));
			_gaq && _gaq.push(['_trackEvent', 'Import', 'Complete']);
			Molpy.Save();
		}
	}

	Molpy.GamenumsToString = function() {
		var s = 'S'; //Semicolon
		var str = '' + (Molpy.newpixNumber) + s
		          + (Molpy.beachClicks) + s
		          + (Molpy.ninjaFreeCount) + s
		          + (Molpy.ninjaStealth) + s
		          + (Molpy.ninjad) + s
		          + (Molpy.saveCount) + s
		          + (Molpy.loadCount) + s
		          + (Molpy.notifsReceived) + s
		          + (Molpy.npbONG) + s
		          + (Molpy.Redacted.countup) + s
		          + (Molpy.Redacted.toggle) + s
		          + (Molpy.Redacted.location) + s
		          + (Molpy.Redacted.totalClicks) + s
		          + (Molpy.highestNPvisited) + s
		          + (Molpy.Redacted.chainCurrent) + s
		          + (Molpy.Redacted.chainMax) + s;
		return str;
	}

	Molpy.SandToolsToString = function() {
		var s = 'S'; //Semicolon
		var c = 'C'; //Comma
		var str = '';
		for( var cancerbabies in Molpy.SandTools) {
			var cb = Molpy.SandTools[cancerbabies];
			str += cb.amount + c + cb.bought + c + cb.totalSand + c + cb.temp + c + cb.totalGlass + s;
		}
		return str;
	}

	Molpy.CastleToolsToString = function() {
		var s = 'S'; //Semicolon
		var c = 'C'; //Comma
		var str = '';
		for( var cancerbabies in Molpy.CastleTools) {
			var cb = Molpy.CastleTools[cancerbabies];
			str += cb.amount + c + cb.bought + c + cb.totalCastlesBuilt + c + cb.totalCastlesDestroyed + c
				+ cb.totalCastlesWasted + c + cb.currentActive + c + cb.temp + c + cb.totalGlassBuilt + c
				+ cb.totalGlassDestroyed + s;
		}
		return str;
	}

	Molpy.BoostsToString = function() {
		var s = 'S'; //Semicolon
		var c = 'C'; //Comma
		var str = '';
		for( var which in Molpy.Boosts) {
			var boost = Molpy.Boosts[which];
			var saveData = boost.saveData
			var fencePost = '';
			for(var num in saveData){
				str += fencePost + boost[saveData[num][0]];
				fencePost = c;
			}
			str += s;
		}
		return str;
	}

	Molpy.BadgesToString = function() {
		var s = 'S'; //Semicolon
		var c = 'C'; //Comma
		var str = '';
		for( var which in Molpy.Badges) {
			var badge = Molpy.Badges[which];
			if(badge.group == 'badges') str += badge.earned;
		}
		return str;
	}

	Molpy.OtherBadgesToString = function() {
		var s = 'S'; //Semicolon
		var c = 'C'; //Comma
		var str = '';
		//stuff pretending to be badges:			
		var id = Molpy.Badges['discov1'].id;
		while(id + 3 < Molpy.BadgeN) {
			str += Molpy.ToOct([Molpy.BadgesById[id].earned, Molpy.BadgesById[id + 1].earned, Molpy.BadgesById[id + 2].earned, Molpy.BadgesById[id + 3].earned]).toString(16);
			id += 4;
		}
		return str;
	}

	/* In which I do save and load!
	+++++++++++++++++++++++++++++++*/
	Molpy.ToNeedlePulledThing = function(exporting) {
		var p = 'P';
		var thread = '';
		var threads = [];
		thread += Molpy.version + p + p;//some extra space!
		thread += Molpy.startDate + p;

		thread += Molpy.OptionsToString() + p;

		thread += Molpy.GamenumsToString() + p;

		thread += Molpy.SandToolsToString() + p;
		thread += Molpy.CastleToolsToString() + p;
		threads.push(thread);

		thread = '';
		thread += Molpy.BoostsToString() + p;
		threads.push(thread);

		thread = '';
		thread += Molpy.BadgesToString() + p;
		thread += p;//used to be showhide
		threads.push(thread);

		thread = '';
		thread += Molpy.OtherBadgesToString() + p;

		threads.push(thread);
		return threads;
	}

	Molpy.GamenumsFromString = function(thread, version) {
		var s = 'S'; //Semicolon
		var c = 'C'; //Comma
		var pixels = thread.split(s);

		if(version < 3.3332) { 
			Molpy.newpixNumber = parseInt(pixels[0]) || 0;
			Molpy.Boosts['Sand'].totalDug = parseFloat(pixels[1]) || 0;
			Molpy.Boosts['Sand'].manualDug = parseFloat(pixels[2]) || 0;
			Molpy.Boosts['Sand'].power = parseFloat(pixels[3]) || 0;
			Molpy.Boosts['Castles'].totalBuilt = parseFloat(pixels[4]) || 0;
			Molpy.Boosts['Castles'].power = parseFloat(pixels[5]) || 0;
			Molpy.Boosts['Castles'].totalDestroyed = parseFloat(pixels[6]) || 0;
			Molpy.Boosts['Castles'].prevCastleSand = parseFloat(pixels[7]) || 0;
			Molpy.Boosts['Castles'].nextCastleSand = parseFloat(pixels[8]) || 0;
			Molpy.Boosts['Castles'].spent = parseFloat(pixels[9]) || 0;
			Molpy.Boosts['Sand'].spent = parseFloat(pixels[10]) || 0;
			Molpy.beachClicks = parseInt(pixels[11]) || 0;
			Molpy.ninjaFreeCount = parseInt(pixels[12]) || 0;
			Molpy.ninjaStealth = parseInt(pixels[13]) || 0;
			Molpy.ninjad = parseInt(pixels[14]) ? 1 : 0;
			Molpy.saveCount = parseInt(pixels[15]) || 0;
			Molpy.loadCount = parseInt(pixels[16]) || 0;
			Molpy.notifsReceived = parseInt(pixels[17]) || 0;
			Molpy.Boosts['Time Travel'].travelCount = parseInt(pixels[18]) || 0;
			Molpy.npbONG = parseInt(pixels[19]) || 0;
	
			Molpy.Redacted.countup = parseInt(pixels[20]) || 0;
			Molpy.Redacted.toggle = parseInt(pixels[21]) || 0;
			Molpy.Redacted.location = parseInt(pixels[22]) || 0;
			Molpy.Boosts['GlassBlocks'].luckyGlass = parseFloat(pixels[23]) || 0;
			Molpy.Redacted.totalClicks = parseInt(pixels[24]) || 0;
			Molpy.highestNPvisited = parseInt(pixels[25]) || Math.abs(Molpy.newpixNumber);
			Molpy.Boosts['Castles'].totalDown = parseFloat(pixels[26]) || 0;
			if(version < 2.1) Molpy.tempIntruderBots = parseFloat(pixels[27]) || 0;
	
			Molpy.Boosts['TF'].totalLoaded = parseFloat(pixels[27]) || 0;
			Molpy.Boosts['TF'].totalDestroyed = parseFloat(pixels[28]) || 0;
			Molpy.Boosts['TF'].manualLoaded = parseFloat(pixels[29]) || 0;
			Molpy.Redacted.chainCurrent = parseFloat(pixels[30]) || 0;
			Molpy.Redacted.chainMax = parseFloat(pixels[31]) || 0;
		} else {
			Molpy.newpixNumber = parseInt(pixels[0]) || 0;
			Molpy.beachClicks = parseInt(pixels[1]) || 0;
			Molpy.ninjaFreeCount = parseInt(pixels[2]) || 0;
			Molpy.ninjaStealth = parseInt(pixels[3]) || 0;
			Molpy.ninjad = parseInt(pixels[4]) ? 1 : 0;
			Molpy.saveCount = parseInt(pixels[5]) || 0;
			Molpy.loadCount = parseInt(pixels[6]) || 0;
			Molpy.notifsReceived = parseInt(pixels[7]) || 0;
			Molpy.npbONG = parseInt(pixels[8]) || 0;
			Molpy.Redacted.countup = parseInt(pixels[9]) || 0;
			Molpy.Redacted.toggle = parseInt(pixels[10]) || 0;
			Molpy.Redacted.location = parseInt(pixels[11]) || 0;
			Molpy.Redacted.totalClicks = parseInt(pixels[12]) || 0;
			Molpy.highestNPvisited = parseInt(pixels[13]) || Math.abs(Molpy.newpixNumber);
			Molpy.Redacted.chainCurrent = parseFloat(pixels[14]) || 0;
			Molpy.Redacted.chainMax = parseFloat(pixels[15]) || 0;
		}
	};

	Molpy.SandToolsFromString = function(thread) {
		var s = 'S'; //Semicolon
		var c = 'C'; //Comma
		var pixels = thread.split(s);
		Molpy.SandToolsOwned = 0;
		for( var i in Molpy.SandToolsById) {
			var me = Molpy.SandToolsById[i];
			if(pixels[i]) {
				var ice = pixels[i].split(c);
				me.amount = Math.max(0, parseFloat(ice[0]));
				me.bought = Math.max(0, parseFloat(ice[1]) || 0);
				me.totalSand = parseFloat(ice[2]) || 0;
				me.temp = parseFloat(ice[3]) || 0;
				me.totalGlass = parseFloat(ice[4]) || 0;
				Molpy.SandToolsOwned += me.amount;
				me.Refresh();
			} else {
				me.amount = 0;
				me.bought = 0;
				me.totalSand = 0;
				me.totalGlass = 0;
			}
		}
	}

	Molpy.CastleToolsFromString = function(thread, version) {
		var s = 'S'; //Semicolon
		var c = 'C'; //Comma
		var pixels = thread.split(s);
		Molpy.CastleToolsOwned = 0;
		for( var i in Molpy.CastleToolsById) {
			var me = Molpy.CastleToolsById[i];
			if(pixels[i]) {
				var ice = pixels[i].split(c);
				me.amount = Math.max(0, parseFloat(ice[0]));
				me.bought = Math.max(0, parseFloat(ice[1]) || 0);
				me.totalCastlesBuilt = parseFloat(ice[2]) || 0;
				me.totalCastlesDestroyed = parseFloat(ice[3]) || 0;
				if(version < 3.03) {
					Molpy.Boosts['Castles'].totalDestroyed += me.totalCastlesDestroyed;
				}
				me.totalCastlesWasted = parseFloat(ice[4]) || 0;
				me.currentActive = parseFloat(ice[5]) || 0;
				me.temp = parseFloat(ice[6]) || 0;
				me.totalGlassBuilt = parseFloat(ice[7]) || 0;
				me.totalGlassDestroyed = parseFloat(ice[8]) || 0;
				Molpy.CastleToolsOwned += me.amount;
				me.Refresh();
			} else {
				me.amount = 0;
				me.bought = 0;
				me.totalCastlesBuilt = 0;
				me.totalCastlesDestroyed = 0;
				me.totalCastlesWasted = 0;
				me.currentActive = 0;
				me.totalGlassBuilt = 0;
				me.totalGlassDestroyed = 0;
			}

		}
	}

	Molpy.BoostsFromString = function(thread, version) {
		var s = 'S'; //Semicolon
		var c = 'C'; //Comma
		var pixels = thread.split(s);
		Molpy.BoostsOwned = 0;
		Molpy.unlockedGroups = {};
		
		for( var idNum in Molpy.BoostsById) {
			var me = Molpy.BoostsById[idNum];
			var saveData = me.saveData;
			
			// If save data exists for that boost, load it
			if(pixels[idNum]) {
				var savedValueList = pixels[idNum].split(c);
				for(var num in saveData){
					
					if(version < 3.3332) {
						// Only load old stored values of unlocked, bought, power, and countdown to prevent
						// values loaded in GamenumsFromString from being overwritten with default values
						if(num >= 4) break;
						// Sand.power and Castles.power are stored in gamenums in old versions, too
						if(num == 2 && (me == Molpy.Boosts['Sand'] || me == Molpy.Boosts['Castle'])) continue;
					}
					
					var loadedValue = null; // Just to avoid editor warnings of 'var may not be defined'
					
					// Load differently based on data type
					if(saveData[num][2] == 'int')
						loadedValue = parseInt(savedValueList[num]) || saveData[num][1];
					else if(saveData[num][2] == 'float')
						loadedValue = parseFloat(savedValueList[num]) || saveData[num][1];
					//else if(saveData[num][2] == 'array')
						// Not sure how to handle this yet
					else
						loadedValue = savedValueList[num] || saveData[num][1];
					me[saveData[num][0]] = loadedValue;
				}
				
				// Make sure locked boosts didn't bug out and save a bought amount
				if(!me.unlocked) me.bought = 0;
				
				if(me.bought) {
					Molpy.BoostsOwned++;
					Molpy.unlockedGroups[me.group] = 1;
				}
				
				// If it has a countdown, then it was only a temporary boost
				if(me.countdown) {
					Molpy.GiveTempBoost(me.name, me.power, me.countdown);
				}
				
				// It would be nice if these could be changed or moved, they are not very dynamic
				if(isNaN(me.power)) me.power = 0; //compression! :P
				if(isNaN(me.countdown)) me.countdown = 0;
				
			// If no data was saved for the boost, set them to defaults
			} else {
				me.resetSaveData();
			}			
		}
	}

	Molpy.BadgesFromString = function(thread, version) {
		var s = 'S'; //Semicolon
		var c = 'C'; //Comma
		if(version < 2.3)
			var pixels = thread.split(s);
		else
			var pixels = thread.split('');
		Molpy.BadgesOwned = 0;
		Molpy.groupBadgeCounts = {};
		for( var i in Molpy.BadgesById) {
			var me = Molpy.BadgesById[i];
			if(me.group == 'badges') if(pixels[i]) {
				me.earned = parseInt(pixels[i]) && 1 || 0;
				if(me.earned) {
					Molpy.BadgesOwned++;
					Molpy.unlockedGroups[me.group] = 1;
					if(!Molpy.groupBadgeCounts[me.group]) {
						Molpy.groupBadgeCounts[me.group] = 1;
					} else {
						Molpy.groupBadgeCounts[me.group]++;
					}
				}
			} else {
				me.earned = 0;
			}
		}
	}

	Molpy.OtherBadgesFromString = function(thread, version) {
		var s = 'S'; //Semicolon
		var c = 'C'; //Comma
		var j = 0;
		if(version < 2.3)
			var pixels = thread.split(s);
		else
			var pixels = thread.split('');

		if(version < 2.98) {
			var cam = version >= 2 || Molpy.Got('Camera');
			var i = 0;
			var offset = 0;
			while(i + offset < Molpy.BadgeN) {
				var me = Molpy.BadgesById[i + offset];
				if(j || me.group != 'badges') {
					if(!j) j = i;
					if(cam && pixels[i - j]) {
						me.earned = parseInt(pixels[i - j]) && 1 || 0;
						if(me.earned) {
							Molpy.BadgesOwned++;
							Molpy.unlockedGroups[me.group] = 1;
							if(!Molpy.groupBadgeCounts[me.group]) {
								Molpy.groupBadgeCounts[me.group] = 1;
							} else {
								Molpy.groupBadgeCounts[me.group]++;
							}
						}
					} else {
						me.earned = 0;
					}
				}
				i++;
				if(j) offset = Math.floor((i - j) / 3);
			}
		} else {
			var id = Molpy.Badges['discov1'].id;
			for( var i in pixels) {
				var enhance = Molpy.FromOct(parseInt(pixels[i] || 0, 16));
				for( var j in enhance) {
					var me = Molpy.BadgesById[id + +j];
					me.earned = enhance[j] || 0;
					if(me.earned) {
						Molpy.BadgesOwned++;
						Molpy.unlockedGroups[me.group] = 1;
						if(!Molpy.groupBadgeCounts[me.group]) {
							Molpy.groupBadgeCounts[me.group] = 1;
						} else {
							Molpy.groupBadgeCounts[me.group]++;
						}
					}
				}
				id += 4;
				if(version < 3.1892) id += 4;
			}
			while(id < Molpy.BadgeN) {
				Molpy.BadgesById[id].earned = 0;
				id++;
			}
		}
	}

	Molpy.ValidateVersion = function(version) {
		_gaq && _gaq.push(['_trackEvent', 'Load', 'Version', '' + version, true]);
		if(version > Molpy.version) {
			alert('Error : you are a time traveller attempting to load a save from v' + version + ' with v' + Molpy.version + '.');
			return 0;
		}
		if(!g('pureidle')) g('title').innerHTML = GLRschoice(Molpy.titles);
		return 1;
	}

	Molpy.needlePulling = 0;
	Molpy.FromNeedlePulledThing = function(thread) {
		Molpy.needlePulling = 1; //prevent earning badges that haven't been loaded
		var p = 'P'; //Pipe seParator
		var s = 'S'; //Semicolon
		if(!thread) return;

		thread = thread.split(p);
		var version = parseFloat(thread[0]);
		Molpy.PreLoadTasks(version);
		_gaq && _gaq.push(['_trackEvent', 'Load', 'Version', '' + version, true]);
		if(!Molpy.ValidateVersion(version)) return;

		Molpy.startDate = parseInt(thread[2]);

		//whoops used to have ';' here which wasn't splitting!
		Molpy.OptionsFromString(thread[3]);
		if(!g('game')) {
			Molpy.AdjustFade();
			Molpy.UpdateColourScheme();
			return;
		}
		Molpy.ClearLog();

		Molpy.GamenumsFromString(thread[4], version);
		Molpy.SandToolsFromString(thread[5]);
		Molpy.CastleToolsFromString(thread[6], version);
		Molpy.BoostsFromString(thread[7] || '', version);

		Molpy.BadgesFromString(thread[8] || '', version);
		//thread[9] is unused
		Molpy.OtherBadgesFromString(thread[10] || '', version);
		return Molpy.PostLoadTasks(version);
	}
	Molpy.PreLoadTasks = function(version) {
		if(version < Molpy.version) //hey let's do this every upgrade!
		{
			Molpy.forcedReload = true;
		}
	}
	Molpy.PostLoadTasks = function(version) {
		Molpy.needlePulling = 0;//badges are loaded now
		Molpy.UpgradeOldVersions(version);
		if(version < Molpy.version) //hey let's do this every upgrade!
		{
			Molpy.Notify('Upgraded to new version!', 1);
			if(Molpy.Boosts['Safety Hat'].unlocked && Molpy.Got('Safety Pumpkin') && !Molpy.Boosts['SG'].unlocked)
				Molpy.UnlockBoost('SG');
			else if(!Molpy.Got('SG')) Molpy.UnlockBoost('Safety Hat');
		}
		for( var i in Molpy.Boosts) {
			var me = Molpy.Boosts[i];
			if(me.loadFunction) me.loadFunction();
		}

		Molpy.UpdateColourScheme();
		Molpy.AdjustFade();
		if(Molpy.Redacted.location) {
			Molpy.Redacted.countup = Molpy.Redacted.toggle;
			Molpy.Redacted.checkToggle();
		}

		Molpy.CheckBuyUnlocks(); //in case any new achievements have already been earned
		Molpy.CheckSandRateBadges(); //shiny!

		Molpy.ONGstart = ONGsnip(new Date()); //if you missed the ONG before loading, too bad!
		g('clockface').className = Molpy.Boosts['Coma Molpy Style'].power ? 'hidden' : 'unhidden';
		Molpy.HandlePeriods();
		Molpy.UpdateBeach();
		Molpy.recalculateDig = 1;
		Molpy.shopRepaint = 1;
		Molpy.boostRepaint = 1;
		Molpy.badgeRepaint = 1;
		Molpy.judgeLevel = -1;
		Molpy.CalculateDigSpeed();
		Molpy.currentSubFrame = 0;
		Molpy.UpdateFaves(1);
		return 1;
	}

	Molpy.UpgradeOldVersions = function(version) {
		if(version < 2.1) {
			Molpy.CastleTools['NewPixBot'].temp = Molpy.tempIntruderBots;
			if(!isFinite(Molpy.castlesDown)) {
				Molpy.castlesDown = DeMolpify('1WTF'); //:P
			}
		}
		if(version < 2.32) {
			var tt = Molpy.Boosts['Time Travel'];
			if(tt.bought && tt.power != 1) {
				tt.power = 1;
				Molpy.Notify(Molpy.BeanishToCuegish(Molpy.BlitzGirl.Apology), 1);
			}
		}
		if(version < 2.8) {
			if(Molpy.Got('Glass Ceiling 10')) {
				Molpy.LockBoost('Glass Ceiling 10');
				Molpy.UnlockBoost('Glass Ceiling 10');
			}
			if(Molpy.Got('Glass Ceiling 11')) {
				Molpy.LockBoost('Glass Ceiling 11');
				Molpy.UnlockBoost('Glass Ceiling 11');
			}
		}
		if(version < 2.85) {
			if(Molpy.Boosts['Bacon'].unlocked) {
				if(Molpy.Boosts['Logicat'].bought > 100) {
					Molpy.Boosts['Logicat'].bought -= 100;
					Molpy.Boosts['Logicat'].power -= 400;
				} else {
					Molpy.Boosts['Logicat'].power += 100;
					Molpy.LockBoost('Bacon');
					Molpy.Notify('That should not have unlocked quite yet. A higher Logicat Level is needed.');
				}
			}
		}
		if(version < 2.891) {
			if(Molpy.Got('Safety Hat')) {
				Molpy.Boosts['Safety Hat'].bought = 0;
				Molpy.Boosts['Safety Hat'].unlocked = 0;
				Molpy.BoostsOwned--;
			}
			if(Molpy.Got('Backing Out') && Molpy.Boosts['Logicat'].bought < 120) {
				Molpy.Boosts['Backing Out'].bought = 0;
				Molpy.Boosts['Backing Out'].unlocked = 0;
				Molpy.BoostsOwned--;
			}
		}
		if(version < 2.895) {
			if(Molpy.CastleTools['Trebuchet'].amount < 4000) {
				if(Molpy.Got('Stained Glass Launcher')) {
					Molpy.Boosts['Stained Glass Launcher'].bought = 0;
					Molpy.Boosts['Stained Glass Launcher'].unlocked = 0;
					Molpy.BoostsOwned--;
					Molpy.Add('GlassBlocks', 1200000); //assume all discounts were used :P
				} else
					Molpy.Boosts['Stained Glass Launcher'].unlocked = 0;

			}
			if(Molpy.SandTools['Ladder'].amount < 15000) {
				if(Molpy.Got('Crystal Peak')) {
					Molpy.Boosts['Crystal Peak'].bought = 0;
					Molpy.Boosts['Crystal Peak'].unlocked = 0;
					Molpy.BoostsOwned--;
					Molpy.Add('GlassBlocks', 720000);
				} else
					Molpy.Boosts['Crystal Peak'].unlocked = 0;
			}
			if(Molpy.SandTools['Bag'].amount < 12000) {
				if(Molpy.Got('Cupholder')) {
					Molpy.Boosts['Cupholder'].bought = 0;
					Molpy.Boosts['Cupholder'].unlocked = 0;
					Molpy.BoostsOwned--;
					Molpy.Add('GlassBlocks', 880000);
				} else
					Molpy.Boosts['Cupholder'].unlocked = 0;
			}
			if(Molpy.SandTools['LaPetite'].amount < 8000) {
				if(Molpy.Got('Tiny Glasses')) {
					Molpy.Boosts['Tiny Glasses'].bought = 0;
					Molpy.Boosts['Tiny Glasses'].unlocked = 0;
					Molpy.BoostsOwned--;
					Molpy.Add('GlassBlocks', 960000);
				} else
					Molpy.Boosts['Tiny Glasses'].unlocked = 0;
			}
		}
		if(version < 2.95) {
			if(Molpy.Got('Glass Saw')) Molpy.Boosts['Glass Saw'].buyFunction();
		}
		if(version < 2.96) {
			Molpy.LockBoost('AC');
			Molpy.Boosts['AC'].power = 1;
		}
		if(version < 3.07) {
			Molpy.Boosts['Overcompensating'].power = Molpy.Boosts['Overcompensating'].startPower;
			if(Molpy.Got('Panther Rush')) Molpy.Boosts['Panther Rush'].buyFunction();
		}
		if(version < 3.13) {
			if(!Molpy.Earned('Getting Expensive') && !isFinite(Molpy.Boosts['Castles'].power)) {
				Molpy.Notify('Added a new Badge to help very early beginners, and you seem to be beyond the point where you could easily get it normally, so here it is.', 1);
				Molpy.EarnBadge('Getting Expensive');
			}
		}
		if(version < 3.186) {
			if(Molpy.Got('Price Protection')) Molpy.Boosts['Price Protection'].bought = 4;
		}
		if(version < 3.187) {
			if(Molpy.Boosts['MHP'].power > 12) Molpy.Boosts['MHP'].power = 12;
		}
		if(version < 3.189) {
			if(Molpy.Got('Impervious Ninja')) {
				var imp = Molpy.Boosts['Impervious Ninja'];
				imp.power = Math.ceil(imp.countdown / 1000);
				imp.countdown = 0;
				Molpy.Notify('Impervious Ninja change: it now gives ' + Molpify(imp.power)
						+ ' Ninja Forgiveness, rather than a countdown. Also it uses 1% of your Glass Chips (in storage) per use.', 1);
			}
		}
		if(version < 3.261) {
			if(Molpy.Boosts['WotA'].unlocked) Molpy.Boosts['WotA'].unlockFunction();
			if(Molpy.Boosts['GL'].countdown > 500) Molpy.Boosts['GL'].countdown = 500;
		}
		if(version < 3.272) {
			if(Molpy.Got('Glass Saw') && Molpy.Boosts['Glass Saw'].power == 0)
				Molpy.Boosts['Glass Saw'].power = Molpy.Boosts['GlassBlocks'].bought / 1e8; //something like that
		}
		if(version < 3.33) {
			if(Molpy.Got('Blackprints')){
				Molpy.UnlockBoost('Blackprint Plans');
				Molpy.Boosts['Blackprint Plans'].bought = 1;
				Molpy.boostRepaint = 1;
				Molpy.BoostsOwned++;
			}
			else if(Molpy.Has('Blackprints', 1)){
				Molpy.UnlockBoost('Blackprints');
				Molpy.Boosts['Blackprints'].bought = 1;
				Molpy.boostRepaint = 1;
				Molpy.BoostsOwned++;
			}
		}
		if(version < 3.3333) {
			Molpy.Boosts['Sand'].countdown = 0;
			Molpy.Boosts['Castles'].countdown = 0;
			Molpy.Boosts['Time Travel'].countdown = 0;
			Molpy.Boosts['GlassBlocks'].countdown = 0;
		}
	}

	Molpy.MakePrizeList = function() {
		Molpy.prizeList = [];
		for( var i in Molpy.Boosts) {
			var me = Molpy.Boosts[i];
			var t = EvalMaybeFunction(me.tier, 'low');
			if(!Molpy.prizeList[t]) Molpy.prizeList[t] = [''];
			if(t != EvalMaybeFunction(me.tier, 'high')) {
				Molpy.prizeList[t][0] = me.alias;
			} else {
				Molpy.prizeList[t].push(me.alias);
			}
		}
	}

	Molpy.LockPrize = function(id) {
		var t = EvalMaybeFunction(Molpy.BoostsById[id].tier, 'spend');
		var list = [];
		list[t] = Molpy.BoostsById[id].prizes;
		Molpy.AwardPrizes(list);
	}

	Molpy.AwardPrizes = function(prizeCounts) {
		if(!Molpy.prizeList) Molpy.MakePrizeList();
		for( var i in prizeCounts) {
			var c = prizeCounts[i];
			var p = Molpy.prizeList[i];
			var l = p.length;
			if(c >= l) {
				Molpy.UnlockBoost(p);
			} else if(c == l - 1) {
				Molpy.UnlockBoost(p.slice(1));
			} else {
				p = p.slice(1);
				p = Molpy.NotGot(p);
				ShuffleList(p);
				l = p.length;
				Molpy.UnlockBoost(p.slice(l - c));
			}
		}
	}
	Molpy.NotGot = function(prizes) {
		var ng = [];
		for( var i in prizes) {
			var p = prizes[i];
			if(!Molpy.Got(p)) ng.push(p);
		}
		return ng;
	}

	/* In which a routine for resetting the game is presented
	+++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
	Molpy.Down = function(coma) {
		if(coma || confirm('Really Molpy Down?\n(Progress will be reset but achievements will not.)')) {

			coma || _gaq && _gaq.push(['_trackEvent', 'Molpy Down', 'Begin', '' + Molpy.newpixNumber]);
			Molpy.Boosts['Sand'].totalDug = 0;
			Molpy.Boosts['Sand'].manualDug = 0;
			Molpy.Boosts['TF'].manualLoaded = 0;
			if(isFinite(Molpy.Boosts['Castles'].totalBuilt))
				Molpy.Boosts['Castles'].totalDown += Molpy.Boosts['Castles'].totalBuilt;
			else
				Molpy.Boosts['Castles'].totalDown = Number.MAX_VALUE;
			Molpy.Boosts['Castles'].totalBuilt = 0;
			Molpy.Boosts['Castles'].totalDestroyed = 0;
			Molpy.Boosts['Castles'].prevCastleSand = 0;
			Molpy.Boosts['Castles'].nextCastleSand = 1;
			Molpy.ninjaFreeCount = 0;
			Molpy.ninjaStealth = 0;

			Molpy.Boosts['Sand'].spent = 0;
			Molpy.Boosts['Castles'].spent = 0;
			Molpy.beachClicks = 0;
			Molpy.SandToolsOwned = 0;
			Molpy.CastleToolsOwned = 0;
			Molpy.BoostsOwned = 0;
			Molpy.notifsReceived = 0;

			Molpy.startDate = parseInt(new Date().getTime());
			Molpy.newpixNumber = 1;
			Molpy.ONGstart = ONGsnip(new Date());
			Molpy.DefaultOptions();

			var keep = '';
			if(!coma && Molpy.Got('No Need to be Neat')) {
				keep = GLRschoice(Molpy.tfOrder).name;
			}
			for(i in Molpy.SandTools) {
				var me = Molpy.SandTools[i];
				if(me.name == keep) continue;
				me.amount = 0;
				if(!keep) me.bought = 0;
				me.totalSand = 0;
				me.totalGlass = 0;
				me.temp = 0;
				me.Refresh();
			}
			for(i in Molpy.CastleTools) {
				var me = Molpy.CastleTools[i];
				if(me.name == keep) continue;
				me.amount = 0;
				if(!keep) me.bought = 0;
				me.temp = 0;
				if(i != 'NewPixBot') me.totalCastlesBuilt = 0;
				me.totalCastlesDestroyed = 0;
				me.totalCastlesWasted = 0;
				me.currentActive = 0;
				me.totalGlassBuilt = 0;
				me.totalGlassDestroyed = 0;
				me.Refresh();
			}
			for(i in Molpy.SandTools) {
				Molpy.SandToolsOwned += Molpy.SandTools[i].amount;
			}
			for(i in Molpy.CastleTools) {
				Molpy.CastleToolsOwned += Molpy.CastleTools[i].amount;
			}
			
			var boh = !coma && Molpy.Got('BoH') && Molpy.Spend('Bonemeal', 10);
			var bom = !coma && Molpy.Got('BoM') && Molpy.Spend('Bonemeal', 100);
			var bof = !coma && Molpy.Got('BoF') && Molpy.Spend('Bonemeal', 1000);
			var boj = !coma && Molpy.Got('BoJ') && Molpy.Spend('Bonemeal', 10000);
			var KaKPower = !coma && Molpy.Got('Kite and Key') ? Molpy.Boosts['Kite and Key'].power : 0;
			var LiBPower = !coma && Molpy.Got('Lightning in a Bottle') ? Molpy.Boosts['Lightning in a Bottle'].power : 0;
			var bagCount = boh + bom + bof + boj;
			var maxKeep = Math.pow(1e42, bagCount);
			var prizeCounts = [];
			for(i in Molpy.Boosts) {
				var me = Molpy.Boosts[i];
				if(boh && me.group == 'stuff') {
					me.Level = Math.min(me.Level, maxKeep);
					continue;
				}
				if(bom && !me.prizes && (me.name.indexOf('Mould') > -1 || typeof (me.desc) === 'string' && me.desc.indexOf('Mould') > -1))
					continue;
				if(bof && !me.prizes && me.className == 'toggle' && me.name != 'Glass Furnace' && me.name != 'Glass Blower')
					continue;
				if(boj && !me.prizes && me.group == 'chron')
					continue;
				if(!coma && me.bought && me.prizes) {
					var t = EvalMaybeFunction(me.tier, 'spend');
					if(!prizeCounts[t]) {
						prizeCounts[t] = me.prizes;
					} else {
						prizeCounts[t] += me.prizes;
					}
				}
				if(me.Level) me.Level = 0;
				me.unlocked = 0;
				me.bought = 0;
				me.power = 0;
				if(me.startPower) me.power = EvalMaybeFunction(me.startPower);
				me.countdown = 0;
			}
			Molpy.AwardPrizes(prizeCounts);
			
			Molpy.Boosts['Kite and Key'].power = KaKPower;
			Molpy.Boosts['Lightning in a Bottle'].power = LiBPower;
			
			Molpy.recalculateDig = 1;
			Molpy.boostRepaint = 1;
			Molpy.shopRepaint = 1;

			Molpy.showOptions = 0;
			Molpy.RefreshOptions();

			Molpy.UpdateBeach();
			Molpy.HandlePeriods();
			Molpy.UpdateFaves(1);
			Molpy.EarnBadge('Not Ground Zero');
			Molpy.AdjustFade();
			Molpy.UpdateColourScheme();
			coma || _gaq && _gaq.push(['_trackEvent', 'Molpy Down', 'Complete', '' + Molpy.highestNPvisited]);
		}
	}
	Molpy.Coma = function() {
		if(confirm('Really coma?\n(This will wipe all progress and badges!)')
			&& confirm('Seriously, this will reset ALL the things.\nAre you ABSOLUTELY sure?')) {
			//reset the badges
			_gaq.push(['_trackEvent', 'Coma', 'Begin', '' + Molpy.newpixNumber]);
			Molpy.Down(1);
			Molpy.saveCount = 0;
			Molpy.loadCount = 0;
			Molpy.DefaultOptions();
			var highest = Molpy.highestNPvisited;
			Molpy.highestNPvisited = 0;
			Molpy.BadgesOwned = 0;
			Molpy.groupBadgeCounts = {};
			Molpy.Redacted.totalClicks = 0;
			Molpy.Redacted.chainCurrent = 0;
			Molpy.Redacted.chainMax = 0;
			Molpy.Boosts['Time Travel'].travelCount = 0;
			Molpy.Boosts['Castles'].totalDown = 0;
			Molpy.toolsBuiltTotal = 0;
			Molpy.Boosts['TF'].totalLoaded = 0;
			Molpy.Boosts['TF'].totalDestroyed = 0;
			
			Molpy.CastleTools['NewPixBot'].totalCastlesBuilt = 0; //because we normally don't reset this.
			for( var i in Molpy.BadgesById) {
				Molpy.BadgesById[i].earned = 0;
			}

			Molpy.unlockedGroups = {};
			Molpy.badgeRepaint = 1;
			Molpy.UpdateFaves(1);
			_gaq.push(['_trackEvent', 'Coma', 'Complete', '' + Molpy.highestNPvisited]);
		}
	}
}
