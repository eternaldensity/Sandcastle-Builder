// Masterpiece Pane


// Full screen image infront of game
// Fireworks in front of image
// Fanfare 


Molpy.Master = {
	Create: function(np,time) {
		this.np = np;
		g('masters').innerHTML = '<div id=MasterBlack>&nbsp;</div><div id=MasterPix></div><div id=firework></div><div id=fanfare></div>';
		g('masters').style.zindex=2000;

		Molpy.Master.NewPix(np);
		Molpy.Master.FireWorks(np);
		Molpy.Master.FanFare();
		setTimeout(Molpy.Master.Destroy,time);
		return "fred";
	},
	
	Destroy: function() {
		$('#game').removeClass('hidden');
		g('masters').innerHTML = '';
	},

	NewPix: function(np) {
		$('#game').addClass('hidden');
		g('MasterBlack').width=window.width;
		g('MasterBlack').height=window.height;
		g('MasterPix').style.backgroundImage = Molpy.Url(Molpy.NewPixFor(np));
	},

	FireWorks: function(np) {
	},

	FanFare: function() {
	},
}

