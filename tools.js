Molpy.DefineSandTools = function() {
	new Molpy.SandTool({
		name: 'Bucket',
		commonName: 'bucket|buckets|poured',
		icon: 'bucket',
		desc: 'Pours a little sand',
		price: 8,
		
		spmNP: function() {
			var baserate = 0.1 + Molpy.Got('Bigger Buckets') * 0.1;
			var mult = 1;
			if(Molpy.Got('Glass Ceiling 0')) mult *= Molpy.GlassCeilingMult();
			if(!isFinite(mult)) return Infinity;
			if(Molpy.Got('Huge Buckets')) mult *= 2;
			if(Molpy.Got('Trebuchet Pong'))
				mult *= Math.pow(1.5, Math.floor(Math.min(Molpy.CastleTools['Trebuchet'].amount / 2, 2000)));
			if(Molpy.Got('Carrybot')) mult *= 4;
			if(Molpy.Got('Buccaneer')) mult *= 2;
			if(Molpy.Got('Flying Buckets')) mult *= Molpy.CastleTools['Trebuchet'].amount;
			return mult * baserate;
		},
		
		gpmNP: function() {
			var baseval = 0.001;
			var mult = 1;
			if(Molpy.Got('Bucking the Trend')) mult *= 2;
			if(Molpy.Got('Crystal Well')) mult *= 10;
			if(Molpy.Got('Such Glass')) mult *= Molpy.ninjaStealth / 1000;
			return baseval * mult;
		},
		
		nextThreshold: 1
	});

	new Molpy.SandTool({
		name: 'Cuegan',
		commonName: 'cuegan|cuegans|tossed',
		icon: 'cuegan',
		desc: 'Megan and Cueball toss in a bit of extra sand',
		price: 50,
		
		spmNP: function() {
			var baserate = 0.6 + Molpy.Got('Helping Hand') * 0.2;
			var mult = 1;
			if(Molpy.Got('Glass Ceiling 2')) mult *= Molpy.GlassCeilingMult();
			if(!isFinite(mult)) return Infinity;
			if(Molpy.Got('Megball')) mult *= 2;
			if(Molpy.Got('Cooperation')) {
				mult *= Math.pow(1.05, Math.floor(Math.min(Molpy.SandTools['Bucket'].amount / 2, 8000)));
			}
			if(!isFinite(mult)) return Infinity;
			if(Molpy.Got('Stickbot')) mult *= 4;
			if(Molpy.Got('The Forty')) mult *= 40;
			if(Molpy.Got('Human Cannonball')) mult *= 2 * Molpy.CastleTools['Trebuchet'].amount;
			return baserate * mult;
		},
		
		gpmNP: function() {
			var baseval = 0.003;
			var mult = 1;
			if(Molpy.Got('Glass Spades')) mult *= 2;
			if(Molpy.Got('Statuesque')) mult *= 10;
			if(Molpy.Got('FiM')) mult *= Molpy.SandTools['LaPetite'].amount / 1e6;
			return baseval * mult;
		},
		
		nextThreshold: 2
	});

	new Molpy.SandTool({
		name: 'Flag',
		commonName: 'flag|flags|marked',
		icon: 'flag',
		desc: 'Marks out even more sand',
		price: 420,
		
		spmNP: function() {
			var baserate = 8 + Molpy.Got('Flag Bearer') * 2;
			var mult = 1;
			if(Molpy.Got('Glass Ceiling 4')) mult *= Molpy.GlassCeilingMult();
			if(!isFinite(mult)) return Infinity;
			if(Molpy.Got('Magic Mountain')) mult *= 2.5;
			if(Molpy.Got('Standardbot')) mult *= 4;
			if(Molpy.Got('Balancing Act'))
				mult *= Math.pow(1.05, Math.min(Molpy.CastleTools['Scaffold'].amount, 2000));
			if(Molpy.Got('SBTF')) {
				var waves = Molpy.CastleTools['Wave'].amount;
				if(Math.abs(Math.floor(Molpy.newpixNumber)) % 2 == 0)//even
				{
					if(!isFinite(waves)) return 0;
					mult /= Math.max(1, waves);
				} else {//odd
					mult *= waves;
				}
			}
			if(Molpy.Got('Fly the Flag')) mult *= 10 * Molpy.CastleTools['Trebuchet'].amount;
			return baserate * mult;
		},
		
		gpmNP: function() {
			var baseval = 0.007;
			var mult = 1;
			if(Molpy.Got('Flag in the Window')) mult *= 4;
			if(Molpy.Got('Crystal Wind')) mult *= 5;
			return baseval * mult;
		},
		
		nextThreshold: 4
	});

	new Molpy.SandTool({
		name: 'Ladder',
		commonName: 'ladder|ladders|reached',
		icon: 'ladder',
		desc: 'Reaches higher sand',
		price: 1700,
		
		spmNP: function() {
			var baserate = 54 + Molpy.Got('Extension Ladder') * 18;
			var mult = 1;
			if(Molpy.Got('Ninja Climber')) mult *= Molpy.ninjaStealth;
			if(mult == 0) return 0;
			if(Molpy.Got('Glass Ceiling 6')) mult *= Molpy.GlassCeilingMult();
			if(!isFinite(mult)) return Infinity;
			if(Molpy.Got('Level Up!')) mult *= 2;
			if(Molpy.Got('Climbbot')) mult *= 4;
			if(Molpy.Got('Broken Rung')) {
				var min = Infinity;
				for( var i in Molpy.SandToolsById) {
					if(i == 0 || Molpy.SandToolsById[i - 1].bought >= Molpy.SandToolsById[i - 1].nextThreshold)
						min = Math.min(min, Molpy.SandToolsById[i].amount);
				}
				for( var i in Molpy.CastleToolsById) {
					if(i == 0 || Molpy.CastleToolsById[i - 1].bought >= Molpy.CastleToolsById[i - 1].nextThreshold)
						min = Math.min(min, Molpy.CastleToolsById[i].amount);
				}
				if(min == 0) return 0;
				mult *= min;
			}
			if(Molpy.Got('Up Up and Away')) {
				var treb = Molpy.CastleTools['Trebuchet'].amount;
				if(treb == 0) return 0;
				if(!isFinite(treb)) return Infinity;
				mult *= 10 * treb;
			}
			return baserate * mult;
		},
		
		gpmNP: function() {
			var baseval = 0.015;
			var mult = 1;
			if(Molpy.Got('Crystal Peak')) mult *= 12;
			return baseval * mult;
		},
		
		nextThreshold: 8
	});

	new Molpy.SandTool({
		name: 'Bag',
		commonName: 'bag|bags|carried',
		icon: 'bag',
		desc: 'Carries sand from far away',
		price: 12000,
		
		spmNP: function() {
			var baserate = 600;
			var mult = 1;
			if(Molpy.Got('Glass Ceiling 8')) mult *= Molpy.GlassCeilingMult();
			if(!isFinite(mult)) return Infinity;
			if(Molpy.Got('Embaggening') && Molpy.SandTools['Cuegan'].amount > 14)
				mult *= Math.pow(1.02, Math.min(Molpy.SandTools['Cuegan'].amount - 14, 8000));
			if(!isFinite(mult)) return Infinity;
			if(Molpy.Got('Sandbag')) mult *= Math.pow(1.05, Math.min(Molpy.CastleTools['River'].amount, 2000));
			if(!isFinite(mult)) return Infinity;
			if(Molpy.Got('Luggagebot')) mult *= 4;
			if(Molpy.Got('Bag Puns')) mult *= 2;
			if(Molpy.Got('Air Drop')) mult *= 5;
			return baserate * mult;
		},
		
		gpmNP: function() {
			var baseval = 0.031;
			var mult = 1;
			if(Molpy.Got('Cupholder')) mult *= 8;
			return baseval * mult;
		},
		
		nextThreshold: 6000
	});

	new Molpy.SandTool({
		name: 'LaPetite',
		commonName: 'LaPetite|LaPetites|rescued',
		icon: 'lapetite',
		desc: 'Rescues sand via raft',
		price: DeMolpify('2WQ'),
		
		spmNP: function() {
			var baserate = 2e137;
			var mult = 1;
			if(Molpy.Got('Glass Ceiling 10')) mult *= Molpy.GlassCeilingMult();
			if(!isFinite(mult)) return Infinity;
			if(Molpy.Got('Frenchbot'))
				if(!isFinite(mult))
					return Infinity;
			mult *= 1e42;
			if(Molpy.Got('Bacon')) mult *= Math.pow(1.03, Molpy.CastleTools['NewPixBot'].amount);
			if(!isFinite(mult)) return Infinity;
			return mult * baserate;
		},
		
		gpmNP: function() {
			var baseval = 0.063;
			var mult = 1;
			if(Molpy.Got('Tiny Glasses')) mult *= 9;
			if(Molpy.Got('FiM')) mult *= Molpy.SandTools['Cuegan'].amount / 1e6;
			return baseval * mult;
		},
		nextThreshold: 1
	});
}

Molpy.DefineCastleTools = function() {
	new Molpy.CastleTool({
		name: 'NewPixBot',
		commonName: 'newpixbot|newpixbots|unautomated|automated',
		icon: 'newpixbot',
		desc: 'Automates castles after the ONG\n(if not ninja\'d)',
		price0: 1,
		price1: 0,
		destroyC: 0,
		
		buildC: function() {
			var baseval = 1;
			if(Molpy.Got('Robot Efficiency')) baseval++;
			if(Molpy.Got('HAL-0-Kitty')) baseval += Math.floor(Molpy.Redacted.totalClicks / 9);
			var pow = 0;
			for( var i in Molpy.npbDoublers) {
				var me = Molpy.Boosts[Molpy.npbDoublers[i]];
				if(me.bought) pow++;
			}

			baseval *= Math.pow(2, pow);
			baseval *= Molpy.LogicastleMult();
			if(Molpy.Got('Glass Ceiling 1')) baseval *= Molpy.GlassCeilingMult();
			if(Molpy.Boosts['NavCode'].power) baseval = baseval * .001;
			if(Molpy.Got('Frenchbot')) baseval *= 1e210;
			if(Molpy.Got('Bacon')) baseval *= 10;
			return Math.floor(baseval);
		},
		
		destroyG: 0,
		
		buildG: function() {
			var baseval = 2;
			if(Molpy.Got('Bacon')) baseval *= 10;
			if(Molpy.Got('Bottle Battle')) baseval *= 3;
			if(Molpy.Got('Fireproof')) baseval *= 1e10;
			return baseval;
		},
		
		nextThreshold: 1,
		baseNinjaTime: 12 * 60 * 1000, //12 minutes for newpixbot delay
		ninjaTime: this.baseNinjaTime,
		
		calculateNinjaTime: function() {
			var ninjaFactor = 1;
			if(Molpy.Got('Busy Bot')) ninjaFactor += 0.1;
			if(Molpy.Got('Stealthy Bot')) ninjaFactor += 0.1;
			if(Molpy.Got('Chequered Flag')) ninjaFactor += 0.2;
			this.ninjaTime = this.baseNinjaTime / ninjaFactor;
			if(Molpy.IsEnabled('Western Paradox')) this.ninjaTime *= 3;
		}
	});

	Molpy.npbDoublers = ['Carrybot', 'Stickbot', 'Standardbot', 'Climbbot', 'Luggagebot', 'Recursivebot', 'Flingbot', 'Propbot', 'Surfbot', 'Smallbot'];
	Molpy.npbDoubleThreshold = 14;

	new Molpy.CastleTool({
		name: 'Trebuchet',
		commonName: 'trebuchet|trebuchets|flung|formed',
		icon: 'trebuchet',
		desc: 'Flings some castles, forming more.',
		price0: 13,
		price1: 1,
		
		destroyC: function() {
			if(Molpy.Got('War Banner'))
				return 1;
			else
				return 2;
		},
		
		buildC: function() {
			var baseval = 4;
			if(Molpy.Got('Spring Fling')) baseval++;
			if(Molpy.Got('Varied Ammo')) for( var i in Molpy.CastleTools)
				if(Molpy.CastleTools[i].amount > 1) baseval++;
			if(Molpy.Got('Throw Your Toys'))
				baseval += Molpy.SandTools['Bucket'].amount + Molpy.SandTools['Flag'].amount;
			if(Molpy.Got('Flingbot')) baseval *= 4;
			if(Molpy.Got('Minigun')) baseval *= Molpy.CastleTools['NewPixBot'].amount;
			baseval *= Molpy.LogicastleMult();

			var mult = Math.pow(10, Molpy.Got('Flying Buckets') + Molpy.Got('Human Cannonball') + Molpy.Got('Fly the Flag') + Molpy.Got('Up Up and Away') + Molpy.Got('Air Drop'));
			if(Molpy.Got('Air Drop')) mult *= 5;
			if(Molpy.Got('Glass Ceiling 3')) mult *= Molpy.GlassCeilingMult();

			return Math.floor(baseval * mult);
		},
		
		destroyG: 1,
		
		buildG: function() {
			var baseval = 7;
			var mult = 1;
			if(Molpy.Got('Stained Glass Launcher')) mult *= Molpy.GlassCeilingCount();
			return baseval * mult;
		},
		
		nextThreshold: 2
	});
	new Molpy.CastleTool({
		name: 'Scaffold',
		commonName: 'scaffold|scaffolds|squished|raised',
		icon: 'scaffold',
		desc: 'Squishes some castles, raising a place to put more.',
		price0: 60,
		price1: 100,
		
		destroyC: function() {
			var baseval = 6;
			if(Molpy.Got('Balancing Act')) baseval *= Math.pow(1.05, Math.min(Molpy.SandTools['Flag'].amount, 8000));
			if(Molpy.Got('Precise Placement')) baseval -= Math.floor(Molpy.SandTools['Ladder'].amount * 0.5);
			return Math.max(0, Math.floor(baseval));
		},
		
		buildC: function() {
			var baseval = 22;
			if(Molpy.Got('Propbot')) baseval *= 4;
			if(Molpy.Got('Stacked')) baseval *= Molpy.CastleTools['NewPixBot'].amount;
			if(Molpy.Got('Balancing Act')) baseval *= Math.pow(1.05, Math.min(Molpy.SandTools['Flag'].amount, 8000));
			baseval *= Molpy.LogicastleMult();
			if(Molpy.Got('Glass Ceiling 5')) baseval *= Molpy.GlassCeilingMult();
			return Math.floor(baseval);
		},
		
		destroyG: 6,
		
		buildG: function() {
			var baseval = 21;
			if(Molpy.Got('Leggy')) baseval *= 8;
			if(Molpy.Got('Space Elevator')) baseval *= Molpy.SandTools['Ladder'].amount / 1e4;
			return Math.floor(baseval);
		},
		
		nextThreshold: 4
	});
	new Molpy.CastleTool({
		name: 'Wave',
		commonName: 'wave|waves|swept|deposited',
		icon: 'wave',
		desc: 'Sweeps away some castles, depositing more in their place.',
		price0: 300,
		price1: 80,
		
		destroyC: function(next) {
			next = next || 0;
			var baseval = 24;
			if(Molpy.Got('SBTF')) {
				if(Math.abs(Math.floor(Molpy.newpixNumber)) % 2 == 1 - next) { //odd
					baseval = Math.floor(baseval * Math.pow(1.06, Math.min(Molpy.SandTools['Flag'].amount, 8000)));
				}
			}

			if(Molpy.Got('Erosion')) {
				baseval -= Molpy.CastleTools['Wave'].totalCastlesWasted * 0.2;
				baseval -= Molpy.CastleTools['River'].bought * 2;
			}
			baseval = Math.floor(Math.max(baseval, 0));
			return baseval;
		},
		
		buildC: function(next) {
			next = next || 0;
			var baseval = 111;
			baseval += Molpy.Got('Swell') * 19;
			if(Molpy.Got('Surfbot')) baseval *= 4;
			if(Molpy.Got('Big Splash')) baseval *= Molpy.CastleTools['NewPixBot'].amount;
			baseval *= Molpy.LogicastleMult();
			if(Molpy.Got('SBTF')) {
				if(Math.abs(Math.floor(Molpy.newpixNumber)) % 2 == next) { //even
					baseval = baseval * Math.pow(1.06, Math.min(Molpy.SandTools['Flag'].amount, 8000));
				}
			}
			if(Molpy.Got('Glass Ceiling 7')) baseval *= Molpy.GlassCeilingMult();
			return Math.floor(baseval);
		},
		
		nextThreshold: 8,
		destroyG: 19,
		
		buildG: function() {
			var baseval = 55;
			if(Molpy.Got('Clear Wash')) baseval *= 10;
			return baseval;
		},
		
		destroyFunction: function() {
			if(this.totalCastlesDestroyed >= 2000) Molpy.UnlockBoost('Erosion');
			if(this.totalCastlesDestroyed >= 500) Molpy.EarnBadge('Wipeout');
		}
	});
	new Molpy.CastleTool({
		name: 'River',
		commonName: 'river|rivers|washed|left',
		icon: 'river',
		desc: 'Washes away many castles, but leaves many more new ones.',
		price0: 1800,
		price1: 1520,
		
		destroyC: function() {
			var baseval = 160;
			if(Molpy.Got('Riverish')) {
				var newClicks = Molpy.beachClicks - Molpy.Boosts['Riverish'].power;
				var log = Math.log(newClicks);
				if(log > 0) {
					var reduction = Math.min(baseval, log * log);
					baseval -= reduction;
				}
			}
			var mult = 1;
			if(Molpy.Got('Sandbag')) mult *= Math.pow(1.05, Math.min(Molpy.SandTools['Bag'].amount, 8000));
			return Math.floor(baseval * mult);
		},
		
		buildC: function() {
			var baseval = 690;
			baseval *= Molpy.LogicastleMult();
			var mult = 1;
			if(Molpy.Got('Sandbag')) mult *= Math.pow(1.05, Math.min(Molpy.SandTools['Bag'].amount, 8000));
			if(Molpy.Got('Smallbot')) mult *= 4;
			if(Molpy.Got('Irregular Rivers')) mult *= Molpy.CastleTools['NewPixBot'].amount;
			if(Molpy.Got('Glass Ceiling 9')) mult *= Molpy.GlassCeilingMult();
			return Math.floor(baseval * mult);
		},
		
		destroyG: 52,
		
		buildG: function() {
			var baseval = 134;
			if(Molpy.Got('Crystal Streams')) baseval *= 12;
			return baseval;
		},
		
		nextThreshold: 1000
	});
	new Molpy.CastleTool({
		name: 'Beanie Builder',
		commonName: 'beanie builder|beanie builders|escavated|recreated',
		icon: 'beaniebuilder',
		desc: 'Excavate some castles and recreate copies elsewhere.',
		price0: DeMolpify('40Q'),
		price1: DeMolpify('60Q'),
		
		destroyC: function() {
			return DeMolpify('1Q');
		},
		
		buildC: function() {
			var baseval = DeMolpify('10Q');
			var mult = 1;
			if(Molpy.Got('Glass Ceiling 11')) mult *= Molpy.GlassCeilingMult();

			return Math.floor(baseval * mult);
		},
		
		destroyG: 115,
		
		buildG: function() {
			var baseval = 281;
			if(Molpy.Got('Super Visor')) baseval *= 15;
			if(Molpy.Got('Crystal Helm')) baseval *= 5;
			if(Molpy.Got('Knitted Beanies')) baseval *= Molpy.SandTools['Bag'].amount / 1e6;
			return Math.floor(baseval);
		},
		
		nextThreshold: 1
	});
}
