var lava = cc.Sprite.extend({
    ctor: function() {
        this._super();
        this.initWithFile( 'images/lava.png' );
        this.y = -50;
		this.setPosition( new cc.p(300,this.y) );
		this.space = false;
	
		this.level = 0;
		this.speedPerLevel = 0.01;
		this.normalspeed = 1;
	},
    updatePosition: function() {
        this.setPosition( cc.p( 300, Math.round( this.y ) ) );
    },
	update : function(){
		if(this.space){
			if(this.y>-50){
				this.y-=5;
			}
		}else{
			if(this.y<6500){
				this.y += this.normalspeed + (this.level*this.speedPerLevel);
			}	
		}
		this.updatePosition();
	},
	handleKeyDown: function( e ) {
        if ( lava.KEYMAP[ e ] != undefined ) {
        if( lava.KEYMAP[ e ] == 'space'){
            this[ lava.KEYMAP[ e ] ] = true;
        }
        else if (lava.KEYMAP[ e ] = 'up'){
        	this.level++;
        }
        }
    },

    handleKeyUp: function( e ) {
        if ( lava.KEYMAP[ e ] != undefined ) {
            this[ lava.KEYMAP[ e ] ] = false;
        }
    },



    
});
lava.KEYMAP = {}
lava.KEYMAP[cc.KEY.space] = 'space';
lava.KEYMAP[cc.KEY.up] = 'up';