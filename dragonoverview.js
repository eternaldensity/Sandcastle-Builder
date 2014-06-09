// Dragon Overview Pane
// Enable at 10 NPs with dragons
// Jumps at 111 NPs with dragons


Molpy.Overview = {
	Create: function(size) {
		this.dopane = g('dragonoverview');
		this.dopctx = this.dopane.getContext('2d');
		this.size = size || 3090;



		// Create index
		this.MakeIndex(Molpy.Level('DQ'));

		// Fill basic grid
		this.BasicGrid();
		
		// Update all nps
		for (var np = 1; np < this.size && np <= Molpy.highestNPvisited; np++) this.Update(np);
	},
	image: [],
	
	MakeIndex: function(maxdrag) {
		var ctx = this.dopctx;
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
	},

	BasicGrid: function() {
		var ctx = this.dopctx;

		ctx.lineWidth=1;
		ctx.strokeStyle="white";
		for (var x = 0; x < 50; x+=10) {
			ctx.moveTo(this.Xoffset+x*8,this.Yoffset-12);
			ctx.lineTo(this.Xoffset+x*8,this.Yoffset-2);
			ctx.fillText(x, this.Xoffset+x*8+2,this.Yoffset-22);
			ctx.fillText(x+50, this.Xoffset+x*8+2,this.Yoffset-12);
		};

		for (var y = 0; y < this.size; y+=100) {
			ctx.moveTo(this.Xoffset-7,this.Yoffset+y*16/100);
			ctx.lineTo(this.Xoffset-2,this.Yoffset+y*16/100);
			ctx.fillText(y, 2,this.Yoffset+y*16/100+8);
		};
		ctx.stroke();
	},

	Update: function(np) {
		if (!Molpy.Got('Dragon Overview') || np < 0) return;
		var mt = (Molpy.Earned('monumg'+np)?(Molpy.Earned('diamm'+np)?2:1):0);
		var dt = (Molpy.NPdata[np] && Molpy.NPdata[np].amount)?Molpy.NPdata[np].DragonType : -1;
		this.dopctx.putImageData(this.image[dt+1][mt], 8*(np%50)+this.Xoffset, 8*Math.floor(np/50)+this.Yoffset);
	},

	Xoffset: 40,

	Yoffset: 100,

}
