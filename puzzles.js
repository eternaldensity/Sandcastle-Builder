Molpy.DefinePuzzles = function() {
	/******************
	 * Logicat Puzzles
	 * ***************/
	Molpy.PuzzleGens = {};
	Molpy.Puzzle = function(name, cleanupFunction) {
		this.name = name;
		this.cleanupFunction = cleanupFunction;
		Molpy.PuzzleGens[name] = this;

		this.operators = ['and', 'or'];
		this.Generate = function(scoreMultiplier) {
			this.firstTry = 1;
			this.active = true;
			this.level = Molpy.Level('Logicat');
			var statementNames = 'ABCDEFGHIJ';
			var shuffledNames = statementNames.split('');
			ShuffleList(shuffledNames);
			this.n = flandom(Math.ceil(Math.PI)) + Math.ceil(Math.PI);
			this.puzzles = scoreMultiplier || 1;

			var statements = [];
			var i = this.n;
			while(i--) {
				var statement = {};
				statements[i] = statement;
				statement.id = i;
				statement.name = shuffledNames[i];
				statement.value = flandom(2) == 0;
			}//we have now made a list of statements each with a truth value
			var completedStatements = [];
			this.groupNumber = 1;
			while(completedStatements.length < this.n) {
				var groupSize = flandom(statements.length) + 1;
				var dist3 = Math.abs(groupSize - 3) * 2;
				if(flandom(dist3 + 1)) groupSize = flandom(statements.length) + 1
				var group = statements.splice(0, groupSize);
				this.FillStatements(group, groupSize);
				completedStatements = completedStatements.concat(group)
				if(flandom(statements.length / 2) == 0) {
					this.AttachStatements(statements, completedStatements);
				}
				this.groupNumber++;
			}
			for( var i in completedStatements) {
				ShuffleList(completedStatements[i].claims);
			}

			ShuffleList(completedStatements);
			this.Check = function(guess) {
				if(!completedStatements) return;
				var skip = 0;
				if(!this.firstTry) {
					if(!Molpy.Spend(this.tryCost)) {
						Molpy.Notify('You can\'t afford a second try.',1);
						return;
					}
				}

				var correct = 0;
				var incorrect = 0;
				for( var i in guess) {
					if(completedStatements[i].value == guess[i])
						correct++;
					else
						incorrect++;
				}

				if(incorrect > 0 && correct + incorrect > 1) {
					this.tryCost = {
						GlassBlocks: 50 * incorrect
					};
					if(this.firstTry && Molpy.Got('Second Chance') && Molpy.Has(this.tryCost) && confirm('You have ' + Molpify(incorrect) + ' answer' + plural(incorrect) + ' incorrect. Retry?')) {
						this.firstTry = 0;
						Molpy.Notify('You may Try Again for ' + Molpy.PriceString(this.tryCost));
						return;
					}
				}
				var diff = correct - incorrect;
				var points = .5 + Molpy.Level('PR') / 2;
				var score = 0;
				if(diff > 0) {
					score = diff * (this.firstTry * .5 + points) * this.puzzles;
				} else if(diff < 0) {
					score = diff * (!this.firstTry + points) * this.puzzles;
				}

				Molpy.Notify(Molpify(correct) + ' answer' + plural(correct) + ' correct, ' + Molpify(incorrect) + ' answer' + plural(incorrect) + ' incorrect. You earned ' + Molpify(score) + ' point' + plural(score), 0);
				if(diff > 0) {
					Molpy.Add('Logicat', 0, score);
					Molpy.UpdateFaves(1);
				} else if(diff < 0) {
					Molpy.Destroy('Logicat', 0, -score);
					Molpy.UpdateFaves(1);
				}
				completedStatements = [];
				this.active = false;
				Molpy.Redacted.keepPosition = 0;
				this.cleanupFunction();
				
			}
			this.StringifyStatements = function(noWrap) {
				var str = '';
				if (this.puzzles && this.puzzles > 1) str += '['+Molpify(this.puzzles,1)+' Puzzles]<br>';
				for( var id in completedStatements) {
					str += this.StringifyStatement(completedStatements[id], id) + '<br>';
				}
				str += '<input type="Button" value="Clear Guesses" onclick="Molpy.PuzzleGens[\'' + this.name + '\'].Clear()"></input><br>';
				str += '<input type="Button" value="Submit Guesses" onclick="Molpy.PuzzleGens[\'' + this.name + '\'].Submit()"></input>';
				if(!noWrap) str = '<div id="' + this.name + 'Puzzle" class="logipuzzle">' + str + '</div>';
				return str;
			}
			this.Clear();
		}
		this.Clear = function() {
			Molpy.Anything = 1;
			this.guess = [];
			var i = this.n;
			while(i--) {
				this.guess.push('No Guess');
			}
			var d = g(this.name + 'Puzzle');
			if(d) d.innerHTML = this.StringifyStatements(1);
		}
		this.AddStatementLastToChain = function(group, n) {
			var last = group[n - 1];
			var pen = group[n - 2];
			var first = group[0];
			if(pen.claims.length == 1) {
				if(pen.claims[0].name == pen.name) {
					pen.claims = [{name: last.name, value: pen.value == last.value}];
					last.claims = [{name: last.name, value: true}]; //tells us nothing about last because pen's claim told us nothing about pen
					last.reason = 'dummy added to chain';
				} else {
					pen.claims = [{name: last.name, value: pen.value == last.value}];
					last.claims = [{name: first.name, value: first.value == last.value}];
					last.reason = 'added to chain';
				}
			} else {
				this.FillStatements([last], 1);//can't fit into chain so make it a single
			}
		}
		this.FillStatements = function(group, n) {
			for( var i in group) {
				if(group[i].groupSize) break;
				group[i].groupNumber = this.groupNumber;
				group[i].groupSize = n;
			}

			if(n == 0)
				return;//no statements: nothing to do
			else if(n == 1) {
				var a = group[0];
				a.operator = (a.value ? 'or' : 'and');
				a.reason = (a.value ? 'tautology' : 'contradiction');
				a.claims = [{name: a.name, value: true}, {name: a.name, value: false}];
			} else if(n == 2) {
				var a = group[0];
				var b = group[1];
				if(a.value) {
					a.operator = 'or';
					if(randbool()) {
						a.claims = [{name: a.name, value: false}, {name: b.name, value: b.value}];
						a.reason = 'force both values with paradox';
						b.claims = [{name: b.name, value: true}]; //tells us nothing
						b.reason = 'dummy';
					} else {
						a.claims = [{name: a.name, value: true}, {name: b.name, value: !b.value}];
						a.reason = 'invalid value would force contradiction';
						b.claims = [{name: a.name, value: b.value}];
						b.reason = 'valid claim to contradict';
					}
				} else {
					a.operator = 'and';
					var r = randbool();
					a.claims = [{name: a.name, value: !r}, {name: b.name, value: b.value != r}];
					a.reason = (r ? 'incorrect values lead to paradox' : 'if true, forces contradiction');
					b.claims = [{name: a.name, value: !b.value}];
					b.reason = (r ? 'valid but unnecessary' : 'valid claim to contradict');
				}
			} else if(n == 3) {
				var a = group[0];
				var b = group[1];
				var c = group[2];

				if(randbool()) {
					this.FillStatements(group, n - 1);
					this.AddStatementLastToChain(group, n);
				} else {
					a.operator = (a.value ? 'or' : 'and');
					var r = randbool();
					a.claims = [{name: b.name, value: !b.value == r}, {name: c.name, value: c.value == r}];
					a.reason = 'critical statement of a triple';
					b.claims = [{name: a.name, value: a.value == b.value}];
					b.reason = 'valid, part of triple';
					c.claims = [{name: a.name, value: a.value == c.value}];
					c.reason = 'valid, part of triple';
				}
			} else {
				this.FillStatements(group, n - 1);
				this.AddStatementLastToChain(group, n);
			}
		}
		this.AttachStatements = function(extra, main) {
			for( var i in extra) {
				var e = extra[i];
				var a = GLRschoice(main);
				var b = GLRschoice(main);
				main.push(e);
				if(a === b) {
					e.claims = [{name: a.name, value: e.value == a.value}];
					e.reason = 'attached singleton';
				} else {
					e.claims = [{name: a.name, value: a.value}, {name: b.name, value: b.value}];
					e.reason = 'doubly attached';
					if(randbool()) {
						e.operator = 'or';
						if(e.value) {
							e.claims[0].value = randbool();
						} else {
							e.claims[0].value = !a.value;
							e.claims[1].value = !b.value;
						}
					} else {
						e.operator = 'and';
						if(!e.value) {
							e.claims[0].value = randbool();
							e.claims[1].value = !b.value;
						}
					}
				}
			}
		}
		this.guessOptions = ['No Guess', 'True', 'False'];
		this.SelectGuess = function(id,sel) {
			Molpy.Anything = 1;
			this.guess[id] = this.guessOptions[sel];
		}
		this.StringifyStatement = function(statement, id) {
			var str = statement.name + ':';
			var name = this.name + (Molpy.DisplayingFave?'F':'');

			for( var i in statement.claims) {
				i = parseInt(i);
				str += ' ' + this.StringifyClaim(statement.claims[i]);
				if(i < statement.claims.length - 1) {
					str += ' ' + statement.operator;
				}
			}
			str += '<br><div class="logipuz' + (Molpy.options.logicatcol?' collogipuz':'') + '">';
			for (var i in this.guessOptions) {
				str += '<input type=radio name="selectGuess' + name + id + '" id=Guess' + name + id + '_' + i +
					' onclick="Molpy.PuzzleGens[\'' + this.name + '\'].SelectGuess(' + id + ',' + i + ')" ' + 
					(this.guess[id] == this.guessOptions[i] ? ' checked' : '') + '>'
				str += '<label for=Guess' + name + id + '_' + i + '><small>' + this.guessOptions[i] + '</small></label>';
			}
			str += '</div>';
			
			return str;
		}
		this.StringifyClaim = function(claim) {
			if(claim.invert == undefined) claim.invert = Math.random() * (this.level % 100) > 25;
			return claim.name + ' is ' + (claim.invert ? 'not ' + !claim.value : claim.value == true);
		}
		this.Submit = function() {
			Molpy.Anything = 1;
			var neatGuess = [];
			for( var i in this.guess) {
				if(this.guess[i] == 'True') neatGuess[i] = true;
				else if(this.guess[i] == 'False') neatGuess[i] = false;
			}
			this.Check(neatGuess);
		}
	}
	/*****************************
	 * Molpy.Sokoban
	 * ***************************
	 * For all your Sokoban needs!
	 * At least, those involving
	 * puzzle generation
	 * (play will come later on)
	 * ***************************/
	Molpy.Sokoban = {}
	Molpy.Sokoban.Primitives = [
      		["@+o"],
	      	["@", "+", "o"],
      		["o+@"],
      		["o", "+", "@"],
      		["@+_o"],
      		["@", "+", "_", "o"],
      		["o_+@"],
      		["o", "_","+", "@"],
      		["_@#","_+o"],
      		["__", "@+", "#o"],
      		["o+_", "#@_"],
      		["o#", "+@", "__"],
      		["@__"
      		,"_+%"
      		,"##o"],
      
      		["#_@"
      		,"#+_"
      		,"o%_"],
      
      		["o##"
      		,"%+_"
      		,"__@"],
      
      		["_%o"
      		,"_+#"
      		,"@_#"],
      		
      		["@"],
    	];
	Molpy.Sokoban.trimPuzzle = function(po) {
  		'use strict';
  		//This function is currently unused, as it's possibly buggy and unnecessary. 
  		//If you're reading this, feel free to give it a try.
  		var p = [].concat(po)
  		var can = Molpy.Sokoban.span(p.map(function(s){return s.replace(/[o\+%]/g,"#")}));
  		var rbound = 0;
		var lbound = p[0].length-1;
  		var bbound = 0;
  		var ubound = p.length-1;
  		for (var i = 0; i < can.length; i++) {
    		var x = can[i][0];
    		var y = can[i][1];
    		if(x>0){lbound = Math.min(lbound,x-1);}
    		else {lbound = Math.min(lbound,x);}
    		if(x<p[0].length-1){ rbound = Math.max(rbound,x+1);}
    		else {rbound = Math.max(rbound,x);}
    		if(y<p[0].length-1){ bbound = Math.max(bbound,y+1);}
    		else {bbound = Math.max(bbound,y);}
    		if(y>0){ubound = Math.min(ubound,y-1);}
    		else {ubound = Math.min(ubound,y)}
  		}
  		rbound = Math.max(rbound,lbound);
  		bbound = Math.max(bbound,ubound);
  		p = Molpy.Sokoban.removeCol(p,true,p[0].length-rbound-1); p=Molpy.Sokoban.removeCol(p,false,lbound);
  		p = Molpy.Sokoban.removeRow(p,false,p.length-bbound-1); p=Molpy.Sokoban.removeCol(p,true,ubound);
		return p;
	}

	Object.defineProperty(Array.prototype,"ind", {value:function(find) {
		//Uses deep equality for an indexOf like function.
  		var t = [].concat(this);
  		while (t.length) {
    		if (!Molpy.Sokoban.neq(t.shift(), find)) return (this.length - t.length - 1)
  		}
  		return -1
	}, enumerable:false});
	

	Molpy.Sokoban.getPuzzle = function(n) {
  		'use strict';
  		var puzzle = ["@"];
  		if (n === 0) {
    		return puzzle;
  		}
  		if (n === 1) {
    		return Molpy.Sokoban.Primitives[flandom(Molpy.Sokoban.Primitives.length-0.9)];
  		}
  		var t;
  		while (true) {
  			if(!flandom(4)) break;
    		var toStitch = Molpy.Sokoban.getPuzzle(flandom(n));
    		if (flandom(5)) {
      			t = Molpy.Sokoban.extend(puzzle, toStitch);
      			if (t) puzzle = t;
      			else puzzle = Molpy.Sokoban.intersects(puzzle, toStitch);
    		} else {
      			t = Molpy.Sokoban.intersects(puzzle, toStitch);
      			puzzle = t;
    		}
  		}
  		if (!flandom(3.5)) {
    		puzzle = Molpy.Sokoban.wrapPuzzle(puzzle, "#");
  		}
  		var runs = flandom(Math.pow(n,0.75)) + 1;
  		while (runs--) {
    		puzzle = (flandom(10) ? Molpy.Sokoban.clearrand(puzzle) : Molpy.Sokoban.editrand(puzzle));
  		}
  		if (!Molpy.Sokoban.lockedchar(puzzle)) {
    		runs = flandom(n / 2) + 1;
    		while (runs--) {
      			puzzle = Molpy.Sokoban.walk(puzzle);
    		}
  		}
  		return puzzle;
	}
	/*
	//HEREIN LIE FOUL OPTIMIZATIONS.
	//ACTIVATE AT YOUR OWN RISK
	Molpy.Sokoban.buffer = Molpy.Sokoban.Primitives.map(function(s){return [s,1]});
	Molpy.Sokoban.getPuzzle = function(){
		var p = GLRschoice(Molpy.Sokoban.buffer.filter(function(s){return s[1]>75;}))
		if(p) return p
		Molpy.Notify("Your builders are still recovering from their recent ceasing to exist",1);
	}
	Molpy.Sokoban.addBuffer = function(){
		var p = GLRschoice(Molpy.Sokoban.buffer);
		if(flandom(4)){
			var ps = GLRschoice(Molpy.Sokoban.buffer);
			var cs = flandom(2) ? Molpy.Sokoban.intersects : Molpy.Sokoban.extend
			var newer = [cs(p,ps),Math.max(p[1],ps[1])+1];
			Molpy.Sokoban.buffer.push(newer);
		} else {
			Molpy.Sokoban.buffer.push([Molpy.Sokoban.wrapPuzzle(p[0],"#",1),p[1]]);
			Molpy.Sokoban.buffer.push([Molpy.Sokoban.clearrand(p[0]),p[1]]);
			Molpy.Sokoban.buffer.push([Molpy.Sokoban.editrand(p[0]),p[1]]);
		}
	}
	//In Molpy.Think, add...
	for(var i=1;i<20;i++) Molpy.Sokoban.addBuffer()
	*/

	Molpy.Sokoban.intersectInner = function(puzzle,overlay){
		'use strict';
  		var a = Molpy.Sokoban.findchar(puzzle);
  		var b = Molpy.Sokoban.findchar(overlay);
  		var t = Molpy.Sokoban.padPuzz(Molpy.Sokoban.translate(puzzle, overlay, a, b)); //So far so good
  		var over = t[1];
  		var puz = t[0];
  		var ne = Molpy.Sokoban.findchar(puz);
  		Molpy.Sokoban.rep(puz, ne[0], ne[1], "_");
  		for (var i = 0; i < puz.length; i++) {
    		for (var j = 0; j < puz[0].length; j++) {
      			if (["#", " "].indexOf(Molpy.Sokoban.at(puz, j, i)) >= 0) {
        			Molpy.Sokoban.rep(puz, j, i, Molpy.Sokoban.at(over, j, i).replace(" ", "#"));
      			} else if (Molpy.Sokoban.at(puz,j,i)==="_" && 0>["#"," "].indexOf(Molpy.Sokoban.at(over,j,i))){
      				Molpy.Sokoban.rep(puz, j, i, Molpy.Sokoban.at(over, j, i));
      			} else if (["%", "@", "+", "o"].indexOf(Molpy.Sokoban.at(over, j, i)) >= 0) {
        			return puzzle;
      			}
    		}
  		}
  		return puz
	}

	Molpy.Sokoban.intersects = function(puzzle, overlay) {
  		'use strict';
  		var a = Molpy.Sokoban.findchar(puzzle);
  		var b = Molpy.Sokoban.findchar(overlay);
  		var t = [b[0]-a[0],b[1]-a[1]];
  		var puz = Molpy.Sokoban.intersectInner(puzzle,overlay);
  		var psp = Molpy.Sokoban.span(puzzle).map(function(x){return [x[0]+t[0],x[1]+t[1]];});
  		var osp = Molpy.Sokoban.span(overlay).map(function(x){return [x[0]-t[0],x[1]-t[1]];});
  		var zsp = Molpy.Sokoban.span(puz);
  		for(var i in psp){
  			if(0>zsp.ind(psp[i])) return puzzle;
  		}
  		for(var j in osp){
  			if(0>zsp.ind(osp[i])) return puzzle;
  		}
		return puz; 
	}

	Molpy.Sokoban.padPuzz = function(ls) {
  		'use strict';
  		var a = [ls[0][0].length, ls[0].length];
  		var b = [ls[1][0].length, ls[1].length];
  		var over = ls[1];
  		var puz = ls[0];
  		if (a[0] > b[0]) {
    			over = Molpy.Sokoban.addCol(over, " ", a[0] - b[0], true);
  		} else if (a[0] < b[0]) {
    			puz = Molpy.Sokoban.addCol(puz, " ", b[0] - a[0], true);
  		}
  		if (a[1] > b[1]) {
    			over = Molpy.Sokoban.addRow(over, " ", a[1] - b[1], false);
  		} else if (a[1] < b[1]) {
    			puz = Molpy.Sokoban.addRow(puz, " ", b[1] - a[1], false);
  		}
  		return [puz, over];
	}

	Molpy.Sokoban.translate = function(puzzle, overlay, a, b) {
  		'use strict';
  		var over = [].concat(overlay);
  		var puz = [].concat(puzzle);
  		if (a[0] > b[0]) {
    			over = Molpy.Sokoban.addCol(over, " ", a[0] - b[0], false);
  		} else if (a[0] < b[0]) {
    			puz = Molpy.Sokoban.addCol(puz, " ", b[0] - a[0], false);
  		}
  		if (a[1] > b[1]) {
    			over = Molpy.Sokoban.addRow(over, " ", a[1] - b[1], true);
  		} else if (a[0] < b[0]) {
    			puz = Molpy.Sokoban.addRow(puz, " ", b[1] - a[1], true);
  		}
  		return [puz, over];
	}

	Molpy.Sokoban.extend = function(puzzle, extension) {
  		'use strict';
  		var locs = [];
  		for (var j = 0; j < extension.length; j++) {
    			for (var i = 0; i < extension[0].length; i++) {
      				if (Molpy.Sokoban.at(extension, i, j) == "+" || Molpy.Sokoban.at(extension, i, j) == "%") {
        				locs.push([i, j]);
      				}
    			}
  		}
  		var pos = [];
  		for (var y1 = 0; y1 < puzzle.length; y1++) {
    			for (var x1 = 0; x1 < puzzle[0].length; x1++) {
      				if (Molpy.Sokoban.at(puzzle, x1, y1) == "o" || Molpy.Sokoban.at(puzzle, x1, y1) == "%") {
        				pos.push([x1, y1]);
      				}
    			}
  		}
  		// We've now extracted the linking info. Next step is to put it together
  		// and use a modified intersects.

  		if (!(locs.length*pos.length)) return;
  		var disp = Molpy.Sokoban.calcDisp(locs, pos);
  		if (!disp) return;
  		var t = Molpy.Sokoban.padPuzz(Molpy.Sokoban.translate(puzzle, extension, disp[0],disp[1]));
  		var over = t[1];
  		var puz = t[0];
  		var psp = Molpy.Sokoban.span(puz.map(function(s){return s.replace(/\+%o/g,"_")}));
  		var ts = Molpy.Sokoban.findchar(over);
  		if(0>psp.ind(ts)) return;
  		Molpy.Sokoban.rep(over, ts[0], ts[1], "_");
  		for (var y in puz) {
    			for (var x = 0; x < puz[0].length; x++) {
    				if (["#", " ","_"].indexOf(Molpy.Sokoban.at(puz, x, y)) >= 0&&"_"==Molpy.Sokoban.at(over,x,y)) {
        				Molpy.Sokoban.rep(puz, x, y, "_");
      				} else if (["#", " "].indexOf(Molpy.Sokoban.at(puz, x, y)) >= 0) {
        				Molpy.Sokoban.rep(puz, x, y, Molpy.Sokoban.at(over, x, y).replace(" ", "#"));
      				} else if ("o" == Molpy.Sokoban.at(over, x, y) && "+" == Molpy.Sokoban.at(puz, x, y)) {
        				Molpy.Sokoban.rep(puz, x, y, "_");
      				} else if ("%" == Molpy.Sokoban.at(over, x, y) && "+" == Molpy.Sokoban.at(puz, x, y)) {
        				Molpy.Sokoban.rep(puz, x, y, "+");
      				} else if ("o" == Molpy.Sokoban.at(over, x, y) && "_" == Molpy.Sokoban.at(puz, x, y)) {
        				Molpy.Sokoban.rep(puz, x, y, "o");
      				} else if ("o" == Molpy.Sokoban.at(over, x, y) && "%" == Molpy.Sokoban.at(puz, x, y)) {
        				Molpy.Sokoban.rep(puz, x, y, "o");
      				} else if ("%" == Molpy.Sokoban.at(over, x, y) && "%" == Molpy.Sokoban.at(puz, x, y)) {
      					//pass
      				} else if (["%", "@", "+", "o"].indexOf(Molpy.Sokoban.at(over, x, y)) >= 0) {
        				return puzzle;
      				}
    			}
  		}
  		return puz;
	}

	Molpy.Sokoban.span = function(puz){
		'use strict';
  		var p = [].concat(puz)
  		var can = [Molpy.Sokoban.findchar(p)];
  		var old = [];
  		while (Molpy.Sokoban.neq(old, can)) {
    			old = [].concat(can);
    			for (var i = 0; i < can.length; i++) {
      				var x = can[i][0];
      				var y = can[i][1];
      				if (0 > can.ind([x + 1, y]) && 0<=["o","_"].indexOf(Molpy.Sokoban.at(p, x + 1, y)))
      					can.push([x + 1, y]);
      				if (0 > can.ind([x - 1, y]) && 0<=["o","_"].indexOf(Molpy.Sokoban.at(p, x - 1, y)))
      					can.push([x - 1, y]);
      				if (0 > can.ind([x, y + 1]) && 0<=["o","_"].indexOf(Molpy.Sokoban.at(p, x, y + 1)))
      					can.push([x, y + 1]);
      				if (0 > can.ind([x, y - 1]) && 0<=["o","_"].indexOf(Molpy.Sokoban.at(p, x, y - 1)))
      					can.push([x, y - 1]);
    			}
  		}
  		return can;
	}

	Molpy.Sokoban.connected = function(puz) {
		'use strict';
  		var can = Molpy.Sokoban.span(puz)
  		for (var k=0;k<p.length;k++) {
    			for (var j = 0; j < p[0].length; j++) {
      				if ("o"==at(p, j, k) && can.ind([j, k]) < 0) {
        				if(["+","%"].indexOf(Molpy.Sokoban.at(p, j+1, k))&&can.ind([j+2,k])>=0) continue;
        				if(["+","%"].indexOf(Molpy.Sokoban.at(p, j-1, k))&&can.ind([j-2,k])>=0) continue;
        				if(["+","%"].indexOf(Molpy.Sokoban.at(p, j, k+1))&&can.ind([j,k+2])>=0) continue;
        				if(["+","%"].indexOf(Molpy.Sokoban.at(p, j, k-1))&&can.ind([j,k-2])>=0) continue;
        				return false;
      				}
			}
  		}
  		return true;
	}

	Molpy.Sokoban.at = function(p, y, x) {
		'use strict';
  		if (x < 0) {
    			return " ";
  		}
  		if (x >= p.length) {
    			return " ";
  		}
  		if (y >= p[0].length) {
    			return " ";
  		}
  		if (y < 0) {
    			return " ";
  		}

  		return p[x].charAt(y);
	}

	Molpy.Sokoban.rep = function(p, y, x, n) {
  		'use strict';
  		if (x < 0) {
    			return;
  		}
  		if (x >= p.length) {
    			return;
  		}
  		if (y >= p[0].length) {
		 	return;
  		}
  		if (y < 0) {
    			return;
  		}

  		var pu = p[x].split('');
  		pu[y] = n;
  		p[x] = pu.join('');
	}

	Molpy.Sokoban.findchar = function(puzzle) {
  		'use strict';
  		var p = [].concat(puzzle);
  		var t;
  		while (p.length) {
    			t = p.shift().indexOf("@");
    			if (t != -1) {
      				return [t, puzzle.length - p.length - 1];
    			}
    			t = p[0].indexOf("*");
    			if (t != -1) {
      				return [t, puzzle.length - p.length - 1];
    			}
  		}
	}


	Molpy.Sokoban.neq = function(a, b) {
  		if (typeof a != typeof [] || typeof b != typeof []) {
    			return !(a === b);
  		}
  		for (var i in a) {
    			if (Molpy.Sokoban.neq(a[i], b[i])) return true;
  		}
  		for (var j in b) {
    			if (Molpy.Sokoban.neq(a[j], b[j])) return true;
  		}
  		return false;
	}

	Molpy.Sokoban.allCol = function(p, i, c) {
  		'use strict';
  		for (var k in p) {
    			if (Molpy.Sokoban.at(p, i, k) != c) {
      				return false;
    			}
  		}
  		return true;
	}

	Molpy.Sokoban.allRow = function(p, i, c) {
  		'use strict';
  		for (var k = 0; k < p[i].length; k++) {
    			if (Molpy.Sokoban.at(p, k, i) != c) {
      				return false;
    			}
  		}
  		return true;
	}



	Molpy.Sokoban.calcDisp = function(mov, target) {
  		'use strict';
  		if (mov.length === 0 || target.length === 0) return;
  		var t = flandom(mov.length * target.length);
  		var x = t % mov.length;
  		var y = t % target.length;
  		return [mov[x],target[y]];
	}

	Molpy.Sokoban.wrapPuzzle = function(p, c, n) {
  		'use strict';
  		if (n === undefined) {
    			n = 1;
  		}
  		return Molpy.Sokoban.addRow(
  			Molpy.Sokoban.addRow(
  				Molpy.Sokoban.addCol(
  					Molpy.Sokoban.addCol(p, c, n, true)
  					, c, n, false)
  				, c, n, true)
  			, c, n, false);
	}


	Molpy.Sokoban.addCol = function(puzzle, char, n, r) {
  		'use strict';
  		return puzzle.map(function(s) {
    			if (r) {
      				return (s + (new Array(n + 1)).join(char));
    			}
    			return ((new Array(n + 1)).join(char) + s);
  		});
	}


	Molpy.Sokoban.removeCol = function(puzzle, r,n) {
  		'use strict';
  		if(n===undefined) n=1;
  		return puzzle.map(function(s) {
    			if (r) return s.substr(0, s.length - n);
    				return s.substr(n);
  		});
	}


	Molpy.Sokoban.addRow = function(p, char, n, u) {
  		'use strict';
  		var ps = [];
  		for (var i = 0; i < n; i++) {
    			ps[i] = (new Array(p[0].length + 1)).join(char);
  		}
  		if (u)
    			return ps.concat(p);
  		return [].concat(p).concat(ps);
	}

	Molpy.Sokoban.removeRow = function(p, u,n) {
  		'use strict';
  		if(n===undefined) n=1;
  		if (u) {
    			return p.slice(n)
  		}
  		return p.slice(0,p.length-n)
	}


	Molpy.Sokoban.clearrand = function(puzzle) {
  		'use strict';
  		var p = [].concat(puzzle);
  		var locs = [];
  		for (var i in p) {
    			for (var j = 0; j < p[0].length; j++) {
      				if (Molpy.Sokoban.at(p, j, i) == "#") locs.push([j, i]);
    			}
  		}
  		if (locs.length === 0) return p;
  		var t = locs[flandom(locs.length)];
  		var a = t[0];
  		var b = t[1];
  		Molpy.Sokoban.rep(p, a, b, "_");
  		return p;
	}


	Molpy.Sokoban.editrand = function(puzzle) {
  		'use strict';
  		var p = [].concat(puzzle);
  		var locs = [];
  		for (var i in p) {
    			for (var j = 0; j < p[0].length; j++) {
      				if (Molpy.Sokoban.at(p, j, i) == "#") locs.push([j, i]);
    			}
  		}
  		if (locs.length === 0) return p;
  		var t = locs[flandom(locs.length)];
  		var a = t[0];
  		var b = t[1];
  		Molpy.Sokoban.rep(p, a, b, "%");
  		return p;
	}


	Molpy.Sokoban.lockedchar = function(puzzle) {
  		'use strict';
  		var a = Molpy.Sokoban.findchar(puzzle);
  		return (-1 == [
  				Molpy.Sokoban.at(puzzle, a[0] + 1, a[1]),
    				Molpy.Sokoban.at(puzzle, a[0] - 1, a[1]),
    				Molpy.Sokoban.at(puzzle, a[0], a[1] + 1),
 				Molpy.Sokoban.at(puzzle, a[0], a[1] - 1)
  			].indexOf("_"));
	}


	Molpy.Sokoban.walk = function(puzzle) {
  		'use strict';
  		var a = Molpy.Sokoban.findchar(puzzle);
  		var ls = Molpy.Sokoban.idbe(
  			[
  				Molpy.Sokoban.at(puzzle, a[0] + 1, a[1]),
    				Molpy.Sokoban.at(puzzle, a[0] - 1, a[1]),
    				Molpy.Sokoban.at(puzzle, a[0], a[1] + 1),
    				Molpy.Sokoban.at(puzzle, a[0], a[1] - 1)
  			].map(function(s) {
    				return s === "_";
	 		}));
  		if (ls === false) return puzzle;
  		var pl = [
    			[a[0] + 1, a[1]],
    			[a[0] - 1, a[1]],
    			[a[0], a[1] + 1],
    			[a[0], a[1] - 1]
  		][ls];
  		var puz = [].concat(puzzle);
  		Molpy.Sokoban.rep(puz, pl[0], pl[1], "@");
  		Molpy.Sokoban.rep(puz, a[0], a[1], "_");
  		return puz;
	}

	Molpy.Sokoban.idbe = function(ls) {
  		'use strict';
  		ls = ls
    			.map(function(a, b) {
      				if (a) return b;
      				return -1;
    			})
    			.filter(function(a) {
      				return a >= 0;
    			});
  		if (ls.length == 0) return false;
  		return ls[flandom(ls.length)]; // Sidenote: The name of this function has no meaning. I'm sorry.
	}
	Molpy.Sokoban.complete = function(){
		return; // To be filled in by @Calamitizer.
	}
	Molpy.Sokoban.doInput = function(p,diff){
		pn = Molpy.Sokoban.moveTo(p,diff);
		if(!pn) return p;
		for (var i in pn){
			if (pn[i].split('').indexOf("+")>0) return pn;
		}
		Molpy.Sokoban.complete();
	}
	Molpy.Sokoban.moveTo = function(p,diff){
		'use strict';
		puz = [].concat(p)
		var sloc = Molpy.Sokoban.findchar(puz);
		var xa = sloc[0] + diff[0]; var ya = sloc[1]+diff[1]; 
		var xb = sloc[0] + 2*diff[0]; var yb = sloc[1]+2*diff[1]
		var displacing = Molpy.Sokoban.at(puz,xa, ya);
		if (0<=["#"," "].indexOf(displacing)) {Molpy.Notify("Yer no wizard, Harry.",1);return;}
		if (displacing == "_") {Molpy.Sokoban.rep(puz,xa,ya,"@");Molpy.Sokoban.rep(puz,sloc[0],sloc[1],"_");return puz;}
		if (displacing == "o") {Molpy.Sokoban.rep(puz,xa,ya,"*");Molpy.Sokoban.rep(puz,sloc[0],sloc[1],"_");return puz;}
		// Now for moving stuff
		var doubledouble = Molpy.Sokoban.at(puz,xb, yb);
		if ("_" == doubledouble) {
			if(displacing == "+") Molpy.Sokoban.rep(puz,xa,ya,"@");
			else Molpy.Sokoban.rep(puz,xa,ya,"*");
			Molpy.Sokoban.rep(puz,xb,yb,"+");
			return puz;
		}
		if ("o" == doubledouble) {
			if(displacing == "+") Molpy.Sokoban.rep(puz,xa,ya,"@");
			else Molpy.Sokoban.rep(puz,xa,ya,"*");
			Molpy.Sokoban.rep(puz,xb,yb,"%");
			return puz;
		}
		if ("#" == doubledouble || " "==doubledouble) 
			Molpy.Notify("If it feels like you're going against a brick wall, it's because you are.",1);
		else 
			Molpy.Notify("Unless you can blow these suckers up, they ain't moving.",1);
	}
}
