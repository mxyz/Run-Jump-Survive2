var lava = cc.Sprite.extend({
    ctor: function() {
        this._super();
        this.initWithFile( 'images/lava.png' );
        this.y = -350;
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
		if(this.getParent().jump){
            
            if(this.level<100){
            this.level++;
            }
        }
        if(this.space){
			if(this.y>-350 ){
				this.y-=50;
			}
		}else{
			if(this.y<5800){
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