define([
        'require'
        , 'rocket-p'
        , 'bootstrap'
        , 'react'
        , 'jsx'
        , 'text!./pages/react/html/react.html'
        , 'text!./pages/react/jsx/components.jsx'
        , 'markdown'
        , 'text!./pages/react/md/react.md'
        , 'css!./pages/react/css/react.css'
    ], function (require, Rocket, B, React, JSX, html, jsxTpl, markdown, mdText) {

var $ = require('zepto');

eval(JSX.transform(jsxTpl).code);

var reactPageView = Rocket.PageView.extend({

    init: function (options) {
        var me = this;

        me.$el.html(html);

        me.renderHello();
        me.renderTodo();
        me.renderMarkdown();
    }

    , className: 'react-pageview'

    , renderHello: function () {
        var me = this,
            jsCode = JSX.transform(
                'React.render(<HelloMessage name="John" />, this.$(".react-hello")[0]);'
            );   

        eval(jsCode.code);
    }

    , renderTodo: function () {
        var me = this,
            jsCode = JSX.transform(
                'React.render(<TodoApp />, this.$(".react-todo")[0]);'
            );   

        eval(jsCode.code);
    }

    , renderMarkdown: function () {
        var me = this;

        me.$('.md-container').html(
            markdown.toHTML( mdText)
        );
    }


    , registerEvents: function () {
        var me = this;
    }


});

Rocket.Router.registerViewClass(
    'react'
    , reactPageView 
);

return reactPageView;
    
});


