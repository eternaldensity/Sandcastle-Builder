// Masterpiece Pane


// Full screen image infront of game
// Fireworks in front of image
// Fanfare 


Molpy.Master = {
	Create: function(np,type) {
		if (this.active) return;
//		console.log('MM create called');
		this.active = 1;
		this.np = np;
		this.type = type || 'long';
		$('#game').addClass('hidden');
		g('masters').innerHTML = '<div id=MasterBlack><div id=MasterPix></div></div>' +
					'<div id=fireworkdiv><canvas id=firework width=' + window.innerWidth +
					' hieght=' + window.innerHieght+ '></div>';
		Molpy.Master.NewPix(np);
		Molpy.Master.FanFare();
		setTimeout(Molpy.Master.Destroy,150000); // This is a backstop
	},
	
	Destroy: function() {
//		console.log('MM destroy called');
		$('#game').removeClass('hidden');
		g('masters').innerHTML = '';
		this.fireworks = [];
		this.particles = [];
		this.sounds = [];
		setTimeout(Molpy.Master.ReEnable,2000);
	},

	ReEnable: function() {
		Molpy.Master.active = 0;
//		console.log('MM ReEnable called');
	},

	NewPix: function(np) {
		g('MasterBlack').width=window.innerWidth;
		g('MasterBlack').height=window.innerHeight;
		g('MasterPix').style.backgroundImage = Molpy.Url(Molpy.NewPixFor(np));
	},
	active: 0,

	FanFare: function() {
//		console.log('MM Fanfare called');
		if (!this.active) return;
		if (!g('firework')) return;
		if (!this.audio) this.audio = new Audio('audio/Fanfare'+flandom(1)+'.mp3');
		this.audio.play();
		this.audio.addEventListener("ended",Molpy.Master.StartFireWorks);
	},

	StartFireWorks: function() {
		console.log('MM StartFireworks called');
		mm = Molpy.Master;
		if (!mm.active) return;
		mm.canvas = g('firework');
		if (!mm.canvas) return;
		mm.ctx = mm.canvas.getContext('2d');
		mm.cw = window.innerWidth-20;
		mm.ch = window.innerHeight-1;
		mm.fireworks = [];
		mm.particles = [];
		mm.sounds = [];
		mm.hue = 120;
		mm.limiterTotal = 5;

		mm.limiterTick = 0;
		mm.timerTotal = 60;
		mm.timerTick = 0;
		mm.mx = 0;
		mm.my = 0;
		mm.salvos = (mm.type == 'short')?3:10 + Math.floor(mm.np/333);
		mm.salvosize = Math.floor(mm.np/444)+3;

		mm.canvas.width = mm.cw;
		mm.canvas.height = mm.ch;

		Fireworks_loop();
	},

};
/* Code below is adapted from several sources 
 */


function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function calculateDistance(p1x, p1y, p2x, p2y) {
    var xDistance = p1x - p2x,
        yDistance = p1y - p2y;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

// create firework
function Firework(sx, sy, tx, ty) {
    // actual coordinates
    this.x = sx;
    this.y = sy;
    // starting coordinates
    this.sx = sx;
    this.sy = sy;
    // target coordinates
    this.tx = tx;
    this.ty = ty;
    // distance from starting point to target
    this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
    this.distanceTraveled = 0;
    // track the past coordinates of each firework to create a trail effect, increase the coordinate count to create more prominent trails
    this.coordinates = [];
    this.coordinateCount = 15;
    // populate initial coordinate collection with the current coordinates
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 3;
    this.acceleration = 1.05
    this.brightness = randomRange(50, 70);
    // circle target indicator radius
    // this.targetRadius = 1;
    this.audio = new Audio('audio/bang'+flandom(8)+'.mp3');
    this.audio.play();
}

// update firework
Firework.prototype.update = function (index) {
    // remove last item in coordinates array
    this.coordinates.pop();
    // add current coordinates to the start of the array
    this.coordinates.unshift([this.x, this.y]);

    // speed up the firework
    this.speed *= this.acceleration;

    // get the current velocities based on angle and speed
    var vx = Math.cos(this.angle) * this.speed,
        vy = Math.sin(this.angle) * this.speed;
    // how far will the firework have traveled with velocities applied?
    this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

    // if the distance traveled, including velocities, is greater than the initial distance to the target, then the target has been reached
    if (this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.tx, this.ty);
        // remove the firework, use the index passed into the update function to determine which to remove
        Molpy.Master.fireworks.splice(index, 1);
        mm.sounds.push(new Audio('audio/fire'+flandom(2)+'.mp3'))
	mm.sounds[mm.sounds.length-1].play();
    } else {
        // target not reached, keep traveling
        this.x += vx;
        this.y += vy;
    }
}

// draw firework
Firework.prototype.draw = function () {
	var mm = Molpy.Master;
	var ctx = mm.ctx;
    ctx.beginPath();
    // move to the last tracked coordinate in the set, then draw a line to the current x and y
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.lineWidth=3;
    ctx.strokeStyle = 'hsl(' + mm.hue + ', 100%, ' + this.brightness + '%)';
    ctx.stroke();
}

// create particle
function Particle(x, y) {
    this.x = x;
    this.y = y;
    // track the past coordinates of each particle to create a trail effect, increase the coordinate count to create more prominent trails
    this.coordinates = [];
    this.coordinateCount = 5;
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    // set a random angle in all possible directions, in radians
    this.angle = randomRange(0, Math.PI * 2);
    this.speed = randomRange(1, 10);
    // friction will slow the particle down
    this.friction = 0.95;
    // gravity will be applied and pull the particle down
    this.gravity = 1;
    // set the hue to a random number +-20 of the overall hue variable
    this.hue = randomRange(Molpy.Master.hue - 20, Molpy.Master.hue + 20);
    this.brightness = randomRange(50, 80);
    this.alpha = 1;
    // set how fast the particle fades out
    this.decay = randomRange(0.01, 0.02);
}

// update particle
Particle.prototype.update = function (index) {
    // remove last item in coordinates array
    this.coordinates.pop();
    // add current coordinates to the start of the array
    this.coordinates.unshift([this.x, this.y]);
    // slow down the particle
    this.speed *= this.friction;
    // apply velocity
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    // fade out the particle
    this.alpha -= this.decay;

    // remove the particle once the alpha is low enough, based on the passed in index
    if (this.alpha <= this.decay) {
        Molpy.Master.particles.splice(index, 1);
    }
}

// draw particle
Particle.prototype.draw = function () {
	var ctx = Molpy.Master.ctx;
    ctx.beginPath();
    // move to the last tracked coordinates in the set, then draw a line to the current x and y
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineWidth=3;
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
    ctx.stroke();
}

// create particle group/explosion
function createParticles(x, y) {
	var mm = Molpy.Master;
    // increase the particle count for a bigger explosion, beware of the canvas performance hit with the increased particles though
    var particleCount = 50;
    while (particleCount--) {
        mm.particles.push(new Particle(x, y));
    }
}

// main demo loop
function Fireworks_loop() {
	var mm = Molpy.Master;
	var ctx = mm.ctx;
	var cw = mm.cw;
	var ch = mm.ch;
	// this function will run endlessly with requestAnimationFrame
	if (Molpy.Master.active) setTimeout(Fireworks_loop,1000/60);

	// increase the hue to get different colored fireworks over time
	mm.hue += 0.5;

	// normally, clearRect() would be used to clear the canvas
	// we want to create a trailing effect though
	// setting the composite operation to destination-out will allow us to clear the canvas at a specific opacity, rather than wiping it entirely
	ctx.globalCompositeOperation = 'destination-out';
	// decrease the alpha property to create more prominent trails
	ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
	ctx.fillRect(0, 0, cw, ch);
	// change the composite operation back to our main mode
	// lighter creates bright highlight points as the fireworks and particles overlap each other
	ctx.globalCompositeOperation = 'lighter';

	// loop over each firework, draw it, update it
	var i = mm.fireworks.length;
	while (i--) {
        	mm.fireworks[i].draw();
        	mm.fireworks[i].update(i);
	}

	// loop over each particle, draw it, update it
	var i = mm.particles.length;
	while (i--) {
       		mm.particles[i].draw();
       		mm.particles[i].update(i);
	}

	// launch fireworks automatically to random coordinates
	if (mm.timerTick >= mm.timerTotal) {
		if (mm.salvos > 0) {
			// start the firework at the bottom middle of the screen, then set the random target coordinates, 
			// the random y coordinates will be set within the range of the top half of the screen
			for (var i = 0; i < mm.salvosize; i++) {
				setTimeout(function () {mm.fireworks.push(new Firework(cw / 2 + randomRange(-cw / 6, cw / 6), ch, randomRange(0, cw), 
					randomRange(0, ch / 2)));}, 250 * i);
			}
			mm.timerTick = 0;
			mm.salvos--;
		} else {
			if (mm.salvos == 0) setTimeout(Molpy.Master.Destroy,5000);
			mm.salvos--;
		}
	} else {
		mm.timerTick++;
	};

	if (mm.limiterTick < mm.limiterTotal) mm.limiterTick++; 
}

