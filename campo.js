function Campo(settings) 
{
    var H = settings['H'];
    var W = settings['W'];
    var c = settings['context'];

    this.paint = function() {
        c.save();
        
        c.beginPath();
        c.clearRect(0,0,600,300);
        c.fillRect(0,0,W,H);
        verticalLine(PW);
        verticalLine(W/2);
        verticalLine(W-PW);
        c.closePath();
        
        c.restore();
    };
    var verticalLine = function(x) {
        c.moveTo(x,0);
        c.lineTo(x,H);
        c.stroke();
    };
}

