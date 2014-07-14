// Masterpiece Pane


// Full screen image infront of game
// Fireworks in front of image
// Fanfare 


Molpy.Master = {
	Create: function(np,time) {
		this.np = np;
		$('#game').addClass('hidden');
		g('masters').innerHTML = '<div id=MasterBlack>&nbsp;</div><div id=MasterPix></div><div id=darkenMaster></div>' +
					'<div id=fireworkdiv><canvas id=firework width=' + window.innerWidth +
					' hieght=' + window.innerHieght+ '></div><div id=fanfare></div>';
		this.active = 1;
		Molpy.Master.NewPix(np);
		Molpy.Master.StartFireWorks(np);
		Molpy.Master.FanFare();
		setTimeout(Molpy.Master.Destroy,time);
	},
	
	Destroy: function() {
		$('#game').removeClass('hidden');
		g('masters').innerHTML = '';
		Molpy.Master.active = 0;
	},

	NewPix: function(np) {
		g('MasterBlack').width=window.innerWidth;
		g('MasterBlack').height=window.innerHeight;
		g('MasterPix').style.backgroundImage = Molpy.Url(Molpy.NewPixFor(np));
	},
	active: 0,

	FanFare: function() {
	},

	StartFireWorks: function(np) {

	this.canvas = g('firework');
	this.ctx = this.canvas.getContext('2d');
	this.cw = window.innerWidth;
	this.ch = window.innerHeight;
	this.fireworks = [];
	this.particles = [];
	this.hue = 120;
	this.limiterTotal = 5;

	this.limiterTick = 0;
	this.timerTotal = 60;
	this.timerTick = 0;
	this.mx = 0;
	this.my = 0;
	this.salvos = 5 + Math.floor(np/500);

	this.canvas.width = this.cw;
	this.canvas.height = this.ch;

	Fireworks_loop();
	},
};

Molpy.Sounds = {
	'fire0' : new Audio('audio/fire0.mp3'),
}

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
    this.coordinateCount = 5;
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

    // cycle the circle target indicator radius
    /*
    if (this.targetRadius < 8) {
        this.targetRadius += 0.3;
    } else {
        this.targetRadius = 1;
    }*/

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
        this.audio = new Audio('audio/fire'+flandom(2)+'.mp3');
	this.audio.play();
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
    ctx.lineWidth=2;
    ctx.strokeStyle = 'hsl(' + mm.hue + ', 100%, ' + this.brightness + '%)';
    ctx.stroke();

//    ctx.beginPath();
    // draw the target for this firework with a pulsing circle
//    ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
//    ctx.stroke();
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
    if (mm.timerTick >= mm.timerTotal && mm.salvos) {
            // start the firework at the bottom middle of the screen, then set the random target coordinates, the random y coordinates will be set within the range of the top half of the screen
            for (var i = 0; i < 3; i++) {
                setTimeout(function () {
                    mm.fireworks.push(new Firework(cw / 2 + randomRange(-cw / 6, cw / 6), ch, randomRange(0, cw), randomRange(0, ch / 2)));
                }, 250 * i);
            }
            mm.timerTick = 0;
	    mm.salvos--;
    } else {
        mm.timerTick++;
    }

    if (mm.limiterTick < mm.limiterTotal) mm.limiterTick++; 
}

/*
window.onresize = function () {
    cw = canvas.width = window.innerWidth;
    ch = canvas.height = window.innerHeight;
};

}
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

*/
