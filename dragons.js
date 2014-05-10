/*
// NOt used now
Molpy.Constants = { // Rank 0:simple, 1:harder, 2:10+, 3:complex
	Pi:	{name:'&pi;',				rank:0,	value:3.141592653589793},
	Phi:	{name:'&phi;',				rank:0, value:1.618033988749894},
	e:	{name:'e',				rank:0, value:2.718281828459045},
	Feign:	{name:'Feignbaum',			rank:0, value:4.669201609102990},
	Laplace: {name:'Laplace',			rank:1, value:0.662743419349181},
	Catalan: {name:'Catalan',			rank:1, value:0.915965594177219},
	Root2:	{name:'&root;2',			rank:0, value:1.414213562373095},
	Tau:	{name:'&tau',				rank:1, value:6.283185307179586},
	RecipFib: {name:'Reciprocal Fibonacci',		rank:1, value:3.359885666243177},
	Adams:	{name: 'Life, Universe & Everything',	rank:2, value:42},
	Root3:	{name:'&root;3',			rank:0, value:1.732050807568877},
	i:	{name:'i',				rank:3, value:{0,1}},
	Epi	{name:'e<sup>&pi;</sup>',		rank:2,	value:23.1406926328},
	ii:	{name:'i<sup>i</sup>',			rank:1, value:0.207879576},
	cri:	{name:'Cube Root 1',			rank:3,	value:{-0.5,0.866025403784438}},
	Rooti:	{name:'&root;i',			rank:3,	value:{0.707106781186547,0.707106781186547}},
	dragon:	{name:'Fractal dragon curve',		rank:1,	value:1.523627086202492},
	Seq:	{name:'Sequence',			rank:0, value:1.234567112345678},
	Third:	{name:'A third',			rank:0, value:0.333333333333333},

}
*/

Molpy.DragonsById = [];
Molpy.Dragons = {};
Molpy.DragonN = 0;
	
Molpy.Dragon = function(args) {
	this.id = Molpy.DragonN++;
	for(var prop in args) {
		if(typeof args[prop] !== 'undefined' ) this[prop] = args[prop];
	};
	Molpy.DragonsById[this.id] = this;
	Molpy.Dragons[this.name] = this;

	// Methods here if any
}

Molpy.DefineDragons = function() {

	new Molpy.Dragon({
		name: 'Dragling',
		legs: 4,
		wings: 0,
		fly: 0,
		heads: 1,
		arms: 0,
		upgrade: {Diamonds:1},
		exp: 100,
		condition: function() { return true },
		desc: 'These small timid creatures hide in the shadows and under leaves keeping out of the way of fierce cats',
		digbase: 0.1,
		colour: '00ff00',
	});
	new Molpy.Dragon({
		name: 'DragonNewt',
		legs: 2,
		wings: 0,
		fly: 0,
		heads: 1,
		arms: 2,
		upgrade: {Diamonds:100},
		exp: '1M',
		condition: function() { return false },
		desc: 'These high spirited diminutive dragons, stand nearly a Q tall and can wield weapons and spades.  They mean well...',
		digbase: 1,
		colour: '0080ff',
	});
	new Molpy.Dragon({
		name: 'Wyrm',
		legs: 0,
		wings: 2,
		fly: 1,
		heads: 1,
		arms: 0,
		upgrade: {Diamonds:'10K'},
		exp: '1T',
		condition: function() { return false },
		desc: 'These are monstorous, limbless creatures, with a big bite.',
		digbase: 100,
		colour: '0000ff',
	});
	new Molpy.Dragon({
		name: 'Wyvern',
		legs: 2,
		wings: 2,
		fly: 1,
		heads: 1,
		arms: 0,
		upgrade: {Diamonds:'1G'},
		exp: '1T',
		condition: function() { return false },
		desc: 'These can fly.  They fight and dig with their legs, some have a bad breath.',
		digbase: 10000,
		colour: '8000ff',
	});
	new Molpy.Dragon({
		name: 'Dragon',
		legs: 2,
		wings: 2,
		fly: 1,
		heads: 1,
		arms: 2,
		breath: ['fire'],
		upgrade: {Diamonds:'1T',Princesses:1},
		exp: '1T',
		condition: function() { return false },
		desc: 'Tradional Welsh Dragon',
		digbase: 1000000,
		colour: 'ff00ff',
	});
	new Molpy.Dragon({
		name: 'Noble Dragon',
		legs: 2,
		wings: 2,
		fly: 1,
		heads: 1,
		arms: 2,
		breath: ['fire'],
		magic: 1,
		upgrade: {Diamonds:'1T',Princesses:1},
		exp: '1T',
		condition: function() { return false },
		desc: 'Very large magical dragon',
		digbase: 100000000,
		colour: 'ff0000',
	});
	new Molpy.Dragon({
		name: 'Imperial Dragon',
		legs: 4,
		wings: 2,
		fly: 1,
		heads: 3,
		arms: 6,
		breath: ['fire','ice','poison'],
		magic: 2,
		upgrade: {Diamonds:'1T',Princesses:1},
		exp: '1T',
		condition: function() { return false },
		desc: 'These are the makers of ledgends, attacking with many heads in many ways, mortals don\'t want to be in the ssame universe as this.',
		digbase: 10000000000,
		colour: '800000',
	});
	new Molpy.Dragon({
		name: 'NogarDragoN',
		legs: 66,
		wings: 66,
		fly: 1,
		heads: 9,
		arms: 66,
		breath: ['fire','ice','poison'],
		magic: 3,
		upgrade: {Diamonds:'1T',Princesses:1},
		exp: '1T',
		condition: function() { return false },
		desc: '!', // later
		digbase: 1000000000000,
		colour: '000000',
	});

};


Molpy.OpponentsById = [];
Molpy.OpponentN = 0;
	
Molpy.Opponent = function(args) {
	this.id = Molpy.OpponentN++;
	for(var prop in args) {
		if(typeof args[prop] !== 'undefined' ) this[prop] = args[prop];
	}
	Molpy.OpponentsById[this.id] = this;

	// Methods
	this.attackstxt = function(n) {
		var str = '' + ((n && n > 1)?Molpify(n):'A') + ' ' + this.name;
		if (n > 1) str += 's';
		str += ' armed with ';
		var weapon = GLRschoice(this.armed);
		var first = weapon.charAt(0);
		var rest = weapon.substr(1);
		switch (first) {
		case '+':
			str += 'the ';
			break;
		case '-': 
			break;
		case '@':
			str += 'his ';
			break;
		case '!':
			str += 'an ';
			break;
		case '|':
			str += (Math.random() < 0.5?'his ':'her ');
			break;
		default:
			str += 'a '+first;
			break;
		}
		str += rest;
		return str;
	}

	this.attackval = function(n) { // [physical,magical]
//		if (this.id < 10) return [(Math.pow(42,Math.exp(this.id/2))*n)/1234,0];
		return [Math.pow(42,Math.exp(this.id/2))*n/1234,Math.pow(672,Math.exp(this.id-10))*n/1764];
	};

	this.takeReward = function(n,exp) {
		var rwds= [];
		for (var stuff in this.reward) {
			var num = 0;
			var range = this.reward[stuff];
			var bits = range.split('-');
			if (bits[1]) {
				var minval = DeMolpify(bits[0]);
				var maxval = DeMolpify(bits[1]);
				num = Math.floor(maxval * Math.random()+minval);
			} else {
				if (Math.random() < range) num = 1;
			}
			if (exp) Molpy.DragonExperience(exp); 
			if (num) {
				num *= (n||1);
				rwds.push(Molpify(num,2) + ' ' + stuff);
				if (stuff == 'Copper') { stuff = 'Gold'; num/=1000000; }
				else if (stuff == 'Silver') { stuff = 'Gold'; num/=1000; }
				Molpy.Add(stuff,num);
			}
		}
		if (rwds.length && !Molpy.boostSilence) {
			Molpy.Notify('After the fight you get ' + rwds.join('+ ') + (exp?' and '+Molpify(exp) +' experience':''),1);
		}
	}

	this.experience = function() {
		return DeMolpify(this.exp);		
	}
};

// First char of armed: -(no a), !an, + the, @his, |his|her, else a...
Molpy.DefineOpponents = function() {
	new Molpy.Opponent ({
		name: 'Serf',
		armed: ['stick', '-bare hands', 'turnip', '-bad words', 'bowl of dish water','|hamply','fish head'],
		reward: {Copper:'1-10'},
		exp: 1,
	});

	new Molpy.Opponent ({
	 	name: 'Peasant',
		armed: ['sythe','pitchfork','hammer','knife','club','spade','dung fork','chair leg','bone','rock','pun','|wolfy'],
		reward: {Copper:'10-1000'},
		exp: '1K',
	});

	new Molpy.Opponent ({
	 	name: 'Page',
		armed: ['dagger', 'staff', 'nice cup of tea', 'stileto', 'buckler', 'spear', 'crossbow', '-puns'],
		reward: {Silver:'1-100'},
		exp: '1M',
	});

	new Molpy.Opponent ({
	 	name: 'Squire',
		armed: ['short sword', 'side sword','bow and arrows','mace','mandolin','polearm','!axe','hammer','@keyboard'],
		reward: {Silver:'100-10000'},
		exp: '1G',
	});

	new Molpy.Opponent ({
	 	name: 'Knight',
		armed: ['long sword', '+arming sword', 'battle axe', 'morning star', 'lance'],
		reward: {Gold:'10-1000',Diamonds:0.5},
		exp: '1P',
	});

	new Molpy.Opponent ({
	 	name: 'Baron',
		armed: ['bastard sword','flaming sword','hailstorm','tax demand'],
		reward: {Gold:'1K-1M',Diamonds:'1-5'},
		exp: '1E',
	});

	new Molpy.Opponent ({
	 	name: 'Lord',
		armed: ['great sword','great axe','Kazoo','court jester','fire hose'],
		reward: {Gold:'100K-1G',Princesses:0.25,Diamonds:'1-50'},
		exp: '1Z',
	});

	new Molpy.Opponent ({
	 	name: 'Duke',
		armed: ['+Duchess','horde of servants','+gardeners','whip'],
		reward: {Gold:'1M-1T',Princesses:0.75,Diamonds:'50-50K'},
		exp: '1Y',
	});

	new Molpy.Opponent ({
	 	name: 'Emperor',
		armed: ['+staff of office','holy orb','+Imperial Guard','-Kamakazi Teddy Bears','!ICBM','+Storm Troopers','Death Star'],
		reward: {Gold:'10M-1E',Princesses:'1-10',Diamonds:'50K-60M'},
		exp: '1U',
	});

	new Molpy.Opponent ({
	 	name: 'Paladin',
		armed: ['+Dragon slaying sword','Holy hand grenade','lot of bad puns','+Sword of the isles'],
		reward: {Gold:'100M-1Z',Princesses:'10-10K',Diamonds:'60M-80G'},
		exp: '1S',
	});

	new Molpy.Opponent ({
	 	name: 'Hero',
		armed: ['+sword of sharpness','-Eds Axe','+Punsaw','Donut','-both feet','pea shooter','@fist of steel'],
		reward: {Gold:'1G-1Y',Princesses:'100-10M',Diamonds:'70G-100T'},
		exp: '1F',
	});

	new Molpy.Opponent ({
	 	name: 'Demi-god',
		armed: ['pen (mightier than the sword)', 'cleaving axe','pitch fork', 'ballon'],
		reward: {Gold:'10G-1U',Princesses:'1K-10G',Diamonds:'80T-120P'},
		exp: '1W',
	});

	new Molpy.Opponent ({
	 	name: 'Superhero',
		armed: ['-bare hands','turnip','bazooka','+Imperial Dragon Banishing Sword','+Great Cleaver' ],
		reward: {Gold:'1T-1S',Princesses:'1M-10P',Diamonds:'90P-150E'},
		exp: '1GW',
	});

	new Molpy.Opponent ({
	 	name: 'God',
		armed: ['+staff of might','+staff of comand','-dice','|holy symbol','|lightning strikes'],
		reward: {Gold:'10P-1F',Princesses:'1G-10Y',Diamonds:'100E-200Z'},
		exp: '1UW',
	});

	new Molpy.Opponent ({
	 	name: 'Panetheon of Gods',
		armed: ['-myths and ledgends','!army','flock of unicorns', '-heresey', '503', '-logic'],
		reward: {Gold:'10E-1W',Princesses:'1T-10L',Diamonds:'120Z-500Y'},
		exp: '1WW',
	});
};

// NPdata **********************************************************

Molpy.NPdata = [];

Molpy.ClearNPdata = function() {
	MolpyNPdata = [];
};

// Digging *********************************************************

Molpy.DragonDigRecalcNeeded = 1;
Molpy.DragonDigRate = 0;
Molpy.DigValue = 0;
Molpy.TotalDragons = 0;
Molpy.TotalNPsWithDragons = 0;
Molpy.HighestNPwithDragons = 0;
Molpy.DigTime=0;
Molpy.DiggingFinds={};
Molpy.DragonDigMultiplier = 1;
Molpy.DragonAttackMultiplier = 1;
Molpy.DragonDefenceMultiplier = 1;
Molpy.DragonBreathMultiplier = 1;

Molpy.DragonDigRecalc = function() {
	Molpy.DragonDigRecalcNeeded = 0;

	Molpy.DragonDigMultiplier = 1;
	if (Molpy.Got('Bucket and Spade')) Molpy.DragonDigMultiplier *=2;
	if (Molpy.Got('Strength Potion')) Molpy.DragonDigMultiplier *=5;
	if (Molpy.Got('Lucky Ring')) Molpy.DragonDigMultiplier *=5;

	Molpy.DragonDefenceMultiplier = 1;
	if (Molpy.Got('Lucky Ring')) Molpy.DragonDefenceMultiplier *= 2;
	if (Molpy.Got('Ooo Shinny!')) Molpy.DragonDefenceMultiplier *= 2*(1+Math.log(Molpy.Level('Gold')));
	if (Molpy.Got('Spines')) Molpy.DragonDefenceMultiplier *= Math.pow(1.2,Molpy.Level('Spines'));
	if (Molpy.Got('Adamintine Armour')) Molpy.DragonDefenceMultiplier *= Math.pow(2,Molpy.Level('Adamintine Armour'));

	Molpy.DragonAttackMultiplier = 1;
	if (Molpy.Got('Big Teeth')) Molpy.DragonAttackMultiplier *= Math.pow(1.2,Molpy.Level('Big Teeth'));
	if (Molpy.Got('Magic Teeth')) Molpy.DragonAttackMultiplier *= Math.pow(10,Molpy.Level('Magic'));
	if (Molpy.Got('Tusks')) Molpy.DragonAttackMultiplier *= Math.pow(2,Molpy.Level('Tusks'));
	
	Molpy.DragonBreathMultiplier = 1;


	var td = 0;
	Molpy.TotalNPsWithDragons = 0;
	Molpy.TotalDragons = 0;
	Molpy.HighestNPwithDragons = 0;
	for (var dpx in Molpy.NPdata) {
		dnp = Molpy.NPdata[dpx];
		if (dnp && dnp.ammount) {
			td += (dnp.ammount*dnp.dig*Molpy.DragonsById[Molpy.Level('DQ')].digbase || 0);
			Molpy.TotalNPsWithDragons++;
			Molpy.TotalDragons += dnp.ammount;
			Molpy.HighestNPwithDragons = dpx*1;
		}
	}
	if (Molpy.TotalDragons) td += 0.001;
	Molpy.DragonDigRate = td*Molpy.DragonDigMultiplier;
}

Molpy.DragonDigging = function(type) { // type:0 = mnp, 1= beach click
	var dq = Molpy.Boosts['DQ'];
	if (Molpy.DragonDigRate == 0 && Molpy.DragonDigRecalcNeeded == 0) return;
	if( Molpy.DigTime++ >100) {
		if (Object.keys(Molpy.DiggingFinds).length) {
			var str = 'During the last 100 digs, the dragons have found: ';
			var strs = [];
			for (var find in Molpy.DiggingFinds) {
				var stuff = find;
				var n = Molpy.DiggingFinds[find];
				if (find == 'Gold' && n < 1) {
					if (n < 0.001) {
						stuff = 'Copper';
						n *= 1000000;
					} else {
						stuff = 'Silver';
						n *= 1000;
					}
				}

				strs.push(Molpify(n) + ' ' +stuff);
			};
			if (strs.length == 1) str += strs[0]
			else {
				str += strs.slice(0,-1).join(', ') + ' and ' + strs.pop();
			}
			Molpy.Notify(str,1);
		}
		Molpy.DigTime = 0;
		Molpy.DiggingFinds = {};
	}
	if (dq.overallState) return;
	
	if (Molpy.DragonDigRecalcNeeded) Molpy.DragonDigRecalc();
	Molpy.DigValue += Molpy.DragonDigRate*Math.random();
	if (Molpy.DigValue < 1) return;
	Molpy.EarnBadge('Found Something!');
	var finds = Math.max(Math.floor(Molpy.DigValue),1);
	Molpy.DigValue -= finds;
//	Molpy.Notify('Found '+ finds + ' things',1);
	var found = '';
	var n = 0;
	if (Math.random()<0.99/Math.log(finds+1.7)) { // Find coins
		found = 'Gold';
		n = finds/1000000;
		Molpy.Add(found,n);
	} else if (Math.random() <0.95) { // Find Diamonds
		found = 'Diamonds';
		n = Math.max(Math.floor(Math.log(finds)),1);
		Molpy.Add(found,n);
		Molpy.EarnBadge('Wheee Diamonds');
	} else { // Find Things
		var availRewards = [];
		for( var i in Molpy.Boosts) {
			var me = Molpy.Boosts[i];
				if("draglvl" in me && Molpy.Dragons[me.draglvl].id <= dq.Level && me.bought < (me.limit || 1)) {
					availRewards.push(me);
				}
		}
//		Molpy.Notify('List length '+ availRewards.length);
		var thing = GLRschoice(availRewards);
		if (thing) {
			found = thing.name;
			n = 1;
			if (thing.bought) {
				thing.bought++;
			} else {
				thing.unlocked = 1;
				thing.buy(1,1);
			}
		} else {
			found = 'Diamonds';
			n = Math.max(Math.floor(Math.log(finds)),1);
			Molpy.Add(found,n);
		}
	}
	if (found) {
//		Molpy.Notify('Found ' + n + ' ' + found,1);
		var f = dq.finds++;
		if (f > 100) Molpy.UnlockBoost('Beach Dragon');
		if (Molpy.DiggingFinds[found]) {
			Molpy.DiggingFinds[found] += n;
		} else {
			Molpy.DiggingFinds[found] = n;
		}
	}
}

// Fledging ********************************************************

Molpy.MaxDragons = function() {
	if (Molpy.newpixNumber < 0) return Molpy.newpixNumber;
	return 1+Math.floor(Molpy.newpixNumber/100);
} 

Molpy.DragonFledge = function(clutch) {
	var npd = Molpy.NPdata[Molpy.newpixNumber];
	var dq = Molpy.Boosts['DQ'];
	var hatch = Molpy.Boosts['Hatchlings'];
	var lim = Molpy.MaxDragons();
	var waste = 0;
	var oldDT = 0;
	var oldDN = 0;
	var fight = 1;
	if (!npd) npd = Molpy.NPdata[Molpy.newpixNumber] = {};

	if (npd && npd.ammount > 0 && (npd.DragonType < dq.Level || (npd.DragonType == dq.Level && hatch.clutches[clutch] > npd.ammount)))	{ // Replace
		oldDT = npd.DragonType;
		oldDN = npd.ammount;
		fight = 0;
	}
	npd.DragonType = dq.Level;
	npd.ammount = hatch.clutches[clutch];
	if (npd.ammount > lim) {
		if (lim < 0) {
			waste = npd.ammount;
			npd.ammount = 0;
		} else {
			waste = Math.max(npd.ammount - lim,0);
			npd.ammount = Math.max(0,lim);
		}
	}

	if (npd.ammount) {
		var props = hatch.properties.slice(clutch*Molpy.DragonStats.length,Molpy.DragonStats.length);
		npd.defence= props[0];
		npd.attack = props[1];
		npd.dig    = props[2];
		npd.breath = props[3];
		npd.magic1 = props[4];
		npd.magic2 = props[5];
		npd.magic3 = props[6];
	
		switch (hatch.diet[clutch]) {
		case 1: // Goats
			npd.breath/=2;
			npd.magic1 = npd.magic2 = npd.magic3 = 0;
			break;
		case 2: // Hatchlings!
			npd.magic1 /=2; 
			npd.magic2 = npd.magic3 = 0;
			break;
		case 3: // Princesses
			break;
		}

		Molpy.Notify(Molpify(npd.ammount) + ' ' + Molpy.DragonsById[npd.DragonType].name +
				(npd.ammount ==1?' has':'s have') +' fledged at NP'+Molpy.newpixNumber,1);
		if (oldDN) Molpy.Notify('Replacing '+Molpify(oldDN)+' '+Molpy.DragonsById[oldDT].name);
	}
	if (waste) Molpy.Notify('There was not enough space for '+(npd.ammount?Molpify(waste):'any')+' of them');
	hatch.clutches[clutch] = 0;
	hatch.clean(1);

	if (fight && npd.ammount) Molpy.OpponentsAttack(Molpy.newpixNumber,Molpy.newpixNumber,' attacks as you fledge');
	if (npd.ammount) Molpy.EarnBadge('First Colonist');
	Molpy.DragonDigRecalc(); // Always needed
}

Molpy.FindLocals = function(where) {
	var type = 0;
	var numb = 1;
	type = Math.min(Math.floor(where/150),Molpy.OpponentsById.length-1);
	numb = Math.floor(((where-type*150)/30)*(Math.random())+1);
	return [type,numb];
}

Molpy.DragonStatsNow = function(where) {
	var Stats = {};
	var npd = Molpy.NPdata[where];
	if (!npd) return Stats;
	for(var prop in npd) {
		if(typeof npd[prop] !== 'undefined' ) Stats[prop] = npd[prop];
	}

	Stats.defence *= Molpy.DragonDefenceMultiplier;
	Stats.attack *= Molpy.DragonAttackMultiplier;
	return Stats;
}

Molpy.OpponentsAttack = function(where,from,text) {
	// Select locals
	// Work out their attack and defense values
	// fight a round
	// if clear result (Dragon &| Opponents) Killed
	// There may be injuries to the dragon needing time to heal
	// give rewards and experience
	// Notify
	
	var dq = Molpy.Boosts['DQ'];
	var npd = Molpy.NPdata[where];
	var lcls = Molpy.FindLocals(from);
	var type = lcls[0];
	var numb = lcls[1];
	var local = Molpy.OpponentsById[type];
	var atktxt = local.attackstxt(numb) + text + '. ';
	var atkval = local.attackval(numb);

	Molpy.DragonDigRecalc(); 
	var dragstats = Molpy.DragonStatsNow(where);
	var result = 0;
	var localhealth = atkval[0]+atkval[1];
	var dragnhealth = dragstats.defence || 0;
	var factor = 1;
	var loops = 0;
	if (numb > 1) Molpy.EarnBadge('There are two of them');

//	 Molpy.Notify('atkval = '+atkval[0]+' drag hlth = '+dragnhealth+' attack= '+dragstats.attack,1);
	
	while (result == 0 && loops<=100) {
		if ((loops&1)==0) { // Magical attacks && Breath attacks
	
			// TODO

		} else { // Physical attacks
			localhealth -= (dragstats.attack || 0)*Math.random();
			if (loops >1 || dragstats.attack > 10*atkval[0]) dragnhealth -= atkval[0]*Math.random();

		};
//		Molpy.Notify('loop = ' + loops + ' local = '+localhealth+' dragon = '+dragnhealth,1);
		if (dragnhealth < 0) {
			result = -1 -(dragnhealth < -dragstats.defence);
		} else if (localhealth < 0) {
//			Molpy.Notify('result ='+ result+' localneg = '+localhealth,1);
			factor = dragnhealth/dragstats.defence;
//			Molpy.Notify('factor ='+ factor,1);
			if (factor > 0.9) result = 3
			else if (factor > 0.5 || npd.ammount == 1) result = 2
			else result = 1;
		}
		loops++;
	}

	switch (result) {
		case -2 : // wipeout
			npd.ammount = 0;	
			Molpy.DragonExperience(Math.pow(10,npd.DragonType)/5);
			Molpy.Notify(atktxt + ' You are totally destroyed in a one sided fight.',1);
			break;

		case -1 : // lost a hard fight
			npd.ammount = 0;	
			Molpy.DragonExperience(Math.max(DeMolpify(local.exp)*numb, Math.pow(10,npd.DragonType)/5));
			Molpy.Notify(atktxt + ' You lost, but lost with dignity',1);
			break;

		case 0 : // Tie
			Molpy.Notify(atktxt + ' It\'s a tie - no idea what to do...',1);
			break;

		case 1 : // Pyric victory - lose a dragon...
			var dloss = 0;
			if (npd.ammount > 1) {
				npd.ammount--;
				dloss = 1;
				factor *=2;
			}
			var rectime = (dragstats.DragonType+1)*500/factor;
			if (Molpy.Spend('Healing Potion')) rectime/=5;
			if (Molpy.Spend('A Cup of Tea')) rectime/=2;
			rectime = Math.floor(rectime);
			dq.ChangeState(1,rectime);
			Molpy.Notify(atktxt + ' You won a very hard fight, ' + 
					(dloss?'losing 1 '+Molpy.DragonsById[dragstats.DragonType]+' and you':'but') +
					' will need to recover for ' + MolpifyCountdown(dq.countdown, 1),1);
			local.takeReward(numb,DeMolpify(local.exp)*numb/2); 
			break;

		case 2 : // won a hard fight - need to recover
			var rectime = (dragstats.DragonType+1)*250/factor;
			if (Molpy.Spend('Healing Potion')) rectime/=5;
			if (Molpy.Spend('A Cup of Tea')) rectime/=2;
			rectime = Math.floor(rectime);
			dq.ChangeState(1,rectime);
			Molpy.Notify(atktxt + ' You won a hard fight, but will need to recover for ' + 
					MolpifyCountdown(dq.countdown, 1),1);
			local.takeReward(numb,DeMolpify(local.exp)*numb); 
			break;

		case 3 : // Wipeout for no loss
			Molpy.Notify(atktxt + ' You wiped ' + (numb==1?(Math.random()<0.5?'him':'her'):'them') + 
					' out with ease',1);
			local.takeReward(numb,DeMolpify(local.exp)*numb*2); 
			break;
	}
	Molpy.DragonDigRecalcNeeded = 1;
}

Molpy.DragonKnightAttack = function() { // Attack Opponents
	Molpy.Redacted.onClick();
	npd = Molpy.NPdata[Molpy.HighestNPwithDragons];
	Molpy.OpponentsAttack(Molpy.HighestNPwithDragons,Molpy.HighestNPwithDragons+150*(1*Math.log(Molpy.Level('Princesses')+1)),
			' attacked your ' + Molpy.DragonsById[npd.DragonType].name + plural(npd.ammount) + ' at NP'+Molpy.HighestNPwithDragons);
}

Molpy.DragonsHide = function(type) {
	Molpy.Redacted.onClick();
	dq = Molpy.Boosts['DQ'];
	var hidetime = 42 * (type+1);
	dq.ChangeState(2,hidetime);
	Molpy.Notify('The Dragons are hiding for ' + hidetime + 'mnp');
}

// Upgrades ******************************************************************************************

// Type 0: to display, 1: action, 2: cost text
Molpy.DragonUpgrade = function(type) {
	var dq=Molpy.Boosts['DQ'];
	switch (type) {
	case 0:
		return (dq.experience >= Molpy.DragonsById[dq.Level].exp && Molpy.DragonsById[dq.Level].condition());
	case 1:
		if (dq.experience >= Molpy.DragonsById[dq.Level].exp && Molpy.DragonsById[dq.Level].condition()) {
			if (Molpy.Spend(Molpy.DragonsById[dq.Level].upgrade)) {
				dq.Level++;
				Molpy.Boosts['DQ'].Refresh();
				Molpy.Notify('Hatchlings now mature into '+ Molpy.DragonsById[dq.Level].name,1) + 's';
			} else {
				Molpy.Notify('You can\'t afford the upgrade yet');
			}
		} else {
			Molpy.Notify('You can\'t upgrade yet');
		}


	case 2:
		return Molpy.createPriceHTML(Molpy.DragonsById[dq.Level].upgrade);
	}
}



/* Ideas
 * Lets try science
 * OldPixBot
 * Binary
 * Dragon features -
 * - Legs (0,2,4,?)
 *   Multiple heads (1,3,9,27...) Russian mythology
 *   Fire breath
 *   Ice breath
 *   Fly (Magic &| Wings)
 *   Magic
 *   Water breath
 *   Poison
 *   Gas breath
 *   Hoard Treasure, Princesses, 
 *
 * Princesses are stuff, the more you have the more knights you attract
 * Pyramid of features:

TODO

Dragons
	What						Written	Tested					
-9	RDKM						Y	y
-8	NPdata persistence				y	y
-7	Nestlining					y	y
-6	Opponents					y	
1	Lay eggs					Y	Y
2	Feed hatchlings <- Goats, Princesses		Y	y
3	Fledge						y	y
4	Locals attack					y	y
5	Automatc Digging (intially slow)		y	y
5.1	Gold						y	y
5.2	Dimond						y	y
5.3	Other						y	y
6	Health effects					y	y
7	Beach Digging
7.1	dig						y	y
7.2	enable						y
8	Redundattacks					y	y
9	Opponents 
	9.1	Abilities				y	y
	9.2	Attack					y	y
	9.3	Rewards					y	y
10	Multiple Maps -> Multiple Nests, Multiple Queens,  Not launch
11	NPdata						y	y
12	Dragon Pane (Whats here)			y	y
12.1	For classic
13	Dragon Stats					y	y
13.1	For Classic
14	Dragon Overview Pane
14.1	For classic
15	Dragon Upgrades					y	y
16	Draglings					Y
17	DragonNewts					y
18	Wyrm						Not Launch
19	Wyvern						Not Launch
20	Diamond Tools and Moulds			Not Launch
21	Diamond Monuments				Not Launch
22	Breath effects					Not Launch
23	Magic						Not Launch
24	Mirror Dragons					Not Launch

Dig Finds (Other than Diamonds & Gold)
* Big Teeth
* Spines
* Tusks
* Adamintine armour in bits
* Mouthwash (to reduce bad breath backfires)
* Coal (for fires)
* Magic Rings (future)
* Magic Books (future)
* Magic Teeth
* Backet and spade (better digging)
* Bad dreams!
* Luck Rings
* Healing Potion
* Strength Potion

Other
1	Fading (~1k CDSP) cyclic AC boost		y	y
2	Panthers Ignore Einstein

*/

