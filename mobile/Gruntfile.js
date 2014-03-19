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
		}
	});
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-shell');
	grunt.registerTask('default',['watch']);
}
