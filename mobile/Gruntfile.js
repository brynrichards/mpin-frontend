module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dist: {
				options: {
				    style: 'compressed'
				},
				files: {
					'../build/out/mobile/css/main.css' : '../public/sass/main.scss'
				}
			}
		},
		shell: {
			makeViews: {
				command: 'python ../build/buildTemplates.py ../build/out/mobile/js/templates.js',
				options: {
                			stdout: true,
				}
			}
		},
		watch: {
			css: {
				files: '../public/sass/*.scss',
				tasks: ['sass']
			},
			views: {
				files: '../public/views/*.html',
				tasks: ['shell:makeViews']
			}
		},
		uglify: {
			static_mappings: {
				// Static mappings of files to be minified
			  files: [
			    {src: 'js/main.js', dest: '../build/out/mobile/js/<%= pkg.name %>.min.js'},			    
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
		              replacement: '<%= pkg.clientSettingsURL %>'
		            },
		            {
		              match: 'templatename',
		              replacement: '<%= pkg.templateName %>'
		            },
		            {
		              match: 'emailregex',
		              replacement: '<%= pkg.emailRegex %>'
		            }
		          ]
		        },
		        files: [
		          {expand: true, flatten: true, src: ['index.html'], dest: '../build/out/mobile/'}
		        ]
		      }
		    }
	});
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-replace');
	grunt.registerTask('default',['watch', 'uglify']);
	grunt.registerTask('build',  ['uglify', 'shell', 'replace']);

}
