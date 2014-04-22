var Jumper = cc.Sprite.extend({
    ctor: function( x, y ) {
        this._super();
        this.initWithFile( 'images/jumper.png' );
        this.setAnchorPoint( cc.p( 0.5, 0 ) );
        this.x = x;
        this.y = y;

        this.maxVx = 4;
        this.accX = 0.25;
        this.backAccX = 0.5;
        this.jumpV = 11;
        this.g = -1;
		this.isWalk = false;
        
        this.vx = 0;
        this.vy = 0;

        this.countJump = 0;
        this.moveLeft = false;
        this.moveRight = false;
        this.jump = false;
		this.down = false;
		this.Walk = this.walking();
		this.Walking = false;
		this.acstand = this.standing();
	//this.stopAllAction();
		this.acstanding = false;
        this.ground = null;

		
		this.Jump = this.jumping();
		this.isJump = false;
		
        this.blocks = [];

        this.updatePosition();
    },

    updatePosition: function() {
        this.setPosition( cc.p( Math.round( this.x ),
                                Math.round( this.y ) ) );
    },

    update: function() {
        var oldRect = this.getBoundingBox();
        var oldX = this.x;
        var oldY = this.y;
		if(!this.acstanding){
			
			this.runAction(this.acstand);
			this.acstanding = true;
        }
		
		this.updateYMovement();
        this.updateXMovement();

        var dX = this.x - oldX;
        var dY = this.y - oldY;
        
        var newRect = cc.rect( oldRect.x + dX,
                               oldRect.y + dY - 1,
                               oldRect.width,
                               oldRect.height + 1 );

        this.handleCollision( oldRect, newRect );
		
        this.updatePosition();
		
		
		if(this.vy>0) {
			if(this.isWalk == true){
				this.stopAllActions();
				
			}
			this.runAction(this.Jump);
		}if(this.vy<0){
			this.stopAllActions();
		}
		if(this.vx!=0) {
			
			if(this.isWalk==true) {

				if(!this.isWalking){
					
					
					this.isWalking = true;
				}
			}
			else {
				this.stopAllActions();
				this.isWalking = false;
			}
		}
		else
			
			this.runAction(this.acstand);
    },

    updateXMovement: function() {
        if ( this.ground ) {

            if ( ( !this.moveLeft ) && ( !this.moveRight ) ) {
                this.autoDeaccelerateX();
				if(this.isWalk && this.isJump){
					this.stopAllActions();
					this.isWalk=false;
					this.runAction(this.acstand);
					this.acstanding = true;
				}
				
            } else if ( this.moveRight ) {
                this.accelerateX( 1 );
				if(this.isWalk==false){
					this.stopAllActions();
					this.runAction(this.Walk);
					this.isWalk = true;
					this.acstanding = false;
				}
				this.setFlippedX(false);
				
            } else {
                this.accelerateX( -1 );
				if(this.isWalk==false){
					this.stopAllActions();
					this.runAction(this.Walk);
					this.isWalk=true;
					this.acstanding = false;
				}
				this.setFlippedX(true);
				
            }

        }
		if ( ( !this.moveLeft ) && ( !this.moveRight ) ){
			if(this.isWalk){
			
			this.isWalk=false;
			}
			
			if(!this.acstanding){
			
			this.acstanding = true;
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

    isSameDirection: function( dir ) {
        return ( ( ( this.vx >=0 ) && ( dir >= 0 ) ) ||
                 ( ( this.vx <= 0 ) && ( dir <= 0 ) ) );
    },

    accelerateX: function( dir ) {
        if ( this.isSameDirection( dir ) ) {
            this.vx += dir * this.accX;
            if ( Math.abs( this.vx ) > this.maxVx ) {
                this.vx = dir * this.maxVx;
            }
        } else {
            if ( Math.abs( this.vx ) >= this.backAccX ) {
                this.vx += dir * this.backAccX;
            } else {
                this.vx = 0;
            }
        }
    },
    
    autoDeaccelerateX: function() {
        if ( Math.abs( this.vx ) < this.accX ) {
            this.vx = 0;
        } else if ( this.vx > 0 ) {
            this.vx -= this.accX;
        } else {
            this.vx += this.accX;
        }
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
    
    handleKeyDown: function( e ) {
        if ( Jumper.KEYMAP[ e ] != undefined ) {
            this[ Jumper.KEYMAP[ e ] ] = true;

        }
    },

    handleKeyUp: function( e ) {
        if ( Jumper.KEYMAP[ e ] != undefined ) {
            this[ Jumper.KEYMAP[ e ] ] = false;
        }
    },

    setBlocks: function( blocks ) {
        this.blocks = blocks;
    },
	standing : function(){
	cc.SpriteFrameCache.getInstance().addSpriteFrames(Jumper_standplist,Jumper_stand);

	
	var animFrames = [];
	for (var i = 1; i <=7 ; i++) {
		var str = "Jumper-stand" + i + ".png";
		var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(str);
		animFrames.push(frame);
	}
	
	var animation = cc.Animation.create(animFrames, 3);

	
	return cc.RepeatForever.create(cc.Animate.create(animation));
	},
	
	walking : function(){
	 
	cc.SpriteFrameCache.getInstance().addSpriteFrames(Jumper_walkplist,Jumper_walk);

	
	var animFrames = [];
	for (var i = 1; i <= 8; i++) {
		var str = "Jumper-walk" + i + ".png";
		var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(str);
		animFrames.push(frame);
	}
	
	var animation = cc.Animation.create(animFrames, 0.1);

	
	return cc.RepeatForever.create(cc.Animate.create(animation));
	},
	
	jumping : function(){
		cc.SpriteFrameCache.getInstance().addSpriteFrames(Jumper_jumpplist,Jumper_jump);
		var animFrames = [];
		for (var i = 1; i <= 2; i++) {
			var str = "Jumper-jump" + i + ".png";
			var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(str);
			animFrames.push(frame);
		}
	
		var animation = cc.Animation.create(animFrames, 1);

	
		return cc.RepeatForever.create(cc.Animate.create(animation));
	},

	getCountJump : function(){
		return this.countJump;
	},
});
Jumper.DIRECTION = {
	RIGHT: 1,
	LEFT: -1
};

Jumper.KEYMAP = {}
Jumper.KEYMAP[cc.KEY.left] = 'moveLeft';
Jumper.KEYMAP[cc.KEY.right] = 'moveRight';
Jumper.KEYMAP[cc.KEY.up] = 'jump';
Jumper.KEYMAP[cc.KEY.down] = 'down';
        