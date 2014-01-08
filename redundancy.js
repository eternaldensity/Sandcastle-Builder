'use strict';
function flandom(n){return(Math.floor(Math.random()*n));}
function randbool(){return(Math.floor(Math.random()*2)==0);}
function GLRschoice(things)
{
	return things[flandom(things.length)];
}
function EvalMaybeFunction(bacon,babies,ice)
{
	var B = typeof(bacon);
	var D = 'function';
	var O = (B===D?bacon(babies):bacon);
	if(!ice) return O;
	
	B = typeof(O);
	D = 'string';
	return (B===D?DeMolpify(O):O);
}
function ZeroIfFunction(bacon)
{
	var B = typeof(bacon);
	var D = 'function';
	var O = (B===D?0:bacon);
	return 0;
}
function DeMolpify(grape)
{
	if(!grape)return 0;
	var fix = grape.slice(-1);
	if(isNaN(parseFloat(fix)))
	{
		for (var i in postfixes)
		{	
			var vine = postfixes[i];
			if(vine.postfix[0]==fix.toUpperCase())
			{
				return DeMolpify(grape.slice(0,-1))*vine.divisor;
			}
		}
		return DeMolpify(grape.slice(0,-1)); //weird character found!
	}
	return parseFloat(grape); //no postfix found
}

	function make(thinglist,arg)
	{
		return EvalMaybeFunction(GLRschoice(thinglist),arg);
	}
	function capitalise(string)
	{
		return string.charAt(0).toUpperCase()+string.slice(1);
	}
	
function MakeRedundancy()
{	
	var redundancy={};
	redundancy.paragraph=function()
	{
		var str='';
		var s = flandom(10)+2;
		while(s--)
		{
			str+=redundancy.sentence();
			if(s) str+=' ';
		}
		return str;
	}
	redundancy.sentence=function(){return make(redundancy.sentences);}
	redundancy.sentences=[
		function(){return capitalise(make(redundancy.defclauses))+make(redundancy.sentenceEnds);}
	];
	redundancy.sentenceEnds=['.','.','.','.','.','.','.','.','.','.','.','.','.','!','.','.','.','.','.','.','.','.','.','.','.','.','.','!','!','????',', and that was that.',' in my pants.',' or perhaps not.',' (or so you\'ve been lead to believe).',', right?',', don\'t you think?',' and that was that.',' which was the last anyone said on the matter.',' leading to the tragic events of today.', ' except in bed.',' but no one cared.',' but I am okay with that now.',', really.','...',' so, yeah...',' and you can probably see where this is going.',' but I don\'t believe a single word of it.',' and I\'m sure it\'ll happen one of these dips.',': ni ni ni ni ni chupacabra ping pong ball!',', it has been said.',', according to expert witnesses.', ', scientific studies have shown.',', statistically speaking.',', according to the latest word on the street.',' - in the minds of todip\'s youth.',' but I wouldn\'t worry about that.'];
	redundancy.makeTransClause=function(){return make(redundancy.subjects)+' '+make(redundancy.transverbs)+' '+make(redundancy.objects);};
	redundancy.makeIntransCluase=function(){return make(redundancy.subjects)+' '+make(redundancy.intransverbs);};
	redundancy.makeCompoundClause=function(){return make(redundancy.interjections)+', '+make(redundancy.defclauses);};
	redundancy.makeInterjected=function(){return make(redundancy.interjections)+', '+make(redundancy.defclauses);};
	redundancy.defclauses=[
		redundancy.makeTransClause,
		redundancy.makeTransClause,
		redundancy.makeTransClause,
		function(){return redundancy.makeTransClause()+', and doesn\'t afraid of '+redundancy.makeObjNoun()},
		function(){ return redundancy.makeTransClause()+' '+make(redundancy.comparison);},
		redundancy.makeIntransCluase,
		redundancy.makeIntransCluase,
		function(){return make(redundancy.subjects)+' '+make(redundancy.linkingverbs)+' '+make(redundancy.adjective);},
		function(){return make(redundancy.subjects)+' '+make(redundancy.linkingverbs)+' '+make(redundancy.objects);},
		redundancy.makeCompoundClause,
		redundancy.makeCompoundClause,
		redundancy.makeInterjected,
		redundancy.makeInterjected
	];
	redundancy.makeSubjNoun=function(){return make(redundancy.subjnouns);};
	redundancy.subjects=[
		function(){return make(redundancy.subjnouns)+' and '+make(redundancy.subjnouns);},
		function(){return make(redundancy.subjnouns)+' '+make(redundancy.adjphrase);},
		function(){return make(redundancy.subjnouns)+' '+make(redundancy.prepphrase);},
		redundancy.makeSubjNoun,
		redundancy.makeSubjNoun,
		redundancy.makeSubjNoun,
		redundancy.makeSubjNoun
	];
	redundancy.subjnouns=[
		function(){return make(redundancy.department);},
		function(){return make(redundancy.creature);},
		function(){return make(redundancy.person);},
		function(){return make(redundancy.thing);},
		function(){return make(redundancy.character);}
	];
	redundancy.makeObjNoun=function(){return make(redundancy.objnouns);};
	redundancy.objects=[
		function(){return make(redundancy.objnouns)+' and '+make(redundancy.objnouns);},
		function(){return make(redundancy.objnouns)+' '+make(redundancy.adjphrase);},
		function(){return make(redundancy.objnouns)+' '+make(redundancy.prepphrase);},
		redundancy.makeObjNoun,
		redundancy.makeObjNoun,
		redundancy.makeObjNoun,
		redundancy.makeObjNoun,
		'anything'
	];
	redundancy.objnouns=[
		function(){return make(redundancy.department);},
		function(){return make(redundancy.creature);},
		function(){return make(redundancy.person);},
		function(){return make(redundancy.thing);},
		function(){return make(redundancy.character);}
	];
	redundancy.department=[
		function(noart){return (noart?'':'the ')+'Department of Redundancy Department';},
		function(noart){return (noart?'':'the ')+'Department';},
		function(noart){return (noart?'':'the ')+make(redundancy.adjective)+' Department of Redundancy Department';},
		function(noart){return (noart?'':'the ')+make(redundancy.adjective)+' Department';},
	];
	redundancy.makeAdjective=function(){return make(redundancy.adjectives);};
	redundancy.makeModifiedAdjective=function(){return make(redundancy.adjmodifier)+ ' ' + make(redundancy.adjectives);};
	redundancy.adjective=[
		function(){return make(redundancy.adjective)+' but '+make(redundancy.adjective);},
		function(){return make(redundancy.adjective)+' yet '+make(redundancy.adjective);},
		redundancy.makeAdjective,
		redundancy.makeAdjective,
		redundancy.makeAdjective,
		redundancy.makeAdjective,
		redundancy.makeModifiedAdjective,
		redundancy.makeModifiedAdjective,
		redundancy.makeModifiedAdjective,
		redundancy.makeModifiedAdjective,
		function(){return make(redundancy.creature,1)+ '-like';},
		function(){return make(redundancy.creature,1)+ 'ish';},
		function(){return make(redundancy.adjmodifier)+ ' ' +make(redundancy.creature,1)+ '-like';},
		function(){return make(redundancy.adjmodifier)+ ' ' +make(redundancy.creature,1)+ 'ish';}
	]
	redundancy.adjectives=['redundant','redundant','redundant','redundant','real','other','wrong','former','old','new','incredible','reliable','solid', 'cute','angry','squashed','wet','dry','spotted','striped','blue','green','brown','red','white','black','yellow','blood-soaked','clear','dirty','clean','shiny','late','blitzing','tired','formal','wonderful','overbearing','tacky','dead','deconstructed','cybernetic','boring','flammable','rotten','friendly','treeish','seaish','zanclean','riverish','steambottlish','weird','wingish','molpish','mustardy','chirping','bogus','ninjad','extreme','amazing','quick','diamond','ironic','golden','iron','chilled','delicious','stubborn','interesting','dedicated','tall','short','important','fast','prolific','loud','metal','awesomeful','<b>bold</b>','bald','hairy','modern','major','minor','great','radioactive','glowing','speakable','unspeakable','helpful','inevitable','sudden','problematic','active','retroactive','futuristic','retro','old-fashioned','polite','upper-class','rough','pythonic','industrial','achronal'];
	
	redundancy.adjmodifier=['very', 'somewhat','kinda','partly','not','nearly','almost','quite','not quite','almost but not quite entirely','entirely','fully','totally','a little bit','far too','incredibly','barely','most','least','hardly',
		function(){return make(redundancy.adjective)+'ly';},
		function(){return make(redundancy.prefix)+make(redundancy.adjective);}
	];
	redundancy.prefix=['un','non','in','anti','sub','super','post','pre','ex','in','redunda','pro','retro','counter','poly','pseudo'];
	redundancy.conjunctions=[';','but','and','so','while','because','after','before','if','which is why','but then','yet','however','nevertheless','henceforth'];
	redundancy.creature=[
		function(noart){return (noart?'':'the ')+make(redundancy.creatures);},
		function(noart){return (noart?'':'the ')+make(redundancy.adjectives)+' '+make(redundancy.creatures);}
	];
	redundancy.creatures=['molpy','molpy','molpy','redundakitty','kitty','badger','zombie','antelopey','badgermolp','bearraptor','beesnake','camolpy','centimolpy','chipmonpy','chirpy','chupamolpy','deerpy','dolphy','dragonflopy','ecolipy','facebug','flutterbee','foxmolpy','gatorraptor','geckolpy','guineamolp','hamply','kangamolp','keyboard','lizmolp','manapy','meowlpy','millimolpy','molpanzee','molpanda','molpbear','molpicoot','molephant','molmmoth','molmot','molpguin','molphish','molpidillo','molpouse','molpossum','molpy','molpybara','molpydile','molpyguana','molpymundi','molpysnake','moltise','monkeymolp','moopy','moosepy','murtle','neckpy','orcaraptor','owlpy','pricklymolp','quackmolpy','rabtor','raptor','raptorcat','raptorshark','ratpy','rhrinocerolpy','ribbit','sealpy','seawolpy','skunkpy','slothpy','sparrow-raptor','squirpy','viperraptor','trilobolpy','wallapy','waterottermolpy','wolpy','woolpy','wormolpy','zemolp'];
	redundancy.character=[
		function(noart){return make(redundancy.characters);},
		function(noart){return make(redundancy.adjectives)+' '+make(redundancy.characters);}
	];
	redundancy.characters=['Cueball','Megan','LaPetite','Bunny','Mini-Bunny','White Bunny','Gray Bun','Black Bun','Curly Bun','Pulled Back','Headband','Meg-a-like','Hat-Hair','Loopsy','Rose','Bob','Leopard','Sandy','She-Bangs','Littlest Bangs Brother','Middle Bangs Brother','Newest Bangs Brother','Sparse','Curly','Buzz','Brick','Forelock','Roundhair','Lopside','Shortdo','Shorty','Mini-Shortdo','Spike','Two-Tone','Mini-Two-Tone','Afro','Part','Baldo','Rosetta','B-1','B-2','B-3','Expando','GLaDOS','Cave Johnson'];
	redundancy.interjections=['CH*RP','chirping mustard','ch*rping m*stard','m*stard','mustard','by GLR','oh','neat','neat','yeah','yeah','hey','no','yes','alright','nooooooooo','finally','chirp everything','ah','oooh','huh','hooray','what','well','welp'];
	redundancy.makeSubPerson=function(){return make(redundancy.subspecifier)+' '+make(redundancy.group);};
	redundancy.person=[
		function(){return make(redundancy.people);}
	];
	redundancy.people=['the one who reads this','xe who is reading','the clicking person','whoever is on the outside of the screen looking in','one of your friends','a random OTTer','GLR','the stranger looking in the window','someone standing behind you','one of your parents','your mother','your long lost cousin from Australia','the Pope','the Mome','a Blitzer','an Old One','he','she','it','xe','a modern major general','Eternal Density','waveney','StormAngel','RAZOR',//this will not end well
		redundancy.makeSubPerson,
		redundancy.makeSubPerson,
		redundancy.makeSubPerson,
		redundancy.makeSubPerson,
		redundancy.makeSubPerson,
		redundancy.makeSubPerson,
		redundancy.makeSubPerson,
		redundancy.makeSubPerson,
		redundancy.makeSubPerson,
		redundancy.makeSubPerson
	];
	redundancy.subspecifier=[
		function(){return 'the most '+make(redundancy.adjectives)+' '+make(redundancy.individual);},
		function(){return 'the least '+make(redundancy.adjectives)+' '+make(redundancy.individual);}
	];
	redundancy.individual=['man','woman','child','person','being','OTTer','musician','writer','singer','coder','poster','quoter',
		function(){return 'sentient '+make(redundancy.thing,1);}];
	redundancy.group=['in the world','in the Mediterranean','on Mars','on the moon','in the future','of our time','since sliced bread','other than me','other than you','ever','in <SUBJECT HOMETOWN HERE>','since the Mayans','in the known world','in the internet','on the blogosphere','in the real world','(excluding Chuck Norris)','(even taking Leeroy Jenkins into consideration)','in the hidden cow level','in all of Minecraft','in this needle-pulled thing','made by Aperture Science','in the Enrichment Centre','according to the Guinness Book of Records','as stated in my recent Wikipedia edit','[citation needed]',
		function(){return 'apart from '+make(redundancy.person);}];
	redundancy.thing=[
		function(noart){return (noart?'':make(redundancy.thingmods)+' ')+make(redundancy.things);},
		function(noart){return (noart?'':make(redundancy.thingmods)+' ')+make(redundancy.adjectives)+' '+make(redundancy.things);}
	];
	redundancy.thingmods=['the', 'my', 'your'];
	redundancy.things=['message','screen','tool','badge','boost','pointer','leopard','nothing','betrayal','food','fruit','planet','spaceship','firefly','amu<span class="faded">semen</span>t','forge','blackprint','crate','key','information','wisdom','bot','bacon','block','chip'];
	redundancy.transverbs=[
		function(){return make(redundancy.transverb);},
		function(){return make(redundancy.adverb)+' '+make(redundancy.transverb);},
		function(){return make(redundancy.transverbs)+', and '+make(redundancy.transverbs);},
		function(){return make(redundancy.transverb)+' ('+make(redundancy.prepphrase)+')';}
	];
	redundancy.transverb=['kicks','clicks','requires','asks','requests','needs','sees','likes','destroys','drops','chases','eats','throws','burns','carries','fires','builds','destroys','quotes','wears','questions','chirps','decyphers','decodes','confuses','hates','expandifies','embiggens','molpifies','explains','redoes','hides','hugs','spoilers','separates','debugs','uploads','downloads','steals','climbs','produces','unbuckles','unties','unpacks','emails','decompiles','compiles','calls', function(){return 'is '+make(redundancy.things)+'ing'}];
	redundancy.intransverbs=[
		function(){return make(redundancy.intransverb);},
		function(){return make(redundancy.adverb)+' '+make(redundancy.intransverb);},
		function(){return make(redundancy.intransverbs)+', and '+make(redundancy.intransverbs);},
		function(){return make(redundancy.intransverb)+' '+make(redundancy.comparison);},
		function(){return make(redundancy.intransverb)+' '+make(redundancy.prepphrase);}
	];
	redundancy.intransverb=['jumps','laughs','burns','cries','explodes','melts','runs','sings','worries','dies','lives','decays','eats','plays','turns','spins','posts','burrows','types','reboots','refreshes','reloads','wonders','walks','falls','collapses','shrugs','departs', function(){return 'is '+make(redundancy.things)+'ing'}];
	redundancy.prepphrase=[function(){return make(redundancy.prepositions)+' '+make(redundancy.objects);}];
	redundancy.prepositions=['in','in','on','over','under','inside','outside','behind','from','within','from within','beside','underneath','near','at','for','into','of','in front of','nowhere near','to','from','close to','with','along','towards','away from','through','throughout','past','after','before'];
	redundancy.adjphrase=[
		function(){return make(redundancy.adjphrasestart)+' '+make(redundancy.transverbs)+' '+make(redundancy.objects);},
		function(){return make(redundancy.adjphrasestart)+' '+make(redundancy.intransverbs);},
		function(){return make(redundancy.adjphrasestart)+' '+make(redundancy.linkingverbs)+' '+make(redundancy.adjective);},
	];
	redundancy.adjphrasestart=['which','who'];
	redundancy.makeAdverb=function(){return make(redundancy.adverbs);};
	redundancy.adverb=[
		redundancy.makeAdverb,
		redundancy.makeAdverb,
		redundancy.makeAdverb,
		redundancy.makeAdverb,
		function(){return make(redundancy.adjectives)+'ly';},
		function(){return make(redundancy.adjectives)+'ishly';},
	];
	redundancy.comparison=[
		function(){return 'like a '+make(redundancy.creature,1);},
		function(){return 'like a '+make(redundancy.thing,1);},
		function(){return 'like a '+make(redundancy.department,1);},
	];
	redundancy.adverbs=['kinda','almost','often','always','nearly','partly','never'];
	redundancy.linkingverbs=['is','might be','will be', 'will have been', 'is going to be', 'is going to have been', 'could be', 'could have been','might be', 'might have been', 'should be', 'should have been', 'must be', 'must have been'];
	redundancy.longsentence='The Department of Redundancy Department redundantly wishes to redundantly wish you (who are being redundantly wished by the Department of redundancy Department, redundantly) to be redundantly informed by the Department of Redundancy Department that the Department of Redundancy Department which is currently redundantly informing you has redundant information from the Department of Redundancy Department with which to redundantly inform you in order that you may be redundantly informed by the Department of Redundancy Department according to the redundant wishes of the Department of Redundancy Department which has that redundant information, at least according to other redundant information provided redundantly to you by the Department of Redundancy Department prior to the Department of Redundancy Department redundantly informing you with the redundant information with which it is currently redundantly informing you.';
	return redundancy;
}
var red
var par=function(stuff)
{
	return '<p>'+stuff+'</p>';
}
var maketext=function()
{
	if(!red)red=MakeRedundancy();
	g('redundantpar').className='partext';
	var str = par(red.paragraph());
	var i = 6;
	while(i--) str+= '<br>'+par(red.paragraph());
	g('redundantpar').innerHTML=str;
}
var eternalf=[];
var typocount=0;
function format(gainned,level)
{
	if(Molpy.options.typo)return gainned;
	var angle=gainned.indexOf('<');
	if(angle==0)return gainned; //don't mess with no html!
	var squirpy=eternalf[gainned];
	if(squirpy)return squirpy;
	if(Math.abs(Molpy.newpixNumber)<typocount) return gainned;
	
	level=level||0;
	var gained=gainned;
	if(!flandom(1.005))return gainned;
	var n = flandom(angle>0?(angle):(gainned.length-2));//irony: for a minute this wouldn't compile because I typo'd it as 'gained'
	if(!isNaN(gainned[n]))return gainned;
	gainned= gainned.slice(0,n+1)+gainned.slice(n);
	gainned = format(gainned,level+1);
	if(!level)
	{
		typocount++;
		if(typocount>=1000)Molpy.EarnBadge('Typo Storm');
		eternalf[gained]=gainned;
	}
	return gainned;
}
function EmergencyExport()
{
	var thread='';
	if (document.cookie.indexOf('CastleBuilderGame')>=0) 
	{
		var k=['',0,1,2,3,4];
		for(var i in k)
		{
			var dough = document.cookie.split('CastleBuilderGame'+k[i]+'=')[1];
			if(dough)
				thread+=unescape(dough).split(';')[0]||'';
		}
		g('exporttext').value=thread;
		g('export').className='unhidden';
		g('otthercomic').className='hidden;'
		
	}
}

function ShuffleList(l)
	{
		for(var i in l)
		{
			var j = flandom((parseInt(i)+1));
			var temp = l[j];
			l[j]=l[i];
			l[i]=temp;
		}			
	}
function SplitWord(word)
{
	if(word.length<=3)return [word];
	if(word.length==4)return [word.slice(0,2),word.slice(2)];
	var size=2+flandom(2);
	return [word.slice(0,size)].concat(SplitWord(word.slice(size)));
}
function Wordify(words)
{
	words=words.split(' ');
	var split=[];
	for(var i in words)
	{
		console.debug(words[i].length);
		split=split.concat(SplitWord(words[i]));
	}
	console.debug(split.reduce(function(prev,next,i,a){return prev+' '+next;}));
	ShuffleList(split);
	return split.reduce(function(prev,next,i,a){return prev+' '+next;});	
}

function plural(n)
{
	return n==1?'':'s';
}