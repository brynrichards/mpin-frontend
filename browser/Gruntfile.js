module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		settings: grunt.file.readJSON('settings.json'),
		sass: {
			dist: {
				options: {
				    style: 'compressed',
				    sourcemap: false
				},
				files: {
					'../build/out/browser/css/main.css' : '../build/tmp/browser/sass/main.scss'
				}
			}
		},
		bgShell: {
                	makeDirs: {
                                cmd: 'mkdir -p ../build/out/tmp/',
                                options: {
                                        stdout: true,
                                }
                        },
			makeViews: {
				cmd: 'handlebars ./src/views/<%= settings.templateName %>/*.handlebars -f ../build/out/tmp/templates.js',
				options: {
                			stdout: true,
				}
			},
			buildMPinAll: {
				cmd: 'python ../build/buildMPin.py ../libs/jslib ../build/mpin_deplist ../build/out/tmp/mpin-all.js',
 				options: {
                	stdout: true,
                }
			},
			copyHandlebarsRuntime: {
				cmd: 'cp -R ../libs/handlebars.runtime.min.js ../build/out/tmp/',
				options: {
	            	stdout: true,
				}
			},			
			replaceURLBASE: {
				cmd: "sed 's#%URL_BASE%#<%= settings.URLBase %>#' js/mpin.js > ../build/out/tmp/mpin.js",
				options: {
	            	stdout: true,
				}
			},			
			mkdirTmpSass: {
				cmd: "mkdir -p ../build/tmp/browser/sass",
				options: {
	            	stdout: true,
				}
			},			
			copyTmpSass: {
				cmd: "cp -r src/sass/* ../build/tmp/browser/sass/",
				options: {
	            	stdout: true,
				}
			},			
			replaceTemplateMain: {
				cmd: "sed 's/%templatename%/<%= settings.templateName %>/' src/sass/main.scss > ../build/tmp/browser/sass/main.scss",
				options: {
	            	stdout: true,
				}
			},			
			replaceTemplateTemplate: {
				cmd: "sed 's/%templatename%/<%= settings.templateName %>/' src/sass/templates/_<%= settings.templateName %>.scss > ../build/tmp/browser/sass/templates/_<%= settings.templateName %>.scss",
				options: {
	            	stdout: true,
				}
			},			
			buildMPin: {
				cmd: 'python ../build/buildMPin.py ../build/out/tmp ../build/browser_deplist ../build/out/browser/mpin.js',
 				options: {
                	stdout: true,
                }
			},
			copyResources: {
				cmd: 'cp -r images ../build/out/browser/',
				options: {
	            	stdout: true,
				}
			},			


		},
		watch: {
			css: {
				files: ['src/sass/*.scss','src/sass/templates/*.scss'],
				tasks: ['sass']
			},
			views: {
				files: 'src/views/*.html',
				tasks: ['bgShell:makeViews']
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
