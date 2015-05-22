(function(){


var AppRouter = Rocket.Router.extend({

    routes: {
        'gslide1': '_defaultHandler:slide1'
        , 'gslide2': '_defaultHandler:slide2'
        , 'gslide3': '_defaultHandler:slide3'
        , 'gslide4': '_defaultHandler:slide4'
        , 'gslide5': '_defaultHandler:slide5'
        , '*default': '_defaultHandler:slide1'
    }

    , pageOrder: [
        'slide1'
        , 'slide2'
        , 'slide3'
        , 'slide4'
        , 'slide5'
    ]

    , defaultPageTransition: 'rotatecubeLR'
    // , defaultPageTransition: 'rotatenewspaper'
    // , defaultPageTransition: 'rotatecarouselLR'
    // , defaultPageTransition: 'slideLR'

    , pageTransition: {
        'slide1-slide2': 'slideLR'
        , 'slide2-slide3': 'rotatecarouselLR'
        , 'slide3-slide4': 'slideeasingLR'
        , 'slide4-slide5': 'rotatefallscaleup'
        , 'slide5-slide1': 'scaledownupscaleup'
    }

});



var pageViews = {};

$.each(
    ['slide1', 'slide2', 'slide3', 'slide4', 'slide5']
    , function(index, item){
        pageViews[item] = Rocket.PageView.extend({

            el: '#' + item

            , events: {
                'click': 'onclick'
            }

            , init: function(){
                this.viewCount = 1;
            }

            , onclick: function(e){
                var $target = $(e.target);

                if($target.closest('h1').length){
                    $target.attr('contenteditable', 'true'); 
                    e.stopPropagation();
                    return;
                }

                var id = ( /slide(\d+)/.test(item), RegExp.$1 ) || 1;
                this.navigate('gslide' + ( id % 5 + 1 ) ); 
            }

            , registerEvents: function(){
                var me = this;
                me.ec.on('pagebeforechange', me.onpagebeforechange, me); 
            }

            , onpagebeforechange: function(options){
                var me = this;
                if(me.ec == options.to){
                    if(me.$('.view-count').length){
                        me.$('.view-count').html(this.viewCount++);
                    }
                    else{
                        me.$el.append('<span class="view-count">' + ( me.viewCount++ ) + '</span>');
                    }
                }
            }

        });
    }
);


var appRouter = new AppRouter();

$.each(pageViews, function(key, item){
    appRouter.registerViewClass(key, item);
});

appRouter.start();
    




})();
