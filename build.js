({
    baseUrl: './src'
    , dir: './dist'
    // , studModules: [ 'text', 'css' ]
    , modules: [
        {
            name: 'rocket-p'
            // Include requirejs plugins into rocket-p module
            , include: [
                // Use relative module IDs, then requirejs map 
                // config is no need to be modified 
                './bower_components/require-css/css'
                , './bower_components/requirejs-text/text'
                , 'zepto'
            ]
        }
        , {
            name: 'main'
            , exclude: [ 'rocket-p' ]
        }
        , {
            name: 'index_pageview'
            , exclude: [ 'rocket-p', 'bootstrap' ]
        }
    ]
    , optimize: 'none'
    , skipDirOptimize: true
    , removeCombined: true
    // , fileExclusionRegExp: /bower_components.*(src|test|examples|grunt|node_modules).*/


    // Avoid duplicating config content into build.js
    , mainConfigFile: './src/main.js'

})
