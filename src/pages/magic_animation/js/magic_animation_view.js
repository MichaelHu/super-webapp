define(['require'
    , 'zepto'
    , 'rocket-p'
    , 'text!pages/magic_animation/html/magic_animation.html'
    , 'css!lib/magic/magic.css' 
    , 'css!pages/magic_animation/css/magic_demo.css' 
], function (require, $, Rocket, html) {


var magicanimationPageView = Rocket.PageView.extend({

    init: function (options) {
        var me = this;

        me.$el.html(html);          
        me.$animTarget = me.$('#magic_animation_timing');
        me.$testbox 
            = me.$('#magic_animation_testbox').appendTo('body');
    }

    , className: 'magic-animation'

    , events: {
        'click a[data-test]': 'onlinkclick' 
    }

    , registerEvents: function () {
        var me = this;

        me.ec.on('pagebeforechange', me.onpagebeforechange, me);
    }

    , onlinkclick: function(e){
        var me = this;
        var anim = $(e.target).data('test');
        var $animTarget = me.$animTarget;
        
        if(me.animLock) return;
        me.animLock = true;

        $animTarget
            .removeClass()
            .addClass(anim);

        setTimeout(function(){
            me.animLock = false;
            $animTarget.removeClass();
        }, 1500); 
    }

    , onpagebeforechange: function( params ) {
        var me = this;
        var from = params.from,
            to = params.to,
            param = params.params;

        if (me.ec == from) {
            // me.$testbox.hide();
            me.$testbox.css('display', 'none');
            console.log(1);
        }
        else if (me.ec == to) {
            me.$testbox.css('display', 'block');
            console.log(2);
        }
    }


});

Rocket.Router.registerViewClass(
    'magic_animation'
    , magicanimationPageView 
);

return magicanimationPageView;

});


