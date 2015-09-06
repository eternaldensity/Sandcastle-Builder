// Dragon Overview Pane
// Enable at 10 NPs with dragons
// Jumps at 111 NPs with dragons
Molpy.adjustFracs=function(n){if(n>0){return n-1} else{return n+1}}
Molpy.adjustFrac=function(n){return Number(Molpy.adjustFracs(n).toFixed(3))}
Molpy.Overview = {
	fracUsed: 1, // one more than the actual frac so I can use negatives
	Create: function(size) {
		this.size = size || 3095;
		this.dopanei = g('dragonoverviewindex');
		this.dopctxi = this.dopanei.getContext('2d');
		this.dopanem = g('dragonoverviewmain');
		this.dopanem.height = Math.floor(this.size/50)*8+20;
		this.SetSizes();

		this.dopctxm = this.dopanem.getContext('2d');

		this.mtip = g('overviewtip');
		if (!this.dopanei || !this.dopanem || !this.mtip) return;
		this.mtip.innerHTML = '<div id=doverhover></div>';
		this.mhover = g('doverhover');
		this.mhover.style.display = 'none';
		if (noLayout) {
			$('#toggleDragonOverview').removeClass('hidden');
		}
		
		this.dopanem.addEventListener('mousemove',function(evt) {
			var over = Molpy.Overview;
			var rect = over.dopanem.getBoundingClientRect();
			var mousex =  evt.clientX - rect.left;
			var mousey = evt.pageY  - $('#dragonoverviewmaindiv').offset().top + g('dragonoverviewmaindiv').scrollTop;
			var np = 0;
			
			if (mousex > over.Xoffset && mousex < over.Xoffset+8*50) {
				np = Math.floor((mousex-over.Xoffset)/8) + Math.floor(mousey/8)*50;
				if (np && np <= Math.abs(Molpy.largestNPvisited[Molpy.adjustFrac(Molpy.Overview.fracUsed)]) && np < over.size) {
					var npd = Molpy.NPdata[np];
					over.mtip.style.left = (evt.clientX + 10 + window.pageXOffset) + "px"; 
					over.mtip.style.top = (evt.clientY -20 + window.pageYOffset) + "px";
				        over.mhover.innerHTML = 'NP&nbsp;' + np + ((npd && npd.amount)?'<br>'+npd.amount+'&nbsp;'+Molpy.DragonsById[npd.DragonType].name+(npd.amount>1?'s':''):'');
					over.mhover.style.display = 'block';
					over.mtip.style.display = 'block';

				} else {
					over.mhover.style.display = 'none';
					over.mtip.style.display = 'none';
				}
			} else {
				over.mhover.style.display = 'none';
				over.mtip.style.display = 'none';
			}
		});

		this.dopanem.addEventListener('mouseout',function(evt) {
			Molpy.Overview.mtip.style.display = 'none';
		});

		if (Molpy.Got('Woolly Jumper')) this.addJumper();

		this.DoAll();
	},
	DoAll: function(time) {
		if (!this.dopctxi) return;
		// Create index
		this.MakeIndex(Molpy.Level('DQ'));

		// Fill basic grid
		if(!time) this.BasicGrid();
		
		// Update all nps
		for (var np = 1; np < this.size && np <= Math.abs(Molpy.largestNPvisited[Molpy.adjustFrac(Molpy.Overview.fracUsed)]); np=Molpy.NextLegalNP(np)){this.Update(np);}
		
		//Add storyline buttons
		
		if(!time){
			$('#dragonoverviewindex').before("<div id='storylineButtons'></div>");
		}
		Molpy.Overview.UpdateButtons();
	},
	image: [],

	SetSizes: function(size) {
		if(size!=undefined && g('sectionDragonOverviewBody') && g('dragonoverviewmaindiv')){
			g('sectionDragonOverviewBody').style.height=String(100+100*size)+'px'; Molpy.Overview.size=size
		}
		if (g('sectionDragonOverviewBody') && g('dragonoverviewmaindiv')) {
			g('dragonoverviewmaindiv').style.height = parseInt(g('sectionDragonOverviewBody').style.height)-100 + 'px';
		}
		if(size){this.size=size;this.DoAll(1)}
	},
	
	MakeIndex: function(maxdrag) {
		var ctx = this.dopctxi;
		ctx.clearRect(0,0,800,100)
		ctx.strokeStyle= Molpy.options.colourscheme?"black":"white";
		ctx.fillStyle=Molpy.options.colourscheme?"white":"black";
		var deflinecol = Molpy.options.colourscheme?"grey":"white"; 
		ctx.fillRect(0,0,800,100);
		
		for (var dt = -1; dt <=maxdrag; dt++) {
			this.image[dt+1] = [];
			for (var mt = 0; mt< 3; mt++) {
				var xpos = 180+16*dt;
				var ypos = 10+16*mt;
				ctx.beginPath();
				ctx.lineWidth=2;
				ctx.strokeStyle=(dt<0?deflinecol:Molpy.DragonsById[dt].colour);
				ctx.rect(xpos+1,ypos+1,5,5);
				ctx.fillStyle=['#000','#0F0','#00F'][mt];
				ctx.fill();
				ctx.stroke();

				this.image[dt+1][mt] = ctx.getImageData(xpos,ypos,8,8);

			}
		}
		ctx.font="15px";
		ctx.fillStyle=Molpy.options.colourscheme?"black":"white";
		ctx.fillText("Not special",5,16);
		ctx.fillText("Glass Monument",5,32);
		ctx.fillText("Diamond Masterpiece",5,48);
		ctx.stroke();

		ctx =  this.dopctxm;
		ctx.fillStyle=Molpy.options.colourscheme?"white":"black";
		ctx.fillRect(0,0,800,10000);
		ctx.stroke();
	},

	BasicGrid: function() {
		var ctx = this.dopctxi;
		var deflinecol = Molpy.options.colourscheme?"black":"white"; 

		ctx.lineWidth=1;
		ctx.strokeStyle=deflinecol;
		ctx.fillStyle=deflinecol;
		for (var x = 0; x < 50; x+=10) {
			ctx.moveTo(this.Xoffset+x*8,this.Yoffset-12);
			ctx.lineTo(this.Xoffset+x*8,this.Yoffset-2);
			ctx.fillText(x, this.Xoffset+x*8+2,this.Yoffset-22);
			ctx.fillText(x+50, this.Xoffset+x*8+2,this.Yoffset-12);
		};
		ctx.stroke();

		ctx = this.dopctxm;
		ctx.lineWidth=1;
		ctx.strokeStyle=deflinecol;
		ctx.fillStyle=deflinecol;
		for (var y = 0; y < this.size; y+=100) {
			ctx.moveTo(this.Xoffset-7,y*16/100);
			ctx.lineTo(this.Xoffset-2,y*16/100);
			ctx.fillText(y, 2,y*16/100+8);
		};
		ctx.stroke();
	},
	checkFrac:function(n){return ((Math.abs(n)-Math.floor(Math.abs(n)))==Molpy.Overview.fracUsed)&&((n>0)*(Molpy.Overview.fracUsed>0))},

	Update: function(np) {
		if (!Molpy.Got('Dragon Overview') || !Molpy.Overview.checkFrac(np) ||!this.mtip || np >= Molpy.largestNPvisited[Molpy.adjustFrac(Molpy.Overview.fracUsed)] ) return;
		var mt = (Molpy.Earned('diamm'+np)?2:(Molpy.Earned('monumg'+Math.abs(np))?1:0));
		var dt = (Molpy.NPdata[np] && Molpy.NPdata[np].amount)?Molpy.NPdata[np].DragonType : -1;
		np=Math.abs(np)
		this.dopctxm.putImageData(this.image[dt+1][mt], 8*(Math.floor(np)%50)+this.Xoffset, 8*Math.floor(np/50));
	},

	addJumper: function() {
		this.dopanem.addEventListener('click',function(evt) {
			if (!Molpy.layoutLocked) return;
			var over = Molpy.Overview;
			var rect = over.dopanem.getBoundingClientRect();
			var mousex =  evt.clientX - rect.left;
			var mousey =  evt.pageY  - $('#dragonoverviewmaindiv').offset().top + g('dragonoverviewmaindiv').scrollTop;
			var np = 0;

			if (mousex > over.Xoffset && mousex < over.Xoffset+8*50) {
				np = Math.floor((mousex-over.Xoffset)/8) + Math.floor(mousey/8)*50;
				if (np && np <= Math.abs(Molpy.largestNPvisited[Molpy.adjustFrac(Molpy.Overview.fracUsed)]) && np < over.size) { 
					Molpy.TTT(np,Molpy.Earned('monumg'+np)?1:2,1); 
				} //Dragon overview will be difficult to do. Remind pickten to try. Or try yourself. It needs TaTpix compatibility.
			}
		});
	},

	Xoffset: 40,

	Yoffset: 100,

	Hover:	function() {

	},
	ChangeFrac: function(dir){
		if(isNaN(Molpy.Overview.fracUsed)){Molpy.Overview.fracUsed=1}
		if(dir=='left'){Molpy.Overview.fracUsed=-Math.abs(Molpy.Overview.fracUsed)}
		if(dir=='right'){Molpy.Overview.fracUsed=Math.abs(Molpy.Overview.fracUsed)}
		else {
			var sign=(Molpy.Overview.fracUsed/Math.abs(Molpy.Overview.fracUsed))
			var i=Molpy.fracParts.indexOf(Number((Math.abs(Molpy.Overview.fracUsed)-1).toFixed(3)))
			if(dir=='up'){Molpy.Overview.fracUsed=sign*(1+Molpy.fracParts[i-1])}
			if(dir=='down'){Molpy.Overview.fracUsed=sign*(1+Molpy.fracParts[i+1])}
			if(Molpy.Overview.fracUsed==undefined||isNaN(Molpy.Overview.fracUsed)){Molpy.Overview.fracUsed=sign}
		}
		Molpy.Overview.SetSizes({
			1: 3095,
			1.1:1417
		}[Math.abs(this.fracUsed)])
		Molpy.Overview.DoAll(1);
	},
	getStoryText: function(){
		var t=Number((Math.abs(Molpy.Overview.fracUsed)-1).toFixed(3))
		if(t==0){return "OTC"} else{
			return ["t1i"][Molpy.fracParts.indexOf(t)]
		}
	},
	UpdateButtons: function(){
		var str=""
		if(Molpy.Badges['Below the Horizon'].earned){
			str=str+"<div id='leftDragSwitch' class='minifloatbox controlbox' style='float:center'>";
			str=str+"<a onclick='Molpy.Overview.ChangeFrac(\"left\")'><h4><<</h4></a></div>";
		}
		if(Molpy.Got('Signpost')){
			str=str+"<div id='upDragSwitch' class='minifloatbox controlbox' style='float:center'>";
			str=str+"<a onclick='Molpy.Overview.ChangeFrac(\"up\")'><h4><</h4></a></div>";
		}
		if(Molpy.Badges['Below the Horizon'].earned||Molpy.Got('Signpost')){
			var sign=(Molpy.Overview.fracUsed>0)
			if(!Molpy.Got('Signpost')){
				if(!sign){
					str=str+"Negpix"
				} else {str=str+"Pospix"}
			} else {
				if(!sign){str=str+"Negative "} else{str=str+"Positive "}
				var f=Math.abs(Molpy.Overview.fracUsed)-1
				if(f==0){str=str+"OTC"} else {
					str=str+["t1i"][Molpy.fracParts.indexOf(Number(f.toFixed(3)))]
				}
			}
		}
		if(Molpy.Got('Signpost')){
			str=str+"<div id='downDragSwitch' class='minifloatbox controlbox' style='float:center'>";
			str=str+"<a onclick='Molpy.Overview.ChangeFrac(\"down\")'><h4>></h4></a></div>";
		}
		if(Molpy.Badges['Below the Horizon'].earned){
			str=str+"<div id='rightDragSwitch' class='minifloatbox controlbox' style='float:center'>";
			str=str+"<a onclick='Molpy.Overview.ChangeFrac(\"right\")'><h4>>></h4></a></div>";
		}
		$('#storylineButtons').html(str)
	}
}
