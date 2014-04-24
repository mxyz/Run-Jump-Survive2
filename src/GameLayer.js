var GameLayer = cc.Layer.extend({
    init: function() {
        this._super( );
		this.bg = new bg(this);
		
		this.addChild(this.bg); 
        this.createBlocks();

        this.lava = new lava();
       
		
		this.jumper = new Jumper( 300, 50 );
        this.jumper.setBlocks( this.blocks );
        this.addChild( this.jumper,500 );
        this.scheduleOnce(function() {
            this.jumper.scheduleUpdate();
        }, 1);
        
        this.addChild(this.lava,501);
    
        this.scheduleOnce(function(){
        this.lava.scheduleUpdate();
        }, 11);
        
        this.createBots();
        this.setKeyboardEnabled( true );

        this.floorLabel = cc.LabelTTF.create( '5', 'Arial', 30 );
        this.floorLabel.setPosition( new cc.Point( 590, 360 ) );
        this.addChild( this.floorLabel );
        this.floor1Label = cc.LabelTTF.create( '10', 'Arial', 30 );
        this.floor1Label.setPosition( new cc.Point( 580, 660 ) );
        this.addChild( this.floor1Label );
        

        var followJumper = cc.Follow.create(this.jumper,cc.rect(0,0,600,15000));  
        this.runAction(followJumper);

        cc.AudioEngine.getInstance().playMusic( 'sound/1.mp3', true );
        return true;
    },

    createBots: function() {
        this.Bots = [];
        var speed=0.5;
for( var i=0;i<100;i++) {
    if(i%25==0) {
        speed=0.5;
    }
    for( var j=0;j<=Math.floor(i/25);j++) {
        var newBot = new Bot( i,speed );
        this.Bots.push(newBot);
        speed+=0.03;
    }
}
        this.Bots.forEach( function( b ) {
            this.scheduleOnce(function() {
            b.scheduleUpdate();
        }, 1);
            this.addChild( b ,499);
        }, this );
    },

 createBlocks: function() {
        this.blocks = [];

        var x1 = 0,x2 = 600, y1 =100, y2 = 110;

       //var groundBlock = new Block( 100, 0, 500, 50 );
        this.blocks.push( new Block( 100, 0, 500, 50 ) );

		while(y2<6111){
            this.blocks.push( new Block( x1, y1, x2, y2));
            y1+=60;
            y2+=60;
        }
		/*var mid1Block = new Block( -100, 100, 700, 110 );
        this.blocks.push( mid1Block );
		
		var mid2Block = new Block(-100 , 340 , 700 , 350);
		this.blocks.push(mid2Block);
		
		var mid3Block = new Block(-100,280,700,290);
		this.blocks.push(mid3Block);
		
		var mid4Block = new Block(-100 , 160 , 700 , 170);
		this.blocks.push(mid4Block);
		
		var mid5Block = new Block(-100,400,700,410);
		this.blocks.push(mid5Block);
		
		var mid6Block = new Block (-100, 220 , 700 , 230);
		this.blocks.push(mid6Block);
        */

        this.blocks.forEach( function( b ) {
            this.addChild( b );
        }, this );
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