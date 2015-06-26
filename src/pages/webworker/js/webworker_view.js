define([
        'require'
        , 'rocket-p'
        , 'bootstrap'
        , 'text!./pages/webworker/html/webworker.html'
        , 'markdown'
        , 'text!./pages/webworker/md/webworker.md'
        , 'css!./pages/webworker/css/webworker.css'
    ], function (require, Rocket, B, html, markdown, mdText) {

var $ = require('zepto');

var webworkerPageView = Rocket.PageView.extend({

    init: function (options) {
        var me = this;

        me.$el.html(html);

        me.$('.md-container').html(
            markdown.toHTML( mdText)
        );
    }

    , className: 'webworker-pageview'

    , events: {
        'click .btn': 'onclick'
    }

    , registerEvents: function () {
        var me = this;
    }

    , onclick: function (e) {
        var me = this;

        me.isBusy = !me.isBusy;

        me.isBusy && me.$('.btn').html('Pause Worker');
        !me.isBusy && me.$('.btn').html('Start Worker');

        // Stop
        if (!me.isBusy) {
            if ( me.worker ) { 
                me.worker.postMessage('pause');
            }
            return;
        }

        // Restart
        if (me.worker) {
            me.worker.postMessage('start');
            return;
        }

        // No me.worker, then 
        if( window.Worker ) {
            var lock = false;
            me.worker = new Worker('./pages/webworker/js/worker.js'),
            me.worker.addEventListener('message', function (event){
                if( lock ) return;
                lock = true;
                me.$('.prime-result output').html(event.data);
                setTimeout(function () { lock = false; }, 500);
            }, false);
        }
        else {
            me.$('.prime-result output').html('当前浏览器不支持WebWorker');
        }
    }

});

Rocket.Router.registerViewClass(
    'webworker'
    , webworkerPageView 
);

return webworkerPageView;
    
});

