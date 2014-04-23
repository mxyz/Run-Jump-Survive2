var Bot = cc.Sprite.extend({
	ctor : function( y ){
	this._super();
	this.initWithFile('images/bot11.png');
	this.setAnchorPoint( cc.p( 0.5, 0 ) );
	this.speed = 1;
	this.level = 0;
	this.speedUpPerlevel = 0.1;
	this.moveleft = false;
	this.moveright = false;
	this.ground = null;
	this.blocks = [];
	this.rand = Math.floor(Math.random()*2);
	if(this.rand==1){
		this.moveleft = true;
	}else{
		this.moveright= true;
	}
	this.x = Math.random()*600;
	this.y = y;
	this.updatePosition();
	},
	updatePosition: function(){
		this.setPosition( cc.p( Math.round( this.x ),
                                Math.round( this.y ) ) );
	},
	update: function(){
		var oldRect = this.getBoundingBoxToWorld();
        var oldX = this.x;
        var oldY = this.y;
        this.updateXMovement();

        var dX = this.x - oldX;
        var dY = this.y - oldY;
        
        var newRect = cc.rect( oldRect.x + dX,
                               oldRect.y + dY - 1,
                               oldRect.width,
                               oldRect.height + 1 );

        this.handleCollision( oldRect, newRect );
        this.updatePosition();
	},
	updateXMovement: function(){


        	var rand = Math.floor(Math.random()*200);
		if(rand==1){
			this.changeDirection();
		}
			if(this.moveleft == true){
				this.x-=this.speed + (this.level*this.speedUpPerlevel);
				this.setFlippedX(true);
			}
			if(this.moveright == true){
				this.x+=this.speed + (this.level*this.speedUpPerlevel);
				this.setFlippedX(false);
			}

		
		
        if ( this.x < 20 ) {
            this.x += screenWidth+40;
        }
        if ( this.x > screenWidth+20 ) {
            this.x -= screenWidth+40;
        }


	},
	changeDirection: function() {
		if(this.moveright) {
			this.moveright=false;
			this.moveleft=true;
		}
		else {
			this.moveright=true;
			this.moveleft=false;
		}
	},
	 
	setBlocks: function( blocks ) {
        this.blocks = blocks;
    },
     handleCollision: function( oldRect, newRect ) {
        if ( this.ground ) {
            if ( !this.ground.onTop( newRect ) ) {
                this.ground = null;
            }
        } else {
            if ( this.vy <= 0 ) {
                var topBlock = this.findTopBlock( this.blocks, oldRect, newRect );
                
                if ( topBlock ) {
                    this.ground = topBlock;
                    this.y = topBlock.getTopY();
                    this.vy = 0;
                }
            }
        }
    },
    findTopBlock: function( blocks, oldRect, newRect ) {
        var topBlock = null;
        var topBlockY = -1;
        
        blocks.forEach( function( b ) {
            if ( b.hitTop( oldRect, newRect ) ) {
                if ( b.getTopY() > topBlockY ) {
                    topBlockY = b.getTopY();
                    topBlock = b;
                }
            }
        }, this );
        
        return topBlock;
    },
});