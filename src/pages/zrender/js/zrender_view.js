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
            '<button type="button" class="btn btn-primary" autocomplete="off">'
            ,       'Start zRender'
            , '</button>'
            , '<div style="height: 150px;" class="zrender-main"></div>'
        ].join(''));          

        me.$btn = me.$('button');
    }

    , registerEvents: function () {
        var me = this;
       
        me.$btn.on('click', function () {
            require([ 
                'zrender'
                , 'zrender/shape/Rose' 
                , 'zrender/shape/Circle' 
                ], function( zrender ){

                var RectangleShape = require('zrender/shape/Rectangle');
                var CircleShape = require('zrender/shape/Circle');
                var RoseShape = require('zrender/shape/Rose');

                var zr = zrender.init(
                        me.$('.zrender-main')
                            .css('height', $(window).height() - 50 + 'px')
                            .get(0)
                    );

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

                zr.addShape(

                    new CircleShape({
                        style : {
                            x : 100,
                            y : 100,
                            r : 50,
                            brushType : 'both',
                            color : 'rgba(220, 20, 60, 0.8)',          // rgba supported
                            strokeColor : 'red',  // getColor from default palette
                            lineWidth : 5,
                            text :'circle',
                            textPosition :'inside'
                        },
                        hoverable : true,   // default true
                        draggable : true,   // default false
                        clickable : true,   // default false

                        // 可自带任何有效自定义属性
                        _name : 'Hello~',
                        onclick: function(params){
                            alert(params.target._name);
                        },

                        // 响应事件并动态修改图形元素
                        onmousewheel: function(params){
                            var eventTool = require('zrender/tool/event');
                            var delta = eventTool.getDelta(params.event);
                            var r = params.target.style.r;
                            r += (delta > 0 ? 1 : -1) * 10;
                            if (r < 10) {
                                r = 10;
                            };
                            zr.modShape(params.target.id, {style: {r: r}})
                            zr.refresh();
                            eventTool.stop(params.event);
                        }
                        /* 封装支持事件，见shape/base, config.EVENT
                        onmousemove : function(e){console.log('onmousemove',e)},
                        onmouseover : function(e){console.log('onmouseover',e)},
                        onmouseout  : function(e){console.log('onmouseout',e)},
                        onmousedown : function(e){console.log('onmousedown',e)},
                        onmouseup   : function(e){console.log('onmouseup',e)},
                        ondragstart : function(e){console.log('ondragstart',e)},
                        ondragend   : function(e){console.log('ondragend',e)},
                        ondragenter : function(e){console.log('ondragenter',e)},
                        ondragover  : function(e){console.log('ondragover',e)},
                        ondragleave : function(e){console.log('ondragleave',e)},
                        ondrop      : function(e){console.log('ondrop',e)}
                        */
                    })

                );

                zr.addShape(new RoseShape({
                    style : {
                        x : 300,
                        y : 100,
                        r : [35],
                        k : 7,
                        n : 4,
                        strokeColor : 'green',   // getColor from default palette
                        lineWidth : 2,
                        textPosition :'inside'
                    },
                    hoverable : true,   // default true
                    draggable : true
                }));

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

