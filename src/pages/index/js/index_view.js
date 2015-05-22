define(['require', 'jquery', 'bootstrap', 'rocket-p'], function (require, $) {

var Rocket = require('rocket-p');

var indexPageView = Rocket.PageView.extend({

    init: function (options) {
        this.$el.html([
            '<h1>Hello, I\'m index page</h1>'
            , '<button type="button" id="myButton" data-loading-text="Loading..." class="btn btn-primary" autocomplete="off">'
            ,       'Loading state'
            , '</button>'
        ].join(''));          

        this.$loadingBtn = this.$('#myButton');
    }

    , registerEvents: function () {
        var me = this;

        me.$loadingBtn.on('click', function () {
            var $btn = $(me.$loadingBtn.get(0));
            $btn.button('loading');
            setTimeout( function () {
                $btn.button('reset');
            }, 1000 );
        });
    }

});

Rocket.Router.registerViewClass(
    'index'
    , indexPageView 
);

Rocket.Router.routes['index'] = '_defaultHandler:index';
Rocket.Router.routes[''] = '_defaultHandler:index';

    
});
