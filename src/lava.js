var lava = cc.Sprite.extend({
    ctor: function() {
        this._super();
        this.initWithFile( 'images/lava.png' );
        this.y = -50;
		this.setPosition( new cc.p(300,this.y) );
		this.space = false;
		this.up = false;
	},
    updatePosition: function() {
        this.setPosition( cc.p( 300, Math.round( this.y ) ) );
    },
	update : function(){
		if(this.space){
			if(this.y>-50){
				this.y-=1;
			}
		}else{
			if(this.y<500){
				this.y += 0.03;
			}	
		}
		this.updatePosition();
	},
	handleKeyDown: function( e ) {
        if ( lava.KEYMAP[ e ] != undefined ) {     
            this[ lava.KEYMAP[ e ] ] = true;
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