Molpy.DefinePuzzles = function() {
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
						Molpy.Notify('You can\'t afford a second try.');
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
				var points = .5 + Molpy.Level('Panther Rush') / 2;
				scoreMultiplier = Math.max(scoreMultiplier || 1, 1);
				var score = 0;
				if(diff > 0) {
					score = diff * (this.firstTry * .5 + points) * scoreMultiplier;
				} else if(diff < 0) {
					score = diff * (!this.firstTry + points) * scoreMultiplier;
				}

				Molpy.Notify(Molpify(correct) + ' answer' + plural(correct) + ' correct, ' + Molpify(incorrect) + ' answer' + plural(incorrect) + ' incorrect. You earned ' + Molpify(score) + ' point' + plural(score), 1);
				if(diff > 0) {
					Molpy.Add('Logicat', 0, score);
				} else if(diff < 0) {
					Molpy.Destroy('Logicat', 0, -score);
				}
				completedStatements = [];
				this.active = false;
				this.cleanupFunction();
			}
			this.StringifyStatements = function(noWrap) {
				var str = '';
				for( var id in completedStatements) {
					str += this.StringifyStatement(completedStatements[id], id) + '<br><br>';
				}
				str += '<input type="Button" value="Clear Guesses" onclick="Molpy.PuzzleGens[\'' + this.name + '\'].Clear()"></input><br>';
				str += '<input type="Button" value="Submit Guesses" onclick="Molpy.PuzzleGens[\'' + this.name + '\'].Submit()"></input>';
				if(!noWrap) str = '<div id="' + this.name + 'Puzzle" class="logipuzzle">' + str + '</div>';
				return str;
			}
			this.Clear();
		}
		this.Clear = function() {
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
		this.SelectGuess = function(guessBox) {
			var index = parseInt(guessBox.name.split('selectGuess')[1]);
			var value = guessBox.options[guessBox.selectedIndex].value;
			this.guess[index] = value;
		}
		this.guessOptions = ['No Guess', 'True', 'False'];
		this.StringifyStatement = function(statement, id) {
			var str = statement.name + ':';

			for( var i in statement.claims) {
				i = parseInt(i);
				str += ' ' + this.StringifyClaim(statement.claims[i]);
				if(i < statement.claims.length - 1) {
					str += ' ' + statement.operator;
				}
			}
			//str+= ' ('+statement.value+', '+statement.reason+', group:'+statement.groupNumber+', groupSize:'+statement.groupSize+')';
			str += '<br><select id="selectGuess' + id + '" name="selectGuess' + id + '" onchange="Molpy.PuzzleGens[\'' + this.name + '\'].SelectGuess(this)">';
			for( var i in this.guessOptions) {
				var select = (this.guess[id] == this.guessOptions[i] ? ' selected="selected"' : '');
				str += '<option' + select + '>' + this.guessOptions[i] + '</option>';
			}
			str += '</select>';
			return str;
		}
		this.StringifyClaim = function(claim) {
			if(claim.invert == undefined) claim.invert = Math.random() * (this.level % 100) > 25;
			return claim.name + ' is ' + (claim.invert ? 'not ' + !claim.value : claim.value == true);
		}
		this.Submit = function() {
			var neatGuess = [];
			for( var i in this.guess) {
				if(this.guess[i] == 'True')
					neatGuess[i] = true;
				else if(this.guess[i] == 'False') neatGuess[i] = false;
			}
			this.Check(neatGuess);
		}
	}
}