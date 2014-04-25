var GameLayer = cc.Layer.extend({
    init: function() {
        this._super( );
        this.bg = new bg(this);
        
        this.addChild(this.bg); 
        this.createInitBots();
        this.lava = new lava(this);
        
        this.jumper = new Jumper( 300, 50,this );
        this.jumper.setBlocks( this.blocks );
        this.addChild( this.jumper,500 );
        this.scheduleOnce(function() {
            this.jumper.scheduleUpdate();
        }, 1);
        
        this.addChild(this.lava,501);
    
        this.scheduleOnce(function(){
        this.lava.scheduleUpdate();
        }, 11);
        
        this.setKeyboardEnabled( true );

        var followJumper = cc.Follow.create(this.jumper,cc.rect(0,0,600,100000));  
        this.runAction(followJumper);
        this.scheduleUpdate();
        this.rand = Math.floor(Math.random()*3);
        cc.AudioEngine.getInstance().playMusic( 'sound/2..mp3', true );

         return true;
    },
    createFloorLabel: function(i) {
        var floor1Label = cc.LabelTTF.create( i, 'Arial', 30 );
        floor1Label.setPosition( new cc.Point( 570, 60+300*i/5 ) );
        this.addChild( floor1Label,498 );
    },
    update: function() {
        var lavaPos = this.lava.getPositionY()+360;
        var jumperPos = this.jumper.getPositionY();
        if(lavaPos > jumperPos)
            this.gameOver();
    },
    gameOver: function() {
        console.log("Floor: "+this.jumper.countJump);
        this.lava.unscheduleUpdate();
        this.removeChild(this.jumper);
        this.unscheduleUpdate();
    },
    removeBotFromLevel: function() {
        this.Bots[0].forEach( function( b ) {
                this.removeChild( b );
            }, this );
        this.Bots.shift();
    },
    createInitBots: function() {
        this.Bots = [];
        this.blocks = [];
        this.blocks.push( new Block( 100, 0, 500, 50 ) );
        this.addChild(this.blocks[0]);
        this.botCreateLevel=0;
        this.botCreateSpeed=0.5;
        var speed=0.5;

        for( var i=0;i<12;i++) {
            this.createNewBots();
        }
    },
    createNewBots: function() {
        if((this.botCreateLevel+1)%5==0)
            this.createFloorLabel(this.botCreateLevel+1);
        this.createBlocks();
        this.Bots.push([]);
        /*if(this.botCreateLevel%25==0)
            this.botCreateSpeed=0.5;
        for( var i=0;i<=Math.floor(this.botCreateLevel/25);i++) {
            var newBot = new Bot( this.botCreateLevel,this.botCreateSpeed );
            this.Bots[this.Bots.length-1].push(newBot);
            this.botCreateSpeed+=0.03;
        }*/

        for( var i=0;i<=this.botCreateLevel%5;i++) {
            var newBot = new Bot( this.botCreateLevel,this.botCreateSpeed );
            this.Bots[this.Bots.length-1].push(newBot);
            if(this.botCreateLevel%5==0) 
                this.botCreateSpeed+=0.06;
        }

        this.Bots[this.Bots.length-1].forEach( function( b ) {
                this.scheduleOnce(function() {
                b.scheduleUpdate();
            }, 1);
                this.addChild( b ,499);
            }, this );
        this.botCreateLevel++;
    },

    createBlocks: function() {
        var x1 = 0,x2 = 600, y1 =100+60*this.botCreateLevel, y2 = 110+60*this.botCreateLevel;

        this.blocks.push( new Block( x1, y1, x2, y2));

        this.addChild(this.blocks[this.blocks.length-1]);
    },

    onKeyDown: function( e ) {
        this.jumper.handleKeyDown( e );
        this.lava.handleKeyDown( e );
    },

    onKeyUp: function( e ) {
        this.jumper.handleKeyUp( e );
        this.lava.handleKeyUp( e );
    }
});

var StartScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new GameLayer();
        layer.init();
        this.addChild( layer );
    }
});