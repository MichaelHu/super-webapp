define([
        'require'
        , 'rocket-p'
        , 'bootstrap'
        , 'text!./pages/index/html/index.html'
        , 'text!./pages/index/data/index.json'
        , 'css!./pages/index/css/index.css'
    ], function (require, Rocket, B, html, data) {

var $ = require('zepto');

var indexPageView = Rocket.PageView.extend({

    init: function (options) {
        var me = this;

        me.$el.html(html);
        me.$('.row')
            .html(
                _.template(
                    me.$('#index_list_tpl').html()
                ) 
                (
                    // JSON.parse(data)
                    {
                        data: JSON.parse(data).data
                    }
                )
            );


    }

    , events: {
        'click li': 'onclick'
    }

    , registerEvents: function () {
        var me = this;
    }

    , onclick: function (e) {
        this.navigate($(e.currentTarget).data('url'));
    }

});

Rocket.Router.registerViewClass(
    'index'
    , indexPageView 
);

return indexPageView;
    
});
