'use strict';

var Molpy={};
Molpy.version=3.33333;

/**************************************************************
 * Game Strings
 * 
 * String constants that are used throughout the game.
 *************************************************************/

Molpy.HardcodedData = function() {
	Molpy.Periods = [
			[9, "The Debut/What? Period"],
			[23, "The Dark Period"],
			[44, "The Sandcastle Period"],
			[74, "The Megan Period"],
			[87, "The Happiness Period"],
			[104, "The Male Period"],
			[124, "The Rebuild Period"],
			[136, "Age of the Slow Pixel"],
			[145, "The Great Expansion"],
			[167, "The Populated Period of Expansion"],
			[178, "\"Wanna Swim?\" Period"],
			[182, "Second Age of the Slow Pixel"],
			[211, "Operation Connect Castle"],
			[233, "Attack of the Trebuchet"],
			[324, "Second Megan Period"],
			[375, "The Architect Age"],
			[420, "Recursion"],
			[462, "The Poles"],
			[478, "The Scaffolding"],
			[493, "The Tasting"],
			[543, "The Scaffolding continued"],
			[582, "The Observation/Observed Platform"],
			[666, "The Building of the Rooks"],
			[725, "The Next Level"],
			[798, "Third Megan Period"],
			[802, "The Little French Girl Period"],
			[826, "Fourth Megan Period"],
			[840, "\"The Sea Can Do Whatever It Wants\" Period"],
			[868, "The Additional Flags Period"],
			[874, "Third Age of the Slow Pixel"],
			[882, "The Bag Period"],
			[971, "The Fading"],
			[997, "The First Journey Period"],
			[1001, "The Fake Loop"],
			[1021, "Second Journey Period"],
			[1077, "The River Period"],
			[1121, "Third Journey Period"],
			[1149, "Second River Period"],
			[1228, "Fourth Journey Period"],
			[1300, "The Hills Period"],
			[1336, "Fifth Journey Period"],
			[1359, "The Tree Period"],
			[1376, "Cueball's Quest"],
			[1403, "Sixth Journey Period"],
			[1423, "Third River Period"],
			[1502, "Seventh Journey Period"],
			[1552, "\"Wow\" Baobab Period"],
			[1578, "Vineyard Period"],
			[1611, "Questioning the Quest at the Abandoned Habitation"],
			[1661, "Megan's Quest"],
			[1725, "Into the Mountains"],
			[1765, "\"Snake!\""],
			[1825, "The Tree Stumps"],
			[1882, "Chirp"],
			[1928, "The Tiny River Period"],
			[1969, "The \"Wowterfall\" Period"],
			[2014, "Eighth Journey Period"],
			[2065, "The Epic of Pricklymolp"],
			[2141, "The Fluttermolpy Discussion"],
			[2178, "The Weird Tree Period"],
			[2225, "The Abandoned Former Habitation on the Mountain Plateau"],
			[2317, "The Attack"],
			[2356, "Ninth Journey Period"],
			[2388, "The Sunset Period"],
			[2440, "Cueball's Watch"],
			[2530, "Megan's Watch"],
			[2567, "Cueball's Awakening"],
			[2610, "The Observation at the Summit"],
			[2615, "The Bucket Period"],
			[2645, "Into Thin Air"],
			[2693, "First Encounter"],
			[2714, "Communication Period"],
			[2737, "Pictogram Period"],
			[2788, "Tenth Journey Period"],
			[2801, "The Map Period"],
			[2813, "The Flag Period"],
			[2839, "The City Period"],
			[2856, "The Castle Period"],
			[2920, "The Understanding"],
			[3015, "RUN."],
			[3029, "Meeting The Forty"],
			[3088, "The Raftcastle"],
			[3094, "The End"],
	]

	Molpy.Eras = [
			[124, "The Pre-expansion Era"],
			[420, "The Castleiferous Era"],
			[582, "The Industrial Era"],
			[798, "The Developing Era"],
			[971, "The Enlightenment Era"],
			[1021, "The Shoreline Era"],
			[1228, "The River Era"],
			[1423, "The Hills and Forest Era"],
			[1661, "The Discovery Era"],
			[2356, "The Mountain Era"],
			[1661, "The Night Era"],
			[2615, "The Summit Era"],
			[2813, "The Contact Era"],
			[2920, "The Civilization Era"],
			[3094, "The Rescue Era"]]

	Molpy.Eons = [
		[971, "The Sandcastle Eon"],
		[2615, "The Journey Eon"],
		[3094, "The Encounter Eon"]]
	

	Molpy.titles = [
		'Sandcastle Builder',
		'Sandcastle Builder',
		'Sandcastle Builder',
		'Sandcastle Builder',
		'Sandcastle Builder',
		'Sandy Clicker',
		'Injokes: The Game',
		'Hotdog of Things that are on my side for 600, Alex',
		'"The Dwarf Fortress of Idle Games" (hardly)',
		'"Skyrim with Guns" (would be a far cry better than this)',
		'Still a better love story than Twilight',
		'Serious Business'];
	
	Molpy.defaultLayoutData="3.2PPdefaultP00010010000000P11110111110000111000000000P517C0S449C-1S557C463S0C-2S0C48S-2C134S944C463S0C701S236C135S0C134S718C675S1060C675S547C675S889C675S557C0S557C228S0C535S0C761S1115C0S1115C237S1241C685S1096C155S1094C664S1096C365S1096C440S1499C0SP385C220S515C40S556C84S554C207S368C51S320C385S228C386S556C214S556C220S545C201S1499C576S382C100S383C211S258C61S382C195S383C60S382C59S381C209S74C237SP";
	Molpy.defaultLayoutData2="3.2PPdefault2P00010010000000P11111011111111111111000011P517C0S449C-1S557C463S0C-2S0C48S-2C134S944C463S0C701S236C135S0C134S718C675S1060C675S547C675S889C675S557C0S557C228S0C535S0C761S1115C0S1115C237S1241C685S1096C155S1094C664S1096C365S1096C440S1499C0SP385C220S515C40S556C84S554C207S368C51S320C385S228C386S556C214S556C220S545C201S1499C576S382C100S383C211S258C61S382C195S383C60S382C59S381C209S74C237SP";
	
	
	{//#region puns	
		Molpy.bp = [
			"One True Comic II: The Baginning",
			"One True Comic 2: Electric Bagaloo",
			"2 Bags 2 Curious",
			"The Re-Adventures of Bagsitting",
			"Conan the Bagbarian 2",
			"Bag to the Future",
			"Bag Runner 2: The Last Replicant",
			"Bag Wars - Episode V - The Sandcastle Strikes Back",
			"A Tale of Two Bags",
			"Cueball: The Guy Who Bagged Me",
			"Harry Potter and the Chamber of Bags",
			"Bagman and Robin",
			"Bagman Forever",
			"Bagman Begins",
			"Bagman: The Dark Nip",
			"Bagman: The Dark Watery Stuff Rises",
			"The Passion of the Bags",
			"The Good The Bag And The Ugly",
			"B For Bagdetta",
			"Theater Of Bags",
			"Bag Of Blood",
			"The Day The Bag Stood Still ",
			"Bag Wars Episode IV - A New Loop",
			"The Big Bag Theory",
			"American Baggy",
			"Cue and Meg's Excellent Bagventure",
			"The Bagfather: Part II",
			"The Hunt for Bag October",
			"Bag Storm Rising",
			"Clear and Present Bags",
			"The Temporal Strikes Bag",
			"The Bagmaker",
			"The Pelican Bag",
			"The Gingerbag Man",
			"Runaway Bag",
			"Transbaggers",
			"Bagformers",
			"The Hunger Bags",
			"Rucksack at Tiffany's",
			"Bagglestar Galactica",
			"Cool Bag Loop",
			"Groundbag Day",
			"Bag2: Hyperbag",
			"Bagger's Game",
			"Bagger's Shadow",
			"Speaker for the Bag",
			"Bagocide",
			"Shadow of the Bagemon",
			"The Lord of the Bags 1: The Fellowship of the Bags",
			"The Lord of the Bags 2: The Two Sandcastles",
			"The Lord of the Bags 3: The Return of La Petite",
			"Requiem for a Bag",
			"The Bag Before Time",
			"Baggie Nights",
			"Bagnolia",
			"Punch-Drunk Bags",
			"There Will Be Bags",
			"The Bagloliers",
			"Children of the Bag",
			"Bagcatcher",
			"Bagstarter",
			"The Green Bag",
			"The Running Bag",
			"Bag By Me",
			"Firebag",
			"Buffy The Bag Slayer",
			"Baghouse",
			"Baggett Halverson",
			"Bagengers",
			"Agents of B.A.G.",
			"Bagel",
			"Cabin in the Bag",
			"Bagenity",
			"Bag Suns",
			"Dr. Horrible's Sing-Along Bag",
			"Much Abag about Nothing",
			"Citizen Bag",
			"Seven Bagurai",
			"Bag Ocean 3: Until the End of Time",
			"No Castle for Old Bags",
			"Casabaga",
			"Lawrence of Bagrabia",
			"Bagard of Oz",
			"The Andromeda Bag",
			"The Terminal Bag",
			"Eaters of the Bag",
			"The Great Bag Robbery",
			"Rising Bag",
			"The Lost Bag",
			"Bagframe",
			"State of Bag",
			"Drop That Strangebag, or: How I Learned to Stop Worrying and Love the Loop",
			"Jurassic Bag",
			"Bag Trek Into Darkness",
			"The Bagtrix Reloaded",
			"Bag Window",
			"The Thomas Crown Bag",
			"3 Bags Of The Condor",
			"A Good Day to Bag Hard",
			"Bag to the Beach",
			"The Hitchhiker's Guide to Baggage",
			"The Bag at the End of the Universe",
			"Bags, the Universe and Everything",
			"So Long and Thanks for All the Bags",
			"Mostly Bagless",
			"And Another Bag",
			"Beauty and the Bag",
			"Bagspotting",
			"Three bags and a baby",
			"Bag Life!",
			"Rosencrantz & Guildenstern are Bags",
			"Men in Bag",
			"Secrets of the Bag-Bag Sisterhood",
			"Fried Bag Tomatoes",
			"Bag Beauty",
			"Singing in the Bag",
			"Fiddler in the Bag",
			"Return to Bag Mountain",
			"Bags Bunny",
			"Brokebag Mountain: Two in the Bag",
			"Breaking Bag",
			"It's a Bag, Bag, Bag, Bag World",
			"B*A*G*S",
			"Bag Trouble in Little China",
			"'<i>The Papal Pun- <b>A Bagwork Orange</b></i>'",
			"Bag Story",
			"A Bag's Life",
			"Bagsters, Inc.",
			"Bagging Nemo",
			"BAGG·E",
			"Bagatouille",
			"The Inbagibles",
			"The Incredibags",
			"Bagalon 5",
			"The Bag Lebowski",
			"Silence of the Bags",
			"Starbag SB-1",
			"Starbag Atlantis",
			"Starbag Universe",
			"Tron Bagacy",
			"The Last Bagfighter",
			"Bagaxy Quest",
			"The Italian Bag",
			"Half-Bag 3 Confirmed!",
			"The Big Bag Wolpy",
			"The Bag of Music",
			"Iron Bag",
			"Baglander",
			"The Molpy, the Bag, and the Castle",
			"Treasures of the Bag",
			"Romeo and Bagguette",
			"Bags for Dummies",
			"Tomb Bagger",
			"Raiders of the Lost Bag",
			"Bagnado",
			"Bag vs. Predator",
			"Bagception",
			"Baginator",
			"The Legend of Bagger Vance",
			"Bag of Our Fathers",
			"Go ahead, make my bag!",
			"We are the Bags. Resistance is futon",
			"Three Men and a Baggy",
			"12 Angry Bags",
			"Bagland",
			"Bag of The Tentacle",
			"Full Metal Bag",
			"The Bag on the River Kwai",
			"The Bag Sleep",
			"Bag Business",
			"Bag Fiction",
			"Once Upon a Time in Bag",
			"The Third Bag",
			"Raging Bag",
			"Inglorious Bagterds",
			"Bagzilla",
			"Bagatar",
			"Bagtanic",
			"Clash of the Bags",
			"For a Bagful of Dollars",
			"Bill Bag: Vol 1",
			"Million Dollar Baggy",
			"Rosemanry's Baggy",
			"A Streetbag Named Desire",
			"Bag of Steel",
			"Pacific Bag",
			"Bags of Bloodsteel",
			"Bag for the Holidips",
			"Knights of Bagassdom",
			"The Bag Commandments",
			"Dr. Bag",
			"From Russia With A Bag",
			"Goldbag",
			"Thunderbag",
			"Bags Only Live Twice",
			"On Her Majesty's Secret Bag",
			"Bags Are Forever",
			"Live and Let Bag",
			"The Man with the Golden Bag",
			"The Bag Who Loved Me",
			"Bagraker",
			"For Your Bags Only",
			"Octobaggy",
			"A View to a Bag",
			"The Living Baglights",
			"Licence to Bag",
			"GoldenBag",
			"Bag Never Dies",
			"The Bag is Not Enough",
			"Die Another Bag",
			"Bag Royale",
			"Bag of Solace",
			"Bagfall",
			"Bagmember",
			"Double Bag Seven",
			"Ocean's Bag",
			"The Royal Tenenbags",
			"Bags Wide Shut",
			"A Bag Day's Night",
			"The Baggit",
			"Finnegan's Bag",
			"One Hundred Bags of Solitude",
			"Bagstock: 3 Dips Of Cuegan And Megball",
			"The Sandcastle for Bagladesh",
			"Jimi Hendrix and Bag of Gypsys: Live at the Sandcastle East",
			"U2: Sandcastles And Bags",
			"Neil Young: Bag of Gold",
			"Divine Bagness",
			"The Bag Holly Story",
			"Immortal Sandcastle",
			"Bag The Line",
			"Pump Up The Sandcastle (Wait Hard!)",
			"Phantom of the Sandcastle",
			"The Bag Violin",
			"A Little Bag Music",
			"A Chorus Bag",
			"My Bag Lady",
			"My Fair Bag",
			"Sweeny Todd: The Demon Bagger Of Fleet Street",
			"The Baggy Horror Sandcastle Show",
			"Bag# For Experienced Programmers",
			"Upgrading and Repairing BAGs",
			"Bag Design for Engineers",
			"Bag Forms 2.0 Programming",
			"Human-Bag Interaction",
			"Steal This Bag Book 4.0",
			"Visual BAG .NET in Easy Steps",
			"The Bag Practice of Statistics",
			"Bagculus",
			"Security in Bagging",
			"BAG/IP Protocol Suite",
			"Linear Bagular",
			"Accounting: What the Bags Mean",
			"BAGIX Network Programming",
			"Object-Oriented Systems Analysis and Design with BAG"
		]
	}
	
	{//#REGION Lyrics :P	
		Molpy.cms = [
			"Coma Molpy Style",
			"Molpy Style",
			"Blitzin' the thread, just one more page until I ketch it",
			"Read through the decrees, signposts, ONGs and ponder ev'ry tidbit",
			"All I need is just a bit of Time to read all of it",
			"But Outside says I have to quit",
			"Mustard might appear",
			"The other night we saw an extra star just disappear",
			"Some extra Cueganites went too, turned back into thin air",
			"An extra alt-text dot is gone as well, will we ever know where?",
			"Were they ever there?",
			"In the O.T.T., follow the decree",
			"Cos I'm the pope, hey!",
			"So post some rope, hey!",
			"When you're postin', you can be boastin'",
			"About out aims, hey!",
			"To have no flames, hey!",
			"Cos we turn our disagreements into games, -ames, -ames, -ames, -a-a-a-a-a-a-a-aaaa...",
			"Coma Molpy Style",
			"Molpy Style",
			"Co - co - co - co - Coma Molpy Style",
			"Molpy Style",
			"Co - co - co - co - Coma Molpy Style",
			"Heyyyy, Neat Sandcastle",
			"Co - co - co - co - Coma Molpy Style",
			"Heyyyy, Neat Sandcastle",
			"Co - co - co - co - Coma Molpy Style",
			"Back in the present wearing hats with all the OTTers",
			"Bumping the firstposts, and discussing all the Elders",
			"Some have not been seen in wix, so have they yet forgot us?",
			"But some are still posting with us",
			"There's a spoiler here!",
			"It is a link to the live image, not the hashed one there!",
			"Don't want the blitzing to be ruined that would not be fair",
			"Better edit the hash in and next time ONG with care",
			"Next time that you dare",
			"Postcounts growin', the cakes are flowin'",
			"The lurkers lurk, hey",
			"The m*stards ch*rp, hey",
			"You make up your mind, to not fall behind",
			"Cannot shirk, hey",
			"The speed's berserk, hey",
			"Staying up forever just can't work, -erk, -erk, -erk, -r-r-r-r-r-r-r-r-rrrrr...",
			"Coma Molpy Style",
			"Molpy Style",
			"Co - co - co - co - Coma Molpy Style",
			"Molpy Style",
			"Co - co - co - co - Coma Molpy Style",
			"Heyyyy, Neat Sandcastle",
			"Co - co - co - co - Coma Molpy Style",
			"Heyyyy, Neat Sandcastle",
			"Co - co - co - co - Coma Molpy Style",
			"Walk with me, until you see the tree",
			"Molpy molpy beanie river grapevine sea!",
			"Walk with me, avoid all heresy",
			"Molpy molpy bucket river OTC! (ain't no redunakitty!)",
			"Coma Molpy Style",
			"Co-co-co - co-co-co",
			"Heyyyy, Neat Sandcastle",
			"Co - co - co - co - Coma Molpy Style",
			"Heyyyy, Neat Sandcastle",
			"Co - co - co - co - Coma Molpy Style",
			"Co-co-co - co-co-co",
			"Coma Molpy Style"
		]
	}
			
	{ //#region more lyrics
		var bdy = 'Boom De Yada';
		Molpy.love=[
			'I love sandcastles',
			'I love our weird haiku',
			'I love the Book of Time',
			'I love to chart all you!',
			'I love the whole thread',
			'And all its hatted folks',
			bdy,bdy,bdy,bdy,
			'I love sigcouragement',
			'amu<span class="faded">semen</span>tcoffeesea',
			'I love the NewPixBot',
			'I love the Wiki!',
			'I love the whole thread',
			'And all its mysteries',
			bdy,bdy,'Bboz Dr Yndn','Bboz Dr Yndn',
			'I love photomanips',
			'I love our visitors',
			'I love to make you hats!',
			'I love inquisitors',
			'I love the whole thread',
			'The future\'s pretty cool!',
			bdy,bdy,bdy,bdy,
			'I love to journey',
			'I love our beesnakes two',
			'I love Time-mapping',
			'I love to cupcake you!',
			'I love the whole thread',
			'and all its footnote jokes',
			bdy,bdy,bdy,bdy,
			'I love newpages',
			'I love my flashy gif',
			'I <small>(might)</small> love waffles...',
			'I love to make you scripts',
			'I love the whole thread',
			'And all its mysteries',
			bdy,bdy,bdy,'<small>'+bdy+'</small>',
			'I love d-dactyls',
			'I love our blitzers',
			'I love to molpy-hunt',
			'I love the whispers',
			'I love the whole thread',
			'The future\'s pretty cool!',
			bdy,bdy,'<div class="flip">'+bdy+'</div>','<div class="flip">'+bdy+'</div>'
		];
	}
}

	

Molpy.CheckBuyUnlocks = function(tool) {
	if(Molpy.needlePulling) return;
	var me = Molpy.SandTools['Bucket'];
	if(me.amount >= 1) Molpy.UnlockBoost('Bigger Buckets');
	if(me.amount >= 4) Molpy.UnlockBoost('Huge Buckets');
	if(me.amount >= Molpy.npbDoubleThreshold) Molpy.UnlockBoost('Carrybot');
	if(me.amount >= 30) Molpy.UnlockBoost('Buccaneer');
	if(me.amount >= 50) Molpy.UnlockBoost('Bucket Brigade');
	if(me.amount >= 100 && Molpy.Earned('Flung')) Molpy.UnlockBoost('Flying Buckets');

	me = Molpy.SandTools['Cuegan'];
	if(me.amount >= 1) Molpy.UnlockBoost('Helping Hand');
	if(me.amount >= 4) Molpy.UnlockBoost('Cooperation');
	if(me.amount >= 8) Molpy.UnlockBoost('Megball');
	if(me.amount >= Molpy.npbDoubleThreshold) Molpy.UnlockBoost('Stickbot');
	if(me.amount >= 40) Molpy.UnlockBoost('The Forty');
	if((me.amount >= 100) && Molpy.Earned('Flung')) Molpy.UnlockBoost('Human Cannonball');

	me = Molpy.SandTools['Flag'];
	if(me.amount >= 1) Molpy.UnlockBoost('Flag Bearer');
	if(me.amount >= 2) Molpy.UnlockBoost('War Banner');
	if(me.amount >= 6) Molpy.UnlockBoost('Magic Mountain');
	if(me.amount >= Molpy.npbDoubleThreshold) Molpy.UnlockBoost('Standardbot');
	if(me.amount >= 25) Molpy.UnlockBoost('Chequered Flag');
	if(me.amount >= 40) Molpy.UnlockBoost('Skull and Crossbones');
	if((me.amount >= 100) && Molpy.Earned('Flung')) Molpy.UnlockBoost('Fly the Flag');

	me = Molpy.SandTools['Ladder'];
	if(me.amount >= 1) Molpy.UnlockBoost('Extension Ladder');
	if(me.amount >= Molpy.npbDoubleThreshold) Molpy.UnlockBoost('Climbbot');
	if(me.amount >= 25) Molpy.UnlockBoost('Broken Rung');
	if((me.amount >= 100) && Molpy.Earned('Flung')) Molpy.UnlockBoost('Up Up and Away');

	me = Molpy.CastleTools['NewPixBot'];
	if(me.amount >= 3) Molpy.UnlockBoost('Busy Bot');
	if(me.amount >= 8) Molpy.UnlockBoost('Robot Efficiency');
	if(me.amount >= Molpy.npbDoubleThreshold && Molpy.Got('Robot Efficiency')) Molpy.UnlockBoost('Recursivebot');
	if(me.amount >= 17) Molpy.UnlockBoost('HAL-0-Kitty');
	if(me.amount >= 22 && Molpy.Got('DoRD')) Molpy.UnlockBoost('Factory Automation');

	me = Molpy.CastleTools['Trebuchet'];
	if(me.amount >= 1) Molpy.UnlockBoost('Spring Fling');
	if(me.amount >= 2) Molpy.UnlockBoost('Trebuchet Pong');
	if(me.amount >= 5) Molpy.UnlockBoost('Varied Ammo');
	if(me.amount >= Molpy.npbDoubleThreshold) Molpy.UnlockBoost('Flingbot');
	if(me.amount >= 20) Molpy.UnlockBoost('Throw Your Toys');
	if(me.amount >= 50) Molpy.EarnBadge('Flung');

	me = Molpy.CastleTools['Scaffold'];
	if(me.amount >= 2) Molpy.UnlockBoost('Precise Placement');
	if(me.amount >= 4) Molpy.UnlockBoost('Level Up!');
	if(me.amount >= Molpy.npbDoubleThreshold) Molpy.UnlockBoost('Propbot');
	if(me.amount >= 20) Molpy.UnlockBoost('Balancing Act');

	me = Molpy.CastleTools['Wave'];
	if(me.amount >= 2) Molpy.UnlockBoost('Swell');
	if(me.amount >= Molpy.npbDoubleThreshold) Molpy.UnlockBoost('Surfbot');
	if(me.amount >= 30) Molpy.UnlockBoost('SBTF');

	me = Molpy.SandTools['Bag'];
	if(me.amount >= 2) Molpy.UnlockBoost('Embaggening');
	if(me.amount >= Molpy.npbDoubleThreshold) Molpy.UnlockBoost('Luggagebot');
	if(me.amount >= 30) Molpy.UnlockBoost('Bag Puns');
	if((me.amount >= 100) && Molpy.Earned('Flung')) Molpy.UnlockBoost('Air Drop');
	var you = me;
	me = Molpy.CastleTools['River'];
	if(me.amount && you.amount) Molpy.UnlockBoost('Sandbag');
	if(me.amount >= Molpy.npbDoubleThreshold) Molpy.UnlockBoost('Smallbot');

	me = Molpy.SandTools['LaPetite'];
	if(me.amount > 1000) {
		Molpy.UnlockBoost('Frenchbot');
	}
	if(Molpy.Earned('Fractals Forever') && !Molpy.Got('Fractal Sandcastles')) {
		Molpy.UnlockBoost('Fractal Sandcastles');
		Molpy.Boosts['Fractal Sandcastles'].power = 0;
		Molpy.Boosts['Fractal Sandcastles'].bought = 1; //woo freebie!
		Molpy.boostNeedRepaint = 1;
		Molpy.recalculateRates = 1;
		Molpy.BoostsOwned++;
	}
	if(Molpy.Earned('Unreachable?')) Molpy.UnlockBoost("Chateau");

	if(Molpy.Boosts['Castles'].spent > 2e8) {
		Molpy.EarnBadge('Big Spender');
	}
	if(Molpy.Boosts['Castles'].spent > 8e12) {
		Molpy.EarnBadge('Valued Customer');
	}

	if(Molpy.BadgesOwned >= 69) {
		Molpy.UnlockBoost('Ch*rpies');
	}

	if(Molpy.SandToolsOwned >= 200) Molpy.EarnBadge('Beachscaper');
	if(Molpy.CastleToolsOwned >= 100) Molpy.EarnBadge('Beachmover');
	if(Molpy.SandToolsOwned >= 1000) Molpy.EarnBadge('Beachomancer');
	if(Molpy.CastleToolsOwned >= 500) Molpy.EarnBadge('Beachineer');
	if(Molpy.BoostsOwned >= 50) Molpy.EarnBadge('Better This Way');

	if(Molpy.SandToolsOwned >= 2101) Molpy.EarnBadge('All Your Base');
	if(Molpy.SandToolsOwned >= 3000) Molpy.EarnBadge('Look Before You Leap');
	if(Molpy.CastleToolsOwned >= 4000) Molpy.EarnBadge('Fully Armed and Operational Battlestation');
	if(Molpy.SandToolsOwned > 9000) Molpy.EarnBadge('WHAT');
	if(Molpy.SandToolsOwned + Molpy.CastleToolsOwned >= 40000) Molpy.EarnBadge('\\/\\/AR]-[AMMER');

	if(Molpy.Got('Ninja Builder') && Molpy.Boosts['GlassBlocks'].power > 10) Molpy.UnlockBoost('Glass Jaw');

	if(Molpy.Redacted.totalClicks >= 554 && (Molpy.Got('Overcompensating') || Molpy.Got('Doublepost'))) {
		Molpy.UnlockBoost('RRSR');
	} else {
		Molpy.LockBoost('RRSR'); //prevent use in shortpix!
	}

	if(Molpy.GlassCeilingCount()) Molpy.GlassCeilingUnlockCheck();
	if(Molpy.SandToolsOwned >= 123) Molpy.UnlockBoost('Sand Tool Multi-Buy');
	if(Molpy.CastleToolsOwned >= 234) Molpy.UnlockBoost('Castle Tool Multi-Buy');

	if(Molpy.Got('NavCode')) //just in case they didn't earn it the normal way
	{
		Molpy.EarnBadge('On the 12th Dip of Judgement');
	}
	if(Molpy.groupBadgeCounts.discov > 10 && Molpy.Earned("Dude, Where's my DeLorean?")) {
		Molpy.UnlockBoost('Memories Revisited');
	}
	if(Molpy.groupBadgeCounts.discov > 50 && Molpy.Got('Memories Revisited')
		&& Math.abs(Molpy.newpixNumber - Molpy.highestNPvisited) >= 20) {
		Molpy.UnlockBoost('Now Where Was I?');
	}
	if(Molpy.groupBadgeCounts.discov > 100) {
		Molpy.UnlockBoost('Stealth Cam');
	}
	if(Molpy.groupBadgeCounts.monums > 10 && Molpy.Got('Memories Revisited')) {
		Molpy.UnlockBoost('Mind Glow');
	}
	if(Molpy.groupBadgeCounts.monumg > 10 && Molpy.Got('Memories Revisited')) {
		Molpy.UnlockBoost('Memory Singer');
	}

	if(Molpy.Has('GlassBlocks', 7016280)) Molpy.EarnBadge('Pyramid of Giza');
	if(Molpy.Has('GlassChips', 640000)) Molpy.EarnBadge('Personal Computer');

	var upLevel = (Molpy.Got('Riser') ? 1 : 500);
	if(Molpy.Boosts['Sand Purifier'].power > upLevel) Molpy.UnlockBoost('Seaish Glass Chips');
	if(Molpy.Boosts['Glass Extruder'].power > upLevel) Molpy.UnlockBoost('Seaish Glass Blocks');

	if(!isFinite(Math.pow(200, Molpy.Boosts['RB'].bought))) Molpy.UnlockBoost('Knitted Beanies');
	if(!isFinite(Math.pow(2, Molpy.Boosts['WWB'].bought - 5))) Molpy.UnlockBoost('Space Elevator');
	if(Molpy.groupBadgeCounts.discov > 5 && Molpy.Earned('discov1')) Molpy.UnlockBoost('Discovery Detector');
	if(Molpy.Got('TF')) Molpy.UnlockBoost('AD');
	if(!Molpy.Earned('Neat!') && Molpy.SandTools['Bucket'].amount > 1000000) {
		var neatif = Molpify(Molpy.SandTools['Bucket'].amount, 3);
		var t = Molpy.tfOrder.length;
		var allsame = 1;
		while(t-- && allsame) {
			var tool = Molpy.tfOrder[t];
			if(Molpify(tool.amount, 3) != neatif) allsame = 0;
		}
		if(allsame) Molpy.EarnBadge('Neat!');
	}
	if(Molpy.Boosts['AC'].power >= 230) Molpy.EarnBadge('Mains Power');
	if(Molpy.Boosts['AC'].power >= 50) Molpy.EarnBadge('It Hertz');
	if(Molpy.Boosts['AC'].power >= 500) Molpy.UnlockBoost('Rob');

	Molpy.faCosts = [55, 65, 85, 115, 145, 175, 205, 240, 280, 330, 440, 560, 700, 900, 1200, 1500];
	if(Molpy.Got('Factory Expansion')) {
		if(Molpy.Got('Cracks') || Molpy.Got('Aleph One'))
			for( var n = 1e6; isFinite(n); n *= 1000)
				Molpy.faCosts.push(n)
		else
			for( var n = 1e6; Molpy.faCosts.length < 60; n *= 1000)
				Molpy.faCosts.push(n);
	}

}

Molpy.jDipBoosts = ['NavCode', 'Irregular Rivers', 'Big Splash', 'Stacked', 'Minigun', 'Ninja Assistants'];

Molpy.CheckDoRDRewards = function(automationLevel) {
	if(Molpy.Got('Factory Automation')) {
		Molpy.Boosts['Blast Furnace'].department = 1;
	}
	if(Molpy.Got('SBTF')) {
		Molpy.Boosts['Castle Crusher'].department = 1;
	}
	if(Molpy.Earned('Ninja Omnipresence') && Molpy.Got('Active Ninja')) {
		Molpy.Boosts['Ninja League'].department = 1;
	}
	if(Molpy.Earned('Ninja Pact') && Molpy.Got('Ninja League')) {
		Molpy.Boosts['Ninja Legion'].department = 1;
	}

	if(Molpy.Redacted.totalClicks >= 320 && (Molpy.Got('Overcompensating') || Molpy.Got('Doublepost'))) {
		Molpy.Boosts['Redunception'].department = 1;
	} else {
		Molpy.LockBoost('Redunception'); //prevent use in shortpix!
		Molpy.Boosts['Redunception'].department = 0;
	}
	if(Molpy.Redacted.totalClicks >= 776) {
		Molpy.Boosts['Logicat'].department = 1;
	}
	if(Molpy.Redacted.totalClicks >= 431) {
		Molpy.Boosts['Technicolour Dream Cat'].department = 1;
	}

	Molpy.Boosts['RRR'].department = 1 * (Molpy.Boosts['Panther Salve'].power > 200);
	Molpy.Boosts['Phonesaw'].department = 1 * (Molpy.Boosts['VJ'].power >= 88);

	var found = 0;
	for( var i in Molpy.jDipBoosts) {
		var me = Molpy.Boosts[Molpy.jDipBoosts[i]];
		if(found && !me.unlocked) me.department = 1;
		if(me.unlocked) found++;
	}
	if(found == Molpy.jDipBoosts.length) {
		Molpy.EarnBadge('Machine Learning');
	}

	Molpy.Boosts['Facebugs'].department = 1 * (Molpy.groupBadgeCounts.discov > 20 && Molpy.Got('Ch*rpies'));
	Molpy.Boosts['Badgers'].department = 1 * (Molpy.groupBadgeCounts.monums > 20 && Molpy.Got('Facebugs'));
	Molpy.Boosts['Mushrooms'].department = 1 * (Molpy.groupBadgeCounts.monums > 40 && Molpy.Got('Facebugs'));
	Molpy.CheckBlackprintDepartment();

	Molpy.Boosts['Fractal Fractals'].department = 1 * (Molpy.Boosts['Fractal Sandcastles'].power >= 120);

	if(Molpy.Boosts['AC'].power && Molpy.Boosts['AC'].power > 180) {
		Molpy.Boosts['Vault Key'].department = (Molpy.Boosts['Locked Vault'].unlocked || flandom(3) == 0
			&& Molpy.Got('Keygrinder'))
	} else {
		var key = Molpy.Boosts['Crate Key'];
		key.department = 0;
		if((Molpy.Boosts['Locked Crate'].unlocked || Molpy.Got('The Key Thing')) && automationLevel >= 10
			&& flandom(3) == 0 && Molpy.Got('Keygrinder')) {
			key.department = 1;
		}
	}
	Molpy.CheckASHF();
	var i = 10;
	var b = 1 * Molpy.Earned('Ceiling Broken');
	while(i--) {
		Molpy.Boosts['Glass Ceiling ' + i].department = b;
	}
	b = 1 * Molpy.Earned('Ceiling Disintegrated');
	Molpy.Boosts['Glass Ceiling 10'].department = b;
	Molpy.Boosts['Glass Ceiling 11'].department = b;

	if(Molpy.Got('Air Drop')) Molpy.Boosts['Schizoblitz'].department = 1;
	if(Molpy.Got('Free Advice')) {
		Molpy.Boosts['Glass Ceiling 0'].department = 1;
		if(Molpy.Earned('Beachomancer')) Molpy.Boosts['BBC'].department = 1;
	}
	Molpy.Boosts['Ruthless Efficiency'].department = 1 * (Molpy.Boosts['Glass Chiller'].power >= 1234);
	Molpy.Boosts['Break the Mould'].department = 1 * (Molpy.Boosts['Break the Mould'].power >= 100);

	Molpy.Boosts['PC'].department = 1 * (Molpy.Got('TF') && Molpy.CastleTools['NewPixBot'].amount >= 5000);
	Molpy.Boosts['Panther Poke'].department = 1 * (automationLevel > 8 && Molpy.Redacted.totalClicks > 2500
		&& Molpy.Got('LogiPuzzle') && !Molpy.Has('LogiPuzzle', Molpy.PokeBar()) && flandom(4) == 0);

	Molpy.Boosts['GM'].department = 1 * (Molpy.Boosts['TF'].manualLoaded >= 1e6);
	Molpy.Boosts['GL'].department = 1 * (Molpy.Boosts['TF'].manualLoaded >= 5e6 || Molpy.Got('Thunderbird'));
	Molpy.Boosts['Cold Mould'].department = Molpy.Got('SMM');
	Molpy.Boosts['Such Glass'].department = 1 * (Molpy.SandTools['Bucket'].amount > 2e11) * (Molpy.ninjaStealth > 2e8);
	Molpy.Boosts['Ninja Ninja Duck'].department = 1 * (Molpy.ninjaStealth > 33333333);

	Molpy.Boosts['SilverCard'].department = Molpy.Earned('Big Spender');
	Molpy.Boosts['GoldCard'].department = Molpy.Earned('Valued Customer');
	Molpy.Boosts['No Need to be Neat'].department = Molpy.Earned('Neat!');
	if (Molpy.IsEnabled('Time Lord')) Molpy.Boosts['Temporal Rift'].department = 0;
}

Molpy.CheckLogicatRewards = function(automationLevel) {
	if((!Molpy.Boosts['AC'].power) || (Molpy.Boosts['AC'].power < 60) || ((Molpy.Boosts['AC'].power < 300) && (Molpy.Boosts['AC'].power + 180) / 240 * Math.random() < 1)) {
		Molpy.Boosts['Locked Crate'].logic = 2;
		Molpy.Boosts['Crate Key'].logic = 4 * (Molpy.Boosts['Locked Crate'].unlocked || Molpy.Got('The Key Thing'));
		Molpy.Boosts['Locked Vault'].logic = 0;
		Molpy.Boosts['Vault Key'].logic = 0;
	} else {
		Molpy.Boosts['Locked Vault'].logic = 5;
		Molpy.Boosts['Vault Key'].logic = 5;
		Molpy.Boosts['Locked Crate'].logic = 0;
		Molpy.Boosts['Crate Key'].logic = 0;
	}

	Molpy.Boosts['Redundant Raptor'].logic = 2 * (Molpy.Boosts['Panther Salve'].power > 500);
	Molpy.Boosts['Catamaran'].logic = 4 * (Molpy.Boosts['Panther Salve'].power > 800);
	Molpy.Boosts['LCB'].logic = 6 * (Molpy.Boosts['Panther Salve'].power > 1200);
	Molpy.Boosts['Ninjasaw'].logic = 16 * (Molpy.Got('Phonesaw'));

	Molpy.Boosts['Impervious Ninja'].logic = 2 * !Molpy.IsEnabled('Ninja Lockdown');

	Molpy.Boosts['Flux Surge'].logic = 4 * (Molpy.Got('Flux Turbine') && isFinite(Molpy.Boosts['Castles'].power));
	var finiteC = 1 * isFinite(Molpy.Boosts['Castles'].power);
	var finiteP = 0;
	if(Molpy.Got('Crystal Dragon'))
		finiteP = 1;
	else if(finiteC) {
		for( var i in Molpy.SandTools) {
			if(isFinite(Molpy.priceFactor * Molpy.SandTools[i].price)) {
				finiteP = 1;
				break;
			}
		}
		if(!finiteP) {
			for( var i in Molpy.CastleTools) {
				if(isFinite(Molpy.priceFactor * Molpy.CastleTools[i].price)) {
					finiteP = 1;
					break;
				}
			}
		}
	}
	Molpy.Boosts['TDE'].logic = finiteC * finiteP;
	Molpy.Boosts['Temporal Rift'].logic = 3 * finiteC * !Molpy.IsEnabled('Time Lord');

	Molpy.Boosts['Bucking the Trend'].logic = 10 * (Molpy.SandTools['Bucket'].amount >= 10000);
	Molpy.Boosts['Crystal Well'].logic = 20 * (Molpy.SandTools['Bucket'].amount >= 20000);
	Molpy.Boosts['Glass Spades'].logic = 30 * (Molpy.SandTools['Cuegan'].amount >= 10000);
	Molpy.Boosts['Statuesque'].logic = 40 * (Molpy.SandTools['Cuegan'].amount >= 20000);
	Molpy.Boosts['Flag in the Window'].logic = 50 * (Molpy.SandTools['Flag'].amount >= 10000);
	Molpy.Boosts['Crystal Wind'].logic = 60 * (Molpy.SandTools['Flag'].amount >= 20000);
	Molpy.Boosts['Crystal Peak'].logic = 70 * (Molpy.SandTools['Ladder'].amount >= 15000);
	Molpy.Boosts['Cupholder'].logic = 80 * (Molpy.SandTools['Bag'].amount >= 12000);
	Molpy.Boosts['Tiny Glasses'].logic = 90 * (Molpy.SandTools['LaPetite'].amount >= 8000);
	Molpy.Boosts['Glass Saw'].logic = 150 * (Molpy.Boosts['TF'].loadedPermNP >= 4000);
	
	
	Molpy.Boosts['Glass Ceiling 10'].logic = 80*Molpy.Earned('Ceiling Broken');
	Molpy.Boosts['Glass Ceiling 11'].logic = 90*Molpy.Earned('Ceiling Broken');

	Molpy.Boosts['Panther Rush'].logic = Molpy.Has('Logicat',Molpy.CalcRushCost(0, 1).Logicat) && !Molpy.Earned('Einstein Says No');

	Molpy.Boosts['AC'].logic = 440 * (Molpy.Got('AA') && (isFinite(Molpy.CastleTools['NewPixBot'].amount)? 
					(Molpy.CastleTools['NewPixBot'].amount >= 7500 ? 50000 / Molpy.CastleTools['NewPixBot'].amount : 0):1));
	Molpy.Boosts['Flipside'].logic = 220 * Molpy.Got('AA');

	Molpy.Boosts['Bottle Battle'].logic = 150 * (Molpy.CastleTools['NewPixBot'].amount >= 10000);
	Molpy.Boosts['Stained Glass Launcher'].logic = 160 * (Molpy.CastleTools['Trebuchet'].amount >= 4000);
	Molpy.Boosts['Leggy'].logic = 180 * (Molpy.CastleTools['Scaffold'].amount >= 5000);
	Molpy.Boosts['Clear Wash'].logic = 200 * (Molpy.CastleTools['Wave'].amount >= 5000);
	Molpy.Boosts['Crystal Streams'].logic = 220 * (Molpy.CastleTools['River'].amount >= 6000);
	Molpy.Boosts['Super Visor'].logic = 240 * (Molpy.CastleTools['Beanie Builder'].amount >= 6000);
	Molpy.Boosts['Crystal Helm'].logic = 300 * (Molpy.CastleTools['Beanie Builder'].amount >= 12000);
	Molpy.Boosts['FiM'].logic = 64 * (Molpy.SandTools['LaPetite'].amount + Molpy.SandTools['Cuegan'].amount > 6.4e10);
	Molpy.Boosts['MHP'].department = finiteC || ((Molpy.Got('Goats') || Molpy.Boosts['MHP'].department) && !automationLevel);
	Molpy.Boosts['Maps'].logic = 3000 * (Molpy.EnoughMonumgForMaps());
	Molpy.Boosts['Mario'].logic = Molpy.Level('Logicat') * 2 + 10000;
	Molpy.Boosts['TS'].logic = Molpy.Level('Vacuum') * (Molpy.Level('Vacuum') >= 8000);
	Molpy.Boosts['Aleph One'].logic = 111111111;
}
Molpy.mapMonumg = 300;

Molpy.CheckASHF = function() {
	Molpy.Boosts['ASHF'].department = 0;
	if(Molpy.BoostsInShop.length) {
		Molpy.Boosts['ASHF'].department = 1;
		return;
	}
	if(!isFinite(Molpy.Boosts['Castles'].power)) return;
	for( var i in Molpy.SandTools) {
		if(isFinite(Molpy.priceFactor * Molpy.SandTools[i].price)) {
			Molpy.Boosts['ASHF'].department = 1;
			return;
		}
	}
	for( var i in Molpy.CastleTools) {
		if(isFinite(Molpy.priceFactor * Molpy.CastleTools[i].price)) {
			Molpy.Boosts['ASHF'].department = 1;
			return;
		}
	}
}

Molpy.CheckClickAchievements = function() {
	var c = Molpy.beachClicks;
	Molpy.EarnBadge('Amazon Patent');
	if(c >= 2) {
		Molpy.EarnBadge('Oops');
	}
	if(c >= 10) {
		Molpy.EarnBadge('Just Starting');
	}
	if(c >= 100) {
		Molpy.EarnBadge('Busy Clicking');
		Molpy.UnlockBoost('Helpful Hands');
	}
	if(c >= 1000) {
		Molpy.EarnBadge('Click Storm');
		Molpy.UnlockBoost('Raise the Flag');
	}
	if(c >= 3333) {
		Molpy.UnlockBoost('True Colours');
	}
	c = Molpy.Boosts['Sand'].manualDug;
	if(c >= 100000) {
		Molpy.EarnBadge('Getting Sick of Clicking');
	}
	if(c >= 5000000) {
		Molpy.EarnBadge('Why am I still clicking?');
	}
	if(c >= 100000000) {
		Molpy.EarnBadge('Click Master');
	}
	if(c >= 50000000000) {
		Molpy.EarnBadge('Recursion');
		Molpy.EarnBadge('Recursion ');
		Molpy.UnlockBoost('Fractal Sandcastles');
	}
}
Molpy.MontyMethod = 'JTI1N0J2YXIlMjUyMHIlMjUzRG1lLnByaXplJTI1M0QlMjUzRG1lLmRvb3IlMjUzRjMlMjUzQTUlMjUzQmlmJTI4TWF0aC5yYW5kb20lMjglMjkqJTI4TW9scHkuTGV2ZWwlMjglMjUyMkdvYXRzJTI1MjIlMjklMjUyNXIlMjUyRiUyOHItMiUyOSUyOSUyNTNDLjI1JTI5cmV0dXJuJTI1M0J2YXIlMjUyMGklMjUzRG1lLmRvb3IlMjUzQndoaWxlJTI4aSUyNTNEJTI1M0RtZS5kb29yJTI1N0MlMjU3Q2klMjUzRCUyNTNEbWUucHJpemUlMjlpJTI1M0RNb2xweS5HZXREb29yJTI4JTI5JTI1M0JtZS5nb2F0JTI1M0RpJTI1N0Q=';
/**
 * 
 * Base64 encode / decode http://www.webtoolkit.info/ via stackoverflow :D
 * 
 */
var AllYourBase = {

	// private property
	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	SetUpUsTheBomb: function(input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = AllYourBase._utf8_encode(input);

		while(i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if(isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if(isNaN(chr3)) {
				enc4 = 64;
			}

			output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3)
				+ this._keyStr.charAt(enc4);
		}

		return output;
	},

	// public method for decoding
	BelongToUs: function(input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while(i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if(enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if(enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}

		output = AllYourBase._utf8_decode(output);

		return output;
	},

	// private method for UTF-8 encoding
	_utf8_encode: function(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for( var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if(c < 128) {
				utftext += String.fromCharCode(c);
			} else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode: function(utftext) {
		var string = "";
		var i = 0;
		var c, c1, c2, c3 = 0;

		while(i < utftext.length) {

			c = utftext.charCodeAt(i);

			if(c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}

		return string;
	}
}
Molpy.BlitzGirl = {
	ChallengeAccepted: 'JTI1M0NpJTI1M0VNb2xweSUyNTIwbW9scHklMjUyMG1vbHB5JTI1MjBtb2xweSUyNTJDJTI1M0NiciUyNTNFTW9scHklMjUyMG1vbHB5JTI1MjBtb2xweSUyNTIwbW9scHkuJTI1M0NiciUyNTNFTW9scHklMjUyMG1vbHB5JTI1MjBtb2xweSUyNTIwbW9scHklMjUyQyUyNTNDYnIlMjUzRUdyYXBldmluZSUyNTJDJTI1MjBncmFwZXZpbmUuJTI1M0MlMjUyRmklMjUzRQ==',
	Apolpgy: 'TGV0JTI1MjBpdCUyNTIwYmUlMjUyMGtub3duJTI1MjB0aGF0JTI1MjB0aGlzJTI1MjBpcyUyNTIwYW4lMjUyMGFwb2xvZ3klMjUyMHRoYXQlMjUyMFRpbWUlMjUyMFRyYXZlbCUyNTIwd2FzJTI1MjBicm9rZW4lMjUyQyUyNTIwc3BlY2lmaWNhbGx5JTI1MjB0byUyNTIwQmxpdHpHaXJsJTI1MjAlMjUzQ3NtYWxsJTI1M0UlMjglMjUzQ2IlMjUzRUtuaWdodCUyNTIwVGVtcG9yYWwlMjUzQyUyNTJGYiUyNTNFJTI1MjBvZiUyNTIwdGhlJTI1MjBPbmUlMjUyMFRydWUlMjUyMENvbWljJTI1MkMlMjUyMEJsaXR6R2lybCUyNTIwdGhlJTI1MjBGaXJzdCUyNTJDJTI1MjBNb3BleSUyNTIwTW9scHklMjUyME1vbWUlMjUyQyUyNTIwT3R0aWZhY3RvciUyNTIwU3VwZXJpb3IlMjUyQyUyNTIwRmlyc3QlMjUyMG9mJTI1MjB0aGUlMjUyMFRydWUlMjUyMEZvbGxvd2VycyUyNTIwb2YlMjUyMFRpbWUlMjdzJTI1MjBUaW1lJTI1MkMlMjUyMFBhdHJpYXJjaCUyNTIwb2YlMjUyMHRoZSUyNTIwV2VzdGVybiUyNTIwUGFyYWRveCUyNTIwQ2h1cmNoJTI1MkMlMjUyMEdyZWF0JTI1MjBQaWxncmltJTI1MjBvZiUyNTIwdGhlJTI1MjBPbmUlMjUyMFRydWUlMjUyMENvbWljJTI1MkMlMjUyMEdyZWF0ZXN0JTI1MjBHcmFpbiUyNTIwb24lMjUyMHRoZSUyNTIwQmVhY2glMjUyMG9mJTI1MjBUaW1lJTI1MkMlMjUyMEhvcGUlMjUyMG9mJTI1MjB0aGUlMjUyME5vbi1Db21taXR0YWwlMjUyMFdhaXRlcnMlMjUyQyUyNTIwVGltZSUyNTIwQXJjaGl0ZWN0JTI1MjBvZiUyNTIwU2lnbnBvc3RpbmclMjUyQyUyNTIwU3VwcmVtZSUyNTIwT2JzZXJ2ZXIlMjUyMG9mJTI1MjBUaW1lJTI1MkMlMjUyMFNhaW50JTI1MjBvZiUyNTIwdGhlJTI1MjBUaW1ld2FpdGVycyUyNTJDJTI1MjBDYXJkaW5hbCUyNTIwVGVtcHVzJTI1MjBWaWF0b3IlMjUyQyUyNTIwQXJjaGJpc2hvcCUyNTIwb2YlMjUyMHRoZSUyNTIwUGFzdCUyNTJDJTI1MjBUcm91YmFkb3VyJTI1MjBvZiUyNTIwVGltZSUyNTJDJTI1MjBUaGUlMjUyMEJhcmQlMjUyMG9mJTI1MjBUaGUtQmVmb3JlJTI1MkMlMjUyMFRoZSUyNTIwUG9ldGVzcyUyNTIwb2YlMjUyMFRoZS1QcmVzZW50JTI1MkMlMjUyMFZlcnNpZmllciUyNTIwb2YlMjUyMFZveWFnZXMtWWV0LVRvLUJlJTI1MkMlMjUyME1vc3QlMjUyMFRydWUlMjUyMEZvbGxvd2VyZXIlMjUyQyUyNTIwQmVhdGVyJTI1MjBvZiUyNTIwUGFyYWRveGVzJTI1MkMlMjUyMEdob3N0JTI1MjBvZiUyNTIwUHJlc2VudFBpeCUyNTJDJTI1MjBJbmNvbWluZyUyNTIwSHVycmljYW5lJTI1MkMlMjUyME9tbmlsZWN0b3IlMjUyMG9mJTI1MjBUaW1lJTI1MkMlMjUyMFByaW5jZXNzJTI1MjBvZiUyNTIwUGVyc2lhJTI1MkMlMjUyMFJlZCUyNTIwU3BpZGVycyUyNTIwRXllcyUyNTJDJTI1MjBMYVBldGl0ZSUyNTIwQmxpdHpHaXJsJTI1MkMlMjUyMFNpc3RlciUyNTIwaW4lMjUyMFdhaXRpbmclMjUyQyUyNTIwQmlnJTI1MjBLbm93SXRBbGwlMjUyQyUyNTIwQmxpdHpyYW5kaXIlMjUyQyUyNTIwUmVhZGVyJTI1MkMlMjUyMEIuTy5CLiUyOSUyNTNDJTI1MkZzbWFsbCUyNTNF'
};
Molpy.donuts = ['JTI1M0NpZnJhbWUlMjUyMHNyYyUyNTNEJTI1MjJodHRwJTI1M0ElMjUyRiUyNTJGd3d3LnlvdXR1YmUuY29tJTI1MkZlbWJlZCUyNTJGR1U5Ukw2RDIzamslMjUzRmF1dG9wbGF5JTI1M0QxJTI1MjIlMjUyMHdpZHRoJTI1M0QlMjUyMjQwMCUyNTIyJTI1MjBoZWlnaHQlMjUzRCUyNTIyMzAwJTI1MjIlMjUyMGZyYW1lYm9yZGVyJTI1M0QlMjUyMjAlMjUyMiUyNTIwYWxsb3dmdWxsc2NyZWVuJTI1M0UlMjUzQyUyNTJGaWZyYW1lJTI1M0U='];
Molpy.wing0 = ['U29tZWJvZHklMjUyMHNldCUyNTIwdXAlMjUyMHVzJTI1MjB0aGUlMjUyMGJvbWIu', 'V2UlMjUyMGdldCUyNTIwc2lnbmFsLg==',
		'V2hhdCUyMQ==', 'TWFpbiUyNTIwc2NyZWVuJTI1MjB0dXJuJTI1MjBvbi4', 'SXQlMjdzJTI1MjB5b3UlMjElMjE=',
		'SG93JTI1MjBhcmUlMjUyMHlvdSUyNTIwZ2VudGxlbWVuJTIxJTIx',
		'QWxsJTI1MjB5b3VyJTI1MjBiYXNlJTI1MjBhcmUlMjUyMGJlbG9uZyUyNTIwdG8lMjUyMHVz',
		'WW91JTI1MjBhcmUlMjUyMG9uJTI1MjB0aGUlMjUyMHdheSUyNTIwdG8lMjUyMGRlc3RydWN0aW9uLg==',
		'V2hhdCUyNTIweW91JTI1MjBzYXklMjElMjE=',
		'WW91JTI1MjBoYXZlJTI1MjBubyUyNTIwY2hhbmNlJTI1MjB0byUyNTIwc3Vydml2ZSUyNTIwbWFrZSUyNTIweW91ciUyNTIwdGltZS4=',
		'SGElMjUyMGhhJTI1MjBoYSUyNTIwaGEuLi4=', 'Q2FwdGFpbiUyMSUyMQ==',
		'VGFrZSUyNTIwb2ZmJTI1MjBldmVyeSUyNTIwJTI3WklHJTI3JTIxJTIx',
		'WW91JTI1MjBrbm93JTI1MjB3aGF0JTI1MjB5b3UlMjUyMGRvaW5nLg==', 'TW92ZSUyNTIwJTI3WklHJTI3Lg==',
		'Li4uRm9yJTI1MjBncmVhdCUyNTIwanVzdGljZS4='];
Molpy.wintext = 'YWxlcnQlMjglMjdZb3UlMjUyMGp1c3QlMjUyMGxvc3QlMjUyMHRoZSUyNTIwZ2FtZS4lMjclMjk=';

Molpy.InfiniteLoopFactory = function() {
	this.GetInfiniteLoop = function() {
		while(true) {
			var string = "Halp, I'm trapped in an infinite loop factory!";
		}
		return string;
	}
}
