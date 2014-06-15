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

		this.dopctxm = this.dopanem.getContext('2d');

		this.mtip = g('overviewtip');
		this.mtip.innerHTML = '<div id=dovermhover class=doverhover></div>';
		this.mhover = g('dovermhover');
		this.mhover.style.display = 'none';
/*		this.mhover.style.position = 'absolute';
		this.mhover.style.zindex = 100;
		this.mhover.style.width = 100;
		this.mhover.style.hieght = 25;
*/
		this.dopanem.addEventListener('mousemove',function(evt) {
			var over = Molpy.Overview;
			var rect = over.dopanem.getBoundingClientRect();
			var mousex =  evt.clientX - rect.left;
			var mousey =  evt.clientY - rect.top;
			var np = 0;
			
			if (mousex > over.Xoffset && mousex < over.Xoffset+8*50) {
				np = Math.floor((mousex-over.Xoffset)/8) + Math.floor(mousey/8)*50;
				if (np && np <= Molpy.highestNPvisited) {
					over.mtip.style.left = (mousex + 10) + "px"; 
					over.mtip.style.top = (mousey + over.Yoffset -10 ) + "px";
				        over.mhover.innerHTML = '<span class=doverhover>NP ' + np+'</span>';
					over.mhover.style.display = 'block';

				} else {
					over.mhover.style.display = 'none';
				}
			} else {
				over.mhover.style.display = 'none';
			}
		});

		this.dopanem.addEventListener('mouseout',function(evt) {
			Molpy.Overview.mhover.style.display = 'none';
		});

		if (Molpy.Got('Wooly Jumper')) this.addJumper();


				
		// Create index
		this.MakeIndex(Molpy.Level('DQ'));

		// Fill basic grid
		this.BasicGrid();
		
		// Update all nps
		for (var np = 1; np < this.size && np <= Molpy.highestNPvisited; np++) this.Update(np);
	},
	image: [],
	
	MakeIndex: function(maxdrag) {
		var ctx = this.dopctxi;
		ctx.fillStyle="black"
		ctx.fillRect(0,0,this.offsetX+50*10,this.offsetY);
		
		for (var dt = -1; dt <=maxdrag; dt++) {
			this.image[dt+1] = [];
			for (var mt = 0; mt< 3; mt++) {
				var xpos = 180+16*dt;
				var ypos = 10+16*mt;
				ctx.beginPath();
				ctx.lineWidth=2;
				ctx.strokeStyle=(dt<0?"white":Molpy.DragonsById[dt].colour);
				ctx.rect(xpos+1,ypos+1,5,5);
				ctx.fillStyle=['#000','#0F0','#00F'][mt];
				ctx.fill();
				ctx.stroke();

				this.image[dt+1][mt] = ctx.getImageData(xpos,ypos,8,8);

			}
		}
		ctx.font="15px";
		ctx.fillStyle="white";
		ctx.fillText("Not special",5,16);
		ctx.fillText("Glass Monument",5,32);
		ctx.fillText("Diamond Masterpiece",5,48);
		ctx.stroke();
	},

	BasicGrid: function() {
		var ctx = this.dopctxi;

		ctx.lineWidth=1;
		ctx.strokeStyle="white";
		for (var x = 0; x < 50; x+=10) {
			ctx.moveTo(this.Xoffset+x*8,this.Yoffset-12);
			ctx.lineTo(this.Xoffset+x*8,this.Yoffset-2);
			ctx.fillText(x, this.Xoffset+x*8+2,this.Yoffset-22);
			ctx.fillText(x+50, this.Xoffset+x*8+2,this.Yoffset-12);
		};
		ctx.stroke();

		ctx = this.dopctxm;
		ctx.lineWidth=1;
		ctx.strokeStyle="white";
		ctx.fillStyle="white";
		for (var y = 0; y < this.size; y+=100) {
			ctx.moveTo(this.Xoffset-7,y*16/100);
			ctx.lineTo(this.Xoffset-2,y*16/100);
			ctx.fillText(y, 2,y*16/100+8);
		};
		ctx.stroke();
	},

	Update: function(np) {
		if (!Molpy.Got('Dragon Overview') || np < 0) return;
		var mt = (Molpy.Earned('monumg'+np)?(Molpy.Earned('diamm'+np)?2:1):0);
		var dt = (Molpy.NPdata[np] && Molpy.NPdata[np].amount)?Molpy.NPdata[np].DragonType : -1;
		this.dopctxm.putImageData(this.image[dt+1][mt], 8*(np%50)+this.Xoffset, 8*Math.floor(np/50));
	},

	addJumper: function() {
		this.dopanem.addEventListener('click',function(evt) {
			var over = Molpy.Overview;
			var rect = over.dopanem.getBoundingClientRect();
			var mousex =  evt.clientX - rect.left;
			var mousey =  evt.clientY - rect.top;
			var np = 0;

			if (mousex > over.Xoffset && mousex < over.Xoffset+8*50) {
				np = Math.floor((mousex-over.Xoffset)/8) + Math.floor(mousey/8)*50;
				if (np && np <= Molpy.highestNPvisited) {
					Molpy.TTT(np,Molpy.Earned('monumg'+np)?2:1);
				}
			}
		});
	},

	Xoffset: 40,

	Yoffset: 100,

	Hover:	function() {

	}
}
