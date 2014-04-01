var GameLayer = cc.LayerColor.extend({
    init: function() {
        this._super( new cc.Color4B( 127, 127, 127, 255 ) );
        this.setPosition( new cc.Point( 0, 0 ) );

        this.createBlocks();
		
		this.jumper = new Jumper( 300, 50 );
        this.jumper.setBlocks( this.blocks );
        this.addChild( this.jumper,999 );
        this.scheduleOnce(function() {
            this.jumper.scheduleUpdate();
        }, 2);
        
        
        this.setKeyboardEnabled( true );
        return true;
    },
	
    createBlocks: function() {
        this.blocks = [];
        var groundBlock = new Block( 100, 0, 500, 50 );
        this.blocks.push( groundBlock );
		
		var topestBlock = new Block( 200, 460, 400, 470 );
        this.blocks.push( topestBlock );
		
		var mid1Block = new Block( 0, 100, 600, 110 );
        this.blocks.push( mid1Block );
		
		var mid2Block = new Block(0 , 340 , 600 , 350);
		this.blocks.push(mid2Block);
		
		var mid3Block = new Block(0,280,600,290);
		this.blocks.push(mid3Block);
		
		var mid4Block = new Block(0 , 160 , 600 , 170);
		this.blocks.push(mid4Block);
		
		var mid5Block = new Block(0,400,600,410);
		this.blocks.push(mid5Block);
		
		var mid6Block = new Block (0, 220 , 600 , 230);
		this.blocks.push(mid6Block);


        this.blocks.forEach( function( b ) {
            this.addChild( b );
        }, this );
    },

    onKeyDown: function( e ) {
        this.jumper.handleKeyDown( e );
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