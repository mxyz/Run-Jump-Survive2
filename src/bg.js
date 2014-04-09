var bg = cc.Sprite.extend({
    ctor: function() {
        this._super();
        this.initWithFile( 'images/bg.png' );
		this.setPosition( new cc.p(300,300) );
	},
});