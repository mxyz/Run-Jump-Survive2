var lava = cc.Sprite.extend({
    ctor: function(layer) {
        this.layer=layer;
        this._super();
        this.initWithFile( 'images/lava.png' );
        this.y = -350;
        this.setPosition( new cc.p(400,this.y) );
        this.space = false;
    
        this.level = 0;
        this.floor=0;
        this.speedPerLevel = 0.01;
        this.normalspeed = 1;
    },
    updatePosition: function() {
        this.setPosition( cc.p( 300, Math.round( this.y ) ) );
    },
    update : function(){
        var posY=this.getPositionY();
        if(this.getParent().jump){
            
            this.level++;
        }
        if(this.space){
            if(this.y>-350 ){
                this.y-=50;
            }
        }else{
                this.y += this.normalspeed + (this.level*this.speedPerLevel);
        }
        if(posY+360>110+(this.floor+1)*60) {
            this.layer.removeBotFromLevel();
            this.floor++;
        }
        this.updatePosition();
        
    },




    
});
lava.KEYMAP = {}
lava.KEYMAP[cc.KEY.space] = 'space';
lava.KEYMAP[cc.KEY.up] = 'up';