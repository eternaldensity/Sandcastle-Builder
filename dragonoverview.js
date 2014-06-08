// Dragon Overview Pane
// Enable at 10 NPs with dragons
// Jumps at 111 NPs with dragons


Molpy.Overview = {
	Create: function(size) {
		this.dopane = g('dragonoverview');
		this.dopctx = this.dopane.getContext('2d');


		// Create index
		this.MakeIndex(Molpy.Level('DQ')+1);

		// Fill basic grid

		
		// Update all nps
		return;
		for (var np = 1; np < size; np++) this.Update(np);
		this.dopctx.stroke();
	},

	MakeIndex: function(maxdrag) {
		for (var dt = -1; dt <=maxdrag; dt++) {
			for (var mt = 0; mt< 3; mt++) {
				var xpos = 120+20*dt;
				var ypos = 10+20*mt;
				this.dopctx.lineWidth=2;
				this.dopctx.fillStyle=['#000','#0F0','#00F'][mt];
				this.dopctx.fillRect(xpos,ypos,9,9);
				this.dopctx.strokeStyle=(dt<0?"white":Molpy.DragonsById[dt].colour);
				this.dopctx.strokeRect(xpos+1,ypos+1,7,7);
				this.dopctx.stroke();
			}
		}

	},

	Update: function(np) {
		this.dopctx.drawImage(somefunctionof(np), 10*(np%100)+this.Xoffset, 10*Math.floor(np/100)+this.Yoffset);
		// this.dopctx.stroke(); // if needed?
	},

	Xoffset: 100,

	Yoffset: 150,




}
