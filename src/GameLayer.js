var GameLayer = cc.LayerColor.extend({
    init: function() {
        this._super( new cc.Color4B( 127, 127, 127, 255 ) );
		this.bg = new bg();
		
		this.addChild(this.bg); 
        this.createBlocks();

       this.lava = new lava();
       
		
		this.jumper = new Jumper( 300, 50 );
        this.jumper.setBlocks( this.blocks );
        this.addChild( this.jumper,500 );
        this.scheduleOnce(function() {
            this.jumper.scheduleUpdate();
        }, 2);
        
         this.addChild(this.lava,501);
         this.lava.scheduleUpdate();
        this.setKeyboardEnabled( true );
        return true;
    },
	
    createBlocks: function() {
        this.blocks = [];
        var groundBlock = new Block( 100, 0, 500, 50 );
        this.blocks.push( groundBlock );
		
		var topestBlock = new Block( 200, 460, 400, 470 );
        this.blocks.push( topestBlock );
		
		var mid1Block = new Block( -100, 100, 700, 110 );
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