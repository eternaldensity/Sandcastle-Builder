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

	// Methods 
	
	this.description = function() {
		var str = this.desc + '. They have: ' + (this.heads > 1?this.heads + ' heads, ':'');
		str +=(this.legs?this.legs:'No') + ' legs, ';
		str += (this.arms?this.arms:'No') + ' arms, ' + (this.wings?this.wings:'No') + ' wings ';
		str += ' and ' + (this.tails==0?'no tail.':(this.tails == 1?'a tail.':this.tails + ' tails.'));
		return str ;
	};
}

Molpy.DefineDragons = function() {

	new Molpy.Dragon({
		name: 'Dragling',
		legs: 4,
		wings: 0,
		fly: 0,
		heads: 1,
		arms: 0,
		tails: 1,
		upgrade: {Diamonds:100},
		exp: '10K',
		condition: function() { return true },
		desc: 'These small timid creatures hide in the shadows and under leaves keeping out of the way of fierce cats',
		digbase: 1,
		colour: '00ff00',
	});
	new Molpy.Dragon({
		name: 'DragonNewt',
		legs: 2,
		wings: 0,
		fly: 0,
		heads: 1,
		arms: 2,
		tails: 0,
		upgrade: {Diamonds:'10K'},
		exp: '20G',
		condition: function() { return false },
		desc: 'These high spirited diminutive dragons, stand nearly a Q tall and can wield weapons and spades.  They mean well...',
		digbase: 100,
		colour: '0080ff',
	});
	new Molpy.Dragon({
		name: 'Wyrm',
		legs: 0,
		wings: 2,
		fly: 1,
		heads: 1,
		arms: 0,
		tails: 1,
		upgrade: {Diamonds:'1G'},
		exp: '40P',
		condition: function() { return false },
		desc: 'These are monstorous, limbless creatures, with a big bite.',
		digbase: 1e4,
		colour: '0000ff',
	});
	new Molpy.Dragon({
		name: 'Wyvern',
		legs: 2,
		wings: 2,
		fly: 1,
		heads: 1,
		arms: 0,
		tails: 1,
		upgrade: {Diamonds:'1T'},
		exp: '80Z',
		condition: function() { return false },
		desc: 'These can fly.  They fight and dig with their legs, some have a bad breath.',
		digbase: 1e6,
		colour: '8000ff',
	});
	new Molpy.Dragon({
		name: 'Dragon',
		legs: 2,
		wings: 2,
		fly: 1,
		heads: 1,
		arms: 2,
		tails: 1,
		breath: ['fire'],
		upgrade: {Diamonds:'1T',Princesses:1},
		exp: '160U',
		condition: function() { return false },
		desc: 'Tradional Welsh Dragon',
		digbase: 1e8,
		colour: 'ff00ff',
	});
	new Molpy.Dragon({
		name: 'Noble Dragon',
		legs: 2,
		wings: 2,
		fly: 1,
		heads: 1,
		arms: 2,
		tails: 1,
		breath: ['fire'],
		magic: 1,
		upgrade: {Diamonds:'1T',Princesses:1},
		exp: '320H',
		condition: function() { return false },
		desc: 'Very large magical dragon',
		digbase: 1e11,
		colour: 'ff0000',
	});
	new Molpy.Dragon({
		name: 'Imperial Dragon',
		legs: 4,
		wings: 2,
		fly: 1,
		heads: 3,
		arms: 6,
		tails: 3,
		breath: ['fire','ice','poison'],
		magic: 2,
		upgrade: {Diamonds:'1T',Princesses:1},
		exp: '1T',
		condition: function() { return false },
		desc: 'These are the makers of ledgends, attacking with many heads in many ways, mortals don\'t want to be in the ssame universe as this.',
		digbase: 1e15,
		colour: '800000',
	});
	new Molpy.Dragon({
		name: 'NogarDragoN',
		legs: 66,
		wings: 66,
		fly: 1,
		heads: 9,
		arms: 66,
		tails: 9,
		breath: ['fire','ice','poison'],
		magic: 3,
		upgrade: {Diamonds:'1T',Princesses:1},
		exp: '1T',
		condition: function() { return false },
		desc: '!', // later
		digbase: 1e20,
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
		if (n > 1) str += 's each';
		str += ' armed ';
		var weapon = GLRschoice(this.armed);
		var first = weapon.charAt(0);
		var rest = weapon.substr(1);
		switch (first) {
		case '+':
			str += (n && n > 1)?'by the':'with the ';
			break;
		case '-': 
			str += 'with ';
			break;
		case '!':
			str += 'with an ';
			break;
		case '|':
			str += 'with ' + (n && n> 1?'their ':['his ','her '][this.gender]);
			break;
		default:
			str += 'with a '+first;
			break;
		}
		str += rest;
		return str;
	}

	this.attackval = function(n,where) { // [physical,magical]
		return [Math.pow(42,Math.exp(this.id/2))*n/1234,
		        Math.pow(777,Math.exp(this.id-10))*n/1764*(this.name == 'Pantheon of Gods'?Math.pow(1.5,where-2100):1)];
	};

	this.takeReward = function(n,exp) {
		var rwds= [];
		for (var stuff in this.reward) {
			var num = 0;
			var range = this.reward[stuff];
			var bits = range.toString().split('-');
			if (bits[1]) {
				var minval = DeMolpify(bits[0]);
				var maxval = DeMolpify(bits[1]);
				num = Math.floor(maxval * Math.random()+minval);
			} else {
				if (Math.random() < range) num = 1;
			}
			if (exp) Molpy.Add('exp',exp); 
			if (num) {
				if (stuff == 'Thing') {
					var thing = Molpy.FindThings();
					if (thing) rwds.push('A '+thing.single )
					else Molpy.Notify('No Thing!',1);
				} else {
					num *= (n||1);
					rwds.push(Molpify(num,2) + ' ' + stuff);
					if (stuff == 'Copper') { stuff = 'Gold'; num/=1000000; }
					else if (stuff == 'Silver') { stuff = 'Gold'; num/=1000; }
					Molpy.Add(stuff,num);
				}
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

// First char of armed: -(no a), !an, + the, |his/her, else a...
Molpy.DefineOpponents = function() {
	new Molpy.Opponent ({
		name: 'Serf',
		armed: ['stick', '-bare hands', 'turnip', '-bad words', 'bowl of dish water','|hamply','fish head'],
		reward: {Copper:'1-10',Thing:0.1},
		exp: 1,
	});

	new Molpy.Opponent ({
	 	name: 'Peasant',
		armed: ['sythe','pitchfork','hammer','knife','club','spade','dung fork','chair leg','bone','rock','pun','|wolfy'],
		reward: {Copper:'10-1000',Thing:0.15},
		exp: '1K',
	});

	new Molpy.Opponent ({
	 	name: 'Page',
		armed: ['dagger', 'staff', 'nice cup of tea', 'stileto', 'buckler', 'spear', 'crossbow', '-puns'],
		reward: {Silver:'1-100',Thing:0.2},
		exp: '1M',
	});

	new Molpy.Opponent ({
	 	name: 'Squire',
		armed: ['short sword', 'side sword','bow and arrows','mace','mandolin','polearm','!axe','hammer','|keyboard'],
		reward: {Silver:'100-10000',Diamonds:0.5,Thing:0.25},
		exp: '1G',
	});

	new Molpy.Opponent ({
	 	name: 'Knight',
		armed: ['long sword', '+arming sword', 'battle axe', 'morning star', 'lance'],
		reward: {Gold:'10-1000',Diamonds:'1-5',Thing:0.3},
		exp: '1P',
	});

	new Molpy.Opponent ({
	 	name: 'Baron',
		armed: ['bastard sword','flaming sword','hailstorm','tax demand'],
		reward: {Gold:'1K-1M',Diamonds:'1-50',Thing:0.35},
		exp: '1E',
	});

	new Molpy.Opponent ({
	 	name: 'Lord',
		armed: ['great sword','great axe','Kazoo','court jester','fire hose'],
		reward: {Gold:'100K-1G',Princesses:0.25,Diamonds:'50-50K',Thing:0.4},
		exp: '1Z',
	});

	new Molpy.Opponent ({
	 	name: 'Duke',
		armed: ['+Duchess','horde of servants','+gardeners','whip'],
		reward: {Gold:'1M-1T',Princesses:0.75,Diamonds:'50K-60H',Thing:0.45},
		exp: '1Y',
	});

	new Molpy.Opponent ({
	 	name: 'Emperor',
		armed: ['+staff of office','holy orb','+Imperial Guard','-Kamakazi Teddy Bears','!ICBM','+Storm Troopers','Death Star'],
		reward: {Gold:'10M-1E',Princesses:'1-10',Diamonds:'60H-80G',Thing:0.5},
		exp: '1U',
	});

	new Molpy.Opponent ({
	 	name: 'Paladin',
		armed: ['+Dragon slaying sword','Holy hand grenade','lot of bad puns','+Sword of the isles'],
		reward: {Gold:'100M-1Z',Princesses:'10-10K',Diamonds:'70G-100T',Thing:0.55},
		exp: '1S',
	});

	new Molpy.Opponent ({
	 	name: 'Hero',
		armed: ['+sword of sharpness','-Eds Axe','+Punsaw','Donut','-both feet','pea shooter','|fist of steel'],
		reward: {Gold:'1G-1Y',Princesses:'100-10M',Diamonds:'80T-120P',Thing:0.6},
		exp: '1F',
	});

	new Molpy.Opponent ({
	 	name: 'Demi-god',
		armed: ['pen (mightier than the sword)', 'cleaving axe','pitch fork', 'ballon'],
		reward: {Gold:'10G-1U',Princesses:'1K-10G',Diamonds:'90P-150E',Thing:0.65},
		exp: '1W',
	});

	new Molpy.Opponent ({
	 	name: 'Superhero',
		armed: ['-bare hands','turnip','bazooka','+Imperial Dragon Banishing Sword','+Great Cleaver' ],
		reward: {Gold:'1T-1S',Princesses:'1M-10P',Diamonds:'100E-200Z',Thing:0.7},
		exp: '1GW',
	});

	new Molpy.Opponent ({
	 	name: 'God',
		armed: ['+staff of might','+staff of comand','-dice','|holy symbol','|lightning strikes'],
		reward: {Gold:'10P-1F',Princesses:'1G-10Y',Diamonds:'120Z-500Y',Thing:0.75},
		exp: '1UW',
	});

	new Molpy.Opponent ({
	 	name: 'Panetheon of Gods',
		armed: ['-myths and ledgends','!army','flock of unicorns', '-heresey', '503', '-logic', '-typos'],
		reward: {Gold:'10E-1W',Princesses:'1T-10L',Diamonds:'200Y-1S',Thing:0.99},
		exp: '1WW',
	});
};

// NPdata **********************************************************

Molpy.NPdata = [];

Molpy.ClearNPdata = function() {
	Molpy.NPdata = [];
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
Molpy.DragonDigMultiplier = 10;
Molpy.DragonAttackMultiplier = 1;
Molpy.DragonDefenceMultiplier = 1;
Molpy.DragonBreathMultiplier = 1;
Molpy.ConsecutiveNPsWithDragons = 0;

Molpy.DragonDigRecalc = function() {
	Molpy.DragonDigRecalcNeeded = 0;

	Molpy.DragonDigMultiplier = 10;
	if (Molpy.Got('Bucket and Spade')) Molpy.DragonDigMultiplier *=2;
	if (Molpy.Got('Strength Potion')) Molpy.DragonDigMultiplier *=5;
	if (Molpy.Got('Lucky Ring')) Molpy.DragonDigMultiplier *=5;

	Molpy.DragonDefenceMultiplier = 1;
	if (Molpy.Got('Lucky Ring')) Molpy.DragonDefenceMultiplier *= 2;
	if (Molpy.Got('Healing Potion')) Molpy.DragonDefenceMultiplier *= 1.5;
	if (Molpy.Got('Ooo Shiny!')) Molpy.DragonDefenceMultiplier *= (1+Math.log(Molpy.Level('Gold')));
	if (Molpy.Got('Spines')) Molpy.DragonDefenceMultiplier *= Math.pow(1.2,Molpy.Level('Spines'));
	if (Molpy.Got('Adamantine Armour')) Molpy.DragonDefenceMultiplier *= Math.pow(2,Molpy.Level('Adamantine Armour'));

	Molpy.DragonAttackMultiplier = 1;
	if (Molpy.Got('Big Teeth')) Molpy.DragonAttackMultiplier *= Math.pow(1.2,Molpy.Level('Big Teeth'));
	if (Molpy.Got('Magic Teeth')) Molpy.DragonAttackMultiplier *= Math.pow(10,Molpy.Level('Magic Teeth'));
	if (Molpy.Got('Tusks')) Molpy.DragonAttackMultiplier *= Math.pow(2,Molpy.Level('Tusks'));
	
	Molpy.DragonBreathMultiplier = 1;


	var td = 0;
	Molpy.TotalNPsWithDragons = 0;
	Molpy.TotalDragons = 0;
	Molpy.HighestNPwithDragons = 0;
	Molpy.ConsecutiveNPsWithDragons = 0;
	var runlength = 0;
	var lastNP = 0;
	for (var dpx in Molpy.NPdata) {
		dnp = Molpy.NPdata[dpx];
		if (dnp && dnp.amount) {
			td += (dnp.amount*dnp.dig*Molpy.DragonsById[Molpy.Level('DQ')].digbase || 0);
			Molpy.TotalNPsWithDragons++;
			Molpy.TotalDragons += dnp.amount;
			Molpy.HighestNPwithDragons = dpx*1;
			runlength++;
			var dpi = dpx*1;
			if (lastNP+1 == dpi ) {
				if (runlength > Molpy.ConsecutiveNPsWithDragons) Molpy.ConsecutiveNPsWithDragons = runlength;
			} else {
				runlength = 1;
			};
			lastNP = dpi;
		} else {
			lastNP = runlength = 0;
		}
	}
	if (Molpy.TotalDragons) td += 0.001;
	Molpy.DragonDigRate = td*Molpy.DragonDigMultiplier;

	if (Molpy.ConsecutiveNPsWithDragons >= 10) Molpy.UnlockBoost('Incubator');
	if (Molpy.ConsecutiveNPsWithDragons >= 22) Molpy.UnlockBoost('Wait for it');
	if (Molpy.ConsecutiveNPsWithDragons >= 48) Molpy.UnlockBoost('Q04B');
	if (Molpy.ConsecutiveNPsWithDragons >= 99) Molpy.UnlockBoost('Cryogenics');
}

Molpy.DragonDigging = function(type) { // type:0 = mnp, 1= beach click
	var dq = Molpy.Boosts['DQ'];
	if (Molpy.DragonDigRate == 0 && Molpy.DragonDigRecalcNeeded == 0 || dq.overallState) return;
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
					strs.push(Molpify(n) + ' ' +stuff);
				} else if (n == 1) {
					strs.push(Molpify(n) + ' ' +Molpy.Boosts[stuff].single);
				} else {
					strs.push(Molpify(n) + ' ' +Molpy.Boosts[stuff].plural);
				}
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
	
	if (Molpy.DragonDigRecalcNeeded) Molpy.DragonDigRecalc();
	Molpy.DigValue += (type?Molpy.TotalNPsWithDragons*(1+dq.Level):Molpy.DragonDigRate)*Math.random();
	if (Molpy.DigValue < 1) return;
	Molpy.EarnBadge('Found Something!');
	var finds = Math.max(Math.floor(Molpy.DigValue),1);
	Molpy.DigValue -= finds;
//	Molpy.Notify('Found '+ finds + ' things',1);
	var found = '';
	var n = 0;
	if (Math.random() < 0.5 || Math.random()<0.99/Math.log(finds+0.7)) { // Find coins
		found = 'Gold';
		n = finds/1000000;
		Molpy.Add(found,n);
	} else { // Find Diamonds 
		found = 'Diamonds';
		n = Math.max(Math.floor(Math.log(finds)),1);
		Molpy.Add(found,n);
		Molpy.EarnBadge('Wheee Diamonds');
	} // May find other things later - kit is not here
	if (found) {
//		Molpy.Notify('Found ' + n + ' ' + found,1);
		var f = dq.finds++;
		if (f > 20) Molpy.UnlockBoost('Beach Dragon');
		if (Molpy.DiggingFinds[found]) {
			Molpy.DiggingFinds[found] += n;
		} else {
			Molpy.DiggingFinds[found] = n;
		}
	}
}

Molpy.FindThings = function() {
	var dqlevel = Molpy.Level('DQ');
	var availRewards = [];
	for( var i in Molpy.Boosts) {
		var me = Molpy.Boosts[i];
		if("draglvl" in me && Molpy.Dragons[me.draglvl].id <= dqlevel) {
			var lim = EvalMaybeFunction((me.limit || 1),me);      
			if (me.bought == me.unlocked && me.bought < lim) availRewards.push(me);
		}
	}
//		Molpy.Notify('List length '+ availRewards.length);
	var thing = GLRschoice(availRewards);
	if (thing) {
		Molpy.UnlockBoost(thing);
	}
	return thing;
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

	if (npd && npd.amount > 0 && (npd.DragonType < dq.Level || (npd.DragonType == dq.Level && hatch.clutches[clutch] > npd.amount)))	{ // Replace
		oldDT = npd.DragonType;
		oldDN = npd.amount;
		fight = 0;
	}
	npd.DragonType = dq.Level;
	npd.amount = hatch.clutches[clutch];
	if (npd.amount > lim) {
		if (lim < 0) {
			waste = npd.amount;
			npd.amount = 0;
		} else {
			waste = Math.max(npd.amount - lim,0);
			npd.amount = Math.max(0,lim);
		}
	}

	if (npd.amount) {
		var props = hatch.properties.slice(clutch*Molpy.DragonStats.length,(clutch+1)*Molpy.DragonStats.length);
		npd.attack = props[0];
		npd.defence= props[1];
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

		Molpy.Notify(Molpify(npd.amount) + ' ' + Molpy.DragonsById[npd.DragonType].name +
				(npd.amount ==1?' has':'s have') +' fledged at NP'+Molpy.newpixNumber,1);
		if (oldDN) Molpy.Notify('Replacing '+Molpify(oldDN)+' '+Molpy.DragonsById[oldDT].name,1);
	}
	if (waste) Molpy.Notify('There was not enough space for '+(npd.amount?Molpify(waste):'any')+' of them',1);
	hatch.clutches[clutch] = 0;
	hatch.clean(1);

	if (fight && npd.amount) Molpy.OpponentsAttack(Molpy.newpixNumber,Molpy.newpixNumber,' attacks as you fledge',' attack as you fledge');
	if (npd.amount) Molpy.EarnBadge('First Colonist');
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
	var num = npd.amount;
	if (!npd) return Stats;
	for(var prop in npd) {
		if(typeof npd[prop] !== 'undefined' && prop != 'amount' && prop != 'DragonType') Stats[prop] = npd[prop]*num;
	}

	Stats.defence += 0.001;
	Stats.attack += 0.001;
	Stats.defence *= Molpy.DragonDefenceMultiplier;
	Stats.attack *= Molpy.DragonAttackMultiplier;
	return Stats;
}

Molpy.OpponentsAttack = function(where,from,text1,text2) {
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
	local.gender = 1*(Math.random() < 0.5);
	var atktxt = local.attackstxt(numb) + ((numb> 1 && text2)?text2:text1) + '. ';
	var atkval = local.attackval(numb,where);

	Molpy.DragonDigRecalc(); 
	var dragstats = Molpy.DragonStatsNow(where);
	var result = 0;
	var localhealth = atkval[0]+atkval[1];
	var dragnhealth = dragstats.defence || 0;
	var factor = 1;
	var loops = 0;
	if (numb > 1) Molpy.EarnBadge('There are two of them!');
	dq.totalfights++;

//	Molpy.Notify('atkval = '+atkval[0]+' drag hlth = '+dragnhealth+' attack= '+dragstats.attack,1);
	
	while (result == 0 && loops<=100) {
		if ((loops&1)==0) { // Magical attacks && Breath attacks
	
			// TODO

		} else { // Physical attacks
			localhealth -= (dragstats.attack || 0)*Math.random();
			if (loops >1 || dragstats.attack < 10*atkval[0]) dragnhealth -= atkval[0]*Math.random();

		};
//		Molpy.Notify('loop = ' + loops + ' local = '+localhealth+' dragon = '+dragnhealth,1);
		if (dragnhealth < 0) {
			if (localhealth < 0) result = -1
			else result = -1 -(dragnhealth < -dragstats.defence);
		} else if (localhealth < 0) {
//			Molpy.Notify('result ='+ result+' localneg = '+localhealth,1);
			factor = dragnhealth/dragstats.defence;
//			Molpy.Notify('factor ='+ factor,1);
			if (factor > 0.9) result = 3
			else if (factor > 0.5 || npd.amount == 1) result = 2
			else result = 1;
		}
		loops++;
	}

	switch (result) {
		case -2 : // wipeout
			dq.Loose(npd.DragonType,npd.amount);
			npd.amount = 0;
			Molpy.Add('exp',Math.pow(10,npd.DragonType)/5);
			Molpy.Notify(atktxt + ' You are totally destroyed in a one sided fight.',1);
			break;

		case -1 : // lost a hard fight
			dq.Loose(npd.DragonType,npd.amount);
			npd.amount = 0;	
			Molpy.Add('exp',Math.max(DeMolpify(local.exp)*numb, Math.pow(10,npd.DragonType)/5));
			Molpy.Notify(atktxt + ' You lost, but lost with dignity',1);
			break;

		case 0 : // Tie
			Molpy.Notify(atktxt + ' It\'s a tie - no idea what to do...',1);
			break;

		case 1 : // Pyric victory - lose a dragon...
			var dloss = 0;
			if (npd.amount > 1) {
				npd.amount--;
				dloss = 1;
				factor *=2;
			}
			var rectime = Math.min((dragstats.DragonType+1)*200/factor,(dq.Level+1)*2000);
			if (Molpy.Spend('Healing Potion',1)) rectime/=5;
			if (Molpy.Spend('Cup of Tea',1)) rectime/=2;
			rectime = Math.floor(rectime);
			dq.ChangeState(1,rectime);
			Molpy.Notify(atktxt + ' You won a very hard fight, ' + 
					(dloss?'losing 1 '+Molpy.DragonsById[dragstats.DragonType].name+' and you':'but') +
					' will need to recover for ' + MolpifyCountdown(dq.countdown, 1),1);
			local.takeReward(numb,DeMolpify(local.exp)*numb); 
			break;

		case 2 : // won a hard fight - need to recover
			var rectime = Math.min((dragstats.DragonType+1)*100/factor,(dq.Level+1)*1500);
			if (Molpy.Spend('Healing Potion',1)) rectime/=5;
			if (Molpy.Spend('Cup of Tea',1)) rectime/=2;
			rectime = Math.floor(rectime);
			dq.ChangeState(1,rectime);
			Molpy.Notify(atktxt + ' You won a hard fight, but will need to recover for ' + 
					MolpifyCountdown(dq.countdown, 1),1);
			local.takeReward(numb,DeMolpify(local.exp)*numb*2); 
			break;

		case 3 : // Wipeout for no loss
			if (npd.DragonType) {
				Molpy.Notify(atktxt + ' You wiped ' + (numb==1?['him','her'][local.gender]:'them') + 
					' out with ease',1);
			} else {
				Molpy.Notify(atktxt + ' You scared ' + (numb==1?['him','her'][local.gender]:'them') + 
					' away with ease',1);
			}
			local.takeReward(numb,DeMolpify(local.exp)*numb); 
			if (dq.overallState) {
				Molpy.Notify('Your heroic victory inspires the others to go back to work',1);
				dq.ChangeState(0);
			}
			break;
	}
	Molpy.DragonDigRecalcNeeded = 1;
}

Molpy.DragonKnightAttack = function() { // Attack Opponents
	Molpy.Redacted.onClick();
	var atk = Molpy.HighestNPwithDragons;
	if (Math.random()<.25) {
		var di = Math.random()*Molpy.TotalNPsWithDragons;
		var found = 0;
		for (var np=1; np<=atk; np++) {
			if (Molpy.NPdata[np] && Molpy.NPdata[np].amount) {
				found++;
				if (found >= di) {
					atk = np;
					break;
				}
			}
		}
	}

	npd = Molpy.NPdata[atk];
	var atklvl = Math.max(atk,300*npd.DragonType)+30*(Molpy.Level('DQ')+1)+150*(1*Math.log(Molpy.Level('Princesses')+1));
	atklvl = (Math.random() < 0.5)?Math.max(0,atklvl-Math.floor(30*Math.random())):atklvl+Math.floor(30*Math.random()))

	Molpy.OpponentsAttack(atk,atklvl,
			' attacked your ' + Molpy.DragonsById[npd.DragonType].name + plural(npd.amount) + ' at NP'+atk);
}

Molpy.DragonsHide = function(type) {
	Molpy.Redacted.onClick();
	dq = Molpy.Boosts['DQ'];
	var hidetime = Math.max(2,Math.ceil(42 * (type+1)-7*Molpy.Level('Camelflarge')));
	dq.ChangeState(2,hidetime);
	Molpy.Notify('The Dragons are hiding for ' + hidetime + 'mnp');
}

// Upgrades ******************************************************************************************

// Type 0: to display, 1: action, 2: cost text
Molpy.DragonUpgrade = function(type) {
	var dq=Molpy.Boosts['DQ'];
	switch (type) {
	case 0:
		return (dq.experience >= DeMolpify(Molpy.DragonsById[dq.Level].exp) && Molpy.DragonsById[dq.Level].condition());
	case 1:
		if (Molpy.DragonUpgrade(0)) {
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

// Cryo ******************************************************************************************

Molpy.DragonsToCryo = function(cl) {
	var hatch = Molpy.Boosts['Hatchlings'];
	Molpy.Add('Cryogenics',hatch.clutches[cl]);
	hatch.clutches[cl] = 0;
	hatch.clean(1);
	hatch.Refresh();
	Molpy.Notify('Now in suspended animation');
}

Molpy.DragonsFromCryo = function() { // Cut down version of fledge
	var npd = Molpy.NPdata[Molpy.newpixNumber];
	var dq = Molpy.Boosts['DQ'];
	var lim = Molpy.MaxDragons();
	var waste = 0;
	var oldDT = 0;
	var oldDN = 0;
	var fight = 1;
	if (!npd) npd = Molpy.NPdata[Molpy.newpixNumber] = {};

	if (npd && npd.amount > 0 && (npd.DragonType < dq.Level || (npd.DragonType == dq.Level && Molpy.Level('Cryogenics') > npd.amount))) { // Replace
		oldDT = npd.DragonType;
		oldDN = npd.amount;
		fight = 0;
	}
	npd.DragonType = dq.Level;
	npd.amount = Molpy.Level('Cryogenics');
	if (npd.amount > lim) {
		if (lim < 0) {
			waste = npd.amount;
			npd.amount = 0;
		} else {
			waste = Math.max(npd.amount - lim,0);
			npd.amount = Math.max(0,lim);
		}
	}

	var props = Molpy.Boosts['Nest'].nestprops();
	npd.attack = props[0];
	npd.defence= props[1];
	npd.dig    = props[2];
	npd.breath = props[3]/2;
	npd.magic1 = 0;
	npd.magic2 = 0;
	npd.magic3 = 0;
	Molpy.Boosts['Cryogenics'].power = 0;
	
	Molpy.Notify(Molpify(npd.amount) + ' ' + Molpy.DragonsById[npd.DragonType].name +
				(npd.amount ==1?' has':'s have') +' fledged at NP'+Molpy.newpixNumber,1);
	if (oldDN) Molpy.Notify('Replacing '+Molpify(oldDN)+' '+Molpy.DragonsById[oldDT].name,1);
	if (waste) Molpy.Notify('There was not enough space for '+(npd.amount?Molpify(waste):'any')+' of them',1);

	if (fight && npd.amount) Molpy.OpponentsAttack(Molpy.newpixNumber,Molpy.newpixNumber,' attacks as you fledge',' attack as you fledge');
	Molpy.DragonDigRecalc(); // Always needed
}


/* Ideas
 * Lets try science
 * OldPixBot
 * Binary
 * Dragon features -
 *   Fire breath
 *   Ice breath
 *   Fly (Magic &| Wings)
 *   Magic
 *   Water breath
 *   Poison
 *   Gas breath

TODO

Dragons
	What						Written	Tested					
10	Multiple Maps -> Multiple Nests, Multiple Queens,  Not launch
14	Dragon Overview Pane				Started
14.1	For classic					Not Launch
18	Wyrm						Not Launch
19	Wyvern						Not Launch
20	Diamond Tools and Moulds			Plans only, making/using impossible
21	Diamond Monuments				Not Launch
22	Breath effects					Not Launch
23	Magic						Not Launch
24	Mirror Dragons					Not Launch
29	Mould making					some progress
30	Recalibrated fights				
35	Move Experience to own boost			y
36	No kit from digging
37	Kit from fights
38	Varriable opponents
39	Linear kit
40	Hubble Double instead of automatic		y
41	Cost of some kit boosts will be experience
42	Reduce Save Scumming				y	y




* Mouthwash (to reduce bad breath backfires)
* Coal (for fires)
* Magic Rings (future)
* Magic Books (future)
* Bad dreams!
* Luck Rings

Other
2	Panthers Ignore Einstein 
5


*/

