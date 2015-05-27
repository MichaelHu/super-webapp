define([
        'require'
        , 'rocket-p'
        , 'bootstrap'
    ], function (require, Rocket) {

var $ = require('zepto');

var zrenderPageView = Rocket.PageView.extend({

    init: function (options) {
        var me = this;

        me.$el.html([
            '<h1>Hello, I\'m zrender page</h1>'
            , '<button type="button" class="btn btn-primary" autocomplete="off">'
            ,       'Start zRender'
            , '</button>'
            , '<div style="height: 150px;" class="zrender-main"></div>'
        ].join(''));          

        me.$btn = me.$('button');
    }

    , registerEvents: function () {
        var me = this;
       
        me.$btn.on('click', function () {
            require([ 'zrender' ], function( zrender ){
                console.log( zrender );
                // console.log(require.defined('zrender'));
                // console.log(require.defined('zrender/shape/Base'));
                // console.log(require.defined('zrender/shape/Text'));
                // console.log(require.defined('zrender/shape/Rectangle'));
                // console.log(require.defined('zrender/shape/Image'));
                // console.log(require.defined('zrender/Group'));
                // console.log(require.defined('zrender/zrender'));
                // console.log(require.defined('zrender/main'));

                // console.log(require.defined('zrender/tool/math'));
                // console.log(require.defined('zrender/shape/Rose'));

                // console.log(require.defined('zrender/shape/Circle'));
                // console.log(require.defined('zrender/shape/Sector'));
                console.log(require.defined('zrender/tool/util'));
                console.log(require.defined('zrender/shape/Base'));

                var RectangleShape = require('zrender/shape/Rectangle');
                // var CircleShape = require('zrender/shape/Circle');
                var zr = zrender.init(me.$('.zrender-main').get(0));
                zr.addShape(
                    new RectangleShape({
                        style : {
                            x : 100,
                            y : 100,
                            width: 100,
                            height: 50,
                            brushType : 'both',
                            color : 'rgba(220, 20, 60, 0.8)',          // rgba supported
                            strokeColor: '#f00',
                            
                            lineWidth : 5,
                            text :'rectangle',
                            textPosition :'inside'
                        },
                        hoverable : true,   // default true
                        draggable : true,   // default false
                        clickable : true,   // default false
                    })
                );
                zr.render();
            });

        });
    }

});

Rocket.Router.registerViewClass(
    'zrender'
    , zrenderPageView 
);

return zrenderPageView;

});

