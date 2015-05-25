define([
        'require'
        , 'jquery'
        , 'bootstrap'
        , 'rocket-p'
        , 'text!./pages/index/html/index.html'
        , 'css!./bower_components/bootstrap/dist/css/bootstrap.min.css'
        , 'css!./bower_components/bootstrap/dist/css/bootstrap-theme.min.css'
    ], function (require, $, B, Rocket, html) {

var indexPageView = Rocket.PageView.extend({

    init: function (options) {
        this.$el.html(html);
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

return indexPageView;
    
});
