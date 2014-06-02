// Dragon Overview Pane
// Enable at 10 NPs with dragons
// Jumps at 111 NPs with dragons


Molpy.Overview = {
	Create: function(size) {
		this.dopane = g('dragonoverview');
		this.dopctx = this.getContext('2d');


		// Create index

		// Fill basic grid

		
		// Update all nps

		for (var np = 1; np < size; np++) this.Update(np);
		this.dopctx.stroke();
	},

	Update: function(np) {
		this.dopctx.drawImage(somefunctionof(np), 10*(np%100)+this.Xoffset, 10*Math.floor(np/100)+this.Yoffset);
		// this.dopctx.stroke(); // if needed?
	},

	Xoffset: 100,

	Yoffset: 150,




}
