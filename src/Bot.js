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
	this.rand = Math.random()*2;
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
		var oldRect = this.getBoundingBox();
        var oldX = this.x;
        var oldY = this.y;
        this.updateYMovement();
        this.updateXMovement();

        var dX = this.x - oldX;
        var dY = this.y - oldY;
        
        var newRect = cc.rect( oldRect.x + dX,
                               oldRect.y + dY - 1,
                               oldRect.width,
                               oldRect.height + 1 );

        this.handleCollision( oldRect, newRect );
	},
	updateXMovement: function(){
		if(this.ground){
			if(this.moveleft == true){
				this.x-=this.speed + (this.level*this.speedUpPerlevel);
				this.setFlippedX(true);
			}
			if(this.moveright == true){
				this.x+=this.speed + (this.level*this.speedUpPerlevel);
				this.setFlippedX(false);
			}

		}
		this.x += this.vx;
        if ( this.x < 20 ) {
            this.x += screenWidth+40;
        }
        if ( this.x > screenWidth+20 ) {
            this.x -= screenWidth+40;
        }
	},
	 updateYMovement: function() {
        
		if ( this.ground ) {

            this.vy = 0;
            if ( this.jump ) {
				this.stopAllActions();
				this.runAction(this.Jump);
                this.vy = this.jumpV;
                this.y = this.ground.getTopY() + this.vy;
                this.ground = null;
				this.isWalk=false;
				this.countJump++;
				
            }
			else if(this.down){
			
			if(this.ground==this.blocks[0]) {
				
				}else{
					this.y = this.ground.getTopY()+this.g;
					this.ground = new Block( 0,0,0,0 );
					this.countJump--;
				}
			}
	
        } else {
			this.stopAllActions();
            this.vy += this.g;
            this.y += this.vy;
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