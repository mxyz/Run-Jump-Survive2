var GameLayer = cc.Layer.extend({
    init: function() {
        this._super( );
        this.bg = new bg(this);
        this.state = GameLayer.STATES.READY;
         this.Items = [];
         cc.AudioEngine.getInstance().playMusic( 'sound/gameover.mp3',false );
         cc.AudioEngine.getInstance().playMusic( 'sound/ready.mp3', true );
        
        this.addChild(this.bg); 
        this.createInitBots();
        this.lava = new lava(this);
        
        this.jumper = new Jumper( 400, 50,this );
        this.jumper.setBlocks( this.blocks );
        this.addChild( this.jumper,500 );
        
        this.addChild(this.lava,501);
        this.setKeyboardEnabled( true );

        var followJumper = cc.Follow.create(this.jumper,cc.rect(100,0,600,100000));  
        this.runAction(followJumper);
        this.scheduleUpdate();

                return true;
    },
    startGame: function() {
        cc.AudioEngine.getInstance().playMusic( 'sound/ready.mp3', false );
        this.randmusic = Math.round((Math.random()*2))+1;
        this.scheduleOnce(function() {
            this.jumper.scheduleUpdate();
        }, 1);
        cc.AudioEngine.getInstance().playMusic( 'sound/'+this.randmusic+'.mp3', true );
        this.scheduleOnce(function(){
        this.lava.scheduleUpdate();
        }, 11);
        this.state = GameLayer.STATES.PLAYING;

    },
    restartGame: function() {
        for( var i=0;i<this.Bots.length;i++ )
            for( var j=0;j<this.Bots[i].length;j++ )
                this.removeChild( this.Bots[i][j] );
        for( var i=0;i<this.blocks.length;i++ )
            this.removeChild( this.blocks[i] );
        this.removeChild( this.lava );
        this.removeChild( this.overLabel );
        this.init();
    },
      gameOver: function() {
        console.log("Floor: "+this.jumper.countJump);
        this.overLabel = cc.LabelTTF.create( 'GAME OVER '+this.jumper.countJump, 'Arial', 70 );
        this.overLabel.setPosition( new cc.Point( 400, this.jumper.getPositionY()+100 ) );
        this.addChild( this.overLabel,999 );
        cc.AudioEngine.getInstance().playMusic( 'sound/'+this.randmusic+'.mp3', true);
        cc.AudioEngine.getInstance().playMusic( 'sound/gameover.mp3', true);
        this.lava.unscheduleUpdate();
        this.removeChild(this.jumper);
        this.state = GameLayer.STATES.GAMEOVER;
        this.unscheduleUpdate();
    },
    createFloorLabel: function(i) {
        var floor1Label = cc.LabelTTF.create( i, 'Arial', 30 );
        floor1Label.setPosition( new cc.Point( 670, 60+300*i/5 ) );
        this.addChild( floor1Label,498 );
    },
    update: function() {
        var lavaPos = this.lava.getPositionY()+360;
        var jumperPos = this.jumper.getPositionY();
        this.mainCheckHit();
        if(lavaPos > jumperPos)
            this.gameOver();
    },
    mainCheckHit: function() {
        for(var i=0;i<this.Bots.length;i++) {
            if(this.Bots[i][0].level==this.jumper.countJump-1) {
                for(var j=0;j<this.Bots[i].length;j++) {
                    this.Bots[i][j].hit(this.jumper);
                }
            }
        }
        this.keepItem();
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
        this.blocks.push( new Block( 100, 0, 700, 50 ) );
        this.addChild(this.blocks[0]);
        this.botCreateLevel=0;
        this.botCreateSpeed=0.5;
        var speed=0.5;

        for( var i=0;i<12;i++) {
            this.createNewBots();
        }
    },
    superJump: function(item){
        this.jumper.plusJumpCount();
        
    },
    createNewBots: function() {
        if((this.botCreateLevel+1)%5==0)
            this.createFloorLabel(this.botCreateLevel+1);
        this.createBlocks();
        this.Bots.push([]);
        var rand = Math.floor(Math.random()*1000/this.botCreateLevel);
        if(rand==0) {
            var item = new Item(this.botCreateLevel,0,this);
            this.Items.push(item);
            this.addChild(this.Items[this.Items.length-1],498);

        }
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
    keepItem: function() {
        for(var i=0;i<this.Items.length;i++) {
            if(this.Items[i].level==this.jumper.countJump-1) {
                this.Items[i].keep(this.jumper);


            }
        }
    },

    createBlocks: function() {
        var x1 = 0,x2 = 800, y1 =100+60*this.botCreateLevel, y2 = 110+60*this.botCreateLevel;

        this.blocks.push( new Block( x1, y1, x2, y2));

        this.addChild(this.blocks[this.blocks.length-1]);
    },

    onKeyDown: function( e ) {
        if( this.state == GameLayer.STATES.PLAYING )
            this.jumper.handleKeyDown( e );
        else if( this.state == GameLayer.STATES.READY ) {
            if( e==32 )
                this.startGame();
        }
        else if( this.state == GameLayer.STATES.GAMEOVER ) {
            if( e==32 )
                this.restartGame();
        }


    },

    onKeyUp: function( e ) {
        this.jumper.handleKeyUp( e );

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

GameLayer.STATES = {
    READY: 0,
    PLAYING: 1,
    GAMEOVER:2
};