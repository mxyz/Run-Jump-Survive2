var bg = cc.Sprite.extend({
    ctor: function(layer) {
    	this.layer=layer;
        this._super();
        this.initWithFile( 'images/bg.png' );
		this.setPosition( new cc.p(300,300) );
		this.scheduleUpdate();
		this.checkUp=0;
		this.checkDown=-2;
	},
	update: function() {
		var posY = this.layer.jumper.getPositionY();
		if(Math.floor(posY/600)==this.checkUp) {
			this.setPositionY(posY);
			this.checkUp++;
			this.checkDown++;
		}
		else if(Math.floor(posY/600)==this.checkDown) {
			this.setPositionY(posY);
			this.checkUp--;
			this.checkDown--;
		}
	}
});