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
        , 'main': 'main'
    }
    , shim: {
        'bootstrap': {
            deps: ['jquery']
        }
    }
});


require([
        'rocket-p'
        , './pages/index/js/index_view'
        , './pages/css3demos/js/css3demos_view'
    ]
    , function(Rocket){


Rocket.Router.routes['*anything'] = '_defaultHandler:index';

function init(){

    var AppRouter = Rocket.Router.extend({

        // TB
        // , defaultPageTransition: 'flipTB'
        defaultPageTransition: 'slideTB'
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


init();



    }
);


})();

