module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dist: {
				options: {
				    style: 'compressed'
				},
				files: {
					'css/main.css' : 'src/sass/main.scss'
				}
			}
		},
		shell: {
			makeViews: {
				command: 'python src/buildTemplates.py js/templates.js',
				options: {
                			stdout: true,
				}
			}	
		},
		watch: {
			css: {
				files: ['src/sass/*.scss','src/sass/templates/*.scss'],
				tasks: ['sass']
			},
			views: {
				files: 'src/templates/*.html',
				tasks: ['shell:makeViews']
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-shell');
	grunt.registerTask('default',['watch']);
}
