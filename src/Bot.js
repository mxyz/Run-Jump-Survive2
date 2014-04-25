var Bot = cc.Sprite.extend({
	ctor : function( level , speed  ){
	this._super();
	this.initWithFile('images/bot11.png');
	this.setAnchorPoint( cc.p( 0.5, 0 ) );
	this.speed = speed;
	this.level = level;
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
	this.y = 110+(this.level*60);
	this.updatePosition();
	this.runAction(this.move());
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

        this.updatePosition();
	},
	updateXMovement: function(){


        	var rand = Math.floor(Math.random()*200);
		if(rand==1){
			this.changeDirection();
		}
			if(this.moveleft == true){
				this.x-=this.speed;
				this.setFlippedX(true);
			}
			if(this.moveright == true){
				this.x+=this.speed;
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
	move : function(){
	 
	cc.SpriteFrameCache.getInstance().addSpriteFrames(Bot_walkplist,Bot_walk);

	
	var animFrames = [];
	for (var i = 1; i <= 6; i++) {
		var str = "bot" + i + ".png";
		var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(str);
		animFrames.push(frame);
	}
	
	var animation = cc.Animation.create(animFrames, 0.1);

	
	return cc.RepeatForever.create(cc.Animate.create(animation));
	},
	hit: function(jumper) {
		var jumperPos=jumper.getPosition();
		var thisPos = this.getPosition();
		var distance = Math.sqrt(   Math.pow( jumperPos.x-thisPos.x,2 )+ Math.pow( jumperPos.y-thisPos.y,2 )  );
		if(distance<30) {
			jumper.handleKeyDown( cc.KEY.down );
			this.scheduleOnce(function() {
                jumper.handleKeyUp( cc.KEY.down );
            }, 0.1);
			
		}
	},
    
});