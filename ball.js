function Ball(settings) {
    var H = settings['H'];
    var W = settings['W'];
    
    this.center = function() {
        this.pos = [W/2, H/2];
    };
    this.accelerate = function(ax, ay) {
        if (typeof ay === "undefined") {
            // 1 arg => acc along velocity
            var vx = this.v[0];
            var vy = this.v[1];
            var v = Math.sqrt(vx*vx+vy*vy);
            var ay = ax * vy/v;
            var ax = ax * vx/v;
        }
        this.v[0] += ax;
        this.v[1] += ay;
    };
    this.bounceX = function(min, max) {
        var x = this.pos[0];
        var r = this.radio;
        if (x-r < min) {
            // L is the left border of the ball
            // L = x-r (w/o bouncing)
            // L' = min+(min-L) = 2min-L = 2min+r-x (w/ bouncing)
            // x' = L'+r = 2min+2r-x = 2(min+r)-x
            this.pos[0] = 2*(min+r) - x;
            this.v[0] = -this.v[0];
        } else if (x+r > max) {
            // R is the right border of the ball
            // R = x+r (w/o bouncing)
            // R' = max-(R-max) = 2*max - (x+r)
            // x' = R'-r = 2*(max-r) - x
            this.pos[0] = 2*(max-r) - x;
            this.v[0] = -this.v[0];
        }
    }
    this.bounceY = function(min, max) {
        var y = this.pos[1];
        var r = this.radio;
        if (y-r < 0) {
            // B is the bottom border of the ball
            // B = y-r (w/o bouncing)
            // B' = min+(min-B) = 2min-B = 2min+r-y (w/ bouncing)
            // y' = B'+r = 2r-y
            this.pos[1] = 2*(min+r) - y;
            this.v[1] = -this.v[1];
        } else if (y+r > H) {
            // T is the top border of the ball
            // T = x+r (w/o bouncing)
            // T' = max-(T-max) = 2*max - (y+r)
            // y' = T'-r = 2*(max-r) - y
            this.pos[1] = 2*(max-r) - y;
            this.v[1] = -this.v[1];
        }
    }
    this.throw = function() {
        this.center();
        var angle = Math.random() * .2; // angle in [0, .2)
        if (Math.random() < .5) angle = -angle; // random mirror
        if (Math.random() < .5) angle = Math.PI + angle; // random 180 phase
        this.v = [5 * Math.cos(angle), 5 * Math.sin(angle)];
    }
    this.move = function() {
        this.pos[0] += this.v[0];
        this.pos[1] += this.v[1];
//        this.bounceX(PW, W-PW);
//        this.bounceY(0, H);
    };
    this.paint = function() {
        c.save();
        c.fillStyle = this.color;
        c.strokeStyle = null;
        
        c.beginPath();
        c.arc(this.pos[0], this.pos[1], this.radio, 0, 2*Math.PI, 0);
        c.closePath();
        c.fill();
        
        c.restore();
    };
    this.center();
    this.v = [0, 0];
    this.radio = 20;
    this.color = "#0ff";
}