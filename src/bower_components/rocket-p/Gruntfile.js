module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
        , uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'dist/<%= pkg.name %>.js'
                , dest: 'dist/<%= pkg.name %>.min.js'
            }
        }
        , concat: {
            options: {
                separator: grunt.util.linefeed + ';'
            },
            dist: {
                src: [
                    'src/amd-header.js'
                    , 'src/utils.js'
                    , 'src/class-extend.js'
                    , 'src/events.js'
                    , 'src/history.js'
                    , 'src/model.js'
                    , 'src/router.js'
                    , 'src/view.js'

                    , 'src/baseview.js'
                    , 'src/pageview.js'
                    , 'src/subview.js'
                    , 'src/globalview.js'
                    , 'src/subpageview.js'
                    , 'src/subpagemanager.js'

                    , 'src/animation.js'
                    , 'src/animation/simple.js'


                    , 'src/animation/slideLR.js'
                    , 'src/animation/slideTB.js'

                    , 'src/animation/slidefadeLR.js'
                    , 'src/animation/slidefadeTB.js'

                    , 'src/animation/fadeslideLR.js'
                    , 'src/animation/fadeslideTB.js'

                    , 'src/animation/slideeasingLR.js'
                    , 'src/animation/slideeasingTB.js'

                    , 'src/animation/slidescaleupLR.js'
                    , 'src/animation/slidescaleupTB.js'

                    , 'src/animation/scaledownslideLR.js'
                    , 'src/animation/scaledownslideTB.js'

                    , 'src/animation/flipLR.js'
                    , 'src/animation/flipTB.js'

                    , 'src/animation/scaledownscaleupdown.js'

                    , 'src/animation/scaledownupscaleup.js'

                    , 'src/animation/rotatefallscaleup.js'

                    , 'src/animation/rotatenewspaper.js'

                    , 'src/animation/rotateslide.js'

                    , 'src/animation/rotateslidedelay.js'

                    , 'src/animation/scaledowncenterscaleupcenter.js'

                    // @note: 3D may not work
                    , 'src/animation/rotateslideLR.js'
                    , 'src/animation/rotateslideTB.js'

                    , 'src/animation/rotatepushslideLR.js'
                    , 'src/animation/rotatepushslideTB.js'

                    , 'src/animation/rotateroomLR.js'
                    , 'src/animation/rotateroomTB.js'

                    , 'src/animation/rotatecubeLR.js'
                    , 'src/animation/rotatecubeTB.js'

                    , 'src/animation/rotatecarouselLR.js'
                    , 'src/animation/rotatecarouselTB.js'

                    , 'src/animation/rotatefoldmovefadeLR.js'
                    , 'src/animation/rotatefoldmovefadeTB.js'

                    , 'src/animation/movefaderotateunfoldLR.js'
                    , 'src/animation/movefaderotateunfoldTB.js'


                    , 'src/amd-footer.js'
                ]
                , dest: 'dist/<%= pkg.name %>.js'
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');


    grunt.registerTask('default', ['concat', 'uglify']);

};
