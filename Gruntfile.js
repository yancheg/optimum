module.exports = function(grunt) {

    var config = {
        app: 'app',
        dist: 'dist',
        host: 'optimum.dev'
    };

    //Auto load required tasks
    require('jit-grunt')(grunt);

    // Project configuration.
    grunt.initConfig({

        config: config,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            scripts: {
                files: ['<%= config.app %>/scripts/{,*/}*.js'],
                tasks: ['jshint'],
                options: {
                    debounceDelay: 250
                }
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            styles: {
                files: ['<%= config.app %>/styles/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'postcss']
            }
        },
        browserSync: {
            options: {
                notify: false,
                background: true
            },
            livereload: {
                options: {
                    files: [
                        '<%= config.app %>/{,*/}*.html',
                        '.tmp/styles/{,*/}*.css',
                        '.tmp/scripts/{,*/}*.js'
                    ],
                    port: 9000,
                    server: {
                        baseDir: ['.tmp', config.app],
                        routes: {
                            '/bower_components': './bower_components'
                        }
                    }
                }
            },
            dist: {
                options: {
                    background: false,
                    server: '<%= config.dist %>'
                }
            }
        },
        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            target: [
                '<%= config.app %>/scripts/{,*/}*.js',
                '!<%= config.app %>/scripts/vendor/*'
            ]
        },
        wiredep: {

            task: {

                // Point to the files that should be updated when
                // you run `grunt wiredep`
                src: [
                    'app/index.html'
                ],

                options: {
                    // See wiredep's configuration documentation for the options
                    // you may pass:

                    // https://github.com/taptapship/wiredep#configuration
                }
            }
        },
        // Run localhost server
        connect: {
            server: {
                options: {
                    port: 9000,
                    hostname: config.host,
                    baseDir: ['app']
                }
            }
        },
        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= config.dist %>/*',
                        '!<%= config.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
    });

    grunt.registerTask('default', ['wiredep']);

    grunt.registerTask('serve', 'start the server and preview your app', function (target) {

        if (target === 'dist') {
            return grunt.task.run(['build', 'browserSync:dist']);
        }

        grunt.task.run([
            'clean:server',
            'wiredep',
            'browserSync:livereload',
            'watch'
        ]);
    });
};