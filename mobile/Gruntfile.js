module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		settings: grunt.file.readJSON('settings.json'),
		sass: {
			dist: {
				options: {
				    style: 'compressed'
				},
				files: {
					'../build/out/mobile/css/main.css' : '../build/out/mobile/sass/main.scss'
				}
			}
		},
		bgShell: {
			makeViews: {
				cmd: 'python ../build/buildTemplates.py ../build/out/mobile/js/templates.js',
				options: {
                			stdout: true,
				},
				done: function () {
				   grunt.task.run('uglify');
				 }
			},
			buildMPinAll: {
				cmd: 'cd js; ./buildMPin.sh > mpin-all.js',
 				options: {
                                        stdout: true,
                                }
			},
			copyResources: {
				cmd: 'cp -R resources/ ../build/out/mobile/resources/',
				options: {
                			stdout: true,
				}
			},
			copyUnderscoreJS: {
				cmd: 'cp -R js/underscore-min.js ../build/out/mobile/js/',
				options: {
	            			stdout: true,
				}
			},
			copyUnderscoreJSMap: {
				cmd: 'cp -R js/underscore-min.map ../build/out/mobile/js/',
				options: {
	            			stdout: true,
				}
			},
			copySASS: {
				cmd: 'cp -R public/sass/ ../build/out/mobile/sass/',
				options: {
	            			stdout: true,
				},
				done: function () {
				   grunt.task.run('replace');
				 }
			}
		},
		watch: {
			resourceFiles: {
				files: ['public/sass/*.scss','public/views/*.html'],
				tasks: ['bgShell', 'sass']
			}
		},
		uglify: {
			static_mappings: {
				// Static mappings of files to be minified
			  files: [
			    {src: 'js/mpin-all.js', dest: '../build/out/mobile/js/mpin-all.min.js'},
			    {src: '../build/out/mobile/js/templates.js', dest: '../build/out/mobile/js/templates.min.js'}
			  ],
			}
		},
		replace: {
		      dist: {
		        options: {
		          patterns: [
		            {
		              match: 'clientsetting',
		              replacement: '<%= settings.clientSettingsURL %>'
		            },
		            {
		              match: 'templatename',
		              replacement: '<%= settings.templateName %>'
		            },
		            {
		              match: 'emailregex',
		              replacement: '<%= settings.emailRegex %>'
		            },
		            {
		              match: 'timestamp',
		              replacement: '<%= grunt.template.today() %>'
		            }
		          ]
		        },
		        files: [
		          {expand: true, flatten: true, src: ['index.html'], dest: '../build/out/mobile/'},
		          {expand: true, flatten: true, src: ['mpin.appcache'], dest: '../build/out/mobile/'},
		          {expand: true, flatten: true, src: ['public/sass/main.scss'], dest: '../build/out/mobile/sass/'},
		          {expand: true, flatten: true, src: ['public/sass/templates/*.scss'], dest: '../build/out/mobile/sass/templates/'},
		          {expand: true, flatten: true, src: ['js/main.js'], dest: '../build/out/mobile/js/'},
		        ]
		      }
		    }
	});
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-bg-shell');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-replace');
	grunt.registerTask('default',['watch']);
	grunt.registerTask('build',  ['bgShell', 'sass']);
}
