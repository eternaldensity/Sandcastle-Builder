Molpy.DefinePuzzles=function()
{
	Molpy.PuzzleGens={};
	Molpy.Puzzle=function(name)
	{
		this.name=name;
		Molpy.PuzzleGens[name]=this;
		
		this.operators=['and','or'];
		this.Generate=function()
		{
			this.firstTry=1;
			this.level=Molpy.Level('Logicat');
			var statementNames='ABCDEFGHIJ';
			var shuffledNames=statementNames.split('');
			ShuffleList(shuffledNames);
			var n = flandom(Math.ceil(Math.PI))+Math.ceil(Math.PI);
			
			var statements=[];
			var i = n;
			while(i--)
			{
				var statement={};
				statements[i]=statement;
				statement.id=i;
				statement.name=shuffledNames[i];
				statement.value=flandom(2)==0;
			}//we have now made a list of statements each with a truth value
			var completedStatements=[];
			while(completedStatements.length<n)
			{
				var groupSize = flandom(statements.length)+1;
				var dist3 = Math.abs(groupSize-3)*2;
				if(flandom(dist3+1))groupSize = flandom(statements.length)+1
				var group = statements.splice(0,groupSize);
				this.FillStatements(group,groupSize);
				completedStatements=completedStatements.concat(group)
				if(flandom(statements.length/2)==0)
				{
					this.AttachStatements(statements,completedStatements);
				}
			}
			for(var i in completedStatements)
			{
				ShuffleList(completedStatements[i].claims);
			}
			
			ShuffleList(completedStatements);
			this.guess=[];
			
			this.Check=function(guess)
			{
				if(!completedStatements)return;
				var skip=0;
				if(!this.firstTry)
				{
					if(!Molpy.Spend(this.tryCost))
					{
						Molpy.Notify('You can\'t afford a second try.');
						return;
					}
				}
				
				var correct = 0;
				var incorrect = 0;
				for(var i in guess)
				{
					if(completedStatements[i]==guess[i]) correct++;
					else incorrect++;
				}
				
				if(incorrect)
				{
					this.tryCost = {GlassBlocks:50*incorrect};
					if(this.firstTry && Molpy.Got('Second Chance') && Molpy.Has(this.tryCost))					
					{						
						this.firstTry=0;
						Molpy.Notify('You may Try Again for '+Molpy.PriceString(this.tryCost));
						return;
					}
				}
				var points = .5+Molpy.Level('Panther Rush')/2;
				var gain = correct*(this.firstTry*.5+points)-incorrect*points;
				if(gain>0) Molpy.Add('Logicat',0, gain);
				else if (gain < 0)Molpy.Destroy('Logicat',0,-gain);
					
				Molpy.Notify(Molpify(correct)+' answer'+plural(correct)+' correct, '+Molpify(incorrect)+' answer'+plural(incorrect)+' incorrect',1);
				completedStatements=[];	
			}
			
			return this.StringifyStatements(completedStatements);
		}
		this.AddStatementLastToChain=function(group,n)
		{
			var last=group[n-1];
			var pen=group[n-2];
			var first=group[0];
			if(pen.claims.length==1)
			{
				if(pen.claims[0].name==pen.name) 
				{
					pen.claims=[{name:last.name,value:pen.value^last.value}];
					last.claims=[{name:last.name,value:true}]; //tells us nothing about last because pen's claim told us nothing about pen
				}else{
					pen.claims=[{name:last.name,value:pen.value^last.value}];					
					last.claims=[{name:first.name,value:first.value^last.value}];						
				}
			}else
			{
				this.FillStatements([last],1);//can't fit into chain so make it a single
			}
		}
		this.FillStatements=function(group,n)
		{
			if(n==0)return;//no statements: nothing to do
			else if(n==1)
			{
				var a = group[0];
				a.operator=(a.value?'or':'and');	//tautology or contradiction
				a.claims=[{name:a.name,value:true},{name:a.name,value:false}];
			}else if(n==2){
				var a = group[0];
				var b = group[1];
				if(a.value)
				{
					a.operator='or';
					if(randbool())
					{
						a.claims=[{name:a.name,value:false},{name:b.name,value:b.value}];
						b.claims=[{name:b.name,value:true}]; //tells us nothing
					}else{
						a.claims=[{name:a.name,value:true},{name:b.name,value:!b.value}];
						b.claims=[{name:a.name,value:b.value}];					
					}
				}else{
					a.operator='and';
					var r = randbool();
					a.claims=[{name:a.name,value:!randbool},{name:b.name,value:b.value^randbool}];	
					b.claims=[{name:a.name,value:!b.value}];
				}				
			}else if(n==3){
				var a = group[0];
				var b = group[1];
				var c = group[2];
				
				if(randbool())
				{					
					this.FillStatements(group,n-1);
					this.AddStatementLastToChain(group,n);					
				}else{
					a.operator=(a.value?'or':'and');
					var r = randbool();
					a.claims=[{name:b.name,value:!b.value^randbool},{name:c.name,value:c.value^randbool}];
					b.claims=[{name:a.name,value:a.value^b.value}];					
					c.claims=[{name:a.name,value:a.value^c.value}];						
				}
			}else{				
				this.FillStatements(group,n-1);
				this.AddStatementLastToChain(group,n-1);	
			}
		}
		this.AttachStatements=function(extra,main)
		{
			for(var i in extra)
			{
				var e = extra[i];
				var a = GLRschoice(main);
				var b = GLRschoice(main);
				main.push(e);
				if(a===b)
				{
					e.claims=[{name:a.name,value:e.value^a.value}];
				}else{
					e.claims=[{name:a.name,value:a.value},{name:b.name,value:b.value}];
					if(randbool())
					{
						e.operator='or';
						if(e.value)
						{
							e.claims[0].value=randbool();
						}else{
							e.claims[0].value=!a.value;
							e.claims[1].value=!b.value;
						}
					}else{
						e.operator='and';
						if(!e.value)
						{
							e.claims[0].value=randbool();
							e.claims[1].value=!b.value;
						}
					}
				}
			}
		}
		this.SelectGuess=function(guessBox)
		{
			var index = parseInt(guessBox.name.split('selectGuess')[1]);
			var value = guessBox.options[guessBox.selectedIndex].value;
			this.guess[index]=value;
		}
		this.StringifyStatements=function(completedStatements)
		{
			var str='';
			for(var id in completedStatements)
			{
				str+='<br><br>'+this.StringifyStatement(completedStatements[id],id);
			}
			return str;
		}
		this.StringifyStatement=function(statement,id)
		{
			var str = statement.name+':';

			for(var i in statement.claims)
			{
				i = parseInt(i);
				str+= ' ' + this.StringifyClaim(statement.claims[i]);
				if(i<statement.claims.length-1)
				{
					str+=' '+statement.operator;
				}
			}
			//str+= ' ('+statement.value+')';
			str+='<br><select id="selectGuess'+id+'" name="selectGuess'+id+'" onchange="Molpy.PuzzleGens[\''+this.name+'\'].SelectGuess(this)"><option>No Guess</option><option>True</option><option>False</option></select>';
			return str;
		}
		this.StringifyClaim=function(claim)
		{
			var invert = Math.random()*(this.level%100)>25;
			return claim.name+' is '+(invert?'not '+!claim.value:claim.value==true);
		}
		
	}
}