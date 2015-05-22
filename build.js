({
    baseUrl: './src'
    , dir: './dist'
    , modules: [
        {
            name: 'main'
            , exclude: [ 'rocket-p' ]
        }
        , {
            name: 'rocket-p'
            , out: './bower_components/rocket-p/dist/rocket-p'
        }
    ]
    , optimize: 'none'
    , skipDirOptimize: true
    , removeCombined: true
    // , fileExclusionRegExp: /src/


    // Avoid duplicating config content into build.js
    , mainConfigFile: './src/main.js'

    // , paths: {
    //     'zepto': './bower_components/zepto-amd/dist/zepto'
    //     , 'jquery': './bower_components/jquery/dist/jquery'
    //     , 'bootstrap': './bower_components/bootstrap/dist/js/bootstrap'
    //     , 'underscore': './bower_components/underscore/underscore'
    //     , 'rocket-p': './bower_components/rocket-p/dist/rocket-p'
    //     , 'main': 'main'
    // }
    
    // , shim: {
    //     'bootstrap': {
    //         deps: ['jquery']
    //     }
    // }
    //

    , onModuleBundleComplete: function (data) {
        /*
        data.name: the bundle name.
        data.path: the bundle path relative to the output directory.
        data.included: an array of items included in the build bundle.
        If a file path, it is relative to the output directory. Loader
        plugin IDs are also included in this array, but depending
        on the plugin, may or may not have something inlined in the
        module bundle.
        */
    }
})
