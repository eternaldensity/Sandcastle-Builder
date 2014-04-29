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


Molpy.DefineCharacters = function() {

	new Molpy.Character({
		name: 'Dragling',
		tier: 0,
		health: 1,
		attack: 1,
		cooldown: 100,
		space: 1,
		intel: 1,
		legs: 4,
		wings: 0,
		fly: 0,
		heads: 1,
		arms: 0,
	});
	new Molpy.Character({
		name: 'DragonNewt',
		tier: 1,
		health: 1,
		attack: 1,
		cooldown: 100,
		space: 1,
		intel: 1,
		legs: 2,
		wings: 0,
		fly: 0,
		heads: 1,
		arms: 2,
	});
	new Molpy.Character({
		name: 'Wyrm',
		tier: 2,
		health: 1,
		attack: 1,
		cooldown: 100,
		space: 1,
		intel: 1,
		legs: 0,
		wings: 2,
		fly: 1,
		heads: 1,
		arms: 0,
		breath: ['fire'],
	});
	new Molpy.Character({
		name: 'Wyvern',
		tier: 3,
		health: 1,
		attack: 1,
		cooldown: 100,
		space: 1,
		intel: 1,
		legs: 2,
		wings: 2,
		fly: 1,
		heads: 1,
		arms: 0,
		breath: ['fire'],
	});
	new Molpy.Character({
		name: 'Dragon',
		tier: 4,
		health: 1,
		attack: 1,
		cooldown: 100,
		space: 1,
		intel: 1,
		legs: 2,
		wings: 2,
		fly: 1,
		heads: 1,
		arms: 2,
		breath: ['fire'],
	});
	new Molpy.Character({
		name: 'Noble Dragon',
		tier: 5,
		health: 1,
		attack: 1,
		cooldown: 100,
		space: 1,
		intel: 1,
		legs: 2,
		wings: 0,
		fly: 0,
		heads: 1,
		arms: 2,
		breath: ['fire'],
	});
	new Molpy.Character({
		name: 'Imperial Dragon',
		tier: 0,
		health: 1,
		attack: 1,
		cooldown: 100,
		space: 1,
		intel: 1,
		legs: 4,
		wings: 0,
		fly: 0,
		heads: 1,
		arms: 2,
	});
	new Molpy.Character({
		name: 'Infinite Dragon',
		tier: 0,
		health: 1,
		attack: 1,
		cooldown: 100,
		space: 1,
		intel: 1,
		legs: 4,
		wings: 0,
		fly: 0,
		heads: 1,
		arms: 2,
	});

}
// First char -(no a), !an, + the, @his, else a...
Opponents {
name: 'Serf',
armed: ['stick', '-bare hands', 'turnip', '-bad words', 'bowl of dish waster', ]
reward: {Copper:'1-10'},
exp: 1,

name: 'Peasant'
armed: ['sythe','pitchfork','hammer','knife','club','spade','dung fork','chair leg','bone','rock']
reward: {Copper:'10-1000'},
exp: '1K',

name: 'Page',
armed: ['dagger', 'staff', 'nice cup of tea', 'stileto', 'buckler', 'spear', 'crossbow', ]
reward: {Silver:'1-100'},
exp: '1M',

name: 'Squire',
armed: ['short sword', 'side sword','bow and arrows','mace','mandolin','polearm','!axe','hammer',]
reward: {Silver:'100-10000'},
exp: '1G',

name: 'Knight',
armed: ['long sword', '+arming sword', 'battle axe', 'morning star', 'lance',]
reward: {Gold:'10-1000',Diamonds:'0.5'},
exp: '1P',

name: 'Baron',
armed: ['bastard sword','flaming sword','hailstorm','tax demand',]
reward: {Gold:'1K-1M',Diamonds:'1-5'},
exp: '1E',

name: 'Lord',
armed: ['great sword','great axe','Kazoo','court jester']
reward: {Gold:'100K-10G',Princesses:'0.25',Diamonds:'1-1000'},
exp: '1Z',

name: 'Duke',
armed: ['+Duchess','horde of servants','-both gardeners','whip', ]
reward: {Gold:'1M-100T',Princesses:'0.75',Diamonds:'10-1M'},
exp: '1Y',

name: 'Emperor',
armed: ['+staff of office','holy orb','+Imperial Guard','-Kamakazi Teddy Bears','!ICBM','+Storm Troopers'],
reward: {Gold:'10M-1E',Princesses:'1-10',Diamonds:'100-1T'},
exp: '1U',

name: 'Paladin',
armed: ['+Dragon slaying sword','Holy hand grenade','lot of bad puns','+Sword of the isles','' ],
reward: {Gold:'100M-1Y',Princesses:'10-10K',Diamonds:'1K-1Z'},
exp: '1S',

name: 'Hero',
armed: ['+sword of sharpness','-Eds Axe','+Punsaw','Donut','-both feet','pea shooter','@fist of steel',],
reward: {Gold:'1G-1H',Princesses:'100-10M',Diamonds:'1M-1F'},
exp: '1F',

name: 'Demi-god',
armed: ['pen (mightier than the sword)', 'cleaving axe','pitch fork', 'ballon',''],
reward: {Gold:'10G-1WW',Princesses:'1K-10G',Diamonds:'1T-1W'},
exp: '1W',

name: 'Superhero',
armed: ['-bare hands','turnip','bazooka','+Imperial Dragon Banishing Sword','+Great Cleaver', ],
reward: {Gold:'10T-1WWW',Princesses:'1M-10P',Diamonds:'1T-1WW'},
exp: '1WW',

name: 'God',
armed: ['+staff of might','+staff of comand','-dice','@holy symbol','@lightning strikes'],
reward: {Gold:'10P-1Q',Princesses:'1G-10Y',Diamonds:'1T-1WWW'},
exp: '1WWW',

name: 'Panetheon',
armed: ['-myths and ledgends','!army','flock of unicorns', '-heresey', '503', '-logic']
reward: {Gold:'10E-1WWQ',Princesses:'1T-10L',Diamonds:'1T-1Q'},
exp: '1Q',

	
Molpy.Opponent = function(args) {
	
	this.attacks: function() {
		var str = 'A '+this.name+' armed with ';
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
		default:
			str += 'a ';
			break;
		}
		str += rest;
	}

	this.takeReward: function() {
		for (var stuff in this.reward) {
			var num = 0;
			var range = this.reward.stuff;
			var bits = range.split('-');
			if (bits[1]) {
				var minval = DeMolpify(bits[0]);
				var maxval = DeMolpify(bits[1]);
				num = Math.floor(maxval * Math.random()+minval);
			} else {
				if (Math.random() < range) num = 1;
			}
			if (num) {
				if (stuff == 'copper') { stuff = 'Gold'; num/=1000000; }
				else if (stuff == 'silver') { stuff = 'Gold'; num/=1000; }
				Molpy.Add(stuff,num);
			}
		}
	}

	this.experience: function() {
		return DeMolpify(this.exp);		
	}
}


/* Ideas
 *
 * Lets try science
 * OldPixBot
 * PopeBot
 * Binary
 * Survey Gear - makes it easier to find maps
 * Cardinals - improve The Pope
 * Dragon features -
 * - Legs (0,2,4,?)
 *   Big Teeth
 *   Multiple heads (1,3,9,27...) Russian mythology
 *   Fire breath
 *   Ice breath
 *   Fly (Magic &| Wings)
 *   Magic
 *   Water breath
 *   Poison
 *   Gas breath
 *   Spines
 *   Tusks
 *   Hoard Treasure, Princesses, 
 *
 * Princesses are stuff, the more you have the more knights you attract
 * Pyramid of features:
 *
 *
 * 1: 2 legs, 4 legs, Big Teeth, Spines, Tusks
 * 2: Fire, 3 heads, Wings, Fly, Poison
 * 3: Ice, Water, Gas, Magic, 9 heads
 * 4: 
 *
 * Have to use fire/or other breath to reduce a knight to a diamond
 * Peasant, serf, Page, Squire, Knight, Lord, Baron, Duke, Emperor, Paladin, Hero, Demi-god, Super-Hero, God, 		Pantheon
 * 0        0     0     0       1       10    100    1e4   1e8      1e16     1e32  1e64      1e128+i     1e256+16i  Inf +Inf i
 * Exp: 1   10    100   1000    10K     100K  1M     10M   100M     1G       10G   100G      1T          10T            100T
 *
 * Dragling,     DragonNewt,    Wyrm,         Wyvern,       Dragon,         Imperial Dragon  Complex Dragon	Infinite Dragon
 * Legs  4	2		0		2		2		4		4+4i		Inf
 * ARms	 0	2		0		0		2		2		4+4i		Inf
 * Heads 1	1		1		1		1		3		9+9i		Inf
 * Breath 0	0		Fire		Fire|Ice	Fire|Ice|pois	3		18		Inf
 * Fly	  N	N		Y		Y		Y		Y		Y		Y
 * Wings  N	N		Y		Y		Y		Y		Y		Y
 * Princesses
 * 	 0	0		0		0-1		1-10		1-1000		1K-1M		Inf?
 *



*/
