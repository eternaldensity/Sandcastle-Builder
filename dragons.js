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
		if (this.wings && !Molpy.Got('Dragonfly')) str += ' However, they have not yet learnt how to fly.';
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
		defbase: 1,
		colour: '#0f0',
	});
	new Molpy.Dragon({
		name: 'DragonNewt',
		legs: 2,
		wings: 0,
		fly: 0,
		heads: 1,
		arms: 2,
		tails: 0,
		upgrade: {Diamonds:'1M'},
		exp: '1T',
		condition: function() { return true },
		desc: 'These high spirited diminutive dragons stand nearly a Q tall and can wield weapons and spades.  They mean well...',
		digbase: 100,
		defbase: 100,
		colour: '#08f',
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
		exp: '1E',
		condition: function() { return true },
		desc: 'These are monstrous, limbless creatures, with a big bite.',
		digbase: 10000,
		defbase: 100000,
		colour: '#00f',
	});
	new Molpy.Dragon({
		name: 'Wyvern',
		legs: 2,
		wings: 2,
		fly: 1,
		heads: 1,
		arms: 0,
		tails: 1,
		breath: ['fire'],
		upgrade: {Diamonds:'1T'},
		exp: '80Z',
		condition: function() { return false },
		desc: 'These can fly.  They fight and dig with their legs, some have a bad breath.',
		digbase: 1e6,
		defbase: 1e8,
		breathbase: 1,
		colour: '#80f',
	});
	new Molpy.Dragon({
		name: 'Dragon',
		legs: 2,
		wings: 2,
		fly: 1,
		heads: 1,
		arms: 2,
		tails: 1,
		breath: ['fire','ice'],
		upgrade: {Diamonds:'1T',Princesses:1},
		exp: '160U',
		condition: function() { return false },
		desc: 'Tradional Welsh Dragon',
		digbase: 1e8,
		defbase: 1e11,
		breathbase: 1e4,
		colour: '#f0f',
	});
	new Molpy.Dragon({
		name: 'Noble Dragon',
		legs: 2,
		wings: 2,
		fly: 1,
		heads: 1,
		arms: 2,
		tails: 1,
		breath: ['fire','ice','poison'],
		magic: 1,
		upgrade: {Diamonds:'1T',Princesses:1},
		exp: '320H',
		condition: function() { return false },
		desc: 'Very large magical dragon',
		digbase: 1e11,
		defbase: 1e14,
		breathbase: 1e9,
		colour: '#f00',
	});
	new Molpy.Dragon({
		name: 'Imperial Dragon',
		legs: 4,
		wings: 2,
		fly: 1,
		heads: 3,
		arms: 6,
		tails: 3,
		breath: ['fire','ice','poison','special1',],
		magic: 2,
		upgrade: {Diamonds:'1T',Princesses:1},
		exp: '1T',
		condition: function() { return false },
		desc: 'These are the makers of legends, attacking with many heads in many ways. Mortals don\'t want to be in the same universe.',
		digbase: 1e15,
		defbase: 1e17,
		breathbase: 1e16,		
		colour: '#800',
	});
	new Molpy.Dragon({
		name: 'NogarDragoN',
		legs: 66,
		wings: 66,
		fly: 1,
		heads: 9,
		arms: 66,
		tails: 9,
		breath: ['fire','ice','poison','special1','special2'],
		magic: 3,
		upgrade: {Diamonds:'1T',Princesses:1},
		exp: '1T',
		condition: function() { return false },
		desc: '!', // later
		digbase: 1e20,
		defbase: 1e20,
		breathbase: 1e25,
		colour: '#8F8',
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
	this.attackstxt = function(df,from) {
		var n = df.numb;
		var str = '' + ((n && n > 1)?Molpify(n):'A') + ' ' + this.name;
		if (n > 1) str += 's' + (from?' from NP'+from:'') + ' each'
		else if (from) str += ' from NP'+from;
		str += (this.modifier > 1)?' defensively':' offensively'
		str += ' armed ';
		var weapon = GLRschoice(this.armed);
		var first = weapon.charAt(0);
		var rest = weapon.substr(1);
		switch (first) {
		case '+':
			str += (n && n > 1)?'by the ':'with the ';
			break;
		case '-': 
			str += 'with ';
			break;
		case '!':
			str += 'with an ';
			break;
		case '|':
			str += 'with ' + (n && n> 1?'their ':['his ','her '][df.gender]);
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

	this.takeReward = function(n,exp,blitz,loops) {
		var rwds= [];
		var second = 0;
		for (var stuff in this.reward) {
			var num = 0;
			var range = this.reward[stuff];
			var bits = range.toString().split('-');
			if (bits[1]) {
				var minval = DeMolpify(bits[0]);
				var maxval = DeMolpify(bits[1]);
				num = Math.floor(maxval * Math.random()+minval);
			} else {
				if ((Math.random() < range + blitz)||((range + blitz <= 0.10)&&(Math.random() < 0.10))){
					if(range + blitz - Math.random() > 1){
						Molpy.EarnBadge('Two Pots O\' Gold');
						second++;
					}
				num++;
				}
			}
			if (num) {
				if (stuff == 'Thing') {
					var thing = Molpy.FindThings();
					if(thing) rwds.push('A' + (thing.single.match(/^[aeiou]/i)?'n ':' ') + thing.single );
//					if(second) rwds.push('A' + (thing.single.match(/^[aeiou]/i)?'n ':' ') + thing.single);
				} else {
					num *= (n||1);
					if (Molpy.Got('Tuple or Nothing') && stuff == 'Gold') num*= Math.pow(1.618,loops);
					if (stuff == 'Copper' || stuff == 'Silver') {
						pstuff = stuff;
					} else {
						bstuff = Molpy.Boosts[stuff];
						pstuff = num == 1 ? bstuff.single : bstuff.plural;
					}
					rwds.push(Molpify(num,2) + ' ' + pstuff);
					if (stuff == 'Copper') { stuff = 'Gold'; num/=1000000; }
					else if (stuff == 'Silver') { stuff = 'Gold'; num/=1000; }
					Molpy.Add(stuff,num);
				}
			}
		};
		if (exp) Molpy.Add('exp',exp); 
		if (rwds.length && !Molpy.boostSilence) {
			Molpy.Notify('After the fight you get ' + rwds.join(', ')/* + (rwds[1])? rwds.join(', '):''*/ + (exp?' and '+Molpify(exp) +' experience':''),0);
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
		reward: {Copper:'1-10',Thing:0.2},
		exp: 1,
	});

	new Molpy.Opponent ({
	 	name: 'Peasant',
		armed: ['scythe','pitchfork','hammer','knife','club','spade','dung fork','chair leg','bone','rock','pun','|wolfy'],
		reward: {Copper:'10-1000',Thing:0.25},
		exp: '1K',
	});

	new Molpy.Opponent ({
	 	name: 'Page',
		armed: ['dagger', 'staff', 'nice cup of tea', 'stiletto', 'buckler', 'spear', 'crossbow', '-puns'],
		reward: {Silver:'1-100',Thing:0.3},
		exp: '1M',
	});

	new Molpy.Opponent ({
	 	name: 'Squire',
		armed: ['short sword', 'side sword','bow and arrows','mace','mandolin','polearm','!axe','hammer','|keyboard'],
		reward: {Silver:'100-10000',Diamonds:0.5,Thing:0.35},
		exp: '1G',
	});

	new Molpy.Opponent ({
	 	name: 'Knight',
		armed: ['long sword', '|arming sword', 'battle axe', 'morning star', 'lance'],
		reward: {Gold:'10-1000',Diamonds:'1-5',Thing:0.4},
		exp: '1T',
	});

	new Molpy.Opponent ({
	 	name: 'Baron',
		armed: ['bastard sword','flaming sword','hailstorm','tax demand'],
		reward: {Gold:'1K-1M',Diamonds:'1-50',Thing:0.45},
		exp: '1P',
	});

	new Molpy.Opponent ({
	 	name: 'Lord',
		armed: ['great sword','great axe','kazoo','court jester','fire hose'],
		reward: {Gold:'100K-1G',Princesses:0.05,Diamonds:'50-50K',Thing:0.5},
		exp: '1E',
	});

	new Molpy.Opponent ({
	 	name: 'Duke',
		armed: ['+Duchess','horde of servants','+gardeners','whip'],
		reward: {Gold:'1M-1T',Princesses:0.50,Diamonds:'50K-60M',Thing:0.55},
		exp: '1Z',
	});

	new Molpy.Opponent ({
	 	name: 'Emperor',
		armed: ['+staff of office','holy orb','+Imperial Guard','-Kamakazi Teddy Bears','!ICBM','+Storm Troopers','Death Star'],
		reward: {Gold:'10M-1E',Princesses:'1-10',Diamonds:'60M-80G',Thing:0.6},
		exp: '1Y',
	});

	new Molpy.Opponent ({
	 	name: 'Paladin',
		armed: ['+Dragon slaying sword','Holy hand grenade','lot of bad puns','+Sword of the isles'],
		reward: {Gold:'100M-1Z',Princesses:'10-10K',Diamonds:'70G-100T',Thing:0.65},
		exp: '1U',
	});

	new Molpy.Opponent ({
	 	name: 'Hero',
		armed: ['+sword of sharpness','-Eds Axe','+Punsaw','Donut','-both feet','pea shooter','|fist of steel'],
		reward: {Gold:'1G-1Y',Princesses:'100-10M',Diamonds:'80T-120P',Thing:0.7},
		exp: '1F',
	});

	new Molpy.Opponent ({
	 	name: 'Demi-god',
		armed: ['pen (mightier than the sword)', 'cleaving axe','pitch fork', 'balloon'],
		reward: {Gold:'10G-1U',Princesses:'1K-10G',Diamonds:'90P-150E',Thing:0.75},
		exp: '1W',
	});

	new Molpy.Opponent ({
	 	name: 'Superhero',
		armed: ['-bare hands','turnip','bazooka','+Imperial Dragon Banishing Sword','+Great Cleaver' ],
		reward: {Gold:'1T-1S',Princesses:'1M-10P',Diamonds:'100E-200Z',Thing:0.8},
		exp: '1GW',
	});

	new Molpy.Opponent ({
	 	name: 'God',
		armed: ['+staff of might','+staff of command','-dice','|holy symbol','|lightning strikes'],
		reward: {Gold:'10P-1F',Princesses:'1G-10Y',Diamonds:'120Z-500Y',Thing:0.85},
		exp: '1UW',
	});

	new Molpy.Opponent ({
	 	name: 'Pantheon of Gods',
		armed: ['-myths and legends','!army','flock of unicorns', '-heresey', '503', '-logic', '-typos'],
		reward: {Gold:'10E-1W',Princesses:'1T-10L',Diamonds:'200Y-1S',Thing:0.99},
		exp: '1WW',
	});
};

// NPdata **********************************************************

Molpy.NPdata = {};

Molpy.ClearNPdata = function() {
	Molpy.NPdata = {};
};
Molpy.NextLegalNP=function(at){
	var frac = Number(((Math.abs(at*10)-Math.floor(Math.abs(at))*10)/10).toFixed(3))
	if(at < -1){
		if(Molpy.fracParts.indexOf(frac)>-1){
			if(Molpy.fracParts.indexOf(frac)>0){
				return ((-1)*(Math.floor(Math.abs(at))+Molpy.fracParts[Molpy.fracParts.indexOf(frac)-1]));
			}else{
				return ((-1)*(Math.floor(Math.abs(at))))
			}
		}else{
			return ((-1)*((Math.floor(Math.abs(at)))-1+Molpy.fracParts[Molpy.fracParts.length-1]));
		}
	}else if(at >= 1){
		if(Molpy.fracParts.indexOf(frac)>-1){
			if(Molpy.fracParts.indexOf(frac)<(Molpy.fracParts.length-1)){
				return (Math.floor(Math.abs(at))+Molpy.fracParts[Molpy.fracParts.indexOf(frac)+1]);
			}else{
				return (Math.floor(Math.abs(at))+1);
			}
		}else{
			return (at+Molpy.fracParts[0]);
		}
	}else if (at == -1){
		return 0;
	}else{
		return 1;
	}
}
Molpy.NPRange = function(start,end){ // weird placement, but needed for the next one
	var at=start;
	var ans=[];
	while(at<=end){
		ans.push(at)
		at=Molpy.NextLegalNP(at)
	}
	return ans
}

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
Molpy.DragonLuck = 0;
Molpy.HideMod = 0;
Molpy.ConsecutiveNPsWithDragons = 0;

Molpy.DragonDigRecalc = function() {
	Molpy.DragonDigRecalcNeeded = 0;

	Molpy.DragonDigMultiplier = 10;
	if (Molpy.Got('Bucket and Spade')) Molpy.DragonDigMultiplier *=2;
	if (Molpy.Has('Strength Potion',2 + Molpy.Boosts['Strength Potion'].power)) Molpy.DragonDigMultiplier *= (2+Molpy.Boosts['Strength Potion'].power);
	if (Molpy.Got('Golden Bull')) Molpy.DragonDigMultiplier *=5;
	
	Molpy.DragonDefenceMultiplier = 1;
	if (Molpy.Has('Healing Potion',2 + Molpy.Boosts['Healing Potion'].power)) Molpy.DragonDefenceMultiplier *= 1.5*(1+Molpy.Boosts['Healing Potion'].power);
	if (Molpy.Got('Ooh, Shiny!')) Molpy.DragonDefenceMultiplier *= (1+Math.log(Molpy.Level('Gold')));
	if (Molpy.Got('Clannesque')) Molpy.DragonDefenceMultiplier *= (1+Math.log(Molpy.Level('Cryogenics')));
	if (Molpy.Got('Spines')) Molpy.DragonDefenceMultiplier *= Math.pow(1.2,Molpy.Level('Spines'));
	if (Molpy.Got('Adamantine Armour')) Molpy.DragonDefenceMultiplier *= Math.pow(2,Molpy.Level('Adamantine Armour'));
	if (Molpy.Got('Mirror Scales')) Molpy.DragonDefenceMultiplier *= Math.pow(4,Molpy.Level('Mirror Scales'));
	if (Molpy.Got('Baobab Tree Fort')) Molpy.DragonDefenceMultiplier *= 4;
	if (Molpy.Got('WotT')) Molpy.DragonDefenceMultiplier *= 100;

	Molpy.DragonAttackMultiplier = 1;
	if (Molpy.Got('Big Teeth')) Molpy.DragonAttackMultiplier *= Math.pow(1.2,Molpy.Level('Big Teeth'));
	if (Molpy.Got('Magic Teeth')) Molpy.DragonAttackMultiplier *= Math.pow(10,Molpy.Level('Magic Teeth'));
	if (Molpy.Got('Tusks')) Molpy.DragonAttackMultiplier *= Math.pow(2,Molpy.Level('Tusks'));
	if (Molpy.Got('Big Bite')) Molpy.DragonAttackMultiplier *= Math.pow(1.5,Molpy.Level('Big Bite'));
	if (Molpy.Got('Double Byte')) Molpy.DragonAttackMultiplier *= Math.pow(2,Molpy.Level('Double Byte'));
	if (Molpy.Got('Trilobite')) Molpy.DragonAttackMultiplier *= Math.pow(4,Molpy.Level('Trilobite'));
	if (Molpy.Got('Diamond Dentures')) Molpy.DragonAttackMultiplier *= 2;
	if (Molpy.Got('WotP')) Molpy.DragonAttackMultiplier *= 100;

	Molpy.DragonBreathMultiplier = 1;
	if(Molpy.Got('Autumn of the Matriarch')) Molpy.DragonBreathMultiplier *= Molpy.Boosts['DQ'].totalloses;
	if(Molpy.Got('MQALLOBS')) Molpy.DragonBreathMultiplier *= 10;
	Molpy.DragonBreathMultiplier *= (Molpy.Boosts['Catalyzer'].power || 1);

	Molpy.DragonLuck = 0;
	if (Molpy.Got('Lucky Ring')) Molpy.DragonLuck += .0277;
	if (Molpy.Has('Cup of Tea',2 + Molpy.Boosts['Cup of Tea'].power)) Molpy.DragonLuck += .0005*(1+Molpy.Boosts['Cup of Tea'].power);

	Molpy.HideMod = 0;
	if (Molpy.Got('Chintzy Tiara')) Molpy.HideMod += 22;

	if(Molpy.CombatDebug) Molpy.Notify('Def: ' + Molpy.DragonDefenceMultiplier);
	if(Molpy.CombatDebug) Molpy.Notify('Atk: ' + Molpy.DragonAttackMultiplier);

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
			td += (dnp.amount*dnp.dig*Molpy.DragonsById[dnp.DragonType].digbase || 0);
			Molpy.TotalNPsWithDragons++;
			Molpy.TotalDragons += dnp.amount;
			if ((dpx*1) > Molpy.HighestNPwithDragons){
				Molpy.HighestNPwithDragons = dpx*1;
			}
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
	Molpy.DragonDigMultiplier *= Math.exp(1+Molpy.HighestNPwithDragons/365)/Math.E;
	Molpy.DragonDigRate = td*Molpy.DragonDigMultiplier;

	if (Molpy.ConsecutiveNPsWithDragons >= 10) Molpy.UnlockBoost('Incubator');
	if (Molpy.ConsecutiveNPsWithDragons >= 22) Molpy.UnlockBoost('Wait for it');
	if (Molpy.ConsecutiveNPsWithDragons >= 48) Molpy.UnlockBoost('Q04B');
	if (Molpy.ConsecutiveNPsWithDragons >= 99) Molpy.UnlockBoost('Cryogenics');
	if (Molpy.ConsecutiveNPsWithDragons >= 901) Molpy.UnlockBoost('Dragon Breath');

	if (Molpy.CoalToAdd==null || Molpy.DiamToSpend==null) Molpy.Annililate(); //so we don't start out with ugly undefineds if dragons are hiding

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
			Molpy.Notify(str,0);
		}
		Molpy.DigTime = 0;
		Molpy.DiggingFinds = {};
	}
	
	if (Molpy.DragonDigRecalcNeeded) Molpy.DragonDigRecalc();
	var add = Molpy.DragonDigRate;
	if (type) {
		add = Molpy.TotalNPsWithDragons*(1+dq.Level);
		if (Molpy.Got('Shades')) add = add*add;
	}
	Molpy.DigValue += add*Math.random();
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
	} else if (dq.Level > 1 && Math.random() < dq.Level/999) { // Find Coal
		found = 'Coal';
		n = Math.max(Math.floor(Math.log(finds)-1000),1);
		Molpy.Add(found,n);
	} else { // Find Diamonds 
		found = 'Diamonds';
		n = Molpy.Got('Cut Diamonds')?Math.max(finds/222222,Math.log(finds)) :Math.log(finds);
		if (Molpy.Got('Sparkle')) n *= Math.pow(1.01,Molpy.ConsecutiveNPsWithDragons);
		n =  Math.max(Math.floor(n),1);
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
	if (Molpy.Got('Seacoal') && type == 1) {
		var seacoal = 1;
		Molpy.Add('Coal',seacoal);
		if (Molpy.DiggingFinds['Coal']) {
			Molpy.DiggingFinds['Coal'] += seacoal;
		} else {
			Molpy.DiggingFinds['Coal'] = seacoal;
		}
	};
	if (Molpy.Got('Sea Mining') && Molpy.Boosts['Sea Mining'].power && type == 1){
		Molpy.Add('Coal',Molpy.Boosts['Sea Mining'].power);
		Molpy.Boosts['Sea Mining'].power++;
	}
	if(Molpy.Got('Annilment') && Molpy.IsEnabled('Annilment')) {
		var amounts = Molpy.Annililate();
		Molpy.Add('Coal', amounts[0]);
		Molpy.Spend('Diamonds', amounts[1]);
	}
	if (Molpy.Got('Ventus Vehemens') && Molpy.IsEnabled('Ventus Vehemens') && Molpy.Has('Vacuum','400HW')) {
		Molpy.Spend('Vacuum','400HW');
	} else if(Molpy.Got('Ventus Vehemens') && Molpy.IsEnabled('Ventus Vehemens')) {
		Molpy.Notify("Ran out of Vacuum!",1);
		Molpy.Boosts['Ventus Vehemens'].power = 0;
	}
}

Molpy.FindThings = function() {
	var dqlevel = Molpy.Level('DQ');
	var availRewards = [];
	for( var i=0;i<Molpy.DragonRewardOptions.length;i++) {
		var me = Molpy.Boosts[Molpy.DragonRewardOptions[i]];
		if("draglvl" in me && Molpy.Dragons[me.draglvl].id <= dqlevel) {
			var lim = EvalMaybeFunction((me.limit || 1),me);      
			if (me.unlocked < lim && me.unlocked == me.bought) availRewards.push(me);
		}
	}
	if(Molpy.FindDebug) Molpy.Notify('List length '+ availRewards.length);
	var thing = GLRschoice(availRewards);
	if (thing) {
		Molpy.UnlockBoost(thing.alias);
		Molpy.lootRemoveBoost(thing);
		Molpy.shopNeedRepaint = 1;
	}
	return thing;
}	

// Fledging ********************************************************

Molpy.MaxDragons = function() {
	if (Molpy.newpixNumber < 0) return Molpy.newpixNumber;
	return 1+Math.floor(Molpy.newpixNumber/100);
} 

Molpy.DragonFledge = function(clutch) {
	//if (Molpy.newpixNumber == 0) {
		//Molpy.Notify('Time balks.');
		//return;
	//}
	var npd = Molpy.NPdata[Molpy.newpixNumber];
	var dq = Molpy.Boosts['DQ'];
	var hatch = Molpy.Boosts['Hatchlings'];
	var lim = Molpy.MaxDragons();
	var dt = Molpy.DragonsById[dq.Level].name;
	var waste = 0;
	var oldDT = 0;
	var oldDN = 0;
	var fight = 1;
	if (!npd) npd = Molpy.NPdata[Molpy.newpixNumber] = {};

	if (npd && npd.amount > 0 ) {
		if (hatch.clutches[clutch] > 1 && npd.DragonType == dq.Level && !confirm('Do you wish to fledge '+  hatch.clutches[clutch] +' ' +
					dt +'s'+ ' where you already have '+ npd.amount + dt + 's?')) return;
		if (npd.DragonType < dq.Level || (npd.DragonType == dq.Level && hatch.clutches[clutch] > npd.amount))	{ // Replace
			oldDT = npd.DragonType;
			oldDN = npd.amount;
			fight = 0;
			if(Molpy.Got('Honor Among Serpents') && dq.overallState == 2){
				dq.overallState = 0;
				Molpy.Notify('Back to work! The dragons have resumed digging',0);
			};
			if((Molpy.Boosts['Honor Among Serpents'].unlocked == 0) && (dq.overallState == 2)&&(Molpy.Boosts.DQ.Level >= 3)){
				Molpy.UnlockBoost('Honor Among Serpents');
			}
		} else {
			Molpy.Notify('This NP already has better dragons, who have eaten the interlopers',1);
			hatch.clutches[clutch] = 0;
			hatch.clean(1);
			return;
		}
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
		if(npd.amount>0){
		Molpy.Notify(Molpify(npd.amount) + ' ' + dt +
				(npd.amount ==1?' has':'s have') +' fledged at NP'+Molpy.newpixNumber,0);
		
		if (oldDN) Molpy.Notify('Replacing '+Molpify(oldDN)+' '+Molpy.DragonsById[oldDT].name,1);
		} else {Molpy.Notify("The underworld is no place for living dragons.",1)}
	}
	if (waste) {
		if (!Molpy.Got('Topiary')) {
			Molpy.Notify('There was not enough space for '+(npd.amount?Molpify(waste):'any')+' of them',1);
			hatch.clutches[clutch] = 0;
			hatch.clean(1);
			if (dq.Level > 1) Molpy.UnlockBoost('Topiary');
		} else {
			hatch.clutches[clutch] = waste;
		}
	} else {
		hatch.clutches[clutch] = 0;
		hatch.clean(1);
	}

	if (fight && npd.amount) {
		var opponents = Molpy.FindOpponents(Molpy.newpixNumber);
		Molpy.OpponentsAttack(Molpy.newpixNumber, opponents,' attacks as you fledge',' attack as you fledge',0);
		if(opponents.numb > 1 && npd.amount > 0)
			Molpy.EarnBadge('There are two of them!');
	}
	if (npd.amount) {
		Molpy.EarnBadge('First Colonist');
		Molpy.Overview.Update(Molpy.newpixNumber);
	};
	Molpy.DragonDigRecalc(); // Always needed
	if (Molpy.TotalNPsWithDragons > 11) Molpy.UnlockBoost('Dragon Overview');
	if (Molpy.TotalNPsWithDragons > 111 && Molpy.Got('Dragon Overview')) Molpy.UnlockBoost('Woolly Jumper');
}

Molpy.DragonStatsNow = function(where) {
	var Stats = {};
	var npd = Molpy.NPdata[where];
	var num = npd.amount;
	var drag = Molpy.DragonsById[npd.DragonType];
	if (!npd) return Stats;
	for(var prop in npd) {
		if(typeof npd[prop] !== 'undefined') Stats[prop] = npd[prop];
	}

	Stats.defence += 0.001;
	Stats.attack += 0.001;
	Stats.defence *= Molpy.DragonDefenceMultiplier*drag.defbase;
	Stats.attack *= Molpy.DragonAttackMultiplier*drag.defbase;
	Stats.dig *= Molpy.DragonDigMultiplier*drag.digbase;
	Stats.breath *= Molpy.DragonBreathMultiplier*drag.breathbase;
	if (num) {
		for(var prop in Stats) {
			if (prop != 'amount' && prop != 'DragonType') Stats[prop]*=num;
		}
	}
	return Stats;
}


Molpy.FindOpponents = function(from) {
	var df = {};
	df.from = Math.floor(from);
	df.type = Math.min(Math.floor(from/150),Molpy.OpponentsById.length-1); //+1+Molpy.fracParts.indexOf(Number((from-Math.floor(from)).toFixed(3))) this doesn't play nice with df.numb as having the type one higher produces negative squad size.
	df.numb = (Molpy.TotalDragons < 10 && Molpy.HighestNPwithDragons < 20)?1:Math.floor((((from-df.type*150)/30)+((Math.floor(from/150) < Math.floor((Molpy.HighestNPwithDragons+1)/150))?Math.pow(Molpy.Boosts.Princesses.Level / Math.pow(100 , (df.type-6)), 1/3):0))*(Math.random())+1);
	df.gender = 1*(Math.random() < 0.5);
	df.modifier = Math.random()+.5;
	return df;
} //Not great, whatever.

Molpy.CombatDebug = 0;
Molpy.OpponentsAttack = function(where,df,text1,text2,fighttype,breathtype) {
	// Select locals
	// Work out their attack and defense values
	// fight a round
	// if clear result (Dragon &| Opponents) Killed
	// There may be injuries to the dragon needing time to heal
	// give rewards and experience
	// Notify
	
	var dq = Molpy.Boosts['DQ'];
	var npd = Molpy.NPdata[where];
	var local = Molpy.OpponentsById[df.type];
	var atktxt = local.attackstxt(df,(df.from!=where?df.from:'')) + ((df.numb> 1 && text2)?text2:text1) + '. ';
	var atkval = local.attackval(df.numb,where);

	Molpy.DragonDigRecalc(); 
	var dragstats = Molpy.DragonStatsNow(where);
	var result = 0;
	var localhealth = (atkval[0]+atkval[1])*df.modifier;
	var dragnhealth = dragstats.defence || 0;
	var dragnbreath = dragstats.breath || 0;
	var factor = 1;
	var loops = 0;
	var backfire = Math.random() < .25 - Molpy.DragonLuck - .05*Molpy.Got('Mouthwash') + .02*Molpy.Got('Ethyl Alcohol');
	var specialatkmod = Molpy.Boosts['Dragonfly'].Level*.01 + Molpy.DragonLuck;
	var blitzval = Molpy.calcBlitzVal(dragstats.attack,dragstats.defence);
	breathtype++;
	dq.totalfights++;

	//Molpy.Notify('atkval = '+atkval[0]+' drag hlth = '+dragnhealth+' attack= '+dragstats.attack,1);
	
	while (result == 0 && loops<=100) {
		if(breathtype) { //dragons have breath; 
			dq.breathfights++;
			var special = Math.random() + specialatkmod > .0001;
			var mult = dragnbreath*Math.random();
			if(Molpy.Spend('Ethyl Alcohol',1)) mult*= 2;
			if(backfire){
				dragnhealth -= mult;
				Molpy.Notify('The dragons\' breath backfired! Lost ' + Molpify(mult) + 'health!',1);
				breathtype = 0;
			}
			backfire = 0;
			switch(breathtype) {
				case 1 : //fire
					var firedamg = 18*mult;
					localhealth -= firedamg;
					if(special){
						Molpy.EarnBadge('Flame and Gory');
						localhealth -= 4*firedamg;
						Molpy.Notify('Burned the enemy for an additional' + Molpify(firedamg) + ' damage!',0);
					};
					break;
				case 2 : //ice
					var icedamg = 4*mult;
					atkval[0] -= icedamg;
					if(special){
						var frozen = 1;
						Molpy.EarnBadge('Icecapades');
						Molpy.Notify('Froze the enemy for a round!',0);
					} else var frozen = 0;
					break;
				case 3 : //poison
					if(special && loops > 5 && Math.floor(2*Math.random())){
						localhealth == 0;
						Molpy.EarnBadge('Rolled a 20!');
					}
					break;
				case 4 : //special
					break;
			}
			Molpy.Boosts['Dragon Breath'].recoveryCountdown(npd.breath);
		};
		if(0){}; //magic TBD
		// Physical attacks
		localhealth -= (dragstats.attack || 0)*Math.random();
		if (!frozen && loops >1 || dragstats.attack < 10*atkval[0]) dragnhealth -= atkval[0]*Math.random()/(df.modifier);
		dragnhealth -= Math.floor(atkval[1]*1000)*Math.random();
		if (dragstats.attack > 10*atkval[0] && localhealth <=0 && loops==1) Molpy.EarnBadge('First Blood');
		if (Molpy.CombatDebug) Molpy.Notify('loop = ' + loops + ' local = '+localhealth+' dragon = '+dragnhealth +'blitz = '+blitzval,0);
		if(loops > 50){
			if(dq.Level >= 3) Molpy.UnlockBoost('Tuple or Nothing');
			var fudge = Math.pow(2,loops - 50);
			localhealth -= fudge;
			dragnhealth -= fudge;
		};
		if (dragnhealth < 0 || isNaN(dragnhealth)) {
			if (localhealth < 0 || isNaN(localhealth)) {
				if(Math.random() - 1 > blitzval) result = 1
					else result = -1;
			} else if (loops > 1 && Math.random() -1 > blitzval) result = -1
				else result = -1 -(dragnhealth < -dragstats.defence);
		} else if (localhealth < 0 || isNaN(localhealth)) {
			if(Molpy.CombatDebug) Molpy.Notify('result ='+ result+' localneg = '+localhealth,0);
			factor = dragnhealth/dragstats.defence;
			if(Molpy.CombatDebug) Molpy.Notify('factor ='+ factor,0);
			if (factor > 0.9) result = 3
			else if (factor > 0.5 || npd.amount == 1) result = 2
			else result = 1;
		}
		loops++;
	}

	if (Molpy.CombatDebug) Molpy.Notify('Result = ' + result + ' factor ' + factor,0);
	if(loops >= 100){ //hacked in temporarily because Wyverns were *still* getting ties under certain circumstances
		if(dragnhealth < localhealth) result = -.5; 
		if(dragnhealth > localhealth) result = .5;
		else result = 0; //no idea how this would be possible but if you did it, good job
	}
	if(Math.abs(blitzval) > .5){
		if(blitzval < 0) Molpy.UnlockBoost('Clannesque');
		if(blitzval > 0) Molpy.UnlockBoost('Autumn of the Matriarch');
	};
	if (Molpy.CombatDebug) Molpy.Notify('Result = ' + result + ' factor ' + factor,0);

	var timetxt = '';
	if (loops <5 ) timetxt = 'riverish '
	else if (loops>17) timetxt = 'seaish ';

	this.roboHatch = function(type, amount){
		if(Molpy.Has('Goats', Infinity) && Molpy.Level('Cryogenics') >= amount){
			Molpy.Boosts['Cryogenics'].power -= amount;
			Molpy.Spend('Goats', Infinity);
			Molpy.Notify(' Fledged ' + amount + ' dragons from Cryogenics to replace the fallen.',0);
			Molpy.Boosts['DQ'].Loose(type,amount);
		}
		else if(Molpy.Level('Cryogenics') >= amount){
			Molpy.Notify('Not enough Goats to feed the clutch...',1);
			Molpy.Boosts['DQ'].Loose(type,amount);
			npd.amount = 0;
		}
		else {
			Molpy.Notify('Not enough dragons in Cryogenics to replace the lost clutch.',1);
			Molpy.Boosts['DQ'].Loose(type,amount);
			npd.amount = 0;
				}
			}

	switch (result) {
		case -2 : // wipeout
			Molpy.Add('exp',Math.pow(10,npd.DragonType)/5);
			Molpy.Notify(atktxt + ' You are totally destroyed in a one sided ' + timetxt + 'fight.',0);
			if(Molpy.Got('Robotic Hatcher') && Molpy.IsEnabled('Robotic Hatcher') && fighttype != 0){
				this.roboHatch(npd.DragonType,npd.amount);
			}
			else {
				dq.Loose(npd.DragonType,npd.amount);
				npd.amount = 0;
			}
			Molpy.Overview.Update(where);
			break;

		case -1 : // lost a hard fight
			Molpy.Add('exp',Math.max(local.experience()*df.numb, Math.pow(10,npd.DragonType)/5));
			Molpy.Notify(atktxt + ' You lost, but lost with dignity',0);
			if(Molpy.Got('Robotic Hatcher') && Molpy.IsEnabled('Robotic Hatcher') && fighttype != 0){
				this.roboHatch(npd.DragonType,npd.amount);				
			}
			else {
				dq.Loose(npd.DragonType,npd.amount);
				npd.amount = 0;
			}
			Molpy.Overview.Update(where);
			break;

		case -.5: //loop count exceeded and dragon health < localhealth
			var rectime = Math.min((dragstats.DragonType+1)*400/factor,(dq.Level+1)*2750);
			if(Molpy.Spend('Healing Potion',1)) rectime/=5;
			if(Molpy.Spend('Cup of Tea',1)) rectime/=2;
			rectime = Math.floor(rectime);
			dq.ChangeState(1,rectime);
			Molpy.Notify(atktxt + '<br>Exhausted from the battle, your dragons cede their territory to the Redundaknights. They will need to recover for ' + rectime + '.',0);
			dq.Loose(npd.DragonType,npd.amount);
			npd.amount = 0;
			if(Molpy.Got('Cryogenics')) Molpy.Boosts('Cryogenics').power += npd.amount;
			Molpy.Add('exp',Math.max(local.experience()*df.numb, Math.pow(10,npd.DragonType)/5));
			Molpy.Overview.Update(where);
			break;

		case 0 : // Tie
			Molpy.Notify(atktxt + ' It\'s a tie - no idea what to do...',0);
			break;

		case .5: //loop count exceeded and dragon health > localhealth
			Molpy.Notify(atktxt + '<br>Exhausted from the battle, the knights retreat to fight another day.<br><br>One of your dragons has died!',0);
			Molpy.Add('exp',Math.max(local.experience()*df.numb, Math.pow(10,npd.DragonType)/5));
			Molpy.Redacted.toggle = 2 + Molpy.Redacted.countup;
			dq.Loose(npd.DragonType,1);
			npd.amount--;
			break;

		case 1 : // Pyric victory - lose a dragon...
			var dloss = 0;
			if (npd.amount > 1) {
				dq.Loose(npd.DragonType,1);
				npd.amount--;
				dloss = 1;
				factor *=2;
			}
			var rectime = Math.min((dragstats.DragonType+1)*200/factor,(dq.Level+1)*2000);
			if (rectime > 5 && Molpy.Spend('Healing Potion',1)) rectime/=5;
			if (rectime > 2 && Molpy.Spend('Cup of Tea',1)) rectime/=2;
			rectime = Math.floor(rectime);
			dq.ChangeState(1,rectime);
			Molpy.Notify(atktxt + ' You won a very hard ' + timetxt + 'fight, ' + 
					(dloss?'losing 1 '+Molpy.DragonsById[dragstats.DragonType].name+' and you':'but') +
					' will need to recover for ' + MolpifyCountdown(dq.countdown, 1),0);
			local.takeReward(df.numb,local.experience()*df.numb,blitzval,loops); 
			break;

		case 2 : // won a hard fight - need to recover
			var rectime = Math.min((dragstats.DragonType+1)*100/factor,(dq.Level+1)*1500);
			if (rectime > 5 && Molpy.Spend('Healing Potion',1)) rectime/=5;
			if (rectime > 2 && Molpy.Spend('Cup of Tea',1)) rectime/=2;
			rectime = Math.floor(rectime);
			dq.ChangeState(1,rectime);
			Molpy.Notify(atktxt + ' You won a hard '+timetxt+'fight, but will need to recover for ' + 
					MolpifyCountdown(dq.countdown, 1),0);
			local.takeReward(df.numb,local.experience()*df.numb*2,blitzval,loops); 
			break;

		case 3 : // Wipeout for no loss
			if (npd.DragonType) {
				Molpy.Notify(atktxt + ' You wiped ' + (df.numb==1?['him','her'][df.gender]:'them') + 
					' out ' + (timetxt?'in a '+timetxt+'fight, ':'') + 'with ease',0);
			} else {
				Molpy.Notify(atktxt + ' You scared ' + (df.numb==1?['him','her'][df.gender]:'them') + 
					' away ' + (timetxt?'in a '+timetxt+'fight, ':'') + 'with ease',0);
			}
			local.takeReward(df.numb,local.experience()*df.numb,blitzval,loops); 
			if (dq.overallState) {
				Molpy.Notify('Your heroic victory inspires the others to go back to work',0);
				dq.ChangeState(0);
			}
			break;
	}
	if(result > 0 && local.id >= 6 && !Molpy.Boosts['WotT'].permalock) Molpy.UnlockBoost('WotT');
	if(result > 0 && local.id >= 6 && !Molpy.Boosts['WotP'].permalock) Molpy.UnlockBoost('WotP');
	Molpy.DragonDigRecalcNeeded = 1;
}

Molpy.RedundaKnight = function() { 
	var atk = Molpy.HighestNPwithDragons;
	var fly = Molpy.Boosts['Dragonfly'].Level;
	if (Math.random()<.25) {
		var di = Math.random()*Molpy.TotalNPsWithDragons;
		var found = 0;
		for (var np=1; np<=atk; np=Molpy.NextLegalNP(np)) {
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
	var atklvl = Math.max(atk,300*npd.DragonType) //+30*(Molpy.Level('DQ')+1)+150*(1*Math.log(Molpy.Level('Princesses')+1));
	atklvl = ((Math.random() < 0.5)?Math.max(0,atklvl-Math.floor(30*Math.random())):atklvl)+Math.floor(30*Math.random());
	var opp = Molpy.FindOpponents(atklvl);
	opp.knowledge = [];
	var know = [0, 1, 2, 3];
	for(var i in know){
		if(fly > 16){
			opp.knowledge[0] = opp.knowledge[1] = opp.knowledge[2] = opp.knowledge[3] = 1;
			var roll = Math.random();
			if(roll + Molpy.DragonLuck > .9) opp.knowledge[4] = 1; //magical knowledge; not yet coded
			if(roll + Molpy.DragonLuck > .95) opp.knowledge[5] = 1;
		} else opp.knowledge[i] = fly > 4*i && 11*(fly/(i + 1 || 1)) >=Math.random()*100 - 77*Molpy.DragonLuck;
	};
	opp.target = atk;
	return opp;
}

Molpy.DragonKnightAttack = function(breathtype) { // Attack Opponents
	var opp = Molpy.Redacted.opponents;
	var npd = Molpy.NPdata[opp.target];
	Molpy.Redacted.onClick();
	Molpy.OpponentsAttack(opp.target,opp,
			' attacked your ' + Molpy.DragonsById[npd.DragonType].name + plural(npd.amount) + ' at NP'+opp.target,0,1,breathtype);
}

Molpy.DragonsHide = function(type) {
	Molpy.Redacted.onClick();
	var dq = Molpy.Boosts['DQ'];
	var hidetime = Math.max(10,Math.ceil(42 * (type + 1) * (dq.Level || 1) - 5 * Molpy.Level('Camelflarge') - Molpy.HideMod));
	dq.ChangeState(2,hidetime);
	Molpy.Notify('The Dragons are hiding for ' + hidetime + 'mnp');
}

// Upgrades ******************************************************************************************

// type 0: text, 1: action
Molpy.DragonUpgrade = function(type) {
	var dq=Molpy.Boosts['DQ'];
	var str = '';
	var dragn = Molpy.DragonsById[dq.Level];
	if (type == 0) {
		if (!dragn.condition()) return str;
		if (Molpy.Level('exp') >= DeMolpify(dragn.exp)) {
			if (Molpy.Has(dragn.upgrade)) {
				str += '<br><br><input type=button value=Upgrade onclick="Molpy.DragonUpgrade(1)"></input> ';
			} else {
				str += '<br><br>The Queen upgrade will cost ';
			}
		} else {
			str += '<br><br>The Queen can be upgraded when you have ' + Molpify( DeMolpify(dragn.exp)) + ' experience.  It will cost ';
		}
		str += Molpy.createPriceHTML(dragn.upgrade);
		return str;
	};
	if ((Molpy.Level('exp') < DeMolpify(dragn.exp)) || !dragn.condition()) return Molpy.Notify('You can\'t upgrade yet',1);

	if (Molpy.Spend(Molpy.DragonsById[dq.Level].upgrade)) {
		dq.Level++;
		Molpy.Boosts['DQ'].Refresh();
		if (Molpy.Got('Dragon Overview')) Molpy.Overview.Create();
		Molpy.Notify('Hatchlings now mature into '+ Molpy.DragonsById[dq.Level].name + 's',0);
	} else {
		Molpy.Notify('You can\'t afford the upgrade yet',1);
	}
}

// Cryo ******************************************************************************************

Molpy.DragonsToCryo = function(cl) {
	var hatch = Molpy.Boosts['Hatchlings'];
	Molpy.Add('Cryogenics',hatch.clutches[cl]);
	hatch.clutches[cl] = 0;
	hatch.clean(1);
	hatch.Refresh();
	Molpy.Notify('You now have ' + Molpy.Level('Cryogenics') + ' in suspended animation',0);
}

Molpy.DragonsFromCryo = function() { // Cut down version of fledge
	//if (Molpy.newpixNumber == 0) {
		//Molpy.Notify('Time balks.');
		//return;
	//}
	var npd = Molpy.NPdata[Molpy.newpixNumber];
	var dq = Molpy.Boosts['DQ'];
	var lim = Molpy.MaxDragons();
	var dt = Molpy.DragonsById[dq.Level].name;
	var spare = 0;
	var oldDT = 0;
	var oldDN = 0;
	var fight = 1;
	if (!npd) npd = Molpy.NPdata[Molpy.newpixNumber] = {};

	if (npd && npd.amount > 0){ 
		if (npd.amount > 1 && npd.DragonType == dq.Level && !confirm('Do you wish to fledge '+  npd.amount +' '+dt +'s'+ ' where you already have '+ oldDN + ' ' + dt + 's?')) return;
		if (npd.DragonType < dq.Level || (npd.DragonType == dq.Level && Molpy.Level('Cryogenics') > npd.amount)) { // Replace
			oldDT = npd.DragonType;
			oldDN = npd.amount;
			fight = 0;
			if(Molpy.Got('Honor Among Serpents') && dq.overallState == 2){
				dq.overallState = 0;
				Molpy.Notify('Back to work! The dragons have resumed digging',0);
			};
			if((Molpy.Boosts['Honor Among Serpents'].unlocked == 0) && (dq.overallState == 2)&&(Molpy.Boosts.DQ.Level >= 3)){
				Molpy.UnlockBoost('Honor Among Serpents');
			}
		} else {
			Molpy.Notify('You need more dragons in Cryo to fledge here',1);
			return;
		}
	}
	
	npd.DragonType = dq.Level;
	npd.amount = Molpy.Level('Cryogenics');
	if (npd.amount > lim) {
		if (lim < 0) {
			spare = npd.amount;
			npd.amount = 0;
		} else {
			spare = Math.max(npd.amount - lim,0);
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
	
	if(npd.amount>0) {
		Molpy.Notify(Molpify(npd.amount) + ' ' + dt +
				(npd.amount ==1?' has':'s have') +' fledged at NP'+Molpy.newpixNumber,0);
		
			
		
	if (oldDN) Molpy.Notify('Replacing '+Molpify(oldDN)+' '+Molpy.DragonsById[oldDT].name,1);
	} else {Molpy.Notify("The underworld is no place for living dragons.",1)}
	if (Molpy.Got('Topiary')) {
		Molpy.Boosts['Cryogenics'].power = spare;
	} else if (spare) {
		Molpy.Notify('There was not enough space for '+Molpify(spare)+' of them',1);
		if (dq.Level > 1) Molpy.UnlockBoost('Topiary');
		Molpy.Boosts['Cryogenics'].power = 0;
	} else {
		Molpy.Boosts['Cryogenics'].power = 0;
	}
	if (npd.amount) {
		Molpy.EarnBadge('First Colonist');
		Molpy.Overview.Update(Molpy.newpixNumber);
	};

	if (fight && npd.amount) {
		var opponents = Molpy.FindOpponents(Molpy.newpixNumber);
		Molpy.OpponentsAttack(Molpy.newpixNumber, opponents,' attacks as you fledge',' attack as you fledge', 0);
		if(opponents.numb > 1 && npd.amount > 0)
			Molpy.EarnBadge('There are two of them!');
	}
	Molpy.DragonDigRecalc(); // Always needed
}

Molpy.calcBlitzVal = function(atk,def){
	var ratio = Math.log10(atk/def)*.11;
	ratio = (Math.max(Math.min(ratio, .66), -.66) || 0);
	return ratio;
}

Molpy.Breath = function(index,np){
	var effects = Molpy.DragonsById[Molpy.Boosts['DQ'].Level].breath;
	index = 0; //will eventually determine which element in the breath array to return
	var txt = '<br><br>Current breath effect: ' + effects[index] + '. <input type="button" value="Use" onclick="Molpy.DragonKnightAttack(' + index + ')"</input><br>';
	if(effects.length > 1){
		txt += '<input type=button value=">" onclick="Molpy.changeBreath(' + effects + ')"</input>'
	};
	Molpy.redactedNeedRepaint = 1;
	return txt;
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
19	Wyvern						
22	Breath effects				
23	Magic				
24	Mirror Dragons		
53	Burnish restart
56	Bone Feast
58	Anti-dragons
60	Dragon
61	Related Quantum Panthers
62	Sparkle Stick (magic)
63	Ms Frizzle's Uncertainty Principle
64	Dragon Drum - Attack boost

* Mouthwash (to reduce bad breath backfires)
* Magic Rings (future)
* Magic Books (future)
* Bad dreams!
* Luck Rings
* hard dragons - control redundaknight defaults
* Breath - needs coal, does damage (may reduce number if multiple opponents)
* Magic use Mana - Mana from?
* Breath types - fire [Coal], poison [Bonemeal], frost [Vacuum] - Only Coal as BM and Vac much more common
* Set system so fully equipped it cannot lose against highest opponent from own level
* lining imbalance - lower overall, MUCH less variability
* Coal Scuttle, Coal Tip, Coalong, semi coalong, beach coal (seacoal)
* 


Other
2	Panthers Ignore Einstein 
5



*/

