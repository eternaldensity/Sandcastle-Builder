Molpy.OptionsN = 0;
Molpy.Options = [];
Molpy.options = [];
Molpy.OptionsById = [];

Molpy.Option = function(args) {
	this.id = Molpy.OptionsN;
	this.name = args.name;			// Name of option - needed for all
	this.title = args.title || args.name;	// Title to appear on options pane
	this.defaultval = args.defaultval || 0;	// Default value of option
	this.visability = args.visability || 1;	// Visability of option (maybe function)
	this.onchange = args.onchange || 0;	// Function - Action to take when it changes
	this.range = args.range || 1;		// Highest value (currently 1-9)
	this.text = args.text || ["No","Yes"];	// Text for option, if an array it is indexed by the value (maybe function)
	this.breakafter = args.breakafter || 0;	// Put a line break after the option to format the options pane
	Molpy.Options[this.name] = this;
	Molpy.OptionsById[this.id] = this;
	Molpy.OptionsN++;
}

Molpy.DefaultOptions = function() {
	for (var opi in Molpy.Options) {
		var opt=Molpy.Options[opi];
        	Molpy.options[opt.name] = opt.defaultval;
        	if (opt.onchange) opt.onchange(0);
	}
}

Molpy.RefreshOptions = function(manual) {
	if(!Molpy.molpish) return;
	if (manual) Molpy.EarnBadge('Decisions, Decisions');
	str = '';
	for (var opi in Molpy.OptionsById) {
		var opt=Molpy.OptionsById[opi];
		if (EvalMaybeFunction(opt.visability) > 0) {
			str += '<div id=' + opt.name + 'option class=minifloatbox><a onclick=Molpy.ToggleOption(\'' + opt.name + '\')>' + opt.title +
				'</a><div id=' + opt.name + 'descripton><br>';
			var texts = EvalMaybeFunction(opt.text,opt);
			if (typeof(texts) === 'object') str += texts[Molpy.options[opt.name]]
			else str += texts;
			str += '</div></div>';
			if (opt.breakafter) str += '<br>';
		}
	}
	g('optionsItems').innerHTML = str;
}

Molpy.ToggleOption = function(id) {
	opt = Molpy.Options[id];
	Molpy.options[opt.name]++;
	if (Molpy.options[opt.name] > opt.range) Molpy.options[opt.name]=0;
	if (opt.onchange) opt.onchange(1);
	Molpy.RefreshOptions(1);
}

Molpy.Setoption = function(opt,val) {
	Molpy.options[opt] = val;
}

Molpy.OptionsToString = function() {
	var str = '';
	for (var opt in Molpy.OptionSaveOrder) str += Molpy.options[Molpy.OptionSaveOrder[opt]] || 0;
	return str;
};

Molpy.OptionsFromString = function(thread) {
	thread = thread.replace(/N/g,'');	// This is a fudge to remove a bug introduced in 3.4
	thread = thread.replace(/A/g,'0');	// and fixed in 3.411
	var pixels = thread.split('');
	for (var opt in Molpy.OptionSaveOrder) {
		var name = Molpy.OptionSaveOrder[opt];
		Molpy.options[name] = parseInt(pixels[opt]);
		if (isNaN(Molpy.options[name])) Molpy.options[name] = Molpy.Options[name].defaultval;
	}
};

// ALWAYS add to the end of this list. NEVER EVER remove an option
Molpy.OptionSaveOrder = [ 'particles', 'numbers', 'autosave', 'autoupdate', 'sea', 'colpix', 'longpostfix', 'colourscheme',
			  'sandmultibuy', 'castlemultibuy', 'fade', 'typo', 'science', 'autosavelayouts', 'autoscroll','boostsort',
			  'european', 'smalldecimal', 'logicatcol', 'loglimit', 'autoshow', 'mindecimal', 'edigits','approx',
			  'notifsilence', 'loglength'];
	
// These options are defined in the display order

new Molpy.Option({
	name: 'autosave',
	title: 'Autosave',
	defaultval: 2,
	range: 9,
	visability: function() {return Molpy.Got('Autosave Option')}, 
	text: function() {
		var auto = Molpy.options.autosave;
		if(auto) {
			return 'Every ' + auto * 5 + 'milliNewPix';
		} else {
			return 'Off (remember to save manually!)';
		}
	}
});

new Molpy.Option({
	name: 'autosavelayouts',
	title: 'Autosave Layouts',
	range: 2,
	visability: function() {return (Molpy.Got('Autosave Option') && !noLayout)}, 
	defaultval: 1,
	text: [ 'Off (remember to save layouts manually!)', 'When you save the game manually', 'Whenever the game is saved'],
	breakafter: 1,
});

new Molpy.Option({
	name: 'cloudsync',
	title: 'Cloud Sync (Click this to progress)',
	text: ['Off', 'Enter github credentials', 'Setup sync time', 'Stop everything'],
	range: 3,
	breakafter: 1,
	onchange: function() {
		if (Molpy.options.cloudsync == 2) {
			var username = prompt('Enter your username');
			var password = prompt('Enter your password');

			GH.setup(username, password);

			this.breakafter = 0;
		} else if (Molpy.options.cloudsync == 3) {
			var time = prompt('Enter amount of seconds...');
			//TODO: setup export via timer

			GH.tTime = parseInt(time);
			GH.tId = setInterval(GH.exportToCloud, time * 1000);

			this.title = 'Sync every' + ' ' + time + ' ' + 'seconds (Click this to progress)'
		} else if (Molpy.options.cloudsync == 0) {
			GH.teardown();

			this.title = 'Cloud Sync (Click this to progress)';
			this.breakafter = 1;
		}
	},
	visability: function() {return Molpy.Got('Autosave Option')},
});

new Molpy.Option({
	name: 'cloudimp',
	title: 'Import data from cloud',
	text: ['WARNING: NO CONFIRMATION!', 'Unpress the button'],
	onchange: function() {
		if (Molpy.options.cloudimp) {
			if (GH.fGist) {
				GH.importFromCloud()
			}
		}
	},
	visability: function() {
		if ((Molpy.options.cloudsync == 2) || (Molpy.options.cloudsync == 3)) {
			return 1
		} else {
			return 0
		}
	},
	breakafter: 1
});

new Molpy.Option({
	name: 'autoscroll',
	title: 'Autoscroll Log',		
});

new Molpy.Option({
	name: 'loglimit',
	title: 'Kept logs',
	defaultval: 3,
	range: 9,	
	text: function() {
		val = Molpy.options.loglimit;
		if(val) {
			return '' + val + ' ONGs of logs';
		} else {
			return 'No limit';
		}
	},
	onchange: function() {
		Molpy.CleanLogs();
	},
});

new Molpy.Option({
    name: 'notifsilence',
    title: 'Notifications',
    range: 2,
    text: ['All notifs', 'Less notifs', 'Critical only'],
    visability: 1
});
new Molpy.Option({
	name: 'loglength',
	title: 'Log N notifications',
	range: 6,
	text: ['∞', '1','5','10','20','50','100'],
	visibility: 1
});

new Molpy.Option({
	name: 'boostsort',
	title: 'Sort Boosts by',		
	onchange: function() {
		Molpy.boostNeedRepaint = 1;
	},
	text: ['Price','Name'],
	breakafter: 1,
});

Molpy.flashes = 0;
new Molpy.Option({
	name: 'colourscheme',
	title: 'Colour Scheme',
	visability: function() {return Molpy.Got('Chromatic Heresy')}, 
	onchange: function(manual) {
		if (manual) Molpy.EarnBadge('Night and Dip');
		Molpy.UpdateColourScheme();
		Molpy.flashes++;
		if(Molpy.flashes == 30) Molpy.EarnBadge('I love my flashy gif');
		Molpy.Overview.DoAll();
	},
	text: [ "Dark Theme", "Light Theme"],
	defaultval: 1,
});

new Molpy.Option({
	name: 'colpix',
	title: 'Show Colpix',
	onchange: function() { Molpy.UpdateColourScheme() },
	defaultval: 0,
});

new Molpy.Option({
	name: 'logicatcol',
	title: 'Logicat Colours',
	visability: function() {return Molpy.Got('Chromatic Heresy') && Molpy.Got('LogiPuzzle') }, 
	onchange: function() { 
		Molpy.Boosts['Logicat'].repaint();
		Molpy.UpdateFaves();
	},
	text: ['Greys','Colours'],
});

new Molpy.Option({
	name: 'numbers',
	title: 'Draw +Sand Numbers',		
	defaultval: 1,
	breakafter: 1,
	onchange: function() { 
		g('sparticles').style.display = Molpy.options.numbers?"block":"none";
	},
});

new Molpy.Option({
	name: 'science',
	title: 'Scientific Notation',		
	onchange: function() {
		Molpy.allNeedRepaint = 1;
		Molpy.UpdateFaves();
	},

});

new Molpy.Option({
    name: 'edigits',
    title: 'Number of digits before collapsing to epsilon notation',
    range: 4,
    text: ['Standart', '9', '10', '11', '12'],
    visability: function() {
        if (Molpy.options.science) {
            return 1;
        } else {
            return 0;
        }
    },
    onchange: function() {
        Molpy.allNeedRepaint = 1;
        Molpy.UpdateFaves();
    }
});

new Molpy.Option({
	name: 'longpostfix',
	title: 'Use long postfixes',		
	onchange: function() {
		Molpy.allNeedRepaint = 1;
		Molpy.UpdateFaves();
		},
});

new Molpy.Option({
	name: 'european',
	title: 'European format numbers',		
	onchange: function() {
		Molpy.allNeedRepaint = 1;
		Molpy.UpdateFaves();
	},
});

new Molpy.Option({
	name: 'mindecimal',
	title: 'Minimum Decimal Digits',		
	range: 5,
	onchange: function() {
		Molpy.allNeedRepaint = 1;
		Molpy.UpdateFaves();
	},
	text: function() { return Molpy.options.mindecimal },

});

new Molpy.Option({
	name: 'smalldecimal',
	title: 'Decimal Settings',		
	text: ['Normal','Small','Shaded','Italic','Red','Lime','Orange','Mauve','Teal','Blue'],
	range: 9,
	breakafter: 1,
});

new Molpy.Option({
	name: 'sandmultibuy',
	title: 'Buy N Sand tools at once',		
	range: 5,
	visability: function() {return Molpy.Got('Sand Tool Multi-Buy')}, 
	onchange: function() { Molpy.toolsNeedRepaint = 1 },
	text: function() { return Math.pow(4, Molpy.options.sandmultibuy) + ' tool' + plural(Molpy.options.sandmultibuy + 1) },
	
});

new Molpy.Option({
	name: 'castlemultibuy',
	title: 'Buy N Castle tools at once',		
	range: 5,
	visability: function() {return Molpy.Got('Castle Tool Multi-Buy')}, 
	onchange: function() { Molpy.toolsNeedRepaint = 1 },
	text: function() { return Math.pow(4, Molpy.options.castlemultibuy) + ' tool' + plural(Molpy.options.castlemultibuy + 1) },
});

new Molpy.Option({
	name: 'fade',
	title: 'Colour Scheme Fade',		
	range: 10,
	visability: function() {return Molpy.Got('I love my flashy gif')}, 
	onchange: function() { Molpy.AdjustFade() },
	text: function() {
		var f = Molpy.options.fade;
		if(!f) {
			return "No";
		} else {
			return Molpify(f / 2, 1) + 's';
		}
	}
});

new Molpy.Option({
	name: 'autoshow',
	title: 'Auto show new things',
	range: 2,
	defaultval: 1,
	text: ['Never', 'Always', 'No discoveries']
});

new Molpy.Option({
	name: 'typo',
	title: 'typo',		
	visability: -1,
});

new Molpy.Option({ //Not Used
	name: 'sea',
	title: '',		
	visability: -1,
});

new Molpy.Option({ //Not Used
	name: 'particles',
	title: '',		
	visability: -1,
});

new Molpy.Option({ //Not Used
	name: 'autoupdate',
	title: '',		
	visability: -1,
});

new Molpy.Option({
    name: 'approx',
    title: 'Use rougher approximations',
    range: 4,
    text: ['Very Rough', 'Rough', 'Chunky', 'Smooth', 'Silky Smooth'],
    visability: -1
});

new Molpy.Option({
    name: 'notifsilence',
    title: 'Notifications',
    range: 2,
    text: ['All notifs', 'Less notifs', 'Critical only'],
    visability: 1
});
new Molpy.Option({
	name: 'loglengthdup',
	title: 'Log N notifications; somehow a duplicate was added in the work for 4.0 when this was supposed to be removed',
	range: 6,
	text: ['∞', '1','5','10','20','50','100'],
	visibility: -1
});


/*
new Molpy.Option({
	name: '',
	title: '',		
});
*/

