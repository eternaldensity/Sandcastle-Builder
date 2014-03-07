Molpy.OptionsN = 0;
Molpy.Options = [];
Molpy.options = [];
Molpy.OptionsById = [];

Molpy.Option = function(args) {
	this.id = Molpy.OptionsN;
	this.name = args.name;
	this.title = args.title;
	this.defaultval = args.defaultval || 0;
	this.visability = args.visability || 1;
	this.onchange = args.onchange || 0;
	this.range = args.range || 1;
	this.text = args.text || ["No","Yes"];
	this.breakafter = args.breakafter || 0;

	Molpy.Options[this.name] = this;
	Molpy.OptionsById[this.id] = this;
	Molpy.OptionsN++;
}

Molpy.DefaultOptions = function() {
	for (var opi in Molpy.Options) {
		var opt=Molpy.Options[opi];
        	Molpy.options[opt.name] = opt.defaultval;
        	if (opt.onchange) opt.onchange();
	}
}

Molpy.RefreshOptions = function() {
	if(!Molpy.molpish) return;
	Molpy.EarnBadge('Decisions, Decisions');
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
	if (opt.onchange) opt.onchange();
	Molpy.RefreshOptions();
}

Molpy.Setoption = function(opt,val) {
	Molpy.options[opt] = val;
}

// These options are defined in the display order


new Molpy.Option({
	name: 'autosave',
	title: 'Autosave',
	defaultval: 2,
	range: 9,
	visability: function() {return Molpy.Got('Autosave Option')}, 
	text: function()  {
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
	name: 'autoscroll',
	title: 'Autoscroll Log',		
});

new Molpy.Option({
	name: 'boostsort',
	title: 'Sort Boosts by',		
	onchange: function() {
		Molpy.shopRepaint = 1;
		Molpy.boostRepaint = 1;
	},
	text: ['Price','Name'],
	breakafter: 1,
});

Molpy.flashes = 0;
new Molpy.Option({
	name: 'colourscheme',
	title: 'Colour Scheme',
	visability: function() {return Molpy.Got('Chromatic Heresy')}, 
	onchange: function() {
		Molpy.EarnBadge('Night and Dip');
		Molpy.UpdateColourScheme();
		Molpy.flashes++;
		if(Molpy.flashes == 30) Molpy.EarnBadge('I love my flashy gif');
	},
	text: [ "Dark Theme", "Light Theme"],
	defaultval: 1,
});

new Molpy.Option({
	name: 'colpix',
	title: 'Show Colpix',
	onchange: function() { Molpy.UpdateColourScheme() },
	defaultval: 1,
});

new Molpy.Option({
	name: 'logicatcol',
	title: 'Logicat Colours',
	visability: function() {return Molpy.Got('Chromatic Heresy') && Molpy.Got('LogiPuzzle') }, 
	onchange: function() { 
		Molpy.boostRepaint = 1;
		Molpy.UpdateFaves();
	},
	text: ['Greys','Colours'],
});

new Molpy.Option({
	name: 'numbers',
	title: 'Draw +Sand Numbers',		
	defaultval: 1,
	breakafter: 1,
});

new Molpy.Option({
	name: 'science',
	title: 'Scientific Notation',		
	onchange: function() {
		Molpy.shopRepaint = 1;
		Molpy.boostRepaint = 1;
		Molpy.badgeRepaint = 1;
		Molpy.UpdateFaves();
	},

});

new Molpy.Option({
	name: 'longpostfix',
	title: 'Use long postfixes',		
	onchange: function() { Molpy.shopRepaint = 1 },
});

new Molpy.Option({
	name: 'european',
	title: 'European format numbers',		
	onchange: function() {
		Molpy.shopRepaint = 1;
		Molpy.boostRepaint = 1;
		Molpy.badgeRepaint = 1;
		Molpy.UpdateFaves();
	},
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
	onchange: function() { Molpy.shopRepaint = 1 },
	text: function() { return Math.pow(4, Molpy.options.sandmultibuy) + ' tool' + plural(Molpy.options.sandmultibuy + 1) },
	
});

new Molpy.Option({
	name: 'castlemultibuy',
	title: 'Buy N Castle tools at once',		
	range: 5,
	visability: function() {return Molpy.Got('Castle Tool Multi-Buy')}, 
	onchange: function() { Molpy.shopRepaint = 1 },
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
	name: 'typo',
	title: 'typo',		
	visability: -1,
});

new Molpy.Option({ //Not Used
	name: 'sea',
	title: '',		
	visability: -1,
	defaultval: 1,
});

new Molpy.Option({ //Not Used
	name: 'particles',
	title: '',		
	visability: -1,
	defaultval: 1,
});

new Molpy.Option({ //Not Used
	name: 'autoupdate',
	title: '',		
	visability: -1,
	defaultval: 1,
});

/*
new Molpy.Option({
	name: '',
	title: '',		
});
*/

// Save and Load ALWAYS add to the end of the lists - Each is saved as ONE character
//
	Molpy.OptionsToString = function() {
		var str = '' + (Molpy.options.particles ? '1' : '0') + 
			(Molpy.options.numbers ? '1' : '0') +
			(Molpy.options.autosave) + 
			(Molpy.options.autoupdate ? '1' : '0') + 
			(Molpy.options.sea ? '1' : '0') +
			(Molpy.options.colpix ? '1' : '0') + 
			(Molpy.options.longpostfix ? '1' : '0') +
			(Molpy.options.colourscheme) + 
			(Molpy.options.sandmultibuy) + 
			(Molpy.options.castlemultibuy) +
			(Molpy.options.fade) + 
			(Molpy.options.typo) + 
			(Molpy.options.science) + 
			(Molpy.options.autosavelayouts) +
			(Molpy.options.autoscroll) + 
			(Molpy.options.boostsort) + 
			(Molpy.options.european) + 
			(Molpy.options.smalldecimal) +
			(Molpy.options.logicatcol);
		return str;
	}

	Molpy.OptionsFromString = function(thread) {
		var pixels = thread.split('');
		Molpy.options.particles = parseInt(pixels[0]) || 0;
		Molpy.options.numbers = parseInt(pixels[1]) || 0;
		Molpy.options.autosave = parseInt(pixels[2]) || 0;
		Molpy.options.autoupdate = parseInt(pixels[3]) || 0;
		Molpy.options.sea = parseInt(pixels[4]) || 0;
		Molpy.options.colpix = parseInt(pixels[5]) || 0;
		Molpy.options.longpostfix = parseInt(pixels[6]) || 0;
		Molpy.options.colourscheme = parseInt(pixels[7]) || 0;
		Molpy.options.sandmultibuy = (parseInt(pixels[8])) || 0;
		Molpy.options.castlemultibuy = (parseInt(pixels[9])) || 0;
		Molpy.options.fade = (parseInt(pixels[10])) || 0;
		Molpy.options.typo = (parseInt(pixels[11])) || 0;
		Molpy.options.science = (parseInt(pixels[12])) || 0;
		Molpy.options.autosavelayouts = parseInt(pixels[13]) || 0;
		Molpy.options.autoscroll = parseInt(pixels[14]) || 0;
		Molpy.options.boostsort = parseInt(pixels[15]) || 0;
		Molpy.options.european = parseInt(pixels[16]) || 0;
		Molpy.options.smalldecimal = parseInt(pixels[17]) || 0;
		Molpy.options.logicatcol = parseInt(pixels[18]) || 0;
	}




