function Paddle(lr, settings) 
{
    var H = settings['H'];
    var W = settings['W'];
    
    this.pos = [0,H/2 - PH/2];
    if (lr == 'l')
        this.pos[0] = 0;
    else if (lr == 'r')
        this.pos[0] = W-PW;
    
    this.moveUp = function() {
        var y = this.pos[1];
        y -= 5;
        if (y < 0)
            y = 0;
        this.pos[1] = y;
    };
    this.moveDown = function() {
        var y = this.pos[1];
        y += 5;
        if (y+PH > H)
            y = H - PH;
        this.pos[1] = y;
    };
    this.paint = function() {
        c.save();
        c.fillStyle = '#0f0';

        c.beginPath();
        c.fillRect(this.pos[0], this.pos[1], PW, PH);
        c.closePath();
        
        c.restore();
    }
}