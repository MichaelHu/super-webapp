(function(){

require.config({
    baseUrl: '.'
    , waitSeconds: 0 // disable timeout check

    , paths: {
        'zepto': './bower_components/zepto-amd/dist/zepto'
        , 'jquery': './bower_components/jquery/dist/jquery'
        , 'bootstrap': './bower_components/bootstrap/dist/js/bootstrap'
        , 'underscore': './bower_components/underscore/underscore'
        , 'rocket-p': './bower_components/rocket-p/dist/rocket-p'
        , 'markdown': './lib/markdown/markdown'

        , 'zrender': './lib/zrender/zrender'
        , 'zrender/shape/Circle': './lib/zrender/zrender'
        , 'zrender/shape/Rose': './lib/zrender/zrender'

        , 'index_pageview': './pages/index/js/index_view'
        , 'css3demos_pageview': './pages/css3demos/js/css3demos_view'
        , 'webworker_pageview': './pages/webworker/js/webworker_view'
        , 'zrender_pageview': './pages/zrender/js/zrender_view'
        , 'magic_animation_pageview': './pages/magic_animation/js/magic_animation_view'

        , 'main': 'main'
    }
    , map: {
        '*': {
            'css': './bower_components/require-css/css'
            , 'text': './bower_components/requirejs-text/text'
        }
    }
    , packages: [
        {
            name: 'zrender'
            , location: './lib/zrender'
            , main: 'zrender'
        }
    ]
    , shim: {
        'bootstrap': {
            deps: [
                'jquery'
                , 'css!./bower_components/bootstrap/dist/css/bootstrap.min.css'
                , 'css!./bower_components/bootstrap/dist/css/bootstrap-theme.min.css'
            ]
        }

        , 'markdown': {
            exports: 'markdown'
        }
    }
});


require([
        'rocket-p'
    ]
    , function(Rocket){

// CSS and TEXT plugins are avalable from now on
require(['bootstrap'], function(){

    require('zepto')('#main_nav').show();
    init();

});


function init(){

    var AppRouter = Rocket.Router.extend({

        routes: {
            'index': '_defaultHandler:index'
            , 'css3demos': '_defaultHandler:css3demos'
            , 'webworker': '_defaultHandler:webworker'
            , 'zrender': '_defaultHandler:zrender'
            , 'magic_animation': '_defaultHandler:magic_animation'
            , '*anything': '_defaultHandler:index'
        }

        // TB
        // , defaultPageTransition: 'flipTB'
        , defaultPageTransition: 'slideTB'
        // , defaultPageTransition: 'slidefadeTB'
        // , defaultPageTransition: 'rotatecubeTB'
        // , defaultPageTransition: 'scaledownupscaleup'


        // LR
        // , defaultPageTransition: 'rotateslide'
        // , defaultPageTransition: 'rotateslidedelay'

        // ALL
        // , defaultPageTransition: 'scaledowncenterscaleupcenter'
        // , defaultPageTransition: 'scaledownscaleupdown'
        // , defaultPageTransition: 'scaledownupscaleup'
        // , defaultPageTransition: 'rotatefallscaleup'
        // , defaultPageTransition: 'rotatenewspaper'


        // , defaultPageTransition: 'rotatecubeLR'
        // , defaultPageTransition: 'rotatecarouselLR'
        // , defaultPageTransition: 'slideLR'
        // , defaultPageTransition: 'movefaderotateunfoldTB'
        // , defaultPageTransition: 'rotatecarouselTB'
        // , defaultPageTransition: 'rotatepushslideTB'
        // , defaultPageTransition: 'rotateroomTB'
        // , defaultPageTransition: 'rotateslideTB'
        // , defaultPageTransition: 'scaledownslideTB'
        // , defaultPageTransition: 'slideeasingTB'
        // , defaultPageTransition: 'slidescaleupTB'

        // , defaultPageTransition: 'rotatefoldmovefadeTB'

    });

    var appRouter = new AppRouter();

    appRouter.start();
}




    }
);


})();

