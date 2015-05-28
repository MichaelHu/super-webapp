define([
    'require'
    , 'rocket-p'
    , 'text!./pages/css3demos/html/css3demos.html'
    , 'css!./pages/css3demos/css/css3demos.less.css'
], function (require, Rocket, html) {

var Rocket = require('rocket-p');

var css3demosPageView = Rocket.PageView.extend({

    events: {
        'click .btn-next': 'onbtnnextclick'
        , 'click .btn-prev': 'onbtnprevclick'
    }

    , init: function (options) {
        var me = this;

        me.$el.html(html);          

        me.sceneList = [
            'scene_1'
            , 'scene_1_1'
            , 'scene_1_2'

            , 'scene_2'
            , 'scene_3'

            , 'scene_4'
            , 'scene_4_1'
        ];

        me.currentScene = -1;
        me.onbtnnextclick();
    }

    , className: 'css3demos-view'

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

