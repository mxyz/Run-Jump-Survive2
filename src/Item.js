var Item = cc.Sprite.extend({
    ctor: function( level,id ,layer) {
    	this.layer=layer;
        this.level=level;
        this.id=id;
        this._super();
        this.initWithFile( 'images/item0.png' );
		this.x = Math.random()*600+100;
		this.y = 130+((level)*60);
		this.setPosition( new cc.Point(this.x,this.y) );
    },
    keep: function(jumper) {
        var jumperPos=jumper.getPosition();
        var thisPos = this.getPosition();
        var distance = Math.sqrt(   Math.pow( jumperPos.x-thisPos.x,2 )+ Math.pow( jumperPos.y+30-thisPos.y,2 )  );
        if(distance<30) {
            this.funcItem(this.id);
                jumper.handleKeyUp( cc.KEY.down );

        }
    },
    funcItem: function( id ) {
        if( id == 0 ) 
            this.layer.superJump(this);
            this.setPosition( new cc.Point(0,0) );
            this.layer.removeChild(this);
    },
});