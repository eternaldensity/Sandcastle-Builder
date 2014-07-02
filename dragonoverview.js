// Dragon Overview Pane
// Enable at 10 NPs with dragons
// Jumps at 111 NPs with dragons

function getMousePos(canvas, evt) {
	return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
}

Molpy.Overview = {
	Create: function(size) {
		this.size = size || 3090;
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
			var mousex =  evt.layerX;
			var mousey =  evt.layerY + g('dragonoverviewmaindiv').scrollTop;
			var np = 0;
			
			if (mousex > over.Xoffset && mousex < over.Xoffset+8*50) {
				np = Math.floor((mousex-over.Xoffset)/8) + Math.floor(mousey/8)*50;
				if (np && np <= Math.abs(Molpy.highestNPvisited)) {
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
	DoAll: function() {
		if (!this.dopctxi) return;
		// Create index
		this.MakeIndex(Molpy.Level('DQ'));

		// Fill basic grid
		this.BasicGrid();
		
		// Update all nps
		for (var np = 1; np < this.size && np <= Math.abs(Molpy.highestNPvisited); np++) this.Update(np);
	},
	image: [],

	SetSizes: function() {
		if (g('sectionDragonOverviewBody') && g('dragonoverviewmaindiv')) {
			g('dragonoverviewmaindiv').style.height = parseInt(g('sectionDragonOverviewBody').style.height)-100 + 'px';
		}
	},
	
	MakeIndex: function(maxdrag) {
		var ctx = this.dopctxi;
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

	Update: function(np) {
		if (!Molpy.Got('Dragon Overview') || np < 0 || !this.mtip || np >= this.size ) return;
		var mt = (Molpy.Earned('monumg'+np)?(Molpy.Earned('diamm'+np)?2:1):0);
		var dt = (Molpy.NPdata[np] && Molpy.NPdata[np].amount)?Molpy.NPdata[np].DragonType : -1;
		this.dopctxm.putImageData(this.image[dt+1][mt], 8*(np%50)+this.Xoffset, 8*Math.floor(np/50));
	},

	addJumper: function() {
		this.dopanem.addEventListener('click',function(evt) {
			if (!Molpy.layoutLocked) return;
			var over = Molpy.Overview;
			var rect = over.dopanem.getBoundingClientRect();
			var mousex =  evt.clientX - rect.left;
			var mousey =  evt.clientY - rect.top;
			var np = 0;

			if (mousex > over.Xoffset && mousex < over.Xoffset+8*50) {
				np = Math.floor((mousex-over.Xoffset)/8) + Math.floor(mousey/8)*50;
				if (np && np <= Molpy.highestNPvisited) {
					Molpy.TTT(np,Molpy.Earned('monumg'+np)?1:2,1);
				}
			}
		});
	},

	Xoffset: 40,

	Yoffset: 100,

	Hover:	function() {

	}
}
