define([
    'require'
    , 'rocket-p'
    , './pages/css3demos/js/loadImages'
    , 'text!./pages/css3demos/html/css3demos.html'
    , 'css!./pages/css3demos/css/css3demos.less.css'
], function (require, Rocket, loadImages, html) {

var Rocket = require('rocket-p'),
    $ = require('zepto');

var imageResources = [
    "/src/pages/css3demos/img/logo.png",
    "/src/pages/css3demos/img/design.png",
    "/src/pages/css3demos/img/ray.png",
    "/src/pages/css3demos/img/lamp.png",
    "/src/pages/css3demos/img/lamp-shine.png",
    "/src/pages/css3demos/img/tingshuo.png",
    "/src/pages/css3demos/img/cadeng.png",
    "/src/pages/css3demos/img/spirit.png",
    "/src/pages/css3demos/img/spirit-shout.png",
    "/src/pages/css3demos/img/cloud-1.png",
    "/src/pages/css3demos/img/cloud-2.png",
    "/src/pages/css3demos/img/coin.png",
    "/src/pages/css3demos/img/goto-work.png",
    "/src/pages/css3demos/img/goto-work-2.png",
    "/src/pages/css3demos/img/spirit-in-car.png",
    "/src/pages/css3demos/img/coin-fri.png",
    "/src/pages/css3demos/img/coin-thu.png",
    "/src/pages/css3demos/img/coin-wed.png",
    "/src/pages/css3demos/img/coin-tue.png",
    "/src/pages/css3demos/img/coin-mon.png",
    "/src/pages/css3demos/img/bomb-f1.png",
    "/src/pages/css3demos/img/bomb-f2.png",
    "/src/pages/css3demos/img/bomb-f3.png",
    "/src/pages/css3demos/img/bomb-f4.png",
    "/src/pages/css3demos/img/bomb-f5.png",
    "/src/pages/css3demos/img/bomb-f6.png"
];

var css3demosPageView = Rocket.PageView.extend({

    events: {
        'click .btn-next': 'onbtnnextclick'
        , 'click .btn-prev': 'onbtnprevclick'
    }

    , init: function (options) {
        var me = this,
            width = $(window).width(),
            rootFontSize = Math.round( ( 20 / 320 ) * width );

        $('html').css('font-size', rootFontSize + 'px');

        me.$el
            .css('padding-top', '0px')
            .html(html);          

        me.sceneList = [
            'scene_1'
            , 'scene_1_1'
            , 'scene_1_2'

            , 'scene_2'
            , 'scene_3'
            , 'scene_3_1'
            , 'scene_3_2'

            , 'scene_4'
            , 'scene_4_1'
            , 'scene_4_2'
            , 'scene_4_3'
            , 'scene_4_4'

            , 'scene_5'
            , 'scene_5_1'
            , 'scene_5_2'

            , 'scene_6'
        ];

        me.currentScene = -1;
        // me.onbtnnextclick();

        loadImages(
            imageResources
            , function(){
                me.$('.loading-layer').hide();
                setInterval(function () {
                        me.onbtnnextclick();
                    }
                    , 1500
                );
            }
            , function(progress){
                me.$('.loading-layer span')
                    .html(progress); 
            }
        );
    }

    , className: 'css3demos-view'

    , registerEvents: function () {
        var me = this;

        me.ec.on('pagebeforechange', me.onpagebeforechange, me);
    }

    , onpagebeforechange: function (params) {
        var me = this,
            from = params.from,
            to = params.to;

        if (from == me.ec) {
            $('#main_nav').show();
        }
        else if (to == me.ec) {
            $('#main_nav').hide();
        }
    }
    , getNextScene: function (current) {
        return this.getScene(true, current);
    }

    , getPrevScene: function (current) {
        return this.getScene(false, current);
    }

    , getScene: function (isNext, current) {
        var me = this,
            step = isNext ? 1 : -1; 

        if (undefined === current) {
            current = me.currentScene; 
        }

        return ( current + step + me.sceneList.length ) 
            % me.sceneList.length;
    }


    , onbtnnextclick: function (e) {
        var me = this,
            nextScene = me.getNextScene(),
            nextSceneName = me.sceneList[nextScene],
            smallScene = /scene_\d+_\d+/.test(nextSceneName);

        me.currentScene = nextScene;

        console.log(nextScene);

        if (smallScene) {
            me.$el.addClass(nextSceneName);  
        }
        else {
            me.$el.attr('class', me.className)
                .addClass(nextSceneName);
        }
    }

    , onbtnprevclick: function (e) {
        var me = this,
            prevScene = me.getPrevScene(),
            currentSceneName = me.sceneList[me.currentScene],
            prevSceneName = me.sceneList[prevScene],
            smallScene = /scene_\d+_\d+/.test(currentSceneName);

        me.currentScene = prevScene;
        console.log(prevScene);

        if (smallScene) {
            me.$el.removeClass(currentSceneName);  
        }
        else {
            me.$el.attr('class', me.className
                + ' ' + me.getSceneClass(prevSceneName));
        }
    }

    , getSceneClass: function (scene) {
        var me = this;

        if(!/scene_\d+_\d+/.test(scene)){
            return scene;
        }

        // smallScene
        var cls = scene,
            current = me.getPrevScene(),
            s = me.sceneList[current];

        while(/scene_\d+_\d+/.test(s)){
            cls = s + ' ' + cls; 
            current = me.getPrevScene(current),
            s = me.sceneList[current];
        }
        cls = s + ' ' + cls;
        console.log(cls);
        return cls;
    }

});

Rocket.Router.registerViewClass(
    'css3demos'
    , css3demosPageView 
);

return css3demosPageView;

    
});

