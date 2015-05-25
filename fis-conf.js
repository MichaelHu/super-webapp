fis.config.set('project.include', [
    /bower_components\/.+\/dist[^.]+\.(css|js)/
    , 'src/pages/*'
    , /src\/[^\/]+/
]);

fis.config.set('project.exclude', [
    /node_modules/
    , /grunt/i
    , /bower_components.*\/(src|test)/
    , /output/
]);



fis.config.set('roadmap.path', [

    {
        reg: /\/_[^\/]*?$/i,
        release: false
    },

    {
        reg: /^\/src\/bower_components\/dist\/(.*\.js)$/i,
        release: '$&'
    }
]);
