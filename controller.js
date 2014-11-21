/**
 * 
 */
function Controller(settings) {
    var W = settings['CanvasWidth'];
    var H = settings['CanvasHeight'];
    var PW = settings['PaddleWidth'];
    var PH = settings['PaddleHeight'];
    var a = 5; // acc = 5 pix / tick^2
    
    this.ball = new Ball(settings);
    this.campo = new Campo(settings);
    this.paddles = {
        'l': new Paddle('l', settings),
        'r': new Paddle('r', settings)
    };
    this.running = false;
    
    //
    // Painting
    // 
    this.paint = function() {
        this.campo.paint();
        this.ball.paint();
        this.paddles['l'].paint();
        this.paddles['r'].paint();
        this.paintScore();
    };
    
    //
    // Collisions
    // 
    this.checkCollisionPaddle = function() {
        var b = this.ball;
        var bx = b.pos[0], by = b.pos[1];
        var r = b.radio;
        var onBounce = function() {
            b.bounceX(PW, W-PW);
            b.accelerate(a);
        };
        // if ball.left < leftPaddle.right and ball on paddle: bounce
        var p = this.paddles['l'];
        if (bx-r < p.pos[0]+PW) {
            if (p.pos[1] < by && by < p.pos[1]+PH) {
                onBounce();
            }
        }
        // if ball.right > rightPaddle.keft and ball on paddle: bounce
        p = this.paddles['r'];
        if (bx+r > p.pos[0]) {
            if (p.pos[1] < by && by < p.pos[1]+PH) {
                onBounce();
            }
        }
    };
    this.checkCollisionLeftRight = function() {
        var b = this.ball;
        var bx = b.pos[0];
        var r = b.radio;
        if (bx-r < 0) {
            throw {'type': 'out', 'side': 'left'};
        }
        if (bx+r > W) {
            throw {'type': 'out', 'side': 'right'};
        }
    };
    this.checkCollisionTopBottom = function() {
        this.ball.bounceY(0,H);
    };
    this.checkCollisions = function() {
        // check collisions with paddles
        this.checkCollisionPaddle();
        // check collisions with left/right walls
        this.checkCollisionLeftRight();
        // check collisions with top/bottom walls
        this.checkCollisionTopBottom();
    }

    //
    // Score
    // 
    this.score = {
        'l': 0,
         'r': 0
    };
    this.paintScore = function() {
        var s = this.score;        
        c.save();
        c.fillStyle = '#fff';
        if (this.running) {
            // small, top centered
            c.font="20px Arial";
            c.textAlign = 'right';
            c.fillText(s.l, W/2-20, 20);
            c.textAlign = 'left';
            c.fillText(s.r, W/2+20, 20);
        } else {
            // big, centered
            var size = 150/200 * H;
            c.font= size + "px Arial";
            c.textAlign = 'center';
            c.fillText(s.l, W/4, size);
            c.fillText(s.r, 3*W/4, size);
        }
        c.restore();
    }
    this.updateScore = function(outError) {
        var s = this.score;
        if (outError.side == 'left') {
            // point for 'right'
            s.r += 1;
        } else if (outError.side == 'right') {
            // point for 'left'
            s.l += 1;
        }
        this.showScore();
    }
    this.showScore = function() {
        var s = this.score;
        msg.innerHTML = "Score: " + s.l + " - " + s.r;
    };

    this.left = function() {
       this.ball.accelerate(-a, 0);
    };
    this.up = function() {
        this.ball.accelerate(0, a);
    };
    this.right = function() {
        this.ball.accelerate(a, 0);
    };
    this.down = function() {
        this.ball.accelerate(0, -a);
    };
    this.movePaddleUp = function(paddle) {
        this.paddles[paddle].moveUp();
    };
    this.movePaddleDown = function(paddle) {
        this.paddles[paddle].moveDown();
    }; 
    this.spaceKey = function() {
        if (this.running)
            return;

        this.running = true;
        this.ball.throw();
        this.run();
    };
    
    //
    // Main loop
    // 
    var ctl = this;
    this.run = function() {
        try {
            this.ball.move();
            this.checkCollisions();
            setTimeout(function() { ctl.run(); }, 60);
        } catch (outError) {
            if (outError.type == 'out') {
                this.updateScore(outError);
            }
            this.running = false;
        } finally {
            this.paint();
        }
    };
}

document.onkeydown = function(e) {
    e = e || window.event;
    switch(e.which || e.keyCode) {
    case 37:         // left
        controller.left();
        break;
    case 38:         // up
        controller.down();
        break;
    case 39:         // right
        controller.right();
        break;
    case 40:         // down
        controller.up();
        break;
    case 81:         // 'q' == paddle left up
        controller.movePaddleUp('l');
        break;
    case 65:         // 'a' == paddle left down
        controller.movePaddleDown('l');
        break;
    case 80:         // 'p' == paddle right up
        controller.movePaddleUp('r');
        break;
    case 76:         // 'l' == paddle right down
        controller.movePaddleDown('r');
        break;
    case 32:         // ' ' == throw ball
        controller.spaceKey();
        break;
    default: 
        // exit this handler for other keys
        return; 
    }

    // prevent the default action (scroll / move caret)
    e.preventDefault(); 
};

